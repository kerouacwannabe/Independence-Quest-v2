import { useGameStore, CHAPTERS } from '../../state/store';
import { selectCurrentChapter } from '../../state/selectors';

export function TodayScreen() {
  const state = useGameStore((s) => s.state);
  const chapter = useGameStore(selectCurrentChapter);
  const setTab = useGameStore((s) => s.setActiveTab);

  const activeQuest = CHAPTERS.flatMap((c) => c.quests).find((quest) => state.quests[quest.id]?.status === 'started');

  return (
    <div className="screen-stack">
      <section className="card hero-card">
        <p className="eyebrow">Today</p>
        <h2>{activeQuest?.title || chapter.title}</h2>
        <p>{activeQuest?.summary || chapter.intro}</p>
        <div className="pill-row">
          <span className="pill">Chapter {chapter.level}</span>
          <span className="pill">{chapter.quests.filter((q) => state.quests[q.id]?.status === 'completed').length}/{chapter.quests.length} quests cleared</span>
        </div>
        <button className="primary-button" onClick={() => setTab('quests')}>Open quests</button>
      </section>

      <section className="card compact-list-card">
        <p className="eyebrow">Current flow</p>
        <ul className="mini-list">
          {chapter.quests.slice(0, 3).map((quest) => (
            <li key={quest.id}>
              <strong>{quest.title}</strong>
              <span>{state.quests[quest.id]?.status || 'available'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
