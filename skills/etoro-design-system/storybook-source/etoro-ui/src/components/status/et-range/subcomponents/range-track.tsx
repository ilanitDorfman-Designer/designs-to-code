import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';

interface RangeTrackProps {
  width: number | 'auto';
  trackColor?: string;
}

export function RangeTrack({ width, trackColor }: RangeTrackProps) {
  const { colors } = useEtoroTheme();
  const widthValue = useMemo(() => (width === 'auto' ? '100%' : width), [width]);

  return (
    <View
      style={[
        styles.track,
        {
          width: widthValue,
          backgroundColor: trackColor ?? colors.bgActionDisabled,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
  },
});
