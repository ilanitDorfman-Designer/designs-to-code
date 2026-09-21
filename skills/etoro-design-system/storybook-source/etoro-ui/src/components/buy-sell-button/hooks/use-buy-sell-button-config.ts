import { useMemo } from 'react';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import type { BuySellButtonSize, BuySellButtonType, SizeConfig } from '../api';
import type { StateStyleConfig } from '../utils';
import { getSizeConfig, getStateStyles, resolveVisualState } from '../utils';

export interface UseBuySellButtonConfigParams {
  type?: BuySellButtonType;
  size?: BuySellButtonSize;
  disabled?: boolean;
  oneClickTrading?: boolean;
  positiveIndication?: boolean;
  negativeIndication?: boolean;
  pressed?: boolean;
}

export interface UseBuySellButtonConfigReturn {
  /** Size configuration */
  sizeConfig: SizeConfig;
  /** State-based style configuration */
  stateStyles: StateStyleConfig;
  /** The letter to display (B or S) */
  letter: string;
}

/**
 * Computes button configuration based on props and current state.
 * Resolves visual state and returns appropriate styles.
 *
 * All parameters default to safe values when omitted or undefined.
 */
export function useBuySellButtonConfig({
  type = 'buy',
  size = 'medium',
  disabled = false,
  oneClickTrading = false,
  positiveIndication = false,
  negativeIndication = false,
  pressed = false,
}: UseBuySellButtonConfigParams = {}): UseBuySellButtonConfigReturn {
  const { colors } = useEtoroTheme();

  const sizeConfig = useMemo(() => getSizeConfig(size), [size]);

  const visualState = useMemo(
    () =>
      resolveVisualState({
        disabled,
        positiveIndication,
        negativeIndication,
        oneClickTrading,
        pressed,
      }),
    [disabled, positiveIndication, negativeIndication, oneClickTrading, pressed],
  );

  const stateStyles = useMemo(() => getStateStyles(colors, visualState, type), [colors, visualState, type]);

  const letter = type === 'buy' ? 'B' : 'S';

  return {
    sizeConfig,
    stateStyles,
    letter,
  };
}
