import {
  db,
  TASKS_COLLECTION,
  CURRICULUM_COLLECTION,
  WOOP_COLLECTION,
  RECALLS_COLLECTION,
  PHOTO_NOTES_COLLECTION,
  DMN_COLLECTION,
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
import { TaskItem, IWoopGoal, ISessionRecall, ILecturePhotoNote, IDmnNarrative } from '../types';

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

// ======================= LECTURE PHOTO NOTES =======================

const PHOTO_NOTES_LOCAL_KEY = 'focusflow_lecture_photo_notes_cache';

export function getAllStoredPhotoNotes(): ILecturePhotoNote[] {
  try {
    const raw = localStorage.getItem(PHOTO_NOTES_LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveStoredPhotoNotesLocally(notes: ILecturePhotoNote[]): void {
  try {
    localStorage.setItem(PHOTO_NOTES_LOCAL_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn('Failed to cache photo notes locally (quota):', e);
  }
}

export async function saveLecturePhotoNoteToFirestore(note: ILecturePhotoNote): Promise<void> {
  // Update local cache immediately
  const existing = getAllStoredPhotoNotes();
  const index = existing.findIndex((n) => n.id === note.id);
  let updatedList: ILecturePhotoNote[];
  if (index >= 0) {
    updatedList = existing.map((n) => (n.id === note.id ? note : n));
  } else {
    updatedList = [note, ...existing];
  }
  saveStoredPhotoNotesLocally(updatedList);

  try {
    await ensureAnonymousAuth();
    const noteRef = doc(db, PHOTO_NOTES_COLLECTION, note.id);
    await setDoc(
      noteRef,
      {
        ...note,
        createdAt: note.createdAt || Date.now(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore photo note save note (local copy active):', err);
  }
}

export async function deleteLecturePhotoNoteFromFirestore(noteId: string): Promise<void> {
  // Update local cache immediately
  const existing = getAllStoredPhotoNotes();
  const updatedList = existing.filter((n) => n.id !== noteId);
  saveStoredPhotoNotesLocally(updatedList);

  try {
    await ensureAnonymousAuth();
    const noteRef = doc(db, PHOTO_NOTES_COLLECTION, noteId);
    await deleteDoc(noteRef);
  } catch (err) {
    console.warn('Firestore photo note delete exception:', err);
  }
}

export function subscribeAllPhotoNotes(
  onNotesChanged: (notes: ILecturePhotoNote[]) => void
): () => void {
  // Immediately dispatch stored notes from local cache
  const initialLocal = getAllStoredPhotoNotes();
  onNotesChanged(initialLocal);

  try {
    const q = query(collection(db, PHOTO_NOTES_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const localList = getAllStoredPhotoNotes();
        const localMap = new Map<string, ILecturePhotoNote>(localList.map((n) => [n.id, n]));

        if (!snapshot.empty) {
          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const item: ILecturePhotoNote = {
              id: docSnap.id,
              videoId: data.videoId || '',
              imageUrl: data.imageUrl || '',
              title: data.title || '',
              notes: data.notes || '',
              fileSize: data.fileSize || '',
              createdAt: data.createdAt?.toMillis
                ? data.createdAt.toMillis()
                : data.createdAt || Date.now(),
            };
            localMap.set(docSnap.id, item);
          });
        }

        const merged = Array.from(localMap.values()).sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        );

        saveStoredPhotoNotesLocally(merged);
        onNotesChanged(merged);
      },
      (err) => {
        console.warn('Firestore photo notes subscribe fallback (using local cache):', err);
        onNotesChanged(getAllStoredPhotoNotes());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore photo notes subscribe exception:', err);
    return () => {};
  }
}

// ======================= DMN REPROGRAMMING NARRATIVES =======================

const LOCAL_DMN_KEY = 'focusflow_dmn_narratives_cache';

export function getAllStoredDmnNarratives(): IDmnNarrative[] {
  try {
    const raw = localStorage.getItem(LOCAL_DMN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredDmnNarrativesLocally(narratives: IDmnNarrative[]): void {
  try {
    localStorage.setItem(LOCAL_DMN_KEY, JSON.stringify(narratives));
  } catch (err) {
    console.warn('Local storage DMN save error:', err);
  }
}

export async function saveDmnNarrativeToFirestore(narrative: IDmnNarrative): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const docRef = doc(db, DMN_COLLECTION, narrative.id);
    await setDoc(docRef, {
      ...narrative,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update local cache
    const current = getAllStoredDmnNarratives();
    const idx = current.findIndex((n) => n.id === narrative.id);
    if (idx !== -1) {
      current[idx] = { ...narrative, updatedAt: Date.now() };
    } else {
      current.unshift({ ...narrative, updatedAt: Date.now() });
    }
    saveStoredDmnNarrativesLocally(current);
  } catch (err) {
    console.warn('Firestore save DMN narrative error (using local cache):', err);
    const current = getAllStoredDmnNarratives();
    const idx = current.findIndex((n) => n.id === narrative.id);
    if (idx !== -1) {
      current[idx] = { ...narrative, updatedAt: Date.now() };
    } else {
      current.unshift({ ...narrative, updatedAt: Date.now() });
    }
    saveStoredDmnNarrativesLocally(current);
  }
}

export async function recordDmnDailyReviewInFirestore(id: string): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const current = getAllStoredDmnNarratives();
    const found = current.find((n) => n.id === id);
    const newStreak = (found?.reviewStreakCount || 0) + 1;
    const now = Date.now();

    const docRef = doc(db, DMN_COLLECTION, id);
    await updateDoc(docRef, {
      lastReviewedAt: serverTimestamp(),
      reviewStreakCount: newStreak,
      updatedAt: serverTimestamp(),
    });

    if (found) {
      found.lastReviewedAt = now;
      found.reviewStreakCount = newStreak;
      saveStoredDmnNarrativesLocally(current);
    }
  } catch (err) {
    console.warn('Firestore record DMN review error (local fallback):', err);
    const current = getAllStoredDmnNarratives();
    const found = current.find((n) => n.id === id);
    if (found) {
      found.lastReviewedAt = Date.now();
      found.reviewStreakCount = (found.reviewStreakCount || 0) + 1;
      saveStoredDmnNarrativesLocally(current);
    }
  }
}

export async function deleteDmnNarrativeFromFirestore(id: string): Promise<void> {
  try {
    await ensureAnonymousAuth();
    const docRef = doc(db, DMN_COLLECTION, id);
    await deleteDoc(docRef);

    const current = getAllStoredDmnNarratives().filter((n) => n.id !== id);
    saveStoredDmnNarrativesLocally(current);
  } catch (err) {
    console.warn('Firestore delete DMN narrative error:', err);
    const current = getAllStoredDmnNarratives().filter((n) => n.id !== id);
    saveStoredDmnNarrativesLocally(current);
  }
}

export function subscribeDmnNarratives(onNarrativesChanged: (narratives: IDmnNarrative[]) => void): () => void {
  const localCached = getAllStoredDmnNarratives();
  if (localCached.length > 0) {
    onNarrativesChanged(localCached);
  }

  try {
    const q = query(collection(db, DMN_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const localList = getAllStoredDmnNarratives();
        const localMap = new Map<string, IDmnNarrative>(localList.map((n) => [n.id, n]));

        if (!snapshot.empty) {
          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const item: IDmnNarrative = {
              id: docSnap.id,
              title: data.title || '',
              category: data.category || 'focus',
              identityStatement: data.identityStatement || '',
              groundedFacts: data.groundedFacts || '',
              futureEdge: data.futureEdge || '',
              targetHabitRule: data.targetHabitRule || '',
              triggerCue: data.triggerCue || '',
              step1: data.step1 || '',
              step2: data.step2 || '',
              step3: data.step3 || '',
              movieSceneDescription: data.movieSceneDescription || '',
              lastReviewedAt: data.lastReviewedAt?.toMillis ? data.lastReviewedAt.toMillis() : data.lastReviewedAt,
              reviewStreakCount: data.reviewStreakCount || 0,
              createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
              updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt || Date.now(),
            };
            localMap.set(docSnap.id, item);
          });
        }

        const merged = Array.from(localMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        saveStoredDmnNarrativesLocally(merged);
        onNarrativesChanged(merged);
      },
      (err) => {
        console.warn('Firestore DMN subscribe fallback:', err);
        onNarrativesChanged(getAllStoredDmnNarratives());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore DMN subscribe exception:', err);
    return () => {};
  }
}





