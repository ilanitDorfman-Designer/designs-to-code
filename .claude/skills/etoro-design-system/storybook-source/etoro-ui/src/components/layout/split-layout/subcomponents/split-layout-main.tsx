import { StyleSheet, View } from 'react-native';

import { create } from '../../../../utils/create';
import { SplitLayoutMainProps } from '../api/types';

/**
 * The content pane — survives collapse and fills the layout below the desktop
 * breakpoint. Scrolling is the consumer's concern.
 */
export const SplitLayoutMain = create(function SplitLayoutMain({ children, style, testID }: SplitLayoutMainProps) {
  return (
    <View style={[styles.main, style]} testID={testID}>
      {children}
    </View>
  );
}, 'EtSplitLayout.Main');

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
