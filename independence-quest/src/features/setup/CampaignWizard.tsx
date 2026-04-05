import { useState } from 'react';
import { useGameStore } from '../../state/store';
import { CLASS_DEFS, CAMPAIGN_ORIGINS, CAMPAIGN_MOTIVATIONS, CAMPAIGN_VOWS, CAMPAIGN_FIRST_PROOFS } from '../../content';

const STEPS = ['class', 'origin', 'motivation', 'vow'];

export function CampaignWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({ classId: '', origin: '', motivation: '', vow: '', firstProof: '' });
  const [mode, setMode] = useState<'guided' | 'free'>('guided');
  const [characterName, setCharacterName] = useState('');
  const startCampaign = useGameStore((s) => s.startCampaign);
  const setCampaignVow = useGameStore((s) => s.setCampaignVow);
  const setCampaignFirstProof = useGameStore((s) => s.setCampaignFirstProof);
  const setCampaignMode = useGameStore((s) => s.setCampaignMode);
  const completeCampaignSetup = useGameStore((s) => s.completeCampaignSetup);

  const canNext = step === 0
    ? !!draft.classId
    : step === 1
      ? !!draft.origin
      : step === 2
        ? !!draft.motivation
        : !!draft.vow && !!draft.firstProof;

  const handleStart = () => {
    // Set vow and firstProof in state, start the campaign
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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'linear-gradient(180deg, #0a0e14 0%, #1a1025 100%)', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 420, textAlign: 'center', width: '100%' }}>
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: 0.1 }}>INDEPENDENCE QUEST</p>
        <h1 style={{ fontSize: '1.8rem', margin: '0.25rem 0 1rem' }}>Claim Your Own Keep</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Step {step + 1} of 4</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: '1.5rem' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: 40, height: 4, borderRadius: 2, background: i <= step ? '#3b82f6' : '#334155' }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 420, width: '100%' }}>
        {step === 0 && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>Choose your class</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>How do you want to tackle reality?</p>
            {CLASS_DEFS.map((cls) => (
              <SelectCard key={cls.id} selected={draft.classId === cls.id} onClick={() => setDraft((d) => ({ ...d, classId: cls.id }))}>
                <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>{cls.emoji}</div>
                <strong>{cls.name}</strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>{cls.perk}</p>
              </SelectCard>
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>What's your situation?</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Where are you starting from?</p>
            {CAMPAIGN_ORIGINS.map((o) => (
              <SelectCard key={o.id} selected={draft.origin === o.id} onClick={() => setDraft((d) => ({ ...d, origin: o.id }))}>
                <strong>{o.title}</strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>{o.copy}</p>
              </SelectCard>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>What drives you?</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Pick your core motivation</p>
            {CAMPAIGN_MOTIVATIONS.map((m) => (
              <SelectCard key={m.id} selected={draft.motivation === m.id} onClick={() => setDraft((d) => ({ ...d, motivation: m.id }))}>
                <strong>{m.title}</strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>{m.copy}</p>
              </SelectCard>
            ))}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
              <label style={{ display: 'block', textAlign: 'center', marginBottom: 8, fontSize: '0.8rem', color: '#94a3b8' }}>Hero name (optional)</label>
              <input value={characterName} onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Leave blank for default"
                style={{ width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: '1rem', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>Make your vow</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>What will you prove to yourself?</p>
            {CAMPAIGN_VOWS.map((v) => (
              <SelectCard key={v.id} selected={draft.vow === v.id} onClick={() => setDraft((d) => ({ ...d, vow: v.id }))}>
                <strong>{v.title}</strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>{v.copy}</p>
              </SelectCard>
            ))}
            <h3 style={{ marginTop: '1.2rem', marginBottom: 4, fontSize: '1rem' }}>Choose your first proof</h3>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Your first action will be...</p>
            {CAMPAIGN_FIRST_PROOFS.map((fp) => (
              <SelectCard key={fp.id} selected={draft.firstProof === fp.id} onClick={() => setDraft((d) => ({ ...d, firstProof: fp.id }))}>
                <strong>{fp.title}</strong>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 0' }}>{fp.copy}</p>
              </SelectCard>
            ))}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
              <p style={{ textAlign: 'center', marginBottom: 8, fontSize: '0.8rem', color: '#94a3b8' }}>Campaign mode</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['guided', 'free'] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    style={{ flex: 1, padding: '0.6rem', background: mode === m ? '#1e3a5f' : '#1e293b', border: mode === m ? '1px solid #3b82f6' : '1px solid #334155', borderRadius: 8, color: '#e2e8f0', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {m === 'guided' ? 'Guided (recommended)' : 'Free Roam'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)}
              style={{ flex: 1, padding: '1rem', background: '#334155', border: 'none', borderRadius: 12, color: '#e2e8f0', fontSize: '1rem', cursor: 'pointer' }}>Back</button>
          )}
          {step < 3 ? (
            <button disabled={!canNext} onClick={() => setStep((s) => s + 1)}
              style={{ flex: 1, padding: '1rem', background: canNext ? '#2563eb' : '#1e293b', border: 'none', borderRadius: 12, color: canNext ? '#fff' : '#64748b', fontSize: '1rem', cursor: canNext ? 'pointer' : 'default' }}>Next</button>
          ) : (
            <button disabled={!canNext} onClick={handleStart}
              style={{ flex: 1, padding: '1rem', background: canNext ? '#059669' : '#1e293b', border: 'none', borderRadius: 12, color: canNext ? '#fff' : '#64748b', fontSize: '1rem', cursor: canNext ? 'pointer' : 'default' }}>Begin Campaign ⚔️</button>
          )}
        </div>
      </div>
    </div>
  );
}
