import React, { useState, useMemo } from "react";
import krishVideosRaw from "../data/krishNaikVideos.json";
import { StudyTheaterVideo } from "../types";
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
  Sparkles
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

  // Associate each video with a step
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

  const handlePlayVideo = (v: KrishNaikVideoRaw, step: StepTrack) => {
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
      });
    } else {
      window.open(videoUrl, "_blank");
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
                  Curated Track
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
              className="bg-slate-900/50 border border-slate-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-xs relative overflow-hidden shadow-xl shadow-black/30"
            >
              {/* Step Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-2xl flex items-center justify-center shrink-0 shadow-inner">
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
                      {isAllStepDone && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Step Completed
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

                  return (
                    <div
                      key={vIdx}
                      onClick={() => handlePlayVideo(v, step)}
                      className={"bg-[#0d121a] border rounded-2xl overflow-hidden hover:border-emerald-500/70 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer shadow-md shadow-black/40 relative " + (isDone ? "border-emerald-500/40 bg-slate-900/40" : "border-slate-800")}
                    >
                      <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                            <Play className="w-8 h-8" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                          <div className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xl shadow-emerald-500/40">
                            <Play className="w-4 h-4 fill-current" />
                            <span>Watch in Study Theater</span>
                          </div>
                        </div>

                        {duration && (
                          <span className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono shadow-md">
                            {duration}
                          </span>
                        )}

                        <span className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-sm text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                          Step {step.stepNumber}.{vIdx + 1}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-2 flex-grow">
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-400 line-clamp-2 leading-snug transition-colors">
                          {title}
                        </h3>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-auto pt-2">
                          <span className="text-slate-300">{channel}</span>
                          {uploadedAt && <span className="text-slate-500 font-mono">{formatDate(uploadedAt)}</span>}
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2.5 font-mono text-[10px] text-slate-400">
                            {views !== "" && (
                              <span className="flex items-center gap-1" title="Views">
                                <Eye className="w-3 h-3 text-slate-400" />
                                {formatNumber(views)}
                              </span>
                            )}
                            {likes !== "" && (
                              <span className="flex items-center gap-1 text-slate-300" title="Likes">
                                <ThumbsUp className="w-3 h-3 text-emerald-400" />
                                {formatNumber(likes)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {onToggleComplete && (
                              <button
                                type="button"
                                onClick={() => onToggleComplete(url)}
                                className={"px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer flex items-center gap-1 " + (isDone ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700")}
                                title={isDone ? "Mark as pending" : "Mark as done"}
                              >
                                {isDone ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Done</span>
                                  </>
                                ) : (
                                  <>
                                    <Circle className="w-3 h-3 text-slate-400" />
                                    <span>Done</span>
                                  </>
                                )}
                              </button>
                            )}

                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md border border-slate-700 transition"
                              title="Open in YouTube"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
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
    </div>
  );
};
