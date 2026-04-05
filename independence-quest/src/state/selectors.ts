import { CHAPTERS, REWARDS } from '../content';
import type { GameState, QuestEntry } from './types';

export function selectUnlockedChapters(state: GameState) {
  const { step, firstProofDone } = state.campaign;
  if (step < 1 || !firstProofDone) return CHAPTERS.slice(0, 1);
  return CHAPTERS.filter((ch, i) => {
    if (i === 0) return true;
    const prev = CHAPTERS[i - 1];
    return prev.quests.every((q) => state.quests[q.id]?.status === 'completed');
  });
}

export function selectCurrentChapter(state: GameState) {
  if (state.campaign.step < 5 && !state.campaign.complete) return null;
  for (const ch of CHAPTERS) {
    if (!ch.quests.every((q) => state.quests[q.id]?.status === 'completed')) return ch;
  }
  return CHAPTERS[CHAPTERS.length - 1] ?? null;
}

export function selectAvailableBosses(state: GameState, chapterId: string) {
  const ch = CHAPTERS.find((c) => c.id === chapterId);
  if (!ch) return [];
  const cc = ch.quests.filter((q) => state.quests[q.id]?.status === 'completed').length;
  if (cc < (ch.bossRevealAt ?? 2)) return [];
  return ch.bossPool.map((b) => ({
    ...b, status: state.bosses[b.id]?.status ?? 'locked', assigned: state.chapterBosses[chapterId] === b.id
  }));
}

export type NextMove = {
  type: 'setup' | 'firstProof' | 'activeQuest' | 'blocked' | 'availableBoss' | 'lowestXP' | 'chapterComplete';
  heading: string; copy: string; button: string;
  questId?: string; bossId?: string;
};

export function selectNextMove(state: GameState): NextMove {
  const { firstProofDone, step } = state.campaign;
  if (step < 5 && !state.campaign.complete) {
    return { type: 'setup', heading: 'Finish campaign setup', copy: 'Complete the wizard to lock in your class, origin, and motivation.', button: 'Continue Setup' };
  }
  if (!firstProofDone && state.campaign.firstProof) {
    const q = CHAPTERS.flatMap(c => c.quests).find((x) => x.id === state.campaign.firstProof);
    if (q) return { type: 'firstProof', heading: 'First Proof', copy: `Complete: "${q.title}". This unlocks the campaign engine.`, button: 'View Quest', questId: state.campaign.firstProof };
  }
  const ch = selectCurrentChapter(state);
  if (!ch) return { type: 'chapterComplete', heading: 'Journey complete!', copy: 'You have conquered every chapter. Well earned, Boss.', button: 'View Quests' };
  const active = ch.quests.find(q => state.quests[q.id]?.status === 'started');
  if (active) {
    const e = state.quests[active.id];
    const t = e?.startedAt ? new Date(e.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return { type: 'activeQuest', heading: `Continue: ${active.title}`, copy: `Started at ${t}. One subquest moves you forward.`, button: 'Resume', questId: active.id };
  }
  const blocked = ch.quests.find(q => state.quests[q.id]?.status === 'blocked');
  if (blocked) {
    const e = state.quests[blocked.id];
    return { type: 'blocked', heading: `Unblock: ${blocked.title}`, copy: e?.blockedReason ?? 'Address the blocker to continue.', button: 'View Details', questId: blocked.id };
  }
  const bosses = selectAvailableBosses(state, ch.id);
  const availBoss = bosses.find(b => state.bosses[b.id]?.status !== 'completed');
  if (availBoss) return { type: 'availableBoss', heading: `Boss: ${availBoss.title}`, copy: 'Your progress revealed a boss. Prepare your resources.', button: 'Face Boss', bossId: availBoss.id };
  const withProg = ch.quests
    .map((q) => {
      const e = state.quests[q.id];
      const d = e ? Object.values(e.subquests).filter(Boolean).length : 0;
      return { q, d, t: q.subquests.length };
    })
    .filter((x) => x.d < x.t)
    .sort((a, b) => a.d - b.d);
  if (withProg.length) {
    const n = withProg[0];
    return { type: 'lowestXP', heading: `Continue: ${n.q.title}`, copy: `${n.d}/${n.t} subquests done.`, button: 'Work Quest', questId: n.q.id };
  }
  // Chapter is complete but maybe bosses remain
  const anyBossLeft = ch.bossPool.some(b => state.bosses[b.id]?.status !== 'completed');
  if (anyBossLeft) {
    return { type: 'availableBoss', heading: 'Chapter complete! Boss awaits', copy: 'You\'ve cleared this chapter. Time to face the final guardian.', button: 'View Quests' };
  }
  // Chapter AND bosses all done — check if there's a next chapter
  const nextChapter = CHAPTERS.find((c) => {
    const idx = CHAPTERS.indexOf(c);
    if (idx <= CHAPTERS.indexOf(ch)) return false;
    const prev = CHAPTERS[idx - 1];
    return prev.quests.every(q => state.quests[q.id]?.status === 'completed');
  });
  if (nextChapter) {
    return { type: 'chapterComplete', heading: `Chapter complete! → ${nextChapter.title}`, copy: 'You\'ve cleared this chapter and its guardian. The next challenge awaits.', button: 'View Quests' };
  }
  // All chapters and bosses complete
  return { type: 'chapterComplete', heading: 'Campaign complete!', copy: 'Every challenge conquered. You have forged your own independence.', button: 'View Profile' };
}

export function selectTotalXP(state: GameState): number {
  let total = 0;
  for (const ch of CHAPTERS) {
    for (const q of ch.quests) if (state.quests[q.id]?.status === 'completed') total += q.completionBonus ?? 0;
    for (const b of ch.bossPool) if (state.bosses[b.id]?.status === 'completed') total += b.completionBonus ?? 0;
  }
  return total;
}

export function selectLevel(state: GameState): number {
  return Math.max(1, Math.floor(selectTotalXP(state) / 100) + 1);
}

export function selectActiveClassBonuses(state: GameState): string[] {
  const bs: string[] = [];
  if (state.classId === 'barbarian') bs.push('+2 XP on quest start (Momentum)');
  if (state.classId === 'rogue') bs.push('Combo bonus: two quests within 30 min');
  if (state.classId === 'wizard') bs.push('Ritual Plan for admin/work/budget quests');
  if (state.classId === 'monk') bs.push(`Discipline: ${state.monk?.discipline ?? 0} (spend 3 for recovery)`);
  return bs;
}

export function selectCampaignSetupStatus(state: GameState) {
  const { step, vow, firstProof, pathMode } = state.campaign;
  const missing: string[] = [];
  if (step < 5) {
    if (!vow) missing.push('campaign vow');
    if (!firstProof) missing.push('first proof task');
    if (!pathMode) missing.push('campaign mode');
  }
  return { step, missingFields: missing, readyToFinish: missing.length === 0 };
}

export function selectAvailableRewards(state: GameState) {
  const cc = Object.values(state.quests as Record<string, QuestEntry>).filter((e) => e.status === 'completed').length;
  const claimed = new Set(state.rewardsClaimed ?? []);
  return REWARDS.filter((r) => r.at <= cc && !claimed.has(r.at));
}

export function selectTotalCompletions(state: GameState): number {
  return Object.values(state.quests as Record<string, QuestEntry>).filter((e) => e.status === 'completed').length;
}

export function selectStreaks(state: GameState) {
  return state.streaks ?? { daily: 0, weekly: 0, lastActiveDate: '' };
}

export function selectDailyAdvice(state: GameState): { message: string; dayPhase: string } {
  const cc = Object.values(state.quests as Record<string, QuestEntry>).filter((e) => e.status === 'completed').length;
  const ch = selectCurrentChapter(state);
  const prog = ch ? ch.quests.filter((q) => state.quests[q.id]?.status === 'completed').length / ch.quests.length : 0;
  const streak = state.streaks?.daily ?? 0;
  const h = new Date().getHours();
  let dp = 'morning'; if (h >= 12 && h < 17) dp = 'afternoon'; else if (h >= 17) dp = 'evening';
  let msg = '';
  if (state.campaign.step < 5 && !state.campaign.complete) msg = 'Set up your campaign to begin the journey.';
  else if (!state.campaign.firstProofDone) msg = 'Complete your first proof to unlock the campaign engine.';
  else if (streak > 3) msg = "You're on fire! Each day builds independence.";
  else if (prog >= 0.7) msg = "Boss approaches. Review your resources and prepare.";
  else if (ch && prog >= 0.9) msg = "Chapter nearly done — one more push!";
  else if (streak === 0 && state.streaks?.lastActiveDate) msg = "Yesterday slipped away. What small action today?";
  else if (h < 12) msg = "Morning launch window — tackle one thing before the day scatters.";
  else if (h < 17) msg = "Afternoon follow-through — close one started quest.";
  else msg = "Evening reset — plan tomorrow and restore your space.";
  return { message: msg, dayPhase: dp };
}
