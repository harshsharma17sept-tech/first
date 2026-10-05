import React from 'react';
import { ArrowRight, Play, Shield } from 'lucide-react';
import { HeroThreatVisualization } from './HeroThreatVisualization';

interface HeroProps {
  onScanClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScanClick,
  onHowItWorksClick
}) => {
  return (
    <section id="hero" className="relative pt-24 pb-14 sm:pt-32 sm:pb-16 overflow-hidden">
      {/* Background subtle radial ambient */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#22c55e]/[0.025] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 45/55 Asymmetric Split: Left = Content, Right = Autonomous Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (45% / 5 cols) */}
          <div className="lg:col-span-5 flex flex-col text-left">
            {/* Small label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 w-fit mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
                REAL-TIME SCAM PROTECTION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] mb-5">
              BE ONE STEP <br />
              AHEAD OF <br />
              <span className="text-[#22c55e]">SCAMS.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-lg mb-8">
              Detect fraudulent messages, links, calls and files before they become a problem. Autonomous intelligence engineered for practical fraud protection.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-9">
              <button
                onClick={onScanClick}
                className="px-6 py-3.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-xs tracking-wider font-mono transition-all duration-150 flex items-center gap-2 shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:shadow-[0_0_35px_rgba(34,197,94,0.35)] cursor-pointer group"
              >
                <span>Scan Something</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="px-5 py-3.5 rounded-xl bg-[#0D0E12] hover:bg-[#14171E] border border-white/15 hover:border-white/25 text-neutral-200 hover:text-white font-medium text-xs font-mono tracking-wide transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-2 h-2 fill-current text-white translate-x-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-neutral-400 font-medium font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Real-time analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Privacy first</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Free to use</span>
              </div>
            </div>
          </div>

          {/* Right Column (55% / 7 cols): Autonomous Threat-Analysis System */}
          <div className="lg:col-span-7 w-full">
            <HeroThreatVisualization
              onScanClick={onScanClick}
              onHowItWorksClick={onHowItWorksClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
