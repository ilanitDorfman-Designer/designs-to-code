import { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { InputProps } from './api/types';
import { InputProvider, useInputConfig, useInputInteraction } from './context';
import { useComponentChildren } from './hooks/use-component-children';
import { FloatingLabel } from './subcomponents/floating-label';
import { HelperText } from './subcomponents/helper-text';
import { IconAdornment } from './subcomponents/icon-adornment';
import { InputField } from './subcomponents/input-field';
import { PasswordToggle } from './subcomponents/password-toggle';
import { TextAdornment } from './subcomponents/text-adornment';
import { getInputContainerPressablePlatformProps, getInputContainerPressablePlatformStyle } from './utils/input-container-platform-props';
import { INPUT_LAYOUT_METRICS } from './utils/input-layout-metrics';

/**
 * Root of EtInput v2: wraps children in `InputProvider` so label, field, and adornments share one context tree.
 */
function InputRoot({
  style,
  backgroundColor,
  children,
  type = 'text',
  variant = 'underline',
  defaultValue,
  error = null,
  disabled = false,
  readonly = false,
  maxLength = undefined,
  showCharCounter = false,
  staticLabel = false,
  passwordShowAccessibilityLabel,
  passwordHideAccessibilityLabel,
  passwordToggleAccessibilityHint,
  defaultPasswordVisible = false,
  showPasswordToggleWhenDisabled = false,
}: InputProps) {
  return (
    <InputProvider
      type={type}
      variant={variant}
      defaultValue={defaultValue}
      error={error}
      disabled={disabled}
      readonly={readonly}
      maxLength={maxLength}
      staticLabel={staticLabel}
      passwordShowAccessibilityLabel={passwordShowAccessibilityLabel}
      passwordHideAccessibilityLabel={passwordHideAccessibilityLabel}
      passwordToggleAccessibilityHint={passwordToggleAccessibilityHint}
      defaultPasswordVisible={defaultPasswordVisible}
    >
      <InputContainer
        style={style}
        backgroundColor={backgroundColor}
        showCharCounter={showCharCounter}
        showPasswordToggleWhenDisabled={showPasswordToggleWhenDisabled}
      >
        {children}
      </InputContainer>
    </InputProvider>
  );
}

interface InputContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  showCharCounter?: boolean;
  showPasswordToggleWhenDisabled?: boolean;
}

/**
 * Pressable input chrome: animated border, floating label overlay, field row, trailing adornments, and helper line.
 */
function InputContainer({ style, backgroundColor, children, showCharCounter, showPasswordToggleWhenDisabled }: InputContainerProps) {
  const { colors } = useEtoroTheme();

  const { disabled, type, maxLength, error } = useInputConfig();
  const {
    animatedBorderStyle,
    animatedLabelContainerStyle,
    animatedFieldRowStyle,
    isPasswordVisible,
    handlePasswordVisibility,
    isFocused,
    hasValue,
    focusInput,
  } = useInputInteraction();

  const { labelChild, fieldChild, adornmentChildren } = useComponentChildren(children);

  // Disabled password fields hide the eye toggle (matches legacy "read-only PIN" UX)
  // unless the caller opts into `showPasswordToggleWhenDisabled` so a read-only
  // masked value stays revealable (e.g. a prefilled SSN).
  const showPasswordToggle = type === 'password' && (!disabled || showPasswordToggleWhenDisabled);
  const hasTrailingAdornments = adornmentChildren.length > 0 || showPasswordToggle;

  const shouldShowHelperText = error || (showCharCounter && maxLength);
  const pressablePlatformProps = getInputContainerPressablePlatformProps();
  const pressablePlatformStyle = getInputContainerPressablePlatformStyle();

  return (
    <View style={style}>
      <Pressable
        {...pressablePlatformProps}
        testID="input-container-pressable"
        onPress={focusInput}
        disabled={disabled}
        accessible={false}
        style={({ pressed }) => [pressablePlatformStyle, pressed && {}]}
      >
        <Animated.View
          // A disabled field swallows touches, but the eye toggle must stay
          // tappable when it is kept visible (the field itself is non-editable
          // and the outer Pressable is disabled, so nothing else reacts).
          pointerEvents={disabled && !showPasswordToggleWhenDisabled ? 'none' : 'auto'}
          style={[
            styles.inputContainer,
            // Figma "Background transparent color" overlay — carbon900 at ~5% (0x0D / 255 ≈ 5.1%).
            { backgroundColor: backgroundColor ?? `${colors.carbon900}0D` },
            animatedBorderStyle,
          ]}
        >
          <View style={[styles.contentRow, hasTrailingAdornments && styles.contentRowWithAdornments]}>
            <View style={styles.inputColumn}>
              <Animated.View style={[styles.fieldRow, styles.fieldRowLayer, labelChild ? animatedFieldRowStyle : undefined]}>
                {fieldChild}
              </Animated.View>
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.labelOverlay, animatedLabelContainerStyle]}>
                {labelChild}
              </Animated.View>
            </View>
            {hasTrailingAdornments && (
              <View style={styles.adornmentsWrap}>
                {adornmentChildren}
                {showPasswordToggle && (
                  <PasswordToggle
                    isPasswordVisible={isPasswordVisible}
                    handlePasswordVisibility={handlePasswordVisibility}
                    isFocused={isFocused}
                    hasValue={hasValue}
                    disabled={disabled && !showPasswordToggleWhenDisabled}
                  />
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
      {shouldShowHelperText && <HelperText error={error} showCharCounter={showCharCounter} maxLength={maxLength} />}
    </View>
  );
}

InputRoot.displayName = 'EtInput';

const Label = FloatingLabel;
const Field = InputField;
const TextAdornmentComponent = TextAdornment;
const IconAdornmentComponent = IconAdornment;

export const EtInput = Object.assign(InputRoot, {
  Label,
  Field,
  TextAdornment: TextAdornmentComponent,
  IconAdornment: IconAdornmentComponent,
});

const styles = StyleSheet.create({
  /** Padding, height — border + fill applied here (Animated). */
  inputContainer: {
    paddingVertical: INPUT_LAYOUT_METRICS.paddingVertical,
    paddingHorizontal: INPUT_LAYOUT_METRICS.paddingHorizontal,
    height: INPUT_LAYOUT_METRICS.containerHeight,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  /** Full-height row: left = label + field, right = suffix/icon (vertically centered to container). */
  contentRow: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  contentRowWithAdornments: {
    gap: 8,
  },
  inputColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  fieldRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 0,
  },
  fieldRowLayer: {
    zIndex: 2,
  },
  labelOverlay: {
    zIndex: 1,
    alignItems: 'flex-start',
  },
  adornmentsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 2,
  },
});
