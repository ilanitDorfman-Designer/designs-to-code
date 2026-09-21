import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../../core/hooks';
import { HANDLE_WIDTH, X1, X6, X10 } from '../../../core/styles/spacing';
import { usePositionCardContext } from '../api/context';
import { getInvisibleHandleColor } from '../utils/invisible-handle-utils';

// Handle bar dimensions
const HANDLE_BAR_WIDTH = HANDLE_WIDTH; // 15px
const HANDLE_BAR_HEIGHT = X1; // 4px

// Notch SVG dimensions
const NOTCH_WIDTH = X10 * 2; // 80px
const NOTCH_HEIGHT = X6; // 24px

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

/**
 * EtPositionCard.Handle - Smooth curved notch with handle bar.
 *
 * Uses SVG to create a smooth arc/hill shape that appears to be
 * "cut into" the card's bottom edge.
 *
 * The notch has a curved top edge (like a gentle hill) and a flat
 * bottom edge matching the screen background.
 *
 * Tapping the handle triggers expand/collapse.
 */
function CardHandleComponent() {
  const { onToggle, handleBackgroundColor, isExpanded, variant, isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();
  const { dark: isDarkMode } = useTheme();
  const handleInvisibleColor = getInvisibleHandleColor(colors, isDarkMode, variant);
  // Use provided background color or fall back to a default dark background
  const notchColor = handleBackgroundColor ?? colors.backgroundBase;

  // Convert isExpanded to a derived shared value to avoid stale closures in worklets
  const isExpandedShared = useDerivedValue(() => isExpanded, [isExpanded]);

  const wrapperStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isExpandedShared.value ? 0 : 1, { duration: 150 }),
    }),
    [isExpandedShared],
  );

  const handlePress = () => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    onToggle();
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel="Expand or collapse card"
        disabled={isLoading}
      >
        {/* SVG curved notch shape */}
        <AnimatedSvg width={NOTCH_WIDTH} height={NOTCH_HEIGHT} viewBox={`0 0 ${NOTCH_WIDTH} ${NOTCH_HEIGHT}`} style={[styles.svg, wrapperStyle]}>
          {/*
            Path creates a smooth arc:
            - M 0,0 : Start at top-left
            - Q controlX,controlY endX,endY : Quadratic bezier curve
            - The curve goes from left edge, up to peak at center, down to right edge
            - Then closes with flat bottom
          */}
          <Path
            d={`
              M 0 ${NOTCH_HEIGHT}
              Q ${NOTCH_WIDTH / 2} 0, ${NOTCH_WIDTH} ${NOTCH_HEIGHT}
              L ${NOTCH_WIDTH} ${NOTCH_HEIGHT}
              L 0 ${NOTCH_HEIGHT}
              Z
            `}
            fill={notchColor}
          />
        </AnimatedSvg>

        {/* Handle bar - positioned at the peak of the curve */}
        <View
          style={[
            styles.handleBar,
            {
              backgroundColor: isExpanded ? handleInvisibleColor : colors.carbon400,
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

export const CardHandle = memo(CardHandleComponent);
CardHandle.displayName = 'EtPositionCard.Handle';

const styles = StyleSheet.create({
  wrapper: {
    height: NOTCH_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pressable: {
    width: NOTCH_WIDTH,
    height: NOTCH_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
  handleBar: {
    width: HANDLE_BAR_WIDTH,
    height: HANDLE_BAR_HEIGHT,
    borderRadius: HANDLE_BAR_HEIGHT / 2,
    marginTop: 'auto',
  },
});
