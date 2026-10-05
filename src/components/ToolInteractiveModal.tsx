import React, { useState } from 'react';
import {
  X,
  Phone,
  Image as ImageIcon,
  QrCode,
  FileText,
  Link2,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ToolInteractiveModalProps {
  toolId: string | null;
  onClose: () => void;
}

export const ToolInteractiveModal: React.FC<ToolInteractiveModalProps> = ({
  toolId,
  onClose
}) => {
  // Tool-specific states
  const [phoneNumber, setPhoneNumber] = useState('+1 (800) 412-9844');
  const [phoneResult, setPhoneResult] = useState<any>(null);

  const [qrUrl, setQrUrl] = useState('https://login-appleid-verify.me/auth?token=928');
  const [qrResult, setQrResult] = useState<any>(null);

  const [linkInput, setLinkInput] = useState('https://tracking-usps-verify.xyz/update');
  const [linkResult, setLinkResult] = useState<any>(null);

  const [fileName, setFileName] = useState('invoice_march_overdue.vbs');
  const [fileResult, setFileResult] = useState<any>(null);

  const [screenshotText, setScreenshotText] = useState('BANK OF AMERICA: Unusual card activity of $482.10 at TARGET. If this was not you, verify immediately at bofa-secure-resolve.info');
  const [screenshotResult, setScreenshotResult] = useState<any>(null);

  const [extensionActive, setExtensionActive] = useState(true);

  const [loading, setLoading] = useState(false);

  if (!toolId) return null;

  // Handlers for interactive simulations
  const handlePhoneLookup = () => {
    setLoading(true);
    setTimeout(() => {
      const isKnownSpam = phoneNumber.includes('800') || phoneNumber.includes('412');
      setPhoneResult({
        number: phoneNumber,
        carrier: 'VoIP Wholesale Solutions LLC (Bandwidth)',
        lineType: 'Virtual VoIP / Cloud PBX',
        spamScore: isKnownSpam ? 93 : 14,
        reportsCount: isKnownSpam ? 342 : 1,
        riskLevel: isKnownSpam ? 'CRITICAL RISK' : 'LOW RISK',
        tags: isKnownSpam ? ['Robocall Blast', 'Tech Support Impersonation', 'Spoofed Caller ID'] : ['Standard Cellular line'],
        verdict: isKnownSpam ? 'Flagged as High-Frequency Robocall Scam' : 'Number appears authentic'
      });
      setLoading(false);
    }, 600);
  };

  const handleQrInspect = () => {
    setLoading(true);
    setTimeout(() => {
      setQrResult({
        destinationUrl: qrUrl,
        protocol: 'HTTPS (Let’s Encrypt free cert)',
        domainAge: '3 days old',
        registrar: 'NameCheap Public Proxy',
        isQuishing: true,
        riskScore: 97,
        reasons: [
          'Domain registered less than 72 hours ago',
          'Impersonates Apple ID authentication portal',
          'Hosted on dynamic bulletproof server network'
        ],
        verdict: 'Malicious Quishing Vector Blocked'
      });
      setLoading(false);
    }, 600);
  };

  const handleLinkInspect = () => {
    setLoading(true);
    setTimeout(() => {
      const isSuspicious = linkInput.includes('xyz') || linkInput.includes('verify') || linkInput.includes('usps');
      setLinkResult({
        targetUrl: linkInput,
        domainAge: isSuspicious ? '18 hours old' : '12 years old',
        reputationScore: isSuspicious ? 96 : 2,
        tldRisk: isSuspicious ? 'High-Risk TLD (.xyz)' : 'Standard (.com/.org)',
        blacklistFlags: isSuspicious ? 4 : 0,
        verdict: isSuspicious ? 'Deceptive Phishing Domain' : 'Verified Legitimate Domain'
      });
      setLoading(false);
    }, 600);
  };

  const handleFileInspect = () => {
    setLoading(true);
    setTimeout(() => {
      setFileResult({
        fileName: fileName,
        fileSize: '42.8 KB',
        entropyScore: '7.82 / 8.0 (High Obfuscation)',
        embeddedMacros: true,
        hashSignature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verdict: 'Malicious Script / Trojan Dropper Detected'
      });
      setLoading(false);
    }, 600);
  };

  const handleScreenshotInspect = () => {
    setLoading(true);
    setTimeout(() => {
      setScreenshotResult({
        extractedText: screenshotText,
        detectedEntities: ['Bank of America', '$482.10', 'bofa-secure-resolve.info'],
        urgencyTriggers: ['Unusual card activity', 'verify immediately'],
        deceptiveDomain: 'bofa-secure-resolve.info (Non-authentic domain)',
        riskScore: 98,
        verdict: 'Fraudulent SMS Bank Phishing Detected'
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0D0E12] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================= */}
        {/* 1. Phone Number Lookup                                    */}
        {/* ========================================================= */}
        {toolId === 'phone-lookup' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Phone Number Lookup</h3>
                <p className="text-xs text-neutral-400 font-mono">Carrier metadata, VoIP spoofing check & spam reports</p>
              </div>
            </div>

            <div className="my-6">
              <label className="block text-xs font-mono text-neutral-300 mb-2">
                Phone Number (Include Country Code)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#07080A] border border-white/10 text-white font-mono text-sm outline-none focus:border-[#22c55e]"
                />
                <button
                  onClick={handlePhoneLookup}
                  className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs font-mono cursor-pointer"
                >
                  {loading ? 'Analyzing...' : 'Lookup'}
                </button>
              </div>
            </div>

            {phoneResult && (
              <div className="p-4 rounded-2xl bg-[#07080A] border border-white/10 flex flex-col gap-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-white font-bold">{phoneResult.number}</span>
                  <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30 font-bold">
                    {phoneResult.riskLevel} ({phoneResult.spamScore}%)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div><strong>Carrier:</strong> {phoneResult.carrier}</div>
                  <div><strong>Line Type:</strong> {phoneResult.lineType}</div>
                  <div><strong>Spam Reports:</strong> {phoneResult.reportsCount} user complaints</div>
                  <div><strong>Verdict:</strong> {phoneResult.verdict}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  {phoneResult.tags.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. QR Code Scanner (Quishing Protection)                  */}
        {/* ========================================================= */}
        {toolId === 'qr-scanner' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">QR Code Scanner (Anti-Quishing)</h3>
                <p className="text-xs text-neutral-400 font-mono">Inspect embedded QR payload safely before opening in browser</p>
              </div>
            </div>

            <div className="my-6">
              <label className="block text-xs font-mono text-neutral-300 mb-2">
                Decoded QR Target URL to Inspect
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrUrl}
                  onChange={e => setQrUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#07080A] border border-white/10 text-white font-mono text-sm outline-none focus:border-[#22c55e]"
                />
                <button
                  onClick={handleQrInspect}
                  className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs font-mono cursor-pointer"
                >
                  {loading ? 'Inspecting...' : 'Verify QR'}
                </button>
              </div>
            </div>

            {qrResult && (
              <div className="p-4 rounded-2xl bg-[#07080A] border border-[#EF4444]/30 flex flex-col gap-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[#F87171] font-bold">{qrResult.verdict}</span>
                  <span className="text-white font-bold">{qrResult.riskScore}% Threat Confidence</span>
                </div>
                <div className="flex flex-col gap-1 text-neutral-300">
                  <div><strong>Target:</strong> {qrResult.destinationUrl}</div>
                  <div><strong>Domain Age:</strong> {qrResult.domainAge}</div>
                  <div><strong>SSL Cert:</strong> {qrResult.protocol}</div>
                </div>
                <div className="mt-1 flex flex-col gap-1 text-[11px] text-[#F87171]">
                  {qrResult.reasons.map((r: string) => (
                    <div key={r}>• {r}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. Screenshot Analysis                                    */}
        {/* ========================================================= */}
        {toolId === 'screenshot-analysis' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Screenshot Analysis</h3>
                <p className="text-xs text-neutral-400 font-mono">OCR vision extraction for phishing screenshots and chat messages</p>
              </div>
            </div>

            <div className="my-6">
              <label className="block text-xs font-mono text-neutral-300 mb-2">
                Simulated OCR Extracted Text from Image
              </label>
              <textarea
                rows={3}
                value={screenshotText}
                onChange={e => setScreenshotText(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#07080A] border border-white/10 text-white font-mono text-xs outline-none focus:border-[#22c55e]"
              />
              <button
                onClick={handleScreenshotInspect}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs font-mono cursor-pointer"
              >
                {loading ? 'Analyzing...' : 'Run Vision OCR Check'}
              </button>
            </div>

            {screenshotResult && (
              <div className="p-4 rounded-2xl bg-[#07080A] border border-[#EF4444]/30 flex flex-col gap-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[#F87171] font-bold">{screenshotResult.verdict}</span>
                  <span className="text-white font-bold">{screenshotResult.riskScore}% Risk</span>
                </div>
                <div className="flex flex-col gap-1 text-neutral-300">
                  <div><strong>Identified Entity:</strong> {screenshotResult.detectedEntities.join(', ')}</div>
                  <div><strong>Deceptive Domain:</strong> {screenshotResult.deceptiveDomain}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. File & Email Scanner                                   */}
        {/* ========================================================= */}
        {toolId === 'file-scanner' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">File & Email Scanner</h3>
                <p className="text-xs text-neutral-400 font-mono">Sandbox analysis for suspicious attachments, macros & scripts</p>
              </div>
            </div>

            <div className="my-6">
              <label className="block text-xs font-mono text-neutral-300 mb-2">
                Filename or Attachment Under Test
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#07080A] border border-white/10 text-white font-mono text-sm outline-none focus:border-[#22c55e]"
                />
                <button
                  onClick={handleFileInspect}
                  className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs font-mono cursor-pointer"
                >
                  {loading ? 'Scanning...' : 'Scan File'}
                </button>
              </div>
            </div>

            {fileResult && (
              <div className="p-4 rounded-2xl bg-[#07080A] border border-[#EF4444]/30 flex flex-col gap-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[#F87171] font-bold">{fileResult.verdict}</span>
                  <span className="text-white font-bold">{fileResult.fileSize}</span>
                </div>
                <div className="flex flex-col gap-1 text-neutral-300">
                  <div><strong>Entropy:</strong> {fileResult.entropyScore}</div>
                  <div><strong>Macros:</strong> {fileResult.embeddedMacros ? 'Embedded VBA scripts detected' : 'None'}</div>
                  <div className="truncate"><strong>SHA-256:</strong> {fileResult.hashSignature}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. Link Reputation                                        */}
        {/* ========================================================= */}
        {toolId === 'link-reputation' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Link Reputation Engine</h3>
                <p className="text-xs text-neutral-400 font-mono">Zero-day phishing heuristics & threat database query</p>
              </div>
            </div>

            <div className="my-6">
              <label className="block text-xs font-mono text-neutral-300 mb-2">
                URL to Verify
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkInput}
                  onChange={e => setLinkInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#07080A] border border-white/10 text-white font-mono text-sm outline-none focus:border-[#22c55e]"
                />
                <button
                  onClick={handleLinkInspect}
                  className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs font-mono cursor-pointer"
                >
                  {loading ? 'Checking...' : 'Check Reputation'}
                </button>
              </div>
            </div>

            {linkResult && (
              <div className="p-4 rounded-2xl bg-[#07080A] border border-white/10 flex flex-col gap-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-white font-bold">{linkResult.verdict}</span>
                  <span className="text-[#22c55e] font-bold">{linkResult.reputationScore}% Risk</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div><strong>Domain Age:</strong> {linkResult.domainAge}</div>
                  <div><strong>TLD Class:</strong> {linkResult.tldRisk}</div>
                  <div><strong>Security Blacklists:</strong> {linkResult.blacklistFlags} matches</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. Browser Protection                                     */}
        {/* ========================================================= */}
        {toolId === 'browser-protection' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Browser Extension Protection</h3>
                <p className="text-xs text-neutral-400 font-mono">Passive zero-hour shield for Chrome, Brave & Edge</p>
              </div>
            </div>

            <div className="my-6 p-4 rounded-2xl bg-[#07080A] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Real-Time Threat Blocker</span>
                <span className="text-xs text-neutral-400 font-mono">Intercepts credential harvesters & drive-by downloads</span>
              </div>
              <button
                onClick={() => setExtensionActive(prev => !prev)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer ${
                  extensionActive ? 'bg-[#22c55e] text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {extensionActive ? 'PROTECTION ON' : 'DISABLED'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-mono text-neutral-300 leading-relaxed">
              <p className="text-white font-bold mb-2">Interception Telemetry (Simulated Demo):</p>
              <div>• 14 malicious form submissions blocked today</div>
              <div>• 3 crypto drainer wallet connectors terminated</div>
              <div>• Zero slowdown on page render latency (&lt; 2ms overhead)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
