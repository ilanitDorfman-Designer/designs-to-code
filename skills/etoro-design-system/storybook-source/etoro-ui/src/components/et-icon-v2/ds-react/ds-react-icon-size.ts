import type { IconSize } from '../api/types';

/**
 * DS — React icon sizes (align with Figma dev specs).
 * Maps to the same tokens as {@link IconSize} for `sm` | `md` | `lg`.
 *
 * | Token | Pixels |
 * |-------|--------|
 * | `sm`  | 16     |
 * | `md`  | 20     |
 * | `lg`  | 24     |
 */
export type DsReactIconSize = 'sm' | 'md' | 'lg';

export const DS_REACT_ICON_SIZE_PX: Record<DsReactIconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

/** Use with `EtIconV2` when you want DS-aligned pixel sizes (16 / 20 / 24). */
export function dsReactIconSizeToIconSize(size: DsReactIconSize): Extract<IconSize, 'sm' | 'md' | 'lg'> {
  return size;
}
