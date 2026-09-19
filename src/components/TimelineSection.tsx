import React from 'react';
import { motion } from 'motion/react';
import { ScamAnalysisResult } from '../types';
import { GitFork, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TimelineSectionProps {
  result: ScamAnalysisResult;
}

interface TimelineMilestone {
  step: string;
  title: string;
  timeOffset: string;
  description: string;
  status: 'ATTACK_VECTOR' | 'COERCION' | 'EXPLOIT' | 'OBJECTIVE';
  defensePoint: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -16, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 24,
      mass: 0.8
    }
  }
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({ result }) => {
  const milestones: TimelineMilestone[] = [
    {
      step: '1',
      title: 'Initial Inbound Transmission',
      timeOffset: 'Instant (0.0s)',
      description: `Unsolicited message sent via direct push simulating ${result.category}.`,
      status: 'ATTACK_VECTOR',
      defensePoint: 'Automated carrier spam filtering and phone number lookup.'
    },
    {
      step: '2',
      title: 'Urgency & Psychological Coercion',
      timeOffset: '+0.5s',
      description: result.redFlags[0] || 'Adversary introduces urgent penalty or account freeze to inhibit verification.',
      status: 'COERCION',
      defensePoint: 'Pause and verify directly through official verified channels or customer support.'
    },
    {
      step: '3',
      title: 'Redirection to Fake Portal or Data Request',
      timeOffset: '+2.0s',
      description: result.detectedUrls.length > 0
        ? `Recipient redirected toward unverified link (${result.detectedUrls[0].url}) simulating trusted brand.`
        : 'Direct reply solicited requesting OTP, password, or sensitive financial data.',
      status: 'EXPLOIT',
      defensePoint: 'Check URL domain carefully and avoid entering credentials on unverified websites.'
    },
    {
      step: '4',
      title: 'Resolution or Adversary Extraction',
      timeOffset: '+5.0s',
      description: result.isFraud
        ? 'Data exfiltration occurs if recipient responds. Unauthorized withdrawals or account compromise triggered.'
        : 'Attack avoided or benign message verified safely.',
      status: 'OBJECTIVE',
      defensePoint: 'Immediate password reset, two-factor authentication reset, and bank notification.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mb-6"
    >
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 sm:p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ECECEC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E0E0E] flex items-center justify-center text-white">
              <GitFork className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0E0E0E]">
                Progression & Kill-Chain Timeline
              </h3>
              <p className="text-xs text-[#767676]">
                Sequential stages of deceptive communications and targeted defenses
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-lg bg-[#ECECEC] font-bold text-[#1B1B1B]">
            4-Stage Attack Lifecycle
          </span>
        </div>

        {/* Timeline Stack with Staggered Scroll Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          className="relative pl-6 sm:pl-8 my-6 space-y-6"
        >
          {/* Vertical connecting line */}
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-[#D7D7D7]" />

          {milestones.map((item, index) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="relative group"
            >
              {/* Timeline marker node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold bg-white shadow-xs ${
                  result.isFraud
                    ? index === 3
                      ? 'border-[#D32F2F] text-[#D32F2F]'
                      : 'border-[#EC783B] text-[#EC783B]'
                    : 'border-[#1B8A44] text-[#1B8A44]'
                }`}
              >
                {item.step}
              </div>

              {/* Milestone Content Card */}
              <motion.div
                whileHover={{ y: -1 }}
                className="bg-[#F6F6F6] border border-[#D7D7D7] group-hover:border-[#BEBEBE] p-4 rounded-xl transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold text-[#EC783B]">
                    Stage {item.step} • {item.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#ECECEC] text-[#767676] font-medium w-fit">
                    {item.timeOffset}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#1B1B1B] leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Defense recommendation box */}
                <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D7D7D7] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#1B8A44] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="text-[11px] font-bold text-[#1B8A44] uppercase tracking-wider block mb-0.5">
                      Safe Defense Action:
                    </span>
                    <span className="text-[#4A4A4A] font-medium">{item.defensePoint}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
