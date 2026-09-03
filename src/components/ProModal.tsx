import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onActivatePro: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onActivatePro
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg(true);
      onActivatePro();
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border-2 border-[#1B1B1B] w-full max-w-xl rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0E0E0E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-3.5 h-3.5 bg-[#EC783B]" />
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              MAXSHIELD PRO // CYBERLAB TIER
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#767676] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-2xl font-black text-[#0E0E0E] tracking-tight mb-2">
              UNCOMPROMISED THREAT SHIELDING
            </h3>
            <p className="text-xs text-[#767676] font-medium leading-relaxed">
              Activate real-time heuristic surveillance, continuous URL sandbox detonation, and priority Gemini neural reasoning.
            </p>
          </div>

          {/* Pricing Tier Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3 border rounded-sm cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-[#EC783B] bg-[#FDF4EE] ring-1 ring-[#EC783B]'
                  : 'border-[#D7D7D7] bg-[#F6F6F6] hover:border-[#1B1B1B]'
              }`}
            >
              <div className="text-[10px] font-mono text-[#767676] uppercase mb-1">
                MONTHLY
              </div>
              <div className="text-xl font-bold font-mono text-[#0E0E0E] mb-1">
                $4.99
              </div>
              <div className="text-[10px] text-[#767676]">Billed monthly</div>
            </div>

            {/* Annual */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`p-3 border rounded-sm cursor-pointer transition-all relative ${
                selectedPlan === 'annual'
                  ? 'border-[#EC783B] bg-[#FDF4EE] ring-1 ring-[#EC783B]'
                  : 'border-[#D7D7D7] bg-[#F6F6F6] hover:border-[#1B1B1B]'
              }`}
            >
              <div className="absolute -top-2 right-2 bg-[#EC783B] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-sm">
                SAVE 33%
              </div>
              <div className="text-[10px] font-mono text-[#767676] uppercase mb-1">
                ANNUAL
              </div>
              <div className="text-xl font-bold font-mono text-[#0E0E0E] mb-1">
                $39.99
              </div>
              <div className="text-[10px] text-[#767676]">$3.33/mo billed yearly</div>
            </div>

            {/* Lifetime */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`p-3 border rounded-sm cursor-pointer transition-all ${
                selectedPlan === 'lifetime'
                  ? 'border-[#EC783B] bg-[#FDF4EE] ring-1 ring-[#EC783B]'
                  : 'border-[#D7D7D7] bg-[#F6F6F6] hover:border-[#1B1B1B]'
              }`}
            >
              <div className="text-[10px] font-mono text-[#767676] uppercase mb-1">
                LIFETIME
              </div>
              <div className="text-xl font-bold font-mono text-[#0E0E0E] mb-1">
                $89.99
              </div>
              <div className="text-[10px] text-[#767676]">One-time access</div>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-4 rounded-sm mb-6 space-y-2.5">
            <div className="flex items-center space-x-2.5 text-xs text-[#0E0E0E] font-mono">
              <Check className="w-4 h-4 text-[#1B8A44] flex-shrink-0" />
              <span>Continuous Heuristic Interception & Background Monitoring</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-[#0E0E0E] font-mono">
              <Check className="w-4 h-4 text-[#1B8A44] flex-shrink-0" />
              <span>Unlimited Gemini 2.5 Neural Deep Reasoning Scans</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-[#0E0E0E] font-mono">
              <Check className="w-4 h-4 text-[#1B8A44] flex-shrink-0" />
              <span>Zero-Trust Deceptive Domain Quarantine Sandbox</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-[#0E0E0E] font-mono">
              <Check className="w-4 h-4 text-[#1B8A44] flex-shrink-0" />
              <span>Instant Threat Intelligence Feed & Exportable PDF Audits</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleActivate}
            disabled={isProcessing || isPro}
            className={`w-full py-3 text-xs font-mono font-bold tracking-wider rounded-sm uppercase transition-all flex items-center justify-center space-x-2 shadow-sm ${
              isPro
                ? 'bg-[#E9F5ED] text-[#1B8A44] border border-[#A3E4D7] cursor-default'
                : 'bg-[#EC783B] hover:bg-[#D25F24] text-white'
            }`}
          >
            {successMsg ? (
              <>
                <Check className="w-4 h-4" />
                <span>PRO LICENSE ACTIVATED // THANK YOU</span>
              </>
            ) : isProcessing ? (
              <span>PROVISIONING LICENSE...</span>
            ) : isPro ? (
              <span>MAXSHIELD PRO IS ALREADY ACTIVE</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>START 7-DAY FREE TRIAL // THEN {selectedPlan.toUpperCase()}</span>
              </>
            )}
          </button>

          <div className="text-center text-[10px] font-mono text-[#767676] mt-3">
            Secure simulation. No recurring charges during evaluation window. Cancel anytime.
          </div>
        </div>
      </div>
    </div>
  );
};
