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
} from 'lucide-react';

interface RoadmapScreenProps {
  onStartFocusFromItem: (title: string, description: string, url?: string) => void;
  onSendToIntake: (goalTitle: string) => void;
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
  onWatchVideo?: (video: StudyTheaterVideo) => void;
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
  onSendToIntake,
  completedIds,
  onToggleComplete,
  onWatchVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'dsa'>('dsa');
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [selectedAiCategory, setSelectedAiCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Filtered DSA Problems
  const filteredDsaProblems = useMemo(() => {
    return DSA_PROBLEMS_DATA.filter((item) => {
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
  }, [selectedModule, searchQuery, statusFilter, completedIds]);

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
      const matchCategory = selectedAiCategory === 'all' || item.category === selectedAiCategory;
      const matchPhase = selectedPhase === 'all' || item.phase === selectedPhase;
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

      return matchCategory && matchPhase && matchSearch && matchStatus;
    }).sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }, [selectedAiCategory, selectedPhase, searchQuery, statusFilter, completedIds]);

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

  const coreDsaCount = DSA_PROBLEMS_DATA.filter((p) => p.moduleIndex <= 10).length;
  const completedCoreDsaCount = DSA_PROBLEMS_DATA.filter(
    (p) => p.moduleIndex <= 10 && completedIds.has(p.id)
  ).length;
  const coreDsaProgressPercent = Math.round((completedCoreDsaCount / coreDsaCount) * 100);

  const totalAiCount = AI_DATA_SCIENCE_COURSES.length;
  const criticalMustWatchCount = AI_DATA_SCIENCE_COURSES.filter(
    (c) => c.importance === 'CRITICAL_MUST_WATCH'
  ).length;
  const completedCriticalCount = AI_DATA_SCIENCE_COURSES.filter(
    (c) => c.importance === 'CRITICAL_MUST_WATCH' && completedIds.has(c.id)
  ).length;
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
            <p className="text-[11px] font-bold text-rose-600 uppercase font-mono">Must-Watch AI</p>
            <p className="text-lg font-bold text-rose-700 font-mono">
              {completedCriticalCount}/{criticalMustWatchCount}
            </p>
            <div className="w-20 h-1.5 bg-rose-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all"
                style={{
                  width: `${criticalMustWatchCount > 0 ? Math.round((completedCriticalCount / criticalMustWatchCount) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
          <div className="text-center pr-4 border-r border-[#c2c8c0]">
            <p className="text-[11px] font-semibold text-[#545f72] uppercase font-mono">Core DSA</p>
            <p className="text-lg font-bold text-[#43664c] font-mono">
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
          <span>Krish Naik GenAI &amp; ML</span>
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
        <div className="mb-6">
          <div className="overflow-x-auto pb-1 flex gap-2 no-scrollbar">
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedModule === 'all'
                  ? 'bg-[#43664c] text-white shadow-xs'
                  : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
              }`}
            >
              All Chapters ({totalDsaCount})
            </button>
            {DSA_CHAPTERS.map((ch) => {
              const isSelected = selectedModule === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedModule(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#43664c] text-white shadow-xs font-bold'
                      : 'bg-[#ffffff] border border-[#c2c8c0] text-[#545f72] hover:border-[#43664c]'
                  }`}
                >
                  <span className="opacity-75 font-mono">Ch {ch.id}:</span>
                  <span>{ch.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="mb-6 space-y-2">
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
                    const isDone = completedIds.has(course.id);
                    const importanceInfo = IMPORTANCE_CONFIG[course.importance];
                    const ytId = course.youtubeUrl
                      ? course.youtubeUrl.match(
                          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
                        )?.[1]
                      : null;

                    return (
                      <div
                        key={course.id}
                        className={`w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isDone
                            ? 'border-[#c4eccb] bg-[#c4eccb]/10'
                            : 'border-slate-200 bg-white hover:border-[#006494]/60 hover:shadow-xs'
                        }`}
                      >
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5 flex-1 min-w-0 font-sans">
                            <button
                              onClick={() => onToggleComplete(course.id)}
                              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                isDone
                                  ? 'bg-[#006494] border-[#006494] text-white'
                                  : 'border-slate-400 hover:border-[#006494] hover:bg-blue-50 bg-white'
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
                                      id: course.id,
                                      title: course.title,
                                      youtubeUrl: course.youtubeUrl!,
                                      subject: course.category,
                                      difficulty: course.importance.replace(/_/g, ' '),
                                    });
                                  } else {
                                    window.open(course.youtubeUrl, '_blank');
                                  }
                                }}
                                className="relative hidden sm:block w-24 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 group text-left cursor-pointer"
                                title="Watch in Study Theater"
                              >
                                <img
                                  src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Youtube className="w-5 h-5 text-white drop-shadow-md" />
                                </div>
                              </button>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                                  #{course.recommendedOrder}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-mono ${importanceInfo.bg} ${importanceInfo.text} ${importanceInfo.border}`}
                                >
                                  <span>{importanceInfo.icon}</span>
                                  <span>{importanceInfo.label}</span>
                                </span>
                              </div>
                              <h3 className={`text-[15px] font-bold ${isDone ? 'text-slate-400 line-through' : 'text-[#181c1e]'}`}>
                                {course.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            {course.youtubeUrl && (
                              <button
                                onClick={() => {
                                  if (onWatchVideo) {
                                    onWatchVideo({
                                      id: course.id,
                                      title: course.title,
                                      youtubeUrl: course.youtubeUrl!,
                                      subject: course.category,
                                      difficulty: course.importance.replace(/_/g, ' '),
                                    });
                                  } else {
                                    window.open(course.youtubeUrl, '_blank');
                                  }
                                }}
                                className="px-3.5 py-2 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Watch</span>
                              </button>
                            )}
                            <button
                              onClick={() => onSendToIntake(course.title)}
                              className="px-3 py-2 bg-[#f1f4f6] hover:bg-[#e5e9eb] text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'dsa' && (
        <div className="space-y-8">
          {Array.from(dsaByChapter.entries()).map(([chapterId, chapterData]) => {
            if (chapterData.problems.length === 0) return null;
            const chapterCompletedCount = chapterData.problems.filter((p) => completedIds.has(p.id)).length;

            return (
              <div key={chapterId} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#43664c] tracking-wide border-l-4 border-[#43664c] pl-3 py-0.5 flex items-center gap-2">
                    <span>Ch {chapterId}: {chapterData.title}</span>
                    <span className="text-xs font-semibold text-[#545f72] font-mono">
                      ({chapterCompletedCount}/{chapterData.problems.length})
                    </span>
                  </h2>
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
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-[#43664c] bg-[#8bb192]/20 border border-[#8bb192]/30 font-mono">
                                  Ch {prob.moduleIndex}: {prob.moduleName}
                                </span>
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
        </div>
      )}
    </main>
  );
};
