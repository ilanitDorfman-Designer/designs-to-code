import { memo, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface CryptoLogoSectionProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtCryptoCard.LogoSection - Layout container for the logo.
 *
 * Centers the logo and adds appropriate spacing below.
 * Place at the top of the card for standard layout.
 */
function CryptoLogoSectionComponent({ children, style, testID }: CryptoLogoSectionProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const CryptoLogoSection = memo(CryptoLogoSectionComponent);
CryptoLogoSection.displayName = 'EtCryptoCard.LogoSection';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
