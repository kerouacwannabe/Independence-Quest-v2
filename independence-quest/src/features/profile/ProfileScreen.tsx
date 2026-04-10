import { CLASS_DEFS, CAMPAIGN_FIRST_PROOFS } from '../../content';
import { useGameStore, selectCurrentChapter } from '../../state/store';
import { ensureNotificationPermission, scheduleReengagementReminder, triggerHaptic } from '../../lib/native';

export function ProfileScreen() {
  const state = useGameStore((s) => s.state);
  const setSetting = useGameStore((s) => s.setSetting);
  const respecClass = useGameStore((s) => s.respecClass);
  const currentClass = CLASS_DEFS.find((item) => item.id === state.classId);
  const firstProof = CAMPAIGN_FIRST_PROOFS.find((item) => item.id === state.campaign.firstProof);
  const currentChapter = selectCurrentChapter(state);
  const campaignComplete = !currentChapter && state.campaign.complete;

  return (
    <div className="screen-stack">
      <section className="card">
        <p className="eyebrow">Profile</p>
        <h2>{state.characterName || 'Unnamed Hero'}</h2>
        <p>{currentClass?.name || 'No class locked yet'}</p>
        <div className="stack-list">
          <div className="inline-card"><strong>Origin</strong><p>{state.campaign.origin || 'Not chosen yet'}</p></div>
          <div className="inline-card"><strong>Motivation</strong><p>{state.campaign.motivation || 'Not chosen yet'}</p></div>
          <div className="inline-card"><strong>First evidence</strong><p>{firstProof?.title || 'Not chosen yet'}</p></div>
          <div className="inline-card"><strong>Current strategy</strong><p>{currentClass ? `${currentClass.name} is your current mode, not a permanent identity.` : 'Choose a class when the campaign begins.'}</p></div>
        </div>
        <div className="stack-list" style={{ marginTop: '0.85rem' }}>
          <strong style={{ fontSize: '0.9rem' }}>Respec strategy</strong>
          <div style={{ display: 'grid', gap: 8 }}>
            {CLASS_DEFS.map((cls) => (
              <button key={cls.id} className="quest-card-head" onClick={() => respecClass(cls.id)} disabled={state.classId === cls.id}>
                <span><strong>{cls.name}</strong><br /><span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>{cls.description}</span></span>
                <span className="pill">{state.classId === cls.id ? 'Current' : 'Swap'}</span>
              </button>
            ))}
          </div>
        </div>
        {campaignComplete && (
          <div style={{ marginTop: '0.9rem', padding: '0.9rem 1rem', borderRadius: 12, background: 'linear-gradient(180deg, #1e1b4b, #111827)', border: '1px solid #7c3aed' }}>
            <strong>Final win unlocked</strong>
            <p style={{ marginTop: 6, color: '#cbd5e1', fontSize: '0.86rem' }}>You finished the campaign. This is the endpoint, not a dangling chapter card.</p>
          </div>
        )}
      </section>

      <section className="card">
        <p className="eyebrow">Mobile polish</p>
        <div className="stack-list">
          <button className="quest-card-head" onClick={() => setSetting('effectsEnabled', !state.settings.effectsEnabled)}>
            <span><strong>Effects + haptics</strong><br /><span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>Make wins feel like wins instead of clerical paperwork.</span></span>
            <span className="pill">{state.settings.effectsEnabled ? 'On' : 'Off'}</span>
          </button>
          <button className="quest-card-head" onClick={async () => { await ensureNotificationPermission(); await scheduleReengagementReminder(); }}>
            <span><strong>Set comeback reminder</strong><br /><span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>Schedules a gentle nudge for tomorrow on native builds.</span></span>
            <span className="pill">Arm</span>
          </button>
          <button className="quest-card-head" onClick={() => triggerHaptic('medium')}>
            <span><strong>Test haptic pulse</strong><br /><span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>Quick evidence the phone can thump when progress lands.</span></span>
            <span className="pill">Test</span>
          </button>
        </div>
      </section>
    </div>
  );
}
