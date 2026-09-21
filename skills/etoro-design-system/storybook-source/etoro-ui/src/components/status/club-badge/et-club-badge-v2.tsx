import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtIconV2 } from '../../et-icon-v2';
import {
  CLUB_BADGE_BLUR_INTENSITY,
  CLUB_BADGE_BORDER_WIDTH,
  CLUB_BADGE_HEIGHT,
  CLUB_BADGE_LOCK_OFFSET_Y,
  CLUB_BADGE_LOCK_SIZE,
  CLUB_BADGE_PADDING_LEFT,
  CLUB_BADGE_PADDING_RIGHT,
  CLUB_BADGE_WORDMARK_FONT_FAMILY,
  CLUB_BADGE_WORDMARK_FONT_SIZE,
  CLUB_BADGE_WORDMARK_LETTER_SPACING,
  CLUB_BADGE_WORDMARK_LINE_HEIGHT,
  CLUB_BADGE_WORDMARK_OFFSET_Y,
} from './et-club-badge.const';
import type { EtClubBadgeColorScheme, EtClubBadgeProps } from './et-club-badge.types';

type EtClubBadgeV2Props = Omit<EtClubBadgeProps, 'variant'>;

/**
 * Club 2.0 badge — carbon-bordered pill with serif Club wordmark.
 */
export function EtClubBadgeV2({ showLock = false, colorScheme, accessibilityLabel, testID }: EtClubBadgeV2Props): React.ReactNode {
  const { colors, dark } = useEtoroTheme();

  const { border, foreground, background } = resolveBadgeAppearance(colors, colorScheme);
  const blurTint = colorScheme === 'dark' || (colorScheme === undefined && dark) ? 'dark' : 'light';

  const resolvedAccessibilityLabel = accessibilityLabel ?? (showLock ? 'eToro Club' : 'eToro Club member');

  return (
    <View
      style={[
        styles.outer,
        {
          borderColor: border,
        },
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={resolvedAccessibilityLabel}
      testID={testID}
    >
      <BlurView intensity={CLUB_BADGE_BLUR_INTENSITY} tint={blurTint} style={[styles.blur, { backgroundColor: background }]} pointerEvents="none">
        <View style={styles.inner}>
          {showLock ? (
            <View style={[styles.contentSlot, styles.lockSlot]}>
              <EtIconV2 name="lock-fill" size={CLUB_BADGE_LOCK_SIZE} color={foreground} accessible={false} />
            </View>
          ) : null}
          <View style={styles.contentSlot}>
            <Text
              style={[styles.wordmark, { color: foreground }]}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              testID="club-badge-wordmark"
            >
              Club
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

function resolveBadgeAppearance(
  colors: ReturnType<typeof useEtoroTheme>['colors'],
  colorScheme: EtClubBadgeColorScheme | undefined,
): { border: string; foreground: string; background: string } {
  if (colorScheme === 'light') {
    return {
      border: colors.carbonStatic900,
      foreground: colors.carbonStatic900,
      background: colors.carbonStatic050,
    };
  }
  if (colorScheme === 'dark') {
    return {
      border: colors.carbonStatic050,
      foreground: colors.carbonStatic050,
      background: colors.carbonStatic900,
    };
  }
  return {
    border: colors.carbon900,
    foreground: colors.carbon900,
    background: colors.carbon900Inverted,
  };
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: CLUB_BADGE_BORDER_WIDTH,
    height: CLUB_BADGE_HEIGHT,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    paddingLeft: CLUB_BADGE_PADDING_LEFT,
    paddingRight: CLUB_BADGE_PADDING_RIGHT,
  },
  contentSlot: {
    alignItems: 'center',
    height: CLUB_BADGE_LOCK_SIZE,
    justifyContent: 'center',
  },
  lockSlot: {
    transform: [{ translateY: CLUB_BADGE_LOCK_OFFSET_Y }],
  },
  wordmark: {
    fontFamily: CLUB_BADGE_WORDMARK_FONT_FAMILY,
    fontSize: CLUB_BADGE_WORDMARK_FONT_SIZE,
    includeFontPadding: false,
    letterSpacing: CLUB_BADGE_WORDMARK_LETTER_SPACING,
    lineHeight: CLUB_BADGE_WORDMARK_LINE_HEIGHT,
    transform: [{ translateY: CLUB_BADGE_WORDMARK_OFFSET_Y }],
  },
});
