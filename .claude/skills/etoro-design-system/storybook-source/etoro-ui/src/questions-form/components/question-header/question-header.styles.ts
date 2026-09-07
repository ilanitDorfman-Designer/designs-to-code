import { StyleSheet } from 'react-native';

import type { eToroTheme } from '../../../core/styles/colors';
import { X1, X2, X3, X4 } from '../../../core/styles/spacing';

export const createStyles = (colors: eToroTheme['colors']) =>
  StyleSheet.create({
    container: {
      marginBottom: X4,
    },
    title: {
      marginBottom: X2,
    },
    image: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: X2,
      marginBottom: X3,
      backgroundColor: colors.bgGreyTertiary,
    },
    subText: {
      marginTop: X1,
    },
  });
