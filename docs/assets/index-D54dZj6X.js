(function(){const y=document.createElement("link").relList;if(y&&y.supports&&y.supports("modulepreload"))return;for(const C of document.querySelectorAll('link[rel="modulepreload"]'))R(C);new MutationObserver(C=>{for(const I of C)if(I.type==="childList")for(const te of I.addedNodes)te.tagName==="LINK"&&te.rel==="modulepreload"&&R(te)}).observe(document,{childList:!0,subtree:!0});function c(C){const I={};return C.integrity&&(I.integrity=C.integrity),C.referrerPolicy&&(I.referrerPolicy=C.referrerPolicy),C.crossOrigin==="use-credentials"?I.credentials="include":C.crossOrigin==="anonymous"?I.credentials="omit":I.credentials="same-origin",I}function R(C){if(C.ep)return;C.ep=!0;const I=c(C);fetch(C.href,I)}})();const Ze=`  <div class="app-shell">
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
            <div class="name-actions">
              <button id="saveCharacterName">Submit name</button>
              <button id="editCharacterName" class="secondary">Edit name</button>
            </div>
            <div class="small-note" id="nameLockCopy">Submit the name to lock it in before wandering onward.</div>
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
`,et=[{id:"barbarian",emoji:"🪓",name:"Barbarian of Momentum",perk:"Every quest start triggers a 60-second Start Sprint. Confirm one physical first action to earn a Momentum XP bonus.",note:"Best for brains that get weaker the longer they think. Hit the thing before the dread committee assembles."},{id:"rogue",emoji:"🗡️",name:"Rogue of Errands",perk:"Start an Errand Run and chain two eligible quests in the same outing for a combo XP reward.",note:"Best for people who thrive on quick wins, outside missions, and sneaky practical progress."},{id:"wizard",emoji:"📜",name:"Wizard of Life Admin",perk:"Admin, work, budget, and housing quests reveal a Ritual Plan. Complete the prep ritual for bonus XP and cleaner execution.",note:"Best for people whose brains calm down when checklists, reminders, scripts, and documents are all named out loud."},{id:"monk",emoji:"🕯️",name:"Monk of Routine",perk:"Routine subquests build Discipline. Spend 3 Discipline on Recovery Stance to rescue a blocked quest and auto-clear its first step.",note:"Best for people whose entire mortal situation improves when the basics stop being random."}],tt=[{title:"I am stuck and hissing at the furniture",copy:"Pick the smallest visible action. Start a 5-minute timer. Touch the task before judging whether it deserves a sermon."},{title:"I am overwhelmed by everything everywhere all at once",copy:"Write exactly three things: one must-do, one should-do, one easy win. Anything beyond that is decorative suffering."},{title:"I forgot everything",copy:"Check the quest log, check the calendar, check messages, then choose one next action. Memory is not a reliable storage format."},{title:"I do not want to do the thing",copy:"Promise yourself five ugly minutes only. If you still hate it after five honest minutes, reassess. Usually momentum does the heavy lifting."},{title:"Low-energy mode only",copy:"Do a micro quest: trash, one sink load of dishes, one email, one shower, or a 10-minute room reset. Tiny counts."},{title:"Avoidance goblin is nesting",copy:"Use body doubling, music, a visible timer, or narrate the next action out loud. Silence and ambiguity are goblin food."}],Ne=[{at:3,title:"Minor Loot Drop",copy:"Choose dinner, a favorite snack, or guilt-free game time."},{at:6,title:"Level 2 Reward",copy:"Small purchase, nice outing, or a properly smug evening."},{at:9,title:"Rare Loot",copy:"Comfort item, hobby item, or a deliberate lazy night with no guilt tax."},{at:12,title:"Epic Reward",copy:"Something useful and memorable. You are not merely collecting stickers now."},{at:15,title:"Legendary Loot",copy:"Celebrate the fact that this campaign now points at real independence."}],st=[{title:"Shared room / housemates",total:"~$1,480–$1,640",items:["Rent: $850","Electric: $60","Water / sewer / garbage: $40","Internet: $35","Phone: $50","Groceries: $300","Transit: $90 or car costs $250+","Renter’s insurance: $15","Household supplies: $40"]},{title:"Roommate apartment split",total:"~$1,700–$2,000+",items:["Rent share: $1,050","Electric: $70","Water / sewer / garbage: $50","Internet: $40","Phone: $50","Groceries: $325","Transit: $100 or car costs $300+","Renter’s insurance: $15","Household supplies: $50"]},{title:"Solo studio",total:"~$2,230–$2,730+",items:["Rent: $1,450","Electric: $80","Water / sewer / garbage: $60","Internet: $60","Phone: $50","Groceries: $350","Transit: $100 or car costs $300+","Renter’s insurance: $20","Household supplies: $60"]}],je={"personal-stability":[{id:"ps-checkin",title:"Run one calm check-in, not a shame spiral",copy:"Ask what would help today and keep the tone collaborative instead of prosecutorial."},{id:"ps-launchpad",title:"Help set up a visible launch pad",copy:"Create one obvious spot for keys, wallet, meds, or bag so memory is not doing all the labor."},{id:"ps-celebrate",title:"Acknowledge one small win out loud",copy:"Tiny praise works better than theatrical disappointment. Astonishing, I know."}],"household-competence":[{id:"hc-clarify",title:"Clarify one owned chore or expectation",copy:"Write down what belongs to whom so nobody has to interpret kitchen omens."},{id:"hc-stepback",title:"Do not rescue a task too early",copy:"Give the player room to own the chore instead of instantly absorbing it back."},{id:"hc-supplies",title:"Share where supplies and tools live",copy:"Make detergent, trash bags, cleaning spray, and backup soap easy to find."}],"income-admin":[{id:"ia-bodydouble",title:"Offer one body-double session",copy:"Sit nearby while the player applies, calls, or handles forms. Presence is a buff."},{id:"ia-docs",title:"Help gather document locations",copy:"Identify where IDs, insurance, banking details, or résumé files are hiding."},{id:"ia-script",title:"Help script a call or email",copy:"One short script often kills three hours of dread."}],"budget-housing":[{id:"bh-reality",title:"Share real rent and utility examples",copy:"Talk actual numbers so the housing plan stays grounded in reality."},{id:"bh-boundaries",title:"Clarify what support is realistic",copy:"Temporary help, deposits, moving help, deadlines—name it cleanly."},{id:"bh-review",title:"Review the budget without ridicule",copy:"Point out gaps like a strategist, not like an irritated landlord ghost."}],"trial-independence":[{id:"ti-stepback",title:"Let the player own the week",copy:"Avoid hovering. The whole point is seeing what holds when support backs off a little."},{id:"ti-checkpoint",title:"Schedule one checkpoint conversation",copy:"Check progress at a set time instead of turning the whole week into ambient surveillance."},{id:"ti-reward",title:"Help celebrate progress",copy:"When the week works, celebrate it like a real milestone rather than shrugging past it."}]},Qe=[{id:"overwhelmed",title:"Overwhelmed but ready",copy:"You need a clear lane, not another avalanche of advice."},{id:"stuck",title:"Stuck in dependence",copy:"You want real movement, not another month of waiting for motivation to descend from the heavens."},{id:"close",title:"Almost there, needs structure",copy:"You can do a lot already. The missing ingredient is consistency and a saner map."},{id:"rebuilding",title:"Trying again after setbacks",copy:"This is not starting from zero. It is regrouping with better information and less shame."}],De=[{id:"peace",title:"Peace / privacy",copy:"You want a home base that feels calm instead of crowded or chaotic."},{id:"freedom",title:"Freedom / autonomy",copy:"You want your own decisions, your own schedule, and your own damn keys."},{id:"less-conflict",title:"Less conflict at home",copy:"You want fewer pressure points, fewer arguments, and less ambient friction."},{id:"self-proof",title:"Prove to myself I can do it",copy:"You want evidence, not vibes, that you can run your own life."},{id:"target-move",title:"Prepare for a real move-out goal",copy:"There is an actual horizon here, not just an abstract someday."}],We=[{id:"start",title:"I will prove I can start.",copy:"Perfect for action paralysis and stalled momentum."},{id:"finish",title:"I will prove I can finish.",copy:"Best when half-done tasks breed in the dark."},{id:"routine",title:"I will prove I can keep a routine.",copy:"Best when chaos is caused by missing basics, not lack of intelligence."},{id:"admin",title:"I will prove I can face adult admin.",copy:"Best when paperwork and messages are the dragon at the gate."}],He=[{id:"dress",title:"Put on real clothes or handle hygiene",copy:"A tiny declaration that the day has, regrettably, begun."},{id:"water-surface",title:"Drink water and clear one surface",copy:"A humble anti-chaos ritual."},{id:"open-doc",title:"Open the résumé or budget doc",copy:"The door to the scary task counts as a door."},{id:"trash",title:"Take out one bag of trash",copy:"Concrete, visible, and satisfyingly mortal."},{id:"send-message",title:"Send one needed message",copy:"A small act of civilization."}],nt={"morning-summoning":{title:"Low-energy version",copy:"Get out of bed, do one hygiene-or-clothes step, and place one item for tomorrow."},"feed-the-adventurer":{title:"Low-energy version",copy:"Eat something with protein, drink water, and rinse one dish or wipe one spot."},"reset-the-lair":{title:"Low-energy version",copy:"Clear 5 visible items or do one stage of laundry only."},"gold-quest":{title:"Low-energy version",copy:"Open the job board, save one lead, and make the résumé visible."},"communications-ward":{title:"Low-energy version",copy:"Write a call or email script, save the number, and leave the tab open."},"real-survival-budget":{title:"Low-energy version",copy:"Choose one housing model and estimate only rent plus one utility."},"housing-scout":{title:"Low-energy version",copy:"Save 2 real listings. No dissertation required."},"trial-week-charter":{title:"Low-energy version",copy:"Track one day honestly and write what broke first."}},P=[{id:"personal-stability",level:1,title:"Personal Stability",journeyTitle:"Base Camp to the Watchfire",intro:"Wake, wash, feed, and reset the lair like someone expecting to remain among the living.",bossRevealAt:2,quests:[{id:"morning-summoning",title:"Morning Summoning Circle",summary:"Build a morning ritual that gets the day started without demanding perfection at sunrise.",tags:["routine"],completionBonus:16,subquests:[{id:"wake-window",title:"Leave bed or begin wake-up within the target window",xp:10,required:!0},{id:"wash-dress",title:"Handle hygiene or get into daytime clothes",xp:10,required:!0},{id:"launch-pad",title:"Do one ready-for-day action: meds, bag, keys, breakfast setup, or clothes",xp:8,required:!0},{id:"light-reset",title:"Optional: get daylight, breakfast, or a two-minute outside reset",xp:6,required:!1}]},{id:"feed-the-adventurer",title:"Feed the Adventurer",summary:"Get actual fuel in the body instead of running on fog, caffeine, and regret. Low-energy fuel still counts.",tags:["routine","household"],completionBonus:16,subquests:[{id:"cook-meal",title:"Cook one real meal",xp:10,required:!0},{id:"clean-kitchen",title:"Do the dishes or wipe the counter after eating",xp:8,required:!0},{id:"water-move",title:"Drink water and take a 10-minute reset walk",xp:8,required:!0},{id:"leftovers",title:"Optional: pack leftovers or a snack for later",xp:6,required:!1}]},{id:"reset-the-lair",title:"Reset the Lair",summary:"Restore the personal habitat so it stops draining hit points just by existing.",tags:["household","errand"],completionBonus:18,subquests:[{id:"room-reset",title:"Run a 15-minute room reset",xp:10,required:!0},{id:"laundry-cycle",title:"Wash, dry, and put away one load of laundry",xp:10,required:!0},{id:"trash-out",title:"Take out trash and replace the bag",xp:8,required:!0},{id:"calm-talk",title:"Optional: have one calm planning conversation",xp:6,required:!1}]}],bossPool:[{id:"slime-of-disorder",title:"The Slime of Disorder",summary:"A sticky creature made of postponed cleanup, drifting clothes, and suspicious cups.",completionBonus:60,subquests:[{id:"slime-hygiene",title:"Complete hygiene",xp:12,required:!0},{id:"slime-laundry",title:"Finish one full laundry cycle",xp:12,required:!0},{id:"slime-space",title:"Clean the primary personal space",xp:12,required:!0},{id:"slime-meal",title:"Make one meal in the same day",xp:12,required:!0}]},{id:"clockwork-ghoul",title:"The Clockwork Ghoul of Sleep Drift",summary:"This rattling horror feeds on random sleep, skipped mornings, and the phrase “I’ll fix it tomorrow.”",completionBonus:60,subquests:[{id:"ghoul-bedtime",title:"Set tomorrow’s wake time and bedtime",xp:12,required:!0},{id:"ghoul-morning",title:"Complete the morning routine on target",xp:12,required:!0},{id:"ghoul-reset",title:"Do one evening reset before bed",xp:12,required:!0},{id:"ghoul-alarms",title:"Place alarms and clothes for the next day",xp:12,required:!0}]}]},{id:"household-competence",level:2,title:"Shared Household Competence",journeyTitle:"The Town of Chores and Other Dark Arts",intro:"Contribute like a reliable housemate instead of a mysterious indoor weather event.",bossRevealAt:2,quests:[{id:"duty-charter",title:"Household Duty Charter",summary:"Own a recurring chore and stop acting shocked when it comes back next week.",tags:["household","routine"],completionBonus:18,subquests:[{id:"pick-chore",title:"Choose one recurring household chore",xp:8,required:!0},{id:"perform-chore",title:"Do it once without being chased",xp:10,required:!0},{id:"repeat-chore",title:"Do it again on the next scheduled round",xp:10,required:!0},{id:"announce-chore",title:"Optional: tell the household you own it now",xp:6,required:!1}]},{id:"supply-run",title:"Supply Run of Civic Decency",summary:"Feed the house, notice shortages, and prevent soap from becoming folklore.",tags:["errand","household"],completionBonus:18,subquests:[{id:"check-supplies",title:"Check what food or supplies are low",xp:8,required:!0},{id:"join-grocery",title:"Join a grocery or supply run",xp:10,required:!0},{id:"put-away",title:"Put away what came home",xp:8,required:!0},{id:"plan-three-meals",title:"Optional: write down three simple meal ideas",xp:6,required:!1}]},{id:"shared-space-respect",title:"Shared-Space Respect",summary:"Practice the ancient magic of leaving common areas better than you found them.",tags:["household","admin"],completionBonus:18,subquests:[{id:"common-clean",title:"Clean a bathroom or vacuum a common area",xp:10,required:!0},{id:"replace-supply",title:"Replace one depleted shared supply",xp:8,required:!0},{id:"message-back",title:"Respond to one household question or coordination message",xp:8,required:!0},{id:"label-day",title:"Optional: write down a weekly reset day",xp:6,required:!1}]}],bossPool:[{id:"chore-hydra",title:"The Chore Hydra",summary:"Every time one task is ignored, two more grow where it stood.",completionBonus:75,subquests:[{id:"hydra-recurring",title:"Own one recurring chore for a full week",xp:14,required:!0},{id:"hydra-common",title:"Complete a shared-space cleanup",xp:14,required:!0},{id:"hydra-supply",title:"Replace a low household supply without prompting",xp:14,required:!0},{id:"hydra-communication",title:"Resolve one avoided household communication",xp:14,required:!0}]},{id:"negotiation-specter",title:"The Negotiation Specter",summary:"A translucent nightmare that haunts vague expectations and passive-aggressive silence.",completionBonus:75,subquests:[{id:"specter-expectations",title:"Clarify one household expectation",xp:14,required:!0},{id:"specter-clean",title:"Handle a shared-space chore on schedule",xp:14,required:!0},{id:"specter-food",title:"Contribute to a real food run or meal plan",xp:14,required:!0},{id:"specter-checkin",title:"Do one calm weekly check-in conversation",xp:14,required:!0}]}]},{id:"income-admin",level:3,title:"Income and Admin",journeyTitle:"The City of Work, Paperwork, and Bureaucratic Necromancy",intro:"Gather documents, make calls, apply for work, and stab a few forms in the face.",bossRevealAt:2,quests:[{id:"bureaucratic-spellbook",title:"Bureaucratic Spellbook",summary:"Collect the documents and systems that keep adult life from eating you raw.",tags:["admin","work"],completionBonus:22,ritualPlan:!0,subquests:[{id:"gather-docs",title:"Gather ID, banking, insurance, and core documents",xp:10,required:!0},{id:"update-resume",title:"Update the résumé",xp:12,required:!0},{id:"calendar-reminders",title:"Set reminders for one real deadline or appointment",xp:10,required:!0},{id:"password-system",title:"Optional: improve the password or document folder system",xp:8,required:!1}]},{id:"gold-quest",title:"Gold Quest",summary:"Turn vague “I should look for work” energy into smaller, survivable steps that still move the money problem forward.",tags:["work","admin"],completionBonus:22,requiredCount:2,ritualPlan:!0,subquests:[{id:"identify-leads",title:"Scout 3 leads or next-step opportunities",xp:10,required:!0},{id:"apply-three",title:"Send 1–2 real applications or outreach attempts",xp:12,required:!0},{id:"follow-up",title:"Send one follow-up, portal check, or update",xp:10,required:!0},{id:"focus-block",title:"Optional: do one honest 45-minute focus block",xp:8,required:!1}]},{id:"communications-ward",title:"Communications Ward",summary:"Defeat dread by handling messages, calls, and one appointment like a civilized goblin.",tags:["admin","errand"],completionBonus:22,requiredCount:2,ritualPlan:!0,subquests:[{id:"adult-call",title:"Make one adult phone call",xp:10,required:!0},{id:"respond-important",title:"Respond to one important message or email",xp:10,required:!0},{id:"schedule-thing",title:"Schedule or confirm one appointment",xp:10,required:!0},{id:"script-out",title:"Optional: write a call or email script first",xp:8,required:!1}]}],bossPool:[{id:"bureaucratic-wraith",title:"The Bureaucratic Wraith",summary:"An incorporeal horror made of unanswered calls, draft résumés, and expired tabs.",completionBonus:90,subquests:[{id:"wraith-docs",title:"Gather the important documents",xp:16,required:!0},{id:"wraith-resume",title:"Finish the résumé update",xp:16,required:!0},{id:"wraith-call",title:"Make one adult call",xp:16,required:!0},{id:"wraith-apps",title:"Submit 3 real job applications or equivalent outreach",xp:16,required:!0}]},{id:"interview-minotaur",title:"The Interview Minotaur",summary:"It lives in a labyrinth of self-doubt, overthinking, and terrible webcam angles.",completionBonus:90,subquests:[{id:"mino-questions",title:"Practice 3 interview questions aloud",xp:16,required:!0},{id:"mino-leads",title:"Choose 5 leads worth pursuing",xp:16,required:!0},{id:"mino-follow-up",title:"Send one outreach or follow-up",xp:16,required:!0},{id:"mino-calendar",title:"Set reminder blocks for applications",xp:16,required:!0}]}]},{id:"budget-housing",level:4,title:"Budget and Housing Readiness",journeyTitle:"The Road of Rent, Utilities, and Cold Arithmetic",intro:"This is where the fantasy wrapper meets the landlord’s ledger. Deep breaths.",bossRevealAt:2,quests:[{id:"real-survival-budget",title:"Build a Real Survival Budget",summary:"Choose a housing model, estimate the real monthly cost, and compare it to actual income. If the math is ugly, the honest answer still counts as progress.",tags:["budget","housing","admin"],completionBonus:24,ritualPlan:!0,specialPanel:"budget-guide",subquests:[{id:"after-tax-income",title:"Estimate after-tax monthly income",xp:10,required:!0},{id:"housing-model",title:"Choose a housing model: shared room, roommate split, or solo studio",xp:10,required:!0},{id:"utilities-phone",title:"Estimate utilities, internet, and phone",xp:10,required:!0},{id:"food-transport",title:"Estimate groceries, transportation, and supplies",xp:10,required:!0},{id:"compare-total",title:"Compare the total cost to income and call it viable / needs roommate / needs more income",xp:12,required:!0},{id:"savings-target",title:"Optional: choose a monthly savings target",xp:8,required:!1}]},{id:"housing-scout",title:"Housing Scout",summary:"Look at real listings so the move stops being fog and starts being math.",tags:["housing","errand"],completionBonus:24,ritualPlan:!0,subquests:[{id:"find-listings",title:"Research 5 real listings",xp:10,required:!0},{id:"compare-models",title:"Compare shared housing to solo options",xp:10,required:!0},{id:"requirements",title:"Note deposits, screening rules, or move-in requirements",xp:10,required:!0},{id:"shortlist",title:"Optional: shortlist the best 2 options",xp:8,required:!1}]},{id:"move-in-war-chest",title:"Move-In War Chest",summary:"Figure out what the launch really costs before rent jumps out from behind a tree.",tags:["budget","housing"],completionBonus:24,ritualPlan:!0,subquests:[{id:"app-fees",title:"Estimate application fees and deposits",xp:10,required:!0},{id:"first-month",title:"Estimate first month’s rent and utility setup costs",xp:10,required:!0},{id:"basic-setup",title:"Estimate basic household setup costs",xp:10,required:!0},{id:"buffer",title:"Choose an emergency buffer target",xp:10,required:!0},{id:"weekly-contribution",title:"Optional: set a weekly savings contribution",xp:8,required:!1}]}],bossPool:[{id:"rent-lich",title:"The Rent Lich",summary:"Ancient, dry, and powered entirely by deposits, fees, and numbers that must add up.",completionBonus:110,subquests:[{id:"lich-budget",title:"Build the realistic monthly budget",xp:18,required:!0},{id:"lich-movein",title:"Estimate move-in costs",xp:18,required:!0},{id:"lich-options",title:"Compare at least 2 housing paths",xp:18,required:!0},{id:"lich-gap",title:"Name the affordability gap and the next action to close it",xp:18,required:!0}]},{id:"utility-chimera",title:"The Utility Chimera",summary:"One head is electric, one head is internet, one head is groceries, and all of them want money.",completionBonus:110,subquests:[{id:"chimera-rent",title:"Estimate rent by housing model",xp:18,required:!0},{id:"chimera-bills",title:"Estimate all core monthly bills",xp:18,required:!0},{id:"chimera-transport",title:"Estimate transportation cost honestly",xp:18,required:!0},{id:"chimera-viable",title:"Decide whether the plan is viable now or needs more income/support",xp:18,required:!0}]}]},{id:"trial-independence",level:5,title:"Experiment Week",journeyTitle:"The Long March to the Independent Keep",intro:"Run the systems, test the routines, and learn what support still matters. This is an experiment, not a moral exam.",bossRevealAt:2,quests:[{id:"trial-week-charter",title:"Experiment Week Charter",summary:"Run a small independence experiment, track what held, and learn where the system still leaks.",tags:["routine","budget"],completionBonus:28,requiredCount:3,subquests:[{id:"seven-day-plan",title:"Write a 7-day routine plan",xp:10,required:!0},{id:"meals-three-days",title:"Track meals for 2 real days",xp:12,required:!0},{id:"sleep-three-days",title:"Track sleep or wake targets for 2 real days",xp:12,required:!0},{id:"spending-three-days",title:"Track spending or friction points for 2 real days",xp:10,required:!0}]},{id:"solo-ops-day",title:"Solo Ops Day",summary:"Run one full day of chores, food, and admin like a future tenant instead of a guest creature.",tags:["routine","household","admin"],completionBonus:28,subquests:[{id:"solo-laundry",title:"Do laundry start to finish",xp:10,required:!0},{id:"solo-clean",title:"Clean a private or shared space",xp:10,required:!0},{id:"solo-admin",title:"Handle one admin task",xp:10,required:!0},{id:"solo-food",title:"Buy, plan, or prepare food for the day",xp:10,required:!0}]},{id:"launch-plan",title:"Launch Plan",summary:"Choose a target window, map the blockers, and decide the next five moves.",tags:["housing","admin","budget"],completionBonus:28,ritualPlan:!0,subquests:[{id:"move-window",title:"Choose a realistic move-out window",xp:10,required:!0},{id:"support-needs",title:"Name supports, blockers, and failure points",xp:10,required:!0},{id:"five-actions",title:"Write the first 5 concrete actions",xp:12,required:!0},{id:"checkpoint-date",title:"Set the next check-in or checkpoint date",xp:10,required:!0}]}],bossPool:[{id:"trial-week-leviathan",title:"The Trial Week Leviathan",summary:"A huge beast made of routine drift, forgotten meals, and crumpled receipts.",completionBonus:130,subquests:[{id:"leviathan-routine",title:"Run the week plan with visible tracking",xp:20,required:!0},{id:"leviathan-chores",title:"Keep up with chores without rescue prompting",xp:20,required:!0},{id:"leviathan-food",title:"Handle meals like a future independent human",xp:20,required:!0},{id:"leviathan-admin",title:"Complete one admin or money task during the trial week",xp:20,required:!0}]},{id:"gatekeeper-lease-readiness",title:"The Gatekeeper of Lease Readiness",summary:"Not evil, just unimpressed. Wants proof that you can keep the machine running.",completionBonus:130,subquests:[{id:"gate-budget",title:"Review the living budget and move-in fund",xp:20,required:!0},{id:"gate-routine",title:"Demonstrate a stable routine for several days",xp:20,required:!0},{id:"gate-logistics",title:"Confirm housing strategy and next actions",xp:20,required:!0},{id:"gate-support",title:"Name what support remains necessary after launch",xp:20,required:!0}]}]}],Ge="independenceCampaignStateV5",Ae="independenceCampaignMetaV1",Le="independenceCampaignStateV4";function Re(){return{currentSlot:"slot1",slotNames:{slot1:"",slot2:"",slot3:""}}}function ve(){return{classId:"",characterName:"",createdAt:null,updatedAt:null,campaign:{complete:!1,step:0,origin:"",motivation:"",vow:"",firstProof:"",firstProofDone:!1,pathMode:"guided"},quests:{},bosses:{},chapterBosses:{},supportTasks:{},rogueRun:{active:!1,completedQuestIds:[],bonusAwarded:!1},monk:{discipline:0},settings:{soundEnabled:!0,effectsEnabled:!0,familyMode:!1,focusMode:!1,showFullMap:!1,nameLocked:!1,collapsedSections:{bosses:!0,rewards:!0,rescue:!0,budget:!0}},version:5}}function ot(d){if(!d)return"Never";try{return new Date(d).toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return"Unknown time"}}function Ue(d){return d.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function at(d){return Ue(String(d||""))}function Fe(d){const y=c=>new Proxy({},{get(R,C){return d[c][C]},set(R,C,I){return d[c][C]=I,!0},deleteProperty(R,C){return delete d[c][C]},has(R,C){return C in d[c]},ownKeys(){return Reflect.ownKeys(d[c])},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}}});return{state:y("state"),meta:y("meta"),persistenceStatus:y("persistenceStatus")}}function it(d){const{ctx:y,CLASS_DEFS:c,RESCUE_ITEMS:R,REWARDS:C,BUDGET_EXAMPLES:I,SUPPORT_TASKS:te,CAMPAIGN_ORIGINS:we,CAMPAIGN_MOTIVATIONS:me,CAMPAIGN_FIRST_PROOFS:N,LOW_ENERGY_OPTIONS:se,CHAPTERS:B,saveState:F,getLevel:K,getTotalXP:Be,getCompletedQuestCount:V,getCompletedBossCount:fe,getBlockedQuestCount:U,getActiveQuestCount:A,getOverallProgressPercent:_,getNextObjectiveCopy:ne,getMainQuestStatus:oe,getCurrentChapter:D,getCharacterName:S,getNextMove:l,getCampaignOrigin:W,getCampaignMotivation:z,getCampaignVow:de,getBossForChapter:ae,isBossRevealed:H,isChapterComplete:O,isChapterUnlocked:ie,getBossStatus:G,getQuestEntry:J,getQuestStatus:ke,questProgress:j,getSlotPreview:Z,getSlotLabel:be,getRitualPlanSteps:qe,getStatusDisplay:Se,getQuestGrade:ce,getUnlockedRewardCount:Ee,getChapterGlyph:ue,formatDateTime:s,escapeHtml:o,escapeAttr:k}=d,{state:u,meta:x,persistenceStatus:re}=Fe(y);function $e(){var i,f,g;const a=window.scrollX,b=window.scrollY;document.body.classList.toggle("focus-mode",!!u.settings.focusMode),pe(),L(),Ce(),ge(),n(),t(),m(),$(),h(),he(),Me(),Oe(),F(),n(),((i=document.getElementById("campaignSetupOverlay"))==null?void 0:i.hidden)!==!1&&((f=document.getElementById("questFlowOverlay"))==null?void 0:f.hidden)!==!1&&((g=document.getElementById("timerOverlay"))==null?void 0:g.hidden)!==!1&&window.requestAnimationFrame(()=>{window.scrollTo(a,b)})}function pe(){document.getElementById("statLevel").textContent=K(),document.getElementById("statXp").textContent=Be(),document.getElementById("statQuests").textContent=V(),document.getElementById("statBosses").textContent=fe(),document.getElementById("statBlocked").textContent=U(),document.getElementById("statActive").textContent=A();const a=_();document.getElementById("overallProgress").value=a,document.getElementById("progressLabel").textContent=`${a}%`,document.getElementById("nextObjectiveCopy").textContent=ne(),document.getElementById("mainQuestStatus").textContent=oe(),document.getElementById("journeySummaryPill").textContent=`${B.filter(E=>!O(E)).length} chapters still resisting`;const b=D();document.getElementById("currentChapterPill").textContent=`Current chapter: ${b.title}`,document.getElementById("heroNameBanner").textContent=`Current hero: ${S()}. Slot ${x.currentSlot.replace("slot","")} is active.`,document.getElementById("toggleFamilyMode").textContent=`Family support: ${u.settings.familyMode?"on":"off"}`,document.getElementById("toggleFocusMode").textContent=`Focus mode: ${u.settings.focusMode?"on":"off"}`,document.getElementById("toggleMapView").textContent=`World map: ${u.settings.showFullMap?"full":"guided"}`;const i=l();document.getElementById("nextMoveType").textContent=i.type,document.getElementById("nextMoveHeading").textContent=i.heading,document.getElementById("nextMoveCopy").textContent=i.copy,document.getElementById("nextMoveButton").textContent=i.button;const f=W(),g=z(),w=de();document.getElementById("characterSummary").innerHTML=u.campaign.complete?`<strong>${o(S())}</strong> • ${o(f?f.title:"Unknown origin")} • ${o(g?g.title:"No motive chosen")}${w?` • Vow: ${o(w.title)}`:""}`:"Character creation is not finished yet. Begin with a name, a class, and one small proof.",document.getElementById("campaignModeCopy").textContent=u.campaign.complete?`${u.campaign.pathMode==="guided"?"Guided Path":"Free Questing"}${u.settings.showFullMap?" • full map visible":""}`:"Campaign mode not chosen yet."}function L(){const a=document.getElementById("journeyTrack"),b=D(),i=[],f=B.findIndex(w=>w.id===b.id),g=u.campaign.pathMode==="guided"&&!u.settings.showFullMap?B.filter((w,E)=>E===f||E===f+1):B;i.push(`
    <li class="journey-step">
      <article class="journey-card ${V()>0?"complete":"current"}">
        <div class="journey-kicker">Start</div>
        <div class="journey-title-line"><span class="chapter-crest">💀</span><div class="journey-title">Base Camp</div></div>
        ${V()===0?'<div class="journey-token">💀 Here</div>':""}
        <p class="meta-copy">Current habits, current chaos, current reality. The road starts here.</p>
        <div class="journey-footer"><span>Wake-up point</span><span>${V()} quest(s) cleared</span></div>
      </article>
    </li>
  `),g.forEach(w=>{const E=ae(w),T=ie(w),Q=O(w),X=b.id===w.id&&!Q,q=w.quests.filter(ee=>J(ee.id).status==="completed").length,ye=H(w)?E.title:"Boss hidden in the fog";i.push(`
      <li class="journey-step">
        <article class="journey-card ${Q?"complete":""} ${X?"current":""} ${T?"":"locked"}">
          ${X?'<div class="journey-token">🧍 Current</div>':""}
          <div class="journey-kicker">Level ${w.level}</div>
          <div class="journey-title-line"><span class="chapter-crest">${ue(w)}</span><div class="journey-title">${w.title}</div></div>
          <p class="meta-copy">${w.journeyTitle}</p>
          <div class="journey-footer">
            <span>${q}/${w.quests.length} quests cleared</span>
            <span>${ye}</span>
          </div>
        </article>
      </li>
    `)}),g.length!==B.length&&i.push(`
      <li class="journey-step">
        <article class="journey-card locked">
          <div class="journey-kicker">World Map</div>
          <div class="journey-title-line"><span class="chapter-crest">🗺️</span><div class="journey-title">More road ahead</div></div>
          <p class="meta-copy">The guided path is hiding the rest so your brain doesn’t try to swallow the whole castle at once.</p>
          <div class="journey-footer"><span>Use full map to browse later chapters</span><span>${B.length-g.length-f>0?`${B.length-g.length-f} chapter(s) hidden`:"One road at a time"}</span></div>
        </article>
      </li>
    `),i.push(`
    <li class="journey-step">
      <article class="journey-card ${B.every(w=>O(w))?"complete current":""}">
        ${B.every(w=>O(w))?'<div class="journey-token">🏰 Claimed</div>':""}
        <div class="journey-kicker">Ending</div>
        <div class="journey-title-line"><span class="chapter-crest">🏰</span><div class="journey-title">The Independent Keep</div></div>
        <p class="meta-copy">A home plan backed by routines, money math, and enough competence to survive contact with reality.</p>
        <div class="journey-footer"><span>Final destination</span><span>${_()}% journey complete</span></div>
      </article>
    </li>
  `),a.innerHTML=i.join("")}function Ce(){const a=document.getElementById("mainQuestCard"),b=B.map(i=>{const f=ae(i),g=i.quests.filter(E=>J(E.id).status==="completed").length,w=O(i)?"Completed":ie(i)?"Active":"Locked";return`
      <li class="subquest-item ${O(i)?"done":""}">
        <label>
          <input type="checkbox" ${O(i)?"checked":""} disabled aria-hidden="true" />
          <span>
            <strong>${i.title}</strong><br />
            <span class="soft">${g}/${i.quests.length} quests cleared • Boss: ${f.title}</span>
          </span>
          <span class="subquest-xp status-label ${w.toLowerCase()==="active"?"in-progress":w.toLowerCase()}">${w}</span>
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
        <strong>${oe()}</strong>
        <div class="soft">Clear the chapters, beat the bosses, and the campaign upgrades from theory to readiness.</div>
      </div>
    </article>
  `}function ge(){const a=document.getElementById("chapterList"),b=D(),f=(u.settings.focusMode||u.campaign.pathMode==="guided"&&!u.settings.showFullMap?B.filter(g=>g.id===b.id):B).map(g=>{const w=ie(g),E=O(g),T=ae(g),Q=G(g),X=g.quests.map(q=>p(q,g)).join("");return`
      <article class="chapter-card ${b.id===g.id&&!E?"current":""} ${w?"":"locked"}" id="chapter-${g.id}">
        <div class="chapter-top">
          <div>
            <div class="chapter-title-line"><span class="chapter-crest">${ue(g)}</span><div><h3>Level ${g.level}: ${g.title}</h3><div class="chapter-subtitle">${g.journeyTitle}</div></div></div>
            <p class="muted">${g.intro}</p>
          </div>
          <div class="chapter-progress">
            <div class="progress-row">
              <strong>Chapter progress</strong>
              <span>${g.quests.filter(q=>J(q.id).status==="completed").length}/${g.quests.length} quests • Boss ${Q}</span>
            </div>
            <progress max="100" value="${M(g)}"></progress>
            <span class="soft">Boss in this chapter: ${T.title}${H(g)?"":" (reveals after enough quest progress)"}</span>
          </div>
        </div>
        ${w?`<ol class="quest-list">${X}</ol>${Y(g)}`:'<div class="blocked-note">Locked until the previous chapter and boss are cleared. One cannot simply swagger into rent math.</div>'}
      </article>
    `}).join("");a.innerHTML=f,d.bindQuestEvents()}function M(a){const b=a.quests.filter(f=>J(f.id).status==="completed").length/a.quests.length,i=G(a)==="completed"?1:0;return Math.round((b*.7+i*.3)*100)}function Y(a){if(!u.settings.familyMode)return"";const b=te[a.id]||[];return b.length?`
    <section class="support-panel">
      <div class="support-title">🛡️ Support Party Quests</div>
      <div class="support-copy">These are helper tasks for family or allies. They do not replace the player’s work; they reduce chaos around it.</div>
      <ol class="plan-list">${b.map(f=>{const g=!!u.supportTasks[a.id][f.id];return`
      <li class="plan-item ${g?"done":""}">
        <label>
          <input type="checkbox" data-support-chapter-id="${a.id}" data-support-task-id="${f.id}" ${g?"checked":""} />
          <span>
            <strong>${f.title}</strong><br />
            <span class="soft">${f.copy}</span>
          </span>
        </label>
      </li>
    `}).join("")}</ol>
    </section>
  `:""}function n(){const a=document.getElementById("characterNameInput"),b=!!u.settings.nameLocked;(!document.activeElement||document.activeElement!==a||b)&&(a.value=u.characterName||""),a.readOnly=b,a.setAttribute("aria-readonly",String(b)),a.classList.toggle("is-locked",b),document.getElementById("saveCharacterName").hidden=b,document.getElementById("editCharacterName").hidden=!b,document.getElementById("nameLockCopy").textContent=b?`Name locked in as ${S()}. Tap Edit name if you want to change it.`:"Submit the name to lock it in before wandering onward.",document.getElementById("slotGrid").innerHTML=["slot1","slot2","slot3"].map(i=>{const f=Z(i),g=f&&f.characterName?f.characterName.trim():"",w=f&&f.quests?Object.values(f.quests).filter(Q=>Q.status==="completed").length:0,E=f&&f.bosses?Object.values(f.bosses).filter(Q=>Q.status==="completed").length:0,T=f&&f.updatedAt?s(f.updatedAt):"Never played";return`
      <button class="slot-button ${x.currentSlot===i?"active":""}" data-slot-id="${i}">
        <span class="slot-name">${o(g||be(i))}</span>
        <span class="slot-meta">${i===x.currentSlot?"Current slot":"Switch slot"}<br />${f?`${w} quest(s) • ${E} boss(es)<br />Last played: ${T}`:"Fresh campaign"}</span>
      </button>
    `}).join(""),document.getElementById("slotPill").textContent=`Slot ${x.currentSlot.replace("slot","")} active`,document.getElementById("slotCopy").textContent=`${S()} is currently bound to slot ${x.currentSlot.replace("slot","")}. Export this slot or import over it as needed.`,document.getElementById("saveStatusCopy").textContent=re.stateOk&&re.metaOk?`Autosave confirmed. Created: ${s(u.createdAt)} • Last saved: ${s(re.lastSavedAt||u.updatedAt)}.`:`Save warning: ${re.warning||"Changes may not persist on this device."}`,document.getElementById("toggleSound").textContent=`Sound: ${u.settings.soundEnabled?"on":"off"}`,document.getElementById("toggleEffects").textContent=`Effects: ${u.settings.effectsEnabled?"on":"off"}`,d.bindIdentityEvents()}function p(a,b){const i=J(a.id),f=ke(a,b),g=j(a),w=ce(a,b),E=Se(f),T=u.classId,Q=T==="wizard"&&a.ritualPlan&&f!=="available"&&f!=="locked",X=Q?qe(a).map(le=>{const Ie=!!i.ritualPlan[le.id];return`
      <li class="plan-item ${Ie?"done":""}">
        <label>
          <input type="checkbox" data-ritual-step="${le.id}" data-quest-id="${a.id}" ${Ie?"checked":""} ${f==="completed"?"disabled":""} />
          <span>
            <strong>${le.title}</strong><br />
            <span class="soft">Prep now, suffer less later.</span>
          </span>
        </label>
      </li>
    `}).join(""):"",q=f!=="available"&&f!=="locked",ye=q?a.subquests.map(le=>{const Ie=!!i.subquests[le.id];return`
      <li class="subquest-item ${le.required?"":"optional"} ${Ie?"done":""}">
        <label>
          <input type="checkbox" data-subquest-id="${le.id}" data-quest-id="${a.id}" ${Ie?"checked":""} ${f==="completed"?"disabled":""} />
          <span>
            <strong>${le.title}</strong><br />
            <span class="soft">${le.required?"Required step":"Optional bonus step"}</span>
          </span>
          <span class="subquest-xp">${le.xp} XP</span>
        </label>
      </li>
    `}).join(""):'<div class="blocked-note">Start this quest to reveal the required subquests.</div>';let ee="";a.specialPanel==="budget-guide"&&q&&(ee=`
      <div class="quest-special">
        <strong>Budgeting examples unlocked</strong>
        <div class="soft">See the budgeting field guide in the sidebar for shared room, roommate split, and solo studio examples while you fill this in.</div>
      </div>
    `),T==="barbarian"&&f==="available"&&(ee+='<div class="quest-special"><strong>Barbarian hook:</strong> Starting this quest triggers a 60-second Start Sprint. Touch the task fast for bonus XP.</div>'),T==="rogue"&&a.tags.includes("errand")&&(ee+='<div class="quest-special"><strong>Rogue hook:</strong> This counts for an Errand Run combo if the run is active.</div>'),T==="monk"&&a.tags.includes("routine")&&(ee+='<div class="quest-special"><strong>Monk hook:</strong> Routine steps build Discipline. Three Discipline can rescue a blocked quest.</div>');const Te=i.status==="blocked"?`<div class="blocked-note"><strong>Blocked because:</strong> ${o(i.blockedReason||"No reason recorded.")} ${i.blockerType?`<br /><span class="soft">Blocker type: ${o(i.blockerType)}</span>`:""}</div>`:"",xe=i.status==="blocked"&&(i.blockPlan.smallestStep||i.blockPlan.support||i.blockPlan.retryWhen)?`<div class="waiting-note"><strong>Unblock plan:</strong> ${o(i.blockPlan.smallestStep||"Name the smallest next move.")} ${i.blockPlan.support?`<br /><span class="soft">Support: ${o(i.blockPlan.support)}</span>`:""} ${i.blockPlan.retryWhen?`<br /><span class="soft">Retry: ${o(i.blockPlan.retryWhen)}</span>`:""}</div>`:"",Pe=i.status==="waiting"?`<div class="waiting-note"><strong>Waiting on:</strong> ${o(i.waitingPlan.reason||"No waiting reason recorded.")} ${i.waitingPlan.followup?`<br /><span class="soft">Follow-up move: ${o(i.waitingPlan.followup)}</span>`:""} ${i.waitingPlan.retryWhen?`<br /><span class="soft">Check back: ${o(i.waitingPlan.retryWhen)}</span>`:""}</div>`:"",Ye=i.bonuses.momentum?'<div class="bonus-panel">Momentum buff stored: +10 XP on completion. Good. Smash first, philosophize later.</div>':"",Ke=i.bonuses.ritual?'<div class="bonus-panel">Ritual Plan mastered: +12 XP on completion. Bureaucracy is weaker when named.</div>':"",Ve=i.bonuses.recovery?'<div class="bonus-panel">Recovery Stance used: the monk dragged this quest back from the swamp.</div>':"",Xe=i.bonuses.rogueCombo?'<div class="bonus-panel">Errand Run combo landed: +8 XP synergy on this quest.</div>':"",ze=i.bonuses.lowEnergy?'<div class="bonus-panel">Low-energy version used. A smaller real step has been banked, which still counts because momentum is better than ceremonial self-loathing.</div>':"",Je=se[a.id]?`<div class="quest-special"><strong>${se[a.id].title}</strong><div class="soft">${se[a.id].copy}</div></div>`:"";return`
    <li>
      <article class="quest-card ${f.replace(" ","-")} ${f==="completed"?"complete":""} ${f==="blocked"?"blocked":""} ${f==="locked"?"locked":""}" data-quest-card="${a.id}">
        <div class="quest-head">
          <div>
            <div class="quest-title">${a.title}</div>
            <p class="quest-copy">${a.summary}</p>
          </div>
          <div class="quest-meta">
            <span class="status-label ${f.replace(" ","-")}">${E.icon} ${E.label}</span>
            <span class="pill">${w}</span>
            <span class="pill warning">${a.completionBonus} XP clear bonus</span>
            <span class="pill">${g.doneRequired}/${g.needed} needed</span>
          </div>
        </div>
        <div class="tag-row">${a.tags.map(le=>`<span class="tag">${le}</span>`).join("")}</div>
        <div class="quest-controls">${e(a,b)}</div>
        ${Te}
        ${xe}
        ${Pe}
        ${ee}
        ${Je}
        ${Ye}
        ${Ke}
        ${Ve}
        ${Xe}
        ${ze}
        ${Q?`<div class="quest-special"><strong>Ritual Plan</strong><ol class="plan-list">${X}</ol></div>`:""}
        <div>
          <strong>Objective chain</strong>
          <ol class="subquest-list">${ye}</ol>
        </div>
      </article>
    </li>
  `}function e(a,b){J(a.id);const i=ke(a,b);return i==="locked"?'<button class="secondary" disabled>Locked</button>':i==="available"?`
      <button data-action="start-quest" data-quest-id="${a.id}">Start quest</button>
      ${se[a.id]?`<button class="secondary" data-action="low-energy" data-quest-id="${a.id}">Low-energy version</button>`:""}
      <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Mark waiting</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Mark blocked</button>
    `:i==="blocked"?`
      <button data-action="resume-quest" data-quest-id="${a.id}">Resume quest</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Change reason</button>
      <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Mark waiting</button>
      <button class="danger" data-action="reset-quest" data-quest-id="${a.id}">Reset steps</button>
    `:i==="waiting"?`
      <button data-action="resume-quest" data-quest-id="${a.id}">Resume quest</button>
      <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Update waiting plan</button>
      <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Mark blocked</button>
      <button class="danger" data-action="reset-quest" data-quest-id="${a.id}">Reset steps</button>
    `:i==="completed"?`<button class="secondary" data-action="review-quest" data-quest-id="${a.id}">Review chain</button>`:`
    ${se[a.id]?`<button class="secondary" data-action="low-energy" data-quest-id="${a.id}">Low-energy version</button>`:""}
    <button class="secondary" data-action="waiting-quest" data-quest-id="${a.id}">Mark waiting</button>
    <button class="secondary" data-action="block-quest" data-quest-id="${a.id}">Mark blocked</button>
    <button class="danger" data-action="reset-quest" data-quest-id="${a.id}">Reset steps</button>
  `}function t(){const a=document.getElementById("classList"),b=c.find(i=>i.id===u.classId)||null;a.innerHTML=c.map(i=>`
    <li class="class-choice ${i.id===u.classId?"active":""}">
      <label>
        <input type="radio" name="classId" value="${i.id}" ${i.id===u.classId?"checked":""} />
        <span>
          <span class="class-name"><span>${i.emoji} ${i.name}</span>${i.id===u.classId?'<span class="pill">Active</span>':""}</span>
          <span class="soft">${i.note}</span>
          <span class="class-perk">${i.perk}</span>
        </span>
      </label>
    </li>
  `).join(""),document.getElementById("classNote").innerHTML=b?`<strong>${b.emoji} ${b.name}</strong><br /><span class="soft">${b.perk}</span>`:'<strong>No class chosen yet.</strong><br /><span class="soft">Pick a class in setup or here in the sidebar. No build, no glorious perk.</span>',document.getElementById("classPill").textContent=b?b.name:"Choose a class",document.getElementById("classConsole").innerHTML=b?r(b):'<strong>Class console</strong><div class="soft">Choose a class to unlock the perk console and class-specific advantages.</div>',d.bindClassEvents()}function r(a){if(a.id==="barbarian")return'<strong>Barbarian console</strong><div class="soft">Every time you start a quest, the Start Sprint appears automatically. Confirm one physical first action inside 60 seconds to store the Momentum buff.</div>';if(a.id==="rogue")return`
      <strong>Rogue console</strong>
      <div class="soft">Errand Run status: ${u.rogueRun.active?`active with ${u.rogueRun.completedQuestIds.length} quest(s) chained`:"inactive"}.</div>
      <div class="class-actions" style="margin-top:10px;">
        ${u.rogueRun.active?'<button class="warning" id="endErrandRun">End Errand Run</button>':'<button id="startErrandRun">Start Errand Run</button>'}
      </div>
    `;if(a.id==="wizard")return'<strong>Wizard console</strong><div class="soft">Admin, work, budget, and housing quests now reveal Ritual Plans. Complete the prep ritual before diving in to earn bonus XP.</div>';const b=B.flatMap(i=>i.quests).filter(i=>J(i.id).status==="blocked");return`
    <strong>Monk console</strong>
    <div class="soft">Discipline stored: <strong>${u.monk.discipline}</strong>. Earn it by completing routine subquests. Spend 3 to invoke Recovery Stance on one blocked quest.</div>
    <div class="class-actions" style="margin-top:10px;">
      <button ${u.monk.discipline<3||b.length===0?'class="secondary" disabled':""} id="useRecoveryStance">Use Recovery Stance</button>
    </div>
  `}function m(){const a=document.getElementById("bossList"),b=D(),f=(u.campaign.pathMode==="guided"&&!u.settings.showFullMap?B.filter(g=>g.id===b.id):B).map(g=>{var ye,ee,Te;const w=ae(g),E=u.bosses[w.id],T=G(g),Q=Se(T),X=H(g),q=X?w.subquests.map(xe=>{const Pe=!!E.subquests[xe.id];return`
        <li class="subquest-item ${Pe?"done":""}">
          <label>
            <input type="checkbox" data-boss-id="${w.id}" data-boss-subquest-id="${xe.id}" ${Pe?"checked":""} ${T==="completed"?"disabled":""} />
            <span>
              <strong>${xe.title}</strong><br />
              <span class="soft">Required boss objective</span>
            </span>
            <span class="subquest-xp">${xe.xp} XP</span>
          </label>
        </li>
      `}).join(""):'<div class="blocked-note">Hidden until enough quest progress is made in this chapter.</div>';return`
      <li>
        <article class="boss-card ${T==="completed"?"complete":""}">
          <div class="boss-head">
            <div>
              <div class="title-chip">${ue(g)} Chapter ${g.level} boss</div>
              <div class="boss-title" style="margin-top:8px;">☠️ ${w.title}</div>
              <p class="boss-copy">${X?w.summary:"Somewhere ahead, a boss waits behind the mist and bad adult decisions."}</p>
            </div>
            <div class="boss-meta">
              <span class="status-label ${T.replace(" ","-")}">${Q.icon} ${Q.label}</span>
              <span class="pill danger">${w.completionBonus} XP clear bonus</span>
            </div>
          </div>
          ${X?`<div class="boss-intro">Boss unlock rule met in <strong>${g.title}</strong>. Clear all objectives and the chapter can close.</div>`:""}
          ${X?`<div class="boss-controls">${v(g)}</div>`:""}
          ${E.status==="blocked"?`<div class="blocked-note"><strong>Blocked because:</strong> ${o(E.blockedReason||"No reason recorded.")} ${E.blockerType?`<br /><span class="soft">Blocker type: ${o(E.blockerType)}</span>`:""}</div>`:""}
          ${E.status==="blocked"&&((ye=E.blockPlan)!=null&&ye.smallestStep||(ee=E.blockPlan)!=null&&ee.support||(Te=E.blockPlan)!=null&&Te.retryWhen)?`<div class="waiting-note"><strong>Unblock plan:</strong> ${o(E.blockPlan.smallestStep||"Name the smallest next move.")} ${E.blockPlan.support?`<br /><span class="soft">Support: ${o(E.blockPlan.support)}</span>`:""} ${E.blockPlan.retryWhen?`<br /><span class="soft">Retry: ${o(E.blockPlan.retryWhen)}</span>`:""}</div>`:""}
          <ol class="subquest-list">${q}</ol>
        </article>
      </li>
    `}).join("");a.innerHTML=f,document.getElementById("bossPill").textContent=`${B.filter(g=>G(g)!=="completed").length} threat(s) remain`,d.bindBossEvents()}function v(a,b){const i=G(a);return i==="available"?`
      <button data-action="start-boss" data-chapter-id="${a.id}">Start boss quest</button>
      <button class="secondary" data-action="block-boss" data-chapter-id="${a.id}">Mark blocked</button>
    `:i==="blocked"?`
      <button data-action="resume-boss" data-chapter-id="${a.id}">Resume boss</button>
      <button class="secondary" data-action="block-boss" data-chapter-id="${a.id}">Change reason</button>
      <button class="danger" data-action="reset-boss" data-chapter-id="${a.id}">Reset boss</button>
    `:i==="completed"?'<button class="secondary" disabled>Boss defeated</button>':`
    <button class="secondary" data-action="block-boss" data-chapter-id="${a.id}">Mark blocked</button>
    <button class="danger" data-action="reset-boss" data-chapter-id="${a.id}">Reset boss</button>
  `}function $(){const a=document.getElementById("rewardTrack"),b=V();a.innerHTML=C.map(f=>{const g=b>=f.at;return`
      <li>
        <article class="reward-card ${g?"unlocked":"locked"}">
          <div class="reward-head">
            <div>
              <div class="title-chip">${g?"✨ Loot unlocked":"🔒 Locked reward"}</div>
              <div class="reward-title" style="margin-top:8px;">🎁 ${f.title}</div>
            </div>
            <span class="status-label ${g?"completed":"locked"}">${g?"✓ Unlocked":"🔒 Locked"}</span>
          </div>
          <div class="reward-copy">${f.copy}</div>
          <div class="soft">Unlocks at ${f.at} main quests cleared.</div>
        </article>
      </li>
    `}).join("");const i=C.filter(f=>b>=f.at).length;document.getElementById("rewardPill").textContent=i?`${i} reward tier(s) unlocked`:"Rewards locked"}function h(){document.getElementById("rescueList").innerHTML=R.map(a=>`
    <li>
      <details class="rescue-card">
        <summary>${a.title}</summary>
        <p class="rescue-copy" style="margin-top:10px;">${a.copy}</p>
      </details>
    </li>
  `).join("")}function he(){document.getElementById("budgetExamples").innerHTML=I.map(a=>`
    <article class="budget-card">
      <div class="budget-head">
        <div class="budget-title">${a.title}</div>
        <span class="budget-total">${a.total}</span>
      </div>
      <ul class="cost-list">
        ${a.items.map(b=>`<li>${b}</li>`).join("")}
      </ul>
    </article>
  `).join("")}function Me(){var Q,X;const a=document.getElementById("campaignSetupOverlay"),b=document.getElementById("campaignSetupBody"),i=document.getElementById("campaignSetupBack"),f=document.getElementById("campaignSetupNext"),g=Math.min(u.campaign.step||0,2);u.campaign.step=g;const w=3,T=`<div class="quest-special"><strong>Character so far</strong><div class="soft">${[u.characterName?`Hero: ${o(u.characterName)}`:"Hero: unnamed",(Q=W())!=null&&Q.title?`Origin: ${o(W().title)}`:"Origin: choose one",u.classId?`Class: ${o(((X=c.find(q=>q.id===u.classId))==null?void 0:X.name)||u.classId)}`:"Class: choose one"].join(" • ")}</div></div>`;if(u.campaign.complete){a.hidden=!0,document.body.classList.remove("overlay-open");return}if(a.hidden&&(y.lastSetupFocusBeforeDialog=document.activeElement),a.hidden=!1,document.body.classList.add("overlay-open"),document.getElementById("campaignSetupTitle").textContent="Forge Your Character — Required Setup",document.getElementById("campaignSetupStepCount").textContent=`Step ${Math.min(g+1,w)} of ${w}`,i.style.visibility=g===0?"hidden":"visible",f.textContent=g>=w-1?"Begin Chapter 1":"Next",g===0?(b.innerHTML=`
      <div class="setup-grid">
        ${T}
        <div class="field-stack">
          <label class="field-label" for="setupCharacterName">What is your hero called?</label>
          <input class="text-input" id="setupCharacterName" type="text" maxlength="60" placeholder="Unnamed Hero" value="${k(u.characterName||"")}" />
          <div class="setup-copy">Name them, then let action fill in the rest.</div>
        </div>
        <div class="setup-copy">Choose the current situation that feels closest. It guides the tone, not your fate.</div>
        <ul class="setup-choice-list">${we.map(q=>`<li><button type="button" class="setup-choice ${u.campaign.origin===q.id?"active":""}" data-setup-choice="origin" data-setup-value="${q.id}"><div class="setup-choice-title">${q.title}</div><div class="setup-copy">${q.copy}</div></button></li>`).join("")}</ul>
      </div>
    `,b.querySelector("#setupCharacterName").focus(),b.querySelector("#setupCharacterName").addEventListener("input",q=>{u.characterName=q.target.value})):g===1?b.innerHTML=`<div class="setup-grid">${T}<div class="setup-copy">Choose the playstyle that helps you win most consistently.</div><ul class="setup-choice-list">${c.map(q=>`<li><button type="button" class="setup-choice ${u.classId===q.id?"active":""}" data-setup-choice="classId" data-setup-value="${q.id}"><div class="setup-choice-title">${q.emoji} ${q.name}</div><div class="setup-copy">${q.note}</div><div class="setup-copy"><strong>How you win:</strong> ${q.perk}</div></button></li>`).join("")}</ul></div>`:b.innerHTML=`<div class="setup-grid">${T}<div class="setup-copy">Pick the reason this campaign matters, then choose one tiny proof action.</div><ul class="setup-choice-list">${me.map(q=>`<li><button type="button" class="setup-choice ${u.campaign.motivation===q.id?"active":""}" data-setup-choice="motivation" data-setup-value="${q.id}"><div class="setup-choice-title">${q.title}</div><div class="setup-copy">${q.copy}</div></button></li>`).join("")}</ul><div class="setup-copy">Choose one tiny proof action. It does not need to be heroic. It needs to be real.</div><ul class="setup-choice-list">${N.map(q=>`<li><button type="button" class="setup-choice ${u.campaign.firstProof===q.id?"active":""}" data-setup-choice="firstProof" data-setup-value="${q.id}"><div class="setup-choice-title">${q.title}</div><div class="setup-copy">${q.copy}</div></button></li>`).join("")}</ul></div>`,b.querySelectorAll("[data-setup-choice]").forEach(q=>{q.addEventListener("click",()=>{const ye=q.dataset.setupChoice,ee=q.dataset.setupValue;ye==="classId"?u.classId=ee:u.campaign[ye]=ee,Me()})}),g!==0){const q=b.querySelector(".setup-choice.active")||b.querySelector("[data-setup-choice]")||f;q&&q.focus()}}function Oe(){[["bosses","Bosses","bossPanelBody","toggleBossSection"],["rewards","Rewards","rewardPanelBody","toggleRewardSection"],["rescue","Rescue kit","rescuePanelBody","toggleRescueSection"],["budget","Budget guide","budgetPanelBody","toggleBudgetSection"]].forEach(([b,i,f,g])=>{const w=document.getElementById(f),E=document.getElementById(g),T=!!u.settings.collapsedSections[b];w.classList.toggle("is-collapsed",T),E.setAttribute("aria-expanded",String(!T)),E.textContent=window.innerWidth<=720?T?"Show":"Hide":T?`Show ${i}`:`Hide ${i}`})}return{renderAll:$e,renderHeader:pe,renderJourney:L,renderMainQuest:Ce,renderQuestLog:ge,renderSupportPanel:Y,renderIdentityPanel:n,renderQuestCard:p,renderQuestControls:e,renderClassPanel:t,renderClassConsole:r,renderBossPanel:m,renderBossControls:v,renderRewardPanel:$,renderRescuePanel:h,renderBudgetPanel:he,renderCampaignSetup:Me,renderSectionCollapseStates:Oe}}function rt(d){const{ctx:y,CLASS_DEFS:c,CHAPTERS:R,LEGACY_STORAGE_KEY:C,defaultState:I,saveMeta:te,loadState:we,saveState:me,hydrateState:N,getCharacterName:se,getCampaignFirstProof:B,findChapterForQuest:F,getQuestEntry:K,getBossEntry:Be,isChapterUnlocked:V,isChapterComplete:fe,isBossRevealed:U,getBossStatus:A,getBossForChapter:_,getRitualPlanSteps:ne,getUnlockedRewardCount:oe,getQuestStatus:D,renderAll:S}=d,{state:l,meta:W}=Fe(y);function z(){const n=["campaignSetupOverlay","questFlowOverlay","timerOverlay"].some(p=>{const e=document.getElementById(p);return e&&!e.hidden});document.body.classList.toggle("overlay-open",n)}function de(n){const p=F(n).quests.find(t=>t.id===n),e=K(n);e.status="started",e.startedAt=e.startedAt||Date.now(),l.classId==="barbarian"&&o(n,p.title),S(),M(`Quest started: ${p.title}. Objective chain revealed.`)}function ae(n){const p=K(n);p.status=(p.subquests&&Object.values(p.subquests).some(Boolean),"started"),S(),M("Quest resumed. Back into the swamp, but with better lighting.")}function H(n){const p=F(n).quests.find(r=>r.id===n),e=K(n);e.status="started",e.startedAt=e.startedAt||Date.now(),e.bonuses.lowEnergy=!0;const t=p.subquests.filter(r=>r.required).find(r=>!e.subquests[r.id]);if(t&&(e.subquests[t.id]=!0),j(n)){Z(n);return}S(),M(`Low-energy version applied to ${p.title}. One smaller real step is now banked.`)}function O(n){const p=F(n);V(p)&&d.openQuestFlowModal("blocked",n)}function ie(n){d.openQuestFlowModal("waiting",n)}function G(n){if(!confirm("Reset this quest and clear its steps, buffs, and progress?"))return;const p=F(n).quests.find(e=>e.id===n);l.quests[n]={status:"available",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},waitingPlan:{reason:"",followup:"",retryWhen:""},subquests:{},ritualPlan:{},bonuses:{momentum:!1,ritual:!1,rogueCombo:!1,recovery:!1,lowEnergy:!1},startedAt:null,completedAt:null},p.subquests.forEach(e=>{l.quests[n].subquests[e.id]=!1}),p.ritualPlan&&ne(p).forEach(e=>{l.quests[n].ritualPlan[e.id]=!1}),S(),M("Quest reset. Sometimes you cleanse the rune circle and start again.")}function J(n,p,e){const t=F(n).quests.find(v=>v.id===n),r=K(n),m=!!r.subquests[p];if(r.subquests[p]=e,r.status!=="completed"){const $=t.subquests.filter(h=>h.required).filter(h=>r.subquests[h.id]).length;r.status=($>0,"started")}if(!m&&e&&l.classId==="monk"&&t.tags.includes("routine")&&(l.monk.discipline+=1,M(`Discipline gained. Monk reserve now at ${l.monk.discipline}.`)),j(n)){Z(n);return}S()}function ke(n,p,e){const t=K(n);t.ritualPlan[p]=e;const r=F(n).quests.find(v=>v.id===n),m=ne(r).every(v=>t.ritualPlan[v.id]);m?t.bonuses.ritual=!0:t.status!=="completed"&&(t.bonuses.ritual=!1),S(),m&&M("Ritual Plan complete. The paperwork demons hate preparation.")}function j(n){const p=F(n).quests.find(v=>v.id===n),e=K(n),t=p.subquests.filter(v=>v.required),r=p.requiredCount||t.length;return t.filter(v=>e.subquests[v.id]).length>=r}function Z(n){const p=F(n).quests.find(m=>m.id===n),e=K(n),t=e.status==="completed",r=oe();e.status="completed",e.completedAt=e.completedAt||Date.now(),!t&&l.classId==="rogue"&&l.rogueRun.active&&p.tags.includes("errand")&&(l.rogueRun.completedQuestIds=Array.from(new Set([...l.rogueRun.completedQuestIds,n])),e.bonuses.rogueCombo=!0,l.rogueRun.completedQuestIds.length>=2&&!l.rogueRun.bonusAwarded&&(l.rogueRun.bonusAwarded=!0,Y("Errand Run combo achieved! Two errand quests chained in one outing. That counts as roguish competence.","reward"),M("Combo bonus applied to this run’s quests. Sneaky little efficiency demon.","reward"))),S(),ge("quest"),M(`Quest cleared: ${p.title}. Parent quest auto-completed because all required steps are done.`,"reward"),oe()>r&&(ge("reward"),Y("Loot tier unlocked. Yes, bribery remains one of civilization’s sturdier inventions.","reward")),s(F(n))}function be(n){const p=R.find(r=>r.id===n),e=_(p),t=l.bosses[e.id];t.status="started",t.startedAt=t.startedAt||Date.now(),S(),M(`Boss quest started: ${e.title}. Time to bully a problem large enough to deserve a title.`)}function qe(n){const p=R.find(t=>t.id===n),e=_(p);l.bosses[e.id].status="started",S(),M("Boss resumed. The monster did not, sadly, solve itself.")}function Se(n){const p=R.find(t=>t.id===n),e=_(p);d.openQuestFlowModal("boss-blocked",e.id,"boss")}function ce(n){const p=R.find(t=>t.id===n),e=_(p);confirm(`Reset ${e.title} and clear all boss objectives?`)&&(l.bosses[e.id]={status:"available",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},subquests:{},bonuses:{},startedAt:null,completedAt:null},e.subquests.forEach(t=>{l.bosses[e.id].subquests[t.id]=!1}),S(),M("Boss reset. Sometimes the dragon wins round one."))}function Ee(n,p,e){const t=R.flatMap(m=>m.bossPool).find(m=>m.id===n),r=l.bosses[n];if(r.subquests[p]=e,r.status!=="completed"&&(r.status="started"),t.subquests.every(m=>r.subquests[m.id])){ue(n);return}S()}function ue(n){const p=R.find(r=>_(r).id===n),e=_(p),t=l.bosses[n];t.status="completed",t.completedAt=t.completedAt||Date.now(),S(),ge("boss"),Y(`Boss defeated: ${e.title}. Chapter ${p.level} bends the knee.`,"boss"),s(p)}function s(n){fe(n)?(ge("chapter"),n.level<R.length?Y(`Level ${n.level} complete. ${R[n.level].title} is now unlocked.`,"chapter"):Y("All chapters complete. The Independent Keep is no longer theory.","chapter")):U(n)&&A(n)==="available"&&M(`Boss revealed in ${n.title}: ${_(n).title}. Naturally, it showed up when things got interesting.`,"boss")}function o(n,p){y.activeTimerQuestId=n;const e=document.getElementById("timerOverlay");y.lastFocusBeforeDialog=document.activeElement,e.hidden=!1,z(),document.getElementById("timerQuestCopy").textContent=`Quest started: ${p}. Touch it within 60 seconds for the Momentum buff.`;let t=60;document.getElementById("timerCount").textContent=t,window.requestAnimationFrame(()=>{document.getElementById("confirmMomentum").focus()}),clearInterval(y.timerInterval),y.timerInterval=setInterval(()=>{t-=1,document.getElementById("timerCount").textContent=t,t<=0&&(clearInterval(y.timerInterval),k(),M("Start Sprint expired. No bonus, but the quest is still live. Move anyway."))},1e3)}function k(){clearInterval(y.timerInterval),y.timerInterval=null,y.activeTimerQuestId=null,document.getElementById("timerOverlay").hidden=!0,z(),y.lastFocusBeforeDialog&&typeof y.lastFocusBeforeDialog.focus=="function"&&y.lastFocusBeforeDialog.focus(),y.lastFocusBeforeDialog=null}function u(){if(l.monk.discipline<3)return;const n=R.flatMap(t=>t.quests).find(t=>K(t.id).status==="blocked");if(!n){M("No blocked quest available for Recovery Stance. Impressive, honestly.");return}const p=K(n.id);p.status="started",p.blockedReason="",p.bonuses.recovery=!0;const e=n.subquests.find(t=>!p.subquests[t.id]);if(e&&(p.subquests[e.id]=!0),l.monk.discipline-=3,j(n.id)){Z(n.id);return}S(),Y(`Recovery Stance used on ${n.title}. First step cleared and the quest is moving again.`)}function x(n,p,e){l.supportTasks[n][p]=e,me(),e&&M("Support-party task logged. Coordination: the least flashy buff in the realm.")}function re(n){n!==W.currentSlot&&(me(),W.currentSlot=n,te(),y.state=we(n),N(),S(),Y(`Save slot ${n.replace("slot","")} loaded. Hero now bound to ${se()}.`))}function $e(){const n={exportedAt:new Date().toISOString(),slotId:W.currentSlot,characterName:se(),state:l},p=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),e=URL.createObjectURL(p),t=document.createElement("a"),r=se().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"unnamed-hero";t.href=e,t.download=`independence-campaign-${r}-${W.currentSlot}.json`,document.body.appendChild(t),t.click(),t.remove(),URL.revokeObjectURL(e),M("Current save exported. Your campaign is now bottled against disaster.")}async function pe(n){const p=n.target.files&&n.target.files[0];if(p)try{const e=await p.text(),t=JSON.parse(e);if(!t||typeof t!="object"||!t.state||typeof t.state!="object")throw new Error("File did not contain a valid campaign state.");if(typeof t.state.version!="number")throw new Error("Imported file is missing a supported campaign version.");if(!confirm(`Import this save into slot ${W.currentSlot.replace("slot","")}? Current progress in this slot will be overwritten.`)){n.target.value="";return}const r=l.chapterBosses||{};y.state={...I(),...t.state},(!t.state.chapterBosses||typeof t.state.chapterBosses!="object")&&(l.chapterBosses=r),typeof t.characterName=="string"&&!l.characterName&&(l.characterName=t.characterName),N(),S(),Y(`Save imported into slot ${W.currentSlot.replace("slot","")}. The bottle uncorks; the hero remembers.`)}catch(e){console.error(e),Y("Import failed. That file was not valid campaign sorcery.")}finally{n.target.value=""}}function L(n="quest"){if(!l.settings.soundEnabled)return;const p=window.AudioContext||window.webkitAudioContext;if(p)try{L.ctx||(L.ctx=new p);const e=L.ctx,t=e.currentTime;({toggle:[520,660],quest:[440,660],reward:[523,659,784],boss:[330,440,554,740],chapter:[392,523,659,880]}[n]||[440,660]).forEach((m,v)=>{const $=e.createOscillator(),h=e.createGain();$.type=n==="boss"?"triangle":"sine",$.frequency.value=m,h.gain.setValueAtTime(1e-4,t+v*.08),h.gain.exponentialRampToValueAtTime(.05,t+v*.08+.01),h.gain.exponentialRampToValueAtTime(1e-4,t+v*.08+.18),$.connect(h),h.connect(e.destination),$.start(t+v*.08),$.stop(t+v*.08+.2)})}catch(e){console.warn("Sound effect failed.",e)}}function Ce(n="quest"){if(!l.settings.effectsEnabled)return;const p=document.getElementById("particleLayer"),e={quest:["#73e2a7","#ffd166","#7cc6fe"],reward:["#ffd166","#c7a6ff","#ffffff"],boss:["#ff5fa2","#ffd166","#ffffff"],chapter:["#73e2a7","#ffd166","#c7a6ff","#7cc6fe"]},t=e[n]||e.quest,r=n==="chapter"?34:n==="boss"?28:18,m=Math.round(window.innerWidth*(.55+Math.random()*.1)),v=Math.round(window.innerHeight*(n==="chapter"?.34:.72));for(let $=0;$<r;$+=1){const h=document.createElement("span");h.className=`particle ${Math.random()>.55?"square":""}`,h.style.left=`${m}px`,h.style.top=`${v}px`,h.style.color=t[Math.floor(Math.random()*t.length)],h.style.background=h.style.color,h.style.setProperty("--dx",`${Math.round((Math.random()-.5)*280)}px`),h.style.setProperty("--dy",`${Math.round((Math.random()-.8)*220)}px`),p.appendChild(h),h.addEventListener("animationend",()=>h.remove(),{once:!0})}}function ge(n="quest"){L(n),Ce(n)}function M(n,p="default"){const e=document.getElementById("toast");e.innerHTML=n,e.dataset.kind=p,e.classList.add("show"),clearTimeout(e._timer),e._timer=setTimeout(()=>e.classList.remove("show"),3200)}function Y(n,p="default"){const e=document.getElementById("banner");e.innerHTML=n,e.dataset.kind=p,e.classList.add("show"),clearTimeout(e._timer),e._timer=setTimeout(()=>e.classList.remove("show"),4800)}return{startQuest:de,resumeQuest:ae,useLowEnergyVersion:H,blockQuest:O,markQuestWaiting:ie,resetQuest:G,toggleSubquest:J,toggleRitualStep:ke,allRequiredQuestStepsDone:j,completeQuest:Z,startBoss:be,resumeBoss:qe,blockBoss:Se,resetBoss:ce,toggleBossSubquest:Ee,completeBoss:ue,maybeAnnounceChapterEvents:s,launchTimer:o,closeTimerOverlay:k,useRecoveryStance:u,toggleSupportTask:x,switchSaveSlot:re,exportCurrentSave:$e,importSaveFile:pe,playTone:L,burstParticles:Ce,celebrate:ge,showToast:M,showBanner:Y}}function lt(d){const{ctx:y,CLASS_DEFS:c,CHAPTERS:R,defaultState:C,saveState:I,hydrateState:te,getStorageKey:we,getCurrentChapter:me,getNextMove:N,getCharacterName:se,getCampaignFirstProof:B,getQuestEntry:F,getBossEntry:K,getQuestStatus:Be,findChapterForQuest:V,syncSlotName:fe,escapeAttr:U,renderAll:A,renderHeader:_,renderIdentityPanel:ne,renderCampaignSetup:oe,renderSectionCollapseStates:D,playTone:S}=d,{state:l,meta:W}=Fe(y);function z(){const s=["campaignSetupOverlay","questFlowOverlay","timerOverlay"].some(o=>{const k=document.getElementById(o);return k&&!k.hidden});document.body.classList.toggle("overlay-open",s)}function de(s){const o=document.activeElement;!o||o===s||typeof o.matches!="function"||o.matches('input[type="text"], input[type="search"], input[type="email"], input[type="tel"], input[type="url"], textarea')&&(s&&typeof s.closest=="function"&&o.closest&&o.closest("#campaignSetupOverlay, #questFlowOverlay")&&s.closest("#campaignSetupOverlay, #questFlowOverlay")||typeof o.blur=="function"&&o.blur())}function ae(){document.addEventListener("click",s=>{const o=s.target.closest('button, [data-action], input[type="checkbox"], input[type="radio"]');o&&de(o)},!0),document.getElementById("nextMoveButton").addEventListener("click",()=>{H()}),document.getElementById("jumpToCurrent").addEventListener("click",()=>{document.getElementById(`chapter-${me().id}`).scrollIntoView({behavior:"smooth",block:"start"})}),document.getElementById("toggleMapView").addEventListener("click",()=>{l.settings.showFullMap=!l.settings.showFullMap,A(),d.showToast(l.settings.showFullMap?"Full map revealed. Behold the whole cursed road.":"Guided lane restored. One chapter at a time.")}),document.getElementById("toggleFocusMode").addEventListener("click",()=>{l.settings.focusMode=!l.settings.focusMode,A(),d.showToast(l.settings.focusMode?"Focus mode enabled. Only the current chapter and rescue tools remain on stage.":"Focus mode disabled. The rest of the campaign wanders back into view.")}),document.getElementById("jumpToRescue").addEventListener("click",()=>{l.settings.collapsedSections.rescue=!1,D(),document.getElementById("rescueSection").scrollIntoView({behavior:"smooth",block:"start"}),d.showToast("ADHD Rescue Kit opened. We are not waiting for divine motivation.")}),document.getElementById("printCharacterSheet").addEventListener("click",()=>{window.print()}),document.getElementById("toggleFamilyMode").addEventListener("click",()=>{l.settings.familyMode=!l.settings.familyMode,A(),d.showToast(l.settings.familyMode?"Family support mode enabled. Support-party quests are now visible.":"Family support mode disabled. The side-party fades back into the shadows.")}),document.getElementById("toggleBossSection").addEventListener("click",()=>G("bosses")),document.getElementById("toggleRewardSection").addEventListener("click",()=>G("rewards")),document.getElementById("toggleRescueSection").addEventListener("click",()=>G("rescue")),document.getElementById("toggleBudgetSection").addEventListener("click",()=>G("budget")),document.getElementById("resetCampaign").addEventListener("click",()=>{confirm(`Reset the campaign in slot ${W.currentSlot.replace("slot","")} only? Boss rolls, quest progress, class choice, XP, and stored buffs in this slot will all be wiped.`)&&(y.state=C(),te(),A(),d.showToast("Campaign reset. The hero returns to Base Camp, still alive and mildly annoyed."))}),document.getElementById("confirmMomentum").addEventListener("click",()=>{if(!y.activeTimerQuestId)return;const s=F(y.activeTimerQuestId);s.bonuses.momentum=!0,d.closeTimerOverlay(),A(),d.showToast("Momentum buff secured: +10 XP when this quest clears. Hit first, brood later.")}),document.getElementById("skipMomentum").addEventListener("click",()=>{d.closeTimerOverlay(),d.showToast("No Momentum buff this time. Fine. Still start the quest like a respectable goblin.")}),document.getElementById("timerOverlay").addEventListener("keydown",be),document.getElementById("campaignSetupOverlay").addEventListener("keydown",qe),document.getElementById("campaignSetupBack").addEventListener("click",O),document.getElementById("campaignSetupNext").addEventListener("click",ie),document.getElementById("questFlowOverlay").addEventListener("keydown",ue),document.getElementById("questFlowCancel").addEventListener("click",ce),document.getElementById("questFlowSubmit").addEventListener("click",Ee),window.addEventListener("storage",s=>{s.key===we(W.currentSlot)&&d.showBanner("This save slot changed in another tab or window. Reload the slot if you want the newest version.")})}function H(){const s=N();if(s.action==="open-setup"){l.campaign.complete=!1,oe(),document.getElementById("campaignSetupOverlay").hidden=!1;return}if(s.action==="complete-first-proof"){l.campaign.firstProofDone=!0,A(),d.celebrate("quest"),d.showToast("First proof logged. Good. The campaign now begins on evidence instead of optimism.");return}if(s.action==="start-quest"&&s.questId){d.startQuest(s.questId);return}if(s.action==="scroll-quest"&&s.questId){const o=document.querySelector(`[data-quest-card="${s.questId}"]`);o&&o.scrollIntoView({behavior:"smooth",block:"center"}),d.showToast(`Back to ${s.heading}. One useful click beats ceremonial dithering.`);return}if(s.action==="start-boss"&&s.chapterId){d.startBoss(s.chapterId);return}document.getElementById("journeySection").scrollIntoView({behavior:"smooth",block:"start"})}function O(){l.campaign.step=Math.max((l.campaign.step||0)-1,0),oe()}function ie(){var o;const s=l.campaign.step||0;if(s===0&&!(l.characterName||"").trim()){d.showToast("Name the hero first. Anonymous adventurers make paperwork worse.");return}if(s===0&&!l.campaign.origin){d.showToast("Choose the current situation so the campaign knows which swamp you are standing in.");return}if(s===1&&!l.classId){d.showToast("Choose a class. Even chaos benefits from a build.");return}if(s===2&&!l.campaign.motivation){d.showToast("Choose a motivation. It matters when the vibes fail.");return}if(s===2&&!l.campaign.firstProof){d.showToast("Choose one tiny proof action to begin the campaign.");return}if(s>=2){l.campaign.complete=!0,l.campaign.firstProofDone=!0,l.campaign.vow=l.campaign.vow||"",l.campaign.pathMode=l.campaign.pathMode||"guided",l.settings.nameLocked=!!(l.characterName||"").trim(),l.settings.showFullMap=!1,fe(),A(),window.requestAnimationFrame(()=>{const k=document.getElementById(`chapter-${me().id}`),u=k||document.getElementById("nextMoveButton")||y.lastSetupFocusBeforeDialog;u&&typeof u.focus=="function"&&u.focus(),k&&k.scrollIntoView({behavior:"smooth",block:"start"}),y.lastSetupFocusBeforeDialog=null}),d.celebrate("chapter"),d.showBanner(`${se()} enters the campaign. Chapter 0 is complete and the road is open. Your first proof is ${((o=B())==null?void 0:o.title)||"logged"} — now start the first real quest.`,"chapter"),d.showToast("Chapter 0 complete. No extra confirmation rite required. Onward.");return}l.campaign.step=s+1,oe()}function G(s){l.settings.collapsedSections[s]=!l.settings.collapsedSections[s],D(),I()}function J(){const s=document.getElementById("characterNameInput");s.oninput=null,document.getElementById("saveCharacterName").onclick=()=>{const o=s.value.trim();if(!o){d.showToast("Name the hero first. Even legends need a label."),s.focus();return}l.characterName=o,l.settings.nameLocked=!0,fe(),I(),_(),ne(),d.showToast(`Name locked in as ${o}.`)},document.getElementById("editCharacterName").onclick=()=>{l.settings.nameLocked=!1,ne(),window.requestAnimationFrame(()=>{const o=document.getElementById("characterNameInput");o&&(o.focus(),o.setSelectionRange(o.value.length,o.value.length))}),d.showToast("Name unlocked for editing.")},document.querySelectorAll("[data-slot-id]").forEach(o=>{o.onclick=()=>d.switchSaveSlot(o.dataset.slotId)}),document.getElementById("toggleSound").onclick=()=>{l.settings.soundEnabled=!l.settings.soundEnabled,ne(),I(),d.showToast(`Sound ${l.settings.soundEnabled?"enabled":"muted"}.`),l.settings.soundEnabled&&S("toggle")},document.getElementById("toggleEffects").onclick=()=>{l.settings.effectsEnabled=!l.settings.effectsEnabled,ne(),I(),d.showToast(`Effects ${l.settings.effectsEnabled?"enabled":"disabled"}.`)},document.getElementById("exportSave").onclick=d.exportCurrentSave,document.getElementById("importSave").onclick=()=>document.getElementById("importFile").click(),document.getElementById("importFile").onchange=d.importSaveFile}function ke(){document.querySelectorAll('input[name="classId"]').forEach(u=>{u.addEventListener("change",x=>{l.classId=x.target.value,l.classId!=="rogue"&&(l.rogueRun={active:!1,completedQuestIds:[],bonusAwarded:!1}),A(),d.showBanner(`${c.find(re=>re.id===l.classId).name} chosen. Mechanical perk engaged.`)})});const s=document.getElementById("startErrandRun");s&&s.addEventListener("click",()=>{l.rogueRun={active:!0,completedQuestIds:[],bonusAwarded:!1},A(),d.showToast("Errand Run started. Chain two errand quests before the run ends for combo XP.")});const o=document.getElementById("endErrandRun");o&&o.addEventListener("click",()=>{l.rogueRun={active:!1,completedQuestIds:[],bonusAwarded:!1},A(),d.showToast("Errand Run ended. Pocket your daggers and hydrate.")});const k=document.getElementById("useRecoveryStance");k&&k.addEventListener("click",()=>{d.useRecoveryStance()})}function j(){document.querySelectorAll('[data-action="start-quest"]').forEach(s=>{s.addEventListener("click",()=>d.startQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="resume-quest"]').forEach(s=>{s.addEventListener("click",()=>d.resumeQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="block-quest"]').forEach(s=>{s.addEventListener("click",()=>d.blockQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="waiting-quest"]').forEach(s=>{s.addEventListener("click",()=>d.markQuestWaiting(s.dataset.questId))}),document.querySelectorAll('[data-action="low-energy"]').forEach(s=>{s.addEventListener("click",()=>d.useLowEnergyVersion(s.dataset.questId))}),document.querySelectorAll('[data-action="reset-quest"]').forEach(s=>{s.addEventListener("click",()=>d.resetQuest(s.dataset.questId))}),document.querySelectorAll('[data-action="review-quest"]').forEach(s=>{s.addEventListener("click",()=>{const o=document.querySelector(`[data-quest-card="${s.dataset.questId}"]`);o&&o.scrollIntoView({behavior:"smooth",block:"center"})})}),document.querySelectorAll("[data-subquest-id]").forEach(s=>{s.addEventListener("change",o=>{const k=o.target.dataset.questId,u=o.target.dataset.subquestId;d.toggleSubquest(k,u,o.target.checked)})}),document.querySelectorAll("[data-ritual-step]").forEach(s=>{s.addEventListener("change",o=>{const k=o.target.dataset.questId,u=o.target.dataset.ritualStep;d.toggleRitualStep(k,u,o.target.checked)})}),document.querySelectorAll("[data-support-task-id]").forEach(s=>{s.addEventListener("change",o=>{d.toggleSupportTask(o.target.dataset.supportChapterId,o.target.dataset.supportTaskId,o.target.checked)})})}function Z(){document.querySelectorAll('[data-action="start-boss"]').forEach(s=>{s.addEventListener("click",()=>d.startBoss(s.dataset.chapterId))}),document.querySelectorAll('[data-action="resume-boss"]').forEach(s=>{s.addEventListener("click",()=>d.resumeBoss(s.dataset.chapterId))}),document.querySelectorAll('[data-action="block-boss"]').forEach(s=>{s.addEventListener("click",()=>d.blockBoss(s.dataset.chapterId))}),document.querySelectorAll('[data-action="reset-boss"]').forEach(s=>{s.addEventListener("click",()=>d.resetBoss(s.dataset.chapterId))}),document.querySelectorAll("[data-boss-subquest-id]").forEach(s=>{s.addEventListener("change",o=>{const k=o.target.dataset.bossId,u=o.target.dataset.bossSubquestId;d.toggleBossSubquest(k,u,o.target.checked)})})}function be(s){if(document.getElementById("timerOverlay").hidden)return;if(s.key==="Escape"){s.preventDefault(),d.closeTimerOverlay(),d.showToast("Start Sprint dismissed. The quest remains. So does fate.");return}if(s.key!=="Tab")return;const o=[document.getElementById("confirmMomentum"),document.getElementById("skipMomentum")].filter(Boolean),k=o.indexOf(document.activeElement);s.shiftKey?k<=0&&(s.preventDefault(),o[o.length-1].focus()):k===o.length-1&&(s.preventDefault(),o[0].focus())}function qe(s){const o=document.getElementById("campaignSetupOverlay");if(o.hidden)return;if(s.key==="Escape"){s.preventDefault(),d.showToast("Character setup is required before the campaign begins. One more ritual, then glory.");return}if(s.key!=="Tab")return;const k=Array.from(o.querySelectorAll("button:not([disabled]), input:not([disabled])")).filter(x=>x.offsetParent!==null||x===document.activeElement);if(!k.length)return;const u=k.indexOf(document.activeElement);s.shiftKey?u<=0&&(s.preventDefault(),k[k.length-1].focus()):u===k.length-1&&(s.preventDefault(),k[0].focus())}function Se(s,o,k="quest"){const u=k==="quest"?V(o).quests.find(L=>L.id===o):R.flatMap(L=>L.bossPool).find(L=>L.id===o),x=k==="quest"?F(o):l.bosses[o],re=document.getElementById("questFlowOverlay"),$e=document.getElementById("questFlowBody");y.lastQuestFlowFocusBeforeDialog=document.activeElement,y.questFlowContext={mode:s,targetId:o,targetType:k},document.getElementById("questFlowEyebrow").textContent=u.title;const pe=s==="blocked"||s==="boss-blocked";document.getElementById("questFlowTitle").textContent=pe?"Build an unblock plan":"Mark as waiting",document.getElementById("questFlowCopy").textContent=pe?"Name the blocker and the smallest bridge back in.":"Waiting is real progress if you set the follow-up cleanly.",$e.innerHTML=pe?`
      <div class="setup-grid">
        <div class="field-stack"><label class="field-label" for="questBlockReason">What is blocking this ${k==="boss"?"boss":"quest"}?</label><input class="text-input" id="questBlockReason" type="text" value="${U(x.blockedReason||"")}" placeholder="Needs money, low energy, fear, no ride..." /></div>
        <div class="field-stack"><label class="field-label" for="questBlockType">Blocker type</label><input class="text-input" id="questBlockType" type="text" value="${U(x.blockerType||"")}" placeholder="energy, money, fear, waiting, transportation, confusion, conflict" /></div>
        <div class="field-stack"><label class="field-label" for="questBlockStep">Smallest unblock step</label><input class="text-input" id="questBlockStep" type="text" value="${U(x.blockPlan.smallestStep||"")}" placeholder="Write script, gather number, open doc, clear desk..." /></div>
        <div class="field-stack"><label class="field-label" for="questBlockSupport">Support needed</label><input class="text-input" id="questBlockSupport" type="text" value="${U(x.blockPlan.support||"")}" placeholder="body double, ride, reminder, review" /></div>
        <div class="field-stack"><label class="field-label" for="questBlockRetry">When to retry</label><input class="text-input" id="questBlockRetry" type="text" value="${U(x.blockPlan.retryWhen||"")}" placeholder="tomorrow 2 PM" /></div>
      </div>
    `:`
      <div class="setup-grid">
        <div class="field-stack"><label class="field-label" for="questWaitingReason">What are you waiting on?</label><input class="text-input" id="questWaitingReason" type="text" value="${U(x.waitingPlan.reason||"")}" placeholder="reply, callback, confirmation, document, ride" /></div>
        <div class="field-stack"><label class="field-label" for="questWaitingFollowup">Follow-up move</label><input class="text-input" id="questWaitingFollowup" type="text" value="${U(x.waitingPlan.followup||"")}" placeholder="set reminder, check portal, send nudge" /></div>
        <div class="field-stack"><label class="field-label" for="questWaitingRetry">When to check again</label><input class="text-input" id="questWaitingRetry" type="text" value="${U(x.waitingPlan.retryWhen||"")}" placeholder="Friday morning" /></div>
      </div>
    `,re.hidden=!1,z(),window.requestAnimationFrame(()=>{const L=$e.querySelector("input");L&&L.focus()})}function ce(){document.getElementById("questFlowOverlay").hidden=!0,z(),y.questFlowContext=null,y.lastQuestFlowFocusBeforeDialog&&typeof y.lastQuestFlowFocusBeforeDialog.focus=="function"&&y.lastQuestFlowFocusBeforeDialog.focus(),y.lastQuestFlowFocusBeforeDialog=null}function Ee(){const s=y.questFlowContext;if(!s)return;const o=s.targetType==="quest"?F(s.targetId):l.bosses[s.targetId];if(s.mode==="blocked"||s.mode==="boss-blocked"){o.blockedReason=document.getElementById("questBlockReason").value.trim()||"No reason recorded.",o.blockerType=document.getElementById("questBlockType").value.trim(),o.blockPlan={smallestStep:document.getElementById("questBlockStep").value.trim(),support:document.getElementById("questBlockSupport").value.trim(),retryWhen:document.getElementById("questBlockRetry").value.trim()},o.status="blocked",ce(),A(),d.showToast(`${s.targetType==="boss"?"Boss":"Quest"} marked blocked, but now with an actual bridge back in.`);return}o.waitingPlan={reason:document.getElementById("questWaitingReason").value.trim(),followup:document.getElementById("questWaitingFollowup").value.trim(),retryWhen:document.getElementById("questWaitingRetry").value.trim()},o.status="waiting",ce(),A(),d.showToast("Quest marked waiting. Administrative purgatory now has a follow-up plan.")}function ue(s){const o=document.getElementById("questFlowOverlay");if(o.hidden)return;if(s.key==="Escape"){s.preventDefault(),ce();return}if(s.key!=="Tab")return;const k=Array.from(o.querySelectorAll("button:not([disabled]), input:not([disabled])")).filter(x=>x.offsetParent!==null||x===document.activeElement);if(!k.length)return;const u=k.indexOf(document.activeElement);s.shiftKey?u<=0&&(s.preventDefault(),k[k.length-1].focus()):u===k.length-1&&(s.preventDefault(),k[0].focus())}return{bindGlobalEvents:ae,executeNextMove:H,retreatCampaignSetup:O,advanceCampaignSetup:ie,toggleSectionCollapse:G,bindIdentityEvents:J,bindClassEvents:ke,bindQuestEvents:j,bindBossEvents:Z,handleTimerKeydown:be,handleCampaignSetupKeydown:qe,openQuestFlowModal:Se,closeQuestFlowModal:ce,submitQuestFlowModal:Ee,handleQuestFlowKeydown:ue}}function dt(d){d.innerHTML=Ze;let y=fe(),c=A(),R=null,C=null,I=null,te=null,we=null,me=null,N={stateOk:!0,metaOk:!0,lastSavedAt:null,warning:""};const B={ctx:{get state(){return c},set state(e){c=e},get meta(){return y},set meta(e){y=e},persistenceStatus:N,get timerInterval(){return R},set timerInterval(e){R=e},get activeTimerQuestId(){return C},set activeTimerQuestId(e){C=e},get lastFocusBeforeDialog(){return I},set lastFocusBeforeDialog(e){I=e},get lastSetupFocusBeforeDialog(){return te},set lastSetupFocusBeforeDialog(e){te=e},get lastQuestFlowFocusBeforeDialog(){return we},set lastQuestFlowFocusBeforeDialog(e){we=e},get questFlowContext(){return me},set questFlowContext(e){me=e}},CLASS_DEFS:et,RESCUE_ITEMS:tt,REWARDS:Ne,BUDGET_EXAMPLES:st,SUPPORT_TASKS:je,CAMPAIGN_ORIGINS:Qe,CAMPAIGN_MOTIVATIONS:De,CAMPAIGN_VOWS:We,CAMPAIGN_FIRST_PROOFS:He,LOW_ENERGY_OPTIONS:nt,CHAPTERS:P,STORAGE_PREFIX:Ge,META_KEY:Ae,LEGACY_STORAGE_KEY:Le,defaultMeta:Re,defaultState:ve,formatDateTime:ot,escapeHtml:Ue,escapeAttr:at,getStorageKey:V,loadMeta:fe,saveMeta:U,loadState:A,saveState:_,hydrateState:ne,chooseRandomBossId:oe,getBossForChapter:D,getQuestEntry:S,getBossEntry:l,getChapterIndex:W,isChapterUnlocked:z,isChapterComplete:de,getCurrentChapter:ae,getQuestStatus:H,questProgress:O,getCompletedQuestCount:ie,getCompletedBossCount:G,getActiveQuestCount:J,getBlockedQuestCount:ke,getBossStatus:j,isBossRevealed:Z,findChapterForQuest:be,getLevel:qe,getOverallProgressPercent:Se,getTotalXP:ce,getMainQuestStatus:Ee,getCharacterName:ue,getCampaignOrigin:s,getCampaignMotivation:o,getCampaignVow:k,getCampaignFirstProof:u,getChapterGlyph:x,getStatusDisplay:re,getQuestGrade:$e,syncSlotName:pe,getSlotLabel:L,getSlotPreview:Ce,getUnlockedRewardCount:ge,getNextMove:Y,getNextObjectiveCopy:n,getRitualPlanSteps:p},F=it(B);Object.assign(B,F);const K=rt(B);Object.assign(B,K);const Be=lt(B);Object.assign(B,Be),ne(),F.renderAll(),Be.bindGlobalEvents();function V(e=y.currentSlot){return`${Ge}:${e}`}function fe(){try{const e=localStorage.getItem(Ae);return e?{...Re(),...JSON.parse(e)}:Re()}catch(e){return console.warn("Save-slot meta was corrupt. Rebuilding.",e),Re()}}function U(){try{return localStorage.setItem(Ae,JSON.stringify(y)),N.metaOk=!0,!0}catch(e){return N.metaOk=!1,N.warning="Slot metadata could not be saved on this device.",console.warn("Unable to save slot metadata.",e),!1}}function A(e=y.currentSlot){try{const t=localStorage.getItem(V(e))||(e==="slot1"?localStorage.getItem(Le):null);if(!t)return ve();const r=JSON.parse(t);return{...ve(),...r}}catch(t){return console.warn("Campaign save was corrupt. Rebuilding state.",t),ve()}}function _(){try{const e=Date.now(),t={...c,createdAt:c.createdAt||e,updatedAt:e};return localStorage.setItem(V(y.currentSlot),JSON.stringify(t)),c.createdAt=t.createdAt,c.updatedAt=t.updatedAt,N.stateOk=!0,N.lastSavedAt=e,N.metaOk&&(N.warning=""),!0}catch(e){return N.stateOk=!1,N.warning="This browser/device did not confirm saving. Export the slot if you need a backup.",console.warn("Unable to save campaign state.",e),!1}}function ne(){c.settings={...ve().settings,...c.settings||{}},c.settings.collapsedSections={...ve().settings.collapsedSections,...c.settings.collapsedSections||{}},c.campaign={...ve().campaign,...c.campaign||{}},c.rogueRun={...ve().rogueRun,...c.rogueRun||{}},c.monk={...ve().monk,...c.monk||{}},c.supportTasks=c.supportTasks||{};const e=Object.values(c.quests||{}).some(t=>t.status&&t.status!=="available")||Object.values(c.bosses||{}).some(t=>t.status&&t.status!=="locked");!c.campaign.complete&&e&&(c.campaign.complete=!0,c.campaign.firstProofDone=c.campaign.firstProofDone||!1,c.campaign.origin=c.campaign.origin||"rebuilding",c.campaign.motivation=c.campaign.motivation||"freedom"),P.forEach(t=>{c.supportTasks[t.id]||(c.supportTasks[t.id]={}),(je[t.id]||[]).forEach(m=>{typeof c.supportTasks[t.id][m.id]!="boolean"&&(c.supportTasks[t.id][m.id]=!1)}),c.chapterBosses[t.id]||(c.chapterBosses[t.id]=oe(t)),t.quests.forEach(m=>{c.quests[m.id]||(c.quests[m.id]={status:"available",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},waitingPlan:{reason:"",followup:"",retryWhen:""},subquests:{},ritualPlan:{},bonuses:{momentum:!1,ritual:!1,rogueCombo:!1,recovery:!1,lowEnergy:!1},startedAt:null,completedAt:null}),c.quests[m.id].blockPlan={smallestStep:"",support:"",retryWhen:"",...c.quests[m.id].blockPlan||{}},c.quests[m.id].waitingPlan={reason:"",followup:"",retryWhen:"",...c.quests[m.id].waitingPlan||{}},c.quests[m.id].bonuses={momentum:!1,ritual:!1,rogueCombo:!1,recovery:!1,lowEnergy:!1,...c.quests[m.id].bonuses||{}},m.subquests.forEach(v=>{typeof c.quests[m.id].subquests[v.id]!="boolean"&&(c.quests[m.id].subquests[v.id]=!1)}),m.ritualPlan&&p(m).forEach(v=>{typeof c.quests[m.id].ritualPlan[v.id]!="boolean"&&(c.quests[m.id].ritualPlan[v.id]=!1)})});const r=D(t);c.bosses[r.id]||(c.bosses[r.id]={status:"locked",blockedReason:"",blockerType:"",blockPlan:{smallestStep:"",support:"",retryWhen:""},subquests:{},bonuses:{},startedAt:null,completedAt:null}),c.bosses[r.id].blockPlan={smallestStep:"",support:"",retryWhen:"",...c.bosses[r.id].blockPlan||{}},r.subquests.forEach(m=>{typeof c.bosses[r.id].subquests[m.id]!="boolean"&&(c.bosses[r.id].subquests[m.id]=!1)})}),_(),pe()}function oe(e){const t=e.bossPool;return t[Math.floor(Math.random()*t.length)].id}function D(e){return e.bossPool.find(t=>t.id===c.chapterBosses[e.id])||e.bossPool[0]}function S(e){return c.quests[e]}function l(e){return c.bosses[D(e).id]}function W(e){return P.findIndex(t=>t.id===e)}function z(e){const t=W(e.id);return t===0?!0:de(P[t-1])}function de(e){return e.quests.every(r=>H(r,e)==="completed")&&j(e)==="completed"}function ae(){return P.find(e=>z(e)&&!de(e))||P[P.length-1]}function H(e,t){if(!z(t))return"locked";const r=S(e.id);if(r.status==="completed")return"completed";if(r.status==="waiting")return"waiting";if(r.status==="blocked")return"blocked";const m=e.subquests.filter(h=>h.required),v=e.requiredCount||m.length,$=m.filter(h=>r.subquests[h.id]).length;return $>0&&$<v||$>=v&&v>0?"in-progress":r.status==="started"?"started":"available"}function O(e){const t=S(e.id),r=e.subquests.filter(h=>h.required).length,m=e.subquests.filter(h=>h.required&&t.subquests[h.id]).length,v=e.subquests.filter(h=>!h.required&&t.subquests[h.id]).length,$=e.requiredCount||r;return{required:r,doneRequired:m,optionalDone:v,needed:$}}function ie(){return P.flatMap(e=>e.quests).filter(e=>S(e.id).status==="completed").length}function G(){return P.filter(e=>j(e)==="completed").length}function J(){return P.flatMap(e=>e.quests).filter(e=>{const t=H(e,be(e.id));return t==="started"||t==="in-progress"}).length+P.filter(e=>{const t=j(e);return t==="started"||t==="in-progress"}).length}function ke(){return P.flatMap(e=>e.quests).filter(e=>S(e.id).status==="blocked").length+P.filter(e=>j(e)==="blocked").length}function j(e){const t=D(e),r=c.bosses[t.id];if(!z(e)||!Z(e))return"locked";if(r.status==="completed")return"completed";if(r.status==="blocked")return"blocked";const m=t.subquests.filter(v=>r.subquests[v.id]).length;return m>0&&m<t.subquests.length?"in-progress":r.status==="started"?"started":"available"}function Z(e){return e.quests.filter(r=>S(r.id).status==="completed").length>=e.bossRevealAt}function be(e){return P.find(t=>t.quests.some(r=>r.id===e))}function qe(){return Math.min(G()+1,P.length+1)}function Se(){const e=P.length*2;let t=0;return P.forEach(r=>{r.quests.every(m=>S(m.id).status==="completed")&&(t+=1),j(r)==="completed"&&(t+=1)}),Math.round(t/e*100)}function ce(){let e=0;return P.forEach(t=>{t.quests.forEach(v=>{const $=S(v.id);v.subquests.forEach(h=>{$.subquests[h.id]&&(e+=h.xp)}),$.status==="completed"&&(e+=v.completionBonus),$.status==="completed"&&$.bonuses.momentum&&(e+=10),$.status==="completed"&&$.bonuses.ritual&&(e+=12),$.status==="completed"&&$.bonuses.recovery&&(e+=6),$.status==="completed"&&$.bonuses.rogueCombo&&(e+=8),$.bonuses.lowEnergy&&(e+=4)});const r=D(t),m=c.bosses[r.id];r.subquests.forEach(v=>{m.subquests[v.id]&&(e+=v.xp)}),m.status==="completed"&&(e+=r.completionBonus)}),e}function Ee(){return P.every(e=>de(e))?"Independent Living Established":P.every(e=>z(e))?"Launch In Progress":ie()>0?"Ready to Launch":"Not yet launched"}function ue(){return(c.characterName||"").trim()||"Unnamed Hero"}function s(){return Qe.find(e=>e.id===c.campaign.origin)||null}function o(){return De.find(e=>e.id===c.campaign.motivation)||null}function k(){return We.find(e=>e.id===c.campaign.vow)||null}function u(){return He.find(e=>e.id===c.campaign.firstProof)||null}function x(e){return{"personal-stability":"🌅","household-competence":"🧹","income-admin":"📜","budget-housing":"🪙","trial-independence":"🏰"}[e.id]||"✨"}function re(e){return{available:{label:"Available",icon:"✦"},started:{label:"Touched",icon:"•"},"in-progress":{label:"In motion",icon:"➜"},waiting:{label:"Waiting",icon:"⏳"},blocked:{label:"Blocked",icon:"⚠"},completed:{label:"Cleared",icon:"✓"},locked:{label:"Locked",icon:"🔒"}}[e]||{label:e,icon:"•"}}function $e(e,t){const r=H(e,t),m=S(e.id),v=O(e);return r==="completed"?"Cleared":r==="waiting"?"Waiting":r==="blocked"?"Blocked":v.doneRequired>0?"Advanced":m.bonuses.lowEnergy||r==="started"?"Touched":"Unclaimed"}function pe(){const e=(c.characterName||"").trim();y.slotNames[y.currentSlot]=e,U()}function L(e){const t=y.slotNames[e];return t&&t.trim()?t.trim():`Slot ${e.replace("slot","")}`}function Ce(e){try{const t=localStorage.getItem(V(e))||(e==="slot1"?localStorage.getItem(Le):null);return t?JSON.parse(t):null}catch{return null}}function ge(){return Ne.filter(e=>ie()>=e.at).length}function M(){return P.flatMap(e=>e.quests.map(t=>({chapter:e,quest:t}))).find(({chapter:e,quest:t})=>{const r=H(t,e);return r==="started"||r==="in-progress"})||null}function Y(){var $;if(!c.campaign.complete)return{type:"Character creation",heading:"Begin Chapter 0: Base Camp",copy:"Forge the character first: name, current situation, class, motivation, and one tiny proof action.",button:"Create your character",action:"open-setup"};if(!c.campaign.firstProofDone)return{type:"First proof",heading:(($=u())==null?void 0:$.title)||"Take the first tiny proof action",copy:"Do this one small real-world action, then mark it done so the campaign begins with evidence instead of vibes.",button:"Mark first proof done",action:"complete-first-proof"};const e=M();if(e){const h=O(e.quest),he=Math.max(h.needed-h.doneRequired,0);return{type:"Resume quest",heading:e.quest.title,copy:he>0?`${he} required step${he===1?"":"s"} left in ${e.chapter.title}.`:`This quest is in motion inside ${e.chapter.title}.`,button:"Resume current quest",action:"scroll-quest",questId:e.quest.id}}const t=P.flatMap(h=>h.quests.map(he=>({chapter:h,quest:he}))).find(({quest:h})=>S(h.id).status==="waiting");if(t){const h=S(t.quest.id).waitingPlan;return{type:"Follow-up",heading:t.quest.title,copy:h.followup?`Waiting state active. Next move: ${h.followup}${h.retryWhen?` • retry ${h.retryWhen}`:""}`:"Waiting is still progress if you actually set the follow-up.",button:"Review waiting quest",action:"scroll-quest",questId:t.quest.id}}const r=P.flatMap(h=>h.quests.map(he=>({chapter:h,quest:he}))).find(({quest:h})=>S(h.id).status==="blocked");if(r){const h=S(r.quest.id).blockPlan;return{type:"Unblock move",heading:r.quest.title,copy:h.smallestStep?`Smallest bridge back in: ${h.smallestStep}${h.support?` • support: ${h.support}`:""}${h.retryWhen?` • retry ${h.retryWhen}`:""}`:"This quest is blocked. Name the smallest next move instead of arguing with the fog.",button:"Review unblock plan",action:"scroll-quest",questId:r.quest.id}}const m=ae(),v=m.quests.find(h=>H(h,m)==="available");return v?{type:"Start quest",heading:v.title,copy:`Best next move in ${m.title}. Start it and the objective chain will appear instead of lurking in theory.`,button:"Start next quest",action:"start-quest",questId:v.id}:Z(m)&&j(m)!=="completed"?{type:"Boss fight",heading:D(m).title,copy:"The chapter is waiting on its boss. Defeat it and the road opens into the next region.",button:"Fight revealed boss",action:"start-boss",chapterId:m.id}:{type:"Victory lap",heading:"The Independent Keep stands",copy:"You cleared the campaign. At this point the skeleton is just trying not to look proud.",button:"Review the journey",action:"jump-journey"}}function n(){const e=M();if(e){const m=O(e.quest);return`Current objective: ${e.quest.title} — ${m.doneRequired}/${m.needed} needed step(s) cleared.`}const t=ae(),r=t.quests.find(m=>H(m,t)==="available");return r?`Next move: start “${r.title}” in ${t.title}.`:Z(t)&&j(t)!=="completed"?`Boss time: ${D(t).title} is loose in ${t.title}.`:P.every(m=>de(m))?"The keep is yours. At this point the skeleton is just applauding.":"Keep going. A real campaign beats vague guilt every single time."}function p(e){const t=new Set(e.tags);return[{id:"prep-reminders",title:"Set a reminder or calendar block",xp:0},{id:"prep-supplies",title:t.has("housing")||t.has("budget")?"Gather numbers, links, or documents you will need":"Gather anything needed before starting",xp:0},{id:"prep-script",title:t.has("admin")||t.has("work")?"Write a quick script or checklist for the scary part":"Write the next three actions in plain language",xp:0}]}}const _e=document.getElementById("app");if(!_e)throw new Error("App root #app was not found. The skull has nowhere to manifest.");dt(_e);
