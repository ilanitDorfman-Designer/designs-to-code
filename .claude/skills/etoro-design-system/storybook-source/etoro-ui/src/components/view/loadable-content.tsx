import { type ReactNode, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { cancelAnimation, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '../../core/hooks/accessibility';
import { useEtoroTheme } from '../../core/hooks/use-etoro-theme';

/** Skeleton dissolve duration on reveal, in ms. */
export const FADE_DURATION_MS = 250;

interface LoadableContentProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  fill?: boolean;
  duration?: number;
  /** Solid backdrop behind the skeleton during dissolve. Defaults to theme base. */
  skeletonBackground?: string;
  /** Notifies wrappers while the skeleton layer is mounted, including dissolve. */
  onSkeletonVisibleChange?: (visible: boolean) => void;
}

/**
 * Internal loading core powering `EtView` / `EtScrollView`.
 *
 * Fade-out-skeleton-only: content appears instantly at full opacity; only the
 * skeleton dissolves on top. The dissolving overlay carries a solid background
 * so transparent gaps between skeleton atoms cannot bleed content through.
 *
 * - While `loading`: skeleton only, in normal flow (`fill` -> `flex: 1`).
 * - When `loading` flips false: content mounts in flow; skeleton becomes an
 *   `absoluteFill` overlay (solid backdrop) and fades out (opacity 1 -> 0).
 * - Screens that mount already loaded skip the dissolve entirely.
 * - Reduce motion: instant skeleton removal, no fade.
 */
export function LoadableContent({
  loading,
  skeleton,
  children,
  fill = false,
  duration = FADE_DURATION_MS,
  skeletonBackground,
  onSkeletonVisibleChange,
}: LoadableContentProps) {
  const reducedMotion = useReducedMotion();
  const { colors } = useEtoroTheme();
  const overlayBg = skeletonBackground ?? colors.backgroundBase;

  const [showSkeleton, setShowSkeleton] = useState(loading);
  const wasLoading = useRef(loading);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (loading) {
      cancelAnimation(opacity);
      wasLoading.current = true;
      setShowSkeleton(true);
      opacity.set(1);
      return;
    }

    if (!wasLoading.current) {
      setShowSkeleton(false);
      return;
    }

    wasLoading.current = false;

    if (reducedMotion) {
      setShowSkeleton(false);
      opacity.set(1);
      return;
    }

    if (!showSkeleton) {
      return;
    }

    cancelAnimation(opacity);
    opacity.set(1);
    opacity.set(
      withTiming(0, { duration }, (finished) => {
        if (finished) {
          runOnJS(setShowSkeleton)(false);
        }
      }),
    );
  }, [loading, reducedMotion, duration, opacity, showSkeleton]);

  const skeletonStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  const fillStyle = fill ? styles.fill : undefined;

  useEffect(() => {
    onSkeletonVisibleChange?.(showSkeleton);
  }, [onSkeletonVisibleChange, showSkeleton]);

  return (
    <>
      {loading ? null : children}
      {showSkeleton ? (
        <Animated.View
          style={loading ? fillStyle : [StyleSheet.absoluteFill, { backgroundColor: overlayBg }, skeletonStyle]}
          pointerEvents={loading ? 'auto' : 'none'}
        >
          {skeleton}
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
