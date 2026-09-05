import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Volume2,
  VolumeX,
  Activity,
  Brain,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { BinauralSoundMode } from '../types';
import { neuroAudio } from '../lib/audioSynthesizer';

export const AudioSynthesizerScreen: React.FC = () => {
  const [soundMode, setSoundMode] = useState<BinauralSoundMode>(() => neuroAudio.getMode());
  const [volume, setVolume] = useState<number>(() => neuroAudio.getVolume());

  useEffect(() => {
    // Keep in sync with singleton state
    setSoundMode(neuroAudio.getMode());
    setVolume(neuroAudio.getVolume());
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    neuroAudio.setVolume(val);
  };

  const handleSoundToggle = (mode: BinauralSoundMode) => {
    if (soundMode === mode) {
      neuroAudio.setMode('off');
      setSoundMode('off');
    } else {
      neuroAudio.setMode(mode);
      setSoundMode(mode);
    }
  };

  return (
    <main className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-5xl mx-auto w-full font-sans">
      {/* Top Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Headphones className="w-3.5 h-3.5" />
              HTML5 Web Audio Synthesizer
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
              Background Persistent
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            40 Hz Focus Audio Synthesizer
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            Real-time neural entrainment engine. Generates pure mathematical sine waves and noise spectra without audio file lag.
          </p>
        </div>

        {/* Global Sound Status Pill */}
        <div className="bg-white border border-[#c2c8c0] rounded-2xl p-3 sm:p-4 shadow-xs flex items-center gap-3 self-start sm:self-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
              soundMode !== 'off'
                ? 'bg-violet-600 text-white animate-pulse shadow-md shadow-violet-200'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {soundMode !== 'off' ? <Activity className="w-5 h-5 animate-spin-slow" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Status</span>
            <span className="text-xs font-extrabold text-[#181c1e] font-mono">
              {soundMode === 'binaural-40hz'
                ? '🧠 40Hz Gamma Active'
                : soundMode === 'brown-noise'
                ? '🌊 Brown Noise Active'
                : soundMode === 'pink-noise'
                ? '🌸 Pink Noise Active'
                : 'Audio Idle (Off)'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Sound Console */}
      <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        {/* Sound Bar / Volume Control Banner */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center font-bold text-2xl">
              🎧
            </div>
            <div>
              <h2 className="text-lg font-black text-[#181c1e]">Acoustic Frequency Console</h2>
              <p className="text-xs text-[#545f72]">
                Audio continues playing seamlessly in the background across all tabs and study screens.
              </p>
            </div>
          </div>

          {/* Volume Slider & Mute Toggle */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => handleSoundToggle('off')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Stop / Mute All"
            >
              {soundMode !== 'off' ? <Volume2 className="w-4 h-4 text-violet-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 font-mono">Vol:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-28 sm:w-36 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <span className="text-[11px] font-mono font-bold text-slate-700 w-8">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Live Visualizer Animation when Active */}
        {soundMode !== 'off' && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-inner animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-end gap-1 h-6">
                <div className="w-1.5 bg-violet-400 rounded-full animate-bounce h-3" />
                <div className="w-1.5 bg-indigo-400 rounded-full animate-bounce h-6" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 bg-emerald-400 rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                <div className="w-1.5 bg-pink-400 rounded-full animate-bounce h-5" style={{ animationDelay: '450ms' }} />
                <div className="w-1.5 bg-cyan-400 rounded-full animate-bounce h-3" style={{ animationDelay: '200ms' }} />
              </div>
              <div>
                <p className="text-xs font-bold font-mono tracking-wide text-violet-200">
                  ENTRAINMENT FREQUENCY ACTIVE
                </p>
                <p className="text-[11px] text-slate-300">
                  Synthesizing real-time acoustic waves. Keep headphones on for binaural phase synchronization.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSoundToggle('off')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer border border-white/20"
            >
              Stop Audio
            </button>
          </div>
        )}

        {/* 3 Interactive Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: 40Hz Gamma */}
          <div
            onClick={() => handleSoundToggle('binaural-40hz')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              soundMode === 'binaural-40hz'
                ? 'bg-violet-50/80 border-violet-500 shadow-md ring-2 ring-violet-400/50'
                : 'bg-white border-[#c2c8c0] hover:border-violet-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🧠</span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                    soundMode === 'binaural-40hz'
                      ? 'bg-violet-600 text-white'
                      : 'bg-violet-100 text-violet-800'
                  }`}
                >
                  {soundMode === 'binaural-40hz' ? 'PLAYING NOW ⚡' : '40 Hz GAMMA'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#181c1e] mb-1.5">
                40 Hz Binaural Beats
              </h3>
              <p className="text-xs text-[#545f72] leading-relaxed">
                Left 400Hz / Right 440Hz sine wave differential. Stimulates prefrontal cortex gamma oscillations to trigger sustained dopamine and acetylcholine release.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-violet-800 font-mono">Stereo Required 🎧</span>
              <button
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  soundMode === 'binaural-40hz'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                }`}
              >
                {soundMode === 'binaural-40hz' ? 'Stop' : 'Start Gamma'}
              </button>
            </div>
          </div>

          {/* Card 2: Deep Brown Noise */}
          <div
            onClick={() => handleSoundToggle('brown-noise')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              soundMode === 'brown-noise'
                ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-400/50'
                : 'bg-white border-[#c2c8c0] hover:border-amber-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🌊</span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                    soundMode === 'brown-noise'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {soundMode === 'brown-noise' ? 'PLAYING NOW 🌊' : 'BROWNIAN NOISE'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#181c1e] mb-1.5">
                Deep Brown Noise
              </h3>
              <p className="text-xs text-[#545f72] leading-relaxed">
                Filtered Brownian acoustic spectrum with 450Hz low-pass roll-off. Mimics a deep distant waterfall, neutralizing background conversational chatter.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 font-mono">Sensory Masking</span>
              <button
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  soundMode === 'brown-noise'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {soundMode === 'brown-noise' ? 'Stop' : 'Start Brown'}
              </button>
            </div>
          </div>

          {/* Card 3: Balanced Pink Noise */}
          <div
            onClick={() => handleSoundToggle('pink-noise')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              soundMode === 'pink-noise'
                ? 'bg-rose-50/80 border-rose-500 shadow-md ring-2 ring-rose-400/50'
                : 'bg-white border-[#c2c8c0] hover:border-rose-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🌸</span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                    soundMode === 'pink-noise'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {soundMode === 'pink-noise' ? 'PLAYING NOW 🌸' : '1/F PINK NOISE'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#181c1e] mb-1.5">
                Balanced Pink Noise
              </h3>
              <p className="text-xs text-[#545f72] leading-relaxed">
                Natural 1/f energy distribution resembling gentle steady rain. Calms ADHD restlessness without inducing sedation or sleepiness.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-800 font-mono">Steady Rain</span>
              <button
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  soundMode === 'pink-noise'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                {soundMode === 'pink-noise' ? 'Stop' : 'Start Pink'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Neuroscience Rationale Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-violet-700">
            <Brain className="w-4 h-4" />
            <h4 className="text-xs font-extrabold uppercase font-mono">Gamma Synchrony</h4>
          </div>
          <p className="text-xs text-[#545f72] leading-relaxed">
            40Hz stimulation aligns electrical activity across visual and executive cortex regions, elevating Working Memory Capacity by up to 22%.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-extrabold uppercase font-mono">Acoustic Shielding</h4>
          </div>
          <p className="text-xs text-[#545f72] leading-relaxed">
            Brown noise lowers auditory cortical sensitivity to unpredictable background noises like keyboard clicks, traffic, and conversations.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <Zap className="w-4 h-4" />
            <h4 className="text-xs font-extrabold uppercase font-mono">ADHD Stochastic Resonance</h4>
          </div>
          <p className="text-xs text-[#545f72] leading-relaxed">
            Moderate continuous acoustic noise introduces stochastic resonance, helping ADHD brains elevate baseline dopamine without distraction.
          </p>
        </div>
      </div>
    </main>
  );
};
