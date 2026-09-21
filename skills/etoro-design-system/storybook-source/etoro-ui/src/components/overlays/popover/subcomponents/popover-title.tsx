import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { X1 } from '../../../../core/styles';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { EtText } from '../../../../foundations/text/et-text';
import type { PopoverTitleProps } from '../api/types';
import { usePopoverContext } from '../context';

const ICON_SIZE = 12;

/**
 * EtPopover.Title - Title subcomponent with optional icon
 * Automatically styled based on parent popover context
 */
export const PopoverTitle: FC<PopoverTitleProps> = React.memo(function PopoverTitle({ children, iconName, style, testID }: PopoverTitleProps) {
  const { textColor, iconColor } = usePopoverContext();

  return (
    <View style={[styles.container, style]} testID={testID}>
      {iconName && <EtoroIcon icon={{ iconName }} appearance={{ size: ICON_SIZE, color: iconColor }} />}
      <EtText variant="body-base-semibold" style={{ color: textColor }}>
        {children}
      </EtText>
    </View>
  );
});

PopoverTitle.displayName = 'EtPopover.Title';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    gap: X1,
  },
});
