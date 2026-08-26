import React, { useState, useEffect } from 'react';
import { TaskItem, PartnerNudge } from '../types';
import {
  Check,
  RotateCcw,
  Brain,
  Play,
  Pause,
  Heart,
  Droplets,
  Wind,
  Sparkles,
  Gift,
  X,
} from 'lucide-react';

interface NowScreenProps {
  currentTask: TaskItem | null;
  tasks: TaskItem[];
  activeNudge?: PartnerNudge | null;
  onDismissNudge?: () => void;
  onCompleteTask: (taskId: string) => void;
  onRecalibrate: () => void;
  onSelectTask: (task: TaskItem) => void;
  onNavigateToIntake: () => void;
  onOpenPartnerHQ?: () => void;
}

export const NowScreen: React.FC<NowScreenProps> = ({
  currentTask,
  tasks,
  activeNudge,
  onDismissNudge,
  onCompleteTask,
  onRecalibrate,
  onSelectTask,
  onNavigateToIntake,
  onOpenPartnerHQ,
}) => {
  const totalSeconds = (currentTask?.estimatedMinutes || 10) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(Math.floor(totalSeconds * 0.65));
  const [isRunning, setIsRunning] = useState(true);
  const [hasCompletedEffect, setHasCompletedEffect] = useState(false);

  // Sync initial seconds when task changes
  useEffect(() => {
    if (currentTask) {
      setSecondsRemaining(currentTask.estimatedMinutes * 60);
      setIsRunning(true);
      setHasCompletedEffect(false);
    }
  }, [currentTask?.id]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const percentage = Math.max(
    0,
    Math.min(100, Math.round((secondsRemaining / totalSeconds) * 100))
  );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleDone = () => {
    if (currentTask) {
      setHasCompletedEffect(true);
      setTimeout(() => {
        onCompleteTask(currentTask.id);
        setHasCompletedEffect(false);
      }, 400);
    }
  };

  return (
    <main
      id="screen-now"
      className="flex-1 md:ml-64 flex flex-col justify-center items-center px-4 sm:px-8 pb-24 pt-6 md:pb-8 min-h-screen relative overflow-hidden w-full"
    >
      {/* Mobile Top App Bar */}
      <div className="md:hidden w-full flex justify-between items-center mb-6 pt-1">
        <h1 className="text-[22px] font-extrabold text-[#43664c]">Momentum</h1>
        <button
          onClick={onOpenPartnerHQ}
          className="text-xs font-bold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-pink-500" />
          Partner HQ
        </button>
      </div>

      {/* 💌 Live Partner Nudge Banner */}
      {activeNudge && (
        <div className="w-full max-w-[600px] mb-6 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeNudge.emoji || '💖'}</span>
              <div>
                <p className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                  Partner Support Nudge
                </p>
                <p className="text-sm font-semibold text-[#181c1e]">
                  {activeNudge.label}
                </p>
              </div>
            </div>
            {onDismissNudge && (
              <button
                onClick={onDismissNudge}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Single Column Focus Zone */}
      <div className="w-full max-w-[600px] flex flex-col items-center">
        {currentTask ? (
          <>
            {/* Focus Card */}
            <div
              id="focus-card"
              className={`w-full bg-[#ffffff] border border-[#c2c8c0] rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center transition-all duration-300 shadow-sm mb-6 ${
                hasCompletedEffect ? 'scale-95 opacity-80 bg-[#c4eccb]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between w-full mb-6">
                <span className="text-[13px] font-bold text-[#545f72] tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#43664c] animate-pulse"></span>
                  Active Focus Sprint
                </span>
                {tasks.length > 1 && (
                  <span className="text-[12px] font-bold text-[#43664c] bg-[#8bb192]/20 px-3 py-1 rounded-full">
                    Step {currentTask.order} of {tasks.length}
                  </span>
                )}
              </div>

              <h2 className="text-[26px] sm:text-[34px] font-extrabold text-[#181c1e] mb-3 leading-tight">
                {currentTask.title}
              </h2>

              {currentTask.description && (
                <p className="text-[15px] text-[#545f72] mb-6 max-w-[480px]">
                  {currentTask.description}
                </p>
              )}

              {/* Countdown Readout */}
              <div className="text-[44px] sm:text-[56px] font-black font-mono text-[#43664c] tracking-tight my-2">
                {formatTime(secondsRemaining)}
              </div>

              {/* Visual Time Block (Shrinking) */}
              <div className="w-full mt-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#545f72] uppercase tracking-wider">
                      Momentum Remaining
                    </span>
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="text-[#43664c] hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer ml-2"
                    >
                      {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {isRunning ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                  <span className="text-xs font-bold text-[#181c1e]">
                    {percentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[#ebeef0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#43664c] rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                id="btn-now-done"
                onClick={handleDone}
                className="flex-1 bg-[#43664c] text-white text-[17px] font-bold rounded-2xl min-h-[56px] flex items-center justify-center gap-2 hover:bg-[#38553f] transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Mark Done &amp; Unbox</span>
              </button>
              <button
                id="btn-now-recalibrate"
                onClick={onRecalibrate}
                className="flex-1 bg-white border border-[#c2c8c0] text-[#181c1e] text-[17px] font-bold rounded-2xl min-h-[56px] flex items-center justify-center gap-2 hover:bg-[#f1f4f6] transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 text-[#545f72]" />
                <span>Recalibrate</span>
              </button>
            </div>

            {/* Sequence in this plan */}
            {tasks.length > 1 && (
              <div className="w-full mt-8 pt-6 border-t border-[#c2c8c0]/40">
                <p className="text-[12px] uppercase font-bold text-[#545f72] tracking-wider mb-3">
                  Sequence In This Plan
                </p>
                <div className="space-y-2">
                  {tasks.map((t) => {
                    const isCurrent = t.id === currentTask.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left text-sm transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#8bb192]/20 border-[#43664c] font-bold text-[#181c1e]'
                            : t.isCompleted
                            ? 'bg-[#ebeef0]/40 border-transparent text-[#545f72] line-through'
                            : 'bg-[#ffffff] border-[#c2c8c0]/60 text-[#545f72] hover:border-[#43664c]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span
                            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                              t.isCompleted
                                ? 'bg-[#43664c] text-white'
                                : isCurrent
                                ? 'bg-[#43664c] text-white'
                                : 'bg-[#e0e3e5] text-[#545f72]'
                            }`}
                          >
                            {t.isCompleted ? '✓' : t.order}
                          </span>
                          <span className="truncate font-medium">{t.title}</span>
                        </span>
                        <span className="text-xs text-[#545f72] font-mono shrink-0 ml-2">
                          10 min
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="w-full bg-[#ffffff] border border-[#c2c8c0] rounded-3xl p-10 text-center shadow-xs">
            <Brain className="w-14 h-14 text-[#43664c] mx-auto mb-3" />
            <h2 className="text-[24px] font-bold text-[#181c1e] mb-2">
              Ready to focus?
            </h2>
            <p className="text-[15px] text-[#545f72] mb-6 max-w-[400px] mx-auto">
              Submit a goal in the Intake zone or start your Morning AI Schedule to decompose work into 10-minute micro-steps.
            </p>
            <button
              onClick={onNavigateToIntake}
              className="bg-[#43664c] text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-[#38553f] transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-4 h-4" />
              Deconstruct a Goal
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
