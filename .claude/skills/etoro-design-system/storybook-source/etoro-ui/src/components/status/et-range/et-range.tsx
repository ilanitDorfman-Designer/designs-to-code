import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { clamp01, defaultRangeFormatValue } from '../../../utils/range-utils';
import { EtRangeProps } from './api';
import { RangeCursor, RangeLabel, RangeTrack } from './subcomponents';

export function EtRange({
  min = 0,
  max = 100,
  value,
  cursorColor = 'green',
  width = 'auto',
  cursorHeight = 37,
  formatValue = defaultRangeFormatValue,
  trackColor,
}: EtRangeProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const span = useMemo(() => (max - min === 0 ? 1 : max - min), [min, max]);
  const resolvedValue = value ?? min + span / 2;
  const derivedPosition = useMemo(() => {
    if (min === max) {
      // For zero-span ranges, always center the cursor.
      return 0.5;
    }
    return clamp01((resolvedValue - min) / span);
  }, [resolvedValue, min, max, span]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Resolve actual track width:
  // - If width is numeric, use it.
  // - If auto, fall back to measured container width.
  const trackWidth = typeof width === 'number' ? Math.max(width, 0) : Math.max(containerWidth, 0);

  // Labels should align to the exact track edges
  const labelsWidth = trackWidth > 0 ? trackWidth : undefined;

  const trackContent = (
    <View
      style={[
        styles.trackContainer,
        {
          width: typeof width === 'number' ? width : undefined,
        },
      ]}
      onLayout={handleLayout}
    >
      <RangeTrack width={typeof width === 'number' ? trackWidth : 'auto'} trackColor={trackColor} />
      {trackWidth > 0 && (
        <RangeCursor position={derivedPosition} trackWidth={trackWidth} height={cursorHeight} isPositive={cursorColor === 'green'} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.labelsRow, labelsWidth ? { width: labelsWidth } : null]}>
        <RangeLabel value={formatValue(min)} position="left" />
        <RangeLabel value={formatValue(max)} position="right" />
      </View>
      {trackContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
