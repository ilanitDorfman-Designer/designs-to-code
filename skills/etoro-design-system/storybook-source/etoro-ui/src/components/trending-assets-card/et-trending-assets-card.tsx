import { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks';
import { HALF, X1, X2, X3 } from '../../core/styles/spacing';
import { EtText } from '../../foundations/text';
import { EtMediaCard } from '../media-card';
import { EtAvatar } from '../social/avatar';
import type { EtTrendingAssetsCardAsset, EtTrendingAssetsCardProps } from './api';

const DEFAULT_MAX_VISIBLE = 5;

/**
 * EtTrendingAssetsCard — smart large media card (Figma DS 63763:418675).
 *
 * Composes {@link EtMediaCard} with:
 * - `size="large"` + `backgroundImage` and/or `backgroundVideo`
 * - shared content stack (`eyebrow` + `title` + `description`)
 * - `contentBlur` + `footerOverlay="media"`
 * - footer: horizontal row of instrument logos + optional `+N` overflow pill
 *
 * @example
 * ```tsx
 * <EtTrendingAssetsCard
 *   assets={[
 *     { symbol: 'ADBE', logoUrl: 'https://…/adbe.svg', backgroundColor: '#E4231D' },
 *     { symbol: 'AAPL', logoUrl: 'https://…/aapl.svg', backgroundColor: '#434351' },
 *   ]}
 *   backgroundImage={{ uri: heroUrl }}
 *   title="Trump – Musk feud reignites as megabill hits snags in Senate"
 *   description="TSLA is seeing increased investor activity amid political uncertainty"
 * />
 * ```
 */
function EtTrendingAssetsCardBase({
  assets,
  maxVisible = DEFAULT_MAX_VISIBLE,
  backgroundImage,
  backgroundVideo,
  backgroundVideoPaused,
  eyebrow,
  title,
  description,
  headerEnd,
  onPress,
  onOverflowPress,
  accessibilityLabel,
  style,
  testID,
}: EtTrendingAssetsCardProps) {
  const a11y = accessibilityLabel ?? [eyebrow, title].filter(Boolean).join(', ');
  const showHeader = Boolean(headerEnd);
  const normalizedMaxVisible = Number.isInteger(maxVisible) && maxVisible >= 0 ? maxVisible : DEFAULT_MAX_VISIBLE;

  return (
    <EtMediaCard
      size="large"
      variant="standard"
      backgroundImage={backgroundImage}
      backgroundVideo={backgroundVideo}
      backgroundVideoPaused={backgroundVideoPaused}
      style={style}
      testID={testID}
    >
      {showHeader ? <EtMediaCard.Header end={headerEnd} testID={testID ? `${testID}-header` : undefined} /> : null}
      <EtMediaCard.Content
        blur
        eyebrow={eyebrow}
        title={title}
        description={description}
        onPress={onPress}
        accessibilityLabel={onPress ? a11y : undefined}
        testID={testID ? `${testID}-content` : undefined}
      />
      <EtMediaCard.Footer overlay="media" testID={testID ? `${testID}-footer` : undefined}>
        <AssetsFooter assets={assets} maxVisible={normalizedMaxVisible} onOverflowPress={onOverflowPress} testID={testID} />
      </EtMediaCard.Footer>
    </EtMediaCard>
  );
}

/**
 * Glass footer: instrument logos (medium square avatars) + overflow `+N` button.
 *
 * - Collapsed: shows up to `maxVisible` logos (Figma `space-between`) with a
 *   pressable `+N` pill for the remainder.
 * - Pressing `+N`: if `onOverflowPress` is provided it delegates to the consumer,
 *   otherwise it expands in place into a horizontally scrollable carousel of all logos.
 */
function AssetsFooter({
  assets,
  maxVisible,
  onOverflowPress,
  testID,
}: {
  assets: EtTrendingAssetsCardAsset[];
  maxVisible: number;
  onOverflowPress?: () => void;
  testID?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const overflow = Math.max(0, assets.length - maxVisible);

  const handleOverflowPress = useCallback(() => {
    if (onOverflowPress) {
      onOverflowPress();
      return;
    }
    setExpanded(true);
  }, [onOverflowPress]);

  if (expanded) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        testID={testID ? `${testID}-carousel` : undefined}
      >
        {assets.map((asset) => (
          <AssetAvatar key={asset.symbol} asset={asset} />
        ))}
      </ScrollView>
    );
  }

  const visible = assets.slice(0, maxVisible);

  return (
    <View style={styles.footerRow}>
      {visible.map((asset) => (
        <AssetAvatar key={asset.symbol} asset={asset} />
      ))}
      {overflow > 0 ? <OverflowPill count={overflow} onPress={handleOverflowPress} testID={testID} /> : null}
    </View>
  );
}

/** Single instrument logo (medium square avatar) with symbol fallback. */
function AssetAvatar({ asset }: { asset: EtTrendingAssetsCardAsset }) {
  return (
    <EtAvatar size="medium" shape="square" variant="instrument" imageBackgroundColor={asset.backgroundColor} accessibilityLabel={asset.symbol}>
      <EtAvatar.Image src={asset.logoUrl} alt={asset.symbol} />
      <EtAvatar.Fallback>{asset.symbol.slice(0, 2)}</EtAvatar.Fallback>
    </EtAvatar>
  );
}

/** Figma “Num badge” — pressable pill with translucent divider fill + white count. */
function OverflowPill({ count, onPress, testID }: { count: number; onPress: () => void; testID?: string }) {
  const { colors } = useEtoroTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`+${count}`}
      style={({ pressed }) => [styles.overflowPill, { backgroundColor: colors.bgGreyTransparentSecondary }, pressed && styles.overflowPillPressed]}
      testID={testID ? `${testID}-overflow` : 'trending-assets-overflow'}
    >
      <EtText variant="num-xs-medium" style={{ color: colors.carbonStatic050 }}>
        {`+${count}`}
      </EtText>
    </Pressable>
  );
}

const EtTrendingAssetsCardMemo = memo(EtTrendingAssetsCardBase);
EtTrendingAssetsCardMemo.displayName = 'EtTrendingAssetsCard';

export const EtTrendingAssetsCard = EtTrendingAssetsCardMemo;

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  carouselContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X3,
    paddingRight: X3,
  },
  overflowPill: {
    borderRadius: 20,
    paddingHorizontal: X2 + HALF, // 10 — Figma Num badge
    paddingVertical: X1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overflowPillPressed: {
    opacity: 0.7,
  },
});
