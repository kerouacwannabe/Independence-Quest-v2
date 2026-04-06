import { useMemo } from 'react';
import { useGameStore } from '../../state/store';
import { getDailyAdvice, getPhaseDescription, VGMMessage } from '../../vgm-content';
import { selectTotalXP, selectLevel, selectTotalCompletions, selectActiveClassBonuses } from '../../state/selectors';

export function AdvisorScreen() {
  const storeState = useGameStore((s) => s.state);
  const setDailyAdviceShown = useGameStore((s) => s.setDailyAdviceShown);

  const message = useMemo(() => getDailyAdvice(storeState), [storeState]);
  const xp = useGameStore(selectTotalXP);
  const level = useGameStore(selectLevel);
  const completions = useGameStore(selectTotalCompletions);
  const bonuses = useGameStore(selectActiveClassBonuses);

  const dayPhase = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17) return 'evening';
    return 'morning';
  }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="screen" style={{ padding: '1rem' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>💡 VGM Advisor</h2>

        {/* Daily Message Card */}
        <div style={{
          padding: '1rem', marginBottom: '1rem', borderRadius: 12,
          background: '#1e293b', border: '1px solid #334155'
        }}>
          <p style={{
            fontSize: '0.7rem', color: '#3b82f6', textTransform: 'uppercase',
            letterSpacing: 0.1, marginBottom: 8
          }}>
            Today's guidance
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#e2e8f0' }}>
            {message?.text ?? "Open your quest log and choose one task. Momentum over perfection."}
          </p>
        </div>

        {/* Stats Card */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap'
        }}>
          {[
            { label: 'Level', value: level.toString(), icon: '⭐' },
            { label: 'XP', value: xp.toString(), icon: '✨' },
            { label: 'Quests', value: completions.toString(), icon: '⚔️' }
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1, minWidth: 80, padding: '0.75rem',
              background: '#1e293b', borderRadius: 10, border: '1px solid #334155',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.3rem' }}>{stat.icon}</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Class Bonuses */}
        {bonuses.length > 0 && (
          <div style={{
            padding: '0.75rem', borderRadius: 10, marginBottom: '1rem',
            background: '#1e293b', border: '1px solid #334155'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Active Bonuses</p>
            {bonuses.map((b, i) => (
              <p key={i} style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 2 }}>• {b}</p>
            ))}
          </div>
        )}

        {/* Day Phase Tip */}
        <div style={{
          padding: '0.75rem', borderRadius: 10,
          background: '#0f172a', border: '1px solid #334155'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 2 }}>{getPhaseDescription(dayPhase)}</p>
        </div>
      </div>
    </div>
  );
}
