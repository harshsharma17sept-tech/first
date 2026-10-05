import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Mail,
  Globe,
  Phone,
  FileCode,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Activity,
  Layers,
  Search,
  ArrowRight
} from 'lucide-react';

export type WorkflowState = 'COLLECT' | 'TRIAGE' | 'INVESTIGATE' | 'RESPOND' | 'RESOLVED';

interface SourceNode {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  lastActive: number;
}

const SOURCES: SourceNode[] = [
  { id: 'sms', name: 'SMS', icon: MessageSquare, type: 'SMS Phishing', lastActive: 0 },
  { id: 'email', name: 'EMAIL', icon: Mail, type: 'Impersonation', lastActive: 0 },
  { id: 'web', name: 'WEB', icon: Globe, type: 'Malicious URL', lastActive: 0 },
  { id: 'phone', name: 'PHONE', icon: Phone, type: 'Robocall Scam', lastActive: 0 },
  { id: 'file', name: 'FILE', icon: FileCode, type: 'Trojan Dropper', lastActive: 0 },
  { id: 'qr', name: 'QR', icon: QrCode, type: 'Quishing Link', lastActive: 0 },
  { id: 'api', name: 'CLOUD', icon: Layers, type: 'Credential Harvest', lastActive: 0 }
];

interface ResolvedCase {
  id: string;
  target: string;
  type: string;
  verdict: 'Threat Contained' | 'Risk Verified' | 'Safe to Proceed';
  riskScore: number;
  timestamp: string;
}

const INITIAL_CASES: ResolvedCase[] = [
  { id: 'c1', target: 'tracking-usps-verify.xyz', type: 'SMS Smishing', verdict: 'Threat Contained', riskScore: 94, timestamp: 'Just now' },
  { id: 'c2', target: 'chase-security-portal.info', type: 'Phishing Form', verdict: 'Threat Contained', riskScore: 98, timestamp: '12s ago' },
  { id: 'c3', target: 'verify.github.com/auth', type: 'OAuth Callback', verdict: 'Safe to Proceed', riskScore: 3, timestamp: '28s ago' }
];

interface Particle {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  theta: number;
  phi: number;
  speed: number;
  size: number;
  alpha: number;
  isThreat: boolean;
  color: 'white' | 'green' | 'red';
  clusterAngle: number;
  driftX: number;
  driftY: number;
  driftZ: number;
}

interface Packet {
  sourceIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const AutonomousThreatSystem: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [workflowState, setWorkflowState] = useState<WorkflowState>('TRIAGE');
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);
  const [cycleTime, setCycleTime] = useState<number>(0);
  const [resolvedCases, setResolvedCases] = useState<ResolvedCase[]>(INITIAL_CASES);
  const [threatCount, setThreatCount] = useState<number>(24108);

  // Workflow state machine loop: 4-6 seconds per stage
  useEffect(() => {
    const sequence: WorkflowState[] = ['COLLECT', 'TRIAGE', 'INVESTIGATE', 'RESPOND', 'RESOLVED'];
    const timer = setInterval(() => {
      setWorkflowState(current => {
        const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
        const nextState = sequence[nextIdx];

        // If resolving, add a new resolved case
        if (nextState === 'RESOLVED') {
          const sampleThreats = [
            { target: 'login-appleid-verify.me', type: 'Apple ID Credential Stealer', risk: 96 },
            { target: '+1 (800) 412-9844', type: 'Tech Support Impersonation', risk: 91 },
            { target: 'package-delivery-usps.biz', type: 'Fake Parcel Fee Trap', risk: 95 },
            { target: 'secure.payroll-portal.com', type: 'Clean Employer Auth', risk: 4 },
            { target: 'crypto-airdrop-telegram.org', type: 'Drainer Smart Contract', risk: 99 }
          ];
          const chosen = sampleThreats[Math.floor(Math.random() * sampleThreats.length)];
          const newCase: ResolvedCase = {
            id: `case-${Date.now()}`,
            target: chosen.target,
            type: chosen.type,
            verdict: chosen.risk > 50 ? 'Threat Contained' : 'Safe to Proceed',
            riskScore: chosen.risk,
            timestamp: 'Just now'
          };
          setResolvedCases(prev => [newCase, ...prev.slice(0, 3)]);
          setThreatCount(c => c + 1);
        }

        return nextState;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Source node packet trigger interval
  useEffect(() => {
    const sourceTimer = setInterval(() => {
      setActiveSourceIndex(prev => (prev + 1) % SOURCES.length);
    }, 1800);
    return () => clearInterval(sourceTimer);
  }, []);

  // Three.js / Canvas 3D particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 900);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 550);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 900;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 550;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 800 - 1200 organic sphere particles
    const PARTICLE_COUNT = compact ? 500 : 900;
    const particles: Particle[] = [];
    const baseSphereRadius = Math.min(width, height) * 0.28;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Golden spiral distribution on sphere with organic variance
      const theta = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;
      const rVariance = baseSphereRadius * (0.8 + Math.random() * 0.45);
      
      // Mark 12% as green security signals, 8% as potential threat nodes
      const isGreen = Math.random() < 0.16;
      const isThreat = Math.random() < 0.08;

      particles.push({
        x: rVariance * Math.sin(theta) * Math.cos(phi),
        y: rVariance * Math.sin(theta) * Math.sin(phi),
        z: rVariance * Math.cos(theta),
        baseRadius: rVariance,
        theta,
        phi,
        speed: 0.003 + Math.random() * 0.004,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        isThreat,
        color: isThreat ? 'red' : isGreen ? 'green' : 'white',
        clusterAngle: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.6,
        driftY: (Math.random() - 0.5) * 0.6,
        driftZ: (Math.random() - 0.5) * 0.6
      });
    }

    // Packets traveling along bezier curves from left source nodes
    const packets: Packet[] = [];
    let lastPacketTime = 0;

    let rotX = 0.2;
    let rotY = 0;
    let rotZ = 0;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Slow autonomous rotation
      rotY += 0.0035;
      rotX = 0.25 + Math.sin(now * 0.0004) * 0.08;
      rotZ = Math.cos(now * 0.0003) * 0.04;

      // Spawn packets from source nodes
      if (now - lastPacketTime > 400 && packets.length < 15) {
        lastPacketTime = now;
        packets.push({
          sourceIndex: Math.floor(Math.random() * SOURCES.length),
          progress: 0,
          speed: 0.45 + Math.random() * 0.35,
          color: Math.random() > 0.3 ? '#22c55e' : '#FFFFFF'
        });
      }

      // Draw bezier input cables from left sources to particle core
      const sourceCount = SOURCES.length;
      const leftX = width * 0.08;
      const sourceSpacing = (height * 0.65) / (sourceCount - 1);
      const sourceStartY = height * 0.18;

      ctx.lineWidth = 1;
      for (let s = 0; s < sourceCount; s++) {
        const sy = sourceStartY + s * sourceSpacing;
        const targetX = centerX - baseSphereRadius * 0.55;
        const targetY = centerY + (s - sourceCount / 2) * 22;

        const cp1x = leftX + (centerX - leftX) * 0.45;
        const cp1y = sy;
        const cp2x = leftX + (centerX - leftX) * 0.75;
        const cp2y = targetY;

        // Base cable
        ctx.beginPath();
        ctx.moveTo(leftX, sy);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
        ctx.strokeStyle = s === activeSourceIndex ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        // Active node pulse
        if (s === activeSourceIndex) {
          ctx.beginPath();
          ctx.arc(leftX, sy, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
        }
      }

      // Update and draw traveling packets along bezier curves
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed * dt;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const s = pkt.sourceIndex;
        const sy = sourceStartY + s * sourceSpacing;
        const targetX = centerX - baseSphereRadius * 0.55;
        const targetY = centerY + (s - sourceCount / 2) * 22;

        const cp1x = leftX + (centerX - leftX) * 0.45;
        const cp1y = sy;
        const cp2x = leftX + (centerX - leftX) * 0.75;
        const cp2y = targetY;

        // Cubic bezier calculation
        const t = pkt.progress;
        const invT = 1 - t;
        const bx = invT * invT * invT * leftX + 3 * invT * invT * t * cp1x + 3 * invT * t * t * cp2x + t * t * t * targetX;
        const by = invT * invT * invT * sy + 3 * invT * invT * t * cp1y + 3 * invT * t * t * cp2y + t * t * t * targetY;

        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Transform, drift, and project 3D particles to 2D
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      // State-specific behavioral factors
      let proximityThreshold = 38;
      let clusterPull = 0;
      if (workflowState === 'INVESTIGATE') {
        proximityThreshold = 52; // more lines appear
      } else if (workflowState === 'RESPOND') {
        clusterPull = 0.45; // particles gravitate toward threat focal zone
      } else if (workflowState === 'RESOLVED') {
        proximityThreshold = 30; // calmer
      }

      const projected: { x: number; y: number; z: number; size: number; alpha: number; color: string; isThreat: boolean }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Individual organic drift
        p.phi += p.speed;
        p.theta += Math.sin(now * 0.001 + i) * 0.001;

        // Pulsing radial distance
        const rPulse = p.baseRadius + Math.sin(now * 0.0015 + p.clusterAngle) * 12;

        let px = rPulse * Math.sin(p.theta) * Math.cos(p.phi);
        let py = rPulse * Math.sin(p.theta) * Math.sin(p.phi);
        let pz = rPulse * Math.cos(p.theta);

        // RESPOND state: pull threat particles together
        if (p.isThreat && clusterPull > 0) {
          px += (width * 0.12 - px) * clusterPull * 0.1;
          py += (-height * 0.08 - py) * clusterPull * 0.1;
        }

        // 3D rotation: Y then X then Z
        let x1 = px * cosY - pz * sinY;
        let z1 = pz * cosY + px * sinY;
        let y1 = py * cosX - z1 * sinX;
        let z2 = z1 * cosX + py * sinX;
        let x2 = x1 * cosZ - y1 * sinZ;
        let y2 = y1 * cosZ + x1 * sinZ;

        // Perspective camera projection
        const fov = 700;
        const scale = fov / (fov + z2 + 200);
        const screenX = centerX + x2 * scale;
        const screenY = centerY + y2 * scale;

        // Depth cue
        const depthAlpha = Math.max(0.12, Math.min(1, (z2 + baseSphereRadius) / (2 * baseSphereRadius) * 0.85 + 0.15));

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          size: p.size * scale,
          alpha: p.alpha * depthAlpha,
          color: p.color === 'green' ? '#22c55e' : p.color === 'red' ? '#EF4444' : '#FFFFFF',
          isThreat: p.isThreat
        });
      }

      // Draw proximity connection lines between nearby particles
      ctx.lineWidth = 0.75;
      const step = compact ? 3 : 2;
      for (let i = 0; i < projected.length; i += step) {
        const p1 = projected[i];
        if (p1.z < -baseSphereRadius * 0.4) continue; // skip far background

        for (let j = i + 1; j < Math.min(i + 14, projected.length); j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < proximityThreshold * proximityThreshold) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / proximityThreshold) * 0.28 * Math.min(p1.alpha, p2.alpha);
            
            const isHighlighted = (p1.color === '#22c55e' || p2.color === '#22c55e');
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isHighlighted
              ? `rgba(34, 197, 94, ${lineAlpha * 1.5})`
              : `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.stroke();

            // Occasional tiny traveling spark along connection line
            if (i % 7 === 0 && Math.sin(now * 0.003 + i) > 0.85) {
              const sparkT = (Math.sin(now * 0.005 + j) + 1) * 0.5;
              const sx = p1.x + (p2.x - p1.x) * sparkT;
              const sy = p1.y + (p2.y - p1.y) * sparkT;
              ctx.beginPath();
              ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = '#22c55e';
              ctx.fill();
            }
          }
        }
      }

      // Render all particles (sorted by z for depth accuracy)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.size), 0, Math.PI * 2);

        if (p.color === '#22c55e') {
          ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha})`;
          if (p.z > 0) {
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 6;
          }
        } else if (p.color === '#EF4444' && workflowState === 'RESPOND') {
          ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha * 1.2})`;
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw thin arrow pointing from central sphere to RESOLVED output on the right
      const rightExitX = centerX + baseSphereRadius * 0.85;
      const rightExitY = centerY;
      const resolvedTargetX = width * 0.92;

      ctx.beginPath();
      ctx.moveTo(rightExitX, rightExitY);
      ctx.lineTo(resolvedTargetX, rightExitY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw arrow tip
      ctx.beginPath();
      ctx.moveTo(resolvedTargetX - 6, rightExitY - 4);
      ctx.lineTo(resolvedTargetX, rightExitY);
      ctx.lineTo(resolvedTargetX - 6, rightExitY + 4);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [workflowState, compact]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[640px] bg-[#07080A] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center select-none"
    >
      {/* Background radial gradient accent */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_65%)]" />

      {/* Main interactive 3D WebGL / Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />

      {/* ========================================================= */}
      {/* LEFT COLUMN: SOURCE NODES (Data Input Stream)             */}
      {/* ========================================================= */}
      <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
        <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1 flex items-center gap-1.5 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
          <span>DATA STREAMS</span>
        </div>

        {SOURCES.map((src, idx) => {
          const Icon = src.icon;
          const isActive = idx === activeSourceIndex;

          return (
            <motion.div
              key={src.id}
              animate={{
                scale: isActive ? 1.05 : 1,
                borderColor: isActive ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: isActive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(13, 14, 18, 0.85)'
              }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-neutral-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className={`text-[11px] font-bold font-mono tracking-wide ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                  {src.name}
                </span>
                <span className="text-[9px] text-neutral-400 font-medium hidden sm:inline">
                  {src.type}
                </span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] ml-auto animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* FLOATING INVESTIGATION LABELS (Around Particle Sphere)    */}
      {/* ========================================================= */}
      {/* 1. Assembling Evidence (Top Right) */}
      <motion.div
        animate={{
          opacity: workflowState === 'COLLECT' || workflowState === 'TRIAGE' ? 1 : 0.45,
          y: [0, -3, 0]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-14 sm:top-18 right-24 sm:right-36 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0E12]/90 border border-white/10 backdrop-blur-md shadow-xl text-xs"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
        <span className="font-mono text-[11px] text-neutral-200">Assembling evidence...</span>
      </motion.div>

      {/* 2. Correlating Signals (Top Left of sphere) */}
      <motion.div
        animate={{
          opacity: workflowState === 'INVESTIGATE' ? 1 : 0.4,
          y: [0, 3, 0]
        }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute top-16 left-36 sm:left-48 z-20 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0E12]/90 border border-white/10 backdrop-blur-md shadow-xl text-xs"
      >
        <Sparkles className="w-3 h-3 text-[#22c55e]" />
        <span className="font-mono text-[11px] text-neutral-200">Correlating signals...</span>
      </motion.div>

      {/* 3. Analyzing Risk Context (Bottom Left) */}
      <motion.div
        animate={{
          opacity: workflowState === 'TRIAGE' || workflowState === 'INVESTIGATE' ? 1 : 0.45,
          y: [0, -3, 0]
        }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute bottom-16 sm:bottom-20 left-36 sm:left-52 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0E12]/90 border border-white/10 backdrop-blur-md shadow-xl text-xs"
      >
        <Activity className="w-3 h-3 text-[#22c55e]" />
        <span className="font-mono text-[11px] text-neutral-200">Analyzing risk context...</span>
      </motion.div>

      {/* 4. Containing Threat (Bottom Right) */}
      <motion.div
        animate={{
          opacity: workflowState === 'RESPOND' || workflowState === 'RESOLVED' ? 1 : 0.45,
          y: [0, 3, 0]
        }}
        transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
        className="absolute bottom-14 sm:bottom-18 right-24 sm:right-40 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0E12]/90 border border-white/10 backdrop-blur-md shadow-xl text-xs"
      >
        <ShieldAlert className="w-3 h-3 text-[#EF4444]" />
        <span className="font-mono text-[11px] text-neutral-200">Containing threat...</span>
      </motion.div>

      {/* ========================================================= */}
      {/* CENTER WORKFLOW CONTROL (TRIAGE | INVESTIGATE | RESPOND)  */}
      {/* ========================================================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <div className="flex items-center p-1 rounded-xl bg-[#0B0C0E]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          {(['TRIAGE', 'INVESTIGATE', 'RESPOND'] as const).map(mode => {
            const isActive =
              workflowState === mode ||
              (mode === 'TRIAGE' && workflowState === 'COLLECT') ||
              (mode === 'RESPOND' && workflowState === 'RESOLVED');

            return (
              <button
                key={mode}
                onClick={() => setWorkflowState(mode)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{mode}</span>
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Current sub-state micro indicator */}
        <div className="mt-2 text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span>PIPELINE: {workflowState}</span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: RESOLVED CASES OUTPUT                       */}
      {/* ========================================================= */}
      <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-48 sm:w-56 z-20 flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              RESOLVED CASES
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#22c55e] font-semibold">
            {threatCount.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {resolvedCases.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-2.5 rounded-xl bg-[#0D0E12]/90 border border-white/10 backdrop-blur-md shadow-md text-left flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      item.verdict === 'Threat Contained'
                        ? 'bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30'
                        : 'bg-[#22c55e]/20 text-[#4ADE80] border border-[#22c55e]/30'
                    }`}
                  >
                    {item.verdict}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {item.riskScore}% Risk
                  </span>
                </div>

                <p className="text-[11px] font-medium text-white truncate" title={item.target}>
                  {item.target}
                </p>

                <div className="flex items-center justify-between text-[9px] text-neutral-400">
                  <span className="truncate">{item.type}</span>
                  <span className="shrink-0">{item.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pt-1 text-[10px] text-neutral-400 font-mono text-right flex items-center justify-end gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span>Real-time mitigation active</span>
        </div>
      </div>
    </div>
  );
};
