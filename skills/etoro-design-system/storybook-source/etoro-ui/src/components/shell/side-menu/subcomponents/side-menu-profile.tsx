import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';
import { create } from '../../../../utils/create';
import type { EtSideMenuProfileProps, SideMenuSlotType } from '../api/types';
import { AVATAR_SIZE, AVATAR_TEXT_GAP, HEADER_PROFILE_GAP, HEADER_ROW_HEIGHT, MENU_HORIZONTAL_PADDING, PROFILE_HOVER_OVERHANG } from '../constants';
import { useSideMenuConfig, useSideMenuLayer, useSideMenuState } from '../context';
import { HEADER_PROFILE_EXPAND_WINDOW, useSideMenuBlockRevealStyle } from '../hooks/use-side-menu-animation';
import { useSideMenuLayerHover } from '../hooks/use-side-menu-layer-hover';
import { HoverOverlay } from './hover-overlay';

/**
 * EtSideMenu.Profile — rail form: the avatar only, centered (the root's rail
 * top group positions it 64px under the logo-toggle). Panel form: 36px avatar +
 * name/@handle row, 64px under the header row.
 *
 * The explicit lineHeight overrides (20 + 16 = 36 = avatar height) are
 * load-bearing: the kit variants' default line heights (24/20) would make the
 * row 44px (plan Conflict 2).
 *
 * Renders in both layers — `testID` is layer-suffixed (`-rail`/`-panel`); the
 * panel Pressable is keyboard-focusable only while expanded — via explicit
 * `tabIndex`, because RNW 0.21 Pressable ignores `focusable={false}`
 * (backdrop precedent).
 */
function SideMenuProfileBase({ avatar, name, handle, onPress, testID }: EtSideMenuProfileProps) {
  const layer = useSideMenuLayer();
  const { reducedMotion } = useSideMenuConfig();
  const { expanded } = useSideMenuState();
  const { colors } = useEtoroTheme();
  const isActiveLayer = layer === 'rail' ? !expanded : expanded;
  const { isHovered, hoverProps } = useSideMenuLayerHover(isActiveLayer);
  const revealStyle = useSideMenuBlockRevealStyle(HEADER_PROFILE_EXPAND_WINDOW);

  if (layer === 'rail') {
    return (
      <View style={styles.railAvatar} testID={testID ? `${testID}-rail` : undefined}>
        {avatar}
      </View>
    );
  }

  const content = (
    <>
      {avatar}
      <View style={styles.textColumn}>
        {name ? (
          <EtText numberOfLines={1} style={[styles.name, { color: colors.carbon900 }]} variant="label-primary-semibold">
            {name}
          </EtText>
        ) : null}
        {handle ? (
          <EtText numberOfLines={1} style={[styles.handle, { color: colors.carbon600 }]} variant="label-tertiary-regular">
            {handle}
          </EtText>
        ) : null}
      </View>
    </>
  );

  return (
    <Animated.View style={[styles.panelBlock, revealStyle]} testID={testID ? `${testID}-panel` : undefined}>
      {onPress ? (
        <Pressable
          {...hoverProps}
          accessibilityRole="button"
          focusable={expanded}
          onPress={onPress}
          style={styles.panelRow}
          tabIndex={expanded ? 0 : -1}
        >
          {content}
          {/* The row is exactly avatar-height (36), where a flush hover band looks
              cramped — the band overhangs 8px each side without moving the layout. */}
          <View pointerEvents="none" style={styles.hoverBand}>
            <HoverOverlay hovered={isHovered} reducedMotion={reducedMotion} />
          </View>
        </Pressable>
      ) : (
        <View style={styles.panelRow}>{content}</View>
      )}
    </Animated.View>
  );
}

export const SideMenuProfile = create(SideMenuProfileBase, 'EtSideMenu.Profile') as React.MemoExoticComponent<
  React.ComponentType<EtSideMenuProfileProps>
> & { __SLOT_TYPE: SideMenuSlotType };

SideMenuProfile.__SLOT_TYPE = 'profile';

const styles = StyleSheet.create({
  railAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBlock: {
    marginTop: HEADER_PROFILE_GAP,
  },
  panelRow: {
    height: HEADER_ROW_HEIGHT,
    paddingHorizontal: MENU_HORIZONTAL_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    gap: AVATAR_TEXT_GAP,
  },
  hoverBand: {
    position: 'absolute',
    start: 0,
    end: 0,
    top: -PROFILE_HOVER_OVERHANG,
    bottom: -PROFILE_HOVER_OVERHANG,
  },
  textColumn: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  name: {
    lineHeight: 20,
  },
  handle: {
    lineHeight: 16,
  },
});
