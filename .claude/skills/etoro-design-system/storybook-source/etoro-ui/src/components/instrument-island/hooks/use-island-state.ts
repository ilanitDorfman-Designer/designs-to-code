import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { IslandInstrument } from '../api/types';

interface UseIslandStateOptions {
  items: IslandInstrument[];
  focusedId?: string;
  defaultFocusedId?: string;
  onFocusChange?: (id: string) => void;
  onItemPress?: (id: string) => void;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  haptics: boolean;
}

interface UseIslandStateResult {
  focusedId: string;
  focusedIndex: number;
  displayIndex: number;
  accentColor: string | undefined;
  isExpanded: boolean;
  onFocus: (id: string) => void;
  onItemActivate: (id: string) => void;
  onCross: (index: number) => void;
  onSettle: (index: number) => void;
  commit: (id: string) => void;
  onExpand: () => void;
  onCollapse: () => void;
}

/**
 * Owns the island's focus + expansion state (controlled or uncontrolled) and
 * the iOS haptic feedback that makes the interaction feel alive.
 */
export function useIslandState({
  items,
  focusedId: controlledFocusedId,
  defaultFocusedId,
  onFocusChange,
  onItemPress,
  isExpanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  haptics,
}: UseIslandStateOptions): UseIslandStateResult {
  const firstId = items[0]?.id ?? '';
  const [internalFocusedId, setInternalFocusedId] = useState(defaultFocusedId ?? firstId);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const focusedId = controlledFocusedId ?? internalFocusedId;
  const isExpanded = controlledExpanded ?? internalExpanded;

  const focusedIndex = useMemo(() => {
    const index = items.findIndex((item) => item.id === focusedId);
    return index < 0 ? 0 : index;
  }, [items, focusedId]);

  const accentColor = items[focusedIndex]?.accentColor;

  // Transient focus the label/a11y follow while the rail is moving. At rest it
  // mirrors the committed focus, so external changes keep it in sync.
  const [displayIndex, setDisplayIndex] = useState(focusedIndex);
  useEffect(() => {
    setDisplayIndex(focusedIndex);
  }, [focusedIndex]);

  const onFocus = useCallback(
    (id: string) => {
      if (id === focusedId) return;
      selectionHaptic(haptics);
      if (controlledFocusedId === undefined) setInternalFocusedId(id);
      onFocusChange?.(id);
    },
    [focusedId, haptics, controlledFocusedId, onFocusChange],
  );

  // Per-crossing during motion: a cheap haptic + label update, no parent re-render.
  const onCross = useCallback(
    (index: number) => {
      selectionHaptic(haptics);
      setDisplayIndex(index);
    },
    [haptics],
  );

  // Motion settled: propagate the resting focus to the parent exactly once.
  const onSettle = useCallback(
    (index: number) => {
      const id = items[index]?.id;
      if (id == null || id === focusedId) return;
      if (controlledFocusedId === undefined) setInternalFocusedId(id);
      onFocusChange?.(id);
    },
    [items, focusedId, controlledFocusedId, onFocusChange],
  );

  const onItemActivate = useCallback(
    (id: string) => {
      if (id === focusedId) {
        onItemPress?.(id);
        return;
      }
      onFocus(id);
    },
    [focusedId, onItemPress, onFocus],
  );

  // Unconditionally commit a selection by id — used by the hold-scrub release,
  // where the final focused id is known directly (not via flushed state).
  const commit = useCallback(
    (id: string) => {
      onItemPress?.(id);
    },
    [onItemPress],
  );

  const onExpand = useCallback(() => {
    if (isExpanded) return;
    impactHaptic(haptics);
    if (controlledExpanded === undefined) setInternalExpanded(true);
    onExpandedChange?.(true);
  }, [isExpanded, haptics, controlledExpanded, onExpandedChange]);

  const onCollapse = useCallback(() => {
    if (!isExpanded) return;
    if (controlledExpanded === undefined) setInternalExpanded(false);
    onExpandedChange?.(false);
  }, [isExpanded, controlledExpanded, onExpandedChange]);

  return {
    focusedId,
    focusedIndex,
    displayIndex,
    accentColor,
    isExpanded,
    onFocus,
    onItemActivate,
    onCross,
    onSettle,
    commit,
    onExpand,
    onCollapse,
  };
}

function selectionHaptic(enabled: boolean): void {
  if (!enabled || Platform.OS !== 'ios') return;
  void Haptics.selectionAsync();
}

function impactHaptic(enabled: boolean): void {
  if (!enabled || Platform.OS !== 'ios') return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
