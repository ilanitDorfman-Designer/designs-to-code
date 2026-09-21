import type { ComponentProps } from 'react';
import { Text } from 'react-native';
import { ComplexAnimationBuilder } from 'react-native-reanimated';

import { FontWeightKey } from '../utils';
import { TextVariant } from '../utils/variant-config';

export interface TextAnimationConfig {
  /** Reanimated entering animation */
  entering?: ComplexAnimationBuilder;
  /** Reanimated exiting animation */
  exiting?: ComplexAnimationBuilder;
}

// Flattened version of the Text component props, see: https://etoro-jira.atlassian.net/browse/BS-398
export interface EtTextProps extends ComponentProps<typeof Text> {
  /** Typography variant */
  variant?: TextVariant;

  /** Font weight override (takes precedence over style.fontWeight and variant default) */
  weight?: FontWeightKey;

  /** Reanimated entering animation (non-standard) */
  entering?: ComplexAnimationBuilder;
  /** Reanimated exiting animation (non-standard) */
  exiting?: ComplexAnimationBuilder;

  /**
   * When true, renders single-line text that shrinks to fit the container width.
   * iOS uses `adjustsFontSizeToFit`; Android steps `fontSize` down via `onTextLayout`.
   */
  shrinkToFit?: boolean;
  /** Lower bound for shrink scale, relative to the variant size. Used when `shrinkToFit` is true. */
  minimumFontScale?: number;
  /** Android shrink step per overflow pass. Used when `shrinkToFit` is true. */
  scaleStep?: number;
}
