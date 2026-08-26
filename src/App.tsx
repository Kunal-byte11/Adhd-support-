import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  TaskItem,
  ChecklistItem,
  UrgeLog,
  PartnerReward,
  PartnerNote,
  UserRole,
  PartnerNudge,
} from './types';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { NowScreen } from './components/NowScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { IntakeScreen } from './components/IntakeScreen';
import { UrgeTrackerScreen } from './components/UrgeTrackerScreen';
import { RecoveryScreen } from './components/RecoveryScreen';
import { ADHDHelperScreen } from './components/ADHDHelperScreen';
import { DailyPlannerScreen } from './components/DailyPlannerScreen';
import { PartnerHQScreen } from './components/PartnerHQScreen';
import { LoginModal } from './components/LoginModal';
import { UnboxCelebrationModal } from './components/UnboxCelebrationModal';
import { Sunrise, Sparkles, X, ArrowRight, Heart, KeyRound, UserCheck } from 'lucide-react';
import {
  saveTaskToFirestore,
  saveAllTasksToFirestore,
  updateTaskStatusInFirestore,
  subscribeTasks,
  logUrgeToFirestore,
  subscribeUrges,
  saveCurriculumProgressToFirestore,
  subscribeCurriculumProgress,
  grantRewardInFirestore,
  toggleRewardRedeemedInFirestore,
  deleteRewardFromFirestore,
  subscribePartnerRewards,
  sendPartnerNoteToFirestore,
  subscribePartnerNotes,
  subscribePartnerNudges,
} from './lib/firestoreService';

export default function App() {
  // Active user role: 'kunal' (focus master) or 'partner' (support & dopamine HQ)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('focusflow_active_user');
      if (saved === 'partner' || saved === 'kunal') return saved;
    } catch (e) {}
    return 'kunal';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const savedRole = localStorage.getItem('focusflow_active_user');
      if (savedRole === 'partner') return 'partner-hq';
    } catch (e) {}
    return 'now';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [intakePrefillGoal, setIntakePrefillGoal] = useState<string>('');
  const [showMorningBanner, setShowMorningBanner] = useState(true);

  // Unbox Celebration Modal state
  const [showUnboxModal, setShowUnboxModal] = useState(false);
  const [activeUnboxReward, setActiveUnboxReward] = useState<PartnerReward | null>(null);

  // Live partner nudge
  const [activeNudge, setActiveNudge] = useState<PartnerNudge | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Persisted Completed curriculum IDs (synced with Firebase Firestore)
  const [completedCurriculumIds, setCompletedCurriculumIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_completed_curriculum');
      if (saved) {
        return new Set<string>(JSON.parse(saved) as string[]);
      }
    } catch (e) {}
    return new Set<string>(['dsa-1-1', 'dsa-1-4', 'ai-1']);
  });

  // Listen to Firestore real-time updates for curriculum progress
  useEffect(() => {
    const unsub = subscribeCurriculumProgress((remoteIds) => {
      setCompletedCurriculumIds(remoteIds);
      try {
        localStorage.setItem(
          'focusflow_completed_curriculum',
          JSON.stringify(Array.from(remoteIds))
        );
      } catch (e) {}
    });
    return () => unsub();
  }, []);

  const handleToggleCurriculumComplete = (id: string) => {
    setCompletedCurriculumIds((prev) => {
      const next = new Set<string>(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(
          'focusflow_completed_curriculum',
          JSON.stringify(Array.from(next))
        );
      } catch (e) {}
      saveCurriculumProgressToFirestore(next);
      return next;
    });
  };

  // Initial Morning AI Plan Tasks
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-initial-1',
      title: "1st Task: Code & Debug DSA Python Course — Part 1 (Time & Space Complexity)",
      description: "Learn Big-O notation, TLE errors, Python operations time complexity, & digit extraction.",
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 1,
      goalSource: "Code & Debug DSA Python Course (Ch 1: Basics)",
    },
    {
      id: 'task-initial-2',
      title: "2nd Task: Krish Naik GenAI Track — LangChain, Vector Embeddings & RAG",
      description: "Build document chunking -> vector embeddings -> ChromaDB -> prompt augmentation flow.",
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 2,
      goalSource: "Krish Naik GenAI Track (Phase 1)",
    },
    {
      id: 'task-initial-3',
      title: "3rd Task: Spaced Revision & Active Recall on LeetCode & GFG",
      description: "Dry-run 1-2 core array/string problems on paper before submitting code.",
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 3,
      goalSource: "Morning AI Schedule (Spaced Revision)",
    },
    {
      id: 'task-initial-4',
      title: "4th Task: 10,000 Steps Movement & Dopamine Reset Walk",
      description: "Get physical movement and outdoor daylight for natural dopamine and stamina.",
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 4,
      goalSource: "Morning AI Schedule (10k Steps Movement)",
    },
    {
      id: 'task-initial-5',
      title: "5th Task: 10-Minute English Active Speaking & Voice Practice",
      description: "Speak out loud on an AI prompt for 10 minutes to build spontaneous fluency.",
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: 5,
      goalSource: "Morning AI Schedule (10m English)",
    },
  ]);

  const [currentTaskId, setCurrentTaskId] = useState<string>('task-initial-1');

  // Urge History state (synced with Firebase Firestore)
  const [urgeHistory, setUrgeHistory] = useState<UrgeLog[]>([
    {
      id: 'urge-1',
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      triggerTime: '10:15 AM',
      urgeType: 'Social Media / YouTube',
      feelingNow: 'Felt restless and wanted quick novelty while debugging LeetCode.',
      feelingTomorrow: 'Grateful I stayed in the flow and preserved my mental focus.',
      durationSeconds: 300,
      timerCompleted: true,
      preventedAction: true,
    },
  ]);

  // Partner Rewards (Dopamine Vault)
  const [rewards, setRewards] = useState<PartnerReward[]>([
    {
      id: 'reward-1',
      title: 'Special Boba Tea / Coffee Run ☕',
      description: 'Your girlfriend will grab your favorite drink for our weekend meetup!',
      category: 'treat',
      icon: 'gift',
      requiredPoints: 0,
      unlockedAt: Date.now() - 1000 * 60 * 60 * 12,
      isRedeemed: false,
      noteFromPartner: 'You crushed the DSA arrays section! So proud of you.',
      grantedBy: 'Girlfriend 💖',
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 'reward-2',
      title: 'Movie Night of Your Choice 🎬',
      description: 'You pick the movie, snacks, and time this weekend.',
      category: 'coupon',
      icon: 'ticket',
      requiredPoints: 0,
      unlockedAt: Date.now() - 1000 * 60 * 60 * 5,
      isRedeemed: false,
      noteFromPartner: 'Complete your GenAI attention mechanism session and claim this!',
      grantedBy: 'Girlfriend 💖',
      createdAt: Date.now() - 1000 * 60 * 60 * 10,
    },
  ]);

  // Partner Love Notes Feed
  const [partnerNotes, setPartnerNotes] = useState<PartnerNote[]>([
    {
      id: 'note-1',
      author: 'Girlfriend 💖',
      message: 'Keep going Kunal! You are going to master GenAI and DSA. So excited for our weekend meetup! 💕',
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      emoji: '💖',
      isRead: true,
    },
  ]);

  // Real-time Firebase subscriptions
  useEffect(() => {
    const unsubTasks = subscribeTasks((remoteTasks) => {
      if (remoteTasks.length > 0) {
        setTasks(remoteTasks);
        setCurrentTaskId((prev) => {
          const exists = remoteTasks.some((t) => t.id === prev);
          return exists ? prev : remoteTasks[0].id;
        });
      }
    });

    const unsubUrges = subscribeUrges((remoteUrges) => {
      if (remoteUrges.length > 0) {
        setUrgeHistory(remoteUrges);
      }
    });

    const unsubRewards = subscribePartnerRewards((remoteRewards) => {
      if (remoteRewards.length > 0) {
        setRewards(remoteRewards);
      }
    });

    const unsubNotes = subscribePartnerNotes((remoteNotes) => {
      const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
      const unexpired = remoteNotes.filter(
        (n) => Date.now() - n.timestamp <= TWENTY_FOUR_HOURS_MS
      );
      setPartnerNotes(unexpired.slice(0, 1));
    });

    const unsubNudges = subscribePartnerNudges((nudge) => {
      // If received within last 2 minutes
      if (Date.now() - nudge.timestamp < 120000) {
        setActiveNudge(nudge);
        showToast(`${nudge.emoji} Partner Support: ${nudge.label}`);
      }
    });

    return () => {
      unsubTasks();
      unsubUrges();
      unsubRewards();
      unsubNotes();
      unsubNudges();
    };
  }, []);

  const currentTask = tasks.find((t) => t.id === currentTaskId) || tasks[0] || null;

  // Handle switching role
  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    try {
      localStorage.setItem('focusflow_active_user', role);
    } catch (e) {}
    if (role === 'partner') {
      setCurrentScreen('partner-hq');
      showToast('🌸 Switched to Girlfriend Mode (Partner HQ)');
    } else {
      setCurrentScreen('daily-plan');
      showToast("👨‍💻 Logged in as Kunal (Focus Master)");
    }
  };

  // Start 10-min focus directly from Roadmap
  const handleStartFocusFromItem = (title: string, category: string) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: `Deep Focus (10m): ${title}`,
      description: `Targeted session on ${category}. One single concept, zero distractions.`,
      estimatedMinutes: 10,
      actualSeconds: 0,
      isCompleted: false,
      order: tasks.length + 1,
      goalSource: `${category} Curriculum`,
    };

    const updatedTasks = [newTask, ...tasks.map((t, idx) => ({ ...t, order: idx + 2 }))];
    setTasks(updatedTasks);
    setCurrentTaskId(newTask.id);
    saveTaskToFirestore(newTask);
    setCurrentScreen('now');
    showToast(`🎯 10-Minute Focus Session started on "${title.slice(0, 30)}..."`);
  };

  // Send goal directly into Intake screen
  const handleSendToIntake = (goalTitle: string) => {
    setIntakePrefillGoal(goalTitle);
    setCurrentScreen('intake');
    showToast(`Loaded "${goalTitle.slice(0, 30)}..." into Intake`);
  };

  // Complete task handler & trigger Unbox Celebration
  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
    );
    updateTaskStatusInFirestore(taskId, true);

    // Find a reward or celebrate with unbox modal
    const unredeemedReward = rewards.find((r) => !r.isRedeemed) || rewards[0] || null;
    setActiveUnboxReward(unredeemedReward);
    setShowUnboxModal(true);

    const nextUncompleted = tasks.find((t) => t.id !== taskId && !t.isCompleted);
    if (nextUncompleted) {
      setCurrentTaskId(nextUncompleted.id);
    }
  };

  // Recalibrate trigger from Now screen
  const handleRecalibrate = async () => {
    try {
      const res = await fetch('/api/schedule/recalibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delayMinutes: 10, currentTaskId }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Schedule shifted smoothly. You have breathing room.');
      }
    } catch (e) {
      showToast('Schedule recalibrated. No penalty.');
    }
    setCurrentScreen('recovery');
  };

  // Start new plan from Intake
  const handleStartPlan = (newTasks: TaskItem[], _checklist: ChecklistItem[]) => {
    if (newTasks.length > 0) {
      setTasks(newTasks);
      setCurrentTaskId(newTasks[0].id);
      saveAllTasksToFirestore(newTasks);
      setCurrentScreen('now');
      showToast(`Started: 10-minute sprint on "${newTasks[0].title}"`);
    }
  };

  // Log urge intervention
  const handleLogUrge = async (logData: Omit<UrgeLog, 'id' | 'timestamp' | 'triggerTime'>) => {
    const newLog: UrgeLog = {
      ...logData,
      id: `urge-${Date.now()}`,
      timestamp: Date.now(),
      triggerTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUrgeHistory((prev) => [newLog, ...prev]);
    logUrgeToFirestore(newLog);

    try {
      await fetch('/api/urges/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
    } catch (err) {
      console.warn('Urge saved locally:', err);
    }

    showToast('Cognitive bridge established. Urge saved to Firebase!');
  };

  // Partner Reward Handlers
  const handleGrantReward = (reward: PartnerReward) => {
    setRewards((prev) => [reward, ...prev]);
    grantRewardInFirestore(reward);
    showToast(`🎁 Gift granted: "${reward.title}"! Saved to Firebase.`);
  };

  const handleToggleRewardRedeemed = (rewardId: string, isRedeemed: boolean) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, isRedeemed } : r))
    );
    toggleRewardRedeemedInFirestore(rewardId, isRedeemed);
    showToast(isRedeemed ? '🎉 Reward Claimed & Redeemed!' : 'Reward marked unredeemed');
  };

  const handleDeleteReward = (rewardId: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
    deleteRewardFromFirestore(rewardId);
    showToast('Reward removed from vault.');
  };

  const handleSendPartnerNote = (note: PartnerNote) => {
    setPartnerNotes([note]);
    sendPartnerNoteToFirestore(note);
    showToast('💖 Encouragement note posted in real-time!');
  };

  // Resume from Recovery
  const handleResumeFromRecovery = async (delayMinutes: number) => {
    try {
      await fetch('/api/schedule/recalibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delayMinutes, currentTaskId }),
      });
    } catch (e) {}
    setCurrentScreen('now');
    showToast('Welcome back. Momentum restored with zero guilt.');
  };

  // Launch full sprint from DailyPlannerScreen
  const handleLaunchFullSprint = (newTasks: TaskItem[]) => {
    if (newTasks.length > 0) {
      setTasks(newTasks);
      setCurrentTaskId(newTasks[0].id);
      saveAllTasksToFirestore(newTasks);
      setCurrentScreen('now');
      showToast(`🎯 Focus Sprint started: "${newTasks[0].title.slice(0, 35)}..."`);
    }
  };

  // Launch single task to Now
  const handleLaunchSingleTaskToNow = (task: TaskItem) => {
    setTasks([task]);
    setCurrentTaskId(task.id);
    saveTaskToFirestore(task);
    setCurrentScreen('now');
    showToast(`🎯 Focused on "${task.title.slice(0, 35)}..."`);
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#181c1e] flex flex-col selection:bg-[#c4eccb] selection:text-[#00210d]">
      {/* Toast feedback notification */}
      {toastMessage && (
        <div
          id="toast-banner"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#181c1e] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: kunal11 vs parii26 Account Indicator */}
      {userRole === 'kunal' && showMorningBanner && currentScreen !== 'daily-plan' && (
        <div className="md:ml-64 bg-gradient-to-r from-[#43664c] to-[#006494] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs z-30">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold truncate">
            <Sunrise className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">
              <strong>User: kunal11</strong> &bull; Today's Plan: 2h DSA &bull; 2h GenAI &bull; 1h Revision &bull; 10k Steps &bull; 10m English
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentScreen('daily-plan')}
              className="bg-white text-[#43664c] hover:bg-[#ebeef0] px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Daily Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowMorningBanner(false)}
              className="p-1 hover:bg-white/20 rounded-full text-white/80 hover:text-white cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {userRole === 'partner' && (
        <div className="md:ml-64 bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 text-white px-4 sm:px-6 py-2 flex items-center justify-between shadow-xs z-30">
          <div className="flex items-center gap-2 text-xs font-bold truncate">
            <Heart className="w-3.5 h-3.5 fill-pink-200 text-pink-200" />
            <span>User: partner_hq (Partner HQ) &bull; Connected to kunal11's Flow</span>
          </div>
        </div>
      )}

      {/* Responsive Shell Layout */}
      <div className="flex flex-1">
        {/* Desktop Left Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          userRole={userRole}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Dynamic Main Workspace View */}
        {currentScreen === 'daily-plan' && (
          <DailyPlannerScreen
            onLaunchTaskToNow={handleLaunchSingleTaskToNow}
            onLaunchFullSprint={handleLaunchFullSprint}
            partnerNotes={partnerNotes}
          />
        )}

        {currentScreen === 'partner-hq' && (
          <PartnerHQScreen
            currentTask={currentTask}
            tasks={tasks}
            partnerRewards={rewards}
            partnerNotes={partnerNotes}
            onSwitchToKunal={() => handleSelectRole('kunal')}
            onShowToast={showToast}
            onSendNote={handleSendPartnerNote}
            onGrantReward={handleGrantReward}
          />
        )}

        {currentScreen === 'now' && (
          <NowScreen
            currentTask={currentTask}
            tasks={tasks}
            partnerNotes={partnerNotes}
            activeNudge={activeNudge}
            onDismissNudge={() => setActiveNudge(null)}
            onCompleteTask={handleCompleteTask}
            onRecalibrate={handleRecalibrate}
            onSelectTask={(task) => setCurrentTaskId(task.id)}
            onNavigateToIntake={() => setCurrentScreen('intake')}
            onOpenPartnerHQ={() => setCurrentScreen('partner-hq')}
          />
        )}

        {currentScreen === 'roadmap' && (
          <RoadmapScreen
            onStartFocusFromItem={handleStartFocusFromItem}
            onSendToIntake={handleSendToIntake}
            completedIds={completedCurriculumIds}
            onToggleComplete={handleToggleCurriculumComplete}
          />
        )}

        {currentScreen === 'intake' && (
          <IntakeScreen
            initialGoal={intakePrefillGoal}
            onStartPlan={handleStartPlan}
          />
        )}

        {currentScreen === 'urges' && (
          <UrgeTrackerScreen
            urgeHistory={urgeHistory}
            onLogUrge={handleLogUrge}
            onReturnToNow={() => setCurrentScreen('now')}
          />
        )}

        {currentScreen === 'recovery' && (
          <RecoveryScreen
            onResume={handleResumeFromRecovery}
          />
        )}

        {currentScreen === 'adhd-helper' && (
          <ADHDHelperScreen
            tasks={tasks}
            urges={urgeHistory}
            completedCurriculumCount={completedCurriculumIds.size}
            rewards={rewards}
            partnerNotes={partnerNotes}
            onGrantReward={handleGrantReward}
            onToggleRedeemed={handleToggleRewardRedeemed}
            onDeleteReward={handleDeleteReward}
            onSendNote={handleSendPartnerNote}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentScreen={currentScreen}
        userRole={userRole}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Account / Role Selection Modal */}
      <LoginModal
        currentUserRole={userRole}
        isOpen={isLoginModalOpen}
        onSelectRole={handleSelectRole}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Instant Unbox Celebration Modal */}
      {showUnboxModal && (
        <UnboxCelebrationModal
          reward={activeUnboxReward}
          note={partnerNotes[0] || null}
          onClose={() => setShowUnboxModal(false)}
        />
      )}
    </div>
  );
}
