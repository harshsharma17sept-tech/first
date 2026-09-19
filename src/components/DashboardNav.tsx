import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisTab } from '../types';
import { ShieldCheck, Network, GitFork, History } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface DashboardNavProps {
  activeTab: AnalysisTab;
  historyCount: number;
  onTabChange: (tab: AnalysisTab) => void;
}

interface NavItem {
  id: AnalysisTab;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  activeTab,
  historyCount,
  onTabChange
}) => {
  const navItems: NavItem[] = [
    {
      id: 'OVERVIEW',
      title: 'Threat Scanner',
      subtitle: 'Scan SMS, Email & Links',
      icon: ShieldCheck
    },
    {
      id: 'GRAPH',
      title: 'Attack Graph',
      subtitle: 'Threat Vector Topology',
      icon: Network
    },
    {
      id: 'TIMELINE',
      title: 'Kill–Chain Analysis',
      subtitle: 'Progression & Defense',
      icon: GitFork
    },
    {
      id: 'HISTORY',
      title: 'Threat Archive',
      subtitle: 'Scan Logs & Audits',
      icon: History
    }
  ];

  return (
    <nav className="w-full mb-4" aria-label="Security Dashboard Navigation">
      {/* 4 Clickable Smooth Animated Dashboard Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.25,
                ease: 'easeOut'
              }}
              whileHover={{
                y: -3,
                transition: { type: 'spring', stiffness: 450, damping: 22 }
              }}
              whileTap={{
                scale: 0.97,
                transition: { type: 'spring', stiffness: 500, damping: 25 }
              }}
              onClick={() => {
                triggerHaptic(isActive ? 'light' : 'medium');
                onTabChange(item.id);
              }}
              className={`group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl text-left select-none cursor-pointer min-h-[74px] sm:min-h-[82px] justify-between transition-all duration-200 border-2 overflow-hidden ${
                isActive
                  ? 'bg-[#FFFFFF] border-[#EC783B] shadow-[0_6px_20px_rgba(236,120,59,0.15)] ring-2 ring-[#EC783B]/20'
                  : 'bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#C8C8C8] shadow-xs'
              }`}
            >
              {/* Top Row: Icon + Live Status / Badge */}
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FDEEE6] text-[#EC783B] scale-105 shadow-xs'
                      : 'bg-[#F6F6F6] text-[#767676] group-hover:bg-[#ECECEC] group-hover:text-[#0E0E0E]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {item.id === 'HISTORY' && historyCount > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#EC783B] text-black shadow-xs'
                        : 'bg-[#ECECEC] text-[#4A4A4A]'
                    }`}
                  >
                    {historyCount} {historyCount === 1 ? 'log' : 'logs'}
                  </span>
                ) : (
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC783B] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EC783B]" />
                        </span>
                        <span className="text-[10px] font-bold text-[#EC783B] uppercase tracking-wider hidden sm:inline">
                          Active
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Bottom Row: Title + Subtitle */}
              <div className="mt-2.5 w-full">
                <div
                  className={`text-xs sm:text-sm font-bold leading-tight transition-colors duration-150 ${
                    isActive ? 'text-[#0E0E0E]' : 'text-[#4A4A4A] group-hover:text-[#0E0E0E]'
                  }`}
                >
                  {item.title}
                </div>
                <div className="text-[11px] text-[#767676] font-medium leading-tight mt-0.5 truncate">
                  {item.subtitle}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
