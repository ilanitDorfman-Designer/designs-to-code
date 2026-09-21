import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { CryptoSymbolProps } from '../api/types';

/**
 * EtCryptoCard.Symbol - Displays the crypto symbol (e.g., "BTC").
 */
function CryptoSymbolComponent({ children, testID }: CryptoSymbolProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="label-primary-semibold" style={[styles.text, { color: colors.textBright }]} testID={testID}>
      {children}
    </EtText>
  );
}

const styles = StyleSheet.create({
  text: {
    lineHeight: 20,
  },
});

export const CryptoSymbol = memo(CryptoSymbolComponent);
CryptoSymbol.displayName = 'EtCryptoCard.Symbol';
