import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { EtPriceProps } from './api/types';
import { EtPriceContext } from './context';
import { EtPriceChange, EtPriceValue } from './subcomponents';

function EtPriceBase({ price, change, changePercentage, decimals, children, style }: EtPriceProps) {
  return (
    <EtPriceContext.Provider value={useMemo(() => ({ price, change, changePercentage, decimals }), [price, change, changePercentage, decimals])}>
      <View style={[styles.container, style]}>{children}</View>
    </EtPriceContext.Provider>
  );
}

EtPriceBase.displayName = 'EtPrice';

export const EtPrice = Object.assign(EtPriceBase, {
  Value: EtPriceValue,
  Change: EtPriceChange,
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
});
