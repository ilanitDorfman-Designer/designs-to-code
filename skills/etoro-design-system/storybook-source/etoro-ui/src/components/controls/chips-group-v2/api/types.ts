import { StyleProp, ViewStyle } from 'react-native';

import { IconName } from '../../../../foundations/icon-assets/api/types';

/** Selection mode for the chips group */
export type ChipsGroupSelectionMode = 'none' | 'single' | 'multi';

/** Layout mode */
export type ChipsGroupLayout = 'scroll' | 'wrap';

/** Individual chip item data */
export interface ChipsGroupItem {
  /** Unique identifier for this chip */
  id: string;
  /** Display label */
  label: string;
  /** Optional leading icon */
  icon?: IconName;
}

/** Props for single selection mode */
export interface ChipsGroupSingleSelectProps {
  selectionMode: 'single';
  /** Currently selected chip ID (controlled) */
  value: string | null;
  /** Called when selection changes */
  onChange: (value: string | null) => void;
}

/** Props for multi selection mode */
export interface ChipsGroupMultiSelectProps {
  selectionMode: 'multi';
  /** Currently selected chip IDs (controlled) */
  value: string[];
  /** Called when selection changes */
  onChange: (value: string[]) => void;
}

/** Props for non-selectable mode */
export interface ChipsGroupNoSelectProps {
  /** Display-only mode - chips are non-interactive */
  selectionMode?: 'none';
  value?: never;
  onChange?: never;
}

/** Discriminated union for selection props */
export type ChipsGroupSelectionProps = ChipsGroupSingleSelectProps | ChipsGroupMultiSelectProps | ChipsGroupNoSelectProps;

/**
 * EtChipsGroupV2 Props
 *
 * **Controlled-only component** - always provide value + onChange for single/multi modes.
 * No defaultValue/uncontrolled mode supported.
 *
 * @example Non-selectable (display only)
 * ```tsx
 * <EtChipsGroupV2 items={categories} selectionMode="none" />
 * ```
 *
 * @example Single select
 * ```tsx
 * const [selected, setSelected] = useState<string | null>(null);
 * <EtChipsGroupV2
 *   items={filters}
 *   selectionMode="single"
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 *
 * @example Multi select
 * ```tsx
 * const [selected, setSelected] = useState<string[]>([]);
 * <EtChipsGroupV2
 *   items={tags}
 *   selectionMode="multi"
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
export type EtChipsGroupV2Props = ChipsGroupSelectionProps & {
  /** Array of chip items to display */
  items: ChipsGroupItem[];

  /** Layout mode: 'scroll' (horizontal scrollable) or 'wrap' (multi-row) - default: 'scroll' */
  layout?: ChipsGroupLayout;

  /** Gap between chips in pixels - default: X2 (8px) */
  gap?: number;

  /**
   * Background color for fade overlays. Use this when the component is placed
   * on a non-white background to ensure the fade effect blends seamlessly.
   * Defaults to theme's bgNeutralPrimary (white in light mode, dark in dark mode).
   * @example fadeColor={colors.bgNeutralSecondary}
   */
  fadeColor?: string;

  /** Enable haptic feedback - default: true */
  haptics?: boolean;

  /** When true, selected chips reveal a close icon that can be tapped to deselect */
  showCloseOnSelected?: boolean;

  /** Container style */
  style?: StyleProp<ViewStyle>;

  /** Content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Test ID */
  testID?: string;

  /** Accessibility label for the group */
  accessibilityLabel?: string;

  /**
   * Initial horizontal scroll offset (px) applied to the scroll-layout rail on
   * mount. Use this to restore the rail's position when the component can be
   * duplicated/remounted by a host (e.g. a FlashList sticky-header copy), so a
   * freshly-mounted copy doesn't snap back to the start. No-op in `wrap` layout.
   */
  initialScrollOffsetX?: number;

  /**
   * Notified with the live horizontal scroll offset (px) as the user scrolls the
   * rail. Pair with {@link initialScrollOffsetX} to persist the position across
   * duplicated/remounted copies of the rail. No-op in `wrap` layout.
   */
  onScrollOffsetXChange?: (offsetX: number) => void;

  /**
   * Keeps the selected chip visible: if it sits outside the viewport the rail
   * scrolls just far enough to reveal it, and stays put when it is already in
   * view. Opt-in because it costs a per-chip measurement; enable it for rails
   * that can mount with an off-screen selection (e.g. a tab rail opened
   * directly on its last tab). No-op in `wrap` layout.
   */
  scrollSelectedIntoView?: boolean;
};
