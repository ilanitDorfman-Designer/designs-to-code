import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import type { DigitAnchor } from '../../../../foundations/animated-digits';
import type { FontWeightKey } from '../../../../foundations/text/utils';

/**
 * Public props for `EtAmountInputDisplay`.
 *
 * Two ways to use it:
 * - Props (plug and play): pass `value` + optional `currencySymbol`/`unitLabel` and the component
 *   renders + measures + auto-scales the whole row for you.
 * - Compound: pass `EtAmountInputDisplay.Currency` / `.Value` / `.Caret` / `.Unit` children for full
 *   control over arrangement and per-part styling. When children are present they win.
 */
export interface EtAmountInputDisplayProps {
  /** Formatted value string that drives the number and the auto-scale (e.g. "1,234.56"). */
  value: string;
  /** Leading currency symbol (props path only). */
  currencySymbol?: string;
  /** Trailing unit label, e.g. "Shares"/"Units" (props path only). */
  unitLabel?: string;
  /** Blinking caret after the number (props path only). */
  showCursor?: boolean;
  /** Monotonic counter; each increment plays a horizontal error shake. */
  shakeTrigger?: number;
  /** Progressive + fit-to-width shrink of the whole row. Default true. */
  autoScale?: boolean;

  /** Hero number font size. Default 60. */
  fontSize?: number;
  /** Digit slot width fed to `EtAnimatedCount` and the scale math. Default 35. */
  digitWidth?: number;
  /** Digit slot height fed to `EtAnimatedCount`. Default 72. */
  digitHeight?: number;
  /** Unit affix font size. Default 32. */
  affixFontSize?: number;
  /** Currency symbol font size. Default 40 (a touch larger than the unit affix). */
  currencyFontSize?: number;
  /** Digit + affix font weight. Default 'semiBold'. */
  weight?: FontWeightKey;
  /** Digit identity model. Default 'leading' (typed left-to-right entry). */
  digitAnchor?: DigitAnchor;

  /** Number color. Defaults to theme `textPrimaryNeutral`. */
  numberColor?: string;
  /** Unit color. Defaults to theme `textSecondaryNeutral`. */
  affixColor?: string;
  /** Currency symbol color. Defaults to theme `carbon300`. */
  currencyColor?: string;
  /** Caret color. Defaults to theme `statusPositive`. */
  caretColor?: string;

  /** Digit count above which the progressive shrink begins. Default 5. */
  shrinkStartDigits?: number;
  /** Scale removed per digit beyond the threshold. Default 0.08. */
  shrinkStepPerDigit?: number;
  /** Floor for the progressive term. Default 0.5. */
  progressiveMinScale?: number;
  /** Floor for the overflow guard. Default 0.3. */
  overflowMinScale?: number;

  /** Compound children. When provided, the props arrangement is ignored. */
  children?: ReactNode;
  testID?: string;
}

/** Shared props for the measured affix subcomponents (`Currency`, `Unit`). */
export interface AmountInputDisplayAffixProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}
