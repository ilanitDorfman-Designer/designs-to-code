import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useOdometerAnimation } from '../animations';
import type { AnimatedDigitProps } from '../api';

/** Default odometer: a 10-cell 0-9 strip pinned to the target digit; springs on value change. */
export function OdometerColumn({
  digit,
  height,
  springConfig,
  renderDigitCell,
}: {
  digit: number;
  height: number;
  springConfig?: AnimatedDigitProps['springConfig'];
  renderDigitCell: (value: number) => React.ReactNode;
}) {
  const rStyle = useOdometerAnimation(digit, height, springConfig);

  return (
    <Animated.View style={[styles.container, rStyle]}>
      {/* One <Text> per digit 0-9; the strip is translated so the target sits in the clip window. */}
      {new Array(10).fill(0).map((_, index) => (
        <React.Fragment key={index}>{renderDigitCell(index)}</React.Fragment>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});
