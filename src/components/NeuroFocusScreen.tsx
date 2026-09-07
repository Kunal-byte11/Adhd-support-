import React, { useState, useEffect } from 'react';
import {
  Brain,
  Headphones,
  Sparkles,
  Wind,
  Target,
  ShieldCheck,
  Trash2,
  Plus,
  Volume2,
  VolumeX,
  Play,
  Pause,
  BookOpen,
  Search,
  Copy,
  Check,
  LayoutGrid,
  PlayCircle,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { IWoopGoal, ISessionRecall, BinauralSoundMode, StudyTheaterVideo } from '../types';
import { neuroAudio } from '../lib/audioSynthesizer';
import {
  deleteWoopGoalFromFirestore,
  subscribeRecallLogs,
  saveRecallLogToFirestore,
  deleteRecallLogFromFirestore,
} from '../lib/firestoreService';
import {
  getCurriculumVideoById,
  parseTimestampToSeconds,
  formatSecondsToTimestamp,
  parseMarkdownToTimestampNotes,
} from '../data/curriculumData';
import { WoopBoardModal } from './WoopBoardModal';
import { PhysiologicalSighGuide } from './PhysiologicalSighGuide';
import { parseWoopPlan } from '../lib/woopUtils';

interface NeuroFocusScreenProps {
  woopGoals: IWoopGoal[];
  onOpenWoopModal?: () => void;
  onWatchVideo?: (video: StudyTheaterVideo) => void;
}

export const NeuroFocusScreen: React.FC<NeuroFocusScreenProps> = ({
  woopGoals,
  onOpenWoopModal,
  onWatchVideo,
}) => {
  // Mode: 'all' (Modular Independent Dashboard) or specific focused tabs
  const [activeTab, setActiveTab] = useState<'all' | 'sounds' | 'breathing' | 'woop' | 'recalls'>('all');

  // Sound Engine State (Persistent across all tabs)
  const [soundMode, setSoundMode] = useState<BinauralSoundMode>('off');
  const [volume, setVolume] = useState<number>(0.6);

  // WOOP Modal State
  const [isWoopModalOpen, setIsWoopModalOpen] = useState(false);

  // Recalls State (Synced from Firestore + LocalStorage)
  const [recallLogs, setRecallLogs] = useState<ISessionRecall[]>([]);
  const [recallSearchQuery, setRecallSearchQuery] = useState<string>('');
  const [recallFilterSubject, setRecallFilterSubject] = useState<string>('all');
  const [copiedRecallId, setCopiedRecallId] = useState<string | null>(null);

  // Direct Recall Authoring Form State
  const [isCreatingRecall, setIsCreatingRecall] = useState<boolean>(false);
  const [newRecallSubject, setNewRecallSubject] = useState<string>('DSA & Algorithms');
  const [newRecallTitle, setNewRecallTitle] = useState<string>('');
  const [newRecallContent, setNewRecallContent] = useState<string>('');
  const [isSavingDirectRecall, setIsSavingDirectRecall] = useState<boolean>(false);

  // Subscribe to recalls from local + remote sources
  useEffect(() => {
    const unsub = subscribeRecallLogs((logs) => {
      setRecallLogs(logs);
    });
    return () => unsub();
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    neuroAudio.setVolume(val);
  };

  const handleSoundToggle = (mode: BinauralSoundMode) => {
    if (soundMode === mode) {
      neuroAudio.setMode('off');
      setSoundMode('off');
    } else {
      neuroAudio.setMode(mode);
      setSoundMode(mode);
    }
  };

  const handleDeleteWoop = async (id: string) => {
    await deleteWoopGoalFromFirestore(id);
  };

  const handleDeleteRecall = async (id: string) => {
    await deleteRecallLogFromFirestore(id);
  };

  const handleCopyRecall = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecallId(id);
    setTimeout(() => setCopiedRecallId(null), 2000);
  };

  const handleSaveDirectRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecallTitle.trim() || !newRecallContent.trim()) return;

    setIsSavingDirectRecall(true);
    try {
      const record: ISessionRecall = {
        id: 'direct_recall_' + Date.now(),
        subject: newRecallSubject,
        topicTitle: newRecallTitle.trim(),
        recallContent: newRecallContent.trim(),
        durationMinutes: 15,
        phoneDistanced: true,
        microRestsCompleted: 1,
        createdAt: Date.now(),
      };
      await saveRecallLogToFirestore(record);
      setNewRecallTitle('');
      setNewRecallContent('');
      setIsCreatingRecall(false);
    } catch (err) {
      console.warn('Error saving direct recall:', err);
    } finally {
      setIsSavingDirectRecall(false);
    }
  };

  // Filtered recall logs
  const filteredRecalls = recallLogs.filter((log) => {
    const matchesQuery =
      log.topicTitle.toLowerCase().includes(recallSearchQuery.toLowerCase()) ||
      log.recallContent.toLowerCase().includes(recallSearchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(recallSearchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (recallFilterSubject === 'all') return true;
    if (recallFilterSubject === 'video') return log.id.startsWith('video_note_');
    if (recallFilterSubject === 'sem7') return log.id.startsWith('recall_') && !log.id.startsWith('direct_');
    if (recallFilterSubject === 'direct') return log.id.startsWith('direct_');
    return log.subject.toLowerCase().includes(recallFilterSubject.toLowerCase());
  });

  return (
    <main className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full font-sans">
      {/* Top Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Brain className="w-3.5 h-3.5" />
              Dr. Andrew Huberman Protocols
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            Neuro Focus Engine
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            Independent biology-backed modules for continuous Gamma entrainment, mental contrasting, autonomic resets, and active recall memory.
          </p>
        </div>

        {/* Global Live Audio & Session HUD */}
        <div className="bg-white border border-[#c2c8c0] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center gap-4 self-start md:self-auto">
          {/* Audio Quick Controller */}
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl flex items-center justify-center font-bold text-sm ${
              soundMode !== 'off' ? 'bg-violet-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'
            }`}>
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Focus Audio</span>
              <span className="text-xs font-bold text-[#181c1e] font-mono">
                {soundMode === 'binaural-40hz' ? '🧠 40Hz Gamma' : soundMode === 'brown-noise' ? '🌊 Brown Noise' : soundMode === 'pink-noise' ? '🌸 Pink Noise' : 'Muted'}
              </span>
            </div>
          </div>

          {soundMode !== 'off' && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#43664c]"
              />
              <button
                onClick={() => handleSoundToggle('off')}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="Mute audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          {/* Recalls Count Pill */}
          <div className="flex items-center gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Recalls &amp; Notes</span>
              <span className="text-xs font-extrabold text-emerald-700 font-mono">{recallLogs.length} Logged</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Mode Switcher: All Independent Dashboard vs Dedicated Tabs */}
      <div className="flex flex-wrap border-b border-[#c2c8c0] mb-6 gap-1 sm:gap-2">
        {[
          { id: 'all', label: 'All Sections (Dashboard)', icon: LayoutGrid, color: 'text-[#43664c]' },
          { id: 'sounds', label: '40 Hz Focus Sounds', icon: Headphones, color: 'text-violet-600' },
          { id: 'breathing', label: 'Physiological Sigh', icon: Wind, color: 'text-cyan-700' },
          { id: 'woop', label: `WOOP Board (${woopGoals.length})`, icon: Target, color: 'text-emerald-700' },
          { id: 'recalls', label: `Active Recalls (${recallLogs.length})`, icon: BookOpen, color: 'text-[#006494]' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#181c1e] text-[#181c1e] bg-white rounded-t-xl shadow-2xs font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= MODULAR SECTIONS ================= */}
      <div className="space-y-8">
        {/* ================= 1. 40 HZ AUDIO SYNTHESIZER ================= */}
        {(activeTab === 'all' || activeTab === 'sounds') && (
          <section className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center font-bold text-lg">
                  🎧
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#181c1e] flex items-center gap-2">
                    HTML5 Web Audio Synthesizer
                    {soundMode !== 'off' && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-mono animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-[#545f72]">
                    Synthesizes acoustic frequencies in real-time. Runs independently in the background while you study.
                  </p>
                </div>
              </div>

              {soundMode !== 'off' && (
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-xs font-bold text-slate-700 font-mono">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#43664c]"
                  />
                  <button
                    onClick={() => handleSoundToggle('off')}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Mute audio"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Sound Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: 40Hz Gamma */}
              <div
                onClick={() => handleSoundToggle('binaural-40hz')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  soundMode === 'binaural-40hz'
                    ? 'bg-violet-50 border-violet-400 shadow-sm ring-2 ring-violet-400'
                    : 'bg-white border-[#c2c8c0] hover:border-violet-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🧠</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                      soundMode === 'binaural-40hz' ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-800'
                    }`}>
                      {soundMode === 'binaural-40hz' ? 'PLAYING NOW' : '40 Hz GAMMA'}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#181c1e] mb-1">
                    40 Hz Binaural Beats
                  </h3>
                  <p className="text-xs text-[#545f72] leading-relaxed">
                    Left 400Hz / Right 440Hz. Prefrontal Gamma entrainment for acetylcholine &amp; dopamine release.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-violet-800 font-mono">Headphones Req.</span>
                  <button className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    soundMode === 'binaural-40hz' ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                  }`}>
                    {soundMode === 'binaural-40hz' ? 'Stop' : 'Start Beats'}
                  </button>
                </div>
              </div>

              {/* Card 2: Brown Noise */}
              <div
                onClick={() => handleSoundToggle('brown-noise')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  soundMode === 'brown-noise'
                    ? 'bg-amber-50 border-amber-400 shadow-sm ring-2 ring-amber-400'
                    : 'bg-white border-[#c2c8c0] hover:border-amber-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🌊</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                      soundMode === 'brown-noise' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {soundMode === 'brown-noise' ? 'PLAYING NOW' : 'BROWNIAN RUMBLE'}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#181c1e] mb-1">
                    Deep Brown Noise
                  </h3>
                  <p className="text-xs text-[#545f72] leading-relaxed">
                    Low-pass waterfall rumble. Eliminates background room noise for cozy sensory isolation.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 font-mono">Sensory Isolation</span>
                  <button className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    soundMode === 'brown-noise' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}>
                    {soundMode === 'brown-noise' ? 'Stop' : 'Start Noise'}
                  </button>
                </div>
              </div>

              {/* Card 3: Pink Noise */}
              <div
                onClick={() => handleSoundToggle('pink-noise')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  soundMode === 'pink-noise'
                    ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-400'
                    : 'bg-white border-[#c2c8c0] hover:border-rose-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🌸</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                      soundMode === 'pink-noise' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {soundMode === 'pink-noise' ? 'PLAYING NOW' : '1/F PINK NOISE'}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#181c1e] mb-1">
                    Balanced Pink Noise
                  </h3>
                  <p className="text-xs text-[#545f72] leading-relaxed">
                    Natural gentle rainfall frequencies. Calms restlessness while maintaining alert wakefulness.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-800 font-mono">Steady Rain</span>
                  <button className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    soundMode === 'pink-noise' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}>
                    {soundMode === 'pink-noise' ? 'Stop' : 'Start Noise'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= 2. PHYSIOLOGICAL SIGH & WOOP SPLIT/SECTION ================= */}
        {(activeTab === 'all' || activeTab === 'breathing' || activeTab === 'woop') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Physiological Sigh Autonomic Reset */}
            {(activeTab === 'all' || activeTab === 'breathing') && (
              <section className={`${activeTab === 'all' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between`}>
                <PhysiologicalSighGuide />
              </section>
            )}

            {/* Right: WOOP Urgency Board */}
            {(activeTab === 'all' || activeTab === 'woop') && (
              <section className={`${activeTab === 'all' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[#181c1e]">WOOP Urgency Anchors</h2>
                        <p className="text-[11px] text-[#545f72]">Mental contrasting &amp; implementation intentions</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsWoopModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#43664c] hover:bg-[#34513c] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New anchor
                    </button>
                  </div>

                  {woopGoals.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-700" />
                      <p className="text-xs font-semibold text-slate-600">No active WOOP intentions</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Create a 2-minute anchor before diving into deep work.</p>
                      <button
                        onClick={() => setIsWoopModalOpen(true)}
                        className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition cursor-pointer"
                      >
                        + Create first anchor
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                      {woopGoals.map((g) => {
                        const parsed = parseWoopPlan(g.plan, g.obstacle);
                        return (
                          <div
                            key={g.id}
                            className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all shadow-2xs relative group"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                                {g.targetSubject || 'General'}
                              </span>
                              <button
                                onClick={() => handleDeleteWoop(g.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                                title="Delete goal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h4 className="text-xs font-bold text-[#181c1e] mb-2">{g.wish}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                                  <span className="text-[10px] text-slate-500 font-medium">Outcome</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-[11px]">{g.outcome}</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                                  <span className="text-[10px] text-slate-500 font-medium">Obstacle</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-[11px]">{g.obstacle}</p>
                              </div>
                            </div>
                            <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px]">
                              <p className="font-medium text-emerald-800 mb-0.5">{parsed.condition}</p>
                              {parsed.action && (
                                <p className="font-medium text-slate-900 leading-relaxed">{parsed.action}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ================= 3. ACTIVE RECALL MEMORY ARCHIVE ================= */}
        {(activeTab === 'all' || activeTab === 'recalls') && (
          <section className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs">
            {/* Header with Search, Filter & New Recall button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#006494]/10 border border-[#006494]/20 text-[#006494] flex items-center justify-center font-bold text-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#181c1e] flex items-center gap-2">
                    Active Recall Memory Archive &amp; Notes
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {recallLogs.length} Records Synced
                    </span>
                  </h2>
                  <p className="text-xs text-[#545f72]">
                    Testing effect notes retrieved from memory &bull; Auto-synced with YouTube Study Theater &amp; Sem 7 sprints.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsCreatingRecall(!isCreatingRecall)}
                  className="px-3.5 py-2 rounded-xl bg-[#006494] hover:bg-[#004e75] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {isCreatingRecall ? 'Close Creator' : 'Write Recall Note'}
                </button>
              </div>
            </div>

            {/* Direct Recall Creator Drawer */}
            {isCreatingRecall && (
              <form
                onSubmit={handleSaveDirectRecall}
                className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#006494]" />
                    Write Direct Memory Recall
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Dr. Roediger Testing Effect</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Subject / Domain</label>
                    <input
                      type="text"
                      value={newRecallSubject}
                      onChange={(e) => setNewRecallSubject(e.target.value)}
                      placeholder="e.g. DSA & Algorithms, Generative AI, Cloud..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#006494]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Topic / Lecture Title</label>
                    <input
                      type="text"
                      value={newRecallTitle}
                      onChange={(e) => setNewRecallTitle(e.target.value)}
                      placeholder="e.g. Binary Search Tree Inversion, RAG Architecture..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#006494]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    What did you learn? (Write purely from memory without looking at notes)
                  </label>
                  <textarea
                    value={newRecallContent}
                    onChange={(e) => setNewRecallContent(e.target.value)}
                    placeholder="Write key mechanisms, formulas, intuition, and edge cases here..."
                    rows={4}
                    className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#006494] resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCreatingRecall(false)}
                    className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDirectRecall || !newRecallTitle.trim() || !newRecallContent.trim()}
                    className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isSavingDirectRecall ? 'Saving...' : 'Save to Archive'}
                  </button>
                </div>
              </form>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={recallSearchQuery}
                  onChange={(e) => setRecallSearchQuery(e.target.value)}
                  placeholder="Search recall notes by keyword or concept..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#006494] font-medium"
                />
              </div>

              {/* Subject Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Notes' },
                  { id: 'video', label: '🎬 Video Theater' },
                  { id: 'sem7', label: '⚡ Sem 7 Sprints' },
                  { id: 'direct', label: '📝 Direct Entries' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setRecallFilterSubject(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      recallFilterSubject === f.id
                        ? 'bg-[#181c1e] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recalls Grid */}
            {filteredRecalls.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-100">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#006494]" />
                <h3 className="text-sm font-bold text-slate-700">No matching recall notes found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Type notes inside the In-App YouTube Study Theater or click &quot;Write Recall Note&quot; above to add your first summary.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecalls.map((log) => {
                  const isVideoNote = log.id.startsWith('video_note_');
                  const isSem7Note = log.id.startsWith('recall_') && !log.id.startsWith('direct_');
                  const wordCount = log.recallContent.trim() ? log.recallContent.trim().split(/\s+/).length : 0;
                  const videoObj = isVideoNote ? getCurriculumVideoById(log.id) : null;

                  // Structured timestamp notes
                  const tNotes =
                    log.timestampNotes && log.timestampNotes.length > 0
                      ? log.timestampNotes
                      : parseMarkdownToTimestampNotes(log.recallContent);

                  const hasRevisitFlag =
                    log.recallContent.includes('⚠️') ||
                    log.recallContent.toLowerCase().includes('revisit') ||
                    tNotes.some((n) => n.isRevisit);

                  return (
                    <div
                      key={log.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                              isVideoNote
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isSem7Note
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {isVideoNote ? '🎬 THEATER NOTE' : isSem7Note ? '⚡ SEM 7 BOUT' : '📝 DIRECT RECALL'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 font-mono">
                              {log.subject}
                            </span>
                            {hasRevisitFlag && (
                              <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                                <span>⚠️</span> Revisit
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopyRecall(log.id, log.recallContent)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                              title="Copy to clipboard"
                            >
                              {copiedRecallId === log.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteRecall(log.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete recall note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-sm font-extrabold text-[#181c1e] mb-2 leading-snug">
                          {log.topicTitle}
                        </h3>

                        {/* If Structured Notes exist, render them cleanly */}
                        {tNotes.length > 0 ? (
                          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 mb-2.5">
                            {tNotes.map((n, nIdx) => (
                              <div
                                key={n.id || nIdx}
                                className={`p-2 rounded-xl text-xs font-mono border flex items-start justify-between gap-2 ${
                                  n.isRevisit
                                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                                    : 'bg-white border-slate-200 text-slate-800'
                                }`}
                              >
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  {videoObj && onWatchVideo ? (
                                    <button
                                      onClick={() => {
                                        onWatchVideo({ ...videoObj, startSeconds: n.timestampSeconds });
                                      }}
                                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-rose-600 hover:text-white text-emerald-700 text-[10px] font-mono font-bold shrink-0 flex items-center gap-1 transition cursor-pointer border border-slate-300"
                                      title="Jump video to this timestamp"
                                    >
                                      <PlayCircle className="w-3 h-3 text-rose-500" />
                                      <span>{n.timestampFormatted}</span>
                                    </button>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold shrink-0">
                                      {n.timestampFormatted}
                                    </span>
                                  )}
                                  <p className="flex-1 min-w-0 text-[11px] leading-relaxed break-words">
                                    {n.note}
                                  </p>
                                </div>
                                {n.isRevisit && (
                                  <span className="text-[10px] font-bold text-amber-700 shrink-0">
                                    ⚠️
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                            {log.recallContent}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                        <span>
                          {tNotes.length > 0 ? `${tNotes.length} timestamp notes` : `${wordCount} words`} &bull; {log.durationMinutes > 0 ? `${log.durationMinutes}m focus` : 'Logged'}
                        </span>

                        <div className="flex items-center gap-2">
                          {videoObj && onWatchVideo && (
                            <button
                              onClick={() => {
                                const startSec = tNotes.length > 0 ? tNotes[0].timestampSeconds : 0;
                                onWatchVideo({ ...videoObj, startSeconds: startSec });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                            >
                              <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Revisit 🎬</span>
                            </button>
                          )}
                          <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* WOOP Modal */}
      <WoopBoardModal
        isOpen={isWoopModalOpen}
        onClose={() => setIsWoopModalOpen(false)}
        goals={woopGoals}
      />
    </main>
  );
};
