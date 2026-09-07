import type { ReactNode } from 'react';
import { AccessibilityRole, StyleProp, ViewStyle } from 'react-native';

import type { DsReactIconName } from '../ds-react/ds-react-icon-gallery';

// Icon variant types
export enum IconVariant {
  Regular = 'regular',
  Filled = 'filled',
  Outlined = 'outlined',
  Light = 'light',
  Duotone = 'duotone',
  DuotoneLine = 'duotone-line',
}

// Size presets + custom number
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

/**
 * `name` on {@link EtIconProps}: use **`DsReactIconName`** — every DS — React symbol from `DS_REACT_ICON_GALLERY` plus `{name}-fill`
 * (IDE autocomplete / Navigate → lists those local bundled icons). For **Zappicons CDN-only** names not on that sheet, the type still allows
 * any string via `(string & {})` without turning the union into plain `string`.
 */
export type IconName = DsReactIconName | (string & {});

/**
 * Props for EtIcon
 * @example
 * <EtIconV2 name="settings" />
 * <EtIconV2 name="bell" variant="filled" size="lg" />
 * <EtIconV2 name="search" size={32} color="#FF0000" />
 */
export interface EtIconProps {
  /** Icon name from available set (required) */
  name: IconName;

  /** Icon variant style.
   *  Defaults to `IconVariant.Regular` if not specified. */
  variant?: IconVariant;

  /** Icon size - preset or custom number. Default: 'md' (20px)
   *  Presets: xs=12, sm=16, md=20, lg=24, xl=32, 2xl=48 */
  size?: IconSize;

  /** Icon color. Omit to use theme `textPrimaryNeutral`; pass a string to override. */
  color?: string;

  /** Container style */
  style?: StyleProp<ViewStyle>;

  // Accessibility
  /** Test ID for testing */
  testID?: string;

  /** Accessibility label - describes the icon for screen readers */
  accessibilityLabel?: string;

  /** Accessibility role - default is 'image', use 'button' for interactive icons */
  accessibilityRole?: AccessibilityRole;

  /** Press handler - when provided, icon becomes an interactive button */
  onPress?: () => void;

  /** Whether the element is accessible - auto-detected if not provided */
  accessible?: boolean;

  /**
   * Per-usage override for RTL auto-mirroring. Registered navigation glyphs
   * (chevrons, back/forward arrows) mirror automatically in RTL; pass `false`
   * to keep one physical, or `true` to mirror a glyph that isn't registered
   * (e.g. a CDN-only directional icon). Has no effect in LTR.
   */
  flipInRTL?: boolean;

  /**
   * Renders a bundled/local SVG instead of loading from the Zappicons CDN.
   * Receives resolved pixel size and theme color (same contract as CDN icons).
   * When set, `variant` does not apply (your SVG encodes style).
   */
  renderIcon?: (params: { size: number; color: string }) => ReactNode;
}
