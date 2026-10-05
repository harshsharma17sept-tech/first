import React from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Image as ImageIcon,
  QrCode,
  FileText,
  Link2,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export interface SecurityToolItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

interface FeaturesSectionProps {
  onSelectTool: (toolId: string) => void;
  onViewAllTools?: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onSelectTool,
  onViewAllTools
}) => {
  const tools: SecurityToolItem[] = [
    {
      id: 'phone-lookup',
      title: 'Phone Number Lookup',
      subtitle: 'Check unknown numbers',
      icon: Phone,
      color: '#EC783B'
    },
    {
      id: 'screenshot-analysis',
      title: 'Screenshot Analysis',
      subtitle: 'Scan images for scams',
      icon: ImageIcon,
      color: '#EC783B'
    },
    {
      id: 'qr-scanner',
      title: 'QR Code Scanner',
      subtitle: 'Analyze QR codes',
      icon: QrCode,
      color: '#EC783B'
    },
    {
      id: 'file-scanner',
      title: 'File & Email Scanner',
      subtitle: 'Detect malicious files',
      icon: FileText,
      color: '#EC783B'
    },
    {
      id: 'link-reputation',
      title: 'Link Reputation',
      subtitle: 'Check unsafe links',
      icon: Link2,
      color: '#EC783B'
    },
    {
      id: 'browser-extension',
      title: 'Browser Extension',
      subtitle: 'Real-time protection',
      icon: ShieldAlert,
      color: '#1B8A44',
      badge: 'Active'
    }
  ];

  return (
    <section
      id="page-2"
      className="w-full my-12 scroll-mt-20 relative"
      aria-label="Security Tools & Features"
    >
      {/* Background Ambient Card Frame */}
      <div className="bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#D7D7D7] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Watermark in background matching reference image */}
        <div className="absolute right-4 bottom-3 text-right pointer-events-none select-none opacity-20 hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#767676]">
            TOOLS THAT KEEP YOU ONE STEP AHEAD
          </p>
        </div>

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#EC783B] tracking-wider uppercase mb-1.5">
              <span>◇</span>
              <span>OUR TOOLS</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0E0E0E]">
              Everything you need to stay safe
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium leading-relaxed max-w-2xl mt-1">
              Powerful tools to detect, analyze, and prevent online scams — all in one place.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            onClick={() => {
              triggerHaptic('light');
              if (onViewAllTools) onViewAllTools();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#EC783B] bg-[#FDEEE6]/60 hover:bg-[#FDEEE6] text-[#EC783B] font-bold text-xs transition-colors shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* 6 Responsive Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.button
                key={tool.id}
                type="button"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{
                  y: -3,
                  borderColor: '#EC783B',
                  boxShadow: '0 8px 24px rgba(236,120,59,0.12)'
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectTool(tool.id);
                }}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D7D7D7] hover:border-[#EC783B] text-left transition-all duration-200 cursor-pointer min-h-[105px] shadow-2xs"
              >
                {/* Top Row: Icon + Arrow */}
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-xl bg-[#FDEEE6] text-[#EC783B] flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#A0A0A0] group-hover:text-[#EC783B] group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Bottom Row: Title + Subtitle */}
                <div className="mt-3">
                  <div className="text-xs font-bold text-[#0E0E0E] group-hover:text-[#EC783B] transition-colors leading-tight truncate">
                    {tool.title}
                  </div>
                  <div className="text-[11px] text-[#767676] font-medium leading-tight mt-0.5 truncate">
                    {tool.subtitle}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
