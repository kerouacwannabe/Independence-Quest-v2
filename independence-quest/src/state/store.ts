// State Management — VGM Phase 2
import { create } from 'zustand';
import { CHAPTERS, LOW_ENERGY_OPTIONS, RESCUE_ITEMS, REWARDS } from '../content';
import { defaultMeta, defaultState, LEGACY_STORAGE_KEY, META_KEY, STORAGE_PREFIX } from '../defaults';
import type { AppTab, QuestEntry, BossStatus } from './types';

type MonkState = { discipline: number };
type RogueRun = { active: boolean; completedQuestIds: string[]; bonusAwarded: boolean };
type Streaks = { daily: number; weekly: number; lastActiveDate: string };
type VgmAdvisor = { lastMessage: string; lastShownDate: string; history: string[] };

type GameStore = {
  meta: ReturnType<typeof defaultMeta>;
  state: ReturnType<typeof defaultState>;
  ui: { activeTab: AppTab; expandedQuestId: string | null; lastCompletedQuestId: string | null };

  setActiveTab: (tab: AppTab) => void;
  toggleQuestExpanded: (questId: string, forceState?: 'expanded' | 'collapsed') => void;

  startCampaign: (payload: { name?: string; classId: string; origin: string; motivation: string }) => void;
  setCampaignVow: (vow: string) => void;
  setCampaignFirstProof: (firstProof: string) => void;
  setCampaignMode: (mode: 'guided' | 'free') => void;
  completeCampaignSetup: () => void;
  completeFirstProof: () => void;

  startQuest: (questId: string) => void;
  toggleSubquest: (questId: string, subquestId: string) => void;
  toggleQuestLowEnergy: (questId: string) => void;

  startBoss: (bossId: string) => void;
  toggleBossSubquest: (bossId: string, subquestId: string) => void;
  completeBoss: (bossId: string) => void;

  claimReward: (rewardIndex: number) => void;
  spendDiscipline: (count: number) => void;
  checkStreaks: () => void;
  setDailyAdviceShown: (text: string, date: string) => void;
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
  state.monk ??= { discipline: 0 };
  state.rogueRun ??= { active: false, completedQuestIds: [], bonusAwarded: false };

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

function updateStreaks(streaks: Streaks): Streaks {
  const today = new Date().toISOString().split('T')[0];
  if (streaks.lastActiveDate === today) return streaks;
  let { daily = 0, weekly = 0 } = streaks;
  if (streaks.lastActiveDate) {
    const diff = Math.floor((Date.now() - new Date(streaks.lastActiveDate).getTime()) / 86400000);
    if (diff === 1) { daily++; weekly++; }
    else if (diff > 1) { daily = 0; weekly = 0; }
  } else { daily = 1; weekly = 1; }
  return { daily, weekly, lastActiveDate: today };
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

const meta = loadMeta();
const initialState = loadState(meta);

export const useGameStore = create<GameStore>((set, get) => ({
  meta,
  state: initialState,
  ui: { activeTab: 'today', expandedQuestId: null, lastCompletedQuestId: null },

  setActiveTab: (tab) => set((s) => ({ ui: { ...s.ui, activeTab: tab } })),

  toggleQuestExpanded: (qid, force) => set((s) => ({
    ui: { ...s.ui, expandedQuestId: force === 'collapsed' ? null : (s.ui.expandedQuestId === qid && force !== 'expanded' ? null : qid) }
  })),

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

  completeCampaignSetup: () => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, complete: true, step: 5 }, createdAt: s.state.createdAt ?? Date.now() };
    persist(s.meta, ns); return { state: ns };
  }),

  completeFirstProof: () => set((s) => {
    const ns = { ...s.state, campaign: { ...s.state.campaign, firstProofDone: true } };
    persist(s.meta, ns); return { state: ns };
  }),

  startQuest: (qid) => set((s) => {
    const entry = s.state.quests[qid];
    const bonuses = { ...entry.bonuses };
    if (s.state.classId === 'barbarian') bonuses.momentum = true;
    const nextEntry = { ...entry, status: 'started', startedAt: entry.startedAt ?? Date.now(), bonuses };
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: nextEntry } };
    persist(s.meta, ns);
    return { state: ns, ui: { ...s.ui, activeTab: 'quests', expandedQuestId: qid } };
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
      ne.status = 'started'; ne.completedAt = null;
    } else if (done > 0) ne.status = 'started';

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
        s.state.monk.discipline = (s.state.monk.discipline || 0) + 1;
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
    return { state: { ...s.state, quests }, ui: done2 ? { ...s.ui, expandedQuestId: null, lastCompletedQuestId: qid } : s.ui };
  }),

  toggleQuestLowEnergy: (qid) => set((s) => {
    const e = s.state.quests[qid];
    const ne = { ...e, bonuses: { ...e.bonuses, lowEnergy: !e.bonuses.lowEnergy } };
    const ns = { ...s.state, quests: { ...s.state.quests, [qid]: ne } };
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
    persist(s.meta, ns); return { state: ns, ui: { ...s.ui, expandedQuestId: null, lastCompletedQuestId: bid } };
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
    if (diff > 1) { streaks.daily = 0; streaks.weekly = 0; }
    const ns = { ...s.state, streaks };
    persist(s.meta, ns); return { state: ns };
  }),

  setDailyAdviceShown: (text, date) => set((s) => {
    const adv = s.state.vgmAdvisor ?? { lastMessage: '', lastShownDate: '', history: [] };
    const ns = { ...s.state, vgmAdvisor: { lastMessage: text, lastShownDate: date, history: [...adv.history, text].slice(-20) } };
    persist(s.meta, ns); return { state: ns };
  })
}));

export { CHAPTERS, LOW_ENERGY_OPTIONS, RESCUE_ITEMS };
export * from './selectors';
