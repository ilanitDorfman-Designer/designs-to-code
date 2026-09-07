import * as Haptics from 'expo-haptics';
import { cloneElement, isValidElement, ReactElement, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { X2 } from '../../../core/styles/spacing';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { EtButton } from '../../button/et-button';
import { EtButtonProps } from '../../button/utils/types';
import type { EtFabMenuTriggerProps } from '../api';
import { useFabMenuContext } from '../context';

const FAB_SIZE = 44;
const FAB_BORDER_RADIUS = FAB_SIZE / 2;

const SPRING_CONFIG = {
  damping: 40,
  stiffness: 180,
};

/**
 * EtFabMenu.Trigger - The main FAB button that toggles the menu
 *
 * When children is provided (EtButton or function), renders it with toggle behavior.
 * When no children, renders default FAB with plus/close icon based on state.
 */
export function EtFabMenuTrigger({ children }: EtFabMenuTriggerProps) {
  const { isOpen, toggle } = useFabMenuContext();
  const { colors } = useEtoroTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.set(withSpring(isOpen ? 1 : 0, SPRING_CONFIG));
  }, [isOpen, rotation]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get() * 45}deg` }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggle();
  };

  if (children != null && children !== false) {
    const content = typeof children === 'function' ? children(isOpen) : children;

    if (content != null && content !== false && isValidElement(content) && content.type === EtButton) {
      return cloneElement(content as ReactElement<{ onPress?: () => void }>, {
        onPress: handlePress,
      });
    }

    if (content != null && content !== false) {
      return (
        <EtButton onPress={handlePress} testID="et-fab-menu-trigger">
          {content as EtButtonProps['children']}
        </EtButton>
      );
    }
  }

  // Default FAB: circular, primary green, star/close icon with rotation
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.fab,
        {
          backgroundColor: colors.bgActionBrand,
          shadowColor: colors.bgNeutralDark,
        },
      ]}
      testID="et-fab-menu-trigger"
      accessibilityRole="button"
      accessibilityLabel={isOpen ? 'Close menu' : 'Open menu'}
      accessibilityState={{ expanded: isOpen }}
      accessibilityHint={isOpen ? 'Double tap to close' : 'Double tap to expand'}
    >
      <Animated.View style={iconAnimatedStyle}>
        <EtoroIcon
          icon={{ iconName: isOpen ? 'close' : 'star' }}
          appearance={{
            size: 20,
            color: colors.textInvertedPrimaryNeutral,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}

EtFabMenuTrigger.displayName = 'EtFabMenu.Trigger';

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    padding: X2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});
