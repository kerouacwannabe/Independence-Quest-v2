import { useState } from 'react';
import { CHAPTERS, useGameStore } from '../../state/store';

export function QuestsScreen() {
  const state = useGameStore((s) => s.state);
  const expandedQuestId = useGameStore((s) => s.ui.expandedQuestId);
  const toggleQuestExpanded = useGameStore((s) => s.toggleQuestExpanded);
  const startQuest = useGameStore((s) => s.startQuest);
  const toggleSubquest = useGameStore((s) => s.toggleSubquest);

  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {CHAPTERS.map((chapter) => {
        const collapsed = collapsedChapters[chapter.id];
        const completedCount = chapter.quests.filter((q) => state.quests[q.id]?.status === 'completed').length;
        const totalCount = chapter.quests.length;
        const isComplete = completedCount >= totalCount;

        return (
          <div key={chapter.id} style={{ background: '#111827', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <button
              onClick={() => setCollapsedChapters((p) => ({ ...p, [chapter.id]: !p[chapter.id] }))}
              style={{
                width: '100%', padding: '0.85rem 1rem', background: collapsed ? undefined : '#1e293b',
                border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                color: '#e2e8f0', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.65rem', letterSpacing: 0.05, textTransform: 'uppercase' }}>Chapter {chapter.level}</span>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{chapter.title}</div>
                <span style={{ fontSize: '0.7rem', color: isComplete ? '#22c55e' : '#3b82f6' }}>{completedCount}/{totalCount} cleared {isComplete ? '✅' : ''}</span>
              </div>
              <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>{collapsed ? '▶' : '▼'}</span>
            </button>

            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0.5rem' }}>
                {chapter.quests.map((quest) => {
                  const entry = state.quests[quest.id];
                  const expanded = expandedQuestId === quest.id;
                  const status = entry?.status || 'available';
                  const statusColor = status === 'completed' ? '#22c55e' : status === 'started' ? '#f59e0b' : '#94a3b8';

                  return (
                    <button key={quest.id} onClick={() => toggleQuestExpanded(quest.id)}
                      style={{
                        width: '100%', padding: '0.65rem 1rem', background: expanded ? '#0f172a' : 'transparent',
                        border: 'none', borderTop: '1px solid #1e293b',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: '#e2e8f0', cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.55rem', color: statusColor, fontWeight: 600, textTransform: 'uppercase' }}>{status}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quest.title}</span>
                        </div>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '1.1rem', flexShrink: 0 }}>{expanded ? '−' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Expanded quest details — full panel at bottom */}
      {expandedQuestId && (() => {
        for (const chapter of CHAPTERS) {
          const quest = chapter.quests.find((q) => q.id === expandedQuestId);
          if (!quest) continue;
          const entry = state.quests[quest.id] || {};
          return (
            <div key={quest.id} style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #3b82f6', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.05 }}>Chapter {chapter.level} · Quest</div>
                <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem' }}>{quest.title}</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>{quest.summary}</p>
              </div>

              {quest.tags && quest.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {quest.tags.map((tag) => <span key={tag} style={{ background: '#334155', borderRadius: 99, padding: '2px 8px', fontSize: '0.7rem', color: '#94a3b8' }}>{tag}</span>)}
                </div>
              )}

              <button onClick={() => startQuest(quest.id)}
                style={{
                  padding: '0.75rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: entry.status === 'started' ? '#2563eb' : '#059669', color: '#fff', fontWeight: 600, fontSize: '1rem'
                }}>
                {entry.status === 'started' ? '▶ Resume' : '⚔ Start'} Quest
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {quest.subquests.map((sub, i) => (
                  <label key={sub.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem',
                    background: entry.subquests?.[sub.id] ? '#05966922' : '#0f172a',
                    borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={!!entry.subquests?.[sub.id]}
                      onChange={() => toggleSubquest(quest.id, sub.id)}
                      style={{ width: 16, height: 16, accentColor: '#059669', flexShrink: 0 }}
                    />
                    <span style={{ color: entry.subquests?.[sub.id] ? '#e2e8f0' : '#94a3b8' }}>
                      <span style={{ color: '#64748b', marginRight: 4 }}>{i + 1}.</span>{sub.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}