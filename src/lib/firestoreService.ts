import {
  db,
  TASKS_COLLECTION,
  CURRICULUM_COLLECTION,
  REWARDS_COLLECTION,
  PARTNER_NOTES_COLLECTION,
  NUDGES_COLLECTION,
  WOOP_COLLECTION,
  RECALLS_COLLECTION,
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
import { TaskItem, PartnerReward, PartnerNote, PartnerNudge, IWoopGoal, ISessionRecall } from '../types';

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
            audioDataUrl: data.audioDataUrl || undefined,
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

    // Query and delete all existing notes to keep only one (like a queue of size 1)
    const q = query(collection(db, PARTNER_NOTES_COLLECTION));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    // Save the new note
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
            imageUrl: data.imageUrl || undefined,
            audioDataUrl: data.audioDataUrl || undefined,
          };
        });
        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
        const validNotes = loaded.filter(
          (note) => Date.now() - note.timestamp <= TWENTY_FOUR_HOURS_MS
        );
        onNotesChanged(validNotes);
      } else {
        onNotesChanged([]);
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

// ======================= WOOP URGENCY BOARD =======================

export async function saveWoopGoalToFirestore(goal: IWoopGoal): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const goalRef = doc(db, WOOP_COLLECTION, goal.id);
    await setDoc(goalRef, {
      ...goal,
      updatedAt: serverTimestamp(),
      createdAt: goal.createdAt || Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore WOOP save note:', err);
  }
}

export async function deleteWoopGoalFromFirestore(goalId: string): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const goalRef = doc(db, WOOP_COLLECTION, goalId);
    await deleteDoc(goalRef);
  } catch (err) {
    console.warn('Firestore WOOP delete note:', err);
  }
}

export function subscribeWoopGoals(onGoalsChanged: (goals: IWoopGoal[]) => void): () => void {
  try {
    const q = query(collection(db, WOOP_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loaded: IWoopGoal[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            wish: data.wish || '',
            outcome: data.outcome || '',
            obstacle: data.obstacle || '',
            plan: data.plan || '',
            targetSubject: data.targetSubject || undefined,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
            updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now()),
          };
        });
        onGoalsChanged(loaded);
      } else {
        onGoalsChanged([]);
      }
    }, (err) => {
      console.warn('Firestore WOOP subscribe note:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore WOOP subscribe exception:', err);
    return () => {};
  }
}

// ======================= ACTIVE RECALL SANDBOX =======================

export function getAllStoredRecalls(): ISessionRecall[] {
  const recallsMap = new Map<string, ISessionRecall>();

  // 1. Read existing structured recalls from localStorage
  try {
    const raw = localStorage.getItem('adhd_session_recalls');
    if (raw) {
      const list: ISessionRecall[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item && item.id) {
            recallsMap.set(item.id, item);
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error reading adhd_session_recalls:', e);
  }

  // 2. Scan for any legacy or newly typed video notes: focusflow_video_notes_*
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('focusflow_video_notes_')) {
        const videoId = key.replace('focusflow_video_notes_', '');
        const content = localStorage.getItem(key);
        if (content && content.trim()) {
          const recallId = `video_note_${videoId}`;
          if (!recallsMap.has(recallId)) {
            recallsMap.set(recallId, {
              id: recallId,
              subject: 'Curriculum Video',
              topicTitle: `Video Note (${videoId})`,
              recallContent: content.trim(),
              durationMinutes: 25,
              phoneDistanced: true,
              microRestsCompleted: 1,
              createdAt: Date.now(),
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error scanning focusflow_video_notes:', e);
  }

  return Array.from(recallsMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function saveStoredRecallsLocally(recalls: ISessionRecall[]): void {
  try {
    localStorage.setItem('adhd_session_recalls', JSON.stringify(recalls));
  } catch (e) {
    console.warn('Error saving recalls locally:', e);
  }
}

export async function saveRecallLogToFirestore(recall: ISessionRecall): Promise<void> {
  // 1. Immediately update localStorage for 0ms UI reactivity
  try {
    const local = getAllStoredRecalls();
    const updated = [recall, ...local.filter((r) => r.id !== recall.id)];
    saveStoredRecallsLocally(updated);
  } catch (e) {
    console.warn('Local recall update error:', e);
  }

  // 2. Sync to Firestore
  try {
    await ensureAnonymousAuth();
    const recallRef = doc(db, RECALLS_COLLECTION, recall.id);
    await setDoc(recallRef, {
      ...recall,
      createdAt: recall.createdAt || Date.now(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore recall save note:', err);
  }
}

export async function deleteRecallLogFromFirestore(recallId: string): Promise<void> {
  // 1. Remove from localStorage
  try {
    const local = getAllStoredRecalls();
    const updated = local.filter((r) => r.id !== recallId);
    saveStoredRecallsLocally(updated);

    if (recallId.startsWith('video_note_')) {
      const vId = recallId.replace('video_note_', '');
      localStorage.removeItem(`focusflow_video_notes_${vId}`);
    }
  } catch (e) {
    console.warn('Local recall delete error:', e);
  }

  // 2. Remove from Firestore
  try {
    await ensureAnonymousAuth();
    const recallRef = doc(db, RECALLS_COLLECTION, recallId);
    await deleteDoc(recallRef);
  } catch (err) {
    console.warn('Firestore recall delete note:', err);
  }
}

export function subscribeRecallLogs(onRecallsChanged: (recalls: ISessionRecall[]) => void): () => void {
  // Immediately dispatch stored recalls from local cache with zero delay
  const initialLocal = getAllStoredRecalls();
  onRecallsChanged(initialLocal);

  try {
    const q = query(collection(db, RECALLS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const localRecalls = getAllStoredRecalls();
      const localMap = new Map<string, ISessionRecall>(localRecalls.map((r) => [r.id, r]));

      if (!snapshot.empty) {
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const item: ISessionRecall = {
            id: docSnap.id,
            subject: data.subject || 'General',
            topicTitle: data.topicTitle || 'Active Recall',
            recallContent: data.recallContent || '',
            timestampNotes: Array.isArray(data.timestampNotes) ? data.timestampNotes : undefined,
            durationMinutes: data.durationMinutes || 0,
            phoneDistanced: !!data.phoneDistanced,
            microRestsCompleted: data.microRestsCompleted || 0,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
          };
          localMap.set(docSnap.id, item);
        });
      }

      const merged = Array.from(localMap.values()).sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );

      saveStoredRecallsLocally(merged);
      onRecallsChanged(merged);
    }, (err) => {
      console.warn('Firestore recall subscribe note (using local cache):', err);
      onRecallsChanged(getAllStoredRecalls());
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore recall subscribe exception:', err);
    return () => {};
  }
}



