import { HALF, X3, X4, X16 } from '../../../../core/styles/spacing';

/**
 * Canonical box model for EtInput v2: same values as `et-input` `styles.inputContainer`
 * and the inner-height math in `use-input-animations` (floating label + field row inset).
 * Spacing tokens are composed here only; consumers import these named values.
 */
export const INPUT_LAYOUT_METRICS = {
  /** Total fixed height of the input surface (includes vertical padding). */
  containerHeight: X16,
  paddingVertical: X3,
  paddingHorizontal: X4,
} as const;

/**
 * Inner content height: container height minus top and bottom padding
 * (label overlay + value row area).
 */
export const INPUT_INNER_HEIGHT = INPUT_LAYOUT_METRICS.containerHeight - 2 * INPUT_LAYOUT_METRICS.paddingVertical;

/**
 * Visual gap between compact label and the value (`HALF` / 2px — matches former column `gap: 2` and field `paddingTop` end value).
 */
export const INPUT_COMPACT_LABEL_FIELD_GAP = HALF;
