import { PropsWithChildren, ReactNode, Ref } from 'react';
import { PressableProps, ScrollView, ScrollViewProps, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { AnimatedProps, SharedValue } from 'react-native-reanimated';
import { TabViewProps } from 'react-native-tab-view';

// ──────────────────────────────────────────────
// Enums & Unions
// ──────────────────────────────────────────────

/** Variant for the tab list styling */
export type TabsListVariant = 'line' | 'plain';

// ──────────────────────────────────────────────
// Supporting types
// ──────────────────────────────────────────────

/** Route type for internal TabView navigation */
export interface TabRoute {
  key: string;
  title?: string;
}

/**
 * Layout information for a trigger
 */
export interface TriggerLayout {
  x: number;
  width: number;
}

/**
 * State portion of context (what data we track)
 */
export interface TabsState {
  /** Currently active tab value */
  activeValue: string;
}

/**
 * Actions portion of context (how to modify state)
 */
export interface TabsActions {
  /** Set the active tab value */
  setActiveValue: (value: string) => void;
}

/**
 * Meta portion of context (refs, animations, registrations)
 */
export interface TabsMeta {
  /**
   * Returns a read-only snapshot of the current trigger layouts.
   *
   * Each call returns a **new** `ReadonlyMap` so callers cannot
   * mutate the internal layout store.
   */
  getTriggerLayouts: () => ReadonlyMap<string, TriggerLayout>;

  /** Register a trigger's layout */
  registerTrigger: (value: string, layout: TriggerLayout) => void;

  /** Animate the indicator to the given tab value's layout */
  animateToValue: (value: string) => void;

  /** Shared value for indicator X position */
  indicatorX: SharedValue<number>;

  /** Shared value for indicator width */
  indicatorWidth: SharedValue<number>;

  /** Duration of the indicator animation in milliseconds */
  animationDuration: number;
}

/**
 * Complete context value following state/actions/meta pattern
 */
export interface TabsContextValue {
  state: TabsState;
  actions: TabsActions;
  meta: TabsMeta;
}

// ──────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────

/**
 * Props managed internally by TabsRoot (excluded from user-facing props)
 */
type InternalTabViewProps = 'navigationState' | 'onIndexChange' | 'renderScene' | 'renderTabBar' | 'initialLayout';

// ──────────────────────────────────────────────
// Main props interfaces
// ──────────────────────────────────────────────

/**
 * Props for EtTabs.Provider - manages state for tabs
 *
 * This is the only component that knows how state is managed.
 * Supports both controlled and uncontrolled modes.
 *
 * @example Uncontrolled usage
 * ```tsx
 * <EtTabs.Provider defaultValue="overview">
 *   <EtTabs.Root>
 *     <EtTabs.List>...</EtTabs.List>
 *     <EtTabs.Content value="overview">...</EtTabs.Content>
 *   </EtTabs.Root>
 *   <MyCustomTabIndicator />
 * </EtTabs.Provider>
 * ```
 *
 * @example Controlled usage
 * ```tsx
 * const [activeTab, setActiveTab] = useState('overview');
 * <EtTabs.Provider value={activeTab} onValueChange={setActiveTab}>
 *   ...
 * </EtTabs.Provider>
 * ```
 */
export interface TabsProviderProps extends PropsWithChildren {
  // -- State --
  /** Default active tab value (uncontrolled mode) */
  defaultValue?: string;

  /** Controlled active tab value */
  value?: string;

  // -- Appearance --
  /** Duration of the indicator animation in milliseconds (default: 200) */
  animationDuration?: number;

  // -- Interaction --
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void;
}

/**
 * Props for EtTabs.Root - contains the TabView component
 *
 * Additional props are spread to the underlying TabView.
 * Reads state from context (provided by EtTabs.Provider).
 * Handles TabView configuration and rendering.
 *
 * @example
 * ```tsx
 * <EtTabs.Provider defaultValue="overview">
 *   <EtTabs.Root swipeEnabled={false}>
 *     <EtTabs.List>...</EtTabs.List>
 *     <EtTabs.Content value="overview">...</EtTabs.Content>
 *   </EtTabs.Root>
 * </EtTabs.Provider>
 * ```
 *
 * @example With container style
 * ```tsx
 * <EtTabs.Root containerStyle={{ backgroundColor: 'white' }}>
 *   ...
 * </EtTabs.Root>
 * ```
 */
export interface TabsRootProps extends Omit<TabViewProps<TabRoute>, InternalTabViewProps> {
  // -- State --
  /** Children (EtTabs.List and EtTabs.Content components) */
  children?: ReactNode;

  // -- Appearance --
  /** Style for the outer container View */
  containerStyle?: StyleProp<ViewStyle>;

  // -- Accessibility --
  /** Test ID for the container */
  testID?: string;
}

/**
 * Props for EtTabs convenience wrapper
 *
 * Combines Provider + Root for simple usage.
 * Uses react-native-tab-view internally for full-page swipeable tabs.
 *
 * @example Uncontrolled usage
 * ```tsx
 * <EtTabs defaultValue="overview">
 *   <EtTabs.List>
 *     <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
 *     <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
 *   </EtTabs.List>
 *   <EtTabs.Content value="overview">
 *     <OverviewContent />
 *   </EtTabs.Content>
 *   <EtTabs.Content value="analytics">
 *     <AnalyticsContent />
 *   </EtTabs.Content>
 * </EtTabs>
 * ```
 *
 * @example Controlled usage
 * ```tsx
 * const [activeTab, setActiveTab] = useState('overview');
 * <EtTabs value={activeTab} onValueChange={setActiveTab}>
 *   ...
 * </EtTabs>
 * ```
 *
 * @example Disable swipe gestures
 * ```tsx
 * <EtTabs defaultValue="tab1" swipeEnabled={false}>
 *   ...
 * </EtTabs>
 * ```
 */
export interface EtTabsProps extends TabsProviderProps, TabsRootProps {}

/**
 * Props for EtTabs.List container
 *
 * Extends ViewProps for full extensibility.
 * The list is always horizontally scrollable. When tabs overflow,
 * gradient fade overlays appear at the edges.
 *
 * `accessibilityRole` is omitted because TabsList always sets it to "tablist".
 * `onLayout` is composed internally with the scroll-fade sizing handler,
 * so consumer-supplied handlers are called alongside the internal one.
 */
export interface TabsListProps extends Omit<ViewProps, 'children' | 'accessibilityRole'> {
  // -- State --
  /** Tab trigger children */
  children?: ReactNode;

  // -- Appearance --
  /** Visual variant: 'line' (with divider + indicator) or 'plain' (no divider, no indicator) */
  variant?: TabsListVariant;

  /**
   * Stretch triggers to fill the available width evenly (each trigger `flex: 1`) instead of sizing
   * to their labels in a horizontal scroll row. Use for a fixed, full-width tab bar (e.g. 2–3 tabs).
   * Composes with `variant` — `stretch` + `'line'` gives full-width underline tabs. When set, the
   * list does not scroll and the edge fades are omitted.
   */
  stretch?: boolean;

  // -- Interaction --
  /**
   * Props to pass to the underlying ScrollView.
   *
   * `onScroll`, `onContentSizeChange`, and `contentContainerStyle` are
   * excluded because they are managed internally by the scroll-fade overlay
   * logic. Overriding them would silently break the gradient fade indicators.
   */
  scrollViewProps?: Omit<ScrollViewProps, 'children' | 'horizontal' | 'onScroll' | 'onContentSizeChange' | 'contentContainerStyle'>;

  /**
   * Style merged into the ScrollView's content container (after the internal base style).
   *
   * Use this — not `style` — for horizontal lead-in padding: `style` pads the OUTER container,
   * which insets the scroll viewport itself, so scrolled-away labels clip hard at the padding
   * edge instead of the screen edge and edge fades can't sit over the cut. Content padding keeps
   * the viewport full-bleed so the clip (and the fades) land on the physical edge.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Ref forwarded to the underlying horizontal ScrollView for controlled scroll positioning. */
  scrollViewRef?: Ref<ScrollView>;
}

/**
 * Props for EtTabs.Trigger button
 *
 * Extends PressableProps for full extensibility.
 * Additional Pressable props are spread to the underlying component.
 *
 * `onPress` is omitted because TabsTrigger manages tab selection internally.
 * `onLayout` is composed internally with the indicator-tracking handler,
 * so consumer-supplied handlers are called alongside the internal one.
 */
export interface TabsTriggerProps extends Omit<PressableProps, 'onPress' | 'disabled' | 'children'> {
  // -- State --
  /** Unique value identifying this tab */
  value: string;

  /** Tab label text */
  children: string;

  // -- Appearance --
  /** Container style */
  style?: StyleProp<ViewStyle>;

  // -- Interaction --
  /** Disabled state for this trigger */
  disabled?: boolean;

  // -- Accessibility --
  /** Test ID for testing */
  testID?: string;

  /** Accessibility label (defaults to children text) */
  accessibilityLabel?: string;
}

/**
 * Props for EtTabs.Content panel
 *
 * Extends ViewProps for full extensibility.
 * Additional View props are spread to the underlying component.
 */
export interface TabsContentProps extends Omit<ViewProps, 'children'> {
  // -- State --
  /** Value matching the corresponding trigger */
  value: string;

  /** Tab content children */
  children?: ReactNode;

  // -- Interaction --
  /** Force render even when not active (default: false - lazy render) */
  forceMount?: boolean;
}

/**
 * Props for the internal TabsIndicator component
 *
 * Extends Animated.View props for full extensibility.
 * Additional props are spread to the underlying Animated.View.
 */
export interface TabsIndicatorProps extends Omit<AnimatedProps<ViewProps>, 'style'> {
  // -- Appearance --
  /** Container style */
  style?: StyleProp<ViewStyle>;
}
