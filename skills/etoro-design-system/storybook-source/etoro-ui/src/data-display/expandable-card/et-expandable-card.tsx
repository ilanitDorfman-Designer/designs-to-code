import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { EtExpandableCardProps } from './api';

const BAR_HEIGHT = 24;
const BAR_PILL_WIDTH = 17;
const BAR_PILL_HEIGHT = 6;
const EXPAND_OPEN_DURATION = 950; // slow but starts immediately
const EXPAND_CLOSE_DURATION = 650;
const PILL_DURATION = 220;

export function EtExpandableCard({
  collapsedContent,
  expandedContent,
  defaultExpanded = false,
  onExpansionChange,
  style,
  collapsedStyle,
  expandedStyle,
  testID,
  canExpand = true,
  collapsedFillColor,
}: EtExpandableCardProps) {
  const colorScheme = useColorScheme();
  const theme = useEtoroTheme();
  const { colors } = theme;
  const isDarkMode = (theme as { isDarkMode?: boolean }).isDarkMode ?? colorScheme === 'dark';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [renderExpanded, setRenderExpanded] = useState(defaultExpanded);
  const [forceShowCollapsedBar, setForceShowCollapsedBar] = useState(!defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const prevDefaultExpanded = useRef(defaultExpanded);
  const pillWidth = useSharedValue(BAR_PILL_WIDTH);
  const expandProgress = useSharedValue(defaultExpanded ? 1 : 0);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animatePill = (toValue: number) => {
    pillWidth.value = withTiming(toValue, { duration: PILL_DURATION });
  };

  const handleExpansionChange = useCallback(
    (expanded: boolean) => {
      if (!canExpand) return;

      // clear any pending close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      // ensure expanded content renders during animation
      setRenderExpanded(true);
      setIsExpanded(expanded);
      setForceShowCollapsedBar(!expanded); // show bar immediately on collapse
      onExpansionChange?.(expanded);

      const duration = expanded ? EXPAND_OPEN_DURATION : EXPAND_CLOSE_DURATION;

      expandProgress.value = withTiming(expanded ? 1 : 0, {
        duration,
        easing: Easing.out(Easing.cubic),
      });

      if (!expanded) {
        closeTimeoutRef.current = setTimeout(() => {
          setRenderExpanded(false);
        }, duration);
      }
    },
    [canExpand, onExpansionChange, expandProgress],
  );

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (prevDefaultExpanded.current !== defaultExpanded) {
      prevDefaultExpanded.current = defaultExpanded;
      handleExpansionChange(defaultExpanded);
    }
  }, [defaultExpanded, handleExpansionChange]);

  const onCollapsedContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
    }
  };

  const onExpandedContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && expandedHeight === 0) {
      setExpandedHeight(height);
    }
  };

  // Calculate heights based on expansion state
  const currentTranslateY = isExpanded ? -contentHeight : 0;
  const currentHeight = isExpanded && expandedHeight > 0 ? expandedHeight : contentHeight > 0 ? contentHeight : undefined;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: expandProgress.value * 0.02 + 0.98,
      },
    ],
    opacity: expandProgress.value * 0.08 + 0.92,
  }));

  const animatedPillStyle = useAnimatedStyle(() => ({
    width: pillWidth.value,
  }));

  const containerStyle = [
    {
      borderRadius: 12,
      overflow: 'hidden' as const,
      backgroundColor: isExpanded ? colors.bgNeutralPrimary : 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      marginBottom: !isExpanded ? BAR_HEIGHT : undefined,
    },
    style,
    isExpanded ? expandedStyle : collapsedStyle,
  ];

  const renderCollapsedBar = () => (
    <View style={styles.barContainer} pointerEvents="box-none">
      <TouchableOpacity
        style={[styles.barPillTouchable, !canExpand && styles.barPillTouchableDisabled]}
        onPress={canExpand ? () => handleExpansionChange(true) : undefined}
        activeOpacity={0.7}
        testID={`${testID}-expand-bar`}
        disabled={!canExpand}
        onPressIn={() => animatePill(23)}
        onPressOut={() => animatePill(BAR_PILL_WIDTH)}
        onFocus={() => animatePill(23)}
        onBlur={() => animatePill(BAR_PILL_WIDTH)}
      >
        <Animated.View
          style={[styles.barPill, !canExpand && styles.barPillDisabled, animatedPillStyle, { backgroundColor: colors.textDisabledPrimaryNeutral }]}
        />
      </TouchableOpacity>
    </View>
  );

  const cardContent = (
    <View style={[styles.contentWrapper, { transform: [{ translateY: currentTranslateY }] }]} collapsable={false}>
      <View onLayout={onCollapsedContentLayout} collapsable={false}>
        {renderExpanded && canExpand && !forceShowCollapsedBar ? (
          <Pressable onPress={() => handleExpansionChange(false)} collapsable={false}>
            {collapsedContent}
          </Pressable>
        ) : (
          <>
            {collapsedContent}
            {canExpand && renderCollapsedBar()}
          </>
        )}
      </View>
      {canExpand && renderExpanded && (
        <Pressable onPress={() => handleExpansionChange(false)} collapsable={false}>
          <View onLayout={onExpandedContentLayout}>{expandedContent}</View>
        </Pressable>
      )}
    </View>
  );

  return (
    <Animated.View style={[containerStyle, { height: currentHeight }, animatedContainerStyle]} testID={testID} collapsable={false}>
      <Svg pointerEvents="none" style={styles.cardBackground} width="100%" height="100%" viewBox="0 0 327 187" preserveAspectRatio="none" fill="none">
        <Path
          d={
            canExpand
              ? // Curved bottom edge for expandable cards (stocks with charts)
                'M0 12C0 5.37259 5.37258 0 12 0H315C321.627 0 327 5.37258 327 12V175C327 181.627 321.627 187 315 187H203.671C201.593 187 199.554 186.459 197.712 185.497C191.351 182.174 175.47 174.5 164.5 174.5C153.47 174.5 137.163 182.259 130.741 185.551C128.927 186.481 126.93 187 124.89 187H12C5.37258 187 0 181.627 0 175V12Z'
              : // Straight bottom edge for non-expandable cards (mirrors)
                'M0 12C0 5.37259 5.37258 0 12 0H315C321.627 0 327 5.37258 327 12V175C327 181.627 321.627 187 315 187H12C5.37258 187 0 181.627 0 175V12Z'
          }
          // Use provided fill when passed; otherwise default to theme-based fill
          fill={collapsedFillColor ?? (isDarkMode ? colors.bgOverlayBottom : '#fff')}
        />
      </Svg>
      {cardContent}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {},
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  barContainer: {
    position: 'absolute',
    left: '50%',
    width: 60,
    bottom: 3,
    marginLeft: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barPillTouchable: {
    width: BAR_PILL_WIDTH,
    height: BAR_PILL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  barPillTouchableDisabled: {
    opacity: 0.4,
  },
  barPillDisabled: {
    backgroundColor: '#666',
  },
  barPill: {
    width: BAR_PILL_WIDTH,
    height: '100%',
    borderRadius: BAR_PILL_HEIGHT / 2,
    opacity: 0.9,
  },
});
