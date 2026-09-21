import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardSymbolProps } from '../api/types';

/**
 * EtPositionCard.Symbol - Displays the asset symbol (e.g., "AAPL").
 */
function CardSymbolComponent({ children }: CardSymbolProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return <EtSkeleton width={110} height={16} variant="text" />;
  }

  return (
    <EtText variant="label-primary-semibold" style={{ color: colors.carbon900 }}>
      {children}
    </EtText>
  );
}

export const CardSymbol = memo(CardSymbolComponent);
CardSymbol.displayName = 'EtPositionCard.Symbol';
