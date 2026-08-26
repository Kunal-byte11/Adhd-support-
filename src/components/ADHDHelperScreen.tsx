import React, { useState } from 'react';
import { TaskItem, UrgeLog, PartnerReward, PartnerNote } from '../types';
import {
  Heart,
  Gift,
  Sparkles,
  Coffee,
  Award,
  Flame,
  CheckCircle2,
  Send,
  Star,
  PartyPopper,
  Utensils,
  Film,
  Gamepad2,
  Trash2,
  Check,
  Plus,
  Smile,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ADHDHelperScreenProps {
  tasks: TaskItem[];
  urges: UrgeLog[];
  completedCurriculumCount: number;
  rewards: PartnerReward[];
  partnerNotes: PartnerNote[];
  onGrantReward: (reward: PartnerReward) => void;
  onToggleRedeemed: (rewardId: string, isRedeemed: boolean) => void;
  onDeleteReward: (rewardId: string) => void;
  onSendNote: (note: PartnerNote) => void;
}

const PRESET_GIFTS = [
  {
    title: 'Favorite Coffee / Matcha Latte Treat',
    description: 'Fresh warm or iced beverage delivered right to your study desk.',
    category: 'treat' as const,
    icon: 'coffee',
    defaultNote: 'Proud of your hard work! Enjoy a fresh drink ☕💚',
  },
  {
    title: '30-Min Head & Shoulder Massage',
    description: 'Full tension relief to reset mental fatigue after intense coding.',
    category: 'massage' as const,
    icon: 'heart',
    defaultNote: 'You concentrated so well, time to relax your neck & shoulders 💆',
  },
  {
    title: 'Date Night Dinner of Your Choice',
    description: 'You pick the restaurant and cuisine, no questions asked!',
    category: 'date' as const,
    icon: 'utensils',
    defaultNote: 'Earned with pure discipline! Tonight we eat your favorite spot 🍕✨',
  },
  {
    title: 'Guilt-Free 2-Hour Gaming Pass',
    description: 'Uninterrupted gaming or hobby session without any chore guilt.',
    category: 'custom' as const,
    icon: 'gamepad',
    defaultNote: 'Crushed your tasks! Go enjoy your games without guilt 🎮',
  },
  {
    title: 'Movie Night Veto / Pick Pass',
    description: 'You get full control of the movie remote and snack playlist.',
    category: 'coupon' as const,
    icon: 'film',
    defaultNote: 'You pick the movie tonight! Popcorn is on me 🍿',
  },
  {
    title: '100 Kisses & Infinite Cuddle Pass',
    description: 'Instant recharge anytime you feel overwhelmed or drained.',
    category: 'kiss' as const,
    icon: 'heart',
    defaultNote: 'Best focus partner in the world. You are doing amazing 💋❤️',
  },
];

export const ADHDHelperScreen: React.FC<ADHDHelperScreenProps> = ({
  tasks,
  urges,
  completedCurriculumCount,
  rewards,
  partnerNotes,
  onGrantReward,
  onToggleRedeemed,
  onDeleteReward,
  onSendNote,
}) => {
  // Mode toggle: Girlfriend/Partner Portal vs Boyfriend View
  const [role, setRole] = useState<'gf' | 'user'>('gf');
  
  // Custom reward modal state
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [customCategory, setCustomCategory] = useState<'treat' | 'date' | 'massage' | 'food' | 'custom' | 'coupon' | 'kiss'>('treat');
  
  // Quick note input
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');

  // Performance calculations (Proof of Work)
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const urgesPreventedCount = urges.filter((u) => u.preventedAction).length;
  const totalDopamineScore = completedTasksCount * 15 + urgesPreventedCount * 20 + completedCurriculumCount * 25;

  const performanceTier = 
    totalDopamineScore >= 150
      ? { label: 'Legendary Focus Champion', color: 'text-purple-700 bg-purple-100 border-purple-300' }
      : totalDopamineScore >= 75
      ? { label: 'High Momentum Hero', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' }
      : { label: 'Building Steady Momentum', color: 'text-amber-700 bg-amber-100 border-amber-300' };

  // Grant a preset gift
  const handleGrantPreset = (preset: typeof PRESET_GIFTS[0]) => {
    const newReward: PartnerReward = {
      id: `reward-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: preset.title,
      description: preset.description,
      category: preset.category,
      icon: preset.icon,
      isRedeemed: false,
      noteFromPartner: preset.defaultNote,
      grantedBy: 'Girlfriend 💖',
      createdAt: Date.now(),
    };
    onGrantReward(newReward);
  };

  // Grant a custom gift
  const handleGrantCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newReward: PartnerReward = {
      id: `reward-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: customTitle.trim(),
      description: customDesc.trim() || 'Special reward for exceptional focus & discipline',
      category: customCategory,
      icon: 'gift',
      isRedeemed: false,
      noteFromPartner: customNote.trim() || 'So proud of your progress! You earned this 💖',
      grantedBy: 'Girlfriend 💖',
      createdAt: Date.now(),
    };

    onGrantReward(newReward);
    setCustomTitle('');
    setCustomDesc('');
    setCustomNote('');
  };

  // Send partner encouragement note
  const handleSendPartnerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const note: PartnerNote = {
      id: `note-${Date.now()}`,
      author: role === 'gf' ? 'Girlfriend 💖' : 'Focus Hero 🚀',
      message: newNoteText.trim(),
      timestamp: Date.now(),
      emoji: selectedEmoji,
    };

    onSendNote(note);
    setNewNoteText('');
  };

  const getCategoryBadge = (cat: PartnerReward['category']) => {
    switch (cat) {
      case 'massage':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Massage & Care' };
      case 'date':
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Date Night' };
      case 'treat':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Coffee & Treat' };
      case 'food':
        return { bg: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Food & Dining' };
      case 'kiss':
        return { bg: 'bg-pink-50 text-pink-700 border-pink-200', label: 'Love & Affection' };
      case 'coupon':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Pass / Coupon' };
      default:
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Special Gift' };
    }
  };

  return (
    <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-6xl mx-auto w-full pb-28 md:pb-12">
      {/* Header Banner with Role Switch */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#c2c8c0]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-600">
              <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#181c1e] tracking-tight">
              ADHD Helper &amp; Partner Portal
            </h1>
          </div>
          <p className="text-sm text-[#545f72] mt-1">
            Real-time focus visibility where your partner tracks your wins and grants customized rewards!
          </p>
        </div>

        {/* View Switcher: Girlfriend Mode vs User View */}
        <div className="flex items-center bg-[#e5e9eb] p-1 rounded-xl self-start md:self-auto border border-[#c2c8c0]/50 shadow-inner">
          <button
            id="role-gf-btn"
            onClick={() => setRole('gf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'gf'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                : 'text-[#545f72] hover:text-[#181c1e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Girlfriend Portal 💖</span>
          </button>
          <button
            id="role-user-btn"
            onClick={() => setRole('user')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'user'
                ? 'bg-[#43664c] text-white shadow-sm'
                : 'text-[#545f72] hover:text-[#181c1e]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>My Rewards &amp; Status 🚀</span>
          </button>
        </div>
      </header>

      {/* Role Banner / Context Prompt */}
      <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
        role === 'gf'
          ? 'bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border-pink-200'
          : 'bg-[#f1f4f6] border-[#c2c8c0]'
      }`}>
        {role === 'gf' ? (
          <>
            <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-pink-950">
                Welcome to your Boyfriend's Focus Dashboard! 🌟
              </h2>
              <p className="text-xs text-pink-800">
                Check his real-time completed sprints, prevented distractions, and grant him surprise gifts below based on how well he performs today!
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#43664c] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#181c1e]">
                Your Earned Rewards &amp; Real-Time Proof of Work
              </h2>
              <p className="text-xs text-[#545f72]">
                Every 10-minute micro-task and resisted urge updates your live score. Your girlfriend can view your progress and unlock rewards for you anytime!
              </p>
            </div>
          </>
        )}
      </div>

      {/* Real-time Proof of Work Performance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
        {/* Completed 10-min tasks */}
        <div className="bg-white p-4 rounded-2xl border border-[#c2c8c0]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#545f72] uppercase tracking-wider">
              Focus Sprints
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold text-[#181c1e]">
              {completedTasksCount}
            </span>
            <span className="text-xs text-[#545f72] ml-1.5 font-medium">Finished</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            +{completedTasksCount * 15} Focus XP
          </div>
        </div>

        {/* Urges Prevented */}
        <div className="bg-white p-4 rounded-2xl border border-[#c2c8c0]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#545f72] uppercase tracking-wider">
              Urges Prevented
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold text-[#181c1e]">
              {urgesPreventedCount}
            </span>
            <span className="text-xs text-[#545f72] ml-1.5 font-medium">Overcome</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            +{urgesPreventedCount * 20} Dopamine XP
          </div>
        </div>

        {/* Curriculum Modules */}
        <div className="bg-white p-4 rounded-2xl border border-[#c2c8c0]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#545f72] uppercase tracking-wider">
              Curriculum Topics
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold text-[#181c1e]">
              {completedCurriculumCount}
            </span>
            <span className="text-xs text-[#545f72] ml-1.5 font-medium">Mastered</span>
          </div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">
            +{completedCurriculumCount * 25} Knowledge XP
          </div>
        </div>

        {/* Total Score & Rating */}
        <div className="bg-white p-4 rounded-2xl border border-[#c2c8c0]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#545f72] uppercase tracking-wider">
              Performance Level
            </span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold text-[#181c1e]">
              {totalDopamineScore}
            </span>
            <span className="text-xs text-[#545f72] ml-1.5 font-medium">Total XP</span>
          </div>
          <div className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border inline-block truncate ${performanceTier.color}`}>
            {performanceTier.label}
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Rewards Vault, Right is Granting Tools & Love Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Column: Granted Rewards Vault */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#c2c8c0]/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-pink-50 text-pink-600">
                  <Gift className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#181c1e]">
                    Unlocked Gifts &amp; Rewards Vault
                  </h2>
                  <p className="text-xs text-[#545f72]">
                    {rewards.length === 0
                      ? 'No gifts granted yet. Grant one below to celebrate focus!'
                      : `${rewards.filter((r) => !r.isRedeemed).length} ready to redeem, ${rewards.filter((r) => r.isRedeemed).length} completed`}
                  </p>
                </div>
              </div>
            </div>

            {/* List of Granted Rewards */}
            {rewards.length === 0 ? (
              <div className="text-center py-10 px-4 bg-[#f8faf9] rounded-2xl border border-dashed border-[#c2c8c0]/70">
                <Gift className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-[#181c1e]">
                  The Reward Vault is Empty
                </h3>
                <p className="text-xs text-[#545f72] max-w-sm mx-auto mt-1">
                  {role === 'gf'
                    ? 'Pick a preset reward or write a custom gift on the right to surprise him!'
                    : 'Complete focus sprints and your girlfriend will grant you special treats here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {rewards.map((reward) => {
                  const badge = getCategoryBadge(reward.category);
                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        reward.isRedeemed
                          ? 'bg-[#f4f7f6] border-[#d1d7d3] opacity-75'
                          : 'bg-gradient-to-br from-white to-[#fffbfb] border-pink-200/90 shadow-xs hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                            reward.isRedeemed ? 'bg-gray-100 text-gray-500' : 'bg-pink-100 text-pink-600'
                          }`}>
                            {reward.category === 'massage' && <Heart className="w-5 h-5" />}
                            {reward.category === 'treat' && <Coffee className="w-5 h-5" />}
                            {reward.category === 'date' && <Utensils className="w-5 h-5" />}
                            {reward.category === 'coupon' && <Film className="w-5 h-5" />}
                            {reward.category === 'custom' && <Gamepad2 className="w-5 h-5" />}
                            {reward.category === 'kiss' && <Smile className="w-5 h-5" />}
                            {reward.category === 'food' && <Utensils className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`text-sm md:text-base font-bold ${
                                reward.isRedeemed ? 'line-through text-gray-500' : 'text-[#181c1e]'
                              }`}>
                                {reward.title}
                              </h3>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                                {badge.label}
                              </span>
                            </div>

                            <p className="text-xs text-[#545f72] mt-1">
                              {reward.description}
                            </p>

                            {reward.noteFromPartner && (
                              <div className="mt-2 text-xs bg-pink-50/90 border border-pink-100 text-pink-900 px-3 py-1.5 rounded-xl flex items-center gap-1.5 italic">
                                <Heart className="w-3 h-3 text-pink-500 fill-pink-500 flex-shrink-0" />
                                <span>"{reward.noteFromPartner}"</span>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-2 text-[11px] text-[#717d74]">
                              <span>Granted by {reward.grantedBy}</span>
                              <span>•</span>
                              <span>{new Date(reward.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => onToggleRedeemed(reward.id, !reward.isRedeemed)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              reward.isRedeemed
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{reward.isRedeemed ? 'Redeemed' : 'Claim Gift'}</span>
                          </button>

                          {role === 'gf' && (
                            <button
                              onClick={() => onDeleteReward(reward.id)}
                              className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                              title="Delete Gift"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Focus Activity Log */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#c2c8c0]/60 shadow-sm">
            <h2 className="text-base font-bold text-[#181c1e] mb-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Live Proof-of-Focus Feed</span>
            </h2>
            <p className="text-xs text-[#545f72] mb-4">
              Real-time synchronization of completed ADHD micro-steps.
            </p>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {tasks.filter((t) => t.isCompleted).length === 0 ? (
                <p className="text-xs text-[#545f72] italic py-2">
                  No sprints completed yet today. As soon as a 10-minute task is checked off, it appears here!
                </p>
              ) : (
                tasks
                  .filter((t) => t.isCompleted)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium text-[#181c1e]">{task.title}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        +15 XP Completed
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Girlfriend Granting Hub & Encouragement Notes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Preset Gift Granter */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#c2c8c0]/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <h2 className="text-base font-bold text-[#181c1e]">
                Quick Grant Preset Gifts
              </h2>
            </div>
            <p className="text-xs text-[#545f72] mb-4">
              Click any gift card below to grant it immediately to the reward vault!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_GIFTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGrantPreset(preset)}
                  className="flex flex-col items-start text-left p-3 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-rose-50/30 hover:border-pink-300 hover:from-pink-100/60 hover:to-rose-100/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="p-1.5 rounded-lg bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform">
                      {preset.icon === 'coffee' && <Coffee className="w-3.5 h-3.5" />}
                      {preset.icon === 'heart' && <Heart className="w-3.5 h-3.5" />}
                      {preset.icon === 'utensils' && <Utensils className="w-3.5 h-3.5" />}
                      {preset.icon === 'gamepad' && <Gamepad2 className="w-3.5 h-3.5" />}
                      {preset.icon === 'film' && <Film className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-[10px] font-bold text-pink-600 bg-white px-1.5 py-0.5 rounded-md border border-pink-200">
                      + Grant
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#181c1e] line-clamp-1">
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-[#545f72] line-clamp-2 mt-0.5">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reward Creator */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#c2c8c0]/60 shadow-sm">
            <h2 className="text-base font-bold text-[#181c1e] mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Create Custom Reward</span>
            </h2>
            <p className="text-xs text-[#545f72] mb-3">
              Personalized reward (e.g. favorite meal, surprise gift, special trip).
            </p>

            <form onSubmit={handleGrantCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#181c1e] mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Cook Homemade Pasta, Buy New Book..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#c2c8c0] focus:outline-none focus:ring-2 focus:ring-[#43664c] bg-[#f8faf9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#181c1e] mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-[#c2c8c0] focus:outline-none focus:ring-2 focus:ring-[#43664c] bg-[#f8faf9]"
                  >
                    <option value="treat">Coffee &amp; Treat</option>
                    <option value="massage">Massage &amp; Rest</option>
                    <option value="date">Date Night</option>
                    <option value="food">Favorite Food</option>
                    <option value="kiss">Affection Pass</option>
                    <option value="coupon">Fun Coupon</option>
                    <option value="custom">Custom Surprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181c1e] mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="Short detail"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#c2c8c0] focus:outline-none focus:ring-2 focus:ring-[#43664c] bg-[#f8faf9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181c1e] mb-1">
                  Sweet Note from Partner
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. So proud of you crushing your tasks today!"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#c2c8c0] focus:outline-none focus:ring-2 focus:ring-[#43664c] bg-[#f8faf9]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Grant Custom Gift Now 🎁</span>
              </button>
            </form>
          </div>

          {/* Sticky Encouragement Love Notes */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#c2c8c0]/60 shadow-sm">
            <h2 className="text-base font-bold text-[#181c1e] mb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>Partner Sticky Encouragement Notes</span>
            </h2>
            <p className="text-xs text-[#545f72] mb-3">
              Leave real-time sweet messages, reminders to drink water, or cheerups!
            </p>

            <form onSubmit={handleSendPartnerNote} className="flex gap-2 mb-4">
              <select
                value={selectedEmoji}
                onChange={(e) => setSelectedEmoji(e.target.value)}
                className="text-sm px-2 py-1.5 rounded-xl border border-[#c2c8c0] bg-[#f8faf9] focus:outline-none"
              >
                <option value="💖">💖</option>
                <option value="☕">☕</option>
                <option value="🔥">🔥</option>
                <option value="🌟">🌟</option>
                <option value="💪">💪</option>
                <option value="🥰">🥰</option>
              </select>
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write a cute cheer note..."
                className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-[#c2c8c0] focus:outline-none focus:ring-2 focus:ring-pink-400 bg-[#f8faf9]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {partnerNotes.length === 0 ? (
                <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 text-xs text-pink-800 italic text-center">
                  "Take a deep breath, drink water, you are doing incredible today! 💖"
                </div>
              ) : (
                partnerNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-gradient-to-r from-pink-50 to-rose-50/50 rounded-xl border border-pink-200/70 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-pink-900 flex items-center gap-1">
                        <span>{note.emoji}</span>
                        <span>{note.author}</span>
                      </span>
                      <span className="text-[10px] text-pink-700/80">
                        {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-pink-950 font-medium">{note.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
