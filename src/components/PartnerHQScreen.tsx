import React, { useState, useEffect } from 'react';
import { TaskItem, PartnerReward, PartnerNote, PartnerNudge } from '../types';
import {
  Heart,
  Eye,
  Timer,
  Wind,
  Droplets,
  Brain,
  Sparkles,
  Gift,
  Mic,
  Ticket,
  Image as ImageIcon,
  Calendar,
  Check,
  Send,
  Plus,
  Lock,
  Unlock,
  Volume2,
  Smile,
  PartyPopper,
  MessageCircleHeart,
  ArrowRight,
  RefreshCw,
  Camera,
  Paperclip,
  X,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  grantRewardInFirestore,
  sendPartnerNoteToFirestore,
  sendPartnerNudgeToFirestore,
} from '../lib/firestoreService';

interface PartnerHQScreenProps {
  currentTask: TaskItem | null;
  tasks: TaskItem[];
  partnerRewards: PartnerReward[];
  partnerNotes: PartnerNote[];
  onSwitchToKunal: () => void;
  onShowToast: (msg: string) => void;
  onSendNote?: (note: PartnerNote) => void;
  onGrantReward?: (reward: PartnerReward) => void;
}

export const PartnerHQScreen: React.FC<PartnerHQScreenProps> = ({
  currentTask,
  tasks,
  partnerRewards,
  partnerNotes,
  onSwitchToKunal,
  onShowToast,
  onSendNote,
  onGrantReward,
}) => {
  const [activeNudgeSending, setActiveNudgeSending] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteEmoji, setNewNoteEmoji] = useState('💖');
  const [noteImageUrl, setNoteImageUrl] = useState('');
  const [showRewardModal, setShowRewardModal] = useState(false);

  const handleNoteImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNoteImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardCategory, setRewardCategory] = useState<'treat' | 'coupon' | 'date' | 'kiss'>('coupon');
  const [rewardNote, setRewardNote] = useState('');

  // Audio Recording State
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedAudioUrl(null);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      onShowToast('Could not access microphone! 🎙️');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // 14-day (2-week) milestone roadmap state using Monday - Sunday
  const [streakDays, setStreakDays] = useState([
    { day: 'Mon', completed: true, label: 'W1 Monday' },
    { day: 'Tue', completed: true, label: 'W1 Tuesday' },
    { day: 'Wed', completed: true, label: 'W1 Wednesday' },
    { day: 'Thu', completed: true, label: 'W1 Thursday' },
    { day: 'Fri', completed: true, label: 'W1 Friday' },
    { day: 'Sat', completed: true, label: 'W1 Saturday' },
    { day: 'Sun 🎉', completed: true, label: 'Week 1 Complete' },
    { day: 'Mon', completed: true, label: 'W2 Monday' },
    { day: 'Tue', completed: true, label: 'W2 Tuesday' },
    { day: 'Wed', completed: true, label: 'W2 Wednesday' },
    { day: 'Thu', completed: false, isCurrent: true, label: 'W2 Thursday (Today)' },
    { day: 'Fri', completed: false, label: 'W2 Friday' },
    { day: 'Sat', completed: false, label: 'W2 Saturday' },
    { day: 'Sun 🎉', completed: false, isMilestone: true, label: '2-Week Meetup 🎉' },
  ]);

  // Handle Quick Gentle Nudge
  const handleSendNudge = async (
    type: 'breathe' | 'water' | 'focus' | 'proud',
    label: string,
    emoji: string
  ) => {
    setActiveNudgeSending(type);
    const nudge: PartnerNudge = {
      id: `nudge-${Date.now()}`,
      type,
      label,
      emoji,
      timestamp: Date.now(),
      fromName: 'Your Girlfriend 💖',
    };

    await sendPartnerNudgeToFirestore(nudge);
    onShowToast(`Sent "${label}" support nudge to Kunal! 💌`);
    setTimeout(() => setActiveNudgeSending(null), 1200);
  };

  // Handle Send Love Note
  const handleSendLoveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const note: PartnerNote = {
      id: `note-${Date.now()}`,
      author: 'Partner HQ 💖',
      message: newNoteText.trim(),
      timestamp: Date.now(),
      emoji: newNoteEmoji,
      isRead: false,
      imageUrl: noteImageUrl.trim() || undefined,
      audioDataUrl: recordedAudioUrl || undefined,
    };

    if (onSendNote) {
      onSendNote(note);
    }
    await sendPartnerNoteToFirestore(note);
    setNewNoteText('');
    setNoteImageUrl('');
    setRecordedAudioUrl(null);
    onShowToast('Encouragement note & audio posted to Kunal’s focus vault! 💕');
  };

  // Handle Stage Reward
  const handleStageReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle.trim()) return;

    const newReward: PartnerReward = {
      id: `reward-${Date.now()}`,
      title: rewardTitle.trim(),
      description: rewardNote.trim() || 'Unlocks when Kunal finishes his current task sprint!',
      category: rewardCategory,
      icon: rewardCategory === 'kiss' ? 'heart' : rewardCategory === 'coupon' ? 'ticket' : 'gift',
      requiredPoints: 0,
      unlockedAt: Date.now(),
      isRedeemed: false,
      noteFromPartner: rewardNote.trim(),
      grantedBy: 'Partner HQ 💖',
      createdAt: Date.now(),
      audioDataUrl: recordedAudioUrl || undefined,
    };

    if (onGrantReward) {
      onGrantReward(newReward);
    }
    await grantRewardInFirestore(newReward);
    setRewardTitle('');
    setRewardNote('');
    setRecordedAudioUrl(null);
    setShowRewardModal(false);
    onShowToast('🎁 Reward & audio staged in Vault!');
  };

  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const activeTaskTitle = currentTask?.title || 'Generative AI & DSA Practice Sprint';
  const estimatedTime = currentTask?.estimatedMinutes || 25;

  return (
    <main
      id="screen-partner-hq"
      className="flex-1 md:ml-64 flex flex-col items-center px-4 sm:px-8 md:px-12 max-w-5xl mx-auto w-full min-h-screen pb-28 md:pb-12"
    >
      {/* 🌸 Partner Dashboard Header */}
      <header className="w-full mt-2 mb-6">
        <div className="bg-gradient-to-r from-[#43664c] via-[#38553f] to-[#006494] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                  Partner HQ &bull; Live Support
                </span>
                <span className="bg-pink-500/30 text-pink-100 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Girlfriend Mode
                </span>
              </div>

              <h1 className="text-[26px] sm:text-[34px] font-extrabold tracking-tight leading-tight">
                Supporting Kunal's Flow
              </h1>

              <p className="text-white/90 text-[14px] sm:text-[16px] mt-2 font-medium leading-relaxed">
                A gentle, distraction-free command center to see what Kunal is focusing on, send low-friction nudges, and stage sweet rewards.
              </p>
            </div>

            {/* Switch User Button */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={onSwitchToKunal}
                className="bg-white hover:bg-slate-100 text-[#43664c] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <UserCheck className="w-4 h-4 text-[#43664c]" />
                <span>Switch to Kunal's View</span>
              </button>
              <span className="text-[11px] text-center text-white/80">
                Connected &bull; Real-time Sync
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 🚀 Section 1: Live Focus Tracker & Gentle Nudge Controls (Side by Side) */}
      <section className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Live Focus Tracker Card */}
        <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2 text-[#545f72]">
              <Eye className="w-4 h-4 text-[#43664c]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#545f72]">
                Kunal's Live Status
              </h2>
            </div>
            <span className="bg-[#8bb192]/20 text-[#22442c] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#43664c] animate-pulse"></span>
              Locked In Focus
            </span>
          </div>

          <div className="space-y-1 mb-6">
            <p className="text-xs font-semibold text-[#545f72] uppercase tracking-wider">
              Currently working on:
            </p>
            <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#181c1e] leading-snug">
              {activeTaskTitle}
            </h3>
            {currentTask?.goalSource && (
              <span className="inline-block text-xs font-semibold text-[#006494] bg-[#cbe6ff]/40 px-2.5 py-0.5 rounded-md mt-1">
                {currentTask.goalSource}
              </span>
            )}
          </div>

          {/* Time Block & Visual Progress Dots */}
          <div className="mt-auto pt-4 border-t border-[#c2c8c0]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-[#43664c]" />
              <span className="text-xl font-black font-mono text-[#43664c]">
                {estimatedTime}:00
              </span>
              <span className="text-xs text-[#545f72]">active sprint</span>
            </div>

            {/* 4 Visual Progress Segments */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-2 rounded-full bg-[#43664c]"></div>
              <div className="w-6 h-2 rounded-full bg-[#43664c]"></div>
              <div className="w-6 h-2 rounded-full bg-[#8bb192]"></div>
              <div className="w-6 h-2 rounded-full bg-[#ebeef0]"></div>
            </div>
          </div>
        </div>

        {/* 2. Gentle Nudge Controls */}
        <div className="bg-[#f8faf9] border border-[#c2c8c0]/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#545f72]">
                Gentle Support Nudges
              </h2>
            </div>
            <span className="text-[11px] text-[#545f72]">Instant live notification</span>
          </div>

          <p className="text-xs text-[#545f72] mb-4">
            Send a low-friction signal of support without breaking his deep coding momentum:
          </p>

          {/* 4 Nudge Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSendNudge('breathe', 'Take a calm breath 🌬️', '🌬️')}
              disabled={activeNudgeSending !== null}
              className="min-h-[56px] flex items-center justify-center gap-2 bg-white hover:bg-[#ebeef0] hover:border-[#43664c] border border-[#c2c8c0] rounded-2xl transition-all text-[#181c1e] text-sm font-bold shadow-xs cursor-pointer active:scale-95 group"
            >
              <Wind className="w-4 h-4 text-[#545f72] group-hover:text-[#43664c] transition-colors" />
              <span>Breathe</span>
            </button>

            <button
              onClick={() => handleSendNudge('water', 'Drink some cold water 💧', '💧')}
              disabled={activeNudgeSending !== null}
              className="min-h-[56px] flex items-center justify-center gap-2 bg-white hover:bg-[#ebeef0] hover:border-[#006494] border border-[#c2c8c0] rounded-2xl transition-all text-[#181c1e] text-sm font-bold shadow-xs cursor-pointer active:scale-95 group"
            >
              <Droplets className="w-4 h-4 text-[#006494] group-hover:scale-110 transition-transform" />
              <span>Water</span>
            </button>

            <button
              onClick={() => handleSendNudge('focus', 'You got this, stay in the zone 🧠', '🧠')}
              disabled={activeNudgeSending !== null}
              className="min-h-[56px] flex items-center justify-center gap-2 bg-white hover:bg-[#ebeef0] hover:border-purple-600 border border-[#c2c8c0] rounded-2xl transition-all text-[#181c1e] text-sm font-bold shadow-xs cursor-pointer active:scale-95 group"
            >
              <Brain className="w-4 h-4 text-purple-700 group-hover:scale-110 transition-transform" />
              <span>Focus</span>
            </button>

            <button
              onClick={() => handleSendNudge('proud', 'So proud of your hard work! 💖', '💖')}
              disabled={activeNudgeSending !== null}
              className="min-h-[56px] flex items-center justify-center gap-2 bg-[#43664c] text-white hover:bg-[#38553f] border border-transparent rounded-2xl transition-all text-sm font-bold shadow-xs cursor-pointer active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Proud 💖</span>
            </button>
          </div>
        </div>
      </section>

      {/* 📅 Section 2: 2-Week Milestone Builder ("Road to 2-Week Meetup") */}
      <section className="w-full mb-8 bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#181c1e]">
              Road to 2-Week Meetup 💑 (14 Days)
            </h2>
            <p className="text-xs sm:text-sm text-[#545f72] mt-0.5">
              Building momentum together over 2 weeks, one focused day at a time.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#8bb192]/20 flex items-center justify-center text-[#43664c]">
            <PartyPopper className="w-6 h-6" />
          </div>
        </div>

        {/* Horizontal Timeline / Streak for 14 Days */}
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="relative flex justify-between items-center min-w-[700px] w-full px-2 py-4">
            {/* Background Connecting Line */}
            <div className="absolute left-[3%] right-[3%] top-1/2 -translate-y-1/2 h-[3px] bg-[#ebeef0] z-0"></div>
            {/* Active Progress Line */}
            <div className="absolute left-[3%] top-1/2 -translate-y-1/2 h-[3px] bg-[#43664c] z-0" style={{ width: '75%' }}></div>

            {/* 14 Days */}
            {streakDays.map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                {item.completed ? (
                  <div className="w-8 h-8 rounded-full bg-[#43664c] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : item.isCurrent ? (
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-[#43664c] flex items-center justify-center shadow-xs">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#43664c] animate-pulse"></div>
                  </div>
                ) : item.isMilestone ? (
                  <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-300 text-amber-700 flex items-center justify-center shadow-xs">
                    <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#ebeef0] border border-[#c2c8c0] flex items-center justify-center"></div>
                )}
                <span className={`text-[11px] font-bold whitespace-nowrap ${item.isCurrent ? 'text-[#43664c]' : 'text-[#545f72]'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💌 Section 4: Love Notes & Encouragement Wall */}
      <section className="w-full bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="w-5 h-5 text-pink-600" />
            <h2 className="text-[18px] font-extrabold text-[#181c1e]">
              Write a Love Note for Kunal
            </h2>
          </div>
          <span className="text-xs text-[#545f72]">Appears in his Focus Flow</span>
        </div>

        <form onSubmit={handleSendLoveNote} className="space-y-3">
          <div className="flex items-center gap-2">
            {['💖', '🔥', '🚀', '🥰', '⭐', '☕', '👑'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setNewNoteEmoji(emoji)}
                className={`text-lg p-2 rounded-xl transition-all cursor-pointer ${
                  newNoteEmoji === emoji ? 'bg-pink-100 scale-110 shadow-xs ring-2 ring-pink-400' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Voice Note Recorder Option */}
          <div className="bg-[#fcf8f8] border border-pink-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-pink-900 flex items-center gap-1">
                <Mic className="w-4 h-4 text-pink-600" />
                Add a Congratulations Voice Note
              </p>
              <p className="text-[11px] text-[#545f72] mt-0.5">
                Kunal will hear your real voice when he completes his task!
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isRecording && !recordedAudioUrl && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Start Recording</span>
                </button>
              )}

              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-pulse transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Stop ({recordingSeconds}s)</span>
                </button>
              )}

              {recordedAudioUrl && (
                <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 p-1.5 rounded-xl">
                  <audio src={recordedAudioUrl} controls className="h-8 max-w-[160px]" />
                  <button
                    type="button"
                    onClick={() => setRecordedAudioUrl(null)}
                    className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Delete recording"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Photo Preview if attached */}
          {noteImageUrl && (
            <div className="relative inline-block mt-2 mb-1">
              <img
                src={noteImageUrl}
                alt="Attached photo"
                className="w-24 h-24 object-cover rounded-2xl border-2 border-pink-300 shadow-md"
              />
              <button
                type="button"
                onClick={() => setNoteImageUrl('')}
                className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g., 'You're doing amazing Kunal! Can't wait for our weekend meetup ❤️'"
              className="flex-1 bg-[#f8faf9] border border-[#c2c8c0] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#43664c]"
            />

            {/* Photo Attachment Button */}
            <label
              className="p-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 rounded-2xl cursor-pointer flex items-center justify-center transition-all shrink-0"
              title="Attach a photo/picture"
            >
              <Camera className="w-5 h-5 text-pink-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleNoteImageUpload}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={!newNoteText.trim() && !noteImageUrl && !recordedAudioUrl}
              className="bg-[#43664c] hover:bg-[#38553f] text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Send Note</span>
            </button>
          </div>
        </form>

        {/* Existing Notes Feed */}
        {partnerNotes.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <p className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider">
              Recent Notes &amp; Photos Sent:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {partnerNotes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  className="bg-[#fef9f9] border border-pink-100 p-3 rounded-2xl flex items-start gap-2.5"
                >
                  <span className="text-xl">{note.emoji || '💖'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#181c1e] font-medium leading-snug">
                      "{note.message}"
                    </p>
                    {note.imageUrl && (
                      <img
                        src={note.imageUrl}
                        alt="Attached photo"
                        className="mt-2 w-full h-32 object-cover rounded-xl border border-pink-200 shadow-xs"
                      />
                    )}
                    {note.audioDataUrl && (
                      <div className="mt-2">
                        <audio src={note.audioDataUrl} controls className="h-8 w-full max-w-[180px]" />
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Modal: Stage New Reward */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-[#181c1e] flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#43664c]" />
                Stage Reward in Vault
              </h3>
              <button
                onClick={() => setShowRewardModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStageReward} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#545f72] uppercase block mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  placeholder="e.g. 1 Free Boba Coffee or Movie Choice"
                  className="w-full bg-[#f8faf9] border border-[#c2c8c0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#43664c]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#545f72] uppercase block mb-1">
                  Reward Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRewardCategory('coupon')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      rewardCategory === 'coupon' ? 'bg-[#43664c] text-white border-[#43664c]' : 'bg-white border-gray-200 text-[#545f72]'
                    }`}
                  >
                    🎟️ Coupon
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewardCategory('treat')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      rewardCategory === 'treat' ? 'bg-[#43664c] text-white border-[#43664c]' : 'bg-white border-gray-200 text-[#545f72]'
                    }`}
                  >
                    🍰 Food/Treat
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewardCategory('date')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      rewardCategory === 'date' ? 'bg-[#43664c] text-white border-[#43664c]' : 'bg-white border-gray-200 text-[#545f72]'
                    }`}
                  >
                    💑 Date/Meet
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#545f72] uppercase block mb-1">
                  Sweet Note
                </label>
                <textarea
                  rows={3}
                  value={rewardNote}
                  onChange={(e) => setRewardNote(e.target.value)}
                  placeholder="Personal note for him..."
                  className="w-full bg-[#f8faf9] border border-[#c2c8c0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#43664c]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#43664c] hover:bg-[#38553f] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Stage in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
