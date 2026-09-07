import React, { useState, useMemo } from 'react';
import {
  DSA_CHAPTERS,
  DSA_PROBLEMS_DATA,
  AI_DATA_SCIENCE_COURSES,
  DsaProblem,
  AiCourse,
  ImportanceLevel,
  GenAiPhase,
  AiPriorityTier,
  ResourceFormat,
} from '../data/curriculumData';
import { StudyTheaterVideo } from '../types';
import {
  Sparkles,
  Play,
  ExternalLink,
  Youtube,
  Search,
  Code2,
  BrainCircuit,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Video,
} from 'lucide-react';

interface RoadmapScreenProps {
  onStartFocusFromItem: (title: string, description: string, url?: string) => void;
  onSendToIntake: (goalTitle: string) => void;
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
  onWatchVideo?: (video: StudyTheaterVideo) => void;
}

const AI_TIER_CONFIG: Record<
  AiPriorityTier,
  { label: string; bg: string; text: string; border: string; badge: string }
> = {
  'Tier 1 — Core': {
    label: 'Tier 1 — Core',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: '🏆 Tier 1 Core',
  },
  'Tier 2 — Differentiators': {
    label: 'Tier 2 — Differentiators',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    badge: '⚡ Tier 2 Differentiator',
  },
  'Tier 3 — Production / Ops': {
    label: 'Tier 3 — Production / Ops',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badge: '🛠️ Tier 3 Production',
  },
  'Optional / Not Core': {
    label: 'Optional / Not Core',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    badge: '📦 Optional / Supplementary',
  },
};

const FORMAT_CONFIG: Record<
  ResourceFormat,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  'Full Playlist': {
    label: 'Full Playlist',
    icon: '📚',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  'Single Video': {
    label: 'Single Video',
    icon: '🎬',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
  },
  'Article': {
    label: 'Article',
    icon: '📰',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
};

const IMPORTANCE_CONFIG: Record<
  ImportanceLevel,
  { label: string; bg: string; text: string; border: string; desc: string; icon: string }
> = {
  CRITICAL_MUST_WATCH: {
    label: 'MUST WATCH (Foundational)',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    desc: 'Critical core concept. Do NOT skip if building GenAI / Agents.',
    icon: '🔥',
  },
  HIGH_CORE: {
    label: 'HIGH CORE (Key Technique)',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    desc: 'High value technique to master for production capabilities.',
    icon: '⚡',
  },
  RECOMMENDED_PROJECT: {
    label: 'PRACTICE PROJECT',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    desc: 'Hands-on project to build portfolio and practical muscle.',
    icon: '🛠️',
  },
  OPTIONAL_ADVANCED: {
    label: 'SUPPLEMENTARY / OPTIONAL',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    desc: 'Helpful for deep dives or specific cloud platforms, but safe to skip initially.',
    icon: '📖',
  },
};

const ALL_PHASES: GenAiPhase[] = [
  'Phase 1: Python & Math Foundations',
  'Phase 2: Core ML & Feature Engineering',
  'Phase 3: Deep Learning & Transformers',
  'Phase 4: Generative AI, LLMs & RAG',
  'Phase 5: Agentic AI & Advanced Multi-Agents',
  'Phase 6: Enterprise MLOps & Cloud Deployment',
];

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  onSendToIntake,
  completedIds,
  onToggleComplete,
  onWatchVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'dsa'>('dsa');
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [dsaTierFilter, setDsaTierFilter] = useState<'all' | 'must_do' | 'optional_later'>('must_do');
  const [aiTierFilter, setAiTierFilter] = useState<'all' | 'tier_1' | 'tier_2' | 'tier_3' | 'optional'>('tier_1');
  const [selectedAiCategory, setSelectedAiCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [expandedCourseIds, setExpandedCourseIds] = useState<Set<string>>(new Set());

  const toggleExpandCourse = (courseId: string) => {
    setExpandedCourseIds((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  // Filtered DSA Problems
  const filteredDsaProblems = useMemo(() => {
    return DSA_PROBLEMS_DATA.filter((item) => {
      const matchModule = selectedModule === 'all' || item.moduleIndex === selectedModule;
      const matchTier =
        dsaTierFilter === 'all' ||
        (dsaTierFilter === 'must_do' && item.tier === 'MUST_DO_NOW') ||
        (dsaTierFilter === 'optional_later' && item.tier === 'OPTIONAL_LATER');
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.submoduleName && item.submoduleName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.practicePlatform && item.practicePlatform.toLowerCase().includes(searchQuery.toLowerCase()));
      const isDone = completedIds.has(item.id);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isDone) ||
        (statusFilter === 'pending' && !isDone);

      return matchModule && matchTier && matchSearch && matchStatus;
    });
  }, [selectedModule, dsaTierFilter, searchQuery, statusFilter, completedIds]);

  // Group filtered DSA by Chapter
  const dsaByChapter = useMemo(() => {
    const map = new Map<number, { title: string; problems: DsaProblem[] }>();
    DSA_CHAPTERS.forEach((ch) => {
      map.set(ch.id, { title: ch.title, problems: [] });
    });

    filteredDsaProblems.forEach((prob) => {
      const existing = map.get(prob.moduleIndex) || { title: prob.moduleName, problems: [] };
      existing.problems.push(prob);
      map.set(prob.moduleIndex, existing);
    });

    return map;
  }, [filteredDsaProblems]);

  // Filtered AI Courses
  const filteredAiCourses = useMemo(() => {
    return AI_DATA_SCIENCE_COURSES.filter((item) => {
      const matchTier =
        aiTierFilter === 'all' ||
        (aiTierFilter === 'tier_1' && item.tier === 'Tier 1 — Core') ||
        (aiTierFilter === 'tier_2' && item.tier === 'Tier 2 — Differentiators') ||
        (aiTierFilter === 'tier_3' && item.tier === 'Tier 3 — Production / Ops') ||
        (aiTierFilter === 'optional' && item.tier === 'Optional / Not Core');
      const matchCategory = selectedAiCategory === 'all' || item.category === selectedAiCategory;
      const matchPhase = selectedPhase === 'all' || item.phase === selectedPhase;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.videos && item.videos.some((v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)));
      const isDone = completedIds.has(item.id);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isDone) ||
        (statusFilter === 'pending' && !isDone);

      return matchTier && matchCategory && matchPhase && matchSearch && matchStatus;
    }).sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }, [aiTierFilter, selectedAiCategory, selectedPhase, searchQuery, statusFilter, completedIds]);

  // Group AI courses by Phase
  const coursesByPhase = useMemo(() => {
    const map = new Map<GenAiPhase, AiCourse[]>();
    ALL_PHASES.forEach((p) => map.set(p, []));

    filteredAiCourses.forEach((course) => {
      const list = map.get(course.phase) || [];
      list.push(course);
      map.set(course.phase, list);
    });

    return map;
  }, [filteredAiCourses]);

  // Stats calculation
  const totalDsaCount = DSA_PROBLEMS_DATA.length;
  const completedDsaCount = DSA_PROBLEMS_DATA.filter((p) => completedIds.has(p.id)).length;
  const dsaProgressPercent = Math.round((completedDsaCount / totalDsaCount) * 100);

  // Must-Do Core DSA (Trimmed Roadmap: 179 high-yield problems)
  const mustDoDsaCount = DSA_PROBLEMS_DATA.filter((p) => p.tier === 'MUST_DO_NOW').length;
  const completedMustDoDsaCount = DSA_PROBLEMS_DATA.filter(
    (p) => p.tier === 'MUST_DO_NOW' && completedIds.has(p.id)
  ).length;
  const mustDoDsaPercent = mustDoDsaCount > 0 ? Math.round((completedMustDoDsaCount / mustDoDsaCount) * 100) : 0;

  const totalAiCount = AI_DATA_SCIENCE_COURSES.length;
  const tier1AiCount = AI_DATA_SCIENCE_COURSES.filter((c) => c.tier === 'Tier 1 — Core').length;
  const completedTier1Count = AI_DATA_SCIENCE_COURSES.filter(
    (c) => c.tier === 'Tier 1 — Core' && completedIds.has(c.id)
  ).length;
  const tier1AiPercent = tier1AiCount > 0 ? Math.round((completedTier1Count / tier1AiCount) * 100) : 0;
  const completedAiCount = AI_DATA_SCIENCE_COURSES.filter((c) => completedIds.has(c.id)).length;

  return (
    <main
      id="screen-roadmap"
      className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full font-sans"
    >
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <BrainCircuit className="w-3.5 h-3.5 text-[#006494]" />
              Systematic GenAI &amp; DSA Roadmap
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            Curriculum &amp; Master Playlist
          </h1>
        </div>

        <div className="bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-4 self-start md:self-auto">
          <div className="text-center pr-4 border-r border-[#c2c8c0]">
            <p className="text-[11px] font-bold text-emerald-700 uppercase font-mono flex items-center gap-1 justify-center">
              <span>🏆 Tier 1 AI Core</span>
            </p>
            <p className="text-lg font-bold text-emerald-700 font-mono">
              {completedTier1Count}/{tier1AiCount}
            </p>
            <div className="w-24 h-1.5 bg-[#ebeef0] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{
                  width: `${tier1AiPercent}%`,
                }}
              />
            </div>
          </div>
          <div className="text-center pr-4 border-r border-[#c2c8c0]">
            <p className="text-[11px] font-semibold text-[#43664c] uppercase font-mono flex items-center gap-1 justify-center">
              <span>🎯 Ready DSA</span>
            </p>
            <p className="text-lg font-bold text-[#43664c] font-mono">
              {completedMustDoDsaCount}/{mustDoDsaCount}
            </p>
            <div className="w-24 h-1.5 bg-[#ebeef0] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#43664c] rounded-full transition-all"
                style={{ width: `${mustDoDsaPercent}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold text-[#545f72] uppercase font-mono">Total</p>
            <p className="text-lg font-bold text-[#006494] font-mono">
              {completedAiCount + completedDsaCount}/{totalAiCount + totalDsaCount}
            </p>
            <div className="w-20 h-1.5 bg-[#ebeef0] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#006494] rounded-full transition-all"
                style={{
                  width: `${Math.round(
                    ((completedAiCount + completedDsaCount) / (totalAiCount + totalDsaCount)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap border-b border-[#c2c8c0] mb-6">
        <button
          onClick={() => {
            setActiveTab('dsa');
            setSelectedModule('all');
          }}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'dsa'
              ? 'border-[#43664c] text-[#43664c] bg-[#8bb192]/10 rounded-t-lg font-extrabold'
              : 'border-transparent text-[#545f72] hover:text-[#181c1e]'
          }`}
        >
          <Code2 className="w-4 h-4 text-[#43664c]" />
          <span>Code &amp; Debug DSA</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ai');
            setSelectedAiCategory('all');
          }}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'border-[#006494] text-[#006494] bg-[#5fafe9]/10 rounded-t-lg font-extrabold'
              : 'border-transparent text-[#545f72] hover:text-[#181c1e]'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-[#006494]" />
          <span>AI/ML Roadmap (Divyam Dawar 25)</span>
        </button>
      </div>

      <div className="bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#727971]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'ai'
                ? 'Search LangChain, RAG, Transformers, Docker...'
                : 'Search problems, algorithms, LeetCode...'
            }
            className={`w-full pl-9 pr-3 py-2 text-sm bg-[#f1f4f6] rounded-xl border border-transparent focus:bg-white focus:outline-none transition-all placeholder-[#727971] ${
              activeTab === 'dsa' ? 'focus:border-[#43664c]' : 'focus:border-[#006494]'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-[#f1f4f6] p-1 rounded-xl border border-[#c2c8c0]/50 text-xs">
            {(['all', 'pending', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#ffffff] text-[#181c1e] shadow-xs font-bold'
                    : 'text-[#545f72] hover:text-[#181c1e]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'dsa' && (
        <div className="mb-6 space-y-3">
          {/* Trimmed Roadmap Focus Banner */}
          <div className="p-3.5 sm:p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                🎯
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>Trimmed Interview-Ready DSA Curriculum</span>
                  <span className="text-[11px] font-mono font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.2 rounded-full">
                    {mustDoDsaCount} Problems
                  </span>
                </p>
                <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                  Curated high-yield topics across Ch 1–16. Skips heavy Hard topics (3Sum/4Sum, N-Queens, 15.4–15.6 Shortest Path/MST, DP Strings/Stocks, Tries) for maximum interview velocity.
                </p>
              </div>
            </div>

            {/* Quick Tier Filter Toggles */}
            <div className="flex items-center gap-1 self-start md:self-center bg-white p-1 rounded-xl border border-emerald-200 text-xs shrink-0 shadow-xs">
              <button
                onClick={() => setDsaTierFilter('must_do')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  dsaTierFilter === 'must_do'
                    ? 'bg-[#43664c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎯 Do Now ({mustDoDsaCount})</span>
              </button>
              <button
                onClick={() => setDsaTierFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  dsaTierFilter === 'all'
                    ? 'bg-[#43664c] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All ({totalDsaCount})</span>
              </button>
              <button
                onClick={() => setDsaTierFilter('optional_later')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  dsaTierFilter === 'optional_later'
                    ? 'bg-[#43664c] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⏭️ Skip/Later ({totalDsaCount - mustDoDsaCount})</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-1 flex gap-2 no-scrollbar">
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedModule === 'all'
                  ? 'bg-[#43664c] text-white shadow-xs'
                  : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
              }`}
            >
              All Chapters ({dsaTierFilter === 'must_do' ? mustDoDsaCount : dsaTierFilter === 'optional_later' ? totalDsaCount - mustDoDsaCount : totalDsaCount})
            </button>
            {DSA_CHAPTERS.map((ch) => {
              const isSelected = selectedModule === ch.id;
              const chapterCount = dsaTierFilter === 'must_do' 
                ? ch.mustDoCount ?? 0 
                : dsaTierFilter === 'optional_later'
                ? ch.count - (ch.mustDoCount ?? 0)
                : ch.count;
              const isSkippedInTrimmed = ch.mustDoCount === 0;

              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedModule(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#43664c] text-white shadow-xs font-bold'
                      : isSkippedInTrimmed && dsaTierFilter === 'must_do'
                      ? 'bg-slate-100 border border-slate-200 text-slate-400 opacity-60'
                      : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
                  }`}
                  title={ch.tierDescription}
                >
                  <span className="opacity-75 font-mono">Ch {ch.id}:</span>
                  <span>{ch.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-black/5">
                    {chapterCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="mb-6 space-y-3">
          {/* Priority Tier Focus Banner */}
          <div className="p-3.5 sm:p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                🧠
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-1.5">
                  <span>Divyam Dawar 25 Prioritized AI/ML Resources</span>
                  <span className="text-[11px] font-mono font-bold bg-sky-200/70 text-sky-900 px-2 py-0.2 rounded-full">
                    {filteredAiCourses.length} Showing
                  </span>
                </p>
                <p className="text-[11px] text-sky-700 leading-relaxed mt-0.5">
                  Master Tier 1 Core first (9 items), build 1–2 projects, then level up with Tier 2 Differentiators (4 items), followed by Tier 3 Production/Ops (7 items).
                </p>
              </div>
            </div>

            {/* Quick Tier Filter Toggles */}
            <div className="flex items-center gap-1 self-start md:self-center bg-white p-1 rounded-xl border border-sky-200 text-xs shrink-0 shadow-xs flex-wrap">
              <button
                onClick={() => setAiTierFilter('tier_1')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  aiTierFilter === 'tier_1'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span>🏆 Tier 1 Core</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    aiTierFilter === 'tier_1' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  9
                </span>
              </button>

              <button
                onClick={() => setAiTierFilter('tier_2')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  aiTierFilter === 'tier_2'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <span>⚡ Tier 2</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    aiTierFilter === 'tier_2' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  4
                </span>
              </button>

              <button
                onClick={() => setAiTierFilter('tier_3')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  aiTierFilter === 'tier_3'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span>🛠️ Tier 3 Ops</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    aiTierFilter === 'tier_3' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  7
                </span>
              </button>

              <button
                onClick={() => setAiTierFilter('optional')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  aiTierFilter === 'optional'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Optional</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    aiTierFilter === 'optional' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  5
                </span>
              </button>

              <button
                onClick={() => setAiTierFilter('all')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  aiTierFilter === 'all'
                    ? 'bg-[#006494] text-white shadow-xs'
                    : 'text-[#545f72] hover:text-[#181c1e]'
                }`}
              >
                <span>All 25</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-1 flex gap-2 no-scrollbar">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedPhase === 'all'
                  ? 'bg-[#006494] text-white shadow-xs font-bold'
                  : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#006494]'
              }`}
            >
              All Phases
            </button>
            {ALL_PHASES.map((ph, idx) => {
              const isSelected = selectedPhase === ph;
              const shortName = ph.split(':')[1] || ph;
              return (
                <button
                  key={ph}
                  onClick={() => setSelectedPhase(ph)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#006494] text-white shadow-xs font-bold'
                      : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#006494]'
                  }`}
                >
                  <span className="opacity-75 font-mono">P{idx + 1}:</span>
                  <span>{shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-8">
          {Array.from(coursesByPhase.entries()).map(([phaseTitle, courses]) => {
            if (courses.length === 0) return null;
            const phaseCompletedCount = courses.filter((c) => completedIds.has(c.id)).length;

            return (
              <div key={phaseTitle} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#006494] tracking-wide border-l-4 border-[#006494] pl-3 py-0.5 flex items-center gap-2">
                    <span>{phaseTitle}</span>
                    <span className="text-xs font-semibold text-[#545f72] font-mono">
                      ({phaseCompletedCount}/{courses.length})
                    </span>
                  </h2>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => {
                    const hasVideos = Boolean(course.videos && course.videos.length > 0);
                    const completedVideosInCourse = hasVideos
                      ? course.videos!.filter((v) => completedIds.has(v.id)).length
                      : 0;
                    const isSearchMatchInVideos =
                      searchQuery.trim() !== '' &&
                      Boolean(course.videos?.some((v) => v.title.toLowerCase().includes(searchQuery.toLowerCase())));
                    const isExpanded = expandedCourseIds.has(course.id) || isSearchMatchInVideos;
                    const isDone =
                      completedIds.has(course.id) ||
                      (hasVideos && completedVideosInCourse === course.videos!.length);
                    const tierInfo = AI_TIER_CONFIG[course.tier];
                    const formatInfo = FORMAT_CONFIG[course.resourceFormat];
                    const ytId = course.youtubeUrl
                      ? course.youtubeUrl.match(
                          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
                        )?.[1]
                      : null;

                    const cardThumbnail =
                      course.thumbnailUrl ||
                      (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null) ||
                      course.videos?.[0]?.thumbnailUrl ||
                      null;

                    return (
                      <div
                        key={course.id}
                        className={`w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isDone
                            ? 'border-[#c4eccb] bg-[#c4eccb]/10'
                            : 'border-slate-200 bg-white hover:border-[#006494]/60 hover:shadow-xs'
                        }`}
                      >
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5 flex-1 min-w-0 font-sans">
                            <button
                              onClick={() => {
                                if (hasVideos) {
                                  const allDone = completedVideosInCourse === course.videos!.length;
                                  course.videos!.forEach((v) => {
                                    const isVDone = completedIds.has(v.id);
                                    if (allDone && isVDone) onToggleComplete(v.id);
                                    else if (!allDone && !isVDone) onToggleComplete(v.id);
                                  });
                                }
                                onToggleComplete(course.id);
                              }}
                              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                isDone
                                  ? 'bg-[#006494] border-[#006494] text-white'
                                  : 'border-slate-400 hover:border-[#006494] hover:bg-blue-50 bg-white'
                              }`}
                              title={isDone ? 'Mark as pending' : 'Mark as completed'}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>

                            {cardThumbnail ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (onWatchVideo && (ytId || course.videos?.[0])) {
                                    const targetVid = course.videos?.[0];
                                    onWatchVideo({
                                      id: targetVid ? targetVid.id : course.id,
                                      title: targetVid ? targetVid.title : course.title,
                                      youtubeUrl: targetVid ? targetVid.youtubeUrl : course.youtubeUrl!,
                                      subject: course.category,
                                      difficulty: course.tier,
                                    });
                                  } else if (course.youtubeUrl) {
                                    window.open(course.youtubeUrl, '_blank');
                                  } else if (course.articleUrl) {
                                    window.open(course.articleUrl, '_blank');
                                  }
                                }}
                                className="relative hidden sm:block w-28 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200/90 shadow-2xs group text-left cursor-pointer mt-0.5 bg-slate-900"
                                title="Watch in Study Theater"
                              >
                                <img
                                  src={cardThumbnail}
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  onError={(e) => {
                                    if (ytId) {
                                      e.currentTarget.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Youtube className="w-5 h-5 text-white drop-shadow-md" />
                                </div>
                              </button>
                            ) : course.articleUrl ? (
                              <a
                                href={course.articleUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="relative hidden sm:flex w-28 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-purple-400 items-center justify-center shrink-0 group text-left mt-0.5 shadow-2xs"
                                title="Read Article on Medium"
                              >
                                <span className="text-2xl group-hover:scale-110 transition-transform">📰</span>
                              </a>
                            ) : (
                              <a
                                href={course.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="relative hidden sm:flex w-28 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 items-center justify-center shrink-0 group text-left mt-0.5"
                                title="Open Playlist on YouTube"
                              >
                                <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
                              </a>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                                  #{course.recommendedOrder}
                                </span>
                                {tierInfo && (
                                  <span
                                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-mono ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`}
                                  >
                                    <span>{tierInfo.badge}</span>
                                  </span>
                                )}
                                {formatInfo && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 font-mono ${formatInfo.bg} ${formatInfo.text} ${formatInfo.border}`}
                                  >
                                    <span>{formatInfo.icon}</span>
                                    <span>{formatInfo.label}</span>
                                  </span>
                                )}
                                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100/90 border border-slate-200 px-2 py-0.5 rounded-full font-mono">
                                  {course.instructor}
                                </span>

                                {hasVideos && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandCourse(course.id)}
                                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-[10px] font-bold transition cursor-pointer border border-sky-200"
                                  >
                                    <Video className="w-3 h-3 text-sky-600" />
                                    <span>{course.videos!.length} Lessons</span>
                                    <span className="font-mono bg-sky-200/70 text-sky-900 px-1.5 py-0.1 rounded-full">
                                      {completedVideosInCourse}/{course.videos!.length}
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                                  </button>
                                )}
                              </div>

                              <h3
                                className={`text-[15px] font-bold leading-snug ${
                                  isDone ? 'text-slate-400 line-through' : 'text-[#181c1e]'
                                }`}
                              >
                                {course.title}
                              </h3>

                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {course.description}
                              </p>

                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {course.keyTakeaways.map((takeaway, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                                  >
                                    ✓ {takeaway}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center mt-2 md:mt-0">
                            {hasVideos && (
                              <button
                                type="button"
                                onClick={() => toggleExpandCourse(course.id)}
                                className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer border ${
                                  isExpanded
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                                }`}
                              >
                                <Video className="w-3.5 h-3.5 text-sky-600" />
                                <span>{isExpanded ? 'Hide Lessons' : `View ${course.videos!.length} Lessons`}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            {course.youtubeUrl && (
                              <button
                                onClick={() => {
                                  if (ytId && onWatchVideo) {
                                    onWatchVideo({
                                      id: course.id,
                                      title: course.title,
                                      youtubeUrl: course.youtubeUrl!,
                                      subject: course.category,
                                      difficulty: course.tier,
                                    });
                                  } else {
                                    window.open(course.youtubeUrl, '_blank');
                                  }
                                }}
                                className="px-3.5 py-2 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                title={course.resourceFormat === 'Full Playlist' ? 'Open Playlist' : 'Watch Video'}
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>{course.resourceFormat === 'Full Playlist' ? 'Open' : 'Watch'}</span>
                              </button>
                            )}

                            {course.articleUrl && (
                              <a
                                href={course.articleUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Read Article</span>
                              </a>
                            )}

                            <button
                              onClick={() => onSendToIntake(course.title)}
                              className="px-3 py-2 bg-[#f1f4f6] hover:bg-[#e5e9eb] text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                              title="Break down into actionable study steps"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Course Video Lessons from CSV */}
                        {hasVideos && isExpanded && (
                          <div className="border-t border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4 space-y-2.5">
                            <div className="flex items-center justify-between px-1 mb-1">
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-[#006494]" />
                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-mono">
                                  Course Lessons ({completedVideosInCourse}/{course.videos!.length} Completed)
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 sm:w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full transition-all"
                                    style={{
                                      width: `${Math.round((completedVideosInCourse / course.videos!.length) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[11px] font-mono font-bold text-slate-600">
                                  {Math.round((completedVideosInCourse / course.videos!.length) * 100)}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                              {course.videos!.map((vid) => {
                                const isVidDone = completedIds.has(vid.id);
                                const vidYtId = vid.youtubeUrl.match(
                                  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
                                )?.[1];

                                return (
                                  <div
                                    key={vid.id}
                                    className={`rounded-xl border p-2.5 sm:p-3 flex items-start sm:items-center justify-between gap-3 transition-all ${
                                      isVidDone
                                        ? 'border-emerald-200 bg-emerald-50/30'
                                        : 'border-slate-200 bg-white hover:border-[#006494]/50 hover:shadow-2xs'
                                    }`}
                                  >
                                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                      <button
                                        onClick={() => onToggleComplete(vid.id)}
                                        className={`mt-0.5 sm:mt-0 w-4.5 h-4.5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                          isVidDone
                                            ? 'bg-[#006494] border-[#006494] text-white'
                                            : 'border-slate-300 hover:border-[#006494] hover:bg-blue-50 bg-white'
                                        }`}
                                        title={isVidDone ? 'Mark as pending' : 'Mark as completed'}
                                      >
                                        {isVidDone && <Check className="w-3 h-3 stroke-[3]" />}
                                      </button>

                                      {vidYtId && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (onWatchVideo) {
                                              onWatchVideo({
                                                id: vid.id,
                                                title: vid.title,
                                                youtubeUrl: vid.youtubeUrl,
                                                subject: course.category,
                                                difficulty: course.tier,
                                              });
                                            } else {
                                              window.open(vid.youtubeUrl, '_blank');
                                            }
                                          }}
                                          className="relative hidden sm:block w-16 h-10 rounded-md overflow-hidden shrink-0 border border-slate-200 group text-left cursor-pointer"
                                          title="Watch in Study Theater"
                                        >
                                          <img
                                            src={`https://i.ytimg.com/vi/${vidYtId}/hqdefault.jpg`}
                                            alt={vid.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            loading="lazy"
                                          />
                                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                                          </div>
                                        </button>
                                      )}

                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                          <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                                            #{vid.videoIndex}
                                          </span>
                                          {vid.durationTimestamp && (
                                            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                                              ⏱️ {vid.durationTimestamp}
                                            </span>
                                          )}
                                        </div>
                                        <p
                                          className={`text-xs sm:text-[13px] font-bold leading-tight ${
                                            isVidDone ? 'text-slate-400 line-through' : 'text-[#181c1e]'
                                          }`}
                                          title={vid.title}
                                        >
                                          {vid.title}
                                        </p>
                                        {vid.description && (
                                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                            {vid.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                      <button
                                        onClick={() => {
                                          if (onWatchVideo) {
                                            onWatchVideo({
                                              id: vid.id,
                                              title: vid.title,
                                              youtubeUrl: vid.youtubeUrl,
                                              subject: course.category,
                                              difficulty: course.tier,
                                            });
                                          } else {
                                            window.open(vid.youtubeUrl, '_blank');
                                          }
                                        }}
                                        className="px-2.5 py-1.5 bg-[#006494] hover:bg-[#004e75] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-xs transition cursor-pointer"
                                        title="Watch in Study Theater"
                                      >
                                        <Play className="w-3 h-3 fill-current" />
                                        <span className="hidden sm:inline">Watch</span>
                                      </button>

                                      <button
                                        onClick={() => onSendToIntake(vid.title)}
                                        className="p-1.5 bg-[#f1f4f6] hover:bg-[#e5e9eb] text-slate-700 rounded-lg transition cursor-pointer"
                                        title="Break down into actionable study steps"
                                      >
                                        <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Phase Pagination Footer (Jump to next phase without leaving view) */}
          {selectedPhase !== 'all' && (
            <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              {(() => {
                const phaseIdx = ALL_PHASES.indexOf(selectedPhase as GenAiPhase);
                const prevPhase = phaseIdx > 0 ? ALL_PHASES[phaseIdx - 1] : null;
                const nextPhase = phaseIdx < ALL_PHASES.length - 1 ? ALL_PHASES[phaseIdx + 1] : null;

                return (
                  <>
                    <button
                      disabled={!prevPhase}
                      onClick={() => {
                        if (prevPhase) {
                          setSelectedPhase(prevPhase);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                        prevPhase
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'opacity-40 cursor-not-allowed text-slate-400'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Phase</span>
                    </button>

                    <div className="text-center">
                      <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider block">
                        Phase {phaseIdx + 1} of {ALL_PHASES.length}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-xs">
                        {selectedPhase}
                      </p>
                    </div>

                    <button
                      disabled={!nextPhase}
                      onClick={() => {
                        if (nextPhase) {
                          setSelectedPhase(nextPhase);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                        nextPhase
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          : 'opacity-40 cursor-not-allowed text-slate-400'
                      }`}
                    >
                      <span>Next Phase</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'dsa' && (
        <div className="space-y-8">
          {Array.from(dsaByChapter.entries()).map(([chapterId, chapterData]) => {
            if (chapterData.problems.length === 0) return null;
            const chapterCompletedCount = chapterData.problems.filter((p) => completedIds.has(p.id)).length;
            const chapterInfo = DSA_CHAPTERS.find((c) => c.id === chapterId);

            return (
              <div key={chapterId} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h2 className="text-base font-extrabold text-[#43664c] tracking-wide border-l-4 border-[#43664c] pl-3 py-0.5 flex items-center gap-2">
                    <span>Ch {chapterId}: {chapterData.title}</span>
                    <span className="text-xs font-semibold text-[#545f72] font-mono">
                      ({chapterCompletedCount}/{chapterData.problems.length})
                    </span>
                  </h2>
                  {chapterInfo?.tierDescription && (
                    <span className="text-xs text-[#545f72] italic pl-4 sm:pl-0 font-medium">
                      {chapterInfo.tierDescription}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {chapterData.problems.map((prob) => {
                    const isDone = completedIds.has(prob.id);
                    const ytId = prob.youtubeUrl
                      ? prob.youtubeUrl.match(
                          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
                        )?.[1]
                      : null;

                    return (
                      <div
                        key={prob.id}
                        className={`w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isDone
                            ? 'border-[#c4eccb] bg-[#c4eccb]/10'
                            : 'border-slate-200 bg-white hover:border-[#43664c]/60 hover:shadow-xs'
                        }`}
                      >
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5 flex-1 min-w-0 font-sans">
                            <button
                              onClick={() => onToggleComplete(prob.id)}
                              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                isDone
                                  ? 'bg-[#43664c] border-[#43664c] text-white'
                                  : 'border-slate-400 hover:border-[#43664c] hover:bg-emerald-50 bg-white'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>

                            {ytId && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (onWatchVideo) {
                                    onWatchVideo({
                                      id: prob.id,
                                      title: prob.title,
                                      youtubeUrl: prob.youtubeUrl!,
                                      subject: `Ch ${prob.moduleIndex}: ${prob.moduleName}`,
                                      difficulty: prob.difficulty,
                                    });
                                  } else {
                                    window.open(prob.youtubeUrl, '_blank');
                                  }
                                }}
                                className="relative hidden sm:block w-24 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 group text-left cursor-pointer"
                                title="Watch in Study Theater"
                              >
                                <img
                                  src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                                  alt={prob.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Youtube className="w-5 h-5 text-white drop-shadow-md" />
                                </div>
                              </button>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#43664c] bg-[#8bb192]/20 border border-[#8bb192]/30 font-mono">
                                  Ch {prob.moduleIndex}
                                </span>
                                {prob.submoduleName && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                    {prob.submoduleName}
                                  </span>
                                )}
                                {prob.tier === 'MUST_DO_NOW' ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-0.5">
                                    <span>🎯 DO NOW</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-slate-500 bg-slate-100 border border-slate-200 flex items-center gap-0.5">
                                    <span>⏭️ LATER</span>
                                  </span>
                                )}
                                {prob.difficulty && (
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                      prob.difficulty === 'Easy'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : prob.difficulty === 'Medium'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                                  >
                                    {prob.difficulty}
                                  </span>
                                )}
                              </div>
                              <h3 className={`text-[15px] font-bold ${isDone ? 'text-slate-400 line-through' : 'text-[#181c1e]'}`}>
                                {prob.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            {prob.youtubeUrl && (
                              <button
                                onClick={() => {
                                  if (onWatchVideo) {
                                    onWatchVideo({
                                      id: prob.id,
                                      title: prob.title,
                                      youtubeUrl: prob.youtubeUrl!,
                                      subject: `Ch ${prob.moduleIndex}: ${prob.moduleName}`,
                                      difficulty: prob.difficulty,
                                    });
                                  } else {
                                    window.open(prob.youtubeUrl, '_blank');
                                  }
                                }}
                                className="px-3.5 py-2 bg-[#43664c] hover:bg-[#34513c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Watch</span>
                              </button>
                            )}
                            {prob.practiceUrl && (
                              <a
                                href={prob.practiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 bg-[#f1f4f6] hover:bg-[#e5e9eb] text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Chapter Pagination Footer (Jump to next chapter without leaving view) */}
          {selectedModule !== 'all' && (
            <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <button
                disabled={Number(selectedModule) <= 1}
                onClick={() => {
                  const prevMod = Number(selectedModule) - 1;
                  if (prevMod >= 1) {
                    setSelectedModule(prevMod);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  Number(selectedModule) > 1
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'opacity-40 cursor-not-allowed text-slate-400'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <div className="text-center">
                <span className="text-[11px] font-mono font-bold text-[#43664c] uppercase tracking-wider block">
                  Chapter {selectedModule} of {DSA_CHAPTERS.length}
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-xs">
                  {DSA_CHAPTERS.find((c) => c.id === Number(selectedModule))?.title}
                </p>
              </div>

              <button
                disabled={Number(selectedModule) >= DSA_CHAPTERS.length}
                onClick={() => {
                  const nextMod = Number(selectedModule) + 1;
                  if (nextMod <= DSA_CHAPTERS.length) {
                    setSelectedModule(nextMod);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  Number(selectedModule) < DSA_CHAPTERS.length
                    ? 'bg-[#43664c] hover:bg-[#34513c] text-white shadow-xs'
                    : 'opacity-40 cursor-not-allowed text-slate-400'
                }`}
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
