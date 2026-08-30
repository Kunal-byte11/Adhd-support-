export type ScreenType = 'now' | 'roadmap' | 'intake' | 'urges' | 'recovery' | 'adhd-helper' | 'daily-plan' | 'partner-hq' | 'ia1-prep';

export type UserRole = 'kunal' | 'partner';

export interface PartnerNudge {
  id: string;
  type: 'breathe' | 'water' | 'focus' | 'proud' | 'love';
  label: string;
  emoji: string;
  timestamp: number;
  fromName: string;
}

export interface StagedReward {
  id: string;
  type: 'photo' | 'voice' | 'coupon' | 'date';
  title: string;
  description: string;
  noteFromPartner?: string;
  audioDuration?: string;
  partnerPhotoUrl?: string;
  isUnlocked: boolean;
  unlockedAt?: number;
  createdAt: number;
}

export interface DailyScheduleSubStep {
  id: string;
  title: string;
  minutes: number;
  isCompleted: boolean;
  importance?: TaskImportance;
}

export interface DailyScheduleBlock {
  id: string;
  timeSlot: string;
  title: string;
  category: 'dsa' | 'genai' | 'revision' | 'steps' | 'english' | 'break' | 'custom';
  durationMinutes: number;
  icon: string;
  description: string;
  isCompleted: boolean;
  stepsTarget?: number;
  subSteps: DailyScheduleSubStep[];
  whyItMatters?: string;
  curriculumRef?: string;
  youtubeUrl?: string;
}

export interface DailyPlanState {
  userName: string;
  dsaHours: number;
  genAiHours: number;
  revisionHours: number;
  stepGoal: number;
  currentSteps: number;
  englishMinutes: number;
  englishCompleted: boolean;
  startTime: string;
  scheduleBlocks: DailyScheduleBlock[];
  notes?: string;
  lastGeneratedDate?: string;
}

export interface PartnerReward {
  id: string;
  title: string;
  description: string;
  category: 'treat' | 'date' | 'massage' | 'food' | 'custom' | 'coupon' | 'kiss';
  icon: string;
  requiredPoints?: number;
  unlockedAt?: number;
  isRedeemed: boolean;
  noteFromPartner?: string;
  grantedBy: string;
  createdAt: number;
  audioDataUrl?: string;
}

export interface PartnerNote {
  id: string;
  author: string;
  message: string;
  timestamp: number;
  emoji: string;
  isRead?: boolean;
  imageUrl?: string;
  audioDataUrl?: string;
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

export interface UrgeLog {
  id: string;
  timestamp: number;
  triggerTime: string;
  urgeType: string;
  feelingNow: string;
  feelingTomorrow: string;
  durationSeconds: number;
  timerCompleted: boolean;
  preventedAction: boolean;
}

export interface MicroTask {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionHint?: string;
}

export interface AutoChunkResponse {
  goal: string;
  importanceVerdict?: string;
  visualSummary?: string;
  whatIsCritical?: string;
  whatCanWait?: string;
  actionPlan: {
    stepNumber: number;
    title: string;
    description: string;
    estimatedMinutes: number;
    importance?: TaskImportance;
    whyItMatters?: string;
  }[];
  preFlightChecklist: {
    label: string;
    icon: string;
  }[];
  providerUsed?: string;
}

export interface RecalibrateResponse {
  status: string;
  delayMinutesAdded: number;
  newEstimatedCompletion: string;
  message: string;
}
