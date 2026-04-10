# Independence Quest v2 gameplay systems pass

Date: 2026-04-10

## Tickets covered
- `tkt-38` redesign class skills with clearer mechanical identity
- `tkt-36` redesign progression so each chapter has a required standalone boss
- `tkt-33` add daily stickiness systems and comeback support

## Class identity changes
### Barbarian
- First Strike window now scales with quest size instead of being a flat timer.
- The class objective is explicit on Today: claim the opening hit fast, then chain momentum.

### Rogue
- Route Combo remains the "bundle 2 to 3 quests and clear them in one run" class.
- The class objective is now surfaced directly on Today instead of hiding in flavor text.

### Monk
- Routine completions still build discipline.
- Higher discipline now more clearly signals recovery power and blocker rescue role.
- The daily objective explicitly frames Monk as the comeback / stability class.

### Wizard
- Prepared spells remain the planning class mechanic.
- The daily objective now tells the player to prepare first, then use prepared spells to shape specific quests.

## Progression changes
- Chapter unlock logic now requires the previous chapter boss to be defeated, not just the quest list to be checked off.
- Current chapter selection now respects unfinished boss gates.
- Quest and chapter UI now explicitly marks bosses as required progression gates.

## Daily stickiness and comeback support
- Added a Daily Win card on Today.
- Added a comeback message that softens the tone after missed sessions.
- Streak handling is now more forgiving after short lapses instead of dropping instantly into failure-state energy.

## Key design principle
The game should stop feeling like generic checklist software with class labels glued on top. Class choice, daily objective, and boss pressure should all change what the player actually does next.
