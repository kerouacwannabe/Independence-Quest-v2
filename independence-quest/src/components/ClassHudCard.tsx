import { useMemo } from 'react';
import { CHAPTERS } from '../content';
import { selectClassHud, selectPlanningEligibleQuestIds, selectRogueEligibleQuestIds, useGameStore } from '../state/store';

const TONE_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  neutral: { border: '#334155', bg: '#111827', text: '#cbd5e1' },
  info: { border: '#2563eb', bg: '#172554', text: '#bfdbfe' },
  success: { border: '#15803d', bg: '#052e16', text: '#86efac' },
  warning: { border: '#b45309', bg: '#3f1d0d', text: '#fde68a' },
};

export function ClassHudCard() {
  const state = useGameStore((s) => s.state);
  const hud = useMemo(() => selectClassHud(state), [state]);
  if (!hud) return null;

  const classId = state.classId;
  const allQuests = CHAPTERS.flatMap((chapter) => chapter.quests);
  const rogueEligible = selectRogueEligibleQuestIds();
  const planningEligible = selectPlanningEligibleQuestIds();
  const tone = TONE_STYLES[hud.tone] || TONE_STYLES.neutral;

  let detail = '';
  if (classId === 'rogue') {
    detail = `${rogueEligible.length} quests eligible for Errand Run`;
  } else if (classId === 'wizard') {
    const names = (state.wizard?.preparedSpells || []).map((id) => ({
      'reveal-next-move': 'Reveal Next Move',
      'guided-sequence': 'Guided Sequence',
      'simplify-quest': 'Simplify Quest',
    }[id] || id));
    detail = names.length ? names.join(' • ') : `${planningEligible.length} planning-friendly quests available`;
  } else if (classId === 'monk') {
    detail = 'Routine quests bank calm power for rescues';
  } else if (classId === 'barbarian') {
    const activeQuest = allQuests.find((quest) => quest.id === state.barbarian?.activeQuestId);
    detail = activeQuest ? `Active on ${activeQuest.title}` : 'Trigger momentum by starting hard and fast';
  }

  return (
    <section style={{
      margin: '0 0 0.75rem',
      padding: '0.85rem 1rem',
      borderRadius: 14,
      border: `1px solid ${tone.border}`,
      background: tone.bg,
      color: tone.text,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'center'
    }}>
      <div>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Class Status</div>
        <div style={{ fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>{hud.title}</div>
        <div style={{ fontSize: '0.84rem', marginTop: 4 }}>{hud.summary}</div>
        {detail && <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: 4 }}>{detail}</div>}
      </div>
      <div style={{ fontSize: '1.5rem' }}>
        {classId === 'barbarian' ? '🪓' : classId === 'rogue' ? '🗡️' : classId === 'monk' ? '🧘' : '🪄'}
      </div>
    </section>
  );
}
