import { CHAPTERS, useGameStore } from '../../state/store';

export function MapScreen() {
  const state = useGameStore((s) => s.state);

  const currentChapter = (() => {
    for (const chapter of CHAPTERS) {
      const allDone = chapter.quests.every((q) => state.quests[q.id]?.status === 'completed');
      if (!allDone) return chapter;
    }
    return CHAPTERS[0];
  })();

  return (
    <div className="screen-stack">
      <section className="card map-card">
        <p className="eyebrow">Minimap</p>
        <h2>{currentChapter.title}</h2>
        <p>Current position marked, previous chapters trail behind, next regions stay visible enough to feel real without turning the app into a wall of lore.</p>
        <div className="map-path">
          {CHAPTERS.map((chapter) => {
            const completed = chapter.quests.every((quest) => state.quests[quest.id]?.status === 'completed');
            const isCurrent = chapter.id === currentChapter.id;
            return (
              <div key={chapter.id} className={`map-node ${completed ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`}>
                <span className="map-dot" />
                <div>
                  <strong>{chapter.title}</strong>
                  <p>{chapter.journeyTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
