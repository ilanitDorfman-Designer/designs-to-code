import { StyleSheet, View } from 'react-native';

import { X4 } from '../../../../core/styles';
import type { TickerSlotProps } from '../api';

/**
 * EtTicker.Start - Fixed slot at the start of the ticker row.
 * Use for elements like filter/sort icons that shouldn't scroll.
 */
export function TickerStart({ children, style, testID }: TickerSlotProps) {
  return (
    <View style={[styles.container, styles.start, style]} testID={testID}>
      {children}
    </View>
  );
}

TickerStart.displayName = 'EtTicker.Start';

/**
 * EtTicker.End - Fixed slot at the end of the ticker row.
 * Use for trailing actions or indicators that shouldn't scroll.
 */
export function TickerEnd({ children, style, testID }: TickerSlotProps) {
  return (
    <View style={[styles.container, styles.end, style]} testID={testID}>
      {children}
    </View>
  );
}

TickerEnd.displayName = 'EtTicker.End';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  start: {
    marginRight: X4,
  },
  end: {
    marginLeft: X4,
  },
});
