import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Search, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', section: 'hero' },
    { id: 'scan', label: 'Scan', section: 'quick-scan' },
    { id: 'tools', label: 'Tools', section: 'tools' },
    { id: 'intelligence', label: 'Threat Intelligence', section: 'threat-intelligence' },
    { id: 'learn', label: 'Learn', section: 'how-it-works' },
    { id: 'about', label: 'About', section: 'why-scamshield' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080A]/85 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Wordmark */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] group-hover:border-[#22c55e] transition-colors shadow-[0_0_12px_rgba(34,197,94,0.1)]">
            <Shield className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-neutral-200 transition-colors">
            ScamShield
          </span>
        </div>

        {/* Center: Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-neutral-400">
          {navLinks.map(link => {
            const isActive = activeSection === link.id || activeSection === link.section;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.section)}
                className={`relative py-1 transition-colors duration-150 cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Sign In, Get Started */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Minimal Search Button with ⌘K */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1115] hover:bg-[#15181F] border border-white/10 text-neutral-400 hover:text-white transition-colors text-xs cursor-pointer"
            title="Search scans, numbers, links (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] text-neutral-400">
              Search scams, numbers, links...
            </span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-400">
              ⌘K
            </kbd>
          </button>

          {/* Sign In */}
          <button
            onClick={() => onOpenAuth('signin')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>

          {/* Get Started / CTA */}
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-xs transition-all duration-150 shadow-[0_0_15px_rgba(34,197,94,0.2)] cursor-pointer"
          >
            Get Started
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1.5 rounded-lg lg:hidden text-neutral-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-[#07080A] border-b border-white/10 flex flex-col gap-2 text-sm">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.section);
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-left text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={() => {
                onOpenAuth('signin');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg border border-white/10 text-xs font-medium text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onOpenAuth('signup');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-[#22c55e] text-black font-bold text-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
