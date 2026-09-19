import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Globe, Mail, Sparkles, Clipboard, Trash2, ArrowRight, ShieldCheck, Loader2, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { AttackPreset, HeuristicStrictness } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ScannerWorkstationProps {
  input: string;
  scannerMode: 'SMS' | 'URL' | 'EMAIL';
  isLoading: boolean;
  strictness: HeuristicStrictness;
  onInputChange: (val: string) => void;
  onModeChange: (mode: 'SMS' | 'URL' | 'EMAIL') => void;
  onStrictnessChange: (strictness: HeuristicStrictness) => void;
  onAnalyze: () => void;
  onClear: () => void;
  onSelectPreset: (preset: AttackPreset) => void;
}

export const PRESET_ATTACKS: AttackPreset[] = [
  {
    title: 'Bank Impersonation',
    tag: 'Banking Alert',
    mode: 'SMS',
    content: 'Chase Alert: An unusual withdrawal of $940.50 was detected on your debit card ending in 8912. If this was not you, verify immediately at: https://chase-security-verify.xyz/login to block this transaction.'
  },
  {
    title: 'Package Delivery Scam',
    tag: 'Delivery Notice',
    mode: 'SMS',
    content: 'USPS Notice: Your package US-892401-K cannot be dispatched due to an incomplete delivery address and an unpaid $1.99 redelivery fee. Resolve within 12 hours: http://192.168.1.105/usps/track'
  },
  {
    title: 'Tax Authority Threat',
    tag: 'Authority Threat',
    mode: 'EMAIL',
    content: 'Internal Revenue Service Notice: Immediate legal action and federal arrest warrant issued for outstanding taxes of $4,820.00. Reply with your SSN and settle via Apple Gift Card immediately.'
  },
  {
    title: 'Crypto Airdrop Trap',
    tag: 'Suspicious Domain',
    mode: 'URL',
    content: 'https://binance-airdrop-bonus2026.club/claim?ref=wallet_verify&key=88201'
  }
];

export const ScannerWorkstation: React.FC<ScannerWorkstationProps> = ({
  input,
  scannerMode,
  isLoading,
  strictness,
  onInputChange,
  onModeChange,
  onStrictnessChange,
  onAnalyze,
  onClear,
  onSelectPreset
}) => {
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [hasScrolledBelow, setHasScrolledBelow] = useState(false);

  // Monitor scroll to reveal floating action button as user goes below
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setHasScrolledBelow(true);
      } else {
        setHasScrolledBelow(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePaste = async () => {
    triggerHaptic('light');
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputChange(text);
        setPasteSuccess(true);
        triggerHaptic('medium');
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const placeholders = {
    SMS: 'Paste suspicious SMS message text, sender phone number, or 2FA alert...',
    URL: 'Enter domain or suspicious link (e.g. https://account-verify-login.xyz)...',
    EMAIL: 'Paste sender address, subject, and body of suspicious email...'
  };

  // Subtle physical spring transition mimicking physical controls (0.98 scale on press, 1.0 back on release)
  const physicalSpring = {
    type: 'spring' as const,
    stiffness: 500,
    damping: 25,
    mass: 0.5
  };

  return (
    <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#D7D7D7] rounded-2xl p-4 sm:p-5 shadow-xs mb-5 transition-all">
      {/* 1. Clean Top Bar: 3 Mode Buttons & Character Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#ECECEC]">
        <div className="flex items-center gap-1.5 bg-[#F6F6F6] p-1 rounded-xl border border-[#D7D7D7] w-full sm:w-auto">
          {(['SMS', 'URL', 'EMAIL'] as const).map(mode => {
            const isActive = scannerMode === mode;
            const Icon = mode === 'SMS' ? MessageSquare : mode === 'URL' ? Globe : Mail;
            const label = mode === 'SMS' ? 'SMS Message' : mode === 'URL' ? 'Web Link' : 'Email';

            return (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={physicalSpring}
                onClick={() => {
                  triggerHaptic('light');
                  onModeChange(mode);
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-xs border border-[#D7D7D7]'
                    : 'text-[#767676] hover:text-[#0E0E0E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#EC783B]" />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Minimal Actions: Preset Samples toggle & Length */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            transition={physicalSpring}
            onClick={() => {
              triggerHaptic('light');
              setShowPresets(prev => !prev);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-[#4A4A4A] hover:text-[#EC783B] px-2.5 py-1 rounded-lg bg-[#F6F6F6] hover:bg-[#ECECEC] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>Sample Scenarios</span>
            {showPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </motion.button>

          <span className="text-[11px] text-[#767676] font-medium">
            {input.length} / 4000
          </span>
        </div>
      </div>

      {/* Collapsible Sample Scenarios: Keeps top UI clean until needed */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pt-3 pb-2 border-b border-[#ECECEC]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_ATTACKS.map(preset => (
                <motion.button
                  key={preset.title}
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={physicalSpring}
                  onClick={() => {
                    triggerHaptic('medium');
                    onSelectPreset(preset);
                    setShowPresets(false);
                  }}
                  className="flex flex-col p-2.5 rounded-xl bg-[#F6F6F6] hover:bg-[#FFFFFF] border border-[#D7D7D7] hover:border-[#BEBEBE] transition-all text-left shadow-2xs cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-[#EC783B] uppercase mb-0.5">
                    {preset.tag}
                  </span>
                  <span className="text-xs font-bold text-[#0E0E0E] line-clamp-1">
                    {preset.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Textarea Area */}
      <div className="relative mt-3">
        <textarea
          value={input}
          onChange={e => onInputChange(e.target.value)}
          placeholder={placeholders[scannerMode]}
          rows={3}
          className="w-full p-3.5 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7] focus:border-[#EC783B] focus:ring-1 focus:ring-[#EC783B] outline-none text-xs sm:text-sm text-[#0E0E0E] placeholder:text-[#9E9E9E] font-medium resize-y leading-relaxed transition-all shadow-inner"
        />

        {/* Floating Quick Action: Paste / Clear */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {input.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={physicalSpring}
              onClick={() => {
                triggerHaptic('light');
                onClear();
              }}
              className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-[#767676] hover:text-[#D32F2F] shadow-xs border border-[#D7D7D7] transition-colors cursor-pointer"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={physicalSpring}
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-[#4A4A4A] text-xs font-bold shadow-xs border border-[#D7D7D7] transition-all cursor-pointer"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>{pasteSuccess ? 'Pasted!' : 'Paste'}</span>
          </motion.button>
        </div>
      </div>

      {/* 2.5 Heuristic Strictness Control: Interactive Visual Slider (Low, Medium, High) */}
      <div className="mt-3 bg-[#F8F8F8] rounded-xl p-3 sm:p-3.5 border border-[#D7D7D7]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#EC783B]" />
            <span className="text-xs font-bold text-[#0E0E0E]">
              Heuristic Strictness
            </span>
            <span className="text-[11px] text-[#767676] hidden sm:inline">
              • Local Threat Detection Engine
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
              strictness === 'LOW'
                ? 'bg-[#E9F5ED] text-[#1B8A44] border-[#A5D8B4]'
                : strictness === 'MEDIUM'
                ? 'bg-[#FDEEE6] text-[#D9662B] border-[#F6AB83]'
                : 'bg-[#FDEAEA] text-[#D32F2F] border-[#F5AAAA]'
            }`}
          >
            {strictness === 'LOW' ? 'Low Sensitivity' : strictness === 'MEDIUM' ? 'Medium (Balanced)' : 'High (Zero-Trust)'}
          </span>
        </div>

        {/* Interactive Visual Slider Bar */}
        <div className="relative pt-1">
          <div className="relative h-2 w-full bg-[#E5E5E5] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                strictness === 'LOW'
                  ? 'bg-[#1B8A44]'
                  : strictness === 'MEDIUM'
                  ? 'bg-[#EC783B]'
                  : 'bg-[#D32F2F]'
              }`}
              animate={{
                width: strictness === 'LOW' ? '18%' : strictness === 'MEDIUM' ? '50%' : '100%'
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            />
          </div>

          {/* 3 Clickable Segment Positions with Knobs */}
          <div className="flex justify-between items-center mt-2.5">
            {(
              [
                { id: 'LOW', label: 'Low', desc: 'Minimizes false alarms' },
                { id: 'MEDIUM', label: 'Medium', desc: 'Balanced baseline' },
                { id: 'HIGH', label: 'High', desc: 'Aggressive zero-trust' }
              ] as const
            ).map((level) => {
              const isSelected = strictness === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(level.id === strictness ? 'light' : 'medium');
                    onStrictnessChange(level.id);
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                        isSelected
                          ? level.id === 'LOW'
                            ? 'bg-[#1B8A44] border-[#1B8A44] scale-125'
                            : level.id === 'MEDIUM'
                            ? 'bg-[#EC783B] border-[#EC783B] scale-125'
                            : 'bg-[#D32F2F] border-[#D32F2F] scale-125'
                          : 'bg-white border-[#BEBEBE] group-hover:border-[#767676]'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isSelected ? 'text-[#0E0E0E]' : 'text-[#767676] group-hover:text-[#0E0E0E]'
                      }`}
                    >
                      {level.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#767676] mt-0.5">
                    {level.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Action Bar Below: Appears as user enters input or goes below */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3.5 pt-3 border-t border-[#ECECEC]">
        <div className="flex items-center gap-2 text-xs text-[#767676]">
          <ShieldCheck className="w-4 h-4 text-[#1B8A44]" />
          <span>Zero-Trust Verification • Fast Local + AI Engine</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {input.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={physicalSpring}
              onClick={() => {
                triggerHaptic('light');
                onClear();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#767676] hover:text-[#0E0E0E] transition-colors cursor-pointer"
            >
              Clear
            </motion.button>
          )}

          {/* Primary Action Button: Physical Spring-based Scale (0.98 on press, 1.0 on release) & Haptic Emulation */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={physicalSpring}
            onClick={() => {
              triggerHaptic('medium');
              onAnalyze();
            }}
            disabled={isLoading || !input.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer select-none ${
              !input.trim() || isLoading
                ? 'bg-[#D7D7D7] text-[#767676] cursor-not-allowed'
                : 'bg-[#EC783B] hover:bg-[#D9662B] text-black shadow-[#EC783B]/25 active:shadow-inner'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>Analyze Message</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Floating Bottom Action Pill: As user goes below, sticky action button appears */}
      <AnimatePresence>
        {hasScrolledBelow && input.trim() && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={physicalSpring}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={physicalSpring}
              onClick={() => {
                triggerHaptic('medium');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onAnalyze();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E0E0E] text-white font-bold text-xs shadow-2xl border border-white/20 hover:bg-[#2B2B2B] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EC783B]" />
              <span>Analyze Message</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
