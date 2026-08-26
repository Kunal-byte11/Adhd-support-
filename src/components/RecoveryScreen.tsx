import React, { useState } from 'react';
import { Droplets, Headphones, Sparkles, ArrowRight, CheckCircle2, PauseCircle, Terminal } from 'lucide-react';

interface RecoveryScreenProps {
  onResume: (delayMinutes: number) => void;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  onResume,
}) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [delayMinutes, setDelayMinutes] = useState(15);

  const microTasks = [
    {
      id: 'water',
      title: 'Drink a cold glass of water',
      duration: '1 min',
      Icon: Droplets,
      description: 'Physical grounding & hydration reset',
    },
    {
      id: 'breath',
      title: 'Take 3 deep diaphragm breaths',
      duration: '1 min',
      Icon: Headphones,
      description: 'Regulate parasympathetic nervous system',
    },
    {
      id: 'desk',
      title: 'Clear 1 item off your desk',
      duration: '30 sec',
      Icon: Sparkles,
      description: 'Zero-resistance tactile win',
    },
  ];

  const handlePickTask = (id: string) => {
    setSelectedTask(id);
  };

  const handleResume = () => {
    onResume(delayMinutes);
  };

  return (
    <main
      id="screen-recovery"
      className="flex-1 md:ml-64 flex flex-col justify-center items-center px-6 py-10 md:px-12 min-h-screen relative overflow-hidden bg-[#f7fafc] pb-28 md:pb-12"
    >
      {/* Background timeline animation for subtle shift feeling */}
      <div className="absolute inset-0 bg-timeline pointer-events-none z-0 opacity-40"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[620px] flex flex-col items-center">
        {/* Blame-Free Pill */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#5fafe9]/20 text-[#004162] rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#5fafe9]/30">
          <PauseCircle className="w-4 h-4 text-[#006494]" />
          <span>Schedule Paused • Blame-Free Zone</span>
        </div>

        <h1 className="text-[32px] sm:text-[40px] font-black text-[#181c1e] text-center mb-3 tracking-tight">
          No worries. Breathe.
        </h1>
        <p className="text-[16px] text-[#545f72] text-center mb-8 max-w-[480px] leading-relaxed">
          Executive dysfunction happens. Your timeline automatically shifted with <strong>zero penalty</strong> or lost streaks. Pick one friction-free action to restart momentum:
        </p>

        {/* Micro-Tasks (Momentum Cards) */}
        <div className="w-full space-y-3 mb-8">
          {microTasks.map((task) => {
            const isSelected = selectedTask === task.id;
            const Icon = task.Icon;
            return (
              <button
                key={task.id}
                id={`microtask-${task.id}`}
                onClick={() => handlePickTask(task.id)}
                className={`momentum-card w-full bg-[#ffffff] border rounded-xl p-4 sm:p-5 flex items-center justify-between transition-all duration-200 shadow-xs cursor-pointer ${
                  isSelected
                    ? 'border-[#43664c] bg-[#8bb192]/15 ring-2 ring-[#43664c]'
                    : 'border-[#c2c8c0] hover:border-[#8bb192]'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#43664c] text-white'
                        : 'bg-[#f1f4f6] text-[#43664c]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[16px] font-bold text-[#181c1e]">
                      {task.title}
                    </p>
                    <p className="text-[13px] text-[#545f72]">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[#545f72] font-mono bg-[#f1f4f6] px-2.5 py-1 rounded">
                    {task.duration}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#43664c]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Recalibration Time Shift Options */}
        <div className="w-full bg-[#ffffff] border border-[#c2c8c0] rounded-xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#545f72]">
              Adjust Next Focus Start
            </span>
            <span className="text-xs font-semibold text-[#43664c]">
              +{delayMinutes} min buffer added
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[5, 15, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDelayMinutes(mins)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  delayMinutes === mins
                    ? 'bg-[#43664c] text-white border-[#43664c]'
                    : 'bg-[#f1f4f6] text-[#545f72] border-transparent hover:border-[#727971]'
                }`}
              >
                +{mins} Minutes Buffer
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          id="btn-resume-from-recovery"
          onClick={handleResume}
          className="w-full bg-[#43664c] text-white py-4 rounded-lg text-[17px] font-bold flex items-center justify-center gap-2 hover:bg-[#38553f] transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span>Recalibrate &amp; Return to Focus</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
};
