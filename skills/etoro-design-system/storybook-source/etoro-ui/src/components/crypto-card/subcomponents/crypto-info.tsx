import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CryptoInfoProps } from '../api/types';

/**
 * EtCryptoCard.Info - Container for Symbol and Name subcomponents.
 *
 * Renders at the bottom-left of the card.
 */
function CryptoInfoComponent({ children, testID }: CryptoInfoProps) {
  return (
    <View style={styles.container} testID={testID}>
      {children}
    </View>
  );
}

export const CryptoInfo = memo(CryptoInfoComponent);
CryptoInfo.displayName = 'EtCryptoCard.Info';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
