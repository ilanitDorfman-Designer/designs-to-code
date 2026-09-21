import { BottomSheetBackdrop, BottomSheetBackdropProps, useBottomSheet } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, MutableRefObject, useContext, useRef } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { ToastContext } from '../../../feedback/toast/api/context';
import { BackdropConfig } from '../api';

interface BackdropRuntimeConfig {
  backdrop: BackdropConfig | undefined;
  closeOnBackdrop: boolean;
  testID: string | undefined;
  gradientTop: string;
  gradientBottom: string;
}

type EtBottomSheetBackdropInnerProps = BottomSheetBackdropProps & {
  /**
   * Live per-sheet config, threaded in by the hook's stable wrapper. gorhom
   * teleports `backdropComponent` to the root portal host, which does NOT
   * propagate local React context, so the config travels as a prop (a stable
   * ref object) rather than through a provider.
   */
  configRef: MutableRefObject<BackdropRuntimeConfig>;
};

/**
 * Backdrop component gorhom renders as `backdropComponent`.
 *
 * Defined at module level (not inside the hook) so its hooks stay at the top
 * level of a real component — rules-of-hooks / react-compiler safe. `useEtBottomSheetBackdrop`
 * pins a stable wrapper around it so the `backdropComponent` *type identity*
 * never changes across renders: a fresh type each render makes gorhom (whose
 * sheet is `React.memo`) remount the whole backdrop subtree, and on iOS inside
 * `FullWindowOverlay` the fresh native view re-appends after the sheet body →
 * dimmer paints on top.
 *
 * `pressBehavior` handling is split by platform (do NOT collapse the branches
 * without reading `missions/PM-866-toast-backdrop-keep-sheet.md`):
 *
 * - **Android** keeps gorhom's native path and gates the toggle:
 *   `pressBehavior={closeOnBackdrop && no-toast ? 'close' : 'none'}`. gorhom's
 *   internal `GestureDetector` ↔ `Animated.View` ternary swap remounts the
 *   backdrop, but with no `FullWindowOverlay` that remount is invisible — so
 *   gorhom's `GestureDetector` + accessibility stay untouched.
 * - **iOS** pins `pressBehavior='none'` for the sheet's lifetime and drives
 *   close from our own `Pressable` + gorhom's public `useBottomSheet().close()`
 *   (never toggling `pressBehavior`, so the remount above never happens). gorhom's
 *   now-inert backdrop is `accessible={false}`; the `Pressable` carries the button
 *   role, announced only when `closeOnBackdrop`.
 *
 * `useContext(ToastContext)` is nullable — never `useToastContext()`, which throws
 * outside a `ToastProvider` — and lives here so the gate sees the latest toast
 * count without the sheet re-rendering for another reason.
 */
function EtBottomSheetBackdropInner({ configRef, ...props }: EtBottomSheetBackdropInnerProps) {
  const toast = useContext(ToastContext);
  // Legal here: gorhom renders this as `backdropComponent` inside the sheet's
  // provider, and gorhom's own backdrop calls the same public hook. iOS-only use.
  const { close } = useBottomSheet();
  const cfg = configRef.current;
  const testId = cfg.backdrop?.testID ?? (cfg.testID ? `${cfg.testID}-backdrop` : undefined);
  const toastVisible = (toast?.toasts.length ?? 0) > 0;

  // Android: gorhom-native. Toggling pressBehavior is safe (no FullWindowOverlay),
  // so gate the toast directly and keep gorhom's GestureDetector + accessibility intact.
  if (Platform.OS !== 'ios') {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={cfg.backdrop?.opacity ?? 0.85}
        // PM-866: toast overlay pass-through must not close the sheet via the dimmer.
        pressBehavior={cfg.closeOnBackdrop && !toastVisible ? 'close' : 'none'}
        onPress={cfg.backdrop?.onPress}
      >
        <LinearGradient
          colors={[cfg.gradientTop, cfg.gradientBottom] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
          testID={testId}
        />
      </BottomSheetBackdrop>
    );
  }

  // iOS: pin pressBehavior='none' and drive close from our own Pressable to
  // avoid the ternary-swap remount inside FullWindowOverlay.
  const handlePress = () => {
    // PM-866: toast overlay pass-through must not close the sheet via the dimmer.
    // `onPress` is coupled to the actual close (fired only after the gate),
    // matching gorhom's own backdrop (its `handleOnPress` runs only inside the
    // GestureDetector, i.e. when `pressBehavior !== 'none'`) and the Android
    // branch above. Firing it before the gate would let a consumer's closing
    // `onPress` dismiss the sheet while a toast is up — the exact defect this
    // gate exists to prevent.
    if (!cfg.closeOnBackdrop) return;
    if (toastVisible) return;
    cfg.backdrop?.onPress?.();
    close();
  };

  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={cfg.backdrop?.opacity ?? 0.85}
      pressBehavior="none"
      // gorhom's own backdrop is inert in 'none' mode — suppress its default
      // button role so the Pressable below is the single a11y control that closes.
      accessible={false}
    >
      <Pressable
        style={styles.gradient}
        onPress={handlePress}
        // The Pressable owns the real close action, so it carries the button
        // semantics — but only announce it when it can actually dismiss
        // (closeOnBackdrop), matching a non-dismissible backdrop.
        accessible={cfg.closeOnBackdrop}
        accessibilityRole="button"
        accessibilityLabel="Bottom sheet backdrop"
        testID={testId}
      >
        <LinearGradient colors={[cfg.gradientTop, cfg.gradientBottom] as const} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient} />
      </Pressable>
    </BottomSheetBackdrop>
  );
}

/**
 * Hook to create a backdrop render function for the bottom sheet.
 *
 * Gradient overlay per design (carbon900 → carbon1000 @ 85% opacity). See
 * {@link EtBottomSheetBackdropInner} for the PM-866 toast gate and why the
 * backdrop's component identity is pinned for the sheet's lifetime.
 *
 * @param backdrop - Backdrop configuration
 * @param closeOnBackdrop - Whether tapping backdrop should close the sheet
 * @returns Render function for BottomSheetModal's backdropComponent prop
 */
export function useEtBottomSheetBackdrop(backdrop: BackdropConfig | undefined, closeOnBackdrop: boolean, testID?: string) {
  const { colors } = useEtoroTheme();

  // Per-hook runtime config. Written during render (permitted "instance state
  // sync") so the pinned backdrop always reads the latest values on every render
  // triggered by consumer prop changes or context updates.
  const configRef = useRef<BackdropRuntimeConfig>({
    backdrop,
    closeOnBackdrop,
    testID,
    gradientTop: colors.carbonStatic900,
    gradientBottom: colors.carbonStatic1000,
  });
  configRef.current = {
    backdrop,
    closeOnBackdrop,
    testID,
    gradientTop: colors.carbonStatic900,
    gradientBottom: colors.carbonStatic1000,
  };

  // Pin the wrapper's identity for the sheet's lifetime (never reassigned after
  // the first render). The wrapper calls no hooks — it only threads the live
  // configRef into the module-level component — so storing it in a ref is safe.
  const stableRef = useRef<FC<BottomSheetBackdropProps> | null>(null);
  if (stableRef.current === null) {
    stableRef.current = (props: BottomSheetBackdropProps) => <EtBottomSheetBackdropInner {...props} configRef={configRef} />;
  }

  return stableRef.current;
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
