import React, { Children, isValidElement, memo, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { isRTL } from '../../../utils/rtl';
import type { EtToggleGroupProps, ToggleGroupOptionProps } from './api';
import { ToggleGroupContext } from './context';
import { ToggleGroupOption } from './subcomponents';
import { getToggleGroupSizeConfig } from './utils';

const TOGGLE_GROUP_SPRING_CONFIG = { damping: 30, stiffness: 300, mass: 2 };

function EtToggleGroupRoot({
  children,
  selectedId,
  onSelectionChange,
  size = 'default',
  disabled = false,
  haptics = true,
  trackColor,
  indicatorColor,
  style,
  testID,
  accessibilityRole = 'radiogroup',
  accessibilityLabel,
  accessibilityHint,
}: EtToggleGroupProps) {
  const { colors } = useEtoroTheme();
  const sizeConfig = getToggleGroupSizeConfig(size);
  const rtl = isRTL();
  // Pin the indicator to the physical left edge in both directions.
  // `doLeftAndRightSwapInRTL` maps `right` → physical left in RTL, so
  // translateX can stay physical (same pattern as EtTextToggle).
  const indicatorEdgeAnchor = rtl ? 'right' : 'left';

  const options = useMemo(() => {
    return Children.toArray(children).map((child) => {
      if (isValidElement<ToggleGroupOptionProps>(child) && child.type === ToggleGroupOption) {
        return child;
      }

      throw new Error('EtToggleGroup: Invalid child passed. Only <EtToggleGroup.Option> components are valid children.');
    });
  }, [children]);

  const selectedIndex = options.findIndex((option) => option.props.id === selectedId);
  const optionCount = options.length;
  const progress = useSharedValue(Math.max(selectedIndex, 0));
  const optionSize = sizeConfig.optionSize;

  useEffect(() => {
    if (selectedIndex < 0) return;
    progress.set(withSpring(selectedIndex, TOGGLE_GROUP_SPRING_CONFIG));
  }, [progress, selectedIndex]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    // flexDirection:'row' mirrors options in RTL, so index 0 sits on the
    // physical right. Map progress → offset from the physical left edge.
    const currentProgress = progress.get();
    const indexFromPhysicalLeft = rtl ? optionCount - 1 - currentProgress : currentProgress;
    return {
      transform: [{ translateX: indexFromPhysicalLeft * optionSize }],
    };
  }, [rtl, optionCount, optionSize]);

  const handleSelect = useCallback(
    (id: string) => {
      if (disabled || id === selectedId) return;
      onSelectionChange?.(id);
    },
    [disabled, onSelectionChange, selectedId],
  );

  const contextValue = useMemo(
    () => ({
      selectedId,
      onSelect: handleSelect,
      size,
      disabled,
      haptics,
    }),
    [disabled, handleSelect, haptics, selectedId, size],
  );

  const containerStyle = {
    width: sizeConfig.optionSize * options.length + sizeConfig.padding * 2,
    height: sizeConfig.height,
    borderRadius: sizeConfig.height / 2,
    padding: sizeConfig.padding,
    backgroundColor: trackColor ?? `${colors.carbon900}08`,
  };

  const indicatorStyle = {
    [indicatorEdgeAnchor]: sizeConfig.padding,
    top: sizeConfig.padding,
    width: sizeConfig.optionSize,
    height: sizeConfig.optionSize,
    borderRadius: sizeConfig.optionSize / 2,
    backgroundColor: indicatorColor ?? colors.carbonPrimaryDivider,
  };

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <View
        style={[styles.container, containerStyle, disabled && styles.disabled, style]}
        testID={testID}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {selectedIndex >= 0 && (
          <Animated.View style={[styles.indicator, indicatorStyle, animatedIndicatorStyle]} testID={testID ? `${testID}-indicator` : undefined} />
        )}
        {options}
      </View>
    </ToggleGroupContext.Provider>
  );
}

const EtToggleGroupBase = memo(EtToggleGroupRoot);
EtToggleGroupBase.displayName = 'EtToggleGroup';

export const EtToggleGroup = Object.assign(EtToggleGroupBase, {
  Option: ToggleGroupOption,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.2,
  },
  indicator: {
    position: 'absolute',
  },
});
