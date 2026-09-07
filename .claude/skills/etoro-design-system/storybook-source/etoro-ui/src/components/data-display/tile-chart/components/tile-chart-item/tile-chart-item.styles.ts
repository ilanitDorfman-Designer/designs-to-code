import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X1, X3, X5 } from '../../../../../core/styles/spacing';

export const useTileChartItemStyles = () => {
  const { colors } = useEtoroTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        bar: {
          position: 'absolute',
          overflow: 'hidden',
          borderRadius: X1,
        },
        barContent: {
          justifyContent: 'center',
          paddingHorizontal: X3,
          paddingVertical: X5,
          height: '100%',
        },
        barContentInner: {
          justifyContent: 'space-between',
          overflow: 'hidden',
          height: '100%',
        },
        label: { color: colors.textBright },
        percentage: { color: colors.textBright },
      }),
    [colors],
  );
};
