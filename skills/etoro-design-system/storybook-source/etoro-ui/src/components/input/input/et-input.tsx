import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { EtInputProps } from './api';
import { FloatingLabel, HelperText, InputAdornment, InputField, PasswordToggleIcon } from './components';
import { useInputAnimations, useInputState } from './hooks';
import { calculatePrefixWidth, initProps } from './utils';

/** @deprecated use EtInputV2 instead */
export function EtInput(props: EtInputProps) {
  const { state, appearance, validation, accessibility, interaction, advanced } = initProps(props);
  const { colors } = useEtoroTheme();
  const isPassword = state.type === 'password';
  const hasError = Boolean(validation?.error);
  const hasPrefix = Boolean(appearance?.prefix);
  const hasSuffix = Boolean(appearance?.suffix);
  const prefixWidth = calculatePrefixWidth(hasPrefix, appearance?.prefix?.size);

  const { isFocused, isPasswordVisible, handleFocus, handleBlur, handlePasswordVisibility } = useInputState({
    haptics: interaction?.haptics,
    disabled: state.disabled,
  });

  const { animatedLabelStyle, animatedBorderStyle } = useInputAnimations({
    isFocused,
    value: state.value,
    hasError,
    hasPrefix,
    prefixWidth,
    errorBorderColor: appearance?.errorBorderColor || colors.actionBrandVarText || '#FF4444',
    defaultBorderColor: state.readonly ? 'transparent' : colors.textTertiaryNeutral,
    filledInputBorderColor: state.readonly ? 'transparent' : colors.textPrimaryNeutral,
  });

  // Get colors for different states
  const getLabelColor = () => {
    if (hasError) return appearance?.errorBorderColor || colors.actionBrandVarText || '#FF4444';
    if (state.value?.length > 0 && !state.disabled) return colors.textSecondaryNeutral;
    return colors.textTertiaryNeutral;
  };

  const getHelperTextColor = () => {
    if (hasError) return appearance?.errorBorderColor || colors.actionBrandVarText || '#FF4444';
    return colors.textTertiaryNeutral;
  };

  return (
    <View style={[styles.container, appearance?.style]}>
      <Animated.View
        style={[
          styles.inputContainer,
          animatedBorderStyle,
          state.disabled && [styles.disabledContainer, { backgroundColor: `${colors.bgNeutralPrimary}50` }],
        ]}
      >
        {/* Floating Label */}
        <FloatingLabel
          label={appearance?.label}
          required={state.required}
          animatedStyle={animatedLabelStyle}
          labelStyle={appearance?.labelStyle}
          color={getLabelColor()}
        />

        <View style={styles.inputRow}>
          {/* Prefix Adornment */}
          {hasPrefix && <InputAdornment {...appearance.prefix} position="prefix" disabled={state.disabled} />}

          {/* Main Input Field */}
          <InputField
            ref={advanced?.ref}
            value={state.value}
            onChangeText={state.onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={state.type || 'text'}
            isPasswordVisible={isPasswordVisible}
            isFocused={isFocused}
            placeholder={isFocused ? appearance?.placeholder : ''}
            disabled={state.disabled}
            readonly={state.readonly}
            maxLength={state.maxLength}
            inputStyle={appearance?.inputStyle}
            textColor={state.disabled ? colors.textSecondaryNeutral : colors.textPrimaryNeutral}
            cursorColor={colors.actionBrandText}
            selectionColor={colors.actionBrandText}
            testID={accessibility?.testID}
            accessibilityLabel={accessibility?.accessibilityLabel}
            accessibilityHint={accessibility?.accessibilityHint}
            textInputProps={advanced?.textInputProps}
          />

          {/* Password Toggle Icon */}
          {isPassword && <PasswordToggleIcon isPasswordVisible={isPasswordVisible} onPress={handlePasswordVisibility} />}

          {/* Suffix Adornment - only show if not a password field */}
          {hasSuffix && !isPassword && <InputAdornment {...appearance.suffix} position="suffix" disabled={state.disabled} />}
        </View>
      </Animated.View>

      {/* Helper Text / Error Message */}
      {(validation?.helperText || validation?.error || validation?.showCharCounter) && (
        <HelperText
          text={validation?.error || validation?.helperText || ''}
          isError={hasError}
          color={getHelperTextColor()}
          charCounter={
            validation?.showCharCounter && state.maxLength
              ? {
                  current: state.value?.length || 0,
                  max: state.maxLength,
                }
              : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  inputContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 4,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
