import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  Trash2,
  Check,
  Zap,
  Award,
  Search,
  BookMarked,
  Brain,
} from 'lucide-react';

interface ChecklistTask {
  id: string;
  label: string;
  icon: string;
}

interface QuestionMetadata {
  id: string;
  num: number;
  text: string;
  unit: 1 | 2 | 3;
  isHighPriority: boolean;
  tasks: ChecklistTask[];
}

const STANDARD_TASKS: ChecklistTask[] = [
  { id: 'concept', label: 'Read & understand core concept', icon: '📖' },
  { id: 'equations', label: 'Write key equations, formulas & derivations', icon: '🧮' },
  { id: 'diagram', label: 'Draw/sketch architecture or diagrams (if applicable)', icon: '✏️' },
  { id: 'recall', label: 'Active Recall: Write answer from memory & self-verify', icon: '🧠' },
];

const Q25_TASKS: ChecklistTask[] = [
  { id: 'denoising', label: 'What is Denoising Autoencoder?', icon: '🧪' },
  { id: 'sparse', label: 'What is Sparse Autoencoder?', icon: '💎' },
  { id: 'contractive', label: 'What is Contractive Autoencoder?', icon: '📐' },
  { id: 'regularizers', label: 'How do Sparse and Contractive Autoencoders act as regularizers?', icon: '🛡️' },
  { id: 'compression', label: 'Explain Image Compression using Autoencoder.', icon: '🖼️' },
];

const DL_EXAM_QUESTIONS: QuestionMetadata[] = [
  // ================= UNIT 1 =================
  {
    id: 'q2',
    num: 2,
    text: 'Explain XOR problem and why a single-layer perceptron cannot solve it. How does MLP solve XOR?',
    unit: 1,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q3',
    num: 3,
    text: 'Explain representation power of MLPs.',
    unit: 1,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q5',
    num: 5,
    text: 'Explain Gradient Descent and its working.',
    unit: 1,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  // ================= UNIT 2 =================
  {
    id: 'q11',
    num: 11,
    text: 'Explain Logistic, Tanh, Linear, ReLU, Leaky ReLU and Softmax activation functions.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q13',
    num: 13,
    text: 'Explain Squared Error Loss and Cross-Entropy Loss.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q15',
    num: 15,
    text: 'Explain Backpropagation algorithm.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q17',
    num: 17,
    text: 'Differentiate Batch GD, Stochastic GD and Mini-Batch GD.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q19',
    num: 19,
    text: 'Explain AdaGrad, RMSProp and Adam.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q20',
    num: 20,
    text: 'Why is Adam preferred over AdaGrad and RMSProp?',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q21',
    num: 21,
    text: 'Explain Overfitting, Bias, Variance and Bias-Variance Tradeoff.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q22',
    num: 22,
    text: 'Explain regularization methods: L1, L2, Dropout, Weight Decay, Batch Normalization, Early Stopping, Data Augmentation, Parameter Sharing and Noise.',
    unit: 2,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  // ================= UNIT 3 =================
  {
    id: 'q23',
    num: 23,
    text: 'Explain Autoencoder architecture: Encoder, Decoder, latent representation and Linear Autoencoder.',
    unit: 3,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q24',
    num: 24,
    text: 'Compare Undercomplete and Overcomplete Autoencoders. Explain regularization in Autoencoders.',
    unit: 3,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'q25',
    num: 25,
    text: 'Explain Denoising, Sparse and Contractive Autoencoders + Application of Autoencoders in Image Compression.',
    unit: 3,
    isHighPriority: true,
    tasks: Q25_TASKS,
  },
];

interface Sem7ScreenProps {
  onStartFocusFromQuestion: (title: string) => void;
}

export const Sem7Screen: React.FC<Sem7ScreenProps> = ({ onStartFocusFromQuestion }) => {
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<'deep-learning'>('deep-learning');
  
  // Expanded questions state: maps question ID to boolean
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>(() => {
    return { q2: true, q11: true, q25: true }; // Keep key ones expanded
  });

  // Checklist progress state: key is 'questionId_taskId' -> boolean
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_sem7_dl_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_dl_progress', JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress to localStorage', e);
    }
  }, [progress]);

  // Toggle single sub-task
  const toggleSubTask = (qId: string, tId: string) => {
    const key = `${qId}_${tId}`;
    setProgress((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle main question (select all / deselect all sub-tasks)
  const toggleQuestionAll = (q: QuestionMetadata) => {
    const allTaskKeys = q.tasks.map((t) => `${q.id}_${t.id}`);
    const isCurrentlyFullyCompleted = allTaskKeys.every((key) => !!progress[key]);
    
    setProgress((prev) => {
      const next = { ...prev };
      allTaskKeys.forEach((key) => {
        next[key] = !isCurrentlyFullyCompleted;
      });
      return next;
    });
  };

  // Toggle question expanded state
  const toggleExpanded = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Check if a question is fully completed
  const isQuestionCompleted = (q: QuestionMetadata) => {
    return q.tasks.every((t) => !!progress[`${q.id}_${t.id}`]);
  };

  // Get completed tasks count for a question
  const getQuestionCompletedCount = (q: QuestionMetadata) => {
    return q.tasks.filter((t) => !!progress[`${q.id}_${t.id}`]).length;
  };

  // Stats Calculations (out of the 14 exam focused questions)
  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;

    DL_EXAM_QUESTIONS.forEach((q) => {
      const qTasksCount = q.tasks.length;
      totalTasks += qTasksCount;
      
      const qCompleted = q.tasks.filter((t) => !!progress[`${q.id}_${t.id}`]).length;
      completedTasks += qCompleted;
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      percent,
    };
  }, [progress]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return DL_EXAM_QUESTIONS.filter((q) => {
      const matchUnit = selectedUnit === 'all' || q.unit === selectedUnit;
      const matchSearch =
        searchQuery.trim() === '' ||
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `unit ${q.unit}`.includes(searchQuery.toLowerCase()) ||
        q.tasks.some((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchUnit && matchSearch;
    });
  }, [selectedUnit, searchQuery]);

  // Reset progress handler
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all Deep Learning study progress? This cannot be undone.')) {
      setProgress({});
    }
  };

  // Helper to render unit headers
  const getUnitName = (unitNum: number) => {
    switch (unitNum) {
      case 1:
        return 'Unit 1 — Fundamentals (XOR Problem, representation power, Gradient Descent)';
      case 2:
        return 'Unit 2 — Training, Optimization & Regularization (Activations, Cross-Entropy Loss, Backpropagation, Optimizers, Regularizers)';
      case 3:
        return 'Unit 3 — Autoencoders (Bottleneck architecture, Regularized Autoencoders, Image Compression)';
      default:
        return `Unit ${unitNum}`;
    }
  };

  return (
    <main className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Semester 7 Study Hub
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            Sem 7 Revision Portal
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            Highly targeted revision checklists. Zero fluff, 100% exam-focused content.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white border border-[#c2c8c0] rounded-2xl p-4 shadow-xs flex gap-4 self-start md:self-auto min-w-[240px]">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-500 uppercase">
              <span className="flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                DL Exam Prep Progress
              </span>
              <span className="text-rose-700 font-extrabold">{stats.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#ebeef0] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
              <span>{stats.completedTasks}/{stats.totalTasks} sub-steps done</span>
              <span>14 target topics</span>
            </div>
          </div>
        </div>
      </header>

      {/* Subject Tabs */}
      <div className="flex border-b border-[#c2c8c0] mb-6">
        <button
          onClick={() => setActiveSubject('deep-learning')}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'deep-learning'
              ? 'border-rose-500 text-rose-700 bg-rose-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className="w-4 h-4 text-rose-600" />
          <span>Deep Learning (IA-1 Focus)</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-[#c2c8c0] rounded-2xl p-4 mb-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam topics..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#f1f4f6] rounded-xl border border-transparent focus:border-rose-500 focus:bg-white focus:outline-none transition-all placeholder-slate-400"
            />
          </div>

          {/* Unit Filters */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
            {([
              { id: 'all', label: 'All Units' },
              { id: 1, label: 'Unit 1' },
              { id: 2, label: 'Unit 2' },
              { id: 3, label: 'Unit 3' },
            ] as const).map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedUnit === unit.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-[#f1f4f6] text-slate-600 hover:bg-[#e5e9eb]'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 select-none font-mono">
            <Zap className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
            <span>Currently focused on 14 critical high-yield topics</span>
          </p>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Subject Progress</span>
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-8">
        {([1, 2, 3] as const).map((unitNum) => {
          const unitQuestions = filteredQuestions.filter((q) => q.unit === unitNum);
          if (unitQuestions.length === 0) return null;

          return (
            <div key={unitNum} className="space-y-4">
              {/* Unit header */}
              <h2 className="text-base sm:text-md font-extrabold text-[#43664c] tracking-wide border-l-4 border-[#43664c] pl-3 py-0.5">
                {getUnitName(unitNum)}
              </h2>

              <div className="space-y-3">
                {unitQuestions.map((q) => {
                  const isDone = isQuestionCompleted(q);
                  const completedSteps = getQuestionCompletedCount(q);
                  const totalSteps = q.tasks.length;
                  const isExpanded = !!expandedQuestions[q.id];

                  return (
                    <div
                      key={q.id}
                      className={`w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isDone
                          ? 'border-[#c4eccb] bg-[#c4eccb]/10'
                          : 'border-rose-200 bg-white hover:border-rose-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Card Header row */}
                      <div className="p-4 sm:p-5 flex items-start gap-3.5 justify-between">
                        {/* Checkbox & Text */}
                        <div className="flex items-start gap-3 flex-1 min-w-0 font-sans">
                          <button
                            onClick={() => toggleQuestionAll(q)}
                            className={`mt-1 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                              isDone
                                ? 'bg-rose-600 border-rose-600 text-white'
                                : 'border-rose-400 hover:border-rose-500 hover:bg-rose-50'
                            }`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                                Topic {q.num}
                              </span>

                              <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                                <Star className="w-3 h-3 fill-rose-600 text-rose-600 shrink-0" />
                                <span>EXAM MUST-DO</span>
                              </span>

                              <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                {completedSteps}/{totalSteps} steps completed
                              </span>
                            </div>

                            <h3
                              onClick={() => toggleExpanded(q.id)}
                              className={`text-[15px] sm:text-[16px] font-bold cursor-pointer hover:text-slate-800 ${
                                isDone ? 'text-slate-500 line-through' : 'text-[#181c1e]'
                              }`}
                            >
                              {q.text}
                            </h3>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 ml-4 self-center">
                          <button
                            onClick={() =>
                              onStartFocusFromQuestion(
                                `Study Topic ${q.num}: ${q.text.split(/[?.:+]/)[0]}`
                              )
                            }
                            className="px-2.5 py-1.5 bg-[#006494] hover:bg-[#004e75] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer font-sans"
                            title="Launch 10-minute study sprint in My Flow"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span className="hidden sm:inline">Study Sprint</span>
                          </button>

                          <button
                            onClick={() => toggleExpanded(q.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Card Expandable Body */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-[#fbfcfd] px-6 py-4 space-y-2 font-sans">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 font-mono">
                            Task Mastery Checklist
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.tasks.map((task) => {
                              const key = `${q.id}_${task.id}`;
                              const isChecked = !!progress[key];

                              return (
                                <div
                                  key={task.id}
                                  onClick={() => toggleSubTask(q.id, task.id)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                  }`}
                                >
                                  <div
                                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border text-xs shrink-0 ${
                                      isChecked
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span className="text-xs font-semibold mr-1 shrink-0">
                                    {task.icon}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      isChecked ? 'line-through text-slate-500 font-semibold' : 'font-semibold'
                                    }`}
                                  >
                                    {task.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Extra info for Q25 */}
                          {q.id === 'q25' && (
                            <div className="mt-3.5 p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-slate-700 text-xs leading-relaxed">
                              <p className="font-extrabold text-rose-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
                                <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                                EXAM SYLLABUS DETAIL &bull; AUTOENCODER STUDY GUIDE
                              </p>
                              <p className="font-semibold text-slate-600">
                                Image Compression **is explicitly included**. Prepare the following topics carefully:
                              </p>
                              <ul className="list-disc pl-4 mt-1.5 space-y-1 font-semibold text-slate-800">
                                <li><strong>What is Denoising Autoencoder?</strong> (Reconstructs clean output from corrupted version; forces latent features to be robust)</li>
                                <li><strong>What is Sparse Autoencoder?</strong> (Adds an L1 penalty on hidden unit activations to force sparsity, learning selective pathways)</li>
                                <li><strong>What is Contractive Autoencoder?</strong> (Adds Jacobian Frobenius norm penalty to ensure small input changes don't change hidden representation)</li>
                                <li><strong>How do Sparse and Contractive Autoencoders act as regularizers?</strong> (They prevent identity mapping in overcomplete representations by constraining the capacity of the model mathematically)</li>
                                <li><strong>Explain Image Compression using Autoencoder.</strong> (Uses encoding bottleneck: high-res pixels → encoder → compact bottleneck code (latent compression) → decoder → reconstructed pixels)</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revision Guidelines Widget */}
      <footer className="mt-8 bg-white border border-[#c2c8c0] rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
            💡
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">ADHD Study Tips for Deep Learning</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Draw the neural architectures on paper! Drawing diagrams for MLPs, SLP boundary lines, and Autoencoder bottlenecks is standard for 90%+ of DL exam papers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Exam Focus:</span>
          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold font-mono">14 Core Topics</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold font-mono">Autoencoders</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold font-mono">Optimizers</span>
        </div>
      </footer>
    </main>
  );
};
