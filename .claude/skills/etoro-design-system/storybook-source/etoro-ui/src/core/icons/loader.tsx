import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

const SPINNING_SPEED = 1000;

function Loader({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const rotation = useSharedValue(0);

  // Use provided color or fall back to inverted neutral (for primary buttons)
  const strokeColor = color ?? colors.carbonStatic050;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  useEffect(() => {
    rotation.set(
      withRepeat(
        withTiming(360, {
          duration: SPINNING_SPEED,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, [rotation]);

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Circle cx="7.99997" cy="7.99997" r="6.91892" stroke={colors.carbonSecondaryDivider} strokeWidth="2" />
        <Path
          d="M7.99997 1.08105C9.2145 1.08105 10.4076 1.40075 11.4594 2.00801C12.5112 2.61528 13.3847 3.48871 13.9919 4.54051C14.5992 5.59232 14.9189 6.78545 14.9189 7.99997C14.9189 9.2145 14.5992 10.4076 13.9919 11.4594"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

export default Loader;
