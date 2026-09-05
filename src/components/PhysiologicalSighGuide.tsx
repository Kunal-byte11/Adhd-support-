import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Heart,
  Activity,
  Info,
} from 'lucide-react';
import { neuroAudio } from '../lib/audioSynthesizer';

export type BreathPhase = 'idle' | 'inhale1' | 'inhale2' | 'exhale' | 'settle' | 'completed';

interface PhysiologicalSighGuideProps {
  compact?: boolean;
  onComplete?: () => void;
}

export const PhysiologicalSighGuide: React.FC<PhysiologicalSighGuideProps> = ({
  compact = false,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [totalCycles, setTotalCycles] = useState<number>(3);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [msRemaining, setMsRemaining] = useState<number>(0);
  const [isAudioGuide, setIsAudioGuide] = useState<boolean>(true);

  // Physical context checklist
  const [checkedDesk, setCheckedDesk] = useState<boolean>(false);
  const [checkedWater, setCheckedWater] = useState<boolean>(false);
  const [checkedPosture, setCheckedPosture] = useState<boolean>(false);

  // Exact Huberman & Stanford Physiological Timings in ms
  const PHASE_DURATIONS: Record<BreathPhase, number> = {
    idle: 0,
    inhale1: 3500, // 3.5s Deep Nasal Inhale
    inhale2: 1500, // 1.5s Sharp Top-up Sniff to pop alveoli
    exhale: 6000,  // 6.0s Extended Mouth Sigh to dump CO2
    settle: 800,   // 0.8s Baseline Settle
    completed: 0,
  };

  const phaseStartTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Start breathing session
  const handleStart = () => {
    setCurrentCycle(1);
    setIsActive(true);
    startPhase('inhale1');
  };

  // Pause session
  const handlePause = () => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Reset to initial
  const handleReset = () => {
    setIsActive(false);
    setPhase('idle');
    setCurrentCycle(1);
    setMsRemaining(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Switch phase with exact timestamp tracking and audio cues
  const startPhase = (nextPhase: BreathPhase) => {
    setPhase(nextPhase);
    const duration = PHASE_DURATIONS[nextPhase];
    setMsRemaining(duration);
    phaseStartTimeRef.current = Date.now();

    if (isAudioGuide) {
      if (nextPhase === 'inhale1') neuroAudio.playBreathCue('inhale1');
      if (nextPhase === 'inhale2') neuroAudio.playBreathCue('inhale2');
      if (nextPhase === 'exhale') neuroAudio.playBreathCue('exhale');
      if (nextPhase === 'completed') neuroAudio.playBreathCue('complete');
    }
  };

  // High-precision animation frame tick loop
  useEffect(() => {
    if (!isActive || phase === 'idle' || phase === 'completed') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const duration = PHASE_DURATIONS[phase];

    const tick = () => {
      const elapsed = Date.now() - phaseStartTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      setMsRemaining(remaining);

      if (remaining <= 0) {
        // Phase transition logic
        if (phase === 'inhale1') {
          startPhase('inhale2');
        } else if (phase === 'inhale2') {
          startPhase('exhale');
        } else if (phase === 'exhale') {
          if (currentCycle < totalCycles) {
            startPhase('settle');
          } else {
            setPhase('completed');
            setIsActive(false);
            if (isAudioGuide) neuroAudio.playBreathCue('complete');
            if (onComplete) onComplete();
          }
        } else if (phase === 'settle') {
          setCurrentCycle((prev) => prev + 1);
          startPhase('inhale1');
        }
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, phase, currentCycle, totalCycles, isAudioGuide, onComplete]);

  // Phase progress fraction (0.0 to 1.0)
  const currentDuration = PHASE_DURATIONS[phase] || 1;
  const progressFraction = Math.max(0, Math.min(1, 1 - msRemaining / currentDuration));

  // Scale of breath orb
  let orbScale = 0.95;
  if (phase === 'inhale1') {
    // Expands smoothly from 0.95 to 1.25
    orbScale = 0.95 + progressFraction * 0.3;
  } else if (phase === 'inhale2') {
    // Expands sharp from 1.25 to 1.45 (top-up)
    orbScale = 1.25 + progressFraction * 0.2;
  } else if (phase === 'exhale') {
    // Deflates gently from 1.45 down to 0.90
    orbScale = 1.45 - progressFraction * 0.55;
  } else if (phase === 'settle') {
    orbScale = 0.90 + progressFraction * 0.05;
  } else if (phase === 'completed') {
    orbScale = 1.05;
  }

  // Seconds display
  const secondsLeft = (msRemaining / 1000).toFixed(1);

  return (
    <div className="flex flex-col justify-between h-full font-sans">
      <div>
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border transition-colors ${
              isActive
                ? 'bg-cyan-600 text-white border-cyan-500 animate-pulse'
                : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}>
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#181c1e] flex items-center gap-2">
                The Physiological Sigh
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  Stanford Protocol
                </span>
              </h3>
              <p className="text-xs text-[#545f72]">
                2 Inhales (Nose) + 1 Long Sigh (Mouth) &bull; Rapid autonomic downregulation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Cue Toggle */}
            <button
              onClick={() => setIsAudioGuide(!isAudioGuide)}
              className={`p-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isAudioGuide
                  ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={isAudioGuide ? 'Audio breath guidance enabled' : 'Audio guidance muted'}
            >
              {isAudioGuide ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[10px] hidden sm:inline">{isAudioGuide ? 'Audio Guide' : 'Muted'}</span>
            </button>

            {/* Cycle Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono font-bold">
              {[1, 2, 3, 5].map((count) => (
                <button
                  key={count}
                  disabled={isActive}
                  onClick={() => {
                    setTotalCycles(count);
                    if (phase === 'completed') setPhase('idle');
                  }}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer disabled:cursor-not-allowed ${
                    totalCycles === count
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {count} {count === 1 ? 'Sigh' : 'Sighs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Breathing Visualizer */}
        <div className="relative py-4 flex flex-col items-center justify-center min-h-[240px]">
          {/* Outer Breathing Orb Container */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Ambient Background Pulse Halo */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
                phase === 'inhale1'
                  ? 'bg-cyan-400/20 blur-xl scale-110'
                  : phase === 'inhale2'
                  ? 'bg-cyan-500/30 blur-2xl scale-125'
                  : phase === 'exhale'
                  ? 'bg-emerald-400/20 blur-xl scale-95'
                  : phase === 'completed'
                  ? 'bg-emerald-500/25 blur-xl scale-105'
                  : 'bg-slate-200/40 blur-md scale-90'
              }`}
            />

            {/* Animated SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-slate-200/70 fill-transparent"
                strokeWidth="3"
              />
              {phase !== 'idle' && phase !== 'completed' && (
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={`fill-transparent transition-all duration-75 stroke-linecap-round ${
                    phase === 'inhale1'
                      ? 'stroke-cyan-500'
                      : phase === 'inhale2'
                      ? 'stroke-cyan-600'
                      : phase === 'exhale'
                      ? 'stroke-emerald-500'
                      : 'stroke-slate-400'
                  }`}
                  strokeWidth="4"
                  strokeDasharray={283}
                  strokeDashoffset={283 * (1 - progressFraction)}
                />
              )}
            </svg>

            {/* Core Interactive Breathing Orb */}
            <div
              style={{
                transform: `scale(${orbScale})`,
                transition: 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className={`absolute w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 text-center shadow-lg transition-colors duration-300 select-none ${
                phase === 'inhale1'
                  ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-cyan-500/30'
                  : phase === 'inhale2'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-600/40 ring-4 ring-cyan-300/50'
                  : phase === 'exhale'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                  : phase === 'settle'
                  ? 'bg-slate-600 text-white'
                  : phase === 'completed'
                  ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-emerald-600/40'
                  : 'bg-white border-2 border-slate-200 text-slate-700 shadow-slate-200'
              }`}
            >
              {phase === 'idle' && (
                <div className="space-y-1">
                  <span className="text-xl">🫁</span>
                  <div className="text-xs font-black uppercase tracking-wider">Ready</div>
                  <div className="text-[10px] text-slate-500 font-mono">Press Begin</div>
                </div>
              )}

              {phase === 'inhale1' && (
                <div className="space-y-0.5">
                  <div className="text-[9px] font-black uppercase tracking-wider text-cyan-100 font-mono">
                    Step 1: Inhale
                  </div>
                  <div className="text-xl font-black font-mono tracking-tight">{secondsLeft}s</div>
                  <div className="text-[10px] font-bold opacity-90">Deep through Nose</div>
                </div>
              )}

              {phase === 'inhale2' && (
                <div className="space-y-0.5">
                  <div className="text-[9px] font-black uppercase tracking-wider text-cyan-100 font-mono">
                    Step 2: Top-Up!
                  </div>
                  <div className="text-xl font-black font-mono tracking-tight">{secondsLeft}s</div>
                  <div className="text-[10px] font-extrabold uppercase bg-white/20 px-1.5 py-0.5 rounded">
                    Extra Sniff!
                  </div>
                </div>
              )}

              {phase === 'exhale' && (
                <div className="space-y-0.5">
                  <div className="text-[9px] font-black uppercase tracking-wider text-emerald-100 font-mono">
                    Step 3: Long Sigh
                  </div>
                  <div className="text-xl font-black font-mono tracking-tight">{secondsLeft}s</div>
                  <div className="text-[10px] font-bold opacity-90">Slow through Mouth</div>
                </div>
              )}

              {phase === 'settle' && (
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">Relax...</div>
                  <div className="text-[9px] text-slate-300 font-mono">Next cycle</div>
                </div>
              )}

              {phase === 'completed' && (
                <div className="space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-200" />
                  <div className="text-xs font-black uppercase">Reset Complete</div>
                  <div className="text-[9px] text-emerald-100 font-mono">Lungs Refreshed</div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Physiological Guidance Banner */}
          <div className="mt-3 text-center max-w-sm px-4">
            {phase === 'idle' && (
              <p className="text-xs text-slate-600 font-medium">
                The fastest, biologically proven protocol to immediately reduce autonomic stress &amp; restore focus.
              </p>
            )}

            {phase === 'inhale1' && (
              <div className="animate-in fade-in duration-200">
                <p className="text-xs font-extrabold text-cyan-900">
                  1. Inhale deeply through your nose to ~80% capacity
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Diaphragm contracts, expanding the thoracic cavity.
                </p>
              </div>
            )}

            {phase === 'inhale2' && (
              <div className="animate-in fade-in duration-200">
                <p className="text-xs font-extrabold text-blue-900">
                  2. Sharp top-up sniff through your nose (fill to 100%)
                </p>
                <p className="text-[11px] text-blue-700 font-bold mt-0.5">
                  Pops open collapsed alveoli for maximal gas exchange!
                </p>
              </div>
            )}

            {phase === 'exhale' && (
              <div className="animate-in fade-in duration-200">
                <p className="text-xs font-extrabold text-emerald-900">
                  3. Long, slow sigh out through your mouth until empty
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>Slowing heart rate via Vagus Nerve (RSA)</span>
                </p>
              </div>
            )}

            {phase === 'settle' && (
              <p className="text-xs text-slate-500 font-medium">
                Preparing cycle {currentCycle + 1} of {totalCycles}...
              </p>
            )}

            {phase === 'completed' && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-extrabold text-emerald-800">
                  🎉 Autonomic arousal successfully balanced!
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Carbon dioxide purged, alveoli re-inflated, and prefrontal attention cleared.
                </p>
              </div>
            )}
          </div>

          {/* Cycle Step Progress Indicator Pills */}
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: totalCycles }).map((_, idx) => {
              const cycleNum = idx + 1;
              const isDone = phase === 'completed' || currentCycle > cycleNum;
              const isCurrent = isActive && currentCycle === cycleNum && phase !== 'completed';

              return (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-600 text-white shadow-xs animate-pulse ring-2 ring-cyan-300'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <span>{isDone ? '✓' : `#${cycleNum}`}</span>
                  <span>Sigh {cycleNum}</span>
                </div>
              );
            })}
          </div>

          {/* Action Button Controls */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {!isActive && phase !== 'completed' && (
              <button
                onClick={handleStart}
                className="px-6 py-2.5 rounded-2xl bg-[#006494] hover:bg-[#004e75] text-white font-extrabold text-xs font-mono flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin {totalCycles} Physiological Sighs</span>
              </button>
            )}

            {isActive && (
              <button
                onClick={handlePause}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Breath</span>
              </button>
            )}

            {phase === 'completed' && (
              <button
                onClick={handleStart}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs font-mono flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repeat Reset</span>
              </button>
            )}

            {(isActive || phase !== 'idle') && (
              <button
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer"
                title="Reset session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Physical Context Checklist Footer */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 text-[11px]">
            <div className="font-extrabold text-[#181c1e] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Pre-Focus Physical Hygiene Checklist
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">Dr. Huberman Lab</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedDesk}
                  onChange={(e) => setCheckedDesk(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                />
                <span className="text-[11px] font-medium">Desk decluttered &amp; phone away</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedWater}
                  onChange={(e) => setCheckedWater(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                />
                <span className="text-[11px] font-medium">Hydration water within reach</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedPosture}
                  onChange={(e) => setCheckedPosture(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                />
                <span className="text-[11px] font-medium">Spine upright &amp; shoulders relaxed</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
