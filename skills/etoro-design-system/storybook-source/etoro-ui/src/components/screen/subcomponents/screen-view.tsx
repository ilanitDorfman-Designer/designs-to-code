import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useScreenContext } from '../api/context';
import { EtScreenViewProps } from '../api/types';

/**
 * EtScreen.View - Static content container.
 *
 * Extends React Native's ViewProps for full native API access.
 * Use this for screens that have their own scrollable content (e.g., FlashList).
 *
 * Automatically handles TopBar padding when TopBar is present.
 *
 * @example With FlashList
 * ```tsx
 * <EtScreen animateHalo>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtScreen.View style={{ flex: 1 }}>
 *     <FlashList onScroll={handleScroll} />
 *   </EtScreen.View>
 * </EtScreen>
 * ```
 *
 * @example Static content
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.View style={styles.container}>
 *     <StaticContent />
 *   </EtScreen.View>
 * </EtScreen>
 * ```
 */
function ScreenViewComponent({ children, style, ...viewProps }: EtScreenViewProps) {
  const { shouldShowTopBar, headerAreaHeight } = useScreenContext();

  return (
    <View style={[styles.container, shouldShowTopBar && { paddingTop: headerAreaHeight }, style]} {...viewProps}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const ScreenView = memo(ScreenViewComponent);
ScreenView.displayName = 'EtScreen.View';
