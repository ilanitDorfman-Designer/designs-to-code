import type { ViewStyle } from 'react-native';

/**
 * Native variant: no backdrop blur — a DOM-only mechanic (platform-split per
 * kit convention; no `Platform.OS` branches). See `web-styles.web.ts`.
 */
export function getRailBlurStyle(): ViewStyle {
  return {};
}
