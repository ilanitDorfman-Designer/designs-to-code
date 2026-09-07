// ==============================================
// EtAnimatedCount API Types
// ==============================================

import type { StyleProp, TextStyle } from 'react-native';
import type { WithSpringConfig } from 'react-native-reanimated';

import type { FontWeightKey } from '../../text/utils/font-mapping';
import type { TextVariant } from '../../text/utils/variant-config';

/**
 * How digit identity is anchored across value changes.
 * - `'decimal'`: anchored to the decimal point (odometer for live-updating magnitudes).
 * - `'leading'`: anchored to the left/typed order (existing digits stay, new digits enter on the right).
 */
export type DigitAnchor = 'decimal' | 'leading';

/**
 * Main props interface for EtAnimatedCount component
 */
export interface EtAnimatedCountProps {
  /** The number to display - supports both numbers and formatted strings */
  number: number | string;
  /** Height of each digit (default: 55) */
  textDigitHeight?: number;
  /** Width of each digit (default: 40) */
  textDigitWidth?: number;
  /** Font size (default: 50) */
  fontSize?: number;
  /** Text variant for typography (default: 'num-xxl') */
  variant?: TextVariant;
  /** Font weight for digits and characters (default: 'semiBold') */
  weight?: FontWeightKey;
  /** Text color (defaults to theme color) */
  color?: string;
  /** Locale used to format raw numeric values. Defaults to the active app locale, with RTL locales formatted as 'en-US'. */
  locale?: string;
  /** Spacing between characters in pixels (default: 0) */
  characterSpacing?: number;
  /** Disable animations and show static digits (useful for focus/scrubbing modes) */
  disableAnimation?: boolean;
  /** Whether the rendered text should scale with OS accessibility text size */
  allowFontScaling?: boolean;
  /** Maximum Dynamic Type multiplier applied to internal text nodes */
  maxFontSizeMultiplier?: number | null;
  /** Custom spring configuration for digit animations */
  springConfig?: WithSpringConfig;
  /** Digit identity model (default: 'decimal'). Use 'leading' for left-to-right typed input. */
  digitAnchor?: DigitAnchor;
  /** Explicit line height for the digit text. Defaults to the variant line height when omitted. */
  lineHeight?: number;
}

/**
 * Props for individual animated digit components
 */
export interface AnimatedDigitProps {
  digit: number;
  height: number;
  width: number;
  textStyle: StyleProp<TextStyle>;
  variant?: TextVariant;
  weight?: FontWeightKey;
  characterSpacing?: number;
  allowFontScaling?: boolean;
  maxFontSizeMultiplier?: number | null;
  springConfig?: WithSpringConfig;
  /** When true, the slot fades in/out as the value's length changes (added/removed digits). */
  animateLengthChanges?: boolean;
  /** When true (leading anchor), a newly added digit rolls in from a blank slot instead of fading. */
  enterFromBlank?: boolean;
  /** True only for the trailing digit slot; the newly typed digit rolls in from blank, others appear in place. */
  isLastDigit?: boolean;
}

/**
 * Props for static character components (commas, periods, etc.)
 */
export interface StaticCharacterProps {
  char: string;
  height: number;
  width: number;
  textStyle: StyleProp<TextStyle>;
  variant?: TextVariant;
  weight?: FontWeightKey;
  characterSpacing?: number;
  allowFontScaling?: boolean;
  maxFontSizeMultiplier?: number | null;
  /** When true, the character fades in/out as the value's length changes (added/removed groups). */
  animateLengthChanges?: boolean;
}

/**
 * Parsed character data structure
 */
export interface ParsedCharacter {
  char: string;
  isDigit: boolean;
  digit: number;
  /** Stable position relative to the decimal point (units = 1, tens = 2, decimal point = 0, first fractional = -1). */
  place: number;
}

/**
 * Internal processed props after applying defaults
 */
export interface ProcessedAnimatedCountProps {
  number: number | string;
  textDigitHeight: number;
  textDigitWidth: number;
  fontSize: number;
  variant?: TextVariant;
  weight: FontWeightKey;
  color?: string;
  locale: string;
  characterSpacing: number;
  allowFontScaling: boolean;
  maxFontSizeMultiplier?: number | null;
  springConfig?: WithSpringConfig;
  lineHeight?: number;
}
