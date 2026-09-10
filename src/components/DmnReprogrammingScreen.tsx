import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Film,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  Lightbulb,
} from 'lucide-react';
import { IDmnNarrative } from '../types';
import {
  subscribeDmnNarratives,
  saveDmnNarrativeToFirestore,
  deleteDmnNarrativeFromFirestore,
  recordDmnDailyReviewInFirestore,
} from '../lib/firestoreService';

interface DmnReprogrammingScreenProps {
  onOpenStudyTheater?: (video: any) => void;
  isSidebarCollapsed?: boolean;
}

const PRESET_TEMPLATES: Omit<IDmnNarrative, 'id' | 'createdAt' | 'reviewStreakCount'>[] = [
  {
    title: 'GenAI & AI Agent Architect',
    category: 'gen_ai',
    identityStatement: 'I am the type of AI engineer and builder who develops deep practical intuition for LLMs, autonomous agents, and RAG systems by constructing and debugging real-world systems every day.',
    groundedFacts: 'I know the data that active experimentation with prompt evaluation, context windows, tool calling, and vector retrieval solidifies neural synaptic pathways 5x faster than passive consumption of AI news.',
    futureEdge: 'Embodying this gives me an irreplaceable edge in the AI era because I understand how to orchestrate autonomous multi-agent pipelines and deploy high-impact intelligent software with rapid velocity.',
    targetHabitRule: 'I make sure that I spend at least 45 focused minutes building, experimenting with agent architectures, or implementing paper concepts every single day.',
    triggerCue: 'When I sit down to work on AI projects and feel intimidated by rapid ecosystem changes or complexity...',
    step1: 'Open IDE and terminal, take 2 deep breaths, and define the simplest input/output loop for the agent.',
    step2: 'Write a basic prompt schema or tool function and inspect raw model outputs directly.',
    step3: 'Iterate with structured evaluation, error handling, and log my findings in my dev notes.',
    movieSceneDescription: 'I see myself sitting calm and composed at my terminal, orchestrating multi-agent loops, watching autonomous tools execute flawlessly with zero anxiety.',
  },
  {
    title: 'Dopamine Retention & Sexual Transmutation',
    category: 'dopamine_retention',
    identityStatement: 'I am the type of high-discipline man who commands my primal impulses and channels raw creative energy into world-class engineering, physical strength, and mental clarity rather than wasting it on pixel dopamine.',
    groundedFacts: 'I know the data that androgen receptor upregulation, dopamine baseline stabilization, and semen retention preserve vital zinc, choline, and neuro-drive, dramatically sharpening working memory and magnetic presence.',
    futureEdge: 'Embodying this gives me an unshakeable edge in raw cognitive stamina, biological confidence, and laser focus that separates high-agency leaders from the easily distracted crowd.',
    targetHabitRule: 'I make sure that I never bring my phone into the bathroom or bed, and immediately transmute any physical craving into pushups, cold water, or deep work.',
    triggerCue: 'When a compulsive urge, sexual craving, or sudden restlessness triggers the instinct to seek digital stimulation...',
    step1: 'Instantly stand up, hands off my phone/body, and take 3 deep physiological sighs (2 fast inhales through nose, long slow exhale through mouth).',
    step2: 'Splash cold water on my face and do 15 brisk pushups to pull blood flow back into major muscle groups.',
    step3: 'Sit back down with absolute composure and direct that surging physical drive straight into solving a hard coding problem.',
    movieSceneDescription: 'I feel the urge rise like a hot wave. Instead of collapsing, I stand tall, breathe deeply, feel the energy convert into a bright spark of focus in my eyes, and lock effortlessly into flow.',
  },
  {
    title: 'Zero Sugar & Metabolic Brain Clarity',
    category: 'nutrition',
    identityStatement: 'I am the type of person who fuels my mind and body with clean, high-nutrient food and fiercely rejects processed sugar because peak cognitive performance and calm dopamine require stable blood glucose.',
    groundedFacts: 'I know the data that refined sugar causes rapid reactive hypoglycemia, triggering prefrontal cortex brain fog, neuro-inflammation, mood swings, and severe ADHD dopamine crashes.',
    futureEdge: 'Embodying this gives me sustained, crash-proof all-day energy and clean mental sharpness while others suffer from afternoon slumps and brain fog.',
    targetHabitRule: 'I make sure that I drink 1 full glass of water upon waking and eliminate sugary snacks, candy, sweetened beverages, and junk food.',
    triggerCue: 'When I feel the sudden craving for sweets, processed snacks, or sugary drinks while studying or resting...',
    step1: 'Drink a tall glass of cold water immediately and set a 10-minute mental buffer.',
    step2: 'Acknowledge: "This is just a temporary dopamine craving wave from bacteria and old habits, not real hunger."',
    step3: 'Eat clean protein/fruit or step outside for a 2-minute sunlight walk.',
    movieSceneDescription: 'I look at sugary foods with total indifference. I feel light, clean, sharp, energized, with no brain fog and complete control over my appetite.',
  },
  {
    title: 'High-Agency Character & Great Human Being',
    category: 'character',
    identityStatement: 'I am the type of person who walks with relentless integrity, genuine kindness, deep humility, and unwavering responsibility, elevating everyone around me through my actions and presence.',
    groundedFacts: 'I know the data that prosocial behavior and character consistency release oxytocin and serotonin, lowering cortisol and building profound psychological resilience under high stress.',
    futureEdge: 'Embodying this builds unshakeable self-respect, genuine deep trust, and a stellar reputation, ensuring that wherever I go, people know I am a man of my word.',
    targetHabitRule: 'I make sure that I express sincere gratitude, listen deeply without ego, and keep 100% of the promises I make to myself and others.',
    triggerCue: 'When frustration, anger, or selfish ego impulses arise during my day...',
    step1: 'Pause for 3 seconds, lower my shoulders, and refuse to react impulsively.',
    step2: 'Ask myself: "How would the highest, most dignified version of Kunal respond right now?"',
    step3: 'Speak calmly, prioritize understanding over being right, and act with quiet strength.',
    movieSceneDescription: 'I see myself walking with grounded confidence, treating others with warmth and respect, keeping my promises effortlessly, and going to sleep every night with a clean conscience.',
  },
  {
    title: 'Elite DSA & Engineering Focus',
    category: 'dsa_study',
    identityStatement: 'I am the type of software engineer who embraces difficult algorithmic problems with calm curiosity because mastering fundamentals builds true creative freedom.',
    groundedFacts: 'I know the data that deliberate daily spaced repetition and active coding recall re-wires synaptic plasticity faster than passive reading.',
    futureEdge: 'Embodying this gives me an edge in high-stakes technical interviews and building resilient scalable systems because I never panic when faced with unfamiliar constraints.',
    targetHabitRule: 'I make sure that I solve or deeply analyze at least 1-2 core DSA problems and review my notes every single morning.',
    triggerCue: 'When I sit down at my desk and feel the urge to check social media or procrastinate...',
    step1: 'Open LeetCode/Curriculum immediately, take one deep breath, and read only the problem statement without touching the keyboard.',
    step2: 'Write down the brute force idea and draw 2 test examples on paper.',
    step3: 'Implement the optimal solution and log active recall notes in my study hub.',
    movieSceneDescription: 'I see myself sitting upright with clean water nearby, phone in another room, calmly sketching edge cases on paper with total composure and flow.',
  },
  {
    title: 'Deep Sleep & Cognitive Recovery',
    category: 'sleep',
    identityStatement: 'I am the type of person who fiercely protects 8 hours of restorative sleep because high-level cognitive performance and memory consolidation require nightly biological repair.',
    groundedFacts: 'I know the data that non-REM and REM sleep flush neurotoxic metabolic waste (glymphatic system) and solidify synaptic connections made during study.',
    futureEdge: 'Embodying this gives me an edge in mental stamina, sustained attention, and emotional stability throughout demanding academic and coding sessions.',
    targetHabitRule: 'I make sure that I dim overhead lights and distance my screens 45 minutes before bedtime every night.',
    triggerCue: 'When the clock hits 10:30 PM...',
    step1: 'Put phone on charging dock across the room in do-not-disturb mode.',
    step2: 'Turn on soft warm ambient light and do 3 physiological sighs.',
    step3: 'Lie down in a cool dark room and visualize tomorrow morning waking up refreshed and ready.',
    movieSceneDescription: 'A dim, quiet, cool bedroom. No blue light glowing. I feel the tension drop from my shoulders as I drift into effortless, deep restorative sleep.',
  },
  {
    title: 'Digital Hygiene & Dopamine Agency',
    category: 'digital_hygiene',
    identityStatement: 'I am the type of person who commands my attention rather than leasing it to algorithms, because high-agency engineers build tools instead of being consumed by them.',
    groundedFacts: 'I know the data that variable reward feeds dysregulate dopamine baselines, destroying working memory and deep work capacity.',
    futureEdge: 'Embodying this gives me laser clarity to outwork and outlearn distractions while others stay trapped in fragmented attention.',
    targetHabitRule: 'I make sure that I keep my phone in a separate room during focus blocks and only check messages during scheduled recovery breaks.',
    triggerCue: 'When I feel the sudden restlessness or impulse to unlock my phone...',
    step1: 'Pause my hands, take 2 physiological sighs, and label the impulse: "This is just a dopamine craving wave."',
    step2: 'Look away from the screen for 20 seconds at a distant horizon to reset visual gaze.',
    step3: 'Re-anchor eyes on the immediate line of code and continue for 5 uninterrupted minutes.',
    movieSceneDescription: 'I feel the impulse surge, acknowledge it without shame, breathe through it calmly, and watch the urge dissolve as my attention locks back into coding.',
  },
];

export const DmnReprogrammingScreen: React.FC<DmnReprogrammingScreenProps> = ({
  onOpenStudyTheater,
  isSidebarCollapsed = false,
}) => {
  const [narratives, setNarratives] = useState<IDmnNarrative[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingNarrative, setEditingNarrative] = useState<IDmnNarrative | null>(null);
  const [showScene, setShowScene] = useState<boolean>(true);
  const [reviewedTodayMap, setReviewedTodayMap] = useState<Record<string, boolean>>({});

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IDmnNarrative['category']>('dsa_study');
  const [identityStatement, setIdentityStatement] = useState('');
  const [groundedFacts, setGroundedFacts] = useState('');
  const [futureEdge, setFutureEdge] = useState('');
  const [targetHabitRule, setTargetHabitRule] = useState('');
  const [triggerCue, setTriggerCue] = useState('');
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [movieSceneDescription, setMovieSceneDescription] = useState('');

  // Subscribe to DMN Narratives
  useEffect(() => {
    const unsubscribe = subscribeDmnNarratives((list) => {
      setNarratives(list);
      // Check if reviewed today (within last 18 hours or same calendar day)
      const map: Record<string, boolean> = {};
      const todayDateStr = new Date().toDateString();
      list.forEach((item) => {
        if (item.lastReviewedAt) {
          const itemDateStr = new Date(item.lastReviewedAt).toDateString();
          map[item.id] = itemDateStr === todayDateStr;
        }
      });
      setReviewedTodayMap(map);
    });
    return unsubscribe;
  }, []);

  const openCreateModal = () => {
    setEditingNarrative(null);
    setTitle('');
    setCategory('dsa_study');
    setIdentityStatement('');
    setGroundedFacts('');
    setFutureEdge('');
    setTargetHabitRule('');
    setTriggerCue('');
    setStep1('');
    setStep2('');
    setStep3('');
    setMovieSceneDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: IDmnNarrative) => {
    setEditingNarrative(item);
    setTitle(item.title);
    setCategory(item.category);
    setIdentityStatement(item.identityStatement);
    setGroundedFacts(item.groundedFacts);
    setFutureEdge(item.futureEdge);
    setTargetHabitRule(item.targetHabitRule);
    setTriggerCue(item.triggerCue);
    setStep1(item.step1);
    setStep2(item.step2);
    setStep3(item.step3);
    setMovieSceneDescription(item.movieSceneDescription || '');
    setIsModalOpen(true);
  };

  const applyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setIdentityStatement(preset.identityStatement);
    setGroundedFacts(preset.groundedFacts);
    setFutureEdge(preset.futureEdge);
    setTargetHabitRule(preset.targetHabitRule);
    setTriggerCue(preset.triggerCue);
    setStep1(preset.step1);
    setStep2(preset.step2);
    setStep3(preset.step3);
    setMovieSceneDescription(preset.movieSceneDescription || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !identityStatement.trim() || !triggerCue.trim()) return;

    const item: IDmnNarrative = {
      id: editingNarrative ? editingNarrative.id : `dmn_${Date.now()}`,
      title: title.trim(),
      category,
      identityStatement: identityStatement.trim(),
      groundedFacts: groundedFacts.trim(),
      futureEdge: futureEdge.trim(),
      targetHabitRule: targetHabitRule.trim(),
      triggerCue: triggerCue.trim(),
      step1: step1.trim(),
      step2: step2.trim(),
      step3: step3.trim(),
      movieSceneDescription: movieSceneDescription.trim(),
      reviewStreakCount: editingNarrative ? editingNarrative.reviewStreakCount : 0,
      createdAt: editingNarrative ? editingNarrative.createdAt : Date.now(),
      lastReviewedAt: editingNarrative?.lastReviewedAt,
    };

    await saveDmnNarrativeToFirestore(item);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this DMN story?')) {
      await deleteDmnNarrativeFromFirestore(id);
      if (activeStoryIndex >= narratives.length - 1) {
        setActiveStoryIndex(Math.max(0, narratives.length - 2));
      }
    }
  };

  const handleMarkReviewed = async (id: string) => {
    await recordDmnDailyReviewInFirestore(id);
    setReviewedTodayMap((prev) => ({ ...prev, [id]: true }));
  };

  const activeStory = narratives[activeStoryIndex] || PRESET_TEMPLATES[0];
  const isActualSaved = narratives.length > 0 && narratives[activeStoryIndex];

  return (
    <div className={`flex-1 min-h-screen bg-[#f8faf9] text-[#191c1b] pb-24 md:pb-12 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
    }`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1b382b] via-[#244b3a] to-[#2d5946] text-white px-5 py-8 md:px-10 md:py-10 shadow-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-2">
                <Brain className="w-3.5 h-3.5" />
                NEURO-NARRATIVE ENGINE
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                Default Mode Network (DMN) Story Reprogramming
              </h1>
              <p className="text-sm md:text-base text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
                Your brain's DMN is your autobiographical storyteller. Writing and daily reviewing your identity story reprograms subconscious defaults, priming your reticular activating system to spot opportunities and execute effortlessly.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#1b382b] hover:bg-emerald-50 font-bold text-sm shadow-sm transition-all transform active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              Write My Story
            </button>
          </div>

          {/* Quick Stats & Neuroscience Quick-Tip Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-emerald-400/20 text-xs">
            <div className="flex items-center gap-2.5 bg-emerald-950/40 p-3 rounded-lg border border-emerald-400/10">
              <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                <strong className="text-white">Layer 1: Identity</strong> primes what the subconscious looks for.
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-emerald-950/40 p-3 rounded-lg border border-emerald-400/10">
              <Film className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                <strong className="text-white">Layer 2: Mental Simulation</strong> activates motor cortex circuits.
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-emerald-950/40 p-3 rounded-lg border border-emerald-400/10">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                <strong className="text-white">Attentional Redirection</strong> halts negative self-talk loops in seconds.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8">
        {/* Story Selector Pill Bar */}
        {narratives.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
            {narratives.map((item, index) => {
              const isSelected = index === activeStoryIndex;
              const isReviewed = reviewedTodayMap[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStoryIndex(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#244b3a] text-white border-[#244b3a] shadow-sm scale-102'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Brain className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                  {item.reviewStreakCount > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {item.reviewStreakCount}
                    </span>
                  )}
                  {isReviewed && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">No Custom Story Written Yet</h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  We've loaded an ADHD software engineering preset below. Click "Write My Story" or "Save This Preset" to personalize your own narrative into your persistent database.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                applyPreset(PRESET_TEMPLATES[0]);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer shrink-0"
            >
              Save Preset as My Story
            </button>
          </div>
        )}

        {/* ACTIVE STORY CARD VIEW */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
          {/* Card Top Action Header */}
          <div className="px-6 py-5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {activeStory.title}
                </h2>
                <p className="text-xs text-slate-500 capitalize">
                  Category: {activeStory.category.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {isActualSaved && (
                <>
                  <button
                    onClick={() => openEditModal(activeStory as IDmnNarrative)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Edit Story"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete((activeStory as IDmnNarrative).id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Review & Prime CTA Button */}
              {isActualSaved && (
                <button
                  onClick={() => handleMarkReviewed((activeStory as IDmnNarrative).id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                    reviewedTodayMap[(activeStory as IDmnNarrative).id]
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#244b3a] hover:bg-[#1b382b] text-white transform active:scale-95'
                  }`}
                >
                  {reviewedTodayMap[(activeStory as IDmnNarrative).id] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Primed & Reviewed Today</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Prime & Mark Reviewed</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* ================= PART 1: IDENTITY-BASED BELIEFS ================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-extrabold tracking-wider uppercase text-emerald-900">
                  Part 1: Identity-Based Beliefs (Who I Am)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Core Value / Identity Statement */}
                <div className="p-5 rounded-2xl bg-[#f4f8f5] border border-emerald-200/70 hover:border-emerald-300 transition-colors">
                  <div className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    Core Identity Statement
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    "{activeStory.identityStatement}"
                  </p>
                </div>

                {/* 2. Grounded Facts & Data */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="text-[11px] font-bold text-slate-600 tracking-wide uppercase mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    Grounded Data &amp; Neuroscience
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    "{activeStory.groundedFacts}"
                  </p>
                </div>

                {/* 3. Future Edge / Outcome */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:border-amber-300 transition-colors">
                  <div className="text-[11px] font-bold text-amber-800 tracking-wide uppercase mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Competitive Edge &amp; High-Agency Outcome
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    "{activeStory.futureEdge}"
                  </p>
                </div>

                {/* 4. Target Habit Rule */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-emerald-300 transition-colors">
                  <div className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Non-Negotiable Target Habit Rule
                  </div>
                  <p className="text-sm font-bold text-emerald-950 leading-relaxed">
                    "{activeStory.targetHabitRule}"
                  </p>
                </div>
              </div>
            </div>

            {/* ================= PART 2: IMPLEMENTATION INTENTIONS & MOVIE SCENE ================= */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-extrabold tracking-wider uppercase text-blue-900">
                    Part 2: Implementation Intentions &amp; Frictionless Action Sequence
                  </h3>
                </div>
              </div>

              {/* Trigger Cue */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 mb-4">
                <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-1">
                  Trigger Cue (When / If)
                </div>
                <p className="text-sm font-bold text-blue-950">
                  {activeStory.triggerCue}
                </p>
              </div>

              {/* 3 Steps Sequence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    Step 1: Effortless Tiny Start
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
                    {activeStory.step1}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                    Step 2: Build Momentum
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
                    {activeStory.step2}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase">
                    Step 3: Lock-in Flow
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
                    {activeStory.step3}
                  </p>
                </div>
              </div>

              {/* Vivid Mental Movie Scene */}
              {activeStory.movieSceneDescription && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1b2b24] text-white shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      <Film className="w-4 h-4 text-emerald-400" />
                      Vivid Sensory Mental Simulation (Mental Movie)
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed">
                    "{activeStory.movieSceneDescription}"
                  </p>
                </div>
              )}
            </div>

            {/* ================= PART 3: ATTENTIONAL REDIRECTION PROTOCOL ================= */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-extrabold tracking-wider uppercase text-amber-900">
                  Part 3: Attentional Redirection on Negative Self-Talk
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Whenever an old default story resurfaces ("I'm behind", "I can't focus"):
                  </h4>
                  <ol className="text-xs text-slate-700 space-y-1 list-decimal list-inside font-medium mt-1">
                    <li><strong>Notice without judgment:</strong> "Ah, my old DMN script is playing."</li>
                    <li><strong>Physiological Sigh:</strong> Two sharp inhales through nose, slow long exhale through mouth.</li>
                    <li><strong>Re-Anchor:</strong> Read your Layer 1 Identity Statement out loud.</li>
                    <li><strong>Execute Step 1:</strong> Take the tiny effortless physical action immediately.</li>
                  </ol>
                </div>

                <div className="flex items-center gap-3 shrink-0 bg-white p-3 rounded-xl border border-amber-200">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Review Streak</div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {activeStory.reviewStreakCount || 0} Days Primed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets Grid to Explore / Add */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Preset Neuro-Narratives (Quick Add)
              </h3>
              <p className="text-xs text-slate-500">
                Scientifically calibrated identity scripts designed for ADHD engineers &amp; students
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRESET_TEMPLATES.map((tpl, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tpl.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{tpl.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    "{tpl.identityStatement}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    applyPreset(tpl);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Use &amp; Personalize
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT DMN STORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#1b382b] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingNarrative ? 'Edit DMN Story' : 'Write New DMN Identity Story'}
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    Step-by-step neuro-narrative framework to rewrite your subconscious defaults
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Story Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Deep Work & Algorithmic Problem Solving"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                  >
                    <option value="gen_ai">GenAI &amp; Agent Systems 🤖</option>
                    <option value="dopamine_retention">Dopamine Retention &amp; Energy ⚡</option>
                    <option value="nutrition">Zero Sugar &amp; Nutrition 🥗</option>
                    <option value="character">Character &amp; Leadership 👑</option>
                    <option value="dsa_study">DSA &amp; Study 📚</option>
                    <option value="focus">Deep Focus 🎯</option>
                    <option value="sleep">Sleep &amp; Recovery 🌙</option>
                    <option value="digital_hygiene">Digital Hygiene 📵</option>
                    <option value="career">Career &amp; Engineering 💼</option>
                    <option value="custom">Custom 🧠</option>
                  </select>
                </div>
              </div>

              {/* PART 1: 4 LAYERS */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">1</span>
                  <h4 className="font-extrabold text-emerald-900 uppercase tracking-wider text-xs">
                    Part 1: Identity-Based Beliefs (4 Layers)
                  </h4>
                </div>

                {/* Layer 1: Core Value / Identity */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    1. Core Value / Identity ("I am the type of person who...") *
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    State what you prioritize: "I am the type of person who [behavior/value] because [reason]."
                  </p>
                  <textarea
                    required
                    rows={2}
                    placeholder="I am the type of software engineer who embraces difficult algorithmic problems with calm curiosity because mastering fundamentals builds true creative freedom."
                    value={identityStatement}
                    onChange={(e) => setIdentityStatement(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  />
                </div>

                {/* Layer 2: Grounded Facts & Data */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    2. Grounded Facts &amp; Science ("I know the data that...")
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Anchor in undeniable facts or neuroscience to silence imposter skepticism.
                  </p>
                  <textarea
                    rows={2}
                    placeholder="I know the data that deliberate daily spaced repetition and active coding recall re-wires synaptic plasticity faster than passive reading."
                    value={groundedFacts}
                    onChange={(e) => setGroundedFacts(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  />
                </div>

                {/* Layer 3: Future Edge / Outcome */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    3. Future Edge &amp; High-Agency Outcome ("Embodying this gives me an edge in...")
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Embodying this gives me an edge in high-stakes technical interviews and building resilient scalable systems because I never panic when faced with unfamiliar constraints."
                    value={futureEdge}
                    onChange={(e) => setFutureEdge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  />
                </div>

                {/* Layer 4: Target Habit Rule */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    4. Non-Negotiable Target Habit Rule ("I make sure that I... every day")
                  </label>
                  <input
                    type="text"
                    placeholder="I make sure that I solve or deeply analyze at least 1-2 core DSA problems and review my notes every single morning."
                    value={targetHabitRule}
                    onChange={(e) => setTargetHabitRule(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* PART 2: IMPLEMENTATION INTENTIONS */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">2</span>
                  <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-xs">
                    Part 2: Implementation Intentions &amp; Frictionless Steps
                  </h4>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Trigger Cue ("When / If [Specific Situation]...") *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="When I sit down at my desk and feel the urge to check social media or procrastinate..."
                    value={triggerCue}
                    onChange={(e) => setTriggerCue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Step 1 (Effortless tiny start)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Open LeetCode, take 1 deep breath, read problem title."
                      value={step1}
                      onChange={(e) => setStep1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Step 2 (Build momentum)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Sketch brute force & 2 test cases on paper."
                      value={step2}
                      onChange={(e) => setStep2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Step 3 (Lock-in flow)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Code optimal solution and log active recall notes."
                      value={step3}
                      onChange={(e) => setStep3(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Mental Movie Simulation */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Vivid Mental Movie Simulation (Sensory Scene)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Describe your physical environment, posture, calmness, and effortless execution as if watching a movie of yourself.
                  </p>
                  <textarea
                    rows={2}
                    placeholder="I see myself sitting upright with clean water nearby, phone in another room, calmly sketching edge cases on paper with total composure."
                    value={movieSceneDescription}
                    onChange={(e) => setMovieSceneDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1b382b] hover:bg-[#244b3a] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save DMN Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
