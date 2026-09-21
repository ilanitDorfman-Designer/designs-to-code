import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X1, X2, X3, X5, X7 } from '../../../core/styles/spacing';
import { EtBadgeProps } from './api/types';
import { useComponentChildren } from './hooks';
import { BadgeIcon } from './subcomponents/badge-icon';
import { BadgeLabel } from './subcomponents/badge-label';
import { useBadgeColors } from './utils/get-badge-colors';

/**
 * Badge sizes configuration (per DS)
 * Large: 28px height, 12px horizontal padding
 * Medium: 20px height, 8px horizontal padding
 * Small: 20px height, 8px horizontal padding (smaller label/icon)
 */
const SIZE_CONFIG = {
  large: {
    paddingVertical: X1,
    paddingHorizontal: X3,
    minHeight: X7,
  },
  medium: {
    paddingVertical: X1,
    paddingHorizontal: X2,
    minHeight: X5,
  },
  small: {
    paddingVertical: X1,
    paddingHorizontal: X2,
    minHeight: X5,
  },
} as const;

/**
 * EtBadge - A pill-shaped badge component with color variants
 *
 * Uses compound component pattern for flexible composition.
 * Displays content with colored background, following the eToro design system.
 * Available in 9 color variants and 3 sizes.
 *
 * @example Basic usage
 * ```tsx
 * <EtBadge color="green">
 *   <EtBadge.Label>Success</EtBadge.Label>
 * </EtBadge>
 * ```
 *
 * @example With prefix icon
 * ```tsx
 * <EtBadge color="green">
 *   <EtBadge.Icon name="heart" />
 *   <EtBadge.Label>Favorites</EtBadge.Label>
 * </EtBadge>
 * ```
 *
 * @example With suffix icon
 * ```tsx
 * <EtBadge color="blue">
 *   <EtBadge.Label>New</EtBadge.Label>
 *   <EtBadge.Icon name="chevronRight" />
 * </EtBadge>
 * ```
 */
function EtBadgeRoot({ children, color = 'neutral', size = 'medium', style, testID, accessibilityLabel }: EtBadgeProps) {
  const colors = useBadgeColors(color);
  const sizeConfig = SIZE_CONFIG[size];

  // Memoize props to inject for stable reference
  const propsToInject = useMemo(() => ({ textColor: colors.text, size }), [colors.text, size]);

  // Inject textColor into children
  const injectedChildren = useComponentChildren(children, propsToInject);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          minHeight: sizeConfig.minHeight,
        },
        style,
      ]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {injectedChildren}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: X1,
    borderRadius: X5,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

EtBadgeRoot.displayName = 'EtBadge';

/**
 * Export with compound components attached
 */
export const EtBadge = Object.assign(React.memo(EtBadgeRoot), {
  Icon: BadgeIcon,
  Label: BadgeLabel,
});
