import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';

const window = Dimensions.get('screen');

const HEADER_HEIGHT = Platform.OS === 'ios' ? 115 : 70 + (StatusBar.currentHeight || 0);

/**
 * Visual height of the floating bottom tab bar (`CustomTabBar`), excluding the
 * device safe-area inset. Single source of truth: the bar component renders at
 * this height, and any screen mounted under `(tabs)` that owns its own scroller
 * should reserve `TAB_BAR_HEIGHT + useSafeAreaInsets().bottom` of bottom padding
 * so content isn't obscured by the bar.
 */
export const TAB_BAR_HEIGHT = 54;

const DEFAULT_LAYOUT_PADDING = 24;

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DEFAULT_LAYOUT_PADDING,
  },
  text: {
    fontSize: 20,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {},
  disabled: {
    opacity: 0.5,
  },
});

export { DEFAULT_LAYOUT_PADDING, globalStyles, HEADER_HEIGHT, window };
