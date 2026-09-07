import { StyleSheet } from 'react-native';

import { X1, X2, X3, X4, X5, X6 } from '../../../core/styles/spacing';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      gap: X3,
    },
    optionsList: {
      gap: X3,
    },
    chipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: X2,
    },
    optionGroup: {
      gap: X1,
    },
    innerQuestions: {
      gap: X2,
      marginTop: X1,
    },
    outerQuestions: {
      gap: X2,
      marginTop: X1,
    },
  });

export const tileOptionStyles = StyleSheet.create({
  compact: {
    minHeight: 0,
    padding: X4,
    borderRadius: X2,
  },
  compactCheckBox: {
    minHeight: 0,
    paddingHorizontal: X5,
    paddingVertical: X3,
    borderRadius: X2,
  },
  compactCheckRound: {
    minHeight: 0,
    paddingHorizontal: X5,
    paddingVertical: X6,
    borderRadius: X2,
  },
});
