import React, { useState } from 'react';
import { ScamAnalysisResult } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Copy, Check, ExternalLink, Link2, Terminal } from 'lucide-react';

interface ResultOverviewProps {
  result: ScamAnalysisResult;
  onActionFeedback: (msg: string) => void;
}

export const ResultOverview: React.FC<ResultOverviewProps> = ({
  result,
  onActionFeedback
}) => {
  const [copied, setCopied] = useState(false);

  const getThemeStyles = () => {
    switch (result.riskLevel) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bg: 'bg-[#FDEAEA]',
          border: 'border-[#F5AAAA]',
          badgeBg: 'bg-[#D32F2F]',
          badgeText: 'text-white',
          accentText: 'text-[#D32F2F]',
          barColor: 'bg-[#D32F2F]'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-[#FDEEE6]',
          border: 'border-[#F6AB83]',
          badgeBg: 'bg-[#EC783B]',
          badgeText: 'text-black',
          accentText: 'text-[#EC783B]',
          barColor: 'bg-[#EC783B]'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-[#E9F5ED]',
          border: 'border-[#A5D8B4]',
          badgeBg: 'bg-[#1B8A44]',
          badgeText: 'text-white',
          accentText: 'text-[#1B8A44]',
          barColor: 'bg-[#1B8A44]'
        };
    }
  };

  const theme = getThemeStyles();

  const handleCopyReport = () => {
    const report = `[SCAMSHIELD THREAT ASSESSMENT REPORT]
VERDICT: ${result.verdictLabel} (${result.riskLevel} - ${result.riskPercentageString})
CATEGORY: ${result.category}
SUMMARY: ${result.summary}
RECOMMENDED DEFENSE: ${result.recommendedAction}
RED FLAGS:
${result.redFlags.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}
INSPECTED URLS: ${result.detectedUrls.map(u => `${u.url} (${u.suspicious ? 'SUSPICIOUS' : 'CLEARED'})`).join(', ') || 'None'}
DATE: ${new Date().toISOString()}
ENGINE: HYBRID GEMINI 3.6 NEURAL + HEURISTIC CORE`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    onActionFeedback('Full technical report copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 mb-6 animate-in fade-in duration-300">
      {/* Primary Verdict Assessment Banner */}
      <div className={`p-5 sm:p-6 rounded-xl border-2 ${theme.bg} ${theme.border} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-black tracking-wider uppercase ${theme.badgeBg} ${theme.badgeText}`}>
                {result.isFraud ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                {result.verdictLabel}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/80 border border-black/10 font-bold text-[#1B1B1B]">
                {result.riskLevel} RISK // {result.category.toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0E0E0E] tracking-tight">
              {result.isFraud
                ? 'High Probability Malicious Vector Detected'
                : 'Message Cleared Standard Security Baseline'}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium max-w-2xl leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Threat Index Gauge */}
          <div className="bg-white/90 border border-black/10 rounded-xl p-4 min-w-[200px] shrink-0">
            <div className="flex items-center justify-between font-mono text-xs text-[#767676] mb-1">
              <span>THREAT INDEX</span>
              <span className="font-extrabold text-[#0E0E0E]">{result.riskPercentageString}</span>
            </div>
            <div className="w-full bg-[#ECECEC] h-3 rounded-full overflow-hidden border border-[#D7D7D7]">
              <div
                className={`h-full ${theme.barColor} transition-all duration-500 rounded-full`}
                style={{ width: `${result.estimatedRiskScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#767676] mt-1.5">
              <span>0% (SAFE)</span>
              <span>100% (CRITICAL)</span>
            </div>

            <button
              onClick={handleCopyReport}
              className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#F6F6F6] hover:bg-[#ECECEC] border border-[#D7D7D7] font-mono text-xs font-bold text-[#1B1B1B] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#1B8A44]" /> : <Copy className="w-3 h-3 text-[#767676]" />}
              <span>{copied ? 'REPORT COPIED' : 'COPY REPORT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Brief: Executive Assessment & Recommended Defense */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Executive Summary */}
        <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#767676] uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>EXECUTIVE TECHNICAL BRIEF</span>
          </div>
          <p className="text-xs sm:text-sm text-[#1B1B1B] leading-relaxed">
            {result.summary}
          </p>
          <div className="mt-3 pt-3 border-t border-[#ECECEC] flex items-center justify-between text-[11px] font-mono text-[#767676]">
            <span>CATEGORY ATTRIBUTION:</span>
            <span className="font-bold text-[#0E0E0E]">{result.category}</span>
          </div>
        </div>

        {/* Recommended Defense Action */}
        <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#767676] uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>RECOMMENDED DEFENSE ACTION</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#0E0E0E] leading-relaxed">
            {result.recommendedAction}
          </p>
          <div className="mt-3 pt-3 border-t border-[#ECECEC] flex items-center gap-2">
            <button
              onClick={() => onActionFeedback('Security alert dispatched to device')}
              className="flex-1 py-1.5 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] font-mono text-xs font-bold text-[#1B1B1B] transition-colors text-center"
            >
              LOG PROTOCOL
            </button>
            <button
              onClick={() => onActionFeedback('Sender origin blocked')}
              className="flex-1 py-1.5 rounded-lg bg-[#FDEEE6] hover:bg-[#FCD8C7] border border-[#F6AB83] font-mono text-xs font-bold text-[#EC783B] transition-colors text-center"
            >
              BLOCK SENDER
            </button>
          </div>
        </div>
      </div>

      {/* Flagged Red Flags / Risk Factors Matrix */}
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#767676] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>THREAT SIGNAL MATRIX & HEURISTIC RED FLAGS</span>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ECECEC] text-[#1B1B1B] font-bold">
            {result.redFlags.length} SIGNALS
          </span>
        </div>

        <div className="space-y-2">
          {result.redFlags.map((flag, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F6F6] border border-[#ECECEC] hover:border-[#D7D7D7] transition-colors"
            >
              <span className="font-mono text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-[#ECECEC] text-[#4A4A4A] shrink-0 mt-0.5">
                FLAG #{String(idx + 1).padStart(2, '0')}
              </span>
              <p className="text-xs font-medium text-[#1B1B1B] leading-relaxed flex-1">
                {flag}
              </p>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDEEE6] text-[#EC783B] border border-[#F6AB83] shrink-0">
                {result.isFraud ? `+${Math.max(15, 35 - idx * 5)} PTS` : 'CLEARED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspected Links & Domains Breakdown */}
      {result.detectedUrls.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#767676] uppercase tracking-wider mb-3">
            <Link2 className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>INSPECTED URLS & HOST DECEPTION ANALYSIS</span>
          </div>

          <div className="space-y-2.5">
            {result.detectedUrls.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#F6F6F6] border border-[#D7D7D7] space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#0E0E0E] break-all">
                    {item.url}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      item.suspicious
                        ? 'bg-[#FDEAEA] text-[#D32F2F] border border-[#F5AAAA]'
                        : 'bg-[#E9F5ED] text-[#1B8A44] border border-[#A5D8B4]'
                    }`}
                  >
                    {item.suspicious ? (
                      <>
                        <AlertTriangle className="w-3 h-3" /> FLAGGED EVASIVE
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED STRUCTURE
                      </>
                    )}
                  </span>
                </div>
                <div className="text-xs text-[#4A4A4A] font-mono bg-white p-2 rounded border border-[#ECECEC]">
                  <span className="text-[#767676]">DIAGNOSTIC: </span>
                  {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Engine Attribution */}
      <div className="p-3 rounded-xl bg-[#ECECEC] border border-[#D7D7D7] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-[#767676]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1B8A44]"></span>
          <span>ENGINE: HYBRID GEMINI NEURAL + HEURISTIC CORE</span>
        </div>
        <span>ASSESSMENT COMPLETE // ZERO-TRUST ACTIVE</span>
      </div>
    </div>
  );
};
