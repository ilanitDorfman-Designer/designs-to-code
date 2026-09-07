import { StyleSheet, View } from 'react-native';

import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { useButtonContext } from '../utils/context';
import type { EtButtonIconProps } from '../utils/types';

/**
 * EtButton.Icon - Icon subcomponent for EtButton
 * Automatically sized and colored based on parent button context
 * @deprecated Use EtButton.IconV2 instead
 */
export function ButtonIcon({ name, appearance, ...props }: EtButtonIconProps) {
  const { iconSize, iconColor, loading } = useButtonContext();

  return (
    <View style={styles.container}>
      <EtoroIcon
        icon={{ iconName: loading ? 'loader' : name }}
        appearance={{
          size: appearance?.size ?? iconSize,
          color: appearance?.color ?? iconColor,
        }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
