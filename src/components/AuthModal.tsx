import React, { useState } from 'react';
import { Shield, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    setError(null);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess(email);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0D0E12] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-7 relative text-left"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-[#141820] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] mb-4">
          <Shield className="w-5 h-5 stroke-[2.2]" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-1">
          {mode === 'signin' ? 'Sign In to ScamShield' : 'Get Started with ScamShield'}
        </h3>

        <p className="text-xs text-neutral-400 font-normal leading-relaxed mb-6">
          {mode === 'signin'
            ? 'Access your saved threat scans, custom alerting rules, and incident logs.'
            : 'Join over 100,000 users with free essential proactive cybersecurity.'}
        </p>

        {submitted ? (
          <div className="py-6 flex flex-col items-center justify-center gap-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#22c55e] animate-bounce" />
            <p className="text-sm font-semibold text-white">
              {mode === 'signin' ? 'Authenticated successfully' : 'Account activated'}
            </p>
            <span className="text-xs text-neutral-400">Loading your security dashboard...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 mb-1.5">
                Work or Personal Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07080A] border border-white/10 focus:border-[#22c55e]/60 text-white placeholder-neutral-500 text-sm font-mono outline-none transition-colors"
              />
              {error && <span className="text-xs text-[#EF4444] mt-1 block">{error}</span>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-mono text-xs tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{mode === 'signin' ? 'Continue with Email' : 'Create Free Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-neutral-400 font-mono text-center">
              Zero passwords required • Magic secure link • No tracking
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
