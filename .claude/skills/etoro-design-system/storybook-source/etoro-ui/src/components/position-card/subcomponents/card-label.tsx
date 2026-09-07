import { memo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardLabelProps } from '../api/types';

/**
 * EtPositionCard.Label - Displays a label text (e.g., "Net Value").
 */
function CardLabelComponent({ children }: CardLabelProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return <EtSkeleton width={80} height={16} variant="text" />;
  }

  return (
    <EtText variant="body-base-regular" style={{ color: colors.carbon600 }}>
      {children}
    </EtText>
  );
}

export const CardLabel = memo(CardLabelComponent);
CardLabel.displayName = 'EtPositionCard.Label';
