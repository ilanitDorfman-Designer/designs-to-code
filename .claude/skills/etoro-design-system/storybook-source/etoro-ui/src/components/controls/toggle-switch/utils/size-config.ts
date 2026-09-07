import { type StyleProp, type ViewStyle } from 'react-native';

import type { ToggleSwitchSize } from '../api/types';

/**
 * Pre-computed transform styles for toggle switch size variants.
 * Uses scale transforms to resize the native Switch component.
 *
 * These are pre-computed constants to avoid creating new objects on every render.
 */
const SMALL_SCALE = 0.75;
const MEDIUM_SCALE = 1;

const SIZE_TRANSFORMS: Record<ToggleSwitchSize, StyleProp<ViewStyle>> = {
  small: { transform: [{ scaleX: SMALL_SCALE }, { scaleY: SMALL_SCALE }] },
  medium: { transform: [{ scaleX: MEDIUM_SCALE }, { scaleY: MEDIUM_SCALE }] },
};

/**
 * Get scale transform style for a toggle switch size variant.
 * Returns a stable reference to a pre-computed style object for performance.
 */
export function getSizeTransform(size: ToggleSwitchSize): StyleProp<ViewStyle> {
  return SIZE_TRANSFORMS[size];
}
