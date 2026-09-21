import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CryptoPricingProps } from '../api/types';

/**
 * EtCryptoCard.Pricing - Container for Price and Units subcomponents.
 *
 * Renders at the bottom-right of the card.
 */
function CryptoPricingComponent({ children, testID }: CryptoPricingProps) {
  return (
    <View style={styles.container} testID={testID}>
      {children}
    </View>
  );
}

export const CryptoPricing = memo(CryptoPricingComponent);
CryptoPricing.displayName = 'EtCryptoCard.Pricing';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
