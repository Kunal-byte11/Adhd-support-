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
  Link,
  BarChart3,
  ShieldCheck,
  Pause,
  RotateCcw,
  X,
  Clock,
  PhoneOff,
  Smartphone,
  ShieldAlert,
  PenTool,
  Send,
  Wind,
  Flame,
  Target,
} from 'lucide-react';
import { IWoopGoal, ISessionRecall } from '../types';
import { saveRecallLogToFirestore } from '../lib/firestoreService';
import { parseWoopPlan } from '../lib/woopUtils';
import { NeuroDeck } from './NeuroDeck';

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
  tier?: 1 | 2 | 3;
  priorityRating?: string;
  marks?: 5 | 10;
  isHighPriority: boolean;
  evidence?: string;
  tasks: ChecklistTask[];
}

const STANDARD_TASKS: ChecklistTask[] = [
  { id: 'concept', label: 'Read & understand core concept', icon: '📖' },
  { id: 'equations', label: 'Write key equations, frameworks & definitions', icon: '🧮' },
  { id: 'diagram', label: 'Draw/sketch architecture or process diagrams (if applicable)', icon: '✏️' },
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

const BCT_EXAM_QUESTIONS: QuestionMetadata[] = [
  // ================= 5 FLAMES (🔥🔥🔥🔥🔥) =================
  {
    id: 'c1',
    num: 1,
    text: 'Explain Hyperledger Fabric architecture/components and transaction flow in detail.',
    tier: 1,
    priorityRating: '🔥🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c2',
    num: 2,
    text: 'Explain Ethereum architecture/components in detail with workflow.',
    tier: 1,
    priorityRating: '🔥🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c3',
    num: 3,
    text: 'Explain RAFT consensus algorithm with suitable example.',
    tier: 1,
    priorityRating: '🔥🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c4',
    num: 4,
    text: 'Differentiate between Public, Private and Consortium Blockchain.',
    tier: 1,
    priorityRating: '🔥🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c5',
    num: 5,
    text: 'Explain PoW, PoS, PoB and PoET. Differentiate between them.',
    tier: 1,
    priorityRating: '🔥🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c6',
    num: 6,
    text: 'Explain Merkle Tree with suitable example/diagram.',
    tier: 1,
    priorityRating: '🔥🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  // ================= 4 FLAMES (🔥🔥🔥🔥) =================
  {
    id: 'c7',
    num: 7,
    text: 'Explain State Machine Replication with suitable example.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c8',
    num: 8,
    text: 'Explain UTXO model of Bitcoin.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c9',
    num: 9,
    text: 'Compare Bitcoin and Ethereum.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c10',
    num: 10,
    text: 'Explain Double Spending problem and how Bitcoin solves it.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c11',
    num: 11,
    text: 'Explain Mining Difficulty and how it is calculated in Proof-of-Work.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c12',
    num: 12,
    text: 'Explain types of arrays in Solidity with suitable examples/program.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c13',
    num: 13,
    text: 'Explain Solidity visibility and activity/state mutability qualifiers with examples.',
    tier: 2,
    priorityRating: '🔥🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  // ================= 2-3 FLAMES (🔥🔥🔥 / 🔥🔥) =================
  {
    id: 'c14',
    num: 14,
    text: 'Explain View and Pure functions in Solidity with examples.',
    tier: 3,
    priorityRating: '🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c15',
    num: 15,
    text: 'Write a Solidity program to implement Multi-level/Multiple Inheritance.',
    tier: 3,
    priorityRating: '🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c16',
    num: 16,
    text: 'Explain Mining Pool and its methods.',
    tier: 3,
    priorityRating: '🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c17',
    num: 17,
    text: 'Explain Hot Wallet and Cold Wallet. Compare them.',
    tier: 3,
    priorityRating: '🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c18',
    num: 18,
    text: 'Explain different types of Cryptocurrencies.',
    tier: 3,
    priorityRating: '🔥🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c19',
    num: 19,
    text: 'Explain Ethereum Virtual Machine (EVM).',
    tier: 3,
    priorityRating: '🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'c20',
    num: 20,
    text: 'Explain Ripple / Corda as a blockchain platform.',
    tier: 3,
    priorityRating: '🔥🔥',
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
];

const MIS_EXAM_QUESTIONS: QuestionMetadata[] = [
  // ================= MODULE 01 — Introduction to Information Systems =================
  {
    id: 'm1',
    num: 1,
    text: 'How Does IT impact Organizations? [5]',
    unit: 1,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm2',
    num: 2,
    text: 'Explain the impact of information system on organization and society. [10]',
    unit: 1,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm3',
    num: 3,
    text: 'Highlight the Economic impacts of IS. Give example. [10]',
    unit: 1,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm4',
    num: 4,
    text: 'List the various components of CBIS. [5]',
    unit: 1,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm5',
    num: 5,
    text: 'Explain in detail computer-based information systems. [10]',
    unit: 1,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm6',
    num: 6,
    text: 'What are types IS? Explain with example. [10]',
    unit: 1,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm7',
    num: 7,
    text: 'Explain the importance of Information systems to Society. [5]',
    unit: 1,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm8',
    num: 8,
    text: 'Contrast to bring out the advantages and disadvantages of Competitive environment in an organization. [10]',
    unit: 1,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm9',
    num: 9,
    text: 'What are the different types of MIS? [5]',
    unit: 1,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm10',
    num: 10,
    text: 'How is data governance achieved in case of MIS? [5]',
    unit: 1,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },

  // ================= MODULE 02 — Data and Knowledge Management / Business Intelligence =================
  {
    id: 'm11',
    num: 11,
    text: 'Categorize the approach to managing information across an entire organization. [5]',
    unit: 2,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm12',
    num: 12,
    text: 'What is Big Data? What are the various challenges and characteristics of Big Data? [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm13',
    num: 13,
    text: 'What is Data Mart and Data Warehouses? Give two examples which show generation of Big Data. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm14',
    num: 14,
    text: 'Illustrate Knowledge Management lifecycle. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm15',
    num: 15,
    text: 'Illustrate the different types of knowledge and explain four modes of knowledge conversion. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm16',
    num: 16,
    text: 'Analyze the impact of BI on Decision making. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm17',
    num: 17,
    text: 'Explain Data warehouse and Data Mart in an organization. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm18',
    num: 18,
    text: 'Highlight how company can use Big data to gain competitive advantage? [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm19',
    num: 19,
    text: 'Explain the steps involved in knowledge capturing. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm20',
    num: 20,
    text: 'Explain Data warehouse in an organization. [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm21',
    num: 21,
    text: 'Explain the challenges faced by Knowledge management in different business scenarios. [5]',
    unit: 2,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm22',
    num: 22,
    text: 'How the quality of data is ensured in an organization? [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm23',
    num: 23,
    text: 'What is the need / Norm for Businesses? [10]',
    unit: 2,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },

  // ================= MODULE 03 — Ethical Issues, Privacy and Information Security =================
  {
    id: 'm24',
    num: 24,
    text: 'Identify the measures to improve cyber security with example. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm25',
    num: 25,
    text: 'Define Information security with an example. [5]',
    unit: 3,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm26',
    num: 26,
    text: 'Describe the privacy issues affected by IT. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm27',
    num: 27,
    text: 'Discuss how privacy issue can impact transborder data flows? [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm28',
    num: 28,
    text: 'Is security an ethical responsibility? Justify with a case study. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm29',
    num: 29,
    text: 'Explain the major security threats to information security and discuss the measures for controlling the same. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm30',
    num: 30,
    text: 'Identify the five factors that contribute to the increasing vulnerability of information resources, and provide a specific example of each one? [5]',
    unit: 3,
    marks: 5,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm31',
    num: 31,
    text: 'Give an understanding on types of Control to achieve it. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm32',
    num: 32,
    text: 'Evaluate the role of Confidentiality, Integrity and Availability in order to achieve security. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
  {
    id: 'm33',
    num: 33,
    text: 'Analyse the main reasons of Computer Crimes. [10]',
    unit: 3,
    marks: 10,
    isHighPriority: true,
    tasks: STANDARD_TASKS,
  },
];

interface Sem7ScreenProps {
  onStartFocusFromQuestion?: (title: string) => void;
  woopGoals?: IWoopGoal[];
  onOpenWoopModal?: () => void;
}

export const Sem7Screen: React.FC<Sem7ScreenProps> = ({
  onStartFocusFromQuestion,
  woopGoals = [],
  onOpenWoopModal,
}) => {
  const [activeSubject, setActiveSubject] = useState<'deep-learning' | 'bda' | 'bct' | 'mis'>('deep-learning');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedBctPriority, setSelectedBctPriority] = useState<number | 'all'>('all');
  const [selectedMisModule, setSelectedMisModule] = useState<number | 'all'>('all');
  const [selectedMisMarks, setSelectedMisMarks] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Built-in Focus Sprint & Neuroscience Protocols
  const [sprintQuestion, setSprintQuestion] = useState<QuestionMetadata | null>(null);
  const [sprintSecondsLeft, setSprintSecondsLeft] = useState<number>(600);
  const [sprintTotalDuration, setSprintTotalDuration] = useState<number>(600);
  const [isSprintRunning, setIsSprintRunning] = useState<boolean>(false);
  const [phoneDistanced, setPhoneDistanced] = useState<boolean>(true);
  
  // SDAP Waking Micro-Rest State
  const [isMicroRestActive, setIsMicroRestActive] = useState<boolean>(false);
  const [microRestSeconds, setMicroRestSeconds] = useState<number>(15);
  const [microRestsCompleted, setMicroRestsCompleted] = useState<number>(0);
  const [hasAutoTriggeredMicroRest, setHasAutoTriggeredMicroRest] = useState<boolean>(false);

  // Post-Bout Active Recall State
  const [isRecallModalOpen, setIsRecallModalOpen] = useState<boolean>(false);
  const [recallDraft, setRecallDraft] = useState<string>('');
  const [isRecallSaving, setIsRecallSaving] = useState<boolean>(false);
  const [recallSavedSuccess, setRecallSavedSuccess] = useState<boolean>(false);

  // Sprint Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isSprintRunning && !isMicroRestActive && sprintSecondsLeft > 0) {
      timer = setInterval(() => {
        setSprintSecondsLeft((prev) => {
          // Halfway automatic micro-rest trigger (NIH accelerated replay)
          const halfWay = Math.floor(sprintTotalDuration / 2);
          if (prev === halfWay && !hasAutoTriggeredMicroRest && sprintTotalDuration >= 300) {
            setIsMicroRestActive(true);
            setMicroRestSeconds(15);
            setHasAutoTriggeredMicroRest(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (sprintSecondsLeft === 0 && isSprintRunning) {
      setIsSprintRunning(false);
      // Auto-trigger post-bout active recall sandbox
      setIsRecallModalOpen(true);
    }
    return () => clearInterval(timer);
  }, [isSprintRunning, isMicroRestActive, sprintSecondsLeft, sprintTotalDuration, hasAutoTriggeredMicroRest]);

  // Micro-Rest Timer Effect (15s count down)
  useEffect(() => {
    let microTimer: any = null;
    if (isMicroRestActive && microRestSeconds > 0) {
      microTimer = setInterval(() => {
        setMicroRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isMicroRestActive && microRestSeconds === 0) {
      setIsMicroRestActive(false);
      setMicroRestsCompleted((c) => c + 1);
    }
    return () => clearInterval(microTimer);
  }, [isMicroRestActive, microRestSeconds]);

  const handleStartSprint = (q: QuestionMetadata, minutes = 10) => {
    setSprintQuestion(q);
    setSprintTotalDuration(minutes * 60);
    setSprintSecondsLeft(minutes * 60);
    setHasAutoTriggeredMicroRest(false);
    setMicroRestsCompleted(0);
    setIsMicroRestActive(false);
    setIsRecallModalOpen(false);
    setRecallDraft('');
    setRecallSavedSuccess(false);
    setIsSprintRunning(true);
    if (onStartFocusFromQuestion) {
      onStartFocusFromQuestion(`Study Topic ${q.num}: ${q.text.split(/[?.:+\[]/)[0]}`);
    }
  };

  const triggerManualMicroRest = () => {
    setIsMicroRestActive(true);
    setMicroRestSeconds(15);
  };

  const handleSaveRecall = async () => {
    if (!sprintQuestion || !recallDraft.trim()) return;
    setIsRecallSaving(true);
    try {
      const recallRecord: ISessionRecall = {
        id: 'recall_' + Date.now(),
        subject: activeSubject,
        topicTitle: `Topic ${sprintQuestion.num}: ${sprintQuestion.text}`,
        recallContent: recallDraft.trim(),
        durationMinutes: Math.round(sprintTotalDuration / 60),
        phoneDistanced,
        microRestsCompleted,
        createdAt: Date.now(),
      };
      await saveRecallLogToFirestore(recallRecord);
      setRecallSavedSuccess(true);
      setTimeout(() => {
        setIsRecallModalOpen(false);
        setSprintQuestion(null);
      }, 1500);
    } catch (err) {
      console.warn('Failed to save recall:', err);
    } finally {
      setIsRecallSaving(false);
    }
  };
  
  // Expanded questions state
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>(() => {
    return { q2: true, q11: true, q25: true, b1: true, b3: true, b12: true, c1: true, c3: true, c6: true, m4: true, m15: true, m32: true };
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

  // BCT Checklist progress state
  const [progressBCT, setProgressBCT] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_sem7_bct_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // MIS Checklist progress state
  const [progressMIS, setProgressMIS] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_sem7_mis_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save progress states
  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_dl_progress', JSON.stringify(progressDL));
    } catch (e) {}
  }, [progressDL]);

  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_bda_progress', JSON.stringify(progressBDA));
    } catch (e) {}
  }, [progressBDA]);

  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_bct_progress', JSON.stringify(progressBCT));
    } catch (e) {}
  }, [progressBCT]);

  useEffect(() => {
    try {
      localStorage.setItem('focusflow_sem7_mis_progress', JSON.stringify(progressMIS));
    } catch (e) {}
  }, [progressMIS]);

  // Toggle single sub-task
  const toggleSubTask = (qId: string, tId: string) => {
    const key = `${qId}_${tId}`;
    if (activeSubject === 'deep-learning') {
      setProgressDL((prev) => ({ ...prev, [key]: !prev[key] }));
    } else if (activeSubject === 'bda') {
      setProgressBDA((prev) => ({ ...prev, [key]: !prev[key] }));
    } else if (activeSubject === 'bct') {
      setProgressBCT((prev) => ({ ...prev, [key]: !prev[key] }));
    } else {
      setProgressMIS((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Toggle main question (select all / deselect all sub-tasks)
  const toggleQuestionAll = (q: QuestionMetadata) => {
    const allTaskKeys = q.tasks.map((t) => `${q.id}_${t.id}`);
    const currentProgress =
      activeSubject === 'deep-learning'
        ? progressDL
        : activeSubject === 'bda'
        ? progressBDA
        : activeSubject === 'bct'
        ? progressBCT
        : progressMIS;
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
    } else if (activeSubject === 'bda') {
      setProgressBDA(updater);
    } else if (activeSubject === 'bct') {
      setProgressBCT(updater);
    } else {
      setProgressMIS(updater);
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
    const currentProgress =
      activeSubject === 'deep-learning'
        ? progressDL
        : activeSubject === 'bda'
        ? progressBDA
        : activeSubject === 'bct'
        ? progressBCT
        : progressMIS;
    return q.tasks.every((t) => !!currentProgress[`${q.id}_${t.id}`]);
  };

  // Get completed tasks count for a question
  const getQuestionCompletedCount = (q: QuestionMetadata) => {
    const currentProgress =
      activeSubject === 'deep-learning'
        ? progressDL
        : activeSubject === 'bda'
        ? progressBDA
        : activeSubject === 'bct'
        ? progressBCT
        : progressMIS;
    return q.tasks.filter((t) => !!currentProgress[`${q.id}_${t.id}`]).length;
  };

  // Stats Calculations
  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    const currentQuestions =
      activeSubject === 'deep-learning'
        ? DL_EXAM_QUESTIONS
        : activeSubject === 'bda'
        ? BDA_EXAM_QUESTIONS
        : activeSubject === 'bct'
        ? BCT_EXAM_QUESTIONS
        : MIS_EXAM_QUESTIONS;
    const currentProgress =
      activeSubject === 'deep-learning'
        ? progressDL
        : activeSubject === 'bda'
        ? progressBDA
        : activeSubject === 'bct'
        ? progressBCT
        : progressMIS;

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
  }, [activeSubject, progressDL, progressBDA, progressBCT, progressMIS]);

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
    } else if (activeSubject === 'bda') {
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
    } else if (activeSubject === 'bct') {
      return BCT_EXAM_QUESTIONS.filter((q) => {
        const matchPriority = selectedBctPriority === 'all' || q.tier === selectedBctPriority;
        const matchSearch =
          searchQuery.trim() === '' ||
          q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (q.priorityRating && q.priorityRating.includes(searchQuery.trim())) ||
          q.tasks.some((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchPriority && matchSearch;
      });
    } else {
      return MIS_EXAM_QUESTIONS.filter((q) => {
        const matchModule = selectedMisModule === 'all' || q.unit === selectedMisModule;
        const matchMarks = selectedMisMarks === 'all' || q.marks === selectedMisMarks;
        const matchSearch =
          searchQuery.trim() === '' ||
          q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `module ${q.unit}`.includes(searchQuery.toLowerCase()) ||
          `${q.marks} marks`.includes(searchQuery.toLowerCase()) ||
          q.tasks.some((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchModule && matchMarks && matchSearch;
      });
    }
  }, [activeSubject, selectedUnit, selectedTier, selectedBctPriority, selectedMisModule, selectedMisMarks, searchQuery]);

  // Reset progress handler
  const handleResetProgress = () => {
    const subjectName =
      activeSubject === 'deep-learning'
        ? 'Deep Learning'
        : activeSubject === 'bda'
        ? 'Big Data Analytics'
        : activeSubject === 'bct'
        ? 'Blockchain Technology'
        : 'Management Information Systems';
    if (window.confirm(`Are you sure you want to reset all ${subjectName} study progress?`)) {
      if (activeSubject === 'deep-learning') {
        setProgressDL({});
      } else if (activeSubject === 'bda') {
        setProgressBDA({});
      } else if (activeSubject === 'bct') {
        setProgressBCT({});
      } else {
        setProgressMIS({});
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

  // Helper to render module headers for MIS
  const getMisModuleName = (modNum: number) => {
    switch (modNum) {
      case 1:
        return 'MODULE 01 — Introduction to Information Systems (CBIS Components, IT Impacts, Types of IS, Data Governance)';
      case 2:
        return 'MODULE 02 — Data and Knowledge Management / Business Intelligence (Big Data, Data Mart/Warehouse, KM Lifecycle, SECI Model, BI)';
      case 3:
        return 'MODULE 03 — Ethical Issues, Privacy and Information Security (Cybersecurity, Transborder Data Flows, CIA Triad, Security Controls)';
      default:
        return `MODULE 0${modNum}`;
    }
  };

  // Helper to render study notes inside MIS cards
  const renderMisStudyTips = (qId: string) => {
    switch (qId) {
      case 'm4':
      case 'm5':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-slate-700 text-xs">
            <p className="font-extrabold text-teal-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              📊 EXAM GUIDE: 6 COMPONENTS OF CBIS
            </p>
            <p>
              A Computer-Based Information System (CBIS) uses computer technology to perform intended tasks.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>1. Hardware</strong>: Physical computer equipment (servers, processors, storage devices, input/output).</li>
              <li><strong>2. Software</strong>: System software (OS) and Application software (custom apps, ERP, CRM).</li>
              <li><strong>3. Data / Database</strong>: Raw facts organized in tables, relations, and data warehouses for querying.</li>
              <li><strong>4. Network / Telecommunications</strong>: Connecting systems across LAN, WAN, internet, intranets, cloud.</li>
              <li><strong>5. Procedures</strong>: Rules, policies, and guidelines for operating the system and processing data.</li>
              <li><strong>6. People</strong>: Users, managers, systems analysts, database administrators, and IT personnel.</li>
            </ul>
          </div>
        );
      case 'm6':
      case 'm9':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 text-xs">
            <p className="font-extrabold text-blue-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🏢 EXAM GUIDE: TYPES OF INFORMATION SYSTEMS HIERARCHY
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>TPS (Transaction Processing Systems)</strong>: Operational level. Records daily routine transactions (e.g. POS billing, payroll, ATM withdrawals).</li>
              <li><strong>MIS (Management Information Systems)</strong>: Middle management. Generates structured periodic reports from TPS data for monitoring &amp; control (e.g. monthly sales summary).</li>
              <li><strong>DSS (Decision Support Systems)</strong>: Middle/Senior management. Interactive models for semi-structured/unstructured decision-making (What-If analysis, goal seeking).</li>
              <li><strong>EIS / ESS (Executive Information Systems)</strong>: Strategic top-level. Provides summarized drill-down dashboards, KPI tracking, internal &amp; external environment data.</li>
              <li><strong>Enterprise Systems</strong>: Cross-functional systems integrating business processes: ERP, CRM, SCM, and Knowledge Management.</li>
            </ul>
          </div>
        );
      case 'm13':
      case 'm17':
      case 'm20':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-slate-700 text-xs">
            <p className="font-extrabold text-amber-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              💾 EXAM GUIDE: DATA WAREHOUSE VS DATA MART
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Data Warehouse (DW)</strong>: Subject-oriented, integrated, time-variant, non-volatile central collection of organizational data from multiple operational sources. Supports enterprise-wide BI analytics.</li>
              <li><strong>Data Mart</strong>: A departmental subset or focused mini-warehouse designed for a specific business unit (e.g., Marketing Data Mart, Financial Data Mart). Faster deployment, lower cost.</li>
              <li><strong>Generation of Big Data Examples</strong>: 1. IoT sensor logs from smart grids / connected vehicles. 2. Real-time clickstream data from millions of e-commerce user visits.</li>
            </ul>
          </div>
        );
      case 'm14':
      case 'm15':
      case 'm19':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-slate-700 text-xs">
            <p className="font-extrabold text-purple-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🧠 EXAM GUIDE: KNOWLEDGE MANAGEMENT &amp; NONAKA'S SECI MODEL
            </p>
            <p>
              Knowledge types: <strong>Tacit Knowledge</strong> (intuitive, experiential, difficult to formalize) vs <strong>Explicit Knowledge</strong> (codified, documented in manuals and databases).
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>1. Socialization (Tacit -&gt; Tacit)</strong>: Sharing experiences, mentoring, apprenticeships, observation.</li>
              <li><strong>2. Externalization (Tacit -&gt; Explicit)</strong>: Articulating tacit knowledge into concepts, models, diagrams, manuals.</li>
              <li><strong>3. Combination (Explicit -&gt; Explicit)</strong>: Systemizing, merging, sorting, and aggregating different explicit knowledge sources.</li>
              <li><strong>4. Internalization (Explicit -&gt; Tacit)</strong>: Absorbing explicit knowledge by learning by doing, creating new mental models.</li>
              <li><strong>KM Lifecycle</strong>: Create/Discover -&gt; Capture/Document -&gt; Refine/Organize -&gt; Store/Repository -&gt; Share/Disseminate -&gt; Apply.</li>
            </ul>
          </div>
        );
      case 'm31':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-slate-700 text-xs">
            <p className="font-extrabold text-rose-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🛡️ EXAM GUIDE: TYPES OF INFORMATION SYSTEM CONTROLS
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>General Controls</strong>: Govern design, security, and usage of computer programs throughout the entire enterprise:
                <br/>- Software controls (OS security), Hardware physical controls, Computer operations controls, Data security controls, Implementation controls, Administrative controls (policies, segregation of duties).
              </li>
              <li><strong>Application Controls</strong>: Specific controls built into individual software applications:
                <br/>- <em>Input Controls</em>: Validation, data format checks, authorization verification.
                <br/>- <em>Processing Controls</em>: Check sums, sequence checks, consistency rules.
                <br/>- <em>Output Controls</em>: Reconciliation reports, output access control, audit logs.
              </li>
            </ul>
          </div>
        );
      case 'm32':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs">
            <p className="font-extrabold text-emerald-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🔒 EXAM GUIDE: CIA TRIAD IN INFORMATION SECURITY
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Confidentiality</strong>: Preserving authorized restrictions on access and disclosure, including means for protecting personal privacy and proprietary information (encryption, access control lists, MFA).</li>
              <li><strong>Integrity</strong>: Guarding against improper information modification or destruction, ensuring information non-repudiation and authenticity (digital signatures, hash checks, transaction logging).</li>
              <li><strong>Availability</strong>: Ensuring timely and reliable access to and use of information and services (redundancy, failover clusters, DDoS mitigation, regular backups).</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper to render study notes inside BCT cards
  const renderBctStudyTips = (qId: string) => {
    switch (qId) {
      case 'c1':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-slate-700 text-xs">
            <p className="font-extrabold text-purple-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              ⛓️ EXAM GUIDE: HYPERLEDGER FABRIC ARCHITECTURE &amp; TRANSACTION FLOW
            </p>
            <p>
              Hyperledger Fabric is a modular, permissioned enterprise blockchain with identity management (MSP) and private channels.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Core Components</strong>: Peer Nodes (Endorsing Peers simulate &amp; sign; Committing Peers validate &amp; write to ledger), Orderer Nodes (package transactions into blocks), Certificate Authority (Fabric-CA for PKI identity), World State (CouchDB/LevelDB) + Blockchain log.</li>
              <li><strong>Execute-Order-Validate Transaction Flow</strong>:
                <br/>1. <em>Proposal</em>: Client SDK creates transaction proposal and sends to Endorsing Peers.
                <br/>2. <em>Endorsement</em>: Endorsing peers simulate chaincode execution, generate read/write sets, sign endorsement, and return to Client.
                <br/>3. <em>Ordering</em>: Client packages endorsed transactions into a broadcast message and sends to Orderer.
                <br/>4. <em>Delivery</em>: Orderer establishes deterministic block order and delivers blocks to Committing Peers.
                <br/>5. <em>Validation &amp; Commit</em>: Committing peers verify endorsements match policy, check for read-write conflicts (MVCC), and commit to the local Ledger.
              </li>
            </ul>
          </div>
        );
      case 'c2':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-700 text-xs">
            <p className="font-extrabold text-indigo-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🌐 EXAM GUIDE: ETHEREUM ARCHITECTURE &amp; WORKFLOW
            </p>
            <p>
              Ethereum is a stateful, Turing-complete decentralized world computer.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Key Architecture Components</strong>:
                <br/>- <em>Accounts</em>: Externally Owned Accounts (EOA, controlled by private keys) vs Contract Accounts (controlled by code).
                <br/>- <em>State Model</em>: World State represented as a modified Merkle Patricia Trie (mapping addresses to account states: nonce, balance, storageRoot, codeHash).
                <br/>- <em>EVM</em>: Stack-based execution environment (256-bit words) for executing bytecodes.
                <br/>- <em>Gas System</em>: `GasLimit * GasPrice` prevents infinite loops and pays miners/validators.
              </li>
              <li><strong>Execution Workflow</strong>: EOA signs transaction with gas parameters -&gt; Broadcast to mempool -&gt; Validator includes in block -&gt; EVM deducts upfront gas, executes opcodes, modifies state trie, and refunds unused gas.</li>
            </ul>
          </div>
        );
      case 'c3':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-slate-700 text-xs">
            <p className="font-extrabold text-amber-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              ⚡ EXAM GUIDE: RAFT CONSENSUS ALGORITHM
            </p>
            <p>
              RAFT is a crash fault tolerant (CFT) leader-based consensus algorithm designed for understandability.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Node Roles</strong>: Leader (handles all client requests and replication), Follower (passive, responds to RPCs), Candidate (requests votes during election).</li>
              <li><strong>Stage 1: Leader Election</strong>: If followers don't hear heartbeats within a randomized election timeout (150-300ms), they become Candidates, increment term, vote for themselves, and send `RequestVote` RPC. Candidate with majority (&gt; N/2) votes becomes Leader.</li>
              <li><strong>Stage 2: Log Replication</strong>: Leader accepts client write -&gt; appends entry to local log -&gt; sends `AppendEntries` RPC to followers -&gt; once entry replicated on majority of nodes, Leader commits entry and applies to state machine -&gt; responds to client.</li>
              <li><strong>Fault Tolerance</strong>: Handles up to F crashed nodes out of 2F + 1 total nodes. (Does not handle Byzantine/malicious actors).</li>
            </ul>
          </div>
        );
      case 'c5':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 text-xs">
            <p className="font-extrabold text-blue-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🔄 EXAM GUIDE: CONSENSUS MECHANISMS COMPARISON (PoW, PoS, PoB, PoET)
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>PoW (Proof of Work)</strong>: Miners compete to find a cryptographic nonce satisfying hash target H(block) &lt; Target. Pros: Battle-tested security, permissionless. Cons: High energy consumption, hardware centralization. (e.g. Bitcoin).</li>
              <li><strong>PoS (Proof of Stake)</strong>: Validators lock cryptocurrency as collateral (stake). Selection probability is proportional to stake size. Pros: 99.9% energy reduction, faster finality, slashing penalties. (e.g. Ethereum 2.0).</li>
              <li><strong>PoB (Proof of Burn)</strong>: Miners send coins to an unspendable address (burn address), earning virtual mining rigs that grant block reward probability over time.</li>
              <li><strong>PoET (Proof of Elapsed Time)</strong>: Uses Intel SGX Trusted Execution Environment. Nodes request a random wait timer from secure enclave; node whose timer expires first wakes up and mints the next block. Ideal for permissioned consortiums (Hyperledger Sawtooth).</li>
            </ul>
          </div>
        );
      case 'c6':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-slate-700 text-xs">
            <p className="font-extrabold text-rose-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              🌳 EXAM GUIDE: MERKLE TREE &amp; VERIFICATION
            </p>
            <p>
              A Merkle tree is a complete binary hash tree where every leaf node is the cryptographic hash of a transaction block, and every non-leaf node is the hash of its children:
              <br/>
              <span className="font-mono font-bold block my-1">H_AB = Hash(H_A + H_B)</span>
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Merkle Root</strong>: Stored in the block header. Summarizes all transactions in the block in a fixed 32-byte hash.</li>
              <li><strong>SPV &amp; Merkle Proofs</strong>: A lightweight client can verify whether transaction T_A is included in a block in O(log N) time by requesting only the sibling hashes along the path to the root (Merkle audit path).</li>
            </ul>
          </div>
        );
      case 'c8':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs">
            <p className="font-extrabold text-emerald-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              💰 EXAM GUIDE: BITCOIN UTXO MODEL
            </p>
            <p>
              Bitcoin does not store account balances. It tracks state via a global set of Unspent Transaction Outputs (UTXO).
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Transaction Anatomy</strong>: Inputs reference and unlock existing unspent outputs via `scriptSig`. Outputs define new unspent coins locked by public key scripts (`scriptPubKey`).</li>
              <li><strong>Fundamental Invariant</strong>: Sum(Inputs) = Sum(Outputs) + Miner Fee.</li>
              <li><strong>Advantages</strong>: Complete stateless parallel verification, enhanced privacy (change addresses), prevention of race conditions/re-entrancy vs Account-based state models.</li>
            </ul>
          </div>
        );
      case 'c12':
      case 'c13':
      case 'c14':
        return (
          <div className="mt-3.5 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-slate-700 text-xs">
            <p className="font-extrabold text-teal-800 flex items-center gap-1 mb-1 font-mono text-[10px]">
              💻 EXAM GUIDE: SOLIDITY PROGRAMMING ESSENTIALS
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-semibold text-slate-800">
              <li><strong>Arrays</strong>: Fixed size (`uint[5] a;`) vs Dynamic (`uint[] a;`). Memory arrays (`uint[] memory m = new uint[](length);`) cannot be resized (no `.push()`). Storage arrays support `.push()`, `.pop()`, and `.length`.</li>
              <li><strong>Function Visibility</strong>: `public` (any caller), `private` (only this contract), `internal` (this contract + derived), `external` (only external callers / transactions, gas efficient for large arrays).</li>
              <li><strong>State Mutability</strong>: `pure` (no state reads or writes), `view` (reads state variables, no modifications), non-view/payable (can modify state; `payable` allows accepting Ether `msg.value`).</li>
            </ul>
          </div>
        );
      default:
        return null;
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
            : activeSubject === 'bda'
            ? 'border-amber-200 bg-white hover:border-amber-300 hover:shadow-xs'
            : activeSubject === 'bct'
            ? 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-xs'
            : 'border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-xs'
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
                    : activeSubject === 'bda'
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : activeSubject === 'bct'
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-emerald-600 border-emerald-600 text-white'
                  : activeSubject === 'deep-learning'
                  ? 'border-rose-400 hover:border-rose-500 hover:bg-rose-50'
                  : activeSubject === 'bda'
                  ? 'border-amber-400 hover:border-amber-500 hover:bg-amber-50'
                  : activeSubject === 'bct'
                  ? 'border-purple-400 hover:border-purple-500 hover:bg-purple-50'
                  : 'border-emerald-400 hover:border-emerald-500 hover:bg-emerald-50'
              }`}
            >
              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                  {activeSubject === 'mis' ? `Q${q.num}` : `Topic ${q.num}`}
                </span>

                {/* Priority / Marks Badges */}
                {activeSubject === 'deep-learning' && (
                  <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                    <Star className="w-3 h-3 fill-rose-600 text-rose-600 shrink-0" />
                    <span>EXAM MUST-DO</span>
                  </span>
                )}

                {activeSubject === 'bda' && (
                  <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono ${
                    q.tier === 1 
                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    <span>{q.tier === 1 ? '🥇 TIER 1 MUST-DO' : '🥈 TIER 2 CORE'}</span>
                  </span>
                )}

                {activeSubject === 'bct' && q.priorityRating && (
                  <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                    <span>{q.priorityRating}</span>
                  </span>
                )}

                {activeSubject === 'mis' && (
                  <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono ${
                    q.marks === 10 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-teal-100 text-teal-800 border-teal-200'
                  }`}>
                    <span>{q.marks === 10 ? '⭐ 10 MARKS' : '📝 5 MARKS'}</span>
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
              onClick={() => handleStartSprint(q, 10)}
              className={`px-2.5 py-1.5 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer font-sans ${
                activeSubject === 'deep-learning'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : activeSubject === 'bda'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : activeSubject === 'bct'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
              title="Launch 10-minute focus sprint timer"
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
                const currentProgress =
                  activeSubject === 'deep-learning'
                    ? progressDL
                    : activeSubject === 'bda'
                    ? progressBDA
                    : activeSubject === 'bct'
                    ? progressBCT
                    : progressMIS;
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

            {/* Extra study tip guides */}
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
            {activeSubject === 'bct' && renderBctStudyTips(q.id)}
            {activeSubject === 'mis' && renderMisStudyTips(q.id)}
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
              activeSubject === 'deep-learning'
                ? 'text-rose-500'
                : activeSubject === 'bda'
                ? 'text-amber-500'
                : activeSubject === 'bct'
                ? 'text-purple-600'
                : 'text-emerald-600'
            }`}>
              <span className="flex items-center gap-1 font-bold">
                <Star className={`w-3.5 h-3.5 fill-current ${
                  activeSubject === 'deep-learning'
                    ? 'text-rose-500'
                    : activeSubject === 'bda'
                    ? 'text-amber-500'
                    : activeSubject === 'bct'
                    ? 'text-purple-600'
                    : 'text-emerald-600'
                }`} />
                {activeSubject === 'deep-learning'
                  ? 'DL'
                  : activeSubject === 'bda'
                  ? 'BDA'
                  : activeSubject === 'bct'
                  ? 'BCT'
                  : 'MIS'} Prep Progress
              </span>
              <span className={`font-extrabold ${
                activeSubject === 'deep-learning'
                  ? 'text-rose-700'
                  : activeSubject === 'bda'
                  ? 'text-amber-700'
                  : activeSubject === 'bct'
                  ? 'text-purple-700'
                  : 'text-emerald-700'
              }`}>{stats.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#ebeef0] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  activeSubject === 'deep-learning'
                    ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                    : activeSubject === 'bda'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                    : activeSubject === 'bct'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600'
                    : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                }`}
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
              <span>{stats.completedTasks}/{stats.totalTasks} sub-steps done</span>
              <span>
                {activeSubject === 'deep-learning'
                  ? '14 DL topics'
                  : activeSubject === 'bda'
                  ? '15 BDA topics'
                  : activeSubject === 'bct'
                  ? '20 BCT topics'
                  : '33 MIS questions'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* NeuroDeck Controller (Audio Entrainment & Breathing Reset) */}
      <NeuroDeck
        onOpenWoop={onOpenWoopModal || (() => {})}
        activeWoopCount={woopGoals.length}
      />

      {/* WOOP Urgency Anchor Banner — Integrated Light Card */}
      {woopGoals.length > 0 && (() => {
        const activeGoal = woopGoals[0];
        const parsed = parseWoopPlan(activeGoal.plan, activeGoal.obstacle);
        return (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs border border-emerald-100">
                  <Target className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-[#181c1e]">
                  Active WOOP anchor
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                  {activeGoal.targetSubject || 'General focus'}
                </span>
              </div>
              {onOpenWoopModal && (
                <button
                  onClick={onOpenWoopModal}
                  className="text-xs font-medium text-[#43664c] hover:text-[#34513c] hover:underline flex items-center gap-1 transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Manage anchors
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">Wish</p>
                <h4 className="text-sm font-bold text-[#181c1e] leading-snug">{activeGoal.wish}</h4>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                  <span className="text-xs text-slate-500 font-medium">Obstacle</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{activeGoal.obstacle}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs">
                <p className="font-medium text-emerald-800 mb-0.5">{parsed.condition}</p>
                {parsed.action && (
                  <p className="font-medium text-slate-900 leading-relaxed">{parsed.action}</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Subject Tabs */}
      <div className="flex flex-wrap border-b border-[#c2c8c0] mb-6 gap-1 sm:gap-2">
        <button
          onClick={() => {
            setActiveSubject('deep-learning');
            setSelectedUnit('all');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'deep-learning'
              ? 'border-rose-500 text-rose-700 bg-rose-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className="w-4 h-4 text-rose-600" />
          <span>Deep Learning (IA-1)</span>
        </button>

        <button
          onClick={() => {
            setActiveSubject('bda');
            setSelectedTier('all');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'bda'
              ? 'border-amber-500 text-amber-700 bg-amber-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-sm leading-none">🔥</span>
          <span>bda 🔥 (Top 15)</span>
        </button>

        <button
          onClick={() => {
            setActiveSubject('bct');
            setSelectedBctPriority('all');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'bct'
              ? 'border-purple-500 text-purple-700 bg-purple-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-sm leading-none">⛓️</span>
          <span>BCT ⛓️ (Top 20)</span>
        </button>

        <button
          onClick={() => {
            setActiveSubject('mis');
            setSelectedMisModule('all');
            setSelectedMisMarks('all');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubject === 'mis'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-700" />
          <span>MIS 📊 (33 Questions)</span>
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
              placeholder={`Search ${
                activeSubject === 'deep-learning'
                  ? 'DL'
                  : activeSubject === 'bda'
                  ? 'BDA'
                  : activeSubject === 'bct'
                  ? 'BCT'
                  : 'MIS'
              } topics...`}
              className={`w-full pl-9 pr-3 py-2 text-sm bg-[#f1f4f6] rounded-xl border border-transparent focus:bg-white focus:outline-none transition-all placeholder-slate-400 ${
                activeSubject === 'deep-learning'
                  ? 'focus:border-rose-500'
                  : activeSubject === 'bda'
                  ? 'focus:border-amber-500'
                  : activeSubject === 'bct'
                  ? 'focus:border-purple-500'
                  : 'focus:border-emerald-600'
              }`}
            />
          </div>

          {/* Dynamic Filters */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
            {activeSubject === 'deep-learning' && (
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
            )}

            {activeSubject === 'bda' && (
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

            {activeSubject === 'bct' && (
              ([
                { id: 'all', label: 'All Priorities' },
                { id: 1, label: '🔥🔥🔥🔥🔥 5 Flames' },
                { id: 2, label: '🔥🔥🔥🔥 4 Flames' },
                { id: 3, label: '🔥🔥🔥 2-3 Flames' },
              ] as const).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedBctPriority(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedBctPriority === p.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-[#f1f4f6] text-slate-600 hover:bg-[#e5e9eb]'
                  }`}
                >
                  {p.label}
                </button>
              ))
            )}

            {activeSubject === 'mis' && (
              <>
                <div className="flex gap-1">
                  {([
                    { id: 'all', label: 'All Modules' },
                    { id: 1, label: 'Mod 1' },
                    { id: 2, label: 'Mod 2' },
                    { id: 3, label: 'Mod 3' },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMisModule(m.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedMisModule === m.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#f1f4f6] text-slate-600 hover:bg-[#e5e9eb]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1 ml-2 border-l border-slate-200 pl-2">
                  {([
                    { id: 'all', label: 'All Marks' },
                    { id: 10, label: '10M ⭐' },
                    { id: 5, label: '5M' },
                  ] as const).map((mk) => (
                    <button
                      key={mk.id}
                      onClick={() => setSelectedMisMarks(mk.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedMisMarks === mk.id
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-[#f1f4f6] text-slate-600 hover:bg-[#e5e9eb]'
                      }`}
                    >
                      {mk.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 select-none font-mono">
            <Zap className={`w-3.5 h-3.5 shrink-0 ${
              activeSubject === 'deep-learning'
                ? 'text-rose-500 fill-rose-500'
                : activeSubject === 'bda'
                ? 'text-amber-500 fill-amber-500'
                : activeSubject === 'bct'
                ? 'text-purple-500 fill-purple-500'
                : 'text-emerald-500 fill-emerald-500'
            }`} />
            <span>
              {activeSubject === 'deep-learning'
                ? 'Focused on 14 high-yield Deep Learning topics'
                : activeSubject === 'bda'
                ? 'Focused on 15 core Big Data Analytics topics'
                : activeSubject === 'bct'
                ? 'Focused on 20 top expected Blockchain Technology topics'
                : 'Focused on 33 module-wise Management Information Systems questions'}
            </span>
          </p>

          <button
            onClick={handleResetProgress}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-colors border cursor-pointer ${
              activeSubject === 'deep-learning'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                : activeSubject === 'bda'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                : activeSubject === 'bct'
                ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Subject Progress</span>
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-8">
        {activeSubject === 'deep-learning' && (
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
        )}

        {activeSubject === 'bda' && (
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

        {activeSubject === 'bct' && (
          ([1, 2, 3] as const).map((tierNum) => {
            const priorityQuestions = filteredQuestions.filter((q) => q.tier === tierNum);
            if (priorityQuestions.length === 0) return null;

            return (
              <div key={tierNum} className="space-y-4">
                <h2 className={`text-base sm:text-md font-extrabold tracking-wide border-l-4 pl-3 py-0.5 ${
                  tierNum === 1 
                    ? 'text-purple-700 border-purple-700' 
                    : tierNum === 2 
                    ? 'text-indigo-700 border-indigo-700' 
                    : 'text-slate-700 border-slate-700'
                }`}>
                  {tierNum === 1 
                    ? 'Priority: 🔥🔥🔥🔥🔥 (Rank 1–6: Top Critical Core Questions)' 
                    : tierNum === 2 
                    ? 'Priority: 🔥🔥🔥🔥 (Rank 7–13: High Priority Mechanisms & Models)' 
                    : 'Priority: 🔥🔥🔥 / 🔥🔥 (Rank 14–20: Solidity Programs, Wallets & Platforms)'}
                </h2>

                <div className="space-y-3">
                  {priorityQuestions.map((q) => renderQuestionCard(q))}
                </div>
              </div>
            );
          })
        )}

        {activeSubject === 'mis' && (
          ([1, 2, 3] as const).map((modNum) => {
            const modQuestions = filteredQuestions.filter((q) => q.unit === modNum);
            if (modQuestions.length === 0) return null;

            return (
              <div key={modNum} className="space-y-4">
                <h2 className="text-base sm:text-md font-extrabold text-emerald-800 tracking-wide border-l-4 border-emerald-600 pl-3 py-0.5">
                  {getMisModuleName(modNum)}
                </h2>

                <div className="space-y-3">
                  {modQuestions.map((q) => renderQuestionCard(q))}
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
              {activeSubject === 'deep-learning'
                ? 'DL Study Hack'
                : activeSubject === 'bda'
                ? 'BDA Study Hack'
                : activeSubject === 'bct'
                ? 'BCT Study Hack'
                : 'MIS Study Hack'}
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              {activeSubject === 'deep-learning'
                ? 'Draw the neural architectures on paper! Drawing diagrams for MLPs and Autoencoder bottlenecks is key.'
                : activeSubject === 'bda'
                ? 'Formulate HDFS, MapReduce workflows, and Bloom Filter math step-by-step. Practical coding workflow layouts are standard exam questions.'
                : activeSubject === 'bct'
                ? 'Master transaction flows (Hyperledger proposal-order-commit, Ethereum state transition) and write clean Solidity syntax.'
                : 'Structure your answers using standard frameworks: draw CBIS 6 components, SECI 4 modes matrix, Data Warehouse layers, and the CIA Triad.'}
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
          ) : activeSubject === 'bda' ? (
            <>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold font-mono">10 MUST-DOs</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold font-mono">5 Core Alg</span>
            </>
          ) : activeSubject === 'bct' ? (
            <>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold font-mono">6 🔥x5 Core</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold font-mono">7 🔥x4 High</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold font-mono">7 Solidity/App</span>
            </>
          ) : (
            <>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold font-mono">10 Mod 1</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold font-mono">13 Mod 2</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold font-mono">10 Mod 3</span>
            </>
          )}
        </div>
      </footer>

      {/* ================= SDAP WAKING MICRO-REST FULL-SCREEN OVERLAY ================= */}
      {isMicroRestActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-4 font-mono">
              <Wind className="w-3.5 h-3.5 text-cyan-600" />
              NIH PROTOCOL &bull; ACCELERATED REPLAY
            </div>

            <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-200 bg-cyan-50/60 animate-ping opacity-40" />
              <div className="w-28 h-28 rounded-full bg-cyan-600 text-white flex flex-col items-center justify-center shadow-lg shadow-cyan-200">
                <span className="text-4xl font-black font-mono tracking-tight">
                  {microRestSeconds}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90 font-mono">
                  Sec
                </span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-[#181c1e] mb-1">
              Do Absolutely Nothing
            </h3>
            <p className="text-xs text-[#545f72] max-w-xs leading-relaxed mb-6">
              Close your eyes. Let your mind drift. No tabs, no phone. Your hippocampus is replaying new synaptic connections at <span className="font-bold text-cyan-800">20x speed</span>.
            </p>

            <button
              onClick={() => {
                setIsMicroRestActive(false);
                setMicroRestsCompleted((c) => c + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Resume Sprint
            </button>
          </div>
        </div>
      )}

      {/* ================= POST-BOUT ACTIVE RECALL SANDBOX MODAL ================= */}
      {isRecallModalOpen && sprintQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#181c1e] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm">
                  <Brain className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                    Active Recall Sandbox &bull; Roediger Protocol
                  </span>
                  <h3 className="text-sm font-bold truncate max-w-[280px] sm:max-w-sm">
                    Topic {sprintQuestion.num}: {sprintQuestion.text.split(/[?.:+\[]/)[0]}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsRecallModalOpen(false);
                  setSprintQuestion(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-7">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-700 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {Math.round(sprintTotalDuration / 60)}m Focus Bout
                </span>
                {phoneDistanced && (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Attentional Shield 🛡️
                  </span>
                )}
                {microRestsCompleted > 0 && (
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-50 border border-cyan-200 text-[11px] font-bold text-cyan-800 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-600" />
                    {microRestsCompleted} Neural Replays (20x)
                  </span>
                )}
              </div>

              <p className="text-xs text-[#545f72] mb-2 leading-relaxed">
                <strong className="text-[#181c1e] font-bold">Retrieval Practice:</strong> Without checking notes, write down core formulas, definitions, diagrams, and bullet points from memory:
              </p>

              <textarea
                value={recallDraft}
                onChange={(e) => setRecallDraft(e.target.value)}
                placeholder="e.g. 1. Architecture details / flow&#10;2. Key formulas and variables&#10;3. Why this solution works..."
                className="w-full h-36 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white resize-none mb-4 leading-relaxed"
                autoFocus
              />

              {recallSavedSuccess ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Memory Consolidated &bull; Logged in Firestore 🚀
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setIsRecallModalOpen(false);
                      setSprintQuestion(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold transition cursor-pointer"
                  >
                    Skip for Now
                  </button>
                  <button
                    disabled={!recallDraft.trim() || isRecallSaving}
                    onClick={handleSaveRecall}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs disabled:opacity-40 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isRecallSaving ? 'Consolidating...' : 'Lock In Recall to Memory'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN FOCUS SPRINT MODAL ================= */}
      {sprintQuestion && !isRecallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#181c1e] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-sm">
                  ⚡
                </span>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-bold block">
                    SDAP Focus Sprint &bull; Topic {sprintQuestion.num}
                  </span>
                  <h3 className="text-sm font-bold truncate max-w-[280px] sm:max-w-sm">
                    {sprintQuestion.text}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSprintRunning(false);
                  setSprintQuestion(null);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pre-Sprint Phone Distance "Shields Up" Pledge */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={phoneDistanced}
                  onChange={(e) => setPhoneDistanced(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <PhoneOff className="w-3.5 h-3.5 text-emerald-600" />
                  Phone out of sight / in other room
                </span>
              </label>
              {phoneDistanced ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                  Shield Active 🛡️
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Attentional Leak Warning ⚠️
                </span>
              )}
            </div>

            {/* Timer Display */}
            <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">
              <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-slate-900 mb-4">
                {String(Math.floor(sprintSecondsLeft / 60)).padStart(2, '0')}:
                {String(sprintSecondsLeft % 60).padStart(2, '0')}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-xs mb-6">
                <div
                  className="h-full bg-rose-600 transition-all duration-300 rounded-full"
                  style={{
                    width: `${
                      sprintTotalDuration > 0
                        ? Math.max(0, Math.min(100, ((sprintTotalDuration - sprintSecondsLeft) / sprintTotalDuration) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>

              {/* Timer Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => setIsSprintRunning(!isSprintRunning)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer text-sm"
                >
                  {isSprintRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isSprintRunning ? 'Pause' : sprintSecondsLeft === 0 ? 'Restart' : 'Focus'}</span>
                </button>

                <button
                  onClick={() => {
                    setSprintSecondsLeft((prev) => prev + 300);
                    setSprintTotalDuration((prev) => prev + 300);
                  }}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
                >
                  +5 Min
                </button>

                {/* Manual Waking Micro-Rest Trigger */}
                <button
                  onClick={triggerManualMicroRest}
                  className="px-3.5 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl font-bold transition-all cursor-pointer text-xs flex items-center gap-1.5"
                  title="NIH 15-second accelerated neural replay pause"
                >
                  <Wind className="w-3.5 h-3.5 text-cyan-600" />
                  Waking Rest
                </button>

                {/* Finish & Recall Trigger */}
                <button
                  onClick={() => {
                    setIsSprintRunning(false);
                    setIsRecallModalOpen(true);
                  }}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Brain className="w-3.5 h-3.5" />
                  Recall
                </button>

                <button
                  onClick={() => {
                    setIsSprintRunning(false);
                    setSprintSecondsLeft(sprintTotalDuration);
                  }}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checklist inside sprint */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Sprint Mastery Checklist
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {sprintQuestion.tasks.map((task) => {
                  const key = `${sprintQuestion.id}_${task.id}`;
                  const currentProgress =
                    activeSubject === 'deep-learning'
                      ? progressDL
                      : activeSubject === 'bda'
                      ? progressBDA
                      : activeSubject === 'bct'
                      ? progressBCT
                      : progressMIS;
                  const isChecked = !!currentProgress[key];

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleSubTask(sprintQuestion.id, task.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer text-xs ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="shrink-0">{task.icon}</span>
                      <span className={isChecked ? 'line-through text-slate-400 font-semibold' : 'font-semibold'}>
                        {task.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
