import { useTheme } from '@react-navigation/native';
import { memo } from 'react';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { withAlpha } from '../../../../core/styles/color.utils';
import { X1 } from '../../../../core/styles/spacing';
import { SlidingIndicatorProps } from '../api/types';
import { getSizeConfig } from '../utils';

/**
 * SlidingIndicator - Animated indicator that slides to the selected option.
 *
 * Internal component used by EtTextToggle.
 */
function SlidingIndicatorComponent({ size, style }: SlidingIndicatorProps) {
  const { colors } = useEtoroTheme();
  const { dark } = useTheme();
  const sizeConfig = getSizeConfig(size);

  const sharedDimensions = {
    height: sizeConfig.height - X1,
    borderRadius: sizeConfig.borderRadius - X1 / 2,
    flex: 1 as const,
    margin: X1 / 2,
  };

  const indicatorStyle = {
    ...sharedDimensions,
    backgroundColor: dark ? colors.carbonPrimaryDivider : colors.carbon050,
  };

  // CSS boxShadow (not legacy elevation) so the shadow composites with the view and fades in sync
  // with a parent opacity animation — native Android `elevation` ignores parent alpha and flashes.
  const shadowStyle = {
    boxShadow: `0px 1px 2px ${withAlpha(colors.carbonStatic900, 0.1)}`,
  };

  return <Animated.View style={[indicatorStyle, shadowStyle, style]} />;
}

export const SlidingIndicator = memo(SlidingIndicatorComponent);
SlidingIndicator.displayName = 'SlidingIndicator';
