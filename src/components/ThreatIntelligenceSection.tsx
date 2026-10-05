import React from 'react';
import { ArrowRight, Shield, Radio, Activity } from 'lucide-react';
import { AutonomousThreatSystem } from './ThreatVisualization/AutonomousThreatSystem';

interface ThreatIntelligenceSectionProps {
  onExploreMore?: () => void;
}

export const ThreatIntelligenceSection: React.FC<ThreatIntelligenceSectionProps> = ({
  onExploreMore
}) => {
  return (
    <section id="threat-intelligence" className="relative py-20 bg-[#07080A] overflow-hidden border-t border-white/[0.06]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#22c55e]/[0.025] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
                THREAT INTELLIGENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              FROM NOISE <br />
              TO <span className="text-[#22c55e]">INSIGHT.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
              Our AI analyzes millions of data points — messages, links, phone numbers, and files — to detect threats in real time and give you clear, actionable results.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onExploreMore}
              className="px-5 py-3 rounded-xl bg-[#0D0F14] hover:bg-[#15181F] border border-white/15 hover:border-white/25 text-white font-mono text-xs font-semibold tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Explore Threat Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22c55e]" />
            </button>
          </div>
        </div>

        {/* Central Autonomous Particle Threat Visualization */}
        <div className="w-full">
          <AutonomousThreatSystem />
        </div>
      </div>
    </section>
  );
};
