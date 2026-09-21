import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X1, X2 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text/et-text';
import { EtPerformanceBarsProps, PerformanceBarsColors } from './api';
import { PerformanceBar } from './subcomponents';
import { usePerformanceBarsConfig } from './use-performance-bars-config';

const DEFAULT_HEIGHT = 120;
const DEFAULT_BAR_GAP = X1;
const DEFAULT_BAR_BORDER_RADIUS = 4;
const SCALE_WIDTH = 50;
const DEFAULT_ANIMATION_DURATION = 320;
const DEFAULT_ANIMATION_STAGGER = 60;

function EtPerformanceBarsBase({
  data = [],
  numberOfBars,
  selectedIndex = null,
  onBarClick,
  height = DEFAULT_HEIGHT,
  barGap = DEFAULT_BAR_GAP,
  barBorderRadius = DEFAULT_BAR_BORDER_RADIUS,
  showScale,
  layout = 'centered',
  animated = false,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  animationStagger = DEFAULT_ANIMATION_STAGGER,
  colorScheme,
  style,
  testID,
  accessibilityLabel,
}: EtPerformanceBarsProps) {
  // Bottom-up charts (non-negative distributions) hide the signed scale by default.
  const resolvedShowScale = showScale ?? layout !== 'bottom-up';
  const { colors } = useEtoroTheme();

  const totalSlots = numberOfBars ?? data.length;
  const halfHeight = height / 2;

  // Default colour scheme = design-system theme tokens; callers can override via `colorScheme`.
  // Selected backgrounds default to the bar gradient (a filled highlight) unless overridden.
  const resolvedColors = useMemo<PerformanceBarsColors>(
    () =>
      colorScheme ?? {
        positiveBar: [colors.verdictPositive600Opacity15, colors.verdictPositive600Opacity50],
        negativeBar: [colors.verdictNegative600Opacity50, colors.verdictNegative600Opacity15],
        slot: [colors.carbonSecondaryDivider, colors.carbonPrimaryDivider],
        selectedPositive: [colors.verdictPositive600Opacity15, colors.verdictPositive600Opacity50],
        selectedNegative: [colors.verdictNegative600Opacity50, colors.verdictNegative600Opacity15],
      },
    [colorScheme, colors],
  );

  const { barConfigs, scaleValues } = usePerformanceBarsConfig({
    data,
    totalSlots,
    halfHeight,
    chartHeight: height,
    layout,
    selectedIndex,
    colors: resolvedColors,
  });

  const textSecondaryStyle = useMemo(() => ({ color: colors.textSecondaryNeutral }), [colors.textSecondaryNeutral]);

  const handleBarPress = useCallback(
    (index: number) => {
      onBarClick?.(index);
    },
    [onBarClick],
  );

  // No slots to show
  if (totalSlots <= 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      <View style={[styles.chart, { height }]}>
        <View style={styles.barsRow}>
          {barConfigs.map((config) => (
            <PerformanceBar
              key={`bar-${config.index}`}
              config={config}
              onBarPress={handleBarPress}
              height={height}
              barGap={barGap}
              barBorderRadius={barBorderRadius}
              animated={animated}
              animationDuration={animationDuration}
              animationStagger={animationStagger}
              testID={testID ? `${testID}-bar-${config.index}` : undefined}
            />
          ))}
        </View>
      </View>

      {resolvedShowScale && (
        <View style={styles.scaleContainer}>
          <EtText variant="label-tertiary-regular" style={textSecondaryStyle}>
            {scaleValues.top}
          </EtText>
          <EtText variant="label-tertiary-regular" style={textSecondaryStyle}>
            {scaleValues.middle}
          </EtText>
          <EtText variant="label-tertiary-regular" style={textSecondaryStyle}>
            {scaleValues.bottom}
          </EtText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  scaleContainer: {
    width: SCALE_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingStart: X2,
  },
});

const EtPerformanceBarsMemo = memo(EtPerformanceBarsBase);
EtPerformanceBarsMemo.displayName = 'EtPerformanceBars';

export const EtPerformanceBars = Object.assign(EtPerformanceBarsMemo, {});
