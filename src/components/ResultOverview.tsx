import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScamAnalysisResult } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Copy, Check, Link2, FileText } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface ResultOverviewProps {
  result: ScamAnalysisResult;
  onActionFeedback: (msg: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 24,
      mass: 0.8
    }
  }
};

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
    triggerHaptic('light');
    const reportText = `[ScamShield Assessment Report]
Verdict: ${result.verdictLabel}
Risk Level: ${result.riskLevel} (${result.estimatedRiskScore}/100)
Category: ${result.category}
Summary: ${result.summary}
Action Required: ${result.recommendedAction}
Flagged Points:
${result.redFlags.map(f => `• ${f}`).join('\n')}
Extracted URLs:
${result.detectedUrls.map(u => `• ${u.url} (Suspicious: ${u.suspicious ? 'Yes' : 'No'})`).join('\n') || 'None'}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    triggerHaptic('success');
    onActionFeedback('Security report copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className="space-y-4 mb-6"
    >
      {/* 1. Primary Verdict Assessment Card */}
      <motion.div
        variants={itemVariants}
        className={`p-5 sm:p-6 rounded-2xl border-2 ${theme.bg} ${theme.border} shadow-xs`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase ${theme.badgeBg} ${theme.badgeText} shadow-xs`}>
                {result.isFraud ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {result.verdictLabel}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/90 border border-black/10 font-bold text-[#1B1B1B]">
                {result.riskLevel} Risk • {result.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0E0E0E] tracking-tight">
              {result.isFraud
                ? 'High Risk Scam / Phishing Indicator Detected'
                : 'Message Verified as Standard Communication'}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium max-w-2xl leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Threat Index Gauge */}
          <div className="bg-white/95 border border-black/10 rounded-2xl p-4 min-w-[210px] shrink-0 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#767676] mb-1 font-semibold">
              <span>Risk Score</span>
              <span className="font-extrabold text-[#0E0E0E] text-sm">{result.riskPercentageString}</span>
            </div>
            <div className="w-full bg-[#ECECEC] h-3 rounded-full overflow-hidden border border-[#D7D7D7]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.estimatedRiskScore}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full ${theme.barColor} rounded-full`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-[#767676] mt-1.5">
              <span>Low Risk (0%)</span>
              <span>Severe Risk (100%)</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCopyReport}
              className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F6F6F6] hover:bg-[#ECECEC] border border-[#D7D7D7] text-xs font-bold text-[#1B1B1B] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1B8A44]" /> : <Copy className="w-3.5 h-3.5 text-[#767676]" />}
              <span>{copied ? 'Report Copied' : 'Copy Assessment'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. 2-Column Summary Cards Grid (Staggered Children) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Technical Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#767676] uppercase tracking-wider mb-2.5">
              <FileText className="w-4 h-4 text-[#EC783B]" />
              <span>Assessment Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1B1B1B] font-medium leading-relaxed">
              {result.summary}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-center justify-between text-xs text-[#767676]">
            <span>Category Attribution:</span>
            <span className="font-bold text-[#0E0E0E]">{result.category}</span>
          </div>
        </motion.div>

        {/* Recommended Safe Action */}
        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#767676] uppercase tracking-wider mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#1B8A44]" />
              <span>Recommended Defense Action</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#0E0E0E] leading-relaxed">
              {result.recommendedAction}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-center justify-between text-xs text-[#767676]">
            <span>Security Posture:</span>
            <span className="font-bold text-[#1B8A44]">Zero-Trust Verification</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Detected Red Flags & Warning Indicators Card */}
      <motion.div
        variants={itemVariants}
        className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 shadow-xs"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#767676] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#EC783B]" />
            <span>Key Warning Indicators Identified ({result.redFlags.length})</span>
          </div>
          <span className="text-xs text-[#767676]">Behavioral & Structural Triggers</span>
        </div>

        <div className="space-y-2">
          {result.redFlags.map((flag, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7] text-xs font-medium text-[#1B1B1B]"
            >
              <div className="w-5 h-5 rounded-full bg-[#EC783B]/15 text-[#EC783B] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="leading-relaxed">{flag}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Extracted Links & Domain Inspection */}
      {result.detectedUrls.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#767676] uppercase tracking-wider">
              <Link2 className="w-4 h-4 text-[#EC783B]" />
              <span>Extracted Web Links & Domains ({result.detectedUrls.length})</span>
            </div>
            <span className="text-xs text-[#D32F2F] font-semibold">Do not open unverified links</span>
          </div>

          <div className="space-y-2.5">
            {result.detectedUrls.map((urlItem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.2 }}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs ${
                  urlItem.suspicious
                    ? 'bg-[#FDEAEA] border-[#F5AAAA]'
                    : 'bg-[#F6F6F6] border-[#D7D7D7]'
                }`}
              >
                <div className="space-y-1 overflow-hidden max-w-full">
                  <div className="font-semibold text-[#0E0E0E] break-all">
                    {urlItem.url}
                  </div>
                  <div className="text-[11px] text-[#767676]">
                    {urlItem.reason}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      urlItem.suspicious
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-[#E9F5ED] text-[#1B8A44]'
                    }`}
                  >
                    {urlItem.suspicious ? 'Flagged Malicious' : 'Standard Link'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
