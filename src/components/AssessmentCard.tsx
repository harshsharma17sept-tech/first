import React from 'react';
import { ScamAnalysisResult, RiskLevel } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Copy,
  Cpu,
  Check
} from 'lucide-react';

interface AssessmentCardProps {
  result: ScamAnalysisResult;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bg: '#FDEAEA',
          border: '#F5B7B1',
          text: '#D32F2F',
          icon: AlertTriangle,
          badgeBg: '#D32F2F'
        };
      case 'MEDIUM':
        return {
          bg: '#FFF3E0',
          border: '#FFE0B2',
          text: '#E65100',
          icon: AlertCircle,
          badgeBg: '#E65100'
        };
      case 'LOW':
      default:
        return {
          bg: '#E9F5ED',
          border: '#A3E4D7',
          text: '#1B8A44',
          icon: CheckCircle2,
          badgeBg: '#1B8A44'
        };
    }
  };

  const styles = getRiskStyles(result.riskLevel);
  const IconComponent = styles.icon;

  const handleCopyReport = () => {
    const report = `[SCAMSHIELD THREAT REPORT]
Verdict: ${result.verdictLabel}
Risk Score: ${result.estimatedRiskScore}% (${result.riskLevel})
Summary: ${result.threatSummary}
Action: ${result.recommendation}
Detections: ${result.heuristicDetections.map(d => d.triggerName).join(', ')}
Engine: ${result.engineUsed}
Timestamp: ${new Date(result.timestamp).toISOString()}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#1B1B1B] p-5 rounded-sm mb-6 shadow-sm">
      {/* Top Threat Banner */}
      <div
        className="p-4 rounded-sm border mb-5 flex flex-wrap items-center justify-between gap-4"
        style={{ backgroundColor: styles.bg, borderColor: styles.border }}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="p-2 rounded-sm text-white"
            style={{ backgroundColor: styles.badgeBg }}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div
              className="text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: styles.text }}
            >
              {result.verdictLabel}
            </div>
            <div className="text-sm font-semibold text-[#0E0E0E] mt-0.5">
              {result.isFraud
                ? 'Malicious intent verified with elevated confidence'
                : 'Zero high-confidence threat signatures identified'}
            </div>
          </div>
        </div>

        {/* Risk Score Pill */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-[#767676]">THREAT INDEX</div>
            <div
              className="text-2xl font-black font-mono leading-none"
              style={{ color: styles.text }}
            >
              {result.estimatedRiskScore}%
            </div>
          </div>
          <button
            onClick={handleCopyReport}
            className="px-2.5 py-2 bg-white border border-[#D7D7D7] hover:border-[#1B1B1B] text-xs font-mono text-[#0E0E0E] rounded-sm transition-colors flex items-center space-x-1"
            title="Copy Report"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1B8A44]" />
                <span className="text-[#1B8A44]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#767676]" />
                <span>REPORT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Threat Summary & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-4 rounded-sm">
          <div className="text-xs font-mono font-bold text-[#767676] mb-1.5 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>EXECUTIVE SUMMARY</span>
          </div>
          <p className="text-xs sm:text-sm text-[#0E0E0E] leading-relaxed">
            {result.threatSummary}
          </p>
        </div>

        <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-4 rounded-sm">
          <div className="text-xs font-mono font-bold text-[#767676] mb-1.5 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>RECOMMENDED DEFENSE ACTION</span>
          </div>
          <p className="text-xs sm:text-sm text-[#0E0E0E] leading-relaxed font-semibold">
            {result.recommendation}
          </p>
        </div>
      </div>

      {/* Flagged Red Flags Matrix */}
      {result.heuristicDetections.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-mono font-bold text-[#0E0E0E] mb-3 flex items-center justify-between border-b border-[#D7D7D7] pb-1.5">
            <span>DETECTION MATRIX ({result.heuristicDetections.length} TRIGGERS ARMED)</span>
            <span className="text-[#767676] text-[11px]">WEIGHTED RISK</span>
          </div>
          <div className="space-y-2">
            {result.heuristicDetections.map((detection, idx) => (
              <div
                key={idx}
                className="bg-[#F6F6F6] border border-[#D7D7D7] p-3 rounded-sm flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="text-xs font-mono font-bold text-[#EC783B] pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#0E0E0E]">
                      {detection.triggerName}
                    </div>
                    <div className="text-xs text-[#767676] mt-0.5">
                      {detection.description}
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0.5 bg-[#FFFFFF] border border-[#1B1B1B] text-[11px] font-mono font-bold text-[#D32F2F] rounded-sm flex-shrink-0">
                  +{detection.severityPoints} PTS
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted URLs & Domains Inspection */}
      {result.extractedUrls.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-mono font-bold text-[#0E0E0E] mb-3 flex items-center space-x-2 border-b border-[#D7D7D7] pb-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>INSPECTED URLS & DOMAINS ({result.extractedUrls.length})</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-[#D7D7D7]">
              <thead className="bg-[#F6F6F6] border-b border-[#D7D7D7] text-[#767676]">
                <tr>
                  <th className="p-2.5">EXTRACTED TARGET</th>
                  <th className="p-2.5">RESOLVED HOST</th>
                  <th className="p-2.5">STATUS</th>
                  <th className="p-2.5">HEURISTIC TELEMETRY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7D7D7]">
                {result.extractedUrls.map((u, i) => (
                  <tr key={i} className="hover:bg-[#FDF4EE]">
                    <td className="p-2.5 font-bold text-[#0E0E0E] max-w-[200px] truncate" title={u.url}>
                      {u.url}
                    </td>
                    <td className="p-2.5 text-[#767676]">{u.domain}</td>
                    <td className="p-2.5">
                      {u.isSuspicious ? (
                        <span className="px-2 py-0.5 bg-[#FDEAEA] border border-[#F5B7B1] text-[#D32F2F] text-[10px] font-bold rounded-sm">
                          FLAGGED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#E9F5ED] border border-[#A3E4D7] text-[#1B8A44] text-[10px] font-bold rounded-sm">
                          CLEARED
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-xs text-[#767676]">{u.threatDetails}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Engine & Timestamp Footer */}
      <div className="pt-3 border-t border-[#D7D7D7] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#767676] gap-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-[#EC783B]" />
          <span>SECURITY ENGINE:</span>
          <span className="font-bold text-[#0E0E0E] bg-[#F6F6F6] px-1.5 py-0.5 border border-[#D7D7D7] rounded-sm">
            {result.engineUsed}
          </span>
        </div>
        <div>
          SCAN COMPLETED: {new Date(result.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
