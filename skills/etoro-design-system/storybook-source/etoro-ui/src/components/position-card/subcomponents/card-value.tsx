import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardValueProps } from '../api/types';

/**
 * EtPositionCard.Value - Displays a large value (e.g., "$1,699.19").
 */
function CardValueComponent({ children }: CardValueProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return <EtSkeleton width={110} height={24} variant="text" />;
  }

  return (
    <EtText variant="heading-base" style={{ color: colors.carbon900 }}>
      {children}
    </EtText>
  );
}

export const CardValue = memo(CardValueComponent);
CardValue.displayName = 'EtPositionCard.Value';
