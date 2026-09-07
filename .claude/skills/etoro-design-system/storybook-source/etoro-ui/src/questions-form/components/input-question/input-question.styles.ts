import { StyleSheet } from 'react-native';

import type { eToroTheme } from '../../../core/styles/colors';
import { X1, X2, X7, X24 } from '../../../core/styles/spacing';

/**
 * Styles for the InputQuestion component.
 */
export const createStyles = (_colors: eToroTheme['colors']) =>
  StyleSheet.create({
    inputContainer: {
      marginTop: X2,
      gap: X1,
    },
    messagesContainer: {
      marginTop: X7,
    },
    textboxContainer: {
      minHeight: X24,
    },
  });
