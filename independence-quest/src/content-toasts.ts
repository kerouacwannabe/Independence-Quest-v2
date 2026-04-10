// Celebration/Toast Copy — VGM Phase 2
// Keep messages concise and motivation-positive

export interface ToastMessage { id: number; text: string; stage: string; }

export const QUEST_COMPLETED_TOASTS: ToastMessage[] = [
  { id: 1, text: "Quest complete!", stage: "quest-complete" },
  { id: 2, text: "Done and done!", stage: "quest-complete" },
  { id: 3, text: "Task cleared!", stage: "quest-complete" },
  { id: 4, text: "Checkmate, task.", stage: "quest-complete" },
  { id: 5, text: "Victory achieved!", stage: "quest-complete" }
];

export const BOSS_DEFEATED_TOASTS: ToastMessage[] = [
  { id: 1, text: "Boss down! The lair is yours.", stage: "boss-defeated" },
  { id: 2, text: "Boss vanquished! Respect the grind.", stage: "boss-defeated" },
  { id: 3, text: "Boss defeated. Loot acquired.", stage: "boss-defeated" },
  { id: 4, text: "The boss falls. You remain standing.", stage: "boss-defeated" },
  { id: 5, text: "Boss shattered! Well earned.", stage: "boss-defeated" }
];

export const CHAPTER_COMPLETE_TOASTS: ToastMessage[] = [
  { id: 1, text: "Chapter complete! New challenges await.", stage: "chapter-complete" },
  { id: 2, text: "Chapter conquered. The path continues.", stage: "chapter-complete" },
  { id: 3, text: "You mastered this chapter. Onward!", stage: "chapter-complete" },
  { id: 4, text: "Chapter cleared. The story advances.", stage: "chapter-complete" }
];

export const LEVEL_UP_TOASTS: ToastMessage[] = [
  { id: 1, text: "Level up! New abilities unlocked.", stage: "level-up" },
  { id: 2, text: "Growth achieved. You are stronger.", stage: "level-up" },
  { id: 3, text: "Level gained! Keep climbing.", stage: "level-up" }
];

export const STREAK_MILESTONE_TOASTS: ToastMessage[] = [
  { id: 1, text: "Streak milestone! Consistency pays off.", stage: "streak-milestone" },
  { id: 2, text: "Streak achieved! Momentum builds.", stage: "streak-milestone" },
  { id: 3, text: "Streak honor unlocked. Keep the flame.", stage: "streak-milestone" }
];

export const REWARD_CLAIMED_TOASTS: ToastMessage[] = [
  { id: 1, text: "Reward claimed! Treat yourself.", stage: "reward-claimed" },
  { id: 2, text: "Loot collected! Enjoy the spoils.", stage: "reward-claimed" },
  { id: 3, text: "Claimed! You earned this.", stage: "reward-claimed" }
];

export const FIRST_PROOF_COMPLETE_TOASTS: ToastMessage[] = [
  { id: 1, text: "First evidence collected. Momentum starts.", stage: "first-proof-complete" },
  { id: 2, text: "Evidence gathered. The journey begins.", stage: "first-proof-complete" },
  { id: 3, text: "First evidence locked in. You're underway!", stage: "first-proof-complete" }
];

export const FALLBACK_TOASTS: ToastMessage[] = [
  { id: 1, text: "Progress made. Keep moving.", stage: "fallback" },
  { id: 2, text: "Another step forward.", stage: "fallback" },
  { id: 3, text: "The work continues. Good.", stage: "fallback" }
];

export const TOASTS_BY_STAGE: Record<string, ToastMessage[]> = {
  'quest-complete': QUEST_COMPLETED_TOASTS,
  'boss-defeated': BOSS_DEFEATED_TOASTS,
  'chapter-complete': CHAPTER_COMPLETE_TOASTS,
  'level-up': LEVEL_UP_TOASTS,
  'streak-milestone': STREAK_MILESTONE_TOASTS,
  'reward-claimed': REWARD_CLAIMED_TOASTS,
  'first-proof-complete': FIRST_PROOF_COMPLETE_TOASTS,
  fallback: FALLBACK_TOASTS
};

export function getRandomToast(stage: string): ToastMessage {
  const pool = TOASTS_BY_STAGE[stage] || FALLBACK_TOASTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
