import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { IWoopGoal } from '../types';
import { deleteWoopGoalFromFirestore, saveWoopGoalToFirestore } from '../lib/firestoreService';
import { parseWoopPlan, formatWoopDate } from '../lib/woopUtils';
import { WoopBoardModal } from './WoopBoardModal';

interface WoopScreenProps {
  woopGoals: IWoopGoal[];
  isSidebarCollapsed?: boolean;
}

export const WoopScreen: React.FC<WoopScreenProps> = ({
  woopGoals,
  isSidebarCollapsed = false,
}) => {
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

  const filterTabs = useMemo(() => {
    const baseTabs = [
      { id: 'all', label: 'All anchors' },
      { id: 'career', label: 'Career & jobs' },
      { id: 'dsa', label: 'DSA & practice' },
      { id: 'focus', label: 'Focus & habits' },
      { id: 'projects', label: 'Projects & building' },
      { id: 'academics', label: 'Academics' },
    ];

    const customTabs: { id: string; label: string }[] = [];
    woopGoals.forEach((g) => {
      const subj = (g.targetSubject || '').trim();
      if (!subj) return;
      const lower = subj.toLowerCase();
      const matchesBase =
        lower.includes('career') ||
        lower.includes('job') ||
        lower.includes('dsa') ||
        lower.includes('focus') ||
        lower.includes('habit') ||
        lower.includes('project') ||
        lower.includes('build') ||
        lower.includes('academic') ||
        lower.includes('sem');
      if (!matchesBase && !customTabs.some((c) => c.label.toLowerCase() === lower)) {
        customTabs.push({ id: lower, label: subj });
      }
    });

    return [...baseTabs, ...customTabs];
  }, [woopGoals]);

  const filteredGoals = woopGoals.filter((g) => {
    if (subjectFilter === 'all') return true;
    const subj = (g.targetSubject || '').toLowerCase();
    if (subjectFilter === 'career') {
      return subj.includes('career') || subj.includes('job') || subj.includes('placement');
    }
    if (subjectFilter === 'focus') {
      return subj.includes('focus') || subj.includes('habit') || subj.includes('routine');
    }
    if (subjectFilter === 'projects') {
      return subj.includes('project') || subj.includes('build') || subj.includes('ai');
    }
    if (subjectFilter === 'academics') {
      return subj.includes('academic') || subj.includes('sem');
    }
    return subj.includes(subjectFilter.toLowerCase());
  });

  return (
    <main className={`flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full font-sans transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-16 md:pl-4' : 'md:ml-64'
    }`}>
      {/* Top Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Mental contrasting &amp; implementation intentions
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {woopGoals.length} {woopGoals.length === 1 ? 'anchor active' : 'anchors active'}
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#181c1e] tracking-tight">
            WOOP Goal &amp; Urgency Board
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-1">
            Dr. Gabriele Oettingen's protocol for conquering ADHD avoidance by pre-wiring neural reflexes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New WOOP anchor</span>
        </button>
      </header>

      {/* Rationale Banner / Mental Contrasting Explainer */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-3 items-center">
          <div className="px-2">
            <p className="text-xs font-semibold text-slate-800 mb-0.5">1. Wish</p>
            <p className="text-xs text-slate-500 leading-relaxed">Meaningful, feasible study intention</p>
          </div>
          <div className="px-2 sm:border-l sm:border-slate-100">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <p className="text-xs font-semibold text-slate-800">2. Outcome</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Emotional reward and relief</p>
          </div>
          <div className="px-2 sm:border-l sm:border-slate-100">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
              <p className="text-xs font-semibold text-slate-800">3. Obstacle</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Inner impulse, distraction, or fatigue</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 sm:ml-1">
            <p className="text-xs font-bold text-emerald-900 mb-0.5">4. If-Then Plan</p>
            <p className="text-[11px] text-emerald-800/90 leading-snug">Pre-wired behavioral response reflex</p>
          </div>
        </div>
      </div>

      {/* Filter / Category Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubjectFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                subjectFilter === tab.id
                  ? 'bg-[#181c1e] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          Showing {filteredGoals.length} of {woopGoals.length}
        </span>
      </div>

      {/* Goals Grid or Empty State */}
      {filteredGoals.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <Target className="w-12 h-12 mx-auto mb-3 text-emerald-700/60" />
          <h3 className="text-base font-bold text-[#181c1e] mb-1">
            No active WOOP anchors found
          </h3>
          <p className="text-xs text-[#545f72] max-w-md mx-auto mb-6 leading-relaxed">
            Pre-commit your focus before starting a task. Create a custom anchor or click a quick-start template below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left mb-6">
            <button
              onClick={() =>
                handleCreateQuickTemplate({
                  wish: 'I want a 10 LPA software engineering role',
                  outcome: 'Proving to myself, and to my father, that the effort pays off',
                  obstacle: 'Losing focus, forgetting fast, running out of patience',
                  plan: 'If I feel exhausted, then I take a short break, then restart on the smallest possible step.',
                  targetSubject: 'Career & Jobs',
                })
              }
              className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-left cursor-pointer shadow-2xs"
            >
              <span className="text-xs font-medium text-emerald-700 block mb-1">Career &amp; jobs</span>
              <p className="text-xs font-semibold text-slate-800">10 LPA milestone anchor</p>
            </button>

            <button
              onClick={() =>
                handleCreateQuickTemplate({
                  wish: 'Complete 2 LeetCode Tree Traversal Problems',
                  outcome: 'Deep mastery over recursive DFS / BFS tree patterns',
                  obstacle: 'Getting stuck and opening YouTube or Twitter',
                  plan: 'If I feel stuck for > 7 minutes, then I will draw recursion stack on paper instead of switching tabs.',
                  targetSubject: 'DSA & Practice',
                })
              }
              className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-left cursor-pointer shadow-2xs"
            >
              <span className="text-xs font-medium text-indigo-700 block mb-1">DSA &amp; practice</span>
              <p className="text-xs font-semibold text-slate-800">Tree traversal sprint</p>
            </button>

            <button
              onClick={() =>
                handleCreateQuickTemplate({
                  wish: '2 hours of uninterrupted deep focus',
                  outcome: 'Real momentum, relief of progress, and guilt-free relaxation',
                  obstacle: 'Restlessness and impulsive urge to check notifications',
                  plan: 'If urge to check phone arises, then I take 3 physiological sighs and restart on next micro-step.',
                  targetSubject: 'Focus & Habits',
                })
              }
              className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-left cursor-pointer shadow-2xs"
            >
              <span className="text-xs font-medium text-amber-700 block mb-1">Focus &amp; habits</span>
              <p className="text-xs font-semibold text-slate-800">Urge-interruption reset</p>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            + Create custom anchor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGoals.map((g) => {
            const parsed = parseWoopPlan(g.plan, g.obstacle);
            return (
              <div
                key={g.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Subject Tag, Date, Delete Action */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {g.targetSubject || 'General focus'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatWoopDate(g.createdAt)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(g.id)}
                      aria-label="Delete anchor"
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Delete anchor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wish: Simple, confident heading */}
                  <p className="text-xs text-slate-500 font-medium mb-1">Wish</p>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-snug">
                    {g.wish}
                  </h2>

                  {/* Outcome & Obstacle: Side-by-side, unboxed, subtle indicator dots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">Outcome</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {g.outcome}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">Obstacle</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {g.obstacle}
                      </p>
                    </div>
                  </div>

                  {/* If-Then Plan: The elevated behavior-change container */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 sm:p-4 mt-2">
                    <p className="text-xs font-medium text-emerald-800 mb-1">
                      {parsed.condition}
                    </p>
                    {parsed.action && (
                      <p className="text-sm sm:text-[15px] font-medium text-slate-900 leading-relaxed">
                        {parsed.action}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Zap className="w-3.5 h-3.5 text-slate-400" />
                    Active anchor
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Synced
                  </span>
                </div>
              </div>
            );
          })}
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
