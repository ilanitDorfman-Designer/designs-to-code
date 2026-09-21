import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { HALF } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardNameProps } from '../api/types';

/**
 * EtPositionCard.Name - Displays the asset name (e.g., "Apple inc").
 */
function CardNameComponent({ children, style }: CardNameProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return <EtSkeleton style={styles.skeleton} width={80} height={12} variant="text" />;
  }

  return (
    <EtText variant="label-tertiary-regular" style={[styles.name, { color: colors.carbon900 }, style]}>
      {children}
    </EtText>
  );
}

export const CardName = memo(CardNameComponent);
CardName.displayName = 'EtPositionCard.Name';

const styles = StyleSheet.create({
  name: {
    marginTop: HALF,
  },
  skeleton: {
    marginTop: HALF,
  },
});
