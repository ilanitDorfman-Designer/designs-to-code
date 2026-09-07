import { Pressable, StyleSheet, View } from 'react-native';

import { HALF, X5 } from '../../../../core/styles';
import { EtoroIcon } from '../../../../foundations/icon-assets';
import type { IconName } from '../../../../foundations/icon-assets/api/types';
import { EtText } from '../../../../foundations/text';
import type { TickerItemProps } from '../api';
import { useTickerContext } from '../context';
import { formatPrice } from '../utils';

const ICON_SIZE = 7;

/**
 * EtTicker.Item - Displays a single ticker entry with symbol, price, and change indicator.
 * Layout: Two rows - Symbol on top, Price + P&L below.
 * Pulls theme colors from TickerContext instead of props.
 */
export function TickerItem({ item, testID }: TickerItemProps) {
  const { textColor, positiveColor, negativeColor, onItemPress } = useTickerContext();

  const formattedPrice = formatPrice(item.currentPrice, item.currencySymbol, item.minPrecision, item.maxPrecision);
  const dailyChange = item.dailyChange;
  const hasDailyChange = dailyChange != null;

  const isPositive = dailyChange != null ? dailyChange >= 0 : true;
  const changeIcon: IconName = isPositive ? 'caretUp' : 'caretDown';
  const changeColor = hasDailyChange ? (isPositive ? positiveColor : negativeColor) : textColor;

  const changeDirection = isPositive ? 'up' : 'down';
  const accessibilityLabel =
    dailyChange != null
      ? `${item.name} at ${formattedPrice}, ${changeDirection} ${Math.abs(dailyChange).toFixed(2)} percent`
      : `${item.name} at ${formattedPrice}, change unavailable`;

  const handleItemPress = () => {
    onItemPress?.(item);
  };

  const changeStyle = { color: changeColor };

  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        onPress={onItemPress ? handleItemPress : undefined}
        hitSlop={8}
        accessibilityRole={onItemPress ? 'button' : undefined}
        accessibilityLabel={accessibilityLabel}
        style={styles.pressableContent}
      >
        <EtText variant="body-tiny-regular" weight="medium" style={[styles.compactText, { color: textColor }]}>
          {item.name}
        </EtText>

        <View style={styles.secondRow}>
          <EtText variant="num-xs" weight="bold" style={[styles.compactText, styles.tabularNums, { color: textColor }]}>
            {formattedPrice}
          </EtText>

          <View style={styles.changeContainer} testID={`${item.instrumentId}-change-row`}>
            {hasDailyChange && (
              <EtoroIcon
                icon={{ iconName: changeIcon }}
                appearance={{ size: ICON_SIZE, color: changeColor }}
                style={iconStyle}
                accessibility={{ testID: `${item.instrumentId}-change-icon` }}
              />
            )}
            <EtText variant="num-xs" weight="medium" style={[styles.compactText, styles.tabularNums, changeStyle]}>
              {dailyChange != null ? `${Math.abs(dailyChange).toFixed(2)}%` : '-'}
            </EtText>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

TickerItem.displayName = 'EtTicker.Item';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: X5,
  },
  pressableContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: HALF,
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HALF,
  },
  changeContainer: {
    // Keep caret on the physical left of the % value in both LTR and RTL.
    direction: 'ltr',
    flexDirection: 'row',
    alignItems: 'center',
    gap: HALF,
  },
  compactText: {
    includeFontPadding: false,
  },
  // Fixed-width figures so prices/changes don't reflow as digits tick.
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
  changeIcon: {
    paddingStart: 3,
    paddingEnd: 1,
  },
});

const iconStyle = { hasFill: true, style: styles.changeIcon } as const;
