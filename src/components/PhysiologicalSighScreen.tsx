import React from 'react';
import {
  Wind,
  Brain,
  ShieldCheck,
  Heart,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { PhysiologicalSighGuide } from './PhysiologicalSighGuide';

export const PhysiologicalSighScreen: React.FC = () => {
  return (
    <main className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-5xl mx-auto w-full font-sans">
      {/* Top Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Wind className="w-3.5 h-3.5" />
              Stanford Huberman Lab Protocol
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
              Fastest Autonomic Reset
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            The Physiological Sigh
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            Two rapid inhales through the nose followed by a slow, extended exhale through the mouth to immediately halt autonomic stress.
          </p>
        </div>
      </header>

      {/* Main Breathing Engine Container */}
      <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
        <PhysiologicalSighGuide />
      </div>

      {/* Scientific Deep Dive Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-900 font-mono font-bold text-xs flex items-center justify-center">
                01
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800">
                3.5 SECONDS
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-[#181c1e] mb-1.5 flex items-center gap-1.5">
              <span>Deep Nasal Inhale</span>
            </h3>
            <p className="text-xs text-[#545f72] leading-relaxed">
              Inhale deeply through your nose until your lungs are approximately 80% full. Diaphragm descends, creating negative intrathoracic pressure.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-cyan-800 font-mono">
            Fill 80% Lung Volume
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-violet-100 text-violet-900 font-mono font-bold text-xs flex items-center justify-center">
                02
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-violet-50 text-violet-800">
                1.5 SECONDS
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-[#181c1e] mb-1.5 flex items-center gap-1.5">
              <span>Sharp Nasal Sniff (Top-Up)</span>
            </h3>
            <p className="text-xs text-[#545f72] leading-relaxed">
              Without exhaling, take a second sharp sniff through the nose. This re-inflates collapsed pulmonary alveoli sacs, maximizing oxygen exchange surface area.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-violet-800 font-mono">
            Pops Collapsed Alveoli Open
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-900 font-mono font-bold text-xs flex items-center justify-center">
                03
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                6.0 SECONDS
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-[#181c1e] mb-1.5 flex items-center gap-1.5">
              <span>Full Slow Mouth Sigh</span>
            </h3>
            <p className="text-xs text-[#545f72] leading-relaxed">
              Gently exhale all air through pursed lips. Diaphragm moves up, compressing heart chambers to trigger the sinoatrial node, slowing heart rate within seconds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-800 font-mono">
            Vagus Nerve Deceleration
          </div>
        </div>
      </div>

      {/* Clinical Reference Box */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-700 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Stanford University School of Medicine (Cell Reports Medicine, 2023):</strong> Cyclic sighing performed for just 2 to 3 consecutive cycles produces greater immediate reductions in anxiety and physiological arousal than box breathing, mindfulness meditation, or hyperventilation protocols.
        </p>
      </div>
    </main>
  );
};
