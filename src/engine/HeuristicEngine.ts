import { RiskLevel, UrlAnalysis, HeuristicDetection, ScamAnalysisResult } from '../types';

export class HeuristicEngine {
  private static URL_REGEX = /(?:https?:\/\/|www\.)[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/gi;
  private static BARE_DOMAIN_REGEX = /\b[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.(?:com|org|net|xyz|top|info|biz|club|work|click|loan|live|tk|ml|ga|cf|gq|cc|ru|cn)(?:\/[^\s]*)?/gi;
  private static EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/gi;

  private static OTP_PATTERNS = [
    /\b(otp|one[ -]?time[ -]?password|verification[ -]?code|2fa|security[ -]?code)\b/i,
    /\b(send|share|reply with|provide)\b.*\b(otp|code|pin|password)\b/i
  ];

  private static BANKING_PATTERNS = [
    /\b(cvv|card number|atm pin|netbanking|bank login|password|passcode)\b/i,
    /\b(bank account|debit card|credit card|chase|wells fargo|bank of america|citi)\b.*\b(blocked|suspended|compromised|expire|unauthorized)\b/i
  ];

  private static URGENCY_PATTERNS = [
    /\b(urgent|immediately|act now|within 24 hours|within 2 hours|account blocked today|suspended today|final notice|critical alert)\b/i,
    /\b(legal action|arrest warrant|police complaint|court order)\b/i
  ];

  private static PRIZE_LOTTERY_PATTERNS = [
    /\b(you have won|congratulations! you won|cash prize|claim your reward|lottery|lucky winner)\b/i,
    /\b(claim\s+\$\d+|win\s+\$\d+|free gift card)\b/i
  ];

  private static SUSPICIOUS_ACTION_PATTERNS = [
    /\b(verify your account|update kyc|reactivate account|avoid penalty)\b/i,
    /\b(install anydesk|download teamviewer|install quicksupport|remote access)\b/i,
    /\b(unpaid parcel|delivery failed|customs fee|redelivery|usps package|fedex shipment|ups fee)\b/i
  ];

  private static GOVERNMENT_IMPERSONATION = [
    /\b(irs|internal revenue service|tax authority|unpaid tax|social security|arrest warrant|court subpoena|police warrant|law enforcement)\b/i
  ];

  private static PAYMENT_PATTERNS = [
    /\b(gift card|gift cards|itunes card|google play card|steam card|crypto|bitcoin|wire transfer|zelle transfer|western union)\b/i
  ];

  public static extractUrls(text: string): string[] {
    const urls: string[] = [];
    let match: RegExpExecArray | null;

    const urlRegex = new RegExp(this.URL_REGEX);
    while ((match = urlRegex.exec(text)) !== null) {
      if (!urls.includes(match[0])) urls.push(match[0]);
    }

    const domainRegex = new RegExp(this.BARE_DOMAIN_REGEX);
    while ((match = domainRegex.exec(text)) !== null) {
      const d = match[0];
      if (!urls.some(u => u.includes(d))) urls.push(d);
    }

    const emailRegex = new RegExp(this.EMAIL_REGEX);
    while ((match = emailRegex.exec(text)) !== null) {
      if (match[1] && !urls.some(u => u.includes(match[1]))) {
        urls.push(`https://${match[1]}`);
      }
    }

    return urls;
  }

  public static analyzeUrls(urls: string[]): UrlAnalysis[] {
    return urls.map(rawUrl => {
      const formatted = !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')
        ? `https://${rawUrl}`
        : rawUrl;

      let suspicious = false;
      const reasons: string[] = [];

      try {
        const parsed = new URL(formatted);
        const host = parsed.hostname.toLowerCase();

        // 1. IP check
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
          suspicious = true;
          reasons.push('Numeric IP host instead of domain name');
        }

        // 2. Shorteners
        const knownShorteners = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'rb.gy', 'shorturl.at'];
        if (knownShorteners.some(s => host.includes(s))) {
          suspicious = true;
          reasons.push('Obfuscated or shortened URL masking destination');
        }

        // 3. Risky TLDs
        const riskyTlds = ['.xyz', '.top', '.club', '.work', '.click', '.loan', '.racing', '.live', '.tk', '.ml', '.ga', '.cf', '.gq'];
        if (riskyTlds.some(tld => host.endsWith(tld))) {
          suspicious = true;
          reasons.push(`High-risk top level domain (${host.substring(host.lastIndexOf('.'))})`);
        }

        // 4. Excessive subdomains
        if (host.split('.').length > 4) {
          suspicious = true;
          reasons.push('Suspicious multi-layered subdomains mimicking authority');
        }

        // 5. Lookalike brand domains
        const brandNames = ['apple', 'google', 'microsoft', 'paypal', 'amazon', 'netflix', 'chase', 'wellsfargo', 'usps', 'fedex', 'dhl', 'binance'];
        for (const brand of brandNames) {
          if (host.includes(brand) && !host.endsWith(`${brand}.com`) && !host.endsWith(`${brand}.org`) && !host.endsWith(`${brand}.net`)) {
            suspicious = true;
            reasons.push(`Brand impersonation of '${brand}' in unverified domain '${host}'`);
          }
        }
      } catch {
        suspicious = true;
        reasons.push('Malformed or deceptive URL structure');
      }

      return {
        url: rawUrl,
        suspicious,
        reason: reasons.length > 0 ? reasons.join('; ') : 'Legitimate structural indicators'
      };
    });
  }

  public static runDetections(text: string): HeuristicDetection[] {
    const detections: HeuristicDetection[] = [];

    if (this.OTP_PATTERNS.some(p => p.test(text))) {
      detections.push({
        triggerName: 'OTP / Security Code Request',
        description: 'Message attempts to solicit one-time verification passcode or 2FA credentials.',
        severityPoints: 45
      });
    }

    if (this.BANKING_PATTERNS.some(p => p.test(text))) {
      detections.push({
        triggerName: 'Financial / Banking Lure',
        description: 'References banking credentials, card compromise, or account suspension.',
        severityPoints: 35
      });
    }

    if (this.URGENCY_PATTERNS.some(p => p.test(text))) {
      detections.push({
        triggerName: 'Psychological Artificial Urgency',
        description: 'Imposes extreme artificial time pressure or legal threats to prevent rational checking.',
        severityPoints: 25
      });
    }

    if (this.GOVERNMENT_IMPERSONATION.some(p => p.test(text))) {
      detections.push({
        triggerName: 'Authority / Government Impersonation',
        description: 'Pretends to represent tax authorities, law enforcement, or official regulators.',
        severityPoints: 40
      });
    }

    if (this.PRIZE_LOTTERY_PATTERNS.some(p => p.test(text))) {
      detections.push({
        triggerName: 'Advance Fee / Lottery Trap',
        description: 'Promises large unsolicited payouts, gift cards, or fake lottery winnings.',
        severityPoints: 30
      });
    }

    if (this.SUSPICIOUS_ACTION_PATTERNS.some(p => p.test(text))) {
      detections.push({
        triggerName: 'Coercive Action Demand',
        description: 'Demands credential re-verification, package fee payment, or remote software installation.',
        severityPoints: 25
      });
    }

    if (this.PAYMENT_PATTERNS.some(p => p.test(text))) {
      detections.push({
        triggerName: 'Untraceable Payment Channel',
        description: 'Requests payment or transfer via cryptocurrency, gift cards, or wire transfer.',
        severityPoints: 35
      });
    }

    return detections;
  }

  public static analyzeLocally(rawInput: string): ScamAnalysisResult {
    const sanitized = rawInput.trim();
    if (!sanitized) {
      throw new Error('Message cannot be empty.');
    }

    const detections = this.runDetections(sanitized);
    const extractedUrls = this.extractUrls(sanitized);
    const urlAnalyses = this.analyzeUrls(extractedUrls);

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

    const hasOtp = detections.some(d => d.triggerName.toLowerCase().includes('otp'));
    const hasBanking = detections.some(d => d.triggerName.toLowerCase().includes('banking') || d.triggerName.toLowerCase().includes('financial'));
    const hasSuspiciousUrl = urlAnalyses.some(u => u.suspicious);

    if (hasOtp || (hasBanking && hasSuspiciousUrl)) {
      heuristicScore = Math.max(heuristicScore, 85);
    } else if (detections.length === 0 && !hasSuspiciousUrl) {
      heuristicScore = Math.min(heuristicScore, 15);
    }

    const clampedScore = Math.min(Math.max(heuristicScore, 0), 100);

    let riskLevel: RiskLevel;
    if (clampedScore >= 90) riskLevel = 'CRITICAL';
    else if (clampedScore >= 70) riskLevel = 'HIGH';
    else if (clampedScore >= 30) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    let category = 'Standard Communication';
    if (hasOtp) category = 'Credential & OTP Phishing';
    else if (hasBanking) category = 'Banking & Financial Fraud';
    else if (hasSuspiciousUrl) category = 'Malicious / Deceptive Link';
    else if (detections.some(d => d.triggerName.includes('Government'))) category = 'Authority Impersonation';
    else if (detections.some(d => d.triggerName.includes('Lottery'))) category = 'Lottery & Advance Fee';
    else if (detections.length > 0) category = 'Social Engineering Solicitation';

    const redFlags: string[] = [];
    for (const d of detections) {
      redFlags.push(`${d.triggerName} (${d.description})`);
    }
    for (const u of urlAnalyses.filter(u => u.suspicious)) {
      redFlags.push(`Suspicious Link Detected: ${u.reason} (${u.url})`);
    }
    if (redFlags.length === 0) {
      redFlags.push('No obvious deceptive patterns, credential demands, or malicious indicators found.');
    }

    let recommendedAction = '';
    let summary = '';
    switch (riskLevel) {
      case 'CRITICAL':
        summary = 'Extremely high risk attack seeking security passcodes, financial credentials, or instant compliance.';
        recommendedAction = 'DO NOT click any link or send any OTP/passcode. Block sender and contact your institution directly.';
        break;
      case 'HIGH':
        summary = 'High probability of social engineering or deceptive phishing crafted to manipulate immediate action.';
        recommendedAction = 'Treat with extreme caution. Do not follow message instructions or provided numbers. Verify via official apps.';
        break;
      case 'MEDIUM':
        summary = 'Contains ambiguous triggers or unverified links warranting deliberate caution.';
        recommendedAction = 'Exercise caution. Do not share personal details without independently verifying sender identity.';
        break;
      case 'LOW':
        summary = 'Appears to be standard conversational or transactional text with no obvious scam indicators.';
        recommendedAction = 'No immediate threat flagged. Exercise standard baseline digital hygiene.';
        break;
    }

    const isFraud = clampedScore >= 50 || riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

    return {
      riskLevel,
      estimatedRiskScore: clampedScore,
      category,
      summary,
      redFlags: redFlags.slice(0, 7),
      recommendedAction,
      detectedUrls: urlAnalyses,
      heuristicSignals,
      isFraud,
      riskPercentageString: `${clampedScore}%`,
      verdictLabel: isFraud ? 'FRAUD DETECTED' : 'SAFE / VERIFIED'
    };
  }
}
