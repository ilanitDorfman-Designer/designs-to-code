import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X3, X5, X8, X9 } from '../../../../core/styles/spacing';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { ButtonGroupItemProps } from '../api';
import { useButtonGroupContext } from '../context';
import { useButtonPressAnimation } from '../hooks';

const ICON_SIZE = X5; // 20px
const BUTTON_HEIGHT = X9; // 36px
const BORDER_RADIUS = X8; // 32px
const PADDING_HORIZONTAL = X3; // 12px

/**
 * EtButtonGroup.Item - Individual button within the group
 * Automatically styled based on position (first/last) from context
 */
export function ButtonGroupItem({ iconName, onPress, disabled = false, testID, accessibilityLabel }: ButtonGroupItemProps) {
  const { colors } = useEtoroTheme();
  const { isFirst, isLast } = useButtonGroupContext();

  const normalColor = colors.bgButtonGroupNormal;
  const pressedColor = colors.carbonSecondaryDivider;

  const { animatedStyle, handlePressIn, handlePressOut } = useButtonPressAnimation({
    normalColor,
    pressedColor,
  });

  const handlePress = useCallback(() => {
    if (!disabled) {
      // Fire haptics without blocking - errors are silently ignored
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onPress();
    }
  }, [disabled, onPress]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        borderTopLeftRadius: isFirst ? BORDER_RADIUS : 0,
        borderBottomLeftRadius: isFirst ? BORDER_RADIUS : 0,
        borderTopRightRadius: isLast ? BORDER_RADIUS : 0,
        borderBottomRightRadius: isLast ? BORDER_RADIUS : 0,
        paddingHorizontal: PADDING_HORIZONTAL,
      },
    ],
    [isFirst, isLast],
  );

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[containerStyle, animatedStyle, disabled && styles.disabled]}>
        <EtoroIcon
          icon={{ iconName }}
          appearance={{
            size: ICON_SIZE,
            color: colors.textPrimaryNeutral,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}

ButtonGroupItem.displayName = 'EtButtonGroup.Item';

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
