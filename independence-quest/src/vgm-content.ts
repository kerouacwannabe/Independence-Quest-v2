// Virtual Game Manager — Daily Advisor Content
// Tone: Progress over perfection, Momentum over guilt, Strategy over moral judgment
// Max ~120 chars per message

export interface VGMMessage {
  id: number;
  text: string;
  tone: 'encourage' | 'warn' | 'celebrate' | 'reflect' | 'coach';
  stage: 'unstarted' | 'first-proof' | 'chapter1' | 'mid-chapter' | 'boss-near' | 'boss-active' | 'chapter-complete' | 'streak-hot' | 'streak-broken' | 'weekend' | 'weekday';
  priority: number;
}

const messages: VGMMessage[] = [
  // Unstarted (onboarding, early encouragement)
  { id: 1, text: "The avoidance goblin loses this round. Start small, start now.", tone: 'encourage', stage: 'unstarted', priority: 1 },
  { id: 2, text: "Welcome. Independence begins with one visible action.", tone: 'encourage', stage: 'unstarted', priority: 2 },
  { id: 3, text: "Three items is plenty; ten is how madness starts.", tone: 'warn', stage: 'unstarted', priority: 1 },
  { id: 4, text: "Chaos loves ambiguity. Name your first task.", tone: 'coach', stage: 'unstarted', priority: 2 },
  { id: 5, text: "You don't need motivation. You need a five-minute window.", tone: 'coach', stage: 'unstarted', priority: 3 },

  // First Proof phase
  { id: 6, text: "Your first proof is a ritual. Do it daily until it sticks.", tone: 'encourage', stage: 'first-proof', priority: 1 },
  { id: 7, text: "This small act declares the day has begun. Claim it.", tone: 'celebrate', stage: 'first-proof', priority: 2 },
  { id: 8, text: "First proof = momentum multiplier. Don't overthink; just do.", tone: 'coach', stage: 'first-proof', priority: 1 },
  { id: 9, text: "You chose this task for a reason. Trust the plan.", tone: 'reflect', stage: 'first-proof', priority: 2 },

  // Chapter 1 progression
  { id: 10, text: "Personal stability is the foundation. Tidy space, tidy mind.", tone: 'coach', stage: 'chapter1', priority: 1 },
  { id: 11, text: "Small routines build systems. Keep the chain intact.", tone: 'encourage', stage: 'chapter1', priority: 2 },
  { id: 12, text: "One room at a time. Pace yourself; this is a marathon.", tone: 'coach', stage: 'chapter1', priority: 3 },

  // Mid-chapter (chapters 1-4)
  { id: 13, text: "You're past the halfway mark. Don't let drift steal progress.", tone: 'warn', stage: 'mid-chapter', priority: 1 },
  { id: 14, text: "Mid-chapter fatigue is normal. Push through with a timer.", tone: 'coach', stage: 'mid-chapter', priority: 2 },
  { id: 15, text: "Review your blockers. Adjust the plan, not the goal.", tone: 'encourage', stage: 'mid-chapter', priority: 3 },

  // Boss approaching (after bossRevealAt met)
  { id: 16, text: "A boss rises. Prepare your resources and summon resolve.", tone: 'warn', stage: 'boss-near', priority: 1 },
  { id: 17, text: "The boss tests your chapter mastery. Study your weakest subquest.", tone: 'coach', stage: 'boss-near', priority: 2 },
  { id: 18, text: "Boss fights favor preparation. Schedule a dedicated session.", tone: 'coach', stage: 'boss-near', priority: 3 },

  // Boss active (started but not completed)
  { id: 19, text: "The boss waits for no one. A subquest today is damage dealt.", tone: 'encourage', stage: 'boss-active', priority: 1 },
  { id: 20, text: "Don't let the boss regen. Complete at least one subquest.", tone: 'warn', stage: 'boss-active', priority: 2 },
  { id: 21, text: "Boss progress compounds. Even a tiny hit counts.", tone: 'encourage', stage: 'boss-active', priority: 3 },

  // Chapter complete
  { id: 22, text: "Chapter cleared! You leveled up your life. Celebrate meaningfully.", tone: 'celebrate', stage: 'chapter-complete', priority: 1 },
  { id: 23, text: "One chapter down, several to go. Bask, then reset.", tone: 'reflect', stage: 'chapter-complete', priority: 2 },
  { id: 24, text: "You grew. Next tier introduces new complexity. Prepare.", tone: 'coach', stage: 'chapter-complete', priority: 3 },

  // Streak hot (daily streak >= 3)
  { id: 25, text: "Streak > 3! You're building habit inertia. Keep the daily win.", tone: 'celebrate', stage: 'streak-hot', priority: 1 },
  { id: 26, text: "The chain is your ally. Do not break the chain.", tone: 'encourage', stage: 'streak-hot', priority: 2 },
  { id: 27, text: "Consistency beats occasional heroics. Stay the course.", tone: 'reflect', stage: 'streak-hot', priority: 3 },

  // Streak broken
  { id: 28, text: "Streak broken. No guilt — just reset and continue.", tone: 'reflect', stage: 'streak-broken', priority: 1 },
  { id: 29, text: "Missed a day? No problem. Today is its own fresh start.", tone: 'encourage', stage: 'streak-broken', priority: 2 },
  { id: 30, text: "The past is a teacher, not a judge. Begin again.", tone: 'reflect', stage: 'streak-broken', priority: 3 },

  // Weekend variations
  { id: 31, text: "Weekend is for batch tasks and recovery. Tackle the backlog.", tone: 'coach', stage: 'weekend', priority: 1 },
  { id: 32, text: "Use weekend margin to preview next week's first proof.", tone: 'coach', stage: 'weekend', priority: 2 },

  // Weekday variations
  { id: 33, text: "Weekdays demand focus. One important task before scatter.", tone: 'warn', stage: 'weekday', priority: 1 },
  { id: 34, text: "Morning launch window is your power slot. Use it.", tone: 'coach', stage: 'weekday', priority: 1 },
  { id: 35, text: "Evening = reset time. Tidy and plan tmr.", tone: 'reflect', stage: 'weekday', priority: 2 }
];

export function getDailyAdvice(state: {
  campaign: { complete: boolean; step: number; firstProofDone: boolean };
  streaks?: { daily: number };
  quests: Record<string, any>;
}): VGMMessage | null {
  // Compute context
  const cc = Object.values(state.quests).filter(e => e?.status === 'completed').length;
  // Determine stage
  let stage: VGMMessage['stage'] = 'unstarted';
  if (state.campaign.step < 5 && !state.campaign.complete) stage = 'unstarted';
  else if (!state.campaign.firstProofDone) stage = 'first-proof';
  else if (state.streaks?.daily > 3) stage = 'streak-hot';
  else if (state.streaks?.daily === 0 && state.streaks?.lastActiveDate) stage = 'streak-broken';
  // hour check for weekday/weekend
  const day = new Date().getDay();
  if (stage === 'unstarted' || stage === 'first-proof') {} else if (day === 0 || day === 6) stage = 'weekend';
  else stage = 'weekday';

  // Priority 1 messages for this stage
  const pool = messages.filter(m => m.stage === stage && m.priority <= 2);
  if (pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }
  // Fallback to any stage priority 1-3
  const any = messages.filter(m => m.priority <= 3);
  return any[Math.floor(Math.random() * any.length)] ?? messages[0];
}

export function getPhaseDescription(dayPhase: 'morning' | 'afternoon' | 'evening'): string {
  switch (dayPhase) {
    case 'morning': return 'Morning is your launch window.';
    case 'afternoon': return 'Afternoon is for follow-through.';
    case 'evening': return 'Evening is for reset and planning.';
    default: return '';
  }
}
