import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import { isRTL } from '../../../../utils/rtl';
import { useTickerContext } from '../context';
import { getMarqueeScrollReverse } from '../utils';

/** How often the scroll worklet re-measures the strip against the viewport. */
const VISIBILITY_CHECK_MS = 250;

interface MarqueeProps {
  children: React.ReactNode;
  spacing?: number;
  /** When true, scrolls opposite the locale default (LTR→RTL / RTL→LTR). */
  reverse?: boolean;
  withGesture?: boolean;
  position?: SharedValue<number>;
  style?: ViewStyle;
  /** Seed widths so clones can mount on the first commit. Overwritten by `onLayout`. */
  initialContentWidth?: number;
  initialParentWidth?: number;
  /**
   * Pauses the frame-driven scroll worklet and disables pan when `false`.
   * Does **not** unmount clones — tearing those down on background/inactive and remounting on
   * resume is a ~1s empty strip on Android (native views + SVG sparklines rebuild). Gate this on
   * focus + app state. Use {@link MarqueeProps.mountClones} to drop the trees on navigation blur.
   * @default true
   */
  isActive?: boolean;
  /**
   * When `false`, unmounts the auto-scrolled clones (the measure row stays). Default follows
   * {@link MarqueeProps.isActive} for back-compat; Discover passes screen-focus here so clones
   * survive app-background and don't flash white on resume.
   */
  mountClones?: boolean;
  /**
   * Skips scroll commits while the strip is outside the vertical viewport, measured on the UI
   * thread inside the frame callback itself (`measure` every {@link VISIBILITY_CHECK_MS}) — no
   * React state, no scroll subscriptions. A detached host view measures `null` and counts as
   * off-screen, so a strip on a frozen/blurred tab pauses without any navigation wiring.
   * Native-only: web keeps scrolling regardless (Reanimated `measure` support there is not
   * reliable enough to gate on, and a false "off-screen" would freeze the strip forever).
   * @default true
   */
  pauseOffscreen?: boolean;
}

export function Marquee({
  children,
  spacing = 0,
  reverse = false,
  withGesture = false,
  position,
  style,
  initialContentWidth = 0,
  initialParentWidth = 0,
  isActive = true,
  mountClones = isActive,
  pauseOffscreen = true,
}: MarqueeProps) {
  const { speed } = useTickerContext();
  const [contentWidth, setContentWidth] = useState(initialContentWidth);
  const [parentWidth, setParentWidth] = useState(initialParentWidth);
  const { height: windowHeight } = useWindowDimensions();

  const anim = useSharedValue(0);
  const lastFrameTime = useSharedValue(0);
  const lastVisibilityCheck = useSharedValue(0);
  const isOffscreen = useSharedValue(false);
  const containerRef = useAnimatedRef<Animated.View>();
  // Default scroll follows reading direction: LTR → right-to-left, RTL → left-to-right.
  const scrollReverse = getMarqueeScrollReverse(reverse, isRTL());
  // `measure` inside a worklet is native-only; on web the gate is disabled (see prop doc).
  const checkVisibility = pauseOffscreen && Platform.OS !== 'web';

  const frameCallback = useFrameCallback((frameInfo) => {
    if (frameInfo.timeSincePreviousFrame === null) return;
    const currentTime = frameInfo.timestamp;

    if (checkVisibility) {
      if (currentTime - lastVisibilityCheck.get() >= VISIBILITY_CHECK_MS) {
        const layout = measure(containerRef);
        const offscreen = layout === null || layout.pageY + layout.height <= 0 || layout.pageY >= windowHeight;
        isOffscreen.set(offscreen);
        // A `null` measurement means the host view is detached (frozen/blurred tab) — a state
        // that persists for whole sessions, and every attempt logs a dev warning from
        // Reanimated. Back off to 8× the interval there; a genuinely scrolled-off strip keeps
        // the fast cadence so scrolling back reveals motion promptly.
        const nextInterval = layout === null ? VISIBILITY_CHECK_MS * 8 : VISIBILITY_CHECK_MS;
        lastVisibilityCheck.set(currentTime + nextInterval - VISIBILITY_CHECK_MS);
      }
      if (isOffscreen.get()) {
        // Re-seed timing so resuming doesn't jump the strip by the whole paused interval.
        lastFrameTime.set(0);
        return;
      }
    }

    const lastTime = lastFrameTime.get();
    if (lastTime === 0) {
      // Seed frame after mount/resume: record the timestamp, move on the next commit. The
      // one-frame delay is imperceptible and avoids a jump computed against a stale timestamp.
      lastFrameTime.set(currentTime);
      return;
    }

    // No commit-cadence throttling: a visible strip moves once per vsync (display-rate agnostic —
    // 60/90/120Hz all just work). The perf win lives in the visibility gate above, which stops
    // ALL commits when the strip can't be seen; per-frame cadence arithmetic against unknown
    // vsync intervals proved to be judder risk for no measured benefit.
    const deltaTime = currentTime - lastTime;
    lastFrameTime.set(currentTime);

    // Normalize speed based on 60fps (16.67ms per frame)
    const normalizedSpeed = speed * (deltaTime / 16.67);

    if (scrollReverse) {
      anim.set(anim.get() - normalizedSpeed);
    } else {
      anim.set(anim.get() + normalizedSpeed);
    }
    // Start inactive and let the effect below own the active state. Reanimated keys its internal
    // register/unregister effect on `[callback, autostart]`, so threading `isActive` in here would
    // tear down and re-register the callback on every focus flip on top of the `setActive` call we
    // already make — churn with no benefit. A constant keeps registration stable; the cost is that
    // the very first frame after mount does not scroll, which is imperceptible (and slightly helps
    // first paint).
  }, false);

  // Single source of truth for whether the worklet runs. `frameCallback` is a `useRef` value in
  // Reanimated, so this effect fires only when `isActive` actually changes, not on every render.
  // Reset `lastFrameTime` on resume so the delta is not measured against a timestamp captured
  // before the pause — otherwise the first resumed frame would compute a huge `deltaTime` and jump
  // the strip forward proportionally to how long it was blurred.
  useEffect(() => {
    if (isActive) {
      lastFrameTime.set(0);
      frameCallback.setActive(true);
    } else {
      frameCallback.setActive(false);
    }
  }, [isActive, frameCallback, lastFrameTime]);

  // Expose position if provided
  useDerivedValue(() => {
    if (position) {
      position.set(anim.get());
    }
  });

  // One content-plus-gap tile; clone `i` sits at `(i - 1) * period` and the shared translate
  // below wraps within one period.
  const period = contentWidth + spacing;

  const cloneTimes = useMemo(() => {
    // Unmounting clones is gated by `mountClones`, not `isActive`. Pausing the worklet on
    // background is cheap; remounting sparkline-card trees on Android resume is a visible
    // 1s white hole because the only remaining child is the opacity-0 measure row.
    if (!mountClones) return 0;
    if (contentWidth === 0 || parentWidth === 0) {
      return 0;
    }
    // `spacing` is an unconstrained prop: a negative value exceeding the content width makes the
    // period non-positive, and the coverage formula below would then produce a negative clone
    // count — `Array(negative)` throws RangeError. No consumer does this today; guard anyway.
    if (period <= 0) {
      return 0;
    }
    // Exact coverage: the shared translate stays in (-period, 0] (floored modulo), the leftmost
    // clone is anchored one period left of the origin, so `ceil(parent / period)` tiles cover the
    // viewport and two more cover the wrap seam on either side. The previous
    // `(round(parent/content) + 2) * 2` doubled this "so content fills the visible area during
    // fast gesture flings", but a modulo wrap is position-independent — a large per-frame jump
    // still lands every clone exactly on its tile, so the doubling only mounted ~3 extra
    // sparkline-card trees (PAH-835).
    return Math.ceil((parentWidth + spacing) / period) + 2;
  }, [mountClones, contentWidth, parentWidth, spacing, period]);

  // Every clone used to carry its own `useAnimatedStyle`; they all computed the same translate,
  // so one animated wrapper now moves the whole set — one style update per commit instead of N.
  // Floored modulo keeps the translate in (-period, 0] for negative `anim` too (reverse scroll /
  // backward drag), which plain `%` did not — that asymmetry is what the old clone-count doubling
  // was compensating for.
  const cloneRowStyle = useAnimatedStyle(() => {
    if (period <= 0) {
      return { transform: [{ translateX: 0 }] };
    }
    const wrapped = ((anim.get() % period) + period) % period;
    return { transform: [{ translateX: -wrapped }] };
  }, [period]);

  const start = () => {
    // Do not resurrect the callback if the consumer paused us mid-fling. Otherwise `withDecay`'s
    // completion would restart the loop while off-screen.
    if (!isActive) return;
    lastFrameTime.set(0); // Reset timing to avoid jumps
    frameCallback.setActive(true);
  };

  const stop = () => {
    frameCallback.setActive(false);
  };

  const pan = Gesture.Pan()
    .enabled(withGesture && isActive)
    .onBegin(() => {
      'worklet';
      runOnJS(stop)();
    })
    .onChange((e) => {
      'worklet';
      anim.set(anim.get() - e.changeX);
    })
    .onFinalize((e) => {
      'worklet';
      anim.set(
        withDecay(
          {
            velocity: -e.velocityX,
          },
          (finished) => {
            if (finished) {
              runOnJS(start)();
            }
          },
        ),
      );
    });

  const handleParentLayout = (event: LayoutChangeEvent) => {
    setParentWidth(event.nativeEvent.layout.width);
  };

  const handleContentLayout = (event: LayoutChangeEvent) => {
    setContentWidth(event.nativeEvent.layout.width);
  };

  return (
    <Animated.View ref={containerRef} style={[styles.container, style]} onLayout={handleParentLayout} pointerEvents="box-none">
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.content} pointerEvents="box-none">
          {/* Hidden view to measure content. `opacity: 0` still receives touches in RN and the
              measure row is a full-size copy of Pressable cards, so absent `pointerEvents="none"`
              a tap on the empty area of the strip can dispatch to the ghost row and navigate to
              whichever card sits under the finger. Measurement still fires because onLayout runs
              independently of the pointer event pipeline. */}
          <View style={styles.hidden} onLayout={handleContentLayout} pointerEvents="none">
            {children}
          </View>

          {/* Render clones for infinite scrolling; the wrapper owns the one shared translate.
              Each clone stretches vertically (`top/bottom`) and centers its content — ported
              from main's AnimatedChild fix when the clones moved into one wrapper. */}
          {cloneTimes > 0 && (
            <Animated.View style={[StyleSheet.absoluteFill, cloneRowStyle]} pointerEvents="box-none">
              {[...Array(cloneTimes).keys()].map((index) => (
                <View key={`clone-${index}`} style={[styles.clone, { left: (index - 1) * period }]}>
                  {children}
                </View>
              ))}
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
  },
  // Per-clone frame: stretch vertically and center shorter content; `left` is per-index inline.
  clone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
    zIndex: -9999,
  },
});
