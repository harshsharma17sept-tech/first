import React from 'react';
import { Shield, Sparkles, Terminal, Activity, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  isPro: boolean;
  onScanNow: () => void;
  onOpenPro: () => void;
  onShowInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPro,
  onScanNow,
  onOpenPro,
  onShowInfo
}) => {
  return (
    <header className="w-full bg-[#F6F6F6] border border-[#D7D7D7] rounded-xl p-3 sm:p-4 shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Telemetry Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EC783B] flex items-center justify-center text-black font-extrabold shadow-sm">
              <Shield className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0E0E0E]">
                  SCAMSHIELD
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#ECECEC] text-[#4A4A4A] border border-[#D7D7D7]">
                  LAB
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B8A44] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B8A44]"></span>
                </span>
                <span className="font-mono text-[10px] text-[#767676] font-medium tracking-wider">
                  SYS_VER: 2.6.4 // ACTIVE-SHIELD
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onShowInfo}
            className="sm:hidden p-2 rounded-lg bg-[#ECECEC] border border-[#D7D7D7] text-[#4A4A4A] hover:text-black"
            title="System Info"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        {/* Status Pills & Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onShowInfo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] border border-[#D7D7D7] text-[#4A4A4A] font-mono text-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-[#1B8A44]" />
            <span>NEURAL CORE</span>
          </button>

          <button
            onClick={onOpenPro}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all border ${
              isPro
                ? 'bg-[#E9F5ED] text-[#1B8A44] border-[#A5D8B4]'
                : 'bg-[#FDEEE6] text-[#EC783B] border-[#F6AB83] hover:bg-[#FCD8C7]'
            }`}
          >
            {isPro ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8A44]" />
                <span>MAXSHIELD PRO</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#EC783B]" />
                <span>UPGRADE PRO</span>
              </>
            )}
          </button>

          <button
            onClick={onScanNow}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#EC783B] hover:bg-[#D9662B] text-black font-extrabold text-xs shadow-sm transition-colors uppercase tracking-wider"
          >
            SCAN NOW
          </button>
        </div>
      </div>
    </header>
  );
};
