import { CLASS_DEFS, CAMPAIGN_FIRST_PROOFS } from '../../content';
import { useGameStore } from '../../state/store';

export function ProfileScreen() {
  const state = useGameStore((s) => s.state);
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
          <div className="inline-card"><strong>First proof</strong><p>{firstProof?.title || 'Not chosen yet'}</p></div>
        </div>
      </section>
    </div>
  );
}
