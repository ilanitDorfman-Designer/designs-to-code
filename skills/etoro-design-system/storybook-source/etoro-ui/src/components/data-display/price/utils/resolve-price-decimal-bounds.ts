/** Decimal bounds handed to `EtNumber` by `EtPrice.Value` and `EtPrice.Change`. */
export type PriceDecimalBounds = {
  minDecimals: number;
  maxDecimals: number;
};

type Args = {
  /** Price the bounds are derived from — the change follows the price's magnitude, not its own. */
  price: number;
  /** Caller-supplied fixed decimals (see `EtPriceProps.decimals`). */
  decimals?: number;
};

/**
 * Resolves the decimal bounds for a price and its absolute change.
 *
 * Caller-supplied `decimals` wins and pins the digit count (min = max), so trailing zeros are kept —
 * `1.15650` rather than `1.1565`. With no override, falls back to the built-in magnitude rule: up to
 * 5 decimals below $1, up to 2 otherwise. That fallback is a heuristic and renders above-dollar
 * fine-tick instruments (forex) as `1.16`, which is why callers that know the instrument's real
 * precision should pass it.
 *
 * A non-finite `decimals` is ignored so external metadata can't break a render.
 *
 * @param args - {@link Args}
 * @returns Bounds passed straight to `EtNumber`'s `minDecimals` / `maxDecimals`
 */
export function resolvePriceDecimalBounds({ price, decimals }: Args): PriceDecimalBounds {
  if (decimals != null && Number.isFinite(decimals)) {
    const fixed = Math.max(0, Math.floor(decimals));
    return { minDecimals: fixed, maxDecimals: fixed };
  }

  return { minDecimals: 0, maxDecimals: price > 0 && price < 1 ? 5 : 2 };
}
