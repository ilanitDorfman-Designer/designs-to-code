import { useTheme } from '@react-navigation/native';
import { forwardRef, useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtGlassView, LiquidGlassContext, useLiquidGlass, useLiquidGlassContext } from '../../../core/liquid-glass';
import { X3 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text/et-text';
import { InputAdornment, InputField } from '../input/components';
import { useInputState } from '../input/hooks';
import { EtSearchInputProps } from './api';

const BORDER_WIDTH = 1;
const SEARCH_FIELD_BACKGROUND_ALPHA = '14';

/**
 * Resolves the effective Liquid Glass state (in priority order):
 * 1. Explicit `liquidGlass` prop (opt-in/opt-out)
 * 2. Parent context (e.g. from EtTopbar)
 * 3. Platform auto-detection, but only on dark theme — the regular search
 *    input should stay solid unless the caller opts into glass explicitly.
 */
function useResolvedLiquidGlass(liquidGlassProp?: boolean): boolean {
  const { isLiquidGlass: contextGlass } = useLiquidGlassContext();
  const { supportsLiquidGlass } = useLiquidGlass();
  const { dark: isDark } = useTheme();

  if (liquidGlassProp !== undefined) return liquidGlassProp && supportsLiquidGlass;
  if (contextGlass) return contextGlass;
  return isDark ? supportsLiquidGlass : false;
}

/**
 * Search field: uses a consistent gray fill across states; idle appears borderless because the
 * 1px border is transparent, and focus reveals the stroke by changing the border color.
 * Filled (has text, blurred) keeps the same fill. Trailing **Cancel** clears text (not an icon).
 * `variant="input"` keeps the 64pt container + trailing cancel text.
 * `variant="compact"` uses a rounded container with inline clear icon.
 *
 * Pass `liquidGlass` to render the field as a native Liquid Glass surface on
 * iOS 26+ (falls back to the solid fill when unavailable). When omitted, it
 * inherits from a parent `LiquidGlassContext`.
 */
export const EtSearchInput = forwardRef<TextInput, EtSearchInputProps>(
  (
    {
      variant = 'input',
      value,
      onChangeText,
      onCancel,
      placeholder = 'Search',
      cancelLabel = 'Cancel',
      cancelAccessibilityLabel,
      disabled = false,
      maxLength,
      style,
      containerStyle,
      testID,
      accessibilityLabel,
      accessibilityHint,
      haptics = false,
      liquidGlass,
      advanced,
    },
    ref,
  ) => {
    const { colors } = useEtoroTheme();
    const isCompact = variant === 'compact';
    const isLiquidGlass = useResolvedLiquidGlass(liquidGlass);
    const glassContextValue = useMemo(() => ({ isLiquidGlass }), [isLiquidGlass]);

    const { isFocused, handleFocus, handleBlur } = useInputState({
      haptics,
      disabled,
    });

    const hasText = Boolean(value?.length);
    const showCancel = !isCompact && (isFocused || hasText);
    const showCompactClear = isCompact && hasText;
    /** Empty + not focused — design “Default” */
    const isDefaultIdle = !isFocused && !hasText;
    /** Focused — design “Focus” (border stroke visible) */
    const isFocusVisual = isFocused;

    const handleCancel = () => {
      onChangeText('');
      onCancel?.();
    };

    const containerBackgroundColor = `${colors.carbon900}${SEARCH_FIELD_BACKGROUND_ALPHA}`;
    const borderColor = isFocusVisual ? colors.carbon300 : 'transparent';

    const iconColor = disabled ? colors.textQuaternaryNeutral : isDefaultIdle ? colors.textTertiaryNeutral : colors.textPrimaryNeutral;

    const mergedTextInputProps = {
      placeholderTextColor: colors.textTertiaryNeutral,
      ...advanced?.textInputProps,
    };

    const solidContainerStyle = {
      backgroundColor: containerBackgroundColor,
      borderColor,
    };

    const inputContent = (
      <>
        <InputAdornment iconName="searchLine" size={16} position="prefix" color={iconColor} style={styles.adornment} testID={`${testID}-search`} />

        <InputField
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type="text"
          isPasswordVisible={false}
          isFocused={isFocused}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          inputStyle={styles.input}
          textColor={colors.textPrimaryNeutral}
          cursorColor={colors.actionBrandText}
          selectionColor={colors.actionBrandText}
          textInputProps={mergedTextInputProps}
        />

        {showCompactClear && (
          <InputAdornment
            iconName="deleteText"
            size={20}
            position="suffix"
            onPress={handleCancel}
            disabled={disabled}
            color={disabled ? colors.textQuaternaryNeutral : colors.carbon400}
            style={styles.compactClearAdornment}
            testID={`${testID}-clear`}
            accessibilityLabel="Clear search"
          />
        )}

        {showCancel && (
          <Pressable
            onPress={handleCancel}
            disabled={disabled}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={cancelAccessibilityLabel ?? cancelLabel}
            accessibilityState={{ disabled }}
            style={styles.cancelPressable}
            testID={`${testID}-cancel`}
          >
            <EtText variant="body-base-medium" style={{ color: disabled ? colors.textQuaternaryNeutral : colors.textPrimaryNeutral }}>
              {cancelLabel}
            </EtText>
          </Pressable>
        )}
      </>
    );

    if (isLiquidGlass) {
      return (
        <LiquidGlassContext.Provider value={glassContextValue}>
          <View
            style={[styles.glassOuterBase, isCompact ? styles.glassOuterCompact : styles.glassOuterInput, style]}
            testID={testID}
            accessible={true}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
          >
            <EtGlassView
              glassEffectStyle="regular"
              tintColor={containerBackgroundColor}
              fallbackStyle={{ backgroundColor: containerBackgroundColor }}
              style={[styles.glassFieldBase, styles.row, isCompact ? styles.glassFieldCompact : styles.glassFieldInput, containerStyle]}
            >
              {inputContent}
            </EtGlassView>
          </View>
        </LiquidGlassContext.Provider>
      );
    }

    return (
      <View
        style={[styles.outerBase, isCompact ? styles.outerCompact : styles.outerInput, solidContainerStyle, style]}
        testID={testID}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <View style={[styles.row, containerStyle]}>{inputContent}</View>
      </View>
    );
  },
);

EtSearchInput.displayName = 'EtSearchInput';

const styles = StyleSheet.create({
  outerBase: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
  },
  outerInput: {
    height: 64,
    borderRadius: X3,
    paddingHorizontal: 12,
  },
  outerCompact: {
    height: 44,
    borderRadius: 999,
    paddingHorizontal: 14,
  },
  glassOuterBase: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  glassOuterInput: {
    height: 64,
    borderRadius: X3,
  },
  glassOuterCompact: {
    height: 44,
    borderRadius: 999,
  },
  glassFieldBase: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    margin: BORDER_WIDTH,
  },
  glassFieldInput: {
    borderRadius: X3 - BORDER_WIDTH,
    paddingHorizontal: 12,
  },
  glassFieldCompact: {
    borderRadius: 999,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
  },
  adornment: {
    paddingBottom: 0,
    justifyContent: 'center',
  },
  cancelPressable: {
    justifyContent: 'center',
    paddingLeft: 4,
  },
  compactClearAdornment: {
    paddingLeft: 8,
  },
});
