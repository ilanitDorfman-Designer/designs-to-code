import { useTheme } from '@react-navigation/native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useCardContext } from '../api/context';

/**
 * EtCard.Halo - Decorative halo effect for sentiment indication.
 *
 * Only renders in dark mode and when isPositive is defined (not neutral).
 * - Green halo for positive sentiment
 * - Red halo for negative sentiment
 */
function CardHaloComponent() {
  const { isPositive } = useCardContext();
  const { dark: isDarkMode } = useTheme();

  if (isPositive === undefined || !isDarkMode) {
    return null;
  }

  // Determine halo source based on sentiment
  const haloSource = isPositive ? require('etoro-assets-images/green-halo.png') : require('etoro-assets-images/red-oval.png');

  return <Animated.Image source={haloSource} style={styles.haloImage} />;
}

export const CardHalo = memo(CardHaloComponent);
CardHalo.displayName = 'EtCard.Halo';

const styles = StyleSheet.create({
  haloImage: {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1000,
    alignSelf: 'center',
    width: '100%',
    height: 80,
    borderRadius: 0,
    opacity: 0.65,
  },
});
