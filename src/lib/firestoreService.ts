import {
  db,
  TASKS_COLLECTION,
  URGES_COLLECTION,
  CURRICULUM_COLLECTION,
  REWARDS_COLLECTION,
  PARTNER_NOTES_COLLECTION,
  NUDGES_COLLECTION,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  ensureAnonymousAuth,
} from './firebase';
import { TaskItem, UrgeLog, PartnerReward, PartnerNote, PartnerNudge } from '../types';

// ======================= TASKS =======================

export async function saveTaskToFirestore(task: TaskItem): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const taskRef = doc(db, TASKS_COLLECTION, task.id);
    await setDoc(taskRef, {
      ...task,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore task save note (local copy active):', err);
  }
}

export async function saveAllTasksToFirestore(tasks: TaskItem[]): Promise<void> {
  try {
    await ensureAnonymousAuth();
    for (const t of tasks) {
      const taskRef = doc(db, TASKS_COLLECTION, t.id);
      await setDoc(taskRef, {
        ...t,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore tasks batch save note:', err);
  }
}

export async function updateTaskStatusInFirestore(taskId: string, isCompleted: boolean): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      isCompleted,
      completedAt: isCompleted ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore task status update note:', err);
  }
}

export function subscribeTasks(onTasksChanged: (tasks: TaskItem[]) => void): () => void {
  try {
    const q = query(collection(db, TASKS_COLLECTION), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loadedTasks: TaskItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            description: data.description || '',
            estimatedMinutes: data.estimatedMinutes || 10,
            actualSeconds: data.actualSeconds || 0,
            isCompleted: !!data.isCompleted,
            order: data.order || 1,
            goalSource: data.goalSource || '',
            scheduledTime: data.scheduledTime || '',
          };
        });
        onTasksChanged(loadedTasks);
      }
    }, (err) => {
      console.warn('Firestore tasks subscription fallback:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore subscribe exception:', err);
    return () => {};
  }
}

// ======================= URGES =======================

export async function logUrgeToFirestore(urge: UrgeLog): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const urgeRef = doc(db, URGES_COLLECTION, urge.id);
    await setDoc(urgeRef, {
      ...urge,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore urge log note (local copy active):', err);
  }
}

export function subscribeUrges(onUrgesChanged: (urges: UrgeLog[]) => void): () => void {
  try {
    const q = query(collection(db, URGES_COLLECTION), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loadedUrges: UrgeLog[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            timestamp: data.timestamp || Date.now(),
            triggerTime: data.triggerTime || '',
            urgeType: data.urgeType || 'Distraction',
            feelingNow: data.feelingNow || '',
            feelingTomorrow: data.feelingTomorrow || '',
            durationSeconds: data.durationSeconds || 300,
            timerCompleted: data.timerCompleted !== false,
            preventedAction: data.preventedAction !== false,
          };
        });
        onUrgesChanged(loadedUrges);
      }
    }, (err) => {
      console.warn('Firestore urges subscription fallback:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore urges subscribe exception:', err);
    return () => {};
  }
}

// ======================= CURRICULUM PROGRESS =======================

export async function saveCurriculumProgressToFirestore(completedIds: Set<string>): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const progressRef = doc(db, CURRICULUM_COLLECTION, 'user_progress');
    await setDoc(progressRef, {
      completedIds: Array.from(completedIds),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore curriculum save note:', err);
  }
}

export function subscribeCurriculumProgress(onProgressChanged: (completedIds: Set<string>) => void): () => void {
  try {
    const progressRef = doc(db, CURRICULUM_COLLECTION, 'user_progress');
    const unsubscribe = onSnapshot(progressRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.completedIds)) {
          onProgressChanged(new Set(data.completedIds));
        }
      }
    }, (err) => {
      console.warn('Firestore curriculum progress note:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore curriculum subscribe exception:', err);
    return () => {};
  }
}

// ======================= PARTNER REWARDS / GIFTS =======================

export async function grantRewardInFirestore(reward: PartnerReward): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const rewardRef = doc(db, REWARDS_COLLECTION, reward.id);
    await setDoc(rewardRef, {
      ...reward,
      createdAt: reward.createdAt || Date.now(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore grant reward note:', err);
  }
}

export async function toggleRewardRedeemedInFirestore(rewardId: string, isRedeemed: boolean): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const rewardRef = doc(db, REWARDS_COLLECTION, rewardId);
    await updateDoc(rewardRef, {
      isRedeemed,
      redeemedAt: isRedeemed ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore toggle reward note:', err);
  }
}

export async function deleteRewardFromFirestore(rewardId: string): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const rewardRef = doc(db, REWARDS_COLLECTION, rewardId);
    await deleteDoc(rewardRef);
  } catch (err) {
    console.warn('Firestore delete reward note:', err);
  }
}

export function subscribePartnerRewards(onRewardsChanged: (rewards: PartnerReward[]) => void): () => void {
  try {
    const q = query(collection(db, REWARDS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loaded: PartnerReward[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || 'Gift Reward',
            description: data.description || '',
            category: data.category || 'treat',
            icon: data.icon || 'gift',
            requiredPoints: data.requiredPoints || 0,
            unlockedAt: data.unlockedAt || Date.now(),
            isRedeemed: !!data.isRedeemed,
            noteFromPartner: data.noteFromPartner || '',
            grantedBy: data.grantedBy || 'Girlfriend',
            createdAt: data.createdAt || Date.now(),
          };
        });
        onRewardsChanged(loaded);
      }
    }, (err) => {
      console.warn('Firestore rewards subscription note:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore rewards subscribe exception:', err);
    return () => {};
  }
}

// ======================= PARTNER LOVE NOTES =======================

export async function sendPartnerNoteToFirestore(note: PartnerNote): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const noteRef = doc(db, PARTNER_NOTES_COLLECTION, note.id);
    await setDoc(noteRef, {
      ...note,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore send note error:', err);
  }
}

export function subscribePartnerNotes(onNotesChanged: (notes: PartnerNote[]) => void): () => void {
  try {
    const q = query(collection(db, PARTNER_NOTES_COLLECTION), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loaded: PartnerNote[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            author: data.author || 'Partner HQ 💖',
            message: data.message || '',
            timestamp: data.timestamp || Date.now(),
            emoji: data.emoji || '💖',
            isRead: !!data.isRead,
          };
        });
        onNotesChanged(loaded);
      }
    }, (err) => {
      console.warn('Firestore notes subscription note:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore notes subscribe exception:', err);
    return () => {};
  }
}

// ======================= PARTNER REAL-TIME NUDGES =======================

export async function sendPartnerNudgeToFirestore(nudge: PartnerNudge): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const nudgeRef = doc(db, NUDGES_COLLECTION, nudge.id);
    await setDoc(nudgeRef, {
      ...nudge,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore send nudge error:', err);
  }
}

export function subscribePartnerNudges(onNudgeReceived: (nudge: PartnerNudge) => void): () => void {
  try {
    const q = query(collection(db, NUDGES_COLLECTION), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const newestDoc = snapshot.docs[0];
        const data = newestDoc.data();
        const nudge: PartnerNudge = {
          id: newestDoc.id,
          type: data.type || 'proud',
          label: data.label || 'Cheering you on!',
          emoji: data.emoji || '💖',
          timestamp: data.timestamp || Date.now(),
          fromName: data.fromName || 'Partner HQ 💖',
        };
        onNudgeReceived(nudge);
      }
    }, (err) => {
      console.warn('Firestore nudges subscription note:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore nudges subscribe exception:', err);
    return () => {};
  }
}


