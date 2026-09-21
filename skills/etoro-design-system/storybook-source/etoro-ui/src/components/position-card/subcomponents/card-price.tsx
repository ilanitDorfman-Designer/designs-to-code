import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardPriceProps } from '../api/types';

/**
 * EtPositionCard.Price - Displays the current price.
 */
function CardPriceComponent({ children }: CardPriceProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return <EtSkeleton width={110} height={16} variant="text" />;
  }

  return (
    <EtText variant="num-sm" style={{ color: colors.carbon900 }}>
      {children}
    </EtText>
  );
}

export const CardPrice = memo(CardPriceComponent);
CardPrice.displayName = 'EtPositionCard.Price';
