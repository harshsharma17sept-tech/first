import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { ThreatIntelligenceSection } from './components/ThreatIntelligenceSection';
import { QuickScanner } from './components/QuickScanner';
import { ToolsSection } from './components/ToolsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyScamShield } from './components/WhyScamShield';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { ToolInteractiveModal } from './components/ToolInteractiveModal';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signup'
  });
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  // Scroll spy to update active navigation state
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'threat-intelligence', 'quick-scan', 'tools', 'how-it-works', 'why-scamshield'];
      const scrollPos = window.scrollY + 200;

      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchAction = (targetId: string) => {
    if (targetId.startsWith('scan-')) {
      scrollToSection('quick-scan');
    } else if (
      targetId === 'phone-lookup' ||
      targetId === 'qr-scanner' ||
      targetId === 'screenshot-analysis' ||
      targetId === 'file-scanner' ||
      targetId === 'link-reputation' ||
      targetId === 'browser-protection'
    ) {
      setActiveToolModal(targetId);
    } else {
      scrollToSection(targetId);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F3F4F6] selection:bg-[#22c55e]/20 selection:text-[#22c55e] cyber-dots relative">
      {/* 1. Minimal Fixed Top Navigation Bar */}
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={mode => setAuthModal({ isOpen: true, mode })}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        {/* 2. Hero Section: Asymmetric Typography + Tactical Radar Waveform HUD */}
        <Hero
          onScanClick={() => scrollToSection('quick-scan')}
          onHowItWorksClick={() => scrollToSection('how-it-works')}
        />

        {/* 3. Believable Performance & Trust Metrics Bar */}
        <MetricsBar />

        {/* 4. Threat Intelligence Section: "FROM NOISE TO INSIGHT." + Autonomous 3D Particle System */}
        <ThreatIntelligenceSection
          onExploreMore={() => scrollToSection('quick-scan')}
        />

        {/* 5. Quick Scan Section: "VERIFY BEFORE YOU CLICK OR REPLY." + Real Heuristics */}
        <QuickScanner />

        {/* 6. Tools Section: "EVERYTHING YOU NEED TO STAY SAFE." (6 Tools) */}
        <ToolsSection
          onSelectTool={toolId => setActiveToolModal(toolId)}
          onViewAllTools={() => setActiveToolModal('phone-lookup')}
        />

        {/* 7. How It Works: "SIMPLE. FAST. EFFECTIVE." 4-Step Pipeline */}
        <HowItWorksSection />

        {/* 8. Why ScamShield: "BUILT FOR A SAFER DIGITAL WORLD." */}
        <WhyScamShield />

        {/* 9. Final Call-to-Action: "TAKE CONTROL. STAY ONE STEP AHEAD." */}
        <FinalCTA
          onStartScanning={() => scrollToSection('quick-scan')}
          onLearnMore={() => scrollToSection('threat-intelligence')}
        />
      </main>

      {/* 10. Minimal High-Contrast Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Interactive Modals */}
      {/* ⌘K Quick Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectAction={handleSearchAction}
      />

      {/* Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signup' })}
        onSuccess={() => {}}
      />

      {/* Interactive Testing Sandbox for all 6 Tools */}
      <ToolInteractiveModal
        toolId={activeToolModal}
        onClose={() => setActiveToolModal(null)}
      />
    </div>
  );
};

export default App;
