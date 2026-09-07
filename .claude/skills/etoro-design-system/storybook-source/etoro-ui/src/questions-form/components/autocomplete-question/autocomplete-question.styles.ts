import { StyleSheet } from 'react-native';

import type { eToroTheme } from '../../../core/styles/colors';
import { X2, X4, X6 } from '../../../core/styles/spacing';

/**
 * Styles for the AutocompleteQuestion component.
 */
export const createStyles = (colors: eToroTheme['colors']) =>
  StyleSheet.create({
    container: {
      gap: X2,
    },
    optionRow: {
      paddingHorizontal: X6,
      paddingVertical: X4,
    },
    optionSeparator: {
      height: 1,
      backgroundColor: colors.dividerQuinary,
    },
    emptyState: {
      paddingHorizontal: X6,
      paddingVertical: X4,
    },
    outerQuestions: {
      gap: X2,
    },
  });
