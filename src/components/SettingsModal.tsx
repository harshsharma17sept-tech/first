import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Shield, Sparkles, Check, Bell, Cpu, Globe, Trash2, Eye, Info } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarColor: string;
}

export interface SecuritySettings {
  deepAiAnalysis: boolean;
  realtimeUrlCheck: boolean;
  enable3dBackground: boolean;
  hapticFeedback: boolean;
  autoLogScans: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  settings: SecuritySettings;
  onSaveSettings: (settings: SecuritySettings) => void;
  onClearHistory: () => void;
}

const AVATAR_COLORS = [
  '#EC783B', // Orange
  '#1B8A44', // Green
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#0E0E0E'  // Charcoal
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  settings,
  onSaveSettings,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [avatarColor, setAvatarColor] = useState(userProfile.avatarColor);
  const [secSettings, setSecSettings] = useState<SecuritySettings>(settings);
  const [savedToast, setSavedToast] = useState(false);
  const [showAiInfoTooltip, setShowAiInfoTooltip] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      name: name.trim() || 'Security Analyst',
      email: email.trim() || 'analyst@scamshield.com',
      role: role.trim() || 'Security Operator',
      avatarColor
    });
    onSaveSettings(secSettings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#D7D7D7] flex items-center justify-between bg-[#F6F6F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0E0E0E] flex items-center justify-center text-white">
              <User className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0E0E0E]">
                User Settings & Profile
              </h2>
              <p className="text-xs text-[#767676]">
                Manage account profile and workstation preferences
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] text-[#4A4A4A] transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D7D7D7] px-4 pt-2 bg-[#F6F6F6]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#EC783B] text-[#0E0E0E]'
                : 'border-transparent text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Information</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'security'
                ? 'border-[#EC783B] text-[#0E0E0E]'
                : 'border-transparent text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Protection & View</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'profile' ? (
            <div className="space-y-4">
              {/* Avatar Preview & Color Selection */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7]">
                <div
                  style={{ backgroundColor: avatarColor }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0 transition-colors"
                >
                  {getInitials(name)}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0E0E0E] mb-1">
                    Avatar Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAvatarColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          avatarColor === color ? 'scale-125 ring-2 ring-offset-2 ring-black' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A4A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-[#FFFFFF] border border-[#D7D7D7] focus:border-[#EC783B] focus:ring-1 focus:ring-[#EC783B] outline-none text-[#0E0E0E] font-medium"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A4A] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-[#FFFFFF] border border-[#D7D7D7] focus:border-[#EC783B] focus:ring-1 focus:ring-[#EC783B] outline-none text-[#0E0E0E] font-medium"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Role / Organization */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A4A] mb-1">
                  Security Role or Title
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-[#FFFFFF] border border-[#D7D7D7] focus:border-[#EC783B] focus:ring-1 focus:ring-[#EC783B] outline-none text-[#0E0E0E] font-medium"
                    placeholder="e.g. Threat Analyst / Personal User"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 3D Background Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7]">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-[#EC783B]" />
                  <div>
                    <span className="text-xs font-bold text-[#0E0E0E] block">
                      3D Interactive Cyber Background
                    </span>
                    <span className="text-[11px] text-[#767676]">
                      Realistic WebGL particle shield reacting to cursor movement
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={secSettings.enable3dBackground}
                  onChange={e =>
                    setSecSettings(prev => ({ ...prev, enable3dBackground: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#EC783B] cursor-pointer"
                />
              </div>

              {/* Deep AI Analysis Toggle with Info Tooltip */}
              <div className="p-3 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#EC783B]" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0E0E0E]">
                          Deep AI Analysis
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAiInfoTooltip(prev => !prev)}
                          onMouseEnter={() => setShowAiInfoTooltip(true)}
                          onMouseLeave={() => setShowAiInfoTooltip(false)}
                          className="p-0.5 rounded-full text-[#767676] hover:text-[#EC783B] hover:bg-black/5 transition-colors cursor-pointer"
                          aria-label="Compare local heuristic engine with server-side AI evaluation"
                          title="Click to view Local Heuristics vs Server-Side AI comparison"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#767676] block">
                        Multimodal neural evaluation for deceptive conversational nuance
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={secSettings.deepAiAnalysis}
                    onChange={e =>
                      setSecSettings(prev => ({ ...prev, deepAiAnalysis: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#EC783B] cursor-pointer"
                  />
                </div>

                {/* Info Tooltip: Explaining how local heuristic engine compares with server-side AI evaluation */}
                <AnimatePresence>
                  {showAiInfoTooltip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-[#E5E5E5] pt-2 text-[#4A4A4A] leading-relaxed"
                    >
                      <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#D7D7D7] text-[11px] space-y-1.5 shadow-2xs">
                        <div className="font-bold text-[#0E0E0E] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EC783B]" />
                          Local Heuristic Engine vs. Server-Side AI Evaluation:
                        </div>
                        <div>
                          <span className="font-bold text-[#0E0E0E]">Local Heuristic Engine:</span> Evaluates instantaneously in your browser using deterministic pattern signatures, regular expressions, known lure lists, and URL entropy matrices. It runs completely offline with 0ms network latency and zero external data transmission (total data sovereignty).
                        </div>
                        <div>
                          <span className="font-bold text-[#0E0E0E]">Server-Side AI Evaluation:</span> Powers deep cognitive inspection using Gemini neural models to analyze subtle linguistic urgency, semantic coercion, impersonation pretexts, and novel zero-day fraud tactics that have no existing signature.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Real-time URL Check */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7]">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#1B8A44]" />
                  <div>
                    <span className="text-xs font-bold text-[#0E0E0E] block">
                      Phishing URL Sandboxing
                    </span>
                    <span className="text-[11px] text-[#767676]">
                      Checks suspicious domains, shorteners, and spoofed TLDs
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={secSettings.realtimeUrlCheck}
                  onChange={e =>
                    setSecSettings(prev => ({ ...prev, realtimeUrlCheck: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#EC783B] cursor-pointer"
                />
              </div>

              {/* Auto Log Scans */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7]">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[#4A4A4A]" />
                  <div>
                    <span className="text-xs font-bold text-[#0E0E0E] block">
                      Auto-Save Threat History
                    </span>
                    <span className="text-[11px] text-[#767676]">
                      Keeps private local history of verified and flagged scans
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={secSettings.autoLogScans}
                  onChange={e =>
                    setSecSettings(prev => ({ ...prev, autoLogScans: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#EC783B] cursor-pointer"
                />
              </div>

              {/* Clear History Danger Zone */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#F5AAAA] bg-[#FDEAEA] text-[#D32F2F] text-xs font-bold hover:bg-[#FCDCDC] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Stored Threat History</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#D7D7D7] bg-[#F6F6F6] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-[#4A4A4A] hover:text-[#0E0E0E] transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0E0E0E] text-white font-bold text-xs shadow-sm hover:bg-[#2B2B2B] transition-all"
          >
            {savedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1B8A44]" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
