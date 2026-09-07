import { StyleSheet } from 'react-native';

import { X1 } from '../../../core/styles/spacing';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Layout-only wrapper: sizes to the scaled row and carries the LinearTransition so re-centering glides.
  rowOuter: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: X1,
    // Sizes to its content (not the container) so the scale transform shrinks it about its center.
    transformOrigin: 'center',
  },
});
