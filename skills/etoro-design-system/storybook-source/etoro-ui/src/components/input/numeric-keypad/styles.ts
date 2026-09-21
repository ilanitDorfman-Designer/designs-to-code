import { StyleSheet } from 'react-native';

import { X1 } from '../../../core/styles/spacing';
import { KEY_ROW_GAP, KEY_ROW_HEIGHT } from './constants';

/** Static styles for the {@link NumericKeypadView} container, content wrapper, and rows. */
export const numericKeypadStyles = StyleSheet.create({
  root: {
    width: '100%',
    overflow: 'hidden',
  },
  rootFill: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    rowGap: KEY_ROW_GAP,
  },
  contentFill: {
    width: '100%',
    flex: 1,
    rowGap: KEY_ROW_GAP,
  },
  row: {
    height: KEY_ROW_HEIGHT,
    flexDirection: 'row',
    columnGap: X1,
  },
  rowFill: {
    flex: 1,
    flexDirection: 'row',
    columnGap: X1,
  },
});
