import { StyleSheet } from 'react-native';

import type { eToroTheme } from '../../../core/styles/colors';
import { X1, X2, X3 } from '../../../core/styles/spacing';

export const createStyles = (_colors: eToroTheme['colors']) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: X1,
      padding: X3,
      borderRadius: X2,
    },
    containerNoPadH: {
      paddingHorizontal: 0,
    },
    bordered: {
      borderWidth: 1,
    },
    iconContainer: {
      marginRight: X2,
    },
    messageText: {
      flex: 1,
    },
    messageTextCentered: {
      textAlign: 'center',
    },
    messageTextWithIcon: {
      flex: 1,
    },
  });
};
