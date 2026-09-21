import { useEtoroTheme } from '../../../../core/hooks';
import { useEtNumberContext } from '../context';

/**
 * Resolves EtNumber display color from context and theme.
 * - When root `color` is set, returns it.
 * - When isColored, returns sign-based (verdictPositive600 / verdictNegative600).
 */
export function useColor(): string {
  const { value, isColored, color: contextColor, isMasked } = useEtNumberContext();
  const { colors } = useEtoroTheme();

  if (contextColor !== undefined) return contextColor;

  if (isMasked) return colors.textPrimaryNeutral;

  if (isColored && value != null && Number.isFinite(value)) {
    return value >= 0 ? colors.verdictPositive600 : colors.verdictNegative600;
  }

  return colors.carbon900;
}
