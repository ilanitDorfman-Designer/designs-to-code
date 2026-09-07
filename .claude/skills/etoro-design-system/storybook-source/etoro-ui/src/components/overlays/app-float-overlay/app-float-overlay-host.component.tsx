import { APP_FLOAT_OVERLAY_HOST_MARKER, useOverlaySurfaces } from '@etoro/common/infra/app-float-overlay';
import { Fragment } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FullWindowOverlay } from 'react-native-screens';

/**
 * Single host for every app-controlled non-modal overlay surface (toast,
 * in-app webview, and any future `Critical` slot).
 *
 * ## iOS: one stable `FullWindowOverlay`, re-asserted natively on sheet present
 *
 * On iOS the host renders a single non-modal `FullWindowOverlay` containing
 * every registered surface, sorted by {@link OverlayPriority}. The overlay is
 * **not** keyed/remounted — it is stable across sheet opens. Front-order is
 * re-asserted **imperatively in native code**: the app-level reassert bridge
 * (`apps/etoro-mobile/src/components/common/overlay-reassert-bridge.tsx`)
 * listens on the sheet-presentation counter and calls the `OverlayReasserter`
 * native module, which runs `[window bringSubviewToFront:container]` on this
 * host's window container — no React remount, so surface state (toast timers,
 * WebView scroll/URL) is preserved.
 *
 * The host locates itself to native code via a zero-size **sentinel** child
 * carrying `testID={APP_FLOAT_OVERLAY_HOST_MARKER}` (RN maps `testID` → iOS
 * `accessibilityIdentifier`); the native module reorders whichever window
 * container holds that marker.
 *
 * ## Modality
 *
 * The consolidated host is **non-modal** (`unstable_accessibilityContainerViewIsModal={false}`)
 * because a `FullWindowOverlay` exposes a single a11y-modal flag and toast is
 * explicitly non-modal. Genuinely-modal surfaces
 * — DataDome captcha — keep their own `FullWindowOverlay` and manage their
 * own re-assert if needed.
 *
 * ## Android
 *
 * On Android the surfaces render inline — there is no `FullWindowOverlay`
 * equivalent and no window-boundary z-order problem (`Modal` is the primitive
 * that lifts things above bottom sheets).
 *
 * ## Mount
 *
 * Mount **once** at the app root, as the innermost element of the root
 * providers (so its hooks resolve Toast/Loader/network-status context). See
 * `apps/etoro-mobile/src/app/_layout.tsx`.
 */
export function AppFloatOverlayHost() {
  const surfaces = useOverlaySurfaces();

  const stack = (
    <Fragment>
      {surfaces.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </Fragment>
  );

  if (Platform.OS !== 'ios') {
    return stack;
  }

  return (
    <FullWindowOverlay unstable_accessibilityContainerViewIsModal={false}>
      <GestureHandlerRootView style={styles.root} pointerEvents="box-none">
        {/* Zero-size sentinel: the native OverlayReasserter locates this host's
            window container by this testID (→ accessibilityIdentifier) to
            bring it to front. `collapsable={false}` guarantees a backing
            native view exists to carry the identifier. */}
        <View testID={APP_FLOAT_OVERLAY_HOST_MARKER} collapsable={false} pointerEvents="none" style={styles.sentinel} />
        {stack}
      </GestureHandlerRootView>
    </FullWindowOverlay>
  );
}

AppFloatOverlayHost.displayName = 'AppFloatOverlayHost';

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  sentinel: {
    width: 0,
    height: 0,
  },
});
