import { useCallback, useMemo } from 'react';

import { ChipsGroupMultiSelectProps, ChipsGroupSingleSelectProps, EtChipsGroupV2Props } from '../api';

/**
 * Hook to manage chips group selection logic.
 * Handles both single and multi selection modes.
 *
 * Note: Haptics are handled by EtChip internally.
 */
export function useChipsGroupConfig(props: EtChipsGroupV2Props) {
  const selectionMode = props.selectionMode ?? 'none';

  // Extract specific values from props to avoid using entire props object in dependencies
  // This prevents unnecessary recalculations when props object reference changes
  const value =
    selectionMode === 'single'
      ? (props as ChipsGroupSingleSelectProps).value
      : selectionMode === 'multi'
        ? (props as ChipsGroupMultiSelectProps).value
        : null;

  const onChange =
    selectionMode === 'single'
      ? (props as ChipsGroupSingleSelectProps).onChange
      : selectionMode === 'multi'
        ? (props as ChipsGroupMultiSelectProps).onChange
        : undefined;

  // Build selected IDs set for O(1) lookup
  const selectedIds = useMemo(() => {
    if (selectionMode === 'none' || value === null) {
      return new Set<string>();
    }
    if (selectionMode === 'single') {
      return value ? new Set([value as string]) : new Set<string>();
    }
    // Multi mode
    return new Set(value as string[]);
  }, [selectionMode, value]);

  // Selection handler - haptics are handled by EtChip internally
  const handleSelect = useCallback(
    (id: string) => {
      if (selectionMode === 'none' || !onChange) {
        return;
      }

      if (selectionMode === 'single') {
        // Toggle: if already selected, deselect (null), else select
        const newValue = selectedIds.has(id) ? null : id;
        (onChange as (val: string | null) => void)(newValue);
      } else {
        // Multi: toggle in/out of array
        const currentValue = value as string[];
        const newValue = selectedIds.has(id) ? currentValue.filter((v) => v !== id) : [...currentValue, id];
        (onChange as (val: string[]) => void)(newValue);
      }
    },
    [selectionMode, selectedIds, value, onChange],
  );

  return { selectedIds, handleSelect, selectionMode };
}
