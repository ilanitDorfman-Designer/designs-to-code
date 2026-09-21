// ==============================================
// EtAmountInputDisplay Constants (non-animation)
// ==============================================

import type { DigitAnchor } from '../../../foundations/animated-digits';
import type { FontWeightKey } from '../../../foundations/text/utils';

/** Defaults reproduce the trade execution hero so the props path looks right with zero styling. */
export const DEFAULT_FONT_SIZE = 60;
export const DEFAULT_DIGIT_WIDTH = 35;
export const DEFAULT_DIGIT_HEIGHT = 72;
export const DEFAULT_AFFIX_FONT_SIZE = 32;
/** Currency symbol runs a touch larger than the unit affix so the "$" reads as part of the hero. */
export const DEFAULT_CURRENCY_FONT_SIZE = 40;
export const DEFAULT_WEIGHT: FontWeightKey = 'semiBold';
export const DEFAULT_DIGIT_ANCHOR: DigitAnchor = 'leading';
