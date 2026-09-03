import React, { useState } from 'react';
import { MessageSquare, Globe, Mail, Sparkles, Clipboard, Trash2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { AttackPreset } from '../types';

interface ScannerWorkstationProps {
  input: string;
  scannerMode: 'SMS' | 'URL' | 'EMAIL';
  isLoading: boolean;
  onInputChange: (val: string) => void;
  onModeChange: (mode: 'SMS' | 'URL' | 'EMAIL') => void;
  onAnalyze: () => void;
  onClear: () => void;
  onSelectPreset: (preset: AttackPreset) => void;
}

export const PRESET_ATTACKS: AttackPreset[] = [
  {
    title: 'Bank Impersonation',
    tag: 'CHASE / FRAUD',
    mode: 'SMS',
    content: 'CHASE-ALERT: Unusual withdrawal of $940.50 detected on your debit card ending in 8912. If this was not you, verify immediately at: https://chase-security-verify.xyz/login to block this transaction.'
  },
  {
    title: 'Package Smishing',
    tag: 'USPS / DELIVERY',
    mode: 'SMS',
    content: 'USPS Notification: Your package US-892401-K cannot be dispatched due to an incomplete delivery address and an unpaid $1.99 customs fee. Resolve within 12 hours: http://192.168.1.105/usps/track'
  },
  {
    title: 'IRS Threat',
    tag: 'AUTHORITY / IRS',
    mode: 'EMAIL',
    content: 'INTERNAL REVENUE SERVICE NOTICE: Immediate legal action and federal arrest warrant issued for outstanding taxes of $4,820.00. To avoid police execution today, reply with your SSN and settle via Apple Gift Card or Bitcoin immediately.'
  },
  {
    title: 'Crypto Scam',
    tag: 'BINANCE / AIRDROP',
    mode: 'URL',
    content: 'https://binance-airdrop-bonus2026.club/claim?ref=wallet_verify&key=88201'
  }
];

export const ScannerWorkstation: React.FC<ScannerWorkstationProps> = ({
  input,
  scannerMode,
  isLoading,
  onInputChange,
  onModeChange,
  onAnalyze,
  onClear,
  onSelectPreset
}) => {
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputChange(text);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      // Fallback or permission denied
    }
  };

  const placeholders = {
    SMS: 'Paste suspicious SMS message text, sender phone number, or OTP request alert here...',
    URL: 'Enter domain or suspicious link (e.g. https://account-verification-login.xyz)...',
    EMAIL: 'Paste header, sender address, and body of suspicious spear-phishing email...'
  };

  return (
    <div className="bg-[#F6F6F6] border border-[#D7D7D7] rounded-xl p-4 sm:p-5 shadow-sm mb-4">
      {/* Workstation Top Bar: Mode Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#D7D7D7]">
        <div className="flex items-center gap-1 bg-[#ECECEC] p-1 rounded-lg border border-[#D7D7D7] w-full sm:w-auto">
          <button
            onClick={() => onModeChange('SMS')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all ${
              scannerMode === 'SMS'
                ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-xs'
                : 'text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>SMS / TEXT</span>
          </button>
          <button
            onClick={() => onModeChange('URL')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all ${
              scannerMode === 'URL'
                ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-xs'
                : 'text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>URL / LINK</span>
          </button>
          <button
            onClick={() => onModeChange('EMAIL')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all ${
              scannerMode === 'EMAIL'
                ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-xs'
                : 'text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>EMAIL / PHISH</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#767676]">
          <span>TELEMETRY:</span>
          <span className="font-bold text-[#0E0E0E]">{input.length} / 4000 CHARS</span>
        </div>
      </div>

      {/* Preset Fixtures Chips */}
      <div className="py-3">
        <div className="text-[11px] font-mono text-[#767676] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#EC783B]" />
          <span>ATTACK SCENARIO PRESETS (ONE-CLICK SIMULATION):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_ATTACKS.map(preset => (
            <button
              key={preset.title}
              onClick={() => onSelectPreset(preset)}
              className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#ECECEC] border border-[#D7D7D7] hover:border-[#BEBEBE] transition-all text-left"
            >
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#ECECEC] group-hover:bg-[#E4E4E4] text-[#4A4A4A] font-bold">
                {preset.tag}
              </span>
              <span className="text-xs font-bold text-[#1B1B1B]">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea with Editorial Border */}
      <div className="relative mt-1">
        <textarea
          value={input}
          onChange={e => onInputChange(e.target.value)}
          placeholder={placeholders[scannerMode]}
          rows={5}
          className="w-full bg-[#FFFFFF] border-2 border-[#D7D7D7] focus:border-[#EC783B] rounded-xl p-3.5 text-xs sm:text-sm font-mono text-[#0E0E0E] placeholder:text-[#9A9A9A] focus:outline-none transition-colors leading-relaxed resize-y"
        />

        {/* Quick Clear Floating Button */}
        {input && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-[#ECECEC] hover:bg-[#E4E4E4] text-[#767676] hover:text-[#0E0E0E] transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-3 border-t border-[#D7D7D7]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePaste}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] border border-[#D7D7D7] font-mono text-xs font-bold text-[#1B1B1B] transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5 text-[#EC783B]" />
            <span>{pasteSuccess ? 'PASTED!' : 'PASTE CLIPBOARD'}</span>
          </button>

          {input && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] border border-[#D7D7D7] font-mono text-xs text-[#767676] hover:text-black transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
          )}
        </div>

        <button
          onClick={onAnalyze}
          disabled={!input.trim() || isLoading}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm ${
            !input.trim() || isLoading
              ? 'bg-[#D7D7D7] text-[#767676] cursor-not-allowed'
              : 'bg-[#EC783B] hover:bg-[#D9662B] text-black hover:shadow-md cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>RUNNING ZERO-TRUST SCAN...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>ANALYZE THREAT</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
