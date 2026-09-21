import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../core/hooks/use-etoro-theme';
import { EtGlassView, LiquidGlassContext, useLiquidGlass } from '../../core/liquid-glass';
import { withAlpha } from '../../core/styles/color.utils';
import { clampAndroidDimezisBlurIntensity } from '../../utils/android-blur-intensity';
import { useTabBarVisibility } from '../screen/api/tab-bar-visibility.context';
import type { EtPreviewContainerProps } from './api';
import { CARD_SHADOW_RADIUS, PREVIEW_CONTAINER_BOTTOM_OFFSET, PREVIEW_HEIGHT, styles } from './styles';
import { PreviewContainerContent, PreviewContainerTrailing } from './subcomponents';

const HIDE_ANIMATION_DURATION = 200;

// Non-Liquid-Glass fallback, mirroring the bottom tab bar so the card reads the same.
// Android uses a single frosted blur for both themes; the theme is carried by the scrim + fill below.
const IS_ANDROID = Platform.OS === 'android';
const ANDROID_CARD_BLUR_REDUCTION_FACTOR = 2;
const ANDROID_CARD_BLUR = {
  intensity: clampAndroidDimezisBlurIntensity(16, ANDROID_CARD_BLUR_REDUCTION_FACTOR),
  blurReductionFactor: ANDROID_CARD_BLUR_REDUCTION_FACTOR,
  experimentalBlurMethod: 'dimezisBlurView' as const,
  tint: 'default' as const,
};
const DEFAULT_BLUR_INTENSITY = 32;
// Android's heavier blur reads darker, so it gets a lighter fill.
const LIGHT_FALLBACK_BACKGROUND = IS_ANDROID ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.08)';
const CARD_SCRIM_OPACITY = 0.6;
const CARD_SCRIM_OPACITY_ANDROID_LIGHT = 0.22;

/**
 * EtPreviewContainer — floating liquid-glass preview card shell.
 *
 * On iOS 26+ it renders the native `GlassView` (via {@link EtGlassView}); on every
 * other platform it falls back to a frosted blur. Self-contained: it detects
 * liquid-glass support and provides the `LiquidGlassContext` for its own subtree.
 *
 * Domain content (label, value, sparkline) is composed via
 * `EtPreviewContainer.Content` / `EtPreviewContainer.Trailing`.
 *
 * @example
 * ```tsx
 * <EtPreviewContainer floating syncWithTabBar onPress={open} accessibilityLabel="My portfolio value">
 *   <EtPreviewContainer.Content>
 *     <EtText>My portfolio value</EtText>
 *     <EtNumber ... />
 *   </EtPreviewContainer.Content>
 *   <EtPreviewContainer.Trailing>
 *     <EtSparkChart ... />
 *   </EtPreviewContainer.Trailing>
 * </EtPreviewContainer>
 * ```
 */
function EtPreviewContainerBase({
  children,
  onPress,
  accessibilityLabel,
  floating = false,
  syncWithTabBar = false,
  showHandle = true,
  haptics = true,
  disabled = false,
  style,
  testID,
}: EtPreviewContainerProps) {
  const { colors, dark: isDarkMode } = useEtoroTheme();
  const { supportsLiquidGlass } = useLiquidGlass();
  const insets = useSafeAreaInsets();
  const tabBarVisibility = useTabBarVisibility();

  const liquidGlassCtx = useMemo(() => ({ isLiquidGlass: supportsLiquidGlass }), [supportsLiquidGlass]);

  const fallbackBlur = IS_ANDROID ? ANDROID_CARD_BLUR : ({ intensity: DEFAULT_BLUR_INTENSITY, tint: isDarkMode ? 'dark' : 'light' } as const);
  const fallbackBackgroundColor = isDarkMode ? colors.bgButtonGroupPressed : LIGHT_FALLBACK_BACKGROUND;
  const scrimOpacity = IS_ANDROID && !isDarkMode ? CARD_SCRIM_OPACITY_ANDROID_LIGHT : CARD_SCRIM_OPACITY;

  // Without `onPress` this is a plain container, so it must not announce itself as a button.
  const isPressable = Boolean(onPress);

  const handlePress = useCallback(() => {
    if (disabled || !onPress) return;
    if (haptics) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }
    onPress();
  }, [disabled, haptics, onPress]);

  const cardBottom = PREVIEW_CONTAINER_BOTTOM_OFFSET + insets.bottom;

  // The card sizes to its content, so its real height is only known after layout. `PREVIEW_HEIGHT` is the
  // fallback for the first frame. Hiding slides the card (plus its shadow) fully past the screen edge.
  const measuredCardHeight = useSharedValue(PREVIEW_HEIGHT);
  const handleCardLayout = useCallback(
    (event: LayoutChangeEvent) => {
      measuredCardHeight.value = event.nativeEvent.layout.height;
    },
    [measuredCardHeight],
  );

  // Reveal progress: 1 = fully shown, 0 = fully hidden (slid off-screen). Driving this from a single
  // shared value — instead of calling `withTiming` inside `useAnimatedStyle` — means the animation is
  // started exactly once per visibility change. Starting animations inside the style worklet restarts
  // them on every re-evaluation (e.g. when the screen thaws out of `react-freeze` after a pushed screen
  // is popped), which can collapse the reveal into a single frame; the native glass surface then never
  // gets the frames it needs to sample its backdrop and renders transparent.
  const revealProgress = useSharedValue(1);

  useAnimatedReaction(
    () => (syncWithTabBar ? (tabBarVisibility?.value ?? true) : true),
    (isVisible, prev) => {
      if (prev != null && prev === isVisible) return;
      revealProgress.value = withTiming(isVisible ? 1 : 0, { duration: HIDE_ANIMATION_DURATION });
    },
    [syncWithTabBar, tabBarVisibility, revealProgress],
  );

  // Hide by sliding only — never by fading. A native liquid-glass surface stops rendering its material
  // once an ancestor's alpha drops below 1 while the window is covered by a pushed screen, and restoring
  // the alpha afterwards does not bring the material back (the card reads as plain transparent). The
  // bottom tab bar's glass survives the same navigation because it also hides purely by moving.
  const cardHideStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: (1 - revealProgress.value) * (cardBottom + Math.max(measuredCardHeight.value, PREVIEW_HEIGHT) + CARD_SHADOW_RADIUS) },
      ],
    }),
    [cardBottom, measuredCardHeight, revealProgress],
  );

  const cardHideProps = useAnimatedProps(
    () => ({
      pointerEvents: ((syncWithTabBar ? (tabBarVisibility?.value ?? true) : true) ? 'auto' : 'none') as 'auto' | 'none',
    }),
    [syncWithTabBar, tabBarVisibility],
  );

  const card = (
    <Pressable
      onPress={handlePress}
      disabled={disabled || !isPressable}
      accessibilityRole={isPressable ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={isPressable ? { disabled } : undefined}
      testID={testID}
      style={[
        styles.glassCardPressable,
        styles.glassCardShadow,
        // Android only casts an elevation shadow when the elevated view has a (non-transparent) background
        // to derive its outline from — and it needs a solid shadow colour. So on Android the fill lives
        // here (not on the glass) and the shadow is solid.
        IS_ANDROID
          ? { shadowColor: colors.carbonStatic900, backgroundColor: fallbackBackgroundColor }
          : { shadowColor: colors.carbonEffectPrimaryShadow },
        !floating && style,
      ]}
    >
      <LiquidGlassContext.Provider value={liquidGlassCtx}>
        {/* 'regular' (not 'clear') gives the heavier frosted blur the design wants. The 'regular'
            material adds a grey lift, so we tint with the page's background at ~30% opacity. */}
        <EtGlassView
          style={styles.glassCard}
          glassEffectStyle="regular"
          tintColor={withAlpha(colors.backgroundBase, 0.3)}
          fallbackStyle={[styles.glassCardFallback, !IS_ANDROID && { backgroundColor: fallbackBackgroundColor }]}
        >
          {!supportsLiquidGlass && (
            <>
              <BlurView {...fallbackBlur} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
              <View
                style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.bgNeutralSecondary, opacity: scrimOpacity }]}
                pointerEvents="none"
              />
            </>
          )}
          {showHandle && (
            <View style={styles.cardHandleRow} pointerEvents="none" testID={testID ? `${testID}.Handle` : 'EtPreviewContainer.Handle'}>
              <View style={[styles.cardHandle, { backgroundColor: colors.carbon300 }]} />
            </View>
          )}
          <View style={styles.previewContent}>{children}</View>
        </EtGlassView>
      </LiquidGlassContext.Provider>
    </Pressable>
  );

  if (!floating) {
    return card;
  }

  return (
    <Animated.View
      style={[styles.cardContainer, { bottom: cardBottom }, cardHideStyle, style]}
      animatedProps={cardHideProps}
      onLayout={handleCardLayout}
      testID={testID ? `${testID}.Floating` : 'EtPreviewContainer.Floating'}
    >
      {card}
    </Animated.View>
  );
}

EtPreviewContainerBase.displayName = 'EtPreviewContainer';

const PreviewContainerMemo = React.memo(EtPreviewContainerBase);

/**
 * EtPreviewContainer compound component with subcomponents.
 *
 * Subcomponents:
 * - `EtPreviewContainer.Content` — left-side text stack
 * - `EtPreviewContainer.Trailing` — right-side trailing visual
 */
export const EtPreviewContainer = Object.assign(PreviewContainerMemo, {
  Content: PreviewContainerContent,
  Trailing: PreviewContainerTrailing,
});
