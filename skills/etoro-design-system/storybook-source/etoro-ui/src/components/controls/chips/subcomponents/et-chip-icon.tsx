import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { ChipIconProps } from '../api';
import { useChipContext } from '../context/chip-context';

const ICON_SIZE = 16;

/**
 * EtChip.Icon - Icon subcomponent for EtChip
 *
 * Color is driven on the UI thread by the parent chip's `selectedProgress`.
 * Two icon layers (unselected + selected color) are cross-faded via opacity so
 * the color transition stays in sync with the background and label and is never
 * interrupted by React re-renders. SVG fill is a prop (not animatable), so a
 * cross-fade is used instead of animating the color directly.
 */
export function ChipIcon({ iconName }: ChipIconProps) {
  const { disabled, selectedProgress } = useChipContext();
  const { colors } = useEtoroTheme();

  const baseStyle = useAnimatedStyle(() => ({ opacity: 1 - selectedProgress.get() }));
  const selectedStyle = useAnimatedStyle(() => ({ opacity: selectedProgress.get() }));

  if (disabled) {
    return <EtoroIcon icon={{ iconName }} appearance={{ size: ICON_SIZE, color: colors.carbon300 }} />;
  }

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={baseStyle}>
        <EtoroIcon icon={{ iconName }} appearance={{ size: ICON_SIZE, color: colors.carbon900 }} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, selectedStyle]}>
        <EtoroIcon icon={{ iconName }} appearance={{ size: ICON_SIZE, color: colors.carbon050 }} />
      </Animated.View>
    </Animated.View>
  );
}

ChipIcon.displayName = 'EtChip.Icon';

const styles = StyleSheet.create({
  container: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
