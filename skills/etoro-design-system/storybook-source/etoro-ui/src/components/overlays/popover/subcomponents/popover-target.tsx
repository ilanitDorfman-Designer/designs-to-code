import { StyleSheet, View } from 'react-native';

import type { PopoverTargetProps } from '../api/types';

/**
 * EtPopover.Target - Wraps the target element that the popover points to
 * This component provides the positioning anchor for the popover content
 */
export function PopoverTarget({ children, style, testID, accessibilityLabel }: PopoverTargetProps) {
  return (
    <View style={[styles.container, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

PopoverTarget.displayName = 'EtPopover.Target';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
    flexGrow: 0,
    flexShrink: 0,
  },
});
