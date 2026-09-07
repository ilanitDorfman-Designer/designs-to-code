import { createContext, ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { useScreenScroll } from '../../../core/hooks';
import { HEADER_HEIGHT } from '../../../core/styles';
import { EtScreenTopBarProps, ScreenContextValue } from './types';

/**
 * Internal context for EtScreen compound component.
 * Enables communication between EtScreen, EtScreen.TopBar, EtScreen.ScrollView, etc.
 */
export const ScreenContext = createContext<ScreenContextValue | null>(null);

/**
 * Internal-only context that carries the live `<EtScreenOverlay>` children.
 *
 * The overlay value churns on every parent render (JSX children are a new ReactNode reference each
 * time), so it MUST NOT live on the main `ScreenContext`. If it did, every render of `<Overlay>`
 * would invalidate the context value and force a re-render of every `useScreenContext()` consumer
 * — including the user's screen component, which then produces fresh overlay JSX, which fires the
 * registration effect again. That is an infinite update loop ("Maximum update depth exceeded",
 * surfaced from the next consumer down the tree, e.g. a scroll list registered via `useScrollHandlers()`).
 *
 * Keeping it on a dedicated context confines the re-render to {@link ScreenContentRenderer},
 * which is the only thing that actually paints the overlay. The presence boolean (`hasOverlay`)
 * stays on the main context because it only toggles on mount/unmount.
 */
const OverlayContentContext = createContext<ReactNode | null>(null);

/**
 * Internal hook for the screen shell to read the currently registered overlay node. Subscribing
 * via this context (instead of `useScreenContext`) means the parent screen does not re-render
 * each time overlay children update, which is what breaks the infinite registration loop above.
 */
export function useOverlayContent(): ReactNode | null {
  return useContext(OverlayContentContext);
}

/**
 * Hook to access EtScreen context.
 * Must be used within an EtScreen component.
 *
 * @throws Error if used outside of EtScreen
 */
export function useScreenContext(): ScreenContextValue {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error(
      'useScreenContext must be used within an EtScreen component. ' +
        'Make sure EtScreen.TopBar, EtScreen.ScrollView, or EtScreen.View ' +
        'are direct children of EtScreen.',
    );
  }
  return context;
}

/**
 * Hook to optionally access EtScreen context.
 * Returns null if used outside of EtScreen (no error thrown).
 */
export function useOptionalScreenContext(): ScreenContextValue | null {
  return useContext(ScreenContext);
}

// ============================================================================
// Context Provider Component
// ============================================================================

interface ScreenContextProviderProps {
  children: ReactNode;
  animateHalo?: boolean;
  hasTopBarChild?: boolean;
}

/**
 * Provider component that manages all shared state for EtScreen.
 * Handles:
 * - TopBar registration and configuration
 * - Scroll position tracking
 * - Scroll direction for animations
 * - Halo animation integration
 * - Drawer-halo synchronization (hides halo when drawer opens)
 */
export function ScreenContextProvider({ children, animateHalo = false, hasTopBarChild = false }: ScreenContextProviderProps) {
  // ==================== State ====================
  const [topBarConfig, setTopBarConfig] = useState<EtScreenTopBarProps | null>(null);
  const [headerContent, setHeaderContent] = useState<ReactNode | null>(null);
  // `overlayContent` and `hasOverlay` are deliberately separate states living on different
  // contexts. `overlayContent` updates every render of `<EtScreenOverlay>` (children is a
  // brand-new JSX node each parent render) and only feeds the {@link OverlayContentContext}
  // consumed by the screen shell. `hasOverlay` is a coarse mount/unmount toggle that lives on
  // the main context so layout consumers (top safe-area edge, body top inset) can react to the
  // presence of an overlay without subscribing to its identity.
  const [overlayContent, setOverlayContent] = useState<ReactNode | null>(null);
  const [hasOverlay, setHasOverlay] = useState(false);
  const [topBarHeight, setTopBarHeightState] = useState(HEADER_HEIGHT);
  const [headerAreaHeight, setHeaderAreaHeightState] = useState(HEADER_HEIGHT);
  const [collapseHeaderWithTopBar, setCollapseHeaderWithTopBar] = useState(false);
  const [hasScrollView, setHasScrollView] = useState(false);

  // ==================== Mount Guard ====================
  const isMountedRef = useRef(false);
  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ==================== Shared Values ====================
  const scrollY = useSharedValue(0);
  const scrollBottomDistance = useSharedValue(Number.POSITIVE_INFINITY);
  const direction = useSharedValue(1);
  const topBarHeightShared = useSharedValue(HEADER_HEIGHT);
  const headerAreaHeightShared = useSharedValue(HEADER_HEIGHT);

  // ==================== TopBar Registration ====================
  const registerTopBar = useCallback((config: EtScreenTopBarProps) => {
    setTopBarConfig(config);
  }, []);

  const unregisterTopBar = useCallback(() => {
    setTopBarConfig(null);
  }, []);

  // ==================== Header Registration ====================
  const registerHeader = useCallback((content: ReactNode) => {
    setHeaderContent(content);
  }, []);

  const unregisterHeader = useCallback(() => {
    setHeaderContent(null);
  }, []);

  // ==================== Overlay Registration ====================
  // `registerOverlay` is called on every children change inside `<EtScreenOverlay>` to publish
  // the latest node into {@link OverlayContentContext}. It also flips `hasOverlay` to true via the
  // boolean state — `setHasOverlay(true)` is a no-op (Object.is bailout) on subsequent calls, so
  // only the dedicated overlay context updates after the first registration. That is what keeps
  // the main `useScreenContext()` value reference-stable across overlay churn and breaks the
  // otherwise-infinite update loop on screens that consume both context and the overlay slot.
  const registerOverlay = useCallback((content: ReactNode) => {
    setOverlayContent(content);
    setHasOverlay(content !== null);
  }, []);

  const unregisterOverlay = useCallback(() => {
    setOverlayContent(null);
    setHasOverlay(false);
  }, []);

  // ==================== TopBar-Only Height ====================
  const setTopBarHeight = useCallback(
    (height: number) => {
      topBarHeightShared.set(height);
      if (isMountedRef.current) {
        setTopBarHeightState(height);
      }
    },
    [topBarHeightShared],
  );

  // ==================== Combined Header Area Height ====================
  const setHeaderAreaHeight = useCallback(
    (height: number) => {
      headerAreaHeightShared.set(height);
      if (isMountedRef.current) {
        setHeaderAreaHeightState(height);
      }
    },
    [headerAreaHeightShared],
  );

  // ==================== Computed Values ====================
  const shouldShowTopBar = hasTopBarChild || topBarConfig !== null;

  // ==================== Halo Animation ====================
  useScreenScroll(scrollY, animateHalo);

  // ==================== Context Value ====================
  // NOTE: `overlayContent` is intentionally NOT a dep — it would force every consumer of
  // `useScreenContext()` (including the user's screen body) to re-render on every overlay JSX
  // refresh, which loops back into the registration effect. The live overlay node is published
  // separately on `OverlayContentContext` below.
  const contextValue: ScreenContextValue = useMemo(
    () => ({
      topBarConfig,
      registerTopBar,
      unregisterTopBar,
      headerContent,
      registerHeader,
      unregisterHeader,
      topBarHeight,
      topBarHeightShared,
      setTopBarHeight,
      headerAreaHeight,
      headerAreaHeightShared,
      setHeaderAreaHeight,
      collapseHeaderWithTopBar,
      setCollapseHeaderWithTopBar,
      scrollY,
      scrollBottomDistance,
      direction,
      animateHalo,
      shouldShowTopBar,
      hasScrollView,
      setHasScrollView,
      hasOverlay,
      registerOverlay,
      unregisterOverlay,
    }),
    [
      topBarConfig,
      headerContent,
      hasOverlay,
      topBarHeight,
      headerAreaHeight,
      collapseHeaderWithTopBar,
      animateHalo,
      shouldShowTopBar,
      hasScrollView,
      scrollY,
      scrollBottomDistance,
      registerOverlay,
      unregisterOverlay,
    ],
  );

  return (
    <ScreenContext.Provider value={contextValue}>
      <OverlayContentContext.Provider value={overlayContent}>{children}</OverlayContentContext.Provider>
    </ScreenContext.Provider>
  );
}
