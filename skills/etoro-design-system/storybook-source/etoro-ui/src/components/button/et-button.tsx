import * as Haptics from 'expo-haptics';
import { Children, isValidElement, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks/use-etoro-theme';
import { eToroDarkColors, eToroLightColors } from '../../core/styles/colors';
import { X2 } from '../../core/styles/spacing';
import { ButtonIcon } from './subcomponents/button-icon';
import { ButtonIconV2 } from './subcomponents/button-icon-v2';
import { ButtonLabel } from './subcomponents/button-label';
import { ButtonContext } from './utils/context';
import { getComputedColors, getSizeConfig, getVariantStyles } from './utils/styles';
import type { ButtonContextValue, EtButtonProps } from './utils/types';

/**
 * EtButton - A compositional button component
 *
 * @example Basic usage with string shorthand
 * ```tsx
 * <EtButton onPress={handlePress}>Click me</EtButton>
 * ```
 *
 * @example With subcomponents
 * ```tsx
 * <EtButton onPress={handlePress} variant="primary" size="medium">
 *   <EtButton.Label>Continue</EtButton.Label>
 *   <EtButton.Icon name="chevronRight" />
 * </EtButton>
 * ```
 *
 * @example With icon on the left (order matters)
 * ```tsx
 * <EtButton onPress={handlePress}>
 *   <EtButton.Icon name="plus" />
 *   <EtButton.Label>Add Item</EtButton.Label>
 * </EtButton>
 * ```
 */
function EtButtonRoot({
  variant = 'primary-filled',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  style,
  haptics = true,
  stretch = false,
  forceColorScheme,
  onPress,
  ...pressableProps
}: EtButtonProps) {
  const theme = useEtoroTheme();

  // When a scheme is forced, resolve colors from that fixed palette so the button
  // renders consistently regardless of the active app theme. Otherwise follow the theme.
  const colors = forceColorScheme === 'dark' ? eToroDarkColors.colors : forceColorScheme === 'light' ? eToroLightColors.colors : theme.colors;

  const variantStyles = getVariantStyles(colors, variant);
  const sizeConfig = getSizeConfig(size);
  const computedColors = getComputedColors(variantStyles, disabled); // join variant+disabled styles

  // Handle press with haptics
  const handlePress = (event: Parameters<NonNullable<typeof onPress>>[0]) => {
    if (!disabled && !loading) {
      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress?.(event);
    }
  };

  // Process children - handle string shorthand
  const processedChildren = useMemo(() => {
    const childArray = Children.toArray(children);

    // Validate children are only string, EtButton.Label, EtButton.Icon, or EtButton.IconV2
    childArray.forEach((child) => {
      if (typeof child === 'string') return;
      if (isValidElement(child) && (child.type === ButtonLabel || child.type === ButtonIcon || child.type === ButtonIconV2)) {
        return;
      }
      throw new Error(`EtButton: Invalid child passed. Only string, <EtButton.Label>, <EtButton.Icon>, or <EtButton.IconV2> are valid children.`);
    });

    const normalizedChildren = childArray.map((child, index) =>
      typeof child === 'string' ? <ButtonLabel key={`label-${index}`}>{child}</ButtonLabel> : child,
    );

    // If loading with a single label child, replace it with a loader icon.
    if (loading && normalizedChildren.length === 1) {
      const onlyChild = normalizedChildren[0];
      if (isValidElement(onlyChild) && onlyChild.type === ButtonLabel) {
        return <ButtonIcon name="loader" />;
      }
    }

    return normalizedChildren;
  }, [children, loading]);

  // Context value for subcomponents - needs to be created per render for pressed state
  const createContextValue = (pressed: boolean): ButtonContextValue => ({
    variant,
    size,
    disabled,
    loading,
    pressed,
    textColor: pressed && !disabled ? computedColors.pressedTextColor : computedColors.textColor,
    iconColor: pressed && !disabled ? computedColors.pressedIconColor : computedColors.iconColor,
    iconSize: sizeConfig.iconSize,
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: sizeConfig.height,
          minWidth: sizeConfig.minWidth,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
          borderRadius: sizeConfig.borderRadius,
          backgroundColor: pressed && !disabled ? computedColors.pressedBackgroundColor : computedColors.backgroundColor,
        },
        stretch && styles.stretch,
        style,
      ]}
      disabled={disabled || loading}
      onPress={handlePress}
      testID={pressableProps.testID}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
      }}
      {...pressableProps}
    >
      {({ pressed }) => (
        <ButtonContext.Provider value={createContextValue(pressed)}>
          <View style={styles.content}>{processedChildren}</View>
        </ButtonContext.Provider>
      )}
    </Pressable>
  );
}

/**
 * EtButton with compound components attached
 */
export const EtButton = Object.assign(EtButtonRoot, {
  Label: ButtonLabel,
  /** @deprecated Use IconV2 instead. */
  Icon: ButtonIcon,
  IconV2: ButtonIconV2,
});

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: X2,
  },
});
