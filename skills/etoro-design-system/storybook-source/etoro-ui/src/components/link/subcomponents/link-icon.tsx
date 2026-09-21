import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X1 } from '../../../core/styles/spacing';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import type { EtLinkIconProps } from '../api/types';
import { useLinkContext } from '../utils/context';

/**
 * EtLink.Icon - Icon subcomponent for EtLink
 * Automatically sized and colored based on parent link context.
 * Uses iconPosition from context for spacing (icon can be left or right).
 */
function LinkIconInner({ name, appearance, ...props }: EtLinkIconProps) {
  const { iconSize, iconColor, iconPosition, loading } = useLinkContext();

  const positionStyle = useMemo(
    () => (iconPosition === 'leading' ? styles.leading : iconPosition === 'trailing' ? styles.trailing : null),
    [iconPosition],
  );

  if (loading) {
    return null;
  }

  return (
    <View style={[styles.container, positionStyle]}>
      <EtoroIcon
        icon={{ iconName: name }}
        appearance={{
          size: appearance?.size ?? iconSize,
          color: appearance?.color ?? iconColor,
        }}
        {...props}
      />
    </View>
  );
}

export const LinkIcon = React.memo(LinkIconInner);
LinkIcon.displayName = 'EtLink.Icon';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Space between icon and label when icon is on the left (leading) */
  leading: {
    marginEnd: X1,
  },
  /** Space between label and icon when icon is on the right (trailing) */
  trailing: {
    marginStart: X1,
  },
});
