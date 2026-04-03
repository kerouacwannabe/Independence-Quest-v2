import { CHAPTERS } from './store';

export function selectCurrentChapter(store: any) {
  return CHAPTERS.find((chapter, index) => {
    if (index === 0) return !isChapterComplete(store, chapter);
    return isChapterComplete(store, CHAPTERS[index - 1]) && !isChapterComplete(store, chapter);
  }) || CHAPTERS[CHAPTERS.length - 1];
}

export function selectStats(store: any) {
  const completedQuests = CHAPTERS.flatMap((chapter) => chapter.quests).filter((quest) => store.state.quests[quest.id]?.status === 'completed');
  const xp = completedQuests.reduce((sum, quest) => sum + quest.completionBonus, 0);
  return {
    level: Math.min(1 + Math.floor(completedQuests.length / 3), 6),
    xp,
    progress: Math.round((completedQuests.length / CHAPTERS.flatMap((c) => c.quests).length) * 100),
    active: CHAPTERS.flatMap((c) => c.quests).filter((quest) => store.state.quests[quest.id]?.status === 'started').length
  };
}

export function selectNextMove(store: any) {
  if (!store.state.campaign.complete) {
    return {
      type: 'Character creation',
      heading: 'Finish the campaign setup',
      copy: 'Name the hero, lock the motive, then take the first tiny proof action.',
      button: 'Complete setup'
    };
  }
  if (!store.state.campaign.firstProofDone) {
    return {
      type: 'First proof',
      heading: 'Mark the first proof done',
      copy: 'Evidence first. Vibes later.',
      button: 'Mark proof done'
    };
  }
  const active = CHAPTERS.flatMap((chapter) => chapter.quests).find((quest) => store.state.quests[quest.id]?.status === 'started');
  if (active) {
    return { type: 'Resume quest', heading: active.title, copy: active.summary, button: 'Resume quest' };
  }
  const currentChapter = selectCurrentChapter(store);
  const nextQuest = currentChapter.quests.find((quest) => (store.state.quests[quest.id]?.status || 'available') === 'available');
  return nextQuest
    ? { type: 'Start quest', heading: nextQuest.title, copy: nextQuest.summary, button: 'Start next quest' }
    : { type: 'Victory lap', heading: 'Review the road', copy: 'You have chewed through the current chapter.', button: 'Review progress' };
}

export function selectCurrentObjectiveCopy(store: any) {
  const nextMove = selectNextMove(store);
  return `${nextMove.type}: ${nextMove.heading}`;
}

export function isChapterComplete(store: any, chapter: any) {
  return chapter.quests.every((quest: any) => store.state.quests[quest.id]?.status === 'completed');
}
