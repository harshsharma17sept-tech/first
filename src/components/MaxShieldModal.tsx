import React, { useState } from 'react';
import { motion } from 'motion/react';
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
      name: 'Monthly',
      price: '$4.99',
      period: '/ month',
      description: 'Standard month-to-month protection.'
    },
    {
      id: 'annual',
      name: 'Annual Pro',
      price: '$39.99',
      period: '/ year',
      badge: 'Save 33%',
      description: 'Comprehensive automated threat interception & zero-day feed.'
    },
    {
      id: 'lifetime',
      name: 'Lifetime License',
      price: '$89.99',
      period: 'one-time',
      description: 'Permanent workstation license and priority AI queue.'
    }
  ];

  const features = [
    'Continuous background SMS & link interception',
    'Unlimited deep AI scam detection model queries',
    'Private link sandboxing & DNS safety validation',
    'Instant threat summary & exportable assessment reports',
    'Priority updates to new fraud signatures and deceptive patterns'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-[#FFFFFF] border-2 border-[#EC783B] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EC783B]" />

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] text-[#767676] hover:text-[#0E0E0E] transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEEE6] border border-[#F6AB83] text-xs font-bold text-[#EC783B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MaxShield Pro Security</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E0E0E] tracking-tight">
            Professional Threat Defense
          </h2>
          <p className="text-xs text-[#4A4A4A] max-w-sm mx-auto">
            Upgrade your security workstation with automated zero-day detection and continuous AI intelligence.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-3 gap-2 my-4">
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.id;
            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`relative cursor-pointer p-3 rounded-xl border-2 transition-all text-center flex flex-col justify-between select-none ${
                  isSelected
                    ? 'border-[#EC783B] bg-[#FDEEE6]/50 shadow-xs'
                    : 'border-[#D7D7D7] hover:border-[#BEBEBE] bg-[#F6F6F6]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EC783B] text-black">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <div className="text-xs text-[#767676] font-bold">
                    {plan.name}
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#0E0E0E] mt-1">
                    {plan.price}
                  </div>
                </div>
                <div className="text-[10px] text-[#767676] mt-1 font-medium">
                  {plan.period}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature List */}
        <div className="bg-[#F6F6F6] border border-[#D7D7D7] rounded-xl p-4 my-4 space-y-2">
          <div className="text-xs text-[#767676] uppercase font-bold tracking-wider mb-1">
            Included Protection Capabilities:
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onActivatePro(selectedPlan)}
          className="w-full py-3 rounded-xl bg-[#EC783B] hover:bg-[#D9662B] text-black font-extrabold text-xs tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {isCurrentPro ? 'Renew or Modify Plan' : 'Activate 7-Day Free Trial'}
          </span>
        </motion.button>

        <div className="text-center text-[11px] text-[#767676] mt-2.5">
          Cancel anytime • Encrypted 256-bit simulated billing • Sandbox active
        </div>
      </motion.div>
    </div>
  );
};
