import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { CryptoNameProps } from '../api/types';

/**
 * EtCryptoCard.Name - Displays the crypto name (e.g., "Bitcoin").
 */
function CryptoNameComponent({ children, testID }: CryptoNameProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="body-secondary-regular" style={{ color: colors.textBright }} testID={testID}>
      {children}
    </EtText>
  );
}

export const CryptoName = memo(CryptoNameComponent);
CryptoName.displayName = 'EtCryptoCard.Name';
