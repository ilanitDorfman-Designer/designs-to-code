import type { StyleProp, ViewStyle } from 'react-native';

import type { TextVariant } from '../../../../foundations/text/utils/variant-config';

/**
 * Props for `EtDivider`.
 *
 * A horizontal separator line. When `label` is provided it renders as a
 * centered label flanked by two lines (the classic "── Or ──" pattern);
 * otherwise it renders a single full-width line.
 */
export interface EtDividerProps {
  /**
   * Optional centered label. When omitted, a single full-width line is
   * rendered. The component is i18n-agnostic — pass a pre-translated string.
   */
  label?: string;
  /** Typography variant for the label. Defaults to `body-secondary-regular`. */
  labelVariant?: TextVariant;
  /** Override the line color. Defaults to `colors.dividerTertiary`. */
  color?: string;
  /** Style override applied to the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Test id forwarded to the outer container. */
  testID?: string;
  /**
   * Accessibility label. Defaults to `label` when present; a plain
   * (label-less) divider is treated as decorative.
   */
  accessibilityLabel?: string;
}
