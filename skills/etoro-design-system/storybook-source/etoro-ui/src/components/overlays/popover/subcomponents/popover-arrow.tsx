import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X3, X5 } from '../../../../core/styles';
import type { PopoverArrowProps } from '../api/types';
import { usePopoverContext } from '../context';
import { getArrowPositionFromDirection } from '../utils';

const ARROW_WIDTH = 14;
const ARROW_HEIGHT = 7;

/** Horizontal offset for arrow alignment (start/end) on top/bottom positioned arrows */
const ARROW_OFFSET_HORIZONTAL = X5;
/** Vertical offset for arrow alignment (start/end) on left/right positioned arrows */
const ARROW_OFFSET_VERTICAL = X3;

/**
 * EtPopover.Arrow - Triangle pointer for the popover
 * Automatically positioned based on popoverDirection and arrowAlignment from context
 *
 * The arrow is placed on the opposite side of the popover direction:
 * - popoverDirection="above" → arrow at bottom, pointing down toward target
 * - popoverDirection="below" → arrow at top, pointing up toward target
 * - popoverDirection="left" → arrow on right, pointing right toward target
 * - popoverDirection="right" → arrow on left, pointing left toward target
 */
function PopoverArrowComponent({ style, testID }: PopoverArrowProps) {
  const { backgroundColor, popoverDirection, arrowAlignment } = usePopoverContext();

  const arrowPosition = getArrowPositionFromDirection(popoverDirection);
  const arrowStyle = useMemo(() => getArrowStyle(arrowPosition, backgroundColor), [arrowPosition, backgroundColor]);
  const containerStyle = getContainerStyle(arrowPosition, arrowAlignment);

  return (
    <View style={[styles.arrowContainer, containerStyle, style]} testID={testID}>
      <View style={arrowStyle} />
    </View>
  );
}

PopoverArrowComponent.displayName = 'EtPopover.Arrow';

export const PopoverArrow: FC<PopoverArrowProps> = React.memo(PopoverArrowComponent);
PopoverArrow.displayName = 'EtPopover.Arrow';

/**
 * Get the arrow triangle style based on position
 * Uses CSS border trick to create triangles
 */
function getArrowStyle(position: 'top' | 'bottom' | 'left' | 'right', backgroundColor: string) {
  const baseStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid' as const,
  };

  switch (position) {
    case 'bottom':
      // Arrow on bottom edge, pointing down
      return {
        ...baseStyle,
        borderLeftWidth: ARROW_WIDTH / 2,
        borderRightWidth: ARROW_WIDTH / 2,
        borderTopWidth: ARROW_HEIGHT,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: backgroundColor,
      };
    case 'top':
      // Arrow on top edge, pointing up
      return {
        ...baseStyle,
        borderLeftWidth: ARROW_WIDTH / 2,
        borderRightWidth: ARROW_WIDTH / 2,
        borderBottomWidth: ARROW_HEIGHT,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: backgroundColor,
      };
    case 'left':
      // Arrow on left edge, pointing left
      return {
        ...baseStyle,
        borderTopWidth: ARROW_WIDTH / 2,
        borderBottomWidth: ARROW_WIDTH / 2,
        borderRightWidth: ARROW_HEIGHT,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: backgroundColor,
      };
    case 'right':
      // Arrow on right edge, pointing right
      return {
        ...baseStyle,
        borderTopWidth: ARROW_WIDTH / 2,
        borderBottomWidth: ARROW_WIDTH / 2,
        borderLeftWidth: ARROW_HEIGHT,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: backgroundColor,
      };
  }
}

/**
 * Get the container style for positioning the arrow
 * Includes explicit dimensions to ensure flex layout allocates space
 */
function getContainerStyle(position: 'top' | 'bottom' | 'left' | 'right', alignment: 'start' | 'center' | 'end') {
  const isVertical = position === 'top' || position === 'bottom';

  // Base dimensions - arrow needs explicit size for flex layout
  const verticalBase = { width: ARROW_WIDTH, height: ARROW_HEIGHT };
  const horizontalBase = { width: ARROW_HEIGHT, height: ARROW_WIDTH };

  if (isVertical) {
    // Horizontal alignment for top/bottom arrows (RTL-aware)
    const alignmentStyles = {
      start: { alignSelf: 'flex-start' as const, marginStart: ARROW_OFFSET_HORIZONTAL, ...verticalBase },
      center: { alignSelf: 'center' as const, ...verticalBase },
      end: { alignSelf: 'flex-end' as const, marginEnd: ARROW_OFFSET_HORIZONTAL, ...verticalBase },
    };
    return alignmentStyles[alignment];
  } else {
    // Vertical alignment for left/right arrows
    const alignmentStyles = {
      start: { alignSelf: 'flex-start' as const, marginTop: ARROW_OFFSET_VERTICAL, ...horizontalBase },
      center: { alignSelf: 'center' as const, ...horizontalBase },
      end: { alignSelf: 'flex-end' as const, marginBottom: ARROW_OFFSET_VERTICAL, ...horizontalBase },
    };
    return alignmentStyles[alignment];
  }
}

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
