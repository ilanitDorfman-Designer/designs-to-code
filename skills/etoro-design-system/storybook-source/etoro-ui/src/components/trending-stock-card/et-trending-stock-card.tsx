import { memo } from 'react';

import { EtAssetCard } from '../asset-card';
import type { EtTrendingStockCardProps } from './api';

/**
 * EtTrendingStockCard — smart large-image asset card (Figma DS 63763:418667).
 *
 * Thin wrapper over {@link EtAssetCard} with a fixed recipe:
 * - `size="large"`
 * - full-bleed `backgroundImage`
 * - content: eyebrow + title (+ optional description) — no header badge
 * - `footerOverlay="media"` — dark Carbon Neutral 900 scrim
 * - `contentBlur` on
 * - logo in the glass footer
 *
 * @example
 * ```tsx
 * <EtTrendingStockCard
 *   asset={{
 *     symbol: 'AAPL',
 *     name: 'Apple',
 *     logoUrl: 'https://…/logo.svg',
 *     price: 186.79,
 *     changePercent: 0.0435,
 *   }}
 *   backgroundImage={{ uri: heroUrl }}
 *   title="Tesla experienced a significant sales slump in early 2026"
 * />
 * ```
 */
function EtTrendingStockCardBase({
  asset,
  backgroundImage,
  eyebrow = 'Trending Stock',
  title,
  description,
  headerEnd,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: EtTrendingStockCardProps) {
  return (
    <EtAssetCard
      asset={asset}
      size="large"
      variant="standard"
      backgroundImage={backgroundImage}
      eyebrow={eyebrow}
      title={title}
      description={description}
      headerEnd={headerEnd}
      logoInFooter
      footerOverlay="media"
      contentBlur
      onFooterPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={style}
      testID={testID}
    />
  );
}

const EtTrendingStockCardMemo = memo(EtTrendingStockCardBase);
EtTrendingStockCardMemo.displayName = 'EtTrendingStockCard';

export const EtTrendingStockCard = EtTrendingStockCardMemo;
