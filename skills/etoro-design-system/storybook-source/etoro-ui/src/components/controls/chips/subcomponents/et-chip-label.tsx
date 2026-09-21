import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { useTextStyles } from '../../../../foundations/text/hooks';
import { ChipLabelProps } from '../api';
import { useChipContext } from '../context/chip-context';

/**
 * EtChip.Label - Text label subcomponent for EtChip
 *
 * Color is driven on the UI thread by the parent chip's `selectedProgress`
 * shared value so the selected/unselected transition stays in sync with the
 * background fade and is never interrupted by React re-renders.
 */
export function ChipLabel({ children, style }: ChipLabelProps) {
  const { disabled, selectedProgress } = useChipContext();
  const { colors, dark } = useEtoroTheme();

  const styles = useTextStyles({ variant: 'body-tiny-medium', colors, dark });

  const animatedColor = useAnimatedStyle(() => ({
    color: disabled ? colors.carbon300 : interpolateColor(selectedProgress.get(), [0, 1], [colors.carbon900, colors.carbon050]),
  }));

  return (
    <Animated.Text style={[styles.text, animatedColor, style]} maxFontSizeMultiplier={1.2}>
      {children}
    </Animated.Text>
  );
}

ChipLabel.displayName = 'EtChip.Label';
