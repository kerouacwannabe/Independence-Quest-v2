import { CHAPTERS, REWARDS, getQuestMechanicMeta } from '../content';
import type { GameState, QuestEntry, ProgressPathNode } from './types';

function isChapterRequirementMet(state: GameState, chapter: any) {
  const cleared = chapter.quests.filter((q: any) => state.quests[q.id]?.status === 'completed').length;
  const minCompleted = chapter.completionRule?.minCompleted ?? chapter.quests.length;
  return cleared >= minCompleted;
}

export function selectUnlockedChapters(state: GameState) {
  const { step, firstProofDone } = state.campaign;
  if (step < 1 || !firstProofDone) return CHAPTERS.slice(0, 1);
  return CHAPTERS.filter((ch, i) => {
    if (i === 0) return true;
    const prev = CHAPTERS[i - 1];
    const prevBossId = state.chapterBosses[prev.id] ?? prev.bossPool[0]?.id;
    const bossCleared = prevBossId ? state.bosses[prevBossId]?.status === 'completed' : true;
    return isChapterRequirementMet(state, prev) && bossCleared;
  });
}

export function selectCurrentChapter(state: GameState) {
  if (state.campaign.step < 5 && !state.campaign.complete) return null;
  for (const ch of CHAPTERS) {
    const questsDone = isChapterRequirementMet(state, ch);
    const chapterBossId = state.chapterBosses[ch.id] ?? ch.bossPool[0]?.id;
    const bossDone = chapterBossId ? state.bosses[chapterBossId]?.status === 'completed' : true;
    if (!questsDone || !bossDone) return ch;
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
  type: 'setup' | 'firstProof' | 'activeQuest' | 'blocked' | 'availableBoss' | 'lowestXP' | 'chapterComplete' | 'finalWin';
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
    if (q) return { type: 'firstProof', heading: 'First Evidence', copy: `Complete: "${q.title}". This gives you immediate evidence the campaign can hold.`, button: 'View Quest', questId: state.campaign.firstProof };
  }
  const ch = selectCurrentChapter(state);
  if (!ch) return { type: 'finalWin', heading: 'Journey complete!', copy: 'You have conquered every chapter. Well earned, Boss.', button: 'View Profile' };
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
    return isChapterRequirementMet(state, prev);
  });
  if (nextChapter) {
    return { type: 'chapterComplete', heading: `Chapter complete! → ${nextChapter.title}`, copy: 'You\'ve cleared this chapter and its guardian. The next challenge awaits.', button: 'View Quests' };
  }
  // All chapters and bosses complete
  return { type: 'finalWin', heading: 'Campaign complete!', copy: 'Every challenge conquered. You have forged your own independence.', button: 'View Profile' };
}

export function selectRogueEligibleQuestIds() {
  return CHAPTERS.flatMap((chapter) => chapter.quests)
    .filter((quest) => {
      const meta = getQuestMechanicMeta(quest.id);
      return meta.routeCombo || (quest.tags || []).some((tag) => ['errand', 'admin', 'household', 'communications'].includes(tag));
    })
    .map((quest) => quest.id);
}

export function selectRoutineEligibleQuestIds() {
  return CHAPTERS.flatMap((chapter) => chapter.quests)
    .filter((quest) => {
      const meta = getQuestMechanicMeta(quest.id);
      return meta.routine || (quest.tags || []).includes('routine');
    })
    .map((quest) => quest.id);
}

export function selectPlanningEligibleQuestIds() {
  return CHAPTERS.flatMap((chapter) => chapter.quests)
    .filter((quest) => {
      const meta = getQuestMechanicMeta(quest.id);
      return meta.planning || (quest.tags || []).some((tag) => ['systems', 'focus', 'discipline'].includes(tag));
    })
    .map((quest) => quest.id);
}

export function selectClassHud(state: GameState) {
  switch (state.classId) {
    case 'barbarian':
      return {
        title: 'First Strike',
        summary: state.barbarian?.completedAt ? 'Momentum active' : state.barbarian?.activeQuestId ? 'Choose your opening action' : 'Ready to strike',
        tone: state.barbarian?.completedAt ? 'success' : state.barbarian?.activeQuestId ? 'warning' : 'neutral'
      };
    case 'rogue':
      return {
        title: 'Route Combo',
        summary: state.rogueRun?.active ? `${state.rogueRun.completedQuestIds.length}/${state.rogueRun.selectedQuestIds.length} cleared` : `${state.rogueRun?.selectedQuestIds?.length ?? 0} queued`,
        tone: state.rogueRun?.active ? 'info' : 'neutral'
      };
    case 'monk':
      return {
        title: 'Breath Beads',
        summary: `${state.monk?.discipline ?? 0} beads banked`,
        tone: (state.monk?.discipline ?? 0) >= 3 ? 'success' : 'neutral'
      };
    case 'wizard':
      return {
        title: 'Spellcraft',
        summary: `${state.wizard?.preparedSpells?.length ?? 0} spells prepared`,
        tone: (state.wizard?.preparedSpells?.length ?? 0) > 0 ? 'info' : 'neutral'
      };
    default:
      return null;
  }
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

export function selectComebackMessage(state: GameState) {
  const last = state.streaks?.lastActiveDate;
  if (!last) return 'Fresh day, clean board. Take one useful swing.';
  const diff = Math.floor((Date.now() - new Date(last).getTime()) / 86400000);
  if (diff <= 1) return 'Momentum is alive. Protect it with one meaningful move.';
  if (diff === 2) return 'You missed a day, not your whole campaign. Clear one comeback win.';
  return 'No guilt spiral. Restart with one small piece of evidence and rebuild from there.';
}

export function selectDailyObjective(state: GameState) {
  const current = selectCurrentChapter(state);
  const availableQuest = current?.quests.find((q) => state.quests[q.id]?.status === 'available');
  const startedQuest = current?.quests.find((q) => state.quests[q.id]?.status === 'started');
  const mode = state.settings?.dailyMode ?? 'balanced';
  const branch = state.campaign.branch ?? 'stability';
  const branchLine = branch === 'momentum'
    ? 'Momentum branch: stack one fast win and keep the motion hot.'
    : 'Stability branch: make the board safer, steadier, and easier to return to.';
  if (mode === 'speed') return startedQuest ? `Push ${startedQuest.title} in one fast burst. ${branchLine}` : `Find the smallest quest and clear it quickly. ${branchLine}`;
  if (mode === 'social') return `Use a body-double, text a human, or do one quest with support. ${branchLine}`;
  if (mode === 'low-energy') return `Choose the smallest legitimate move. Slow counts. ${branchLine}`;
  if (startedQuest) return `Finish one subquest in ${startedQuest.title}. ${branchLine}`;
  if (availableQuest) return `Start ${availableQuest.title} and land the first required step. ${branchLine}`;
  const chapterBossId = current ? state.chapterBosses[current.id] ?? current.bossPool[0]?.id : null;
  const boss = current?.bossPool.find((b) => b.id === chapterBossId);
  if (boss && state.bosses[boss.id]?.status !== 'completed') return `Prepare for ${boss.title} and clear at least one boss task. ${branchLine}`;
  return `Take one visible action that makes tomorrow easier. ${branchLine}`;
}

export function selectClassObjective(state: GameState) {
  switch (state.classId) {
    case 'barbarian':
      return state.barbarian?.completedAt
        ? 'Momentum lit. Chain another immediate action before it cools.'
        : 'Claim one opening hit fast, move body first and think later.';
    case 'rogue':
      return state.rogueRun?.active
        ? `Clear the route combo, ${state.rogueRun.completedQuestIds.length}/${state.rogueRun.selectedQuestIds.length} down.`
        : 'Lock a 2 to 3 quest route, then cash it out in one run.';
    case 'monk':
      return (state.monk?.discipline ?? 0) >= 3
        ? 'Spend discipline to rescue a stalled quest or preserve momentum.'
        : 'Stack routine completions to bank discipline for future saves.';
    case 'wizard':
      return (state.wizard?.preparedSpells?.length ?? 0) > 0
        ? 'Use your prepared spells on the quests they were meant to shape.'
        : 'Prepare two spells now so tomorrow starts with intent instead of drift.';
    default:
      return 'Take the next real action, not the prettiest hypothetical one.';
  }
}

export function selectProgressUnlocks(state: GameState) {
  const xp = selectTotalXP(state);
  const completions = selectTotalCompletions(state);
  const unlocks: string[] = [];
  if (completions >= 2) unlocks.push('Map pins become more visible and urgent.');
  if (xp >= 50) unlocks.push('You unlock stronger recovery and rescue signals.');
  if (xp >= 100) unlocks.push('Boss rewards start feeling like real progression, not decoration.');
  if (xp >= 150) unlocks.push('The campaign reveals more of the long-term route.');
  switch (state.classId) {
    case 'barbarian':
      unlocks.push(state.barbarian?.completedAt ? 'Momentum is live, so your first action matters more.' : 'First Strike is ready, waiting for a clean opening hit.');
      break;
    case 'rogue':
      unlocks.push(state.rogueRun?.active ? 'Route combo power is active for quick chained wins.' : 'A 2-quest route combo is waiting to be assembled.');
      break;
    case 'monk':
      unlocks.push(`Breath beads: ${state.monk?.discipline ?? 0}. Three beads unlock a rescue.`);
      break;
    case 'wizard':
      unlocks.push(`${state.wizard?.preparedSpells?.length ?? 0} spells prepared. Prep more to shape the board.`);
      break;
  }
  return unlocks;
}

export function selectProgressPath(state: GameState): ProgressPathNode[] {
  const currentChapter = selectCurrentChapter(state) ?? CHAPTERS[0] ?? null;
  if (!currentChapter) return [];
  const currentIdx = CHAPTERS.findIndex((chapter) => chapter.id === currentChapter.id);
  const path: ProgressPathNode[] = [];

  CHAPTERS.slice(Math.max(0, currentIdx - 1), Math.min(CHAPTERS.length, currentIdx + 2)).forEach((chapter, index) => {
    const chapterIdx = CHAPTERS.findIndex((c) => c.id === chapter.id);
    const completedQuests = chapter.quests.filter((quest) => state.quests[quest.id]?.status === 'completed').length;
    const chapterComplete = completedQuests >= (chapter.completionRule?.minCompleted ?? chapter.quests.length);
    const bossId = state.chapterBosses[chapter.id] ?? chapter.bossPool[0]?.id;
    const bossDone = bossId ? state.bosses[bossId]?.status === 'completed' : true;
    const completed = chapterComplete && bossDone;
    const isCurrent = chapter.id === currentChapter.id;
    const isNext = !isCurrent && chapterIdx === currentIdx + 1;
    const isBossGate = chapter.bossPool.length > 0 && !bossDone && completedQuests >= (chapter.bossRevealAt ?? 2);
    path.push({
      id: chapter.id,
      title: chapter.title,
      subtitle: completed
        ? 'Complete'
        : isBossGate
          ? 'Boss gate'
          : `${completedQuests}/${chapter.quests.length} quests`,
      kind: completed ? 'complete' : isCurrent ? 'current' : isNext ? 'next' : 'upcoming',
      completed,
      isBossGate,
    });
  });

  return path;
}

export function selectNextProgressStep(state: GameState) {
  const path = selectProgressPath(state);
  return path.find((node) => node.kind === 'next' || node.kind === 'current') ?? path[0] ?? null;
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
  else if (!selectCurrentChapter(state)) msg = 'Campaign complete. The endpoint is yours, and the map is done.';
  else if (!state.campaign.firstProofDone) msg = 'Complete your first evidence action to unlock the campaign engine.';
  else if (streak > 3) msg = "You're on fire! Each day builds independence.";
  else if (prog >= 0.7) msg = "Boss approaches. Review your resources and prepare.";
  else if (ch && prog >= 0.9) msg = "Chapter nearly done — one more push!";
  else if (streak === 0 && state.streaks?.lastActiveDate) msg = "Yesterday slipped away. What small action today?";
  else if (h < 12) msg = "Morning launch window — tackle one thing before the day scatters.";
  else if (h < 17) msg = "Afternoon follow-through — close one started quest.";
  else msg = "Evening reset — plan tomorrow and restore your space.";
  return { message: msg, dayPhase: dp };
}
