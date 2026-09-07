import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text/et-text';
import { EtIconV2 } from '../../et-icon-v2';
import type { EtClubBadgeColorScheme, EtClubBadgeProps } from './et-club-badge.types';

/** Lock icon size in px (Figma node `4712:50906`). */
const LOCK_ICON_SIZE = 10;

type EtClubBadgeLegacyProps = Omit<EtClubBadgeProps, 'variant'>;

/**
 * Pre–Club 2.0 badge — primary-bordered pill with sans-serif "Club" label.
 *
 * @deprecated Use `EtClubBadge` with `variant="v2"` (or `EtClubBadgeV2`) instead.
 */
export function EtClubBadgeLegacy({ showLock = false, colorScheme, accessibilityLabel, testID }: EtClubBadgeLegacyProps): React.ReactNode {
  const { colors } = useEtoroTheme();

  const { foreground, background } = resolveBadgeColors(colors, colorScheme);

  const resolvedAccessibilityLabel = accessibilityLabel ?? (showLock ? 'eToro Club' : 'eToro Club member');

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.primary600,
          backgroundColor: background,
        },
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={resolvedAccessibilityLabel}
      testID={testID}
    >
      {showLock && <EtIconV2 name="lock-fill" size={LOCK_ICON_SIZE} color={foreground} accessible={false} />}
      <EtText variant="body-tiny-medium" style={{ color: foreground }} accessible={false} importantForAccessibility="no-hide-descendants">
        Club
      </EtText>
    </View>
  );
}

function resolveBadgeColors(
  colors: ReturnType<typeof useEtoroTheme>['colors'],
  colorScheme: EtClubBadgeColorScheme | undefined,
): { foreground: string; background: string } {
  if (colorScheme === 'light') {
    return { foreground: colors.carbonStatic900, background: colors.carbonStatic050 };
  }
  if (colorScheme === 'dark') {
    return { foreground: colors.carbonStatic050, background: colors.carbonStatic900 };
  }
  return { foreground: colors.carbon900, background: colors.carbon900Inverted };
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
});
