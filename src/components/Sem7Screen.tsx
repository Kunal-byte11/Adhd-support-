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
  Layers,
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
  unit?: 1 | 2 | 3;
  tier?: 1 | 2;
  isHighPriority: boolean;
  evidence?: string;
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

const BDA_EXAM_QUESTIONS: QuestionMetadata[] = [
  // ================= TIER 1 — MUST DO =================
  {
    id: 'b1',
    num: 1,
    text: 'Explain Hadoop Ecosystem and its core components with diagram.',
    tier: 1,
    isHighPriority: true,
    evidence: 'IA-1 + Endsem',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b2',
    num: 2,
    text: 'Explain MapReduce and its execution/workflow in detail.',
    tier: 1,
    isHighPriority: true,
    evidence: 'IA-1 + Endsem',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b3',
    num: 3,
    text: "Show all steps of Matrix-Vector Multiplication using MapReduce when vector doesn't fit in main memory.",
    tier: 1,
    isHighPriority: true,
    evidence: 'IA-1 + Endsem',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b4',
    num: 4,
    text: 'Explain the four types of NoSQL databases / NoSQL data architecture patterns with examples.',
    tier: 1,
    isHighPriority: true,
    evidence: 'IA-1 + Endsem',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b5',
    num: 5,
    text: 'Explain NoSQL architecture and how NoSQL systems handle Big Data problems.',
    tier: 1,
    isHighPriority: true,
    evidence: 'Endsem + syllabus',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b6',
    num: 6,
    text: 'Explain Big Data characteristics (3V/5V) and discuss a Big Data case study/solution.',
    tier: 1,
    isHighPriority: true,
    evidence: 'IA-1 + Endsem + syllabus',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b7',
    num: 7,
    text: 'Explain Selection, Projection, Union, Intersection and Difference using MapReduce.',
    tier: 1,
    isHighPriority: true,
    evidence: 'Endsem + syllabus',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b8',
    num: 8,
    text: 'Explain HDFS architecture, including NameNode, DataNode, blocks and replication.',
    tier: 1,
    isHighPriority: true,
    evidence: 'IA-1',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b9',
    num: 9,
    text: 'Explain limitations of Hadoop.',
    tier: 1,
    isHighPriority: true,
    evidence: 'Endsem + syllabus',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b10',
    num: 10,
    text: 'Differentiate SQL and NoSQL databases. Explain why NoSQL is suitable for Big Data.',
    tier: 1,
    isHighPriority: true,
    evidence: 'Endsem + syllabus',
    tasks: STANDARD_TASKS,
  },
  // ================= TIER 2 — VERY IMPORTANT =================
  {
    id: 'b11',
    num: 11,
    text: 'Explain PageRank and computation of PageRank using MapReduce.',
    tier: 2,
    isHighPriority: true,
    evidence: '🔴 Very High',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b12',
    num: 12,
    text: 'Explain Bloom Filter and solve a numerical problem.',
    tier: 2,
    isHighPriority: true,
    evidence: '🔴 Very High',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b13',
    num: 13,
    text: 'Explain Flajolet-Martin algorithm and estimate distinct elements from a stream.',
    tier: 2,
    isHighPriority: true,
    evidence: '🔴 Very High',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b14',
    num: 14,
    text: 'Explain DGIM algorithm and estimate number of 1s in the last N bits.',
    tier: 2,
    isHighPriority: true,
    evidence: '🔴 Very High',
    tasks: STANDARD_TASKS,
  },
  {
    id: 'b15',
    num: 15,
    text: 'Explain CURE clustering algorithm in detail.',
    tier: 2,
    isHighPriority: true,
    evidence: '🔴 High',
    tasks: STANDARD_TASKS,
  },
];

interface Sem7ScreenProps {
  onStartFocusFromQuestion: (title: string) => void;
}

export const Sem7Screen: React.FC<Sem7ScreenProps> = ({ onStartFocusFromQuestion }) => {
  const [activeSubject, setActiveSubject] = useState<'deep-learning' | 'bda'>('deep-learning');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded questions state: maps question ID to boolean
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>(() => {
    return { q2: true, q11: true, q25: true, b1: true, b3: true, b12: true }; // Keep key ones expanded
  });

  // DL Checklist progress state
  const [progressDL, setProgressDL] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_sem7_dl_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // BDA Checklist progress state
  const [progressBDA, setProgressBDA] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_sem7_bda_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save DL progress
  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_dl_progress', JSON.stringify(progressDL));
    } catch (e) {}
  }, [progressDL]);

  // Save BDA progress
  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_bda_progress', JSON.stringify(progressBDA));
    } catch (e) {}
  }, [progressBDA]);

  // Toggle single sub-task
  const toggleSubTask = (qId: string, tId: string) => {
    const key = `${qId}_${tId}`;
    if (activeSubject === 'deep-learning') {
      setProgressDL((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    } else {
      setProgressBDA((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  // Toggle main question (select all / deselect all sub-tasks)
  const toggleQuestionAll = (q: QuestionMetadata) => {
    const allTaskKeys = q.tasks.map((t) => `${q.id}_${t.id}`);
    const currentProgress = activeSubject === 'deep-learning' ? progressDL : progressBDA;
    const isCurrentlyFullyCompleted = allTaskKeys.every((key) => !!currentProgress[key]);
    
    const updater = (prev: Record<string, boolean>) => {
      const next = { ...prev };
      allTaskKeys.forEach((key) => {
        next[key] = !isCurrentlyFullyCompleted;
      });
      return next;
    };

    if (activeSubject === 'deep-learning') {
      setProgressDL(updater);
    } else {
      setProgressBDA(updater);
    }
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
    const currentProgress = activeSubject === 'deep-learning' ? progressDL : progressBDA;
    return q.tasks.every((t) => !!currentProgress[`${q.id}_${t.id}`]);
  };

  // Get completed tasks count for a question
  const getQuestionCompletedCount = (q: QuestionMetadata) => {
    const currentProgress = activeSubject === 'deep-learning' ? progressDL : progressBDA;
    return q.tasks.filter((t) => !!currentProgress[`${q.id}_${t.id}`]).length;
  };

  // Stats Calculations
  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    const currentQuestions = activeSubject === 'deep-learning' ? DL_EXAM_QUESTIONS : BDA_EXAM_QUESTIONS;
    const currentProgress = activeSubject === 'deep-learning' ? progressDL : progressBDA;

    currentQuestions.forEach((q) => {
      const qTasksCount = q.tasks.length;
      totalTasks += qTasksCount;
      
      const qCompleted = q.tasks.filter((t) => !!currentProgress[`${q.id}_${t.id}`]).length;
      completedTasks += qCompleted;
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      percent,
    };
  }, [activeSubject, progressDL, progressBDA]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    if (activeSubject === 'deep-learning') {
      return DL_EXAM_QUESTIONS.filter((q) => {
        const matchUnit = selectedUnit === 'all' || q.unit === selectedUnit;
        const matchSearch =
          searchQuery.trim() === '' ||
          q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `unit ${q.unit}`.includes(searchQuery.toLowerCase()) ||
          q.tasks.some((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchUnit && matchSearch;
      });
    } else {
      return BDA_EXAM_QUESTIONS.filter((q) => {
        const matchTier = selectedTier === 'all' || q.tier === selectedTier;
        const matchSearch =
          searchQuery.trim() === '' ||
          q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `tier ${q.tier}`.includes(searchQuery.toLowerCase()) ||
          (q.evidence && q.evidence.toLowerCase().includes(searchQuery.toLowerCase())) ||
          q.tasks.some((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchTier && matchSearch;
      });
    }
  }, [activeSubject, selectedUnit, selectedTier, searchQuery]);

  // Reset progress handler
  const handleResetProgress = () => {
    const subjectName = activeSubject === 'deep-learning' ? 'Deep Learning' : 'Big Data Analytics';
    if (window.confirm(`Are you sure you want to reset all ${subjectName} study progress?`)) {
      if (activeSubject === 'deep-learning') {
        setProgressDL({});
      } else {
        setProgressBDA({});
      }
    }
  };

  // Helper to render unit headers for DL
  const getDLUnitName = (unitNum: number) => {
    switch (unitNum) {
      case 1:
        return 'Unit 1 — Fundamentals (XOR Problem, representation power, Gradient Descent)';
      case 2:
        return 'Unit 2 — Training, Optimization & Regularization (Activations, Losses, Backpropagation, Optimizers, Regularizers)';
      case 3:
        return 'Unit 3 — Autoencoders (Bottleneck architecture, Regularized Autoencoders, Image Compression)';
      default:
        return `Unit ${unitNum}`;
    }
  };

  // Helper to render study notes inside BDA numerical/systems cards
  const renderBdaStudyTips = (qId: string) => {
    switch (qId) {
      case 'b3':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-slate-700 text-xs">
            <p className="font-extrabold text-amber-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🧮 EXAM TIP: MATRIX-VECTOR MULTIPLICATION (VEC &gt; RAM)
            </p>
            <p>
              When vector v is too large to fit in memory, we partition it. If matrix M is partitioned into strips, the algorithm works as follows:
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-0.5 font-semibold text-slate-800">
              <li><strong>Matrix Splitting</strong>: Divide matrix M into vertical strips (column groups) and vector v into matching sub-vectors.</li>
              <li><strong>Map Function</strong>: Reads chunk of vector v_j and part of matrix column M_ij. Emits key-value: i -&gt; M_ij * v_j.</li>
              <li><strong>Reduce Function</strong>: Receives key i and list of partial products. Sums them up: sum_j (M_ij * v_j) to output the final element x_i.</li>
            </ul>
          </div>
        );
      case 'b11':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 text-xs">
            <p className="font-extrabold text-blue-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🔗 EXAM TIP: PAGERANK ALGORITHM
            </p>
            <p>
              Mathematical PageRank equation with teleportation:
              <br/>
              <span className="font-mono font-bold block my-1">P(i) = (1 - beta) / N + beta * sum_&#123;j to i&#125; (P(j) / C(j))</span>
              Where beta is the damping factor (usually 0.85), C(j) is the out-degree of page j, and N is the total number of pages.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-0.5 font-semibold text-slate-800">
              <li><strong>Map Step</strong>: Receives node j with current rank P(j) and out-links list. Emits for each destination i: (i, P(j)/C(j)). Also emits (j, links) to preserve graph structure.</li>
              <li><strong>Reduce Step</strong>: Sums all rank values for destination node i. Adjusts for dead ends (leakage redistributed to all nodes) and applies the damping factor.</li>
            </ul>
          </div>
        );
      case 'b12':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-slate-700 text-xs">
            <p className="font-extrabold text-rose-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🧪 EXAM TIP: BLOOM FILTER NUMERICAL
            </p>
            <p>
              A Bloom filter is a space-efficient probabilistic data structure used to test set membership.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Math Formula</strong>: False Positive Probability p ≈ (1 - e^(-kn/m))^k.
                <br/>Where m = size of bit array, n = number of elements inserted, k = number of hash functions.
              </li>
              <li><strong>Optimal hash functions</strong>: k = ln(2) * (m/n).</li>
              <li><strong>Algorithm</strong>: To insert, run element through k hash functions, set those index positions in bit array to 1. To query, hash element; if any index is 0, element is definitely NOT in the set. If all are 1, element is probably in the set.</li>
            </ul>
          </div>
        );
      case 'b13':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-slate-700 text-xs">
            <p className="font-extrabold text-purple-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              💎 EXAM TIP: FLAJOLET-MARTIN STREAM ALGORITHM
            </p>
            <p>
              Used to estimate number of distinct elements in a stream using low memory.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Hash function</strong>: Hashes element x to a binary string h(x) of size L.</li>
              <li><strong>Trailing Zeros</strong>: Find the number of trailing zeros in h(x). Let this be r(x). E.g., if h(x) = 10100, trailing zeros r(x) = 2.</li>
              <li><strong>Max estimation</strong>: Let R = max(r(x)) across all seen elements in the stream.</li>
              <li><strong>Estimate</strong>: The number of distinct elements is estimated as 2^R (or 2^R / 0.77351 for correction).</li>
            </ul>
          </div>
        );
      case 'b14':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs">
            <p className="font-extrabold text-emerald-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              📐 EXAM TIP: DGIM ALGORITHM (SLIDING WINDOW)
            </p>
            <p>
              Used to count the number of 1s in a sliding window of size N using O(log^2 N) space.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Bucket Structure</strong>: Each bucket stores timestamp of its most recent 1 and its size (which must be a power of 2: 1, 2, 4, 8, 16...).</li>
              <li><strong>DGIM Rules</strong>: (1) Buckets do not overlap in time. (2) Bucket sizes are powers of 2. (3) There are either 1 or 2 buckets of any given size.</li>
              <li><strong>Insertion Flow</strong>: If a new bit arrives:
                <br/>- If 0: do nothing.
                <br/>- If 1: Create a new bucket of size 1. If we now have 3 buckets of size 1, merge the two oldest into a bucket of size 2. If we now have 3 of size 2, merge the two oldest into size 4, and cascade.
              </li>
              <li><strong>Query Estimation</strong>: Sum sizes of all buckets completely within window + half the size of the oldest bucket overlapping the window boundary.</li>
            </ul>
          </div>
        );
      case 'b15':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-700 text-xs">
            <p className="font-extrabold text-indigo-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🛡️ EXAM TIP: CURE CLUSTERING ALGORITHM
            </p>
            <p>
              CURE (Clustering Using REpresentatives) is a hierarchical clustering algorithm that handles non-spherical shapes and scales to large databases.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Representative Points</strong>: Instead of using only one centroid, select a set of c well-spaced points in each cluster to represent it.</li>
              <li><strong>Centroid Shrinkage</strong>: Shrink these representative points towards the cluster centroid by a fraction parameter alpha (usually 20%). This mitigates the effect of outliers.</li>
              <li><strong>MapReduce Parallelization</strong>: Draw a random sample, partition the sample across Map tasks, run CURE locally, and then merge clusters globally in the Reduce phase.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper to render question card
  const renderQuestionCard = (q: QuestionMetadata) => {
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
            : activeSubject === 'deep-learning'
            ? 'border-rose-200 bg-white hover:border-rose-300 hover:shadow-xs'
            : 'border-amber-200 bg-white hover:border-amber-300 hover:shadow-xs'
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
                  ? activeSubject === 'deep-learning'
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-amber-600 border-amber-600 text-white'
                  : activeSubject === 'deep-learning'
                  ? 'border-rose-400 hover:border-rose-500 hover:bg-rose-50'
                  : 'border-amber-400 hover:border-amber-500 hover:bg-amber-50'
              }`}
            >
              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                  Topic {q.num}
                </span>

                {/* Priority Badges */}
                {activeSubject === 'deep-learning' ? (
                  <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                    <Star className="w-3 h-3 fill-rose-600 text-rose-600 shrink-0" />
                    <span>EXAM MUST-DO</span>
                  </span>
                ) : (
                  <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono ${
                    q.tier === 1 
                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    <span>{q.tier === 1 ? '🥇 TIER 1 MUST-DO' : '🥈 TIER 2 CORE'}</span>
                  </span>
                )}

                {/* Evidence Badge for BDA */}
                {activeSubject === 'bda' && q.evidence && (
                  <span className="text-[10px] font-semibold text-[#006494] bg-[#5fafe9]/10 border border-[#5fafe9]/20 px-2 py-0.5 rounded-full font-mono">
                    📝 {q.evidence}
                  </span>
                )}

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
                  `Study ${activeSubject === 'deep-learning' ? 'DL' : 'BDA'} Topic ${q.num}: ${q.text.split(/[?.:+]/)[0]}`
                )
              }
              className={`px-2.5 py-1.5 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer font-sans ${
                activeSubject === 'deep-learning'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
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
                const currentProgress = activeSubject === 'deep-learning' ? progressDL : progressBDA;
                const isChecked = !!currentProgress[key];

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

            {/* Extra study tip guides (Topic 25 for DL, or any numerical BDA question) */}
            {activeSubject === 'deep-learning' && q.id === 'q25' && (
              <div className="mt-3.5 p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-slate-700 text-xs leading-relaxed">
                <p className="font-extrabold text-rose-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
                  <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  EXAM SYLLABUS DETAIL &bull; AUTOENCODER STUDY GUIDE
                </p>
                <p className="font-semibold text-slate-600">
                  Image Compression **is explicitly included**. Prepare the following topics carefully:
                </p>
                <ul className="list-disc pl-4 mt-1.5 space-y-1 font-semibold text-slate-800">
                  <li><strong>What is Denoising Autoencoder?</strong> (Reconstructs clean input from corrupted version; forces latent features to be robust)</li>
                  <li><strong>What is Sparse Autoencoder?</strong> (Adds an L1 penalty on hidden unit activations to force sparsity, learning selective pathways)</li>
                  <li><strong>What is Contractive Autoencoder?</strong> (Adds Jacobian Frobenius norm penalty to ensure small input changes don't change hidden representation)</li>
                  <li><strong>How do Sparse and Contractive Autoencoders act as regularizers?</strong> (They prevent identity mapping in overcomplete representations by constraining the capacity of the model mathematically)</li>
                  <li><strong>Explain Image Compression using Autoencoder.</strong> (Uses encoding bottleneck: high-res pixels → encoder → compact bottleneck code (latent compression) → decoder → reconstructed pixels)</li>
                </ul>
              </div>
            )}

            {activeSubject === 'bda' && renderBdaStudyTips(q.id)}
          </div>
        )}
      </div>
    );
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
            <div className={`flex items-center justify-between text-xs font-semibold uppercase ${
              activeSubject === 'deep-learning' ? 'text-rose-500' : 'text-amber-500'
            }`}>
              <span className="flex items-center gap-1 font-bold">
                <Star className={`w-3.5 h-3.5 fill-current ${
                  activeSubject === 'deep-learning' ? 'text-rose-500' : 'text-amber-500'
                }`} />
                {activeSubject === 'deep-learning' ? 'DL' : 'BDA'} Prep Progress
              </span>
              <span className={`font-extrabold ${
                activeSubject === 'deep-learning' ? 'text-rose-700' : 'text-amber-700'
              }`}>{stats.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#ebeef0] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  activeSubject === 'deep-learning'
                    ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                    : 'bg-gradient-to-r from-amber-400 to-amber-600'
                }`}
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
              <span>{stats.completedTasks}/{stats.totalTasks} sub-steps done</span>
              <span>{activeSubject === 'deep-learning' ? '14 DL topics' : '15 BDA topics'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Subject Tabs */}
      <div className="flex border-b border-[#c2c8c0] mb-6">
        <button
          onClick={() => {
            setActiveSubject('deep-learning');
            setSelectedUnit('all');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'deep-learning'
              ? 'border-rose-500 text-rose-700 bg-rose-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className="w-4 h-4 text-rose-600" />
          <span>Deep Learning (IA-1 Focus)</span>
        </button>

        <button
          onClick={() => {
            setActiveSubject('bda');
            setSelectedTier('all');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 py-3 px-5 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'bda'
              ? 'border-amber-500 text-amber-700 bg-amber-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-base leading-none">🔥</span>
          <span>bda 🔥 (Top 15 Focus)</span>
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
              placeholder={`Search ${activeSubject === 'deep-learning' ? 'DL' : 'BDA'} topics...`}
              className={`w-full pl-9 pr-3 py-2 text-sm bg-[#f1f4f6] rounded-xl border border-transparent focus:bg-white focus:outline-none transition-all placeholder-slate-400 ${
                activeSubject === 'deep-learning' ? 'focus:border-rose-500' : 'focus:border-amber-500'
              }`}
            />
          </div>

          {/* Dynamic Filters (Units vs Tiers) */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
            {activeSubject === 'deep-learning' ? (
              ([
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
              ))
            ) : (
              ([
                { id: 'all', label: 'All Tiers' },
                { id: 1, label: '🥇 Tier 1' },
                { id: 2, label: '🥈 Tier 2' },
              ] as const).map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === tier.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[#f1f4f6] text-slate-600 hover:bg-[#e5e9eb]'
                  }`}
                >
                  {tier.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 select-none font-mono">
            <Zap className={`w-3.5 h-3.5 shrink-0 ${
              activeSubject === 'deep-learning' ? 'text-rose-500 fill-rose-500' : 'text-amber-500 fill-amber-500'
            }`} />
            <span>
              {activeSubject === 'deep-learning'
                ? 'Focused on 14 high-yield Deep Learning topics'
                : 'Focused on 15 core Big Data Analytics topics'}
            </span>
          </p>

          <button
            onClick={handleResetProgress}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-colors border cursor-pointer ${
              activeSubject === 'deep-learning'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Subject Progress</span>
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-8">
        {activeSubject === 'deep-learning' ? (
          ([1, 2, 3] as const).map((unitNum) => {
            const unitQuestions = filteredQuestions.filter((q) => q.unit === unitNum);
            if (unitQuestions.length === 0) return null;

            return (
              <div key={unitNum} className="space-y-4">
                <h2 className="text-base sm:text-md font-extrabold text-[#43664c] tracking-wide border-l-4 border-[#43664c] pl-3 py-0.5">
                  {getDLUnitName(unitNum)}
                </h2>

                <div className="space-y-3">
                  {unitQuestions.map((q) => renderQuestionCard(q))}
                </div>
              </div>
            );
          })
        ) : (
          ([1, 2] as const).map((tierNum) => {
            const tierQuestions = filteredQuestions.filter((q) => q.tier === tierNum);
            if (tierQuestions.length === 0) return null;

            return (
              <div key={tierNum} className="space-y-4">
                <h2 className={`text-base sm:text-md font-extrabold tracking-wide border-l-4 pl-3 py-0.5 ${
                  tierNum === 1 ? 'text-amber-700 border-amber-700' : 'text-blue-700 border-blue-700'
                }`}>
                  {tierNum === 1 
                    ? 'Tier 1 — MUST DO (🥇 High Frequency Exam Topics)' 
                    : 'Tier 2 — VERY IMPORTANT (🥈 Core Algorithms & Numericals)'}
                </h2>

                <div className="space-y-3">
                  {tierQuestions.map((q) => renderQuestionCard(q))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Revision Guidelines Widget */}
      <footer className="mt-8 bg-white border border-[#c2c8c0] rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
            💡
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {activeSubject === 'deep-learning' ? 'DL Study Hack' : 'BDA Study Hack'}
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              {activeSubject === 'deep-learning'
                ? 'Draw the neural architectures on paper! Drawing diagrams for MLPs and Autoencoder bottlenecks is key.'
                : 'Formulate HDFS, MapReduce workflows, and Bloom Filter math step-by-step. Practical coding workflow layouts are standard exam questions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Exam Focus:</span>
          {activeSubject === 'deep-learning' ? (
            <>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold font-mono">14 DL Topics</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold font-mono">Autoencoders</span>
            </>
          ) : (
            <>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold font-mono">10 MUST-DOs</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold font-mono">5 Core Alg</span>
            </>
          )}
        </div>
      </footer>
    </main>
  );
};
