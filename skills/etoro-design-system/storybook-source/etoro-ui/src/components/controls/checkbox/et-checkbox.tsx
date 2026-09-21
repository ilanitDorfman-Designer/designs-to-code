import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { EtCheckboxProps } from './api/types';
import { CheckboxIcon } from './components';
import { useCheckboxChildren } from './hooks/use-checkbox-children';
import { useCheckboxConfig } from './hooks/use-checkbox-config';
import { useCheckboxState } from './hooks/use-checkbox-state';
import { CheckboxLabel } from './subcomponents/checkbox-label';

/**
 * EtCheckbox - A controlled checkbox component with variants
 *
 * Uses compound component pattern for flexible composition.
 * Supports three variants: square (default, supports indeterminate), round (circular), and add (shows plus when unchecked).
 *
 * @example Basic usage (square variant, default)
 * ```tsx
 * const [value, setValue] = useState<CheckboxValueSquare>(false);
 * <EtCheckbox value={value} onChange={setValue} />
 * ```
 *
 * @example With label
 * ```tsx
 * <EtCheckbox value={value} onChange={setValue}>
 *   <EtCheckbox.Label>Subscribe to Newsletter</EtCheckbox.Label>
 * </EtCheckbox>
 * ```
 *
 * @example Round variant
 * ```tsx
 * const [value, setValue] = useState<CheckboxValueRoundOrAdd>(false);
 * <EtCheckbox value={value} onChange={setValue} variant="round" />
 * ```
 *
 * @example Add variant
 * ```tsx
 * const [value, setValue] = useState<CheckboxValueRoundOrAdd>(false);
 * <EtCheckbox value={value} onChange={setValue} variant="add" />
 * ```
 *
 * @example Indeterminate state (square variant only)
 * ```tsx
 * <EtCheckbox value="indeterminate" onChange={setValue} variant="square" />
 * ```
 */
function EtCheckboxBase(props: EtCheckboxProps) {
  const { value, onChange, children, style, testID, accessibilityLabel } = props;
  const { disabled, colors, haptics, variant, size, borderRadius } = useCheckboxConfig(props);

  const { animatedContainerStyle, checkAnimationValue, handlePress, isChecked, isIndeterminate } = useCheckboxState({
    value,
    disabled,
    haptics,
    onChange,
    colors,
    variant,
  });

  const childrenWithProps = useCheckboxChildren(children, disabled);

  // Responder-based tap handler for the label area.
  // Uses onStartShouldSetResponder (not Capture) so child Text elements
  // with their own onPress (e.g. links) claim the responder first.
  // Only when no child claims it does this View become the responder and toggle.
  const shouldSetResponder = useCallback(() => !disabled, [disabled]);
  const onResponderRelease = useCallback(() => handlePress(), [handlePress]);

  return (
    <View
      accessible
      style={[styles.wrapper, style]}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: isIndeterminate ? 'mixed' : isChecked,
        disabled,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={disabled && styles.disabled}
      >
        <Animated.View style={[styles.container, { borderRadius, width: size, height: size }, animatedContainerStyle as ViewStyle]}>
          <CheckboxIcon variant={variant} value={value} isChecked={isChecked} checkAnimationValue={checkAnimationValue} colors={colors} />
        </Animated.View>
      </Pressable>
      {children ? (
        <View style={styles.labelTouchArea} onStartShouldSetResponder={shouldSetResponder} onResponderRelease={onResponderRelease}>
          {childrenWithProps}
        </View>
      ) : null}
    </View>
  );
}

EtCheckboxBase.displayName = 'EtCheckbox';

/**
 * Export with compound components attached
 */
export const EtCheckbox = Object.assign(React.memo(EtCheckboxBase), {
  Label: CheckboxLabel,
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  container: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  labelTouchArea: {
    flex: 1,
  },
});
