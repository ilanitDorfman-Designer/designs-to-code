import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X1 } from '../../../../core/styles';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { EtText } from '../../../../foundations/text/et-text';
import type { PopoverTextProps } from '../api/types';
import { usePopoverContext } from '../context';

const ICON_SIZE = 12;

/**
 * EtPopover.Text - Text subcomponent with optional icon
 * Automatically styled based on parent popover context
 */
function PopoverTextComponent({ children, iconName, style, testID }: PopoverTextProps) {
  const { textColor, iconColor } = usePopoverContext();

  // Memoize text style to avoid creating new objects on every render
  const textStyle = useMemo(() => ({ color: textColor }), [textColor]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {iconName && <EtoroIcon icon={{ iconName }} appearance={{ size: ICON_SIZE, color: iconColor }} />}
      <EtText variant="body-base-regular" style={textStyle}>
        {children}
      </EtText>
    </View>
  );
}

PopoverTextComponent.displayName = 'EtPopover.Text';

export const PopoverText: FC<PopoverTextProps> = React.memo(PopoverTextComponent);
PopoverText.displayName = 'EtPopover.Text';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: X1,
  },
});
