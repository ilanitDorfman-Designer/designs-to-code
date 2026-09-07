import { useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { TileChartItem } from './components/tile-chart-item/tile-chart-item';
import { DEFAULT_TILE_CHART_STYLES, TILE_CHART_DEFAULT_DIRECTION, TILE_CHART_DEFAULT_SYMBOL } from './tile-chart.constant';
import { EtTileChartProps } from './tile-chart.interface';
import { useTileChartStyles } from './tile-chart.styles';
import { layoutChart } from './tile-chart.utils';

export function EtTileChart({
  data,
  classes,
  styles,
  direction = TILE_CHART_DEFAULT_DIRECTION,
  symbol = TILE_CHART_DEFAULT_SYMBOL,
  testID,
  onItemPress,
}: EtTileChartProps) {
  const tileChartStyles = useTileChartStyles();
  const [width, setWidth] = useState(0);

  const mergedStyles = { ...DEFAULT_TILE_CHART_STYLES, ...(styles || {}) };

  function handleTileChartLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  const items = useMemo(() => {
    return layoutChart({
      data,
      width,
      height: mergedStyles.height,
      gap: mergedStyles.gap,
      direction,
    });
  }, [data, width, mergedStyles.height, mergedStyles.gap, direction]);

  return (
    <View style={[tileChartStyles.container, classes?.container]} testID={testID}>
      <View onLayout={handleTileChartLayout} style={[tileChartStyles.canvas, classes?.barsContainer, { height: mergedStyles.height }]}>
        {items.map((item) => (
          <TileChartItem
            key={item.id || item.label}
            item={item}
            symbol={symbol}
            classes={classes}
            testID={testID ? `${testID}-item-${item.id || item.label}` : undefined}
            onItemPress={onItemPress}
          />
        ))}
      </View>
    </View>
  );
}
