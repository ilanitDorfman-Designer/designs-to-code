import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { eToroTheme } from '../../../core/styles/colors';
import { BreakdownChartData, EtBreakdownChartProps } from './api';
import { BreakdownBar, BreakdownLabel } from './subcomponents';

export function EtBreakdownChart({
  data = [],
  height = 12,
  cornerRadius = 4,
  gap = 2,
  maxBars = 9,
  showLabels = true,
  enableAnimation = true,
  animationDuration = 300,
  style,
  testID,
  accessibilityLabel,
}: EtBreakdownChartProps) {
  const { colors } = useEtoroTheme();

  // Create shared values for up to 10 bars (more than that will be condensed into an "Other" bar)
  const animatedValues = useRef([
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ]).current;

  // Process data to condense items beyond the max bars into "Other"
  const chartData = useMemo(() => {
    // Ensure we do not exceed the number of pre-allocated shared values to prevent crashes
    const maxVisibleBars = Math.min(maxBars, animatedValues.length - 1);

    if (data.length <= maxVisibleBars + 1) {
      return data;
    }

    // Take first MAX_BARS items and condense the rest into "Other"
    const mainItems = data.slice(0, maxVisibleBars);
    const otherItems = data.slice(maxVisibleBars);
    const otherTotalValue = otherItems.reduce((sum, item) => sum + item.value, 0);

    const otherItem: BreakdownChartData = {
      key: 'Other',
      value: otherTotalValue,
      color: [colors.otherPrimary, colors.otherGradient],
    };

    return [...mainItems, otherItem];
  }, [data, colors.otherPrimary, colors.otherGradient, maxBars, animatedValues.length]);

  // Memoized calculations to extract logic from template
  const computedStyles = {
    containerMargin: [styles.containerMargins, showLabels ? styles.containerMarginWithLabels : styles.containerMarginNoLabels],
    chartContainerHeight: { height },
    barBase: [styles.barBase, { height }],
    textColor: colors.textSecondaryNeutral,
  };

  // Extract color calculation logic using theme colors
  const getBarColors = (item: BreakdownChartData, index: number) => {
    const colorGradients = getColorGradients(colors);
    return item.color || colorGradients[index % colorGradients.length];
  };

  // Extract margin calculation
  const getMarginRight = (index: number, totalItems: number) => (index < totalItems - 1 ? gap : 0);

  // Calculate total animated value
  const totalAnimatedValue = useDerivedValue(() => {
    return chartData.reduce((sum, _, index) => sum + (animatedValues[index]?.value || 0), 0);
  });

  // Animate values when data changes
  useEffect(() => {
    if (enableAnimation) {
      chartData.forEach((item, index) => {
        if (animatedValues[index]) {
          animatedValues[index].set(
            withTiming(item.value, {
              duration: animationDuration,
            }),
          );
        }
      });

      // Reset unused values to 0
      for (let i = chartData.length; i < animatedValues.length; i++) {
        animatedValues[i].set(
          withTiming(0, {
            duration: animationDuration,
          }),
        );
      }
    } else {
      // Set values immediately without animation
      chartData.forEach((item, index) => {
        if (animatedValues[index]) {
          animatedValues[index].set(item.value);
        }
      });

      // Reset unused values
      for (let i = chartData.length; i < animatedValues.length; i++) {
        animatedValues[i].set(0);
      }
    }
  }, [chartData, enableAnimation, animationDuration, animatedValues]);

  return (
    <View style={[styles.container, computedStyles.containerMargin, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      {/* Chart bars */}
      <View style={[styles.chartContainer, computedStyles.chartContainerHeight]}>
        {chartData.map((item, index) => (
          <BreakdownBar
            key={`${item.key}-${index}`}
            animatedValue={animatedValues[index]}
            totalAnimatedValue={totalAnimatedValue}
            gradientColors={getBarColors(item, index)}
            barStyle={[
              computedStyles.barBase,
              index === 0 && {
                borderTopLeftRadius: cornerRadius,
                borderBottomLeftRadius: cornerRadius,
              },
              index === chartData.length - 1 && {
                borderTopRightRadius: cornerRadius,
                borderBottomRightRadius: cornerRadius,
              },
            ]}
            marginRight={getMarginRight(index, chartData.length)}
          />
        ))}
      </View>

      {/* Labels */}
      {showLabels && (
        <View style={[styles.labelsContainer, styles.labelsMarginTop]}>
          {chartData.map((item, index) => (
            <BreakdownLabel
              key={`${item.key}-label-${index}`}
              animatedValue={animatedValues[index]}
              totalAnimatedValue={totalAnimatedValue}
              label={item.key}
              textColor={computedStyles.textColor}
              marginRight={getMarginRight(index, chartData.length)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// Default color gradients from theme investment colors
const getColorGradients = (colors: eToroTheme['colors']) => [
  [colors.currenciesGradient, colors.currenciesPrimary],
  [colors.etfGradient, colors.etfPrimary],
  [colors.commoditiesGradient, colors.commoditiesPrimary],
  [colors.peopleGradient, colors.peoplePrimary],
  [colors.cryptoGradient, colors.cryptoPrimary],
  [colors.stocksGradient, colors.stocksPrimary],
  [colors.indicesGradient, colors.indicesPrimary],
  [colors.smartPortfoliosGradient, colors.smartPortfoliosPrimary],
  [colors.countriesGradient, colors.countriesPrimary],
];

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  barBase: {
    width: '100%',
  },
  labelsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  labelsMarginTop: {
    marginTop: 4,
  },
  containerMargins: {
    marginTop: 16,
  },
  containerMarginWithLabels: {
    marginBottom: 32,
  },
  containerMarginNoLabels: {
    marginBottom: 8,
  },
});
