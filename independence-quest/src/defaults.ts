// @ts-nocheck
export const STORAGE_PREFIX = 'independenceCampaignStateV5';
export const META_KEY = 'independenceCampaignMetaV1';
export const LEGACY_STORAGE_KEY = 'independenceCampaignStateV4';

export function defaultMeta() {
  return {
    currentSlot: 'slot1',
    slotNames: {
      slot1: '',
      slot2: '',
      slot3: ''
    }
  };
}

export function defaultState() {
  return {
    classId: '',
    characterName: '',
    createdAt: null,
    updatedAt: null,
    campaign: {
      complete: false,
      step: 0,
      origin: '',
      motivation: '',
      vow: '',
      firstProof: '',
      firstProofDone: false,
      pathMode: 'guided'
    },
    quests: {},
    bosses: {},
    chapterBosses: {},
    supportTasks: {},
    rogueRun: { active: false, selectedQuestIds: [], completedQuestIds: [], bonusAwarded: false },
    monk: { discipline: 0 },
    barbarian: { activeQuestId: null, expiresAt: null, choice: '', completedAt: null },
    wizard: { preparedSpells: [], castToday: [] },
    rewardsClaimed: [],
    streaks: { daily: 0, weekly: 0, lastActiveDate: '' },
    vgmAdvisor: { lastMessage: '', lastShownDate: '', history: [] },
    settings: {
      soundEnabled: true,
      effectsEnabled: true,
      familyMode: false,
      focusMode: false,
      showFullMap: false,
      nameLocked: false,
      dailyMode: 'balanced',
      collapsedSections: {
        bosses: true,
        rewards: true,
        rescue: true,
        budget: true
      }
    },
    version: 5
  };
}
