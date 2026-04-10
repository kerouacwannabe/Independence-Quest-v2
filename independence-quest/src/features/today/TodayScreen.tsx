import { CHAPTERS, CLASS_DEFS, LOW_ENERGY_OPTIONS } from '../../content';
import {
  useGameStore,
  selectClassObjective,
  selectComebackMessage,
  selectCurrentChapter,
  selectDailyObjective,
  selectDailyAdvice,
  selectProgressUnlocks,
  selectNextMove,
  selectPlanningEligibleQuestIds,
  selectRogueEligibleQuestIds,
  selectLevel,
  selectTotalXP,
  selectStreaks,
  selectNextProgressStep,
} from '../../state/store';
import { InstallPromptCard } from '../../components/InstallPromptCard';

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
  const completeFirstProof = useGameStore((s) => s.completeFirstProof);
  const toggleRogueRunQuest = useGameStore((s) => s.toggleRogueRunQuest);
  const startRogueRun = useGameStore((s) => s.startRogueRun);
  const clearRogueRun = useGameStore((s) => s.clearRogueRun);
  const prepareWizardSpell = useGameStore((s) => s.prepareWizardSpell);
  const setSetting = useGameStore((s) => s.setSetting);

  const nextMove = selectNextMove(state);
  const advice = selectDailyAdvice(state);
  const classObjective = selectClassObjective(state);
  const comebackMessage = selectComebackMessage(state);
  const dailyObjective = selectDailyObjective(state);
  const progressUnlocks = selectProgressUnlocks(state);
  const nextProgressStep = selectNextProgressStep(state);
  const level = selectLevel(state);
  const totalXP = selectTotalXP(state);
  const streaks = selectStreaks(state);

  const classId = state.classId;
  const classDef = CLASS_DEFS.find((c) => c.id === classId);
  const allQuests = CHAPTERS.flatMap((chapter) => chapter.quests);
  const rogueEligibleIds = selectRogueEligibleQuestIds();
  const planningEligibleIds = selectPlanningEligibleQuestIds();
  const rogueEligible = allQuests.filter((quest) => rogueEligibleIds.includes(quest.id));
  const currentChapter = selectCurrentChapter(state) ?? CHAPTERS[CHAPTERS.length - 1];
  const progress = chapterProgress(state, currentChapter);
  const boss = nextBossMilestone(currentChapter, progress.cleared);
  const campaignComplete = state.campaign.complete && !selectCurrentChapter(state);
  const firstProofQuest = CHAPTERS.flatMap((chapter) => chapter.quests).find((quest) => quest.id === state.campaign.firstProof);
  const latestToast = ui.toasts?.[0];
  const availableCount = allQuests.filter((quest) => state.quests[quest.id]?.status === 'available').length;
  const completedCount = allQuests.filter((quest) => state.quests[quest.id]?.status === 'completed').length;

  const blockedQuest = allQuests.find((quest) => state.quests[quest.id]?.status === 'blocked');
  const waitingQuest = allQuests.find((quest) => state.quests[quest.id]?.status === 'waiting');
  const activeQuest = allQuests.find((quest) => state.quests[quest.id]?.status === 'started');
  const availableBoss = currentChapter.bossPool?.find((b: any) => {
    const entry = state.bosses?.[b.id];
    return entry?.status === 'available' || entry?.status === 'started';
  });

  const doNowStrip = (() => {
    const primary = nextMove.questId
      ? { label: nextMove.button, action: () => { setTab('quests'); if (nextMove.questId && ui.expandedQuestId !== nextMove.questId) toggleQuestExpanded(nextMove.questId); } }
      : { label: 'Open Quest Log', action: () => setTab('quests') };
    const lowEnergy = blockedQuest
      ? { label: 'Use rescue plan', action: () => { setTab('quests'); if (blockedQuest && ui.expandedQuestId !== blockedQuest.id) toggleQuestExpanded(blockedQuest.id); } }
      : { label: 'Low-energy route', action: () => setTab('quests') };
    const help = waitingQuest || blockedQuest
      ? { label: 'I’m stuck', action: () => { setTab('quests'); const q = blockedQuest ?? waitingQuest; if (q && ui.expandedQuestId !== q.id) toggleQuestExpanded(q.id); } }
      : { label: 'Find a rescue', action: () => setTab('quests') };
    return { primary, lowEnergy, help };
  })();

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
      title: nextMove.heading,
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

  const classCoachmark = (() => {
    if (classId === 'rogue' && !state.rogueRun?.active && rogueEligible.length >= 2) {
      return { title: 'Rogue combo ready', copy: 'Bundle 2 or 3 quick wins into one route and cash it in.' };
    }
    if (classId === 'monk' && (state.monk?.discipline ?? 0) >= 3) {
      return { title: 'Monk rescue ready', copy: 'Spend 3 beads to rescue a blocked quest without drama.' };
    }
    if (classId === 'wizard' && planningEligibleIds.length > 0 && (state.wizard?.preparedSpells?.length ?? 0) < 2) {
      return { title: 'Wizard prep window', copy: 'Prepare a spell now so the board is easier later.' };
    }
    if (classId === 'barbarian' && !state.barbarian?.completedAt) {
      return { title: 'Barbarian strike window', copy: 'Open a quest and move first. Momentum likes motion.' };
    }
    return null;
  })();

  return (
    <div className="screen-stack">
      {campaignComplete && (
        <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#7c3aed', background: 'linear-gradient(180deg, #1e1b4b, #111827)' }}>
          <p className="eyebrow">Final Win</p>
          <strong>Campaign complete.</strong>
          <p style={{ marginTop: 8, color: '#cbd5e1', fontSize: '0.84rem' }}>Every chapter is cleared. Use the profile and map as a victory lap, not a to-do list.</p>
        </section>
      )}

      <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#2563eb', background: 'linear-gradient(180deg, #0b1220, #111827)' }}>
        <p className="eyebrow">10-Second Re-entry</p>
        <strong>{nextMove.heading}</strong>
        <p style={{ marginTop: 8, color: '#cbd5e1', fontSize: '0.84rem' }}>{nextMove.copy}</p>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          <button className="primary-button" onClick={doNowStrip.primary.action}>{doNowStrip.primary.label}</button>
          <button className="ghost-button" onClick={doNowStrip.lowEnergy.action}>{doNowStrip.lowEnergy.label}</button>
          <button className="ghost-button" onClick={doNowStrip.help.action}>{doNowStrip.help.label}</button>
        </div>
        <p style={{ marginTop: 8, color: '#93c5fd', fontSize: '0.8rem' }}>Open the app, hit one button, and start. No museum tour required.</p>
      </section>

      <section className="card compact-list-card" style={{ padding: '1rem', background: 'linear-gradient(180deg, #111827, #172554)' }}>
        <p className="eyebrow">{hero.eyebrow}</p>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>{hero.title}</h2>
        <p style={{ color: '#cbd5e1', marginTop: 0 }}>{hero.copy}</p>
        <button className="primary-button" style={{ marginTop: 10, width: '100%' }} onClick={hero.onClick}>{hero.cta}</button>
      </section>

      {!state.campaign.firstProofDone && firstProofQuest && (
        <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#7c3aed', background: 'linear-gradient(180deg, #111827, #1e1b4b)' }}>
          <p className="eyebrow">Guided First Proof</p>
          <strong>{firstProofQuest.title}</strong>
          <p style={{ marginTop: 8, color: '#cbd5e1', fontSize: '0.84rem' }}>{firstProofQuest.summary}</p>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            <button className="primary-button" onClick={() => { setTab('quests'); if (ui.expandedQuestId !== firstProofQuest.id) toggleQuestExpanded(firstProofQuest.id); }}>Open first proof quest</button>
            <button className="ghost-button" onClick={() => completeFirstProof()}>Mark evidence collected</button>
          </div>
          <p style={{ marginTop: 8, color: '#ddd6fe', fontSize: '0.8rem' }}>Do it once, then the setup stops pretending you need more ceremony.</p>
        </section>
      )}

      <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#1d4ed8', background: 'linear-gradient(180deg, #0b1220, #111827)' }}>
        <p className="eyebrow">Re-entry Ritual</p>
        <strong>Open fast, understand the board, hit one thing.</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
          <div style={{ padding: '0.7rem', borderRadius: 12, background: '#0f172a' }}><div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>Available</div><div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{availableCount}</div></div>
          <div style={{ padding: '0.7rem', borderRadius: 12, background: '#0f172a' }}><div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>Started</div><div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{activeQuest ? 1 : 0}</div></div>
          <div style={{ padding: '0.7rem', borderRadius: 12, background: '#0f172a' }}><div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>Cleared</div><div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{completedCount}</div></div>
        </div>
        <p style={{ marginTop: 10, color: '#cbd5e1', fontSize: '0.84rem' }}>The loop should be immediate: know your strongest move, feel progress pressure, then act before your brain starts a committee meeting.</p>
        <p style={{ marginTop: 8, color: '#93c5fd', fontSize: '0.83rem' }}>{comebackMessage}</p>
      </section>

      <section className="card compact-list-card" style={{ padding: '1rem', borderColor: '#7c3aed', background: 'linear-gradient(180deg, #111827, #1e1b4b)' }}>
        <p className="eyebrow">Next Lesson</p>
        {nextProgressStep ? (
          <>
            <strong>{nextProgressStep.title}</strong>
            <p style={{ marginTop: 6, color: '#ddd6fe', fontSize: '0.84rem' }}>{nextProgressStep.subtitle}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="pill">{nextProgressStep.kind}</span>
              {nextProgressStep.isBossGate && <span className="pill">Boss gate</span>}
            </div>
          </>
        ) : (
          <>
            <strong>What this run has changed</strong>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: '#ddd6fe', fontSize: '0.84rem' }}>
              {progressUnlocks.slice(0, 4).map((line) => <li key={line}>{line}</li>)}
            </ul>
          </>
        )}
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
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{streaks.daily} days</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Weekly chain: {streaks.weekly}</div>
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

      <details className="card compact-list-card" style={{ padding: '1rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700 }}>More details</summary>
        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          <section className="card compact-list-card" style={{ margin: 0 }}>
            <p className="eyebrow">Advisor</p>
            <strong>{advice.message}</strong>
            <p style={{ marginTop: 8, color: '#cbd5e1' }}>Phase: {advice.dayPhase}</p>
          </section>

          {classCoachmark && (
            <section className="card compact-list-card" style={{ margin: 0, borderColor: '#7c3aed', background: 'linear-gradient(180deg, #1e1b4b, #111827)' }}>
              <p className="eyebrow">Class Coachmark</p>
              <strong>{classCoachmark.title}</strong>
              <p style={{ marginTop: 8, color: '#cbd5e1', fontSize: '0.84rem' }}>{classCoachmark.copy}</p>
            </section>
          )}

          <section className="card compact-list-card" style={{ margin: 0 }}>
            <p className="eyebrow">Daily Mode</p>
        <strong>{state.settings?.dailyMode === 'speed' ? 'Speed' : state.settings?.dailyMode === 'social' ? 'Social' : state.settings?.dailyMode === 'low-energy' ? 'Low-energy' : state.settings?.dailyMode === 'micro-win' ? 'Micro-win' : 'Balanced'}</strong>
        <p style={{ marginTop: 8, color: '#cbd5e1', fontSize: '0.84rem' }}>Pick the shape of today. The route changes, but it still counts.</p>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {[
            { id: 'balanced', title: 'Balanced', copy: 'One useful win, no drama.' },
            { id: 'speed', title: 'Speed', copy: 'Fast burst, quick closure.' },
            { id: 'social', title: 'Social', copy: 'Use support and body-doubling.' },
            { id: 'low-energy', title: 'Low-energy', copy: 'Tiny legitimate progress only.' },
            { id: 'micro-win', title: 'Micro-win', copy: 'Two minutes, one finish, still counts.' },
          ].map((mode) => (
            <button key={mode.id} className="quest-card-head" onClick={() => setSetting('dailyMode', mode.id)}>
              <span><strong>{mode.title}</strong><br /><span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>{mode.copy}</span></span>
              <span className="pill">{state.settings?.dailyMode === mode.id ? 'On' : 'Set'}</span>
            </button>
          ))}
        </div>
        {state.settings?.dailyMode === 'micro-win' && (
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <div style={{ padding: '0.7rem', borderRadius: 10, background: '#0f172a', border: '1px solid #7c3aed' }}>
              <strong style={{ display: 'block' }}>Micro-win mode</strong>
              <span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>Pick one two-minute action and stop when it’s done. Small counts. That’s the whole point.</span>
            </div>
            {LOW_ENERGY_OPTIONS.slice(0, 2).map((opt) => (
              <div key={opt.id} style={{ padding: '0.7rem', borderRadius: 10, background: '#0f172a', border: '1px solid #1e293b' }}>
                <strong style={{ display: 'block' }}>{opt.title}</strong>
                <span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>{opt.copy}</span>
              </div>
            ))}
          </div>
        )}
        {state.settings?.dailyMode === 'low-energy' && (
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {LOW_ENERGY_OPTIONS.map((opt) => (
              <div key={opt.id} style={{ padding: '0.7rem', borderRadius: 10, background: '#0f172a', border: '1px solid #1e293b' }}>
                <strong style={{ display: 'block' }}>{opt.title}</strong>
                <span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>{opt.copy}</span>
              </div>
            ))}
          </div>
        )}
          </section>
        </div>
      </details>

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
