import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useGameStore, selectUnlockedChapters, selectTotalCompletions } from '../../state/store';
import { CelebrationParticles } from '../../components/CelebrationParticles';
import { CHAPTERS } from '../../content';

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

  const questsById = useMemo(() => {
    const map = new Map<string, any>();
    unlockedChapters.forEach((ch) => {
      ch.quests.forEach((q) => map.set(q.id, q));
    });
    return map;
  }, [unlockedChapters]);

  useEffect(() => {
    if (lastCompleted) {
      const completedQuest = questsById.get(lastCompleted);
      if (completedQuest) {
        setCelebrating({ id: lastCompleted, isBoss: isBossQuest(completedQuest.title) });
        const timer = setTimeout(() => setCelebrating(null), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [lastCompleted, questsById]);

  const expandedData = useMemo(() => {
    if (!expandedQuestId) return null;
    const quest = questsById.get(expandedQuestId);
    const entry = state.quests[expandedQuestId];
    return quest ? { quest, entry } : null;
  }, [expandedQuestId, questsById, state.quests]);

  const allSubquestsDone = useMemo(() => {
    if (!expandedData) return false;
    return expandedData.quest.subquests
      .filter(s => s.required)
      .every(s => expandedData.entry?.subquests?.[s.id]);
  }, [expandedData?.quest.id, expandedData?.entry?.subquests]);

  const chapterQuestLists = useMemo(() => {
    return unlockedChapters.map((chapter) => {
      const sorted = chapter.quests
        .map((quest) => ({
          quest,
          status: state.quests[quest.id]?.status ?? 'available',
        }))
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
      return { chapter, sorted };
    });
  }, [unlockedChapters, state.quests]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {celebrating && <CelebrationParticles intensity={celebrating.isBoss ? 'large' : 'medium'} />}

      {/* Chapter Quest Lists */}
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
                    <button key={quest.id}
                      onClick={() => toggleQuestExpanded(quest.id)}
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

      {/* Fixed-position subquest modal — completely outside quest list DOM */}
      {expandedData && (
        <div
          onClick={() => toggleQuestExpanded(expandedQuestId, 'collapsed')}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'rgba(0,0,0,0.6)',
            padding: '1rem',
            maxHeight: '70vh',
            overflow: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1e293b',
              borderRadius: 16,
              border: '1px solid #3b82f6',
              width: '100%',
              maxWidth: 480,
              padding: '1.1rem',
              boxShadow: '0 0 32px rgba(59,130,246,0.25)',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.05 }}>Quest Details</span>
              <button onClick={() => toggleQuestExpanded(expandedQuestId, 'collapsed')}
                style={{ background: '#334155', border: 'none', borderRadius: 99, width: 24, height: 24, color: '#e2e8f0', fontSize: '0.9rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{expandedData.quest.title}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{expandedData.quest.summary}</p>

            {expandedData.entry?.status === 'completed' ? (
              <div style={{
                padding: '0.75rem', borderRadius: 10,
                background: '#05966922', border: '1px solid #05966944',
                color: '#22c55e', fontWeight: 600, fontSize: '1rem', textAlign: 'center',
                marginBottom: '0.75rem'
              }}>✓ Quest Completed</div>
            ) : (
              <button onClick={() => startQuest(expandedQuestId)}
                style={{
                  width: '100%',
                  padding: '0.75rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: allSubquestsDone ? '#059669' : '#2563eb',
                  color: '#fff', fontWeight: 600, fontSize: '1rem',
                  marginBottom: '0.75rem'
                }}>
                {expandedData.entry?.status === 'started' ? '▶ Resume Quest' : '⚔ Start Quest'}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.05, marginBottom: 4 }}>Subquests</p>
              {expandedData.quest.subquests.map((sub, i) => {
                const done = !!expandedData.entry?.subquests?.[sub.id];
                return (
                  <label key={sub.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem',
                      background: done ? '#05966922' : '#0f172a',
                      borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem',
                      opacity: done ? 0.7 : 1, textDecoration: done ? 'line-through' : 'none'
                    }}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleSubquest(expandedQuestId, sub.id)}
                      style={{ width: 18, height: 18, accentColor: '#059669', flexShrink: 0 }}
                    />
                    <span style={{ color: done ? '#94a3b8' : '#e2e8f0', flex: 1 }}>
                      <span style={{ color: '#64748b', marginRight: 4 }}>{i + 1}.</span>{sub.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
