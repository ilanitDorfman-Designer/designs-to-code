import * as Haptics from 'expo-haptics';
import { Children, isValidElement, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../core/hooks/use-etoro-theme';
import { X1 } from '../../core/styles/spacing';
import { EtoroIcon } from '../../foundations/icon-assets/et-icon';
import type { EtLinkProps, LinkContextValue, LinkIconPosition } from './api/types';
import { useLinkAnimation } from './hooks';
import { LinkIcon, LinkLabel } from './subcomponents';
import { LinkContext } from './utils/context';
import { getComputedColors, getVariantStyles, ICON_SIZES } from './utils/styles';

/**
 * EtLink - A link-style button component without background/border
 *
 * Use this component for inline text links or actions that should appear
 * as text links rather than traditional buttons.
 *
 * @example Basic usage with string shorthand
 * ```tsx
 * <EtLink onPress={handlePress}>Learn more</EtLink>
 * ```
 *
 * @example With subcomponents
 * ```tsx
 * <EtLink onPress={handlePress}>
 *   <EtLink.Label>View details</EtLink.Label>
 *   <EtLink.Icon name="chevronRight" />
 * </EtLink>
 * ```
 *
 * @example With icon on the left (order matters)
 * ```tsx
 * <EtLink onPress={handlePress} variant="info">
 *   <EtLink.Icon name="share" />
 *   <EtLink.Label>Open in browser</EtLink.Label>
 * </EtLink>
 * ```
 *
 * @example With loading state (loader on the side)
 * ```tsx
 * <EtLink loading={isSubmitting} onPress={handleSubmit}>
 *   Submit
 * </EtLink>
 * ```
 */
function EtLinkRoot({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  style,
  haptics = true,
  animateOnPress = false,
  onPress,
  ...pressableProps
}: EtLinkProps) {
  const { colors } = useEtoroTheme();

  const variantStyles = getVariantStyles(colors, variant);
  const iconSize = ICON_SIZES[size];

  // Animation for scale on press (opt-out via animateOnPress)
  const { animatedStyle, handlePressIn, handlePressOut } = useLinkAnimation();

  // Handle press with haptics (no-op when disabled or loading)
  const handlePress = useCallback(
    (event: Parameters<NonNullable<typeof onPress>>[0]) => {
      if (!disabled && !loading) {
        if (haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress?.(event);
      }
    },
    [onPress, disabled, loading, haptics],
  );

  // Process children and detect icon position
  const { processedChildren, iconPosition } = useMemo(() => {
    const childArray = Children.toArray(children);

    // Validate children are only string, EtLink.Label, or EtLink.Icon.
    // Use displayName as fallback so validation works across HMR / different module instances.
    const isLabel = (type: unknown) => type === LinkLabel || (type && (type as { displayName?: string }).displayName === 'EtLink.Label');
    const isIcon = (type: unknown) => type === LinkIcon || (type && (type as { displayName?: string }).displayName === 'EtLink.Icon');

    // Warn in dev only; never throw during render (avoids error boundary issues).
    if (__DEV__) {
      childArray.forEach((child) => {
        if (child == null || typeof child === 'boolean' || typeof child === 'string') return;
        if (isValidElement(child) && (isLabel(child.type) || isIcon(child.type))) {
          return;
        }
        console.error('EtLink: Invalid child passed. Only string, <EtLink.Label>, or <EtLink.Icon> are valid children.');
      });
    }

    // Detect icon position based on children order (use isIcon for HMR-safe check)
    let detectedIconPosition: LinkIconPosition = 'none';
    const iconIndex = childArray.findIndex((child) => isValidElement(child) && isIcon(child.type));

    if (iconIndex !== -1) {
      // Icon is first child = leading, otherwise = trailing
      detectedIconPosition = iconIndex === 0 ? 'leading' : 'trailing';
    }

    // Map children: wrap any raw strings in LinkLabel
    const mappedChildren = childArray.map((child, index) => {
      if (typeof child === 'string') {
        return <LinkLabel key={index}>{child}</LinkLabel>;
      }
      return child;
    });

    return { processedChildren: mappedChildren, iconPosition: detectedIconPosition };
  }, [children]);

  // Context value for subcomponents - stable closure; pressed is passed by Pressable render prop
  const createContextValue = useCallback(
    (pressed: boolean): LinkContextValue => {
      const computedColors = getComputedColors(variantStyles, pressed, disabled);
      return {
        variant,
        size,
        iconPosition,
        loading,
        pressed,
        textColor: computedColors.textColor,
        iconColor: computedColors.iconColor,
        iconSize,
      };
    },
    [variantStyles, disabled, variant, size, iconPosition, loading, iconSize],
  );

  // Loader on the side: follows iconPosition when present; when no icon, use start (left in LTR, right in RTL)
  const loaderPosition = iconPosition === 'leading' ? 'leading' : iconPosition === 'trailing' ? 'trailing' : 'leading'; // none -> start side (left in LTR; in RTL flex flips so first child is on the right)
  const loaderMarginStyle = loaderPosition === 'leading' ? styles.loaderLeading : styles.loaderTrailing;
  const loaderColor = getComputedColors(variantStyles, false, disabled).iconColor;

  return (
    <Animated.View style={[animateOnPress && animatedStyle, style]}>
      <Pressable
        style={[styles.link, disabled && styles.disabled]}
        disabled={disabled || loading}
        onPress={handlePress}
        onPressIn={disabled || loading || !animateOnPress ? undefined : handlePressIn}
        onPressOut={disabled || loading || !animateOnPress ? undefined : handlePressOut}
        testID={pressableProps.testID}
        accessibilityRole="link"
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        {...pressableProps}
      >
        {({ pressed }) => (
          <LinkContext.Provider value={createContextValue(pressed)}>
            <View style={styles.content}>
              {loading && loaderPosition === 'leading' && (
                <View style={[styles.loaderWrap, loaderMarginStyle]}>
                  <EtoroIcon icon={{ iconName: 'loader' }} appearance={{ size: iconSize, color: loaderColor }} />
                </View>
              )}
              {processedChildren}
              {loading && loaderPosition === 'trailing' && (
                <View style={[styles.loaderWrap, loaderMarginStyle]}>
                  <EtoroIcon icon={{ iconName: 'loader' }} appearance={{ size: iconSize, color: loaderColor }} />
                </View>
              )}
            </View>
          </LinkContext.Provider>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * EtLink with compound components attached
 */
export const EtLink = Object.assign(EtLinkRoot, {
  Label: LinkLabel,
  Icon: LinkIcon,
});

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 1, // Opacity is handled by color change, not view opacity
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Gap between icon and label is provided by LinkIcon margin (iconPosition)
  },
  loaderWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderLeading: {
    marginEnd: X1,
  },
  loaderTrailing: {
    marginStart: X1,
  },
});
