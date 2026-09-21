import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { X8 } from '../../../../../core/styles/spacing';
import { HANDLE_INDICATOR_HEIGHT, HANDLE_PADDING_BOTTOM, HANDLE_PADDING_TOP } from '../handle';

/**
 * Height of the floating handle area (transparent part).
 */
const FLOATING_AREA_HEIGHT = HANDLE_PADDING_TOP + HANDLE_INDICATOR_HEIGHT + HANDLE_PADDING_BOTTOM;

const BORDER_RADIUS = X8; // 32px

/**
 * Overlap amount to prevent visible seam between handle and background.
 * The background starts slightly higher to overlap with handle's rounded section.
 */
const OVERLAP = 1;

/**
 * Total height of the handle component (floating area + rounded top).
 * Subtract overlap to prevent visible seam during animation.
 */
const HANDLE_TOTAL_HEIGHT = FLOATING_AREA_HEIGHT + BORDER_RADIUS - OVERLAP;

/**
 * Custom background component for EtBottomSheet that enables floating handle effect.
 *
 * This background starts below the handle component, which includes:
 * 1. Floating area (transparent with indicator)
 * 2. Rounded top section (colored, provides visual rounded corners)
 *
 * The background overlaps slightly with the handle's rounded section
 * to prevent a visible seam during animation.
 *
 * @internal
 */
export function EtBottomSheetBackground({ style, backgroundColor }: BottomSheetBackgroundProps & { backgroundColor?: string }): React.JSX.Element {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[
        style,
        // Start below the handle with slight overlap to prevent seam
        // No border radius - handle provides the rounded corners
        {
          top: HANDLE_TOTAL_HEIGHT,
          backgroundColor: backgroundColor ?? colors.backgroundMenu,
        },
      ]}
      pointerEvents="none"
    />
  );
}

EtBottomSheetBackground.displayName = 'EtBottomSheet.Background';
