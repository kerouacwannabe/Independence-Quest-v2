import { useGameStore } from '../../state/store';
import { CAMPAIGN_VOWS, CAMPAIGN_FIRST_PROOFS } from '../../content';

export function FirstProofScreen() {
  const campaign = useGameStore((s) => s.state.campaign);
  const completeFirstProof = useGameStore((s) => s.completeFirstProof);

  const vow = CAMPAIGN_VOWS.find(v => v.id === campaign.vow);
  const firstProof = CAMPAIGN_FIRST_PROOFS.find(fp => fp.id === campaign.firstProof);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'linear-gradient(180deg, #0a0e14 0%, #1a1025 100%)', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: 0.1 }}>INDEPENDENCE QUEST</p>
        <h1 style={{ fontSize: '1.8rem', margin: '0.25rem 0 1rem' }}>Your Campaign Frame</h1>
        <div style={{ padding: '1.25rem', background: '#1e293b', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid #334155' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>{vow?.title}</p>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{vow?.copy}</p>
        </div>

        <h2 style={{ marginBottom: 4 }}>First Evidence</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>{firstProof?.title}</p>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#cbd5e1' }}>{firstProof?.copy}</p>

        <button
          onClick={completeFirstProof}
          style={{
            width: '100%', padding: '1rem', background: '#059669', border: 'none',
            borderRadius: 12, color: '#fff', fontSize: '1.1rem', cursor: 'pointer',
            fontWeight: 600, boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
          }}
        >
          Evidence collected ✓
        </button>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 8 }}>
          After completing this action, return to the app and continue the experiment.
        </p>
      </div>
    </div>
  );
}
