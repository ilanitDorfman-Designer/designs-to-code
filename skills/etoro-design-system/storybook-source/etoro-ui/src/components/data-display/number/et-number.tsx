// NATIVE TWIN: the advanced watchlist table renders EtNumber with Arrow in the num-s / num-xs variants (change and percent cells) natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/AdvancedTableView.swift (AdvancedTableChangeLabel) + ios/EtNativeIcons.swift and
// apps/etoro-mobile/modules/advanced-table/android/.../AdvancedTableView.kt (AdvancedTableChangeLabel) + EtNativeIcons.kt. A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import { StyleSheet, View } from 'react-native';

import { HALF } from '../../../core/styles';
import type { EtNumberProps } from './api/types';
import { EtNumberContext } from './context';
import { useDefaults } from './hooks';
import { EtNumberArrow, EtNumberValue } from './subcomponents';

function EtNumberBase({
  children,
  style,
  value,
  currencyCode,
  format,
  symbol,
  minDecimals,
  maxDecimals,
  locale,
  useGrouping,
  showAbsoluteValue,
  showSign,
  hasParentheses,
  isColored,
  color,
  fallback,
  isMasked,
  maskLength,
  testID,
}: EtNumberProps) {
  const contextValue = useDefaults({
    value,
    currencyCode,
    format,
    symbol,
    minDecimals,
    maxDecimals,
    locale,
    useGrouping,
    showAbsoluteValue,
    showSign,
    hasParentheses,
    isColored,
    color,
    fallback,
    isMasked,
    maskLength,
  });

  return (
    <EtNumberContext.Provider value={contextValue}>
      <View style={[styles.container, style]} testID={testID}>
        {children}
      </View>
    </EtNumberContext.Provider>
  );
}

EtNumberBase.displayName = 'EtNumber';

export const EtNumber = Object.assign(EtNumberBase, {
  Arrow: EtNumberArrow,
  Value: EtNumberValue,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HALF,
  },
});
