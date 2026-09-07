import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { create } from '../../../../utils/create';
import { EtIconV2 } from '../../../et-icon-v2';
import { EtSkeleton } from '../../../status/skeleton';
import type { EtTopPanelToriBadgeProps, TopPanelSlotType } from '../api/types';
import {
  TORI_BADGE_GAP,
  TORI_BADGE_HEIGHT,
  TORI_BADGE_PADDING_HORIZONTAL,
  TORI_BADGE_PADDING_VERTICAL,
  TORI_BADGE_RADIUS,
  TORI_BADGE_SKELETON_WIDTH,
  TORI_LOGO_SIZE,
} from '../constants';
import { ToriBadgeLabel } from './tori-badge-label';

/**
 * EtTopPanel.ToriBadge — the "Ask Tori" pill next to the global search.
 * On an `accentE100` tint: the theme-gradient `tori-logo` mark, then the
 * label as one carbon900 → verdictPositive600 gradient run (see
 * `ToriBadgeLabel`) — every color a theme token, so dark/light Just Works.
 *
 * A press target only when `onPress` is given — the kit stays navigation-free,
 * the shell wires the Tori surface when it exists. `loading` swaps the badge
 * for a same-footprint skeleton pill so the centered search group cannot
 * shift when availability resolves.
 */
function TopPanelToriBadgeBase({ label, accentLabel, loading, onPress, accessibilityLabel, testID }: EtTopPanelToriBadgeProps) {
  const { colors } = useEtoroTheme();

  if (loading) {
    return (
      <EtSkeleton
        borderRadius={TORI_BADGE_RADIUS}
        height={TORI_BADGE_HEIGHT}
        testID={testID ? `${testID}-skeleton` : undefined}
        width={TORI_BADGE_SKELETON_WIDTH}
      />
    );
  }

  const content = (
    <>
      <EtIconV2 accessible={false} color={colors.carbon900} name="tori-logo" size={TORI_LOGO_SIZE} />
      <ToriBadgeLabel accentLabel={accentLabel} label={label} />
    </>
  );

  // Non-interactive form: NO container label — the gradient run is real text
  // and announces itself. An `accessibilityLabel` here would be dead weight on
  // native (a plain View is not an accessibility element) and invalid on web
  // (ARIA prohibits `aria-label` on a role-less generic element).
  if (onPress == null) {
    return (
      <View style={[styles.badge, { backgroundColor: colors.accentE100 }]} testID={testID}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? `${label} ${accentLabel}`}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.badge, { backgroundColor: colors.accentE100 }]}
      testID={testID}
    >
      {content}
    </Pressable>
  );
}

export const TopPanelToriBadge = create(TopPanelToriBadgeBase, 'EtTopPanel.ToriBadge') as React.MemoExoticComponent<
  React.ComponentType<EtTopPanelToriBadgeProps>
> & { __SLOT_TYPE: TopPanelSlotType };

TopPanelToriBadge.__SLOT_TYPE = 'tori';

const styles = StyleSheet.create({
  badge: {
    height: TORI_BADGE_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: TORI_BADGE_GAP,
    paddingHorizontal: TORI_BADGE_PADDING_HORIZONTAL,
    paddingVertical: TORI_BADGE_PADDING_VERTICAL,
    borderRadius: TORI_BADGE_RADIUS,
    overflow: 'hidden',
  },
});
