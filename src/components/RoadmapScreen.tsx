import React, { useState, useMemo } from 'react';
import {
  DSA_CHAPTERS,
  DSA_PROBLEMS_DATA,
  AI_DATA_SCIENCE_COURSES,
  DsaProblem,
  AiCourse,
  ImportanceLevel,
  GenAiPhase,
} from '../data/curriculumData';
import {
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  ExternalLink,
  Youtube,
  Search,
  Filter,
  Layers,
  Code2,
  BrainCircuit,
  Clock,
  ArrowRight,
  Flame,
  AlertCircle,
  Zap,
  Target,
  ListOrdered,
  Tag,
  Check,
  Award,
  ChevronRight,
} from 'lucide-react';

interface RoadmapScreenProps {
  onStartFocusFromItem: (title: string, description: string, url?: string) => void;
  onSendToIntake: (goalTitle: string) => void;
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
}

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
  onStartFocusFromItem,
  onSendToIntake,
  completedIds,
  onToggleComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'dsa'>('ai');
  const [dsaScope, setDsaScope] = useState<'core' | 'optional' | 'all'>('core');
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [selectedAiCategory, setSelectedAiCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'systematic_phases' | 'flat_priority'>('systematic_phases');

  // Filtered DSA Problems
  const filteredDsaProblems = useMemo(() => {
    return DSA_PROBLEMS_DATA.filter((item) => {
      // DSA Scope Filter: Core (1-10), Optional (11-17), All (1-17)
      if (dsaScope === 'core' && item.moduleIndex > 10) return false;
      if (dsaScope === 'optional' && item.moduleIndex <= 10) return false;

      const matchModule = selectedModule === 'all' || item.moduleIndex === selectedModule;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.practicePlatform && item.practicePlatform.toLowerCase().includes(searchQuery.toLowerCase()));
      const isDone = completedIds.has(item.id);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isDone) ||
        (statusFilter === 'pending' && !isDone);

      return matchModule && matchSearch && matchStatus;
    });
  }, [dsaScope, selectedModule, searchQuery, statusFilter, completedIds]);

  // Filtered AI Courses
  const filteredAiCourses = useMemo(() => {
    return AI_DATA_SCIENCE_COURSES.filter((item) => {
      const matchCategory = selectedAiCategory === 'all' || item.category === selectedAiCategory;
      const matchPhase = selectedPhase === 'all' || item.phase === selectedPhase;
      const matchImportance = selectedImportance === 'all' || item.importance === selectedImportance;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const isDone = completedIds.has(item.id);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isDone) ||
        (statusFilter === 'pending' && !isDone);

      return matchCategory && matchPhase && matchImportance && matchSearch && matchStatus;
    }).sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }, [selectedAiCategory, selectedPhase, selectedImportance, searchQuery, statusFilter, completedIds]);

  // Group by Phase for Systematic Learning view
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

  // Core DSA (Chapters 1 to 10)
  const coreDsaCount = DSA_PROBLEMS_DATA.filter((p) => p.moduleIndex <= 10).length;
  const completedCoreDsaCount = DSA_PROBLEMS_DATA.filter(
    (p) => p.moduleIndex <= 10 && completedIds.has(p.id)
  ).length;
  const coreDsaProgressPercent = Math.round((completedCoreDsaCount / coreDsaCount) * 100);

  // Optional DSA (Chapters 11 to 17)
  const optionalDsaCount = DSA_PROBLEMS_DATA.filter((p) => p.moduleIndex > 10).length;
  const completedOptionalDsaCount = DSA_PROBLEMS_DATA.filter(
    (p) => p.moduleIndex > 10 && completedIds.has(p.id)
  ).length;

  const totalAiCount = AI_DATA_SCIENCE_COURSES.length;
  const criticalMustWatchCount = AI_DATA_SCIENCE_COURSES.filter(
    (c) => c.importance === 'CRITICAL_MUST_WATCH'
  ).length;
  const completedCriticalCount = AI_DATA_SCIENCE_COURSES.filter(
    (c) => c.importance === 'CRITICAL_MUST_WATCH' && completedIds.has(c.id)
  ).length;
  const completedAiCount = AI_DATA_SCIENCE_COURSES.filter((c) => completedIds.has(c.id)).length;
  const aiProgressPercent = Math.round((completedAiCount / totalAiCount) * 100);

  const handleLaunchSprint = (title: string, description: string, url?: string) => {
    onStartFocusFromItem(title, description, url);
  };

  return (
    <main
      id="screen-roadmap"
      className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full"
    >
      {/* Top Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-[#006494]" />
              Systematic GenAI &amp; DSA Roadmap
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            Study Roadmap &amp; Master Playlist
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            DSA Core (Chapters 1–10) + AI Foundations prioritized into sequential phases.
          </p>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-4 self-start md:self-auto">
          <div className="text-center pr-4 border-r border-[#c2c8c0]">
            <p className="text-[11px] font-bold text-rose-600 uppercase">Must-Watch AI</p>
            <p className="text-lg font-bold text-rose-700">
              {completedCriticalCount}/{criticalMustWatchCount}
            </p>
            <div className="w-20 h-1.5 bg-rose-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all"
                style={{
                  width: `${Math.round((completedCriticalCount / criticalMustWatchCount) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="text-center pr-4 border-r border-[#c2c8c0]">
            <p className="text-[11px] font-semibold text-[#545f72] uppercase">Core DSA (Ch 1-10)</p>
            <p className="text-lg font-bold text-[#43664c]">
              {completedCoreDsaCount}/{coreDsaCount}
            </p>
            <div className="w-20 h-1.5 bg-[#ebeef0] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#43664c] rounded-full transition-all"
                style={{ width: `${coreDsaProgressPercent}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold text-[#545f72] uppercase">Total Mastered</p>
            <p className="text-lg font-bold text-[#006494]">
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

      {/* Main Track Selection Tabs */}
      <div className="flex border-b border-[#c2c8c0] mb-6">
        <button
          onClick={() => {
            setActiveTab('ai');
            setSelectedAiCategory('all');
          }}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'border-[#006494] text-[#006494] bg-[#5fafe9]/10 rounded-t-lg'
              : 'border-transparent text-[#545f72] hover:text-[#181c1e]'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Krish Naik GenAI Playlist ({totalAiCount} Systematic Courses)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('dsa');
            setSelectedModule('all');
          }}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'dsa'
              ? 'border-[#43664c] text-[#43664c] bg-[#8bb192]/10 rounded-t-lg'
              : 'border-transparent text-[#545f72] hover:text-[#181c1e]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>DSA &amp; Python Sheet (17 Chapters • {totalDsaCount} Topics)</span>
        </button>
      </div>

      {/* Systematic GenAI Priority Legend (Only visible on AI tab) */}
      {activeTab === 'ai' && (
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 rounded-2xl p-4 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#181c1e] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#006494]" />
                <span>Systematic AI Roadmap: Importance Priority Framework</span>
              </h2>
              <p className="text-xs text-[#545f72] mt-0.5">
                We've categorized every one-shot into what is <strong>CRITICAL</strong> to watch first vs what can be skipped for now.
              </p>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-200 text-xs self-start md:self-auto shadow-xs">
              <button
                onClick={() => setViewMode('systematic_phases')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'systematic_phases'
                    ? 'bg-[#006494] text-white shadow-xs'
                    : 'text-[#545f72] hover:text-[#181c1e]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Phase-by-Phase Order</span>
              </button>
              <button
                onClick={() => setViewMode('flat_priority')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'flat_priority'
                    ? 'bg-[#006494] text-white shadow-xs'
                    : 'text-[#545f72] hover:text-[#181c1e]'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Linear Playlist</span>
              </button>
            </div>
          </div>

          {/* Quick Importance Badges Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-blue-200/60">
            {(
              [
                { key: 'all', label: 'All Importance Tiers', count: totalAiCount, color: 'bg-white border-gray-200 text-gray-700' },
                { key: 'CRITICAL_MUST_WATCH', label: 'Must Watch First (7)', count: criticalMustWatchCount, color: 'bg-rose-50 border-rose-200 text-rose-800' },
                { key: 'HIGH_CORE', label: 'High Value Core (3)', count: 3, color: 'bg-amber-50 border-amber-200 text-amber-800' },
                { key: 'RECOMMENDED_PROJECT', label: 'Hands-on Projects (4)', count: 4, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              ] as const
            ).map((b) => (
              <button
                key={b.key}
                onClick={() => setSelectedImportance(selectedImportance === b.key ? 'all' : b.key)}
                className={`text-left p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${b.color} ${
                  selectedImportance === b.key ? 'ring-2 ring-[#006494] shadow-xs' : 'hover:opacity-90'
                }`}
              >
                <span className="font-bold">{b.label}</span>
                {selectedImportance === b.key && <Check className="w-3.5 h-3.5 text-[#006494]" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
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
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#f1f4f6] rounded-xl border border-transparent focus:border-[#006494] focus:bg-white focus:outline-none transition-all placeholder-[#727971]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#f1f4f6] p-1 rounded-xl border border-[#c2c8c0]/50 text-xs">
            {(['all', 'pending', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#ffffff] text-[#181c1e] shadow-xs'
                    : 'text-[#545f72] hover:text-[#181c1e]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter / Category Filter Pills */}
      {activeTab === 'dsa' && (
        <div className="mb-6 space-y-3">
          {/* DSA Scope Toggle: Core (1-10) vs Optional (11-17) vs All */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setDsaScope('core');
                setSelectedModule('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                dsaScope === 'core'
                  ? 'bg-[#43664c] text-white'
                  : 'bg-white border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
              }`}
            >
              <span>🎯 Core Track (Chapters 1–10)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  dsaScope === 'core' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#43664c]'
                }`}
              >
                {coreDsaCount} Problems
              </span>
            </button>

            <button
              onClick={() => {
                setDsaScope('optional');
                setSelectedModule('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                dsaScope === 'optional'
                  ? 'bg-[#545f72] text-white'
                  : 'bg-white border border-[#c2c8c0] text-[#545f72] hover:border-[#545f72]'
              }`}
            >
              <span>💡 Optional Track (Chapters 11–17)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  dsaScope === 'optional' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {optionalDsaCount} Problems
              </span>
            </button>

            <button
              onClick={() => {
                setDsaScope('all');
                setSelectedModule('all');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                dsaScope === 'all'
                  ? 'bg-[#181c1e] text-white'
                  : 'bg-white border border-[#c2c8c0] text-[#545f72] hover:border-[#181c1e]'
              }`}
            >
              <span>All Chapters (1–17)</span>
              <span className="text-[10px] opacity-75">({totalDsaCount})</span>
            </button>
          </div>

          {/* Module Pills for current Scope */}
          <div className="overflow-x-auto pb-1 flex gap-2 no-scrollbar">
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedModule === 'all'
                  ? dsaScope === 'optional'
                    ? 'bg-[#545f72] text-white shadow-xs'
                    : 'bg-[#43664c] text-white shadow-xs'
                  : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
              }`}
            >
              {dsaScope === 'core'
                ? `All Core (${coreDsaCount})`
                : dsaScope === 'optional'
                ? `All Optional (${optionalDsaCount})`
                : `All Chapters (${totalDsaCount})`}
            </button>
            {DSA_CHAPTERS.filter((ch) => {
              if (dsaScope === 'core') return ch.isCore;
              if (dsaScope === 'optional') return !ch.isCore;
              return true;
            }).map((ch) => {
              const isSelected = selectedModule === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedModule(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? ch.isCore
                        ? 'bg-[#43664c] text-white shadow-xs'
                        : 'bg-[#545f72] text-white shadow-xs'
                      : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
                  }`}
                >
                  <span className="opacity-75">Ch {ch.id}:</span>
                  <span>{ch.title}</span>
                  <span className="text-[10px] opacity-60">({ch.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="mb-6 space-y-2">
          {/* Phase Filter Bar */}
          <div className="overflow-x-auto pb-1 flex gap-2 no-scrollbar">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedPhase === 'all'
                  ? 'bg-[#006494] text-white shadow-xs'
                  : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#006494]'
              }`}
            >
              All 6 Phases ({totalAiCount})
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
                      ? 'bg-[#006494] text-white shadow-xs'
                      : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#006494]'
                  }`}
                >
                  <span className="opacity-75">P{idx + 1}:</span>
                  <span>{shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="overflow-x-auto pb-1 flex gap-2 no-scrollbar">
            {(
              [
                'all',
                'Generative AI',
                'Agentic AI',
                'Deep Learning',
                'Machine Learning',
                'MLOps & Deployment',
                'Python & Math',
              ] as const
            ).map((cat) => {
              const isSelected = selectedAiCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedAiCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-100 text-[#006494] font-bold border border-blue-300'
                      : 'bg-[#ffffff] border border-[#c2c8c0]/60 text-[#545f72] hover:border-[#006494]'
                  }`}
                >
                  {cat === 'all' ? 'All Subjects' : cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Task List - AI Courses (SYSTEMATIC PHASES VIEW) */}
      {activeTab === 'ai' && viewMode === 'systematic_phases' && (
        <div className="space-y-6">
          {Array.from(coursesByPhase.entries()).map(([phaseTitle, courses], phaseIndex) => {
            if (courses.length === 0) return null;
            const phaseCompletedCount = courses.filter((c) => completedIds.has(c.id)).length;
            const phaseProgress = Math.round((phaseCompletedCount / courses.length) * 100);

            return (
              <section
                key={phaseTitle}
                className="bg-white border border-[#c2c8c0] rounded-3xl p-5 md:p-6 shadow-xs space-y-4"
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#006494] text-white flex items-center justify-center font-bold text-sm">
                      {phaseIndex + 1}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#181c1e]">
                        {phaseTitle}
                      </h2>
                      <p className="text-xs text-[#545f72]">
                        {courses.length} courses in sequence • {phaseCompletedCount} completed
                      </p>
                    </div>
                  </div>

                  {/* Phase mini progress */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="w-24 h-2 bg-[#ebeef0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#006494] rounded-full transition-all"
                        style={{ width: `${phaseProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#006494]">{phaseProgress}%</span>
                  </div>
                </div>

                {/* Course Cards inside this phase */}
                <div className="space-y-3">
                  {courses.map((course) => {
                    const isDone = completedIds.has(course.id);
                    const importanceInfo = IMPORTANCE_CONFIG[course.importance];

                    return (
                      <div
                        key={course.id}
                        className={`w-full rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                          isDone
                            ? 'border-[#c4eccb] bg-[#c4eccb]/15'
                            : 'border-[#e2e8f0] bg-[#ffffff] hover:border-[#006494] hover:shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Left: Checkbox + Badges + Title + Description + Key Takeaways */}
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            <button
                              onClick={() => onToggleComplete(course.id)}
                              className={`mt-1 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                isDone
                                  ? 'bg-[#006494] border-[#006494] text-white'
                                  : 'border-[#727971] hover:border-[#006494] bg-white'
                              }`}
                              title={isDone ? 'Mark as pending' : 'Mark as completed'}
                            >
                              {isDone && <CheckCircle2 className="w-4 h-4" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              {/* Meta badges: Order + Importance + Category + Duration */}
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                                  #{course.recommendedOrder}
                                </span>

                                <span
                                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${importanceInfo.bg} ${importanceInfo.text} ${importanceInfo.border}`}
                                  title={importanceInfo.desc}
                                >
                                  <span>{importanceInfo.icon}</span>
                                  <span>{importanceInfo.label}</span>
                                </span>

                                <span className="text-[11px] font-bold text-[#006494] bg-[#5fafe9]/20 px-2 py-0.5 rounded-full">
                                  {course.category}
                                </span>

                                {course.durationHours && (
                                  <span className="text-[11px] text-[#545f72] font-mono flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {course.durationHours}
                                  </span>
                                )}

                                <span className="text-[11px] text-[#545f72] bg-[#ebeef0] px-2 py-0.5 rounded">
                                  {course.instructor}
                                </span>
                              </div>

                              {/* Course Title */}
                              <h3
                                className={`text-[15px] sm:text-[16px] font-bold ${
                                  isDone ? 'line-through text-[#545f72]' : 'text-[#181c1e]'
                                }`}
                              >
                                {course.title}
                              </h3>

                              {/* Description */}
                              <p className="text-[13px] text-[#545f72] mt-1 line-clamp-2">
                                {course.description}
                              </p>

                              {/* Key Takeaways & Prerequisites */}
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  Core Takeaways:
                                </span>
                                {course.keyTakeaways.map((takeaway) => (
                                  <span
                                    key={takeaway}
                                    className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                                  >
                                    {takeaway}
                                  </span>
                                ))}
                              </div>

                              {course.prerequisites && course.prerequisites.length > 0 && (
                                <div className="mt-1.5 text-[11px] text-[#717d74] flex items-center gap-1">
                                  <span className="font-semibold text-gray-500">Prerequisites:</span>
                                  <span>{course.prerequisites.join(' • ')}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0">
                            {course.youtubeUrl && (
                              <a
                                href={course.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center"
                                title="Watch YouTube Lecture Video"
                              >
                                <Youtube className="w-4 h-4" />
                              </a>
                            )}

                            <button
                              onClick={() => onSendToIntake(course.title)}
                              className="px-3 py-2 bg-[#ebeef0] hover:bg-[#e0e3e5] text-[#181c1e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Deconstruct this course with AI into bite-sized 10m micro-steps"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
                              <span>AI Chunk</span>
                            </button>

                            <button
                              onClick={() =>
                                handleLaunchSprint(
                                  course.title,
                                  `Watch & study: ${course.title}. Take notes on ${course.keyTakeaways.join(
                                    ', '
                                  )}.`,
                                  course.youtubeUrl
                                )
                              }
                              className="px-3.5 py-2 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                              title="Launch a focused 10-minute study sprint on this course"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Focus 10m</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Task List - AI Courses (FLAT PRIORITY VIEW) */}
      {activeTab === 'ai' && viewMode === 'flat_priority' && (
        <div className="space-y-3">
          {filteredAiCourses.length === 0 ? (
            <div className="bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-8 text-center text-[#545f72]">
              No courses found for this filter. Try adjusting your search query.
            </div>
          ) : (
            filteredAiCourses.map((course) => {
              const isDone = completedIds.has(course.id);
              const importanceInfo = IMPORTANCE_CONFIG[course.importance];

              return (
                <div
                  key={course.id}
                  className={`w-full bg-[#ffffff] border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all shadow-xs ${
                    isDone
                      ? 'border-[#c4eccb] bg-[#c4eccb]/15'
                      : 'border-[#c2c8c0] hover:border-[#006494]'
                  }`}
                >
                  {/* Left: Checkbox + Badges + Title */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleComplete(course.id)}
                      className={`mt-1 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-[#006494] border-[#006494] text-white'
                          : 'border-[#727971] hover:border-[#006494] bg-white'
                      }`}
                      title={isDone ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                          #{course.recommendedOrder}
                        </span>

                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${importanceInfo.bg} ${importanceInfo.text} ${importanceInfo.border}`}
                          title={importanceInfo.desc}
                        >
                          <span>{importanceInfo.icon}</span>
                          <span>{importanceInfo.label}</span>
                        </span>

                        <span className="text-[11px] font-bold text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full">
                          {course.phase.split(':')[1] || course.phase}
                        </span>

                        {course.durationHours && (
                          <span className="text-[11px] text-[#545f72] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.durationHours}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-[16px] font-bold ${
                          isDone ? 'line-through text-[#545f72]' : 'text-[#181c1e]'
                        }`}
                      >
                        {course.title}
                      </h3>

                      <p className="text-[13px] text-[#545f72] mt-1 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {course.keyTakeaways.map((takeaway) => (
                          <span
                            key={takeaway}
                            className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                          >
                            {takeaway}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    {course.youtubeUrl && (
                      <a
                        href={course.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center"
                        title="Watch YouTube Lecture Video"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => onSendToIntake(course.title)}
                      className="px-3 py-2 bg-[#ebeef0] hover:bg-[#e0e3e5] text-[#181c1e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
                      <span>AI Chunk</span>
                    </button>

                    <button
                      onClick={() =>
                        handleLaunchSprint(
                          course.title,
                          `Watch & study: ${course.title}. Key topics: ${course.keyTakeaways.join(
                            ', '
                          )}.`,
                          course.youtubeUrl
                        )
                      }
                      className="px-3.5 py-2 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Focus 10m</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Task List - DSA Problems */}
      {activeTab === 'dsa' && (
        <div className="space-y-3">
          {filteredDsaProblems.length === 0 ? (
            <div className="bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-8 text-center text-[#545f72]">
              No problems match your current filter. Try adjusting your search query.
            </div>
          ) : (
            filteredDsaProblems.map((prob) => {
              const isDone = completedIds.has(prob.id);
              return (
                <div
                  key={prob.id}
                  className={`w-full bg-[#ffffff] border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${
                    isDone
                      ? 'border-[#c4eccb] bg-[#c4eccb]/15'
                      : 'border-[#c2c8c0] hover:border-[#8bb192]'
                  }`}
                >
                  {/* Left: Checkbox + Title + Meta */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleComplete(prob.id)}
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-[#43664c] border-[#43664c] text-white'
                          : 'border-[#727971] hover:border-[#43664c] bg-white'
                      }`}
                      title={isDone ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            prob.moduleIndex <= 10
                              ? 'text-[#43664c] bg-[#8bb192]/20'
                              : 'text-slate-700 bg-slate-200'
                          }`}
                        >
                          Ch {prob.moduleIndex}: {prob.moduleName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            prob.moduleIndex <= 10
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {prob.moduleIndex <= 10 ? '🎯 Core' : '💡 Optional'}
                        </span>
                        {prob.difficulty && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        )}
                        {prob.practicePlatform && (
                          <span className="text-[11px] text-[#545f72] bg-[#ebeef0] px-2 py-0.5 rounded">
                            {prob.practicePlatform}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-[15px] sm:text-[16px] font-bold ${
                          isDone ? 'line-through text-[#545f72]' : 'text-[#181c1e]'
                        }`}
                      >
                        {prob.title}
                      </h3>

                      {prob.submoduleName && (
                        <p className="text-xs text-[#717d74] mt-0.5">
                          Topic: {prob.submoduleName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions & Links */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {prob.youtubeUrl && (
                      <a
                        href={prob.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Watch Striver / TakeUForward YouTube Video Tutorial"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {prob.practiceUrl && (
                      <a
                        href={prob.practiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Open Practice Problem on Coding Platform"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() =>
                        handleLaunchSprint(
                          prob.title,
                          `Solve & understand: ${prob.title} (${prob.moduleName}). Practice and trace test cases.`,
                          prob.youtubeUrl
                        )
                      }
                      className="px-3.5 py-2 bg-[#43664c] hover:bg-[#38553f] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="Start a dedicated 10-minute focus sprint on this problem right now"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Focus 10m</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
};
