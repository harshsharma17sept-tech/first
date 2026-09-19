import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  threatScannedCount: number;
}

export const Hero: React.FC<HeroProps> = ({ threatScannedCount }) => {
  return (
    <div className="mb-4">
      {/* Clean & Elegant Minimalist Hero */}
      <div className="bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#D7D7D7] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0E0E0E]">
              Verify before you click or reply.
            </h1>
            <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium leading-relaxed max-w-xl">
              Detect deceptive sender identities, urgent financial pressure, and malicious links across SMS, emails, and web pages.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#767676] bg-[#F6F6F6] px-3 py-2 rounded-xl border border-[#D7D7D7] shrink-0 self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-[#1B8A44] shrink-0" />
            <span className="font-semibold text-[#0E0E0E]">{threatScannedCount} Scans Evaluated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
