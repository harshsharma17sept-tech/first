// Subtle haptic feedback emulation: combines Vibration API (mobile) + soft Web Audio micro-pop (desktop)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export type HapticStyle = 'light' | 'medium' | 'success' | 'warning';

/**
 * Triggers physical haptic feedback and gentle tactile acoustic micro-feedback.
 */
export function triggerHaptic(style: HapticStyle = 'light'): void {
  // 1. Mobile Physical Vibration if supported
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      switch (style) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(18);
          break;
        case 'success':
          navigator.vibrate([12, 40, 15]);
          break;
        case 'warning':
          navigator.vibrate([25, 50, 25]);
          break;
      }
    }
  } catch {
    // Ignore if vibration is restricted
  }

  // 2. Subtle Web Audio physical micro-click (inaudible ambient tactile thump, 50-90Hz)
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    const duration = style === 'medium' ? 0.025 : 0.018;

    const startFreq = style === 'light' ? 95 : style === 'medium' ? 120 : 80;
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(30, startTime + duration);

    // Extremely low, warm volume for physical feel rather than noise
    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch {
    // AudioContext blocked or not available
  }
}
