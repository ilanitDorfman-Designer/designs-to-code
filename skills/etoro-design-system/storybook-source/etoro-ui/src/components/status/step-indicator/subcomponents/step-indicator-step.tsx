import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { HALF, X1 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { StepIndicatorStepProps } from '../api';

const DOT_LABEL_GAP = X1 + HALF; // 6px
const INACTIVE_DOT_RATIO = 0.75;

/**
 * A single step of EtStepIndicator: a dot with its label underneath.
 * The dot is wrapped in a box sized to the active dot so active and inactive
 * dots share the same vertical center, keeping them aligned with the track.
 */
export const StepIndicatorStep = memo<StepIndicatorStepProps>(({ label, isActive, size, dotColor, labelColor, alignment, onLayout, testID }) => {
  const dotSize = isActive ? size : size * INACTIVE_DOT_RATIO;

  return (
    <View style={[styles.container, alignment === 'start' ? styles.alignStart : styles.alignCenter]} onLayout={onLayout} testID={testID}>
      <View style={[styles.dotBox, { width: size, height: size }]}>
        <View
          style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: dotColor }}
          testID={testID ? `${testID}-dot` : undefined}
        />
      </View>
      <EtText
        variant="body-tiny-regular"
        weight={isActive ? 'semiBold' : 'regular'}
        style={[styles.label, labelColor ? { color: labelColor } : undefined]}
        numberOfLines={1}
        testID={testID ? `${testID}-label` : undefined}
      >
        {label}
      </EtText>
    </View>
  );
});

StepIndicatorStep.displayName = 'EtStepIndicator.Step';

const styles = StyleSheet.create({
  container: {
    gap: DOT_LABEL_GAP,
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  dotBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    // Figma step labels are 12/16 with 0.25 tracking; body-tiny-regular
    // ships 12/16/0.
    letterSpacing: 0.25,
  },
});
