# Independence Quest v2 psychology-informed content pass

Date: 2026-04-10

## Tickets covered
- `tkt-49` replace proof language with growth-evidence framing
- `tkt-52` add partial-credit progression states for real adult tasks
- `tkt-50` add flexible chapter completion paths for autonomy support

## What changed
### Growth-evidence framing
- Replaced several setup and progression phrases that leaned on proof or self-evaluation with evidence / experiment framing.
- Softened a few lines that tilted toward shame-adjacent flavor.
- Reinforced that class is a strategy for now, not a permanent identity verdict.

### Partial-credit adult task progression
- Added an `advanced` quest state between `started` and `completed`.
- Quest progress now distinguishes between early progress, meaningful advancement, waiting, blocked, and cleared states more cleanly.
- This is especially important for adult tasks that take multiple interactions or depend on outside systems.

### Flexible chapter completion
- Added a chapter completion rule to Proving Grounds: complete any 2 core quests to face the chapter boss.
- Updated progression logic to respect chapter completion rules instead of assuming every quest in a chapter must be cleared.
- Updated quest UI to explain flexible completion rules on mobile.

## Design effect
The game now does a better job of treating progress as evidence, not moral worth, and of treating adult tasks as multi-step realities rather than one-sitting purity tests.
