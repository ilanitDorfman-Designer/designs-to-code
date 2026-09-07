import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent } from 'react-native';

export const SLOT_HEIGHT_ANIMATION_DURATION = 200;

/**
 * Drives a collapsible slot's height for the fold/unfold animation using React
 * Native's CORE Animated API (not Reanimated).
 *
 * This is deliberate. A slot can contain a Skia `<Canvas>` chart, which blanks
 * out when it is remounted or rendered under a Reanimated animated node
 * (animated height/transform, or a style that switches static→animated). RN's
 * `Animated.View` with a JS-driven height behaves like a plain View whose height
 * prop updates each frame — it does not re-attach the native view — so the Skia
 * canvas keeps rendering. It also tweens reliably on the New Architecture
 * (Fabric), where `LayoutAnimation` height changes merely snap.
 *
 * The content is measured once via an absolutely-positioned inner View (so its
 * natural height is reported regardless of the animated outer height), then the
 * height animates between that value and 0. The child is mounted exactly once
 * and never remounted.
 *
 * @param open - whether the slot should be open (full height) or closed (0).
 *   Pass `isExpanded` for expand-on-open slots, or `!isExpanded` for
 *   collapse-on-open chrome.
 */
export function useSlotHeight(open: boolean) {
  const heightValue = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height > 0 && height !== measuredHeight) {
        setMeasuredHeight(height);
        if (measuredHeight === null) {
          // Snap to the correct height on first measure (no animation on mount).
          heightValue.setValue(open ? height : 0);
        }
      }
    },
    [measuredHeight, open, heightValue],
  );

  // Skip animating the first measure (mount) — the height was already snapped in
  // onContentLayout, so we only animate genuine open/close toggles.
  const didAnimateOnce = useRef(false);

  useEffect(() => {
    if (measuredHeight === null) return;
    if (!didAnimateOnce.current) {
      didAnimateOnce.current = true;
      heightValue.setValue(open ? measuredHeight : 0);
      return;
    }
    Animated.timing(heightValue, {
      toValue: open ? measuredHeight : 0,
      duration: SLOT_HEIGHT_ANIMATION_DURATION,
      // Ease-in-out (slow start). The card lives in a FlashList header, so the
      // first height frame triggers a list re-layout; a slow start makes that
      // first frame move only a hair, masking the re-layout cost / any dropped
      // frame that otherwise reads as a "tick". A fast-start easing made it
      // obvious. Expanded and collapsed slots share this easing so they move in
      // lockstep and the footer never jolts.
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
      isInteraction: false,
    }).start();
  }, [open, measuredHeight, heightValue]);

  return { heightValue, onContentLayout };
}
