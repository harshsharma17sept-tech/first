import React from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Image as ImageIcon,
  QrCode,
  FileText,
  Link2,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export interface SecurityTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

interface ToolsSectionProps {
  onSelectTool: (toolId: string) => void;
  onViewAllTools?: () => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
  onSelectTool,
  onViewAllTools
}) => {
  const tools: SecurityTool[] = [
    {
      id: 'phone-lookup',
      title: 'Phone Number Lookup',
      description: 'Check unknown numbers and avoid spam calls.',
      icon: Phone,
      tag: 'Caller ID'
    },
    {
      id: 'screenshot-analysis',
      title: 'Screenshot Analysis',
      description: 'Scan images for scams and fake messages.',
      icon: ImageIcon,
      tag: 'OCR Vision'
    },
    {
      id: 'qr-scanner',
      title: 'QR Code Scanner',
      description: 'Analyze QR codes before you scan.',
      icon: QrCode,
      tag: 'Anti-Quishing'
    },
    {
      id: 'file-scanner',
      title: 'File & Email Scanner',
      description: 'Detect malicious files and phishing emails.',
      icon: FileText,
      tag: 'Malware Sandbox'
    },
    {
      id: 'link-reputation',
      title: 'Link Reputation',
      description: 'Check if a link is safe before you open.',
      icon: Link2,
      tag: 'Zero-Day URL'
    },
    {
      id: 'browser-protection',
      title: 'Browser Extension',
      description: 'Real-time protection while you browse.',
      icon: ShieldCheck,
      tag: 'Passive Shield'
    }
  ];

  return (
    <section id="tools" className="relative py-20 bg-[#07080A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0F14] border border-white/10 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
                OUR TOOLS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Everything you need to stay safe.
            </h2>
          </div>

          <button
            onClick={onViewAllTools}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-300 hover:text-[#22c55e] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Clean Tools Grid matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                onClick={() => onSelectTool(tool.id)}
                className="group p-6 rounded-2xl bg-[#0B0D11] hover:bg-[#0F1217] border border-white/[0.08] hover:border-[#22c55e]/30 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[175px] text-left shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#141820] border border-white/10 group-hover:border-[#22c55e]/40 flex items-center justify-center text-[#22c55e] transition-colors shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#22c55e] text-neutral-400 group-hover:text-black flex items-center justify-center transition-all">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#22c55e] transition-colors tracking-tight mb-1">
                    {tool.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>{tool.tag}</span>
                  <span className="text-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity">
                    Launch Tool →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
