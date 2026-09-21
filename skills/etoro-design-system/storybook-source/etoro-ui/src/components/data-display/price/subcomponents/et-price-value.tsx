import type { StyleProp, TextStyle } from 'react-native';

import type { TextVariant } from '../../../../foundations/text/utils/variant-config';
import { EtNumber } from '../../number/et-number';
import { useEtPriceContext } from '../context';
import { resolvePriceDecimalBounds } from '../utils';

type Props = {
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
  testID?: string;
};

/**
 * EtPrice.Value - Renders the main price.
 *
 * Precision comes from `EtPrice`'s `decimals` when the caller passes the instrument's real quote
 * precision. Otherwise it falls back to the magnitude rule:
 * - Values in (0, 1) exclusive: up to 5 decimal places (trailing zeros stripped).
 * - All other values (including 0 and >= 1): up to 2 decimal places (trailing zeros stripped).
 *
 * Uses num-ml typography, neutral color.
 * Renders nothing when price is undefined or non-finite.
 */
export function EtPriceValue({ style, variant = 'num-ml', testID }: Props) {
  const { price, decimals } = useEtPriceContext();

  if (price === undefined || !Number.isFinite(price)) return null;

  const { minDecimals, maxDecimals } = resolvePriceDecimalBounds({ price, decimals });

  return (
    <EtNumber value={price} format="number" useGrouping={false} minDecimals={minDecimals} maxDecimals={maxDecimals}>
      <EtNumber.Value variant={variant} style={style} testID={testID} />
    </EtNumber>
  );
}

EtPriceValue.displayName = 'EtPrice.Value';
