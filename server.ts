import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { HeuristicEngine } from './src/engine/HeuristicEngine';
import { RiskLevel, ScamAnalysisResult } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '2.6.4',
    service: 'ScamShield CyberLab Core',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

interface GeminiApiResponse {
  risk_level?: string;
  risk_score?: number;
  category?: string;
  summary?: string;
  red_flags?: string[];
  recommended_action?: string;
}

// Threat Analysis Endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { message, scannerMode = 'SMS' } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message content cannot be empty.' });
      return;
    }

    const sanitized = message.trim();

    // 1. Run deterministic Heuristics
    const detections = HeuristicEngine.runDetections(sanitized);
    const extractedUrls = HeuristicEngine.extractUrls(sanitized);
    const urlAnalyses = HeuristicEngine.analyzeUrls(extractedUrls);

    let heuristicScore = 0;
    const heuristicSignals: string[] = [];
    for (const d of detections) {
      heuristicScore += d.severityPoints;
      heuristicSignals.push(`${d.triggerName}: ${d.description}`);
    }

    if (urlAnalyses.some(u => u.suspicious)) {
      heuristicScore += 25;
      heuristicSignals.push('Suspicious Link: One or more URLs exhibit evasive, shortener, or spoofing traits.');
    }
    heuristicScore = Math.min(Math.max(heuristicScore, 0), 100);

    // 2. Query Gemini API if configured
    let aiResult: GeminiApiResponse | null = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const systemInstruction = `You are ScamShield AI, an expert cybersecurity fraud detection analyst.
Analyze the following message for scam risk, social engineering, impersonation, phishing, and credential harvesting.
Return ONLY a valid JSON object strictly matching this schema:
{
  "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "risk_score": 0 to 100,
  "category": "e.g. Banking Phishing, Smishing / Delivery Scam, Authority Impersonation, Lottery / Advance Fee, Credential Harvesting, Legitimate / Low Risk",
  "summary": "Brief 1-2 sentence objective technical evaluation of the threat.",
  "red_flags": ["concise technical point 1", "concise technical point 2", "concise technical point 3"],
  "recommended_action": "Clear, actionable safety defense advice for the user."
}
Do not include markdown codeblocks or explanation outside JSON.`;

        const userPrompt = `Vector: ${scannerMode}\nMessage Content:\n"""\n${sanitized}\n"""\nExtracted URLs: ${extractedUrls.join(', ') || 'None'}`;

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const clean = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            aiResult = JSON.parse(clean);
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to heuristic engine:', err);
      }
    }

    // 3. Calibrate & Fuse Heuristics + AI
    const aiScore = typeof aiResult?.risk_score === 'number' ? aiResult.risk_score : heuristicScore;
    let fusedScore = aiResult ? Math.round(heuristicScore * 0.4 + aiScore * 0.6) : heuristicScore;

    const hasOtp = detections.some(d => d.triggerName.toLowerCase().includes('otp'));
    const hasBanking = detections.some(d => d.triggerName.toLowerCase().includes('banking') || d.triggerName.toLowerCase().includes('financial'));
    const hasSuspiciousUrl = urlAnalyses.some(u => u.suspicious);

    if (hasOtp || (hasBanking && hasSuspiciousUrl)) {
      fusedScore = Math.max(fusedScore, 85);
    } else if (detections.length === 0 && !hasSuspiciousUrl && (aiResult?.risk_score ?? 0) < 30) {
      fusedScore = Math.min(fusedScore, 20);
    }
    fusedScore = Math.min(Math.max(fusedScore, 0), 100);

    let riskLevel: RiskLevel;
    if (fusedScore >= 90) riskLevel = 'CRITICAL';
    else if (fusedScore >= 70) riskLevel = 'HIGH';
    else if (fusedScore >= 30) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    let category = aiResult?.category || 'Standard Communication';
    if (!aiResult) {
      if (hasOtp) category = 'Credential & OTP Phishing';
      else if (hasBanking) category = 'Banking & Financial Fraud';
      else if (hasSuspiciousUrl) category = 'Malicious / Deceptive Link';
      else if (detections.some(d => d.triggerName.includes('Government'))) category = 'Authority Impersonation';
      else if (detections.some(d => d.triggerName.includes('Lottery'))) category = 'Lottery & Advance Fee';
      else if (detections.length > 0) category = 'Social Engineering Solicitation';
    }

    const redFlags: string[] = [];
    if (aiResult?.red_flags && Array.isArray(aiResult.red_flags)) {
      redFlags.push(...aiResult.red_flags);
    }
    for (const d of detections) {
      const summaryText = `${d.triggerName} (${d.description})`;
      if (!redFlags.some(f => f.toLowerCase().includes(d.triggerName.toLowerCase()))) {
        redFlags.push(summaryText);
      }
    }
    for (const u of urlAnalyses.filter(u => u.suspicious)) {
      redFlags.push(`Suspicious Link Detected: ${u.reason} (${u.url})`);
    }
    if (redFlags.length === 0) {
      redFlags.push('No obvious deceptive lures, spoofed domains, or credential harvesters detected.');
    }

    let recommendedAction = aiResult?.recommended_action || '';
    if (!recommendedAction) {
      switch (riskLevel) {
        case 'CRITICAL':
          recommendedAction = 'DO NOT click any link or send any OTP/passcode. Block sender and report directly to official authorities.';
          break;
        case 'HIGH':
          recommendedAction = 'Treat with high caution. Do not use contact links/numbers within the message. Verify via official app.';
          break;
        case 'MEDIUM':
          recommendedAction = 'Exercise caution. Do not disclose personal or account details without independent verification.';
          break;
        case 'LOW':
          recommendedAction = 'No immediate threat flagged. Exercise standard baseline digital vigilance.';
          break;
      }
    }

    let summary = aiResult?.summary || '';
    if (!summary) {
      switch (riskLevel) {
        case 'CRITICAL':
          summary = 'Extremely high risk attack seeking security passcodes, financial credentials, or instant compliance.';
          break;
        case 'HIGH':
          summary = 'High probability of social engineering or deceptive phishing crafted to manipulate immediate action.';
          break;
        case 'MEDIUM':
          summary = 'Contains ambiguous triggers or unverified links warranting deliberate caution.';
          break;
        case 'LOW':
          summary = 'Appears to be standard conversational or transactional text with no obvious scam indicators.';
          break;
      }
    }

    const isFraud = fusedScore >= 50 || riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

    const result: ScamAnalysisResult = {
      riskLevel,
      estimatedRiskScore: fusedScore,
      category,
      summary,
      redFlags: redFlags.slice(0, 7),
      recommendedAction,
      detectedUrls: urlAnalyses,
      heuristicSignals,
      isFraud,
      riskPercentageString: `${fusedScore}%`,
      verdictLabel: isFraud ? 'FRAUD DETECTED' : 'SAFE / VERIFIED'
    };

    res.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error?.message || 'Threat analysis failed' });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Dynamic Vite middleware for dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[ScamShield] Server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
