import { Pressable, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '../../../core/hooks/accessibility/use-reduced-motion';
import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { useHover } from '../../../core/hooks/use-hover';
import { useLayoutDirection } from '../../../core/hooks/use-layout-direction';
import { create } from '../../../utils/create';
import { EtIconV2 } from '../../et-icon-v2';
import type { EtSideMenuTriggerProps } from './api/types';
import { TOGGLE_ICON_SIZE, TRIGGER_SIZE } from './constants';
import { HoverOverlay } from './subcomponents/hover-overlay';

/**
 * EtSideMenuTrigger — context-free opener for the hidden tier (-1), mounted by
 * the top panel OUTSIDE `<EtSideMenu>`. 44px box (top-panel design) with the
 * expand-pointing glyph (DS `collapse-fill-right`, RTL-mirrored via scaleX).
 * The shell wires `onPress` to `onExpandedChange(true, …)` itself —
 * no side-menu context is imported here.
 */
function EtSideMenuTriggerBase({ onPress, accessibilityLabel = 'Open menu', testID }: EtSideMenuTriggerProps) {
  const { colors } = useEtoroTheme();
  const { isHovered, hoverProps } = useHover();
  const reducedMotion = useReducedMotion();
  const direction = useLayoutDirection();

  return (
    <Pressable
      {...hoverProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.trigger}
      testID={testID}
    >
      <View style={{ transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }] }}>
        <EtIconV2 color={colors.carbon900} name="collapse-fill-right" size={TOGGLE_ICON_SIZE} />
      </View>
      <HoverOverlay hovered={isHovered} reducedMotion={reducedMotion} />
    </Pressable>
  );
}

export const EtSideMenuTrigger = create(EtSideMenuTriggerBase, 'EtSideMenuTrigger');

const styles = StyleSheet.create({
  trigger: {
    width: TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    // Circular per Figma (icon-button radius 60); clips the hover overlay round.
    borderRadius: TRIGGER_SIZE / 2,
    overflow: 'hidden',
  },
});
