import { StyleSheet, View } from 'react-native';

import { create } from '../../../../utils/create';
import { SplitLayoutAsideProps } from '../api/types';

/**
 * The secondary pane (brand imagery, steps rail, marketing panel). The root
 * UNMOUNTS it below the desktop breakpoint — children must not rely on
 * mount-coupled `entering` animations (rapid mount/unmount of Reanimated
 * entering-animated views is a known crash vector; see AGENTS.md).
 */
export const SplitLayoutAside = create(function SplitLayoutAside({ children, style, testID }: SplitLayoutAsideProps) {
  return (
    <View style={[styles.aside, style]} testID={testID}>
      {children}
    </View>
  );
}, 'EtSplitLayout.Aside');

const styles = StyleSheet.create({
  aside: {
    flex: 1,
  },
});
