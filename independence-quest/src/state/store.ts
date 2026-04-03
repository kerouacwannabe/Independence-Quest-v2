import { create } from 'zustand';
import { CHAPTERS, LOW_ENERGY_OPTIONS, RESCUE_ITEMS } from '../content';
import { defaultMeta, defaultState, LEGACY_STORAGE_KEY, META_KEY, STORAGE_PREFIX } from '../defaults';
import type { QuestEntry } from './types';

export type AppTab = 'today' | 'quests' | 'map' | 'toolkit' | 'profile';

type GameStore = {
  meta: ReturnType<typeof defaultMeta>;
  state: ReturnType<typeof defaultState>;
  ui: { activeTab: AppTab; expandedQuestId: string | null };
  setActiveTab: (tab: AppTab) => void;
  toggleQuestExpanded: (questId: string) => void;
  startQuest: (questId: string) => void;
  toggleSubquest: (questId: string, subquestId: string) => void;
  completeFirstProof: () => void;
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

function makeQuestEntry(): QuestEntry {
  return {
    status: 'available',
    blockedReason: '',
    blockerType: '',
    blockPlan: { smallestStep: '', support: '', retryWhen: '' },
    waitingPlan: { reason: '', followup: '', retryWhen: '' },
    subquests: {},
    ritualPlan: {},
    bonuses: { momentum: false, ritual: false, rogueCombo: false, recovery: false, lowEnergy: false },
    startedAt: null,
    completedAt: null
  };
}

function hydrateGameState(incoming = defaultState()) {
  const state = { ...defaultState(), ...incoming };
  state.quests = state.quests || {};
  state.bosses = state.bosses || {};
  state.chapterBosses = state.chapterBosses || {};
  state.supportTasks = state.supportTasks || {};

  CHAPTERS.forEach((chapter) => {
    if (!state.chapterBosses[chapter.id]) state.chapterBosses[chapter.id] = chapter.bossPool[0].id;
    chapter.quests.forEach((quest) => {
      const entry = { ...makeQuestEntry(), ...(state.quests[quest.id] || {}) };
      quest.subquests.forEach((sub) => {
        if (typeof entry.subquests[sub.id] !== 'boolean') entry.subquests[sub.id] = false;
      });
      state.quests[quest.id] = entry;
    });
    const boss = chapter.bossPool.find((item) => item.id === state.chapterBosses[chapter.id]) || chapter.bossPool[0];
    state.bosses[boss.id] = state.bosses[boss.id] || { status: 'locked', subquests: {} };
    boss.subquests.forEach((sub) => {
      if (typeof state.bosses[boss.id].subquests[sub.id] !== 'boolean') state.bosses[boss.id].subquests[sub.id] = false;
    });
  });

  return state;
}

function loadState(meta = loadMeta()) {
  try {
    const raw = localStorage.getItem(getStorageKey(meta.currentSlot)) || (meta.currentSlot === 'slot1' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
    return hydrateGameState(raw ? JSON.parse(raw) : defaultState());
  } catch {
    return hydrateGameState(defaultState());
  }
}

function persist(meta: ReturnType<typeof defaultMeta>, state: ReturnType<typeof defaultState>) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  localStorage.setItem(getStorageKey(meta.currentSlot), JSON.stringify({ ...state, updatedAt: Date.now(), createdAt: state.createdAt || Date.now() }));
}

const meta = loadMeta();
const initialState = loadState(meta);

export const useGameStore = create<GameStore>((set, get) => ({
  meta,
  state: initialState,
  ui: { activeTab: 'today', expandedQuestId: null },
  setActiveTab: (tab) => set((store) => ({ ui: { ...store.ui, activeTab: tab } })),
  toggleQuestExpanded: (questId) => set((store) => ({ ui: { ...store.ui, expandedQuestId: store.ui.expandedQuestId === questId ? null : questId } })),
  completeFirstProof: () => set((store) => {
    const next = { ...store.state, campaign: { ...store.state.campaign, complete: true, firstProofDone: true } };
    persist(store.meta, next);
    return { state: next };
  }),
  startQuest: (questId) => set((store) => {
    const next = { ...store.state, quests: { ...store.state.quests, [questId]: { ...store.state.quests[questId], status: 'started', startedAt: store.state.quests[questId].startedAt || Date.now() } } };
    persist(store.meta, next);
    return { state: next, ui: { ...store.ui, activeTab: 'quests', expandedQuestId: questId } };
  }),
  toggleSubquest: (questId, subquestId) => set((store) => {
    const current = store.state.quests[questId];
    const nextEntry = { ...current, subquests: { ...current.subquests, [subquestId]: !current.subquests[subquestId] } };
    const quest = CHAPTERS.flatMap((chapter) => chapter.quests).find((item) => item.id === questId)!;
    const needed = quest.requiredCount || quest.subquests.filter((sub) => sub.required).length;
    const done = quest.subquests.filter((sub) => sub.required && nextEntry.subquests[sub.id]).length;
    nextEntry.status = done >= needed ? 'completed' : done > 0 ? 'started' : 'available';
    if (nextEntry.status === 'completed') nextEntry.completedAt = nextEntry.completedAt || Date.now();
    const next = { ...store.state, quests: { ...store.state.quests, [questId]: nextEntry } };
    persist(store.meta, next);
    return { state: next };
  })
}));

export { CHAPTERS, LOW_ENERGY_OPTIONS, RESCUE_ITEMS };
