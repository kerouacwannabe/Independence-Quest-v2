// @ts-nocheck
export const CLASS_DEFS = [
  {
    id: 'barbarian',
    emoji: '🪓',
    name: 'Barbarian of Momentum',
    perk: 'Every quest start triggers a 60-second Start Sprint. Confirm one physical first action to earn a Momentum XP bonus.',
    note: 'Best for brains that get weaker the longer they think. Hit the thing before the dread committee assembles.'
  },
  {
    id: 'rogue',
    emoji: '🗡️',
    name: 'Rogue of Errands',
    perk: 'Start an Errand Run and chain two eligible quests in the same outing for a combo XP reward.',
    note: 'Best for people who thrive on quick wins, outside missions, and sneaky practical progress.'
  },
  {
    id: 'wizard',
    emoji: '📜',
    name: 'Wizard of Life Admin',
    perk: 'Admin, work, budget, and housing quests reveal a Ritual Plan. Complete the prep ritual for bonus XP and cleaner execution.',
    note: 'Best for people whose brains calm down when checklists, reminders, scripts, and documents are all named out loud.'
  },
  {
    id: 'monk',
    emoji: '🕯️',
    name: 'Monk of Routine',
    perk: 'Routine subquests build Discipline. Spend 3 Discipline on Recovery Stance to rescue a blocked quest and auto-clear its first step.',
    note: 'Best for people whose entire mortal situation improves when the basics stop being random.'
  }
];

export const RESCUE_ITEMS = [
  {
    title: 'I am stuck and hissing at the furniture',
    copy: 'Pick the smallest visible action. Start a 5-minute timer. Touch the task before judging whether it deserves a sermon.'
  },
  {
    title: 'I am overwhelmed by everything everywhere all at once',
    copy: 'Write exactly three things: one must-do, one should-do, one easy win. Anything beyond that is decorative suffering.'
  },
  {
    title: 'I forgot everything',
    copy: 'Check the quest log, check the calendar, check messages, then choose one next action. Memory is not a reliable storage format.'
  },
  {
    title: 'I do not want to do the thing',
    copy: 'Promise yourself five ugly minutes only. If you still hate it after five honest minutes, reassess. Usually momentum does the heavy lifting.'
  },
  {
    title: 'Low-energy mode only',
    copy: 'Do a micro quest: trash, one sink load of dishes, one email, one shower, or a 10-minute room reset. Tiny counts.'
  },
  {
    title: 'Avoidance goblin is nesting',
    copy: 'Use body doubling, music, a visible timer, or narrate the next action out loud. Silence and ambiguity are goblin food.'
  }
];

export const REWARDS = [
  { at: 3, title: 'Minor Loot Drop', copy: 'Choose dinner, a favorite snack, or guilt-free game time.' },
  { at: 6, title: 'Level 2 Reward', copy: 'Small purchase, nice outing, or a properly smug evening.' },
  { at: 9, title: 'Rare Loot', copy: 'Comfort item, hobby item, or a deliberate lazy night with no guilt tax.' },
  { at: 12, title: 'Epic Reward', copy: 'Something useful and memorable. You are not merely collecting stickers now.' },
  { at: 15, title: 'Legendary Loot', copy: 'Celebrate the fact that this campaign now points at real independence.' }
];

export const BUDGET_EXAMPLES = [
  {
    title: 'Shared room / housemates',
    total: '~$1,480–$1,640',
    items: [
      'Rent: $850',
      'Electric: $60',
      'Water / sewer / garbage: $40',
      'Internet: $35',
      'Phone: $50',
      'Groceries: $300',
      'Transit: $90 or car costs $250+',
      'Renter’s insurance: $15',
      'Household supplies: $40'
    ]
  },
  {
    title: 'Roommate apartment split',
    total: '~$1,700–$2,000+',
    items: [
      'Rent share: $1,050',
      'Electric: $70',
      'Water / sewer / garbage: $50',
      'Internet: $40',
      'Phone: $50',
      'Groceries: $325',
      'Transit: $100 or car costs $300+',
      'Renter’s insurance: $15',
      'Household supplies: $50'
    ]
  },
  {
    title: 'Solo studio',
    total: '~$2,230–$2,730+',
    items: [
      'Rent: $1,450',
      'Electric: $80',
      'Water / sewer / garbage: $60',
      'Internet: $60',
      'Phone: $50',
      'Groceries: $350',
      'Transit: $100 or car costs $300+',
      'Renter’s insurance: $20',
      'Household supplies: $60'
    ]
  }
];

export const SUPPORT_TASKS = {
  'personal-stability': [
    { id: 'ps-checkin', title: 'Run one calm check-in, not a shame spiral', copy: 'Ask what would help today and keep the tone collaborative instead of prosecutorial.' },
    { id: 'ps-launchpad', title: 'Help set up a visible launch pad', copy: 'Create one obvious spot for keys, wallet, meds, or bag so memory is not doing all the labor.' },
    { id: 'ps-celebrate', title: 'Acknowledge one small win out loud', copy: 'Tiny praise works better than theatrical disappointment. Astonishing, I know.' }
  ],
  'household-competence': [
    { id: 'hc-clarify', title: 'Clarify one owned chore or expectation', copy: 'Write down what belongs to whom so nobody has to interpret kitchen omens.' },
    { id: 'hc-stepback', title: 'Do not rescue a task too early', copy: 'Give the player room to own the chore instead of instantly absorbing it back.' },
    { id: 'hc-supplies', title: 'Share where supplies and tools live', copy: 'Make detergent, trash bags, cleaning spray, and backup soap easy to find.' }
  ],
  'income-admin': [
    { id: 'ia-bodydouble', title: 'Offer one body-double session', copy: 'Sit nearby while the player applies, calls, or handles forms. Presence is a buff.' },
    { id: 'ia-docs', title: 'Help gather document locations', copy: 'Identify where IDs, insurance, banking details, or résumé files are hiding.' },
    { id: 'ia-script', title: 'Help script a call or email', copy: 'One short script often kills three hours of dread.' }
  ],
  'budget-housing': [
    { id: 'bh-reality', title: 'Share real rent and utility examples', copy: 'Talk actual numbers so the housing plan stays grounded in reality.' },
    { id: 'bh-boundaries', title: 'Clarify what support is realistic', copy: 'Temporary help, deposits, moving help, deadlines—name it cleanly.' },
    { id: 'bh-review', title: 'Review the budget without ridicule', copy: 'Point out gaps like a strategist, not like an irritated landlord ghost.' }
  ],
  'trial-independence': [
    { id: 'ti-stepback', title: 'Let the player own the week', copy: 'Avoid hovering. The whole point is seeing what holds when support backs off a little.' },
    { id: 'ti-checkpoint', title: 'Schedule one checkpoint conversation', copy: 'Check progress at a set time instead of turning the whole week into ambient surveillance.' },
    { id: 'ti-reward', title: 'Help celebrate progress', copy: 'When the week works, celebrate it like a real milestone rather than shrugging past it.' }
  ]
};

export const CAMPAIGN_ORIGINS = [
  { id: 'overwhelmed', title: 'Overwhelmed but ready', copy: 'You need a clear lane, not another avalanche of advice.' },
  { id: 'stuck', title: 'Stuck in dependence', copy: 'You want real movement, not another month of waiting for motivation to descend from the heavens.' },
  { id: 'close', title: 'Almost there, needs structure', copy: 'You can do a lot already. The missing ingredient is consistency and a saner map.' },
  { id: 'rebuilding', title: 'Trying again after setbacks', copy: 'This is not starting from zero. It is regrouping with better information and less shame.' }
];

export const CAMPAIGN_MOTIVATIONS = [
  { id: 'peace', title: 'Peace / privacy', copy: 'You want a home base that feels calm instead of crowded or chaotic.' },
  { id: 'freedom', title: 'Freedom / autonomy', copy: 'You want your own decisions, your own schedule, and your own damn keys.' },
  { id: 'less-conflict', title: 'Less conflict at home', copy: 'You want fewer pressure points, fewer arguments, and less ambient friction.' },
  { id: 'self-proof', title: 'Prove to myself I can do it', copy: 'You want evidence, not vibes, that you can run your own life.' },
  { id: 'target-move', title: 'Prepare for a real move-out goal', copy: 'There is an actual horizon here, not just an abstract someday.' }
];

export const CAMPAIGN_VOWS = [
  { id: 'start', title: 'I will prove I can start.', copy: 'Perfect for action paralysis and stalled momentum.' },
  { id: 'finish', title: 'I will prove I can finish.', copy: 'Best when half-done tasks breed in the dark.' },
  { id: 'routine', title: 'I will prove I can keep a routine.', copy: 'Best when chaos is caused by missing basics, not lack of intelligence.' },
  { id: 'admin', title: 'I will prove I can face adult admin.', copy: 'Best when paperwork and messages are the dragon at the gate.' }
];

export const CAMPAIGN_FIRST_PROOFS = [
  { id: 'dress', title: 'Put on real clothes or handle hygiene', copy: 'A tiny declaration that the day has, regrettably, begun.' },
  { id: 'water-surface', title: 'Drink water and clear one surface', copy: 'A humble anti-chaos ritual.' },
  { id: 'open-doc', title: 'Open the résumé or budget doc', copy: 'The door to the scary task counts as a door.' },
  { id: 'trash', title: 'Take out one bag of trash', copy: 'Concrete, visible, and satisfyingly mortal.' },
  { id: 'send-message', title: 'Send one needed message', copy: 'A small act of civilization.' }
];

export const LOW_ENERGY_OPTIONS = {
  'morning-summoning': { title: 'Low-energy version', copy: 'Get out of bed, do one hygiene-or-clothes step, and place one item for tomorrow.' },
  'feed-the-adventurer': { title: 'Low-energy version', copy: 'Eat something with protein, drink water, and rinse one dish or wipe one spot.' },
  'reset-the-lair': { title: 'Low-energy version', copy: 'Clear 5 visible items or do one stage of laundry only.' },
  'gold-quest': { title: 'Low-energy version', copy: 'Open the job board, save one lead, and make the résumé visible.' },
  'communications-ward': { title: 'Low-energy version', copy: 'Write a call or email script, save the number, and leave the tab open.' },
  'real-survival-budget': { title: 'Low-energy version', copy: 'Choose one housing model and estimate only rent plus one utility.' },
  'housing-scout': { title: 'Low-energy version', copy: 'Save 2 real listings. No dissertation required.' },
  'trial-week-charter': { title: 'Low-energy version', copy: 'Track one day honestly and write what broke first.' }
};

export const CHAPTERS = [
  {
    id: 'personal-stability',
    level: 1,
    title: 'Personal Stability',
    journeyTitle: 'Base Camp to the Watchfire',
    intro: 'Wake, wash, feed, and reset the lair like someone expecting to remain among the living.',
    bossRevealAt: 2,
    quests: [
      {
        id: 'morning-summoning',
        title: 'Morning Summoning Circle',
        summary: 'Build a morning ritual that gets the day started without demanding perfection at sunrise.',
        tags: ['routine'],
        completionBonus: 16,
        subquests: [
          { id: 'wake-window', title: 'Leave bed or begin wake-up within the target window', xp: 10, required: true },
          { id: 'wash-dress', title: 'Handle hygiene or get into daytime clothes', xp: 10, required: true },
          { id: 'launch-pad', title: 'Do one ready-for-day action: meds, bag, keys, breakfast setup, or clothes', xp: 8, required: true },
          { id: 'light-reset', title: 'Optional: get daylight, breakfast, or a two-minute outside reset', xp: 6, required: false }
        ]
      },
      {
        id: 'feed-the-adventurer',
        title: 'Feed the Adventurer',
        summary: 'Get actual fuel in the body instead of running on fog, caffeine, and regret. Low-energy fuel still counts.',
        tags: ['routine', 'household'],
        completionBonus: 16,
        subquests: [
          { id: 'cook-meal', title: 'Cook one real meal', xp: 10, required: true },
          { id: 'clean-kitchen', title: 'Do the dishes or wipe the counter after eating', xp: 8, required: true },
          { id: 'water-move', title: 'Drink water and take a 10-minute reset walk', xp: 8, required: true },
          { id: 'leftovers', title: 'Optional: pack leftovers or a snack for later', xp: 6, required: false }
        ]
      },
      {
        id: 'reset-the-lair',
        title: 'Reset the Lair',
        summary: 'Restore the personal habitat so it stops draining hit points just by existing.',
        tags: ['household', 'errand'],
        completionBonus: 18,
        subquests: [
          { id: 'room-reset', title: 'Run a 15-minute room reset', xp: 10, required: true },
          { id: 'laundry-cycle', title: 'Wash, dry, and put away one load of laundry', xp: 10, required: true },
          { id: 'trash-out', title: 'Take out trash and replace the bag', xp: 8, required: true },
          { id: 'calm-talk', title: 'Optional: have one calm planning conversation', xp: 6, required: false }
        ]
      }
    ],
    bossPool: [
      {
        id: 'slime-of-disorder',
        title: 'The Slime of Disorder',
        summary: 'A sticky creature made of postponed cleanup, drifting clothes, and suspicious cups.',
        completionBonus: 60,
        subquests: [
          { id: 'slime-hygiene', title: 'Complete hygiene', xp: 12, required: true },
          { id: 'slime-laundry', title: 'Finish one full laundry cycle', xp: 12, required: true },
          { id: 'slime-space', title: 'Clean the primary personal space', xp: 12, required: true },
          { id: 'slime-meal', title: 'Make one meal in the same day', xp: 12, required: true }
        ]
      },
      {
        id: 'clockwork-ghoul',
        title: 'The Clockwork Ghoul of Sleep Drift',
        summary: 'This rattling horror feeds on random sleep, skipped mornings, and the phrase “I’ll fix it tomorrow.”',
        completionBonus: 60,
        subquests: [
          { id: 'ghoul-bedtime', title: 'Set tomorrow’s wake time and bedtime', xp: 12, required: true },
          { id: 'ghoul-morning', title: 'Complete the morning routine on target', xp: 12, required: true },
          { id: 'ghoul-reset', title: 'Do one evening reset before bed', xp: 12, required: true },
          { id: 'ghoul-alarms', title: 'Place alarms and clothes for the next day', xp: 12, required: true }
        ]
      }
    ]
  },
  {
    id: 'household-competence',
    level: 2,
    title: 'Shared Household Competence',
    journeyTitle: 'The Town of Chores and Other Dark Arts',
    intro: 'Contribute like a reliable housemate instead of a mysterious indoor weather event.',
    bossRevealAt: 2,
    quests: [
      {
        id: 'duty-charter',
        title: 'Household Duty Charter',
        summary: 'Own a recurring chore and stop acting shocked when it comes back next week.',
        tags: ['household', 'routine'],
        completionBonus: 18,
        subquests: [
          { id: 'pick-chore', title: 'Choose one recurring household chore', xp: 8, required: true },
          { id: 'perform-chore', title: 'Do it once without being chased', xp: 10, required: true },
          { id: 'repeat-chore', title: 'Do it again on the next scheduled round', xp: 10, required: true },
          { id: 'announce-chore', title: 'Optional: tell the household you own it now', xp: 6, required: false }
        ]
      },
      {
        id: 'supply-run',
        title: 'Supply Run of Civic Decency',
        summary: 'Feed the house, notice shortages, and prevent soap from becoming folklore.',
        tags: ['errand', 'household'],
        completionBonus: 18,
        subquests: [
          { id: 'check-supplies', title: 'Check what food or supplies are low', xp: 8, required: true },
          { id: 'join-grocery', title: 'Join a grocery or supply run', xp: 10, required: true },
          { id: 'put-away', title: 'Put away what came home', xp: 8, required: true },
          { id: 'plan-three-meals', title: 'Optional: write down three simple meal ideas', xp: 6, required: false }
        ]
      },
      {
        id: 'shared-space-respect',
        title: 'Shared-Space Respect',
        summary: 'Practice the ancient magic of leaving common areas better than you found them.',
        tags: ['household', 'admin'],
        completionBonus: 18,
        subquests: [
          { id: 'common-clean', title: 'Clean a bathroom or vacuum a common area', xp: 10, required: true },
          { id: 'replace-supply', title: 'Replace one depleted shared supply', xp: 8, required: true },
          { id: 'message-back', title: 'Respond to one household question or coordination message', xp: 8, required: true },
          { id: 'label-day', title: 'Optional: write down a weekly reset day', xp: 6, required: false }
        ]
      }
    ],
    bossPool: [
      {
        id: 'chore-hydra',
        title: 'The Chore Hydra',
        summary: 'Every time one task is ignored, two more grow where it stood.',
        completionBonus: 75,
        subquests: [
          { id: 'hydra-recurring', title: 'Own one recurring chore for a full week', xp: 14, required: true },
          { id: 'hydra-common', title: 'Complete a shared-space cleanup', xp: 14, required: true },
          { id: 'hydra-supply', title: 'Replace a low household supply without prompting', xp: 14, required: true },
          { id: 'hydra-communication', title: 'Resolve one avoided household communication', xp: 14, required: true }
        ]
      },
      {
        id: 'negotiation-specter',
        title: 'The Negotiation Specter',
        summary: 'A translucent nightmare that haunts vague expectations and passive-aggressive silence.',
        completionBonus: 75,
        subquests: [
          { id: 'specter-expectations', title: 'Clarify one household expectation', xp: 14, required: true },
          { id: 'specter-clean', title: 'Handle a shared-space chore on schedule', xp: 14, required: true },
          { id: 'specter-food', title: 'Contribute to a real food run or meal plan', xp: 14, required: true },
          { id: 'specter-checkin', title: 'Do one calm weekly check-in conversation', xp: 14, required: true }
        ]
      }
    ]
  },
  {
    id: 'income-admin',
    level: 3,
    title: 'Income and Admin',
    journeyTitle: 'The City of Work, Paperwork, and Bureaucratic Necromancy',
    intro: 'Gather documents, make calls, apply for work, and stab a few forms in the face.',
    bossRevealAt: 2,
    quests: [
      {
        id: 'bureaucratic-spellbook',
        title: 'Bureaucratic Spellbook',
        summary: 'Collect the documents and systems that keep adult life from eating you raw.',
        tags: ['admin', 'work'],
        completionBonus: 22,
        ritualPlan: true,
        subquests: [
          { id: 'gather-docs', title: 'Gather ID, banking, insurance, and core documents', xp: 10, required: true },
          { id: 'update-resume', title: 'Update the résumé', xp: 12, required: true },
          { id: 'calendar-reminders', title: 'Set reminders for one real deadline or appointment', xp: 10, required: true },
          { id: 'password-system', title: 'Optional: improve the password or document folder system', xp: 8, required: false }
        ]
      },
      {
        id: 'gold-quest',
        title: 'Gold Quest',
        summary: 'Turn vague “I should look for work” energy into smaller, survivable steps that still move the money problem forward.',
        tags: ['work', 'admin'],
        completionBonus: 22,
        requiredCount: 2,
        ritualPlan: true,
        subquests: [
          { id: 'identify-leads', title: 'Scout 3 leads or next-step opportunities', xp: 10, required: true },
          { id: 'apply-three', title: 'Send 1–2 real applications or outreach attempts', xp: 12, required: true },
          { id: 'follow-up', title: 'Send one follow-up, portal check, or update', xp: 10, required: true },
          { id: 'focus-block', title: 'Optional: do one honest 45-minute focus block', xp: 8, required: false }
        ]
      },
      {
        id: 'communications-ward',
        title: 'Communications Ward',
        summary: 'Defeat dread by handling messages, calls, and one appointment like a civilized goblin.',
        tags: ['admin', 'errand'],
        completionBonus: 22,
        requiredCount: 2,
        ritualPlan: true,
        subquests: [
          { id: 'adult-call', title: 'Make one adult phone call', xp: 10, required: true },
          { id: 'respond-important', title: 'Respond to one important message or email', xp: 10, required: true },
          { id: 'schedule-thing', title: 'Schedule or confirm one appointment', xp: 10, required: true },
          { id: 'script-out', title: 'Optional: write a call or email script first', xp: 8, required: false }
        ]
      }
    ],
    bossPool: [
      {
        id: 'bureaucratic-wraith',
        title: 'The Bureaucratic Wraith',
        summary: 'An incorporeal horror made of unanswered calls, draft résumés, and expired tabs.',
        completionBonus: 90,
        subquests: [
          { id: 'wraith-docs', title: 'Gather the important documents', xp: 16, required: true },
          { id: 'wraith-resume', title: 'Finish the résumé update', xp: 16, required: true },
          { id: 'wraith-call', title: 'Make one adult call', xp: 16, required: true },
          { id: 'wraith-apps', title: 'Submit 3 real job applications or equivalent outreach', xp: 16, required: true }
        ]
      },
      {
        id: 'interview-minotaur',
        title: 'The Interview Minotaur',
        summary: 'It lives in a labyrinth of self-doubt, overthinking, and terrible webcam angles.',
        completionBonus: 90,
        subquests: [
          { id: 'mino-questions', title: 'Practice 3 interview questions aloud', xp: 16, required: true },
          { id: 'mino-leads', title: 'Choose 5 leads worth pursuing', xp: 16, required: true },
          { id: 'mino-follow-up', title: 'Send one outreach or follow-up', xp: 16, required: true },
          { id: 'mino-calendar', title: 'Set reminder blocks for applications', xp: 16, required: true }
        ]
      }
    ]
  },
  {
    id: 'budget-housing',
    level: 4,
    title: 'Budget and Housing Readiness',
    journeyTitle: 'The Road of Rent, Utilities, and Cold Arithmetic',
    intro: 'This is where the fantasy wrapper meets the landlord’s ledger. Deep breaths.',
    bossRevealAt: 2,
    quests: [
      {
        id: 'real-survival-budget',
        title: 'Build a Real Survival Budget',
        summary: 'Choose a housing model, estimate the real monthly cost, and compare it to actual income. If the math is ugly, the honest answer still counts as progress.',
        tags: ['budget', 'housing', 'admin'],
        completionBonus: 24,
        ritualPlan: true,
        specialPanel: 'budget-guide',
        subquests: [
          { id: 'after-tax-income', title: 'Estimate after-tax monthly income', xp: 10, required: true },
          { id: 'housing-model', title: 'Choose a housing model: shared room, roommate split, or solo studio', xp: 10, required: true },
          { id: 'utilities-phone', title: 'Estimate utilities, internet, and phone', xp: 10, required: true },
          { id: 'food-transport', title: 'Estimate groceries, transportation, and supplies', xp: 10, required: true },
          { id: 'compare-total', title: 'Compare the total cost to income and call it viable / needs roommate / needs more income', xp: 12, required: true },
          { id: 'savings-target', title: 'Optional: choose a monthly savings target', xp: 8, required: false }
        ]
      },
      {
        id: 'housing-scout',
        title: 'Housing Scout',
        summary: 'Look at real listings so the move stops being fog and starts being math.',
        tags: ['housing', 'errand'],
        completionBonus: 24,
        ritualPlan: true,
        subquests: [
          { id: 'find-listings', title: 'Research 5 real listings', xp: 10, required: true },
          { id: 'compare-models', title: 'Compare shared housing to solo options', xp: 10, required: true },
          { id: 'requirements', title: 'Note deposits, screening rules, or move-in requirements', xp: 10, required: true },
          { id: 'shortlist', title: 'Optional: shortlist the best 2 options', xp: 8, required: false }
        ]
      },
      {
        id: 'move-in-war-chest',
        title: 'Move-In War Chest',
        summary: 'Figure out what the launch really costs before rent jumps out from behind a tree.',
        tags: ['budget', 'housing'],
        completionBonus: 24,
        ritualPlan: true,
        subquests: [
          { id: 'app-fees', title: 'Estimate application fees and deposits', xp: 10, required: true },
          { id: 'first-month', title: 'Estimate first month’s rent and utility setup costs', xp: 10, required: true },
          { id: 'basic-setup', title: 'Estimate basic household setup costs', xp: 10, required: true },
          { id: 'buffer', title: 'Choose an emergency buffer target', xp: 10, required: true },
          { id: 'weekly-contribution', title: 'Optional: set a weekly savings contribution', xp: 8, required: false }
        ]
      }
    ],
    bossPool: [
      {
        id: 'rent-lich',
        title: 'The Rent Lich',
        summary: 'Ancient, dry, and powered entirely by deposits, fees, and numbers that must add up.',
        completionBonus: 110,
        subquests: [
          { id: 'lich-budget', title: 'Build the realistic monthly budget', xp: 18, required: true },
          { id: 'lich-movein', title: 'Estimate move-in costs', xp: 18, required: true },
          { id: 'lich-options', title: 'Compare at least 2 housing paths', xp: 18, required: true },
          { id: 'lich-gap', title: 'Name the affordability gap and the next action to close it', xp: 18, required: true }
        ]
      },
      {
        id: 'utility-chimera',
        title: 'The Utility Chimera',
        summary: 'One head is electric, one head is internet, one head is groceries, and all of them want money.',
        completionBonus: 110,
        subquests: [
          { id: 'chimera-rent', title: 'Estimate rent by housing model', xp: 18, required: true },
          { id: 'chimera-bills', title: 'Estimate all core monthly bills', xp: 18, required: true },
          { id: 'chimera-transport', title: 'Estimate transportation cost honestly', xp: 18, required: true },
          { id: 'chimera-viable', title: 'Decide whether the plan is viable now or needs more income/support', xp: 18, required: true }
        ]
      }
    ]
  },
  {
    id: 'trial-independence',
    level: 5,
    title: 'Experiment Week',
    journeyTitle: 'The Long March to the Independent Keep',
    intro: 'Run the systems, test the routines, and learn what support still matters. This is an experiment, not a moral exam.',
    bossRevealAt: 2,
    quests: [
      {
        id: 'trial-week-charter',
        title: 'Experiment Week Charter',
        summary: 'Run a small independence experiment, track what held, and learn where the system still leaks.',
        tags: ['routine', 'budget'],
        completionBonus: 28,
        requiredCount: 3,
        subquests: [
          { id: 'seven-day-plan', title: 'Write a 7-day routine plan', xp: 10, required: true },
          { id: 'meals-three-days', title: 'Track meals for 2 real days', xp: 12, required: true },
          { id: 'sleep-three-days', title: 'Track sleep or wake targets for 2 real days', xp: 12, required: true },
          { id: 'spending-three-days', title: 'Track spending or friction points for 2 real days', xp: 10, required: true }
        ]
      },
      {
        id: 'solo-ops-day',
        title: 'Solo Ops Day',
        summary: 'Run one full day of chores, food, and admin like a future tenant instead of a guest creature.',
        tags: ['routine', 'household', 'admin'],
        completionBonus: 28,
        subquests: [
          { id: 'solo-laundry', title: 'Do laundry start to finish', xp: 10, required: true },
          { id: 'solo-clean', title: 'Clean a private or shared space', xp: 10, required: true },
          { id: 'solo-admin', title: 'Handle one admin task', xp: 10, required: true },
          { id: 'solo-food', title: 'Buy, plan, or prepare food for the day', xp: 10, required: true }
        ]
      },
      {
        id: 'launch-plan',
        title: 'Launch Plan',
        summary: 'Choose a target window, map the blockers, and decide the next five moves.',
        tags: ['housing', 'admin', 'budget'],
        completionBonus: 28,
        ritualPlan: true,
        subquests: [
          { id: 'move-window', title: 'Choose a realistic move-out window', xp: 10, required: true },
          { id: 'support-needs', title: 'Name supports, blockers, and failure points', xp: 10, required: true },
          { id: 'five-actions', title: 'Write the first 5 concrete actions', xp: 12, required: true },
          { id: 'checkpoint-date', title: 'Set the next check-in or checkpoint date', xp: 10, required: true }
        ]
      }
    ],
    bossPool: [
      {
        id: 'trial-week-leviathan',
        title: 'The Trial Week Leviathan',
        summary: 'A huge beast made of routine drift, forgotten meals, and crumpled receipts.',
        completionBonus: 130,
        subquests: [
          { id: 'leviathan-routine', title: 'Run the week plan with visible tracking', xp: 20, required: true },
          { id: 'leviathan-chores', title: 'Keep up with chores without rescue prompting', xp: 20, required: true },
          { id: 'leviathan-food', title: 'Handle meals like a future independent human', xp: 20, required: true },
          { id: 'leviathan-admin', title: 'Complete one admin or money task during the trial week', xp: 20, required: true }
        ]
      },
      {
        id: 'gatekeeper-lease-readiness',
        title: 'The Gatekeeper of Lease Readiness',
        summary: 'Not evil, just unimpressed. Wants proof that you can keep the machine running.',
        completionBonus: 130,
        subquests: [
          { id: 'gate-budget', title: 'Review the living budget and move-in fund', xp: 20, required: true },
          { id: 'gate-routine', title: 'Demonstrate a stable routine for several days', xp: 20, required: true },
          { id: 'gate-logistics', title: 'Confirm housing strategy and next actions', xp: 20, required: true },
          { id: 'gate-support', title: 'Name what support remains necessary after launch', xp: 20, required: true }
        ]
      }
    ]
  }
];
