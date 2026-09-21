import { useCallback, useMemo, useState } from 'react';

import { TabsActions, TabsState } from '../api/types';

interface UseTabsStateParams {
  /** Default value for uncontrolled mode */
  defaultValue?: string;

  /** Controlled value */
  value?: string;

  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

interface UseTabsStateReturn {
  state: TabsState;
  actions: TabsActions;
}

/**
 * Hook for managing tabs selection state
 * Supports both controlled and uncontrolled modes
 *
 * Following the accordion pattern from use-accordion-state.ts
 */
export function useTabsState({ defaultValue = '', value: controlledValue, onValueChange }: UseTabsStateParams): UseTabsStateReturn {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  // Determine if controlled
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  // Set active value handler
  const setActiveValue = useCallback(
    (newValue: string) => {
      // Skip if already selected
      if (newValue === activeValue) {
        return;
      }

      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(newValue);
      }

      // Always call callback if provided
      onValueChange?.(newValue);
    },
    [activeValue, isControlled, onValueChange],
  );

  const state = useMemo<TabsState>(
    () => ({
      activeValue,
    }),
    [activeValue],
  );

  const actions = useMemo<TabsActions>(
    () => ({
      setActiveValue,
    }),
    [setActiveValue],
  );

  return { state, actions };
}
