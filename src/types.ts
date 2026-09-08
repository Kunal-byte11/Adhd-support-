export type ScreenType =
  | 'sem7'
  | 'roadmap'
  | 'woop'
  | 'notes'
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


