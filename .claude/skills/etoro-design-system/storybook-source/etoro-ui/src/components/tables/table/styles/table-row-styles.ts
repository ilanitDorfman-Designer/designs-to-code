import { StyleSheet } from 'react-native';

// Fixed row height to ensure alignment between fixed and scrollable column lists
const ROW_MIN_HEIGHT = 50;

export const tableRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: ROW_MIN_HEIGHT,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    alignItems: 'stretch',
  },
  cellCentered: {
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
  },
});
