// @ts-nocheck
import { createGameProxies } from "./moduleContext";

export function createActions(deps) {
  const {
    ctx,
    CLASS_DEFS,
    CHAPTERS,
    LEGACY_STORAGE_KEY,
    defaultState,
    saveMeta,
    loadState,
    saveState,
    hydrateState,
    getCharacterName,
    getCampaignFirstProof,
    findChapterForQuest,
    getQuestEntry,
    getBossEntry,
    isChapterUnlocked,
    isChapterComplete,
    isBossRevealed,
    getBossStatus,
    getBossForChapter,
    getRitualPlanSteps,
    getUnlockedRewardCount,
    getQuestStatus,
    renderAll
  } = deps;

  const { state, meta } = createGameProxies(ctx);

function syncOverlayLock() {
  const anyOpen = ['campaignSetupOverlay', 'questFlowOverlay', 'timerOverlay'].some((id) => {
    const node = document.getElementById(id);
    return node && !node.hidden;
  });
  document.body.classList.toggle('overlay-open', anyOpen);
}

function startQuest(questId) {
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  const entry = getQuestEntry(questId);
  entry.status = 'started';
  entry.startedAt = entry.startedAt || Date.now();
  if (state.classId === 'barbarian') launchTimer(questId, quest.title);
  renderAll();
  showToast(`Quest started: ${quest.title}. Objective chain revealed.`);
}

function resumeQuest(questId) {
  const entry = getQuestEntry(questId);
  entry.status = entry.subquests && Object.values(entry.subquests).some(Boolean) ? 'started' : 'started';
  renderAll();
  showToast('Quest resumed. Back into the swamp, but with better lighting.');
}

function useLowEnergyVersion(questId) {
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  const entry = getQuestEntry(questId);
  entry.status = 'started';
  entry.startedAt = entry.startedAt || Date.now();
  entry.bonuses.lowEnergy = true;
  const firstIncompleteRequired = quest.subquests.filter((sub) => sub.required).find((sub) => !entry.subquests[sub.id]);
  if (firstIncompleteRequired) {
    entry.subquests[firstIncompleteRequired.id] = true;
  }
  if (allRequiredQuestStepsDone(questId)) {
    completeQuest(questId);
    return;
  }
  renderAll();
  showToast(`Low-energy version applied to ${quest.title}. One smaller real step is now banked.`);
}

function blockQuest(questId) {
  const chapter = findChapterForQuest(questId);
  if (!isChapterUnlocked(chapter)) return;
  deps.openQuestFlowModal('blocked', questId);
}

function markQuestWaiting(questId) {
  deps.openQuestFlowModal('waiting', questId);
}

function resetQuest(questId) {
  if (!confirm('Reset this quest and clear its steps, buffs, and progress?')) return;
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  state.quests[questId] = {
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
  quest.subquests.forEach((sub) => { state.quests[questId].subquests[sub.id] = false; });
  if (quest.ritualPlan) getRitualPlanSteps(quest).forEach((step) => { state.quests[questId].ritualPlan[step.id] = false; });
  renderAll();
  showToast('Quest reset. Sometimes you cleanse the rune circle and start again.');
}

function toggleSubquest(questId, subquestId, checked) {
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  const entry = getQuestEntry(questId);
  const previous = !!entry.subquests[subquestId];
  entry.subquests[subquestId] = checked;
  if (entry.status !== 'completed') {
    const required = quest.subquests.filter((sub) => sub.required);
    const doneRequired = required.filter((sub) => entry.subquests[sub.id]).length;
    entry.status = doneRequired > 0 ? 'started' : 'started';
  }
  if (!previous && checked && state.classId === 'monk' && quest.tags.includes('routine')) {
    state.monk.discipline += 1;
    showToast(`Discipline gained. Monk reserve now at ${state.monk.discipline}.`);
  }
  if (allRequiredQuestStepsDone(questId)) {
    completeQuest(questId);
    return;
  }
  renderAll();
}

function toggleRitualStep(questId, stepId, checked) {
  const entry = getQuestEntry(questId);
  entry.ritualPlan[stepId] = checked;
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  const ritualDone = getRitualPlanSteps(quest).every((step) => entry.ritualPlan[step.id]);
  if (ritualDone) {
    entry.bonuses.ritual = true;
  } else if (entry.status !== 'completed') {
    entry.bonuses.ritual = false;
  }
  renderAll();
  if (ritualDone) {
    showToast('Ritual Plan complete. The paperwork demons hate preparation.');
  }
}

function allRequiredQuestStepsDone(questId) {
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  const entry = getQuestEntry(questId);
  const required = quest.subquests.filter((sub) => sub.required);
  const needed = quest.requiredCount || required.length;
  const done = required.filter((sub) => entry.subquests[sub.id]).length;
  return done >= needed;
}

function completeQuest(questId) {
  const quest = findChapterForQuest(questId).quests.find((item) => item.id === questId);
  const entry = getQuestEntry(questId);
  const wasCompleted = entry.status === 'completed';
  const rewardsBefore = getUnlockedRewardCount();
  entry.status = 'completed';
  entry.completedAt = entry.completedAt || Date.now();
  if (!wasCompleted && state.classId === 'rogue' && state.rogueRun.active && quest.tags.includes('errand')) {
    state.rogueRun.completedQuestIds = Array.from(new Set([...state.rogueRun.completedQuestIds, questId]));
    entry.bonuses.rogueCombo = true;
    if (state.rogueRun.completedQuestIds.length >= 2 && !state.rogueRun.bonusAwarded) {
      state.rogueRun.bonusAwarded = true;
      showBanner('Errand Run combo achieved! Two errand quests chained in one outing. That counts as roguish competence.', 'reward');
      showToast('Combo bonus applied to this run’s quests. Sneaky little efficiency demon.', 'reward');
    }
  }
  renderAll();
  celebrate('quest');
  showToast(`Quest cleared: ${quest.title}. Parent quest auto-completed because all required steps are done.`, 'reward');
  if (getUnlockedRewardCount() > rewardsBefore) {
    celebrate('reward');
    showBanner('Loot tier unlocked. Yes, bribery remains one of civilization’s sturdier inventions.', 'reward');
  }
  maybeAnnounceChapterEvents(findChapterForQuest(questId));
}

function startBoss(chapterId) {
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  const boss = getBossForChapter(chapter);
  const entry = state.bosses[boss.id];
  entry.status = 'started';
  entry.startedAt = entry.startedAt || Date.now();
  renderAll();
  showToast(`Boss quest started: ${boss.title}. Time to bully a problem large enough to deserve a title.`);
}

function resumeBoss(chapterId) {
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  const boss = getBossForChapter(chapter);
  state.bosses[boss.id].status = 'started';
  renderAll();
  showToast('Boss resumed. The monster did not, sadly, solve itself.');
}

function blockBoss(chapterId) {
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  const boss = getBossForChapter(chapter);
  deps.openQuestFlowModal('boss-blocked', boss.id, 'boss');
}

function resetBoss(chapterId) {
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  const boss = getBossForChapter(chapter);
  if (!confirm(`Reset ${boss.title} and clear all boss objectives?`)) return;
  state.bosses[boss.id] = {
    status: 'available',
    blockedReason: '',
    blockerType: '',
    blockPlan: { smallestStep: '', support: '', retryWhen: '' },
    subquests: {},
    bonuses: {},
    startedAt: null,
    completedAt: null
  };
  boss.subquests.forEach((sub) => { state.bosses[boss.id].subquests[sub.id] = false; });
  renderAll();
  showToast('Boss reset. Sometimes the dragon wins round one.');
}

function toggleBossSubquest(bossId, subquestId, checked) {
  const boss = CHAPTERS.flatMap((chapter) => chapter.bossPool).find((item) => item.id === bossId);
  const entry = state.bosses[bossId];
  entry.subquests[subquestId] = checked;
  if (entry.status !== 'completed') entry.status = 'started';
  if (boss.subquests.every((sub) => entry.subquests[sub.id])) {
    completeBoss(bossId);
    return;
  }
  renderAll();
}

function completeBoss(bossId) {
  const chapter = CHAPTERS.find((item) => getBossForChapter(item).id === bossId);
  const boss = getBossForChapter(chapter);
  const entry = state.bosses[bossId];
  entry.status = 'completed';
  entry.completedAt = entry.completedAt || Date.now();
  renderAll();
  celebrate('boss');
  showBanner(`Boss defeated: ${boss.title}. Chapter ${chapter.level} bends the knee.`, 'boss');
  maybeAnnounceChapterEvents(chapter);
}

function maybeAnnounceChapterEvents(chapter) {
  const completed = isChapterComplete(chapter);
  if (completed) {
    celebrate('chapter');
    if (chapter.level < CHAPTERS.length) {
      showBanner(`Level ${chapter.level} complete. ${CHAPTERS[chapter.level].title} is now unlocked.`, 'chapter');
    } else {
      showBanner('All chapters complete. The Independent Keep is no longer theory.', 'chapter');
    }
  } else if (isBossRevealed(chapter) && getBossStatus(chapter) === 'available') {
    showToast(`Boss revealed in ${chapter.title}: ${getBossForChapter(chapter).title}. Naturally, it showed up when things got interesting.`, 'boss');
  }
}

function launchTimer(questId, questTitle) {
  ctx.activeTimerQuestId = questId;
  const overlay = document.getElementById('timerOverlay');
  ctx.lastFocusBeforeDialog = document.activeElement;
  overlay.hidden = false;
  syncOverlayLock();
  document.getElementById('timerQuestCopy').textContent = `Quest started: ${questTitle}. Touch it within 60 seconds for the Momentum buff.`;
  let count = 60;
  document.getElementById('timerCount').textContent = count;
  window.requestAnimationFrame(() => {
    document.getElementById('confirmMomentum').focus();
  });
  clearInterval(ctx.timerInterval);
  ctx.timerInterval = setInterval(() => {
    count -= 1;
    document.getElementById('timerCount').textContent = count;
    if (count <= 0) {
      clearInterval(ctx.timerInterval);
      closeTimerOverlay();
      showToast('Start Sprint expired. No bonus, but the quest is still live. Move anyway.');
    }
  }, 1000);
}

function closeTimerOverlay() {
  clearInterval(ctx.timerInterval);
  ctx.timerInterval = null;
  ctx.activeTimerQuestId = null;
  document.getElementById('timerOverlay').hidden = true;
  syncOverlayLock();
  if (ctx.lastFocusBeforeDialog && typeof ctx.lastFocusBeforeDialog.focus === 'function') {
    ctx.lastFocusBeforeDialog.focus();
  }
  ctx.lastFocusBeforeDialog = null;
}


function useRecoveryStance() {
  if (state.monk.discipline < 3) return;
  const blockedQuest = CHAPTERS.flatMap((chapter) => chapter.quests).find((quest) => getQuestEntry(quest.id).status === 'blocked');
  if (!blockedQuest) {
    showToast('No blocked quest available for Recovery Stance. Impressive, honestly.');
    return;
  }
  const entry = getQuestEntry(blockedQuest.id);
  entry.status = 'started';
  entry.blockedReason = '';
  entry.bonuses.recovery = true;
  const firstIncomplete = blockedQuest.subquests.find((sub) => !entry.subquests[sub.id]);
  if (firstIncomplete) entry.subquests[firstIncomplete.id] = true;
  state.monk.discipline -= 3;
  if (allRequiredQuestStepsDone(blockedQuest.id)) {
    completeQuest(blockedQuest.id);
    return;
  }
  renderAll();
  showBanner(`Recovery Stance used on ${blockedQuest.title}. First step cleared and the quest is moving again.`);
}

function toggleSupportTask(chapterId, taskId, checked) {
  state.supportTasks[chapterId][taskId] = checked;
  saveState();
  if (checked) showToast('Support-party task logged. Coordination: the least flashy buff in the realm.');
}

function switchSaveSlot(slotId) {
  if (slotId === meta.currentSlot) return;
  saveState();
  meta.currentSlot = slotId;
  saveMeta();
  ctx.state = loadState(slotId);
  hydrateState();
  renderAll();
  showBanner(`Save slot ${slotId.replace('slot', '')} loaded. Hero now bound to ${getCharacterName()}.`);
}

function exportCurrentSave() {
  const payload = {
    exportedAt: new Date().toISOString(),
    slotId: meta.currentSlot,
    characterName: getCharacterName(),
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = getCharacterName().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'unnamed-hero';
  anchor.href = url;
  anchor.download = `independence-campaign-${safeName}-${meta.currentSlot}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast('Current save exported. Your campaign is now bottled against disaster.');
}

async function importSaveFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    if (!payload || typeof payload !== 'object' || !payload.state || typeof payload.state !== 'object') {
      throw new Error('File did not contain a valid campaign state.');
    }
    if (typeof payload.state.version !== 'number') {
      throw new Error('Imported file is missing a supported campaign version.');
    }
    if (!confirm(`Import this save into slot ${meta.currentSlot.replace('slot', '')}? Current progress in this slot will be overwritten.`)) {
      event.target.value = '';
      return;
    }
    const existingBosses = state.chapterBosses || {};
    ctx.state = { ...defaultState(), ...payload.state };
    if (!payload.state.chapterBosses || typeof payload.state.chapterBosses !== 'object') {
      state.chapterBosses = existingBosses;
    }
    if (typeof payload.characterName === 'string' && !state.characterName) state.characterName = payload.characterName;
    hydrateState();
    renderAll();
    showBanner(`Save imported into slot ${meta.currentSlot.replace('slot', '')}. The bottle uncorks; the hero remembers.`);
  } catch (error) {
    console.error(error);
    showBanner('Import failed. That file was not valid campaign sorcery.');
  } finally {
    event.target.value = '';
  }
}

function playTone(kind = 'quest') {
  if (!state.settings.soundEnabled) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  try {
    if (!playTone.ctx) playTone.ctx = new AudioCtor();
    const ctx = playTone.ctx;
    const now = ctx.currentTime;
    const profile = {
      toggle: [520, 660],
      quest: [440, 660],
      reward: [523, 659, 784],
      boss: [330, 440, 554, 740],
      chapter: [392, 523, 659, 880]
    }[kind] || [440, 660];
    profile.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'boss' ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.05, now + index * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.2);
    });
  } catch (error) {
    console.warn('Sound effect failed.', error);
  }
}

function burstParticles(kind = 'quest') {
  if (!state.settings.effectsEnabled) return;
  const layer = document.getElementById('particleLayer');
  const colorSets = {
    quest: ['#73e2a7', '#ffd166', '#7cc6fe'],
    reward: ['#ffd166', '#c7a6ff', '#ffffff'],
    boss: ['#ff5fa2', '#ffd166', '#ffffff'],
    chapter: ['#73e2a7', '#ffd166', '#c7a6ff', '#7cc6fe']
  };
  const colors = colorSets[kind] || colorSets.quest;
  const count = kind === 'chapter' ? 34 : kind === 'boss' ? 28 : 18;
  const originX = Math.round(window.innerWidth * (0.55 + Math.random() * 0.1));
  const originY = Math.round(window.innerHeight * (kind === 'chapter' ? 0.34 : 0.72));
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = `particle ${Math.random() > 0.55 ? 'square' : ''}`;
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = particle.style.color;
    particle.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 280)}px`);
    particle.style.setProperty('--dy', `${Math.round((Math.random() - 0.8) * 220)}px`);
    layer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}

function celebrate(kind = 'quest') {
  playTone(kind);
  burstParticles(kind);
}

function showToast(message, kind = 'default') {
  const toast = document.getElementById('toast');
  toast.innerHTML = message;
  toast.dataset.kind = kind;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function showBanner(message, kind = 'default') {
  const banner = document.getElementById('banner');
  banner.innerHTML = message;
  banner.dataset.kind = kind;
  banner.classList.add('show');
  clearTimeout(banner._timer);
  banner._timer = setTimeout(() => banner.classList.remove('show'), 4800);
}


  return {
    startQuest,
    resumeQuest,
    useLowEnergyVersion,
    blockQuest,
    markQuestWaiting,
    resetQuest,
    toggleSubquest,
    toggleRitualStep,
    allRequiredQuestStepsDone,
    completeQuest,
    startBoss,
    resumeBoss,
    blockBoss,
    resetBoss,
    toggleBossSubquest,
    completeBoss,
    maybeAnnounceChapterEvents,
    launchTimer,
    closeTimerOverlay,
    useRecoveryStance,
    toggleSupportTask,
    switchSaveSlot,
    exportCurrentSave,
    importSaveFile,
    playTone,
    burstParticles,
    celebrate,
    showToast,
    showBanner
  };
}
