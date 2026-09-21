import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { CryptoPriceProps } from '../api/types';

/**
 * EtCryptoCard.Price - Displays the price (e.g., "$42,150.23").
 */
function CryptoPriceComponent({ children, testID }: CryptoPriceProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="label-primary-semibold" style={{ color: colors.textBright }} testID={testID}>
      {children}
    </EtText>
  );
}

export const CryptoPrice = memo(CryptoPriceComponent);
CryptoPrice.displayName = 'EtCryptoCard.Price';
