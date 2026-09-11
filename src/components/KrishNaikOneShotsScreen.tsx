import React, { useState, useMemo, useEffect } from "react";
import krishVideosRaw from "../data/krishNaikVideos.json";
import { StudyTheaterVideo, ILecturePhotoNote } from "../types";
import { subscribeAllPhotoNotes } from "../lib/firestoreService";
import { StationaryNotebookViewer } from "./StationaryNotebookViewer";
import { MasteryCelebrationModal } from "./MasteryCelebrationModal";
import {
  Search,
  X,
  Play,
  Eye,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Circle,
  Film,
  Check,
  Sparkles,
  Upload,
  BookOpen,
  FileImage,
  ImageIcon,
  Maximize2,
  ZoomIn,
  Download,
  Layers,
  Award,
  HelpCircle,
  RotateCcw,
  XCircle,
  Lock,
  Smartphone,
  CreditCard,
  Code2,
  CheckCheck,
  Copy
} from "lucide-react";

export interface KrishNaikVideoRaw {
  Title: string;
  Description?: string;
  "Thumbnail url"?: string;
  "Channel name"?: string;
  ChannelName?: string;
  Views?: number | string;
  Likes?: number | string;
  Comments?: number | string;
  "Duration in seconds"?: number;
  "Duration in minutes"?: number;
  "Duration in timestamp"?: string;
  Duration?: string;
  "Uploaded Time"?: string;
  UploadedTime?: string;
  "Video url"?: string;
  Tags?: string;
}

export interface StepTrack {
  stepNumber: number;
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
  badge: string;
  description: string;
  keySkills: string[];
  videoTitles: string[];
}

export const STEP_BY_STEP_TRACKS: StepTrack[] = [
  {
    stepNumber: 1,
    id: "step-1-python-oops",
    title: "1. Python OOPs Mastery",
    shortTitle: "1. Python OOPs",
    subtitle: "Object-Oriented Programming & Hands-On Projects",
    icon: "🐍",
    badge: "Foundation",
    description: "Classes, Objects, Constructors (__init__), Inheritance, Encapsulation, Polymorphism, Magic Dunder Methods, and Real-World Software Engineering Projects.",
    keySkills: ["Classes & Constructors (__init__)", "Inheritance & Abstract Classes", "Encapsulation & Property Decorators", "End-to-End Python Projects"],
    videoTitles: [
      "Object Oriented Programming with Python - Full Course for Beginners",
      "9 HOURS of Python Projects - From Beginner to Advanced",
      "Python Crash Course in Hindi | 5 Python Projects | Complete Python Tutorial"
    ]
  },
  {
    stepNumber: 2,
    id: "step-2-stats-math",
    title: "2. Statistics & Mathematical Foundations",
    shortTitle: "2. Statistics",
    subtitle: "Descriptive, Inferential, Hypothesis Testing & Linear Algebra",
    icon: "📊",
    badge: "Math Core",
    description: "Probability distributions, Normal & Gaussian curves, Central Limit Theorem, Z/T Tests, ANOVA, Covariance/Correlation, and Linear Algebra for AI (Matrices, Eigenvectors, PCA).",
    keySkills: ["Descriptive & Inferential Statistics", "Hypothesis Testing & P-Values", "Gaussian/Normal Distribution & Outliers", "Linear Algebra, Matrices & PCA"],
    videoTitles: [
      "Complete Statistics For Data Science In 6 hours By Krish Naik",
      "Linear Algebra Tutorial by PhD in AIㅣ2-hour Full Course",
      "Complete Exploratory Data Analysis And Feature Engineering In 3 Hours| Krish Naik"
    ]
  },
  {
    stepNumber: 3,
    id: "step-3-ml-sagemaker",
    title: "3. ML & End-to-End Projects with AWS SageMaker",
    shortTitle: "3. ML & SageMaker",
    subtitle: "Algorithms, Math Derivations & Cloud SageMaker Deployment",
    icon: "📈",
    badge: "Core ML",
    description: "Linear/Logistic Regression, Ridge/Lasso, Decision Trees, Random Forest, AdaBoost, XGBoost, Clustering (K-Means, DBSCAN), and full AWS SageMaker Cloud ML Pipelines.",
    keySkills: ["Regression & Classification Math Intuition", "Ensemble Boosting & Bagging (XGBoost)", "Unsupervised Clustering & Feature Prep", "AWS SageMaker Training & Deployment"],
    videoTitles: [
      "Complete Machine Learning In 6 Hours| Krish Naik",
      "End To End Machine Learning Project Implementation Using AWS Sagemaker",
      "Complete Dockers For Data Science Tutorial In One Shot"
    ]
  },
  {
    stepNumber: 4,
    id: "step-4-dl-projects",
    title: "4. Deep Learning & Production Projects",
    shortTitle: "4. DL Projects",
    subtitle: "Neural Networks, PyTorch/TF, MLflow, DVC & Cloud CI/CD",
    icon: "🧠",
    badge: "Deep Tech",
    description: "Artificial Neural Networks (ANN), Backpropagation Calculus, CNNs for Vision, Loss Functions, Optimizers, and Production Projects (Kidney Disease, Chicken Disease) with MLflow, DVC, Docker & CI/CD.",
    keySkills: ["Perceptrons & Backpropagation Chain Rule", "CNNs & Vision Architecture", "MLflow Tracking & DVC Data Pipelines", "Production CI/CD on AWS & Azure"],
    videoTitles: [
      "Deep Learning Indepth Tutorials In 5 Hours With Krish Naik",
      "Complete End to End Deep Learning Project With MLFLOW,DVC And Deployment",
      "End To End Deep Learning Project Using MLOPS DVC Pipeline With Deployments Azure And AWS- Krish Naik"
    ]
  },
  {
    stepNumber: 5,
    id: "step-5-nlp",
    title: "5. Natural Language Processing (NLP)",
    shortTitle: "5. NLP",
    subtitle: "Tokenization, Embeddings, NLTK & End-to-End Text Summarizer",
    icon: "💬",
    badge: "Text AI",
    description: "Text preprocessing, Stemming, Lemmatization, POS tagging, Named Entity Recognition, Word2Vec, Skipgram, Average Word2Vec, and End-to-End Text Summarization with GitHub Actions CI/CD.",
    keySkills: ["NLTK Preprocessing & Vectorization", "Word2Vec & Dense Embeddings", "Text Classification Pipelines", "End-to-End NLP AWS Deployment"],
    videoTitles: [
      "Complete NLP Machine Learning In One Shot",
      "End To End NLP Project Implementation With Deployment Github Action- Text Summarization- Krish Naik"
    ]
  },
  {
    stepNumber: 6,
    id: "step-6-transformers",
    title: "6. Transformer Architecture",
    shortTitle: "6. Transformers",
    subtitle: "Self-Attention, Multi-Head Attention & Encoder-Decoder Math",
    icon: "⚡",
    badge: "Attention Core",
    description: "Complete breakdown of Attention Is All You Need: Scaled Dot-Product Self-Attention, Multi-Head Attention, Positional Encodings, Layer Normalization, and Encoder-Decoder Multi-Head Attention with handwritten notes.",
    keySkills: ["Scaled Dot-Product Self-Attention (Q, K, V)", "Multi-Head Attention Math", "Positional Encoding Calculations", "LayerNorm & Masked Decoder Heads"],
    videoTitles: [
      "Complete Transformers For NLP Deep Learning One Shot With Handwritten Notes"
    ]
  },
  {
    stepNumber: 7,
    id: "step-7-finetuning-llm",
    title: "7. Fine-Tuning LLM Models",
    shortTitle: "7. Fine-Tuning LLM",
    subtitle: "Quantization, LoRA, QLoRA, LLaMA-2 & Google Gemma",
    icon: "🎯",
    badge: "LLM Mastery",
    description: "Full instruction on Model Quantization (4-bit/8-bit), Parameter-Efficient Fine-Tuning (PEFT), LoRA and QLoRA intuition, fine-tuning LLaMA-2 & Google Gemma on custom private datasets.",
    keySkills: ["Quantization & 1-bit LLMs", "LoRA & QLoRA Low-Rank Adapters", "Custom Dataset Preparation", "LLaMA-2 & Gemma Fine-Tuning"],
    videoTitles: [
      "Fine Tuning LLM Models – Generative AI Course",
      "Detailed Prerequisites To Start Learning Agentic AI With Free Videos And Materials"
    ]
  },
  {
    stepNumber: 8,
    id: "step-8-rag",
    title: "8. Retrieval-Augmented Generation (RAG)",
    shortTitle: "8. RAG",
    subtitle: "ChromaDB, Pinecone, LangChain, Azure OpenAI & Full GenAI",
    icon: "🤖",
    badge: "Enterprise GenAI",
    description: "Enterprise RAG pipelines: Vector Databases (ChromaDB, Pinecone, Weaviate), Document chunking, LangChain orchestration, Azure OpenAI Enterprise Cloud Services, and complete GenAI Mastery.",
    keySkills: ["Vector Embeddings & Semantic Search", "ChromaDB, Pinecone & Weaviate Indexing", "LangChain RetrievalQA Chains", "Azure OpenAI & Multimodal GenAI"],
    videoTitles: [
      "Complete Langchain GEN AI Crash Course With 6 End To End LLM Projects With OPENAI,LLAMA2,Gemini Pro",
      "Complete Tutorial on Vector Database - Learn ChromaDB, Pinecone & Weaviate | Generative AI",
      "Complete Generative AI With Azure Cloud Open AI Services Crash Course",
      "Generative AI Mastery Full Course - Part 1",
      "Generative AI Mastery Full Course - Part 2"
    ]
  }
];

interface FlashcardItem {
  id: number;
  title: string;
  category: string;
  front: string;
  back: string;
  example: string;
  analogy: string;
}

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const OOP_FLASHCARDS: FlashcardItem[] = [
  {
    id: 1,
    title: "Class vs. Object",
    category: "Foundation",
    front: "What is the difference between a Class and an Object (Instance)?",
    back: "A Class is the blueprint/design on paper (defines attributes & methods). An Object is the real physical instance created in memory that holds concrete data.",
    example: "class SbiAccount: ... (Class) vs. kunal_acc = SbiAccount('Kunal', 50000) (Object)",
    analogy: "Blank SBI Account Opening Form vs. Kunal's Real Active Bank Account"
  },
  {
    id: 2,
    title: "__init__ Constructor",
    category: "Foundation",
    front: "What is __init__ in Python and when does it execute?",
    back: "__init__ is the constructor method in Python. It executes automatically the exact moment a new object is instantiated to set up initial state.",
    example: "def __init__(self, name, balance): self.name = name; self.balance = balance",
    analogy: "The Bank Clerk registering your name and initial cash at the counter upon joining."
  },
  {
    id: 3,
    title: "The 'self' Parameter",
    category: "Foundation",
    front: "What does 'self' represent in Python methods?",
    back: "'self' is an explicit reference to THIS specific instance in memory. It tells Python which object's attributes are being read or modified.",
    example: "def deposit(self, amount): self.balance += amount",
    analogy: "Kunal's personal passbook — ensures ₹5,000 is added to Kunal's balance, not Rahul's."
  },
  {
    id: 4,
    title: "Class vs. Instance Attribute",
    category: "Core Concept",
    front: "Class Attribute vs. Instance Attribute: What is the crucial difference?",
    back: "Class Attribute is defined outside methods and SHARED by all instances. Instance Attribute is defined inside __init__ with self. and is UNIQUE to each individual object.",
    example: "bank_name = 'State Bank of India' (Class) vs. self.balance = 50000 (Instance)",
    analogy: "RBI Central Interest Rate (changes for all accounts) vs. Kunal's Private Balance."
  },
  {
    id: 5,
    title: "Encapsulation & Private Variables",
    category: "Pillar 1",
    front: "What is Encapsulation and how do you make private variables in Python?",
    back: "Encapsulation binds data and methods together while restricting direct access. In Python, prefixing variables with double underscores (__) makes them private.",
    example: "self.__pin = 1234; self.__balance = 50000 (Cannot be accessed directly as obj.__pin)",
    analogy: "Your secret ATM PIN and the Bank Vault — you must use the official ATM screen to withdraw."
  },
  {
    id: 6,
    title: "Inheritance & super()",
    category: "Pillar 2",
    front: "What is Inheritance and what does super() do?",
    back: "Inheritance allows a Child Class to derive all attributes and methods from a Parent Class for code reuse. super() calls the parent class constructor/methods directly.",
    example: "class SbiSalaryAccount(SbiAccount): has_credit_card = True",
    analogy: "SBI Salary Account inheriting all standard deposit/withdrawal features from standard SBI Account."
  },
  {
    id: 7,
    title: "Polymorphism (Many Forms)",
    category: "Pillar 3",
    front: "What is Polymorphism in Object-Oriented Programming?",
    back: "Polymorphism allows different classes to implement methods with the EXACT same name, each performing its own unique behavior (Method Overriding / Duck Typing).",
    example: "gpay.pay(100) vs phonepe.pay(100) — both share pay() method signature",
    analogy: "A single BharatPe UPI QR Code scanned by Google Pay vs. PhonePe vs. Paytm."
  },
  {
    id: 8,
    title: "Abstraction",
    category: "Pillar 4",
    front: "What is Abstraction and how is it implemented in Python?",
    back: "Abstraction hides complex internal implementation details and exposes only a clean, essential interface. Implemented via Python's 'abc' module with @abstractmethod.",
    example: "from abc import ABC, abstractmethod; class Notification(ABC): @abstractmethod def send(self): pass",
    analogy: "Pressing a Car's Accelerator pedal or Swiggy 'Pay' button without needing to know engine mechanics."
  }
];

const OOP_QUIZ: QuizItem[] = [
  {
    id: 1,
    question: "In Python, which special method is invoked automatically whenever a brand-new object is created?",
    options: ["__start__()", "__init__()", "__create__()", "__main__()"],
    correctIndex: 1,
    explanation: "__init__() is Python's built-in constructor method that runs immediately upon class instantiation to initialize instance attributes."
  },
  {
    id: 2,
    question: "If SBI Bank updates its central interest rate affecting all customers simultaneously, what type of attribute is being modified?",
    options: ["Instance Attribute", "Class Attribute (Static Variable)", "Local Method Variable", "Dynamic Property"],
    correctIndex: 1,
    explanation: "Class attributes (static variables) are defined directly in the class scope and shared by every single instance of that class."
  },
  {
    id: 3,
    question: "How do you enforce Encapsulation in Python to make a variable private from direct external modification?",
    options: ["private self.pin = 1234", "self.__pin = 1234 (double underscore prefix)", "self._lock(pin) = 1234", "const self.pin = 1234"],
    correctIndex: 1,
    explanation: "Prefixing an attribute with double underscores (e.g. self.__pin) invokes Python's name mangling, keeping the variable private from external access."
  },
  {
    id: 4,
    question: "Both GPay and PhonePe providing a .pay(amount) method with different internal payment logic is a classic demonstration of:",
    options: ["Polymorphism", "Encapsulation", "Recursion", "Garbage Collection"],
    correctIndex: 0,
    explanation: "Polymorphism (many forms) allows different classes to share the exact same method signature while executing their own distinct implementations."
  },
  {
    id: 5,
    question: "Why does class SbiSalaryAccount(SbiAccount) automatically have access to deposit() without re-declaring it?",
    options: ["Because of Encapsulation", "Because of Inheritance", "Because of Method Overloading", "Because of Python Global Scope"],
    correctIndex: 1,
    explanation: "Inheritance enables the child class (SbiSalaryAccount) to inherit all behaviors and methods from its parent class (SbiAccount) for maximum code reuse."
  }
];

export const OopsMasterCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"story" | "flashcards" | "quiz" | "checklist">("story");
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeCard = OOP_FLASHCARDS[currentCardIdx];

  const handleCopyCode = () => {
    const code = `# 1. The Parent Class (Blueprint)
class SbiAccount:
    bank_name = "State Bank of India"  # Class Attribute (Shared by all)

    def __init__(self, name, balance, pin=1234):
        self.name = name              # Instance Attribute (Unique to owner)
        self.balance = balance
        self.__pin = pin              # Encapsulation: Private variable (__)

    def deposit(self, amount):       # Method (Action)
        self.balance += amount
        print(f"₹{amount} deposited. Balance: ₹{self.balance}")


# 2. Inheritance (Child Class)
class SbiSalaryAccount(SbiAccount):
    has_credit_card = True            # Extra perk for salary account


# 3. Instantiation & Testing
kunal = SbiAccount("Kunal", 50000)
kunal.deposit(5000)                   # Output: ₹5000 deposited. Balance: ₹55000

amit = SbiSalaryAccount("Amit", 100000)
print(amit.bank_name)                 # Output: State Bank of India (Inherited!)`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const scoreCount = useMemo(() => {
    return OOP_QUIZ.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
  }, [selectedAnswers]);

  return (
    <div className="w-full mb-8 bg-gradient-to-br from-[#0e141c] via-[#121924] to-[#0a0f16] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/30 overflow-hidden relative">
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/30 shrink-0">
            🐍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                OOPs in Python Master Guide
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Interview Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Zero Jargon • Everyday Real-World Indian Analogies (SBI Bank &amp; BharatPe UPI)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#080d13] p-1 rounded-2xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab("story")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "story"
                ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>SBI Story</span>
          </button>
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "flashcards"
                ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>8 Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "quiz"
                ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz (5Q)</span>
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "checklist"
                ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Checklist</span>
          </button>
        </div>
      </div>

      {/* TAB 1: THE REAL-WORLD STORY & 12-LINE MASTER CODE */}
      {activeTab === "story" && (
        <div className="mt-6 space-y-6 relative z-10 animate-in fade-in duration-200">
          {/* Visual Concept Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121922] border border-slate-700/80 rounded-2xl p-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold mb-1">
                  <span>1. CLASS &amp; OBJECT</span>
                  <span>📄 ➔ 💳</span>
                </div>
                <h4 className="text-sm font-black text-white">The SBI Blank Form</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  The <b className="text-emerald-300">Class</b> is the blank paper form. The <b className="text-emerald-300">Object</b> is Kunal's real active bank account in memory.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                kunal = SbiAccount("Kunal", 50000)
              </span>
            </div>

            <div className="bg-[#121922] border border-slate-700/80 rounded-2xl p-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold mb-1">
                  <span>2. CLASS VS INSTANCE</span>
                  <span>🏛️ ➔ 💰</span>
                </div>
                <h4 className="text-sm font-black text-white">RBI Rate vs. Balance</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <b className="text-cyan-300">Class Attribute:</b> Bank name/RBI rate shared by all accounts. <b className="text-cyan-300">Instance Attribute:</b> Kunal's private ₹50k balance.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                bank_name (all) vs self.balance (you)
              </span>
            </div>

            <div className="bg-[#121922] border border-slate-700/80 rounded-2xl p-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-bold mb-1">
                  <span>3. ENCAPSULATION</span>
                  <span>🔒 ATM PIN</span>
                </div>
                <h4 className="text-sm font-black text-white">Private Safe (__pin)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Hiding critical variables with <b className="text-purple-300">double underscore __</b> so strangers cannot directly modify your balance or PIN.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                self.__pin = 1234
              </span>
            </div>

            <div className="bg-[#121922] border border-slate-700/80 rounded-2xl p-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold mb-1">
                  <span>4. POLYMORPHISM</span>
                  <span>📱 UPI QR</span>
                </div>
                <h4 className="text-sm font-black text-white">BharatPe QR Code</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  One single <b className="text-amber-300">pay()</b> action. GPay and PhonePe both scan the same QR, each running their own internal method.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                gpay.pay() vs phonepe.pay()
              </span>
            </div>
          </div>

          {/* Master 12-Line Code Block */}
          <div className="bg-[#090d13] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>The 12-Line Master Code (Ready for Interview Whiteboard)</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>

            <pre className="mt-3 text-xs sm:text-sm font-mono text-emerald-300/90 leading-relaxed overflow-x-auto select-text p-2 bg-[#05080c] rounded-xl border border-slate-900">
{`# 1. Parent Class (Blueprint)
class SbiAccount:
    bank_name = "State Bank of India"  # Class Attribute (Shared by all)

    def __init__(self, name, balance, pin=1234):
        self.name = name              # Instance Attribute (Unique to owner)
        self.balance = balance
        self.__pin = pin              # Encapsulation: Private variable (__)

    def deposit(self, amount):       # Method (Action)
        self.balance += amount
        print(f"₹{amount} deposited. Balance: ₹{self.balance}")

# 2. Inheritance (Child Class)
class SbiSalaryAccount(SbiAccount):
    has_credit_card = True            # Extra perk for salary account

# 3. Instantiation & Testing
kunal = SbiAccount("Kunal", 50000)
kunal.deposit(5000)                   # Output: ₹5000 deposited. Balance: ₹55000
amit = SbiSalaryAccount("Amit", 100000)
print(amit.bank_name)                 # Output: State Bank of India (Inherited!)`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 8 FLASHCARDS */}
      {activeTab === "flashcards" && (
        <div className="mt-6 flex flex-col items-center space-y-5 relative z-10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between w-full max-w-xl text-xs font-mono text-slate-400">
            <span className="font-bold text-emerald-400">Card {currentCardIdx + 1} of {OOP_FLASHCARDS.length}</span>
            <span className="bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-300 font-bold">
              {activeCard.category}
            </span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full max-w-xl min-h-[260px] bg-gradient-to-br from-[#121922] to-[#0c1118] border-2 border-emerald-500/50 hover:border-emerald-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer shadow-2xl transition-all duration-300 transform hover:scale-[1.01] select-none text-center relative group"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>🏷️ {activeCard.title}</span>
              <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Click to {isFlipped ? "see Question" : "Flip Answer"}
              </span>
            </div>

            <div className="my-auto py-4">
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-black block">QUESTION</span>
                  <h4 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {activeCard.front}
                  </h4>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black block">ANSWER &amp; MENTAL MODEL</span>
                  <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                    {activeCard.back}
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#080d13] border border-slate-800 text-[11px] font-mono text-emerald-300">
                    <span className="text-slate-400 block text-[10px]">Real Analogy:</span>
                    💡 {activeCard.analogy}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-500 text-center">
              {isFlipped ? "💡 Press Next or Flip back" : "Tap anywhere on card to flip"}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIdx((prev) => (prev > 0 ? prev - 1 : OOP_FLASHCARDS.length - 1));
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <div className="flex items-center gap-1.5">
              {OOP_FLASHCARDS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIdx(idx);
                  }}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    currentCardIdx === idx ? "bg-emerald-400 w-5" : "bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIdx((prev) => (prev < OOP_FLASHCARDS.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black font-mono transition flex items-center gap-1 cursor-pointer shadow-md"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE 5-QUESTION INTERVIEW QUIZ */}
      {activeTab === "quiz" && (
        <div className="mt-6 space-y-6 relative z-10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-sm">OOPs Interactive Interview Quiz</span>
              <span className="text-slate-400">({OOP_QUIZ.length} Questions)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                Score: {scoreCount} / {OOP_QUIZ.length}
              </span>
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {OOP_QUIZ.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-[#101720] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono font-black shrink-0">
                      Q{qIdx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      {q.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = q.correctIndex === optIdx;

                      let btnStyle = "bg-[#141d27] border-slate-700 text-slate-300 hover:border-emerald-500/60 hover:text-white";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/30";
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = "bg-red-950/80 border-red-500 text-red-200 font-bold";
                        } else {
                          btnStyle = "bg-[#0c1218] border-slate-800 text-slate-500 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isAnswered && isThisSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-3 rounded-xl bg-[#080d13] border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-400 block">Explanation:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 10-POINT INTERVIEW CHECKLIST */}
      {activeTab === "checklist" && (
        <div className="mt-6 space-y-3 relative z-10 animate-in fade-in duration-200">
          <div className="pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            Top 10 Questions Interviewers Ask &amp; The Exact 1-Sentence Answers to Recite:
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              { q: "1. Difference between Class & Object?", a: "Class is the blueprint on paper (blank SBI form); Object is the real active instance in memory (Kunal's bank account)." },
              { q: "2. What is __init__ in Python?", a: "The constructor method that executes automatically the instant a new object is created to initialize its state." },
              { q: "3. What is 'self'?", a: "A reference to this specific instance in memory so Python knows which object's attributes to read or modify." },
              { q: "4. Class Attribute vs Instance Attribute?", a: "Class Attribute is shared across all objects (like RBI central rate); Instance Attribute is unique to each individual object (like your personal balance)." },
              { q: "5. What are the 4 Pillars of OOP?", a: "Encapsulation (protecting data), Abstraction (hiding complexity), Inheritance (reusing code), and Polymorphism (many forms of a method)." },
              { q: "6. How is Encapsulation done in Python?", a: "By binding data with methods and prefixing private variables with double underscores (e.g. self.__pin, self.__balance)." },
              { q: "7. What is Abstraction?", a: "Hiding internal complexity and showing only the essential interface (like a Car accelerator pedal), using Python's abc and @abstractmethod." },
              { q: "8. What is Inheritance & super()?", a: "A child class deriving features from a parent class for code reuse; super() calls the parent constructor without rewriting code." },
              { q: "9. What is Polymorphism?", a: "Multiple classes providing the exact same method signature (e.g. GPay and PhonePe both having a .pay() method that acts differently)." },
              { q: "10. What is __str__ dunder method?", a: "A special magic method that defines how an object is represented in readable human text when printed with print(obj)." },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#101720] border border-slate-800 space-y-1 font-mono text-xs">
                <span className="text-emerald-400 font-bold block text-xs">{item.q}</span>
                <p className="text-slate-300 text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface KrishNaikOneShotsScreenProps {
  isSidebarCollapsed?: boolean;
  onWatchVideo?: (video: StudyTheaterVideo) => void;
  completedIds?: Set<string>;
  onToggleComplete?: (id: string) => void;
}

export const KrishNaikOneShotsScreen: React.FC<KrishNaikOneShotsScreenProps> = ({
  isSidebarCollapsed = false,
  onWatchVideo,
  completedIds = new Set(),
  onToggleComplete,
}) => {
  const [activeStepId, setActiveStepId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allNotes, setAllNotes] = useState<ILecturePhotoNote[]>([]);
  const [justToggledId, setJustToggledId] = useState<string | null>(null);

  // Dedicated In-Screen Notes Viewer Modal
  const [activeNotesViewer, setActiveNotesViewer] = useState<{ videoId: string; videoTitle: string } | null>(null);

  // Topic Mastery Celebration Modal state
  const [celebratedTopic, setCelebratedTopic] = useState<{
    topic: string;
    category?: string;
    xpPoints?: number;
  } | null>(null);

  // Subscribe to photo notes from Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllNotes(notes);
    });
    return () => unsub();
  }, []);

  const allVideos: KrishNaikVideoRaw[] = krishVideosRaw as KrishNaikVideoRaw[];

  const formatNumber = (num: any) => {
    if (num === undefined || num === null || num === "") return "0";
    const parsed = typeof num === "number" ? num : parseInt(String(num).replace(/,/g, ""), 10);
    return isNaN(parsed) ? "0" : new Intl.NumberFormat().format(parsed);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const getStepForVideo = (v: KrishNaikVideoRaw): StepTrack => {
    const title = v.Title || "";
    for (const step of STEP_BY_STEP_TRACKS) {
      if (step.videoTitles.some((vt) => title.toLowerCase().includes(vt.toLowerCase()) || vt.toLowerCase().includes(title.toLowerCase()))) {
        return step;
      }
    }
    const tLower = title.toLowerCase();
    if (tLower.includes("python")) return STEP_BY_STEP_TRACKS[0];
    if (tLower.includes("statistics") || tLower.includes("linear algebra") || tLower.includes("eda")) return STEP_BY_STEP_TRACKS[1];
    if (tLower.includes("machine learning") || tLower.includes("sagemaker") || tLower.includes("docker")) return STEP_BY_STEP_TRACKS[2];
    if (tLower.includes("deep learning")) return STEP_BY_STEP_TRACKS[3];
    if (tLower.includes("nlp")) return STEP_BY_STEP_TRACKS[4];
    if (tLower.includes("transformer")) return STEP_BY_STEP_TRACKS[5];
    if (tLower.includes("fine tuning") || tLower.includes("finetuning")) return STEP_BY_STEP_TRACKS[6];
    return STEP_BY_STEP_TRACKS[7];
  };

  // Group videos by step
  const stepVideosMap = useMemo(() => {
    const map = new Map<string, KrishNaikVideoRaw[]>();
    STEP_BY_STEP_TRACKS.forEach((step) => map.set(step.id, []));

    allVideos.forEach((v) => {
      const step = getStepForVideo(v);
      const list = map.get(step.id) || [];
      list.push(v);
      map.set(step.id, list);
    });

    return map;
  }, [allVideos]);

  const displaySteps = useMemo(() => {
    if (activeStepId === "all") {
      return STEP_BY_STEP_TRACKS;
    }
    return STEP_BY_STEP_TRACKS.filter((s) => s.id === activeStepId);
  }, [activeStepId]);

  const handlePlayVideo = (v: KrishNaikVideoRaw, step: StepTrack, openPhotoNotes: boolean = false) => {
    const videoUrl = v["Video url"] || "";
    if (!videoUrl) return;

    if (onWatchVideo) {
      onWatchVideo({
        id: videoUrl,
        title: v.Title,
        youtubeUrl: videoUrl,
        subject: step.shortTitle + " • " + (v.ChannelName || v["Channel name"] || "Masterclass"),
        difficulty: v["Duration in timestamp"] || v.Duration || "Masterclass",
        thumbnailUrl: v["Thumbnail url"],
        openPhotoNotes,
      });
    } else {
      window.open(videoUrl, "_blank");
    }
  };

  const handleToggle = (v: KrishNaikVideoRaw, step: StepTrack) => {
    const url = v["Video url"] || "";
    if (!url) return;
    const isCurrentlyDone = completedIds.has(url);

    if (onToggleComplete) {
      setJustToggledId(url);
      onToggleComplete(url);
      setTimeout(() => setJustToggledId(null), 1000);

      if (!isCurrentlyDone) {
        // Trigger celebratory animation
        setCelebratedTopic({
          topic: v.Title,
          category: step.title,
          xpPoints: 500,
        });
      }
    }
  };

  const totalVideos = allVideos.length;
  const completedCount = allVideos.filter((v) => completedIds.has(v["Video url"] || "")).length;
  const progressPercent = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  return (
    <div className={"flex-1 min-h-screen bg-[#0b0f14] text-slate-100 font-sans pb-24 overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-200 transition-all duration-300 " + (isSidebarCollapsed ? "md:pl-20" : "md:pl-68")}>
      {/* HEADER HERO */}
      <header className="sticky top-0 z-40 bg-[#0d121a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 sm:py-5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/25 shrink-0">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Standard 8-Step AI/ML Roadmap
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Interactive Checklists
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Python OOPs → Stats → ML/SageMaker → DL → NLP → Transformers → Fine-Tuning → RAG
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
            <div className="flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Curriculum</span>
                <span className="text-emerald-400 font-bold">{completedCount}/{totalVideos} Done</span>
              </div>
              <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>

            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumb Steps Nav */}
        <div className="max-w-7xl mx-auto mt-4 overflow-x-auto pb-1 no-scrollbar flex items-center gap-1.5">
          <button
            onClick={() => setActiveStepId("all")}
            className={"px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 " + (activeStepId === "all" ? "bg-white text-slate-950 shadow-md font-black" : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800")}
          >
            <span>🌟 Full 8-Step Track</span>
          </button>

          {STEP_BY_STEP_TRACKS.map((step) => {
            const isSelected = activeStepId === step.id;
            const stepVids = stepVideosMap.get(step.id) || [];
            const stepDone = stepVids.filter((v) => completedIds.has(v["Video url"] || "")).length;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={"px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 " + (isSelected ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20" : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800")}
              >
                <span>{step.icon}</span>
                <span>{step.shortTitle}</span>
                <span className={"text-[10px] font-mono px-1.5 py-0.2 rounded-md " + (isSelected ? "bg-slate-950/20 text-slate-950 font-bold" : "bg-slate-800 text-slate-400")}>
                  {stepDone}/{stepVids.length}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-12">
        {displaySteps.map((step) => {
          const rawVideos = stepVideosMap.get(step.id) || [];
          const query = searchQuery.toLowerCase().trim();
          const videos = rawVideos.filter((v) => {
            if (!query) return true;
            const t = (v.Title || "").toLowerCase();
            const c = (v.ChannelName || v["Channel name"] || "").toLowerCase();
            const d = (v.Description || "").toLowerCase();
            return t.includes(query) || c.includes(query) || d.includes(query);
          });

          if (query && videos.length === 0) return null;

          const stepCompletedCount = rawVideos.filter((v) => completedIds.has(v["Video url"] || "")).length;
          const isAllStepDone = rawVideos.length > 0 && stepCompletedCount === rawVideos.length;

          return (
            <section
              key={step.id}
              className={"border rounded-3xl p-5 sm:p-7 backdrop-blur-xs relative overflow-hidden transition-all duration-300 " + (isAllStepDone ? "bg-emerald-950/15 border-emerald-500/40 shadow-xl shadow-emerald-950/30" : "bg-slate-900/50 border-slate-800/90 shadow-xl shadow-black/30")}
            >
              {/* Step Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={"w-12 h-12 rounded-2xl border text-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 " + (isAllStepDone ? "bg-emerald-500/20 border-emerald-500/40 scale-105" : "bg-slate-800/90 border-slate-700")}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        Step {step.stepNumber} of 8
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/60">
                        {step.badge}
                      </span>
                      {isAllStepDone ? (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-in zoom-in-95 duration-200">
                          <Check className="w-3 h-3 stroke-[3]" /> Step Completed ({stepCompletedCount}/{rawVideos.length})
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                          {stepCompletedCount}/{rawVideos.length} Complete
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {step.title}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 max-w-3xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 lg:max-w-md lg:justify-end">
                  {step.keySkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Interactive OOPs in Python Master Card for Step 1 */}
              {step.id === "step-1-python-oops" && (
                <div className="mt-6">
                  <OopsMasterCard />
                </div>
              )}

              {/* Video Cards Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((v, vIdx) => {
                  const title = v.Title || "No Title";
                  const url = v["Video url"] || "#";
                  const thumb = v["Thumbnail url"] || "";
                  const channel = v.ChannelName || v["Channel name"] || "Krish Naik";
                  const duration = v["Duration in timestamp"] || v.Duration || "";
                  const views = v.Views !== undefined ? v.Views : "";
                  const likes = v.Likes !== undefined ? v.Likes : "";
                  const comments = v.Comments !== undefined ? v.Comments : "";
                  const uploadedAt = v.UploadedTime || v["Uploaded Time"] || "";
                  const isDone = completedIds.has(url);
                  const isJustToggled = justToggledId === url;
                  const notesForThisVideo = allNotes.filter((n) => n.videoId === url);

                  return (
                    <div
                      key={vIdx}
                      onClick={() => handlePlayVideo(v, step)}
                      className={
                        "border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group cursor-pointer shadow-md relative " +
                        (isDone
                          ? "bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/60 shadow-emerald-950/40 scale-[1.01]"
                          : "bg-[#0d121a] border-slate-800 hover:border-emerald-500/70 hover:-translate-y-1 shadow-black/40") +
                        (isJustToggled ? " ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 animate-pulse" : "")
                      }
                    >
                      {/* Thumbnail Container */}
                      <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={title}
                            loading="lazy"
                            className={"w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 " + (isDone ? "opacity-50 saturate-50 contrast-125" : "opacity-85 group-hover:opacity-100")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                            <Play className="w-8 h-8" />
                          </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className={"absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent " + (isDone ? "opacity-75" : "opacity-80 group-hover:opacity-30") + " transition-opacity"} />

                        {/* RUBBER DEAD STAMP OVERLAY */}
                        {isDone && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            <div className="dead-stamp px-4 py-1.5 border-[3.5px] border-emerald-400 text-emerald-400 bg-slate-950/85 backdrop-blur-xs rounded-xl flex items-center gap-2 font-mono font-black text-sm tracking-[0.25em] uppercase select-none border-dashed">
                              <Check className="w-4 h-4 stroke-[3.5] text-emerald-300" />
                              <span>COMPLETED</span>
                            </div>
                          </div>
                        )}

                        {/* Watch In Theater Badge Button Overlay (when hovered and not done) */}
                        {!isDone && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                            <div className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xl shadow-emerald-500/40">
                              <Play className="w-4 h-4 fill-current" />
                              <span>Watch in Study Theater</span>
                            </div>
                          </div>
                        )}

                        {/* Direct View Notes Button on Thumbnail */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNotesViewer({ videoId: url, videoTitle: title });
                          }}
                          className="absolute top-2 right-2 z-30 px-2.5 py-1 bg-slate-950/90 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg border border-amber-500/50 hover:border-amber-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md text-[10px] font-mono font-bold flex items-center gap-1"
                          title="View Handwritten Photo Notes & Notebook"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>View Notes ({notesForThisVideo.length})</span>
                        </button>

                        {/* Duration Badge */}
                        {duration && (
                          <span className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono shadow-md">
                            {duration}
                          </span>
                        )}

                        {/* Step Marker Badge */}
                        <span className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-sm text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                          Step {step.stepNumber}.{vIdx + 1}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex flex-col gap-2 flex-grow">
                        <h3 className={"font-bold text-xs sm:text-sm line-clamp-2 leading-snug transition-colors " + (isDone ? "text-emerald-200 group-hover:text-emerald-300" : "text-white group-hover:text-emerald-400")}>
                          {title}
                        </h3>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-auto pt-2">
                          <span className={isDone ? "text-emerald-400/90 font-semibold" : "text-slate-300"}>{channel}</span>
                          {uploadedAt && <span className="text-slate-500 font-mono">{formatDate(uploadedAt)}</span>}
                        </div>

                        {/* Notes Toolbar */}
                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-1.5">
                            {/* View Notes Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveNotesViewer({ videoId: url, videoTitle: title });
                              }}
                              className={
                                "px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono flex items-center gap-1 transition cursor-pointer " +
                                (notesForThisVideo.length > 0
                                  ? "bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300"
                                  : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-300")
                              }
                              title="Open interactive stationary notebook viewer for notes"
                            >
                              <BookOpen className="w-3 h-3 text-amber-400" />
                              <span>View Notes ({notesForThisVideo.length})</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                            {views !== "" && (
                              <span className="flex items-center gap-1" title="Views">
                                <Eye className="w-3 h-3 text-slate-400" />
                                {formatNumber(views)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer Checklist Controls */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-400">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(v, step);
                            }}
                            className={
                              "px-3 py-1.5 rounded-xl text-xs font-black font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm " +
                              (isDone
                                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-400/30"
                                : "bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700")
                            }
                            title={isDone ? "Click to unmark" : "Mark as completed"}
                          >
                            {isDone ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                                <span>COMPLETED ✓</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-3.5 h-3.5" />
                                <span>Mark Complete</span>
                              </>
                            )}
                          </button>

                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition"
                            title="Open in YouTube"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* ================= STATIONARY NOTEBOOK / PHOTO NOTES MODAL VIEWER ================= */}
      {activeNotesViewer && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setActiveNotesViewer(null)}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between py-2.5 px-4 bg-slate-900/95 border border-slate-800 rounded-2xl mb-3 text-white shadow-2xl shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 truncate pr-4">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold truncate">{activeNotesViewer.videoTitle}</span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Handwritten / Photo Notes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveNotesViewer(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                title="Close notes (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stationary Notebook Viewer */}
          <div
            className="max-w-5xl w-full flex-1 min-h-0 rounded-2xl overflow-hidden bg-[#11161a] border border-slate-800 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <StationaryNotebookViewer
              videoId={activeNotesViewer.videoId}
              videoTitle={activeNotesViewer.videoTitle}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* ================= TOPIC MASTERY CELEBRATION MODAL ================= */}
      {celebratedTopic && (
        <MasteryCelebrationModal
          isOpen={Boolean(celebratedTopic)}
          topic={celebratedTopic.topic}
          category={celebratedTopic.category}
          xpPoints={celebratedTopic.xpPoints || 500}
          onClose={() => setCelebratedTopic(null)}
        />
      )}
    </div>
  );
};
