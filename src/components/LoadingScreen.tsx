import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Cpu, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Loading Security Modules...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Syncing Threat Intelligence Signatures...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Calibrating Neural Scam Detection Matrix...');
    }, 850);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('System Armed & Protected');
    }, 1300);

    const t4 = setTimeout(() => {
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E4E4E4] text-[#0E0E0E] px-4"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Animated Shield Icon */}
        <div className="relative mb-6">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-20 h-20 rounded-2xl bg-[#0E0E0E] flex items-center justify-center text-[#EC783B] shadow-xl border border-[#BEBEBE]"
          >
            <Shield className="w-10 h-10 text-[#EC783B] stroke-[2.2]" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border-2 border-[#EC783B] pointer-events-none"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-black tracking-tight text-[#0E0E0E] mb-1">
          ScamShield
        </h1>
        <p className="text-xs font-semibold text-[#767676] tracking-wide mb-6">
          Personal Cybersecurity & Threat Intelligence
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#D7D7D7] h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-[#EC783B] to-[#D9662B] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4A4A4A] min-h-[20px]">
          {progress === 100 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8A44]" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Cpu className="w-3.5 h-3.5 text-[#EC783B]" />
            </motion.div>
          )}
          <span>{statusText}</span>
        </div>
      </div>
    </motion.div>
  );
};
