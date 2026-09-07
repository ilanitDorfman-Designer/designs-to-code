import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { X8 } from '../../../../../core/styles/spacing';
import {
  HANDLE_INDICATOR_BORDER_RADIUS,
  HANDLE_INDICATOR_HEIGHT,
  HANDLE_INDICATOR_WIDTH,
  HANDLE_PADDING_BOTTOM,
  HANDLE_PADDING_TOP,
} from './et-bottom-sheet-handle.const';
import { EtBottomSheetHandleProps } from './et-bottom-sheet-handle.types';

const BORDER_RADIUS = X8; // 32px - matches sheet background

/**
 * Custom handle component for EtBottomSheet with floating effect.
 *
 * The floating effect is achieved by:
 * 1. This handle component has a transparent top area (floating zone)
 * 2. Below that, a colored section with rounded top corners (imitates sheet top)
 * 3. A custom backgroundComponent starts below this, continuing the sheet
 *
 * ## Visual Structure
 *
 * ```
 * ┌─────────────────────────────────────┐ ← Transparent (floating area)
 * │           ═══════                   │ ← Handle indicator
 * ├╭───────────────────────────────────╮┤ ← Rounded corners (this component)
 * ││  Header Title              [X]    ││ ← Background continues below
 * └╰───────────────────────────────────╯┘
 * ```
 *
 * ## Features
 *
 * - Floating handle with transparent top
 * - Rounded corners that match the sheet background
 * - Theme-aware colors
 * - Supports hiding the indicator while maintaining gesture area
 *
 * @internal
 */
export function EtBottomSheetHandle({
  showHandle = true,
  variant = 'default',
  backgroundColor,
  testID,
}: EtBottomSheetHandleProps): React.JSX.Element {
  const { colors } = useEtoroTheme();
  const isGlass = variant === 'glass';

  const indicatorColor = showHandle ? { backgroundColor: colors.carbon300 } : styles.hiddenIndicator;
  const roundedTopColor = isGlass ? glassStyles.transparentBg : { backgroundColor: backgroundColor ?? colors.backgroundMenu };

  return (
    <View style={styles.container} testID={testID}>
      {/* Floating area with handle indicator - transparent */}
      <View style={styles.floatingArea}>
        <View style={[styles.indicator, indicatorColor]} />
      </View>
      {/* Rounded top section - imitates the top of the sheet */}
      <View style={[styles.roundedTop, roundedTopColor]} />
    </View>
  );
}

EtBottomSheetHandle.displayName = 'EtBottomSheet.Handle';

const styles = StyleSheet.create({
  container: {
    // Container spans both floating area and rounded top
  },
  floatingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: HANDLE_PADDING_TOP,
    paddingBottom: HANDLE_PADDING_BOTTOM,
    // Transparent background - handle floats over backdrop
  },
  indicator: {
    width: HANDLE_INDICATOR_WIDTH,
    height: HANDLE_INDICATOR_HEIGHT,
    borderRadius: HANDLE_INDICATOR_BORDER_RADIUS,
  },
  hiddenIndicator: {
    height: 0,
    opacity: 0,
  },
  roundedTop: {
    height: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
});

const glassStyles = StyleSheet.create({
  transparentBg: {
    backgroundColor: 'transparent',
  },
});
