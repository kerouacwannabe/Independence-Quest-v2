(function(){const y=document.createElement("link").relList;if(y&&y.supports&&y.supports("modulepreload"))return;for(const C of document.querySelectorAll('link[rel="modulepreload"]'))P(C);new MutationObserver(C=>{for(const I of C)if(I.type==="childList")for(const ne of I.addedNodes)ne.tagName==="LINK"&&ne.rel==="modulepreload"&&P(ne)}).observe(document,{childList:!0,subtree:!0});function r(C){const I={};return C.integrity&&(I.integrity=C.integrity),C.referrerPolicy&&(I.referrerPolicy=C.referrerPolicy),C.crossOrigin==="use-credentials"?I.credentials="include":C.crossOrigin==="anonymous"?I.credentials="omit":I.credentials="same-origin",I}function P(C){if(C.ep)return;C.ep=!0;const I=r(C);fetch(C.href,I)}})();const Ze=`  <div class="app-shell">
    <header class="campaign-header panel">
      <section>
        <p class="eyebrow">Bob the Skull presents</p>
        <h1>💀 Claim Your Own Keep</h1>
        <p class="lede">
          A real-life independence RPG about routines, money, admin, and building a home that actually works.
          Take quests, survive chapter bosses, and drag your future keep out of theory and into logistics.
        </p>
        <p class="small-note" id="heroNameBanner">Current hero: Unnamed Hero.</p>
        <div class="action-row" aria-label="Campaign actions">
          <button id="jumpToCurrent">Jump to current chapter</button>
          <button id="toggleMapView" class="secondary">World map: guided</button>
          <button id="toggleFocusMode" class="secondary">Focus mode: off</button>
          <button id="jumpToRescue" class="secondary">ADHD rescue kit</button>
          <button id="printCharacterSheet" class="secondary">Print character sheet</button>
          <button id="toggleFamilyMode" class="secondary">Family support: off</button>
        </div>
      </section>

      <section class="header-right">
        <dl class="stat-list" aria-label="Campaign progress">
          <div><dt>Character Level</dt><dd id="statLevel">1</dd></div>
          <div><dt>Total XP</dt><dd id="statXp">0</dd></div>
          <div><dt>Main Quests Cleared</dt><dd id="statQuests">0</dd></div>
          <div><dt>Bosses Defeated</dt><dd id="statBosses">0</dd></div>
          <div><dt>Blocked Quests</dt><dd id="statBlocked">0</dd></div>
          <div><dt>Active Quests</dt><dd id="statActive">0</dd></div>
        </dl>

        <section class="progress-block" aria-labelledby="overall-progress-title">
          <div class="progress-row">
            <strong id="overall-progress-title">Journey to the Independent Keep</strong>
            <span id="progressLabel">0%</span>
          </div>
          <progress id="overallProgress" max="100" value="0">0%</progress>
          <p class="small-note" id="nextObjectiveCopy">Choose a class and start your first quest. The goblin of avoidance hates a clear first move.</p>
        </section>

        <section class="next-move-card" aria-labelledby="nextMoveTitle">
          <div class="progress-row">
            <strong id="nextMoveTitle">⚔️ Next Move</strong>
            <span class="pill success" id="nextMoveType">Start</span>
          </div>
          <div class="next-move-title" id="nextMoveHeading">Choose a class and begin.</div>
          <div class="next-move-copy" id="nextMoveCopy">The fastest route through dread is usually one clear action with a button under it.</div>
          <button id="nextMoveButton">Start the next useful thing</button>
        </section>

        <div class="character-summary" id="characterSummary">Character creation is not finished yet. Begin with a name, a class, and one small proof.</div>
      </section>
    </header>

    <main class="campaign-layout">
      <section class="campaign-main">
        <section class="journey-overview panel" aria-labelledby="journey-title" id="journeySection">
          <div class="section-head">
            <div>
              <h2 id="journey-title">The Road from Base Camp to the Keep</h2>
              <p class="muted">Each chapter is a proving ground. Clear quests, face the boss, and open the road forward.</p>
            </div>
            <span class="pill" id="journeySummaryPill">5 chapters to clear</span>
          </div>
          <ol class="journey-track" id="journeyTrack"></ol>
        </section>

        <section class="main-quest panel" aria-labelledby="main-quest-title">
          <div class="section-head">
            <div>
              <h2 id="main-quest-title">Main Quest — Claim Your Own Keep</h2>
              <p class="muted">Stabilize yourself, carry your weight, handle adult systems, make the money math real, and finish the launch.</p>
            </div>
            <span class="pill warning" id="mainQuestStatus">Not yet launched</span>
          </div>
          <div id="mainQuestCard"></div>
        </section>

        <section class="quest-log panel" aria-labelledby="quest-log-title" id="questSection">
          <div class="section-head">
            <div>
              <h2 id="quest-log-title">Quest Log</h2>
              <p class="muted">Start a quest to reveal its steps. Clear the required ones and the quest resolves automatically.</p>
            </div>
            <span class="pill success" id="currentChapterPill">Current chapter pending</span>
          </div>
          <div class="chapter-list" id="chapterList"></div>
        </section>
      </section>

      <aside class="campaign-sidebar">
        <section class="identity-panel panel" aria-labelledby="identity-title">
          <div class="section-head">
            <div>
              <h2 id="identity-title">Hero Identity & Save Magic</h2>
              <p class="muted">Name the hero, manage save slots, and keep backups in case fate trips over a cable.</p>
            </div>
            <span class="pill" id="slotPill">Slot 1 active</span>
          </div>
          <div class="field-stack">
            <label class="field-label" for="characterNameInput">Character name</label>
            <input class="text-input" id="characterNameInput" type="text" maxlength="60" placeholder="Unnamed Hero" />
          </div>
          <div class="slot-grid" id="slotGrid"></div>
          <div class="toggle-grid">
            <button id="toggleSound" class="secondary">Sound: on</button>
            <button id="toggleEffects" class="secondary">Effects: on</button>
          </div>
          <div class="save-actions">
            <button id="exportSave" class="secondary">Export save</button>
            <button id="importSave" class="secondary">Import save</button>
            <button id="resetCampaign" class="danger">Reset campaign</button>
            <input id="importFile" type="file" accept="application/json,.json" hidden />
          </div>
          <div class="small-note" id="slotCopy">Three save slots, one skull, limitless domestic peril.</div>
          <div class="small-note" id="saveStatusCopy">Autosave status unknown, which is not ideal.</div>
          <div class="small-note" id="campaignModeCopy">Campaign mode not chosen yet.</div>
        </section>

        <section class="class-panel panel" aria-labelledby="class-title">
          <div class="section-head">
            <div>
              <h2 id="class-title">Character Class</h2>
              <p class="muted">Your class is a playstyle. It changes how the campaign helps you win.</p>
            </div>
            <span class="pill" id="classPill">Class perk active</span>
          </div>
          <form id="classForm">
            <fieldset>
              <legend class="sr-only">Choose a class</legend>
              <ul class="class-list" id="classList"></ul>
            </fieldset>
          </form>
          <div class="class-note" id="classNote"></div>
          <div class="mini-console" id="classConsole"></div>
        </section>

        <section class="boss-panel panel mobile-collapse" aria-labelledby="boss-title">
          <div class="section-head">
            <div>
              <h2 id="boss-title">Boss Encounters</h2>
              <p class="muted">One boss guards each chapter. It reveals itself once your progress is real enough to matter.</p>
            </div>
            <div class="section-head-actions">
              <span class="pill danger" id="bossPill">Threats ahead</span>
              <button class="secondary mobile-section-toggle" id="toggleBossSection" aria-expanded="false">Show</button>
            </div>
          </div>
          <div class="panel-body" id="bossPanelBody">
            <ol class="boss-list" id="bossList"></ol>
          </div>
        </section>

        <section class="reward-panel panel mobile-collapse" aria-labelledby="rewards-title">
          <div class="section-head">
            <div>
              <h2 id="rewards-title">Loot & Rewards</h2>
              <p class="muted">A little bribery remains one of civilization’s sturdier tools.</p>
            </div>
            <div class="section-head-actions">
              <span class="pill success" id="rewardPill">Rewards locked</span>
              <button class="secondary mobile-section-toggle" id="toggleRewardSection" aria-expanded="false">Show</button>
            </div>
          </div>
          <div class="panel-body" id="rewardPanelBody">
            <ol class="reward-track" id="rewardTrack"></ol>
          </div>
        </section>

        <section class="rescue-panel panel mobile-collapse" aria-labelledby="rescue-title" id="rescueSection">
          <div class="section-head">
            <div>
              <h2 id="rescue-title">ADHD Rescue Kit</h2>
              <p class="muted">For rough-brain moments, stalled momentum, and the sudden urge to reorganize spoons instead of living.</p>
            </div>
            <div class="section-head-actions">
              <span class="pill warning">Use anytime</span>
              <button class="secondary mobile-section-toggle" id="toggleRescueSection" aria-expanded="false">Show</button>
            </div>
          </div>
          <div class="panel-body" id="rescuePanelBody">
            <ul class="rescue-list" id="rescueList"></ul>
          </div>
        </section>

        <section class="budget-panel panel mobile-collapse" aria-labelledby="budget-title">
          <div class="section-head">
            <div>
              <h2 id="budget-title">Budgeting Field Guide</h2>
              <p class="muted">Illustrative costs so the housing chapter runs on math instead of wishful fog.</p>
            </div>
            <div class="section-head-actions">
              <span class="pill warning">Planning fuel</span>
              <button class="secondary mobile-section-toggle" id="toggleBudgetSection" aria-expanded="false">Show</button>
            </div>
          </div>
          <div class="panel-body" id="budgetPanelBody">
            <div class="budget-copy">These are example monthly costs, not universal truth tablets. Use them to reality-check the housing chapter.</div>
            <div class="budget-examples" id="budgetExamples"></div>
          </div>
        </section>
      </aside>
    </main>
  </div>

  <section class="overlay" id="timerOverlay" hidden aria-labelledby="timerTitle" aria-modal="true" role="dialog">
    <div class="overlay-card" tabindex="-1">
      <div>
        <p class="eyebrow">Barbarian of Momentum</p>
        <h2 id="timerTitle">Start Sprint</h2>
        <p class="muted" id="timerQuestCopy">Touch the quest before the brain starts a committee hearing.</p>
      </div>
      <div class="countdown" id="timerCount">60</div>
      <p class="muted">Take one physical action right now: pick up a dish, open the résumé, put the shoes on, or place the phone call. Confirm before the countdown dies to gain the Momentum buff.</p>
      <div class="action-row">
        <button class="success" id="confirmMomentum">I touched the task</button>
        <button class="secondary" id="skipMomentum">Skip the buff</button>
      </div>
    </div>
  </section>

  <section class="overlay" id="campaignSetupOverlay" hidden aria-labelledby="campaignSetupTitle" aria-modal="true" role="dialog">
    <div class="overlay-card" tabindex="-1">
      <div>
        <p class="eyebrow">Chapter 0 — Base Camp</p>
        <h2 id="campaignSetupTitle">Forge Your Character</h2>
        <p class="setup-copy">You are not merely checking tasks. You are building a real person-shaped route toward independence.</p>
      </div>
      <div id="campaignSetupBody"></div>
      <div class="setup-footer">
        <span class="setup-step-count" id="campaignSetupStepCount">Step 1 of 3</span>
        <div class="action-row">
          <button class="secondary" id="campaignSetupBack">Back</button>
          <button id="campaignSetupNext">Next</button>
        </div>
      </div>
    </div>
  </section>

  <section class="overlay" id="questFlowOverlay" hidden aria-labelledby="questFlowTitle" aria-modal="true" role="dialog">
    <div class="overlay-card" tabindex="-1">
      <div>
        <p class="eyebrow" id="questFlowEyebrow">Quest log</p>
        <h2 id="questFlowTitle">Update quest state</h2>
        <p class="setup-copy" id="questFlowCopy">Name the obstacle or waiting state cleanly so the game can help instead of shrugging at you.</p>
      </div>
      <div id="questFlowBody"></div>
      <div class="form-actions">
        <button class="secondary" id="questFlowCancel">Cancel</button>
        <button id="questFlowSubmit">Save</button>
      </div>
    </div>
  </section>

  <div class="particle-layer" id="particleLayer" aria-hidden="true"></div>

  <div class="toast-layer">
    <div id="toast" class="toast" aria-live="polite"></div>
    <div id="banner" class="banner" aria-live="assertive"></div>
  </div>
`,et=[{id:"barbarian",emoji:"🪓",name:"Barbarian of Momentum",perk:"Every quest start triggers a 60-second Start Sprint. Confirm one physical first action to earn a Momentum XP bonus.",note:"Best for brains that get weaker the longer they think. Hit the thing before the dread committee assembles."},{id:"rogue",emoji:"🗡️",name:"Rogue of Errands",perk:"Start an Errand Run and chain two eligible quests in the same outing for a combo XP reward.",note:"Best for people who thrive on quick wins, outside missions, and sneaky practical progress."},{id:"wizard",emoji:"📜",name:"Wizard of Life Admin",perk:"Admin, work, budget, and housing quests reveal a Ritual Plan. Complete the prep ritual for bonus XP and cleaner execution.",note:"Best for people whose brains calm down when checklists, reminders, scripts, and documents are all named out loud."},{id:"monk",emoji:"🕯️",name:"Monk of Routine",perk:"Routine subquests build Discipline. Spend 3 Discipline on Recovery Stance to rescue a blocked quest and auto-clear its first step.",note:"Best for people whose entire mortal situation improves when the basics stop being random."}],tt=[{title:"I am stuck and hissing at the furniture",copy:"Pick the smallest visible action. Start a 5-minute timer. Touch the task before judging whether it deserves a sermon."},{title:"I am overwhelmed by everything everywhere all at once",copy:"Write exactly three things: one must-do, one should-do, one easy win. Anything beyond that is decorative suffering."},{title:"I forgot everything",copy:"Check the quest log, check the calendar, check messages, then choose one next action. Memory is not a reliable storage format."},{title:"I do not want to do the thing",copy:"Promise yourself five ugly minutes only. If you still hate it after five honest minutes, reassess. Usually momentum does the heavy lifting."},{title:"Low-energy mode only",copy:"Do a micro quest: trash, one sink load of dishes, one email, one shower, or a 10-minute room reset. Tiny counts."},{title:"Avoidance goblin is nesting",copy:"Use body doubling, music, a visible timer, or narrate the next action out loud. Silence and ambiguity are goblin food."}],Ne=[{at:3,title:"Minor Loot Drop",copy:"Choose dinner, a favorite snack, or guilt-free game time."},{at:6,title:"Level 2 Reward",copy:"Small purchase, nice outing, or a properly smug evening."},{at:9,title:"Rare Loot",copy:"Comfort item, hobby item, or a deliberate lazy night with no guilt tax."},{at:12,title:"Epic Reward",copy:"Something useful and memorable. You are not merely collecting stickers now."},{at:15,title:"Legendary Loot",copy:"Celebrate the fact that this campaign now points at real independence."}],st=[{title:"Shared room / housemates",total:"~$1,480–$1,640",items:["Rent: $850","Electric: $60","Water / sewer / garbage: $40","Internet: $35","Phone: $50","Groceries: $300","Transit: $90 or car costs $250+","Renter’s insurance: $15","Household supplies: $40"]},{title:"Roommate apartment split",total:"~$1,700–$2,000+",items:["Rent share: $1,050","Electric: $70","Water / sewer / garbage: $50","Internet: $40","Phone: $50","Groceries: $325","Transit: $100 or car costs $300+","Renter’s insurance: $15","Household supplies: $50"]},{title:"Solo studio",total:"~$2,230–$2,730+",items:["Rent: $1,450","Electric: $80","Water / sewer / garbage: $60","Internet: $60","Phone: $50","Groceries: $350","Transit: $100 or car costs $300+","Renter’s insurance: $20","Household supplies: $60"]}],je={"personal-stability":[{id:"ps-checkin",title:"Run one calm check-in, not a shame spiral",copy:"Ask what would help today and keep the tone collaborative instead of prosecutorial."},{id:"ps-launchpad",title:"Help set up a visible launch pad",copy:"Create one obvious spot for keys, wallet, meds, or bag so memory is not doing all the labor."},{id:"ps-celebrate",title:"Acknowledge one small win out loud",copy:"Tiny praise works better than theatrical disappointment. Astonishing, I know."}],"household-competence":[{id:"hc-clarify",title:"Clarify one owned chore or expectation",copy:"Write down what belongs to whom so nobody has to interpret kitchen omens."},{id:"hc-stepback",title:"Do not rescue a task too early",copy:"Give the player room to own the chore instead of instantly absorbing it back."},{id:"hc-supplies",title:"Share where supplies and tools live",copy:"Make detergent, trash bags, cleaning spray, and backup soap easy to find."}],"income-admin":[{id:"ia-bodydouble",title:"Offer one body-double session",copy:"Sit nearby while the player applies, calls, or handles forms. Presence is a buff."},{id:"ia-docs",title:"Help gather document locations",copy:"Identify where IDs, insurance, banking details, or résumé files are hiding."},{id:"ia-script",title:"Help script a call or email",copy:"One short script often kills three hours of dread."}],"budget-housing":[{id:"bh-reality",title:"Share real rent and utility examples",copy:"Talk actual numbers so the housing plan stays grounded in reality."},{id:"bh-boundaries",title:"Clarify what support is realistic",copy:"Temporary help, deposits, moving help, deadlines—name it cleanly."},{id:"bh-review",title:"Review the budget without ridicule",copy:"Point out gaps like a strategist, not like an irritated landlord ghost."}],"trial-independence":[{id:"ti-stepback",title:"Let the player own the week",copy:"Avoid hovering. The whole point is seeing what holds when support backs off a little."},{id:"ti-checkpoint",title:"Schedule one checkpoint conversation",copy:"Check progress at a set time instead of turning the whole week into ambient surveillance."},{id:"ti-reward",title:"Help celebrate progress",copy:"When the week works, celebrate it like a real milestone rather than shrugging past it."}]},De=[{id:"overwhelmed",title:"Overwhelmed but ready",copy:"You need a clear lane, not another avalanche of advice."},{id:"stuck",title:"Stuck in dependence",copy:"You want real movement, not another month of waiting for motivation to descend from the heavens."},{id:"close",title:"Almost there, needs structure",copy:"You can do a lot already. The missing ingredient is consistency and a saner map."},{id:"rebuilding",title:"Trying again after setbacks",copy:"This is not starting from zero. It is regrouping with better information and less shame."}],Qe=[{id:"peace",title:"Peace / privacy",copy:"You want a home base that feels calm instead of crowded or chaotic."},{id:"freedom",title:"Freedom / autonomy",copy:"You want your own decisions, your own schedule, and your own damn keys."},{id:"less-conflict",title:"Less conflict at home",copy:"You want fewer pressure points, fewer arguments, and less ambient friction."},{id:"self-proof",title:"Prove to myself I can do it",copy:"You want evidence, not vibes, that you can run your own life."},{id:"target-move",title:"Prepare for a real move-out goal",copy:"There is an actual horizon here, not just an abstract someday."}],We=[{id:"start",title:"I will prove I can start.",copy:"Perfect for action paralysis and stalled momentum."},{id:"finish",title:"I will prove I can finish.",copy:"Best when half-done tasks breed in the dark."},{id:"routine",title:"I will prove I can keep a routine.",copy:"Best when chaos is caused by missing basics, not lack of intelligence."},{id:"admin",title:"I will prove I can face adult admin.",copy:"Best when paperwork and messages are the dragon at the gate."}],He=[{id:"dress",title:"Put on real clothes or handle hygiene",copy:"A tiny declaration that the day has, regrettably, begun."},{id:"water-surface",title:"Drink water and clear one surface",copy:"A humble anti-chaos ritual."},{id:"open-doc",title:"Open the résumé or budget doc",copy:"The door to the scary task counts as a door."},{id:"trash",title:"Take out one bag of trash",copy:"Concrete, visible, and satisfyingly mortal."},{id:"send-message",title:"Send one needed message",copy:"A small act of civilization."}],nt={"morning-summoning":{title:"Low-energy version",copy:"Get out of bed, do one hygiene-or-clothes step, and place one item for tomorrow."},"feed-the-adventurer":{title:"Low-energy version",copy:"Eat something with protein, drink water, and rinse one dish or wipe one spot."},"reset-the-lair":{title:"Low-energy version",copy:"Clear 5 visible items or do one stage of laundry only."},"gold-quest":{title:"Low-energy version",copy:"Open the job board, save one lead, and make the résumé visible."},"communications-ward":{title:"Low-energy version",copy:"Write a call or email script, save the number, and leave the tab open."},"real-survival-budget":{title:"Low-energy version",copy:"Choose one housing model and estimate only rent plus one utility."},"housing-scout":{title:"Low-energy version",copy:"Save 2 real listings. No dissertation required."},"trial-week-charter":{title:"Low-energy version",copy:"Track one day honestly and write what broke first."}},T=[{id:"personal-stability",level:1,title:"Personal Stability",journeyTitle:"Base Camp to the Watchfire",intro:"Wake, wash, feed, and reset the lair like someone expecting to remain among the living.",bossRevealAt:2,quests:[{id:"morning-summoning",title:"Morning Summoning Circle",summary:"Build a morning ritual that gets the day started without demanding perfection at sunrise.",tags:["routine"],completionBonus:16,subquests:[{id:"wake-window",title:"Leave bed or begin wake-up within the target window",xp:10,required:!0},{id:"wash-dress",title:"Handle hygiene or get into daytime clothes",xp:10,required:!0},{id:"launch-pad",title:"Do one ready-for-day action: meds, bag, keys, breakfast setup, or clothes",xp:8,required:!0},{id:"light-reset",title:"Optional: get daylight, breakfast, or a two-minute outside reset",xp:6,required:!1}]},{id:"feed-the-adventurer",title:"Feed the Adventurer",summary:"Get actual fuel in the body instead of running on fog, caffeine, and regret. Low-energy fuel still counts.",tags:["routine","household"],completionBonus:16,subquests:[{id:"cook-meal",title:"Cook one real meal",xp:10,required:!0},{id:"clean-kitchen",title:"Do the dishes or wipe the counter after eating",xp:8,required:!0},{id:"water-move",title:"Drink water and take a 10-minute reset walk",xp:8,required:!0},{id:"leftovers",title:"Optional: pack leftovers or a snack for later",xp:6,required:!1}]},{id:"reset-the-lair",title:"Reset the Lair",summary:"Restore the personal habitat so it stops draining hit points just by existing.",tags:["household","errand"],completionBonus:18,subquests:[{id:"room-reset",title:"Run a 15-minute room reset",xp:10,required:!0},{id:"laundry-cycle",title:"Wash, dry, and put away one load of laundry",xp:10,required:!0},{id:"trash-out",title:"Take out trash and replace the bag",xp:8,required:!0},{id:"calm-talk",title:"Optional: have one calm planning conversation",xp:6,required:!1}]}],bossPool:[{id:"slime-of-disorder",title:"The Slime of Disorder",summary:"A sticky creature made of postponed cleanup, drifting clothes, and suspicious cups.",completionBonus:60,subquests:[{id:"slime-hygiene",title:"Complete hygiene",xp:12,required:!0},{id:"slime-laundry",title:"Finish one full laundry cycle",xp:12,required:!0},{id:"slime-space",title:"Clean the primary personal space",xp:12,required:!0},{id:"slime-meal",title:"Make one meal in the same day",xp:12,required:!0}]},{id:"clockwork-ghoul",title:"The Clockwork Ghoul of Sleep Drift",summary:"This rattling horror feeds on random sleep, skipped mornings, and the phrase “I’ll fix it tomorrow.”",completionBonus:60,subquests:[{id:"ghoul-bedtime",title:"Set tomorrow’s wake time and bedtime",xp:12,required:!0},{id:"ghoul-morning",title:"Complete the morning routine on target",xp:12,required:!0},{id:"ghoul-reset",title:"Do one evening reset before bed",xp:12,required:!0},{id:"ghoul-alarms",title:"Place alarms and clothes for the next day",xp:12,required:!0}]}]},{id:"household-competence",level:2,title:"Shared Household Competence",journeyTitle:"The Town of Chores and Other Dark Arts",intro:"Contribute like a reliable housemate instead of a mysterious indoor weather event.",bossRevealAt:2,quests:[{id:"duty-charter",title:"Household Duty Charter",summary:"Own a recurring chore and stop acting shocked when it comes back next week.",tags:["household","routine"],completionBonus:18,subquests:[{id:"pick-chore",title:"Choose one recurring household chore",xp:8,required:!0},{id:"perform-chore",title:"Do it once without being chased",xp:10,required:!0},{id:"repeat-chore",title:"Do it again on the next scheduled round",xp:10,required:!0},{id:"announce-chore",title:"Optional: tell the household you own it now",xp:6,required:!1}]},{id:"supply-run",title:"Supply Run of Civic Decency",summary:"Feed the house, notice shortages, and prevent soap from becoming folklore.",tags:["errand","household"],completionBonus:18,subquests:[{id:"check-supplies",title:"Check what food or supplies are low",xp:8,required:!0},{id:"join-grocery",title:"Join a grocery or supply run",xp:10,required:!0},{id:"put-away",title:"Put away what came home",xp:8,required:!0},{id:"plan-three-meals",title:"Optional: write down three simple meal ideas",xp:6,required:!1}]},{id:"shared-space-respect",title:"Shared-Space Respect",summary:"Practice the ancient magic of leaving common areas better than you found them.",tags:["household","admin"],completionBonus:18,subquests:[{id:"common-clean",title:"Clean a bathroom or vacuum a common area",xp:10,required:!0},{id:"replace-supply",title:"Replace one depleted shared supply",xp:8,required:!0},{id:"message-back",title:"Respond to one household question or coordination message",xp:8,required:!0},{id:"label-day",title:"Optional: write down a weekly reset day",xp:6,required:!1}]}],bossPool:[{id:"chore-hydra",title:"The Chore Hydra",summary:"Every time one task is ignored, two more grow where it stood.",completionBonus:75,subquests:[{id:"hydra-recurring",title:"Own one recurring chore for a full week",xp:14,required:!0},{id:"hydra-common",title:"Complete a shared-space cleanup",xp:14,required:!0},{id:"hydra-supply",title:"Replace a low household supply without prompting",xp:14,required:!0},{id:"hydra-communication",title:"Resolve one avoided household communication",xp:14,required:!0}]},{id:"negotiation-specter",title:"The Negotiation Specter",summary:"A translucent nightmare that haunts vague expectations and passive-aggressive silence.",completionBonus:75,subquests:[{id:"specter-expectations",title:"Clarify one household expectation",xp:14,required:!0},{id:"specter-clean",title:"Handle a shared-space chore on schedule",xp:14,required:!0},{id:"specter-food",title:"Contribute to a real food run or meal plan",xp:14,required:!0},{id:"specter-checkin",title:"Do one calm weekly check-in conversation",xp:14,required:!0}]}]},{id:"income-admin",level:3,title:"Income and Admin",journeyTitle:"The City of Work, Paperwork, and Bureaucratic Necromancy",intro:"Gather documents, make calls, apply for work, and stab a few forms in the face.",bossRevealAt:2,quests:[{id:"bureaucratic-spellbook",title:"Bureaucratic Spellbook",summary:"Collect the documents and systems that keep adult life from eating you raw.",tags:["admin","work"],completionBonus:22,ritualPlan:!0,subquests:[{id:"gather-docs",title:"Gather ID, banking, insurance, and core documents",xp:10,required:!0},{id:"update-resume",title:"Update the résumé",xp:12,required:!0},{id:"calendar-reminders",title:"Set reminders for one real deadline or appointment",xp:10,required:!0},{id:"password-system",title:"Optional: improve the password or document folder system",xp:8,required:!1}]},{id:"gold-quest",title:"Gold Quest",summary:"Turn vague “I should look for work” energy into smaller, survivable steps that still move the money problem forward.",tags:["work","admin"],completionBonus:22,requiredCount:2,ritualPlan:!0,subquests:[{id:"identify-leads",title:"Scout 3 leads or next-step opportunities",xp:10,required:!0},{id:"apply-three",title:"Send 1–2 real applications or outreach attempts",xp:12,required:!0},{id:"follow-up",title:"Send one follow-up, portal check, or update",xp:10,required:!0},{id:"focus-block",title:"Optional: do one honest 45-minute focus block",xp:8,required:!1}]},{id:"communications-ward",title:"Communications Ward",summary:"Defeat dread by handling messages, calls, and one appointment like a civilized goblin.",tags:["admin","errand"],completionBonus:22,requiredCount:2,ritualPlan:!0,subquests:[{id:"adult-call",title:"Make one adult phone call",xp:10,required:!0},{id:"respond-important",title:"Respond to one important message or email",xp:10,required:!0},{id:"schedule-thing",title:"Schedule or confirm one appointment",xp:10,required:!0},{id:"script-out",title:"Optional: write a call or email script first",xp:8,required:!1}]}],bossPool:[{id:"bureaucratic-wraith",title:"The Bureaucratic Wraith",summary:"An incorporeal horror made of unanswered calls, draft résumés, and expired tabs.",completionBonus:90,subquests:[{id:"wraith-docs",title:"Gather the important documents",xp:16,required:!0},{id:"wraith-resume",title:"Finish the résumé update",xp:16,required:!0},{id:"wraith-call",title:"Make one adult call",xp:16,required:!0},{id:"wraith-apps",title:"Submit 3 real job applications or equivalent outreach",xp:16,required:!0}]},{id:"interview-minotaur",title:"The Interview Minotaur",summary:"It lives in a labyrinth of self-doubt, overthinking, and terrible webcam angles.",completionBonus:90,subquests:[{id:"mino-questions",title:"Practice 3 interview questions aloud",xp:16,required:!0},{id:"mino-leads",title:"Choose 5 leads worth pursuing",xp:16,required:!0},{id:"mino-follow-up",title:"Send one outreach or follow-up",xp:16,required:!0},{id:"mino-calendar",title:"Set reminder blocks for applications",xp:16,required:!0}]}]},{id:"budget-housing",level:4,title:"Budget and Housing Readiness",journeyTitle:"The Road of Rent, Utilities, and Cold Arithmetic",intro:"This is where the fantasy wrapper meets the landlord’s ledger. Deep breaths.",bossRevealAt:2,quests:[{id:"real-survival-budget",title:"Build a Real Survival Budget",summary:"Choose a housing model, estimate the real monthly cost, and compare it to actual income. If the math is ugly, the honest answer still counts as progress.",tags:["budget","housing","admin"],completionBonus:24,ritualPlan:!0,specialPanel:"budget-guide",subquests:[{id:"after-tax-income",title:"Estimate after-tax monthly income",xp:10,required:!0},{id:"housing-model",title:"Choose a housing model: shared room, roommate split, or solo studio",xp:10,required:!0},{id:"utilities-phone",title:"Estimate utilities, internet, and phone",xp:10,required:!0},{id:"food-transport",title:"Estimate groceries, transportation, and supplies",xp:10,required:!0},{id:"compare-total",title:"Compare the total cost to income and call it viable / needs roommate / needs more income",xp:12,required:!0},{id:"savings-target",title:"Optional: choose a monthly savings target",xp:8,required:!1}]},{id:"housing-scout",title:"Housing Scout",summary:"Look at real listings so the move stops being fog and starts being math.",tags:["housing","errand"],completionBonus:24,ritualPlan:!0,subquests:[{id:"find-listings",title:"Research 5 real listings",xp:10,required:!0},{id:"compare-models",title:"Compare shared housing to solo options",xp:10,required:!0},{id:"requirements",title:"Note deposits, screening rules, or move-in requirements",xp:10,required:!0},{id:"shortlist",title:"Optional: shortlist the best 2 options",xp:8,required:!1}]},{id:"move-in-war-chest",title:"Move-In War Chest",summary:"Figure out what the launch really costs before rent jumps out from behind a tree.",tags:["budget","housing"],completionBonus:24,ritualPlan:!0,subquests:[{id:"app-fees",title:"Estimate application fees and deposits",xp:10,required:!0},{id:"first-month",title:"Estimate first month’s rent and utility setup costs",xp:10,required:!0},{id:"basic-setup",title:"Estimate basic household setup costs",xp:10,required:!0},{id:"buffer",title:"Choose an emergency buffer target",xp:10,required:!0},{id:"weekly-contribution",title:"Optional: set a weekly savings contribution",xp:8,required:!1}]}],bossPool:[{id:"rent-lich",title:"The Rent Lich",summary:"Ancient, dry, and powered entirely by deposits, fees, and numbers that must add up.",completionBonus:110,subquests:[{id:"lich-budget",title:"Build the realistic monthly budget",xp:18,required:!0},{id:"lich-movein",title:"Estimate move-in costs",xp:18,required:!0},{id:"lich-options",title:"Compare at least 2 housing paths",xp:18,required:!0},{id:"lich-gap",title:"Name the affordability gap and the next action to close it",xp:18,required:!0}]},{id:"utility-chimera",title:"The Utility Chimera",summary:"One head is electric, one head is internet, one head is groceries, and all of them want money.",completionBonus:110,subquests:[{id:"chimera-rent",title:"Estimate rent by housing model",xp:18,required:!0},{id:"chimera-bills",title:"Estimate all core monthly bills",xp:18,required:!0},{id:"chimera-transport",title:"Estimate transportation cost honestly",xp:18,required:!0},{id:"chimera-viable",title:"Decide whether the plan is viable now or needs more income/support",xp:18,required:!0}]}]},{id:"trial-independence",level:5,title:"Experiment Week",journeyTitle:"The Long March to the Independent Keep",intro:"Run the systems, test the routines, and learn what support still matters. This is an experiment, not a moral exam.",bossRevealAt:2,quests:[{id:"trial-week-charter",title:"Experiment Week Charter",summary:"Run a small independence experiment, track what held, and learn where the system still leaks.",tags:["routine","budget"],completionBonus:28,requiredCount:3,subquests:[{id:"seven-day-plan",title:"Write a 7-day routine plan",xp:10,required:!0},{id:"meals-three-days",title:"Track meals for 2 real days",xp:12,required:!0},{id:"sleep-three-days",title:"Track sleep or wake targets for 2 real days",xp:12,required:!0},{id:"spending-three-days",title:"Track spending or friction points for 2 real days",xp:10,required:!0}]},{id:"solo-ops-day",title:"Solo Ops Day",summary:"Run one full day of chores, food, and admin like a future tenant instead of a guest creature.",tags:["routine","household","admin"],completionBonus:28,subquests:[{id:"solo-laundry",title:"Do laundry start to finish",xp:10,required:!0},{id:"solo-clean",title:"Clean a private or shared space",xp:10,required:!0},{id:"solo-admin",title:"Handle one admin task",xp:10,required:!0},{id:"solo-food",title:"Buy, plan, or prepare food for the day",xp:10,required:!0}]},{id:"launch-plan",title:"Launch Plan",summary:"Choose a target window, map the blockers, and decide the next five moves.",tags:["housing","admin","budget"],completionBonus:28,ritualPlan:!0,subquests:[{id:"move-window",title:"Choose a realistic move-out window",xp:10,required:!0},{id:"support-needs",title:"Name supports, blockers, and failure points",xp:10,required:!0},{id:"five-actions",title:"Write the first 5 concrete actions",xp:12,required:!0},{id:"checkpoint-date",title:"Set the next check-in or checkpoint date",xp:10,required:!0}]}],bossPool:[{id:"trial-week-leviathan",title:"The Trial Week Leviathan",summary:"A huge beast made of routine drift, forgotten meals, and crumpled receipts.",completionBonus:130,subquests:[{id:"leviathan-routine",title:"Run the week plan with visible tracking",xp:20,required:!0},{id:"leviathan-chores",title:"Keep up with chores without rescue prompting",xp:20,required:!0},{id:"leviathan-food",title:"Handle meals like a future independent human",xp:20,required:!0},{id:"leviathan-admin",title:"Complete one admin or money task during the trial week",xp:20,required:!0}]},{id:"gatekeeper-lease-readiness",title:"The Gatekeeper of Lease Readiness",summary:"Not evil, just unimpressed. Wants proof that you can keep the machine running.",completionBonus:130,subquests:[{id:"gate-budget",title:"Review the living budget and move-in fund",xp:20,required:!0},{id:"gate-routine",title:"Demonstrate a stable routine for several days",xp:20,required:!0},{id:"gate-logistics",title:"Confirm housing strategy and next actions",xp:20,required:!0},{id:"gate-support",title:"Name what support remains necessary after launch",xp:20,required:!0}]}]}],Ge="independenceCampaignStateV5",Ae="independenceCampaignMetaV1",Le="independenceCampaignStateV4";function Re(){return{currentSlot:"slot1",slotNames:{slot1:"",slot2:"",slot3:""}}}function ve(){return{classId:"",characterName:"",createdAt:null,updatedAt:null,campaign:{complete:!1,step:0,origin:"",motivation:"",vow:"",firstProof:"",firstProofDone:!1,pathMode:"guided"},quests:{},bosses:{},chapterBosses:{},supportTasks:{},rogueRun:{active:!1,completedQuestIds:[],bonusAwarded:!1},monk:{discipline:0},settings:{soundEnabled:!0,effectsEnabled:!0,familyMode:!1,focusMode:!1,showFullMap:!1,collapsedSections:{bosses:!0,rewards:!0,rescue:!0,budget:!0}},version:5}}function ot(d){if(!d)return"Never";try{return new Date(d).toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return"Unknown time"}}function Ue(d){return d.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function at(d){return Ue(String(d||""))}function Fe(d){const y=r=>new Proxy({},{get(P,C){return d[r][C]},set(P,C,I){return d[r][C]=I,!0},deleteProperty(P,C){return delete d[r][C]},has(P,C){return C in d[r]},ownKeys(){return Reflect.ownKeys(d[r])},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}}});return{state:y("state"),meta:y("meta"),persistenceStatus:y("persistenceStatus")}}function it(d){const{ctx:y,CLASS_DEFS:r,RESCUE_ITEMS:P,REWARDS:C,BUDGET_EXAMPLES:I,SUPPORT_TASKS:ne,CAMPAIGN_ORIGINS:we,CAMPAIGN_MOTIVATIONS:he,CAMPAIGN_FIRST_PROOFS:O,LOW_ENERGY_OPTIONS:oe,CHAPTERS:B,saveState:L,getLevel:K,getTotalXP:Be,getCompletedQuestCount:V,getCompletedBossCount:ke,getBlockedQuestCount:H,getActiveQuestCount:A,getOverallProgressPercent:G,getNextObjectiveCopy:de,getMainQuestStatus:ae,getCurrentChapter:j,getCharacterName:S,getNextMove:l,getCampaignOrigin:D,getCampaignMotivation:z,getCampaignVow:ce,getBossForChapter:J,isBossRevealed:Q,isChapterComplete:F,isChapterUnlocked:U,getBossStatus:ie,getQuestEntry:Z,getQuestStatus:qe,questProgress:N,getSlotPreview:Y,getSlotLabel:fe,getRitualPlanSteps:$e,getStatusDisplay:re,getQuestGrade:Se,getUnlockedRewardCount:Ee,getChapterGlyph:s,formatDateTime:m,escapeHtml:f,escapeAttr:R}=d,{state:u,meta:ee,persistenceStatus:ue}=Fe(y);function be(){document.body.classList.toggle("focus-mode",!!u.settings.focusMode),W(),pe(),Ce(),me(),n(),t(),p(),$(),g(),ge(),Me(),Oe(),L(),n()}function W(){document.getElementById("statLevel").textContent=K(),document.getElementById("statXp").textContent=Be(),document.getElementById("statQuests").textContent=V(),document.getElementById("statBosses").textContent=ke(),document.getElementById("statBlocked").textContent=H(),document.getElementById("statActive").textContent=A();const a=G();document.getElementById("overallProgress").value=a,document.getElementById("progressLabel").textContent=`${a}%`,document.getElementById("nextObjectiveCopy").textContent=de(),document.getElementById("mainQuestStatus").textContent=ae(),document.getElementById("journeySummaryPill").textContent=`${B.filter(E=>!F(E)).length} chapters still resisting`;const b=j();document.getElementById("currentChapterPill").textContent=`Current chapter: ${b.title}`,document.getElementById("heroNameBanner").textContent=`Current hero: ${S()}. Slot ${ee.currentSlot.replace("slot","")} is active.`,document.getElementById("toggleFamilyMode").textContent=`Family support: ${u.settings.familyMode?"on":"off"}`,document.getElementById("toggleFocusMode").textContent=`Focus mode: ${u.settings.focusMode?"on":"off"}`,document.getElementById("toggleMapView").textContent=`World map: ${u.settings.showFullMap?"full":"guided"}`;const o=l();document.getElementById("nextMoveType").textContent=o.type,document.getElementById("nextMoveHeading").textContent=o.heading,document.getElementById("nextMoveCopy").textContent=o.copy,document.getElementById("nextMoveButton").textContent=o.button;const w=D(),h=z(),k=ce();document.getElementById("characterSummary").innerHTML=u.campaign.complete?`<strong>${f(S())}</strong> • ${f(w?w.title:"Unknown origin")} • ${f(h?h.title:"No motive chosen")}${k?` • Vow: ${f(k.title)}`:""}`:"Character creation is not finished yet. Begin with a name, a class, and one small proof.",document.getElementById("campaignModeCopy").textContent=u.campaign.complete?`${u.campaign.pathMode==="guided"?"Guided Path":"Free Questing"}${u.settings.showFullMap?" • full map visible":""}`:"Campaign mode not chosen yet."}function pe(){const a=document.getElementById("journeyTrack"),b=j(),o=[],w=B.findIndex(k=>k.id===b.id),h=u.campaign.pathMode==="guided"&&!u.settings.showFullMap?B.filter((k,E)=>E===w||E===w+1):B;o.push(`
    <li class="journey-step">
      <article class="journey-card ${V()>0?"complete":"current"}">
        <div class="journey-kicker">Start</div>
        <div class="journey-title-line"><span class="chapter-crest">💀</span><div class="journey-title">Base Camp</div></div>
        ${V()===0?'<div class="journey-token">💀 Here</div>':""}
        <p class="meta-copy">Current habits, current chaos, current reality. The road starts here.</p>
        <div class="journey-footer"><span>Wake-up point</span><span>${V()} quest(s) cleared</span></div>
      </article>
    </li>
  `),h.forEach(k=>{const E=J(k),x=U(k),te=F(k),X=b.id===k.id&&!te,q=k.quests.filter(se=>Z(se.id).status==="completed").length,ye=Q(k)?E.title:"Boss hidden in the fog";o.push(`
      <li class="journey-step">
        <article class="journey-card ${te?"complete":""} ${X?"current":""} ${x?"":"locked"}">
          ${X?'<div class="journey-token">🧍 Current</div>':""}
          <div class="journey-kicker">Level ${k.level}</div>
          <div class="journey-title-line"><span class="chapter-crest">${s(k)}</span><div class="journey-title">${k.title}</div></div>
          <p class="meta-copy">${k.journeyTitle}</p>
          <div class="journey-footer">
            <span>${q}/${k.quests.length} quests cleared</span>
            <span>${ye}</span>
          </div>
        </article>
      </li>
    `)}),h.length!==B.length&&o.push(`
      <li class="journey-step">
        <article class="journey-card locked">
          <div class="journey-kicker">World Map</div>
          <div class="journey-title-line"><span class="chapter-crest">🗺️</span><div class="journey-title">More road ahead</div></div>
          <p class="meta-copy">The guided path is hiding the rest so your brain doesn’t try to swallow the whole castle at once.</p>
          <div class="journey-footer"><span>Use full map to browse later chapters</span><span>${B.length-h.length-w>0?`${B.length-h.length-w} chapter(s) hidden`:"One road at a time"}</span></div>
        </article>
      </li>
    `),o.push(`
    <li class="journey-step">
      <article class="journey-card ${B.every(k=>F(k))?"complete current":""}">
        ${B.every(k=>F(k))?'<div class="journey-token">🏰 Claimed</div>':""}
        <div class="journey-kicker">Ending</div>
        <div class="journey-title-line"><span class="chapter-crest">🏰</span><div class="journey-title">The Independent Keep</div></div>
        <p class="meta-copy">A home plan backed by routines, money math, and enough competence to survive contact with reality.</p>
        <div class="journey-footer"><span>Final destination</span><span>${G()}% journey complete</span></div>
      </article>
    </li>
  `),a.innerHTML=o.join("")}function Ce(){const a=document.getElementById("mainQuestCard"),b=B.map(o=>{const w=J(o),h=o.quests.filter(E=>Z(E.id).status==="completed").length,k=F(o)?"Completed":U(o)?"Active":"Locked";return`
      <li class="subquest-item ${F(o)?"done":""}">
        <label>
          <input type="checkbox" ${F(o)?"checked":""} disabled aria-hidden="true" />
          <span>
            <strong>${o.title}</strong><br />
            <span class="soft">${h}/${o.quests.length} quests cleared • Boss: ${w.title}</span>
          </span>
          <span class="subquest-xp status-label ${k.toLowerCase()==="active"?"in-progress":k.toLowerCase()}">${k}</span>
        </label>
      </li>
    `}).join("");a.innerHTML=`
    <article class="final-card">
      <div>
        <div class="title-chip">🏁 Win condition</div>
        <div class="quest-title" style="margin-top:8px;">Claim the keep for real</div>
        <p class="quest-copy">Stabilize yourself, handle the household, survive admin, make the money math real, and finish the launch plan.</p>
      </div>
      <ol class="subquest-list">${b}</ol>
      <div class="bonus-panel">
        <strong>${ae()}</strong>
        <div class="soft">Clear the chapters, beat the bosses, and the campaign upgrades from theory to readiness.</div>
      </div>
    </article>
  `}function me(){const a=document.getElementById("chapterList"),b=j(),w=(u.settings.focusMode||u.campaign.pathMode==="guided"&&!u.settings.showFullMap?B.filter(h=>h.id===b.id):B).map(h=>{const k=U(h),E=F(h),x=J(h),te=ie(h),X=h.quests.map(q=>c(q,h)).join("");return`
      <article class="chapter-card ${b.id===h.id&&!E?"current":""} ${k?"":"locked"}" id="chapter-${h.id}">
        <div class="chapter-top">
          <div>
            <div class="chapter-title-line"><span class="chapter-crest">${s(h)}</span><div><h3>Level ${h.level}: ${h.title}</h3><div class="chapter-subtitle">${h.journeyTitle}</div></div></div>
            <p class="muted">${h.intro}</p>
          </div>
          <div class="chapter-progress">
            <div class="progress-row">
              <strong>Chapter progress</strong>
              <span>${h.quests.filter(q=>Z(q.id).status==="completed").length}/${h.quests.length} quests • Boss ${te}</span>
            </div>
            <progress max="100" value="${M(h)}"></progress>
            <span class="soft">Boss in this chapter: ${x.title}${Q(h)?"":" (reveals after enough quest progress)"}</span>
          </div>
        </div>
        ${k?`<ol class="quest-list">${X}</ol>${_(h)}`:'<div class="blocked-note">Locked until the previous chapter and boss are cleared. One cannot simply swagger into rent math.</div>'}
      </article>
    `}).join("");a.innerHTML=w,d.bindQuestEvents()}function M(a){const b=a.quests.filter(w=>Z(w.id).status==="completed").length/a.quests.length,o=ie(a)==="completed"?1:0;return Math.round((b*.7+o*.3)*100)}function _(a){if(!u.settings.familyMode)return"";const b=ne[a.id]||[];return b.length?`
    <section class="support-panel">
      <div class="support-title">🛡️ Support Party Quests</div>
      <div class="support-copy">These are helper tasks for family or allies. They do not replace the player’s work; they reduce chaos around it.</div>
      <ol class="plan-list">${b.map(w=>{const h=!!u.supportTasks[a.id][w.id];return`
      <li class="plan-item ${h?"done":""}">
        <label>
          <input type="checkbox" data-support-chapter-id="${a.id}" data-support-task-id="${w.id}" ${h?"checked":""} />
          <span>
            <strong>${w.title}</strong><br />
            <span class="soft">${w.copy}</span>
          </span>
        </label>
      </li>
    `}).join("")}</ol>
    </section>
  `:""}function n(){const a=document.getElementById("characterNameInput");a.value=u.characterName||"",document.getElementById("slotGrid").innerHTML=["slot1","slot2","slot3"].map(b=>{const o=Y(b),w=o&&o.characterName?o.characterName.trim():"",h=o&&o.quests?Object.values(o.quests).filter(x=>x.status==="completed").length:0,k=o&&o.bosses?Object.values(o.bosses).filter(x=>x.status==="completed").length:0,E=o&&o.updatedAt?m(o.updatedAt):"Never played";return`
      <button class="slot-button ${ee.currentSlot===b?"active":""}" data-slot-id="${b}">
        <span class="slot-name">${f(w||fe(b))}</span>
        <span class="slot-meta">${b===ee.currentSlot?"Current slot":"Switch slot"}<br />${o?`${h} quest(s) • ${k} boss(es)<br />Last played: ${E}`:"Fresh campaign"}</span>
      </button>
    `}).join(""),document.getElementById("slotPill").textContent=`Slot ${ee.currentSlot.replace("slot","")} active`,document.getElementById("slotCopy").textContent=`${S()} is currently bound to slot ${ee.currentSlot.replace("slot","")}. Export this slot or import over it as needed.`,document.getElementById("saveStatusCopy").textContent=ue.stateOk&&ue.metaOk?`Autosave confirmed. Created: ${m(u.createdAt)} • Last saved: ${m(ue.lastSavedAt||u.updatedAt)}.`:`Save warning: ${ue.warning||"Changes may not persist on this device."}`,document.getElementById("toggleSound").textContent=`Sound: ${u.settings.soundEnabled?"on":"off"}`,document.getElementById("toggleEffects").textContent=`Effects: ${u.settings.effectsEnabled?"on":"off"}`,d.bindIdentityEvents()}function c(a,b){const o=Z(a.id),w=qe(a,b),h=N(a),k=Se(a,b),E=re(w),x=u.classId,te=x==="wizard"&&a.ritualPlan&&w!=="available"&&w!=="locked",X=te?$e(a).map(le=>{const Ie=!!o.ritualPlan[le.id];return`
      <li class="plan-item ${Ie?"done":""}">
        <label>
          <input type="checkbox" data-ritual-step="${le.id}" data-quest-id="${a.id}" ${Ie?"checked":""} ${w==="completed"?"disabled":""} />
          <span>
            <strong>${le.title}</strong><br />
            <span class="soft">Prep now, suffer less later.</span>
          </span>
        </label>
      </li>
    `}).join(""):"",q=w!=="available"&&w!=="locked",ye=q?a.subquests.map(le=>{const Ie=!!o.subquests[le.id];return`
      <li class="subquest-item ${le.required?"":"optional"} ${Ie?"done":""}">
        <label>
          <input type="checkbox" data-subquest-id="${le.id}" data-quest-id="${a.id}" ${Ie?"checked":""} ${w==="completed"?"disabled":""} />
          <span>
            <strong>${le.title}</strong><br />
            <span class="soft">${le.required?"Required step":"Optional bonus step"}</span>
          </span>
          <span class="subquest-xp">${le.xp} XP</span>
        </label>
      </li>
    `}).join(""):'<div class="blocked-note">Start this quest to reveal the required subquests.</div>';let se="";a.specialPanel==="budget-guide"&&q&&(se=`
      <div class="quest-special">
        <strong>Budgeting examples unlocked</strong>
        <div class="soft">See the budgeting field guide in the sidebar for shared room, roommate split, and solo studio examples while you fill this in.</div>
      </div>
    `),x==="barbarian"&&w==="available"&&(se+='<div class="quest-special"><strong>Barbarian hook:</strong> Starting this quest triggers a 60-second Start Sprint. Touch the task fast for bonus XP.</div>'),x==="rogue"&&a.tags.includes("errand")&&(se+='<div class="quest-special"><strong>Rogue hook:</strong> This counts for an Errand Run combo if the run is active.</div>'),x==="monk"&&a.tags.includes("routine")&&(se+='<div class="quest-special"><strong>Monk hook:</strong> Routine steps build Discipline. Three Discipline can rescue a blocked quest.</div>');const Te=o.status==="blocked"?`<div class="blocked-note"><strong>Blocked because:</strong> ${f(o.blockedReason||"No reason recorded.")} ${o.blockerType?`<br /><span class="soft">Blocker type: ${f(o.blockerType)}</span>`:""}</div>`:"",xe=o.status==="blocked"&&(o.blockPlan.smallestStep||o.blockPlan.support||o.blockPlan.retryWhen)?`<div class="waiting-note"><strong>Unblock plan:</strong> ${f(o.blockPlan.smallestStep||"Name the smallest next move.")} ${o.blockPlan.support?`<br /><span class="soft">Support: ${f(o.blockPlan.support)}</span>`:""} ${o.blockPlan.retryWhen?`<br /><span class="soft">Retry: ${f(o.blockPlan.retryWhen)}</span>`:""}</div>`:"",Pe=o.status==="waiting"?`<div class="waiting-note"><strong>Waiting on:</strong> ${f(o.waitingPlan.reason||"No waiting reason recorded.")} ${o.waitingPlan.followup?`<br /><span class="soft">Follow-up move: ${f(o.waitingPlan.followup)}</span>`:""} ${o.waitingPlan.retryWhen?`<br /><span class="soft">Check back: ${f(o.waitingPlan.retryWhen)}</span>`:""}</div>`:"",Ke=o.bonuses.momentum?'<div class="bonus-panel">Momentum buff stored: +10 XP on completion. Good. Smash first, philosophize later.</div>':"",Ve=o.bonuses.ritual?'<div class="bonus-panel">Ritual Plan mastered: +12 XP on completion. Bureaucracy is weaker when named.</div>':"",Ye=o.bonuses.recovery?'<div class="bonus-panel">Recovery Stance used: the monk dragged this quest back from the swamp.</div>':"",Xe=o.bonuses.rogueCombo?'<div class="bonus-panel">Errand Run combo landed: +8 XP synergy on this quest.</div>':"",ze=o.bonuses.lowEnergy?'<div class="bonus-panel">Low-energy version used. A smaller real step has been banked, which still counts because momentum is better than ceremonial self-loathing.</div>':"",Je=oe[a.id]?`<div class="quest-special"><strong>${oe[a.id].title}</strong><div class="soft">${oe[a.id].copy}</div></div>`:"";return`
    <li>
      <article class="quest-card ${w.replace(" ","-")} ${w==="completed"?"complete":""} ${w==="blocked"?"blocked":""} ${w==="locked"?"locked":""}" data-quest-card="${a.id}">
        <div class="quest-head">
          <div>
            <div class="quest-title">${a.title}</div>
            <p class="quest-copy">${a.summary}</p>
          </div>
          <div class="quest-meta">
            <span class="status-label ${w.replace(" ","-")}">${E.icon} ${E.label}</span>
            <span class="pill">${k}</span>
            <span class="pill warning">${a.completionBonus} XP clear bonus</span>
            <span class="pill">${h.doneRequired}/${h.needed} needed</span>
          </div>
        </div>
        <div class="tag-row">${a.tags.map(le=>`<span class="tag">${le}</span>`).join("")}</div>
        <div class="quest-controls">${e(a,b)}</div>
        ${Te}
        ${xe}
        ${Pe}
        ${se}
        ${Je}
        ${Ke}
        ${Ve}
        ${Ye}
        ${Xe}
        ${ze}
        ${te?`<div class="quest-special"><strong>Ritual Plan</strong><ol class="plan-list">${X}</ol></div>`:""}
        <div>
          <strong>Objective chain</strong>
          <ol class="subquest-list">${ye}</ol>
        </div>
      </article>
    </li>
  `}function e(a,b){Z(a.id);const o=qe(a,b);return o==="locked"?'<button class="secondary" disabled>Locked</button>':o==="available"?`
      <button data-action="start-quest" data-quest-id="${a.id}">Start quest</button>
      ${oe[a.id]?`<button class="secondary" data-action="low-energy" data-quest-id="${a.id}">Low-energy version</button>`:""}
      <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Mark waiting</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Mark blocked</button>
    `:o==="blocked"?`
      <button data-action="resume-quest" data-quest-id="${a.id}">Resume quest</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Change reason</button>
      <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Mark waiting</button>
      <button class="danger" data-action="reset-quest" data-quest-id="${a.id}">Reset steps</button>
    `:o==="waiting"?`
      <button data-action="resume-quest" data-quest-id="${a.id}">Resume quest</button>
      <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Update waiting plan</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Mark blocked</button>
      <button class="danger" data-action="reset-quest" data-quest-id="${a.id}">Reset steps</button>
    `:o==="completed"?`<button class="secondary" data-action="review-quest" data-quest-id="${a.id}">Review chain</button>`:`
    ${oe[a.id]?`<button class="secondary" data-action="low-energy" data-quest-id="${a.id}">Low-energy version</button>`:""}
    <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Mark waiting</button>
    <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Mark blocked</button>
    <button class="danger" data-action="reset-quest" data-quest-id="${a.id}">Reset steps</button>
  `}function t(){const a=document.getElementById("classList"),b=r.find(o=>o.id===u.classId)||null;a.innerHTML=r.map(o=>`
    <li class="class-choice ${o.id===u.classId?"active":""}">
      <label>
        <input type="radio" name="classId" value="${o.id}" ${o.id===u.classId?"checked":""} />
        <span>
          <span class="class-name"><span>${o.emoji} ${o.name}</span>${o.id===u.classId?'<span class="pill">Active</span>':""}</span>
          <span class="soft">${o.note}</span>
          <span class="class-perk">${o.perk}</span>
        </span>
      </label>
    </li>
  `).join(""),document.getElementById("classNote").innerHTML=b?`<strong>${b.emoji} ${b.name}</strong><br /><span class="soft">${b.perk}</span>`:'<strong>No class chosen yet.</strong><br /><span class="soft">Pick a class in setup or here in the sidebar. No build, no glorious perk.</span>',document.getElementById("classPill").textContent=b?b.name:"Choose a class",document.getElementById("classConsole").innerHTML=b?i(b):'<strong>Class console</strong><div class="soft">Choose a class to unlock the perk console and class-specific advantages.</div>',d.bindClassEvents()}function i(a){if(a.id==="barbarian")return'<strong>Barbarian console</strong><div class="soft">Every time you start a quest, the Start Sprint appears automatically. Confirm one physical first action inside 60 seconds to store the Momentum buff.</div>';if(a.id==="rogue")return`
      <strong>Rogue console</strong>
      <div class="soft">Errand Run status: ${u.rogueRun.active?`active with ${u.rogueRun.completedQuestIds.length} quest(s) chained`:"inactive"}.</div>
      <div class="class-actions" style="margin-top:10px;">
        ${u.rogueRun.active?'<button class="warning" id="endErrandRun">End Errand Run</button>':'<button id="startErrandRun">Start Errand Run</button>'}
      </div>
    `;if(a.id==="wizard")return'<strong>Wizard console</strong><div class="soft">Admin, work, budget, and housing quests now reveal Ritual Plans. Complete the prep ritual before diving in to earn bonus XP.</div>';const b=B.flatMap(o=>o.quests).filter(o=>Z(o.id).status==="blocked");return`
    <strong>Monk console</strong>
    <div class="soft">Discipline stored: <strong>${u.monk.discipline}</strong>. Earn it by completing routine subquests. Spend 3 to invoke Recovery Stance on one blocked quest.</div>
    <div class="class-actions" style="margin-top:10px;">
      <button ${u.monk.discipline<3||b.length===0?'class="secondary" disabled':""} id="useRecoveryStance">Use Recovery Stance</button>
    </div>
  `}function p(){const a=document.getElementById("bossList"),b=j(),w=(u.campaign.pathMode==="guided"&&!u.settings.showFullMap?B.filter(h=>h.id===b.id):B).map(h=>{var ye,se,Te;const k=J(h),E=u.bosses[k.id],x=ie(h),te=re(x),X=Q(h),q=X?k.subquests.map(xe=>{const Pe=!!E.subquests[xe.id];return`
        <li class="subquest-item ${Pe?"done":""}">
          <label>
            <input type="checkbox" data-boss-id="${k.id}" data-boss-subquest-id="${xe.id}" ${Pe?"checked":""} ${x==="completed"?"disabled":""} />
            <span>
              <strong>${xe.title}</strong><br />
              <span class="soft">Required boss objective</span>
            </span>
            <span class="subquest-xp">${xe.xp} XP</span>
          </label>
        </li>
      `}).join(""):'<div class="blocked-note">Hidden until enough quest progress is made in this chapter.</div>';return`
      <li>
        <article class="boss-card ${x==="completed"?"complete":""}">
          <div class="boss-head">
            <div>
              <div class="title-chip">${s(h)} Chapter ${h.level} boss</div>
              <div class="boss-title" style="margin-top:8px;">☠️ ${k.title}</div>
              <p class="boss-copy">${X?k.summary:"Somewhere ahead, a boss waits behind the mist and bad adult decisions."}</p>
            </div>
            <div class="boss-meta">
              <span class="status-label ${x.replace(" ","-")}">${te.icon} ${te.label}</span>
              <span class="pill danger">${k.completionBonus} XP clear bonus</span>
            </div>
          </div>
          ${X?`<div class="boss-intro">Boss unlock rule met in <strong>${h.title}</strong>. Clear all objectives and the chapter can close.</div>`:""}
          ${X?`<div class="boss-controls">${v(h)}</div>`:""}
          ${E.status==="blocked"?`<div class="blocked-note"><strong>Blocked because:</strong> ${f(E.blockedReason||"No reason recorded.")} ${E.blockerType?`<br /><span class="soft">Blocker type: ${f(E.blockerType)}</span>`:""}</div>`:""}
          ${E.status==="blocked"&&((ye=E.blockPlan)!=null&&ye.smallestStep||(se=E.blockPlan)!=null&&se.support||(Te=E.blockPlan)!=null&&Te.retryWhen)?`<div class="waiting-note"><strong>Unblock plan:</strong> ${f(E.blockPlan.smallestStep||"Name the smallest next move.")} ${E.blockPlan.support?`<br /><span class="soft">Support: ${f(E.blockPlan.support)}</span>`:""} ${E.blockPlan.retryWhen?`<br /><span class="soft">Retry: ${f(E.blockPlan.retryWhen)}</span>`:""}</div>`:""}
          <ol class="subquest-list">${q}</ol>
        </article>
      </li>
    `}).join("");a.innerHTML=w,document.getElementById("bossPill").textContent=`${B.filter(h=>ie(h)!=="completed").length} threat(s) remain`,d.bindBossEvents()}function v(a,b){const o=ie(a);return o==="available"?`
      <button data-action="start-boss" data-chapter-id="${a.id}">Start boss quest</button>
      <button class="secondary" data-action="block-boss" data-chapter-id="${a.id}">Mark blocked</button>
    `:o==="blocked"?`
      <button data-action="resume-boss" data-chapter-id="${a.id}">Resume boss</button>
      <button class="secondary" data-action="block-boss" data-chapter-id="${a.id}">Change reason</button>
      <button class="danger" data-action="reset-boss" data-chapter-id="${a.id}">Reset boss</button>
    `:o==="completed"?'<button class="secondary" disabled>Boss defeated</button>':`
    <button class="secondary" data-action="block-boss" data-chapter-id="${a.id}">Mark blocked</button>
    <button class="danger" data-action="reset-boss" data-chapter-id="${a.id}">Reset boss</button>
  `}function $(){const a=document.getElementById("rewardTrack"),b=V();a.innerHTML=C.map(w=>{const h=b>=w.at;return`
      <li>
        <article class="reward-card ${h?"unlocked":"locked"}">
          <div class="reward-head">
            <div>
              <div class="title-chip">${h?"✨ Loot unlocked":"🔒 Locked reward"}</div>
              <div class="reward-title" style="margin-top:8px;">🎁 ${w.title}</div>
            </div>
            <span class="status-label ${h?"completed":"locked"}">${h?"✓ Unlocked":"🔒 Locked"}</span>
          </div>
          <div class="reward-copy">${w.copy}</div>
          <div class="soft">Unlocks at ${w.at} main quests cleared.</div>
        </article>
      </li>
    `}).join("");const o=C.filter(w=>b>=w.at).length;document.getElementById("rewardPill").textContent=o?`${o} reward tier(s) unlocked`:"Rewards locked"}function g(){document.getElementById("rescueList").innerHTML=P.map(a=>`
    <li>
      <details class="rescue-card">
        <summary>${a.title}</summary>
        <p class="rescue-copy" style="margin-top:10px;">${a.copy}</p>
      </details>
    </li>
  `).join("")}function ge(){document.getElementById("budgetExamples").innerHTML=I.map(a=>`
    <article class="budget-card">
      <div class="budget-head">
        <div class="budget-title">${a.title}</div>
        <span class="budget-total">${a.total}</span>
      </div>
      <ul class="cost-list">
        ${a.items.map(b=>`<li>${b}</li>`).join("")}
      </ul>
    </article>
  `).join("")}function Me(){var te,X;const a=document.getElementById("campaignSetupOverlay"),b=document.getElementById("campaignSetupBody"),o=document.getElementById("campaignSetupBack"),w=document.getElementById("campaignSetupNext"),h=Math.min(u.campaign.step||0,2);u.campaign.step=h;const k=3,x=`<div class="quest-special"><strong>Character so far</strong><div class="soft">${[u.characterName?`Hero: ${f(u.characterName)}`:"Hero: unnamed",(te=D())!=null&&te.title?`Origin: ${f(D().title)}`:"Origin: choose one",u.classId?`Class: ${f(((X=r.find(q=>q.id===u.classId))==null?void 0:X.name)||u.classId)}`:"Class: choose one"].join(" • ")}</div></div>`;if(u.campaign.complete){a.hidden=!0,document.body.classList.remove("overlay-open");return}if(a.hidden&&(y.lastSetupFocusBeforeDialog=document.activeElement),a.hidden=!1,document.body.classList.add("overlay-open"),document.getElementById("campaignSetupTitle").textContent="Forge Your Character — Required Setup",document.getElementById("campaignSetupStepCount").textContent=`Step ${Math.min(h+1,k)} of ${k}`,o.style.visibility=h===0?"hidden":"visible",w.textContent=h>=k-1?"Begin campaign":"Next",h===0?(b.innerHTML=`
      <div class="setup-grid">
        ${x}
        <div class="field-stack">
          <label class="field-label" for="setupCharacterName">What is your hero called?</label>
          <input class="text-input" id="setupCharacterName" type="text" maxlength="60" placeholder="Unnamed Hero" value="${R(u.characterName||"")}" />
          <div class="setup-copy">Name them, then let action fill in the rest.</div>
        </div>
        <div class="setup-copy">Choose the current situation that feels closest. It guides the tone, not your fate.</div>
        <ul class="setup-choice-list">${we.map(q=>`<li><button type="button" class="setup-choice ${u.campaign.origin===q.id?"active":""}" data-setup-choice="origin" data-setup-value="${q.id}"><div class="setup-choice-title">${q.title}</div><div class="setup-copy">${q.copy}</div></button></li>`).join("")}</ul>
      </div>
    `,b.querySelector("#setupCharacterName").focus(),b.querySelector("#setupCharacterName").addEventListener("input",q=>{u.characterName=q.target.value})):h===1?b.innerHTML=`<div class="setup-grid">${x}<div class="setup-copy">Choose the playstyle that helps you win most consistently.</div><ul class="setup-choice-list">${r.map(q=>`<li><button type="button" class="setup-choice ${u.classId===q.id?"active":""}" data-setup-choice="classId" data-setup-value="${q.id}"><div class="setup-choice-title">${q.emoji} ${q.name}</div><div class="setup-copy">${q.note}</div><div class="setup-copy"><strong>How you win:</strong> ${q.perk}</div></button></li>`).join("")}</ul></div>`:b.innerHTML=`<div class="setup-grid">${x}<div class="setup-copy">Pick the reason this campaign matters, then choose one tiny proof action.</div><ul class="setup-choice-list">${he.map(q=>`<li><button type="button" class="setup-choice ${u.campaign.motivation===q.id?"active":""}" data-setup-choice="motivation" data-setup-value="${q.id}"><div class="setup-choice-title">${q.title}</div><div class="setup-copy">${q.copy}</div></button></li>`).join("")}</ul><div class="setup-copy">Choose one tiny proof action. It does not need to be heroic. It needs to be real.</div><ul class="setup-choice-list">${O.map(q=>`<li><button type="button" class="setup-choice ${u.campaign.firstProof===q.id?"active":""}" data-setup-choice="firstProof" data-setup-value="${q.id}"><div class="setup-choice-title">${q.title}</div><div class="setup-copy">${q.copy}</div></button></li>`).join("")}</ul></div>`,b.querySelectorAll("[data-setup-choice]").forEach(q=>{q.addEventListener("click",()=>{const ye=q.dataset.setupChoice,se=q.dataset.setupValue;ye==="classId"?u.classId=se:u.campaign[ye]=se,Me()})}),h!==0){const q=b.querySelector(".setup-choice.active")||b.querySelector("[data-setup-choice]")||w;q&&q.focus()}}function Oe(){[["bosses","Bosses","bossPanelBody","toggleBossSection"],["rewards","Rewards","rewardPanelBody","toggleRewardSection"],["rescue","Rescue kit","rescuePanelBody","toggleRescueSection"],["budget","Budget guide","budgetPanelBody","toggleBudgetSection"]].forEach(([b,o,w,h])=>{const k=document.getElementById(w),E=document.getElementById(h),x=!!u.settings.collapsedSections[b];k.classList.toggle("is-collapsed",x),E.setAttribute("aria-expanded",String(!x)),E.textContent=window.innerWidth<=720?x?"Show":"Hide":x?`Show ${o}`:`Hide ${o}`})}return{renderAll:be,renderHeader:W,renderJourney:pe,renderMainQuest:Ce,renderQuestLog:me,renderSupportPanel:_,renderIdentityPanel:n,renderQuestCard:c,renderQuestControls:e,renderClassPanel:t,renderClassConsole:i,renderBossPanel:p,renderBossControls:v,renderRewardPanel:$,renderRescuePanel:g,renderBudgetPanel:ge,renderCampaignSetup:Me,renderSectionCollapseStates:Oe}}function rt(d){const{ctx:y,CLASS_DEFS:r,CHAPTERS:P,LEGACY_STORAGE_KEY:C,defaultState:I,saveMeta:ne,loadState:we,saveState:he,hydrateState:O,getCharacterName:oe,getCampaignFirstProof:B,findChapterForQuest:L,getQuestEntry:K,getBossEntry:Be,isChapterUnlocked:V,isChapterComplete:ke,isBossRevealed:H,getBossStatus:A,getBossForChapter:G,getRitualPlanSteps:de,getUnlockedRewardCount:ae,getQuestStatus:j,renderAll:S}=d,{state:l,meta:D}=Fe(y);function z(){const n=["campaignSetupOverlay","questFlowOverlay","timerOverlay"].some(c=>{const e=document.getElementById(c);return e&&!e.hidden});document.body.classList.toggle("overlay-open",n)}function ce(n){const c=L(n).quests.find(t=>t.id===n),e=K(n);e.status="started",e.startedAt=e.startedAt||Date.now(),l.classId==="barbarian"&&f(n,c.title),S(),M(`Quest started: ${c.title}. Objective chain revealed.`)}function J(n){const c=K(n);c.status=(c.subquests&&Object.values(c.subquests).some(Boolean),"started"),S(),M("Quest resumed. Back into the swamp, but with better lighting.")}function Q(n){const c=L(n).quests.find(i=>i.id===n),e=K(n);e.status="started",e.startedAt=e.startedAt||Date.now(),e.bonuses.lowEnergy=!0;const t=c.subquests.filter(i=>i.required).find(i=>!e.subquests[i.id]);if(t&&(e.subquests[t.id]=!0),N(n)){Y(n);return}S(),M(`Low-energy version applied to ${c.title}. One smaller real step is now banked.`)}function F(n){const c=L(n);V(c)&&d.openQuestFlowModal("blocked",n)}function U(n){d.openQuestFlowModal("waiting",n)}function ie(n){if(!confirm("Reset this quest and clear its steps, buffs, and progress?"))return;const c=L(n).quests.find(e=>e.id===n);l.quests[n]={status:"available",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},waitingPlan:{reason:"",followup:"",retryWhen:""},subquests:{},ritualPlan:{},bonuses:{momentum:!1,ritual:!1,rogueCombo:!1,recovery:!1,lowEnergy:!1},startedAt:null,completedAt:null},c.subquests.forEach(e=>{l.quests[n].subquests[e.id]=!1}),c.ritualPlan&&de(c).forEach(e=>{l.quests[n].ritualPlan[e.id]=!1}),S(),M("Quest reset. Sometimes you cleanse the rune circle and start again.")}function Z(n,c,e){const t=L(n).quests.find(v=>v.id===n),i=K(n),p=!!i.subquests[c];if(i.subquests[c]=e,i.status!=="completed"){const $=t.subquests.filter(g=>g.required).filter(g=>i.subquests[g.id]).length;i.status=($>0,"started")}if(!p&&e&&l.classId==="monk"&&t.tags.includes("routine")&&(l.monk.discipline+=1,M(`Discipline gained. Monk reserve now at ${l.monk.discipline}.`)),N(n)){Y(n);return}S()}function qe(n,c,e){const t=K(n);t.ritualPlan[c]=e;const i=L(n).quests.find(v=>v.id===n),p=de(i).every(v=>t.ritualPlan[v.id]);p?t.bonuses.ritual=!0:t.status!=="completed"&&(t.bonuses.ritual=!1),S(),p&&M("Ritual Plan complete. The paperwork demons hate preparation.")}function N(n){const c=L(n).quests.find(v=>v.id===n),e=K(n),t=c.subquests.filter(v=>v.required),i=c.requiredCount||t.length;return t.filter(v=>e.subquests[v.id]).length>=i}function Y(n){const c=L(n).quests.find(p=>p.id===n),e=K(n),t=e.status==="completed",i=ae();e.status="completed",e.completedAt=e.completedAt||Date.now(),!t&&l.classId==="rogue"&&l.rogueRun.active&&c.tags.includes("errand")&&(l.rogueRun.completedQuestIds=Array.from(new Set([...l.rogueRun.completedQuestIds,n])),e.bonuses.rogueCombo=!0,l.rogueRun.completedQuestIds.length>=2&&!l.rogueRun.bonusAwarded&&(l.rogueRun.bonusAwarded=!0,_("Errand Run combo achieved! Two errand quests chained in one outing. That counts as roguish competence.","reward"),M("Combo bonus applied to this run’s quests. Sneaky little efficiency demon.","reward"))),S(),me("quest"),M(`Quest cleared: ${c.title}. Parent quest auto-completed because all required steps are done.`,"reward"),ae()>i&&(me("reward"),_("Loot tier unlocked. Yes, bribery remains one of civilization’s sturdier inventions.","reward")),m(L(n))}function fe(n){const c=P.find(i=>i.id===n),e=G(c),t=l.bosses[e.id];t.status="started",t.startedAt=t.startedAt||Date.now(),S(),M(`Boss quest started: ${e.title}. Time to bully a problem large enough to deserve a title.`)}function $e(n){const c=P.find(t=>t.id===n),e=G(c);l.bosses[e.id].status="started",S(),M("Boss resumed. The monster did not, sadly, solve itself.")}function re(n){const c=P.find(t=>t.id===n),e=G(c);d.openQuestFlowModal("boss-blocked",e.id,"boss")}function Se(n){const c=P.find(t=>t.id===n),e=G(c);confirm(`Reset ${e.title} and clear all boss objectives?`)&&(l.bosses[e.id]={status:"available",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},subquests:{},bonuses:{},startedAt:null,completedAt:null},e.subquests.forEach(t=>{l.bosses[e.id].subquests[t.id]=!1}),S(),M("Boss reset. Sometimes the dragon wins round one."))}function Ee(n,c,e){const t=P.flatMap(p=>p.bossPool).find(p=>p.id===n),i=l.bosses[n];if(i.subquests[c]=e,i.status!=="completed"&&(i.status="started"),t.subquests.every(p=>i.subquests[p.id])){s(n);return}S()}function s(n){const c=P.find(i=>G(i).id===n),e=G(c),t=l.bosses[n];t.status="completed",t.completedAt=t.completedAt||Date.now(),S(),me("boss"),_(`Boss defeated: ${e.title}. Chapter ${c.level} bends the knee.`,"boss"),m(c)}function m(n){ke(n)?(me("chapter"),n.level<P.length?_(`Level ${n.level} complete. ${P[n.level].title} is now unlocked.`,"chapter"):_("All chapters complete. The Independent Keep is no longer theory.","chapter")):H(n)&&A(n)==="available"&&M(`Boss revealed in ${n.title}: ${G(n).title}. Naturally, it showed up when things got interesting.`,"boss")}function f(n,c){y.activeTimerQuestId=n;const e=document.getElementById("timerOverlay");y.lastFocusBeforeDialog=document.activeElement,e.hidden=!1,z(),document.getElementById("timerQuestCopy").textContent=`Quest started: ${c}. Touch it within 60 seconds for the Momentum buff.`;let t=60;document.getElementById("timerCount").textContent=t,window.requestAnimationFrame(()=>{document.getElementById("confirmMomentum").focus()}),clearInterval(y.timerInterval),y.timerInterval=setInterval(()=>{t-=1,document.getElementById("timerCount").textContent=t,t<=0&&(clearInterval(y.timerInterval),R(),M("Start Sprint expired. No bonus, but the quest is still live. Move anyway."))},1e3)}function R(){clearInterval(y.timerInterval),y.timerInterval=null,y.activeTimerQuestId=null,document.getElementById("timerOverlay").hidden=!0,z(),y.lastFocusBeforeDialog&&typeof y.lastFocusBeforeDialog.focus=="function"&&y.lastFocusBeforeDialog.focus(),y.lastFocusBeforeDialog=null}function u(){if(l.monk.discipline<3)return;const n=P.flatMap(t=>t.quests).find(t=>K(t.id).status==="blocked");if(!n){M("No blocked quest available for Recovery Stance. Impressive, honestly.");return}const c=K(n.id);c.status="started",c.blockedReason="",c.bonuses.recovery=!0;const e=n.subquests.find(t=>!c.subquests[t.id]);if(e&&(c.subquests[e.id]=!0),l.monk.discipline-=3,N(n.id)){Y(n.id);return}S(),_(`Recovery Stance used on ${n.title}. First step cleared and the quest is moving again.`)}function ee(n,c,e){l.supportTasks[n][c]=e,he(),e&&M("Support-party task logged. Coordination: the least flashy buff in the realm.")}function ue(n){n!==D.currentSlot&&(he(),D.currentSlot=n,ne(),y.state=we(n),O(),S(),_(`Save slot ${n.replace("slot","")} loaded. Hero now bound to ${oe()}.`))}function be(){const n={exportedAt:new Date().toISOString(),slotId:D.currentSlot,characterName:oe(),state:l},c=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),e=URL.createObjectURL(c),t=document.createElement("a"),i=oe().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"unnamed-hero";t.href=e,t.download=`independence-campaign-${i}-${D.currentSlot}.json`,document.body.appendChild(t),t.click(),t.remove(),URL.revokeObjectURL(e),M("Current save exported. Your campaign is now bottled against disaster.")}async function W(n){const c=n.target.files&&n.target.files[0];if(c)try{const e=await c.text(),t=JSON.parse(e);if(!t||typeof t!="object"||!t.state||typeof t.state!="object")throw new Error("File did not contain a valid campaign state.");if(typeof t.state.version!="number")throw new Error("Imported file is missing a supported campaign version.");if(!confirm(`Import this save into slot ${D.currentSlot.replace("slot","")}? Current progress in this slot will be overwritten.`)){n.target.value="";return}const i=l.chapterBosses||{};y.state={...I(),...t.state},(!t.state.chapterBosses||typeof t.state.chapterBosses!="object")&&(l.chapterBosses=i),typeof t.characterName=="string"&&!l.characterName&&(l.characterName=t.characterName),O(),S(),_(`Save imported into slot ${D.currentSlot.replace("slot","")}. The bottle uncorks; the hero remembers.`)}catch(e){console.error(e),_("Import failed. That file was not valid campaign sorcery.")}finally{n.target.value=""}}function pe(n="quest"){if(!l.settings.soundEnabled)return;const c=window.AudioContext||window.webkitAudioContext;if(c)try{pe.ctx||(pe.ctx=new c);const e=pe.ctx,t=e.currentTime;({toggle:[520,660],quest:[440,660],reward:[523,659,784],boss:[330,440,554,740],chapter:[392,523,659,880]}[n]||[440,660]).forEach((p,v)=>{const $=e.createOscillator(),g=e.createGain();$.type=n==="boss"?"triangle":"sine",$.frequency.value=p,g.gain.setValueAtTime(1e-4,t+v*.08),g.gain.exponentialRampToValueAtTime(.05,t+v*.08+.01),g.gain.exponentialRampToValueAtTime(1e-4,t+v*.08+.18),$.connect(g),g.connect(e.destination),$.start(t+v*.08),$.stop(t+v*.08+.2)})}catch(e){console.warn("Sound effect failed.",e)}}function Ce(n="quest"){if(!l.settings.effectsEnabled)return;const c=document.getElementById("particleLayer"),e={quest:["#73e2a7","#ffd166","#7cc6fe"],reward:["#ffd166","#c7a6ff","#ffffff"],boss:["#ff5fa2","#ffd166","#ffffff"],chapter:["#73e2a7","#ffd166","#c7a6ff","#7cc6fe"]},t=e[n]||e.quest,i=n==="chapter"?34:n==="boss"?28:18,p=Math.round(window.innerWidth*(.55+Math.random()*.1)),v=Math.round(window.innerHeight*(n==="chapter"?.34:.72));for(let $=0;$<i;$+=1){const g=document.createElement("span");g.className=`particle ${Math.random()>.55?"square":""}`,g.style.left=`${p}px`,g.style.top=`${v}px`,g.style.color=t[Math.floor(Math.random()*t.length)],g.style.background=g.style.color,g.style.setProperty("--dx",`${Math.round((Math.random()-.5)*280)}px`),g.style.setProperty("--dy",`${Math.round((Math.random()-.8)*220)}px`),c.appendChild(g),g.addEventListener("animationend",()=>g.remove(),{once:!0})}}function me(n="quest"){pe(n),Ce(n)}function M(n,c="default"){const e=document.getElementById("toast");e.innerHTML=n,e.dataset.kind=c,e.classList.add("show"),clearTimeout(e._timer),e._timer=setTimeout(()=>e.classList.remove("show"),3200)}function _(n,c="default"){const e=document.getElementById("banner");e.innerHTML=n,e.dataset.kind=c,e.classList.add("show"),clearTimeout(e._timer),e._timer=setTimeout(()=>e.classList.remove("show"),4800)}return{startQuest:ce,resumeQuest:J,useLowEnergyVersion:Q,blockQuest:F,markQuestWaiting:U,resetQuest:ie,toggleSubquest:Z,toggleRitualStep:qe,allRequiredQuestStepsDone:N,completeQuest:Y,startBoss:fe,resumeBoss:$e,blockBoss:re,resetBoss:Se,toggleBossSubquest:Ee,completeBoss:s,maybeAnnounceChapterEvents:m,launchTimer:f,closeTimerOverlay:R,useRecoveryStance:u,toggleSupportTask:ee,switchSaveSlot:ue,exportCurrentSave:be,importSaveFile:W,playTone:pe,burstParticles:Ce,celebrate:me,showToast:M,showBanner:_}}function lt(d){const{ctx:y,CLASS_DEFS:r,CHAPTERS:P,defaultState:C,saveState:I,hydrateState:ne,getStorageKey:we,getCurrentChapter:he,getNextMove:O,getCharacterName:oe,getCampaignFirstProof:B,getQuestEntry:L,getBossEntry:K,getQuestStatus:Be,findChapterForQuest:V,syncSlotName:ke,escapeAttr:H,renderAll:A,renderHeader:G,renderIdentityPanel:de,renderCampaignSetup:ae,renderSectionCollapseStates:j,playTone:S}=d,{state:l,meta:D}=Fe(y);function z(){const s=["campaignSetupOverlay","questFlowOverlay","timerOverlay"].some(m=>{const f=document.getElementById(m);return f&&!f.hidden});document.body.classList.toggle("overlay-open",s)}function ce(){document.getElementById("nextMoveButton").addEventListener("click",()=>{J()}),document.getElementById("jumpToCurrent").addEventListener("click",()=>{document.getElementById(`chapter-${he().id}`).scrollIntoView({behavior:"smooth",block:"start"})}),document.getElementById("toggleMapView").addEventListener("click",()=>{l.settings.showFullMap=!l.settings.showFullMap,A(),d.showToast(l.settings.showFullMap?"Full map revealed. Behold the whole cursed road.":"Guided lane restored. One chapter at a time.")}),document.getElementById("toggleFocusMode").addEventListener("click",()=>{l.settings.focusMode=!l.settings.focusMode,A(),d.showToast(l.settings.focusMode?"Focus mode enabled. Only the current chapter and rescue tools remain on stage.":"Focus mode disabled. The rest of the campaign wanders back into view.")}),document.getElementById("jumpToRescue").addEventListener("click",()=>{l.settings.collapsedSections.rescue=!1,j(),document.getElementById("rescueSection").scrollIntoView({behavior:"smooth",block:"start"}),d.showToast("ADHD Rescue Kit opened. We are not waiting for divine motivation.")}),document.getElementById("printCharacterSheet").addEventListener("click",()=>{window.print()}),document.getElementById("toggleFamilyMode").addEventListener("click",()=>{l.settings.familyMode=!l.settings.familyMode,A(),d.showToast(l.settings.familyMode?"Family support mode enabled. Support-party quests are now visible.":"Family support mode disabled. The side-party fades back into the shadows.")}),document.getElementById("toggleBossSection").addEventListener("click",()=>U("bosses")),document.getElementById("toggleRewardSection").addEventListener("click",()=>U("rewards")),document.getElementById("toggleRescueSection").addEventListener("click",()=>U("rescue")),document.getElementById("toggleBudgetSection").addEventListener("click",()=>U("budget")),document.getElementById("resetCampaign").addEventListener("click",()=>{confirm(`Reset the campaign in slot ${D.currentSlot.replace("slot","")} only? Boss rolls, quest progress, class choice, XP, and stored buffs in this slot will all be wiped.`)&&(y.state=C(),ne(),A(),d.showToast("Campaign reset. The hero returns to Base Camp, still alive and mildly annoyed."))}),document.getElementById("confirmMomentum").addEventListener("click",()=>{if(!y.activeTimerQuestId)return;const s=L(y.activeTimerQuestId);s.bonuses.momentum=!0,d.closeTimerOverlay(),A(),d.showToast("Momentum buff secured: +10 XP when this quest clears. Hit first, brood later.")}),document.getElementById("skipMomentum").addEventListener("click",()=>{d.closeTimerOverlay(),d.showToast("No Momentum buff this time. Fine. Still start the quest like a respectable goblin.")}),document.getElementById("timerOverlay").addEventListener("keydown",Y),document.getElementById("campaignSetupOverlay").addEventListener("keydown",fe),document.getElementById("campaignSetupBack").addEventListener("click",Q),document.getElementById("campaignSetupNext").addEventListener("click",F),document.getElementById("questFlowOverlay").addEventListener("keydown",Ee),document.getElementById("questFlowCancel").addEventListener("click",re),document.getElementById("questFlowSubmit").addEventListener("click",Se),window.addEventListener("storage",s=>{s.key===we(D.currentSlot)&&d.showBanner("This save slot changed in another tab or window. Reload the slot if you want the newest version.")})}function J(){const s=O();if(s.action==="open-setup"){l.campaign.complete=!1,ae(),document.getElementById("campaignSetupOverlay").hidden=!1;return}if(s.action==="complete-first-proof"){l.campaign.firstProofDone=!0,A(),d.celebrate("quest"),d.showToast("First proof logged. Good. The campaign now begins on evidence instead of optimism.");return}if(s.action==="start-quest"&&s.questId){d.startQuest(s.questId);return}if(s.action==="scroll-quest"&&s.questId){const m=document.querySelector(`[data-quest-card="${s.questId}"]`);m&&m.scrollIntoView({behavior:"smooth",block:"center"}),d.showToast(`Back to ${s.heading}. One useful click beats ceremonial dithering.`);return}if(s.action==="start-boss"&&s.chapterId){d.startBoss(s.chapterId);return}document.getElementById("journeySection").scrollIntoView({behavior:"smooth",block:"start"})}function Q(){l.campaign.step=Math.max((l.campaign.step||0)-1,0),ae()}function F(){var m;const s=l.campaign.step||0;if(s===0&&!(l.characterName||"").trim()){d.showToast("Name the hero first. Anonymous adventurers make paperwork worse.");return}if(s===0&&!l.campaign.origin){d.showToast("Choose the current situation so the campaign knows which swamp you are standing in.");return}if(s===1&&!l.classId){d.showToast("Choose a class. Even chaos benefits from a build.");return}if(s===2&&!l.campaign.motivation){d.showToast("Choose a motivation. It matters when the vibes fail.");return}if(s===2&&!l.campaign.firstProof){d.showToast("Choose one tiny proof action to begin the campaign.");return}if(s>=2){l.campaign.complete=!0,l.campaign.firstProofDone=!1,l.campaign.vow=l.campaign.vow||"",l.campaign.pathMode=l.campaign.pathMode||"guided",l.settings.showFullMap=!1,A(),window.requestAnimationFrame(()=>{const f=document.getElementById("nextMoveButton")||y.lastSetupFocusBeforeDialog;f&&typeof f.focus=="function"&&f.focus(),y.lastSetupFocusBeforeDialog=null}),d.celebrate("chapter"),d.showBanner(`${oe()} enters the campaign. First proof: ${((m=B())==null?void 0:m.title)||"survive the day with style"}. Do that in real life, then hit Next Move when you come back.`,"chapter");return}l.campaign.step=s+1,ae()}function U(s){l.settings.collapsedSections[s]=!l.settings.collapsedSections[s],j(),I()}function ie(){const s=document.getElementById("characterNameInput");s.oninput=m=>{l.characterName=m.target.value,ke(),I(),G(),de()},document.querySelectorAll("[data-slot-id]").forEach(m=>{m.onclick=()=>d.switchSaveSlot(m.dataset.slotId)}),document.getElementById("toggleSound").onclick=()=>{l.settings.soundEnabled=!l.settings.soundEnabled,de(),I(),d.showToast(`Sound ${l.settings.soundEnabled?"enabled":"muted"}.`),l.settings.soundEnabled&&S("toggle")},document.getElementById("toggleEffects").onclick=()=>{l.settings.effectsEnabled=!l.settings.effectsEnabled,de(),I(),d.showToast(`Effects ${l.settings.effectsEnabled?"enabled":"disabled"}.`)},document.getElementById("exportSave").onclick=d.exportCurrentSave,document.getElementById("importSave").onclick=()=>document.getElementById("importFile").click(),document.getElementById("importFile").onchange=d.importSaveFile}function Z(){document.querySelectorAll('input[name="classId"]').forEach(R=>{R.addEventListener("change",u=>{l.classId=u.target.value,l.classId!=="rogue"&&(l.rogueRun={active:!1,completedQuestIds:[],bonusAwarded:!1}),A(),d.showBanner(`${r.find(ee=>ee.id===l.classId).name} chosen. Mechanical perk engaged.`)})});const s=document.getElementById("startErrandRun");s&&s.addEventListener("click",()=>{l.rogueRun={active:!0,completedQuestIds:[],bonusAwarded:!1},A(),d.showToast("Errand Run started. Chain two errand quests before the run ends for combo XP.")});const m=document.getElementById("endErrandRun");m&&m.addEventListener("click",()=>{l.rogueRun={active:!1,completedQuestIds:[],bonusAwarded:!1},A(),d.showToast("Errand Run ended. Pocket your daggers and hydrate.")});const f=document.getElementById("useRecoveryStance");f&&f.addEventListener("click",()=>{d.useRecoveryStance()})}function qe(){document.querySelectorAll('[data-action="start-quest"]').forEach(s=>{s.addEventListener("click",()=>d.startQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="resume-quest"]').forEach(s=>{s.addEventListener("click",()=>d.resumeQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="block-quest"]').forEach(s=>{s.addEventListener("click",()=>d.blockQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="waiting-quest"]').forEach(s=>{s.addEventListener("click",()=>d.markQuestWaiting(s.dataset.questId))}),document.querySelectorAll('[data-action="low-energy"]').forEach(s=>{s.addEventListener("click",()=>d.useLowEnergyVersion(s.dataset.questId))}),document.querySelectorAll('[data-action="reset-quest"]').forEach(s=>{s.addEventListener("click",()=>d.resetQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="review-quest"]').forEach(s=>{s.addEventListener("click",()=>{const m=document.querySelector(`[data-quest-card="${s.dataset.questId}"]`);m&&m.scrollIntoView({behavior:"smooth",block:"center"})})}),document.querySelectorAll("[data-subquest-id]").forEach(s=>{s.addEventListener("change",m=>{const f=m.target.dataset.questId,R=m.target.dataset.subquestId;d.toggleSubquest(f,R,m.target.checked)})}),document.querySelectorAll("[data-ritual-step]").forEach(s=>{s.addEventListener("change",m=>{const f=m.target.dataset.questId,R=m.target.dataset.ritualStep;d.toggleRitualStep(f,R,m.target.checked)})}),document.querySelectorAll("[data-support-task-id]").forEach(s=>{s.addEventListener("change",m=>{d.toggleSupportTask(m.target.dataset.supportChapterId,m.target.dataset.supportTaskId,m.target.checked)})})}function N(){document.querySelectorAll('[data-action="start-boss"]').forEach(s=>{s.addEventListener("click",()=>d.startBoss(s.dataset.chapterId))}),document.querySelectorAll('[data-action="resume-boss"]').forEach(s=>{s.addEventListener("click",()=>d.resumeBoss(s.dataset.chapterId))}),document.querySelectorAll('[data-action="block-boss"]').forEach(s=>{s.addEventListener("click",()=>d.blockBoss(s.dataset.chapterId))}),document.querySelectorAll('[data-action="reset-boss"]').forEach(s=>{s.addEventListener("click",()=>d.resetBoss(s.dataset.chapterId))}),document.querySelectorAll("[data-boss-subquest-id]").forEach(s=>{s.addEventListener("change",m=>{const f=m.target.dataset.bossId,R=m.target.dataset.bossSubquestId;d.toggleBossSubquest(f,R,m.target.checked)})})}function Y(s){if(document.getElementById("timerOverlay").hidden)return;if(s.key==="Escape"){s.preventDefault(),d.closeTimerOverlay(),d.showToast("Start Sprint dismissed. The quest remains. So does fate.");return}if(s.key!=="Tab")return;const m=[document.getElementById("confirmMomentum"),document.getElementById("skipMomentum")].filter(Boolean),f=m.indexOf(document.activeElement);s.shiftKey?f<=0&&(s.preventDefault(),m[m.length-1].focus()):f===m.length-1&&(s.preventDefault(),m[0].focus())}function fe(s){const m=document.getElementById("campaignSetupOverlay");if(m.hidden)return;if(s.key==="Escape"){s.preventDefault(),d.showToast("Character setup is required before the campaign begins. One more ritual, then glory.");return}if(s.key!=="Tab")return;const f=Array.from(m.querySelectorAll("button:not([disabled]), input:not([disabled])")).filter(u=>u.offsetParent!==null||u===document.activeElement);if(!f.length)return;const R=f.indexOf(document.activeElement);s.shiftKey?R<=0&&(s.preventDefault(),f[f.length-1].focus()):R===f.length-1&&(s.preventDefault(),f[0].focus())}function $e(s,m,f="quest"){const R=f==="quest"?V(m).quests.find(W=>W.id===m):P.flatMap(W=>W.bossPool).find(W=>W.id===m),u=f==="quest"?L(m):l.bosses[m],ee=document.getElementById("questFlowOverlay"),ue=document.getElementById("questFlowBody");y.lastQuestFlowFocusBeforeDialog=document.activeElement,y.questFlowContext={mode:s,targetId:m,targetType:f},document.getElementById("questFlowEyebrow").textContent=R.title;const be=s==="blocked"||s==="boss-blocked";document.getElementById("questFlowTitle").textContent=be?"Build an unblock plan":"Mark as waiting",document.getElementById("questFlowCopy").textContent=be?"Name the blocker and the smallest bridge back in.":"Waiting is real progress if you set the follow-up cleanly.",ue.innerHTML=be?`
      <div class="setup-grid">
        <div class="field-stack"><label class="field-label" for="questBlockReason">What is blocking this ${f==="boss"?"boss":"quest"}?</label><input class="text-input" id="questBlockReason" type="text" value="${H(u.blockedReason||"")}" placeholder="Needs money, low energy, fear, no ride..." /></div>
        <div class="field-stack"><label class="field-label" for="questBlockType">Blocker type</label><input class="text-input" id="questBlockType" type="text" value="${H(u.blockerType||"")}" placeholder="energy, money, fear, waiting, transportation, confusion, conflict" /></div>
        <div class="field-stack"><label class="field-label" for="questBlockStep">Smallest unblock step</label><input class="text-input" id="questBlockStep" type="text" value="${H(u.blockPlan.smallestStep||"")}" placeholder="Write script, gather number, open doc, clear desk..." /></div>
        <div class="field-stack"><label class="field-label" for="questBlockSupport">Support needed</label><input class="text-input" id="questBlockSupport" type="text" value="${H(u.blockPlan.support||"")}" placeholder="body double, ride, reminder, review" /></div>
        <div class="field-stack"><label class="field-label" for="questBlockRetry">When to retry</label><input class="text-input" id="questBlockRetry" type="text" value="${H(u.blockPlan.retryWhen||"")}" placeholder="tomorrow 2 PM" /></div>
      </div>
    `:`
      <div class="setup-grid">
        <div class="field-stack"><label class="field-label" for="questWaitingReason">What are you waiting on?</label><input class="text-input" id="questWaitingReason" type="text" value="${H(u.waitingPlan.reason||"")}" placeholder="reply, callback, confirmation, document, ride" /></div>
        <div class="field-stack"><label class="field-label" for="questWaitingFollowup">Follow-up move</label><input class="text-input" id="questWaitingFollowup" type="text" value="${H(u.waitingPlan.followup||"")}" placeholder="set reminder, check portal, send nudge" /></div>
        <div class="field-stack"><label class="field-label" for="questWaitingRetry">When to check again</label><input class="text-input" id="questWaitingRetry" type="text" value="${H(u.waitingPlan.retryWhen||"")}" placeholder="Friday morning" /></div>
      </div>
    `,ee.hidden=!1,z(),window.requestAnimationFrame(()=>{const W=ue.querySelector("input");W&&W.focus()})}function re(){document.getElementById("questFlowOverlay").hidden=!0,z(),y.questFlowContext=null,y.lastQuestFlowFocusBeforeDialog&&typeof y.lastQuestFlowFocusBeforeDialog.focus=="function"&&y.lastQuestFlowFocusBeforeDialog.focus(),y.lastQuestFlowFocusBeforeDialog=null}function Se(){const s=y.questFlowContext;if(!s)return;const m=s.targetType==="quest"?L(s.targetId):l.bosses[s.targetId];if(s.mode==="blocked"||s.mode==="boss-blocked"){m.blockedReason=document.getElementById("questBlockReason").value.trim()||"No reason recorded.",m.blockerType=document.getElementById("questBlockType").value.trim(),m.blockPlan={smallestStep:document.getElementById("questBlockStep").value.trim(),support:document.getElementById("questBlockSupport").value.trim(),retryWhen:document.getElementById("questBlockRetry").value.trim()},m.status="blocked",re(),A(),d.showToast(`${s.targetType==="boss"?"Boss":"Quest"} marked blocked, but now with an actual bridge back in.`);return}m.waitingPlan={reason:document.getElementById("questWaitingReason").value.trim(),followup:document.getElementById("questWaitingFollowup").value.trim(),retryWhen:document.getElementById("questWaitingRetry").value.trim()},m.status="waiting",re(),A(),d.showToast("Quest marked waiting. Administrative purgatory now has a follow-up plan.")}function Ee(s){const m=document.getElementById("questFlowOverlay");if(m.hidden)return;if(s.key==="Escape"){s.preventDefault(),re();return}if(s.key!=="Tab")return;const f=Array.from(m.querySelectorAll("button:not([disabled]), input:not([disabled])")).filter(u=>u.offsetParent!==null||u===document.activeElement);if(!f.length)return;const R=f.indexOf(document.activeElement);s.shiftKey?R<=0&&(s.preventDefault(),f[f.length-1].focus()):R===f.length-1&&(s.preventDefault(),f[0].focus())}return{bindGlobalEvents:ce,executeNextMove:J,retreatCampaignSetup:Q,advanceCampaignSetup:F,toggleSectionCollapse:U,bindIdentityEvents:ie,bindClassEvents:Z,bindQuestEvents:qe,bindBossEvents:N,handleTimerKeydown:Y,handleCampaignSetupKeydown:fe,openQuestFlowModal:$e,closeQuestFlowModal:re,submitQuestFlowModal:Se,handleQuestFlowKeydown:Ee}}function dt(d){d.innerHTML=Ze;let y=ke(),r=A(),P=null,C=null,I=null,ne=null,we=null,he=null,O={stateOk:!0,metaOk:!0,lastSavedAt:null,warning:""};const B={ctx:{get state(){return r},set state(e){r=e},get meta(){return y},set meta(e){y=e},persistenceStatus:O,get timerInterval(){return P},set timerInterval(e){P=e},get activeTimerQuestId(){return C},set activeTimerQuestId(e){C=e},get lastFocusBeforeDialog(){return I},set lastFocusBeforeDialog(e){I=e},get lastSetupFocusBeforeDialog(){return ne},set lastSetupFocusBeforeDialog(e){ne=e},get lastQuestFlowFocusBeforeDialog(){return we},set lastQuestFlowFocusBeforeDialog(e){we=e},get questFlowContext(){return he},set questFlowContext(e){he=e}},CLASS_DEFS:et,RESCUE_ITEMS:tt,REWARDS:Ne,BUDGET_EXAMPLES:st,SUPPORT_TASKS:je,CAMPAIGN_ORIGINS:De,CAMPAIGN_MOTIVATIONS:Qe,CAMPAIGN_VOWS:We,CAMPAIGN_FIRST_PROOFS:He,LOW_ENERGY_OPTIONS:nt,CHAPTERS:T,STORAGE_PREFIX:Ge,META_KEY:Ae,LEGACY_STORAGE_KEY:Le,defaultMeta:Re,defaultState:ve,formatDateTime:ot,escapeHtml:Ue,escapeAttr:at,getStorageKey:V,loadMeta:ke,saveMeta:H,loadState:A,saveState:G,hydrateState:de,chooseRandomBossId:ae,getBossForChapter:j,getQuestEntry:S,getBossEntry:l,getChapterIndex:D,isChapterUnlocked:z,isChapterComplete:ce,getCurrentChapter:J,getQuestStatus:Q,questProgress:F,getCompletedQuestCount:U,getCompletedBossCount:ie,getActiveQuestCount:Z,getBlockedQuestCount:qe,getBossStatus:N,isBossRevealed:Y,findChapterForQuest:fe,getLevel:$e,getOverallProgressPercent:re,getTotalXP:Se,getMainQuestStatus:Ee,getCharacterName:s,getCampaignOrigin:m,getCampaignMotivation:f,getCampaignVow:R,getCampaignFirstProof:u,getChapterGlyph:ee,getStatusDisplay:ue,getQuestGrade:be,syncSlotName:W,getSlotLabel:pe,getSlotPreview:Ce,getUnlockedRewardCount:me,getNextMove:_,getNextObjectiveCopy:n,getRitualPlanSteps:c},L=it(B);Object.assign(B,L);const K=rt(B);Object.assign(B,K);const Be=lt(B);Object.assign(B,Be),de(),L.renderAll(),Be.bindGlobalEvents();function V(e=y.currentSlot){return`${Ge}:${e}`}function ke(){try{const e=localStorage.getItem(Ae);return e?{...Re(),...JSON.parse(e)}:Re()}catch(e){return console.warn("Save-slot meta was corrupt. Rebuilding.",e),Re()}}function H(){try{return localStorage.setItem(Ae,JSON.stringify(y)),O.metaOk=!0,!0}catch(e){return O.metaOk=!1,O.warning="Slot metadata could not be saved on this device.",console.warn("Unable to save slot metadata.",e),!1}}function A(e=y.currentSlot){try{const t=localStorage.getItem(V(e))||(e==="slot1"?localStorage.getItem(Le):null);if(!t)return ve();const i=JSON.parse(t);return{...ve(),...i}}catch(t){return console.warn("Campaign save was corrupt. Rebuilding state.",t),ve()}}function G(){try{const e=Date.now(),t={...r,createdAt:r.createdAt||e,updatedAt:e};return localStorage.setItem(V(y.currentSlot),JSON.stringify(t)),r.createdAt=t.createdAt,r.updatedAt=t.updatedAt,O.stateOk=!0,O.lastSavedAt=e,O.metaOk&&(O.warning=""),!0}catch(e){return O.stateOk=!1,O.warning="This browser/device did not confirm saving. Export the slot if you need a backup.",console.warn("Unable to save campaign state.",e),!1}}function de(){r.settings={...ve().settings,...r.settings||{}},r.settings.collapsedSections={...ve().settings.collapsedSections,...r.settings.collapsedSections||{}},r.campaign={...ve().campaign,...r.campaign||{}},r.rogueRun={...ve().rogueRun,...r.rogueRun||{}},r.monk={...ve().monk,...r.monk||{}},r.supportTasks=r.supportTasks||{};const e=Object.values(r.quests||{}).some(t=>t.status&&t.status!=="available")||Object.values(r.bosses||{}).some(t=>t.status&&t.status!=="locked");!r.campaign.complete&&e&&(r.campaign.complete=!0,r.campaign.firstProofDone=r.campaign.firstProofDone||!1,r.campaign.origin=r.campaign.origin||"rebuilding",r.campaign.motivation=r.campaign.motivation||"freedom"),T.forEach(t=>{r.supportTasks[t.id]||(r.supportTasks[t.id]={}),(je[t.id]||[]).forEach(p=>{typeof r.supportTasks[t.id][p.id]!="boolean"&&(r.supportTasks[t.id][p.id]=!1)}),r.chapterBosses[t.id]||(r.chapterBosses[t.id]=ae(t)),t.quests.forEach(p=>{r.quests[p.id]||(r.quests[p.id]={status:"available",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},waitingPlan:{reason:"",followup:"",retryWhen:""},subquests:{},ritualPlan:{},bonuses:{momentum:!1,ritual:!1,rogueCombo:!1,recovery:!1,lowEnergy:!1},startedAt:null,completedAt:null}),r.quests[p.id].blockPlan={smallestStep:"",support:"",retryWhen:"",...r.quests[p.id].blockPlan||{}},r.quests[p.id].waitingPlan={reason:"",followup:"",retryWhen:"",...r.quests[p.id].waitingPlan||{}},r.quests[p.id].bonuses={momentum:!1,ritual:!1,rogueCombo:!1,recovery:!1,lowEnergy:!1,...r.quests[p.id].bonuses||{}},p.subquests.forEach(v=>{typeof r.quests[p.id].subquests[v.id]!="boolean"&&(r.quests[p.id].subquests[v.id]=!1)}),p.ritualPlan&&c(p).forEach(v=>{typeof r.quests[p.id].ritualPlan[v.id]!="boolean"&&(r.quests[p.id].ritualPlan[v.id]=!1)})});const i=j(t);r.bosses[i.id]||(r.bosses[i.id]={status:"locked",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},subquests:{},bonuses:{},startedAt:null,completedAt:null}),r.bosses[i.id].blockPlan={smallestStep:"",support:"",retryWhen:"",...r.bosses[i.id].blockPlan||{}},i.subquests.forEach(p=>{typeof r.bosses[i.id].subquests[p.id]!="boolean"&&(r.bosses[i.id].subquests[p.id]=!1)})}),G(),W()}function ae(e){const t=e.bossPool;return t[Math.floor(Math.random()*t.length)].id}function j(e){return e.bossPool.find(t=>t.id===r.chapterBosses[e.id])||e.bossPool[0]}function S(e){return r.quests[e]}function l(e){return r.bosses[j(e).id]}function D(e){return T.findIndex(t=>t.id===e)}function z(e){const t=D(e.id);return t===0?!0:ce(T[t-1])}function ce(e){return e.quests.every(i=>Q(i,e)==="completed")&&N(e)==="completed"}function J(){return T.find(e=>z(e)&&!ce(e))||T[T.length-1]}function Q(e,t){if(!z(t))return"locked";const i=S(e.id);if(i.status==="completed")return"completed";if(i.status==="waiting")return"waiting";if(i.status==="blocked")return"blocked";const p=e.subquests.filter(g=>g.required),v=e.requiredCount||p.length,$=p.filter(g=>i.subquests[g.id]).length;return $>0&&$<v||$>=v&&v>0?"in-progress":i.status==="started"?"started":"available"}function F(e){const t=S(e.id),i=e.subquests.filter(g=>g.required).length,p=e.subquests.filter(g=>g.required&&t.subquests[g.id]).length,v=e.subquests.filter(g=>!g.required&&t.subquests[g.id]).length,$=e.requiredCount||i;return{required:i,doneRequired:p,optionalDone:v,needed:$}}function U(){return T.flatMap(e=>e.quests).filter(e=>S(e.id).status==="completed").length}function ie(){return T.filter(e=>N(e)==="completed").length}function Z(){return T.flatMap(e=>e.quests).filter(e=>{const t=Q(e,fe(e.id));return t==="started"||t==="in-progress"}).length+T.filter(e=>{const t=N(e);return t==="started"||t==="in-progress"}).length}function qe(){return T.flatMap(e=>e.quests).filter(e=>S(e.id).status==="blocked").length+T.filter(e=>N(e)==="blocked").length}function N(e){const t=j(e),i=r.bosses[t.id];if(!z(e)||!Y(e))return"locked";if(i.status==="completed")return"completed";if(i.status==="blocked")return"blocked";const p=t.subquests.filter(v=>i.subquests[v.id]).length;return p>0&&p<t.subquests.length?"in-progress":i.status==="started"?"started":"available"}function Y(e){return e.quests.filter(i=>S(i.id).status==="completed").length>=e.bossRevealAt}function fe(e){return T.find(t=>t.quests.some(i=>i.id===e))}function $e(){return Math.min(ie()+1,T.length+1)}function re(){const e=T.length*2;let t=0;return T.forEach(i=>{i.quests.every(p=>S(p.id).status==="completed")&&(t+=1),N(i)==="completed"&&(t+=1)}),Math.round(t/e*100)}function Se(){let e=0;return T.forEach(t=>{t.quests.forEach(v=>{const $=S(v.id);v.subquests.forEach(g=>{$.subquests[g.id]&&(e+=g.xp)}),$.status==="completed"&&(e+=v.completionBonus),$.status==="completed"&&$.bonuses.momentum&&(e+=10),$.status==="completed"&&$.bonuses.ritual&&(e+=12),$.status==="completed"&&$.bonuses.recovery&&(e+=6),$.status==="completed"&&$.bonuses.rogueCombo&&(e+=8),$.bonuses.lowEnergy&&(e+=4)});const i=j(t),p=r.bosses[i.id];i.subquests.forEach(v=>{p.subquests[v.id]&&(e+=v.xp)}),p.status==="completed"&&(e+=i.completionBonus)}),e}function Ee(){return T.every(e=>ce(e))?"Independent Living Established":T.every(e=>z(e))?"Launch In Progress":U()>0?"Ready to Launch":"Not yet launched"}function s(){return(r.characterName||"").trim()||"Unnamed Hero"}function m(){return De.find(e=>e.id===r.campaign.origin)||null}function f(){return Qe.find(e=>e.id===r.campaign.motivation)||null}function R(){return We.find(e=>e.id===r.campaign.vow)||null}function u(){return He.find(e=>e.id===r.campaign.firstProof)||null}function ee(e){return{"personal-stability":"🌅","household-competence":"🧹","income-admin":"📜","budget-housing":"🪙","trial-independence":"🏰"}[e.id]||"✨"}function ue(e){return{available:{label:"Available",icon:"✦"},started:{label:"Touched",icon:"•"},"in-progress":{label:"In motion",icon:"➜"},waiting:{label:"Waiting",icon:"⏳"},blocked:{label:"Blocked",icon:"⚠"},completed:{label:"Cleared",icon:"✓"},locked:{label:"Locked",icon:"🔒"}}[e]||{label:e,icon:"•"}}function be(e,t){const i=Q(e,t),p=S(e.id),v=F(e);return i==="completed"?"Cleared":i==="waiting"?"Waiting":i==="blocked"?"Blocked":v.doneRequired>0?"Advanced":p.bonuses.lowEnergy||i==="started"?"Touched":"Unclaimed"}function W(){const e=(r.characterName||"").trim();y.slotNames[y.currentSlot]=e,H()}function pe(e){const t=y.slotNames[e];return t&&t.trim()?t.trim():`Slot ${e.replace("slot","")}`}function Ce(e){try{const t=localStorage.getItem(V(e))||(e==="slot1"?localStorage.getItem(Le):null);return t?JSON.parse(t):null}catch{return null}}function me(){return Ne.filter(e=>U()>=e.at).length}function M(){return T.flatMap(e=>e.quests.map(t=>({chapter:e,quest:t}))).find(({chapter:e,quest:t})=>{const i=Q(t,e);return i==="started"||i==="in-progress"})||null}function _(){var $;if(!r.campaign.complete)return{type:"Character creation",heading:"Begin Chapter 0: Base Camp",copy:"Forge the character first: name, current situation, class, motivation, and one tiny proof action.",button:"Create your character",action:"open-setup"};if(!r.campaign.firstProofDone)return{type:"First proof",heading:(($=u())==null?void 0:$.title)||"Take the first tiny proof action",copy:"Do this one small real-world action, then mark it done so the campaign begins with evidence instead of vibes.",button:"Mark first proof done",action:"complete-first-proof"};const e=M();if(e){const g=F(e.quest),ge=Math.max(g.needed-g.doneRequired,0);return{type:"Resume quest",heading:e.quest.title,copy:ge>0?`${ge} required step${ge===1?"":"s"} left in ${e.chapter.title}.`:`This quest is in motion inside ${e.chapter.title}.`,button:"Resume current quest",action:"scroll-quest",questId:e.quest.id}}const t=T.flatMap(g=>g.quests.map(ge=>({chapter:g,quest:ge}))).find(({quest:g})=>S(g.id).status==="waiting");if(t){const g=S(t.quest.id).waitingPlan;return{type:"Follow-up",heading:t.quest.title,copy:g.followup?`Waiting state active. Next move: ${g.followup}${g.retryWhen?` • retry ${g.retryWhen}`:""}`:"Waiting is still progress if you actually set the follow-up.",button:"Review waiting quest",action:"scroll-quest",questId:t.quest.id}}const i=T.flatMap(g=>g.quests.map(ge=>({chapter:g,quest:ge}))).find(({quest:g})=>S(g.id).status==="blocked");if(i){const g=S(i.quest.id).blockPlan;return{type:"Unblock move",heading:i.quest.title,copy:g.smallestStep?`Smallest bridge back in: ${g.smallestStep}${g.support?` • support: ${g.support}`:""}${g.retryWhen?` • retry ${g.retryWhen}`:""}`:"This quest is blocked. Name the smallest next move instead of arguing with the fog.",button:"Review unblock plan",action:"scroll-quest",questId:i.quest.id}}const p=J(),v=p.quests.find(g=>Q(g,p)==="available");return v?{type:"Start quest",heading:v.title,copy:`Best next move in ${p.title}. Start it and the objective chain will appear instead of lurking in theory.`,button:"Start next quest",action:"start-quest",questId:v.id}:Y(p)&&N(p)!=="completed"?{type:"Boss fight",heading:j(p).title,copy:"The chapter is waiting on its boss. Defeat it and the road opens into the next region.",button:"Fight revealed boss",action:"start-boss",chapterId:p.id}:{type:"Victory lap",heading:"The Independent Keep stands",copy:"You cleared the campaign. At this point the skeleton is just trying not to look proud.",button:"Review the journey",action:"jump-journey"}}function n(){const e=M();if(e){const p=F(e.quest);return`Current objective: ${e.quest.title} — ${p.doneRequired}/${p.needed} needed step(s) cleared.`}const t=J(),i=t.quests.find(p=>Q(p,t)==="available");return i?`Next move: start “${i.title}” in ${t.title}.`:Y(t)&&N(t)!=="completed"?`Boss time: ${j(t).title} is loose in ${t.title}.`:T.every(p=>ce(p))?"The keep is yours. At this point the skeleton is just applauding.":"Keep going. A real campaign beats vague guilt every single time."}function c(e){const t=new Set(e.tags);return[{id:"prep-reminders",title:"Set a reminder or calendar block",xp:0},{id:"prep-supplies",title:t.has("housing")||t.has("budget")?"Gather numbers, links, or documents you will need":"Gather anything needed before starting",xp:0},{id:"prep-script",title:t.has("admin")||t.has("work")?"Write a quick script or checklist for the scary part":"Write the next three actions in plain language",xp:0}]}}const _e=document.getElementById("app");if(!_e)throw new Error("App root #app was not found. The skull has nowhere to manifest.");dt(_e);
