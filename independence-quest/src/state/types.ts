export type EntryStatus = 'available' | 'started' | 'advanced' | 'waiting' | 'blocked' | 'completed';
export type AppTab = 'today' | 'quests' | 'map' | 'toolkit' | 'profile' | 'advisor';

export type QuestEntry = {
  status: EntryStatus;
  blockedReason: string;
  blockerType: string;
  blockPlan: { smallestStep: string; support: string; retryWhen: string };
  waitingPlan: { reason: string; followup: string; retryWhen: string };
  subquests: Record<string, boolean>;
  ritualPlan: Record<string, boolean>;
  bonuses: { momentum: boolean; ritual: boolean; rogueCombo: boolean; recovery: boolean; lowEnergy: boolean };
  startedAt: number | null;
  completedAt: number | null;
};

export type BossStatus = 'locked' | 'available' | 'started' | 'completed';
export type BossEntryStatus = { status: BossStatus; subquests: Record<string, boolean>; completedAt?: number };

export interface GameState {
  classId: string;
  characterName: string;
  createdAt: number | null;
  updatedAt: number | null;
  campaign: {
    complete: boolean;
    step: number;
    origin: string;
    motivation: string;
    vow: string;
    firstProof: string;
    firstProofDone: boolean;
    pathMode: 'guided' | 'free';
    branch: string;
  };
  quests: Record<string, QuestEntry>;
  bosses: Record<string, BossEntryStatus>;
  chapterBosses: Record<string, string>;
  supportTasks: Record<string, { status: string; completedAt?: number }>;
  rogueRun: { active: boolean; selectedQuestIds: string[]; completedQuestIds: string[]; bonusAwarded: boolean };
  monk: { discipline: number };
  barbarian: { activeQuestId: string | null; expiresAt: number | null; choice: string; completedAt: number | null };
  wizard: { preparedSpells: string[]; castToday: string[] };
  rewardsClaimed: number[];
  streaks: { daily: number; weekly: number; lastActiveDate: string };
  vgmAdvisor: { lastMessage: string; lastShownDate: string; history: string[] };
  settings: {
    soundEnabled: boolean;
    effectsEnabled: boolean;
    familyMode: boolean;
    focusMode: boolean;
    showFullMap: boolean;
    nameLocked: boolean;
    dailyMode: string;
    collapsedSections: Record<string, boolean>;
  };
  version: number;
}

export type ProgressPathNode = {
  id: string;
  title: string;
  subtitle: string;
  kind: 'current' | 'next' | 'upcoming' | 'complete';
  completed: boolean;
  isBossGate: boolean;
};
