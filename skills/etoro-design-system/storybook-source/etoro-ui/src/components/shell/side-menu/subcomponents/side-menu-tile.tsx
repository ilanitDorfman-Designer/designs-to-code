import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useLayoutDirection } from '../../../../core/hooks/use-layout-direction';
import { EtText } from '../../../../foundations/text/et-text';
import { create } from '../../../../utils/create';
import { EtIconV2 } from '../../../et-icon-v2';
import { EtSkeleton } from '../../../status/skeleton';
import type { EtSideMenuTileProps, SideMenuSlotType } from '../api/types';
import {
  PANEL_BLOCK_GAP,
  PANEL_WIDTH,
  TILE_CHEVRON_SIZE,
  TILE_GUTTER,
  TILE_ICON_SIZE,
  TILE_ICON_TITLE_GAP,
  TILE_MIN_HEIGHT,
  TILE_PADDING,
  TILE_RADIUS,
} from '../constants';
import { useSideMenuConfig, useSideMenuLayer, useSideMenuState } from '../context';
import { HEADER_PROFILE_EXPAND_WINDOW, useSideMenuBlockRevealStyle } from '../hooks/use-side-menu-animation';
import { useSideMenuLayerHover } from '../hooks/use-side-menu-layer-hover';
import { HoverOverlay } from './hover-overlay';

const TILE_CARD_WIDTH = PANEL_WIDTH - 2 * TILE_GUTTER;
const TILE_SKELETON_HEIGHT = TILE_MIN_HEIGHT + 2 * TILE_PADDING;

/**
 * EtSideMenu.Tile — the Club card between the profile row and the menu:
 * `cardDefault` surface (radius 8, padding 16) inset 24 from the panel edges,
 * with an icon + title line, a subtitle underneath, and a trailing chevron.
 * Panel-only — the collapsed rail has no tile in the design. Dumb slot: the
 * shell resolves what the card says (club tier, member state) and where it
 * navigates. A press also collapses the panel via `requestClose('item')` —
 * the same click-to-navigate contract as `EtSideMenu.Item`.
 *
 * Reveals with the header/profile grouped window (no per-row stagger). While
 * `loading`, the card's exact footprint renders as a skeleton so the menu
 * below never jumps.
 */
function SideMenuTileBase({ icon, title, subtitle, onPress, loading, testID }: EtSideMenuTileProps) {
  const layer = useSideMenuLayer();
  const { reducedMotion } = useSideMenuConfig();
  const { expanded, requestClose } = useSideMenuState();
  const { colors } = useEtoroTheme();
  const direction = useLayoutDirection();
  const isActiveLayer = layer === 'rail' ? !expanded : expanded;
  const { isHovered, hoverProps } = useSideMenuLayerHover(isActiveLayer);
  const revealStyle = useSideMenuBlockRevealStyle(HEADER_PROFILE_EXPAND_WINDOW);

  const handlePress = useCallback(() => {
    onPress?.();
    requestClose('item'); // No-ops while collapsed (root guards).
  }, [onPress, requestClose]);

  if (layer === 'rail') {
    return null;
  }

  if (loading) {
    return (
      <Animated.View style={[styles.block, revealStyle]}>
        <EtSkeleton
          borderRadius={TILE_RADIUS}
          height={TILE_SKELETON_HEIGHT}
          testID={testID ? `${testID}-skeleton` : undefined}
          width={TILE_CARD_WIDTH}
        />
      </Animated.View>
    );
  }

  const content = (
    <>
      <View style={styles.textColumn}>
        <View style={styles.titleRow}>
          {icon ? <EtIconV2 color={colors.carbon900} name={icon} size={TILE_ICON_SIZE} /> : null}
          <EtText numberOfLines={1} style={[styles.title, { color: colors.carbon900 }]} variant="label-primary-semibold">
            {title}
          </EtText>
        </View>
        {subtitle ? (
          <EtText numberOfLines={1} style={{ color: colors.carbon600 }} variant="body-secondary-regular">
            {subtitle}
          </EtText>
        ) : null}
      </View>
      {/* Directional glyph — mirrored in RTL like every arrow in this family. */}
      <View style={{ transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }] }}>
        <EtIconV2 accessible={false} color={colors.carbon900} name="angle-right" size={TILE_CHEVRON_SIZE} />
      </View>
    </>
  );

  return (
    <Animated.View style={[styles.block, revealStyle]} testID={testID ? `${testID}-panel` : undefined}>
      {onPress ? (
        <Pressable
          {...hoverProps}
          accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
          accessibilityRole="button"
          focusable={expanded}
          onPress={handlePress}
          style={[styles.card, { backgroundColor: colors.cardDefault }]}
          tabIndex={expanded ? 0 : -1}
        >
          {content}
          <HoverOverlay hovered={isHovered} reducedMotion={reducedMotion} />
        </Pressable>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.cardDefault }]}>{content}</View>
      )}
    </Animated.View>
  );
}

export const SideMenuTile = create(SideMenuTileBase, 'EtSideMenu.Tile') as React.MemoExoticComponent<React.ComponentType<EtSideMenuTileProps>> & {
  __SLOT_TYPE: SideMenuSlotType;
};

SideMenuTile.__SLOT_TYPE = 'tile';

const styles = StyleSheet.create({
  block: {
    marginTop: PANEL_BLOCK_GAP,
    paddingHorizontal: TILE_GUTTER,
  },
  card: {
    minHeight: TILE_MIN_HEIGHT,
    padding: TILE_PADDING,
    borderRadius: TILE_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    // Clips the hover overlay to the card radius.
    overflow: 'hidden',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TILE_ICON_TITLE_GAP,
  },
  title: {
    flexShrink: 1,
  },
});
