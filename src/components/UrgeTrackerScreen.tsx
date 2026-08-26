import React, { useState, useEffect } from 'react';
import { UrgeLog } from '../types';
import { ShieldAlert, ArrowRight, Clock, History, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface UrgeTrackerScreenProps {
  onLogUrge: (log: Omit<UrgeLog, 'id' | 'timestamp' | 'triggerTime'>) => void;
  urgeHistory: UrgeLog[];
  onReturnToNow: () => void;
}

export const UrgeTrackerScreen: React.FC<UrgeTrackerScreenProps> = ({
  onLogUrge,
  urgeHistory,
  onReturnToNow,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5-minute lockdown
  const [currentFeeling, setCurrentFeeling] = useState('');
  const [tomorrowFeeling, setTomorrowFeeling] = useState('');
  const [selectedUrgeType, setSelectedUrgeType] = useState('Social Media / Distraction');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLockdownExpired = secondsRemaining === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFeeling.trim()) return;

    setIsSubmitting(true);
    onLogUrge({
      urgeType: selectedUrgeType,
      feelingNow: currentFeeling,
      feelingTomorrow: tomorrowFeeling || 'Grateful I stayed the course.',
      durationSeconds: 300 - secondsRemaining,
      timerCompleted: isLockdownExpired,
      preventedAction: true,
    });
    setIsSubmitting(false);
    onReturnToNow();
  };

  return (
    <main
      id="screen-urges"
      className="flex-1 md:ml-64 flex flex-col justify-center items-center px-6 py-10 md:px-12 min-h-screen bg-[#f7fafc] pb-28 md:pb-12"
    >
      <div className="w-full max-w-[620px] flex flex-col items-center">
        {/* Lockdown Status Header */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] mb-5 border border-[#ba1a1a]/20">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[12px] font-bold uppercase tracking-widest">
            Lockdown Protocol Active (5 Min)
          </span>
        </div>

        {/* Large Countdown Clock */}
        <div className="text-center mb-6">
          <div
            id="urge-timer-display"
            className="text-[64px] sm:text-[84px] font-black text-[#181c1e] tracking-tight leading-none font-mono"
          >
            {formattedTime}
          </div>
          <p className="text-[14px] text-[#545f72] mt-2 flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-[#006494]" />
            <span>Bridge the cognitive gap between impulse and consequence.</span>
          </p>
        </div>

        {/* Form Intervention Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#ffffff] border border-[#c2c8c0] rounded-xl p-6 sm:p-8 shadow-xs flex flex-col gap-5"
        >
          {/* Urge Type Selector */}
          <div>
            <label className="text-xs font-bold text-[#545f72] uppercase tracking-wider block mb-2">
              What impulse are you experiencing?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Social Media',
                'Email/News',
                'Snack/Food',
                'Side Project',
                'Restlessness',
                'Task Avoidance',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedUrgeType(type)}
                  className={`py-2 px-3 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer ${
                    selectedUrgeType === type
                      ? 'bg-[#43664c] text-white border-[#43664c]'
                      : 'bg-[#f1f4f6] text-[#545f72] border-transparent hover:border-[#727971]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt 1 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="input-current-feeling"
              className="text-[15px] font-bold text-[#181c1e]"
            >
              1. How do you feel right now?
            </label>
            <textarea
              id="input-current-feeling"
              rows={3}
              value={currentFeeling}
              onChange={(e) => setCurrentFeeling(e.target.value)}
              placeholder="e.g. Overwhelmed by this task, feeling anxious or craving a quick dopamine escape..."
              className="w-full p-3.5 rounded-lg bg-[#f1f4f6] border border-transparent focus:border-[#43664c] focus:bg-[#ffffff] text-[#181c1e] text-[14px] focus:outline-none transition-all placeholder-[#727971] resize-none"
            />
          </div>

          {/* Prompt 2 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="input-tomorrow-feeling"
              className="text-[15px] font-bold text-[#181c1e]"
            >
              2. How will you feel tomorrow if you give in vs. stay on track?
            </label>
            <textarea
              id="input-tomorrow-feeling"
              rows={3}
              value={tomorrowFeeling}
              onChange={(e) => setTomorrowFeeling(e.target.value)}
              placeholder="e.g. Giving in causes guilt and tomorrow deadline panic. Staying on track brings calm confidence."
              className="w-full p-3.5 rounded-lg bg-[#f1f4f6] border border-transparent focus:border-[#43664c] focus:bg-[#ffffff] text-[#181c1e] text-[14px] focus:outline-none transition-all placeholder-[#727971] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="btn-submit-urge"
              type="submit"
              disabled={isSubmitting || !currentFeeling.trim()}
              className="flex-1 bg-[#43664c] text-white py-3.5 rounded-lg text-[16px] font-bold flex items-center justify-center gap-2 hover:bg-[#38553f] transition-all disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <span>Bridge Impulse &amp; Resume Focus</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isLockdownExpired && (
              <button
                type="button"
                onClick={onReturnToNow}
                className="px-5 py-3.5 border border-[#727971] text-[#181c1e] rounded-lg text-[14px] font-medium hover:bg-[#ebeef0] transition-colors cursor-pointer"
              >
                Release Lockdown
              </button>
            )}
          </div>
        </form>

        {/* History of Urge Logs */}
        {urgeHistory.length > 0 && (
          <div className="w-full mt-8 p-5 bg-[#ffffff] rounded-xl border border-[#c2c8c0] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#545f72] uppercase tracking-wider">
                <History className="w-4 h-4 text-[#43664c]" />
                <span>Intervention History ({urgeHistory.length})</span>
              </div>
              <span className="text-xs text-[#43664c] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Impulses Bridged
              </span>
            </div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {urgeHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f1f4f6] p-3 rounded-lg text-xs text-[#181c1e] border border-[#c2c8c0]/50"
                >
                  <div className="flex justify-between font-bold text-[#43664c] mb-1">
                    <span>{item.urgeType}</span>
                    <span className="text-[#545f72] font-mono text-[11px]">
                      {item.triggerTime}
                    </span>
                  </div>
                  <p className="text-[#181c1e]">
                    <span className="font-semibold text-[#545f72]">Now:</span> "{item.feelingNow}"
                  </p>
                  <p className="text-[#43664c] mt-0.5">
                    <span className="font-semibold text-[#545f72]">Tomorrow:</span> "{item.feelingTomorrow}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
