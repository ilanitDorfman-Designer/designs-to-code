import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { EtText } from '../../../foundations/text';
import { EtRiskScoreProps } from './api/types';
import { useRiskScoreConfig, useRiskScoreSegments } from './hooks';

/**
 * EtRiskScore - A circular risk score indicator component
 *
 * Displays a numeric risk score (1-10) inside a ring of arc segments.
 * The ring is colored according to the current score, using a palette that
 * ranges from green (low) through yellow (medium) to red (high).
 *
 * Available in 4 sizes ('xs', 'sm', 'md', 'lg') and 2 variants:
 * - `multi`: Progressive fill — all segments up to the score are colored
 *   with the score's color.
 * - `single`: Only the segment matching the score is colored; all others
 *   use the inactive color.
 *
 * @example Basic usage
 * ```tsx
 * <EtRiskScore value={7} />
 * ```
 *
 * @example Large single variant
 * ```tsx
 * <EtRiskScore value={5} size="lg" variant="single" />
 * ```
 */
function EtRiskScoreBase({ value, size = 'md', variant = 'multi', style, testID, accessibilityLabel }: EtRiskScoreProps) {
  const config = useRiskScoreConfig({ value, size });
  const { px } = config;
  const segments = useRiskScoreSegments(config, value, variant);

  return (
    <View
      style={[styles.container, { width: px, height: px }, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `Risk score ${value} out of 10`}
    >
      <Svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} style={styles.svg}>
        {segments.map((segment) => (
          <Circle
            key={segment.key}
            cx={config.center}
            cy={config.center}
            r={config.radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={segment.dashArray}
            strokeDashoffset={segment.dashOffset}
            strokeLinecap="round"
          />
        ))}
      </Svg>
      <EtText
        variant={config.textVariant}
        style={[
          styles.label,
          {
            color: config.textColor,
          },
        ]}
      >
        {value}
      </EtText>
    </View>
  );
}

const EtRiskScoreMemo = React.memo(EtRiskScoreBase);
EtRiskScoreMemo.displayName = 'EtRiskScore';

export const EtRiskScore = Object.assign(EtRiskScoreMemo, {});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  label: {
    textAlign: 'center',
  },
});
