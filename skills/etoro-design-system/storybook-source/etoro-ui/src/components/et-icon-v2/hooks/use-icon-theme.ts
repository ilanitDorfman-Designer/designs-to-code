import { useMemo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';

interface UseIconThemeProps {
  color?: string;
}

interface UseIconThemeResult {
  resolvedColor: string;
}

/**
 * Theme-aware color resolution for icons.
 * Explicit `color` wins; otherwise all icons default to `carbon900`.
 */
export function useIconTheme({ color }: UseIconThemeProps): UseIconThemeResult {
  const { colors } = useEtoroTheme();

  const resolvedColor = useMemo(() => {
    if (color != null && color !== '') {
      return color;
    }

    return colors.carbon900;
  }, [color, colors.carbon900]);

  return { resolvedColor };
}
