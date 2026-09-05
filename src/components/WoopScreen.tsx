import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Brain,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { IWoopGoal } from '../types';
import { deleteWoopGoalFromFirestore, saveWoopGoalToFirestore } from '../lib/firestoreService';
import { WoopBoardModal } from './WoopBoardModal';

interface WoopScreenProps {
  woopGoals: IWoopGoal[];
}

export const WoopScreen: React.FC<WoopScreenProps> = ({ woopGoals }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const handleDelete = async (id: string) => {
    await deleteWoopGoalFromFirestore(id);
  };

  const handleCreateQuickTemplate = async (template: {
    wish: string;
    outcome: string;
    obstacle: string;
    plan: string;
    targetSubject: string;
  }) => {
    const newGoal: IWoopGoal = {
      id: `woop_${Date.now()}`,
      ...template,
      createdAt: Date.now(),
    };
    await saveWoopGoalToFirestore(newGoal);
  };

  const filteredGoals = woopGoals.filter((g) => {
    if (subjectFilter === 'all') return true;
    return (g.targetSubject || '').toLowerCase().includes(subjectFilter.toLowerCase());
  });

  return (
    <main className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full font-sans">
      {/* Top Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Target className="w-3.5 h-3.5" />
              Mental Contrasting &amp; Implementation Intentions
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full font-mono">
              {woopGoals.length} Anchors Active
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            WOOP Goal &amp; Urgency Board
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            Wish &bull; Outcome &bull; Obstacle &bull; Plan (Dr. Gabriele Oettingen protocol). Prevents ADHD avoidance by pre-wiring neural reflexes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#43664c] hover:bg-[#34513c] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New WOOP Anchor</span>
        </button>
      </header>

      {/* Rationale Banner / Mental Contrasting Explainer */}
      <div className="mb-6 p-5 rounded-3xl bg-white border border-[#c2c8c0] shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950">
            <div className="text-[10px] font-mono font-bold uppercase text-indigo-700 mb-0.5">W &bull; Wish</div>
            <p className="text-xs font-bold text-[#181c1e]">Challenging yet feasible study intention</p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-950">
            <div className="text-[10px] font-mono font-bold uppercase text-cyan-700 mb-0.5">O &bull; Outcome</div>
            <p className="text-xs font-bold text-[#181c1e]">Best emotional reward &amp; grade impact</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-950">
            <div className="text-[10px] font-mono font-bold uppercase text-amber-700 mb-0.5">O &bull; Obstacle</div>
            <p className="text-xs font-bold text-[#181c1e]">Realistic ADHD distraction or fatigue</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950">
            <div className="text-[10px] font-mono font-bold uppercase text-emerald-700 mb-0.5">P &bull; Plan</div>
            <p className="text-xs font-bold text-[#181c1e]">If [Obstacle], then I will [Action]</p>
          </div>
        </div>
      </div>

      {/* Filter / Category Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Anchors' },
            { id: 'dsa', label: '💻 DSA & Algorithms' },
            { id: 'genai', label: '🤖 Generative AI' },
            { id: 'cloud', label: '☁️ Cloud & DevOps' },
            { id: 'sem7', label: '📚 Semester 7' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubjectFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                subjectFilter === tab.id
                  ? 'bg-[#181c1e] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">
          Showing {filteredGoals.length} of {woopGoals.length}
        </span>
      </div>

      {/* Goals Grid or Empty State */}
      {filteredGoals.length === 0 ? (
        <div className="py-12 px-6 rounded-3xl bg-white border border-[#c2c8c0] shadow-xs text-center">
          <Target className="w-12 h-12 mx-auto mb-3 text-emerald-700/60" />
          <h3 className="text-base font-extrabold text-[#181c1e] mb-1">
            No Active WOOP Anchors Found
          </h3>
          <p className="text-xs text-[#545f72] max-w-md mx-auto mb-6">
            Pre-commit your focus before starting a task. Create a custom anchor or click a quick-start template below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left mb-6">
            <button
              onClick={() =>
                handleCreateQuickTemplate({
                  wish: 'Complete 2 LeetCode Tree Problems',
                  outcome: 'Deep mastery over recursive DFS / BFS tree patterns',
                  obstacle: 'Getting stuck and opening YouTube / Twitter',
                  plan: 'If I feel stuck for > 7 minutes, then I will draw recursion stack on paper instead of switching tabs.',
                  targetSubject: 'DSA & Algorithms',
                })
              }
              className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 transition text-left cursor-pointer"
            >
              <span className="text-[10px] font-bold font-mono text-emerald-800 uppercase block mb-1">DSA Template</span>
              <p className="text-xs font-bold text-slate-800">Tree Traversal Sprint</p>
            </button>

            <button
              onClick={() =>
                handleCreateQuickTemplate({
                  wish: 'Finish RAG Pipeline Architecture Video',
                  outcome: 'Understand Vector DB indexing and embeddings thoroughly',
                  obstacle: 'Tiredness and brain fog after 15 minutes of lecture',
                  plan: 'If brain fog hits, then I will do a 3-cycle Physiological Sigh and take 2 timestamped recall notes.',
                  targetSubject: 'Generative AI',
                })
              }
              className="p-3.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200 transition text-left cursor-pointer"
            >
              <span className="text-[10px] font-bold font-mono text-indigo-800 uppercase block mb-1">GenAI Template</span>
              <p className="text-xs font-bold text-slate-800">RAG Deep Dive</p>
            </button>

            <button
              onClick={() =>
                handleCreateQuickTemplate({
                  wish: 'Solve 3 Sem 7 PYQ Questions',
                  outcome: 'Lock in guaranteed 15 marks for upcoming exams',
                  obstacle: 'Procrastinating on theory questions',
                  plan: 'If I want to delay, then I will set a 10-minute timer and write just 5 bullet points.',
                  targetSubject: 'Semester 7',
                })
              }
              className="p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 transition text-left cursor-pointer"
            >
              <span className="text-[10px] font-bold font-mono text-amber-800 uppercase block mb-1">Sem 7 Template</span>
              <p className="text-xs font-bold text-slate-800">PYQ Theory Sprint</p>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            + Create Custom Anchor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGoals.map((g) => (
            <div
              key={g.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#c2c8c0] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                      {g.targetSubject || 'General Focus'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Delete WOOP Anchor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Wish */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 block mb-0.5">
                    Wish (Target Goal)
                  </span>
                  <h3 className="text-base font-black text-[#181c1e] leading-snug">
                    {g.wish}
                  </h3>
                </div>

                {/* Outcome & Obstacle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-cyan-950">
                    <span className="text-[9px] font-mono font-bold uppercase text-cyan-700 block mb-1">
                      Outcome (Dopamine Payoff)
                    </span>
                    <p className="text-xs font-medium leading-relaxed">{g.outcome}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-950">
                    <span className="text-[9px] font-mono font-bold uppercase text-amber-700 block mb-1">
                      Obstacle (Internal Friction)
                    </span>
                    <p className="text-xs font-medium leading-relaxed">{g.obstacle}</p>
                  </div>
                </div>

                {/* If-Then Plan */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 block mb-1">
                    Pre-wired If-Then Plan (Neural Reflex)
                  </span>
                  <p className="text-xs font-bold leading-relaxed">{g.plan}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Active Anchor</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Launcher */}
      <WoopBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goals={woopGoals}
      />
    </main>
  );
};
