// @ts-nocheck
import { createGameProxies } from "./moduleContext";

export function createUI(deps) {
  const {
    ctx,
    CLASS_DEFS,
    CHAPTERS,
    defaultState,
    saveState,
    hydrateState,
    getStorageKey,
    getCurrentChapter,
    getNextMove,
    getCharacterName,
    getCampaignFirstProof,
    getQuestEntry,
    getBossEntry,
    getQuestStatus,
    findChapterForQuest,
    syncSlotName,
    escapeAttr,
    renderAll,
    renderHeader,
    renderIdentityPanel,
    renderCampaignSetup,
    renderSectionCollapseStates,
    playTone
  } = deps;

  const { state, meta } = createGameProxies(ctx);

function syncOverlayLock() {
  const anyOpen = ['campaignSetupOverlay', 'questFlowOverlay', 'timerOverlay'].some((id) => {
    const node = document.getElementById(id);
    return node && !node.hidden;
  });
  document.body.classList.toggle('overlay-open', anyOpen);
}

function bindGlobalEvents() {
  document.getElementById('nextMoveButton').addEventListener('click', () => {
    executeNextMove();
  });

  document.getElementById('jumpToCurrent').addEventListener('click', () => {
    document.getElementById(`chapter-${getCurrentChapter().id}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('toggleMapView').addEventListener('click', () => {
    state.settings.showFullMap = !state.settings.showFullMap;
    renderAll();
    deps.showToast(state.settings.showFullMap ? 'Full map revealed. Behold the whole cursed road.' : 'Guided lane restored. One chapter at a time.');
  });

  document.getElementById('toggleFocusMode').addEventListener('click', () => {
    state.settings.focusMode = !state.settings.focusMode;
    renderAll();
    deps.showToast(state.settings.focusMode
      ? 'Focus mode enabled. Only the current chapter and rescue tools remain on stage.'
      : 'Focus mode disabled. The rest of the campaign wanders back into view.');
  });

  document.getElementById('jumpToRescue').addEventListener('click', () => {
    state.settings.collapsedSections.rescue = false;
    renderSectionCollapseStates();
    document.getElementById('rescueSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    deps.showToast('ADHD Rescue Kit opened. We are not waiting for divine motivation.');
  });

  document.getElementById('printCharacterSheet').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('toggleFamilyMode').addEventListener('click', () => {
    state.settings.familyMode = !state.settings.familyMode;
    renderAll();
    deps.showToast(state.settings.familyMode
      ? 'Family support mode enabled. Support-party quests are now visible.'
      : 'Family support mode disabled. The side-party fades back into the shadows.');
  });

  document.getElementById('toggleBossSection').addEventListener('click', () => toggleSectionCollapse('bosses'));
  document.getElementById('toggleRewardSection').addEventListener('click', () => toggleSectionCollapse('rewards'));
  document.getElementById('toggleRescueSection').addEventListener('click', () => toggleSectionCollapse('rescue'));
  document.getElementById('toggleBudgetSection').addEventListener('click', () => toggleSectionCollapse('budget'));

  document.getElementById('resetCampaign').addEventListener('click', () => {
    if (!confirm(`Reset the campaign in slot ${meta.currentSlot.replace('slot', '')} only? Boss rolls, quest progress, class choice, XP, and stored buffs in this slot will all be wiped.`)) return;
    ctx.state = defaultState();
    hydrateState();
    renderAll();
    deps.showToast('Campaign reset. The hero returns to Base Camp, still alive and mildly annoyed.');
  });

  document.getElementById('confirmMomentum').addEventListener('click', () => {
    if (!ctx.activeTimerQuestId) return;
    const entry = getQuestEntry(ctx.activeTimerQuestId);
    entry.bonuses.momentum = true;
    deps.closeTimerOverlay();
    renderAll();
    deps.showToast('Momentum buff secured: +10 XP when this quest clears. Hit first, brood later.');
  });

  document.getElementById('skipMomentum').addEventListener('click', () => {
    deps.closeTimerOverlay();
    deps.showToast('No Momentum buff this time. Fine. Still start the quest like a respectable goblin.');
  });

  document.getElementById('timerOverlay').addEventListener('keydown', handleTimerKeydown);
  document.getElementById('campaignSetupOverlay').addEventListener('keydown', handleCampaignSetupKeydown);
  document.getElementById('campaignSetupBack').addEventListener('click', retreatCampaignSetup);
  document.getElementById('campaignSetupNext').addEventListener('click', advanceCampaignSetup);
  document.getElementById('questFlowOverlay').addEventListener('keydown', handleQuestFlowKeydown);
  document.getElementById('questFlowCancel').addEventListener('click', closeQuestFlowModal);
  document.getElementById('questFlowSubmit').addEventListener('click', submitQuestFlowModal);

  window.addEventListener('storage', (event) => {
    if (event.key === getStorageKey(meta.currentSlot)) {
      deps.showBanner('This save slot changed in another tab or window. Reload the slot if you want the newest version.');
    }
  });
}

function executeNextMove() {
  const nextMove = getNextMove();
  if (nextMove.action === 'open-setup') {
    state.campaign.complete = false;
    renderCampaignSetup();
    document.getElementById('campaignSetupOverlay').hidden = false;
    return;
  }
  if (nextMove.action === 'complete-first-proof') {
    state.campaign.firstProofDone = true;
    renderAll();
    deps.celebrate('quest');
    deps.showToast('First proof logged. Good. The campaign now begins on evidence instead of optimism.');
    return;
  }
  if (nextMove.action === 'start-quest' && nextMove.questId) {
    deps.startQuest(nextMove.questId);
    return;
  }
  if (nextMove.action === 'scroll-quest' && nextMove.questId) {
    const card = document.querySelector(`[data-quest-card="${nextMove.questId}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    deps.showToast(`Back to ${nextMove.heading}. One useful click beats ceremonial dithering.`);
    return;
  }
  if (nextMove.action === 'start-boss' && nextMove.chapterId) {
    deps.startBoss(nextMove.chapterId);
    return;
  }
  document.getElementById('journeySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function retreatCampaignSetup() {
  state.campaign.step = Math.max((state.campaign.step || 0) - 1, 0);
  renderCampaignSetup();
}

function advanceCampaignSetup() {
  const step = state.campaign.step || 0;
  if (step === 0 && !(state.characterName || '').trim()) {
    deps.showToast('Name the hero first. Anonymous adventurers make paperwork worse.');
    return;
  }
  if (step === 0 && !state.campaign.origin) {
    deps.showToast('Choose the current situation so the campaign knows which swamp you are standing in.');
    return;
  }
  if (step === 1 && !state.classId) {
    deps.showToast('Choose a class. Even chaos benefits from a build.');
    return;
  }
  if (step === 2 && !state.campaign.motivation) {
    deps.showToast('Choose a motivation. It matters when the vibes fail.');
    return;
  }
  if (step === 2 && !state.campaign.firstProof) {
    deps.showToast('Choose one tiny proof action to begin the campaign.');
    return;
  }
  if (step >= 2) {
    state.campaign.complete = true;
    state.campaign.firstProofDone = false;
    state.campaign.vow = state.campaign.vow || '';
    state.campaign.pathMode = state.campaign.pathMode || 'guided';
    state.settings.showFullMap = false;
    renderAll();
    window.requestAnimationFrame(() => {
      const target = document.getElementById('nextMoveButton') || ctx.lastSetupFocusBeforeDialog;
      if (target && typeof target.focus === 'function') target.focus();
      ctx.lastSetupFocusBeforeDialog = null;
    });
    deps.celebrate('chapter');
    deps.showBanner(`${getCharacterName()} enters the campaign. First proof: ${getCampaignFirstProof()?.title || 'survive the day with style'}. Do that in real life, then hit Next Move when you come back.`, 'chapter');
    return;
  }
  state.campaign.step = step + 1;
  renderCampaignSetup();
}

function toggleSectionCollapse(key) {
  state.settings.collapsedSections[key] = !state.settings.collapsedSections[key];
  renderSectionCollapseStates();
  saveState();
}

function bindIdentityEvents() {
  const input = document.getElementById('characterNameInput');
  input.oninput = (event) => {
    state.characterName = event.target.value;
    syncSlotName();
    saveState();
    renderHeader();
    renderIdentityPanel();
  };

  document.querySelectorAll('[data-slot-id]').forEach((button) => {
    button.onclick = () => deps.switchSaveSlot(button.dataset.slotId);
  });

  document.getElementById('toggleSound').onclick = () => {
    state.settings.soundEnabled = !state.settings.soundEnabled;
    renderIdentityPanel();
    saveState();
    deps.showToast(`Sound ${state.settings.soundEnabled ? 'enabled' : 'muted'}.`);
    if (state.settings.soundEnabled) playTone('toggle');
  };

  document.getElementById('toggleEffects').onclick = () => {
    state.settings.effectsEnabled = !state.settings.effectsEnabled;
    renderIdentityPanel();
    saveState();
    deps.showToast(`Effects ${state.settings.effectsEnabled ? 'enabled' : 'disabled'}.`);
  };

  document.getElementById('exportSave').onclick = deps.exportCurrentSave;
  document.getElementById('importSave').onclick = () => document.getElementById('importFile').click();
  document.getElementById('importFile').onchange = deps.importSaveFile;
}

function bindClassEvents() {
  document.querySelectorAll('input[name="classId"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.classId = event.target.value;
      if (state.classId !== 'rogue') state.rogueRun = { active: false, completedQuestIds: [], bonusAwarded: false };
      renderAll();
      deps.showBanner(`${CLASS_DEFS.find((item) => item.id === state.classId).name} chosen. Mechanical perk engaged.`);
    });
  });

  const startRun = document.getElementById('startErrandRun');
  if (startRun) {
    startRun.addEventListener('click', () => {
      state.rogueRun = { active: true, completedQuestIds: [], bonusAwarded: false };
      renderAll();
      deps.showToast('Errand Run started. Chain two errand quests before the run ends for combo XP.');
    });
  }

  const endRun = document.getElementById('endErrandRun');
  if (endRun) {
    endRun.addEventListener('click', () => {
      state.rogueRun = { active: false, completedQuestIds: [], bonusAwarded: false };
      renderAll();
      deps.showToast('Errand Run ended. Pocket your daggers and hydrate.');
    });
  }

  const recovery = document.getElementById('useRecoveryStance');
  if (recovery) {
    recovery.addEventListener('click', () => {
      deps.useRecoveryStance();
    });
  }
}

function bindQuestEvents() {
  document.querySelectorAll('[data-action="start-quest"]').forEach((button) => {
    button.addEventListener('click', () => deps.startQuest(button.dataset.questId));
  });
  document.querySelectorAll('[data-action="resume-quest"]').forEach((button) => {
    button.addEventListener('click', () => deps.resumeQuest(button.dataset.questId));
  });
  document.querySelectorAll('[data-action="block-quest"]').forEach((button) => {
    button.addEventListener('click', () => deps.blockQuest(button.dataset.questId));
  });
  document.querySelectorAll('[data-action="waiting-quest"]').forEach((button) => {
    button.addEventListener('click', () => deps.markQuestWaiting(button.dataset.questId));
  });
  document.querySelectorAll('[data-action="low-energy"]').forEach((button) => {
    button.addEventListener('click', () => deps.useLowEnergyVersion(button.dataset.questId));
  });
  document.querySelectorAll('[data-action="reset-quest"]').forEach((button) => {
    button.addEventListener('click', () => deps.resetQuest(button.dataset.questId));
  });
  document.querySelectorAll('[data-action="review-quest"]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = document.querySelector(`[data-quest-card="${button.dataset.questId}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  document.querySelectorAll('[data-subquest-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const questId = event.target.dataset.questId;
      const subquestId = event.target.dataset.subquestId;
      deps.toggleSubquest(questId, subquestId, event.target.checked);
    });
  });
  document.querySelectorAll('[data-ritual-step]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const questId = event.target.dataset.questId;
      const stepId = event.target.dataset.ritualStep;
      deps.toggleRitualStep(questId, stepId, event.target.checked);
    });
  });
  document.querySelectorAll('[data-support-task-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      deps.toggleSupportTask(event.target.dataset.supportChapterId, event.target.dataset.supportTaskId, event.target.checked);
    });
  });
}

function bindBossEvents() {
  document.querySelectorAll('[data-action="start-boss"]').forEach((button) => {
    button.addEventListener('click', () => deps.startBoss(button.dataset.chapterId));
  });
  document.querySelectorAll('[data-action="resume-boss"]').forEach((button) => {
    button.addEventListener('click', () => deps.resumeBoss(button.dataset.chapterId));
  });
  document.querySelectorAll('[data-action="block-boss"]').forEach((button) => {
    button.addEventListener('click', () => deps.blockBoss(button.dataset.chapterId));
  });
  document.querySelectorAll('[data-action="reset-boss"]').forEach((button) => {
    button.addEventListener('click', () => deps.resetBoss(button.dataset.chapterId));
  });
  document.querySelectorAll('[data-boss-subquest-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const bossId = event.target.dataset.bossId;
      const subquestId = event.target.dataset.bossSubquestId;
      deps.toggleBossSubquest(bossId, subquestId, event.target.checked);
    });
  });
}


function handleTimerKeydown(event) {
  if (document.getElementById('timerOverlay').hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    deps.closeTimerOverlay();
    deps.showToast('Start Sprint dismissed. The quest remains. So does fate.');
    return;
  }
  if (event.key !== 'Tab') return;
  const focusables = [document.getElementById('confirmMomentum'), document.getElementById('skipMomentum')].filter(Boolean);
  const currentIndex = focusables.indexOf(document.activeElement);
  if (event.shiftKey) {
    if (currentIndex <= 0) {
      event.preventDefault();
      focusables[focusables.length - 1].focus();
    }
  } else if (currentIndex === focusables.length - 1) {
    event.preventDefault();
    focusables[0].focus();
  }
}

function handleCampaignSetupKeydown(event) {
  const overlay = document.getElementById('campaignSetupOverlay');
  if (overlay.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    deps.showToast('Character setup is required before the campaign begins. One more ritual, then glory.');
    return;
  }
  if (event.key !== 'Tab') return;
  const focusables = Array.from(overlay.querySelectorAll('button:not([disabled]), input:not([disabled])')).filter((node) => node.offsetParent !== null || node === document.activeElement);
  if (!focusables.length) return;
  const currentIndex = focusables.indexOf(document.activeElement);
  if (event.shiftKey) {
    if (currentIndex <= 0) {
      event.preventDefault();
      focusables[focusables.length - 1].focus();
    }
  } else if (currentIndex === focusables.length - 1) {
    event.preventDefault();
    focusables[0].focus();
  }
}

function openQuestFlowModal(mode, targetId, targetType = 'quest') {
  const target = targetType === 'quest'
    ? findChapterForQuest(targetId).quests.find((item) => item.id === targetId)
    : CHAPTERS.flatMap((chapter) => chapter.bossPool).find((item) => item.id === targetId);
  const entry = targetType === 'quest' ? getQuestEntry(targetId) : state.bosses[targetId];
  const overlay = document.getElementById('questFlowOverlay');
  const body = document.getElementById('questFlowBody');
  ctx.lastQuestFlowFocusBeforeDialog = document.activeElement;
  ctx.questFlowContext = { mode, targetId, targetType };
  document.getElementById('questFlowEyebrow').textContent = target.title;
  const isBlockedMode = mode === 'blocked' || mode === 'boss-blocked';
  document.getElementById('questFlowTitle').textContent = isBlockedMode ? 'Build an unblock plan' : 'Mark as waiting';
  document.getElementById('questFlowCopy').textContent = isBlockedMode
    ? 'Name the blocker and the smallest bridge back in.'
    : 'Waiting is real progress if you set the follow-up cleanly.';

  body.innerHTML = isBlockedMode
    ? `
      <div class="setup-grid">
        <div class="field-stack"><label class="field-label" for="questBlockReason">What is blocking this ${targetType === 'boss' ? 'boss' : 'quest'}?</label><input class="text-input" id="questBlockReason" type="text" value="${escapeAttr(entry.blockedReason || '')}" placeholder="Needs money, low energy, fear, no ride..." /></div>
        <div class="field-stack"><label class="field-label" for="questBlockType">Blocker type</label><input class="text-input" id="questBlockType" type="text" value="${escapeAttr(entry.blockerType || '')}" placeholder="energy, money, fear, waiting, transportation, confusion, conflict" /></div>
        <div class="field-stack"><label class="field-label" for="questBlockStep">Smallest unblock step</label><input class="text-input" id="questBlockStep" type="text" value="${escapeAttr(entry.blockPlan.smallestStep || '')}" placeholder="Write script, gather number, open doc, clear desk..." /></div>
        <div class="field-stack"><label class="field-label" for="questBlockSupport">Support needed</label><input class="text-input" id="questBlockSupport" type="text" value="${escapeAttr(entry.blockPlan.support || '')}" placeholder="body double, ride, reminder, review" /></div>
        <div class="field-stack"><label class="field-label" for="questBlockRetry">When to retry</label><input class="text-input" id="questBlockRetry" type="text" value="${escapeAttr(entry.blockPlan.retryWhen || '')}" placeholder="tomorrow 2 PM" /></div>
      </div>
    `
    : `
      <div class="setup-grid">
        <div class="field-stack"><label class="field-label" for="questWaitingReason">What are you waiting on?</label><input class="text-input" id="questWaitingReason" type="text" value="${escapeAttr(entry.waitingPlan.reason || '')}" placeholder="reply, callback, confirmation, document, ride" /></div>
        <div class="field-stack"><label class="field-label" for="questWaitingFollowup">Follow-up move</label><input class="text-input" id="questWaitingFollowup" type="text" value="${escapeAttr(entry.waitingPlan.followup || '')}" placeholder="set reminder, check portal, send nudge" /></div>
        <div class="field-stack"><label class="field-label" for="questWaitingRetry">When to check again</label><input class="text-input" id="questWaitingRetry" type="text" value="${escapeAttr(entry.waitingPlan.retryWhen || '')}" placeholder="Friday morning" /></div>
      </div>
    `;

  overlay.hidden = false;
  syncOverlayLock();
  window.requestAnimationFrame(() => {
    const firstInput = body.querySelector('input');
    if (firstInput) firstInput.focus();
  });
}

function closeQuestFlowModal() {
  document.getElementById('questFlowOverlay').hidden = true;
  syncOverlayLock();
  ctx.questFlowContext = null;
  if (ctx.lastQuestFlowFocusBeforeDialog && typeof ctx.lastQuestFlowFocusBeforeDialog.focus === 'function') {
    ctx.lastQuestFlowFocusBeforeDialog.focus();
  }
  ctx.lastQuestFlowFocusBeforeDialog = null;
}

function submitQuestFlowModal() {
  if (!ctx.questFlowContext) return;
  const entry = ctx.questFlowContext.targetType === 'quest' ? getQuestEntry(ctx.questFlowContext.targetId) : state.bosses[ctx.questFlowContext.targetId];
  if (ctx.questFlowContext.mode === 'blocked' || ctx.questFlowContext.mode === 'boss-blocked') {
    entry.blockedReason = document.getElementById('questBlockReason').value.trim() || 'No reason recorded.';
    entry.blockerType = document.getElementById('questBlockType').value.trim();
    entry.blockPlan = {
      smallestStep: document.getElementById('questBlockStep').value.trim(),
      support: document.getElementById('questBlockSupport').value.trim(),
      retryWhen: document.getElementById('questBlockRetry').value.trim()
    };
    entry.status = 'blocked';
    closeQuestFlowModal();
    renderAll();
    deps.showToast(`${ctx.questFlowContext.targetType === 'boss' ? 'Boss' : 'Quest'} marked blocked, but now with an actual bridge back in.`);
    return;
  }
  entry.waitingPlan = {
    reason: document.getElementById('questWaitingReason').value.trim(),
    followup: document.getElementById('questWaitingFollowup').value.trim(),
    retryWhen: document.getElementById('questWaitingRetry').value.trim()
  };
  entry.status = 'waiting';
  closeQuestFlowModal();
  renderAll();
  deps.showToast('Quest marked waiting. Administrative purgatory now has a follow-up plan.');
}

function handleQuestFlowKeydown(event) {
  const overlay = document.getElementById('questFlowOverlay');
  if (overlay.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeQuestFlowModal();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusables = Array.from(overlay.querySelectorAll('button:not([disabled]), input:not([disabled])')).filter((node) => node.offsetParent !== null || node === document.activeElement);
  if (!focusables.length) return;
  const currentIndex = focusables.indexOf(document.activeElement);
  if (event.shiftKey) {
    if (currentIndex <= 0) {
      event.preventDefault();
      focusables[focusables.length - 1].focus();
    }
  } else if (currentIndex === focusables.length - 1) {
    event.preventDefault();
    focusables[0].focus();
  }
}


  return {
    bindGlobalEvents,
    executeNextMove,
    retreatCampaignSetup,
    advanceCampaignSetup,
    toggleSectionCollapse,
    bindIdentityEvents,
    bindClassEvents,
    bindQuestEvents,
    bindBossEvents,
    handleTimerKeydown,
    handleCampaignSetupKeydown,
    openQuestFlowModal,
    closeQuestFlowModal,
    submitQuestFlowModal,
    handleQuestFlowKeydown
  };
}
