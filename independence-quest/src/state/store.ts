// State Management — VGM Phase 2
import { create } from 'zustand';
import { CHAPTERS, LOW_ENERGY_OPTIONS, RESCUE_ITEMS, REWARDS } from '../content';
import { getRandomToast } from '../content-toasts';
import { defaultMeta, defaultState, LEGACY_STORAGE_KEY, META_KEY, STORAGE_PREFIX } from '../defaults';
import type { AppTab, QuestEntry, BossStatus } from './types';

type MonkState = { discipline: number };
type RogueRun = { active: boolean; selectedQuestIds: string[]; completedQuestIds: string[]; bonusAwarded: boolean };
type BarbarianState = { activeQuestId: string | null; expiresAt: number | null; choice: string; completedAt: number | null };
type WizardState = { preparedSpells: string[]; castToday: string[] };
type Streaks = { daily: number; weekly: number; lastActiveDate: string };
type VgmAdvisor = { lastMessage: string; lastShownDate: string; history: string[] };
type ResetHealth = { status: 'ok' | 'stale' | 'needs-check'; lastCheckedDay: string; note: string };

type GameStore = {
  meta: ReturnType<typeof defaultMeta>;
  state: ReturnType<typeof defaultState>;
  ui: {
    activeTab: AppTab;
    expandedQuestId: string | null;
    lastCompletedQuestId: string | null;
    questStarterQuestId: string | null;
    toasts: Array<{ id: number; text: string; stage: string }>;
    nextToastId: number;
  };

  setActiveTab: (tab: AppTab) => void;
  toggleQuestExpanded: (questId: string, forceState?: 'expanded' | 'collapsed') => void;
  dismissQuestStarter: () => void;

  startCampaign: (payload: { name?: string; classId: string; origin: string; motivation: string }) => void;
  setCampaignVow: (vow: string) => void;
  setCampaignFirstProof: (firstProof: string) => void;
  setCampaignMode: (mode: 'guided' | 'free') => void;
  setCampaignBranch: (branch: string) => void;
  completeCampaignSetup: () => void;
  completeFirstProof: () => void;
  respecClass: (classId: string) => void;

  startQuest: (questId: string) => void;
  toggleSubquest: (questId: string, subquestId: string) => void;
  toggleQuestLowEnergy: (questId: string) => void;
  setQuestBlocked: (questId: string, payload: { blockedReason: string; blockerType: string; smallestStep: string; support: string; retryWhen: string }) => void;
  setQuestWaiting: (questId: string, payload: { reason: string; followup: string; retryWhen: string }) => void;
  resumeQuestFlow: (questId: string) => void;
  confirmBarbarianFirstStrike: (questId: string, choice: string) => void;
  dismissBarbarianFirstStrike: () => void;
  toggleRogueRunQuest: (questId: string) => void;
  startRogueRun: () => void;
  clearRogueRun: () => void;
  prepareWizardSpell: (spellId: string) => void;
  rescueBlockedQuestWithDiscipline: (questId: string) => void;

  startBoss: (bossId: string) => void;
  toggleBossSubquest: (bossId: string, subquestId: string) => void;
  completeBoss: (bossId: string) => void;

  claimReward: (rewardIndex: number) => void;
  spendDiscipline: (count: number) => void;
  checkStreaks: () => void;
  setDailyAdviceShown: (text: string, date: string) => void;

  // Toast actions
  addToast: (stage: string) => void;
  removeToast: (id: number) => void;
  setSetting: (key: string, value: any) => void;
};

const getStorageKey = (slotId: string) => `${STORAGE_PREFIX}:${slotId}`;

function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? { ...defaultMeta(), ...JSON.parse(raw) } : defaultMeta();
  } catch {
    return defaultMeta();
  }
}

function hydrateState(incoming = defaultState()) {
  const state = { ...defaultState(), ...incoming } as any;
  state.quests ??= {};
  state.bosses ??= {};
  state.chapterBosses ??= {};
  state.supportTasks ??= {};
  state.rewardsClaimed ??= [];
  state.streaks ??= { daily: 0, weekly: 0, lastActiveDate: '' };
  state.vgmAdvisor ??= { lastMessage: '', lastShownDate: '', history: [] };
  state.resetHealth ??= { status: 'ok', lastCheckedDay: '', note: '' };
  state.monk ??= { discipline: 0 };
  state.rogueRun ??= { active: false, selectedQuestIds: [], completedQuestIds: [], bonusAwarded: false };
  state.barbarian ??= { activeQuestId: null, expiresAt: null, choice: '', completedAt: null };
  state.wizard ??= { preparedSpells: [], castToday: [] };
  state.resetHealth ??= { status: 'ok', lastCheckedDay: '', note: '' };

  CHAPTERS.forEach((chapter) => {
    if (!state.chapterBosses[chapter.id]) state.chapterBosses[chapter.id] = chapter.bossPool[0].id;
    chapter.quests.forEach((quest) => {
      const entry = { ...makeQuestEntry(), ...state.quests[quest.id] };
      quest.subquests.forEach((sub) => {
        if (typeof entry.subquests[sub.id] !== 'boolean') entry.subquests[sub.id] = false;
      });
      state.quests[quest.id] = entry;
    });
    const bossDef = chapter.bossPool.find((b) => b.id === state.chapterBosses[chapter.id]) || chapter.bossPool[0];
    state.bosses[bossDef.id] = state.bosses[bossDef.id] || { status: 'locked', subquests: {} };
    bossDef.subquests.forEach((s) => {
      if (typeof state.bosses[bossDef.id].subquests[s.id] !== 'boolean') state.bosses[bossDef.id].subquests[s.id] = false;
    });
  });
  return state;
}

function loadState(meta = loadMeta()) {
  try {
    const raw = localStorage.getItem(getStorageKey(meta.currentSlot)) ??
      (meta.currentSlot === 'slot1' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
    return hydrateState(raw ? JSON.parse(raw) : defaultState());
  } catch {
    return hydrateState(defaultState());
  }
}

function persist(meta: any, state: any) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  localStorage.setItem(getStorageKey(meta.currentSlot), JSON.stringify({ ...state, updatedAt: Date.now(), createdAt: state.createdAt ?? Date.now() }));
}

function utcDayKey(value = Date.now()) {
  return new Date(value).toISOString().slice(0, 10);
}

function updateStreaks(streaks: Streaks): Streaks {
  const today = utcDayKey();
  if (streaks.lastActiveDate === today) return streaks;
  let { daily = 0, weekly = 0 } = streaks;
  if (streaks.lastActiveDate) {
    const lastDay = utcDayKey(new Date(streaks.lastActiveDate).getTime());
    const diff = Math.round((Date.parse(today) - Date.parse(lastDay)) / 86400000);
    if (diff === 1) { daily++; weekly++; }
    else if (diff === 2) { daily = Math.max(1, daily - 1); weekly = 0; }
    else if (diff > 2) { daily = 1; weekly = 0; }
  } else { daily = 1; weekly = 1; }
  return { daily, weekly, lastActiveDate: today };
}

function detectResetHealth(state: any): ResetHealth {
  const today = utcDayKey();
  const last = state.streaks?.lastActiveDate ?? '';
  const updatedDay = state.updatedAt ? utcDayKey(state.updatedAt) : '';
  if (!last) return { status: 'needs-check', lastCheckedDay: today, note: 'No last active day recorded yet.' };
  if (last === today) return { status: 'ok', lastCheckedDay: today, note: 'Daily reset is current.' };
  if (updatedDay && updatedDay !== today && last < today) {
    return { status: 'stale', lastCheckedDay: today, note: 'State was updated yesterday or earlier, but the active day did not advance.' };
  }
  return { status: 'needs-check', lastCheckedDay: today, note: 'Daily reset should be checked on the next state write.' };
}

function makeQuestEntry(): QuestEntry {
  return {
    status: 'available', blockedReason: '', blockerType: '',
    blockPlan: { smallestStep: '', support: '', retryWhen: '' },
    waitingPlan: { reason: '', followup: '', retryWhen: '' },
    subquests: {}, ritualPlan: {},
    bonuses: { momentum: false, ritual: false, rogueCombo: false, recovery: false, lowEnergy: false },
    startedAt: null, completedAt: null
  };
}

function inferQuestStatus(quest: any, entry: any) {
  const needed = quest.requiredCount ?? quest.subquests.filter((s: any) => s.required).length;
  const requiredDone = quest.subquests.filter((s: any) => s.required && entry.subquests[s.id]).length;
  const totalDone = Object.values(entry.subquests).filter(Boolean).length;
  if (requiredDone >= needed) return 'completed';
  if (entry.status === 'waiting') return 'waiting';
  if (entry.status === 'blocked') return 'blocked';
  if (requiredDone > 0) return 'advanced';
  if (totalDone > 0 || entry.startedAt) return 'started';
  return 'available';
}

const meta = loadMeta();
const initialState = loadState(meta);

export const useGameStore = create<GameStore>((set, get) => ({
  meta,
  state: initialState,
  ui: { activeTab: 'today', expandedQuestId: null, lastCompletedQuestId: null, questStarterQuestId: null, toasts: [], nextToastId: 1 },

  setActiveTab: (tab) => set((s) => ({ ui: { ...s.ui, activeTab: tab } })),

  toggleQuestExpanded: (qid, force) => set((s) => ({
    ui: { ...s.ui, expandedQuestId: force === 'collapsed' ? null : (s.ui.expandedQuestId === qid && force !== 'expanded' ? null : qid) }
  })),

  dismissQuestStarter: () => set((s) => ({ ui: { ...s.ui, questStarterQuestId: null } })),

  startCampaign: (p) => set((s) => {
    const next = {
      ...s.state,
      characterName: p.name ?? s.state.characterName,
      classId: p.classId,
      campaign: { ...s.state.campaign, origin: p.origin, motivation: p.motivation, complete: true, step: 5 }
    };
    persist(s.meta, next);
    return { state: next };
  }),

  setCampaignVow: (vow) => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, vow } };
    persist(s.meta, ns); return { state: ns };
  }),

  setCampaignFirstProof: (fp) => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, firstProof: fp } };
    persist(s.meta, ns); return { state: ns };
  }),

  setCampaignMode: (mode) => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, pathMode: mode } };
    persist(s.meta, ns); return { state: ns };
  }),

  setCampaignBranch: (branch) => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, branch } };
    persist(s.meta, ns); return { state: ns };
  }),

  completeCampaignSetup: () => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, complete: true, step: 5 }, createdAt: s.state.createdAt ?? Date.now() };
    persist(s.meta, ns); return { state: ns };
  }),

  completeFirstProof: () => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, firstProofDone: true } };
    persist(s.meta, ns);
    const toast = getRandomToast('first-proof-complete');
    const id = s.ui.nextToastId;
    set((s) => ({
      ui: {
        ...s.ui,
        toasts: [...s.ui.toasts, { id, text: toast.text, stage: toast.stage }],
        nextToastId: id + 1
      },
      state: ns
    }));
    return { state: ns };
  }),

  respecClass: (classId) => set((s) => {
    if (!classId || classId === s.state.classId) return s;
    const ns = {
      ...s.state,
      classId,
      barbarian: { activeQuestId: null, expiresAt: null, choice: '', completedAt: null },
      rogueRun: { active: false, selectedQuestIds: [], completedQuestIds: [], bonusAwarded: false },
      monk: { discipline: 0 },
      wizard: { preparedSpells: [], castToday: [] },
    };
    persist(s.meta, ns);
    return { state: ns };
  }),

  startQuest: (qid) => set((s) => {
    const entry = s.state.quests[qid];
    const questDef = CHAPTERS.flatMap((c) => c.quests).find((q) => q.id === qid);
    const requiredSteps = questDef?.subquests?.filter((sub) => sub.required).length ?? 1;
    const strikeWindowMs = Math.min(180000, Math.max(45000, requiredSteps * 45000));
    const bonuses = { ...entry.bonuses };
    if (s.state.classId === 'wizard') {
      if (s.state.wizard?.preparedSpells.includes('guided-sequence')) bonuses.ritual = true;
      if (s.state.wizard?.preparedSpells.includes('simplify-quest')) bonuses.lowEnergy = true;
    }
    const nextEntry = { ...entry, status: 'started', startedAt: entry.startedAt ?? Date.now(), bonuses };
    const castToday = [...(s.state.wizard?.castToday ?? [])];
    for (const spell of s.state.wizard?.preparedSpells ?? []) if (!castToday.includes(spell)) castToday.push(spell);
    const ns = {
      ...s.state,
      quests: { ...s.state.quests, [qid]: nextEntry },
      barbarian: s.state.classId === 'barbarian'
        ? { activeQuestId: qid, expiresAt: Date.now() + strikeWindowMs, choice: '', completedAt: null }
        : s.state.barbarian,
      wizard: s.state.classId === 'wizard' ? { ...(s.state.wizard ?? { preparedSpells: [], castToday: [] }), castToday } : s.state.wizard,
    };
    persist(s.meta, ns);
    return { state: ns, ui: { ...s.ui, activeTab: 'quests', expandedQuestId: qid, questStarterQuestId: qid } };
  }),

  toggleSubquest: (qid, sid) => set((s) => {
    const curr = s.state.quests[qid];
    const ne = { ...curr, subquests: { ...curr.subquests, [sid]: !curr.subquests[sid] } };
    const quest = CHAPTERS.flatMap(c => c.quests).find(q => q.id === qid)!;
    const needed = quest.requiredCount ?? quest.subquests.filter(s2 => s2.required).length;
    const done = quest.subquests.filter(s2 => s2.required && ne.subquests[s2.id]).length;

    if (ne.status !== 'completed' && done >= needed) {
      ne.status = 'completed'; ne.completedAt = ne.completedAt ?? Date.now();
    } else if (ne.status === 'completed' && done < needed) {
      ne.completedAt = null;
      ne.status = inferQuestStatus(quest, ne) as any;
    } else {
      ne.status = inferQuestStatus(quest, ne) as any;
    }

    const quests = { ...s.state.quests, [qid]: ne };
    // Class perks on completion
    if (quests[qid].status === 'completed' && curr.status !== 'completed') {
      const ce = quests[qid];
      if (s.state.classId === 'barbarian') ce.bonuses.momentum = true;
      if (s.state.classId === 'rogue') {
        const cutoff = Date.now() - 1800000;
        const recents = Object.values(quests).filter((e: any) => e.status === 'completed' && (e.completedAt ?? 0) > cutoff);
        if (recents.length >= 2) ce.bonuses.rogueCombo = true;
      }
      if (s.state.classId === 'monk' && quest.tags?.includes('routine') && s.state.monk) {
        s.state.monk.discipline = Math.min(5, (s.state.monk.discipline || 0) + 1);
        if ((s.state.monk.discipline || 0) >= 3) {
          ce.bonuses.recovery = true;
        }
      }
      if (s.state.classId === 'rogue' && s.state.rogueRun?.active && s.state.rogueRun.selectedQuestIds.includes(qid)) {
        const completedQuestIds = Array.from(new Set([...(s.state.rogueRun.completedQuestIds || []), qid]));
        s.state.rogueRun.completedQuestIds = completedQuestIds;
        if (completedQuestIds.length >= Math.min(2, s.state.rogueRun.selectedQuestIds.length)) {
          ce.bonuses.rogueCombo = true;
          if (completedQuestIds.length === s.state.rogueRun.selectedQuestIds.length) {
            s.state.rogueRun.bonusAwarded = true;
          }
        }
      }
      // Boss unlock
      const chap = CHAPTERS.find(c => c.quests.some(q => q.id === qid));
      if (chap) {
        const cc = chap.quests.filter(q => quests[q.id]?.status === 'completed').length;
        if (cc >= chap.bossRevealAt) {
          const bid = s.state.chapterBosses[chap.id];
          if (bid && s.state.bosses[bid] && s.state.bosses[bid].status === 'locked') {
            s.state.bosses[bid] = { ...s.state.bosses[bid], status: 'available' };
          }
        }
      }
    }
    persist(s.meta, { ...s.state, quests });
    const done2 = quests[qid].status === 'completed';
    if (done2) {
      const toast = getRandomToast('quest-complete');
      const id = s.ui.nextToastId;
      set((_) => ({ ui: { ...s.ui, toasts: [...s.ui.toasts, { id, text: toast.text, stage: toast.stage }], nextToastId: id + 1 } }));
    }
    return { state: { ...s.state, quests }, ui: done2 ? { ...s.ui, expandedQuestId: null, lastCompletedQuestId: qid } : s.ui };
  }),

  toggleQuestLowEnergy: (qid) => set((s) => {
    const e = s.state.quests[qid];
    const ne = { ...e, bonuses: { ...e.bonuses, lowEnergy: !e.bonuses.lowEnergy } };
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: ne } };
    persist(s.meta, ns); return { state: ns };
  }),

  setQuestBlocked: (qid, payload) => set((s) => {
    const e = s.state.quests[qid];
    const quest = CHAPTERS.flatMap((c) => c.quests).find((q) => q.id === qid)!;
    const ne = {
      ...e,
      status: inferQuestStatus(quest, { ...e, status: 'blocked' }),
      blockedReason: payload.blockedReason,
      blockerType: payload.blockerType,
      blockPlan: {
        smallestStep: payload.smallestStep,
        support: payload.support,
        retryWhen: payload.retryWhen,
      },
    };
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: ne } };
    persist(s.meta, ns); return { state: ns };
  }),

  setQuestWaiting: (qid, payload) => set((s) => {
    const e = s.state.quests[qid];
    const quest = CHAPTERS.flatMap((c) => c.quests).find((q) => q.id === qid)!;
    const ne = {
      ...e,
      status: inferQuestStatus(quest, { ...e, status: 'waiting' }),
      waitingPlan: {
        reason: payload.reason,
        followup: payload.followup,
        retryWhen: payload.retryWhen,
      },
    };
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: ne } };
    persist(s.meta, ns); return { state: ns };
  }),

  resumeQuestFlow: (qid) => set((s) => {
    const e = s.state.quests[qid];
    const quest = CHAPTERS.flatMap((c) => c.quests).find((q) => q.id === qid)!;
    const ne = {
      ...e,
      blockedReason: '',
      blockerType: '',
      blockPlan: { smallestStep: '', support: '', retryWhen: '' },
      waitingPlan: { reason: '', followup: '', retryWhen: '' },
    };
    ne.status = inferQuestStatus(quest, ne) as any;
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: ne } };
    persist(s.meta, ns); return { state: ns };
  }),

  confirmBarbarianFirstStrike: (qid, choice) => set((s) => {
    if (s.state.classId !== 'barbarian' || s.state.barbarian?.activeQuestId !== qid) return s;
    if ((s.state.barbarian?.expiresAt ?? 0) < Date.now()) return s;
    const e = s.state.quests[qid];
    const ne = { ...e, bonuses: { ...e.bonuses, momentum: true } };
    const ns = {
      ...s.state,
      quests: { ...s.state.quests, [qid]: ne },
      barbarian: { activeQuestId: qid, expiresAt: s.state.barbarian.expiresAt, choice, completedAt: Date.now() }
    };
    persist(s.meta, ns); return { state: ns };
  }),

  dismissBarbarianFirstStrike: () => set((s) => {
    const ns = { ...s.state, barbarian: { activeQuestId: null, expiresAt: null, choice: '', completedAt: null } };
    persist(s.meta, ns); return { state: ns };
  }),

  toggleRogueRunQuest: (qid) => set((s) => {
    const current = s.state.rogueRun ?? { active: false, selectedQuestIds: [], completedQuestIds: [], bonusAwarded: false };
    const selected = current.selectedQuestIds.includes(qid)
      ? current.selectedQuestIds.filter((id) => id !== qid)
      : current.selectedQuestIds.length >= 3
        ? current.selectedQuestIds
        : [...current.selectedQuestIds, qid];
    const ns = { ...s.state, rogueRun: { ...current, selectedQuestIds: selected, completedQuestIds: current.completedQuestIds.filter((id) => selected.includes(id)) } };
    persist(s.meta, ns); return { state: ns };
  }),

  startRogueRun: () => set((s) => {
    const current = s.state.rogueRun ?? { active: false, selectedQuestIds: [], completedQuestIds: [], bonusAwarded: false };
    if (current.selectedQuestIds.length < 2) return s;
    const ns = { ...s.state, rogueRun: { ...current, active: true, completedQuestIds: [], bonusAwarded: false } };
    persist(s.meta, ns); return { state: ns };
  }),

  clearRogueRun: () => set((s) => {
    const ns = { ...s.state, rogueRun: { active: false, selectedQuestIds: [], completedQuestIds: [], bonusAwarded: false } };
    persist(s.meta, ns); return { state: ns };
  }),

  prepareWizardSpell: (spellId) => set((s) => {
    const wizard = s.state.wizard ?? { preparedSpells: [], castToday: [] };
    const prepared = wizard.preparedSpells.includes(spellId)
      ? wizard.preparedSpells.filter((id) => id !== spellId)
      : wizard.preparedSpells.length >= 2
        ? wizard.preparedSpells
        : [...wizard.preparedSpells, spellId];
    const ns = { ...s.state, wizard: { ...wizard, preparedSpells: prepared } };
    persist(s.meta, ns); return { state: ns };
  }),

  rescueBlockedQuestWithDiscipline: (qid) => set((s) => {
    const monk = s.state.monk ?? { discipline: 0 };
    const entry = s.state.quests[qid];
    if (s.state.classId !== 'monk' || monk.discipline < 3 || entry.status !== 'blocked') return s;
    const ne = {
      ...entry,
      status: 'started',
      bonuses: { ...entry.bonuses, lowEnergy: true, recovery: true },
      blockedReason: '',
      blockerType: '',
      blockPlan: { smallestStep: '', support: '', retryWhen: '' },
    };
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: ne }, monk: { discipline: monk.discipline - 3 } };
    persist(s.meta, ns); return { state: ns };
  }),

  startBoss: (bid) => set((s) => {
    const b = s.state.bosses[bid];
    if (!b) return s;
    const ns = { ...s.state, bosses: { ...s.state.bosses, [bid]: { ...b, status: 'started' } } };
    persist(s.meta, ns); return { state: ns };
  }),

  toggleBossSubquest: (bid, sid) => set((s) => {
    const b = s.state.bosses[bid];
    if (!b) return s;
    const nb = { ...b, subquests: { ...b.subquests, [sid]: !b.subquests[sid] } };
    const bdef = CHAPTERS.flatMap(c => c.bossPool).find(x => x.id === bid);
    if (bdef) {
      const needed = bdef.subquests.filter(x => x.required).length;
      const done = bdef.subquests.filter(x => x.required && nb.subquests[x.id]).length;
      if (done >= needed) nb.status = 'completed';
      else if (done > 0) nb.status = 'started';
    }
    const ns = { ...s.state, bosses: { ...s.state.bosses, [bid]: nb } };
    if (nb.status === 'completed') {
      ns.streaks = updateStreaks(ns.streaks as any);
      persist(s.meta, ns);
      return { state: ns, ui: { ...s.ui, lastCompletedQuestId: bid } };
    }
    persist(s.meta, ns); return { state: ns };
  }),

  completeBoss: (bid) => set((s) => {
    const b = s.state.bosses[bid];
    if (!b || b.status === 'completed') return s;
    const ns = {
      ...s.state,
      bosses: { ...s.state.bosses, [bid]: { ...b, status: 'completed', completedAt: Date.now() } },
      streaks: updateStreaks(s.state.streaks as any)
    };
    const chap = CHAPTERS.find(c => c.bossPool.some(x => x.id === bid));
    if (chap && ns.chapterBosses[chap.id] === bid) {
      const rem = chap.bossPool.filter(x => x.id !== bid && ns.bosses[x.id]?.status !== 'completed');
      if (rem.length > 0) ns.chapterBosses = { ...ns.chapterBosses, [chap.id]: rem[0].id };
    }
    persist(s.meta, ns);
    // toast on boss defeat
    const toast = getRandomToast('boss-defeated');
    const id = s.ui.nextToastId;
    set((s) => ({
      ui: {
        ...s.ui,
        toasts: [...s.ui.toasts, { id, text: toast.text, stage: toast.stage }],
        nextToastId: id + 1,
        lastCompletedQuestId: bid,
        expandedQuestId: null
      },
      state: ns
    }));
    return { state: ns, ui: { ...s.ui, lastCompletedQuestId: bid, expandedQuestId: null } };
  }),

  claimReward: (idx) => set((s) => {
    const claimed = [...(s.state.rewardsClaimed ?? [])];
    const rw = REWARDS[idx];
    if (!rw || claimed.includes(rw.at)) return s;
    claimed.push(rw.at);
    const ns = { ...s.state, rewardsClaimed: claimed };
    persist(s.meta, ns); return { state: ns };
  }),

  spendDiscipline: (count) => set((s) => {
    const monk = s.state.monk ?? { discipline: 0 };
    if (monk.discipline < count) return s;
    monk.discipline -= count;
    const ns = { ...s.state, monk };
    persist(s.meta, ns); return { state: ns };
  }),

  checkStreaks: () => set((s) => {
    const today = new Date().toISOString().split('T')[0];
    if (s.state.streaks?.lastActiveDate === today) return s;
    const streaks = { ...s.state.streaks };
    const diff = streaks.lastActiveDate
      ? Math.floor((Date.now() - new Date(streaks.lastActiveDate).getTime()) / 86400000) : 999;
    if (diff === 2) { streaks.daily = Math.max(1, streaks.daily - 1); streaks.weekly = 0; }
    else if (diff > 2) { streaks.daily = 1; streaks.weekly = 0; }
    const ns = { ...s.state, streaks };
    ns.resetHealth = detectResetHealth(ns);
    persist(s.meta, ns); return { state: ns };
  }),

  setDailyAdviceShown: (text, date) => set((s) => {
    const adv = s.state.vgmAdvisor ?? { lastMessage: '', lastShownDate: '', history: [] };
    const ns = { ...s.state, vgmAdvisor: { lastMessage: text, lastShownDate: date, history: [...adv.history, text].slice(-20) } };
    ns.resetHealth = detectResetHealth(ns);
    persist(s.meta, ns); return { state: ns };
  }),

  addToast: (stage) => set((s) => {
    const toast = getRandomToast(stage);
    const id = s.ui.nextToastId;
    return {
      ui: {
        ...s.ui,
        toasts: [...s.ui.toasts, { id, text: toast.text, stage: toast.stage }],
        nextToastId: id + 1
      }
    };
  }),

  removeToast: (id) => set((s) => ({
    ui: {
      ...s.ui,
      toasts: s.ui.toasts.filter(t => t.id !== id)
    }
  })),

  setSetting: (key, value) => set((s) => {
    const ns = {
      ...s.state,
      settings: {
        ...s.state.settings,
        [key]: value,
      },
    };
    ns.resetHealth = detectResetHealth(ns);
    persist(s.meta, ns);
    return { state: ns };
  })
}));

export { CHAPTERS, LOW_ENERGY_OPTIONS, RESCUE_ITEMS };
export * from './selectors';
