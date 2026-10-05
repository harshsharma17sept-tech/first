import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Radio,
  FileWarning,
  ExternalLink,
  PhoneCall,
  Terminal
} from 'lucide-react';

interface ThreatTag {
  id: string;
  label: string;
  type: string;
  risk: number;
  top: string;
  left: string;
}

const RADAR_TAGS: ThreatTag[] = [
  { id: 't1', label: 'SUSPICIOUS LINK', type: 'URL Shortener', risk: 94, top: '15%', left: '72%' },
  { id: 't2', label: 'FAKE INVOICE', type: 'PDF Exploit', risk: 88, top: '28%', left: '76%' },
  { id: 't3', label: 'MALICIOUS FILE', type: 'Macro Script', risk: 96, top: '42%', left: '74%' },
  { id: 't4', label: 'PHISHING MESSAGE', type: 'SMS Smishing', risk: 92, top: '56%', left: '78%' },
  { id: 't5', label: 'UNKNOWN CALLER', type: 'VoIP Spoofing', risk: 82, top: '22%', left: '16%' }
];

export const HeroRadarHUD: React.FC = () => {
  const [activeTag, setActiveTag] = useState<number>(0);
  const [waveBars, setWaveBars] = useState<number[]>([
    24, 38, 55, 78, 62, 90, 84, 45, 65, 88, 72, 95, 60, 48, 80, 70, 85, 92, 40, 60
  ]);
  const [riskValue, setRiskValue] = useState<number>(87);

  // Animate waveform spectrum bars in real-time
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWaveBars(prev =>
        prev.map(() => Math.floor(Math.random() * 70 + 25))
      );
      setRiskValue(r => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.min(99, Math.max(75, Math.round(r + delta)));
      });
    }, 180);
    return () => clearInterval(waveInterval);
  }, []);

  // Cycle active radar target tag
  useEffect(() => {
    const tagInterval = setInterval(() => {
      setActiveTag(prev => (prev + 1) % RADAR_TAGS.length);
    }, 3200);
    return () => clearInterval(tagInterval);
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[560px] rounded-2xl bg-[#090A0D] border border-white/10 overflow-hidden flex items-center justify-center select-none shadow-2xl">
      {/* Background circular radar grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[420px] h-[420px] rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-[320px] h-[320px] rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-[200px] h-[200px] rounded-full border border-[#22c55e]/20 flex items-center justify-center">
              <div className="w-[100px] h-[100px] rounded-full border border-white/10" />
            </div>
          </div>
        </div>
        {/* Radar crosshairs */}
        <div className="absolute w-full h-px bg-white/5" />
        <div className="absolute h-full w-px bg-white/5" />
      </div>

      {/* Rotating radar sweep ray */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="w-[420px] h-[420px] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(34, 197, 94, 0.18) 100%)'
          }}
        />
      </div>

      {/* Center Tactical Shield Radar Core */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-2xl bg-[#0D0F14] border border-[#22c55e]/40 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.15)]"
          >
            <ShieldAlert className="w-10 h-10 text-[#22c55e]" />
          </motion.div>

          {/* Corner brackets */}
          <span className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-[#22c55e]" />
          <span className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-[#22c55e]" />
          <span className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-[#22c55e]" />
          <span className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-[#22c55e]" />
        </div>

        <span className="text-[11px] font-mono tracking-widest text-[#22c55e] uppercase mt-3 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
          ACTIVE SURVEILLANCE
        </span>
      </div>

      {/* Floating Tactical Tags matching reference image */}
      {RADAR_TAGS.map((tag, idx) => {
        const isCurrent = idx === activeTag;
        return (
          <div
            key={tag.id}
            style={{ top: tag.top, left: tag.left }}
            className={`absolute z-20 flex items-center gap-1.5 transition-all duration-300 ${
              isCurrent ? 'opacity-100 scale-105' : 'opacity-40 scale-100'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCurrent ? 'bg-[#22c55e] animate-pulse' : 'bg-white/40'
              }`}
            />
            <div className="flex flex-col">
              <span
                className={`font-mono text-[10px] tracking-wider uppercase font-bold ${
                  isCurrent ? 'text-white' : 'text-neutral-400'
                }`}
              >
                {tag.label}
              </span>
              {isCurrent && (
                <span className="text-[9px] font-mono text-[#22c55e]">
                  {tag.risk}% Risk Detected
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Waveform & Risk Meter Box matching reference image */}
      <div className="absolute bottom-5 right-5 sm:right-8 z-30 p-3.5 rounded-xl bg-[#0B0D11]/95 border border-white/15 backdrop-blur-xl shadow-2xl w-64 sm:w-72">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-300 uppercase">
              ANALYZING...
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">Is this a scam?</span>
        </div>

        {/* Live Audio / Frequency Waveform bars */}
        <div className="flex items-end justify-between h-9 gap-1 my-2 px-1">
          {waveBars.map((height, idx) => (
            <div
              key={idx}
              style={{ height: `${height}%` }}
              className={`w-1 rounded-t transition-all duration-150 ${
                idx > 12 ? 'bg-[#22c55e]' : 'bg-neutral-600'
              }`}
            />
          ))}
        </div>

        {/* Risk Score Confirmation */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="font-mono text-[11px] text-neutral-300">CONFIDENCE:</span>
          <span className="font-mono font-bold text-[#22c55e] tracking-wide text-sm">
            {riskValue}% RISK
          </span>
        </div>
      </div>
    </div>
  );
};
