import React, { useState, useEffect } from 'react';
import {
  DailyPlanState,
  DailyScheduleBlock,
  TaskItem,
  TaskImportance,
} from '../types';
import {
  Sunrise,
  Footprints,
  Brain,
  Code2,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Play,
  Plus,
  Minus,
  Clock,
  Flame,
  Target,
  Award,
  ArrowRight,
  RotateCcw,
  Check,
  Coffee,
  Volume2,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DailyPlannerScreenProps {
  onLaunchTaskToNow: (task: TaskItem) => void;
  onLaunchFullSprint: (tasks: TaskItem[]) => void;
}

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; iconBg: string; badge: string }
> = {
  dsa: {
    bg: 'bg-emerald-50/70',
    text: 'text-[#43664c]',
    border: 'border-[#8bb192]/40',
    iconBg: 'bg-[#43664c] text-white',
    badge: 'DSA Core (Ch 1-10)',
  },
  genai: {
    bg: 'bg-blue-50/70',
    text: 'text-[#006494]',
    border: 'border-blue-200',
    iconBg: 'bg-[#006494] text-white',
    badge: 'GenAI & Transformers',
  },
  revision: {
    bg: 'bg-purple-50/70',
    text: 'text-purple-800',
    border: 'border-purple-200',
    iconBg: 'bg-purple-700 text-white',
    badge: 'Spaced Revision',
  },
  steps: {
    bg: 'bg-amber-50/70',
    text: 'text-amber-900',
    border: 'border-amber-200',
    iconBg: 'bg-amber-600 text-white',
    badge: '10k Steps Movement',
  },
  english: {
    bg: 'bg-indigo-50/70',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-600 text-white',
    badge: '10-Min English Practice',
  },
  break: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-200',
    iconBg: 'bg-slate-600 text-white',
    badge: 'Dopamine Reset',
  },
  custom: {
    bg: 'bg-teal-50/70',
    text: 'text-teal-900',
    border: 'border-teal-200',
    iconBg: 'bg-teal-700 text-white',
    badge: 'Custom Focus',
  },
};

const ENGLISH_TOPIC_PROMPTS = [
  {
    topic: "How Self-Attention in Transformers Works",
    prompt: "Speak out loud for 3 minutes explaining Query (Q), Key (K), and Value (V) matrices to a junior developer in clear, confident English.",
    keywords: ["dot-product", "similarity score", "contextual embedding", "parallel processing"],
  },
  {
    topic: "Kadane's Algorithm & Subarray Sum",
    prompt: "Explain why resetting the current running sum to zero when it becomes negative is optimal in linear O(N) time.",
    keywords: ["contiguous subarray", "prefix sum", "linear scan", "optimal substructure"],
  },
  {
    topic: "RAG Pipeline (Retrieval Augmented Generation)",
    prompt: "Describe the end-to-end flow: Document chunking -> Vector Embeddings -> ChromaDB -> Prompt Augmentation.",
    keywords: ["retrieval", "vector database", "hallucination mitigation", "cosine similarity"],
  },
  {
    topic: "Two Pointers vs Sliding Window",
    prompt: "Compare two pointer techniques on sorted arrays versus dynamic window sizing for substring problems.",
    keywords: ["left and right boundaries", "time complexity", "pointer convergence", "shrink and expand"],
  },
];

export const DailyPlannerScreen: React.FC<DailyPlannerScreenProps> = ({
  onLaunchTaskToNow,
  onLaunchFullSprint,
}) => {
  const [userName, setUserName] = useState('Kunal');
  const [dsaHours, setDsaHours] = useState(2);
  const [genAiHours, setGenAiHours] = useState(2);
  const [revisionHours, setRevisionHours] = useState(1);
  const [stepGoal, setStepGoal] = useState(10000);
  const [currentSteps, setCurrentSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('focusflow_daily_steps');
      return saved ? parseInt(saved, 10) : 2500;
    } catch {
      return 2500;
    }
  });
  const [englishMinutes, setEnglishMinutes] = useState(10);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [customGoals, setCustomGoals] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('Hii Kunal! What you want to do today?');
  const [motivationalQuote, setMotivationalQuote] = useState(
    '2hrs DSA + 2hrs GenAI + 1hr Revision + 10,000 Steps + 10 mins English improvement. Structured for maximum dopamine and zero burnout.'
  );

  // English 10-Min Timer State
  const [englishTimerRunning, setEnglishTimerRunning] = useState(false);
  const [englishSecondsLeft, setEnglishSecondsLeft] = useState(10 * 60);
  const [currentEnglishPromptIndex, setCurrentEnglishPromptIndex] = useState(0);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  // Schedule Blocks State
  const [scheduleBlocks, setScheduleBlocks] = useState<DailyScheduleBlock[]>(() => {
    try {
      const saved = localStorage.getItem('focusflow_daily_plan_blocks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [
      {
        id: 'plan-dsa-1',
        timeSlot: '09:00 AM - 10:00 AM',
        title: 'DSA Deep Focus Block 1: Problem Framing & Logic (60 min)',
        category: 'dsa',
        durationMinutes: 60,
        icon: 'code',
        description: 'Pick 1-2 core problems from Chapters 1-10. Dry run with pen and paper before coding.',
        whyItMatters: 'Morning cognitive peak is best for complex algorithmic thinking.',
        stepsTarget: 0,
        isCompleted: false,
        subSteps: [
          { id: 's-dsa-1', title: 'Frame problem constraints & edge cases on paper', minutes: 15, isCompleted: true, importance: 'MUST_DO' },
          { id: 's-dsa-2', title: 'Write optimal clean solution without looking at hints', minutes: 30, isCompleted: false, importance: 'CORE' },
          { id: 's-dsa-3', title: 'Test boundary conditions & dry-run submit', minutes: 15, isCompleted: false, importance: 'PRACTICE' },
        ],
      },
      {
        id: 'plan-steps-1',
        timeSlot: '10:00 AM - 10:25 AM',
        title: 'Movement & Dopamine Reset (3,000 Steps Walk)',
        category: 'steps',
        durationMinutes: 25,
        icon: 'footprints',
        description: 'Step away from screen. Brisk outdoor walk or indoor pacing while listening to tech podcast.',
        whyItMatters: 'Physical movement clears cognitive fatigue and boosts executive function.',
        stepsTarget: 3000,
        isCompleted: false,
        subSteps: [
          { id: 's-step-1', title: 'Fill water bottle and start walking outside / on terrace', minutes: 20, isCompleted: true, importance: 'MUST_DO' },
          { id: 's-step-2', title: 'Check step counter: hit +3,000 steps mark', minutes: 5, isCompleted: false, importance: 'CORE' },
        ],
      },
      {
        id: 'plan-dsa-2',
        timeSlot: '10:25 AM - 11:25 AM',
        title: 'DSA Deep Focus Block 2: Pattern Recognition (60 min)',
        category: 'dsa',
        durationMinutes: 60,
        icon: 'code',
        description: 'Solve a related problem to solidify the pattern (Sliding Window, Binary Search, or Linked Lists).',
        whyItMatters: 'Solving 2 problems of the same pattern locks the neural pathways.',
        stepsTarget: 0,
        isCompleted: false,
        subSteps: [
          { id: 's-dsa-4', title: 'Identify pattern archetype (Two Pointers vs Hash Map)', minutes: 15, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-dsa-5', title: 'Implement code & analyze Time/Space complexity', minutes: 30, isCompleted: false, importance: 'CORE' },
          { id: 's-dsa-6', title: 'Log key pattern insight into study notes', minutes: 15, isCompleted: false, importance: 'PRACTICE' },
        ],
      },
      {
        id: 'plan-genai-1',
        timeSlot: '11:35 AM - 12:45 PM',
        title: 'GenAI Sprint 1: Transformers & Core Architecture (70 min)',
        category: 'genai',
        durationMinutes: 70,
        icon: 'brain',
        description: 'Deep dive into Krish Naik playlist (Transformers, Embeddings, or Vector Search).',
        whyItMatters: 'Foundational GenAI math and concepts give you 10x leverage for practical AI engineering.',
        stepsTarget: 0,
        isCompleted: false,
        subSteps: [
          { id: 's-ai-1', title: 'Watch lecture module & sketch architecture diagram', minutes: 30, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-ai-2', title: 'Code minimal working script (e.g. ChromaDB / Attention)', minutes: 30, isCompleted: false, importance: 'CORE' },
          { id: 's-ai-3', title: 'Test with sample inputs and observe token embeddings', minutes: 10, isCompleted: false, importance: 'PRACTICE' },
        ],
      },
      {
        id: 'plan-steps-2',
        timeSlot: '12:45 PM - 01:20 PM',
        title: 'Lunch & Midday Movement (4,000 Steps)',
        category: 'steps',
        durationMinutes: 35,
        icon: 'footprints',
        description: 'Wholesome lunch + walk to hit your afternoon step milestone.',
        whyItMatters: 'Prevents the post-lunch dopamine crash and lethargy.',
        stepsTarget: 4000,
        isCompleted: false,
        subSteps: [
          { id: 's-step-3', title: 'Nutritious meal without phone screens', minutes: 20, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-step-4', title: 'Post-meal light stroll: Log +4,000 steps', minutes: 15, isCompleted: false, importance: 'CORE' },
        ],
      },
      {
        id: 'plan-genai-2',
        timeSlot: '02:00 PM - 03:00 PM',
        title: 'GenAI Sprint 2: Hands-on RAG & Agentic Implementation (60 min)',
        category: 'genai',
        durationMinutes: 60,
        icon: 'brain',
        description: 'Build or refine an end-to-end LangChain / CrewAI project pipeline.',
        whyItMatters: 'Hands-on projects turn abstract knowledge into tangible portfolio proof.',
        stepsTarget: 0,
        isCompleted: false,
        subSteps: [
          { id: 's-ai-4', title: 'Connect vector retriever to LLM prompt pipeline', minutes: 25, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-ai-5', title: 'Add tool calling / agent search functionality', minutes: 25, isCompleted: false, importance: 'CORE' },
          { id: 's-ai-6', title: 'Verify edge-case queries & test responses', minutes: 10, isCompleted: false, importance: 'PRACTICE' },
        ],
      },
      {
        id: 'plan-english',
        timeSlot: '03:10 PM - 03:25 PM',
        title: 'Daily English Improvement Sprint (10 min)',
        category: 'english',
        durationMinutes: 10,
        icon: 'message-square',
        description: 'Record yourself for 5 mins explaining today\'s DSA / GenAI topic in English, then review vocabulary.',
        whyItMatters: 'Technical communication fluency is the #1 differentiator for senior software engineers.',
        stepsTarget: 0,
        isCompleted: false,
        subSteps: [
          { id: 's-eng-1', title: 'Pick 1 topic (e.g., "How Self-Attention Works" or "Kadane Algorithm")', minutes: 2, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-eng-2', title: 'Speak out loud / record voice explanation in clear English', minutes: 5, isCompleted: false, importance: 'CORE' },
          { id: 's-eng-3', title: 'Learn & note down 2 advanced technical words/phrases', minutes: 3, isCompleted: false, importance: 'PRACTICE' },
        ],
      },
      {
        id: 'plan-revision',
        timeSlot: '03:30 PM - 04:30 PM',
        title: 'Spaced Repetition & Daily Revision (60 min)',
        category: 'revision',
        durationMinutes: 60,
        icon: 'book-open',
        description: 'Active recall of today\'s code, formulas, algorithms, and key insights.',
        whyItMatters: 'Without same-day revision, 70% of new information is forgotten by tomorrow.',
        stepsTarget: 0,
        isCompleted: false,
        subSteps: [
          { id: 's-rev-1', title: 'Review flashcards / summary notes of today\'s 2 DSA problems', minutes: 20, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-rev-2', title: 'Quick active recall of GenAI RAG & Attention formulas', minutes: 25, isCompleted: false, importance: 'CORE' },
          { id: 's-rev-3', title: 'Update personal progress log & celebrate wins', minutes: 15, isCompleted: false, importance: 'PRACTICE' },
        ],
      },
      {
        id: 'plan-steps-3',
        timeSlot: '05:00 PM - 05:40 PM',
        title: 'Evening Walk & Hit 10,000 Steps Target (3,000 Steps)',
        category: 'steps',
        durationMinutes: 40,
        icon: 'footprints',
        description: 'Evening workout / walk to reach your 10,000 daily steps goal. Celebrate a productive day!',
        whyItMatters: 'Completes the physical wellness loop and guarantees deep, restorative sleep.',
        stepsTarget: 3000,
        isCompleted: false,
        subSteps: [
          { id: 's-step-5', title: 'Evening walk / gym / run', minutes: 35, isCompleted: false, importance: 'MUST_DO' },
          { id: 's-step-6', title: 'Log final steps & hit 10,000 badge 🏆', minutes: 5, isCompleted: false, importance: 'CORE' },
        ],
      },
    ];
  });

  // Persist blocks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('focusflow_daily_plan_blocks', JSON.stringify(scheduleBlocks));
    } catch {}
  }, [scheduleBlocks]);

  // Persist steps
  const handleUpdateSteps = (newSteps: number) => {
    const clamped = Math.max(0, newSteps);
    setCurrentSteps(clamped);
    try {
      localStorage.setItem('focusflow_daily_steps', clamped.toString());
    } catch {}
  };

  // English 10-Min Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (englishTimerRunning && englishSecondsLeft > 0) {
      interval = setInterval(() => {
        setEnglishSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (englishSecondsLeft === 0) {
      setEnglishTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [englishTimerRunning, englishSecondsLeft]);

  // AI Schedule Generator Call
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          dsaHours,
          genAiHours,
          revisionHours,
          stepGoal,
          englishMinutes,
          startTime,
          customGoals,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.greeting) setGreetingMessage(data.greeting);
        if (data.motivationalQuote) setMotivationalQuote(data.motivationalQuote);
        if (Array.isArray(data.blocks) && data.blocks.length > 0) {
          setScheduleBlocks(data.blocks);
        }
      }
    } catch (e) {
      console.warn('Using client-side schedule recalculation:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Preset Applicator
  const applyPreset = (
    name: string,
    dsa: number,
    genai: number,
    rev: number,
    steps: number,
    eng: number,
    desc: string
  ) => {
    setDsaHours(dsa);
    setGenAiHours(genai);
    setRevisionHours(rev);
    setStepGoal(steps);
    setEnglishMinutes(eng);
    setCustomGoals(desc);
  };

  // Toggle block completed
  const toggleBlockCompleted = (blockId: string) => {
    setScheduleBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          const newStatus = !b.isCompleted;
          return {
            ...b,
            isCompleted: newStatus,
            subSteps: b.subSteps.map((s) => ({ ...s, isCompleted: newStatus })),
          };
        }
        return b;
      })
    );
  };

  // Toggle subStep completed
  const toggleSubStep = (blockId: string, stepId: string) => {
    setScheduleBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          const updatedSub = b.subSteps.map((s) =>
            s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
          );
          const allDone = updatedSub.every((s) => s.isCompleted);
          return {
            ...b,
            subSteps: updatedSub,
            isCompleted: allDone,
          };
        }
        return b;
      })
    );
  };

  // Launch a block's subtasks into active Now focus timer
  const handleLaunchBlockIntoSprint = (block: DailyScheduleBlock) => {
    const tasksToLaunch: TaskItem[] = block.subSteps.map((sub, idx) => ({
      id: `plan-task-${Date.now()}-${idx}`,
      title: sub.title,
      description: `${block.title}. Focus on execution and momentum without distractions.`,
      estimatedMinutes: sub.minutes || 10,
      actualSeconds: 0,
      isCompleted: false,
      order: idx + 1,
      goalSource: block.title,
      importance: sub.importance || (idx === 0 ? 'MUST_DO' : 'CORE'),
      whyItMatters: block.whyItMatters || 'Essential daily learning goal',
    }));

    onLaunchFullSprint(tasksToLaunch);
  };

  const completedBlocksCount = scheduleBlocks.filter((b) => b.isCompleted).length;
  const totalBlocksCount = scheduleBlocks.length;
  const progressPercent = Math.round((completedBlocksCount / totalBlocksCount) * 100);

  const stepPercent = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  const formatEnglishTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTopic = ENGLISH_TOPIC_PROMPTS[currentEnglishPromptIndex];

  return (
    <main
      id="screen-daily-planner"
      className="flex-1 md:ml-64 flex flex-col items-center px-4 sm:px-8 md:px-12 max-w-5xl mx-auto w-full min-h-screen pb-28 md:pb-12"
    >
      {/* 🌅 Top Personalized Morning Greeting Header */}
      <header className="w-full mt-2 mb-6">
        <div className="bg-gradient-to-r from-[#43664c] to-[#006494] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-amber-300" />
                  Morning Standup &amp; Daily Architect
                </span>
                <span className="bg-white/15 text-white/90 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  Personalized for {userName}
                </span>
              </div>

              <h1 className="text-[26px] sm:text-[34px] font-extrabold tracking-tight leading-tight">
                {greetingMessage}
              </h1>

              <p className="text-white/90 text-[14px] sm:text-[16px] mt-2 font-medium leading-relaxed">
                {motivationalQuote}
              </p>
            </div>

            {/* Quick Completion Gauge */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center shrink-0 min-w-[170px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                Today's Completion
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-3xl font-extrabold text-white">
                  {completedBlocksCount}
                </span>
                <span className="text-white/70 text-lg font-bold">
                  /{totalBlocksCount}
                </span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-white/90 mt-1.5 font-semibold">
                {progressPercent}% Blocks Executed
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 🌟 1-Click Goal Presets (Quick Select) */}
      <section className="w-full mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#545f72] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Quick Morning Presets for {userName}:
          </h2>
          <span className="text-xs text-[#545f72]">Click to auto-configure</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Preset 1: Kunal's Ultimate Routine */}
          <button
            onClick={() =>
              applyPreset(
                'Kunal Ultimate',
                2,
                2,
                1,
                10000,
                10,
                'Full balanced day: 2h DSA, 2h GenAI, 1h Revision, 10k Steps, 10m English'
              )
            }
            className="p-3.5 bg-white border-2 border-[#43664c] hover:bg-[#43664c]/5 rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-[#43664c] bg-[#8bb192]/20 px-2 py-0.5 rounded-full">
                👑 Kunal's Routine
              </span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-[14px] font-bold text-[#181c1e] mt-1 group-hover:text-[#43664c]">
              2h DSA + 2h GenAI + 1h Rev
            </p>
            <p className="text-[12px] text-[#545f72] mt-0.5">
              10,000 Steps &bull; 10m English
            </p>
          </button>

          {/* Preset 2: Heavy DSA Sprint */}
          <button
            onClick={() =>
              applyPreset(
                'DSA Intensive',
                3,
                1,
                1,
                8000,
                10,
                'Deep algorithmic mastery: Chapters 1-10 problem solving sprint'
              )
            }
            className="p-3.5 bg-white border border-[#c2c8c0] hover:border-[#43664c] rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                ⚡ DSA Deep Dive
              </span>
              <Code2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[14px] font-bold text-[#181c1e] mt-1 group-hover:text-[#43664c]">
              3h DSA + 1h GenAI + 1h Rev
            </p>
            <p className="text-[12px] text-[#545f72] mt-0.5">
              8,000 Steps &bull; 10m English
            </p>
          </button>

          {/* Preset 3: GenAI & RAG Sprint */}
          <button
            onClick={() =>
              applyPreset(
                'GenAI Deep Dive',
                1,
                3,
                1,
                10000,
                10,
                'Hands-on Transformers, RAG vector search, and agentic workflows'
              )
            }
            className="p-3.5 bg-white border border-[#c2c8c0] hover:border-[#006494] rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                🤖 GenAI Builder
              </span>
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[14px] font-bold text-[#181c1e] mt-1 group-hover:text-[#006494]">
              3h GenAI + 1h DSA + 1h Rev
            </p>
            <p className="text-[12px] text-[#545f72] mt-0.5">
              10,000 Steps &bull; 10m English
            </p>
          </button>

          {/* Preset 4: Recovery & Flow */}
          <button
            onClick={() =>
              applyPreset(
                'Recovery Flow',
                1,
                1,
                0.5,
                6000,
                10,
                'Low-pressure momentum builder with zero burnout'
              )
            }
            className="p-3.5 bg-white border border-[#c2c8c0] hover:border-purple-600 rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                🧘 Calm Flow
              </span>
              <Coffee className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-[14px] font-bold text-[#181c1e] mt-1 group-hover:text-purple-800">
              1h DSA + 1h GenAI + 30m Rev
            </p>
            <p className="text-[12px] text-[#545f72] mt-0.5">
              6,000 Steps &bull; 10m English
            </p>
          </button>
        </div>
      </section>

      {/* 🎯 Interactive Goal Configuration & Schedule Customizer */}
      <section className="w-full mb-8 bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#43664c]" />
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#181c1e]">
              Configure Today's Targets
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#545f72] bg-[#f1f4f6] px-3 py-1 rounded-full">
            Total Focus: {(dsaHours + genAiHours + revisionHours).toFixed(1)} Hours
          </span>
        </div>

        {/* 5-Item Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* 1. DSA Hours */}
          <div className="bg-[#f8faf9] border border-[#c2c8c0]/70 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#43664c] flex items-center gap-1">
                <Code2 className="w-4 h-4" /> DSA (Ch 1-10)
              </span>
              <span className="text-lg font-black text-[#43664c]">{dsaHours} hrs</span>
            </div>
            <p className="text-[11px] text-[#545f72] mb-3">Core LeetCode &amp; Dry Runs</p>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => setDsaHours((prev) => Math.max(0.5, prev - 0.5))}
                className="flex-1 py-1.5 bg-white border border-[#c2c8c0] rounded-xl text-sm font-bold text-[#545f72] hover:bg-gray-100 cursor-pointer flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDsaHours((prev) => Math.min(6, prev + 0.5))}
                className="flex-1 py-1.5 bg-[#43664c] text-white rounded-xl text-sm font-bold hover:bg-[#38553f] cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. GenAI Hours */}
          <div className="bg-[#f0f7fb] border border-blue-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#006494] flex items-center gap-1">
                <Brain className="w-4 h-4" /> GenAI &amp; RAG
              </span>
              <span className="text-lg font-black text-[#006494]">{genAiHours} hrs</span>
            </div>
            <p className="text-[11px] text-[#545f72] mb-3">Transformers &amp; Projects</p>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => setGenAiHours((prev) => Math.max(0.5, prev - 0.5))}
                className="flex-1 py-1.5 bg-white border border-[#c2c8c0] rounded-xl text-sm font-bold text-[#545f72] hover:bg-gray-100 cursor-pointer flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGenAiHours((prev) => Math.min(6, prev + 0.5))}
                className="flex-1 py-1.5 bg-[#006494] text-white rounded-xl text-sm font-bold hover:bg-[#004e75] cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Revision Hours */}
          <div className="bg-[#f9f5ff] border border-purple-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-purple-800 flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Revision
              </span>
              <span className="text-lg font-black text-purple-800">{revisionHours} hr</span>
            </div>
            <p className="text-[11px] text-[#545f72] mb-3">Active Recall &amp; Notes</p>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => setRevisionHours((prev) => Math.max(0, prev - 0.5))}
                className="flex-1 py-1.5 bg-white border border-[#c2c8c0] rounded-xl text-sm font-bold text-[#545f72] hover:bg-gray-100 cursor-pointer flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRevisionHours((prev) => Math.min(3, prev + 0.5))}
                className="flex-1 py-1.5 bg-purple-700 text-white rounded-xl text-sm font-bold hover:bg-purple-800 cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Steps Goal */}
          <div className="bg-[#fffbf0] border border-amber-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                <Footprints className="w-4 h-4" /> Steps Goal
              </span>
              <span className="text-base font-black text-amber-900">
                {(stepGoal / 1000).toFixed(0)}k
              </span>
            </div>
            <p className="text-[11px] text-[#545f72] mb-3">Dopamine Walking Breaks</p>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => setStepGoal((prev) => Math.max(3000, prev - 1000))}
                className="flex-1 py-1.5 bg-white border border-[#c2c8c0] rounded-xl text-sm font-bold text-[#545f72] hover:bg-gray-100 cursor-pointer flex items-center justify-center"
              >
                -1k
              </button>
              <button
                onClick={() => setStepGoal((prev) => Math.min(25000, prev + 1000))}
                className="flex-1 py-1.5 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 cursor-pointer flex items-center justify-center"
              >
                +1k
              </button>
            </div>
          </div>

          {/* 5. English Improvement */}
          <div className="bg-[#f5f5ff] border border-indigo-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" /> English
              </span>
              <span className="text-base font-black text-indigo-900">{englishMinutes}m</span>
            </div>
            <p className="text-[11px] text-[#545f72] mb-3">Technical Speaking Sprint</p>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => setEnglishMinutes((prev) => Math.max(5, prev - 5))}
                className="flex-1 py-1.5 bg-white border border-[#c2c8c0] rounded-xl text-sm font-bold text-[#545f72] hover:bg-gray-100 cursor-pointer flex items-center justify-center"
              >
                -5m
              </button>
              <button
                onClick={() => setEnglishMinutes((prev) => Math.min(30, prev + 5))}
                className="flex-1 py-1.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 cursor-pointer flex items-center justify-center"
              >
                +5m
              </button>
            </div>
          </div>
        </div>

        {/* Start Time Picker & Custom Notes */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#545f72] flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-4 h-4 text-[#545f72]" />
              Start Day At:
            </span>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-xs font-bold bg-[#f1f4f6] border border-[#c2c8c0] rounded-xl px-3 py-2 text-[#181c1e] cursor-pointer"
            >
              <option value="08:00 AM">08:00 AM</option>
              <option value="08:30 AM">08:30 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
            </select>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-[#43664c] hover:bg-[#38553f] text-white px-7 py-3 rounded-2xl text-[14px] sm:text-[15px] font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.98] transition-all disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating
                ? 'Architecting Schedule with AI...'
                : 'Architect My Day with AI'}
            </span>
          </button>
        </div>
      </section>

      {/* 👟 Dual Progress Widgets: 10,000 Steps Tracker & 10-Min English Studio */}
      <section className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. 10,000 Steps Physical Wellness Tracker */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Footprints className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#181c1e]">
                    Daily Step Tracker
                  </h3>
                  <p className="text-xs text-[#545f72]">Dopamine &amp; focus reset</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                Goal: {stepGoal.toLocaleString()}
              </span>
            </div>

            {/* Current vs Target */}
            <div className="flex items-baseline justify-between mt-2 mb-1.5">
              <span className="text-3xl font-extrabold text-[#181c1e]">
                {currentSteps.toLocaleString()}{' '}
                <span className="text-sm font-semibold text-[#545f72]">steps</span>
              </span>
              <span className="text-sm font-bold text-amber-700">
                {stepPercent}% of 10,000
              </span>
            </div>

            <div className="w-full bg-[#ebeef0] h-3 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${stepPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-100">
            <span className="text-xs text-[#545f72] font-semibold">Log Walk:</span>
            <button
              onClick={() => handleUpdateSteps(currentSteps + 500)}
              className="text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
            >
              +500 steps
            </button>
            <button
              onClick={() => handleUpdateSteps(currentSteps + 1000)}
              className="text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
            >
              +1,000 steps
            </button>
            <button
              onClick={() => handleUpdateSteps(currentSteps + 2500)}
              className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer"
            >
              +2,500 (Full Walk)
            </button>
            <button
              onClick={() => handleUpdateSteps(0)}
              className="text-[11px] text-slate-400 hover:text-rose-600 ml-auto cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 2. 10-Min English Communication Sprint */}
        <div className="bg-white border border-indigo-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#181c1e]">
                    10-Min English Sprint
                  </h3>
                  <p className="text-xs text-[#545f72]">Technical communication practice</p>
                </div>
              </div>

              {/* Timer Pill */}
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-indigo-700" />
                <span className="font-mono text-xs font-bold text-indigo-900">
                  {formatEnglishTime(englishSecondsLeft)}
                </span>
              </div>
            </div>

            {/* Prompt of the day */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-extrabold text-indigo-800 uppercase tracking-wider">
                  Today's Challenge: {currentTopic.topic}
                </span>
                <button
                  onClick={() =>
                    setCurrentEnglishPromptIndex(
                      (prev) => (prev + 1) % ENGLISH_TOPIC_PROMPTS.length
                    )
                  }
                  className="text-[10px] text-indigo-700 hover:underline font-bold cursor-pointer"
                >
                  Next Topic &rarr;
                </button>
              </div>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                "{currentTopic.prompt}"
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentTopic.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
            <button
              onClick={() => setEnglishTimerRunning(!englishTimerRunning)}
              className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                englishTimerRunning
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {englishTimerRunning ? 'Pause Sprint' : 'Start 10-Min Timer'}
            </button>
            <span className="text-xs text-[#545f72] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
              Speak clearly &amp; record voice
            </span>
          </div>
        </div>
      </section>

      {/* 📅 Interactive Chronological Daily Timeline */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#43664c]" />
            <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#181c1e]">
              Today's Master Schedule for {userName}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#43664c] bg-[#8bb192]/20 px-3 py-1 rounded-full">
            {scheduleBlocks.length} Sequential Focus Blocks
          </span>
        </div>

        {/* Timeline List */}
        <div className="space-y-4">
          {scheduleBlocks.map((block, index) => {
            const catStyle = CATEGORY_STYLES[block.category] || CATEGORY_STYLES.custom;
            const isExpanded = expandedBlocks[block.id] !== false; // expanded by default

            return (
              <div
                key={block.id || index}
                className={`w-full bg-white border rounded-3xl p-5 sm:p-6 transition-all shadow-xs ${
                  block.isCompleted
                    ? 'border-emerald-300 bg-emerald-50/30 opacity-80'
                    : 'border-[#c2c8c0] hover:border-[#43664c]'
                }`}
              >
                {/* Block Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => toggleBlockCompleted(block.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border cursor-pointer transition-all ${
                        block.isCompleted
                          ? 'bg-[#43664c] text-white border-[#43664c]'
                          : 'bg-white border-[#c2c8c0] text-transparent hover:border-[#43664c]'
                      }`}
                      title={block.isCompleted ? 'Mark incomplete' : 'Mark block complete'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-[#545f72] bg-[#ebeef0] px-2.5 py-0.5 rounded-full">
                          ⏰ {block.timeSlot}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                        >
                          {catStyle.badge}
                        </span>
                        {block.stepsTarget ? (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Footprints className="w-3 h-3" /> {block.stepsTarget.toLocaleString()} steps
                          </span>
                        ) : null}
                      </div>

                      <h3
                        className={`text-[16px] sm:text-[18px] font-bold text-[#181c1e] ${
                          block.isCompleted ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {block.title}
                      </h3>

                      {block.description && (
                        <p className="text-[13px] text-[#545f72] mt-0.5 leading-relaxed">
                          {block.description}
                        </p>
                      )}

                      {block.whyItMatters && (
                        <p className="text-[12px] text-[#43664c] font-medium mt-1">
                          💡 <em>{block.whyItMatters}</em>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Launch Sprint & Expand */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleLaunchBlockIntoSprint(block)}
                      className="px-4 py-2 rounded-xl bg-[#43664c] hover:bg-[#38553f] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Focus Timer</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedBlocks((prev) => ({
                          ...prev,
                          [block.id]: !isExpanded,
                        }))
                      }
                      className="p-2 text-[#545f72] hover:text-[#181c1e] hover:bg-gray-100 rounded-xl cursor-pointer"
                      title={isExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-steps Checklist (Accordion) */}
                {isExpanded && block.subSteps && block.subSteps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 pl-10 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#545f72] mb-1.5">
                      Bite-Sized 10-Min Micro Steps:
                    </p>
                    {block.subSteps.map((step) => (
                      <div
                        key={step.id}
                        onClick={() => toggleSubStep(block.id, step.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                          step.isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200 text-[#545f72]'
                            : 'bg-[#f8faf9] border-[#c2c8c0]/60 hover:border-[#43664c] text-[#181c1e]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center text-xs ${
                              step.isCompleted
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-gray-400 bg-white'
                            }`}
                          >
                            {step.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs font-medium truncate ${
                              step.isCompleted ? 'line-through opacity-70' : ''
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-[#545f72] shrink-0 ml-2">
                          {step.minutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
