import { notifySheetDismissed, notifySheetPresented, notifySheetPresenting } from '@etoro/common/infra/app-float-overlay';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, BackHandler, InteractionManager, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '../../../core/hooks/accessibility/use-reduced-motion';
import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { EtBottomSheetFooterProps, EtBottomSheetProps } from './api';
import { BottomSheetProvider } from './context';
import { useBottomSheetAccessibilityContainer, useEtBottomSheetBackdrop, useEtBottomSheetFooter } from './hooks';
import {
  EtBottomSheetBackground,
  EtBottomSheetContent,
  EtBottomSheetFlashList,
  EtBottomSheetFooter,
  EtBottomSheetHandle,
  EtBottomSheetHeader,
  EtBottomSheetList,
  EtBottomSheetSectionList,
  EtGlassBottomSheetBackground,
} from './subcomponents';
import {
  parseBottomSheetChildren,
  renderBottomSheetLayout,
  resolveAccessibilityAnnouncementDelay,
  resolveBottomSheetAnimationConfig,
  resolveBottomSheetContainerComponent,
  SCROLLABLE_CONTENT_MAX_HEIGHT_RATIO,
} from './utils';

// ============================================================================
// Default Props
// ============================================================================

const DEFAULT_PROPS = {
  // Sizing
  enableDynamicSizing: true,
  topInset: 0,
  // Behavior
  closeOnBackdrop: true,
  dismissOnAndroidBack: true,
  enablePanDownToClose: true,
  enableContentPanningGesture: true,
  enableHandlePanningGesture: true,
  enableOverDrag: true,
  overDragResistanceFactor: 2.5,
  detached: false,
  animationPreset: 'bouncy' as const,
  // Keyboard
  keyboardBehavior: 'interactive' as const,
  keyboardBlurBehavior: 'none' as const,
  enableBlurKeyboardOnGesture: false,
  android_keyboardInputMode: 'adjustPan' as const,
  // Appearance
  showHandle: true,
  // State
  loading: false,
  // Testing
  testID: 'et-bottom-sheet',
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * EtBottomSheet v2 - A compound component for modal bottom sheets
 *
 * Features:
 * - Dynamic sizing based on content (or manual snap points)
 * - Compound component pattern for flexible composition
 * - Sticky footer with keyboard handling
 * - Scrollable content support
 * - Accessibility support with screen reader announcements
 * - Reduced motion support
 *
 * ## Header
 *
 * ```tsx
 * <EtBottomSheet.Header>
 *   <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
 *   <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
 *     <EtoroIcon icon={{ iconName: 'close' }} />
 *   </EtBottomSheet.Header.Action>
 * </EtBottomSheet.Header>
 * ```
 */
function EtBottomSheetRoot(props: EtBottomSheetProps): React.JSX.Element {
  const {
    bottomSheetRef,
    remountOnPresent = false,
    children,
    // Sizing
    snapPoints,
    enableDynamicSizing = DEFAULT_PROPS.enableDynamicSizing,
    maxDynamicContentSize,
    topInset = DEFAULT_PROPS.topInset,
    bottomInset,
    // Behavior
    onOpen,
    onClose,
    onBeforeClose,
    onChange,
    onAnimate,
    closeOnBackdrop = DEFAULT_PROPS.closeOnBackdrop,
    dismissOnAndroidBack = DEFAULT_PROPS.dismissOnAndroidBack,
    enablePanDownToClose = DEFAULT_PROPS.enablePanDownToClose,
    stackBehavior,
    enableContentPanningGesture,
    disableFullWindowOverlay,
    enableHandlePanningGesture = DEFAULT_PROPS.enableHandlePanningGesture,
    enableOverDrag = DEFAULT_PROPS.enableOverDrag,
    overDragResistanceFactor = DEFAULT_PROPS.overDragResistanceFactor,
    detached = DEFAULT_PROPS.detached,
    animationPreset = DEFAULT_PROPS.animationPreset,
    // Animation shared values
    animatedIndex,
    animatedPosition,
    onScroll,
    onContentSizeChange,
    onScrollViewLayout,
    // Keyboard
    keyboardBehavior = DEFAULT_PROPS.keyboardBehavior,
    keyboardBlurBehavior = DEFAULT_PROPS.keyboardBlurBehavior,
    enableBlurKeyboardOnGesture = DEFAULT_PROPS.enableBlurKeyboardOnGesture,
    android_keyboardInputMode = DEFAULT_PROPS.android_keyboardInputMode,
    // Appearance
    variant = 'default',
    showHandle = DEFAULT_PROPS.showHandle,
    backdrop,
    style,
    backgroundStyle,
    backgroundColor,
    // State
    loading = DEFAULT_PROPS.loading,
    // Accessibility
    accessibilityLabel,
    accessible,
    testID = DEFAULT_PROPS.testID,
  } = props;
  const { colors } = useEtoroTheme();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const effectiveBottomInset = bottomInset ?? (Platform.OS === 'android' ? insets.bottom : 0);
  const effectiveEnableContentPanningGesture = enableContentPanningGesture ?? DEFAULT_PROPS.enableContentPanningGesture;
  const isReducedMotion = useReducedMotion();
  const [isPresented, setIsPresented] = useState(false);
  const wasPresentedRef = useRef(false);
  // Guards the early (animation-start) counter bump so it fires exactly once per
  // present. Distinct from `wasPresentedRef` (which flips at settle): this one
  // flips at `onAnimate`-open-start and is reset on close/dismiss so a reopen
  // re-fires. See `handleAnimate` and `sheet-presentation.store.ts`.
  const hasNotifiedPresentingRef = useRef(false);
  const isMountedRef = useRef(true);
  const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether we owe the app-float-overlay layer a
  // `notifySheetDismissed()` call — set on open transition, cleared on full
  // dismiss OR on component unmount (route change while presented).
  const owesDismissNotifyRef = useRef(false);
  // Identity token for the current presented sheet instance (from
  // `notifySheetPresented`). The paired `notifySheetDismissed` passes it back so
  // the store settles THIS sheet — and its timeout recovery expires only stale
  // sheets, never a newer one that presented meanwhile. See sheet-presentation.store.ts.
  const sheetTokenRef = useRef<number | null>(null);

  // ==========================================================================
  // `remountOnPresent` — see the prop doc for why this exists.
  //
  // When enabled, `bottomSheetRef` (the consumer's ref) no longer forwards directly to the real
  // `BottomSheetModal` — instead it's populated with a stable wrapper whose `present()` bumps
  // `presentGeneration`, which is used as the real modal's `key`, forcing React to fully unmount
  // and recreate it before the actual `.present()` reaches the fresh instance. Every other method
  // just delegates straight through to whatever the current real instance is.
  // ==========================================================================
  const internalModalRef = useRef<BottomSheetModal | null>(null);
  const [presentGeneration, setPresentGeneration] = useState(0);
  // Bumped synchronously inside `present()` (before React re-renders), so a callback closed over
  // an older `presentGeneration` can recognise that its instance has been superseded.
  const latestGenerationRef = useRef(0);
  // Generation of the instance that currently owns the presented-sheet token / latches above.
  const tokenGenerationRef = useRef(0);
  // Held across the remount so `present(data)` reaches the recreated instance rather than the
  // one being torn down.
  const pendingPresentDataRef = useRef<Parameters<BottomSheetModal['present']>[0]>(undefined);

  const remountWrapperRef = useRef<BottomSheetModal | null>(null);
  if (remountWrapperRef.current === null) {
    remountWrapperRef.current = {
      present: (data) => {
        pendingPresentDataRef.current = data;
        latestGenerationRef.current += 1;
        setPresentGeneration(latestGenerationRef.current);
      },
      dismiss: (...args) => internalModalRef.current?.dismiss(...args),
      snapToIndex: (...args) => internalModalRef.current?.snapToIndex(...args),
      snapToPosition: (...args) => internalModalRef.current?.snapToPosition(...args),
      expand: (...args) => internalModalRef.current?.expand(...args),
      collapse: (...args) => internalModalRef.current?.collapse(...args),
      close: (...args) => internalModalRef.current?.close(...args),
      forceClose: (...args) => internalModalRef.current?.forceClose(...args),
    };
  }

  if (remountOnPresent) {
    // Intentional: `remountOnPresent` requires `EtBottomSheet` to own what the consumer's ref
    // exposes (a stable wrapper, not the real modal directly) — refs are explicitly designed to
    // be mutated outside the normal render/props flow, and this only runs when opted in.
    // eslint-disable-next-line react-compiler/react-compiler
    bottomSheetRef.current = remountWrapperRef.current;
  }

  // Presents the freshly-remounted instance once it's actually mounted. Plain
  // `requestAnimationFrame` isn't always enough for Gorhom re-presents (matches the pattern
  // already proven in `MoneyBalancesSheet`).
  useEffect(() => {
    if (!remountOnPresent || presentGeneration === 0) {
      return undefined;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      internalModalRef.current?.present(pendingPresentDataRef.current);
    });

    return () => task.cancel();
  }, [remountOnPresent, presentGeneration]);

  // Cleanup on unmount: clear timeout, update mounted ref, and settle the
  // presented-count if the sheet went away without a full dismiss (e.g. the
  // consumer unmounted the sheet component while it was still open).
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
        announcementTimeoutRef.current = null;
      }
      if (owesDismissNotifyRef.current) {
        owesDismissNotifyRef.current = false;
        const token = sheetTokenRef.current;
        sheetTokenRef.current = null;
        if (token !== null) {
          notifySheetDismissed(token);
        }
      }
    };
  }, []);

  // Android hardware / predictive back — dismiss the sheet instead of popping navigation.
  useEffect(() => {
    if (Platform.OS !== 'android' || !dismissOnAndroidBack || !isPresented) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBeforeClose) {
        const shouldClose = onBeforeClose();
        if (shouldClose === false) {
          return true;
        }
      }

      bottomSheetRef.current?.dismiss();
      return true;
    });

    return () => subscription.remove();
  }, [bottomSheetRef, dismissOnAndroidBack, isPresented, onBeforeClose]);

  // Separate children into sections
  const { headerChild, contentChild, footerChild, isScrollable, isVirtualizedList, showsVerticalScrollIndicator, headerTitle } =
    parseBottomSheetChildren(children);

  // Animation config based on preset and reduced motion preference
  const animationConfigs = resolveBottomSheetAnimationConfig(animationPreset, isReducedMotion);
  const accessibilityAnnouncementDelay = resolveAccessibilityAnnouncementDelay(animationPreset, isReducedMotion);

  const isGlass = variant === 'glass';

  // Resolved sheet surface color — consumer override falls back to the theme token.
  // Shared across background fill, handle rounded top, and footer to avoid seams.
  const resolvedBackgroundColor = backgroundColor ?? colors.backgroundMenu;
  const footerProps = React.isValidElement(footerChild) ? (footerChild.props as EtBottomSheetFooterProps) : undefined;

  // Backdrop render function
  const renderBackdrop = useEtBottomSheetBackdrop(backdrop, closeOnBackdrop, testID);

  // Footer render function and height management
  const { renderFooter, footerHeight, resetFooterHeight } = useEtBottomSheetFooter({
    footerChild,
    backgroundColor: resolvedBackgroundColor,
    bottomInset: insets.bottom,
    variant,
    transparent: footerProps?.transparent === true,
    scrollFade: footerProps?.scrollFade,
  });

  // Compute sheet name for accessibility announcements
  const sheetName = accessibilityLabel || headerTitle || 'Bottom sheet';

  // Render function for handle component
  const renderHandle = (handleProps: React.ComponentProps<typeof EtBottomSheetHandle>) => (
    <EtBottomSheetHandle
      {...handleProps}
      showHandle={showHandle}
      variant={variant}
      backgroundColor={resolvedBackgroundColor}
      testID={`${testID}-handle`}
    />
  );

  // Solid background forwards the resolved surface color; glass keeps its own BlurView background.
  const renderSolidBackground = (bgProps: React.ComponentProps<typeof EtBottomSheetBackground>) => (
    <EtBottomSheetBackground {...bgProps} backgroundColor={resolvedBackgroundColor} />
  );

  const backgroundComponent = isGlass ? EtGlassBottomSheetBackground : renderSolidBackground;

  /**
   * Handles sheet snap point changes.
   * - Updates internal presentation state
   * - Resets footer height measurement on close
   * - Calls onOpen callback on open transition
   * - Forwards to user's onChange callback
   * - Announces "opened" to screen readers (closed is announced in handleDismiss)
   */
  const handleSheetChanges = (index: number) => {
    const presented = index >= 0;
    setIsPresented(presented);

    // Reset footer height when sheet closes to ensure fresh measurement on reopen
    if (!presented) {
      resetFooterHeight();
    }

    // Call user's onChange callback
    onChange?.(index);

    // Handle open transition (close is handled in handleDismiss after animation)
    const wasPresented = wasPresentedRef.current;
    if (presented && !wasPresented) {
      wasPresentedRef.current = true;
      // Notify the app-float-overlay layer so it re-asserts front.
      // See `sheet-presentation.store.ts`. Balanced by a
      // `notifySheetDismissed()` in `handleDismiss` (or the unmount cleanup
      // above if the component tears down while still presented).
      sheetTokenRef.current = notifySheetPresented();
      owesDismissNotifyRef.current = true;
      tokenGenerationRef.current = presentGeneration;
      onOpen?.();
      // Announce opened with delay to ensure sheet is visually present
      // Store timeout ID for cleanup on unmount
      if (accessibilityAnnouncementDelay === 0) {
        if (isMountedRef.current) {
          AccessibilityInfo.announceForAccessibility(`${sheetName} opened`);
        }
        announcementTimeoutRef.current = null;
        return;
      }
      announcementTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          AccessibilityInfo.announceForAccessibility(`${sheetName} opened`);
        }
        announcementTimeoutRef.current = null;
      }, accessibilityAnnouncementDelay);
    } else if (!presented && wasPresented) {
      wasPresentedRef.current = false;
      // Re-arm the early-bump guard so a reopen fires `notifySheetPresenting`
      // again at its next `onAnimate`-open-start.
      hasNotifiedPresentingRef.current = false;
      // Intentionally do NOT clear the dismiss ledger here. Gorhom fires
      // `onChange(-1)` before it fires `onDismiss` (see
      // `BottomSheetModal.tsx` — `handleBottomSheetOnChange` runs, then
      // `handleBottomSheetOnClose` calls `unmount()` which fires
      // `_providedOnDismiss`). At `onChange(-1)` the sheet's
      // `FullWindowOverlay` is still attached; clearing the ledger here would
      // let a waiting `useYieldForNativeSurface` resolve during the dismiss
      // animation and present a native VC BEHIND the still-attached overlay —
      // reintroducing the original PM-636 defect. `handleDismiss` (paired
      // `onDismiss`) is the correct signal, and matches the yield's own
      // documented contract in `use-yield-for-native-surface.ts`. The store's
      // 5s `awaitAllSheetsDismissed` timeout in `sheet-presentation.store.ts`
      // handles the theoretical case where `onChange(-1)` fires without a
      // paired `onDismiss` (which gorhom itself never produces — the only
      // real path there is component unmount mid-close, already covered by
      // the unmount cleanup above).
      // Clear pending "opened" announcement if sheet closes before delay completes
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
        announcementTimeoutRef.current = null;
      }
    }
  };

  /**
   * Handles the start of a sheet animation (gorhom `onAnimate`, fired before the
   * transition settles). On the OPEN transition only (`fromIndex < 0 &&
   * toIndex >= 0`) and ONCE per present, bumps the presentation counter early via
   * `notifySheetPresenting()` so the app-level reassert bridge re-fronts the
   * app-controlled overlay layer at the *start* of the open animation — removing
   * the transient flash where the sheet paints over an already-visible overlay
   * for the whole animation. The settle bump in `handleSheetChanges`
   * (`notifySheetPresented`) is retained as a floor.
   *
   * `onAnimate` fires on EVERY animation (drags, snap-point changes, close), so
   * the open-transition check + the once-per-present guard are load-bearing.
   * Always forwards to the consumer's `onAnimate` — and note gorhom only invokes
   * this callback at all because we pass it unconditionally (it early-returns
   * when no `onAnimate` prop is provided), so this wrapper must never be omitted.
   */
  const handleAnimate = (fromIndex: number, toIndex: number, fromPosition: number, toPosition: number) => {
    const isOpenTransition = fromIndex < 0 && toIndex >= 0;
    if (isOpenTransition && !hasNotifiedPresentingRef.current) {
      hasNotifiedPresentingRef.current = true;
      notifySheetPresenting();
    }
    onAnimate?.(fromIndex, toIndex, fromPosition, toPosition);
  };

  /**
   * Handles sheet dismiss event.
   * Called when the sheet is fully dismissed (animation complete).
   */
  const handleDismiss = () => {
    // `remountOnPresent`: the instance a newer `present()` has already replaced still fires its
    // own `onDismiss` while React tears it down — gorhom's portal cleanup unmounts any non-idle
    // modal through `_providedOnDismiss`. That dismiss belongs to the OLD sheet: it may settle the
    // shared bookkeeping only while that bookkeeping is still its own, and it must never reach
    // the consumer, whose `onClose` would otherwise run against the fresh sheet (clearing the
    // content it was just given, or closing it right after it opened).
    const isSuperseded = remountOnPresent && presentGeneration !== latestGenerationRef.current;
    const ownsSharedState = tokenGenerationRef.current === presentGeneration;
    if (isSuperseded && !ownsSharedState) {
      return;
    }
    // Counterpart to `notifySheetPresented` — decrements the presented-sheet
    // count so `useYieldForNativeSurface` can await "all sheets dismissed"
    // before presenting a native VC. Guarded by the owes-dismiss ref so an
    // unmount-driven dismiss doesn't double-decrement.
    if (owesDismissNotifyRef.current) {
      owesDismissNotifyRef.current = false;
      const token = sheetTokenRef.current;
      sheetTokenRef.current = null;
      if (token !== null) {
        notifySheetDismissed(token);
      }
    }
    // Belt-and-suspenders reset of the present-transition latch: normally the
    // `!presented && wasPresented` branch of `handleSheetChanges` clears this
    // when gorhom fires `onChange(-1)`, but if `onDismiss` completes without a
    // paired `onChange(-1)` the latch stays true and a subsequent present is
    // silently skipped — `AppFloatOverlayHost` would then never re-assert front
    // over the re-presented sheet.
    wasPresentedRef.current = false;
    // Mirror-reset the early-bump guard so a subsequent present re-fires
    // `notifySheetPresenting` at its next `onAnimate`-open-start.
    hasNotifiedPresentingRef.current = false;
    if (isSuperseded) {
      return;
    }
    onClose?.();
    // Announce closed after animation completes
    if (isMountedRef.current) {
      AccessibilityInfo.announceForAccessibility(`${sheetName} closed`);
    }
  };

  // Auto-calculate max height for scrollable content
  // When content is scrollable, we need to cap the sheet height so the scroll view
  // has a constrained area to scroll within.
  const autoMaxHeight = isScrollable ? screenHeight * SCROLLABLE_CONTENT_MAX_HEIGHT_RATIO : undefined;
  const effectiveMaxDynamicContentSize = maxDynamicContentSize ?? autoMaxHeight;

  // Determine if we should use dynamic sizing or snap points
  // Auto-disable dynamic sizing for virtualized lists (they require snapPoints)
  const useDynamicSizing = enableDynamicSizing && !snapPoints && !isVirtualizedList;

  // Warn developers about incompatible configuration (dev only)
  if (__DEV__ && isVirtualizedList && enableDynamicSizing && !snapPoints) {
    console.warn(
      'EtBottomSheet: Virtualized lists (List, SectionList, FlashList) require snapPoints. ' +
        'Dynamic sizing has been auto-disabled. Please provide snapPoints prop for proper behavior.',
    );
  }

  // Decide when to auto-disable content panning so the scroll container owns
  // vertical gestures, split by platform + content type:
  // - iOS + scrollable Content: scroll view must own vertical gestures.
  // - Android + virtualized list: the sheet's content-pan gesture otherwise
  //   captures swipes before BottomSheetFlatList, blocking list scroll (PAH-...).
  // We intentionally do NOT auto-disable for Android scrollable/static Content:
  // disabling it there lets the backdrop's press-to-close win every inner tap
  // (gorhom + react-native-gesture-handler Android quirk — PAH-430).
  const shouldDisableContentPanningForScroll = (Platform.OS === 'ios' && isScrollable) || (Platform.OS === 'android' && isVirtualizedList);

  // Backdrop is enabled by default unless explicitly disabled
  const shouldShowBackdrop = backdrop?.enabled !== false;

  const accessibilityContainerComponent = useBottomSheetAccessibilityContainer({
    isDismissible: closeOnBackdrop || enablePanDownToClose,
    onBeforeClose,
    onDismiss: () => bottomSheetRef.current?.dismiss(),
  });
  const containerComponent = useMemo(
    () => accessibilityContainerComponent ?? resolveBottomSheetContainerComponent(disableFullWindowOverlay),
    [accessibilityContainerComponent, disableFullWindowOverlay],
  );

  // Render layout based on content type (virtualized, scrollable, or static)
  const layoutContent = renderBottomSheetLayout({
    headerChild,
    contentChild,
    footerChild,
    isScrollable,
    isVirtualizedList,
    showsVerticalScrollIndicator,
    footerHeight,
    bottomInset: insets.bottom,
    testID,
    onScroll,
    onContentSizeChange,
    onScrollViewLayout,
  });

  return (
    <BottomSheetModal
      ref={remountOnPresent ? internalModalRef : bottomSheetRef}
      key={remountOnPresent ? presentGeneration : undefined}
      // Sizing
      snapPoints={snapPoints}
      enableDynamicSizing={useDynamicSizing}
      maxDynamicContentSize={effectiveMaxDynamicContentSize}
      topInset={topInset}
      bottomInset={effectiveBottomInset}
      detached={detached}
      // Stack behavior — how this modal interacts with already-presented modals
      stackBehavior={stackBehavior}
      // Gestures
      enablePanDownToClose={enablePanDownToClose}
      enableHandlePanningGesture={enableHandlePanningGesture}
      // Auto-disable content panning so the scroll container owns vertical gestures:
      // - iOS + scrollable Content (BottomSheetScrollView owns gestures).
      // - Android + virtualized list (List/SectionList/FlashList): otherwise the
      //   sheet's content-pan gesture captures swipes before BottomSheetFlatList and
      //   the list cannot scroll.
      // Android scrollable/static Content is deliberately left enabled (PAH-430): with
      // it disabled the backdrop's press-to-close wins inner taps. An explicit
      // enableContentPanningGesture prop from the consumer always wins (?? fallback).
      enableContentPanningGesture={
        shouldDisableContentPanningForScroll ? (enableContentPanningGesture ?? false) : effectiveEnableContentPanningGesture
      }
      enableOverDrag={enableOverDrag}
      overDragResistanceFactor={overDragResistanceFactor}
      // Keyboard
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      enableBlurKeyboardOnGesture={enableBlurKeyboardOnGesture}
      android_keyboardInputMode={android_keyboardInputMode}
      // Components
      containerComponent={containerComponent}
      backdropComponent={shouldShowBackdrop ? renderBackdrop : undefined}
      footerComponent={renderFooter}
      handleComponent={renderHandle}
      backgroundComponent={backgroundComponent}
      // Styles
      style={style}
      backgroundStyle={backgroundStyle}
      // Animation
      animateOnMount
      animationConfigs={animationConfigs}
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      // Callbacks
      onChange={handleSheetChanges}
      onAnimate={handleAnimate}
      onDismiss={handleDismiss}
      // Accessibility
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      accessibilityViewIsModal={true}
    >
      <BottomSheetProvider
        bottomSheetRef={bottomSheetRef}
        showHandle={showHandle}
        closeOnBackdrop={closeOnBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        isLoading={loading}
        isPresented={isPresented}
        onBeforeClose={onBeforeClose}
      >
        {layoutContent}
      </BottomSheetProvider>
    </BottomSheetModal>
  );
}

EtBottomSheetRoot.displayName = 'EtBottomSheet';

/**
 * EtBottomSheet with compound components attached
 *
 * ## Components:
 * - `EtBottomSheet.Header` - Header with Title and Action subcomponents
 * - `EtBottomSheet.Content` - Content area (scrollable or static)
 * - `EtBottomSheet.List` - Virtualized FlatList for large datasets (50+ items)
 * - `EtBottomSheet.SectionList` - Virtualized SectionList for grouped data
 * - `EtBottomSheet.FlashList` - High-performance FlashList for very large datasets (100+ items)
 * - `EtBottomSheet.Footer` - Sticky footer with keyboard handling
 */
export const EtBottomSheet = Object.assign(EtBottomSheetRoot, {
  Header: EtBottomSheetHeader,
  Content: EtBottomSheetContent,
  List: EtBottomSheetList,
  SectionList: EtBottomSheetSectionList,
  FlashList: EtBottomSheetFlashList,
  Footer: EtBottomSheetFooter,
});
