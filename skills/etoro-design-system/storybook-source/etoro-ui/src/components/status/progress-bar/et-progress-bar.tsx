import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtProgressBarFillType, EtProgressBarProps } from './api/types';

/** @deprecated use EtProgressV2 instead */
export function EtProgressBar(props: EtProgressBarProps) {
  const { colors } = useEtoroTheme();

  const { progress, height = 8, style, fillType, progressColor, gradientColors, testID } = props;

  const [containerWidth, setContainerWidth] = useState(0);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const fillWidth = containerWidth * clampedProgress;

  const fillStyle: ViewStyle = {
    width: fillWidth,
    borderRadius: height / 2,
    height: '100%',
    backgroundColor: fillType === EtProgressBarFillType.Gradient ? undefined : (progressColor ?? colors.actionBrandText),
  };

  return (
    <View
      testID={testID}
      onLayout={onContainerLayout}
      style={[
        styles.container,
        {
          borderColor: colors.dividerPrimary,
          height,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      {/* Background bar */}
      <View
        style={[
          styles.background,
          {
            backgroundColor: colors.transparent,
            borderRadius: height / 2,
          },
        ]}
      />

      {/* Progress fill */}
      {fillType === EtProgressBarFillType.Gradient ? (
        <LinearGradient
          testID={testID ? `${testID}-gradient-fill` : undefined}
          style={fillStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={gradientColors && gradientColors.length >= 2 ? gradientColors : [colors.actionBrandText, colors.actionBrandText]}
        />
      ) : (
        <View testID={testID ? `${testID}-solid-fill` : undefined} style={[styles.fill, fillStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
});
