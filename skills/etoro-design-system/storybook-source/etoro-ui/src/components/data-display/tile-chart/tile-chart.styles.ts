import { StyleSheet } from 'react-native';

import { X5 } from '../../../core/styles/spacing';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X5,
    paddingVertical: X5,
    width: '100%',
  },
  canvas: {
    width: '100%',
    position: 'relative',
  },
});

export const useTileChartStyles = () => styles;
