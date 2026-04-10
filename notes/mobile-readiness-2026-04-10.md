# Independence Quest v2 mobile readiness pass

Date: 2026-04-10

## Tickets covered
- `tkt-23` core gameplay polish blocker
- `tkt-24` Capacitor native packaging scaffold
- `tkt-25` native-feel polish

## What changed
### Core loop polish
- Added a launch veil so app startup feels intentional instead of abruptly dumping the UI.
- Added a re-entry ritual card on Today so the player can immediately understand board state and act.
- Kept the strongest move card first, preserving the open app -> know next move -> act loop.

### Native packaging scaffold
- Added Capacitor packages and config.
- Added `cap:sync`, `cap:open:ios`, and `cap:open:android` scripts.
- Generated native `ios/` and `android/` shells.
- Configured the app for the existing built web output in `../docs` so native wrapping does not fork the product path.

### Native-feel touches
- Added a thin native bridge wrapper in `src/lib/native.ts`.
- Toasts now trigger haptics when supported.
- Profile screen now exposes a reminder arm action and haptic test action.
- Notification permission and reminder scheduling now work in native shells, while web falls back safely.

## Verification
- `npm run build` passes.
- `npm run cap:sync` passes.
- `npx cap add android` passes.
- `npx cap add ios` passes.
