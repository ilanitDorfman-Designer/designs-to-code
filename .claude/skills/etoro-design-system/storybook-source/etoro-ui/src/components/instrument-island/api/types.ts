import { StyleProp, ViewStyle } from 'react-native';

import { AvatarShape } from '../../social/avatar';

// ============================================================================
// Data model
// ============================================================================

/**
 * A single instrument/trader entry rendered inside the island.
 *
 * The island is a "dumb" UI component — it never fetches or derives this data,
 * it only renders what it is handed. Keep entries primitive and pre-resolved.
 */
export interface IslandInstrument {
  /** Stable identity used for focus tracking and callbacks. */
  id: string;
  /** Short symbol (e.g. "BTC"). Used as the default focused label. */
  symbol: string;
  /** Optional longer label shown beneath the focused item. Falls back to `symbol`. */
  label?: string;
  /** Avatar image URL (instrument logo / trader photo). */
  imageUrl?: string;
  /** Fallback initials rendered when no image is available. */
  fallback?: string;
  /** Background color painted behind a transparent logo. */
  backgroundColor?: string;
  /**
   * Avatar shape. `square` for instruments (default), `circle` for people/traders.
   * @default 'square'
   */
  shape?: AvatarShape;
  /** Accent color for the alive edge glow when this item is focused. */
  accentColor?: string;
}

// ============================================================================
// Root component props
// ============================================================================

/**
 * Props for {@link EtInstrumentIsland}.
 */
export interface EtInstrumentIslandProps {
  /** Ordered instruments rendered in the rail (and represented as dots when collapsed). */
  items: IslandInstrument[];

  /** Controlled focused item id. Provide together with `onFocusChange`. */
  focusedId?: string;
  /** Initial focused id for uncontrolled mode. Defaults to the first item. */
  defaultFocusedId?: string;
  /** Fires when the centered/focused item changes. */
  onFocusChange?: (id: string) => void;

  /** Fires when the focused item is tapped again (e.g. to open it). */
  onItemPress?: (id: string) => void;

  /** Controlled expanded state. Provide together with `onExpandedChange`. */
  isExpanded?: boolean;
  /** Initial expanded state for uncontrolled mode. @default false */
  defaultExpanded?: boolean;
  /** Fires when the island expands (long-press) or collapses (outside tap). */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Width of the expanded island. Defaults to the screen width minus a comfortable margin.
   */
  expandedWidth?: number;

  /**
   * Render the animated chromatic "liquid glass" edge glow.
   * @default true
   */
  glow?: boolean;

  /**
   * Fire selection/impact haptics on iOS (long-press, focus change).
   * @default true
   */
  haptics?: boolean;

  /** Renders a full-window backdrop while expanded so outside taps collapse the island. @default true */
  dismissOnOutsidePress?: boolean;

  /** Style overrides for the outer (collapsed-footprint) container. */
  style?: StyleProp<ViewStyle>;

  /** Accessibility label for the collapsed pill. */
  accessibilityLabel?: string;

  /** Test id forwarded to the outer container. */
  testID?: string;
}

// ============================================================================
// Context
// ============================================================================

/**
 * Internal context shared with the island subcomponents.
 */
export interface InstrumentIslandContextValue {
  items: IslandInstrument[];
  focusedId: string;
  focusedIndex: number;
  /**
   * Transient focus shown by the label / a11y while the rail is in motion.
   * Mirrors `focusedIndex` at rest; updated per-crossing without re-rendering
   * the consumer screen, so fast scrolls stay smooth.
   */
  displayIndex: number;
  isExpanded: boolean;
  /** True while a long-press hold-scrub gesture is actively driving focus. */
  isScrubbing: boolean;
  glow: boolean;
  accentColor: string | undefined;
  onFocus: (id: string) => void;
  onItemActivate: (id: string) => void;
  /** Cheap per-crossing update during motion: selection haptic + displayed focus. */
  onCross: (index: number) => void;
  /** Propagate the settled focus to the parent once motion stops. */
  onSettle: (index: number) => void;
  /** Commit a selection by id (used by the hold-scrub release). */
  commit: (id: string) => void;
  onExpand: () => void;
  onCollapse: () => void;
}
