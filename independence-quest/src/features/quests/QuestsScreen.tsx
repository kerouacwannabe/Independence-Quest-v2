import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import { useGameStore, selectAvailableBosses, selectUnlockedChapters } from '../../state/store';
import { CelebrationParticles } from '../../components/CelebrationParticles';

const STATUS_ORDER = { started: 0, advanced: 1, available: 2, completed: 3, blocked: 4, waiting: 5 };
function isBossQuest(title: string) { return /boss|dragon|final/i.test(title); }

function ExpandedQuestScreen({
  questId, onBack,
  quest, entry, toggleSubquest, startQuest, toggleQuestLowEnergy, setQuestBlocked, setQuestWaiting, resumeQuestFlow
}: {
  questId: string;
  onBack: () => void;
  quest: any;
  entry: any;
  toggleSubquest: (questId: string, subId: string) => void;
  startQuest: (questId: string) => void;
  toggleQuestLowEnergy: (questId: string) => void;
  setQuestBlocked: (questId: string, payload: { blockedReason: string; blockerType: string; smallestStep: string; support: string; retryWhen: string }) => void;
  setQuestWaiting: (questId: string, payload: { reason: string; followup: string; retryWhen: string }) => void;
  resumeQuestFlow: (questId: string) => void;
}) {
  const classId = useGameStore((s) => s.state.classId);
  const monk = useGameStore((s) => s.state.monk);
  const firstStrike = useGameStore((s) => s.state.barbarian);
  const questStarterQuestId = useGameStore((s) => s.ui.questStarterQuestId);
  const dismissQuestStarter = useGameStore((s) => s.dismissQuestStarter);
  const confirmBarbarianFirstStrike = useGameStore((s) => s.confirmBarbarianFirstStrike);
  const dismissBarbarianFirstStrike = useGameStore((s) => s.dismissBarbarianFirstStrike);
  const rescueBlockedQuestWithDiscipline = useGameStore((s) => s.rescueBlockedQuestWithDiscipline);
  const [sheet, setSheet] = useState<null | 'blocked' | 'waiting'>(null);
  const [blockedReason, setBlockedReason] = useState(entry?.blockedReason || '');
  const [blockerType, setBlockerType] = useState(entry?.blockerType || '');
  const [smallestStep, setSmallestStep] = useState(entry?.blockPlan?.smallestStep || '');
  const [support, setSupport] = useState(entry?.blockPlan?.support || '');
  const [blockRetryWhen, setBlockRetryWhen] = useState(entry?.blockPlan?.retryWhen || '');
  const [waitingReason, setWaitingReason] = useState(entry?.waitingPlan?.reason || '');
  const [followup, setFollowup] = useState(entry?.waitingPlan?.followup || '');
  const [waitingRetryWhen, setWaitingRetryWhen] = useState(entry?.waitingPlan?.retryWhen || '');
  const blockerSuggestions: Record<string, { smallestStep: string; support: string }> = {
    'No energy': { smallestStep: 'Do the tiniest possible version for 5 minutes.', support: 'Switch to low energy mode.' },
    'Missing item': { smallestStep: 'Get or stage the missing item.', support: 'Create a quick errand or reminder.' },
    'Need help': { smallestStep: 'Write the exact ask in one sentence.', support: 'Text or ping the person now.' },
    'Too big/confusing': { smallestStep: 'Rewrite this as one concrete first action.', support: 'Split it into smaller subquests.' },
    'Waiting on reply': { smallestStep: 'Set a follow-up date and move on.', support: 'Draft the follow-up message now.' },
  };
  const waitingSuggestions: Record<string, { followup: string; retryWhen: string }> = {
    'Waiting on reply': { followup: 'Send a concise follow-up.', retryWhen: 'Tomorrow morning' },
    'Need approval': { followup: 'Ask for approval with a deadline.', retryWhen: 'In 2 days' },
    'Need delivery/item': { followup: 'Check status or shipping.', retryWhen: 'When tracking updates' },
    'Need meeting/time': { followup: 'Propose two concrete times.', retryWhen: 'Tomorrow afternoon' },
  };
  const rescuePresets = [
    { label: 'Shrink it', reason: 'Too big/confusing', blockerType: 'scope', smallestStep: 'Reduce this to the smallest meaningful next action.', support: 'Split into a smaller subquest.', retryWhen: 'Later today' },
    { label: 'Ask for help', reason: 'Need help', blockerType: 'support', smallestStep: 'Write the exact ask in one sentence.', support: 'Send the ask to a human now.', retryWhen: 'After reply' },
    { label: 'Use low-energy', reason: 'No energy', blockerType: 'energy', smallestStep: 'Do the 5-minute version only.', support: 'Switch to low-energy route.', retryWhen: 'Tonight' },
    { label: 'Follow up', reason: 'Waiting on reply', blockerType: 'waiting', smallestStep: 'Draft a concise follow-up message.', support: 'Schedule a check-in.', retryWhen: 'Tomorrow morning' },
    { label: 'Park it', reason: 'Need meeting/time', blockerType: 'timing', smallestStep: 'Set a future follow-up slot and move on.', support: 'Revisit when the calendar opens.', retryWhen: 'Tomorrow afternoon' },
  ];
  const allRequiredDone = quest.subquests
    .filter((s: any) => s.required)
    .every((s: any) => entry?.subquests?.[s.id]);
  const firstRequired = quest.subquests.find((s: any) => s.required) ?? quest.subquests[0];

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#0a0e14', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#1e293b', borderBottom: '1px solid #334155', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={onBack}
          style={{
            padding: '0.5rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: '#334155', color: '#fff', fontWeight: 600, fontSize: '0.9rem'
          }}>
          ← Back
        </button>
        <button onClick={() => {
          startQuest(questId);
        }}
          style={{
            padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: allRequiredDone ? '#059669' : '#2563eb',
            color: '#fff', fontWeight: 600, fontSize: '0.95rem'
          }}>
          {entry?.status === 'started' ? '▶ Resume' : '⚔ Start'}
        </button>
        <button onClick={() => toggleQuestLowEnergy(questId)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer', background: entry?.bonuses?.lowEnergy ? '#7c3aed' : '#475569', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
          {entry?.bonuses?.lowEnergy ? 'Low Energy ✓' : 'Low Energy'}
        </button>
        <button onClick={() => setSheet('blocked')}
          style={{ padding: '0.5rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#92400e', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
          Blocked
        </button>
        <button onClick={() => setSheet('waiting')}
          style={{ padding: '0.5rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#1d4ed8', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
          Waiting
        </button>
        {(entry?.status === 'blocked' || entry?.status === 'waiting') && (
          <button onClick={() => resumeQuestFlow(questId)}
            style={{ padding: '0.5rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#059669', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
            Resume Flow
          </button>
        )}
      </div>

      {/* Subquests */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>{quest.title}</h2>
        <p style={{ color: '#94a3b8' }}>{quest.summary}</p>

        {classId === 'barbarian' && firstStrike?.activeQuestId === questId && !firstStrike?.completedAt && (firstStrike?.expiresAt ?? 0) > Date.now() && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 10, background: '#3f1d0d', border: '1px solid #b45309' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>🪓 First Strike</div>
            <p style={{ color: '#fde68a', marginBottom: 10 }}>Choose one immediate physical action within 60 seconds to trigger Momentum.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Move body to the task',
                'Touch the tool or object',
                'Open the thing and begin'
              ].map((choice) => (
                <button key={choice} onClick={() => confirmBarbarianFirstStrike(questId, choice)} style={{ padding: '0.8rem 0.9rem', borderRadius: 10, border: '1px solid #b45309', background: '#78350f', color: '#fff', textAlign: 'left', cursor: 'pointer' }}>
                  {choice}
                </button>
              ))}
              <button onClick={dismissBarbarianFirstStrike} style={{ padding: '0.65rem 0.9rem', borderRadius: 10, border: 'none', background: '#475569', color: '#fff', cursor: 'pointer' }}>
                Skip for now
              </button>
            </div>
          </div>
        )}

        {entry?.bonuses?.momentum && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: 10, background: '#052e16', border: '1px solid #15803d', color: '#86efac' }}>
            Momentum active. The Barbarian has, against all odds, begun.
          </div>
        )}

        {(entry?.status === 'blocked' || entry?.status === 'waiting') && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 10, background: entry?.status === 'blocked' ? '#451a03' : '#172554', border: '1px solid ' + (entry?.status === 'blocked' ? '#92400e' : '#1d4ed8') }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{entry?.status === 'blocked' ? 'Blocked Plan' : 'Waiting Plan'}</div>
            {entry?.status === 'blocked' ? (
              <>
                <p><strong>Reason:</strong> {entry.blockedReason || 'No reason set'}</p>
                <p><strong>Smallest step:</strong> {entry.blockPlan?.smallestStep || 'None yet'}</p>
                <p><strong>Support:</strong> {entry.blockPlan?.support || 'None yet'}</p>
                <p><strong>Retry when:</strong> {entry.blockPlan?.retryWhen || 'Not set'}</p>
                {classId === 'monk' && (
                  <button onClick={() => rescueBlockedQuestWithDiscipline(questId)} disabled={(monk?.discipline ?? 0) < 3} style={{ marginTop: 10, padding: '0.7rem 0.9rem', borderRadius: 10, border: 'none', background: (monk?.discipline ?? 0) >= 3 ? '#15803d' : '#334155', color: '#fff', cursor: (monk?.discipline ?? 0) >= 3 ? 'pointer' : 'default' }}>
                    Spend 3 Breath Beads to rescue quest
                  </button>
                )}
              </>
            ) : (
              <>
                <p><strong>Reason:</strong> {entry.waitingPlan?.reason || 'No reason set'}</p>
                <p><strong>Follow-up:</strong> {entry.waitingPlan?.followup || 'None yet'}</p>
                <p><strong>Retry when:</strong> {entry.waitingPlan?.retryWhen || 'Not set'}</p>
              </>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '1.5rem' }}>
          {quest.subquests.map((sub: any, i: number) => {
            const done = !!entry?.subquests?.[sub.id];
            return (
              <div
                key={sub.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '0.5rem 0.75rem',
                  background: done ? '#05966922' : '#1e293b',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  opacity: done ? 0.7 : 1,
                  textDecoration: done ? 'line-through' : 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleSubquest(questId, sub.id)}
                  style={{ width: 18, height: 18, accentColor: '#059669', flexShrink: 0, marginTop: 2 }}
                />
                <span style={{ flex: 1 }}>
                  <span style={{ color: '#64748b', marginRight: 6 }}>{i + 1}.</span>
                  <span style={{ color: done ? '#94a3b8' : '#e2e8f0' }}>{sub.title}</span>
                  {sub.resource && (
                    <details style={{ marginTop: 4, marginLeft: 20 }}>
                      <summary style={{ fontSize: '0.75rem', color: '#60a5fa', cursor: 'pointer' }}>💡 Tip</summary>
                      <pre style={{ fontSize: '0.75rem', color: '#cbd5e1', background: '#0f172a', padding: '0.5rem', borderRadius: 6, marginTop: 4, margin: 0, whiteSpace: 'pre-wrap' }}>{sub.resource.text}</pre>
                    </details>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {entry?.status === 'completed' && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 10, background: '#05966922', border: '1px solid #05966944', color: '#22c55e', fontWeight: 600, fontSize: '1rem', textAlign: 'center' }}>
            ✓ Quest Completed
          </div>
        )}

        {questStarterQuestId === questId && entry?.status === 'started' && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 12, background: '#111827', border: '1px solid #3b82f6' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Opening move</div>
            <p style={{ color: '#cbd5e1', marginTop: 0, fontSize: '0.9rem' }}>{firstRequired?.title || 'Take the first required step.'}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => { if (firstRequired) toggleSubquest(questId, firstRequired.id); dismissQuestStarter(); }} style={{ padding: '0.85rem 0.95rem', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                Do the first step now
              </button>
              <button onClick={() => dismissQuestStarter()} style={{ padding: '0.75rem 0.95rem', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontWeight: 600, cursor: 'pointer' }}>
                Not now
              </button>
              <button onClick={() => { toggleQuestLowEnergy(questId); dismissQuestStarter(); }} style={{ padding: '0.75rem 0.95rem', borderRadius: 10, border: '1px solid #7c3aed', background: '#3b0764', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Swap to easier version
              </button>
            </div>
            <button onClick={() => { dismissQuestStarter(); }} style={{ marginTop: 10, padding: '0.55rem 0.75rem', borderRadius: 999, border: 'none', background: 'transparent', color: '#93c5fd', cursor: 'pointer' }}>
              Dismiss
            </button>
          </div>
        )}
      </div>

      {sheet && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.65)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={() => setSheet(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: '#111827', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '1rem 1rem 1.25rem', borderTop: '1px solid #334155', maxHeight: '82dvh', overflow: 'auto' }}>
            <div style={{ width: 48, height: 5, borderRadius: 999, background: '#475569', margin: '0 auto 1rem' }} />
            <h3 style={{ marginTop: 0 }}>{sheet === 'blocked' ? 'Blocked quest plan' : 'Waiting quest plan'}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{sheet === 'blocked' ? 'Capture the blocker and define the smallest next action.' : 'Capture what you are waiting on and what follow-up is needed.'}</p>
            {sheet === 'blocked' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.keys(blockerSuggestions).map((reason) => (
                    <button key={reason} onClick={() => { setBlockedReason(reason); setBlockerType(reason); setSmallestStep(blockerSuggestions[reason].smallestStep); setSupport(blockerSuggestions[reason].support); if (!blockRetryWhen) setBlockRetryWhen('Later today'); }} style={sheetChipStyle(blockedReason === reason)}>{reason}</button>
                  ))}
                </div>
                <input value={blockedReason} onChange={(e) => setBlockedReason(e.target.value)} placeholder='What is blocking this quest?' style={sheetInputStyle} />
                <input value={blockerType} onChange={(e) => setBlockerType(e.target.value)} placeholder='Blocker type: time, energy, admin, fear...' style={sheetInputStyle} />
                <input value={smallestStep} onChange={(e) => setSmallestStep(e.target.value)} placeholder='Smallest next step' style={sheetInputStyle} />
                <input value={support} onChange={(e) => setSupport(e.target.value)} placeholder='Support needed' style={sheetInputStyle} />
                <input value={blockRetryWhen} onChange={(e) => setBlockRetryWhen(e.target.value)} placeholder='Retry when' style={sheetInputStyle} />
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Quick rescues</div>
                  {rescuePresets.map((preset) => (
                    <button key={preset.label} onClick={() => {
                      setBlockedReason(preset.reason);
                      setBlockerType(preset.blockerType);
                      setSmallestStep(preset.smallestStep);
                      setSupport(preset.support);
                      setBlockRetryWhen(preset.retryWhen);
                    }} style={{ padding: '0.7rem 0.85rem', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', textAlign: 'left', cursor: 'pointer' }}>
                      <strong>{preset.label}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>{preset.smallestStep}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => { setQuestBlocked(questId, { blockedReason, blockerType, smallestStep, support, retryWhen: blockRetryWhen }); setSheet(null); }} style={sheetPrimaryButton}>Save blocked plan</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.keys(waitingSuggestions).map((reason) => (
                    <button key={reason} onClick={() => { setWaitingReason(reason); setFollowup(waitingSuggestions[reason].followup); setWaitingRetryWhen(waitingSuggestions[reason].retryWhen); }} style={sheetChipStyle(waitingReason === reason)}>{reason}</button>
                  ))}
                </div>
                <input value={waitingReason} onChange={(e) => setWaitingReason(e.target.value)} placeholder='What are you waiting on?' style={sheetInputStyle} />
                <input value={followup} onChange={(e) => setFollowup(e.target.value)} placeholder='Follow-up action' style={sheetInputStyle} />
                <input value={waitingRetryWhen} onChange={(e) => setWaitingRetryWhen(e.target.value)} placeholder='Check again when' style={sheetInputStyle} />
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Quick rescues</div>
                  <button onClick={() => { setWaitingReason('Waiting on reply'); setFollowup('Send a concise follow-up.'); setWaitingRetryWhen('Tomorrow morning'); }} style={{ padding: '0.7rem 0.85rem', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', textAlign: 'left', cursor: 'pointer' }}><strong>Follow up</strong><div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>Send a concise follow-up.</div></button>
                  <button onClick={() => { setWaitingReason('Need approval'); setFollowup('Ask for approval with a deadline.'); setWaitingRetryWhen('In 2 days'); }} style={{ padding: '0.7rem 0.85rem', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', textAlign: 'left', cursor: 'pointer' }}><strong>Ask for approval</strong><div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>Ask with a deadline.</div></button>
                  <button onClick={() => { setWaitingReason('Need delivery/item'); setFollowup('Check status or shipping.'); setWaitingRetryWhen('When tracking updates'); }} style={{ padding: '0.7rem 0.85rem', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', textAlign: 'left', cursor: 'pointer' }}><strong>Check delivery</strong><div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>Check status or shipping.</div></button>
                </div>
                <button onClick={() => { setQuestWaiting(questId, { reason: waitingReason, followup, retryWhen: waitingRetryWhen }); setSheet(null); }} style={sheetPrimaryButton}>Save waiting plan</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const sheetInputStyle: CSSProperties = {
  width: '100%',
  padding: '0.85rem 0.9rem',
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 10,
  color: '#e2e8f0',
  boxSizing: 'border-box'
};

const sheetPrimaryButton: CSSProperties = {
  width: '100%',
  padding: '0.95rem 1rem',
  background: '#2563eb',
  border: 'none',
  borderRadius: 12,
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
};

const sheetChipStyle = (selected: boolean): CSSProperties => ({
  padding: '0.5rem 0.75rem',
  borderRadius: 999,
  border: selected ? '1px solid #60a5fa' : '1px solid #334155',
  background: selected ? '#1e3a5f' : '#0f172a',
  color: '#e2e8f0',
  cursor: 'pointer',
  fontSize: '0.82rem'
});

export function QuestsScreen() {
  const state = useGameStore((s) => s.state);
  const expandedQuestId = useGameStore((s) => s.ui.expandedQuestId);
  const lastCompleted = useGameStore((s) => s.ui.lastCompletedQuestId);
  const toggleQuestExpanded = useGameStore((s) => s.toggleQuestExpanded);
  const startQuest = useGameStore((s) => s.startQuest);
  const toggleSubquest = useGameStore((s) => s.toggleSubquest);
  const toggleQuestLowEnergy = useGameStore((s) => s.toggleQuestLowEnergy);
  const setQuestBlocked = useGameStore((s) => s.setQuestBlocked);
  const setQuestWaiting = useGameStore((s) => s.setQuestWaiting);
  const resumeQuestFlow = useGameStore((s) => s.resumeQuestFlow);
  const startBoss = useGameStore((s) => s.startBoss);
  const toggleBossSubquest = useGameStore((s) => s.toggleBossSubquest);
  const completeBoss = useGameStore((s) => s.completeBoss);

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

  // Full-screen expanded quest view
  if (expandedQuestId) {
    const quest = questsById.get(expandedQuestId);
    if (!quest) return null;
    const entry = state.quests[expandedQuestId];
    return (
      <ExpandedQuestScreen
        questId={expandedQuestId}
        onBack={() => toggleQuestExpanded(expandedQuestId, 'collapsed')}
        quest={quest}
        entry={entry}
        toggleSubquest={toggleSubquest}
        startQuest={startQuest}
        toggleQuestLowEnergy={toggleQuestLowEnergy}
        setQuestBlocked={setQuestBlocked}
        setQuestWaiting={setQuestWaiting}
        resumeQuestFlow={resumeQuestFlow}
      />
    );
  }

  const chapterQuestLists = unlockedChapters.map((chapter) => {
    const sorted = chapter.quests
      .map((quest) => ({
        quest,
        status: state.quests[quest.id]?.status ?? 'available',
      }))
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    return { chapter, sorted };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {celebrating && <CelebrationParticles intensity={celebrating.isBoss ? 'large' : 'medium'} />}

      {chapterQuestLists.map(({ chapter, sorted }) => {
        const collapsed = collapsedChapters[chapter.id];
        const completedCount = sorted.filter((q) => q.status === 'completed').length;
        const totalCount = chapter.quests.length;
        const requiredToAdvance = chapter.completionRule?.minCompleted ?? totalCount;
        const assignedBossId = state.chapterBosses[chapter.id] ?? chapter.bossPool[0]?.id;
        const bossCleared = assignedBossId ? state.bosses[assignedBossId]?.status === 'completed' : true;
        const chapterReadyForBoss = completedCount >= requiredToAdvance;
        const isComplete = chapterReadyForBoss && bossCleared;

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
              <div style={{ marginRight: isComplete ? 40 : 0 }}>
                <span style={{ color: '#94a3b8', fontSize: '0.65rem', letterSpacing: 0.05, textTransform: 'uppercase' }}>Chapter {chapter.level}</span>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{chapter.title}</div>
                <span style={{ fontSize: '0.7rem', color: isComplete ? '#22c55e' : '#3b82f6' }}>{completedCount}/{requiredToAdvance} core clears needed {isComplete ? '✅' : ''}</span>
                {chapter.completionRule?.label && <div style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: 4 }}>{chapter.completionRule.label}</div>}
                {!bossCleared && chapterReadyForBoss && <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: 4 }}>Boss gate active. Defeat the chapter guardian to advance.</div>}
              </div>
              {isComplete && (
                <div style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0, width: 40,
                  background: '#059669', borderRadius: '0 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>🔒</div>
              )}
              {!isComplete && <span style={{ color: '#94a3b8', fontSize: '1.2rem' }}>{collapsed ? '▶' : '▼'}</span>}
            </button>

            {!collapsed && !isComplete && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0.5rem' }}>
                {sorted.map(({ quest, status }) => {
                  const statusColor = status === 'completed' ? '#22c55e' : status === 'advanced' ? '#38bdf8' : status === 'started' ? '#f59e0b' : '#94a3b8';
                  const statusLabel = status === 'advanced' ? 'advanced' : status;
                  const isBoss = isBossQuest(quest.title);
                  return (
                    <button key={quest.id}
                      onClick={() => toggleQuestExpanded(quest.id)}
                      style={{
                        width: '100%', padding: '0.65rem 1rem',
                        background: 'transparent',
                        border: 'none', borderTop: isBoss ? '2px solid #dc2626' : '1px solid #1e293b',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: isBoss ? '#fca5a5' : '#e2e8f0',
                        cursor: 'pointer', textAlign: 'left'
                      }}>
                      <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isBoss && <span>🐉</span>}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.55rem', color: statusColor, fontWeight: 600, textTransform: 'uppercase' }}>{statusLabel}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: isBoss ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quest.title}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '1.1rem', flexShrink: 0 }}>→</span>
                    </button>
                  );
                })}

                {selectAvailableBosses(state, chapter.id).map((boss) => {
                  const bossEntry = state.bosses[boss.id];
                  const started = bossEntry?.status === 'started';
                  const completed = bossEntry?.status === 'completed';
                  const canFight = bossEntry?.status === 'available' || started;
                  const allDone = boss.subquests.every((sub) => bossEntry?.subquests?.[sub.id]);
                  return (
                    <div key={boss.id} style={{ margin: '0.5rem 0.75rem 0', border: '1px solid #7f1d1d', borderRadius: 10, overflow: 'hidden', background: '#1f1115' }}>
                      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #7f1d1d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <div>
                          <div style={{ color: '#fca5a5', fontWeight: 700 }}>🐉 Special Event: {boss.title}</div>
                          <div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{boss.summary}</div>
                          <div style={{ color: '#fda4af', fontSize: '0.72rem', marginTop: 4 }}>This should feel like a chapter spike, not a bigger checklist.</div>
                        </div>
                        <button
                          onClick={() => {
                            if (!started) startBoss(boss.id);
                            else if (allDone && !completed) completeBoss(boss.id);
                          }}
                          disabled={!canFight || completed}
                          style={{
                            padding: '0.55rem 0.85rem', borderRadius: 8, border: 'none', cursor: completed ? 'default' : 'pointer',
                            background: completed ? '#14532d' : '#b91c1c', color: '#fff', fontWeight: 700, flexShrink: 0
                          }}
                        >
                          {completed ? '✓ Defeated' : started ? (allDone ? 'Finish Boss' : 'Boss Active') : 'Face Boss'}
                        </button>
                      </div>
                      {started && !completed && (
                        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {boss.subquests.map((sub, i) => {
                            const done = !!bossEntry?.subquests?.[sub.id];
                            return (
                              <label key={sub.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: done ? '#94a3b8' : '#e2e8f0', textDecoration: done ? 'line-through' : 'none' }}>
                                <input type="checkbox" checked={done} onChange={() => toggleBossSubquest(boss.id, sub.id)} style={{ marginTop: 2 }} />
                                <span><span style={{ color: '#64748b', marginRight: 6 }}>{i + 1}.</span>{sub.title}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
