import React, { useState } from 'react';
import { IWoopGoal } from '../types';
import { Sparkles, Target, Flame, ShieldAlert, ArrowRight, CheckCircle2, Trash2, X, Plus } from 'lucide-react';
import { saveWoopGoalToFirestore, deleteWoopGoalFromFirestore } from '../lib/firestoreService';

interface WoopBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: IWoopGoal[];
  onSelectGoal?: (goal: IWoopGoal) => void;
  defaultSubject?: string;
}

export const WoopBoardModal: React.FC<WoopBoardModalProps> = ({
  isOpen,
  onClose,
  goals,
  onSelectGoal,
  defaultSubject = 'General',
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [wish, setWish] = useState('');
  const [outcome, setOutcome] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [plan, setPlan] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!wish.trim() || !plan.trim()) return;

    const newGoal: IWoopGoal = {
      id: 'woop_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      wish: wish.trim(),
      outcome: outcome.trim(),
      obstacle: obstacle.trim(),
      plan: plan.trim(),
      targetSubject: subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveWoopGoalToFirestore(newGoal);

    // Reset form
    setWish('');
    setOutcome('');
    setObstacle('');
    setPlan('');
    setStep(1);
    setActiveTab('saved');

    if (onSelectGoal) {
      onSelectGoal(newGoal);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteWoopGoalFromFirestore(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#181c1e] flex items-center gap-2">
                WOOP Urgency Board
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 font-mono">
                  Mental Contrasting
                </span>
              </h2>
              <p className="text-xs text-[#545f72] font-medium">
                Dr. Gabriele Oettingen &bull; Science of eliminating procrastination &amp; activating urgency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 my-5 p-1 bg-[#f1f4f6] rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'create'
                ? 'bg-white text-[#181c1e] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            New WOOP Intention
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-white text-[#181c1e] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            Active Anchors ({goals.length})
          </button>
        </div>

        {/* Create Flow */}
        {activeTab === 'create' && (
          <div>
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { s: 1, title: 'Wish', letter: 'W' },
                { s: 2, title: 'Outcome', letter: 'O' },
                { s: 3, title: 'Obstacle', letter: 'O' },
                { s: 4, title: 'Plan', letter: 'P' },
              ].map((st) => (
                <button
                  key={st.s}
                  onClick={() => setStep(st.s as any)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    step === st.s
                      ? 'bg-white border-[#43664c] text-[#181c1e] shadow-xs font-bold'
                      : step > st.s
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider font-mono">{st.letter} &bull; {st.title}</div>
                </button>
              ))}
            </div>

            {/* Step 1: WISH */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <Target className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                  <div className="text-xs text-emerald-900 leading-relaxed font-medium">
                    <strong className="font-bold text-emerald-950">1. WISH:</strong> Define a meaningful, highly specific goal or difficult hurdle you want to conquer in this study bout.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Subject / Domain</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#43664c] focus:bg-white"
                  >
                    <option value="Deep Learning">🧠 Deep Learning</option>
                    <option value="Big Data Analytics (BDA)">📊 Big Data Analytics (BDA)</option>
                    <option value="Blockchain Technology (BCT)">⛓️ Blockchain Technology (BCT)</option>
                    <option value="Management Info Systems (MIS)">🏢 Management Information Systems</option>
                    <option value="DSA & Practice">💻 DSA & Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">What is your specific wish for this session?</label>
                  <input
                    type="text"
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="e.g. Master Backpropagation algorithm derivation without checking solution"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#43664c] focus:bg-white"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={!wish.trim()}
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Next: Outcome <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: OUTCOME */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-700 mt-0.5 shrink-0" />
                  <div className="text-xs text-cyan-900 leading-relaxed font-medium">
                    <strong className="font-bold text-cyan-950">2. BEST OUTCOME:</strong> Vividly identify the best emotional and practical outcome of fulfilling this wish. How will you feel?
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">What is the best feeling / result of finishing this?</label>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="e.g. 100% mastery on a guaranteed 10-mark exam question and pure relief"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#43664c] focus:bg-white"
                    autoFocus
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-sm font-semibold transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    disabled={!outcome.trim()}
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Next: Obstacle <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: OBSTACLE */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-900 leading-relaxed font-medium">
                    <strong className="font-bold text-amber-950">3. INTERNAL OBSTACLE:</strong> Identify the hyperrealistic inner hurdle, urge, or thought that will try to derail you.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">What internal impulse / thought might hold you back?</label>
                  <input
                    type="text"
                    value={obstacle}
                    onChange={(e) => setObstacle(e.target.value)}
                    placeholder="e.g. Brain fatigue when equations look dense; urge to check notifications or Discord"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#43664c] focus:bg-white"
                    autoFocus
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-sm font-semibold transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    disabled={!obstacle.trim()}
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Next: If-Then Plan <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: PLAN */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                  <div className="text-xs text-emerald-900 leading-relaxed font-medium">
                    <strong className="font-bold text-emerald-950">4. IF-THEN IMPLEMENTATION PLAN:</strong> Create the exact neural trigger: <em>If [Obstacle], then I will [Constructive Micro-Action]</em>.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Your If-Then Plan:</label>
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 mb-2">
                    <span className="font-bold text-amber-800">IF:</span> {obstacle || 'I feel distracted / tired'}
                  </div>
                  <input
                    type="text"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="THEN I will: take 3 physiological sighs and write the very next formula step on scratchpad"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#43664c] focus:bg-white"
                    autoFocus
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-sm font-semibold transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    disabled={!plan.trim()}
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-extrabold text-sm flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Lock In WOOP Intention
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Anchors */}
        {activeTab === 'saved' && (
          <div className="space-y-3 animate-in fade-in">
            {goals.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
                <p className="text-sm font-semibold text-slate-600">No WOOP anchors created yet.</p>
                <p className="text-xs text-slate-400 mt-1">Create your first Mental Contrasting goal to conquer inertia!</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
                >
                  Create WOOP Intention
                </button>
              </div>
            ) : (
              goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => {
                    if (onSelectGoal) {
                      onSelectGoal(g);
                      onClose();
                    }
                  }}
                  className="group relative p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-[#43664c] hover:bg-white transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 font-mono">
                        {g.targetSubject || 'General'}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#181c1e] group-hover:text-[#43664c] transition">
                        {g.wish}
                      </h4>
                    </div>
                    <button
                      onClick={(e) => handleDelete(g.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete anchor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-3">
                    <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-200 text-cyan-950 font-medium">
                      <span className="font-bold text-cyan-800 block text-[10px] uppercase font-mono">Best Outcome</span>
                      {g.outcome}
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 font-medium">
                      <span className="font-bold text-amber-800 block text-[10px] uppercase font-mono">Obstacle</span>
                      {g.obstacle}
                    </div>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs font-semibold">
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase font-mono">If-Then Action Plan</span>
                    {g.plan}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
