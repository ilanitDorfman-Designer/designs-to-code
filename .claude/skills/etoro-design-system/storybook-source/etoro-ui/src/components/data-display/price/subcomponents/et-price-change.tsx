import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1 } from '../../../../core/styles/spacing';
import { TextVariant } from '../../../../foundations/text/utils';
import { EtNumber } from '../../number/et-number';
import { useEtPriceContext } from '../context';
import { resolvePriceDecimalBounds } from '../utils';

type Props = {
  variant?: TextVariant;
  style?: StyleProp<ViewStyle>;
  /**
   * Render only the relative (percentage) change — drops the absolute change and the
   * surrounding parentheses, e.g. `+0.86%`. The color logic is unchanged.
   */
  percentageOnly?: boolean;
  /**
   * When true, use theme-independent Static verdict tokens (`verdict*600Static`) so
   * gains/losses stay readable on light / bright surfaces (e.g. MediaCard `variant="bright"`).
   *
   * Default theme tokens flip in dark mode to a neon green/red meant for dark UIs;
   * those wash out on white card footers — Static keeps the deeper `#0EB12E` / `#D12515`.
   */
  onBrightSurface?: boolean;
  /**
   * Force a single text colour for both the absolute and percentage change,
   * bypassing the green/red verdict tokens. Use where the surface only allows its
   * own foreground colour (e.g. the MediaCard glass footer, which forbids
   * red/green). Takes precedence over {@link onBrightSurface}.
   */
  color?: string;
};

/**
 * EtPrice.Change - Renders the absolute change and percentage as two adjacent EtNumber instances.
 * e.g. `0.96 (+0.86%)` or `-0.96 (-0.86%)`. With `percentageOnly`, only the relative change is
 * shown (e.g. `+0.86%`, no absolute value or parentheses).
 * Color: green for positive/zero change, red for negative by default.
 * - Default: theme-aware `verdictPositive600` / `verdictNegative600` (neon in dark mode).
 * - `onBrightSurface`: Static `*600Static` tokens for contrast on light card surfaces.
 * - `color`: forces a single colour for both absolute and percentage (bypasses verdict tokens).
 * Renders nothing when change is undefined or non-finite.
 *
 * Decimal precision for the absolute change follows the PRICE, not the change magnitude — it comes
 * from `EtPrice`'s `decimals` when supplied, otherwise from the price-magnitude rule:
 * - price in (0, 1) exclusive: up to 5 decimal places (trailing zeros stripped).
 * - All other prices (including 0 and >= 1): up to 2 decimal places (trailing zeros stripped).
 *
 * The percentage always renders at 2 decimals — it is a ratio, so the instrument's quote precision
 * does not apply to it.
 */
export function EtPriceChange({ style, variant = 'num-s', percentageOnly = false, onBrightSurface = false, color: colorOverride }: Props) {
  const { price, change, changePercentage, decimals } = useEtPriceContext();
  const { colors } = useEtoroTheme();

  if (price === undefined || change === undefined || !Number.isFinite(price) || !Number.isFinite(change)) {
    return null;
  }

  const isPositive = change >= 0;
  // A forced `color` wins over the green/red verdict tokens (e.g. glass footer).
  const color = colorOverride ?? resolveChangeColor(isPositive, onBrightSurface, colors);
  const { minDecimals, maxDecimals } = resolvePriceDecimalBounds({ price, decimals });
  const validPct = changePercentage !== undefined && Number.isFinite(changePercentage) ? changePercentage : undefined;

  return (
    <View style={[styles.container, style]}>
      {!percentageOnly && (
        <EtNumber value={change} format="number" color={color} showAbsoluteValue minDecimals={minDecimals} maxDecimals={maxDecimals}>
          <EtNumber.Arrow />
          <EtNumber.Value variant={variant} />
        </EtNumber>
      )}
      {validPct !== undefined && (
        <EtNumber
          value={validPct / 100}
          format="percentage"
          color={color}
          showSign
          hasParentheses={!percentageOnly}
          style={percentageOnly ? undefined : styles.percentage}
        >
          <EtNumber.Value variant={variant} />
        </EtNumber>
      )}
    </View>
  );
}

EtPriceChange.displayName = 'EtPrice.Change';

/** Picks theme-aware or Static verdict tokens based on surface brightness. */
function resolveChangeColor(isPositive: boolean, onBrightSurface: boolean, colors: ReturnType<typeof useEtoroTheme>['colors']): string {
  if (onBrightSurface) {
    return isPositive ? colors.verdictPositive600Static : colors.verdictNegative600Static;
  }
  return isPositive ? colors.verdictPositive600 : colors.verdictNegative600;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    marginLeft: X1,
  },
});
