// @ts-nocheck
import { createGameProxies } from "./moduleContext";

export function createRendering(deps) {
  const {
    ctx,
    CLASS_DEFS,
    RESCUE_ITEMS,
    REWARDS,
    BUDGET_EXAMPLES,
    SUPPORT_TASKS,
    CAMPAIGN_ORIGINS,
    CAMPAIGN_MOTIVATIONS,
    CAMPAIGN_FIRST_PROOFS,
    LOW_ENERGY_OPTIONS,
    CHAPTERS,
    saveState,
    getLevel,
    getTotalXP,
    getCompletedQuestCount,
    getCompletedBossCount,
    getBlockedQuestCount,
    getActiveQuestCount,
    getOverallProgressPercent,
    getNextObjectiveCopy,
    getMainQuestStatus,
    getCurrentChapter,
    getCharacterName,
    getNextMove,
    getCampaignOrigin,
    getCampaignMotivation,
    getCampaignVow,
    getBossForChapter,
    isBossRevealed,
    isChapterComplete,
    isChapterUnlocked,
    getBossStatus,
    getQuestEntry,
    getQuestStatus,
    questProgress,
    getSlotPreview,
    getSlotLabel,
    getRitualPlanSteps,
    getStatusDisplay,
    getQuestGrade,
    getUnlockedRewardCount,
    getChapterGlyph,
    formatDateTime,
    escapeHtml,
    escapeAttr
  } = deps;

  const { state, meta, persistenceStatus } = createGameProxies(ctx);

function renderAll() {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  document.body.classList.toggle('focus-mode', !!state.settings.focusMode);
  renderHeader();
  renderJourney();
  renderMainQuest();
  renderQuestLog();
  renderIdentityPanel();
  renderClassPanel();
  renderBossPanel();
  renderRewardPanel();
  renderRescuePanel();
  renderBudgetPanel();
  renderCampaignSetup();
  renderSectionCollapseStates();
  saveState();
  renderIdentityPanel();
  if (document.getElementById('campaignSetupOverlay')?.hidden !== false && document.getElementById('questFlowOverlay')?.hidden !== false && document.getElementById('timerOverlay')?.hidden !== false) {
    window.scrollTo(scrollX, scrollY);
  }
}

function renderHeader() {
  document.getElementById('statLevel').textContent = getLevel();
  document.getElementById('statXp').textContent = getTotalXP();
  document.getElementById('statQuests').textContent = getCompletedQuestCount();
  document.getElementById('statBosses').textContent = getCompletedBossCount();
  document.getElementById('statBlocked').textContent = getBlockedQuestCount();
  document.getElementById('statActive').textContent = getActiveQuestCount();
  const progress = getOverallProgressPercent();
  document.getElementById('overallProgress').value = progress;
  document.getElementById('progressLabel').textContent = `${progress}%`;
  document.getElementById('nextObjectiveCopy').textContent = getNextObjectiveCopy();
  document.getElementById('mainQuestStatus').textContent = getMainQuestStatus();
  document.getElementById('journeySummaryPill').textContent = `${CHAPTERS.filter((chapter) => !isChapterComplete(chapter)).length} chapters still resisting`;
  const currentChapter = getCurrentChapter();
  document.getElementById('currentChapterPill').textContent = `Current chapter: ${currentChapter.title}`;
  document.getElementById('heroNameBanner').textContent = `Current hero: ${getCharacterName()}. Slot ${meta.currentSlot.replace('slot', '')} is active.`;
  document.getElementById('toggleFamilyMode').textContent = `Family support: ${state.settings.familyMode ? 'on' : 'off'}`;
  document.getElementById('toggleFocusMode').textContent = `Focus mode: ${state.settings.focusMode ? 'on' : 'off'}`;
  document.getElementById('toggleMapView').textContent = `World map: ${state.settings.showFullMap ? 'full' : 'guided'}`;
  const nextMove = getNextMove();
  document.getElementById('nextMoveType').textContent = nextMove.type;
  document.getElementById('nextMoveHeading').textContent = nextMove.heading;
  document.getElementById('nextMoveCopy').textContent = nextMove.copy;
  document.getElementById('nextMoveButton').textContent = nextMove.button;
  const origin = getCampaignOrigin();
  const motivation = getCampaignMotivation();
  const vow = getCampaignVow();
  document.getElementById('characterSummary').innerHTML = state.campaign.complete
    ? `<strong>${escapeHtml(getCharacterName())}</strong> • ${escapeHtml(origin ? origin.title : 'Unknown origin')} • ${escapeHtml(motivation ? motivation.title : 'No motive chosen')}${vow ? ` • Vow: ${escapeHtml(vow.title)}` : ''}`
    : 'Character creation is not finished yet. Begin with a name, a class, and one small proof.';
  document.getElementById('campaignModeCopy').textContent = state.campaign.complete
    ? `${state.campaign.pathMode === 'guided' ? 'Guided Path' : 'Free Questing'}${state.settings.showFullMap ? ' • full map visible' : ''}`
    : 'Campaign mode not chosen yet.';
}

function renderJourney() {
  const list = document.getElementById('journeyTrack');
  const currentChapter = getCurrentChapter();
  const items = [];
  const currentIndex = CHAPTERS.findIndex((chapter) => chapter.id === currentChapter.id);
  const guidedChapters = state.campaign.pathMode === 'guided' && !state.settings.showFullMap
    ? CHAPTERS.filter((chapter, index) => index === currentIndex || index === currentIndex + 1)
    : CHAPTERS;

  items.push(`
    <li class="journey-step">
      <article class="journey-card ${getCompletedQuestCount() > 0 ? 'complete' : 'current'}">
        <div class="journey-kicker">Start</div>
        <div class="journey-title-line"><span class="chapter-crest">💀</span><div class="journey-title">Base Camp</div></div>
        ${getCompletedQuestCount() === 0 ? '<div class="journey-token">💀 Here</div>' : ''}
        <p class="meta-copy">Current habits, current chaos, current reality. The road starts here.</p>
        <div class="journey-footer"><span>Wake-up point</span><span>${getCompletedQuestCount()} quest(s) cleared</span></div>
      </article>
    </li>
  `);

  guidedChapters.forEach((chapter) => {
    const boss = getBossForChapter(chapter);
    const unlocked = isChapterUnlocked(chapter);
    const complete = isChapterComplete(chapter);
    const current = currentChapter.id === chapter.id && !complete;
    const completedQuests = chapter.quests.filter((quest) => getQuestEntry(quest.id).status === 'completed').length;
    const bossText = isBossRevealed(chapter) ? boss.title : 'Boss hidden in the fog';
    items.push(`
      <li class="journey-step">
        <article class="journey-card ${complete ? 'complete' : ''} ${current ? 'current' : ''} ${!unlocked ? 'locked' : ''}">
          ${current ? '<div class="journey-token">🧍 Current</div>' : ''}
          <div class="journey-kicker">Level ${chapter.level}</div>
          <div class="journey-title-line"><span class="chapter-crest">${getChapterGlyph(chapter)}</span><div class="journey-title">${chapter.title}</div></div>
          <p class="meta-copy">${chapter.journeyTitle}</p>
          <div class="journey-footer">
            <span>${completedQuests}/${chapter.quests.length} quests cleared</span>
            <span>${bossText}</span>
          </div>
        </article>
      </li>
    `);
  });

  if (guidedChapters.length !== CHAPTERS.length) {
    items.push(`
      <li class="journey-step">
        <article class="journey-card locked">
          <div class="journey-kicker">World Map</div>
          <div class="journey-title-line"><span class="chapter-crest">🗺️</span><div class="journey-title">More road ahead</div></div>
          <p class="meta-copy">The guided path is hiding the rest so your brain doesn’t try to swallow the whole castle at once.</p>
          <div class="journey-footer"><span>Use full map to browse later chapters</span><span>${CHAPTERS.length - guidedChapters.length - currentIndex > 0 ? `${CHAPTERS.length - guidedChapters.length - currentIndex} chapter(s) hidden` : 'One road at a time'}</span></div>
        </article>
      </li>
    `);
  }

  items.push(`
    <li class="journey-step">
      <article class="journey-card ${CHAPTERS.every((chapter) => isChapterComplete(chapter)) ? 'complete current' : ''}">
        ${CHAPTERS.every((chapter) => isChapterComplete(chapter)) ? '<div class="journey-token">🏰 Claimed</div>' : ''}
        <div class="journey-kicker">Ending</div>
        <div class="journey-title-line"><span class="chapter-crest">🏰</span><div class="journey-title">The Independent Keep</div></div>
        <p class="meta-copy">A home plan backed by routines, money math, and enough competence to survive contact with reality.</p>
        <div class="journey-footer"><span>Final destination</span><span>${getOverallProgressPercent()}% journey complete</span></div>
      </article>
    </li>
  `);

  list.innerHTML = items.join('');
}

function renderMainQuest() {
  const container = document.getElementById('mainQuestCard');
  const chaptersHtml = CHAPTERS.map((chapter) => {
    const boss = getBossForChapter(chapter);
    const questCount = chapter.quests.filter((quest) => getQuestEntry(quest.id).status === 'completed').length;
    const status = isChapterComplete(chapter) ? 'Completed' : isChapterUnlocked(chapter) ? 'Active' : 'Locked';
    return `
      <li class="subquest-item ${isChapterComplete(chapter) ? 'done' : ''}">
        <label>
          <input type="checkbox" ${isChapterComplete(chapter) ? 'checked' : ''} disabled aria-hidden="true" />
          <span>
            <strong>${chapter.title}</strong><br />
            <span class="soft">${questCount}/${chapter.quests.length} quests cleared • Boss: ${boss.title}</span>
          </span>
          <span class="subquest-xp status-label ${status.toLowerCase() === 'active' ? 'in-progress' : status.toLowerCase()}">${status}</span>
        </label>
      </li>
    `;
  }).join('');

  container.innerHTML = `
    <article class="final-card">
      <div>
        <div class="title-chip">🏁 Win condition</div>
        <div class="quest-title" style="margin-top:8px;">Claim the keep for real</div>
        <p class="quest-copy">Stabilize yourself, handle the household, survive admin, make the money math real, and finish the launch plan.</p>
      </div>
      <ol class="subquest-list">${chaptersHtml}</ol>
      <div class="bonus-panel">
        <strong>${getMainQuestStatus()}</strong>
        <div class="soft">Clear the chapters, beat the bosses, and the campaign upgrades from theory to readiness.</div>
      </div>
    </article>
  `;
}

function renderQuestLog() {
  const container = document.getElementById('chapterList');
  const currentChapter = getCurrentChapter();
  const chaptersToRender = (state.settings.focusMode || (state.campaign.pathMode === 'guided' && !state.settings.showFullMap))
    ? CHAPTERS.filter((chapter) => chapter.id === currentChapter.id)
    : CHAPTERS;
  const html = chaptersToRender.map((chapter) => {
    const unlocked = isChapterUnlocked(chapter);
    const completed = isChapterComplete(chapter);
    const boss = getBossForChapter(chapter);
    const bossStatus = getBossStatus(chapter);
    const questCards = chapter.quests.map((quest) => renderQuestCard(quest, chapter)).join('');

    return `
      <article class="chapter-card ${currentChapter.id === chapter.id && !completed ? 'current' : ''} ${!unlocked ? 'locked' : ''}" id="chapter-${chapter.id}">
        <div class="chapter-top">
          <div>
            <div class="chapter-title-line"><span class="chapter-crest">${getChapterGlyph(chapter)}</span><div><h3>Level ${chapter.level}: ${chapter.title}</h3><div class="chapter-subtitle">${chapter.journeyTitle}</div></div></div>
            <p class="muted">${chapter.intro}</p>
          </div>
          <div class="chapter-progress">
            <div class="progress-row">
              <strong>Chapter progress</strong>
              <span>${chapter.quests.filter((quest) => getQuestEntry(quest.id).status === 'completed').length}/${chapter.quests.length} quests • Boss ${bossStatus}</span>
            </div>
            <progress max="100" value="${getChapterProgressPercent(chapter)}"></progress>
            <span class="soft">Boss in this chapter: ${boss.title}${isBossRevealed(chapter) ? '' : ' (reveals after enough quest progress)'}</span>
          </div>
        </div>
        ${unlocked ? `<ol class="quest-list">${questCards}</ol>${renderSupportPanel(chapter)}` : `<div class="blocked-note">Locked until the previous chapter and boss are cleared. One cannot simply swagger into rent math.</div>`}
      </article>
    `;
  }).join('');
  container.innerHTML = html;
  deps.bindQuestEvents();
}

function getChapterProgressPercent(chapter) {
  const questWeight = chapter.quests.filter((quest) => getQuestEntry(quest.id).status === 'completed').length / chapter.quests.length;
  const bossWeight = getBossStatus(chapter) === 'completed' ? 1 : 0;
  return Math.round(((questWeight * 0.7) + (bossWeight * 0.3)) * 100);
}

function renderSupportPanel(chapter) {
  if (!state.settings.familyMode) return '';
  const tasks = SUPPORT_TASKS[chapter.id] || [];
  if (!tasks.length) return '';
  const taskHtml = tasks.map((task) => {
    const checked = !!state.supportTasks[chapter.id][task.id];
    return `
      <li class="plan-item ${checked ? 'done' : ''}">
        <label>
          <input type="checkbox" data-support-chapter-id="${chapter.id}" data-support-task-id="${task.id}" ${checked ? 'checked' : ''} />
          <span>
            <strong>${task.title}</strong><br />
            <span class="soft">${task.copy}</span>
          </span>
        </label>
      </li>
    `;
  }).join('');

  return `
    <section class="support-panel">
      <div class="support-title">🛡️ Support Party Quests</div>
      <div class="support-copy">These are helper tasks for family or allies. They do not replace the player’s work; they reduce chaos around it.</div>
      <ol class="plan-list">${taskHtml}</ol>
    </section>
  `;
}

function renderIdentityPanel() {
  const input = document.getElementById('characterNameInput');
  input.value = state.characterName || '';

  document.getElementById('slotGrid').innerHTML = ['slot1', 'slot2', 'slot3'].map((slotId) => {
    const preview = getSlotPreview(slotId);
    const previewName = preview && preview.characterName ? preview.characterName.trim() : '';
    const previewQuests = preview && preview.quests ? Object.values(preview.quests).filter((entry) => entry.status === 'completed').length : 0;
    const previewBosses = preview && preview.bosses ? Object.values(preview.bosses).filter((entry) => entry.status === 'completed').length : 0;
    const previewTime = preview && preview.updatedAt ? formatDateTime(preview.updatedAt) : 'Never played';
    return `
      <button class="slot-button ${meta.currentSlot === slotId ? 'active' : ''}" data-slot-id="${slotId}">
        <span class="slot-name">${escapeHtml(previewName || getSlotLabel(slotId))}</span>
        <span class="slot-meta">${slotId === meta.currentSlot ? 'Current slot' : 'Switch slot'}<br />${preview ? `${previewQuests} quest(s) • ${previewBosses} boss(es)<br />Last played: ${previewTime}` : 'Fresh campaign'}</span>
      </button>
    `;
  }).join('');

  document.getElementById('slotPill').textContent = `Slot ${meta.currentSlot.replace('slot', '')} active`;
  document.getElementById('slotCopy').textContent = `${getCharacterName()} is currently bound to slot ${meta.currentSlot.replace('slot', '')}. Export this slot or import over it as needed.`;
  document.getElementById('saveStatusCopy').textContent = persistenceStatus.stateOk && persistenceStatus.metaOk
    ? `Autosave confirmed. Created: ${formatDateTime(state.createdAt)} • Last saved: ${formatDateTime(persistenceStatus.lastSavedAt || state.updatedAt)}.`
    : `Save warning: ${persistenceStatus.warning || 'Changes may not persist on this device.'}`;
  document.getElementById('toggleSound').textContent = `Sound: ${state.settings.soundEnabled ? 'on' : 'off'}`;
  document.getElementById('toggleEffects').textContent = `Effects: ${state.settings.effectsEnabled ? 'on' : 'off'}`;
  deps.bindIdentityEvents();
}

function renderQuestCard(quest, chapter) {
  const entry = getQuestEntry(quest.id);
  const status = getQuestStatus(quest, chapter);
  const progress = questProgress(quest);
  const grade = getQuestGrade(quest, chapter);
  const statusDisplay = getStatusDisplay(status);
  const classId = state.classId;
  const ritualVisible = classId === 'wizard' && quest.ritualPlan && status !== 'available' && status !== 'locked';
  const ritualSteps = ritualVisible ? getRitualPlanSteps(quest).map((step) => {
    const checked = !!entry.ritualPlan[step.id];
    return `
      <li class="plan-item ${checked ? 'done' : ''}">
        <label>
          <input type="checkbox" data-ritual-step="${step.id}" data-quest-id="${quest.id}" ${checked ? 'checked' : ''} ${status === 'completed' ? 'disabled' : ''} />
          <span>
            <strong>${step.title}</strong><br />
            <span class="soft">Prep now, suffer less later.</span>
          </span>
        </label>
      </li>
    `;
  }).join('') : '';

  const subquestVisible = status !== 'available' && status !== 'locked';
  const subquests = subquestVisible ? quest.subquests.map((sub) => {
    const checked = !!entry.subquests[sub.id];
    return `
      <li class="subquest-item ${sub.required ? '' : 'optional'} ${checked ? 'done' : ''}">
        <label>
          <input type="checkbox" data-subquest-id="${sub.id}" data-quest-id="${quest.id}" ${checked ? 'checked' : ''} ${status === 'completed' ? 'disabled' : ''} />
          <span>
            <strong>${sub.title}</strong><br />
            <span class="soft">${sub.required ? 'Required step' : 'Optional bonus step'}</span>
          </span>
          <span class="subquest-xp">${sub.xp} XP</span>
        </label>
      </li>
    `;
  }).join('') : `<div class="blocked-note">Start this quest to reveal the required subquests.</div>`;

  let special = '';
  if (quest.specialPanel === 'budget-guide' && subquestVisible) {
    special = `
      <div class="quest-special">
        <strong>Budgeting examples unlocked</strong>
        <div class="soft">See the budgeting field guide in the sidebar for shared room, roommate split, and solo studio examples while you fill this in.</div>
      </div>
    `;
  }

  if (classId === 'barbarian' && status === 'available') {
    special += `<div class="quest-special"><strong>Barbarian hook:</strong> Starting this quest triggers a 60-second Start Sprint. Touch the task fast for bonus XP.</div>`;
  }
  if (classId === 'rogue' && quest.tags.includes('errand')) {
    special += `<div class="quest-special"><strong>Rogue hook:</strong> This counts for an Errand Run combo if the run is active.</div>`;
  }
  if (classId === 'monk' && quest.tags.includes('routine')) {
    special += `<div class="quest-special"><strong>Monk hook:</strong> Routine steps build Discipline. Three Discipline can rescue a blocked quest.</div>`;
  }

  const blockedReason = entry.status === 'blocked' ? `<div class="blocked-note"><strong>Blocked because:</strong> ${escapeHtml(entry.blockedReason || 'No reason recorded.')} ${entry.blockerType ? `<br /><span class="soft">Blocker type: ${escapeHtml(entry.blockerType)}</span>` : ''}</div>` : '';
  const blockPlan = entry.status === 'blocked' && (entry.blockPlan.smallestStep || entry.blockPlan.support || entry.blockPlan.retryWhen) ? `<div class="waiting-note"><strong>Unblock plan:</strong> ${escapeHtml(entry.blockPlan.smallestStep || 'Name the smallest next move.')} ${entry.blockPlan.support ? `<br /><span class="soft">Support: ${escapeHtml(entry.blockPlan.support)}</span>` : ''} ${entry.blockPlan.retryWhen ? `<br /><span class="soft">Retry: ${escapeHtml(entry.blockPlan.retryWhen)}</span>` : ''}</div>` : '';
  const waitingNote = entry.status === 'waiting' ? `<div class="waiting-note"><strong>Waiting on:</strong> ${escapeHtml(entry.waitingPlan.reason || 'No waiting reason recorded.')} ${entry.waitingPlan.followup ? `<br /><span class="soft">Follow-up move: ${escapeHtml(entry.waitingPlan.followup)}</span>` : ''} ${entry.waitingPlan.retryWhen ? `<br /><span class="soft">Check back: ${escapeHtml(entry.waitingPlan.retryWhen)}</span>` : ''}</div>` : '';
  const momentumNote = entry.bonuses.momentum ? '<div class="bonus-panel">Momentum buff stored: +10 XP on completion. Good. Smash first, philosophize later.</div>' : '';
  const ritualNote = entry.bonuses.ritual ? '<div class="bonus-panel">Ritual Plan mastered: +12 XP on completion. Bureaucracy is weaker when named.</div>' : '';
  const recoveryNote = entry.bonuses.recovery ? '<div class="bonus-panel">Recovery Stance used: the monk dragged this quest back from the swamp.</div>' : '';
  const rogueNote = entry.bonuses.rogueCombo ? '<div class="bonus-panel">Errand Run combo landed: +8 XP synergy on this quest.</div>' : '';
  const lowEnergyNote = entry.bonuses.lowEnergy ? `<div class="bonus-panel">Low-energy version used. A smaller real step has been banked, which still counts because momentum is better than ceremonial self-loathing.</div>` : '';
  const lowEnergy = LOW_ENERGY_OPTIONS[quest.id] ? `<div class="quest-special"><strong>${LOW_ENERGY_OPTIONS[quest.id].title}</strong><div class="soft">${LOW_ENERGY_OPTIONS[quest.id].copy}</div></div>` : '';

  return `
    <li>
      <article class="quest-card ${status.replace(' ', '-')} ${status === 'completed' ? 'complete' : ''} ${status === 'blocked' ? 'blocked' : ''} ${status === 'locked' ? 'locked' : ''}" data-quest-card="${quest.id}">
        <div class="quest-head">
          <div>
            <div class="quest-title">${quest.title}</div>
            <p class="quest-copy">${quest.summary}</p>
          </div>
          <div class="quest-meta">
            <span class="status-label ${status.replace(' ', '-')}">${statusDisplay.icon} ${statusDisplay.label}</span>
            <span class="pill">${grade}</span>
            <span class="pill warning">${quest.completionBonus} XP clear bonus</span>
            <span class="pill">${progress.doneRequired}/${progress.needed} needed</span>
          </div>
        </div>
        <div class="tag-row">${quest.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
        <div class="quest-controls">${renderQuestControls(quest, chapter)}</div>
        ${blockedReason}
        ${blockPlan}
        ${waitingNote}
        ${special}
        ${lowEnergy}
        ${momentumNote}
        ${ritualNote}
        ${recoveryNote}
        ${rogueNote}
        ${lowEnergyNote}
        ${ritualVisible ? `<div class="quest-special"><strong>Ritual Plan</strong><ol class="plan-list">${ritualSteps}</ol></div>` : ''}
        <div>
          <strong>Objective chain</strong>
          <ol class="subquest-list">${subquests}</ol>
        </div>
      </article>
    </li>
  `;
}

function renderQuestControls(quest, chapter) {
  const entry = getQuestEntry(quest.id);
  const status = getQuestStatus(quest, chapter);
  if (status === 'locked') return '<button class="secondary" disabled>Locked</button>';
  if (status === 'available') {
    return `
      <button data-action="start-quest" data-quest-id="${quest.id}">Start quest</button>
      ${LOW_ENERGY_OPTIONS[quest.id] ? `<button class="secondary" data-action="low-energy" data-quest-id="${quest.id}">Low-energy version</button>` : ''}
      <button class="secondary" data-action="waiting-quest" data-quest-id="${quest.id}">Mark waiting</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${quest.id}">Mark blocked</button>
    `;
  }
  if (status === 'blocked') {
    return `
      <button data-action="resume-quest" data-quest-id="${quest.id}">Resume quest</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${quest.id}">Change reason</button>
      <button class="secondary" data-action="waiting-quest" data-quest-id="${quest.id}">Mark waiting</button>
      <button class="danger" data-action="reset-quest" data-quest-id="${quest.id}">Reset steps</button>
    `;
  }
  if (status === 'waiting') {
    return `
      <button data-action="resume-quest" data-quest-id="${quest.id}">Resume quest</button>
      <button class="secondary" data-action="waiting-quest" data-quest-id="${quest.id}">Update waiting plan</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${quest.id}">Mark blocked</button>
      <button class="danger" data-action="reset-quest" data-quest-id="${quest.id}">Reset steps</button>
    `;
  }
  if (status === 'completed') {
    return `<button class="secondary" data-action="review-quest" data-quest-id="${quest.id}">Review chain</button>`;
  }
  return `
    ${LOW_ENERGY_OPTIONS[quest.id] ? `<button class="secondary" data-action="low-energy" data-quest-id="${quest.id}">Low-energy version</button>` : ''}
    <button class="secondary" data-action="waiting-quest" data-quest-id="${quest.id}">Mark waiting</button>
    <button class="secondary" data-action="block-quest" data-quest-id="${quest.id}">Mark blocked</button>
    <button class="danger" data-action="reset-quest" data-quest-id="${quest.id}">Reset steps</button>
  `;
}

function renderClassPanel() {
  const list = document.getElementById('classList');
  const chosen = CLASS_DEFS.find((item) => item.id === state.classId) || null;
  list.innerHTML = CLASS_DEFS.map((cls) => `
    <li class="class-choice ${cls.id === state.classId ? 'active' : ''}">
      <label>
        <input type="radio" name="classId" value="${cls.id}" ${cls.id === state.classId ? 'checked' : ''} />
        <span>
          <span class="class-name"><span>${cls.emoji} ${cls.name}</span>${cls.id === state.classId ? '<span class="pill">Active</span>' : ''}</span>
          <span class="soft">${cls.note}</span>
          <span class="class-perk">${cls.perk}</span>
        </span>
      </label>
    </li>
  `).join('');
  document.getElementById('classNote').innerHTML = chosen
    ? `<strong>${chosen.emoji} ${chosen.name}</strong><br /><span class="soft">${chosen.perk}</span>`
    : '<strong>No class chosen yet.</strong><br /><span class="soft">Pick a class in setup or here in the sidebar. No build, no glorious perk.</span>';
  document.getElementById('classPill').textContent = chosen ? chosen.name : 'Choose a class';
  document.getElementById('classConsole').innerHTML = chosen
    ? renderClassConsole(chosen)
    : '<strong>Class console</strong><div class="soft">Choose a class to unlock the perk console and class-specific advantages.</div>';
  deps.bindClassEvents();
}

function renderClassConsole(chosen) {
  if (chosen.id === 'barbarian') {
    return `<strong>Barbarian console</strong><div class="soft">Every time you start a quest, the Start Sprint appears automatically. Confirm one physical first action inside 60 seconds to store the Momentum buff.</div>`;
  }
  if (chosen.id === 'rogue') {
    return `
      <strong>Rogue console</strong>
      <div class="soft">Errand Run status: ${state.rogueRun.active ? `active with ${state.rogueRun.completedQuestIds.length} quest(s) chained` : 'inactive'}.</div>
      <div class="class-actions" style="margin-top:10px;">
        ${state.rogueRun.active
          ? '<button class="warning" id="endErrandRun">End Errand Run</button>'
          : '<button id="startErrandRun">Start Errand Run</button>'}
      </div>
    `;
  }
  if (chosen.id === 'wizard') {
    return `<strong>Wizard console</strong><div class="soft">Admin, work, budget, and housing quests now reveal Ritual Plans. Complete the prep ritual before diving in to earn bonus XP.</div>`;
  }
  const blockedOptions = CHAPTERS.flatMap((chapter) => chapter.quests).filter((quest) => getQuestEntry(quest.id).status === 'blocked');
  return `
    <strong>Monk console</strong>
    <div class="soft">Discipline stored: <strong>${state.monk.discipline}</strong>. Earn it by completing routine subquests. Spend 3 to invoke Recovery Stance on one blocked quest.</div>
    <div class="class-actions" style="margin-top:10px;">
      <button ${state.monk.discipline < 3 || blockedOptions.length === 0 ? 'class="secondary" disabled' : ''} id="useRecoveryStance">Use Recovery Stance</button>
    </div>
  `;
}

function renderBossPanel() {
  const list = document.getElementById('bossList');
  const currentChapter = getCurrentChapter();
  const chaptersToRender = state.campaign.pathMode === 'guided' && !state.settings.showFullMap
    ? CHAPTERS.filter((chapter) => chapter.id === currentChapter.id)
    : CHAPTERS;
  const html = chaptersToRender.map((chapter) => {
    const boss = getBossForChapter(chapter);
    const entry = state.bosses[boss.id];
    const status = getBossStatus(chapter);
    const statusDisplay = getStatusDisplay(status);
    const revealed = isBossRevealed(chapter);
    const subquests = revealed ? boss.subquests.map((sub) => {
      const checked = !!entry.subquests[sub.id];
      return `
        <li class="subquest-item ${checked ? 'done' : ''}">
          <label>
            <input type="checkbox" data-boss-id="${boss.id}" data-boss-subquest-id="${sub.id}" ${checked ? 'checked' : ''} ${status === 'completed' ? 'disabled' : ''} />
            <span>
              <strong>${sub.title}</strong><br />
              <span class="soft">Required boss objective</span>
            </span>
            <span class="subquest-xp">${sub.xp} XP</span>
          </label>
        </li>
      `;
    }).join('') : '<div class="blocked-note">Hidden until enough quest progress is made in this chapter.</div>';

    return `
      <li>
        <article class="boss-card ${status === 'completed' ? 'complete' : ''}">
          <div class="boss-head">
            <div>
              <div class="title-chip">${getChapterGlyph(chapter)} Chapter ${chapter.level} boss</div>
              <div class="boss-title" style="margin-top:8px;">☠️ ${boss.title}</div>
              <p class="boss-copy">${revealed ? boss.summary : 'Somewhere ahead, a boss waits behind the mist and bad adult decisions.'}</p>
            </div>
            <div class="boss-meta">
              <span class="status-label ${status.replace(' ', '-')}">${statusDisplay.icon} ${statusDisplay.label}</span>
              <span class="pill danger">${boss.completionBonus} XP clear bonus</span>
            </div>
          </div>
          ${revealed ? `<div class="boss-intro">Boss unlock rule met in <strong>${chapter.title}</strong>. Clear all objectives and the chapter can close.</div>` : ''}
          ${revealed ? `<div class="boss-controls">${renderBossControls(chapter, boss)}</div>` : ''}
          ${entry.status === 'blocked' ? `<div class="blocked-note"><strong>Blocked because:</strong> ${escapeHtml(entry.blockedReason || 'No reason recorded.')} ${entry.blockerType ? `<br /><span class="soft">Blocker type: ${escapeHtml(entry.blockerType)}</span>` : ''}</div>` : ''}
          ${entry.status === 'blocked' && (entry.blockPlan?.smallestStep || entry.blockPlan?.support || entry.blockPlan?.retryWhen) ? `<div class="waiting-note"><strong>Unblock plan:</strong> ${escapeHtml(entry.blockPlan.smallestStep || 'Name the smallest next move.')} ${entry.blockPlan.support ? `<br /><span class="soft">Support: ${escapeHtml(entry.blockPlan.support)}</span>` : ''} ${entry.blockPlan.retryWhen ? `<br /><span class="soft">Retry: ${escapeHtml(entry.blockPlan.retryWhen)}</span>` : ''}</div>` : ''}
          <ol class="subquest-list">${subquests}</ol>
        </article>
      </li>
    `;
  }).join('');
  list.innerHTML = html;
  document.getElementById('bossPill').textContent = `${CHAPTERS.filter((chapter) => getBossStatus(chapter) !== 'completed').length} threat(s) remain`;
  deps.bindBossEvents();
}

function renderBossControls(chapter, boss) {
  const status = getBossStatus(chapter);
  if (status === 'available') {
    return `
      <button data-action="start-boss" data-chapter-id="${chapter.id}">Start boss quest</button>
      <button class="secondary" data-action="block-boss" data-chapter-id="${chapter.id}">Mark blocked</button>
    `;
  }
  if (status === 'blocked') {
    return `
      <button data-action="resume-boss" data-chapter-id="${chapter.id}">Resume boss</button>
      <button class="secondary" data-action="block-boss" data-chapter-id="${chapter.id}">Change reason</button>
      <button class="danger" data-action="reset-boss" data-chapter-id="${chapter.id}">Reset boss</button>
    `;
  }
  if (status === 'completed') {
    return `<button class="secondary" disabled>Boss defeated</button>`;
  }
  return `
    <button class="secondary" data-action="block-boss" data-chapter-id="${chapter.id}">Mark blocked</button>
    <button class="danger" data-action="reset-boss" data-chapter-id="${chapter.id}">Reset boss</button>
  `;
}

function renderRewardPanel() {
  const list = document.getElementById('rewardTrack');
  const completed = getCompletedQuestCount();
  list.innerHTML = REWARDS.map((reward) => {
    const unlocked = completed >= reward.at;
    return `
      <li>
        <article class="reward-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="reward-head">
            <div>
              <div class="title-chip">${unlocked ? '✨ Loot unlocked' : '🔒 Locked reward'}</div>
              <div class="reward-title" style="margin-top:8px;">🎁 ${reward.title}</div>
            </div>
            <span class="status-label ${unlocked ? 'completed' : 'locked'}">${unlocked ? '✓ Unlocked' : '🔒 Locked'}</span>
          </div>
          <div class="reward-copy">${reward.copy}</div>
          <div class="soft">Unlocks at ${reward.at} main quests cleared.</div>
        </article>
      </li>
    `;
  }).join('');
  const unlockedCount = REWARDS.filter((reward) => completed >= reward.at).length;
  document.getElementById('rewardPill').textContent = unlockedCount ? `${unlockedCount} reward tier(s) unlocked` : 'Rewards locked';
}

function renderRescuePanel() {
  document.getElementById('rescueList').innerHTML = RESCUE_ITEMS.map((item) => `
    <li>
      <details class="rescue-card">
        <summary>${item.title}</summary>
        <p class="rescue-copy" style="margin-top:10px;">${item.copy}</p>
      </details>
    </li>
  `).join('');
}

function renderBudgetPanel() {
  document.getElementById('budgetExamples').innerHTML = BUDGET_EXAMPLES.map((example) => `
    <article class="budget-card">
      <div class="budget-head">
        <div class="budget-title">${example.title}</div>
        <span class="budget-total">${example.total}</span>
      </div>
      <ul class="cost-list">
        ${example.items.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </article>
  `).join('');
}

function renderCampaignSetup() {
  const overlay = document.getElementById('campaignSetupOverlay');
  const body = document.getElementById('campaignSetupBody');
  const back = document.getElementById('campaignSetupBack');
  const next = document.getElementById('campaignSetupNext');
  const step = Math.min(state.campaign.step || 0, 2);
  state.campaign.step = step;
  const totalSteps = 3;
  const summaryParts = [
    state.characterName ? `Hero: ${escapeHtml(state.characterName)}` : 'Hero: unnamed',
    getCampaignOrigin()?.title ? `Origin: ${escapeHtml(getCampaignOrigin().title)}` : 'Origin: choose one',
    state.classId ? `Class: ${escapeHtml(CLASS_DEFS.find((item) => item.id === state.classId)?.name || state.classId)}` : 'Class: choose one'
  ];
  const setupSummary = `<div class="quest-special"><strong>Character so far</strong><div class="soft">${summaryParts.join(' • ')}</div></div>`;

  if (state.campaign.complete) {
    overlay.hidden = true;
    document.body.classList.remove('overlay-open');
    return;
  }

  if (overlay.hidden) ctx.lastSetupFocusBeforeDialog = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add('overlay-open');
  document.getElementById('campaignSetupTitle').textContent = 'Forge Your Character — Required Setup';
  document.getElementById('campaignSetupStepCount').textContent = `Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`;
  back.style.visibility = step === 0 ? 'hidden' : 'visible';
  next.textContent = step >= totalSteps - 1 ? 'Begin Chapter 1' : 'Next';

  if (step === 0) {
    body.innerHTML = `
      <div class="setup-grid">
        ${setupSummary}
        <div class="field-stack">
          <label class="field-label" for="setupCharacterName">What is your hero called?</label>
          <input class="text-input" id="setupCharacterName" type="text" maxlength="60" placeholder="Unnamed Hero" value="${escapeAttr(state.characterName || '')}" />
          <div class="setup-copy">Name them, then let action fill in the rest.</div>
        </div>
        <div class="setup-copy">Choose the current situation that feels closest. It guides the tone, not your fate.</div>
        <ul class="setup-choice-list">${CAMPAIGN_ORIGINS.map((item) => `<li><button type="button" class="setup-choice ${state.campaign.origin === item.id ? 'active' : ''}" data-setup-choice="origin" data-setup-value="${item.id}"><div class="setup-choice-title">${item.title}</div><div class="setup-copy">${item.copy}</div></button></li>`).join('')}</ul>
      </div>
    `;
    body.querySelector('#setupCharacterName').focus();
    body.querySelector('#setupCharacterName').addEventListener('input', (event) => {
      state.characterName = event.target.value;
    });
  } else if (step === 1) {
    body.innerHTML = `<div class="setup-grid">${setupSummary}<div class="setup-copy">Choose the playstyle that helps you win most consistently.</div><ul class="setup-choice-list">${CLASS_DEFS.map((cls) => `<li><button type="button" class="setup-choice ${state.classId === cls.id ? 'active' : ''}" data-setup-choice="classId" data-setup-value="${cls.id}"><div class="setup-choice-title">${cls.emoji} ${cls.name}</div><div class="setup-copy">${cls.note}</div><div class="setup-copy"><strong>How you win:</strong> ${cls.perk}</div></button></li>`).join('')}</ul></div>`;
  } else {
    body.innerHTML = `<div class="setup-grid">${setupSummary}<div class="setup-copy">Pick the reason this campaign matters, then choose one tiny proof action.</div><ul class="setup-choice-list">${CAMPAIGN_MOTIVATIONS.map((item) => `<li><button type="button" class="setup-choice ${state.campaign.motivation === item.id ? 'active' : ''}" data-setup-choice="motivation" data-setup-value="${item.id}"><div class="setup-choice-title">${item.title}</div><div class="setup-copy">${item.copy}</div></button></li>`).join('')}</ul><div class="setup-copy">Choose one tiny proof action. It does not need to be heroic. It needs to be real.</div><ul class="setup-choice-list">${CAMPAIGN_FIRST_PROOFS.map((item) => `<li><button type="button" class="setup-choice ${state.campaign.firstProof === item.id ? 'active' : ''}" data-setup-choice="firstProof" data-setup-value="${item.id}"><div class="setup-choice-title">${item.title}</div><div class="setup-copy">${item.copy}</div></button></li>`).join('')}</ul></div>`;
  }

  body.querySelectorAll('[data-setup-choice]').forEach((node) => {
    node.addEventListener('click', () => {
      const field = node.dataset.setupChoice;
      const value = node.dataset.setupValue;
      if (field === 'classId') state.classId = value;
      else state.campaign[field] = value;
      renderCampaignSetup();
    });
  });

  if (step !== 0) {
    const preferred = body.querySelector('.setup-choice.active') || body.querySelector('[data-setup-choice]') || next;
    if (preferred) preferred.focus();
  }
}

function renderSectionCollapseStates() {
  const sections = [
    ['bosses', 'Bosses', 'bossPanelBody', 'toggleBossSection'],
    ['rewards', 'Rewards', 'rewardPanelBody', 'toggleRewardSection'],
    ['rescue', 'Rescue kit', 'rescuePanelBody', 'toggleRescueSection'],
    ['budget', 'Budget guide', 'budgetPanelBody', 'toggleBudgetSection']
  ];

  sections.forEach(([key, label, bodyId, buttonId]) => {
    const body = document.getElementById(bodyId);
    const button = document.getElementById(buttonId);
    const collapsed = !!state.settings.collapsedSections[key];
    body.classList.toggle('is-collapsed', collapsed);
    button.setAttribute('aria-expanded', String(!collapsed));
    button.textContent = window.innerWidth <= 720 ? (collapsed ? 'Show' : 'Hide') : (collapsed ? `Show ${label}` : `Hide ${label}`);
  });
}


  return {
    renderAll,
    renderHeader,
    renderJourney,
    renderMainQuest,
    renderQuestLog,
    renderSupportPanel,
    renderIdentityPanel,
    renderQuestCard,
    renderQuestControls,
    renderClassPanel,
    renderClassConsole,
    renderBossPanel,
    renderBossControls,
    renderRewardPanel,
    renderRescuePanel,
    renderBudgetPanel,
    renderCampaignSetup,
    renderSectionCollapseStates
  };
}
