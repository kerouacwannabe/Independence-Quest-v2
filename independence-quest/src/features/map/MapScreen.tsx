import { CHAPTERS, selectAvailableBosses, selectCurrentChapter, selectProgressUnlocks, useGameStore } from '../../state/store';

export function MapScreen() {
  const state = useGameStore((s) => s.state);

  const currentChapter = selectCurrentChapter(state) ?? CHAPTERS[0];
  const campaignComplete = state.campaign.complete && !selectCurrentChapter(state);
  const progressUnlocks = selectProgressUnlocks(state);

  const visibleBosses = selectAvailableBosses(state, currentChapter.id);

  return (
    <div className="screen-stack">
      <section className="card map-card">
        <p className="eyebrow">Minimap</p>
        <h2>{currentChapter.title}</h2>
        <p>Current position marked, previous chapters trail behind, next regions stay visible enough to feel real without turning the app into a wall of lore.</p>
        <div style={{ marginTop: 10, padding: '0.85rem 1rem', borderRadius: 12, background: '#111827', border: '1px solid #334155' }}>
          <strong style={{ display: 'block', marginBottom: 6 }}>Progress powers unlocked</strong>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: '0.84rem' }}>
            {progressUnlocks.slice(0, 3).map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
        {campaignComplete && (
          <div style={{ marginTop: 12, padding: '0.9rem 1rem', borderRadius: 12, background: '#111827', border: '1px solid #7c3aed' }}>
            <strong>Journey complete</strong>
            <p style={{ marginTop: 6, color: '#cbd5e1', fontSize: '0.86rem' }}>You cleared every chapter and boss. The map has nothing left to hide.</p>
          </div>
        )}
        <div className="map-path">
          {CHAPTERS.map((chapter) => {
            const completed = chapter.quests.every((quest) => state.quests[quest.id]?.status === 'completed');
            const isCurrent = chapter.id === currentChapter.id;
            const chapterBosses = selectAvailableBosses(state, chapter.id);
            const activeBoss = chapterBosses.find((boss) => boss.assigned || boss.status === 'started' || boss.status === 'available');
            return (
              <div key={chapter.id} className={`map-node ${completed ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`}>
                <span className="map-dot" />
                <div>
                  <strong>{chapter.title}</strong>
                  <p>{chapter.journeyTitle ?? chapter.summary}</p>
                  {activeBoss && (
                    <p style={{ marginTop: 4, color: '#fca5a5', fontSize: '0.8rem' }}>
                      🐉 Boss active: {activeBoss.title}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {visibleBosses.length > 0 && (
        <section className="card">
          <p className="eyebrow">Chapter Bosses</p>
          <h3>{currentChapter.title} threats</h3>
          <div className="stack-list">
            {visibleBosses.map((boss) => (
              <article key={boss.id} className="inline-card">
                <strong>{boss.title}</strong>
                <p>{boss.summary}</p>
                <p style={{ color: '#fca5a5', fontSize: '0.8rem' }}>
                  Status: {boss.status}{boss.assigned ? ' • active guardian' : ''}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
