import { useEtoroTheme } from '../../../../core/hooks';
import type { EtTickerProps } from '../api';
import type { TickerContextValue } from '../api/types';

interface TickerConfig {
  contextValue: TickerContextValue;
  speed: number;
  gradient: boolean;
  defaultAccessibilityLabel: string;
}

/**
 * Processes ticker props into resolved configuration.
 * All business logic lives here — the main component is composition only.
 */
export function useTickerConfig({
  items,
  speed = 0.25,
  gradient = true,
  onItemPress,
}: Pick<EtTickerProps, 'items' | 'speed' | 'gradient' | 'onItemPress'>): TickerConfig {
  const { colors } = useEtoroTheme();

  // Sanitize speed: must be finite, non-negative number (0 allowed for paused ticker)
  const sanitizedSpeed = Number.isFinite(speed) && speed >= 0 ? speed : 0.25;

  const contextValue: TickerContextValue = {
    textColor: colors.textSecondaryNeutral,
    positiveColor: colors.statusPositive,
    negativeColor: colors.statusNegative,
    speed: sanitizedSpeed,
    onItemPress,
  };

  const itemCount = items?.length ?? 0;
  const defaultAccessibilityLabel = itemCount
    ? `Financial ticker displaying ${itemCount} stock${itemCount === 1 ? '' : 's'} with prices and changes`
    : 'Financial ticker displaying stock prices and changes';

  return {
    contextValue,
    speed: sanitizedSpeed,
    gradient,
    defaultAccessibilityLabel,
  };
}
