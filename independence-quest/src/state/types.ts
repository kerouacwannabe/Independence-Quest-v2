export type EntryStatus = 'available' | 'started' | 'waiting' | 'blocked' | 'completed';

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
