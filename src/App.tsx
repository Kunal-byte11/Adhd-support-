import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  TaskItem,
  PartnerReward,
  PartnerNote,
  UserRole,
  PartnerNudge,
  IWoopGoal,
  StudyTheaterVideo,
} from './types';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { RoadmapScreen } from './components/RoadmapScreen';
import { PartnerHQScreen } from './components/PartnerHQScreen';
import { Sem7Screen } from './components/Sem7Screen';
import { NeuroFocusScreen } from './components/NeuroFocusScreen';
import { WoopScreen } from './components/WoopScreen';
import { RecallArchiveScreen } from './components/RecallArchiveScreen';
import { PhysiologicalSighScreen } from './components/PhysiologicalSighScreen';
import { AudioSynthesizerScreen } from './components/AudioSynthesizerScreen';
import { StudyTheaterModal } from './components/StudyTheaterModal';
import { LoginModal } from './components/LoginModal';
import { UnboxCelebrationModal } from './components/UnboxCelebrationModal';
import { WoopBoardModal } from './components/WoopBoardModal';
import { Heart } from 'lucide-react';
import {
  saveCurriculumProgressToFirestore,
  subscribeCurriculumProgress,
  grantRewardInFirestore,
  toggleRewardRedeemedInFirestore,
  deleteRewardFromFirestore,
  subscribePartnerRewards,
  sendPartnerNoteToFirestore,
  subscribePartnerNotes,
  subscribePartnerNudges,
  subscribeWoopGoals,
} from './lib/firestoreService';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, handleSignOut } from './lib/firebase';

export default function App() {
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // Active user role: 'kunal' (focus master) or 'partner' (support & dopamine HQ)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('focusflow_active_user');
      if (saved === 'partner' || saved === 'kunal') return saved;
    } catch (e) {}
    return 'kunal';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const savedRole = localStorage.getItem('focusflow_active_user');
      if (savedRole === 'partner') return 'partner-hq';
    } catch (e) {}
    return 'sem7';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unbox Celebration Modal state
  const [showUnboxModal, setShowUnboxModal] = useState(false);
  const [activeUnboxReward, setActiveUnboxReward] = useState<PartnerReward | null>(null);

  // In-App YouTube Study Theater state
  const [activeTheaterVideo, setActiveTheaterVideo] = useState<StudyTheaterVideo | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Monitor Google Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setGoogleUser(user);
      if (user && user.email) {
        const email = user.email.toLowerCase();
        if (email === 'kunaldubey975@gmail.com') {
          setUserRole('kunal');
          localStorage.setItem('focusflow_active_user', 'kunal');
          setCurrentScreen('sem7');
          setIsLoginModalOpen(false);
          showToast('Welcome back Kunal! Sem 7 Study Hub ready ⚡');
        } else if (email === 'pandeypragati504@gmail.com') {
          setUserRole('partner');
          localStorage.setItem('focusflow_active_user', 'partner');
          setCurrentScreen('partner-hq');
          setIsLoginModalOpen(false);
          showToast('Welcome back Partner! Partner HQ synced 💖');
        } else {
          handleSignOut();
          setGoogleUser(null);
          showToast('Access Denied: Google account unauthorized.');
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleSignInGoogle = async () => {
    try {
      const uid = await signInWithGoogle();
      if (uid && uid !== 'local-user') {
        showToast('🔒 Persistent Google Authentication synced!');
      }
    } catch (e) {
      showToast('Authentication failed.');
    }
  };

  const handleSignOutGoogle = async () => {
    await handleSignOut();
    showToast('Signed out of Google session.');
  };

  // Persisted Completed curriculum IDs
  const [completedCurriculumIds, setCompletedCurriculumIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('focusflow_completed_curriculum');
      if (saved) {
        return new Set<string>(JSON.parse(saved) as string[]);
      }
    } catch (e) {}
    return new Set<string>(['dsa-1-1', 'dsa-1-4', 'ai-1']);
  });

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

  // Partner Rewards & Notes
  const [rewards, setRewards] = useState<PartnerReward[]>([]);
  const [partnerNotes, setPartnerNotes] = useState<PartnerNote[]>([]);

  // WOOP Urgency Board state
  const [woopGoals, setWoopGoals] = useState<IWoopGoal[]>([]);
  const [isWoopModalOpen, setIsWoopModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubRewards = subscribePartnerRewards((remoteRewards) => {
      setRewards(remoteRewards);
    });
    const unsubNotes = subscribePartnerNotes((remoteNotes) => {
      setPartnerNotes(remoteNotes);
    });
    const unsubNudges = subscribePartnerNudges((remoteNudge) => {
      if (remoteNudge) {
        showToast(`${remoteNudge.emoji} ${remoteNudge.fromName}: ${remoteNudge.label}`);
      }
    });
    const unsubWoop = subscribeWoopGoals((remoteGoals) => {
      setWoopGoals(remoteGoals);
    });

    return () => {
      unsubRewards();
      unsubNotes();
      unsubNudges();
      unsubWoop();
    };
  }, []);

  const handleGrantReward = (reward: Omit<PartnerReward, 'id' | 'createdAt' | 'isRedeemed'>) => {
    const newReward: PartnerReward = {
      ...reward,
      id: `reward-${Date.now()}`,
      createdAt: Date.now(),
      isRedeemed: false,
    };
    grantRewardInFirestore(newReward);
    showToast(`🎁 Reward granted: "${reward.title}"!`);
  };

  const handleToggleRewardRedeemed = (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (!reward) return;
    const newStatus = !reward.isRedeemed;
    toggleRewardRedeemedInFirestore(id, newStatus);
    showToast(newStatus ? '🎉 Reward redeemed!' : 'Reward reset to available.');
  };

  const handleDeleteReward = (id: string) => {
    deleteRewardFromFirestore(id);
    showToast('Reward deleted.');
  };

  const handleSendPartnerNote = (note: Omit<PartnerNote, 'id' | 'timestamp'>) => {
    const newNote: PartnerNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: Date.now(),
    };
    sendPartnerNoteToFirestore(newNote);
    showToast(`💌 Note sent to Kunal!`);
  };

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('focusflow_active_user', role);
    if (role === 'partner') {
      setCurrentScreen('partner-hq');
      showToast('💖 Switched to Partner HQ');
    } else {
      setCurrentScreen('sem7');
      showToast('⚡ Switched to Kunal (Sem 7 Hub)');
    }
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

      {/* Partner Banner if in Partner Mode */}
      {userRole === 'partner' && (
        <div className="md:ml-64 bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 text-white px-4 sm:px-6 py-2 flex items-center justify-between shadow-xs z-30">
          <div className="flex items-center gap-2 text-xs font-bold truncate">
            <Heart className="w-3.5 h-3.5 fill-pink-200 text-pink-200" />
            <span>User: partner_hq (Partner HQ) &bull; Connected to Kunal's Study Hub</span>
          </div>
        </div>
      )}

      {/* Responsive Shell Layout */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Desktop Left Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          userRole={userRole}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Dynamic Main Workspace View */}
        {currentScreen === 'partner-hq' && (
          <PartnerHQScreen
            currentTask={null}
            tasks={[]}
            partnerRewards={rewards}
            partnerNotes={partnerNotes}
            onSwitchToKunal={() => handleSelectRole('kunal')}
            onShowToast={showToast}
            onSendNote={handleSendPartnerNote}
            onGrantReward={handleGrantReward}
          />
        )}

        {currentScreen === 'roadmap' && (
          <RoadmapScreen
            onStartFocusFromItem={(title) => {
              showToast(`🎯 Goal set: "${title}"`);
            }}
            onSendToIntake={() => {}}
            completedIds={completedCurriculumIds}
            onToggleComplete={handleToggleCurriculumComplete}
            onWatchVideo={setActiveTheaterVideo}
          />
        )}

        {currentScreen === 'sem7' && (
          <Sem7Screen
            woopGoals={woopGoals}
            onOpenWoopModal={() => setIsWoopModalOpen(true)}
            onStartFocusFromQuestion={(title) => {
              showToast(`⚡ Focus initiated: ${title}`);
            }}
          />
        )}

        {currentScreen === 'neuro' && (
          <NeuroFocusScreen
            woopGoals={woopGoals}
            onWatchVideo={setActiveTheaterVideo}
          />
        )}

        {currentScreen === 'woop' && (
          <WoopScreen woopGoals={woopGoals} />
        )}

        {currentScreen === 'recalls' && (
          <RecallArchiveScreen onWatchVideo={setActiveTheaterVideo} />
        )}

        {currentScreen === 'breathing' && (
          <PhysiologicalSighScreen />
        )}

        {currentScreen === 'sounds' && (
          <AudioSynthesizerScreen />
        )}
      </div>

      {/* In-App YouTube Split-Screen Study Theater */}
      <StudyTheaterModal
        video={activeTheaterVideo}
        onClose={() => setActiveTheaterVideo(null)}
        onCompleteTopic={handleToggleCurriculumComplete}
        isCompleted={activeTheaterVideo ? completedCurriculumIds.has(activeTheaterVideo.id) : false}
      />

      {/* WOOP Urgency Board Modal */}
      <WoopBoardModal
        isOpen={isWoopModalOpen}
        onClose={() => setIsWoopModalOpen(false)}
        goals={woopGoals}
      />

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
        onClose={
          googleUser &&
          googleUser.email &&
          ['kunaldubey975@gmail.com', 'pandeypragati504@gmail.com'].includes(googleUser.email.toLowerCase())
            ? () => setIsLoginModalOpen(false)
            : undefined
        }
        googleUser={googleUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOutGoogle={handleSignOutGoogle}
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
