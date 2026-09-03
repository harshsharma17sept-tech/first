import React from 'react';
import { ScamAnalysisResult } from '../types';
import { GitCommit, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TimelineProps {
  result: ScamAnalysisResult | null;
  onScanPrompt: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ result, onScanPrompt }) => {
  if (!result) {
    return (
      <div className="w-full bg-[#FFFFFF] border border-[#1B1B1B] p-10 rounded-sm mb-6 text-center shadow-sm">
        <Clock className="w-10 h-10 text-[#767676] mx-auto mb-3 opacity-50" />
        <h3 className="font-mono text-sm font-bold text-[#0E0E0E] uppercase mb-1">
          NO ACTIVE KILL-CHAIN TIMELINE
        </h3>
        <p className="text-xs text-[#767676] max-w-md mx-auto mb-4">
          Scan any inbound text or URL to reconstruct its execution lifecycle and psychological persuasion chain.
        </p>
        <button
          onClick={onScanPrompt}
          className="px-4 py-2 bg-[#EC783B] hover:bg-[#D25F24] text-white text-xs font-mono font-bold tracking-wider rounded-sm transition-colors"
        >
          START NEW ANALYSIS
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#1B1B1B] p-5 rounded-sm mb-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D7D7D7]">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#EC783B]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#0E0E0E]">
            KILL-CHAIN TIMELINE EXECUTION
          </span>
        </div>
        <div className="text-xs font-mono text-[#767676]">
          4 PHASES RECONSTRUCTED
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1B1B1B]">
        {result.killChain.map((phase, idx) => {
          const isHighRisk =
            phase.riskIndicator.includes('CRITICAL') ||
            phase.riskIndicator.includes('ACTIVE') ||
            phase.riskIndicator.includes('ELEVATED');

          return (
            <div key={idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-[#FFFFFF] ${
                  isHighRisk ? 'bg-[#D32F2F]' : 'bg-[#1B8A44]'
                }`}
              />

              {/* Phase Card */}
              <div className="bg-[#F6F6F6] border border-[#D7D7D7] hover:border-[#1B1B1B] p-4 rounded-sm transition-all shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-[#0E0E0E] text-white text-[10px] font-mono font-bold rounded-sm">
                      STAGE {phase.stage}
                    </span>
                    <h4 className="font-bold text-sm text-[#0E0E0E]">
                      {phase.title}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-sm border ${
                      isHighRisk
                        ? 'bg-[#FDEAEA] border-[#F5B7B1] text-[#D32F2F]'
                        : 'bg-[#E9F5ED] border-[#A3E4D7] text-[#1B8A44]'
                    }`}
                  >
                    {phase.riskIndicator}
                  </span>
                </div>

                <p className="text-xs text-[#767676] leading-relaxed font-mono">
                  {phase.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
