import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import type { GestureResponderEvent } from 'react-native';

import type { BuySellButtonType } from '../api';
import { formatPrice } from '../utils';

export interface UseBuySellButtonInteractionParams {
  type: BuySellButtonType;
  price: number;
  accessibilityLabel?: string;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  haptics: boolean;
}

export interface UseBuySellButtonInteractionReturn {
  /** Press handler with haptic feedback */
  handlePress: (event: GestureResponderEvent) => void;
  /** Resolved accessibility label (auto-generated if not provided) */
  accessibilityLabel: string;
  /** Price formatted with 2 decimal places */
  formattedPrice: string;
}

/**
 * Handles interaction concerns for EtBuySellButton:
 * - Press handling with optional haptic feedback
 * - Accessibility label resolution
 * - Price formatting
 */
export function useBuySellButtonInteraction({
  type,
  price,
  accessibilityLabel,
  onPress,
  haptics,
}: UseBuySellButtonInteractionParams): UseBuySellButtonInteractionReturn {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress?.(event);
    },
    [haptics, onPress],
  );

  const formattedPrice = formatPrice(price);

  const resolvedAccessibilityLabel = accessibilityLabel ?? `${type === 'buy' ? 'Buy' : 'Sell'} at ${formattedPrice}`;

  return {
    handlePress,
    accessibilityLabel: resolvedAccessibilityLabel,
    formattedPrice,
  };
}
