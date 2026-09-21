import { useCallback, useMemo, useState } from 'react';

interface UseAccordionStateParams {
  /**
   * Allow multiple items to be expanded simultaneously
   */
  allowMultiple?: boolean;

  /**
   * IDs of items that should be expanded by default (uncontrolled)
   */
  defaultExpandedIds?: string[];

  /**
   * Controlled expanded state - array of expanded item IDs
   */
  expandedIds?: string[];

  /**
   * Callback when expanded items change
   */
  onExpandedChange?: (ids: string[]) => void;
}

interface UseAccordionStateReturn {
  /**
   * Current expanded item IDs
   */
  expandedIds: string[];

  /**
   * Toggle an item's expanded state
   */
  toggleItem: (id: string) => void;

  /**
   * Whether multiple items can be expanded
   */
  allowMultiple: boolean;
}

/**
 * Hook for managing accordion expanded state
 * Supports both controlled and uncontrolled modes
 */
export function useAccordionState({
  allowMultiple = false,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
}: UseAccordionStateParams): UseAccordionStateReturn {
  // Normalize defaultExpandedIds based on allowMultiple
  // When allowMultiple is false, only keep the first ID
  const normalizedDefaultExpandedIds = allowMultiple ? defaultExpandedIds : defaultExpandedIds.slice(0, 1);

  // Internal state for uncontrolled mode
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(normalizedDefaultExpandedIds);

  // Determine if controlled
  const isControlled = controlledExpandedIds !== undefined;
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds;

  // Toggle item expanded state
  const toggleItem = useCallback(
    (id: string) => {
      const newExpandedIds = expandedIds.includes(id)
        ? expandedIds.filter((expandedId) => expandedId !== id)
        : allowMultiple
          ? [...expandedIds, id]
          : [id];

      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalExpandedIds(newExpandedIds);
      }

      // Always call callback if provided
      onExpandedChange?.(newExpandedIds);
    },
    [expandedIds, allowMultiple, isControlled, onExpandedChange],
  );

  return useMemo(
    () => ({
      expandedIds,
      toggleItem,
      allowMultiple,
    }),
    [expandedIds, toggleItem, allowMultiple],
  );
}
