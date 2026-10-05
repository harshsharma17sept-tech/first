import React from 'react';
import { BarChart3, ShieldCheck, Users, Clock } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  const metrics = [
    {
      value: '500K+',
      label: 'Scans Performed',
      icon: BarChart3
    },
    {
      value: '98.7%',
      label: 'Threats Detected',
      icon: ShieldCheck
    },
    {
      value: '50K+',
      label: 'Users Protected',
      icon: Users
    },
    {
      value: '24/7',
      label: 'Real-time Updates',
      icon: Clock
    }
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-16">
      <div className="bg-[#0B0D11] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-4 ${
                  idx !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#07080A] border border-white/10 flex items-center justify-center text-[#22c55e] shrink-0 shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white font-mono">
                    {item.value}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium tracking-tight">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
