import React from 'react';
import { Search, Cpu, FileCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Scan',
      description: 'Paste a message, link, number or upload a file.',
      icon: Search
    },
    {
      step: '02',
      title: 'Analyze',
      description: 'Our AI scans it in real-time using multiple engines.',
      icon: Cpu
    },
    {
      step: '03',
      title: 'Get Results',
      description: 'See risk level with detailed explanation.',
      icon: FileCheck
    },
    {
      step: '04',
      title: 'Stay Safe',
      description: 'Take action and prevent potential threats.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-[#07080A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
              HOW IT WORKS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            Simple. Fast. Effective.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 font-normal">
            Get complete protection in just a few steps.
          </p>
        </div>

        {/* 4-Step Horizontal Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={item.step} className="relative flex flex-col">
                <div className="p-6 rounded-2xl bg-[#0B0D11] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between h-full text-left shadow-lg">
                  <div>
                    {/* Top Row: Icon & Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#141820] border border-white/10 flex items-center justify-center text-[#22c55e]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white mb-1.5 tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector on desktop between cards */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#07080A] border border-white/15 items-center justify-center text-neutral-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
