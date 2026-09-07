import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { DEFAULT_INDICATOR_SIZE } from '../api/types';

interface CircularIndicatorProps {
  size?: number;
  borderColor?: string;
}

export function CircularIndicator({ size = DEFAULT_INDICATOR_SIZE, borderColor }: CircularIndicatorProps) {
  const { colors } = useEtoroTheme();

  // Fills the animated indicator container (whose width is interpolated on the
  // UI thread), so the ring slides and resizes in lockstep with the selection.
  return (
    <View
      style={[
        styles.indicator,
        {
          height: size,
          borderRadius: size / 2,
          borderColor: borderColor ?? colors.dividerSecondary,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    borderWidth: 1.5,
  },
});
