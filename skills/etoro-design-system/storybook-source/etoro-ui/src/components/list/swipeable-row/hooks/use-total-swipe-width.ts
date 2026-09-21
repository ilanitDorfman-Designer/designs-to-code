import { useMemo } from 'react';

import { DEFAULT_BUTTON_WIDTH, normalizeActionWidth } from '../utils/normalize-action-width';

/**
 * Hook to calculate the total swipe width from action widths.
 * Necessary to fix the swipe width when actions have different widths.
 * Otherwise, the swipe would either hide some actions partially or use unnecessary space.
 */
export function useTotalSwipeWidth(actionWidths: Array<{ width?: number }>) {
  const totalSwipeWidth = useMemo(() => actionWidths.reduce((sum, action) => sum + normalizeActionWidth(action.width), 0), [actionWidths]);
  return {
    totalSwipeWidth,
    defaultButtonWidth: DEFAULT_BUTTON_WIDTH,
  };
}
