import MaskedView from '@react-native-masked-view/masked-view';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../../core/hooks';
import { X15 } from '../../../core/styles';

const DEFAULT_EDGE = 'top';
const DEFAULT_SCROLL_THRESHOLD = 0;
const DEFAULT_BLUR_SCROLL_RANGE = 120;
const DEFAULT_TOP_OVERFLOW = 60;
const DEFAULT_BOTTOM_HEIGHT = 72;
const DEFAULT_MAX_BLUR_INTENSITY = 10;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export interface EtProgressivePageBlurProps {
  /** Physical screen edge that the blur is pinned to. Default `top`. */
  edge?: 'top' | 'bottom';
  /**
   * Optional scroll position (in px) that drives blur fade-in. When omitted,
   * the blur is always fully visible.
   */
  scrollY?: SharedValue<number>;
  /** Scroll offset (px) before the blur starts ramping in. Default `0`. */
  scrollThreshold?: number;
  /** Scroll distance (px) over which the blur ramps from none to full. Default `120`. */
  blurScrollRange?: number;
  /**
   * Height (px) beyond the relevant safe-area inset. For `top`, default `X15 + 60`.
   * For `bottom`, default `72`.
   */
  height?: number;
  /** Peak `BlurView` intensity reached at the end of the scroll range. Default `10`. */
  maxBlurIntensity?: number;
  /** Solid color used by the overlay gradient. Defaults to `colors.backgroundBase`. */
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const normalizedHex = hex.length === 3 ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}` : hex;
    const r = parseInt(normalizedHex.slice(0, 2), 16);
    const g = parseInt(normalizedHex.slice(2, 4), 16);
    const b = parseInt(normalizedHex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }

  return color;
}

function EtProgressivePageBlurComponent({
  edge = DEFAULT_EDGE,
  scrollY,
  scrollThreshold = DEFAULT_SCROLL_THRESHOLD,
  blurScrollRange = DEFAULT_BLUR_SCROLL_RANGE,
  height,
  maxBlurIntensity = DEFAULT_MAX_BLUR_INTENSITY,
  color,
  style,
  testID,
}: EtProgressivePageBlurProps) {
  const { dark } = useTheme();
  const { colors } = useEtoroTheme();
  const insets = useSafeAreaInsets();
  const isTop = edge === 'top';
  const isIos = Platform.OS === 'ios';
  const isAndroidBottom = Platform.OS === 'android' && !isTop;
  const resolvedColor = color ?? colors.backgroundBase;
  const resolvedHeight = isTop ? insets.top + (height ?? X15 + DEFAULT_TOP_OVERFLOW) : insets.bottom + (height ?? DEFAULT_BOTTOM_HEIGHT);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: scrollY ? interpolate(scrollY.value, [scrollThreshold, scrollThreshold + blurScrollRange], [0, 1], Extrapolation.CLAMP) : 1,
  }));

  const blurProps = useAnimatedProps(() => ({
    intensity: scrollY
      ? interpolate(scrollY.value, [scrollThreshold, scrollThreshold + blurScrollRange], [0, maxBlurIntensity], Extrapolation.CLAMP)
      : maxBlurIntensity,
  }));

  const maskColors: readonly [string, string, ...string[]] = isTop
    ? ['rgba(0,0,0,1)', 'rgba(0,0,0,0.98)', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0)']
    : ['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.98)', 'rgba(0,0,0,1)'];

  // Android relies solely on this gradient (no native blur), so push the opacity up
  const overlayColors: readonly [string, string, ...string[]] = isTop
    ? isIos
      ? [withAlpha(resolvedColor, 0.86), withAlpha(resolvedColor, 0.72), withAlpha(resolvedColor, 0)]
      : [withAlpha(resolvedColor, 1), withAlpha(resolvedColor, 0.98), withAlpha(resolvedColor, 0)]
    : isAndroidBottom
      ? [withAlpha(resolvedColor, 0), withAlpha(resolvedColor, 0.55), withAlpha(resolvedColor, 0.95)]
      : [withAlpha(resolvedColor, 0), withAlpha(resolvedColor, 0.72), withAlpha(resolvedColor, 0.92)];

  const overlayGradient = (
    <LinearGradient
      colors={overlayColors}
      locations={isTop ? [0, 0.58, 1] : [0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );

  return (
    <Animated.View
      pointerEvents="none"
      testID={testID}
      style={[styles.container, isTop ? styles.top : styles.bottom, { height: resolvedHeight }, containerStyle, style]}
    >
      {/*
        The MaskedView only exists to feather the native blur, which is iOS-only.
        On Android there is no blur, so wrapping a (sometimes fully-transparent)
        overlay in a MaskedView makes the black mask element leak through as a dark
        scrim. Render the overlay gradient directly instead.
      */}
      {isIos ? (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              colors={maskColors}
              locations={isTop ? [0, 0.44, 0.72, 1] : [0, 0.28, 0.56, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <AnimatedBlurView
            animatedProps={blurProps}
            intensity={maxBlurIntensity}
            tint={dark ? 'dark' : 'light'}
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
          />
          {overlayGradient}
        </MaskedView>
      ) : (
        overlayGradient
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});

export const EtProgressivePageBlur = memo(EtProgressivePageBlurComponent);
EtProgressivePageBlur.displayName = 'EtProgressivePageBlur';
