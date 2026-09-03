import React from 'react';
import { ScanMode } from '../types';
import { Sparkles, Clipboard, Trash2, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface ScannerProps {
  mode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  inputText: string;
  onInputChange: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const PRESETS: { label: string; text: string; mode: ScanMode }[] = [
  {
    label: 'Bank Impersonation',
    mode: 'sms',
    text: 'CHASE BANK ALERT: Your debit card was temporarily locked due to suspicious $482.90 charge. Verify your identity immediately at https://chase-security-verify.xyz/login to prevent permanent account suspension.'
  },
  {
    label: 'Package Smishing',
    mode: 'sms',
    text: 'USPS Notice: Your delivery #940011189956201 is on hold due to missing apartment number. Pay $1.85 redelivery fee within 12 hours: http://usps-redelivery-package.top/track'
  },
  {
    label: 'IRS Threat',
    mode: 'email',
    text: 'INTERNAL REVENUE SERVICE (IRS): Final Notice of Tax Deficiency. An arrest warrant has been prepared under your SSN. You must settle the outstanding balance of $1,450 immediately via wire or gift card to avoid federal prosecution. Contact irs.tax.enforcement@gmail.com'
  },
  {
    label: 'Crypto Scam',
    mode: 'url',
    text: 'https://binance-airdrop-bonus.loan/claim-btc'
  }
];

export const Scanner: React.FC<ScannerProps> = ({
  mode,
  onModeChange,
  inputText,
  onInputChange,
  onAnalyze,
  isLoading
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputChange(text);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleClear = () => {
    onInputChange('');
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    onModeChange(preset.mode);
    onInputChange(preset.text);
  };

  const charCount = inputText.length;
  const maxChars = 4000;
  const isSubmitDisabled = isLoading || inputText.trim().length === 0;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#1B1B1B] p-5 rounded-sm mb-6 shadow-sm">
      {/* Header with Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D7D7D7]">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#EC783B]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#0E0E0E]">
            INPUT THREAT WORKSTATION
          </span>
        </div>

        {/* Scan Mode Selector */}
        <div className="flex items-center bg-[#F6F6F6] p-1 border border-[#D7D7D7] rounded-sm text-xs font-mono">
          {(['sms', 'url', 'email'] as ScanMode[]).map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-3 py-1 font-bold rounded-sm uppercase transition-colors ${
                mode === m
                  ? 'bg-[#0E0E0E] text-white'
                  : 'text-[#767676] hover:text-[#0E0E0E]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Preset attack scenario quick-chips */}
      <div className="mb-3.5">
        <div className="text-[11px] font-mono text-[#767676] mb-1.5 flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-[#EC783B]" />
          <span>ATTACK SCENARIO PRESETS:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              className="px-2.5 py-1 bg-[#F6F6F6] hover:bg-[#E4E4E4] border border-[#D7D7D7] hover:border-[#1B1B1B] text-[#0E0E0E] text-xs font-mono rounded-sm transition-all text-left flex items-center space-x-1"
            >
              <span className="text-[#EC783B] font-bold">#</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Input */}
      <div className="relative mb-3">
        <textarea
          rows={5}
          value={inputText}
          onChange={e => onInputChange(e.target.value.slice(0, maxChars))}
          placeholder={
            mode === 'sms'
              ? 'Paste suspicious SMS message with any links, sender IDs, or urgency requests...'
              : mode === 'url'
              ? 'Enter or paste suspicious URL, shortened link (e.g. bit.ly/...), or deceptive domain...'
              : 'Paste full email body, subject line, or sender address to evaluate phishing markers...'
          }
          className="w-full bg-[#F6F6F6] border border-[#1B1B1B] p-3 text-sm font-mono text-[#0E0E0E] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#EC783B] resize-y placeholder:text-[#999999]"
        />

        {/* Character counter */}
        <div className="text-right text-[11px] font-mono text-[#767676] mt-1">
          {charCount} / {maxChars} CHARACTERS
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePaste}
            type="button"
            className="px-3 py-1.5 bg-[#F6F6F6] hover:bg-[#E4E4E4] border border-[#D7D7D7] text-[#0E0E0E] text-xs font-mono rounded-sm transition-colors flex items-center space-x-1.5"
          >
            <Clipboard className="w-3.5 h-3.5 text-[#767676]" />
            <span>PASTE CLIPBOARD</span>
          </button>

          {inputText && (
            <button
              onClick={handleClear}
              type="button"
              className="px-3 py-1.5 bg-[#F6F6F6] hover:bg-[#E4E4E4] border border-[#D7D7D7] text-[#D32F2F] text-xs font-mono rounded-sm transition-colors flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
          )}
        </div>

        {/* Primary Analysis Button */}
        <button
          onClick={onAnalyze}
          disabled={isSubmitDisabled}
          className={`px-6 py-2.5 text-xs font-mono font-bold tracking-wider rounded-sm transition-all flex items-center space-x-2 shadow-sm ${
            isSubmitDisabled
              ? 'bg-[#D7D7D7] text-[#767676] cursor-not-allowed'
              : 'bg-[#EC783B] hover:bg-[#D25F24] text-white cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>RUNNING ZERO-TRUST SCAN...</span>
            </>
          ) : (
            <>
              <span>ANALYZE THREAT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
