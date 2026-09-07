# AppFloatOverlayHost Component

## Purpose & Scope

`AppFloatOverlayHost` is the **single** host for every app-controlled non-modal
overlay surface on iOS — toast, in-app WebView, and any future `Critical`
slot — consolidated into one `FullWindowOverlay` so z-order can be re-asserted
deterministically above bottom sheets.

The network-status indicator and the DataDome captcha are **not** hosted here —
each owns its own standalone `FullWindowOverlay` (see the enum note below).

The store this host renders from (`registerOverlaySurface` / `useOverlaySurfaces`)
lives in `@etoro/common/infra/app-float-overlay`. Only `AppFloatOverlayHost`
itself is re-exported through this component's index — store hooks, priorities,
and surface types are imported directly from `@etoro/common/infra/app-float-overlay`.
The etoro-ui host is where the actual `FullWindowOverlay` is minted and where
the sentinel the native reasserter targets is rendered. The counter-triggered
re-assert itself lives in the app-level bridge
(`apps/etoro-mobile/src/components/common/overlay-reassert-bridge.tsx`), which
observes `useSheetPresentationCounter()` and calls the native module — the
overlay is **stable**, never keyed/remounted (see the re-assert mechanism
section below).

This host is **iOS-only in practice.** The component is mounted on both
platforms (see `apps/etoro-mobile/src/app/_layout.tsx`), and on Android its
render path returns any registered surfaces inline without a
`FullWindowOverlay` wrapper — but every production registrar
(`ToastProvider`, `WebViewOverlayHost`) gates
`useRegisterOverlaySurface` on `Platform.OS === 'ios'`. On Android the host
therefore observes an empty surface list; those surfaces render inline **at
their own call sites** (Android's `Modal` is `Dialog`-backed and already
lifts above bottom sheets, so no coordinated re-assert layer is needed).
The Android-inline-render code path in this component exists as a defensive
fallback for any future registrar that forgets the iOS gate; it is not on
any shipping path today.

## Entry Point & Contract

```tsx
<AppFloatOverlayHost />
```

Mount it **once** at the app root, as the innermost host of the root provider
tree (so its hooks resolve Toast / Loader / network-status context). See
`apps/etoro-mobile/src/app/_layout.tsx`.

The component has no public props — surfaces feed it via `useRegisterOverlaySurface`:

```ts
import { OverlayPriority, useRegisterOverlaySurface } from '@etoro/common/infra/app-float-overlay';

function MyOverlayRegistrar(): null {
  useRegisterOverlaySurface('my-surface', OverlayPriority.Critical, MyComponent);
  return null;
}
```

`Component` **must** be a stable reference (module-level or `useCallback`-stable)
— re-registering the same id with a new function forces the host to remount its
subtree.

## OverlayPriority

Values are painted **ascending** — higher number = closer to the user. Numbers
are gapped by 100 so future surfaces can slot in without renumbering.

```ts
export enum OverlayPriority {
  NetworkStatus = 100, // reserved; network-status renders its own standalone overlay, not this host
  Toast = 200,
  InAppWeb = 300,
  Critical = 400,
  DataDome = 500, // reserved; DataDome renders its own overlay, not this host
}
```

## Usage Patterns

### Register the app-controlled surface from a provider

```tsx
// libs/etoro-ui/src/components/feedback/toast/api/context.tsx
import { OverlayPriority, useRegisterOverlaySurface } from '@etoro/common/infra/app-float-overlay';

function ToastOverlaySlot(): React.ReactElement {
  const { toasts, dismissToast } = useToastContext();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
}

function ToastOverlayRegistrar(): null {
  useRegisterOverlaySurface('toast', OverlayPriority.Toast, ToastOverlaySlot);
  return null;
}
```

## Anti-patterns

### Don't mount the host inside a screen

The host is a singleton. Mount it once in the root layout. Mounting it deeper
duplicates the `FullWindowOverlay` and breaks the "one non-modal overlay
re-asserts front" model.

### Don't register a fresh component every render

```tsx
// BAD — new function each render; forces host subtree remount every commit.
useRegisterOverlaySurface('critical', OverlayPriority.Critical, () => <MyView />);

// GOOD — module-level or a memoized ref.
useRegisterOverlaySurface('critical', OverlayPriority.Critical, MyCriticalSurface);
```

### Don't add a modal surface

`FullWindowOverlay` exposes a single `accessibilityViewIsModal` flag. This host
is non-modal. Genuinely-modal surfaces (e.g. DataDome captcha) must keep their
own overlay and manage their own re-assert-front (see
`libs/common/infra/datadome/src/lib/et-datadome-modal.tsx`).

## Re-assert-front mechanism (iOS)

The `FullWindowOverlay` is **stable** — it is not keyed/remounted. Front-order
is re-asserted **imperatively in native code**: the app-level reassert bridge
(`apps/etoro-mobile/src/components/common/overlay-reassert-bridge.tsx`) observes
`useSheetPresentationCounter()` and, on every `notifySheetPresented` bump, calls
the `OverlayReasserter` native module, which runs
`[window bringSubviewToFront:container]` on this host's window container. UIKit
moves that container to the front of the key window's subview stack — so the
app-controlled layer stays above every sheet regardless of open order.

The host locates itself to the native module via a zero-size **sentinel** child
carrying `testID={APP_FLOAT_OVERLAY_HOST_MARKER}` (RN maps `testID` → iOS
`accessibilityIdentifier`); the module reorders whichever window container holds
that marker.

**No remount, no teardown.** Because the reorder is a native hop rather than a
keyed React remount, surface subtrees are never torn down on a sheet-present —
toast timers keep running and the in-app WebView keeps its scroll/cookies/URL.
There is therefore **no `holdOverlayReassert` opt-out** (nothing to opt out of).

**DataDome captcha and the network-status indicator are NOT in this host.** Both
keep their **own** standalone `FullWindowOverlay` at their own call site (see
`EtDataDomeModal` in `libs/common/infra/datadome/src/lib/et-datadome-modal.tsx`).
A fresh `FullWindowOverlay` mounted when they appear already attaches to the
front of the key window via `didMoveToSuperview` and holds that position for its
lifetime.

## Accessibility

The host is explicitly non-modal
(`unstable_accessibilityContainerViewIsModal={false}`). Registered surfaces
that need modality must not be added here — see the anti-pattern above.

## Dependencies & Edges

### Internal

- `useOverlaySurfaces` — subscribes to the surface registry (from `@etoro/common/infra/app-float-overlay`).
- `useSheetPresentationCounter` — the sheet-present signal the app-level reassert
  bridge observes to trigger the native re-assert; this host does not consume it
  directly.

### External

- `react-native-screens` — `FullWindowOverlay` primitive.
- `react-native-gesture-handler` — root view for gesture-aware surfaces.

## Related Context

- Yield util (for un-hostable native surfaces): `libs/common/infra/app-float-overlay/src/lib/use-yield-for-native-surface.ts`.
- DataDome captcha (kept as its own modal overlay): `libs/common/infra/datadome/src/lib/et-datadome-modal.tsx`.

## Layer boundary exception (`layer:ui` → `layer:dal`)

The overlay coordination lib (`@etoro/common/infra/app-float-overlay`) is
tagged `layer:dal` because it owns module-scoped mutable state
(`Set<Listener>` registries, refcount counters, `useSyncExternalStore` pub/sub
for the overlay-surface registry and the sheet-presentation counter) — that
is DAL-shaped state coordination, not `utils`-layer purity. Sibling
RN-native-surface coordination libs already carry the same tag:
`common-infra-datadome`, `common-infra-network-status-rn`.

This host, `EtBottomSheetV2`, and the toast context (all `layer:ui` inside
etoro-ui) import from that lib — a `layer:ui → layer:dal` crossing that the
default `layer:ui → [facade, ui, interfaces, utils]` rule does not include, but
that the constitution explicitly permits:

> **Constitution 1.2 (P0) — Import Direction:**
> Apps → Platform Features → UI Libraries → Core Features → Common Libraries

UI Libraries importing from Common Libraries is the sanctioned direction
regardless of the common lib's internal layer. That permission is expressed in
eslint via the **`boundary:ui-composable`** tag on
`@etoro/common/infra/app-float-overlay` (`project.json`), which is added to the
`layer:ui` depConstraint in `tools/eslint/nx-boundaries.mjs`. It grants **only**
`layer:ui → this lib` (subpaths included, since they resolve to the same
project).

We deliberately do **not** use an nx `allow`-list entry here: `allow` matches by
imported path and skips **all** boundary checks for **any** importer, which would
silently let `layer:utils` / `layer:interfaces` / `platform:ng` pull a lib that
carries React hooks + `@gorhom/bottom-sheet` + module-scoped state. The tag
grants exactly the one edge the UI needs and keeps every other importer enforced.
`boundary:ui-composable` names a reusable class (a `layer:dal` coordination store
the UI may compose); see the dal-side doc for the full rationale.

**When adding new state to this lib:** it stays in `layer:dal`. Do not migrate
state back into etoro-ui — the constitution's 2.2 (P1) DRY rule keeps the
shared **UI primitives** (`AppFloatOverlayHost`, `EtBottomSheetV2`, toast
context) in `libs/etoro-ui/`, while state coordination lives in the common
infra lib. Both sides of the boundary are intentional.

**Boundary story has two ends — see also the dal side.** The rationale for
why the coordination lib itself is `layer:dal`, why it depends on
`@gorhom/bottom-sheet`, and which `layer:ui` consumers (etoro-ui + RN feature
UI libs — every real importer crosses the same `ui → dal` edge; no
`layer:facade` lib imports it) are sanctioned to import it is documented at
`libs/common/infra/app-float-overlay/AGENTS.md`. Keep the two docs in sync
when the `boundary:ui-composable` grant or the lib contract changes.
