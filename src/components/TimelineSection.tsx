import React from 'react';
import { ScamAnalysisResult } from '../types';
import { GitFork, Clock, AlertTriangle, ShieldCheck, ArrowDown, CheckCircle2 } from 'lucide-react';

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

export const TimelineSection: React.FC<TimelineSectionProps> = ({ result }) => {
  const milestones: TimelineMilestone[] = [
    {
      step: '01',
      title: 'Initial Transmission & Perimeter Ingress',
      timeOffset: 'T + 0.00s',
      description: `Inbound communication launched over unsolicited protocol imitating ${result.category}.`,
      status: 'ATTACK_VECTOR',
      defensePoint: 'Automated carrier smishing filters / email spam screening.'
    },
    {
      step: '02',
      title: 'Artificial Urgency & Cognitive Manipulation',
      timeOffset: 'T + 0.45s',
      description: result.redFlags[0] || 'Adversary introduces urgent penalty, account freeze, or irresistible lure to inhibit user verification.',
      status: 'COERCION',
      defensePoint: 'Pause and verify: authentic organizations give at least 30 days notice.'
    },
    {
      step: '03',
      title: 'Redirection to Evasive Credential Capture',
      timeOffset: 'T + 2.10s',
      description: result.detectedUrls.length > 0
        ? `Target is lured toward unverified domain (${result.detectedUrls[0].url}) simulating corporate brand identity.`
        : 'Direct reply solicited requesting OTP, passcode, or sensitive personal data.',
      status: 'EXPLOIT',
      defensePoint: 'Zero-Trust browser sandboxing, password manager domain binding.'
    },
    {
      step: '04',
      title: 'Adversary Extraction or Takeover',
      timeOffset: 'T + 5.00s',
      description: result.isFraud
        ? 'Data exfiltration completes. Unauthorized withdrawals, session hijacking, or identity fraud triggered.'
        : 'Attack thwarted or benign payload verified without adversary action.',
      status: 'OBJECTIVE',
      defensePoint: 'Immediate bank card freeze, password invalidation, and incident filing.'
    }
  ];

  return (
    <div className="space-y-4 mb-6 animate-in fade-in duration-300">
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D7D7D7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDEEE6] flex items-center justify-center">
              <GitFork className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0E0E0E]">KILL-CHAIN ATTACK TIMELINE</h3>
              <p className="text-[11px] text-[#767676] font-mono">
                CHRONOLOGICAL ADVERSARY EXECUTION LIFECYCLE
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ECECEC] font-bold text-[#1B1B1B]">
            4-STAGE PROGRESSION
          </span>
        </div>

        {/* Timeline Stack */}
        <div className="relative pl-6 sm:pl-8 my-6 space-y-6">
          {/* Vertical connecting line */}
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-[#D7D7D7]" />

          {milestones.map((item, index) => (
            <div key={item.step} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-extrabold bg-white shadow-xs ${
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
              <div className="bg-[#F6F6F6] border border-[#D7D7D7] group-hover:border-[#BEBEBE] p-4 rounded-xl transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#EC783B]">
                    STAGE {item.step} // {item.title}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ECECEC] text-[#767676] w-fit">
                    {item.timeOffset}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#1B1B1B] leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Defense recommendation box */}
                <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D7D7D7] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1B8A44] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-mono text-[10px] font-bold text-[#1B8A44] uppercase block">
                      DEFENSE INTERVENTION POINT:
                    </span>
                    <span className="text-[#4A4A4A] font-medium">{item.defensePoint}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
