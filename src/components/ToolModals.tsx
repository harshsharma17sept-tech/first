import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Phone,
  Image as ImageIcon,
  QrCode,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Upload,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface ToolModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onRunTestScenario: (content: string, mode: 'SMS' | 'URL' | 'EMAIL') => void;
}

export const ToolModals: React.FC<ToolModalsProps> = ({
  activeModal,
  onClose,
  onRunTestScenario
}) => {
  // Search modal state
  const [searchQuery, setSearchQuery] = useState('');

  // Phone lookup state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneResult, setPhoneResult] = useState<string | null>(null);

  // QR state
  const [qrInput, setQrInput] = useState('');

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#D7D7D7] shadow-2xl p-6 text-left overflow-hidden select-none"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F6F6F6] hover:bg-[#ECECEC] flex items-center justify-center text-[#767676] hover:text-[#0E0E0E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 1. Command Palette / Search Modal */}
          {activeModal === 'search' && (
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-[#ECECEC] pr-8">
                <Search className="w-5 h-5 text-[#EC783B]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search features, scans, threat vectors..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#0E0E0E] outline-hidden placeholder:text-[#A0A0A0]"
                />
              </div>

              <div className="mt-4 flex flex-col gap-2 max-h-72 overflow-y-auto">
                <div className="text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-1">
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onRunTestScenario(
                      'Chase Alert: Unusual withdrawal of $940.50 detected. Verify immediately at: https://chase-security-verify.xyz/login',
                      'SMS'
                    );
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F6F6F6] text-left text-xs font-bold text-[#0E0E0E] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#EC783B]" />
                    <span>Run Bank Phishing Scan</span>
                  </div>
                  <span className="text-[10px] text-[#767676] bg-[#ECECEC] px-1.5 py-0.5 rounded">Preset</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onRunTestScenario(
                      'USPS Notice: Your package US-892401-K cannot be dispatched due to an unpaid $1.99 redelivery fee: http://192.168.1.105/usps/track',
                      'SMS'
                    );
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F6F6F6] text-left text-xs font-bold text-[#0E0E0E] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#EC783B]" />
                    <span>Run Package Delivery Scam Scan</span>
                  </div>
                  <span className="text-[10px] text-[#767676] bg-[#ECECEC] px-1.5 py-0.5 rounded">Preset</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('page-3');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F6F6F6] text-left text-xs font-bold text-[#0E0E0E] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#EC783B]" />
                    <span>Explore Global Threat Map</span>
                  </div>
                  <span className="text-[10px] text-[#767676] bg-[#ECECEC] px-1.5 py-0.5 rounded">Page 3</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Phone Number Lookup */}
          {activeModal === 'phone-lookup' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FDEEE6] text-[#EC783B] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0E0E0E]">Phone Number Lookup</h3>
                  <p className="text-xs text-[#767676]">Verify if a caller or SMS sender has scam reports</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter phone number e.g. +1 (800) 555-0199"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D7D7] bg-[#F9F9F9] text-sm text-[#0E0E0E] outline-hidden focus:border-[#EC783B]"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      setPhoneResult(
                        'HIGH RISK: 48 community reports flagging automated IRS / Banking voice fraud originating from this spoofed VOIP prefix.'
                      );
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#EC783B] text-black font-extrabold text-xs hover:bg-[#D9662B] transition-colors cursor-pointer"
                  >
                    Check Database
                  </button>
                  <button
                    onClick={() => {
                      setPhoneNumber('+1 (888) 492-3841');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-[#F6F6F6] text-xs font-semibold text-[#4A4A4A] hover:bg-[#ECECEC] cursor-pointer"
                  >
                    Use Sample
                  </button>
                </div>

                {phoneResult && (
                  <div className="p-3.5 rounded-xl bg-[#FBE8E8] border border-[#F5C2C2] text-xs text-[#D32F2F] font-semibold mt-3">
                    {phoneResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Screenshot Analysis */}
          {activeModal === 'screenshot-analysis' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FDEEE6] text-[#EC783B] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0E0E0E]">Screenshot Analysis</h3>
                  <p className="text-xs text-[#767676]">Scan images, receipts, and invoice screenshots for fraud</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl border-2 border-dashed border-[#D7D7D7] hover:border-[#EC783B] bg-[#F9F9F9] flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-[#EC783B] mb-2" />
                <span className="text-xs font-extrabold text-[#0E0E0E]">Drop screenshot or click to upload</span>
                <span className="text-[11px] text-[#767676] mt-1">Supports PNG, JPG, WebP up to 10MB</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onRunTestScenario(
                    '[IMAGE OCR INVOICE]: Geek Squad BestBuy auto-renewal charge of $499.00 processed. Call toll-free 1-800-FAKE-NUM within 24h to cancel.',
                    'EMAIL'
                  );
                }}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#0E0E0E] text-white font-extrabold text-xs hover:bg-[#252525] transition-colors cursor-pointer"
              >
                Scan Demo Geek Squad Invoice Screenshot
              </button>
            </div>
          )}

          {/* 4. QR Code Scanner */}
          {activeModal === 'qr-scanner' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FDEEE6] text-[#EC783B] flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0E0E0E]">QR Code Scanner</h3>
                  <p className="text-xs text-[#767676]">Detect Quishing (QR Phishing) and malicious redirect links</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Paste decoded QR URL or target payload..."
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D7D7] bg-[#F9F9F9] text-sm text-[#0E0E0E] outline-hidden focus:border-[#EC783B]"
                />

                <button
                  onClick={() => {
                    onClose();
                    onRunTestScenario(
                      'https://parking-meter-pay-qr-fraud.info/checkout?lot=882',
                      'URL'
                    );
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#EC783B] text-black font-extrabold text-xs hover:bg-[#D9662B] transition-colors cursor-pointer"
                >
                  Analyze Parking Meter QR Threat
                </button>
              </div>
            </div>
          )}

          {/* 5. Community Modal */}
          {activeModal === 'community' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#0E0E0E] text-[#EC783B] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0E0E0E]">ScamShield Community</h3>
                  <p className="text-xs text-[#767676]">Join 10,000+ defenders and analysts</p>
                </div>
              </div>

              <p className="text-xs text-[#4A4A4A] leading-relaxed mb-4">
                Our global Discord and security working group shares real-time zero-day scam reports, bank impersonation campaigns, and crowdsourced threat intelligence.
              </p>

              <div className="p-3.5 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7] space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#767676] font-medium">Discord Server</span>
                  <span className="font-bold text-[#1B8A44]">● 1,420 Online Now</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#767676] font-medium">Weekly Community Briefing</span>
                  <span className="font-bold text-[#0E0E0E]">Every Thursday 18:00 UTC</span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#EC783B] text-black font-extrabold text-xs hover:bg-[#D9662B] transition-colors cursor-pointer"
              >
                Join Official Discord
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
