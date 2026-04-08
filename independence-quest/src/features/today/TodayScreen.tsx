import { useGameStore, selectNextMove, selectDailyAdvice } from '../../state/store';
import { InstallPromptCard } from '../../components/InstallPromptCard';

export function TodayScreen() {
  const state = useGameStore((s) => s.state);
  const setTab = useGameStore((s) => s.setActiveTab);
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
