# Independence Quest v2 class balance playtesting pass

Date: 2026-04-10

## Scope
Ticket `tkt-14` asked for a balancing and playtesting pass across the four classes. This pass focused on the current React shell and class-facing UI/state behavior.

## Test lens
I compared the classes against the same practical questions:
- Does the class mechanic surface clearly on the Today screen?
- Does the player get a visible daily reason to use it?
- Does the mechanic appear stronger than the others at low progress?
- Does the mechanic still matter once the player has several quests in motion?

## Findings
### Barbarian
- Clear fantasy and good urgency.
- Strongest opening-day pressure because the hero card naturally supports immediate action.
- Risk: feels front-loaded if the player misses the early start window.

### Rogue
- Very legible in the current UI.
- Errand Run is one of the easiest mechanics to understand because it turns visible quests into a combo route.
- Slight edge in perceived power because it converts scattered admin/household work into a satisfying chain fast.

### Monk
- Mechanic is understandable, but the payoff is quieter than Rogue or Wizard.
- Breath Beads are visible, which helps, but the emotional reward is softer until discipline reaches 3.
- This class is stable, but it can feel underdramatic during the first couple of sessions.

### Wizard
- Best long-game planning fantasy.
- Prepared spells are visible and understandable on Today.
- Feels weakest for a brand-new player unless they already value planning, because the payoff is indirect.

## Balance read
Current rough order for immediate player-perceived power:
1. Rogue
2. Barbarian
3. Wizard
4. Monk

That is not a disaster, but it suggests the game currently rewards visible action chains a bit more than calm accumulation or setup play.

## Recommendation recorded for next tuning slice
If we want tighter parity without rewriting the system, the best next adjustment is:
- Give Monk a slightly louder early payoff, either through a more celebratory bead gain moment or a tiny first-threshold bonus before 3 beads.

Secondary option:
- Give Wizard a more explicit “planning win” callout after spell prep so the benefit feels immediate.

## Ship decision
No mechanical rebalance was forced in this pass. The class structures are coherent enough to ship, and the biggest need is better payoff signaling rather than a heavy stat rewrite.
