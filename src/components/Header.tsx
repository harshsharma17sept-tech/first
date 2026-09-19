import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Settings, CheckCircle2 } from 'lucide-react';
import { UserProfile } from './SettingsModal';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  isPro: boolean;
  userProfile: UserProfile;
  onOpenSettings: () => void;
  onOpenPro: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPro,
  userProfile,
  onOpenSettings,
  onOpenPro
}) => {
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map(n => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'SS';
  };

  return (
    <header className="w-full bg-[#FFFFFF]/80 backdrop-blur-md border border-[#D7D7D7] rounded-2xl px-4 py-3 shadow-xs mb-4 flex items-center justify-between">
      {/* Brand & Live Status */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => triggerHaptic('light')}
          className="w-9 h-9 rounded-xl bg-[#0E0E0E] flex items-center justify-center text-[#EC783B] shadow-xs shrink-0 cursor-pointer"
        >
          <Shield className="w-4 h-4 text-[#EC783B] stroke-[2.5]" />
        </motion.div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0E0E0E]">
              ScamShield
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECECEC] text-[#4A4A4A]">
              Security
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B8A44] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B8A44]"></span>
            </span>
            <span className="text-[11px] text-[#767676] font-medium">
              Real-Time Defense Active
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Pro Pill & Profile Settings */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => {
            triggerHaptic('light');
            onOpenPro();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border shadow-2xs ${
            isPro
              ? 'bg-[#E9F5ED] text-[#1B8A44] border-[#A5D8B4]'
              : 'bg-[#FDEEE6] text-[#EC783B] border-[#F6AB83] hover:bg-[#FCD8C7]'
          }`}
        >
          {isPro ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8A44]" />
              <span className="hidden sm:inline">Pro Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#EC783B]" />
              <span>Pro</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#F6F6F6] hover:bg-[#ECECEC] border border-[#D7D7D7] transition-all group cursor-pointer"
          title="Account Settings"
        >
          <div
            style={{ backgroundColor: userProfile.avatarColor }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-2xs"
          >
            {getInitials(userProfile.name)}
          </div>
          <span className="text-xs font-semibold text-[#0E0E0E] hidden sm:inline">
            {userProfile.name.split(' ')[0]}
          </span>
          <Settings className="w-3.5 h-3.5 text-[#767676] group-hover:rotate-45 transition-transform" />
        </motion.button>
      </div>
    </header>
  );
};
