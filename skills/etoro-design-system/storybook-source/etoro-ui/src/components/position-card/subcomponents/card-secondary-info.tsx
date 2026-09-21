import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardSecondaryInfoProps } from '../api/types';

/**
 * EtPositionCard.SecondaryInfo - Displays secondary info row.
 *
 * Start side: typically a change indicator (left in LTR, right in RTL)
 * End side: typically shares count (right in LTR, left in RTL)
 */
function CardSecondaryInfoComponent({ start, end }: CardSecondaryInfoProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <EtSkeleton width={100} height={16} variant="text" />
        <EtSkeleton width={70} height={16} variant="text" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.start}>
        {typeof start === 'string' || typeof start === 'number' ? (
          <EtText variant="body-tiny-regular" style={{ color: colors.carbon900 }}>
            {start}
          </EtText>
        ) : (
          start
        )}
      </View>
      <View style={styles.end}>
        {typeof end === 'string' || typeof end === 'number' ? (
          <EtText variant="body-tiny-regular" style={{ color: colors.carbon900 }}>
            {end}
          </EtText>
        ) : (
          end
        )}
      </View>
    </View>
  );
}

export const CardSecondaryInfo = memo(CardSecondaryInfoComponent);
CardSecondaryInfo.displayName = 'EtPositionCard.SecondaryInfo';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  start: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
