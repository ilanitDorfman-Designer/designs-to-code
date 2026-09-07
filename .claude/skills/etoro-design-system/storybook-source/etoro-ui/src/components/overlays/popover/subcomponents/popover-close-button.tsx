import React, { FC, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X2, X4 } from '../../../../core/styles/spacing';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import type { PopoverCloseButtonProps } from '../api/types';
import { usePopoverContext } from '../context';

const ICON_SIZE = X4;

/**
 * EtPopover.CloseButton - X button to dismiss the popover
 * Uses close icon, positioned in top-right area of content
 * Uses iconColor from context to ensure visibility on inverted popover background
 */
function PopoverCloseButtonComponent({ onPress, testID }: PopoverCloseButtonProps) {
  const { onClose, iconColor } = usePopoverContext();

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      onClose?.();
    }
  }, [onPress, onClose]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={X2}
      style={styles.container}
      testID={testID}
      accessibilityLabel="Close popover"
      accessibilityRole="button"
    >
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: ICON_SIZE, color: iconColor }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

PopoverCloseButtonComponent.displayName = 'EtPopover.CloseButton';

export const PopoverCloseButton: FC<PopoverCloseButtonProps> = React.memo(PopoverCloseButtonComponent);
PopoverCloseButton.displayName = 'EtPopover.CloseButton';
