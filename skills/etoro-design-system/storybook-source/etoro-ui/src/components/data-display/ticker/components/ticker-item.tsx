import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EtoroIcon } from '../../../../foundations/icon-assets';
import { TickerItemProps } from '../api/types';
import { formatPrice } from '../utils/format-price';

/**
 * Individual ticker item component displaying symbol, price, and change indicator
 */
export const EtTickerItem = React.memo<TickerItemProps>(({ item, colors, testID }) => {
  const formattedPrice = useMemo(
    () => formatPrice(item.currentPrice, item.currencySymbol, item.minPrecision, item.maxPrecision),
    [item.currentPrice, item.currencySymbol, item.minPrecision, item.maxPrecision],
  );

  const isPositive = item.dailyChange >= 0;
  const sign = isPositive ? '+' : '';
  const changeIcon = isPositive ? 'triangleUp' : 'triangleDown';
  const changeColor = isPositive ? colors.statusPositive : colors.statusNegative;

  const changeDirection = isPositive ? 'up' : 'down';
  const accessibilityLabel = `${item.name} at ${formattedPrice}, ${changeDirection} ${Math.abs(item.dailyChange).toFixed(2)} percent`;

  // TODO: Implement navigation to the asset page after asset page is implemented
  const handleNamePress = () => {
    // Navigation not yet implemented
  };

  return (
    <View style={styles.container} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityRole="text" accessible={true}>
      <Pressable onPress={handleNamePress} hitSlop={8}>
        <Text style={[styles.symbol, { color: colors.textSecondaryNeutral }]}>{item.name}:&nbsp;</Text>
      </Pressable>

      <Text style={[styles.price, { color: colors.textSecondaryNeutral }]}>{formattedPrice} </Text>

      <View style={styles.changeContainer}>
        <EtoroIcon
          icon={{ iconName: changeIcon }}
          appearance={{ size: 16, color: changeColor }}
          style={iconFillStyle}
          accessibility={{ testID: `${item.name}-change-icon` }}
        />
        <Text style={[styles.changeText, { color: changeColor }]}>
          {sign}
          {item.dailyChange.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
});

EtTickerItem.displayName = 'EtTickerItem';

const iconFillStyle = { hasFill: true };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontWeight: '400',
    fontSize: 12,
  },
  price: {
    fontWeight: '600',
    fontSize: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontWeight: '500',
    fontSize: 13,
    marginLeft: 2,
  },
});
