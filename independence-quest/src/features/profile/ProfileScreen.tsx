import { CLASS_DEFS, CAMPAIGN_FIRST_PROOFS } from '../../content';
import { useGameStore } from '../../state/store';
import { ensureNotificationPermission, scheduleReengagementReminder, triggerHaptic } from '../../lib/native';

export function ProfileScreen() {
  const state = useGameStore((s) => s.state);
  const setSetting = useGameStore((s) => s.setSetting);
  const currentClass = CLASS_DEFS.find((item) => item.id === state.classId);
  const firstProof = CAMPAIGN_FIRST_PROOFS.find((item) => item.id === state.campaign.firstProof);

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
