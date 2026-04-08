export const LOW_ENERGY_OPTIONS = [
  { id: 'pomodoro-5', title: '5‑minute focus sprint', copy: 'Pick one tiny objective and run a five-minute timer. Stop when the bell rings if you need to.', xp: 6 },
  { id: 'water-walk', title: 'Drink water + 5‑minute walk', copy: 'Hydrate, move your body, and treat it like a reset button instead of a moral referendum.', xp: 6 },
  { id: 'single-task', title: 'One tiny task from backlog', copy: 'Choose the smallest real item you can finish and clear it without negotiating with yourself.', xp: 8 },
];

export const RESCUE_ITEMS = [
  { title: 'Shrink the battlefield', copy: 'Reduce the quest to the smallest meaningful next action.' },
  { title: 'Change the terrain', copy: 'Move to a different room, chair, or standing position to break state lock.' },
  { title: 'Call in support', copy: 'Text someone, body-double, or ask for one tiny assist instead of white-knuckling it.' },
  { title: 'Use the low-energy route', copy: 'Swap to a lighter version that still counts as forward motion.' },
];

export const REWARDS = [
  { id: 'coffee-break', title: 'Coffee/tea break', cost: 3, category: 'recovery', at: 2 },
  { id: 'episode-watch', title: 'Watch one episode', cost: 5, category: 'recovery', at: 5 },
  { id: 'dessert-treat', title: 'Small dessert', cost: 3, category: 'treat', at: 3 },
];

// @ts-nocheck
export const CLASS_DEFS = [
  {
    id: 'barbarian',
    emoji: '🪓',
    name: 'Barbarian',
    description: 'Raw physical output. Build momentum through rigorous movement and completion.',
    perk: 'Start fast and build momentum through immediate action.',
    startingBonuses: ['Momentum for each completed subquest', '+2XP for starting quests early in the day'],
  },
  {
    id: 'rogue',
    emoji: '🗡️',
    name: 'Rogue',
    description: 'Precision and opportunistic gains. Turn small windows into productive bursts.',
    perk: 'Bundle quick wins and turn errands into combo chains.',
    startingBonuses: ['Critical success doubling XP', 'Stealth mode (no interruptions)'],
  },
  {
    id: 'monk',
    emoji: '🧘',
    name: 'Monk',
    description: 'Discipline and inner calm. Convert repeated basics into tangible gains.',
    perk: 'Build discipline through routine, then spend it on rescue and recovery.',
    startingBonuses: ['Earn Discipline (spend to rescue blocked quests)', 'Daily meditation bonus'],
  },
  {
    id: 'wizard',
    emoji: '🪄',
    name: 'Wizard',
    description: 'Preparation, foresight, and deliberate planning. Shape the board before the day shapes you.',
    perk: 'Prepare spells that reveal, guide, or simplify your next move.',
    startingBonuses: ['Reveal a recommended next move', 'Preparation bonus for planning ahead'],
  },
];

export const CAMPAIGN_ORIGINS = [
  {
    id: 'overloaded',
    title: 'Overloaded and behind',
    copy: 'Too many loose ends, too much friction, and no clean starting point.',
  },
  {
    id: 'rebuilding',
    title: 'Rebuilding from drift',
    copy: 'You have some structure left, but it needs to become stable again.',
  },
  {
    id: 'ready-to-level',
    title: 'Ready to level up',
    copy: 'The basics exist. Now it is time to turn competence into consistency.',
  },
];

export const CAMPAIGN_MOTIVATIONS = [
  {
    id: 'stability',
    title: 'Build stability',
    copy: 'Create a life that feels less chaotic and more survivable day to day.',
  },
  {
    id: 'self-respect',
    title: 'Earn self-respect',
    copy: 'Prove to yourself that you can trust your own follow-through again.',
  },
  {
    id: 'independence',
    title: 'Claim independence',
    copy: 'Build the systems and habits needed to carry your own weight consistently.',
  },
];

export const CAMPAIGN_VOWS = [
  {
    id: 'show-up',
    title: 'I will show up even when it is inconvenient.',
    copy: 'Not perfectly. Not dramatically. Just consistently enough to become dangerous.',
  },
  {
    id: 'finish-small',
    title: 'I will finish small things before they become giant monsters.',
    copy: 'Tiny completions count. They are how the tower gets rebuilt.',
  },
  {
    id: 'become-reliable',
    title: 'I will become reliable to myself first.',
    copy: 'Trust is built through repeated evidence, not motivational speeches.',
  },
];

export const CAMPAIGN_FIRST_PROOFS = [
  {
    id: 'wake-reset',
    title: 'Do one immediate reset action',
    copy: 'Get up, get dressed, drink water, or perform one clear signal that the day has started.',
  },
  {
    id: 'clear-surface',
    title: 'Clear one visible surface',
    copy: 'Desk, counter, sink, table, doesn’t matter. Make one thing visibly better.',
  },
  {
    id: 'one-quest',
    title: 'Finish one small quest today',
    copy: 'Not three. Not all of them. One real completion to prove the system works.',
  },
];

export const CHAPTERS = [
  {
    id: 'proving-grounds',
    level: 1,
    title: 'Proving Grounds',
    summary: 'The first steps are the hardest. Build consistency through routine.',
    quests: [
      {
        id: 'wake-with-purpose',
        title: 'Wake with Purpose',
        summary: 'Establish a strong start. Your first win sets the tone for the day.',
        tags: ['routine', 'health'],
        completionBonus: 14,
        subquests: [
          { id: 'wake-window', title: 'Leave bed or begin wake-up within the target window', xp: 10, required: true, resource: { type: 'tip', title: 'Wake-up Routine', text: '1) Set alarm across room 2) Drink water immediately 3) Expose eyes to bright light 4) 5-minute stretch' } },
          { id: 'wash-dress', title: 'Handle hygiene or get into daytime clothes', xp: 10, required: true, resource: { type: 'tip', title: 'Quick Hygiene', text: 'Sink splash → brush teeth → face wash → deodorant → clothes (lay out at night). Keep it under 10 min.' } },
          { id: 'launch-pad', title: 'Do one ready-for-day action: meds, bag, keys, breakfast setup, or clothes', xp: 8, required: true, resource: { type: 'tip', title: 'Launch Pad Hacks', text: 'Prep bag the night before. Keep keys in a cup by the door. Meds in a daily pill organizer.' } },
          { id: 'light-reset', title: 'Optional: get daylight, breakfast, or a two-minute outside reset', xp: 6, required: false, resource: { type: 'tip', title: 'Morning Reset', text: '5-min outside exposure resets circadian rhythm. Pair with coffee or tea for a small ritual.' } },
        ],
      },
      {
        id: 'feed-the-adventurer',
        title: 'Feed the Adventurer',
        summary: 'Get actual fuel in the body instead of running on fog, caffeine, and regret. Low-energy fuel still counts.',
        tags: ['routine', 'household'],
        completionBonus: 16,
        subquests: [
          { id: 'cook-meal', title: 'Cook one real meal', xp: 10, required: true },
          { id: 'clean-kitchen', title: 'Do the dishes or wipe the counter after eating', xp: 8, required: true, resource: { type: 'tip', title: 'Quick Kitchen Reset', text: `1) Scrape plates into bin
2) Stack dishes by sink
3) Fill sink with hot soapy water
4) Wash glassware → plates → utensils
5) Rinse with hot water
6) Air-dry or towel-dry` } },
          { id: 'water-move', title: 'Drink water and take a 10-minute reset walk', xp: 8, required: true },
          { id: 'leftovers', title: 'Optional: pack leftovers or a snack for later', xp: 6, required: false },
        ],
      },
      {
        id: 'reset-the-lair',
        title: 'Reset the Lair',
        summary: 'Restore the personal habitat so it stops draining hit points just by existing.',
        tags: ['household', 'errand'],
        completionBonus: 18,
        subquests: [
          { id: 'room-reset', title: 'Run a 15-minute room reset', xp: 10, required: true, resource: { type: 'tip', title: '5-Minute Room Reset', text: `1) Put trash in bin
2) Put clothes in hamper
3) Strip bed (start laundry)
4) Wipe surfaces
5) Fluff pillows / arrange` } },
          { id: 'laundry-cycle', title: 'Wash, dry, and put away one load of laundry', xp: 10, required: true, resource: { type: 'tip', title: 'Laundry Blitz', text: `Tip: Fold as soon as dryer stops. Use "dump and fold" method: dump pile, fold each item and stack by drawer/ closet. 5–7 minutes for a load.` } },
          { id: 'trash-out', title: 'Take out trash and replace the bag', xp: 8, required: true },
          { id: 'calm-talk', title: 'Optional: have one calm planning conversation', xp: 6, required: false },
        ],
      },
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
          { id: 'slime-meal', title: 'Make one meal in the same day', xp: 12, required: true },
        ],
      },
      {
        id: 'clockwork-ghoul',
        title: 'The Clockwork Ghoul of Sleep Drift',
        summary: 'Haunts the early morning hours, whispering "five more minutes" and delaying the start.',
        completionBonus: 60,
        subquests: [
          { id: 'ghoul-wake', title: 'Get out of bed within 5 minutes of alarm', xp: 12, required: true },
          { id: 'ghoul-routine', title: 'Complete your morning wake routine without screens', xp: 12, required: true },
          { id: 'ghoul-light', title: 'Get daylight exposure within first 30 minutes', xp: 12, required: true },
          { id: 'ghoul-move', title: 'Do 5 minutes of light movement or stretching', xp: 12, required: true },
        ],
      },
    ],
    bossRevealAt: 3,
  },
  {
    id: 'disciplinary-rites',
    level: 2,
    title: 'Disciplinary Rites',
    summary: 'Sharpen your focus and strengthen discipline through deliberate practice.',
    quests: [
      {
        id: 'focus-drill',
        title: 'Focus Drill',
        summary: 'Build a habit of deep work using short, timed sprints.',
        tags: ['focus', 'discipline'],
        completionBonus: 20,
        subquests: [
          { id: 'drill-setup', title: 'Define a single task and 25-minute timer', xp: 12, required: true },
          { id: 'drill-execute', title: 'Complete one full Pomodoro without distractors', xp: 15, required: true },
          { id: 'drill-review', title: 'Log distractions and rate focus (1–5)', xp: 8, required: false },
        ],
      },
      {
        id: 'digital-fortress',
        title: 'Digital Fortress',
        summary: 'Protect your attention from digital invaders.',
        tags: ['digital', 'hygiene'],
        completionBonus: 22,
        subquests: [
          { id: 'fortify-device', title: 'Turn off all non-essential notifications', xp: 12, required: true },
          { id: 'session-lock', title: 'Set app limits for social/entertainment apps', xp: 10, required: true },
          { id: 'night-fort', title: 'Enable blue-light filter after sunset', xp: 8, required: false },
          { id: 'deep-work-block', title: 'Schedule a 60-minute deep work block', xp: 10, required: false },
        ],
      },
    ],
    bossPool: [
      {
        id: 'notification-djinn',
        title: 'The Notification Djinn',
        summary: 'A trickster spirit that whispers "just one more check" and breaks your flow.',
        completionBonus: 75,
        subquests: [
          { id: 'djinn-silence', title: 'Silence all notifications for a 2-hour window', xp: 18, required: true },
          { id: 'djinn-avoid', title: 'Open phone only for calls/messages during a specific window', xp: 15, required: true },
          { id: 'djinn-purge', title: 'Unfollow/mute one attention-draining account', xp: 12, required: true },
          { id: 'djinn-summary', title: 'Set up a daily 15-minute digital audit', xp: 10, required: false },
        ],
      },
    ],
    bossRevealAt: 2,
  },
  {
    id: 'practical-magic',
    level: 3,
    title: 'Practical Magic',
    summary: 'Use your environment and small habits to automate progress.',
    quests: [
      {
        id: 'autopilot-setup',
        title: 'Autopilot Setup',
        summary: 'Design defaults so good that productivity happens automatically.',
        tags: ['systems', 'efficiency'],
        completionBonus: 26,
        subquests: [
          { id: 'auto-queue', title: 'Create a default daily task list template', xp: 14, required: true },
          { id: 'batch-process', title: 'Batch 3 small recurring tasks into a single session', xp: 12, required: true },
          { id: 'environment-design', title: 'Remove one friction point from your workspace', xp: 10, required: true },
          { id: 'trigger-action', title: 'Optional: define a "when X, then Y" habit pair', xp: 8, required: false },
        ],
      },
      {
        id: 'energy-cadence',
        title: 'Energy Cadence',
        summary: 'Align tasks with natural energy rhythms for maximum throughput.',
        tags: ['energy', 'rhythm'],
        completionBonus: 28,
        subquests: [
          { id: 'energy-audit', title: 'Track energy levels for 3 days (morning/afternoon/evening)', xp: 14, required: true },
          { id: 'match-tasks', title: 'Schedule high‑cognitive tasks during peak energy window', xp: 15, required: true },
          { id: 'recovery-slot', title: 'Add one intentional recovery break in your day', xp: 10, required: true },
          { id: 'circadian-align', title: 'Optional: adjust sleep to match next day’s demands', xp: 8, required: false },
        ],
      },
    ],
    bossPool: [
      {
        id: 'friction-demon',
        title: 'The Friction Demon',
        summary: 'A subtle force that introduces resistance to even the simplest actions.',
        completionBonus: 100,
        subquests: [
          { id: 'demon-identify', title: 'List 5 micro‑frictions that slow you down', xp: 18, required: true },
          { id: 'demon-eliminate', title: 'Eliminate at least 2 frictions this week', xp: 20, required: true },
          { id: 'demon-automation', title: 'Automate one recurring manual task', xp: 15, required: true },
          { id: 'demon-prep', title: 'Pre‑load one tool or resource for next day', xp: 12, required: false },
        ],
      },
    ],
    bossRevealAt: 2,
  },
  // ... more chapters could follow, but these three cover ~12 quests
];

export function getDailyAdvice(state: any) {
  const phase = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';
  const lines = [
    phase === 'morning' ? 'Start small, win big. One completed subquest builds momentum.' : '',
    phase === 'afternoon' ? 'Midday dip? Tackle a 5‑minute routine to regain momentum.' : '',
    phase === 'evening' ? 'Wind down. Prepare tomorrow’s launch pad before bed.' : '',
    'Remember: discipline beats motivation every time.',
  ].filter(Boolean);
  return { message: lines[Math.floor(Math.random() * lines.length)], dayPhase: phase };
}

export function getPhaseDescription(dayPhase: string) {
  const map: Record<string, string> = {
    morning: '🌅 Morning: your focus is sharpest before noon. Tackle the hardest task first.',
    afternoon: '☀️ Afternoon: energy dips around 2–4 PM. Use short sprints to stay on track.',
    evening: '🌙 Evening: wind down. Prepare tomorrow’s launch pad and avoid screens 30 min before bed.',
  };
  return map[dayPhase] || '';
}

export type VGMMessage = { text: string };
