import { StyleSheet } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { EtIconV2 } from '../../../et-icon-v2';
import { CheckboxValue, CheckboxVariant } from '../api/types';
import { CheckboxColors } from '../utils/get-checkbox-colors';

interface CheckboxIconProps {
  variant: CheckboxVariant;
  value: CheckboxValue;
  isChecked: boolean;
  checkAnimationValue: SharedValue<number>;
  colors: CheckboxColors;
}

/**
 * Unified icon component for all checkbox variants and states.
 * Handles check icon and plus icon (add variant).
 * Indeterminate state shows filled background with no icon.
 */
export function CheckboxIcon({ variant, value, isChecked, checkAnimationValue, colors }: CheckboxIconProps) {
  // Check icon animation (fades in when checked)
  const checkIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(checkAnimationValue.value, [0.7, 1], [0, 1]);
    const scale = interpolate(checkAnimationValue.value, [0.7, 1], [0.3, 1]);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Plus icon animation (add variant only - fades out when checked)
  const plusIconStyle = useAnimatedStyle(() => {
    if (variant !== 'add') {
      return { opacity: 0 };
    }

    // Inverse of check animation: visible when unchecked, fades out when checked
    const opacity = interpolate(checkAnimationValue.value, [0, 0.3], [1, 0]);
    const scale = interpolate(checkAnimationValue.value, [0, 0.3], [1, 0.3]);
    const rotation = interpolate(checkAnimationValue.value, [0, 1], [0, 90]);

    return {
      opacity,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
    };
  });

  // Plus icon color: matches border color (unchecked or error)
  const plusIconColor = value === 'error' ? colors.error : colors.unchecked;

  return (
    <>
      {/* Check icon - shows when checked (all variants) */}
      {isChecked && (
        <Animated.View testID="check-icon-container" style={[styles.iconContainer, checkIconStyle]}>
          <EtIconV2 name="check-fill" size="md" color={colors.icon} />
        </Animated.View>
      )}

      {/* Plus icon - shows when unchecked (add variant only) */}
      {variant === 'add' && !isChecked && (
        <Animated.View testID="plus-icon-container" style={[styles.iconContainer, plusIconStyle]}>
          <EtoroIcon
            icon={{ iconName: 'plusLine' }}
            appearance={{
              size: 20,
              color: plusIconColor,
            }}
          />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
