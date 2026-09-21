import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SharedValue, useSharedValue, withSpring } from 'react-native-reanimated';

import { TEXT_TOGGLE_SPRING_CONFIG } from '../hooks/use-toggle-animation';
import { OptionLayout, TextToggleContextValue, TextToggleVariant } from './types';

// ============================================================================
// Context
// ============================================================================

/**
 * Internal context for EtTextToggle compound component.
 */
export const TextToggleContext = createContext<TextToggleContextValue | null>(null);

/**
 * Hook to access TextToggle context.
 * Must be used within an EtTextToggle component.
 *
 * @throws Error if used outside of EtTextToggle
 */
export function useTextToggleContext(): TextToggleContextValue {
  const context = useContext(TextToggleContext);
  if (!context) {
    throw new Error(
      'useTextToggleContext must be used within an EtTextToggle component. ' + 'Make sure EtTextToggle.Option is a child of EtTextToggle.',
    );
  }
  return context;
}

/**
 * Layout-related plumbing kept on its own context so that layout / spring
 * state never invalidates the main context value — option components don't
 * re-render when a sibling's layout shifts or when the indicator animates.
 */
export const TextToggleLayoutContext = createContext<{
  optionLayoutsShared: SharedValue<OptionLayout[]>;
  selectedProgress: SharedValue<number>;
  layoutsReady: boolean;
} | null>(null);

export function useTextToggleLayoutContext() {
  const context = useContext(TextToggleLayoutContext);
  if (!context) {
    throw new Error('useTextToggleLayoutContext must be used within an EtTextToggle component.');
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface TextToggleProviderProps {
  children: ReactNode;
  selectedId: string;
  onSelectionChange?: (id: string) => void;
  size: 'small' | 'large';
  variant: TextToggleVariant;
  stretch: boolean;
  disabled: boolean;
  haptics: boolean;
}

/**
 * Provider component that shares state with Option subcomponents.
 */
export function TextToggleProvider({ children, selectedId, onSelectionChange, size, variant, stretch, disabled, haptics }: TextToggleProviderProps) {
  const [registeredOptions, setRegisteredOptions] = useState<string[]>([]);

  // Layouts and the indicator's animated position live in refs +
  // SharedValues so updates skip React entirely — the worklet picks
  // them up on the next animation frame. Only `layoutsReady` is in
  // React state because it gates whether `<ToggleLayout>` renders the
  // indicator; once it flips true it stays true.
  const layoutsByIdRef = useRef<Record<string, OptionLayout>>({});
  const reportedIdsRef = useRef<Set<string>>(new Set());
  // Mirrors `registeredOptions` (and its length) so callbacks can read
  // the current registration order without depending on — and
  // invalidating on — the state. Identity stability matters here: the
  // Option's mount effect has `unregisterOption` in its deps, and if
  // that identity flipped on every registration the effect would
  // unmount/remount in a loop ("Maximum update depth exceeded").
  const registeredOptionsRef = useRef<string[]>([]);
  const optionCountRef = useRef(0);
  const optionLayoutsShared = useSharedValue<OptionLayout[]>([]);
  const [layoutsReady, setLayoutsReady] = useState(false);

  const selectedProgress = useSharedValue<number>(0);
  // Most-recent target passed to `withSpring`. Used to dedupe between
  // the press path and the catch-up effect so the spring isn't restarted
  // mid-flight (which would reset velocity to zero and look stuttery).
  const intendedTargetRef = useRef<number>(-1);

  const animateToIndex = useCallback(
    (index: number) => {
      if (index < 0 || intendedTargetRef.current === index) return;
      const isFirstSet = intendedTargetRef.current < 0;
      intendedTargetRef.current = index;
      // Snap on first set so the indicator doesn't visibly slide in
      // from index 0 on mount.
      if (isFirstSet) {
        selectedProgress.value = index;
        return;
      }
      selectedProgress.value = withSpring(index, TEXT_TOGGLE_SPRING_CONFIG);
    },
    [selectedProgress],
  );

  const rebuildOrderedLayouts = useCallback(() => {
    // Keep layout ordering aligned with the option index source
    // (`registeredOptions.indexOf(id)`) so indicator interpolation uses
    // the same indexes in LTR, RTL, or any non-geometric render order.
    // Reads from the ref (not the state) so this callback's identity is
    // stable across re-renders.
    optionLayoutsShared.value = registeredOptionsRef.current
      .map((id) => layoutsByIdRef.current[id])
      .filter((layout): layout is OptionLayout => Boolean(layout));
  }, [optionLayoutsShared]);

  const registerOption = useCallback((id: string) => {
    setRegisteredOptions((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const unregisterOption = useCallback((id: string) => {
    setRegisteredOptions((prev) => {
      if (!prev.includes(id)) return prev;
      return prev.filter((optId) => optId !== id);
    });
    reportedIdsRef.current.delete(id);
    if (id in layoutsByIdRef.current) {
      const { [id]: _removed, ...rest } = layoutsByIdRef.current;
      layoutsByIdRef.current = rest;
    }
    // We deliberately don't flip `layoutsReady` back to false on
    // unregister — the smaller set is still "ready" and flickering
    // the indicator off would be jarring. The mirror-and-rebuild
    // effect below will re-emit layouts once the state commit lands.
  }, []);

  const reportOptionLayout = useCallback(
    (id: string, layout: OptionLayout) => {
      const existing = layoutsByIdRef.current[id];
      // onLayout fires on every parent re-layout; skip identical reports
      // to avoid thrashing the worklet.
      if (existing && existing.x === layout.x && existing.width === layout.width) return;

      layoutsByIdRef.current[id] = layout;
      reportedIdsRef.current.add(id);
      rebuildOrderedLayouts();

      if (!layoutsReady && optionCountRef.current > 0 && reportedIdsRef.current.size >= optionCountRef.current) {
        setLayoutsReady(true);
      }
    },
    [layoutsReady, rebuildOrderedLayouts],
  );

  // Single sync point for registration changes: mirror state into refs so
  // callbacks stay identity-stable (otherwise the Option's mount effect
  // would unregister/re-register in an infinite loop), rebuild the
  // ordered layout array, and close the onLayout-before-register race —
  // when the last `onLayout` fires before its `registerOption` commit,
  // `reportOptionLayout` skips the readiness flip and no further onLayout
  // fires unless layout changes, so re-checking here is what makes the
  // indicator appear in that case.
  useEffect(() => {
    registeredOptionsRef.current = registeredOptions;
    optionCountRef.current = registeredOptions.length;
    rebuildOrderedLayouts();
    if (!layoutsReady && registeredOptions.length > 0 && reportedIdsRef.current.size >= registeredOptions.length) {
      setLayoutsReady(true);
    }
  }, [registeredOptions, layoutsReady, rebuildOrderedLayouts]);

  const getOptionIndex = useCallback(
    (id: string) => {
      return registeredOptions.indexOf(id);
    },
    [registeredOptions],
  );

  const onSelect = useCallback(
    (id: string) => {
      if (disabled) return;
      onSelectionChange?.(id);
    },
    [disabled, onSelectionChange],
  );

  const contextValue: TextToggleContextValue = useMemo(
    () => ({
      selectedId,
      onSelect,
      size,
      variant,
      stretch,
      disabled,
      haptics,
      registerOption,
      unregisterOption,
      getOptionIndex,
      optionCount: registeredOptions.length,
      reportOptionLayout,
      animateToIndex,
    }),
    [
      selectedId,
      onSelect,
      size,
      variant,
      stretch,
      disabled,
      haptics,
      registerOption,
      unregisterOption,
      getOptionIndex,
      registeredOptions.length,
      reportOptionLayout,
      animateToIndex,
    ],
  );

  // Catch external `selectedId` changes (controlled updates that
  // didn't originate from a press) and the first valid index after
  // registration completes. The press path already calls
  // `animateToIndex` directly; the `intendedTargetRef` guard inside
  // makes this a no-op in the normal tap flow.
  const selectedIndex = registeredOptions.indexOf(selectedId);
  useEffect(() => {
    if (selectedIndex < 0) return;
    animateToIndex(selectedIndex);
  }, [selectedIndex, animateToIndex]);

  const layoutContextValue = useMemo(
    () => ({ optionLayoutsShared, selectedProgress, layoutsReady }),
    [optionLayoutsShared, selectedProgress, layoutsReady],
  );

  return (
    <TextToggleContext.Provider value={contextValue}>
      <TextToggleLayoutContext.Provider value={layoutContextValue}>{children}</TextToggleLayoutContext.Provider>
    </TextToggleContext.Provider>
  );
}
