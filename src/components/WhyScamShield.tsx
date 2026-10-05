import React from 'react';
import { Cpu, ShieldCheck, HeartHandshake, Users, Zap, Layers } from 'lucide-react';

export const WhyScamShield: React.FC = () => {
  const benefits = [
    {
      title: 'AI-Powered Detection',
      description: 'Multi-engine analysis for higher accuracy.',
      icon: Cpu
    },
    {
      title: 'Privacy First',
      description: 'Your data is never stored, retained, or shared.',
      icon: ShieldCheck
    },
    {
      title: 'Always Free',
      description: 'Essential threat detection tools available for everyone.',
      icon: HeartHandshake
    },
    {
      title: 'Trusted by Thousands',
      description: 'Join 100,000+ users staying safe from digital fraud.',
      icon: Users
    },
    {
      title: 'Real-Time Protection',
      description: 'Instant zero-day detection before threats cause damage.',
      icon: Zap
    },
    {
      title: 'Broad Coverage',
      description: 'Unified heuristics across SMS, Links, Calls, QR and Files.',
      icon: Layers
    }
  ];

  return (
    <section id="why-scamshield" className="relative py-20 bg-[#07080A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
                WHY CHOOSE SCAMSHIELD
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Built for a Safer <br />
              <span className="text-[#22c55e]">Digital World.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-md">
              Advanced technology. Real protection. Complete privacy. Designed by cybersecurity engineers to shield you against modern attack vectors.
            </p>
          </div>

          {/* Right Column: 2-Column Benefits Grid matching reference image */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map(b => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="p-5 rounded-2xl bg-[#0B0D11] border border-white/[0.08] hover:border-white/20 transition-all text-left flex items-start gap-4 shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#141820] border border-white/10 flex items-center justify-center text-[#22c55e] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-tight mb-1">
                      {b.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
