import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';
import { create } from '../../../../utils/create';
import { EtIconV2, IconVariant } from '../../../et-icon-v2';
import type { EtSideMenuItemProps } from '../api/types';
import { ICON_LABEL_GAP, ICON_SIZE, MENU_HORIZONTAL_PADDING, PRIMARY_ROW_HEIGHT, RAIL_ITEM_HEIGHT, SECONDARY_ROW_HEIGHT } from '../constants';
import { useSideMenuConfig, useSideMenuLayer, useSideMenuState } from '../context';
import { useSideMenuRailDriftStyle, useSideMenuRowStyle } from '../hooks/use-side-menu-animation';
import { useSideMenuLayerHover } from '../hooks/use-side-menu-layer-hover';
import { ActiveIndicator } from './active-indicator';
import { HoverOverlay } from './hover-overlay';
import { useSectionMeta } from './side-menu-section';

/** `staggerIndex` is injected by the parent primary Section — not public API. */
type SideMenuItemInternalProps = EtSideMenuItemProps & { staggerIndex?: number };

// RN's prop types don't list `aria-current` yet, so it travels via spread:
// react-native-web forwards it to the DOM, native drops the unknown prop.
// Not `accessibilityState.selected` — that maps to `aria-selected`, which is
// invalid on `role="button"`.
const ARIA_CURRENT_PAGE = { 'aria-current': 'page' as const };

/**
 * EtSideMenu.Item — three render modes by layer + kind:
 * 1. rail cell (railWidth×60, 20px icon only, label as accessibility label);
 * 2. expanded row (primary 40px text-only / secondary 40px icon+label);
 * 3. null (secondary items are invisible in the rail).
 *
 * Active = `ActiveIndicator` (3% band + green edge bar) plus the instant
 * fill-swap where an icon renders (`IconVariant.Filled` resolves
 * `{name}-fill`), plus `aria-current="page"` on both instances so
 * screen-reader users can tell which page they are on. Hover = 3% carbon900
 * overlay (the active band is the same 3% layer).
 *
 * Both instances stay mounted, so `testID` is layer-suffixed (`-rail`/`-panel`)
 * to keep selectors unambiguous, and only the ACTIVE layer's Pressable is
 * keyboard-focusable (the inactive one is opacity-0 behind aria-hidden).
 * `focusable` alone is NOT enough on web: RNW 0.21 Pressable ignores
 * `focusable={false}` and still renders `tabindex="0"` (backdrop precedent),
 * so the explicit `tabIndex` carries the real tab-order contract.
 */
function SideMenuItemBase({ id, label, icon, iconColor, badge, disabled, staggerIndex, testID }: SideMenuItemInternalProps) {
  const layer = useSideMenuLayer();
  const { activeItemId, onItemPress, railWidth, reducedMotion } = useSideMenuConfig();
  const { expanded, requestClose } = useSideMenuState();
  const { secondary } = useSectionMeta();
  const { colors } = useEtoroTheme();
  const isActiveLayer = layer === 'rail' ? !expanded : expanded;
  const { isHovered, hoverProps } = useSideMenuLayerHover(isActiveLayer);
  const driftStyle = useSideMenuRailDriftStyle();
  const revealStyle = useSideMenuRowStyle(staggerIndex ?? 0);

  const active = id === activeItemId;

  const handlePress = useCallback(() => {
    onItemPress?.(id);
    requestClose('item'); // No-ops while collapsed (root guards).
  }, [id, onItemPress, requestClose]);

  if (layer === 'rail') {
    if (!icon) {
      return null; // Mode 3: secondary items are invisible in the rail.
    }
    return (
      <Pressable
        {...hoverProps}
        {...(active ? ARIA_CURRENT_PAGE : null)}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={disabled ? { disabled: true } : undefined}
        disabled={disabled}
        focusable={isActiveLayer}
        onPress={handlePress}
        style={[styles.railCell, { width: railWidth }]}
        tabIndex={isActiveLayer ? 0 : -1}
        testID={testID ? `${testID}-rail` : undefined}
      >
        {active ? <ActiveIndicator /> : null}
        <Animated.View style={driftStyle}>
          <EtIconV2 color={iconColor ?? colors.carbon900} name={icon} size={ICON_SIZE} variant={active ? IconVariant.Filled : IconVariant.Regular} />
        </Animated.View>
        <HoverOverlay hovered={isHovered} reducedMotion={reducedMotion} />
      </Pressable>
    );
  }

  const row = (
    <Pressable
      {...hoverProps}
      {...(active ? ARIA_CURRENT_PAGE : null)}
      accessibilityRole="button"
      accessibilityState={disabled ? { disabled: true } : undefined}
      disabled={disabled}
      focusable={isActiveLayer}
      onPress={handlePress}
      style={[styles.panelRow, secondary ? styles.panelRowSecondary : styles.panelRowPrimary]}
      tabIndex={isActiveLayer ? 0 : -1}
      testID={testID ? `${testID}-panel` : undefined}
    >
      {active ? <ActiveIndicator /> : null}
      {icon && secondary ? (
        <EtIconV2 color={iconColor ?? colors.carbon900} name={icon} size={ICON_SIZE} variant={active ? IconVariant.Filled : IconVariant.Regular} />
      ) : null}
      <EtText
        numberOfLines={1}
        style={[styles.label, secondary ? styles.labelSecondary : null, { color: colors.carbon900 }]}
        variant={secondary ? 'label-primary-regular' : 'heading-base'}
      >
        {label}
      </EtText>
      {badge != null ? <View style={styles.badge}>{badge}</View> : null}
      <HoverOverlay hovered={isHovered} reducedMotion={reducedMotion} />
    </Pressable>
  );

  // Secondary items reveal with their Section's grouped block — no per-row wrapper.
  if (staggerIndex == null) {
    return row;
  }

  return <Animated.View style={revealStyle}>{row}</Animated.View>;
}

export const SideMenuItem = create(SideMenuItemBase, 'EtSideMenu.Item') as React.MemoExoticComponent<React.ComponentType<EtSideMenuItemProps>>;

const styles = StyleSheet.create({
  railCell: {
    height: RAIL_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: MENU_HORIZONTAL_PADDING,
    gap: ICON_LABEL_GAP,
  },
  panelRowPrimary: {
    height: PRIMARY_ROW_HEIGHT,
  },
  panelRowSecondary: {
    height: SECONDARY_ROW_HEIGHT,
  },
  label: {
    letterSpacing: 0,
    flexShrink: 1,
  },
  // Figma S-list text is 16/20; the kit's label-primary-regular is 16/24.
  labelSecondary: {
    lineHeight: 20,
  },
  badge: {
    marginStart: 'auto',
  },
});
