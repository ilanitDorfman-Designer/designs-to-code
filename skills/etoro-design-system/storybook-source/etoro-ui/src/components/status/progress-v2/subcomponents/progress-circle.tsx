import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import { ProgressCircleProps } from '../api';

// Size mappings for circle variant
const CIRCLE_SIZES = {
  small: 32,
  medium: 40,
  large: 48,
} as const;

const STROKE_WIDTHS = {
  small: 3,
  medium: 4,
  large: 5,
} as const;

/**
 * Circle variant of the progress indicator.
 * Displays a circular arc with percentage or custom center content.
 */
export const ProgressCircle = memo<ProgressCircleProps>(({ progress, size, color, showBackground, children, style, testID, customColor }) => {
  const { colors } = useEtoroTheme();

  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const percentValue = Math.round(clampedProgress * 100);

  // Get pixel values from size type
  const circleSize = CIRCLE_SIZES[size];
  const strokeWidth = STROKE_WIDTHS[size];

  // SVG calculations
  const center = circleSize / 2;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);

  const resolvedFillColor = customColor ? colors[customColor] : color === 'positive' ? colors.bgPositivePrimary : colors.textPrimaryNeutral;

  const trackColor = showBackground ? colors.dividerQuinary : 'transparent';

  // Default content: percentage text
  const defaultContent = <EtText variant="caption-medium">{percentValue}%</EtText>;

  return (
    <View style={[styles.container, { width: circleSize, height: circleSize }, style]} testID={testID}>
      <Svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`} style={styles.svg}>
        {/* Background track */}
        {showBackground && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
            testID={testID ? `${testID}-track` : undefined}
          />
        )}
        {/* Progress arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={resolvedFillColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
          testID={testID ? `${testID}-fill` : undefined}
        />
      </Svg>

      <View style={styles.content} testID={testID ? `${testID}-content` : undefined}>
        {children ?? defaultContent}
      </View>
    </View>
  );
});

ProgressCircle.displayName = 'EtProgressV2.Circle';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
