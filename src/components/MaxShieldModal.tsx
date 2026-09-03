import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck, Zap, Lock, Star } from 'lucide-react';

interface MaxShieldModalProps {
  isCurrentPro: boolean;
  onClose: () => void;
  onActivatePro: (plan: string) => void;
}

export const MaxShieldModal: React.FC<MaxShieldModalProps> = ({
  isCurrentPro,
  onClose,
  onActivatePro
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');

  const plans = [
    {
      id: 'monthly',
      name: 'MONTHLY',
      price: '$4.99',
      period: '/ month',
      description: 'Standard month-to-month continuous surveillance.'
    },
    {
      id: 'annual',
      name: 'ANNUAL PRO',
      price: '$39.99',
      period: '/ year',
      badge: 'SAVE 33%',
      description: 'Full automated threat interception & zero-day feed.'
    },
    {
      id: 'lifetime',
      name: 'LIFETIME ACCESS',
      price: '$89.99',
      period: 'one-time',
      description: 'Permanent workstation license and API priority.'
    }
  ];

  const features = [
    'Continuous background SMS & Link interception',
    'Unlimited Gemini Neural Threat Model calls',
    'Zero-Trust link sandboxing & DNS reputation checks',
    'Instant threat telemetry & exportable PDF briefs',
    'Priority zero-day phishing signature feeds'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border-2 border-[#EC783B] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle orange accent gradient bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EC783B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] text-[#767676] hover:text-[#0E0E0E] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEEE6] border border-[#F6AB83] font-mono text-xs font-bold text-[#EC783B]">
            <Sparkles className="w-3.5 h-3.5" />
            MAXSHIELD PRO // CYBERLAB
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0E0E0E] tracking-tight uppercase">
            ENTERPRISE GRADE FRAUD DEFENSE
          </h2>
          <p className="text-xs text-[#4A4A4A] max-w-sm mx-auto">
            Upgrade your personal workstation to autonomous zero-day interception with continuous neural intelligence.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-3 gap-2 my-4">
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`relative cursor-pointer p-3 rounded-xl border-2 transition-all text-center flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#EC783B] bg-[#FDEEE6]/50 shadow-xs'
                    : 'border-[#D7D7D7] hover:border-[#BEBEBE] bg-[#F6F6F6]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 font-mono text-[9px] font-black px-1.5 py-0.2 rounded bg-[#EC783B] text-black">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <div className="font-mono text-[10px] text-[#767676] font-bold">
                    {plan.name}
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#0E0E0E] mt-1">
                    {plan.price}
                  </div>
                </div>
                <div className="font-mono text-[9px] text-[#767676] mt-1">
                  {plan.period}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature List */}
        <div className="bg-[#F6F6F6] border border-[#D7D7D7] rounded-xl p-4 my-4 space-y-2">
          <div className="font-mono text-[10px] text-[#767676] uppercase font-bold tracking-wider">
            INCLUDED SURVEILLANCE MODULES:
          </div>
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#1B1B1B]">
              <div className="w-4 h-4 rounded-full bg-[#E9F5ED] border border-[#A5D8B4] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-[#1B8A44] stroke-[3]" />
              </div>
              <span className="font-medium">{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onActivatePro(selectedPlan)}
          className="w-full py-3 rounded-xl bg-[#EC783B] hover:bg-[#D9662B] text-black font-extrabold font-mono text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {isCurrentPro ? 'RENEW / SWITCH PLAN' : 'ACTIVATE 7-DAY FREE TRIAL'}
          </span>
        </button>

        <div className="text-center font-mono text-[10px] text-[#767676] mt-2.5">
          Cancel anytime • Encrypted 256-bit simulated billing • Sandbox active
        </div>
      </div>
    </div>
  );
};
