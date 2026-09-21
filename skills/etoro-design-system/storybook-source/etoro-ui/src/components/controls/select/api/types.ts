import { ReactNode } from 'react';
import { DimensionValue, StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Visual type of the select trigger.
 *
 * - `'text'` — Inline semibold text with trailing chevron. Always interactive (no disabled state).
 * - `'field'` — Bordered container. Auto-switches between empty (placeholder) and filled
 *   appearance based on the presence of EtSelect.Label or EtSelect.LeadingContent.
 */
export type EtSelectType = 'text' | 'field';

/**
 * Props for the EtSelect root component.
 *
 * @example
 * // Text type — inline select trigger
 * <EtSelect type="text" onPress={handlePress}>
 *   <EtSelect.Value>Select</EtSelect.Value>
 * </EtSelect>
 *
 * @example
 * // Field type — empty placeholder
 * <EtSelect type="field" onPress={handlePress}>
 *   <EtSelect.Value>Select</EtSelect.Value>
 * </EtSelect>
 *
 * @example
 * // Field type — filled with label + leading content
 * <EtSelect type="field" onPress={handlePress}>
 *   <EtSelect.Label>Country of residence</EtSelect.Label>
 *   <EtSelect.LeadingContent>
 *     <EtCountryFlag isoCode="GB" size={20} />
 *   </EtSelect.LeadingContent>
 *   <EtSelect.Value>United Kingdom</EtSelect.Value>
 * </EtSelect>
 */
export interface EtSelectProps {
  /** Compound children (EtSelect.Value, EtSelect.Label, EtSelect.LeadingContent, or string shorthand) */
  children: ReactNode;
  /** Callback when the select trigger is pressed */
  onPress: () => void;
  /** Visual type. Default: 'field' */
  type?: EtSelectType;
  /** Disable the select (only applies to 'field' type; 'text' is always interactive) */
  disabled?: boolean;
  /**
   * Readonly state — non-interactive with normal (non-dimmed) styling, chevron hidden.
   * Press handler no-ops; haptics suppressed. Field type only — ignored for text type.
   * When combined with `disabled`, disabled wins (chevron stays visible, dimmed colors apply).
   * Pair with an i18n'd `accessibilityHint` so screen readers announce the locked state.
   * Default: false
   */
  readonly?: boolean;
  /**
   * Show the trailing chevron icon. Field type only — ignored for text type, where the chevron is structural.
   * Forced to `false` when `readonly` is true (unless `disabled` is also true; disabled wins).
   * Default: true
   */
  showChevron?: boolean;
  /** Enable haptic feedback. Default: true */
  haptics?: boolean;
  /** Custom width for 'field' type (default: 335). Use 'auto' for flexible width. Ignored for 'text' type. */
  width?: DimensionValue;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint — describes what will happen when pressed */
  accessibilityHint?: string;
}

/** Props for EtSelect.Label subcomponent */
export interface EtSelectLabelProps {
  /** Label text content */
  children: ReactNode;
  /** Optional style override for the label text */
  style?: StyleProp<TextStyle>;
}

/** Props for EtSelect.Value subcomponent */
export interface EtSelectValueProps {
  /** Value text content */
  children: ReactNode;
  /** Optional style override for the value text */
  style?: StyleProp<TextStyle>;
  /** Test ID forwarded to the value text. */
  testID?: string;
}

/** Props for EtSelect.LeadingContent subcomponent. Works in both text and field types. */
export interface EtSelectLeadingContentProps {
  /** Content rendered before the value (e.g., icon, country flag) */
  children: ReactNode;
}
