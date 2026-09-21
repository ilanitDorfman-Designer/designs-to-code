import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TickerContentProps, TickerThemeColors } from '../api/types';
import { EtTickerItem } from './ticker-item';

/**
 * Renders a separator between ticker items
 */
const renderSeparator = (key: string, colors: TickerThemeColors) => (
  <View key={key} style={styles.separatorContainer}>
    <View
      style={[
        styles.separatorCircle,
        {
          backgroundColor: colors.textSecondaryNeutral,
        },
      ]}
    />
  </View>
);

/**
 * Content component that renders all ticker items with separators
 */
export const EtTickerContent = React.memo<TickerContentProps>(({ items, colors }) => {
  return (
    <>
      {items.map((item, i) => (
        <React.Fragment key={`${item.instrumentId}-${i}`}>
          <EtTickerItem item={item} colors={colors} testID={`ticker-item-${item.instrumentId}`} />
          {renderSeparator(`separator-${i}`, colors)}
        </React.Fragment>
      ))}
    </>
  );
});

EtTickerContent.displayName = 'EtTickerContent';

const styles = StyleSheet.create({
  separatorContainer: {
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  separatorCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 6,
  },
});
