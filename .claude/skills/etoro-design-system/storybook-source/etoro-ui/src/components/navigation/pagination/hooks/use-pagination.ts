import { useCallback, useEffect, useMemo, useState } from 'react';
import { SharedValue, useAnimatedReaction, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { clampPage } from '../utils/clamp-page';

export interface UsePaginationOptions {
  /** Total number of pages */
  totalPages: number;
  /** Initial page index (0-indexed, defaults to 0) */
  initialPage?: number;
  /** Width of each item for scroll-driven pagination (enables scroll handler) */
  itemWidth?: number;
}

export interface UsePaginationResult {
  /** Current page index (0-indexed) - use for display logic (e.g., step titles) */
  currentPage: number;
  /** Current page as SharedValue - pass to EtPagination for optimal performance */
  currentPageAnimated: SharedValue<number>;

  // Navigation functions
  /** Navigate to the next page (clamped to bounds) */
  goToNext: () => void;
  /** Navigate to the previous page (clamped to bounds) */
  goToPrevious: () => void;
  /** Navigate to a specific page (clamped to bounds) */
  goToPage: (page: number) => void;

  // Computed state
  /** Whether the current page is the first page */
  isFirstPage: boolean;
  /** Whether the current page is the last page */
  isLastPage: boolean;
  /** Whether navigation to the next page is possible */
  canGoNext: boolean;
  /** Whether navigation to the previous page is possible */
  canGoPrevious: boolean;

  // Scroll features
  /** Animated scroll handler - attach to Animated.ScrollView/FlatList onScroll */
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  /** Get the scroll offset for a specific page (useful for programmatic scrolling) */
  getScrollOffsetForPage: (page: number) => number;
}

// ---------------------------------------------------------------------------
// Internal: config normalization
// ---------------------------------------------------------------------------

interface NormalizedPaginationOptions {
  totalPages: number;
  initialPage: number;
  itemWidth: number | undefined;
}

/**
 * Normalizes raw UsePaginationOptions into validated, clamped values.
 *
 * - Applies default for initialPage (0)
 * - Clamps initialPage to valid bounds using clampPage
 * - Passes through totalPages and itemWidth
 */
function useNormalizedPaginationOptions(options: UsePaginationOptions): NormalizedPaginationOptions {
  const { totalPages, initialPage: rawInitialPage = 0, itemWidth } = options;

  return useMemo(() => {
    const initialPage = clampPage(rawInitialPage, totalPages);

    return { totalPages, initialPage, itemWidth };
  }, [totalPages, rawInitialPage, itemWidth]);
}

// ---------------------------------------------------------------------------
// Internal: state, animation & navigation handlers
// ---------------------------------------------------------------------------

/**
 * Manages pagination state, animations, and navigation handlers.
 *
 * Takes normalized options and provides currentPage (React state),
 * currentPageAnimated (SharedValue), navigation functions, scroll handler,
 * and computed navigation state.
 */
function usePaginationInternalState(config: NormalizedPaginationOptions): UsePaginationResult {
  const { totalPages, initialPage, itemWidth } = config;

  // React state for discrete updates and computed values
  const [currentPage, setCurrentPage] = useState(() => initialPage);

  // SharedValue for smooth animations (synced with React state)
  const currentPageAnimated = useSharedValue(currentPage);

  // Clamp currentPage when totalPages shrinks below the current position
  useEffect(() => {
    setCurrentPage((prev) => {
      const clamped = clampPage(prev, totalPages);

      return clamped !== prev ? clamped : prev;
    });
  }, [totalPages]);

  // Sync React state changes to SharedValue
  useEffect(() => {
    currentPageAnimated.value = currentPage;
  }, [currentPage, currentPageAnimated]);

  // Callback for updating React state from scroll handler (via runOnJS)
  const updatePageFromScroll = useCallback((page: number) => {
    setCurrentPage((prev) => (prev !== page ? page : prev));
  }, []);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentPage((prev) => clampPage(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrevious = useCallback(() => {
    setCurrentPage((prev) => clampPage(prev - 1, totalPages));
  }, [totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(clampPage(page, totalPages));
    },
    [totalPages],
  );

  // Scroll handler - updates SharedValue (React state synced via useAnimatedReaction)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (itemWidth && itemWidth > 0 && totalPages > 0) {
        const offsetX = event.contentOffset.x;
        const position = Math.round(offsetX / itemWidth);
        const clampedPosition = Math.max(0, Math.min(position, totalPages - 1));

        // Update SharedValue immediately for smooth animations
        currentPageAnimated.value = clampedPosition;
      }
    },
  });

  // Sync SharedValue changes to React state (for computed values like canGoNext)
  useAnimatedReaction(
    () => currentPageAnimated.value,
    (currentValue, previousValue) => {
      if (previousValue !== null && currentValue !== previousValue) {
        scheduleOnRN(updatePageFromScroll, currentValue);
      }
    },
    [updatePageFromScroll],
  );

  // Helper to get scroll offset for programmatic scrolling
  const getScrollOffsetForPage = useCallback(
    (page: number) => {
      return page * (itemWidth ?? 0);
    },
    [itemWidth],
  );

  // Computed navigation state
  const navigationState = useMemo(() => {
    const isFirstPage = currentPage === 0;
    const isLastPage = totalPages <= 0 || currentPage === totalPages - 1;

    return {
      isFirstPage,
      isLastPage,
      canGoNext: !isLastPage,
      canGoPrevious: !isFirstPage,
    };
  }, [currentPage, totalPages]);

  return {
    currentPage,
    currentPageAnimated,
    goToNext,
    goToPrevious,
    goToPage,
    ...navigationState,
    scrollHandler,
    getScrollOffsetForPage,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Unified hook for pagination state and interactivity.
 *
 * Provides both navigation controls (for step wizards, onboarding) and
 * scroll-driven pagination (for carousels) in a single hook.
 *
 * @param options - Configuration options
 * @returns Pagination state, navigation functions, and scroll handlers
 *
 * @example Onboarding flow with navigation buttons
 * ```tsx
 * // currentPage for display, currentPageAnimated for EtPagination
 * const {
 *   currentPage,
 *   currentPageAnimated,
 *   goToNext,
 *   goToPrevious,
 *   canGoNext,
 *   canGoPrevious,
 *   isLastPage,
 * } = usePagination({ totalPages: 4 });
 *
 * return (
 *   <>
 *     <OnboardingStep step={currentPage} />
 *     <EtPagination totalPages={4} currentPage={currentPageAnimated} />
 *     <Button onPress={goToPrevious} disabled={!canGoPrevious}>Previous</Button>
 *     <Button onPress={isLastPage ? finishOnboarding : goToNext}>
 *       {isLastPage ? 'Get Started' : 'Next'}
 *     </Button>
 *   </>
 * );
 * ```
 *
 * @example Carousel with scroll-driven pagination
 * ```tsx
 * // Pass currentPageAnimated directly for optimal performance
 * const { currentPageAnimated, scrollHandler } = usePagination({
 *   totalPages: 5,
 *   itemWidth: CARD_WIDTH + CARD_GAP,
 * });
 *
 * return (
 *   <>
 *     <Animated.FlatList
 *       horizontal
 *       data={items}
 *       onScroll={scrollHandler}
 *       scrollEventThrottle={16}
 *       snapToInterval={CARD_WIDTH + CARD_GAP}
 *       decelerationRate="fast"
 *       renderItem={renderItem}
 *     />
 *     <EtPagination totalPages={5} currentPage={currentPageAnimated} color="primary" />
 *   </>
 * );
 * ```
 *
 * @example Carousel with programmatic navigation
 * ```tsx
 * const flatListRef = useRef<FlatList>(null);
 * const { currentPageAnimated, scrollHandler, goToPage, getScrollOffsetForPage } = usePagination({
 *   totalPages: 5,
 *   itemWidth: 300,
 * });
 *
 * const handleGoToPage = (page: number) => {
 *   goToPage(page);
 *   flatListRef.current?.scrollToOffset({
 *     offset: getScrollOffsetForPage(page),
 *     animated: true,
 *   });
 * };
 * ```
 */
export function usePagination(options: UsePaginationOptions = { totalPages: 0 }): UsePaginationResult {
  const normalizedOptions = useNormalizedPaginationOptions(options);

  return usePaginationInternalState(normalizedOptions);
}
