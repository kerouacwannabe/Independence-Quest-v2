import { CHAPTERS, useGameStore, selectNextMove, selectDailyAdvice } from '../../state/store';
import { InstallPromptCard } from '../../components/InstallPromptCard';

export function TodayScreen() {
  const state = useGameStore((s) => s.state);
  const setTab = useGameStore((s) => s.setActiveTab);
  const toggleRogueRunQuest = useGameStore((s) => s.toggleRogueRunQuest);
  const startRogueRun = useGameStore((s) => s.startRogueRun);
  const clearRogueRun = useGameStore((s) => s.clearRogueRun);
  const prepareWizardSpell = useGameStore((s) => s.prepareWizardSpell);
  const nextMove = selectNextMove(state);
  const dailyAdvice = selectDailyAdvice(state);
  const classId = state.classId;
  const CLASS_DEFS = [
    { id: 'barbarian', emoji: '🪓', name: 'Barbarian' },
    { id: 'rogue', emoji: '🗡️', name: 'Rogue' },
    { id: 'wizard', emoji: '📜', name: 'Wizard' },
    { id: 'monk', emoji: '🕯️', name: 'Monk' },
  ];
  const classDef = CLASS_DEFS.find(c => c.id === classId);
  const allQuests = CHAPTERS.flatMap((chapter) => chapter.quests);
  const rogueEligible = allQuests.filter((quest) => {
    const tags = quest.tags || [];
    return tags.some((tag) => ['errand', 'admin', 'household', 'routine', 'communications'].includes(tag));
  });
  const wizardSpells = [
    { id: 'reveal-next-move', title: 'Reveal Next Move', copy: 'Sharpens the guidance card and highlights the best next action.' },
    { id: 'guided-sequence', title: 'Guided Sequence', copy: 'Adds ritual guidance when you start a quest.' },
    { id: 'simplify-quest', title: 'Simplify Quest', copy: 'Automatically starts your next quest in low-energy mode.' },
  ];

  return (
    <div className="screen-stack">
      {nextMove ? (
        <section className="card hero-card" style={{ borderTop: nextMove.type === 'firstProof' ? '3px solid #f59e0b' : nextMove.type === 'availableBoss' ? '3px solid #dc2626' : nextMove.type === 'chapterComplete' ? '3px solid #7c3aed' : '3px solid #3b82f6' }}>
          <p className="eyebrow">{
            nextMove.type === 'firstProof' ? '🔑 First Proof' :
            nextMove.type === 'availableBoss' ? '🐉 Boss' :
            nextMove.type === 'chapterComplete' ? '🏆 Milestone' :
            '⚔️ Next Move'
          }</p>
          <h2>{nextMove.heading}</h2>
          <p>{nextMove.copy}</p>
          <button className="primary-button" onClick={() => {
            if (nextMove.questId || nextMove.bossId) setTab('quests');
          }}>
            {nextMove.button}
          </button>
        </section>
      ) : (
        <section className="card hero-card">
          <p className="eyebrow">All Caught Up</p>
          <h2>Well done</h2>
          <p>All quests in the current chapter are complete. A new boss or chapter awaits.</p>
          <button className="primary-button" onClick={() => setTab('quests')}>View Quests</button>
        </section>
      )}

      {classDef && (
        <section className="card compact-list-card">
          <p className="eyebrow">Your Class</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.5rem' }}>{classDef.emoji}</span>
            <strong>{classDef.name}</strong>
          </div>
          {classId === 'monk' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Breath Beads</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ width: 14, height: 14, borderRadius: 999, display: 'inline-block', background: i < (state.monk?.discipline ?? 0) ? '#22c55e' : '#334155' }} />
                ))}
              </div>
              <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#cbd5e1' }}>Spend 3 beads to rescue a blocked quest.</p>
            </div>
          )}
          {classId === 'rogue' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Route Combo</div>
              {!state.rogueRun?.active ? (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Pick 2–3 eligible quests to bundle into one run.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {rogueEligible.slice(0, 5).map((quest) => {
                      const selected = state.rogueRun?.selectedQuestIds?.includes(quest.id);
                      return (
                        <button key={quest.id} onClick={() => toggleRogueRunQuest(quest.id)} style={{ textAlign: 'left', padding: '0.65rem 0.75rem', borderRadius: 10, border: selected ? '1px solid #3b82f6' : '1px solid #334155', background: selected ? '#1e3a5f' : '#0f172a', color: '#e2e8f0' }}>
                          {quest.title}
                        </button>
                      );
                    })}
                  </div>
                  <button className="primary-button" style={{ marginTop: 10 }} onClick={startRogueRun} disabled={(state.rogueRun?.selectedQuestIds?.length ?? 0) < 2}>Start Errand Run</button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Errand Run active: {(state.rogueRun?.completedQuestIds?.length ?? 0)}/{(state.rogueRun?.selectedQuestIds?.length ?? 0)} cleared</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {(state.rogueRun?.selectedQuestIds ?? []).map((qid) => {
                      const quest = allQuests.find((q) => q.id === qid);
                      const done = state.rogueRun?.completedQuestIds?.includes(qid);
                      return <div key={qid} style={{ padding: '0.6rem 0.75rem', borderRadius: 10, background: done ? '#052e16' : '#0f172a', color: done ? '#86efac' : '#e2e8f0' }}>{done ? '✓ ' : ''}{quest?.title || qid}</div>;
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="primary-button" onClick={() => setTab('quests')}>Open Quests</button>
                    <button className="ghost-button" onClick={clearRogueRun}>Clear</button>
                  </div>
                </>
              )}
            </div>
          )}
          {classId === 'wizard' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Prepared Spells</div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Prepare up to 2 daily spells.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {wizardSpells.map((spell) => {
                  const selected = state.wizard?.preparedSpells?.includes(spell.id);
                  return (
                    <button key={spell.id} onClick={() => prepareWizardSpell(spell.id)} style={{ textAlign: 'left', padding: '0.75rem 0.85rem', borderRadius: 10, border: selected ? '1px solid #7c3aed' : '1px solid #334155', background: selected ? '#3b0764' : '#0f172a', color: '#e2e8f0' }}>
                      <strong>{spell.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>{spell.copy}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="card compact-list-card">
        <p className="eyebrow">VGM Advisor</p>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#e2e8f0' }}>
          {dailyAdvice.message}
        </p>
      </section>

      <section className="card compact-list-card">
        <p className="eyebrow">Quick Tips</p>
        <ul className="mini-list">
          <li><strong>Start</strong> a quest from the quest log</li>
          <li><strong>Check</strong> subquests as you complete them</li>
          <li><strong>Watch</strong> for bosses after enough progress</li>
        </ul>
      </section>

      <InstallPromptCard />
    </div>
  );
}
