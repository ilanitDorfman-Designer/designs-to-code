import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1, X2, X3, X12 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { TabsTriggerProps } from '../api/types';
import { useTabsContext } from '../context';

/**
 * TabsTrigger - Individual tab button within TabsList
 *
 * Reads selection state from Tabs context.
 * Registers its layout for indicator positioning.
 *
 * Extends PressableProps for full extensibility - additional props
 * are spread to the underlying Pressable component.
 *
 * @example
 * ```tsx
 * <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
 * ```
 *
 * @example With custom props
 * ```tsx
 * <EtTabs.Trigger
 *   value="overview"
 *   hitSlop={16}
 *   onLongPress={() => console.log('long press')}
 * >
 *   Overview
 * </EtTabs.Trigger>
 * ```
 */
function TabsTriggerBase({
  value,
  children,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  onLayout: consumerOnLayout,
  // Spread remaining Pressable props
  ...pressableProps
}: TabsTriggerProps) {
  const { colors } = useEtoroTheme();
  const { state, actions, meta } = useTabsContext();

  const isSelected = state.activeValue === value;

  // Handle press
  const handlePress = useCallback(() => {
    if (disabled || isSelected) {
      return;
    }
    actions.setActiveValue(value);
  }, [disabled, isSelected, actions, value]);

  // Handle layout to register position for indicator.
  // Composed with any consumer-provided onLayout so the indicator
  // keeps tracking this trigger even when consumers observe layout.
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      meta.registerTrigger(value, { x, width });
      consumerOnLayout?.(event);
    },
    [meta, value, consumerOnLayout],
  );

  // Memoize derived text color
  const textColor = useMemo(
    () => (disabled ? colors.textDisabledPrimaryNeutral : isSelected ? colors.textPrimaryNeutral : colors.textTertiaryNeutral),
    [disabled, isSelected, colors],
  );

  // Memoize accessibility state object
  const accessibilityState = useMemo(
    () => ({
      selected: isSelected,
      disabled,
    }),
    [disabled, isSelected],
  );

  return (
    <Pressable
      {...pressableProps}
      onPress={handlePress}
      onLayout={handleLayout}
      disabled={disabled}
      style={[styles.trigger, disabled && styles.disabled, style]}
      testID={testID}
      accessibilityRole="tab"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel || children}
      hitSlop={{ top: X2, bottom: X2, left: X1, right: X1 }}
    >
      <EtText variant="body-base-regular" style={[styles.label, { color: textColor }]}>
        {children}
      </EtText>
    </Pressable>
  );
}

export const TabsTrigger = React.memo(TabsTriggerBase);
TabsTrigger.displayName = 'EtTabs.Trigger';

const styles = StyleSheet.create({
  trigger: {
    height: X12,
    paddingHorizontal: X3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {},
});
