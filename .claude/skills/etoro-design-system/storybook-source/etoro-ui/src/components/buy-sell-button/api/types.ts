import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

/**
 * Button type - determines the letter shown (B or S) and default color scheme
 */
export type BuySellButtonType = 'buy' | 'sell';

/**
 * Button size options
 */
export type BuySellButtonSize = 'tiny' | 'small' | 'medium' | 'large';

/**
 * Size configuration for each button size
 */
export interface SizeConfig {
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  gap: number;
}

/**
 * Resolved visual state of the button
 */
export type ButtonVisualState =
  | 'default'
  | 'pressed'
  | 'oneClickTrading'
  | 'oneClickTradingPressed'
  | 'positiveIndication'
  | 'negativeIndication'
  | 'disabled';

/**
 * Main EtBuySellButton props
 *
 * Props are organized into the following groups:
 *
 * **Required Props:**
 * - `type` - Button type ('buy' or 'sell')
 * - `price` - Price value to display
 *
 * **State Props:**
 * - `disabled` - Disabled state (default: false)
 * - `oneClickTrading` - One-click trading mode (default: false)
 *
 * **Appearance Props:**
 * - `size` - Button size (default: 'medium')
 * - `positiveIndication` - Green filled style for price increase (default: false)
 * - `negativeIndication` - Red filled style for price decrease (default: false)
 *
 * **Interaction Props:**
 * - `haptics` - Enable haptic feedback on press (default: true)
 * - `style` - Container style override
 *
 * **Accessibility Props:**
 * - `testID` - Test identifier for e2e testing
 * - `accessibilityLabel` - Custom accessibility label (auto-generated if not provided)
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
export interface EtBuySellButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  // ─────────────────────────────────────────────────────────────────────────────
  // Required Props
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Button type - determines the letter shown (B or S) and default color scheme.
   * - 'buy': Shows "B" with green accent color
   * - 'sell': Shows "S" with red accent color
   */
  type: BuySellButtonType;

  /**
   * Price to display in the button.
   * Automatically formatted with 2 decimal places (e.g., 11756.62).
   * Pass raw numeric value, not pre-formatted string.
   */
  price: number;

  // ─────────────────────────────────────────────────────────────────────────────
  // State Props
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Disabled state - prevents interaction and shows muted styling.
   * Takes highest priority over all other visual states.
   * @default false
   */
  disabled?: boolean;

  /**
   * One-click trading mode - shows dark gray filled style.
   * Used when user has enabled quick trading without confirmation.
   * @default false
   */
  oneClickTrading?: boolean;

  // ─────────────────────────────────────────────────────────────────────────────
  // Appearance Props
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Button size - affects padding, font sizes, and border radius.
   * Available sizes: 'tiny', 'small', 'medium', 'large'
   * @default 'medium'
   */
  size?: BuySellButtonSize;

  /**
   * Positive price indication - green filled style.
   * Use to indicate price has increased. Takes priority over oneClickTrading.
   * Should not be used simultaneously with negativeIndication.
   * @default false
   */
  positiveIndication?: boolean;

  /**
   * Negative price indication - red filled style.
   * Use to indicate price has decreased. Takes priority over oneClickTrading.
   * Should not be used simultaneously with positiveIndication.
   * @default false
   */
  negativeIndication?: boolean;

  // ─────────────────────────────────────────────────────────────────────────────
  // Interaction Props
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Enable haptic feedback on press.
   * Provides tactile response when user taps the button.
   * @default true
   */
  haptics?: boolean;

  /**
   * Container style override.
   * Use for layout adjustments (margins, positioning).
   * Avoid overriding internal styles (colors, padding).
   */
  style?: StyleProp<ViewStyle>;

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility Props
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Test ID for e2e testing.
   * Used to locate the button in automated tests.
   */
  testID?: string;

  /**
   * Custom accessibility label for screen readers.
   * If not provided, auto-generates: "Buy at {price}" or "Sell at {price}"
   */
  accessibilityLabel?: string;
}
