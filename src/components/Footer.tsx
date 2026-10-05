import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#050608] border-t border-white/[0.08] text-neutral-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-4 text-left">
            <div
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2.5 cursor-pointer mb-3 w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                <Shield className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                ScamShield
              </span>
            </div>

            <p className="text-neutral-400 text-xs font-medium leading-relaxed max-w-sm mb-4">
              Smarter Detection. Safer Tomorrows. Protecting individuals and organizations from evolving social engineering and phishing attacks.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span>All heuristic scanning systems operational</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
            {/* Product */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white mb-3 block">
                Product
              </span>
              <ul className="flex flex-col gap-2.5 text-neutral-400">
                <li>
                  <button
                    onClick={() => onNavigate('hero')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('quick-scan')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Scan Engine
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('tools')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Security Tools
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('threat-intelligence')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Threat Intelligence
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white mb-3 block">
                Resources
              </span>
              <ul className="flex flex-col gap-2.5 text-neutral-400">
                <li>
                  <button
                    onClick={() => onNavigate('how-it-works')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('why-scamshield')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Why ScamShield
                  </button>
                </li>
                <li>
                  <a href="#learn" className="hover:text-white transition-colors">
                    Scam Trends 2026
                  </a>
                </li>
                <li>
                  <a href="#support" className="hover:text-white transition-colors">
                    Report a Scam
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white mb-3 block">
                Legal & Privacy
              </span>
              <ul className="flex flex-col gap-2.5 text-neutral-400">
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-white transition-colors">
                    Security Disclosure
                  </a>
                </li>
                <li>
                  <a href="#compliance" className="hover:text-white transition-colors">
                    Zero-Retention Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 font-mono">
          <p>© {new Date().getFullYear()} ScamShield. All rights reserved.</p>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy First Design
            </span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">
              End-to-End Client Encryption
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
