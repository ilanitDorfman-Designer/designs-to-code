import React from 'react';
import { StyleSheet, View } from 'react-native';

type TrackBarsProps = {
  barCount: number;
  barWidth: number;
  barHeight: number;
  barColor: string;
};

export function TrackBars({ barCount, barWidth, barHeight, barColor }: TrackBarsProps) {
  if (barCount <= 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          height: barHeight,
        },
      ]}
      pointerEvents="none"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: barHeight,
                backgroundColor: barColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    borderRadius: 2,
  },
});
