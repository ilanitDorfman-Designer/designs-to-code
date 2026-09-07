import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EtText } from '../../foundations/text';
import type { TextVariant } from '../../foundations/text/utils/variant-config';
import type { BuySellButtonSize, EtBuySellButtonProps } from './api';
import { useBuySellButtonConfig, useBuySellButtonInteraction } from './hooks';
import { DIVIDER_HEIGHT, DIVIDER_WIDTH } from './utils';

/**
 * Text variant mapping for letter (B/S) based on button size
 */
const LETTER_VARIANTS: Record<BuySellButtonSize, TextVariant> = {
  tiny: 'label-tertiary-semibold',
  small: 'label-secondary-semibold',
  medium: 'label-primary-semibold',
  large: 'heading-base',
};

/**
 * Text variant mapping for price based on button size
 */
const PRICE_VARIANTS: Record<BuySellButtonSize, TextVariant> = {
  tiny: 'num-xs',
  small: 'num-s',
  medium: 'num-sm',
  large: 'num-md',
};

/**
 * EtBuySellButton - A specialized button for buy/sell trading actions
 *
 * Displays a letter (B/S), divider ("|"), and price in a unified pill-shaped button.
 *
 * @example Default buy button
 * ```tsx
 * <EtBuySellButton type="buy" price={11756.62} onPress={handleBuy} />
 * ```
 *
 * @example One-click trading mode
 * ```tsx
 * <EtBuySellButton type="sell" price={11756.62} oneClickTrading onPress={handleSell} />
 * ```
 *
 * @example Positive indication
 * ```tsx
 * <EtBuySellButton type="buy" price={11756.62} positiveIndication onPress={handleBuy} />
 * ```
 */
function EtBuySellButtonBase({
  type,
  price,
  size = 'medium',
  oneClickTrading = false,
  positiveIndication = false,
  negativeIndication = false,
  disabled = false,
  haptics = true,
  style,
  testID,
  accessibilityLabel,
  onPress,
  ...pressableProps
}: EtBuySellButtonProps) {
  const {
    handlePress,
    accessibilityLabel: resolvedAccessibilityLabel,
    formattedPrice,
  } = useBuySellButtonInteraction({
    type,
    price,
    accessibilityLabel,
    onPress,
    haptics,
  });

  return (
    <Pressable
      style={[styles.pressable, style]}
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
      {...pressableProps}
      accessibilityRole="button"
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => (
        <ButtonContent
          type={type}
          formattedPrice={formattedPrice}
          size={size}
          disabled={disabled}
          oneClickTrading={oneClickTrading}
          positiveIndication={positiveIndication}
          negativeIndication={negativeIndication}
          pressed={pressed}
        />
      )}
    </Pressable>
  );
}

/**
 * Inner component that renders button content with state-based styling
 */
interface ButtonContentProps {
  type: EtBuySellButtonProps['type'];
  formattedPrice: string;
  size: NonNullable<EtBuySellButtonProps['size']>;
  disabled: boolean;
  oneClickTrading: boolean;
  positiveIndication: boolean;
  negativeIndication: boolean;
  pressed: boolean;
}

const ButtonContent = memo(function ButtonContent({
  type,
  formattedPrice,
  size,
  disabled,
  oneClickTrading,
  positiveIndication,
  negativeIndication,
  pressed,
}: ButtonContentProps) {
  const { sizeConfig, stateStyles, letter } = useBuySellButtonConfig({
    type,
    size,
    disabled,
    oneClickTrading,
    positiveIndication,
    negativeIndication,
    pressed,
  });

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: sizeConfig.borderRadius,
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          backgroundColor: stateStyles.backgroundColor,
          borderWidth: stateStyles.borderWidth,
          borderColor: stateStyles.borderColor,
          gap: sizeConfig.gap,
        },
      ]}
    >
      {/* Letter (B or S) */}
      <EtText variant={LETTER_VARIANTS[size]} style={{ color: stateStyles.letterColor }}>
        {letter}
      </EtText>

      {/* Divider */}
      <View
        style={{
          width: DIVIDER_WIDTH,
          height: DIVIDER_HEIGHT,
          backgroundColor: stateStyles.dividerColor,
        }}
      />

      {/* Price */}
      <EtText variant={PRICE_VARIANTS[size]} style={[styles.price, { color: stateStyles.priceColor }]} numberOfLines={1}>
        {formattedPrice}
      </EtText>
    </View>
  );
});

export const EtBuySellButton = Object.assign(memo(EtBuySellButtonBase), {
  displayName: 'EtBuySellButton',
});

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {},
});
