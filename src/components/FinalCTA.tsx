import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface FinalCTAProps {
  onStartScanning: () => void;
  onLearnMore: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onStartScanning,
  onLearnMore
}) => {
  return (
    <section className="relative py-24 bg-[#07080A] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#22c55e]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
            PROACTIVE DEFENSE
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
          TAKE CONTROL. <br />
          <span className="text-[#22c55e]">STAY ONE STEP AHEAD.</span>
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-xl mx-auto mb-8">
          Check a suspicious message, link or file before it becomes a problem. Fast, free, and accessible for everyone.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartScanning}
            className="px-7 py-3.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs tracking-wider font-mono transition-all duration-150 flex items-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] cursor-pointer"
          >
            <span>START SCANNING</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLearnMore}
            className="px-6 py-3.5 rounded-xl bg-[#0D0E12] hover:bg-[#15181F] border border-white/15 hover:border-white/25 text-neutral-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all duration-150 cursor-pointer"
          >
            LEARN MORE
          </button>
        </div>
      </div>
    </section>
  );
};
