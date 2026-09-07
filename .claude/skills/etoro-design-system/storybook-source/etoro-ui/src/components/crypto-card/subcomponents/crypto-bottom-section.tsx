import { memo, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { X2 } from '../../../core/styles';

export interface CryptoBottomSectionProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtCryptoCard.BottomSection - Layout container for Info and Pricing.
 *
 * Renders children in a row with space-between alignment.
 * Info on the left, Pricing on the right.
 */
function CryptoBottomSectionComponent({ children, style, testID }: CryptoBottomSectionProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const CryptoBottomSection = memo(CryptoBottomSectionComponent);
CryptoBottomSection.displayName = 'EtCryptoCard.BottomSection';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: X2,
  },
});
