import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Globe,
  Mail,
  Phone,
  Upload,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  RotateCcw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { HeuristicEngine } from '../engine/HeuristicEngine';
import { ScamAnalysisResult, HeuristicStrictness } from '../types';

export type ScannerTab = 'SMS' | 'URL' | 'EMAIL' | 'PHONE' | 'FILE';

interface PresetItem {
  label: string;
  tab: ScannerTab;
  content: string;
}

const PRESETS: PresetItem[] = [
  {
    label: 'USPS Delivery Fee',
    tab: 'SMS',
    content: 'USPS Notice: Your parcel #940011189956 is delayed due to an incomplete address. Pay $1.99 redelivery fee within 12h at https://tracking-usps-verify.xyz/update'
  },
  {
    label: 'Chase Security Phishing',
    tab: 'SMS',
    content: 'CHASE ALERT: Unusual login detected from Houston, TX. To prevent permanent account suspension, verify your SSN and card at http://192.168.1.104/chase-auth'
  },
  {
    label: 'Remote Job Deposit Scam',
    tab: 'EMAIL',
    content: 'Google Hiring Team: You have been accepted for remote data entry ($48/hr). We will mail you a $2,500 check. Wire $350 via Zelle to our vendor for workspace hardware.'
  },
  {
    label: 'Crypto Airdrop Bot',
    tab: 'URL',
    content: 'https://claim-airdrop-ethereum-rewards.tk/connect-wallet?ref=vip'
  },
  {
    label: 'IRS Arrest Warrant Robocall',
    tab: 'PHONE',
    content: '+1 (800) 542-8921 - Automated message: An arrest warrant has been filed under your SSN by the IRS. Press 1 to speak with an officer or face legal custody.'
  }
];

export const QuickScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScannerTab>('SMS');
  const [inputValue, setInputValue] = useState<string>('');
  const [strictness, setStrictness] = useState<HeuristicStrictness>('MEDIUM');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const tabs = [
    { id: 'SMS' as const, label: 'SMS MESSAGE', icon: MessageSquare },
    { id: 'URL' as const, label: 'WEB LINK', icon: Globe },
    { id: 'EMAIL' as const, label: 'EMAIL', icon: Mail },
    { id: 'PHONE' as const, label: 'PHONE NUMBER', icon: Phone },
    { id: 'FILE' as const, label: 'UPLOAD FILE', icon: Upload }
  ];

  const handleAnalyze = () => {
    if (!inputValue.trim()) return;

    setIsScanning(true);
    setResult(null);

    // Realistic scanning delay for deep heuristic evaluation
    setTimeout(() => {
      const mode = activeTab === 'PHONE' ? 'SMS' : activeTab === 'FILE' ? 'EMAIL' : activeTab;
      const res = HeuristicEngine.analyzeLocally(inputValue.trim(), strictness);
      setResult(res);
      setIsScanning(false);
    }, 750);
  };

  const handleApplyPreset = (preset: PresetItem) => {
    setActiveTab(preset.tab);
    setInputValue(preset.content);
    setResult(null);
  };

  const handleClear = () => {
    setInputValue('');
    setResult(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const text = `ScamShield Threat Assessment:
Target: ${inputValue}
Verdict: ${result.verdictLabel} (${result.estimatedRiskScore}% Risk)
Category: ${result.category}
Summary: ${result.summary}
Guidance: ${result.recommendedAction}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quick-scan" className="relative py-20 bg-[#07080A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
              INSTANT FRAUD ANALYZER
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            VERIFY BEFORE YOU CLICK OR REPLY.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
            Check suspicious messages, links, phone numbers and files before taking action.
          </p>
        </div>

        {/* Practical Workstation Interface */}
        <div className="bg-[#0C0D11] border border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl">
          {/* Tabs header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setResult(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-white text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Strictness selector ("Balanced" mode) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#07080A] border border-white/10 text-xs text-neutral-400 font-mono">
              <SlidersHorizontal className="w-3 h-3 text-[#22c55e]" />
              <span className="hidden sm:inline">Detection:</span>
              <select
                value={strictness}
                onChange={e => setStrictness(e.target.value as HeuristicStrictness)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                <option value="MEDIUM" className="bg-[#0D0E12] text-white">Balanced</option>
                <option value="HIGH" className="bg-[#0D0E12] text-white">Strict</option>
                <option value="LOW" className="bg-[#0D0E12] text-white">Permissive</option>
              </select>
            </div>
          </div>

          {/* Preset Attack Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 text-xs border-b border-white/[0.05] scrollbar-none">
            <span className="text-[11px] font-mono text-neutral-400 uppercase shrink-0">
              Try Sample:
            </span>
            {PRESETS.map(preset => (
              <button
                key={preset.label}
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-neutral-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Large Input Area */}
          <div className="relative mt-4">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={
                activeTab === 'SMS'
                  ? 'Paste suspicious text message, verification alert, or sender text...'
                  : activeTab === 'URL'
                  ? 'Paste suspicious website URL, shortened link, or payment domain...'
                  : activeTab === 'EMAIL'
                  ? 'Paste full email body, subject line, or sender address...'
                  : activeTab === 'PHONE'
                  ? 'Enter phone number with country/area code (e.g. +1 800-412-9844)...'
                  : 'Drag & drop suspicious .pdf, .eml, or invoice document here, or paste raw text...'
              }
              rows={4}
              className="w-full p-4 rounded-2xl bg-[#07080A] border border-white/10 focus:border-[#22c55e]/60 text-white placeholder-neutral-400 text-sm font-mono leading-relaxed outline-none transition-colors resize-none"
            />

            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-white/5 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Multi-engine heuristic evaluation • Zero data stored</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!inputValue.trim() || isScanning}
              className={`px-7 py-3 rounded-xl font-bold font-mono text-xs tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                !inputValue.trim() || isScanning
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-[#22c55e] hover:bg-[#16a34a] text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]'
              }`}
            >
              {isScanning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>ANALYZING SIGNALS...</span>
                </>
              ) : (
                <>
                  <span>ANALYZE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Result Output Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div
                  className={`p-5 rounded-2xl border text-left flex flex-col gap-4 ${
                    result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH'
                      ? 'bg-[#180D0E] border-[#EF4444]/40'
                      : result.riskLevel === 'MEDIUM'
                      ? 'bg-[#161208] border-[#F59E0B]/40'
                      : 'bg-[#0D1611] border-[#22c55e]/40'
                  }`}
                >
                  {/* Result Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          result.isFraud ? 'bg-[#EF4444] text-white' : 'bg-[#22c55e] text-black'
                        }`}
                      >
                        {result.isFraud ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : (
                          <ShieldCheck className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-white tracking-tight">
                            {result.verdictLabel}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                              result.isFraud
                                ? 'bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30'
                                : 'bg-[#22c55e]/20 text-[#4ADE80] border border-[#22c55e]/30'
                            }`}
                          >
                            {result.riskLevel} RISK
                          </span>
                        </div>
                        <span className="text-xs text-neutral-400 font-mono">
                          Category: {result.category}
                        </span>
                      </div>
                    </div>

                    {/* Risk Score & Actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-mono font-black text-white">
                          {result.estimatedRiskScore}%
                        </span>
                        <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                          Threat Score
                        </span>
                      </div>

                      <button
                        onClick={handleCopyReport}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                        title="Copy threat report"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary & Red Flags */}
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-xs text-neutral-300 leading-relaxed font-mono">
                    <p className="font-semibold text-white mb-2">{result.summary}</p>

                    {result.redFlags.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                          Key Risk Signals Detected:
                        </span>
                        {result.redFlags.map((flag, i) => (
                          <div key={i} className="flex items-start gap-2 text-neutral-300">
                            <span className="text-[#EF4444] mt-0.5">✕</span>
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recommended Action */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#22c55e] shrink-0" />
                      <span className="text-neutral-200 font-medium">
                        <strong>Action Guidance:</strong> {result.recommendedAction}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
