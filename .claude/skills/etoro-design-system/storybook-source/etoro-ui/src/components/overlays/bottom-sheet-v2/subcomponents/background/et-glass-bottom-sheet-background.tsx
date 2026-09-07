import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { HANDLE_INDICATOR_HEIGHT, HANDLE_PADDING_BOTTOM, HANDLE_PADDING_TOP } from '../handle';

const FLOATING_AREA_HEIGHT = HANDLE_PADDING_TOP + HANDLE_INDICATOR_HEIGHT + HANDLE_PADDING_BOTTOM;
const BORDER_RADIUS = 32;

const BLUR_INTENSITY = Platform.OS === 'android' ? 100 : 50;

/**
 * Glass background for EtBottomSheet — uses BlurView with rounded top corners.
 *
 * Starts immediately below the floating handle indicator so that the blur
 * covers the rounded-top area the handle renders transparently.
 * This eliminates the color gap between the handle and the sheet body.
 *
 * Theme-aware: adapts blur tint for light/dark mode.
 * On Android, adds a semi-transparent backdrop to compensate for weaker blur.
 *
 * @internal
 */
export function EtGlassBottomSheetBackground({ style }: BottomSheetBackgroundProps): React.JSX.Element {
  const { dark } = useTheme();
  const { colors } = useEtoroTheme();

  return (
    <View style={[style, styles.container]} pointerEvents="none">
      {Platform.OS === 'android' && <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.backgroundMenu }]} />}
      <BlurView intensity={BLUR_INTENSITY} tint={dark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
    </View>
  );
}

EtGlassBottomSheetBackground.displayName = 'EtBottomSheet.GlassBackground';

const styles = StyleSheet.create({
  container: {
    top: FLOATING_AREA_HEIGHT,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
});
