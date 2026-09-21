import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

import type { EtSwipeableActionInternalProps, EtSwipeableActionProps } from '../api/types';
import { useSwipeableRowContext } from '../context/swipeable-row-context';
import { normalizeActionWidth } from '../utils/normalize-action-width';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Fraction of the total reveal distance (sum of all action widths) over which the icons
 * fade in uniformly. We use the first half of the reveal so icons reach full opacity well
 * before the actions are fully exposed — this keeps the motion feeling snappy.
 */
const ICON_FADE_REVEAL_FRACTION = 1;

/**
 * EtSwipeableRow.Action - An action button revealed when the row is swiped left.
 * Must be used as a direct child of EtSwipeableRow, before or after the content element.
 *
 * Visual behavior driven from `SwipeableRowContext`:
 * - All action icons fade in TOGETHER as the row is dragged open (uniform fade tied to
 *   overall swipe progress — no per-action stagger).
 * - When the user crosses the full-swipe threshold, the LAST action smoothly grows to
 *   cover the full row width while sibling actions shrink to 0 width and fade out, all
 *   driven by the shared `takeover` 0->1 progress (220ms ease-out).
 *
 * @example
 * ```tsx
 * <EtSwipeableRow>
 *   <EtListItemV2 size="large">...</EtListItemV2>
 *   <EtSwipeableRow.Action onPress={handleDelete} style={{ backgroundColor: colors.statusNegative }}>
 *     <EtIconV2 name="trash" size="lg" color={colors.textBright} />
 *   </EtSwipeableRow.Action>
 * </EtSwipeableRow>
 * ```
 */
export function SwipeableAction({
  children,
  onPress,
  width,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessible,
  disabled,
  _index,
  _actionsCount,
}: EtSwipeableActionProps & EtSwipeableActionInternalProps) {
  const { defaultButtonWidth, translateX, rowWidth, totalActionsWidth, takeover, enableFullSwipe, collapseOnLastAction, runCollapse } =
    useSwipeableRowContext();

  const declaredWidth = normalizeActionWidth(width, defaultButtonWidth);
  const isLast = _actionsCount != null && _index === _actionsCount - 1;

  // For the LAST action only, opt-in to the same collapse animation that the full-swipe
  // commit uses. Non-last actions and non-collapsing rows fire onPress synchronously.
  const handlePress = useCallback(async () => {
    if (isLast && collapseOnLastAction) {
      await runCollapse();
    }
    onPress?.();
  }, [isLast, collapseOnLastAction, runCollapse, onPress]);

  // ── Uniform icon fade-in ────────────────────────────────────────────────
  // Every action's icon shares the same fade curve based on overall swipe progress.
  // For non-last actions, also fade out as the takeover progresses so the trash
  // background can fully own the visual.
  const childrenAnimatedStyle = useAnimatedStyle(() => {
    const distance = -translateX.get();
    const fadeEnd = totalActionsWidth > 0 ? totalActionsWidth * ICON_FADE_REVEAL_FRACTION : 1;
    const fadeIn = interpolate(distance, [0, fadeEnd], [0, 1], 'clamp');
    const opacity = isLast ? fadeIn : fadeIn * (1 - takeover.get());
    return { opacity };
  });

  // ── Width: takeover lerp ─────────────────────────────────────────────────
  // - Last action: width = declaredW + (rowWidth - declaredW) * takeover
  //   At rest takeover=0 so we keep the declared width; once the user crosses the
  //   threshold takeover smoothly tweens to 1 over 220ms and the last action grows
  //   to cover the entire row. If full-swipe is disabled this stays at declaredWidth.
  // - Sibling actions: width = declaredW * (1 - takeover) so they shrink to 0,
  //   making room for the expanding last action without any layout snap.
  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (isLast) {
      if (!enableFullSwipe) {
        return { width: declaredWidth };
      }
      const target = rowWidth.get();
      const t = takeover.get();
      // `target` may be 0 before the first onLayout — fall back to declaredWidth.
      const grown = target > 0 ? declaredWidth + (target - declaredWidth) * t : declaredWidth;
      return { width: grown };
    }
    if (!enableFullSwipe) {
      return { width: declaredWidth };
    }
    return { width: declaredWidth * (1 - takeover.get()) };
  });

  return (
    <AnimatedPressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled ?? false}
      style={[styles.action, containerAnimatedStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      <Animated.View style={[styles.childrenWrapper, childrenAnimatedStyle]}>{children}</Animated.View>
    </AnimatedPressable>
  );
}

SwipeableAction.displayName = 'EtSwipeableRow.Action';

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  childrenWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
