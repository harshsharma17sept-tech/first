import React from 'react';
import { ShieldAlert, Zap, Cpu, Sparkles, ChevronRight, Check } from 'lucide-react';

interface HeroProps {
  threatScannedCount: number;
  isPro: boolean;
  onUpgradeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  threatScannedCount,
  isPro,
  onUpgradeClick
}) => {
  return (
    <div className="space-y-3 mb-4">
      {/* Editorial Headline Hero Card */}
      <div className="relative overflow-hidden bg-[#F6F6F6] border border-[#D7D7D7] rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ECECEC] border border-[#D7D7D7] font-mono text-[11px] font-bold text-[#4A4A4A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC783B]"></span>
              SECURITY INTELLIGENCE SUITE
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0E0E0E] uppercase">
              THINK BEFORE YOU CLICK.
            </h1>
            <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium leading-relaxed">
              Real-time heuristic threat correlation and neural fraud detection across SMS messages, spoofed links, and spear-phishing emails.
            </p>
          </div>

          {/* Quick Engine Telemetry Badges */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] w-full md:w-auto shrink-0">
            <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-2.5 rounded-lg">
              <div className="text-[#767676] text-[10px] uppercase">Heuristics</div>
              <div className="text-[#1B8A44] font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" /> ARMED
              </div>
            </div>
            <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-2.5 rounded-lg">
              <div className="text-[#767676] text-[10px] uppercase">Phish Filter</div>
              <div className="text-[#1B8A44] font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" /> ACTIVE
              </div>
            </div>
            <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-2.5 rounded-lg col-span-2">
              <div className="text-[#767676] text-[10px] uppercase">Model Core</div>
              <div className="text-[#0E0E0E] font-bold flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-3.5 h-3.5 text-[#EC783B]" /> GEMINI NEURAL HYBRID
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Status & Upgrade Banner */}
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-lg bg-[#FDEEE6] border border-[#F6AB83] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#EC783B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-[#0E0E0E]">
                SURVEILLANCE METRICS
              </span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#ECECEC] text-[#1B1B1B] font-bold">
                {threatScannedCount} THREATS SCANNED
              </span>
            </div>
            <p className="text-[11px] text-[#767676] mt-0.5">
              Zero-day heuristics & credential extraction algorithms enabled.
            </p>
          </div>
        </div>

        {!isPro ? (
          <button
            onClick={onUpgradeClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#0E0E0E] hover:bg-[#2B2B2B] text-white font-bold text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>ACTIVATE MAXSHIELD PRO</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E9F5ED] border border-[#A5D8B4] text-[#1B8A44] font-mono text-xs font-bold">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            PRO PROTECTION ACTIVE
          </div>
        )}
      </div>
    </div>
  );
};
