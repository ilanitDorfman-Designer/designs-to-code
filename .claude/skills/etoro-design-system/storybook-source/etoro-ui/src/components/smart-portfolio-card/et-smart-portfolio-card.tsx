import type { ChartDataApiEquity } from '@etoro/common/types';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../core/hooks';
import { X2 } from '../../core/styles/spacing';
import { EtText } from '../../foundations/text';
import { EtLineChart } from '../data-display/line-chart/et-line-chart';
import { EtNumber } from '../data-display/number';
import { EtMediaCard, useMediaCardContext } from '../media-card';
import type { EtSmartPortfolioCardProps } from './api';

const CHART_WIDTH = 86;
const CHART_HEIGHT = 24;

/**
 * EtSmartPortfolioCard — smart large media card (Figma DS 63763:418679).
 *
 * Composes {@link EtMediaCard} with:
 * - `size="large"` + `backgroundImage` and/or `backgroundVideo`
 * - reusable header: {@link EtMediaCard.Badge} (`label`) + `headerEnd`
 * - custom content (not the shared eyebrow/title stack):
 *   title → gain % + period + optional sparkline → description
 *
 * @example
 * ```tsx
 * <EtSmartPortfolioCard
 *   backgroundImage={{ uri: heroUrl }}
 *   label="Smart Portfolio"
 *   headerEnd={<EtIconButton iconName="star" size={24} onPress={…} />}
 *   title="Chip-Tech"
 *   changePercent={0.1551}
 *   periodLabel="Last 24 hours"
 *   description="Tesla (TSLA) is experiencing a surge in investor interest…"
 *   chartData={[{ timestamp: '2024-01-01', equity: 1 }, { timestamp: '2024-01-02', equity: 1.15 }]}
 * />
 * ```
 */
function EtSmartPortfolioCardBase({
  backgroundImage,
  backgroundVideo,
  backgroundVideoPaused,
  label,
  headerEnd,
  title,
  changePercent,
  periodLabel,
  description,
  chartData,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: EtSmartPortfolioCardProps) {
  const formattedChangePercent = `${changePercent >= 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}%`;
  const a11y = accessibilityLabel ?? `${title}, ${formattedChangePercent}, ${periodLabel}`;
  const showHeader = Boolean(label || headerEnd);

  return (
    <EtMediaCard
      size="large"
      variant="standard"
      backgroundImage={backgroundImage}
      backgroundVideo={backgroundVideo}
      backgroundVideoPaused={backgroundVideoPaused}
      accessibilityLabel={onPress ? undefined : a11y}
      style={style}
      testID={testID}
    >
      {showHeader ? (
        <EtMediaCard.Header
          start={label ? <EtMediaCard.Badge>{label}</EtMediaCard.Badge> : undefined}
          end={headerEnd}
          testID={testID ? `${testID}-header` : undefined}
        />
      ) : null}
      <EtMediaCard.Content blur onPress={onPress} accessibilityLabel={onPress ? a11y : undefined} testID={testID ? `${testID}-content` : undefined}>
        <SmartPortfolioContent
          title={title}
          changePercent={changePercent}
          periodLabel={periodLabel}
          description={description}
          chartData={chartData}
        />
      </EtMediaCard.Content>
    </EtMediaCard>
  );
}

/**
 * Figma content stack:
 * - title (`body-base-semibold`)
 * - gain row: large signed % (`num-xl-medium`) + optional sparkline
 * - period under the % (`label-tertiary-regular`)
 * - description (`label-tertiary-regular`)
 */
function SmartPortfolioContent({
  title,
  changePercent,
  periodLabel,
  description,
  chartData,
}: {
  title: string;
  changePercent: number;
  periodLabel: string;
  description?: string;
  chartData?: ChartDataApiEquity[];
}) {
  const { colors } = useEtoroTheme();
  const { foregroundColor } = useMediaCardContext();
  const selectedValue = useSharedValue(0);
  const isPositive = changePercent >= 0;
  /** Neon Static tokens — readable on dark media overlays regardless of theme. */
  const changeColor = isPositive ? colors.verdictPositive400Static : colors.verdictNegative400Static;
  const hasChart = Boolean(chartData && chartData.length > 0);
  const series = useMemo(() => chartData ?? [], [chartData]);

  return (
    <View style={styles.contentStack} testID="smart-portfolio-content">
      <EtText variant="body-base-semibold" style={{ color: foregroundColor }} numberOfLines={2}>
        {title}
      </EtText>

      <View style={styles.statsSection}>
        <View style={styles.gainRow}>
          <View style={styles.gainColumn}>
            <EtNumber value={changePercent} format="percentage" color={changeColor} showSign>
              <EtNumber.Value variant="num-xl-medium" />
            </EtNumber>
            <EtText variant="label-tertiary-regular" style={{ color: foregroundColor }} numberOfLines={1}>
              {periodLabel}
            </EtText>
          </View>
          {hasChart ? (
            <EtLineChart
              data={series}
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              marginVertical={0}
              balance={isPositive ? 'positive' : 'negative'}
              selectedValue={selectedValue}
              isInteractive={false}
            />
          ) : null}
        </View>

        {description ? (
          <EtText variant="label-tertiary-regular" style={{ color: foregroundColor }} numberOfLines={3}>
            {description}
          </EtText>
        ) : null}
      </View>
    </View>
  );
}

const EtSmartPortfolioCardMemo = memo(EtSmartPortfolioCardBase);
EtSmartPortfolioCardMemo.displayName = 'EtSmartPortfolioCard';

export const EtSmartPortfolioCard = EtSmartPortfolioCardMemo;

const styles = StyleSheet.create({
  contentStack: {
    alignSelf: 'stretch',
    gap: X2,
  },
  statsSection: {
    alignSelf: 'stretch',
    gap: X2,
  },
  gainRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  gainColumn: {
    flex: 1,
    gap: 0,
  },
});
