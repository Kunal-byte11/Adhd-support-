import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
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
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

export const firebaseConfig = {
  projectId: "talzii-hinglish",
  appId: "1:411761885110:web:cbfb895f7bb8d1f0784b17",
  apiKey: "AIzaSyBSNZMCQaIHik7l8ug6hN14A0gFwhqPZ84",
  authDomain: "talzii-hinglish.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-focusflow-a64b6020-6979-4292-84ac-422e5202030e",
  storageBucket: "talzii-hinglish.firebasestorage.app",
  messagingSenderId: "411761885110",
  measurementId: "",
  oAuthClientId: "411761885110-jeopt52iju7n2073hh6rnmfjub90odch.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Sign in anonymously for easy, seamless ADHD session persistence
export async function ensureAnonymousAuth(): Promise<string> {
  try {
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (error) {
    console.warn('Anonymous auth note (local fallback active):', error);
    return 'local-user';
  }
}

// Firestore instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Collections
export const TASKS_COLLECTION = 'focus_tasks';
export const URGES_COLLECTION = 'focus_urges';
export const CURRICULUM_COLLECTION = 'curriculum_progress';
export const REWARDS_COLLECTION = 'partner_rewards';
export const PARTNER_NOTES_COLLECTION = 'partner_notes';
export const NUDGES_COLLECTION = 'partner_nudges';

export {
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
};
