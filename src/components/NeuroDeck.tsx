import React, { useState } from 'react';
import { Headphones, Wind, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { BinauralSoundMode } from '../types';
import { neuroAudio } from '../lib/audioSynthesizer';
import { PhysiologicalSighGuide } from './PhysiologicalSighGuide';

interface NeuroDeckProps {
  onOpenWoop: () => void;
  activeWoopCount: number;
}

export const NeuroDeck: React.FC<NeuroDeckProps> = ({ onOpenWoop, activeWoopCount }) => {
  const [soundMode, setSoundMode] = useState<BinauralSoundMode>('off');
  const [volume, setVolume] = useState<number>(0.6);
  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);

  // Sync volume with audio engine
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    neuroAudio.setVolume(val);
  };

  const handleSoundSelect = (mode: BinauralSoundMode) => {
    if (soundMode === mode) {
      neuroAudio.setMode('off');
      setSoundMode('off');
    } else {
      neuroAudio.setMode(mode);
      setSoundMode(mode);
    }
  };

  return (
    <>
      {/* Integrated Neuro Action Bar — Clean Light Theme */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-[#c2c8c0] rounded-2xl shadow-xs mb-6 font-sans">
        {/* Left: 40Hz Audio Entrainment Deck */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-[#181c1e] text-xs font-bold font-mono">
            <Headphones className="w-3.5 h-3.5 text-[#006494]" />
            <span>Focus Sounds</span>
          </div>

          <button
            onClick={() => handleSoundSelect('binaural-40hz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              soundMode === 'binaural-40hz'
                ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                : 'bg-violet-50/70 border-violet-200 text-violet-800 hover:bg-violet-100'
            }`}
            title="400Hz Left / 440Hz Right: Stimulates Acetylcholine & Dopamine for deep focus"
          >
            <span>🧠</span> 40 Hz Gamma Beats
          </button>

          <button
            onClick={() => handleSoundSelect('brown-noise')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              soundMode === 'brown-noise'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
            title="Deep Brownian low-pass acoustic rumble for sensory isolation"
          >
            <span>🌊</span> Brown Noise
          </button>

          <button
            onClick={() => handleSoundSelect('pink-noise')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              soundMode === 'pink-noise'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50/70 border-rose-200 text-rose-800 hover:bg-rose-100'
            }`}
            title="Balanced 1/f noise for calm sustained attention"
          >
            <span>🌸</span> Pink Noise
          </button>

          {soundMode !== 'off' && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#43664c]"
              />
              <button
                onClick={() => handleSoundSelect('off')}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="Mute audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: WOOP Board & Physiological Sigh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBreathingModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Wind className="w-3.5 h-3.5 text-cyan-600" />
            Physiological Sigh
          </button>

          <button
            onClick={onOpenWoop}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            WOOP Urgency
            {activeWoopCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {activeWoopCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Physiological Sigh Modal — Clean Light Theme */}
      {showBreathingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-left font-sans">
            <button
              onClick={() => setShowBreathingModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer z-10"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <PhysiologicalSighGuide onComplete={() => {}} />
          </div>
        </div>
      )}
    </>
  );
};
