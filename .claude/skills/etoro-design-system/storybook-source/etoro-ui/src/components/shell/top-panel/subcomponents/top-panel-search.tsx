import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';
import { create } from '../../../../utils/create';
import { EtIconV2 } from '../../../et-icon-v2';
import type { EtTopPanelSearchProps, TopPanelSlotType } from '../api/types';
import {
  SEARCH_CLEAR_ICON_SIZE,
  SEARCH_ICON_SIZE,
  SEARCH_ICON_TEXT_GAP,
  SEARCH_PILL_BG_OPACITY,
  SEARCH_PILL_HEIGHT,
  SEARCH_PILL_PADDING_HORIZONTAL,
  SEARCH_PILL_RADIUS,
  SEARCH_PILL_WIDTH,
} from '../constants';

/**
 * EtTopPanel.Search — a PRESSABLE rest-state pill mimicking the DS Search
 * Field, NOT a text input (D4: it must never focus a keyboard; the shell
 * navigates to the search screen on press). 280×40, radius 100, background =
 * a dedicated `carbon900` layer at 8% opacity (Figma's own structure — a
 * fill layer with node opacity, sidestepping rgba composition). The text is
 * the field's primary text color per the DS binding — deliberately not a
 * dimmed placeholder gray.
 *
 * The trailing `xmark-circle-fill` is explicit in the DS rest-state variant
 * on every frame (D5) — rendered decorative and hidden from AT.
 */
function TopPanelSearchBase({ placeholder, onPress, accessibilityLabel, testID }: EtTopPanelSearchProps) {
  const { colors } = useEtoroTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? placeholder}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.pill}
      testID={testID}
    >
      <View style={[styles.background, { backgroundColor: colors.carbon900 }]} />
      <View style={styles.searchGroup}>
        <EtIconV2 color={colors.carbon900} name="search" size={SEARCH_ICON_SIZE} />
        <EtText numberOfLines={1} style={[styles.placeholder, { color: colors.carbon900 }]} variant="body-secondary-regular">
          {placeholder}
        </EtText>
      </View>
      <View aria-hidden style={styles.clear} testID={testID ? `${testID}-clear` : undefined}>
        <EtIconV2 accessible={false} color={colors.carbon400} name="xmark-circle-fill" size={SEARCH_CLEAR_ICON_SIZE} />
      </View>
    </Pressable>
  );
}

export const TopPanelSearch = create(TopPanelSearchBase, 'EtTopPanel.Search') as React.MemoExoticComponent<
  React.ComponentType<EtTopPanelSearchProps>
> & { __SLOT_TYPE: TopPanelSlotType };

TopPanelSearch.__SLOT_TYPE = 'search';

const styles = StyleSheet.create({
  pill: {
    width: SEARCH_PILL_WIDTH,
    height: SEARCH_PILL_HEIGHT,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SEARCH_PILL_PADDING_HORIZONTAL,
    borderRadius: SEARCH_PILL_RADIUS,
    // Clips the full-bleed background layer to the pill radius.
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: SEARCH_PILL_BG_OPACITY,
    pointerEvents: 'none',
  },
  searchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SEARCH_ICON_TEXT_GAP,
    flexShrink: 1,
  },
  placeholder: {
    flexShrink: 1,
  },
  clear: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
