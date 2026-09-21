import { Children, isValidElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { X3 } from '../../../core/styles/spacing';
import type { EtFabMenuActionsProps } from '../api';
import { useFabMenuContext } from '../context';
import { EtFabMenuButton } from './et-fab-menu-button';

const ENTER_DURATION = 50;
const EXIT_DURATION = 150;
const STAGGER_DELAY = 20;

/**
 * EtFabMenu.Actions - Container for FAB action buttons
 *
 * Renders children (EtFabMenu.Button) in a vertical stack above the trigger.
 * Only visible when menu is open.
 */
export function EtFabMenuActions({ children }: EtFabMenuActionsProps) {
  const { isOpen } = useFabMenuContext();

  if (!isOpen) {
    return null;
  }

  const validChildren = Children.toArray(children).filter((child) => {
    if (isValidElement(child) && child.type === EtFabMenuButton) {
      return true;
    }
    if (__DEV__ && isValidElement(child)) {
      console.warn('EtFabMenu.Actions: Invalid child. Only EtFabMenu.Button components are valid children.');
    }
    return false;
  });

  return (
    <View style={styles.container} testID="et-fab-menu-actions">
      {validChildren.map((child, index) => (
        <Animated.View
          key={isValidElement(child) && child.key != null ? String(child.key) : index}
          entering={FadeInDown.duration(ENTER_DURATION)
            .delay(index * STAGGER_DELAY)
            .springify()
            .damping(40)
            .stiffness(300)}
          exiting={FadeOutDown.duration(EXIT_DURATION)}
        >
          {child}
        </Animated.View>
      ))}
    </View>
  );
}

EtFabMenuActions.displayName = 'EtFabMenu.Actions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: X3,
  },
});
