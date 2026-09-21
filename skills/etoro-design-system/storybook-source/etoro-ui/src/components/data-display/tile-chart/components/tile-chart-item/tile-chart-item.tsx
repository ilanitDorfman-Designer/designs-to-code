import { LinearGradient } from 'expo-linear-gradient';
import { GestureResponderEvent, Pressable, View } from 'react-native';

import { EtText } from '../../../../../foundations/text';
import { TileChartClasses, TileChartLayoutItem } from '../../tile-chart.interface';
import { useTileChartItemStyles } from './tile-chart-item.styles';

export interface TileChartItemProps {
  item: TileChartLayoutItem;
  classes?: TileChartClasses;
  symbol: string;
  testID?: string;
  onItemPress?: (item: TileChartLayoutItem, event: GestureResponderEvent) => void;
}

export function TileChartItem({ item, onItemPress, symbol, classes, testID }: TileChartItemProps) {
  const tileChartItemStyles = useTileChartItemStyles();
  return (
    <Pressable
      onPress={(e) => onItemPress?.(item, e)}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}, ${item.value}${symbol}`}
      style={[
        tileChartItemStyles.bar,
        {
          left: item.rect.x,
          top: item.rect.y,
          width: item.rect.w,
          height: item.rect.h,
        },
      ]}
    >
      <LinearGradient colors={item.color} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
        <View style={tileChartItemStyles.barContent}>
          <View style={tileChartItemStyles.barContentInner}>
            <EtText variant="body-base-semibold" style={[tileChartItemStyles.label, classes?.label]} numberOfLines={1}>
              {item.label}
            </EtText>

            <EtText variant="body-base-semibold" style={[tileChartItemStyles.percentage, classes?.percentage]} numberOfLines={1}>
              {item.value}
              {symbol}
            </EtText>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
