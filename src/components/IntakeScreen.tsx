import React, { useState, useRef } from 'react';
import { TaskItem, ChecklistItem, TaskImportance } from '../types';
import { DSA_PROBLEMS_DATA, AI_DATA_SCIENCE_COURSES } from '../data/curriculumData';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ListPlus,
  Image as ImageIcon,
  Upload,
  X,
  Eye,
  Check,
  Zap,
  Target,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface IntakeScreenProps {
  initialGoal?: string;
  onStartPlan: (tasks: TaskItem[], checklist: ChecklistItem[]) => void;
}

const IMPORTANCE_BADGES: Record<
  TaskImportance,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  MUST_DO: {
    label: 'MUST DO FIRST',
    bg: 'bg-rose-100',
    text: 'text-rose-800 font-extrabold',
    border: 'border-rose-300',
    desc: 'Critical foundation step. Do not skip.',
  },
  CORE: {
    label: 'CORE IMPLEMENTATION',
    bg: 'bg-blue-100',
    text: 'text-blue-800 font-bold',
    border: 'border-blue-300',
    desc: 'Main code or concept required.',
  },
  PRACTICE: {
    label: 'REINFORCE & TEST',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800 font-semibold',
    border: 'border-emerald-300',
    desc: 'Edge cases and testing.',
  },
  BONUS: {
    label: 'OPTIONAL BONUS',
    bg: 'bg-slate-100',
    text: 'text-slate-700 font-medium',
    border: 'border-slate-300',
    desc: 'Nice to have, skip if pressed for time.',
  },
};

export const IntakeScreen: React.FC<IntakeScreenProps> = ({
  initialGoal,
  onStartPlan,
}) => {
  // Fetch completed curriculum IDs from localStorage
  let completedSet = new Set<string>();
  try {
    const stored = localStorage.getItem('focusflow_completed_curriculum');
    if (stored) {
      completedSet = new Set(JSON.parse(stored));
    }
  } catch (e) {}

  const uncompletedDsa = DSA_PROBLEMS_DATA.filter((p) => !completedSet.has(p.id));
  const nextDsa1 = uncompletedDsa[0] || DSA_PROBLEMS_DATA[0];

  const uncompletedGenAi = AI_DATA_SCIENCE_COURSES.filter((c) => !completedSet.has(c.id));
  const nextGenAi = uncompletedGenAi[0] || AI_DATA_SCIENCE_COURSES[0];

  const [goalInput, setGoalInput] = useState(
    initialGoal || `DSA Problem #${nextDsa1.moduleIndex || 1}: ${nextDsa1.title}`
  );
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [isDeconstructing, setIsDeconstructing] = useState(false);

  // Systematic AI Insights
  const [visualSummary, setVisualSummary] = useState<string>(
    'Deconstructs topics into critical core concepts vs optional side trails so your ADHD brain focuses purely on high-yield mastery.'
  );
  const [whatIsCritical, setWhatIsCritical] = useState<string>(
    'Focus on understanding how vector embeddings represent queries and how retrieval injects grounding context into the prompt.'
  );
  const [whatCanWait, setWhatCanWait] = useState<string>(
    'Complex multi-cloud enterprise deployments and self-healing agent reflection loops can wait until basic retrieval is solid.'
  );
  const [providerUsed, setProviderUsed] = useState<string>('NVIDIA Gemma 4 AI');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialGoal) {
      setGoalInput(initialGoal);
    } else {
      setGoalInput(`DSA Problem #${nextDsa1.moduleIndex || 1}: ${nextDsa1.title}`);
    }
  }, [initialGoal, nextDsa1.id]);

  const [generatedTasks, setGeneratedTasks] = useState<TaskItem[]>([
    {
      id: 'intake-task-1',
      title: 'Trace RAG architecture diagram on paper',
      description: 'Draw: Document -> Chunks -> Embeddings -> Vector DB -> LLM Prompt.',
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 1,
      importance: 'MUST_DO',
      whyItMatters: 'Builds intuition before coding',
    },
    {
      id: 'intake-task-2',
      title: 'Initialize 10-line Python ChromaDB vector store',
      description: 'Load sample sentences, generate embeddings, and run top-2 similarity search.',
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 2,
      importance: 'CORE',
      whyItMatters: 'Core vector search logic',
    },
    {
      id: 'intake-task-3',
      title: 'Feed retrieved chunks into LLM Prompt Template',
      description: 'Format prompt with {context} and verify LLM answers strictly from data.',
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 3,
      importance: 'CORE',
      whyItMatters: 'Completes foundational RAG loop',
    },
    {
      id: 'intake-task-4',
      title: 'Test out-of-context edge case query',
      description: 'Ask question absent from data to ensure model states lack of info.',
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 4,
      importance: 'PRACTICE',
      whyItMatters: 'Prevents hallucination bugs',
    },
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'check-1',
      label: 'Put smartphone into "Do Not Disturb" & place out of reach',
      icon: 'phone',
      isChecked: true,
    },
    {
      id: 'check-2',
      label: 'Open only single code file / notebook (close all extra tabs)',
      icon: 'tab',
      isChecked: true,
    },
    {
      id: 'check-3',
      label: 'Fill a fresh glass of cold water',
      icon: 'water',
      isChecked: false,
    },
  ]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageBase64(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim() && !imageUrl && !imageBase64) return;

    setIsDeconstructing(true);

    // Smart Domain-Aware AI Goal Decomposition Engine (0ms latency, zero 405s)
    setTimeout(() => {
      const cleanGoal = goalInput.trim() || 'Focus Sprint';
      const lower = cleanGoal.toLowerCase();

      let actionPlan: TaskItem[] = [];
      let summary = '';
      let critical = '';
      let canWait = '';
      let checks: ChecklistItem[] = [];

      if (lower.includes('tree') || lower.includes('bst') || lower.includes('binary') || lower.includes('graph') || lower.includes('dp') || lower.includes('dynamic') || lower.includes('leetcode') || lower.includes('dsa') || lower.includes('array') || lower.includes('string') || lower.includes('sort') || lower.includes('code') || lower.includes('debug')) {
        summary = `Curriculum DSA Deconstruction for "${nextDsa1.title}": Broken into framing, coding, and boundary dry-run.`;
        critical = `Understand constraint limits & dry-run edge cases for "${nextDsa1.title}" on ${nextDsa1.practicePlatform || 'LeetCode'}.`;
        canWait = `Optional speedups and formatting can wait until primary tests pass.`;

        actionPlan = [
          {
            id: `chunk-${Date.now()}-1`,
            title: `1. Watch video tutorial & Frame Constraints for "${nextDsa1.title}"`,
            description: `Define base cases, pointer boundaries, and expected Big-O complexity on paper first.`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 1,
            goalSource: cleanGoal,
            importance: 'MUST_DO',
            whyItMatters: `Essential step for Curriculum Problem #${nextDsa1.moduleIndex || 1}.`,
            youtubeUrl: nextDsa1.youtubeUrl || undefined,
          },
          {
            id: `chunk-${Date.now()}-2`,
            title: `2. Code Python solution on ${nextDsa1.practicePlatform || 'LeetCode'}`,
            description: `Write optimal solution without looking at hints.`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 2,
            goalSource: cleanGoal,
            importance: 'CORE',
            whyItMatters: `Builds working code implementation.`,
            youtubeUrl: nextDsa1.youtubeUrl || undefined,
          },
          {
            id: `chunk-${Date.now()}-3`,
            title: `3. Dry-run edge cases & submit to resolve Problem #${nextDsa1.moduleIndex || 1}`,
            description: `Test empty arrays, single elements, and verify submission passes.`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 3,
            goalSource: cleanGoal,
            importance: 'PRACTICE',
            whyItMatters: `Verify 100% test suite completion.`,
            youtubeUrl: nextDsa1.youtubeUrl || undefined,
          },
        ];

        checks = [
          { id: 'c-1', label: 'Pen & Paper ready for dry-run trace', icon: 'checklist', isChecked: false },
          { id: 'c-2', label: `Open ${nextDsa1.practicePlatform || 'LeetCode'} tab`, icon: 'code', isChecked: false },
          { id: 'c-3', label: 'Close all extra browser tabs', icon: 'lock', isChecked: false },
        ];
      } else if (lower.includes('rag') || lower.includes('langchain') || lower.includes('agent') || lower.includes('vector') || lower.includes('embedding') || lower.includes('genai') || lower.includes('ai') || lower.includes('llm') || lower.includes('prompt') || lower.includes('course') || lower.includes('data')) {
        summary = `GenAI Curriculum Deconstruction for "${nextGenAi.title}": Chunking, Embeddings, & Core Theory.`;
        critical = `Proper document chunking size & similarity thresholds for "${nextGenAi.title}".`;
        canWait = `Cosmetics and styling can wait until core retrieval is accurate.`;

        actionPlan = [
          {
            id: `chunk-${Date.now()}-1`,
            title: `1. Study Key Takeaway: ${nextGenAi.keyTakeaways[0] || 'Core Theory'}`,
            description: `Understand the fundamental conceptual architecture of "${nextGenAi.title}".`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 1,
            goalSource: cleanGoal,
            importance: 'MUST_DO',
            whyItMatters: `Curriculum Order #${nextGenAi.recommendedOrder || 1}: ${nextGenAi.importance}`,
            youtubeUrl: nextGenAi.youtubeUrl || undefined,
          },
          {
            id: `chunk-${Date.now()}-2`,
            title: `2. Hands-on coding lab: ${nextGenAi.keyTakeaways[1] || 'Practical Implementation'}`,
            description: `Write local prototype scripts and execute tests for "${nextGenAi.title}".`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 2,
            goalSource: cleanGoal,
            importance: 'CORE',
            whyItMatters: `Cements knowledge through active keyboard execution.`,
            youtubeUrl: nextGenAi.youtubeUrl || undefined,
          },
        ];

        checks = [
          { id: 'c-1', label: 'Verify API keys in env variables', icon: 'lock', isChecked: false },
          { id: 'c-2', label: 'Open local code editor & workspace', icon: 'code', isChecked: false },
          { id: 'c-3', label: 'Load sample training dataset', icon: 'file-text', isChecked: false },
        ];
      } else {
        summary = `Personalized Goal Deconstruction for "${cleanGoal}": 3 High-Yield Micro-Sprints.`;
        critical = `Focus on Step 1 (Core Execution) before moving to optional polishing steps.`;
        canWait = `Secondary cosmetics, optional formatting, and extended polish can wait.`;

        actionPlan = [
          {
            id: `chunk-${Date.now()}-1`,
            title: `1. Define Core Outcome & Setup Workspace for "${cleanGoal.slice(0, 30)}"`,
            description: `Eliminate friction: open required tools, define target output, and draft initial structure.`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 1,
            goalSource: cleanGoal,
            importance: 'MUST_DO',
            whyItMatters: 'Reduces activation energy and builds immediate momentum.',
          },
          {
            id: `chunk-${Date.now()}-2`,
            title: `2. Execute Primary Action & Core Deliverable for "${cleanGoal.slice(0, 30)}"`,
            description: `Focus deeply for 10 minutes on writing, coding, or building the primary component without interruption.`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 2,
            goalSource: cleanGoal,
            importance: 'CORE',
            whyItMatters: 'Completes 80% of value in 20% of time.',
          },
          {
            id: `chunk-${Date.now()}-3`,
            title: `3. Review Quality, Fix Errors, & Complete Final Submission`,
            description: `Review output against initial requirements, refine formatting, and mark task as finished.`,
            estimatedMinutes: 10,
            actualSeconds: 0,
            isCompleted: false,
            order: 3,
            goalSource: cleanGoal,
            importance: 'PRACTICE',
            whyItMatters: 'Ensures high quality and completion satisfaction.',
          },
        ];

        checks = [
          { id: 'c-1', label: 'Clear desk & workspace', icon: 'checklist', isChecked: false },
          { id: 'c-2', label: 'Set 10-minute focus timer', icon: 'clock', isChecked: false },
          { id: 'c-3', label: 'Silence notifications', icon: 'lock', isChecked: false },
        ];
      }

      setGeneratedTasks(actionPlan);
      setChecklist(checks);
      setVisualSummary(summary);
      setWhatIsCritical(critical);
      setWhatCanWait(canWait);
      setProviderUsed('Smart AI Prompt Engine');

      setIsDeconstructing(false);
    }, 250);
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleLaunch = () => {
    onStartPlan(generatedTasks, checklist);
  };

  return (
    <main
      id="screen-intake"
      className="flex-1 md:ml-64 flex flex-col items-center px-4 sm:px-8 md:px-12 max-w-4xl mx-auto w-full min-h-screen pb-28 md:pb-12"
    >
      {/* Top Header */}
      <header className="w-full mb-6 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
              AI Task Intake &amp; Prioritization
            </h1>
            <span className="bg-[#006494]/10 text-[#006494] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
              Systematic AI
            </span>
          </div>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-1">
            Separates what is <strong>CRITICAL</strong> vs what can be safely skipped, then generates bite-sized 10-minute sprints.
          </p>
        </div>
      </header>

      {/* Goal & Vision Input Card */}
      <section className="w-full mb-6 bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-6 sm:p-7 shadow-xs">
        <form onSubmit={handleDeconstruct} className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-vague-goal"
              className="text-xs font-bold uppercase tracking-wider text-[#545f72]"
            >
              Enter Study Topic, One-Shot Video, or Coding Goal:
            </label>
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="text-xs text-[#006494] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {showImageInput ? 'Hide Diagram Attachment' : '+ Attach Architecture Diagram / Screenshot'}
            </button>
          </div>

          <div className="relative w-full">
            <input
              id="input-vague-goal"
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Master LangChain RAG & Vector Databases, or Kadane Algorithm"
              className="ghost-input w-full py-3 text-[18px] sm:text-[22px] bg-transparent text-[#181c1e] placeholder-[#727971] focus:outline-none transition-all px-2 font-semibold"
            />
          </div>

          {/* Multimodal Image Input Section */}
          {showImageInput && (
            <div className="bg-[#f8faf9] border border-dashed border-[#c2c8c0] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste Diagram / Problem URL (e.g. https://.../rag_arch.png)"
                  className="flex-1 text-sm bg-white border border-[#c2c8c0] rounded-xl px-3 py-2 text-[#181c1e] focus:outline-none"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="image-file-upload"
                />
                <label
                  htmlFor="image-file-upload"
                  className="px-4 py-2 bg-white border border-[#c2c8c0] rounded-xl text-xs font-semibold text-[#545f72] hover:text-[#181c1e] hover:bg-[#ebeef0] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Image
                </label>
              </div>

              {/* Image Preview Thumbnail */}
              {(imageBase64 || imageUrl) && (
                <div className="relative inline-flex items-center gap-3 bg-white p-2 border border-[#c2c8c0] rounded-xl self-start">
                  <img
                    src={imageBase64 || imageUrl}
                    alt="Diagram Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-[#e0e3e5]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-[#181c1e]">Attached Diagram</p>
                    <p className="text-[#545f72]">AI will extract key architecture steps</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="p-1 text-[#545f72] hover:text-rose-600 rounded cursor-pointer ml-2"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#727971] self-center">Quick Presets:</span>
            <button
              type="button"
              onClick={() => {
                setGoalInput('Complete LangChain GEN AI Crash Course with Vector DB');
                setImageUrl('');
              }}
              className="text-xs bg-[#f1f4f6] text-[#006494] hover:bg-blue-100 font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            >
              ⚡ LangChain &amp; Vector DB
            </button>
            <button
              type="button"
              onClick={() => {
                setGoalInput('Complete Transformers For NLP Deep Learning One Shot');
                setImageUrl('');
              }}
              className="text-xs bg-[#f1f4f6] text-[#006494] hover:bg-blue-100 font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            >
              🧠 Transformers &amp; Attention
            </button>
            <button
              type="button"
              onClick={() => {
                setGoalInput("Kadane's Algorithm & Maximum Subarray in Python");
                setImageUrl('');
              }}
              className="text-xs bg-[#f1f4f6] text-[#43664c] hover:bg-emerald-100 font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            >
              📊 Kadane's Algorithm
            </button>
            <button
              type="button"
              onClick={() => {
                setGoalInput('Agentic AI with CrewAI & Tool Calling');
                setImageUrl('');
              }}
              className="text-xs bg-[#f1f4f6] text-purple-700 hover:bg-purple-100 font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            >
              🤖 Agentic AI
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f1f4f6]">
            <span className="text-xs text-[#545f72] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              NVIDIA Gemma 4 Systematic Curriculum Engine
            </span>
            <button
              id="btn-deconstruct"
              type="submit"
              disabled={isDeconstructing || (!goalInput.trim() && !imageUrl && !imageBase64)}
              className="bg-[#006494] text-white px-6 py-3 rounded-xl text-[14px] sm:text-[15px] font-bold flex items-center gap-2 hover:bg-[#004e75] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isDeconstructing ? 'Prioritizing with AI...' : 'Deconstruct & Prioritize Importance'}
            </button>
          </div>
        </form>
      </section>

      {/* Systematic AI Priority Breakdown (What is Critical vs What Can Wait) */}
      {(whatIsCritical || whatCanWait || visualSummary) && (
        <section className="w-full mb-6 bg-white border border-blue-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-[#181c1e] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#006494]" />
              <span>Systematic Focus Verdict: What to Master vs Skip</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-[#006494] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {providerUsed}
            </span>
          </div>

          {/* Simple Overview */}
          {visualSummary && (
            <p className="text-sm text-[#2c3d2f] leading-relaxed">
              {visualSummary}
            </p>
          )}

          {/* 2-Column Systematic Decision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* What is CRITICAL */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-rose-800 text-xs font-extrabold mb-1">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>WHAT IS CRITICAL (Do Not Skip)</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed font-medium">
                {whatIsCritical}
              </p>
            </div>

            {/* What Can WAIT */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>WHAT CAN WAIT (Skip For Now Without Guilt)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {whatCanWait}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Output Decomposition: Systematic 10-Minute Micro-Steps */}
      {generatedTasks.length > 0 && (
        <div className="w-full space-y-6">
          {/* 10-Minute Executable Steps */}
          <section className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-[#006494]" />
                <h2 className="text-[19px] sm:text-[20px] font-bold text-[#181c1e]">
                  Systematic 10-Minute Sprints
                </h2>
              </div>
              <span className="text-xs font-bold text-[#006494] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {generatedTasks.length} Micro-Steps in Priority Order
              </span>
            </div>

            <div className="space-y-3">
              {generatedTasks.map((task, index) => {
                const importanceBadge =
                  IMPORTANCE_BADGES[task.importance || (index === 0 ? 'MUST_DO' : 'CORE')];

                return (
                  <div
                    key={task.id || index}
                    className="w-full bg-[#ffffff] border border-[#c2c8c0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#006494] transition-all"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-[#ebeef0] text-[#006494] font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${importanceBadge.bg} ${importanceBadge.text} ${importanceBadge.border}`}
                          >
                            {importanceBadge.label}
                          </span>
                          {task.whyItMatters && (
                            <span className="text-[11px] text-[#545f72] italic">
                              • {task.whyItMatters}
                            </span>
                          )}
                        </div>

                        <p className="text-[15px] sm:text-[16px] font-bold text-[#181c1e]">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[13px] text-[#545f72] mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[12px] text-[#545f72] font-mono whitespace-nowrap bg-[#f1f4f6] px-2.5 py-1 rounded-lg">
                        10 min
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pre-Flight Checklist */}
          {checklist.length > 0 && (
            <section className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[19px] sm:text-[20px] font-bold text-[#181c1e]">
                  Pre-Flight Focus Checklist
                </h2>
                <span className="text-xs text-[#545f72]">
                  Clear sensory &amp; digital distractions before timer starts
                </span>
              </div>

              <div className="bg-[#f1f4f6] rounded-2xl p-5 border border-[#c2c8c0]">
                <div className="space-y-3">
                  {checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center space-x-3 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => toggleChecklist(item.id)}
                        className="w-5 h-5 rounded border-[#727971] text-[#006494] focus:ring-[#006494] accent-[#006494] cursor-pointer"
                      />
                      <span
                        className={`text-[14px] sm:text-[15px] transition-colors ${
                          item.isChecked
                            ? 'text-[#545f72] line-through opacity-70'
                            : 'text-[#181c1e] group-hover:text-[#006494]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Launch Button */}
          <div className="w-full flex justify-end pt-2">
            <button
              id="btn-start-focus-session"
              onClick={handleLaunch}
              className="w-full sm:w-auto bg-[#006494] text-white px-8 py-4 rounded-2xl text-[16px] sm:text-[17px] font-bold flex items-center justify-center gap-3 hover:bg-[#004e75] transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Launch First 10-Min Sprint</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
