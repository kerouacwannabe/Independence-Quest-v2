import { CHAPTERS, useGameStore } from '../../state/store';

export function QuestsScreen() {
  const state = useGameStore((s) => s.state);
  const expandedQuestId = useGameStore((s) => s.ui.expandedQuestId);
  const toggleQuestExpanded = useGameStore((s) => s.toggleQuestExpanded);
  const startQuest = useGameStore((s) => s.startQuest);
  const toggleSubquest = useGameStore((s) => s.toggleSubquest);

  return (
    <div className="screen-stack">
      {CHAPTERS.map((chapter) => (
        <section key={chapter.id} className="screen-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Chapter {chapter.level}</p>
              <h2>{chapter.title}</h2>
            </div>
          </div>
          <div className="quest-grid">
            {chapter.quests.map((quest) => {
              const entry = state.quests[quest.id];
              const expanded = expandedQuestId === quest.id;
              return (
                <article key={quest.id} className={`card quest-card ${expanded ? 'is-expanded' : ''}`}>
                  <button className="quest-card-head" onClick={() => toggleQuestExpanded(quest.id)}>
                    <div>
                      <p className="eyebrow">{entry?.status || 'available'}</p>
                      <h3>{quest.title}</h3>
                    </div>
                    <span>{expanded ? '−' : '+'}</span>
                  </button>
                  <p>{quest.summary}</p>
                  <div className="pill-row">
                    {quest.tags.map((tag) => <span key={tag} className="pill">{tag}</span>)}
                  </div>
                  {expanded && (
                    <div className="quest-details">
                      <button className="primary-button" onClick={() => startQuest(quest.id)}>{entry?.status === 'started' ? 'Resume' : 'Start'} quest</button>
                      <ul className="checklist">
                        {quest.subquests.map((sub) => (
                          <li key={sub.id}>
                            <label>
                              <input type="checkbox" checked={!!entry?.subquests?.[sub.id]} onChange={() => toggleSubquest(quest.id, sub.id)} />
                              <span>{sub.title}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
