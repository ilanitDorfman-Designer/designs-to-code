import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { EtExpandableProps } from './api';
import { FadeGradient, ToggleButton } from './components';
import { useExpandableAnimation } from './hooks';

const TOGGLE_BUTTON_HEIGHT = 40;

export function EtExpandable({
  children,
  collapsedHeight,
  collapsedItems,
  itemHeight = 50,
  initialExpanded = false,
  onExpandedChange,
  animationDuration,
  showMoreText = 'Show More',
  showLessText = 'Show Less',
  showToggleButton = true,
  style,
  toggleButtonStyle,
  renderToggleButton,
  showGradient = true,
  forceNeedsExpansion = false,
  testID,
}: EtExpandableProps) {
  const calculatedCollapsedHeight = collapsedHeight ?? (collapsedItems ? collapsedItems * itemHeight : 200);

  const { needsExpansion, contentHeight, expandProgress, isExpandedRef, handleContentLayout, handleToggle } = useExpandableAnimation({
    initialExpanded,
    calculatedCollapsedHeight,
    animationDuration,
    onExpandedChange,
    forceNeedsExpansion,
  });

  const outerStyle = useAnimatedStyle(() => {
    'worklet';
    if (contentHeight.value === 0) return {};
    return {
      height: contentHeight.value + TOGGLE_BUTTON_HEIGHT,
    };
  });

  const clipStyle = useAnimatedStyle(() => {
    'worklet';
    if (contentHeight.value === 0) return {};
    return {
      height: contentHeight.value,
      overflow: 'hidden' as const,
    };
  });

  return (
    <Animated.View style={[style, needsExpansion ? outerStyle : undefined]}>
      <Animated.View style={clipStyle}>
        <View onLayout={handleContentLayout}>{children}</View>
        {showGradient && needsExpansion && <FadeGradient expandProgress={expandProgress} />}
      </Animated.View>

      {showToggleButton &&
        needsExpansion &&
        (renderToggleButton ? (
          renderToggleButton({
            expanded: isExpandedRef.current,
            onToggle: handleToggle,
            showMoreText,
            showLessText,
          })
        ) : (
          <ToggleButton
            expandProgress={expandProgress}
            showMoreText={showMoreText}
            showLessText={showLessText}
            onToggle={handleToggle}
            testID={testID}
            style={toggleButtonStyle}
          />
        ))}
    </Animated.View>
  );
}
