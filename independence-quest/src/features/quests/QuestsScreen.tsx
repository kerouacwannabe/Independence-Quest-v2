import { useState, useEffect, useMemo } from 'react';
import { useGameStore, selectUnlockedChapters } from '../../state/store';
import { CelebrationParticles } from '../../components/CelebrationParticles';

const STATUS_ORDER = { started: 0, available: 1, completed: 2, blocked: 3, waiting: 4 };
function isBossQuest(title: string) { return /boss|dragon|final/i.test(title); }

export function QuestsScreen() {
  const state = useGameStore((s) => s.state);
  const expandedQuestId = useGameStore((s) => s.ui.expandedQuestId);
  const lastCompleted = useGameStore((s) => s.ui.lastCompletedQuestId);
  const toggleQuestExpanded = useGameStore((s) => s.toggleQuestExpanded);
  const startQuest = useGameStore((s) => s.startQuest);
  const toggleSubquest = useGameStore((s) => s.toggleSubquest);

  const unlockedChapters = useMemo(() => selectUnlockedChapters(state), [state]);

  const [celebrating, setCelebrating] = useState<{ id: string; isBoss: boolean } | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (lastCompleted) {
      const allQuests = unlockedChapters.flatMap((c) => c.quests);
      const completedQuest = allQuests.find((q) => q.id === lastCompleted);
      if (completedQuest) {
        setCelebrating({ id: lastCompleted, isBoss: isBossQuest(completedQuest.title) });
        const timer = setTimeout(() => setCelebrating(null), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [lastCompleted, unlockedChapters]);

  const chapterQuestLists = useMemo(() => {
    return unlockedChapters.map((chapter) => {
      const questsWithStatus = chapter.quests.map((quest) => ({
        quest,
        status: state.quests[quest.id]?.status || 'available',
      }));
      questsWithStatus.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
      return { chapter, sorted: questsWithStatus };
    });
  }, [unlockedChapters, state.quests]);

  const expandedData = useMemo(() => {
    if (!expandedQuestId) return null;
    const quest = unlockedChapters.flatMap((c) => c.quests).find((q) => q.id === expandedQuestId);
    return quest ? { quest, entry: state.quests[expandedQuestId] } : null;
  }, [expandedQuestId, unlockedChapters, state.quests]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {celebrating && <CelebrationParticles intensity={celebrating.isBoss ? 'large' : 'medium'} />}

      {expandedData && (
        <div style={{
          background: celebrating ? '#0a2e14' : '#1e293b',
          borderRadius: 12,
          border: `1px solid ${celebrating ? '#22c55e' : '#3b82f6'}`,
          padding: '1.1rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          boxShadow: '0 0 24px rgba(59,130,246,0.15)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.05 }}>Quest Details</span>
            <button onClick={() => toggleQuestExpanded(expandedQuestId, 'collapsed')}
              style={{ background: '#334155', border: 'none', borderRadius: 99, width: 24, height: 24, color: '#e2e8f0', fontSize: '0.9rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{expandedData.quest.title}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>{expandedData.quest.summary}</p>
          </div>

          {expandedData.quest.tags && expandedData.quest.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {expandedData.quest.tags.map((tag) =>
                <span key={tag} style={{ background: '#334155', borderRadius: 99, padding: '2px 8px', fontSize: '0.7rem', color: '#94a3b8' }}>{tag}</span>
              )}
            </div>
          )}

          <button onClick={() => startQuest(expandedQuestId)}
            style={{
              padding: '0.75rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: expandedData.entry?.status === 'started' ? '#2563eb'
                : expandedData.entry?.status === 'completed' ? '#475569' : '#059669',
              color: '#fff', fontWeight: 600, fontSize: '1rem'
            }}>
            {expandedData.entry?.status === 'started' ? '▶ Resume' : expandedData.entry?.status === 'completed' ? '✓ Completed' : '⚔ Start'} Quest
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {expandedData.quest.subquests.map((sub, i) => {
              const done = !!expandedData.entry?.subquests?.[sub.id];
              return (
                <label key={sub.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem',
                  background: done ? '#05966922' : '#0f172a',
                  borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem',
                  opacity: done ? 0.7 : 1, textDecoration: done ? 'line-through' : 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleSubquest(expandedQuestId, sub.id)}
                    style={{ width: 16, height: 16, accentColor: '#059669', flexShrink: 0 }}
                  />
                  <span style={{ color: done ? '#94a3b8' : '#e2e8f0' }}>
                    <span style={{ color: '#64748b', marginRight: 4 }}>{i + 1}.</span>{sub.title}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {chapterQuestLists.map(({ chapter, sorted }) => {
        const collapsed = collapsedChapters[chapter.id];
        const completedCount = sorted.filter((q) => q.status === 'completed').length;
        const totalCount = chapter.quests.length;
        const isComplete = completedCount >= totalCount;

        return (
          <div key={chapter.id} style={{ background: '#111827', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden', position: 'relative' }}>
            <button
              onClick={() => setCollapsedChapters((p) => ({ ...p, [chapter.id]: !p[chapter.id] }))}
              disabled={isComplete}
              style={{
                width: '100%', padding: '0.85rem 1rem', background: collapsed ? undefined : '#1e293b',
                border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                color: isComplete ? '#64748b' : '#e2e8f0', cursor: isComplete ? 'default' : 'pointer', textAlign: 'left'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {isComplete ? (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, width: 40,
                    background: '#059669', borderRadius: '0 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                  }}>🔒</div>
                ) : null}
              </div>
              <div style={{ marginRight: isComplete ? 40 : 0 }}>
                <span style={{ color: '#94a3b8', fontSize: '0.65rem', letterSpacing: 0.05, textTransform: 'uppercase' }}>Chapter {chapter.level}</span>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{chapter.title}</div>
                <span style={{ fontSize: '0.7rem', color: isComplete ? '#22c55e' : '#3b82f6' }}>{completedCount}/{totalCount} cleared {isComplete ? '✅' : ''}</span>
              </div>
              {!isComplete && <span style={{ color: '#94a3b8', fontSize: '1.2rem' }}>{collapsed ? '▶' : '▼'}</span>}
            </button>

            {!collapsed && !isComplete && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0.5rem' }}>
                {sorted.map(({ quest, status }) => {
                  const isExpanded = expandedQuestId === quest.id;
                  const statusColor = status === 'completed' ? '#22c55e' : status === 'started' ? '#f59e0b' : '#94a3b8';
                  const isBoss = isBossQuest(quest.title);
                  return (
                    <button key={quest.id} onClick={() => toggleQuestExpanded(quest.id)}
                      style={{
                        width: '100%', padding: '0.65rem 1rem',
                        background: isExpanded ? '#0f172a' : 'transparent',
                        border: 'none', borderTop: isBoss ? '2px solid #dc2626' : '1px solid #1e293b',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: isBoss ? '#fca5a5' : '#e2e8f0',
                        cursor: 'pointer', textAlign: 'left'
                      }}>
                      <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isBoss && <span>🐉</span>}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.55rem', color: statusColor, fontWeight: 600, textTransform: 'uppercase' }}>{status}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: isBoss ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quest.title}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '1.1rem', flexShrink: 0 }}>{isExpanded ? '−' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {celebrating && (
        <div style={{
          position: 'fixed', top: '20%', left: 0, right: 0, zIndex: 1001,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: celebrating.isBoss ? '1.6rem' : '1.1rem', fontWeight: 700,
            color: celebrating.isBoss ? '#fbbf24' : '#22c55e',
            textShadow: celebrating.isBoss ? '0 0 20px #f59e0b' : '0 0 10px #059669',
            animation: 'bounceIn 0.5s ease-out'
          }}>
            {celebrating.isBoss ? '⚔️ BOSS DEFEATED! ⚔️' : '✅ Quest Complete!'}
          </div>
          {celebrating.isBoss && (
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', animation: 'fadeUp 0.7s ease-out' }}>
              The path to independence grows clearer...
            </div>
          )}
        </div>
      )}
    </div>
  );
}