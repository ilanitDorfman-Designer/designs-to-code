import type { Ref } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import type { UseHoverResult } from '../../../../core/hooks/use-hover';
import { create } from '../../../../utils/create';
import { EtIconV2 } from '../../../et-icon-v2';
import type { UseAsideAnimationResult } from '../api/types';
import { DEFAULT_TOGGLE_LABELS, TOGGLE_ICON_SIZE, TOGGLE_RAIL_END, TOGGLE_SIZE } from '../constants';
import { useAsideToggleStyle } from '../hooks/use-aside-animation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AsideToggleProps {
  animation: UseAsideAnimationResult;
  dirSign: number;
  expanded: boolean;
  /** Shared with the rail layer, so hovering the toggle keeps the 60→68 rail affordance alive. */
  hoverProps: UseHoverResult['hoverProps'];
  labels?: { expand?: string; collapse?: string };
  onPress: () => void;
  /** Rail-press focus hand-off target — the root focuses it when a rail press expands. */
  ref?: Ref<View>;
  suppressed: boolean;
  testID?: string;
}

/**
 * The ONE persistent toggle, mounted outside both crossfade layers so keyboard
 * focus survives expand/collapse (dual toggles would drop focus to body when
 * their layer goes aria-hidden; WCAG 2.4.3). Glyph and position interpolate on
 * `progress`: rail-center → panel top-end. The glyph swaps between the two DS
 * icons on `expanded` (RTL-mirrored via `scaleX`). Statically
 * anchored at the rail-centered spot; the aside surface never shrinks below
 * rail width, so the toggle stays inside its bounds in every state.
 */
function AsideToggleBase({ animation, dirSign, expanded, hoverProps, labels, onPress, ref, suppressed, testID }: AsideToggleProps) {
  const { colors } = useEtoroTheme();
  const positionStyle = useAsideToggleStyle(animation, dirSign);

  return (
    <AnimatedPressable
      {...hoverProps}
      accessibilityLabel={expanded ? (labels?.collapse ?? DEFAULT_TOGGLE_LABELS.collapse) : (labels?.expand ?? DEFAULT_TOGGLE_LABELS.expand)}
      accessibilityRole="button"
      aria-expanded={expanded}
      focusable={!suppressed}
      onPress={onPress}
      ref={ref}
      style={[styles.toggle, positionStyle]}
      // RNW 0.21 Pressable ignores focusable={false} — the explicit tabIndex
      // removes the suppressed (sub-768) toggle from the tab order.
      tabIndex={suppressed ? -1 : 0}
      testID={testID}
    >
      <View style={{ transform: [{ scaleX: dirSign }] }}>
        <EtIconV2 color={colors.carbon900} name={expanded ? 'collapse-fill-right' : 'collapse-fill-left'} size={TOGGLE_ICON_SIZE} />
      </View>
    </AnimatedPressable>
  );
}

export const AsideToggle = create(AsideToggleBase, 'EtAppLayout.AsideToggle');

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    top: 0,
    end: TOGGLE_RAIL_END,
    width: TOGGLE_SIZE,
    height: TOGGLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    // Circular per Figma (icon-button radius 60), matching the side-menu toggle.
    borderRadius: TOGGLE_SIZE / 2,
  },
});
