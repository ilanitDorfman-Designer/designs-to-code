import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { CryptoUnitsProps } from '../api/types';

/**
 * EtCryptoCard.Units - Displays the units amount (e.g., "0.5 BTC").
 */
function CryptoUnitsComponent({ children, testID }: CryptoUnitsProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="body-secondary-regular" style={{ color: colors.textBright }} testID={testID}>
      {children}
    </EtText>
  );
}

export const CryptoUnits = memo(CryptoUnitsComponent);
CryptoUnits.displayName = 'EtCryptoCard.Units';
