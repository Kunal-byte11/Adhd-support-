import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  TaskItem,
  UserRole,
  IWoopGoal,
  StudyTheaterVideo,
} from './types';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { RoadmapScreen } from './components/RoadmapScreen';
import { Sem7Screen } from './components/Sem7Screen';
import { NeuroFocusScreen } from './components/NeuroFocusScreen';
import { WoopScreen } from './components/WoopScreen';
import { RecallArchiveScreen } from './components/RecallArchiveScreen';
import { PhysiologicalSighScreen } from './components/PhysiologicalSighScreen';
import { AudioSynthesizerScreen } from './components/AudioSynthesizerScreen';
import { StudyTheaterModal } from './components/StudyTheaterModal';
import { LoginModal } from './components/LoginModal';
import { WoopBoardModal } from './components/WoopBoardModal';
import {
  saveCurriculumProgressToFirestore,
  subscribeCurriculumProgress,
  subscribeWoopGoals,
} from './lib/firestoreService';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, handleSignOut } from './lib/firebase';

export default function App() {
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // Active user role: 'kunal'
  const [userRole, setUserRole] = useState<UserRole>('kunal');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('sem7');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
          setIsLoginModalOpen(false);
          showToast('Welcome back Kunal! Sem 7 Study Hub ready ⚡');
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

  // WOOP Urgency Board state
  const [woopGoals, setWoopGoals] = useState<IWoopGoal[]>([]);
  const [isWoopModalOpen, setIsWoopModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubWoop = subscribeWoopGoals((remoteGoals) => {
      setWoopGoals(remoteGoals);
    });

    return () => {
      unsubWoop();
    };
  }, []);

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
        onSelectVideo={setActiveTheaterVideo}
        completedIds={completedCurriculumIds}
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
        onClose={
          googleUser &&
          googleUser.email &&
          googleUser.email.toLowerCase() === 'kunaldubey975@gmail.com'
            ? () => setIsLoginModalOpen(false)
            : undefined
        }
        googleUser={googleUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOutGoogle={handleSignOutGoogle}
      />
    </div>
  );
}
