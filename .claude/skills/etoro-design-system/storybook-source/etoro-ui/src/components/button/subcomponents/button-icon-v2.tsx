import { StyleSheet, View } from 'react-native';

import { EtIconV2 } from '../../et-icon-v2/et-icon-v2';
import { useButtonContext } from '../utils/context';
import type { EtButtonIconV2Props } from '../utils/types';

/**
 * EtButton.IconV2 - Icon subcomponent for EtButton, backed by EtIconV2.
 * Automatically sized and colored based on parent button context.
 */
export function ButtonIconV2({ name, size, color, ...props }: EtButtonIconV2Props) {
  const { iconSize, iconColor, loading } = useButtonContext();

  return (
    <View style={styles.container}>
      <EtIconV2 name={loading ? 'loader' : name} size={size ?? iconSize} color={color ?? iconColor} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
