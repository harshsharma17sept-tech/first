import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Search,
  Sparkles,
  Settings,
  Bell,
  CheckCircle2,
  Users,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from './SettingsModal';
import { triggerHaptic } from '../utils/haptics';

interface TopNavbarProps {
  isPro: boolean;
  userProfile: UserProfile;
  unreadNotifications?: number;
  onOpenSettings: () => void;
  onOpenPro: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  isPro,
  userProfile,
  unreadNotifications = 2,
  onOpenSettings,
  onOpenPro,
  onOpenSearch,
  onOpenNotifications
}) => {
  const getInitials = (str: string) => {
    return (
      str
        .split(' ')
        .map(n => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'HS'
    );
  };

  return (
    <header className="w-full bg-[#FFFFFF]/90 backdrop-blur-md border border-[#D7D7D7] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs mb-3 flex items-center justify-between gap-3 sticky top-2 z-40">
      {/* Left: Brand & Motto */}
      <div className="flex items-center gap-3 shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => triggerHaptic('light')}
          className="w-9 h-9 rounded-xl bg-[#0E0E0E] flex items-center justify-center text-[#EC783B] shadow-xs shrink-0 cursor-pointer"
        >
          <Shield className="w-4 h-4 text-[#EC783B] stroke-[2.5]" />
        </motion.div>

        <div className="flex flex-col">
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0E0E0E] leading-none">
            ScamShield
          </span>
          <span className="text-[10px] text-[#767676] font-medium tracking-tight mt-0.5 hidden sm:block">
            Smarter Detection. Safer Tomorrows.
          </span>
        </div>
      </div>

      {/* Center: Search Bar with ⌘K shortcut */}
      <div className="flex-1 max-w-xl mx-auto hidden md:block">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenSearch();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F6F6F6] hover:bg-[#EFEFEF] border border-[#D7D7D7] text-left transition-colors text-xs text-[#767676] cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-3.5 h-3.5 text-[#8A8A8A] group-hover:text-[#0E0E0E] transition-colors shrink-0" />
            <span className="truncate">Search features, scan history, or learn about scams...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E8E8E8] text-[#4A4A4A] border border-[#CECECE] shrink-0 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Pro, Profile, Settings, Bell, Safer Internet Tag */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Pro Pill */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => {
            triggerHaptic('light');
            onOpenPro();
          }}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border shadow-2xs cursor-pointer ${
            isPro
              ? 'bg-[#E9F5ED] text-[#1B8A44] border-[#A5D8B4]'
              : 'bg-[#FDEEE6] text-[#EC783B] border-[#F6AB83] hover:bg-[#FCD8C7]'
          }`}
        >
          {isPro ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8A44]" />
              <span className="hidden sm:inline">Pro</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#EC783B]" />
              <span>Pro</span>
            </>
          )}
        </motion.button>

        {/* User Profile Pill */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#F6F6F6] hover:bg-[#ECECEC] border border-[#D7D7D7] cursor-pointer"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-xs"
            style={{ backgroundColor: userProfile.avatarColor || '#EC783B' }}
          >
            {getInitials(userProfile.name)}
          </div>
          <span className="text-xs font-bold text-[#0E0E0E] hidden sm:inline max-w-[80px] truncate">
            {userProfile.name.split(' ')[0]}
          </span>
        </motion.button>

        {/* Settings Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          aria-label="Settings"
          className="w-8 h-8 rounded-xl bg-[#F6F6F6] hover:bg-[#ECECEC] border border-[#D7D7D7] flex items-center justify-center text-[#4A4A4A] hover:text-[#0E0E0E] transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
        </motion.button>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => {
            triggerHaptic('light');
            onOpenNotifications();
          }}
          aria-label="Notifications"
          className="w-8 h-8 rounded-xl bg-[#F6F6F6] hover:bg-[#ECECEC] border border-[#D7D7D7] flex items-center justify-center text-[#4A4A4A] hover:text-[#0E0E0E] transition-colors cursor-pointer relative"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EC783B]" />
          )}
        </motion.button>
      </div>
    </header>
  );
};
