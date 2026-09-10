export type ScreenType =
  | 'learning'
  | 'sem7'
  | 'roadmap'
  | 'notes'
  | 'dmn'
  | 'woop'
  | 'breathing'
  | 'sounds'
  | 'neuro';

export type UserRole = 'kunal';

export interface StudyTheaterVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  subject?: string;
  difficulty?: string;
  category?: string;
  startSeconds?: number;
  duration?: string;
  thumbnailUrl?: string;
  description?: string;
  openPhotoNotes?: boolean;
}

export interface ILecturePhotoNote {
  id: string;
  videoId: string;
  imageUrl: string;
  title?: string;
  notes?: string;
  createdAt: number;
  fileSize?: string;
}

export type TaskImportance = 'MUST_DO' | 'CORE' | 'PRACTICE' | 'BONUS';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  actualSeconds: number;
  isCompleted: boolean;
  order: number;
  goalSource?: string;
  scheduledTime?: string;
  importance?: TaskImportance;
  isCritical?: boolean;
  whyItMatters?: string;
  youtubeUrl?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  icon: string;
  isChecked: boolean;
}

// ======================= DMN REPROGRAMMING NARRATIVE =======================

export interface IDmnNarrative {
  id: string;
  title: string;
  category: 'focus' | 'sleep' | 'dsa_study' | 'gen_ai' | 'dopamine_retention' | 'nutrition' | 'character' | 'digital_hygiene' | 'career' | 'custom';
  
  // Part 1: Identity-Based Beliefs
  identityStatement: string;  // "I am the type of person who [core value/behavior] because [value statement]."
  groundedFacts: string;      // "I know the data that [fact/science]."
  futureEdge: string;         // "Embodying this gives me an edge in [area] because [outcome]."
  targetHabitRule: string;    // "I make sure that I [specific target habit] every day."
  
  // Part 2: Implementation Intentions (Situation-Action Movie Scene)
  triggerCue: string;         // "When / If [Specific Cue or Situation]"
  step1: string;              // "First tiny effortless step..."
  step2: string;              // "Then..."
  step3: string;              // "Finally..."
  movieSceneDescription?: string; // Rich sensory description of environment & sequence
  
  // Part 3: Daily Routine & Stats
  lastReviewedAt?: number;
  reviewStreakCount: number;
  createdAt: number;
  updatedAt?: number;
}

// ======================= NEUROSCIENCE PROTOCOLS =======================

export interface IWoopGoal {
  id: string;
  wish: string;
  outcome: string;
  obstacle: string; // Hyperrealistic distraction/laziness obstacle
  plan: string;     // If-Then plan (e.g. "If [obstacle], then I will [action]")
  targetSubject?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface ITimestampNote {
  id: string;
  timestampSeconds: number;
  timestampFormatted: string; // e.g. "04:15" or "1:12:00"
  note: string;
  isRevisit: boolean; // Flagged as confusing / need to revisit
  createdAt: number;
}

export interface ISessionRecall {
  id: string;
  subject: string;
  topicTitle: string;
  recallContent: string;
  timestampNotes?: ITimestampNote[];
  durationMinutes: number;
  phoneDistanced: boolean;
  microRestsCompleted: number;
  createdAt: number;
}

export type BinauralSoundMode = 'off' | 'binaural-40hz' | 'brown-noise' | 'pink-noise';


