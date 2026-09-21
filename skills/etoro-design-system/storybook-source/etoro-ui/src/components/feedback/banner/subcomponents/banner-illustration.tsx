import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X2, X4 } from '../../../../core/styles/spacing';
import type { BannerIllustrationProps, BannerIllustrationSize } from '../api/types';

const SIZE_STYLES: Record<BannerIllustrationSize, { width: number; minHeight: number }> = {
  small: { width: 72, minHeight: 72 },
  medium: { width: 96, minHeight: 104 },
  large: { width: 112, minHeight: 144 },
};

/**
 * EtBanner.Illustration — optional trailing side art slot.
 * Pass an Image (or any node) as children. Without children, renders nothing.
 */
function BannerIllustrationBase({ children, size = 'medium', style, testID }: BannerIllustrationProps) {
  if (children == null) {
    return null;
  }

  return (
    <View style={[styles.container, SIZE_STYLES[size], style]} testID={testID}>
      {children}
    </View>
  );
}

export const BannerIllustration = memo(BannerIllustrationBase);
BannerIllustration.displayName = 'EtBanner.Illustration';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: X2,
    paddingVertical: X4,
  },
});
