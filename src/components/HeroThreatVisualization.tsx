import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  Sparkles,
  Activity,
  ArrowRight,
  Eye,
  Terminal,
  Play
} from 'lucide-react';

interface HeroThreatVisualizationProps {
  onScanClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const HeroThreatVisualization: React.FC<HeroThreatVisualizationProps> = ({
  onScanClick,
  onHowItWorksClick
}) => {
  const [eyePulse, setEyePulse] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTelemetry, setActiveTelemetry] = useState<string>('ANALYZING RISK CONTEXT...');
  const [confidenceRisk, setConfidenceRisk] = useState<number>(97);

  // Subtle interactive parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 14, y: y * 14 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Heartbeat pulse for the cybernetic eye
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setEyePulse(p => !p);
    }, 2200);

    const logTimer = setInterval(() => {
      const logs = [
        'ANALYZING RISK CONTEXT...',
        'ETHICAL THREAT RADAR ACTIVE',
        'ZERO-DAY INJECTION INTERCEPTED',
        'AUTONOMOUS HEURISTIC RUNNING',
        'SURVEILLANCE EXPOSURE: ZERO'
      ];
      setActiveTelemetry(logs[Math.floor(Math.random() * logs.length)]);
      setConfidenceRisk(Math.floor(Math.random() * 6 + 94));
    }, 3800);

    return () => {
      clearInterval(pulseTimer);
      clearInterval(logTimer);
    };
  }, []);

  const handleScan = () => {
    if (onScanClick) {
      onScanClick();
    } else {
      const el = document.getElementById('quick-scan');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHowItWorks = () => {
    if (onHowItWorksClick) {
      onHowItWorksClick();
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[500px] sm:h-[560px] lg:h-[600px] rounded-2xl bg-[#05070A] border border-white/10 overflow-hidden flex items-center justify-center select-none shadow-[0_0_50px_rgba(0,0,0,0.85)] group transition-all duration-300"
    >
      {/* 1. Deep Atmospheric Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(34,197,94,0.14)_0%,rgba(5,7,10,0.88)_60%,#040608_100%)] pointer-events-none" />

      {/* 2. Cyber Matrix Rain Streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-[12%] w-[1px] h-48 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent animate-pulse" />
        <div className="absolute top-8 left-[24%] w-[1.5px] h-64 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent animate-pulse delay-300" />
        <div className="absolute top-0 right-[24%] w-[1px] h-56 bg-gradient-to-b from-transparent via-[#4ade80] to-transparent animate-pulse delay-700" />
        <div className="absolute top-12 right-[10%] w-[1.5px] h-72 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent animate-pulse delay-500" />
      </div>

      {/* 3. Operative Image (Replaces Canvas in first page) */}
      <motion.div
        animate={{
          x: mousePos.x * 0.35,
          y: mousePos.y * 0.35,
          scale: 1.02
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        <img
          src="/sentinel-operative.svg"
          alt="Cyber Defense Operative"
          className="w-full h-full object-cover sm:object-contain object-center scale-105 sm:scale-100"
        />

        {/* 4. Glowing Emerald Cyber Eye FX Overlay */}
        <div
          style={{
            transform: `translate(${mousePos.x * 0.75}px, ${mousePos.y * 0.75}px)`
          }}
          className="absolute top-[49.5%] left-[58.2%] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-100 ease-out"
        >
          {/* Intense Outer Green Bloom */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#22c55e]/40 blur-xl transition-all duration-1000 ${
              eyePulse ? 'scale-125 opacity-90' : 'scale-95 opacity-60'
            }`}
          />
          {/* Concentrated Core Halo */}
          <div className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#4ade80]/60 blur-md animate-ping" />
          {/* Specular White-Hot Pupil Sparkle */}
          <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#86efac]" />
        </div>
      </motion.div>

      {/* 5. Iconic Slanted Olive Tape Badges (From Reference Screenshot) */}
      <div className="absolute inset-x-0 top-[26%] sm:top-[28%] z-20 flex flex-col items-center pointer-events-none px-4">
        {/* WE [PROTECT] */}
        <div className="flex items-center gap-2 sm:gap-3 leading-none">
          <span className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
            WE
          </span>
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#42583e] text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-wider uppercase -rotate-2 shadow-2xl border border-[#526d4e]">
            PROTECT
          </span>
        </div>

        {/* WHAT YOU [CAN'T] */}
        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2.5 leading-none">
          <span className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
            WHAT YOU
          </span>
          <span className="inline-block px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#42583e] text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-wider uppercase rotate-2 shadow-2xl border border-[#526d4e]">
            CAN'T
          </span>
        </div>

        {/* SEE! (with red exclamation mark) */}
        <div className="flex items-center mt-1 sm:mt-2 leading-none">
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            SEE
          </span>
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#EF4444] uppercase drop-shadow-[0_0_18px_rgba(239,68,68,0.85)] ml-0.5">
            !
          </span>
        </div>

        {/* Supporting Subtitle from Screenshot */}
        <p className="mt-3.5 sm:mt-4 text-center text-[11px] sm:text-xs text-neutral-300 font-medium max-w-sm sm:max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-relaxed">
          Sentinel Labs provides ethical hacking, risk audits and cyberdefense for organizations that value trust above all else.
        </p>
      </div>

      {/* 6. Top Bar Branding Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md">
        <div className="w-5 h-5 rounded-md bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e]">
          <Shield className="w-3 h-3 stroke-[2.4]" />
        </div>
        <span className="text-[11px] font-mono font-bold tracking-wider text-white">
          SENTINEL LABS
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping ml-1" />
      </div>

      {/* 7. Top Right Services Pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-[#42583e]/85 border border-[#526d4e] text-white text-[11px] font-mono font-semibold tracking-wider shadow-lg">
          Services
        </div>
      </div>

      {/* 8. Bottom Action Dual Pills (As in Reference Screenshot) */}
      <div className="absolute bottom-5 inset-x-0 z-30 flex items-center justify-center gap-3 px-4">
        <button
          onClick={handleScan}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#181c19]/95 hover:bg-[#222923] border border-white/15 hover:border-[#22c55e]/60 text-white font-mono text-xs font-semibold tracking-wider flex items-center gap-2 backdrop-blur-lg shadow-2xl transition-all duration-200 cursor-pointer group"
        >
          <span className="w-1.5 h-3 bg-[#EF4444] rounded-sm group-hover:bg-[#22c55e] transition-colors" />
          <span>Book A Free Threat Scan</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={handleHowItWorks}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0a0d11]/85 hover:bg-[#131720] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white font-mono text-xs font-medium tracking-wide flex items-center gap-2 backdrop-blur-lg transition-all duration-200 cursor-pointer"
        >
          <span className="w-1.5 h-3 bg-[#22c55e] rounded-sm" />
          <span>See How We Work</span>
        </button>
      </div>

      {/* 9. Minimal Technical Status in Corners */}
      <div className="absolute bottom-3 left-4 text-[9px] font-mono text-neutral-400 hidden sm:flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-[#22c55e] animate-pulse" />
        <span>{activeTelemetry}</span>
      </div>
      <div className="absolute bottom-3 right-4 text-[9px] font-mono text-neutral-400 hidden sm:block">
        RISK SHIELD: <span className="text-[#22c55e] font-bold">{confidenceRisk}% ACCURACY</span>
      </div>
    </div>
  );
};
export default HeroThreatVisualization;
