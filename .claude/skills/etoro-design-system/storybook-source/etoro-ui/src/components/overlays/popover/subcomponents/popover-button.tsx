import React, { FC, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X2, X5, X9 } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text/et-text';
import type { PopoverButtonProps } from '../api/types';
import { usePopoverContext } from '../context';

/**
 * EtPopover.Button - Action button subcomponent
 * Styled with inverted border to match popover theme
 */
export const PopoverButton: FC<PopoverButtonProps> = React.memo(function PopoverButton({ children, onPress, style, testID }: PopoverButtonProps) {
  const { textColor } = usePopoverContext();

  // Memoize the text style to avoid creating new objects on every render
  const textStyle = useMemo(() => ({ color: textColor }), [textColor]);

  return (
    <Pressable
      style={({ pressed }) => [styles.button, { borderColor: textColor, opacity: pressed ? 0.7 : 1 }, style]}
      onPress={onPress}
      accessibilityRole="button"
      testID={testID}
    >
      <EtText variant="label-tertiary-semibold" style={textStyle}>
        {children}
      </EtText>
    </Pressable>
  );
});

PopoverButton.displayName = 'EtPopover.Button';

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: X5,
    paddingVertical: X2,
    borderRadius: X9,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
