import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  TaskItem,
  UserRole,
  StudyTheaterVideo,
} from './types';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LearningVisualizerScreen } from './components/LearningVisualizerScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { KrishNaikOneShotsScreen } from './components/KrishNaikOneShotsScreen';
import { Sem7Screen } from './components/Sem7Screen';
import { StudyTheaterModal } from './components/StudyTheaterModal';
import { LoginModal } from './components/LoginModal';
import {
  saveCurriculumProgressToFirestore,
  subscribeCurriculumProgress,
} from './lib/firestoreService';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, handleSignOut } from './lib/firebase';

export default function App() {
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // Active user role: 'kunal'
  const [userRole, setUserRole] = useState<UserRole>('kunal');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('learning');

  // Sidebar collapsed / full website mode state (persisted)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('focusflow_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('focusflow_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-App YouTube Study Theater state
  const [activeTheaterVideo, setActiveTheaterVideo] = useState<StudyTheaterVideo | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Monitor Google Authentication State (Allows any user to sign in)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setGoogleUser(user);
      if (user) {
        const displayName =
          user.displayName || user.email?.split('@')[0] || 'User';
        const role =
          user.email?.toLowerCase() === 'kunaldubey975@gmail.com'
            ? 'kunal'
            : displayName;
        setUserRole(role);
        try {
          localStorage.setItem('focusflow_active_user', role);
        } catch (e) {}
        setIsLoginModalOpen(false);
        showToast(`Welcome ${displayName}! FocusFlow ready ⚡`);
      } else {
        setUserRole('guest');
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

  return (
    <div className={`flex flex-col ${
      currentScreen === 'learning' || currentScreen === 'roadmap' || currentScreen === 'winterarc'
        ? 'min-h-screen bg-[#0b0f14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200'
        : 'min-h-screen bg-[#f7fafc] text-[#181c1e] selection:bg-[#c4eccb] selection:text-[#00210d]'
    }`}>
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
      <div className={`flex flex-1 flex-col md:flex-row ${
        currentScreen === 'learning' ? 'h-full max-h-screen overflow-hidden' : ''
      }`}>
        {/* Desktop Left Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          userRole={userRole}
          googleUser={googleUser}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Dynamic Main Workspace View */}
        {currentScreen === 'learning' && (
          <LearningVisualizerScreen isSidebarCollapsed={isSidebarCollapsed} />
        )}

        {currentScreen === 'roadmap' && (
          <KrishNaikOneShotsScreen
            isSidebarCollapsed={isSidebarCollapsed}
            onWatchVideo={setActiveTheaterVideo}
            completedIds={completedCurriculumIds}
            onToggleComplete={handleToggleCurriculumComplete}
          />
        )}

        {currentScreen === 'sem7' && (
          <Sem7Screen
            isSidebarCollapsed={isSidebarCollapsed}
            onStartFocusFromQuestion={(title) => {
              showToast(`⚡ Focus initiated: ${title}`);
            }}
          />
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
        onClose={() => setIsLoginModalOpen(false)}
        googleUser={googleUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOutGoogle={handleSignOutGoogle}
      />
    </div>
  );
}
