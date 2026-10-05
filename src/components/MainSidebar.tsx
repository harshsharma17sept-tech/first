import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  ShieldCheck,
  Radio,
  History,
  Wrench,
  BookOpen,
  Settings
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export interface SidebarNavProps {
  activeTab: string;
  onNavigate: (key: string) => void;
  onOpenSettings: () => void;
}

export const MainSidebar: React.FC<SidebarNavProps> = ({
  activeTab,
  onNavigate,
  onOpenSettings
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home, targetSection: 'page-1' },
    { id: 'scan', label: 'Scan', icon: ShieldCheck, targetSection: 'page-1' },
    { id: 'intelligence', label: 'Threat Intelligence', icon: Radio, targetSection: 'page-1' },
    { id: 'history', label: 'History', icon: History, targetSection: 'history-tab' },
    { id: 'tools', label: 'Tools', icon: Wrench, targetSection: 'page-2' },
    { id: 'learn', label: 'Learn', icon: BookOpen, targetSection: 'page-4' },
    { id: 'settings', label: 'Settings', icon: Settings, isAction: true }
  ];

  return (
    <nav
      className="hidden lg:flex flex-col w-52 shrink-0 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#D7D7D7] rounded-2xl p-2.5 shadow-xs h-fit sticky top-20 select-none z-10"
      aria-label="Application Navigation"
    >
      <div className="flex flex-col gap-1">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => {
                triggerHaptic('light');
                if (item.isAction) {
                  onOpenSettings();
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#FDEEE6] text-[#EC783B] shadow-2xs font-extrabold'
                  : 'text-[#4A4A4A] hover:bg-[#F6F6F6] hover:text-[#0E0E0E]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#EC783B]' : 'text-[#767676]'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EC783B]" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
