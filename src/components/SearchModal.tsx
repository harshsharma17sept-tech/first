import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShieldAlert, Wrench, FileText, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (target: string) => void;
}

interface SearchItem {
  id: string;
  category: 'Tools' | 'Scams' | 'Actions';
  title: string;
  description: string;
  actionId: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: '1', category: 'Tools', title: 'Phone Number Lookup', description: 'Analyze unknown callers & spoofed numbers', actionId: 'phone-lookup' },
  { id: '2', category: 'Tools', title: 'QR Code Scanner', description: 'Safely inspect QR destinations before scanning', actionId: 'qr-scanner' },
  { id: '3', category: 'Tools', title: 'Screenshot Analysis', description: 'OCR vision scanning for scam text messages', actionId: 'screenshot-analysis' },
  { id: '4', category: 'Tools', title: 'File & Email Scanner', description: 'Check attachments for malicious scripts and macros', actionId: 'file-scanner' },
  { id: '5', category: 'Tools', title: 'Link Reputation', description: 'Zero-day phishing & deceptive domain detection', actionId: 'link-reputation' },
  { id: '6', category: 'Scams', title: 'USPS / FedEx Delivery Fee Scam', description: 'Fake parcel redelivery links with $1.99 card traps', actionId: 'scan-usps' },
  { id: '7', category: 'Scams', title: 'Bank Account Suspension Phishing', description: 'Impersonated Chase/Wells Fargo urgent login alerts', actionId: 'scan-bank' },
  { id: '8', category: 'Scams', title: 'Remote Job & Check Deposit Fraud', description: 'Overpayment check scams requesting vendor wires', actionId: 'scan-job' },
  { id: '9', category: 'Actions', title: 'Open Threat Scanner', description: 'Jump to the live heuristic workstation', actionId: 'quick-scan' },
  { id: '10', category: 'Actions', title: 'Autonomous Threat Intelligence', description: 'View the live particle detection pipeline', actionId: 'threat-intelligence' }
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [query, setQuery] = useState('');

  // ⌘K Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0D0E12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, scam scenarios, detection rules..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 font-mono">
              No matching security tools or scam vectors found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectAction(item.actionId);
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#22c55e]/15 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-[#22c55e] transition-colors">
                    {item.category === 'Tools' ? (
                      <Wrench className="w-3.5 h-3.5" />
                    ) : item.category === 'Scams' ? (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-[#22c55e] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {item.description}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-neutral-400 uppercase px-2 py-0.5 rounded bg-white/5">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>Proactive Scam Mitigation</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
