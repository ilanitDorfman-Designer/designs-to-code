import * as Haptics from 'expo-haptics';
import { memo, useCallback, useEffect } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X4 } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text';
import { useTextToggleContext } from '../api/context';
import { TextToggleOptionProps } from '../api/types';
import { getSizeConfig } from '../utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_SCALE_SPRING = { damping: 35, stiffness: 300 };
const PRESSED_SCALE = 0.95;

/**
 * EtTextToggle.Option — must be a child of EtTextToggle.
 */
function ToggleOptionComponent({ id, label, disabled: optionDisabled = false, style, textStyle, testID }: TextToggleOptionProps) {
  const {
    selectedId,
    onSelect,
    size,
    stretch,
    disabled: toggleDisabled,
    haptics,
    registerOption,
    unregisterOption,
    reportOptionLayout,
    getOptionIndex,
    animateToIndex,
  } = useTextToggleContext();
  const { colors } = useEtoroTheme();

  const isSelected = selectedId === id;
  const isDisabled = toggleDisabled || optionDisabled;
  const sizeConfig = getSizeConfig(size);

  useEffect(() => {
    registerOption(id);
    return () => unregisterOption(id);
  }, [id, registerOption, unregisterOption]);

  // Report measured `{x, width}` so the indicator sizes against the
  // real rectangle — required for `stretch={false}` toggles where each
  // option's width is label-driven.
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      reportOptionLayout(id, { x, width });
    },
    [id, reportOptionLayout],
  );

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (isDisabled || isSelected) return;

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Start the spring on the UI thread before notifying the parent
    // so the indicator moves on this frame regardless of how heavy
    // the parent's `onSelectionChange` work is. The catch-up effect
    // in `TextToggleProvider` dedupes the follow-up call.
    const newIndex = getOptionIndex(id);
    if (newIndex >= 0) animateToIndex(newIndex);

    onSelect(id);
  };

  const handlePressIn = () => {
    if (!isDisabled) scale.value = withSpring(PRESSED_SCALE, PRESS_SCALE_SPRING);
  };

  const handlePressOut = () => {
    if (!isDisabled) scale.value = withSpring(1, PRESS_SCALE_SPRING);
  };

  const textColor = isDisabled ? colors.carbon600 : isSelected ? colors.carbon900 : colors.carbon500;
  // Text scales with the toggle size: small → body-tiny, large → body-secondary.
  const textVariant = size === 'small' ? 'body-tiny-medium' : 'body-secondary-medium';

  const baseStyle = {
    // Stretch fills the container; otherwise use intrinsic, label-driven width.
    ...(stretch ? { flex: 1 } : { paddingHorizontal: X4 }),
    height: sizeConfig.height,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minWidth: sizeConfig.minWidth,
    opacity: isDisabled ? 0.5 : 1,
    zIndex: isSelected ? 10 : 1,
  };

  return (
    <AnimatedPressable
      style={[baseStyle, style, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
      disabled={isDisabled}
      testID={testID || `toggle-option-${id}`}
      accessibilityRole="radio"
      accessibilityLabel={`Select ${label}`}
      accessibilityState={{
        selected: isSelected,
        disabled: isDisabled,
      }}
    >
      <EtText variant={textVariant} numberOfLines={1} ellipsizeMode="tail" style={[styles.optionText, { color: textColor }, textStyle]}>
        {label}
      </EtText>
    </AnimatedPressable>
  );
}

export const ToggleOption = memo(ToggleOptionComponent);
ToggleOption.displayName = 'EtTextToggle.Option';

const styles = StyleSheet.create({
  optionText: {
    textAlign: 'center',
  },
});
