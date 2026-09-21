import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X1, X4 } from '../../../core/styles';

export type AlertBannerSeverity = 'warning';

type ThemeColors = ReturnType<typeof useEtoroTheme>['colors'];

/** Resolves background/icon/text colors for a given severity. Only `warning` exists today (PBD-944). */
export function getAlertBannerSeverityStyles(severity: AlertBannerSeverity, colors: ThemeColors) {
  if (severity === 'warning') {
    return {
      backgroundColor: colors.accentF100,
      iconColor: colors.accentG700,
      textColor: colors.textPrimaryNeutral,
    };
  }

  return {
    backgroundColor: colors.accentF100,
    iconColor: colors.accentG700,
    textColor: colors.textPrimaryNeutral,
  };
}

export const createAlertBannerStyles = () =>
  StyleSheet.create({
    container: {
      padding: X4,
      borderRadius: X4,
      gap: X4,
      display: 'flex',
      flexDirection: 'column',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: X1,
    },
    description: {
      marginTop: X1,
    },
    cta: {
      padding: X1,
    },
  });
