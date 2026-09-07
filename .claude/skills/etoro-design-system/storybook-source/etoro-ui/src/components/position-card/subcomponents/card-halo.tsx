import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HALO_HEIGHT } from '../../../core/styles/spacing';
import { usePositionCardContext } from '../api/context';

/**
 * CardHalo - Decorative halo effect for dark mode.
 * Shows green halo for positive cards, red for negative.
 * Only visible in dark mode.
 */
function CardHaloComponent() {
  const { variant } = usePositionCardContext();
  const { dark: isDarkMode } = useTheme();

  // Guard: return null if not dark mode OR variant is neutral (no halo)
  if (!isDarkMode || variant === 'neutral') {
    return null;
  }

  const source = variant === 'positive' ? require('etoro-assets-images/green-halo.png') : require('etoro-assets-images/red-oval.png');

  return (
    <View pointerEvents="none" style={styles.haloWrapper}>
      <Animated.Image source={source} style={styles.haloImage} />
    </View>
  );
}

export const CardHalo = React.memo(CardHaloComponent);
CardHalo.displayName = 'CardHalo';

const styles = StyleSheet.create({
  haloWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  haloImage: {
    width: '100%',
    height: HALO_HEIGHT,
    resizeMode: 'stretch',
    opacity: 0.4,
  },
});
