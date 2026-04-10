import { CHAPTERS, CLASS_DEFS } from '../../content';
import {
  useGameStore,
  selectDailyAdvice,
  selectNextMove,
  selectPlanningEligibleQuestIds,
  selectRogueEligibleQuestIds,
  selectLevel,
  selectTotalXP,
  selectStreaks,
} from '../../state/store';
import { InstallPromptCard } from '../../components/InstallPromptCard';

function findCurrentChapter(state: any) {
  for (const chapter of CHAPTERS) {
    const allDone = chapter.quests.every((quest) => state.quests[quest.id]?.status === 'completed');
    if (!allDone) return chapter;
  }
  return CHAPTERS[CHAPTERS.length - 1];
}

function chapterProgress(state: any, chapter: any) {
  const cleared = chapter.quests.filter((quest: any) => state.quests[quest.id]?.status === 'completed').length;
  const total = chapter.quests.length;
  const percent = total ? Math.round((cleared / total) * 100) : 0;
  return { cleared, total, percent };
}

function nextBossMilestone(chapter: any, cleared: number) {
  const revealAt = chapter.bossRevealAt ?? Math.max(1, chapter.quests.length - 1);
  return {
    revealAt,
    remaining: Math.max(0, revealAt - cleared),
  };
}

export function TodayScreen() {
  const state = useGameStore((s) => s.state);
  const ui = useGameStore((s) => s.ui);
  const setTab = useGameStore((s) => s.setActiveTab);
  const toggleQuestExpanded = useGameStore((s) => s.toggleQuestExpanded);
  const toggleRogueRunQuest = useGameStore((s) => s.toggleRogueRunQuest);
  const startRogueRun = useGameStore((s) => s.startRogueRun);
  const clearRogueRun = useGameStore((s) => s.clearRogueRun);
  const prepareWizardSpell = useGameStore((s) => s.prepareWizardSpell);

  const nextMove = selectNextMove(state);
  const advice = selectDailyAdvice(state);
  const level = selectLevel(state);
  const totalXP = selectTotalXP(state);
  const streaks = selectStreaks(state);

  const classId = state.classId;
  const classDef = CLASS_DEFS.find((c) => c.id === classId);
  const allQuests = CHAPTERS.flatMap((chapter) => chapter.quests);
  const rogueEligibleIds = selectRogueEligibleQuestIds();
  const planningEligibleIds = selectPlanningEligibleQuestIds();
  const rogueEligible = allQuests.filter((quest) => rogueEligibleIds.includes(quest.id));
  const currentChapter = findCurrentChapter(state);
  const progress = chapterProgress(state, currentChapter);
  const boss = nextBossMilestone(currentChapter, progress.cleared);
  const latestToast = ui.toasts?.[0];
  const availableCount = allQuests.filter((quest) => state.quests[quest.id]?.status === 'available').length;
  const completedCount = allQuests.filter((quest) => state.quests[quest.id]?.status === 'completed').length;

  const blockedQuest = allQuests.find((quest) => state.quests[quest.id]?.status === 'blocked');
  const waitingQuest = allQuests.find((quest) => state.quests[quest.id]?.status === 'waiting');
  const activeQuest = allQuests.find((quest) => state.quests[quest.id]?.status === 'started');
  const availableBoss = currentChapter.bosses?.find((b: any) => {
    const entry = state.bosses?.[b.id];
    return entry?.status === 'available' || entry?.status === 'started';
  });

  const hero = (() => {
    if (activeQuest) {
      return {
        eyebrow: 'Resume Adventure',
        title: activeQuest.title,
        copy: 'You already started this run. Pick up the thread before your brain invents twelve reasons not to.',
        cta: 'Resume Quest',
        onClick: () => {
          setTab('quests');
          if (ui.expandedQuestId !== activeQuest.id) toggleQuestExpanded(activeQuest.id);
        },
      };
    }
    if (blockedQuest) {
      return {
        eyebrow: 'Recover the Run',
        title: blockedQuest.title,
        copy: 'This one is blocked. Good. That means we know where the dragon is. Go fix the smallest next thing.',
        cta: 'Unblock Now',
        onClick: () => {
          setTab('quests');
          if (ui.expandedQuestId !== blockedQuest.id) toggleQuestExpanded(blockedQuest.id);
        },
      };
    }
    if (waitingQuest) {
      return {
        eyebrow: 'Follow-up Time',
        title: waitingQuest.title,
        copy: 'You parked this in waiting. Check whether the universe has finally coughed up what you need.',
        cta: 'Check Back In',
        onClick: () => {
          setTab('quests');
          if (ui.expandedQuestId !== waitingQuest.id) toggleQuestExpanded(waitingQuest.id);
        },
      };
    }
    if (availableBoss) {
      return {
        eyebrow: 'Boss Ready',
        title: availableBoss.title,
        copy: 'A chapter threat is active. If you want drama, there it is, gift-wrapped and breathing fire.',
        cta: 'Face Boss',
        onClick: () => setTab('quests'),
      };
    }
    return {
      eyebrow: 'Next Move',
      title: nextMove.title,
      copy: nextMove.copy,
      cta: 'Open Quest Log',
      onClick: () => setTab('quests'),
    };
  })();

  const wizardSpells = [
    { id: 'reveal-next-move', title: 'Reveal Next Move', copy: 'Sharpen the guidance card for your next session.' },
    { id: 'guided-sequence', title: 'Guided Sequence', copy: 'Add a ritualized structure when starting the next quest.' },
    { id: 'simplify-quest', title: 'Simplify Quest', copy: 'Force the next started quest into low-energy mode.' },
  ];

  const classDailyLine = classId === 'barbarian'
    ? (state.barbarian?.completedAt ? 'Today you win by chaining momentum after a hard fast start.' : 'Today you win by starting immediately and refusing negotiation.')
    : classId === 'rogue'
      ? (state.rogueRun?.active ? 'Today you win by clearing your route before the context goes cold.' : 'Today you win by bundling clever small wins into one run.')
      : classId === 'monk'
        ? ((state.monk?.discipline ?? 0) >= 3 ? 'Today you can cash in discipline to rescue a blocked quest.' : 'Today you win by stacking calm basics until they turn into power.')
        : classId === 'wizard'
          ? ((state.wizard?.preparedSpells?.length ?? 0) > 0 ? 'Today you win by using preparation to shape what happens next.' : 'Today you win by preparing the board before you act.')
          : '';

  return (
    <div className="screen-stack">
      <section className="card compact-list-card" style={{ padding: '1rem', background: 'linear-gradient(180deg, #111827, #172554)' }}>
        <p className="eyebrow">{hero.eyebrow}</p>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>{hero.title}</h2>
        <p style={{ color: '#cbd5e1', marginTop: 0 }}>{hero.copy}</p>
        <button className="primary-button" style={{ marginTop: 10, width: '100%' }} onClick={hero.onClick}>{hero.cta}</button>
      </section>

      <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#1d4ed8', background: 'linear-gradient(180deg, #0b1220, #111827)' }}>
        <p className="eyebrow">Re-entry Ritual</p>
        <strong>Open fast, understand the board, hit one thing.</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
          <div style={{ padding: '0.7rem', borderRadius: 12, background: '#0f172a' }}><div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>Available</div><div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{availableCount}</div></div>
          <div style={{ padding: '0.7rem', borderRadius: 12, background: '#0f172a' }}><div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>Started</div><div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{activeQuest ? 1 : 0}</div></div>
          <div style={{ padding: '0.7rem', borderRadius: 12, background: '#0f172a' }}><div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>Cleared</div><div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{completedCount}</div></div>
        </div>
        <p style={{ marginTop: 10, color: '#cbd5e1', fontSize: '0.84rem' }}>The loop should be immediate: know your strongest move, feel progress pressure, then act before your brain starts a committee meeting.</p>
      </section>

      <section className="card compact-list-card" style={{ padding: '1rem' }}>
        <p className="eyebrow">Progress Rails</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Hero Level</div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>Lv. {level}</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{totalXP} XP total</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Streak</div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{streaks.current} days</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Best: {streaks.best}</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <span>{currentChapter.title}</span>
            <span>{progress.cleared}/{progress.total} quests</span>
          </div>
          <div style={{ marginTop: 6, height: 10, borderRadius: 999, background: '#1e293b', overflow: 'hidden' }}>
            <div style={{ width: `${progress.percent}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #3b82f6)' }} />
          </div>
          <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#cbd5e1' }}>
            {boss.remaining > 0 ? `${boss.remaining} more quest${boss.remaining === 1 ? '' : 's'} to reveal the boss.` : 'Boss ready or already active.'}
          </div>
        </div>
      </section>

      {latestToast && (
        <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#7c3aed', background: '#1e1b4b' }}>
          <p className="eyebrow">Recent Reward</p>
          <strong style={{ color: '#f8fafc' }}>{latestToast.text}</strong>
          <p style={{ marginTop: 8, color: '#c4b5fd' }}>
            {latestToast.stage === 'quest' ? 'Quest cleared. XP, class payoff, and chapter pressure should all move when this lands.' :
             latestToast.stage === 'subquest' ? 'Small wins count. Keep stacking them.' :
             latestToast.stage === 'boss' ? 'That was a boss-level shift. Enjoy the smoke and treasure.' :
             'Progress happened. Try not to act surprised.'}
          </p>
        </section>
      )}

      <section className="card compact-list-card">
        <p className="eyebrow">Advisor</p>
        <strong>{advice.headline}</strong>
        <p style={{ marginTop: 8 }}>{advice.copy}</p>
      </section>

      {classDef && (
        <section className="card compact-list-card">
          <p className="eyebrow">Your Class</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.5rem' }}>{classDef.emoji}</span>
            <strong>{classDef.name}</strong>
          </div>
          <p style={{ marginTop: 8, color: '#cbd5e1', fontSize: '0.84rem' }}>{classDailyLine}</p>
          {classId === 'monk' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Breath Beads</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ width: 14, height: 14, borderRadius: 999, display: 'inline-block', background: i < (state.monk?.discipline ?? 0) ? '#22c55e' : '#334155' }} />
                ))}
              </div>
              <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#cbd5e1' }}>Spend 3 beads to rescue a blocked quest.</p>
            </div>
          )}
          {classId === 'rogue' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Route Combo</div>
              {!state.rogueRun?.active ? (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Pick 2 to 3 eligible quests to bundle into one run.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {rogueEligible.slice(0, 5).map((quest) => {
                      const selected = state.rogueRun?.selectedQuestIds?.includes(quest.id);
                      return (
                        <button key={quest.id} onClick={() => toggleRogueRunQuest(quest.id)} style={{ textAlign: 'left', padding: '0.65rem 0.75rem', borderRadius: 10, border: selected ? '1px solid #3b82f6' : '1px solid #334155', background: selected ? '#1e3a5f' : '#0f172a', color: '#e2e8f0' }}>
                          {quest.title}
                        </button>
                      );
                    })}
                  </div>
                  <button className="primary-button" style={{ marginTop: 10 }} onClick={startRogueRun} disabled={(state.rogueRun?.selectedQuestIds?.length ?? 0) < 2}>Start Errand Run</button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Errand Run active: {(state.rogueRun?.completedQuestIds?.length ?? 0)}/{(state.rogueRun?.selectedQuestIds?.length ?? 0)} cleared</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {(state.rogueRun?.selectedQuestIds ?? []).map((qid) => {
                      const quest = allQuests.find((q) => q.id === qid);
                      const done = state.rogueRun?.completedQuestIds?.includes(qid);
                      return <div key={qid} style={{ padding: '0.6rem 0.75rem', borderRadius: 10, background: done ? '#052e16' : '#0f172a', color: done ? '#86efac' : '#e2e8f0' }}>{done ? '✓ ' : ''}{quest?.title || qid}</div>;
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="primary-button" onClick={() => setTab('quests')}>Open Quests</button>
                    <button className="ghost-button" onClick={clearRogueRun}>Clear</button>
                  </div>
                </>
              )}
            </div>
          )}
          {classId === 'wizard' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Prepared Spells</div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Prepare up to 2 daily spells. {planningEligibleIds.length} quests currently qualify for planning help.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {wizardSpells.map((spell) => {
                  const selected = state.wizard?.preparedSpells?.includes(spell.id);
                  return (
                    <button key={spell.id} onClick={() => prepareWizardSpell(spell.id)} style={{ textAlign: 'left', padding: '0.75rem 0.85rem', borderRadius: 10, border: selected ? '1px solid #7c3aed' : '1px solid #334155', background: selected ? '#3b0764' : '#0f172a', color: '#e2e8f0' }}>
                      <strong>{spell.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>{spell.copy}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="card compact-list-card">
        <p className="eyebrow">Quick Tips</p>
        <ul className="mini-list">
          <li><strong>Start</strong> or resume the strongest quest on the board</li>
          <li><strong>Watch</strong> chapter progress and boss reveal pressure</li>
          <li><strong>Use</strong> class powers daily instead of treating them like decorative lore</li>
        </ul>
      </section>

      <InstallPromptCard />
    </div>
  );
}
