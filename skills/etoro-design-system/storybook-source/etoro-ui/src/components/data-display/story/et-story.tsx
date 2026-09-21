import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { X1 } from '../../../core/styles/spacing';
import { EtAvatar } from '../../social/avatar/et-avatar';
import type { EtStoryProps } from './api/types';
import { LoadingRing, StoryRing } from './components';
import { useLabelText } from './hooks';
import { StoryLabel } from './subcomponents/story-label';

// Sizes from Figma design
const AVATAR_SIZE = 56;
const RING_SIZE = 64; // 56px (avatar) + 2px gap * 2 + 2px border * 2

/**
 * EtStory - A circular avatar component with label for stories
 *
 * Displays a circular avatar with an unwatched indicator ring.
 * Ring is shown when `watched=false` (new content), hidden when `watched=true` (already seen).
 * Supports press interaction and loading state.
 *
 * @example Default story (no overlay)
 * ```tsx
 * <EtStory
 *   imageSource="https://example.com/user.png"
 *   onPress={() => console.log('Story pressed')}
 * >
 *   <EtStory.Label>John</EtStory.Label>
 * </EtStory>
 * ```
 *
 * @example Instrument story (with gradient overlay)
 * ```tsx
 * <EtStory
 *   imageSource="https://example.com/tsla.png"
 *   variant="instrument"
 *   onPress={() => console.log('Story pressed')}
 * >
 *   <EtStory.Label>TSLA</EtStory.Label>
 * </EtStory>
 * ```
 *
 * @example Already watched (no ring)
 * ```tsx
 * <EtStory imageSource="https://example.com/tsla.png" watched={true}>
 *   <EtStory.Label>TSLA</EtStory.Label>
 * </EtStory>
 * ```
 */
function EtStoryBase({
  imageSource,
  variant = 'default',
  watched = false,
  loading = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
  children,
}: EtStoryProps) {
  const { colors } = useEtoroTheme();
  const prevLoadingRef = useRef(loading);
  const avatarScale = useSharedValue(1);

  // Component is non-interactive when loading
  const isInteractive = !loading && !!onPress;

  // Trigger "pop" animation when loading finishes (true -> false)
  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      // Loading just finished - trigger scale pop animation
      avatarScale.value = withSequence(withTiming(1.08, { duration: 150 }), withTiming(1, { duration: 150 }));
    }
    prevLoadingRef.current = loading;
  }, [loading, avatarScale]);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  // Validate children and extract label text for accessibility
  const labelText = useLabelText(children);

  // Determine which ring to show:
  // - Loading takes precedence (show animated ring)
  // - Otherwise show static ring when unwatched
  const showLoadingRing = loading;
  const showUnwatchedRing = !loading && !watched;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: !isInteractive }}
      accessibilityLabel={accessibilityLabel || (labelText ? `Story: ${labelText}` : 'Story')}
      accessibilityHint={loading ? 'Loading content' : isInteractive ? (watched ? 'Already viewed' : 'New story, tap to view') : undefined}
    >
      <View style={styles.content}>
        {/* Avatar container */}
        <View style={styles.avatarContainer}>
          {/* Loading ring - animated spinner while content is loading */}
          {showLoadingRing && (
            <LoadingRing
              size={RING_SIZE}
              startColor={colors.positiveGradientPrimary50}
              endColor={colors.positiveGradientPrimary70}
              testID="loading-ring"
            />
          )}

          {/* Story ring - static ring when story hasn't been watched */}
          {showUnwatchedRing && (
            <StoryRing
              size={RING_SIZE}
              startColor={colors.positiveGradientPrimary50}
              endColor={colors.positiveGradientPrimary70}
              testID="story-ring"
            />
          )}

          {/* Avatar image - centered within ring container */}
          <Animated.View style={avatarAnimatedStyle}>
            <EtAvatar variant={variant} shape="circle" style={styles.avatarImageContainer}>
              <EtAvatar.Image src={imageSource} contentFit="cover" style={styles.avatarImage} />
              <EtAvatar.Fallback>{labelText}</EtAvatar.Fallback>
            </EtAvatar>
          </Animated.View>
        </View>

        {/* Label */}
        <View style={styles.labelContainer}>{children}</View>
      </View>
    </Pressable>
  );
}

EtStoryBase.displayName = 'EtStory';

/**
 * EtStory with compound components attached
 */
const MemoizedEtStory = React.memo(EtStoryBase);
MemoizedEtStory.displayName = 'EtStory';

export const EtStory = Object.assign(MemoizedEtStory, {
  Label: StoryLabel,
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: RING_SIZE,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: X1,
    width: RING_SIZE,
    height: RING_SIZE,
  },
  avatarImageContainer: {
    overflow: 'hidden',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  labelContainer: {
    alignItems: 'center',
    width: RING_SIZE,
  },
});
