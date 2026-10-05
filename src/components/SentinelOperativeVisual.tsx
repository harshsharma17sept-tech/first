import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Terminal, Activity, Eye, Play, ArrowRight } from 'lucide-react';

interface SentinelOperativeVisualProps {
  onScanClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const SentinelOperativeVisual: React.FC<SentinelOperativeVisualProps> = ({
  onScanClick,
  onHowItWorksClick
}) => {
  const [eyePulse, setEyePulse] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTacticalOverlay, setShowTacticalOverlay] = useState<boolean>(true);

  // Subtle interactive eye & aura tracking on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 15, y: y * 15 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Heartbeat pulse for the cybernetic eye
  useEffect(() => {
    const interval = setInterval(() => {
      setEyePulse(prev => !prev);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[500px] sm:h-[560px] lg:h-[600px] rounded-2xl bg-[#05070A] border border-white/10 overflow-hidden flex items-center justify-center select-none shadow-[0_0_50px_rgba(0,0,0,0.8)] group transition-all duration-300"
    >
      {/* 1. Deep Atmospheric Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(34,197,94,0.12)_0%,rgba(5,7,10,0.85)_60%,#040608_100%)] pointer-events-none" />

      {/* 2. Cyber Matrix Rain Streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-[12%] w-[1px] h-48 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent animate-pulse" />
        <div className="absolute top-10 left-[28%] w-[1.5px] h-64 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent animate-pulse delay-300" />
        <div className="absolute top-0 right-[22%] w-[1px] h-56 bg-gradient-to-b from-transparent via-[#4ade80] to-transparent animate-pulse delay-700" />
        <div className="absolute top-16 right-[10%] w-[1.5px] h-72 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent animate-pulse delay-500" />
      </div>

      {/* 3. The High-Fidelity Operative Illustration */}
      <motion.div
        animate={{
          x: mousePos.x * 0.4,
          y: mousePos.y * 0.4,
          scale: 1.02
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        <img
          src="/sentinel-operative.svg"
          alt="Sentinel Labs Cyber Defense Operative"
          className="w-full h-full object-cover sm:object-contain object-center scale-105 sm:scale-100"
        />

        {/* 4. Dynamic Glowing Emerald Cyber Eye FX Overlay */}
        <div
          style={{
            transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`
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
          {/* Eye Specular Lens Sparkle */}
          <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#86efac]" />
        </div>
      </motion.div>

      {/* 5. Iconic Slanted Olive Tape Badges (As in Reference Screenshot) */}
      <div className="absolute inset-x-0 top-[26%] sm:top-[28%] z-20 flex flex-col items-center pointer-events-none px-4">
        {/* WE [PROTECT] */}
        <div className="flex items-center gap-2 sm:gap-3 leading-none">
          <span className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            WE
          </span>
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#42583e] text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-wider uppercase -rotate-2 shadow-xl border border-[#526d4e]">
            PROTECT
          </span>
        </div>

        {/* WHAT YOU [CAN'T] */}
        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2.5 leading-none">
          <span className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            WHAT YOU
          </span>
          <span className="inline-block px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#42583e] text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-wider uppercase rotate-2 shadow-xl border border-[#526d4e]">
            CAN'T
          </span>
        </div>

        {/* SEE! (with red exclamation mark) */}
        <div className="flex items-center mt-1 sm:mt-2 leading-none">
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            SEE
          </span>
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#EF4444] uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">
            !
          </span>
        </div>

        {/* Supporting Subtitle */}
        <p className="mt-3.5 sm:mt-5 text-center text-[11px] sm:text-xs text-neutral-300 font-medium max-w-sm sm:max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed">
          Autonomous ethical defense, threat neutralization and cyber intelligence for digital safety.
        </p>
      </div>

      {/* 6. Top Bar Branding Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
        <div className="w-5 h-5 rounded-md bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e]">
          <Shield className="w-3 h-3 stroke-[2.4]" />
        </div>
        <span className="text-[11px] font-mono font-bold tracking-wider text-white">
          SENTINEL DEFENSE
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping ml-1" />
      </div>

      {/* 7. Top Right Services Pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-[#42583e]/80 border border-[#526d4e] text-white text-[11px] font-mono font-semibold tracking-wider">
          LIVE SHIELD
        </div>
      </div>

      {/* 8. Bottom Action Dual Pills (As in Reference Screenshot) */}
      <div className="absolute bottom-5 inset-x-0 z-30 flex items-center justify-center gap-3 px-4">
        <button
          onClick={onScanClick}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#181c19]/90 hover:bg-[#202721] border border-white/15 hover:border-[#22c55e]/50 text-white font-mono text-xs font-semibold tracking-wider flex items-center gap-2 backdrop-blur-lg shadow-xl transition-all duration-200 cursor-pointer group"
        >
          <span className="w-1.5 h-3 bg-[#EF4444] rounded-sm group-hover:bg-[#22c55e] transition-colors" />
          <span>Book A Free Threat Scan</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={onHowItWorksClick}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0a0d11]/80 hover:bg-[#12161d] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white font-mono text-xs font-medium tracking-wide flex items-center gap-2 backdrop-blur-lg transition-all duration-200 cursor-pointer"
        >
          <span className="w-1.5 h-3 bg-[#22c55e] rounded-sm" />
          <span>See How We Work</span>
        </button>
      </div>

      {/* 9. Minimal Technical Telemetry Corners */}
      <div className="absolute bottom-3 left-3 text-[9px] font-mono text-neutral-400 hidden sm:block">
        SYS.01 // BIO_LENS_ONLINE
      </div>
      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-neutral-400 hidden sm:block">
        ZERO_DAY_RADAR: 99.8%
      </div>
    </div>
  );
};
export default SentinelOperativeVisual;
