import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Flame, Zap, Award, CheckCircle2, X, ArrowRight, PartyPopper } from 'lucide-react';

export interface MasteryCelebrationModalProps {
  isOpen: boolean;
  topic: string;
  category?: string;
  xpPoints?: number;
  onClose: () => void;
}

// Gentle pleasant victory arpeggio chime via Web Audio API
const playVictoryChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.65);
    });
  } catch {
    // AudioContext autoplay restrictions or disabled audio
  }
};

export const fireConfettiCannon = () => {
  // Center burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#34d399', '#f59e0b', '#38bdf8', '#a855f7', '#ec4899'],
  });

  // Left & right cannons after a short delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10b981', '#fbbf24', '#38bdf8', '#a855f7'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#10b981', '#fbbf24', '#38bdf8', '#a855f7'],
    });
  }, 250);

  // Star bursts
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      origin: { y: 0.4 },
      shapes: ['star'],
      colors: ['#fef08a', '#fbbf24', '#34d399', '#67e8f9'],
    });
  }, 450);
};

export const MasteryCelebrationModal: React.FC<MasteryCelebrationModalProps> = ({
  isOpen,
  topic,
  category = 'Roadmap Mastery',
  xpPoints = 500,
  onClose,
}) => {
  const triggerCelebration = useCallback(() => {
    fireConfettiCannon();
    playVictoryChime();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    triggerCelebration();

    // Keydown listener for Esc
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, triggerCelebration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none"
      onClick={onClose}
    >
      {/* Radiant Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-amber-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Celebration Card */}
      <div
        className="relative w-full max-w-lg bg-[#0d121a]/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-emerald-500/20 overflow-hidden transform animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Top Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 animate-pulse" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Trophy / Star Badge */}
        <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
          {/* Outer rotating pulse ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-cyan-400 blur-md opacity-70 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/40 border border-emerald-300/40">
            <Trophy className="w-10 h-10 text-slate-950 stroke-[2.2] animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#0d121a]">
            <Sparkles className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>{category}</span>
        </div>

        {/* Main Congrats Typography */}
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 tracking-tight mb-2">
          🎉 CONGRATS! 🎉
        </h2>

        <p className="text-slate-400 text-sm font-medium mb-3">
          You mastered
        </p>

        {/* Highlighted Topic Box */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 mb-6 shadow-inner relative group">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400 text-xs font-mono">Topic Mastered</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white tracking-normal leading-snug line-clamp-2">
            {topic}
          </p>
        </div>

        {/* Stats & Dopamine Rewards */}
        <div className="grid grid-cols-2 gap-3 mb-6 font-mono">
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-0.5">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>+{xpPoints} XP</span>
            </div>
            <span className="text-[11px] text-slate-400">Knowledge Synced</span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Streak Active</span>
            </div>
            <span className="text-[11px] text-slate-400">Momentum Boost</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={triggerCelebration}
            className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer shrink-0"
            title="Fire more celebration confetti!"
          >
            <PartyPopper className="w-4 h-4 text-amber-400" />
            <span>Celebrate Again</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
