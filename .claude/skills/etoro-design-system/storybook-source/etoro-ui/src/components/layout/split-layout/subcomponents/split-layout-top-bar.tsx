import { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { create } from '../../../../utils/create';
import { useSplitLayoutActions } from '../api/context';
import { SplitLayoutTopBarProps } from '../api/types';

/**
 * Chrome overlay (back button, logo, actions) absolutely positioned at the top
 * of the MAIN pane — it never displaces content. It measures itself and
 * publishes its height as `topBarHeight` on `useSplitLayoutContext()` so
 * consumers can inset scroll content on short viewports.
 */

// Chrome tier — stays under panels (1000) and portaled modals (9999).
const TOP_BAR_Z_INDEX = 100;

export const SplitLayoutTopBar = create(function SplitLayoutTopBar({ children, style, testID }: SplitLayoutTopBarProps) {
  const { setTopBarHeight } = useSplitLayoutActions();

  useEffect(() => () => setTopBarHeight(0), [setTopBarHeight]);

  const handleLayout = (event: LayoutChangeEvent) => setTopBarHeight(event.nativeEvent.layout.height);

  return (
    // box-none: the bar spans the pane width but must not swallow touches
    // aimed at content beneath its empty regions — only its children capture.
    <View style={[styles.topBar, style]} onLayout={handleLayout} pointerEvents="box-none" testID={testID}>
      {children}
    </View>
  );
}, 'EtSplitLayout.TopBar');

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: TOP_BAR_Z_INDEX,
  },
});
