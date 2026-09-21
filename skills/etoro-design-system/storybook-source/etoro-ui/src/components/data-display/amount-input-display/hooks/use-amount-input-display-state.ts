import { useCallback, useState } from 'react';
import { type LayoutChangeEvent } from 'react-native';

export interface AmountInputDisplayState {
  /** Measured container width, used by the auto-scale to fit the row. */
  availableWidth: number;
  /** Combined measured width of the affixes (currency + unit + caret + gaps). */
  affixWidth: number;
  handleContainerLayout: (event: LayoutChangeEvent) => void;
  registerAffixWidth: (id: string, width: number) => void;
  clearAffixWidth: (id: string) => void;
}

/**
 * Owns the measurement state for the amount row: the container width and an affix-width registry the
 * measured subcomponents (currency/unit/caret) write to via `onLayout`. Logic-only - all motion lives
 * in `animations/`.
 */
export function useAmountInputDisplayState(): AmountInputDisplayState {
  const [availableWidth, setAvailableWidth] = useState(0);
  const [affixWidths, setAffixWidths] = useState<Record<string, number>>({});

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setAvailableWidth((prev) => (prev === width ? prev : width));
  };

  const registerAffixWidth = useCallback((id: string, width: number) => {
    setAffixWidths((prev) => (prev[id] === width ? prev : { ...prev, [id]: width }));
  }, []);

  const clearAffixWidth = useCallback((id: string) => {
    setAffixWidths((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return { availableWidth, affixWidth: sumWidths(affixWidths), handleContainerLayout, registerAffixWidth, clearAffixWidth };
}

function sumWidths(widths: Record<string, number>): number {
  let total = 0;
  for (const key in widths) {
    total += widths[key];
  }
  return total;
}
