import { useState } from 'react';
import { useGameStore } from '../../state/store';
import { CLASS_DEFS, CAMPAIGN_ORIGINS, CAMPAIGN_MOTIVATIONS, CAMPAIGN_VOWS, CAMPAIGN_FIRST_PROOFS } from '../../content';

const STEPS = ['class', 'first-proof'];

const DEFAULTS = {
  origin: CAMPAIGN_ORIGINS[0]?.id ?? 'overloaded',
  motivation: CAMPAIGN_MOTIVATIONS[2]?.id ?? 'independence',
  vow: CAMPAIGN_VOWS[0]?.id ?? 'show-up',
  firstProof: CAMPAIGN_FIRST_PROOFS[0]?.id ?? 'wake-reset',
};

export function CampaignWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({ classId: '', ...DEFAULTS });
  const [mode, setMode] = useState<'guided' | 'free'>('guided');
  const [characterName, setCharacterName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const startCampaign = useGameStore((s) => s.startCampaign);
  const setCampaignVow = useGameStore((s) => s.setCampaignVow);
  const setCampaignFirstProof = useGameStore((s) => s.setCampaignFirstProof);
  const setCampaignMode = useGameStore((s) => s.setCampaignMode);

  const canNext = step === 0 ? !!draft.classId : !!draft.firstProof;

  const handleStart = () => {
    setCampaignVow(draft.vow);
    setCampaignFirstProof(draft.firstProof);
    setCampaignMode(mode);
    const name = characterName.trim() || undefined;
    startCampaign({ name, classId: draft.classId, origin: draft.origin, motivation: draft.motivation });
  };

  const SelectCard = ({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) => (
    <button
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      style={{
        display: 'block', width: '100%', padding: '0.85rem', marginBottom: 8,
        background: selected ? '#1e3a5f' : '#1e293b',
        border: selected ? '1px solid #3b82f6' : '1px solid #334155',
        borderRadius: 10, color: '#e2e8f0', textAlign: 'left', cursor: 'pointer',
        transition: 'border-color 0.15s'
      }}
    >{children}</button>
  );

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', background: 'linear-gradient(180deg, #0a0e14 0%, #1a1025 100%)', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 420, textAlign: 'center', width: '100%' }}>
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: 0.1 }}>INDEPENDENCE QUEST</p>
        <h1 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0.75rem' }}>Claim Your Own Keep</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Pick a class, pick a first move, and start. That’s the whole trick.</p>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Step {step + 1} of 2</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: '1.25rem' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: 56, height: 4, borderRadius: 2, background: i <= step ? '#3b82f6' : '#334155' }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 420, width: '100%' }}>
        {step === 0 && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>Choose your class</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Pick a strategy for this phase. It is a play style, not a personality verdict.</p>
            {CLASS_DEFS.map((cls) => (
              <SelectCard key={cls.id} selected={draft.classId === cls.id} onClick={() => setDraft((d) => ({ ...d, classId: cls.id }))}>
                <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>{cls.emoji}</div>
                <strong>{cls.name}</strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>{cls.perk}</p>
              </SelectCard>
            ))}
            <button disabled={!draft.classId} onClick={() => setStep(1)} style={{ width: '100%', padding: '0.95rem', marginTop: 8, background: draft.classId ? '#2563eb' : '#1e293b', border: 'none', borderRadius: 12, color: draft.classId ? '#fff' : '#64748b', fontSize: '1rem', cursor: draft.classId ? 'pointer' : 'default' }}>
              Pick first move →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>Pick your first move</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Choose one tiny win, then start the campaign immediately.</p>
            {CAMPAIGN_FIRST_PROOFS.map((fp) => (
              <SelectCard key={fp.id} selected={draft.firstProof === fp.id} onClick={() => setDraft((d) => ({ ...d, firstProof: fp.id }))}>
                <strong>{fp.title}</strong>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 0' }}>{fp.copy}</p>
              </SelectCard>
            ))}

            <div style={{ marginTop: '0.75rem', padding: '0.85rem', borderRadius: 10, background: '#111827', border: '1px solid #334155' }}>
              <button onClick={() => setShowAdvanced((v) => !v)} style={{ width: '100%', padding: '0.25rem 0', background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', fontWeight: 600 }}>
                {showAdvanced ? 'Hide advanced story setup' : 'Optional: customize your campaign story'}
              </button>
              {showAdvanced && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Origin</label>
                    <select value={draft.origin} onChange={(e) => setDraft((d) => ({ ...d, origin: e.target.value }))} style={inputStyle}>
                      {CAMPAIGN_ORIGINS.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Motivation</label>
                    <select value={draft.motivation} onChange={(e) => setDraft((d) => ({ ...d, motivation: e.target.value }))} style={inputStyle}>
                      {CAMPAIGN_MOTIVATIONS.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Vow</label>
                    <select value={draft.vow} onChange={(e) => setDraft((d) => ({ ...d, vow: e.target.value }))} style={inputStyle}>
                      {CAMPAIGN_VOWS.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Hero name (optional)</label>
                    <input value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="Leave blank for default" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Mode</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['guided', 'free'] as const).map((m) => (
                        <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '0.6rem', background: mode === m ? '#1e3a5f' : '#1e293b', border: mode === m ? '1px solid #3b82f6' : '1px solid #334155', borderRadius: 8, color: '#e2e8f0', cursor: 'pointer', textTransform: 'capitalize' }}>
                          {m === 'guided' ? 'Guided' : 'Free Roam'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button disabled={!canNext} onClick={handleStart} style={{ width: '100%', marginTop: 12, padding: '1rem', background: canNext ? '#059669' : '#1e293b', border: 'none', borderRadius: 12, color: canNext ? '#fff' : '#64748b', fontSize: '1rem', cursor: canNext ? 'pointer' : 'default' }}>
              Start campaign now
            </button>
          </>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: '1.25rem' }}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} style={{ flex: 1, padding: '1rem', background: '#334155', border: 'none', borderRadius: 12, color: '#e2e8f0', fontSize: '1rem', cursor: 'pointer' }}>Back</button>
          )}
          {step < 1 ? (
            <button disabled={!canNext} onClick={() => setStep((s) => s + 1)} style={{ flex: 1, padding: '1rem', background: canNext ? '#2563eb' : '#1e293b', border: 'none', borderRadius: 12, color: canNext ? '#fff' : '#64748b', fontSize: '1rem', cursor: canNext ? 'pointer' : 'default' }}>Next</button>
          ) : (
            <button disabled={!canNext} onClick={handleStart} style={{ flex: 1, padding: '1rem', background: canNext ? '#059669' : '#1e293b', border: 'none', borderRadius: 12, color: canNext ? '#fff' : '#64748b', fontSize: '1rem', cursor: canNext ? 'pointer' : 'default' }}>Begin Campaign ⚔️</button>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  color: '#94a3b8',
  fontSize: '0.78rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 10,
  color: '#e2e8f0',
  fontSize: '1rem',
  boxSizing: 'border-box' as const,
};
