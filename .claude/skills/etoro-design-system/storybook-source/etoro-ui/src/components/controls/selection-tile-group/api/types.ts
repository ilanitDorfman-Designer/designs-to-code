import { PropsWithChildren, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import type { EntryOrExitLayoutType } from 'react-native-reanimated';

import type { InputFieldProps } from '../../../input/input-v2/api/types';

/** Visual variant for the selection tile group */
export type SelectionTileVariant = 'icon' | 'radio' | 'toggle' | 'toggleInput';

/** Selection mode (only relevant for toggle/toggleInput variants) */
export type SelectionTileSelectionMode = 'single' | 'multi';

/**
 * Tile size.
 * - `small` (default): tile height fits its content (~56px for single-line labels).
 * - `large`: tile has a minimum height of 84px, matching the KYC/personal-details
 *   style where options are displayed prominently.
 */
export type SelectionTileSize = 'small' | 'large';

// ---------------------------------------------------------------------------
// Group props — discriminated union for single vs multi select
// ---------------------------------------------------------------------------

interface EtSelectionTileGroupBaseProps extends PropsWithChildren {
  /** Disabled state for all options */
  disabled?: boolean;

  /** Enable haptic feedback (default: true) */
  haptics?: boolean;

  /** Tile size (default: 'small'). Use 'large' for prominent 84px-min-height tiles. */
  size?: SelectionTileSize;

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for the group */
  accessibilityLabel?: string;
}

/**
 * Single-select props — used by `icon`, `radio`, `toggle`, and `toggleInput`
 * with `selectionMode="single"`.
 *
 * @example icon variant (default)
 * ```tsx
 * <EtSelectionTileGroup value={selected} onChange={setSelected}>
 *   <EtSelectionTileGroup.Option value="a">Option A</EtSelectionTileGroup.Option>
 * </EtSelectionTileGroup>
 * ```
 *
 * @example radio variant
 * ```tsx
 * <EtSelectionTileGroup variant="radio" value={selected} onChange={setSelected}>
 *   <EtSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">Moderate</EtSelectionTileGroup.Option>
 * </EtSelectionTileGroup>
 * ```
 */
export interface EtSelectionTileGroupSingleProps extends EtSelectionTileGroupBaseProps {
  /** Visual variant (default: 'icon') */
  variant?: SelectionTileVariant;

  /** Selection mode — only meaningful for toggle/toggleInput variants (default: 'single') */
  selectionMode?: 'single';

  /** Currently selected value */
  value: string | null;

  /**
   * Callback when selection changes.
   * Emits `null` when a `toggle` or `toggleInput` option is re-pressed to deselect.
   * Deselection is unsupported for `icon` and `radio` variants — they never emit `null`.
   */
  onChange: (value: string | null) => void;
}

/**
 * Multi-select props — only valid with `variant="toggle"` or `variant="toggleInput"`
 * and `selectionMode="multi"`.
 *
 * @example
 * ```tsx
 * <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={selected} onChange={setSelected}>
 *   <EtSelectionTileGroup.Option value="a">Option A</EtSelectionTileGroup.Option>
 *   <EtSelectionTileGroup.Option value="b">Option B</EtSelectionTileGroup.Option>
 * </EtSelectionTileGroup>
 * ```
 */
export interface EtSelectionTileGroupMultiProps extends EtSelectionTileGroupBaseProps {
  /** Must be 'toggle' or 'toggleInput' for multi-select */
  variant: 'toggle' | 'toggleInput';

  /** Must be 'multi' */
  selectionMode: 'multi';

  /** Currently selected values */
  value: string[];

  /** Callback when selection changes */
  onChange: (value: string[]) => void;
}

export type EtSelectionTileGroupProps = EtSelectionTileGroupSingleProps | EtSelectionTileGroupMultiProps;

// ---------------------------------------------------------------------------
// Option props
// ---------------------------------------------------------------------------

/**
 * Inline input config for `toggleInput` option variant.
 */
export interface SelectionTileOptionInputProps {
  /** Optional floating label text shown above the input field */
  label?: string;

  /** Initial input value */
  defaultValue?: string;

  /** Props passed to `EtInput.Field` */
  fieldProps?: Omit<InputFieldProps, 'ref' | 'defaultValue'>;

  /** Input container style override */
  style?: StyleProp<ViewStyle>;

  /** Validation error message rendered below the input, inside the tile */
  errorMessage?: string | null;
}

/**
 * Props for EtSelectionTileGroup.Option
 */
export interface SelectionTileOptionProps {
  /** Unique value for this option */
  value: string;

  /** Label — plain string or rich inline nodes (e.g. text with a tappable link). */
  children: ReactNode;

  /** Secondary text line (works with any variant, primarily used with `radio`). Accepts a string or rich inline nodes (e.g. colored segments). */
  subtitle?: ReactNode;

  /** Icon name for `icon` variant — defaults to `'angle-right'` */
  iconName?: string;

  /** Inline input customizations for `toggleInput` variant (default input still renders if omitted) */
  input?: SelectionTileOptionInputProps;

  /** Option-level disabled (combines with group disabled) */
  disabled?: boolean;

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Override the title text variant (defaults to variant-based logic) */
  titleVariant?: 'heading-compact' | 'body-secondary-medium';

  /** Reanimated entrance layout animation applied to the tile (e.g. a staggered fade-in). */
  entering?: EntryOrExitLayoutType;

  /** Reanimated exit layout animation applied to the tile. */
  exiting?: EntryOrExitLayoutType;

  /** Reanimated entrance layout animation for the inline input (`toggleInput` variant). */
  innerEntering?: EntryOrExitLayoutType;

  /** Reanimated exit layout animation for the inline input (`toggleInput` variant). */
  innerExiting?: EntryOrExitLayoutType;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface SelectionTileGroupContextValue {
  /** Currently selected value(s) — string | null for single, string[] for multi */
  value: string | null | string[];

  /** Handler to select a value (haptics handled internally) */
  onSelect: (value: string) => void;

  /** Whether the group is disabled */
  disabled: boolean;

  /** Active variant */
  variant: SelectionTileVariant;

  /** Active selection mode */
  selectionMode: SelectionTileSelectionMode;

  /** Active tile size */
  size: SelectionTileSize;
}
