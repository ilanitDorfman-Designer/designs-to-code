import { FC, memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useAvatarContext } from '../utils/context';
import { getBadgePosition, MARKET_OPEN_DOT_CONFIGS, MARKET_OPEN_DOT_PADDING, MARKET_OPEN_DOT_SIZE } from '../utils/styles';
import type { AvatarMarketOpenProps } from '../utils/types';

const DOT_TOTAL_SIZE = MARKET_OPEN_DOT_SIZE + MARKET_OPEN_DOT_PADDING * 2;
const DOT_OFFSET = 1;

/**
 * EtAvatar.MarketOpen - Dot indicator for market status.
 * Green (`statusPositive`) when `status='open'`, red (`statusNegative`) when `status='closed'`.
 * Positioned at corners (default bottomRight). Shape-aware positioning.
 */
function AvatarMarketOpenBase({ position = 'bottomRight', status = 'open', backgroundColor, style, ...rest }: AvatarMarketOpenProps) {
  const { shape, size } = useAvatarContext();
  const { colors } = useEtoroTheme();

  const positionStyle = useMemo(() => getBadgePosition(position, shape), [position, shape]);
  const dotConfig = MARKET_OPEN_DOT_CONFIGS[size];
  const dotTotalSize = dotConfig.dotSize + dotConfig.padding * 2;

  const dotColor = status === 'open' ? colors.verdictPositive600 : colors.verdictNegative600;

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        width: dotTotalSize,
        height: dotTotalSize,
        borderRadius: dotTotalSize / 2,
        backgroundColor: backgroundColor ?? colors.backgroundBase,
      },
      positionStyle,
      style,
    ],
    [backgroundColor, colors.backgroundBase, dotTotalSize, positionStyle, style],
  );

  const dotStyle = useMemo(
    () => [
      {
        width: dotConfig.dotSize,
        height: dotConfig.dotSize,
        borderRadius: dotConfig.dotSize / 2,
        backgroundColor: dotColor,
      },
    ],
    [dotColor, dotConfig.dotSize],
  );

  return (
    <View style={containerStyle} {...rest}>
      <View style={dotStyle} />
    </View>
  );
}

AvatarMarketOpenBase.displayName = 'EtAvatar.MarketOpen';

export const AvatarMarketOpen: FC<AvatarMarketOpenProps> = memo(AvatarMarketOpenBase);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    transform: [{ translateX: DOT_OFFSET }, { translateY: DOT_OFFSET }],
    width: DOT_TOTAL_SIZE,
    height: DOT_TOTAL_SIZE,
    borderRadius: DOT_TOTAL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
