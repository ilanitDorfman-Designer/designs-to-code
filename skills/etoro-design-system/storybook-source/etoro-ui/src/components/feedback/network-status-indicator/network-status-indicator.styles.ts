import { StyleSheet } from 'react-native';

import { X1, X2 } from '../../../core/styles/spacing';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: X1,
    paddingHorizontal: X2,
    paddingVertical: X1,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
