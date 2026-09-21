// ==============================================
// Props Initialization Utilities
// ==============================================

import { StyleProp, TextStyle } from 'react-native';

import type { EtAnimatedCountProps, ProcessedAnimatedCountProps } from '../api';
import { ANIMATED_COUNT_DEFAULTS } from '../constants';

/**
 * Calculate digit dimensions based on font size
 * Uses a ratio derived from the default values (height ~1.1x fontSize, width ~0.8x fontSize)
 */
function calculateDimensionsFromFontSize(fontSize: number) {
  // Ratio based on defaults: height 55 / fontSize 50 = 1.1, width 40 / fontSize 50 = 0.8
  const heightRatio = 1.1;
  const widthRatio = 0.65; // Slightly tighter for better visual density

  return {
    height: Math.round(fontSize * heightRatio),
    width: Math.round(fontSize * widthRatio),
  };
}

/**
 * Initializes and processes EtAnimatedCount props with default values
 *
 * @param props - Input props from component usage
 * @param fallbackLocale - Locale used when props.locale is not provided
 * @returns Processed props with all defaults applied
 */
export function initProps(props: EtAnimatedCountProps, fallbackLocale: string = ANIMATED_COUNT_DEFAULTS.LOCALE): ProcessedAnimatedCountProps {
  const fontSize = props.fontSize ?? ANIMATED_COUNT_DEFAULTS.FONT_SIZE;

  // Calculate dynamic dimensions if not explicitly provided
  const dynamicDimensions = calculateDimensionsFromFontSize(fontSize);

  return {
    number: props.number,
    textDigitHeight: props.textDigitHeight ?? dynamicDimensions.height,
    textDigitWidth: props.textDigitWidth ?? dynamicDimensions.width,
    fontSize,
    variant: props.variant ?? 'num-xxl',
    weight: props.weight ?? 'semiBold',
    color: props.color,
    locale: props.locale ?? fallbackLocale,
    characterSpacing: props.characterSpacing ?? ANIMATED_COUNT_DEFAULTS.CHARACTER_SPACING,
    allowFontScaling: props.allowFontScaling ?? true,
    maxFontSizeMultiplier: props.maxFontSizeMultiplier,
    springConfig: props.springConfig,
    lineHeight: props.lineHeight,
  };
}

/**
 * Creates common props object for both animated digits and static characters
 *
 * @param processedProps - Processed props from initProps
 * @param textStyle - Resolved text style applied to each character
 * @param animateLengthChanges - When true, slots fade in/out as the value's length changes
 * @param enterFromBlank - When true, a newly added digit rolls in from a blank slot (leading anchor)
 * @returns Common props object
 */
export function createCommonProps(
  processedProps: ProcessedAnimatedCountProps,
  textStyle: StyleProp<TextStyle>,
  animateLengthChanges = false,
  enterFromBlank = false,
) {
  return {
    height: processedProps.textDigitHeight,
    width: processedProps.textDigitWidth,
    textStyle,
    variant: processedProps.variant,
    weight: processedProps.weight,
    characterSpacing: processedProps.characterSpacing,
    allowFontScaling: processedProps.allowFontScaling,
    maxFontSizeMultiplier: processedProps.maxFontSizeMultiplier,
    springConfig: processedProps.springConfig,
    animateLengthChanges,
    enterFromBlank,
  };
}
