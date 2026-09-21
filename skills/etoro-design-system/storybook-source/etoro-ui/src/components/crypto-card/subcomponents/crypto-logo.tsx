import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useCryptoCardContext } from '../api/context';
import { CryptoLogoProps } from '../api/types';

const DEFAULT_SIZE = 100;

/**
 * EtCryptoCard.Logo - Displays the crypto asset logo.
 *
 * Renders a centered logo image fetched from the CDN URL.
 */
function CryptoLogoComponent({ size = DEFAULT_SIZE, accessibilityLabel }: CryptoLogoProps) {
  const { logoUrl } = useCryptoCardContext();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: logoUrl }}
        style={{ width: size, height: size }}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={200}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        importantForAccessibility={accessibilityLabel ? 'yes' : 'no'}
      />
    </View>
  );
}

export const CryptoLogo = memo(CryptoLogoComponent);
CryptoLogo.displayName = 'EtCryptoCard.Logo';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
