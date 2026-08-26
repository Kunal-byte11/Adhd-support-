import React, { useState, useEffect } from 'react';
import { TaskItem } from '../types';
import {
  Dna,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Zap,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

interface GenomeFocusWidgetProps {
  currentTask: TaskItem | null;
  completedDsaCount: number;
  totalDsaCount: number;
  onCompleteTask: (taskId: string) => void;
  onNavigateToNow: () => void;
}

export const GenomeFocusWidget: React.FC<GenomeFocusWidgetProps> = ({
  currentTask,
  completedDsaCount,
  totalDsaCount,
  onCompleteTask,
  onNavigateToNow,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Sync initial task seconds
  useEffect(() => {
    if (currentTask) {
      setSecondsRemaining((currentTask.estimatedMinutes || 10) * 60);
      setIsRunning(true);
    }
  }, [currentTask?.id]);

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const totalSeconds = (currentTask?.estimatedMinutes || 10) * 60;
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round((secondsRemaining / totalSeconds) * 100))
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const genomeCompletionPercent = Math.round((completedDsaCount / (totalDsaCount || 230)) * 100);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 transition-all duration-300">
      {!isExpanded ? (
        /* Compact Floating Genome Widget Pill */
        <div className="bg-[#181c1e] border-2 border-[#43664c] text-white rounded-full p-2.5 sm:px-4 sm:py-2.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#43664c] text-emerald-300 flex items-center justify-center relative overflow-hidden shrink-0">
              <Dna className="w-4 h-4 animate-spin-slow text-emerald-300" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <span>Genome Focus</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {currentTask ? formatTime(secondsRemaining) : '10:00'}
              </span>
            </div>
          </button>

          <div className="h-5 w-px bg-gray-700 hidden sm:block"></div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 flex items-center justify-center hover:bg-emerald-900 transition-colors cursor-pointer"
            title={isRunning ? 'Pause Pomodoro' : 'Start Pomodoro'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            className="text-gray-400 hover:text-white p-1 cursor-pointer"
            title="Expand Widget"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Expanded Genome Focus & Pomodoro Card */
        <div className="bg-[#181c1e] border-2 border-[#43664c] text-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#43664c] text-emerald-300 flex items-center justify-center shadow-xs">
                <Dna className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>Genome Focus Widget</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                    {genomeCompletionPercent}% Expressed
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  {completedDsaCount} / {totalDsaCount} DSA Base Pairs Code Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Animated DNA Strand Visualizer */}
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">
                Genetic Sprint Base Pairs:
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-6 rounded-full transition-all ${
                    i < Math.round((progressPercent / 100) * 6)
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-gray-800'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Task Title / Timer */}
          <div className="text-center my-3">
            <p className="text-xs text-gray-400 font-semibold mb-1 line-clamp-1">
              {currentTask ? currentTask.title : 'Ready for 10-Minute Sprint'}
            </p>
            <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight my-1">
              {formatTime(secondsRemaining)}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => setSecondsRemaining((prev) => prev + 300)}
              className="py-2.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
              title="Add 5 Minutes"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+5m</span>
            </button>

            <button
              onClick={onNavigateToNow}
              className="py-2.5 bg-[#43664c] hover:bg-[#38553f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
            >
              <span>Full Flow</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
