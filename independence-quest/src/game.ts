// @ts-nocheck
// Generated from independence-campaign.html during the Vite migration.
import { appMarkup } from "./appMarkup";
import { CLASS_DEFS, RESCUE_ITEMS, REWARDS, BUDGET_EXAMPLES, SUPPORT_TASKS, CAMPAIGN_ORIGINS, CAMPAIGN_MOTIVATIONS, CAMPAIGN_VOWS, CAMPAIGN_FIRST_PROOFS, LOW_ENERGY_OPTIONS, CHAPTERS } from "./content";
import { STORAGE_PREFIX, META_KEY, LEGACY_STORAGE_KEY, defaultMeta, defaultState } from "./defaults";
import { formatDateTime, escapeHtml, escapeAttr } from "./formatting";
import { createRendering } from "./rendering";
import { createActions } from "./actions";
import { createUI } from "./ui";

export function mountGame(root: HTMLElement): void {
  root.innerHTML = appMarkup;


    let meta = loadMeta();
    let state = loadState();
    let timerInterval = null;
    let activeTimerQuestId = null;
    let lastFocusBeforeDialog = null;
    let lastSetupFocusBeforeDialog = null;
    let lastQuestFlowFocusBeforeDialog = null;
    let questFlowContext = null;
    let persistenceStatus = {
      stateOk: true,
      metaOk: true,
      lastSavedAt: null,
      warning: ''
    };

    const ctx = {
      get state() { return state; },
      set state(value) { state = value; },
      get meta() { return meta; },
      set meta(value) { meta = value; },
      persistenceStatus,
      get timerInterval() { return timerInterval; },
      set timerInterval(value) { timerInterval = value; },
      get activeTimerQuestId() { return activeTimerQuestId; },
      set activeTimerQuestId(value) { activeTimerQuestId = value; },
      get lastFocusBeforeDialog() { return lastFocusBeforeDialog; },
      set lastFocusBeforeDialog(value) { lastFocusBeforeDialog = value; },
      get lastSetupFocusBeforeDialog() { return lastSetupFocusBeforeDialog; },
      set lastSetupFocusBeforeDialog(value) { lastSetupFocusBeforeDialog = value; },
      get lastQuestFlowFocusBeforeDialog() { return lastQuestFlowFocusBeforeDialog; },
      set lastQuestFlowFocusBeforeDialog(value) { lastQuestFlowFocusBeforeDialog = value; },
      get questFlowContext() { return questFlowContext; },
      set questFlowContext(value) { questFlowContext = value; }
    };

    const deps = {
      ctx,
      CLASS_DEFS,
      RESCUE_ITEMS,
      REWARDS,
      BUDGET_EXAMPLES,
      SUPPORT_TASKS,
      CAMPAIGN_ORIGINS,
      CAMPAIGN_MOTIVATIONS,
      CAMPAIGN_VOWS,
      CAMPAIGN_FIRST_PROOFS,
      LOW_ENERGY_OPTIONS,
      CHAPTERS,
      STORAGE_PREFIX,
      META_KEY,
      LEGACY_STORAGE_KEY,
      defaultMeta,
      defaultState,
      formatDateTime,
      escapeHtml,
      escapeAttr,
      getStorageKey,
      loadMeta,
      saveMeta,
      loadState,
      saveState,
      hydrateState,
      chooseRandomBossId,
      getBossForChapter,
      getQuestEntry,
      getBossEntry,
      getChapterIndex,
      isChapterUnlocked,
      isChapterComplete,
      getCurrentChapter,
      getQuestStatus,
      questProgress,
      getCompletedQuestCount,
      getCompletedBossCount,
      getActiveQuestCount,
      getBlockedQuestCount,
      getBossStatus,
      isBossRevealed,
      findChapterForQuest,
      getLevel,
      getOverallProgressPercent,
      getTotalXP,
      getMainQuestStatus,
      getCharacterName,
      getCampaignOrigin,
      getCampaignMotivation,
      getCampaignVow,
      getCampaignFirstProof,
      getChapterGlyph,
      getStatusDisplay,
      getQuestGrade,
      syncSlotName,
      getSlotLabel,
      getSlotPreview,
      getUnlockedRewardCount,
      getNextMove,
      getNextObjectiveCopy,
      getRitualPlanSteps
    };

    const rendering = createRendering(deps);
    Object.assign(deps, rendering);
    const actions = createActions(deps);
    Object.assign(deps, actions);
    const ui = createUI(deps);
    Object.assign(deps, ui);

    hydrateState();
    rendering.renderAll();
    ui.bindGlobalEvents();

    function getStorageKey(slotId = meta.currentSlot) {
      return `${STORAGE_PREFIX}:${slotId}`;
    }

    function loadMeta() {
      try {
        const raw = localStorage.getItem(META_KEY);
        if (!raw) return defaultMeta();
        return { ...defaultMeta(), ...JSON.parse(raw) };
      } catch (error) {
        console.warn('Save-slot meta was corrupt. Rebuilding.', error);
        return defaultMeta();
      }
    }

    function saveMeta() {
      try {
        localStorage.setItem(META_KEY, JSON.stringify(meta));
        persistenceStatus.metaOk = true;
        return true;
      } catch (error) {
        persistenceStatus.metaOk = false;
        persistenceStatus.warning = 'Slot metadata could not be saved on this device.';
        console.warn('Unable to save slot metadata.', error);
        return false;
      }
    }

    function loadState(slotId = meta.currentSlot) {
      try {
        const raw = localStorage.getItem(getStorageKey(slotId)) || (slotId === 'slot1' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
        if (!raw) return defaultState();
        const parsed = JSON.parse(raw);
        return { ...defaultState(), ...parsed };
      } catch (error) {
        console.warn('Campaign save was corrupt. Rebuilding state.', error);
        return defaultState();
      }
    }

    function saveState() {
      try {
        const now = Date.now();
        const nextState = { ...state, createdAt: state.createdAt || now, updatedAt: now };
        localStorage.setItem(getStorageKey(meta.currentSlot), JSON.stringify(nextState));
        state.createdAt = nextState.createdAt;
        state.updatedAt = nextState.updatedAt;
        persistenceStatus.stateOk = true;
        persistenceStatus.lastSavedAt = now;
        if (persistenceStatus.metaOk) persistenceStatus.warning = '';
        return true;
      } catch (error) {
        persistenceStatus.stateOk = false;
        persistenceStatus.warning = 'This browser/device did not confirm saving. Export the slot if you need a backup.';
        console.warn('Unable to save campaign state.', error);
        return false;
      }
    }

    function hydrateState() {
      state.settings = { ...defaultState().settings, ...(state.settings || {}) };
      state.settings.collapsedSections = {
        ...defaultState().settings.collapsedSections,
        ...(state.settings.collapsedSections || {})
      };
      state.campaign = { ...defaultState().campaign, ...(state.campaign || {}) };
      state.rogueRun = { ...defaultState().rogueRun, ...(state.rogueRun || {}) };
      state.monk = { ...defaultState().monk, ...(state.monk || {}) };
      state.supportTasks = state.supportTasks || {};

      const legacyProgress = Object.values(state.quests || {}).some((entry) => entry.status && entry.status !== 'available') || Object.values(state.bosses || {}).some((entry) => entry.status && entry.status !== 'locked');
      if (!state.campaign.complete && legacyProgress) {
        state.campaign.complete = true;
        state.campaign.firstProofDone = state.campaign.firstProofDone || false;
        state.campaign.origin = state.campaign.origin || 'rebuilding';
        state.campaign.motivation = state.campaign.motivation || 'freedom';
      }

      CHAPTERS.forEach((chapter) => {
        if (!state.supportTasks[chapter.id]) {
          state.supportTasks[chapter.id] = {};
        }

        (SUPPORT_TASKS[chapter.id] || []).forEach((task) => {
          if (typeof state.supportTasks[chapter.id][task.id] !== 'boolean') {
            state.supportTasks[chapter.id][task.id] = false;
          }
        });

        if (!state.chapterBosses[chapter.id]) {
          state.chapterBosses[chapter.id] = chooseRandomBossId(chapter);
        }

        chapter.quests.forEach((quest) => {
          if (!state.quests[quest.id]) {
            state.quests[quest.id] = {
              status: 'available',
              blockedReason: '',
              blockerType: '',
              blockPlan: {
                smallestStep: '',
                support: '',
                retryWhen: ''
              },
              waitingPlan: {
                reason: '',
                followup: '',
                retryWhen: ''
              },
              subquests: {},
              ritualPlan: {},
              bonuses: {
                momentum: false,
                ritual: false,
                rogueCombo: false,
                recovery: false,
                lowEnergy: false
              },
              startedAt: null,
              completedAt: null
            };
          }

          state.quests[quest.id].blockPlan = { smallestStep: '', support: '', retryWhen: '', ...(state.quests[quest.id].blockPlan || {}) };
          state.quests[quest.id].waitingPlan = { reason: '', followup: '', retryWhen: '', ...(state.quests[quest.id].waitingPlan || {}) };
          state.quests[quest.id].bonuses = { momentum: false, ritual: false, rogueCombo: false, recovery: false, lowEnergy: false, ...(state.quests[quest.id].bonuses || {}) };

          quest.subquests.forEach((sub) => {
            if (typeof state.quests[quest.id].subquests[sub.id] !== 'boolean') {
              state.quests[quest.id].subquests[sub.id] = false;
            }
          });

          if (quest.ritualPlan) {
            getRitualPlanSteps(quest).forEach((step) => {
              if (typeof state.quests[quest.id].ritualPlan[step.id] !== 'boolean') {
                state.quests[quest.id].ritualPlan[step.id] = false;
              }
            });
          }
        });

        const boss = getBossForChapter(chapter);
        if (!state.bosses[boss.id]) {
          state.bosses[boss.id] = {
            status: 'locked',
            blockedReason: '',
            blockerType: '',
            blockPlan: { smallestStep: '', support: '', retryWhen: '' },
            subquests: {},
            bonuses: {},
            startedAt: null,
            completedAt: null
          };
        }

        state.bosses[boss.id].blockPlan = { smallestStep: '', support: '', retryWhen: '', ...(state.bosses[boss.id].blockPlan || {}) };

        boss.subquests.forEach((sub) => {
          if (typeof state.bosses[boss.id].subquests[sub.id] !== 'boolean') {
            state.bosses[boss.id].subquests[sub.id] = false;
          }
        });
      });

      saveState();
      syncSlotName();
    }

    function chooseRandomBossId(chapter) {
      const pool = chapter.bossPool;
      return pool[Math.floor(Math.random() * pool.length)].id;
    }

    function getBossForChapter(chapter) {
      return chapter.bossPool.find((boss) => boss.id === state.chapterBosses[chapter.id]) || chapter.bossPool[0];
    }

    function getQuestEntry(questId) {
      return state.quests[questId];
    }

    function getBossEntry(chapter) {
      return state.bosses[getBossForChapter(chapter).id];
    }

    function getChapterIndex(chapterId) {
      return CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
    }

    function isChapterUnlocked(chapter) {
      const index = getChapterIndex(chapter.id);
      if (index === 0) return true;
      return isChapterComplete(CHAPTERS[index - 1]);
    }

    function isChapterComplete(chapter) {
      const allQuestsDone = chapter.quests.every((quest) => getQuestStatus(quest, chapter) === 'completed');
      return allQuestsDone && getBossStatus(chapter) === 'completed';
    }

    function getCurrentChapter() {
      return CHAPTERS.find((chapter) => isChapterUnlocked(chapter) && !isChapterComplete(chapter)) || CHAPTERS[CHAPTERS.length - 1];
    }

    function getQuestStatus(quest, chapter) {
      if (!isChapterUnlocked(chapter)) return 'locked';
      const entry = getQuestEntry(quest.id);
      if (entry.status === 'completed') return 'completed';
      if (entry.status === 'waiting') return 'waiting';
      if (entry.status === 'blocked') return 'blocked';
      const required = quest.subquests.filter((sub) => sub.required);
      const targetRequired = quest.requiredCount || required.length;
      const doneRequired = required.filter((sub) => entry.subquests[sub.id]).length;
      if (doneRequired > 0 && doneRequired < targetRequired) return 'in-progress';
      if (doneRequired >= targetRequired && targetRequired > 0) return 'in-progress';
      if (entry.status === 'started') return 'started';
      return 'available';
    }

    function questProgress(quest) {
      const entry = getQuestEntry(quest.id);
      const required = quest.subquests.filter((sub) => sub.required).length;
      const doneRequired = quest.subquests.filter((sub) => sub.required && entry.subquests[sub.id]).length;
      const optionalDone = quest.subquests.filter((sub) => !sub.required && entry.subquests[sub.id]).length;
      const needed = quest.requiredCount || required;
      return { required, doneRequired, optionalDone, needed };
    }

    function getCompletedQuestCount() {
      return CHAPTERS.flatMap((chapter) => chapter.quests).filter((quest) => getQuestEntry(quest.id).status === 'completed').length;
    }

    function getCompletedBossCount() {
      return CHAPTERS.filter((chapter) => getBossStatus(chapter) === 'completed').length;
    }

    function getActiveQuestCount() {
      return CHAPTERS.flatMap((chapter) => chapter.quests).filter((quest) => {
        const status = getQuestStatus(quest, findChapterForQuest(quest.id));
        return status === 'started' || status === 'in-progress';
      }).length + CHAPTERS.filter((chapter) => {
        const status = getBossStatus(chapter);
        return status === 'started' || status === 'in-progress';
      }).length;
    }

    function getBlockedQuestCount() {
      return CHAPTERS.flatMap((chapter) => chapter.quests).filter((quest) => getQuestEntry(quest.id).status === 'blocked').length + CHAPTERS.filter((chapter) => getBossStatus(chapter) === 'blocked').length;
    }

    function getBossStatus(chapter) {
      const boss = getBossForChapter(chapter);
      const entry = state.bosses[boss.id];
      if (!isChapterUnlocked(chapter)) return 'locked';
      if (!isBossRevealed(chapter)) return 'locked';
      if (entry.status === 'completed') return 'completed';
      if (entry.status === 'blocked') return 'blocked';
      const requiredDone = boss.subquests.filter((sub) => entry.subquests[sub.id]).length;
      if (requiredDone > 0 && requiredDone < boss.subquests.length) return 'in-progress';
      if (entry.status === 'started') return 'started';
      return 'available';
    }

    function isBossRevealed(chapter) {
      const completedInChapter = chapter.quests.filter((quest) => getQuestEntry(quest.id).status === 'completed').length;
      return completedInChapter >= chapter.bossRevealAt;
    }

    function findChapterForQuest(questId) {
      return CHAPTERS.find((chapter) => chapter.quests.some((quest) => quest.id === questId));
    }

    function getLevel() {
      return Math.min(getCompletedBossCount() + 1, CHAPTERS.length + 1);
    }

    function getOverallProgressPercent() {
      const totalSteps = CHAPTERS.length * 2;
      let completed = 0;
      CHAPTERS.forEach((chapter) => {
        if (chapter.quests.every((quest) => getQuestEntry(quest.id).status === 'completed')) completed += 1;
        if (getBossStatus(chapter) === 'completed') completed += 1;
      });
      return Math.round((completed / totalSteps) * 100);
    }

    function getTotalXP() {
      let xp = 0;
      CHAPTERS.forEach((chapter) => {
        chapter.quests.forEach((quest) => {
          const entry = getQuestEntry(quest.id);
          quest.subquests.forEach((sub) => {
            if (entry.subquests[sub.id]) xp += sub.xp;
          });
          if (entry.status === 'completed') xp += quest.completionBonus;
          if (entry.status === 'completed' && entry.bonuses.momentum) xp += 10;
          if (entry.status === 'completed' && entry.bonuses.ritual) xp += 12;
          if (entry.status === 'completed' && entry.bonuses.recovery) xp += 6;
          if (entry.status === 'completed' && entry.bonuses.rogueCombo) xp += 8;
          if (entry.bonuses.lowEnergy) xp += 4;
        });

        const boss = getBossForChapter(chapter);
        const entry = state.bosses[boss.id];
        boss.subquests.forEach((sub) => {
          if (entry.subquests[sub.id]) xp += sub.xp;
        });
        if (entry.status === 'completed') xp += boss.completionBonus;
      });

      return xp;
    }

    function getMainQuestStatus() {
      if (CHAPTERS.every((chapter) => isChapterComplete(chapter))) return 'Independent Living Established';
      if (CHAPTERS.every((chapter) => isChapterUnlocked(chapter))) return 'Launch In Progress';
      if (getCompletedQuestCount() > 0) return 'Ready to Launch';
      return 'Not yet launched';
    }

    function getCharacterName() {
      return (state.characterName || '').trim() || 'Unnamed Hero';
    }

    function getCampaignOrigin() {
      return CAMPAIGN_ORIGINS.find((item) => item.id === state.campaign.origin) || null;
    }

    function getCampaignMotivation() {
      return CAMPAIGN_MOTIVATIONS.find((item) => item.id === state.campaign.motivation) || null;
    }

    function getCampaignVow() {
      return CAMPAIGN_VOWS.find((item) => item.id === state.campaign.vow) || null;
    }

    function getCampaignFirstProof() {
      return CAMPAIGN_FIRST_PROOFS.find((item) => item.id === state.campaign.firstProof) || null;
    }

    function getChapterGlyph(chapter) {
      const glyphs = {
        'personal-stability': '🌅',
        'household-competence': '🧹',
        'income-admin': '📜',
        'budget-housing': '🪙',
        'trial-independence': '🏰'
      };
      return glyphs[chapter.id] || '✨';
    }

    function getStatusDisplay(status) {
      const map = {
        available: { label: 'Available', icon: '✦' },
        started: { label: 'Touched', icon: '•' },
        'in-progress': { label: 'In motion', icon: '➜' },
        waiting: { label: 'Waiting', icon: '⏳' },
        blocked: { label: 'Blocked', icon: '⚠' },
        completed: { label: 'Cleared', icon: '✓' },
        locked: { label: 'Locked', icon: '🔒' }
      };
      return map[status] || { label: status, icon: '•' };
    }

    function getQuestGrade(quest, chapter) {
      const status = getQuestStatus(quest, chapter);
      const entry = getQuestEntry(quest.id);
      const progress = questProgress(quest);
      if (status === 'completed') return 'Cleared';
      if (status === 'waiting') return 'Waiting';
      if (status === 'blocked') return 'Blocked';
      if (progress.doneRequired > 0) return 'Advanced';
      if (entry.bonuses.lowEnergy || status === 'started') return 'Touched';
      return 'Unclaimed';
    }

    function syncSlotName() {
      const nextName = (state.characterName || '').trim();
      meta.slotNames[meta.currentSlot] = nextName;
      saveMeta();
    }

    function getSlotLabel(slotId) {
      const stored = meta.slotNames[slotId];
      if (stored && stored.trim()) return stored.trim();
      return `Slot ${slotId.replace('slot', '')}`;
    }

    function getSlotPreview(slotId) {
      try {
        const raw = localStorage.getItem(getStorageKey(slotId)) || (slotId === 'slot1' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (error) {
        return null;
      }
    }

    function getUnlockedRewardCount() {
      return REWARDS.filter((reward) => getCompletedQuestCount() >= reward.at).length;
    }


    function getFirstActiveQuest() {
      return CHAPTERS.flatMap((chapter) => chapter.quests.map((quest) => ({ chapter, quest }))).find(({ chapter, quest }) => {
        const status = getQuestStatus(quest, chapter);
        return status === 'started' || status === 'in-progress';
      }) || null;
    }

    function getNextMove() {
      if (!state.campaign.complete) {
        return {
          type: 'Character creation',
          heading: 'Begin Chapter 0: Base Camp',
          copy: 'Forge the character first: name, current situation, class, motivation, and one tiny proof action.',
          button: 'Create your character',
          action: 'open-setup'
        };
      }

      if (!state.campaign.firstProofDone) {
        return {
          type: 'First proof',
          heading: getCampaignFirstProof()?.title || 'Take the first tiny proof action',
          copy: 'Do this one small real-world action, then mark it done so the campaign begins with evidence instead of vibes.',
          button: 'Mark first proof done',
          action: 'complete-first-proof'
        };
      }

      const activeQuest = getFirstActiveQuest();
      if (activeQuest) {
        const progress = questProgress(activeQuest.quest);
        const remaining = Math.max(progress.needed - progress.doneRequired, 0);
        return {
          type: 'Resume quest',
          heading: activeQuest.quest.title,
          copy: remaining > 0
            ? `${remaining} required step${remaining === 1 ? '' : 's'} left in ${activeQuest.chapter.title}.`
            : `This quest is in motion inside ${activeQuest.chapter.title}.`,
          button: 'Resume current quest',
          action: 'scroll-quest',
          questId: activeQuest.quest.id
        };
      }

      const waitingQuest = CHAPTERS.flatMap((chapter) => chapter.quests.map((quest) => ({ chapter, quest }))).find(({ quest }) => getQuestEntry(quest.id).status === 'waiting');
      if (waitingQuest) {
        const plan = getQuestEntry(waitingQuest.quest.id).waitingPlan;
        return {
          type: 'Follow-up',
          heading: waitingQuest.quest.title,
          copy: plan.followup
            ? `Waiting state active. Next move: ${plan.followup}${plan.retryWhen ? ` • retry ${plan.retryWhen}` : ''}`
            : 'Waiting is still progress if you actually set the follow-up.',
          button: 'Review waiting quest',
          action: 'scroll-quest',
          questId: waitingQuest.quest.id
        };
      }

      const blockedQuest = CHAPTERS.flatMap((chapter) => chapter.quests.map((quest) => ({ chapter, quest }))).find(({ quest }) => getQuestEntry(quest.id).status === 'blocked');
      if (blockedQuest) {
        const plan = getQuestEntry(blockedQuest.quest.id).blockPlan;
        return {
          type: 'Unblock move',
          heading: blockedQuest.quest.title,
          copy: plan.smallestStep
            ? `Smallest bridge back in: ${plan.smallestStep}${plan.support ? ` • support: ${plan.support}` : ''}${plan.retryWhen ? ` • retry ${plan.retryWhen}` : ''}`
            : 'This quest is blocked. Name the smallest next move instead of arguing with the fog.',
          button: 'Review unblock plan',
          action: 'scroll-quest',
          questId: blockedQuest.quest.id
        };
      }

      const currentChapter = getCurrentChapter();
      const availableQuest = currentChapter.quests.find((quest) => getQuestStatus(quest, currentChapter) === 'available');
      if (availableQuest) {
        return {
          type: 'Start quest',
          heading: availableQuest.title,
          copy: `Best next move in ${currentChapter.title}. Start it and the objective chain will appear instead of lurking in theory.`,
          button: 'Start next quest',
          action: 'start-quest',
          questId: availableQuest.id
        };
      }

      if (isBossRevealed(currentChapter) && getBossStatus(currentChapter) !== 'completed') {
        return {
          type: 'Boss fight',
          heading: getBossForChapter(currentChapter).title,
          copy: `The chapter is waiting on its boss. Defeat it and the road opens into the next region.`,
          button: 'Fight revealed boss',
          action: 'start-boss',
          chapterId: currentChapter.id
        };
      }

      return {
        type: 'Victory lap',
        heading: 'The Independent Keep stands',
        copy: 'You cleared the campaign. At this point the skeleton is just trying not to look proud.',
        button: 'Review the journey',
        action: 'jump-journey'
      };
    }

    function getNextObjectiveCopy() {
      const startedQuest = getFirstActiveQuest();

      if (startedQuest) {
        const progress = questProgress(startedQuest.quest);
        return `Current objective: ${startedQuest.quest.title} — ${progress.doneRequired}/${progress.needed} needed step(s) cleared.`;
      }

      const currentChapter = getCurrentChapter();
      const nextQuest = currentChapter.quests.find((quest) => getQuestStatus(quest, currentChapter) === 'available');
      if (nextQuest) return `Next move: start “${nextQuest.title}” in ${currentChapter.title}.`; 
      if (isBossRevealed(currentChapter) && getBossStatus(currentChapter) !== 'completed') {
        return `Boss time: ${getBossForChapter(currentChapter).title} is loose in ${currentChapter.title}.`;
      }
      if (CHAPTERS.every((chapter) => isChapterComplete(chapter))) {
        return 'The keep is yours. At this point the skeleton is just applauding.';
      }
      return 'Keep going. A real campaign beats vague guilt every single time.';
    }

    function getRitualPlanSteps(quest) {
      const tagSet = new Set(quest.tags);
      const steps = [
        { id: 'prep-reminders', title: 'Set a reminder or calendar block', xp: 0 },
        { id: 'prep-supplies', title: tagSet.has('housing') || tagSet.has('budget') ? 'Gather numbers, links, or documents you will need' : 'Gather anything needed before starting', xp: 0 },
        { id: 'prep-script', title: tagSet.has('admin') || tagSet.has('work') ? 'Write a quick script or checklist for the scary part' : 'Write the next three actions in plain language', xp: 0 }
      ];
      return steps;
    }


}
