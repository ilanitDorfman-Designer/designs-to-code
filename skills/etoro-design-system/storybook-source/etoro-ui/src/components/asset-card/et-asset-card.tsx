import { getCurrencySymbolByName } from '@etoro/common/currencies';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { HALF, X1 } from '../../core/styles/spacing';
import { EtText } from '../../foundations/text';
import { EtAssetInfo } from '../data-display/asset-info';
import { EtNumber } from '../data-display/number';
import { EtPrice } from '../data-display/price';
import { EtMediaCard, useMediaCardContext } from '../media-card';
import { classifyBackgroundTone, resolveMediaCardFooterOverlayPreset } from '../media-card/utils';
import type { EtAssetCardProps } from './api';
import { useAssetCardModel } from './hooks';

/**
 * EtAssetCard — asset-specialized card built on {@link EtMediaCard}.
 *
 * `variant` is required to resolve text colour (via MediaCard context):
 * - `bright` → `carbonStatic900`
 * - `standard` | `dark` → `carbonStatic050`
 *
 * Card fill can be asset brand colour (`standard`), or `backgroundImage` /
 * `backgroundVideo`.
 *
 * Header (medium / large): optional {@link EtMediaCard.Badge} at the start (`label`)
 * and/or a button / action at the end (`headerEnd`).
 *
 * Content (medium / large): optional `eyebrow` + `title` + `description`
 * forwarded to {@link EtMediaCard.Content} (shared chassis stack).
 *
 * Footer glass (medium / large): `footerOverlay` (`media` | `muted`), or custom
 * via `footerOverlayColor` / `footerOverlayOpacity` / `footerStyle`.
 *
 * @example Small — brand colour from asset logo metadata
 * ```tsx
 * <EtAssetCard
 *   variant="standard"
 *   asset={{
 *     symbol: 'TSLA',
 *     logoUrl: 'https://…/1001_CC2914_FFFFFF.svg',
 *     backgroundColor: '#CC2914',
 *     price: 186.79,
 *     changePercent: 0.0435,
 *   }}
 * />
 * ```
 *
 * @example Medium — badge start + icon button end
 * ```tsx
 * <EtAssetCard
 *   size="medium"
 *   asset={asset}
 *   label="Trending Stock"
 *   headerEnd={<EtIconButton iconName="close" size={24} onPress={…} />}
 * />
 * ```
 */
function EtAssetCardBase({
  asset,
  size,
  variant = 'standard',
  backgroundImage,
  backgroundVideo,
  backgroundVideoPaused,
  label,
  headerEnd,
  eyebrow,
  title,
  description,
  logoInFooter: logoInFooterProp,
  footerOverlay: footerOverlayProp,
  footerOverlayColor,
  footerOverlayOpacity,
  footerStyle,
  contentBlur,
  onFooterPress,
  onContentPress,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: EtAssetCardProps) {
  const model = useAssetCardModel({ asset, size, variant, label, eyebrow, title, description });

  const priceLabel = model.asset.currency ? `${model.asset.price} ${model.asset.currency}` : `${model.asset.price}`;
  const changeLabel = `${model.asset.changePercent >= 0 ? '+' : ''}${(model.asset.changePercent * 100).toFixed(2)}%`;
  const a11y = accessibilityLabel ?? `${model.asset.symbol}, ${priceLabel}, ${changeLabel}`;

  const resolvedFooterPress = onFooterPress ?? (model.size !== 'small' ? onPress : undefined);
  const resolvedContentPress = onContentPress ?? (model.size === 'small' ? onPress : undefined);
  const staticAccessibilityLabel = resolvedFooterPress || resolvedContentPress ? undefined : accessibilityLabel;

  /** Two-letter initials shown inside the logo avatar when the image is missing. */
  const logoFallback =
    model.asset.symbol
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 2)
      .toUpperCase() || '—';

  /**
   * Logo placement — defaults to the footer when the card has an image / video
   * fill (the background watermark would clash with the media), otherwise a
   * background watermark. Explicit `logoInFooter` always wins.
   */
  const logoInFooter = logoInFooterProp ?? Boolean(backgroundImage || backgroundVideo);

  /**
   * Glass footer preset (`media` | `muted`), keyed by effective surface tone.
   * Near-white `standard` brand fills behave like `bright` ({@link classifyBackgroundTone}).
   * Explicit `footerOverlay` wins.
   */
  const isBrightSurface =
    model.variant === 'bright' ||
    (model.variant === 'standard' && !backgroundImage && !backgroundVideo && classifyBackgroundTone(model.backgroundColor) === 'bright');
  const footerOverlay = footerOverlayProp ?? resolveMediaCardFooterOverlayPreset(model.variant, isBrightSurface);

  const showHeader = Boolean(model.label || headerEnd);
  const showContent = Boolean(model.eyebrow || model.title || model.description);

  if (model.size === 'small') {
    return (
      <EtMediaCard
        size="small"
        variant={model.variant}
        backgroundColor={model.backgroundColor}
        backgroundImage={backgroundImage}
        backgroundVideo={backgroundVideo}
        backgroundVideoPaused={backgroundVideoPaused}
        overlay
        accessibilityLabel={staticAccessibilityLabel}
        style={style}
        testID={testID}
      >
        <EtMediaCard.Logo source={model.logoSource} boxed={false} fallback={logoFallback} accessibilityLabel={model.asset.symbol} />
        <EtMediaCard.Content
          blur={false}
          onPress={resolvedContentPress}
          accessibilityLabel={resolvedContentPress ? a11y : undefined}
          testID={testID ? `${testID}-content` : undefined}
        >
          <EtMediaCard.Title>
            <AssetCardPrice value={model.asset.price} currencyCode={model.asset.currency} />
          </EtMediaCard.Title>
          <EtMediaCard.Subtitle>
            <AssetCardChange value={model.asset.changePercent} />
          </EtMediaCard.Subtitle>
        </EtMediaCard.Content>
      </EtMediaCard>
    );
  }

  return (
    <EtMediaCard
      size={model.size}
      variant={model.variant}
      backgroundColor={model.backgroundColor}
      backgroundImage={backgroundImage}
      backgroundVideo={backgroundVideo}
      backgroundVideoPaused={backgroundVideoPaused}
      overlay
      accessibilityLabel={staticAccessibilityLabel}
      style={style}
      testID={testID}
    >
      {!logoInFooter ? (
        <EtMediaCard.Logo
          source={model.logoSource}
          placement="background"
          boxed={false}
          fallback={logoFallback}
          accessibilityLabel={model.asset.symbol}
        />
      ) : null}
      {showHeader ? (
        <EtMediaCard.Header
          start={model.label ? <EtMediaCard.Badge>{model.label}</EtMediaCard.Badge> : undefined}
          end={headerEnd}
          testID={testID ? `${testID}-header` : undefined}
        />
      ) : null}
      {showContent ? (
        <EtMediaCard.Content
          blur={contentBlur}
          eyebrow={model.eyebrow}
          title={model.title}
          description={model.description}
          onPress={resolvedContentPress}
          accessibilityLabel={resolvedContentPress ? a11y : undefined}
          testID={testID ? `${testID}-content` : undefined}
        />
      ) : null}
      <EtMediaCard.Footer
        overlay={footerOverlay}
        overlayColor={footerOverlayColor}
        overlayOpacity={footerOverlayOpacity}
        onPress={resolvedFooterPress}
        accessibilityLabel={resolvedFooterPress ? a11y : undefined}
        style={footerStyle}
        testID={testID ? `${testID}-footer` : undefined}
      >
        <AssetCardFooter
          symbol={model.asset.symbol}
          name={model.asset.name}
          logoUrl={logoInFooter ? model.asset.logoUrl : undefined}
          price={model.asset.price}
          currency={model.asset.currency}
          change={model.asset.change}
          changePercent={model.asset.changePercent}
        />
      </EtMediaCard.Footer>
    </EtMediaCard>
  );
}

/** Reads text colour from card `variant` via MediaCard context. */
function AssetCardPrice({ value, currencyCode }: { value: number; currencyCode?: string }) {
  const { foregroundColor } = useMediaCardContext();
  return (
    <EtNumber value={value} format="number" currencyCode={currencyCode} color={foregroundColor} style={styles.price}>
      <EtNumber.Value variant="num-ml-medium" numberOfLines={1} shrinkToFit minimumFontScale={0.65} style={styles.priceValue} />
    </EtNumber>
  );
}

function AssetCardChange({ value }: { value: number }) {
  const { foregroundColor } = useMediaCardContext();
  return (
    <EtNumber value={value} format="percentage" showSign color={foregroundColor}>
      <View style={styles.changeRow}>
        <EtNumber.Arrow size={8} />
        <EtNumber.Value variant="num-xs-medium" />
      </View>
    </EtNumber>
  );
}

/**
 * Glass footer content (Figma):
 * - Start: {@link EtAssetInfo} (optional logo + symbol / display name)
 * - End: price ({@link EtNumber}) + rates ({@link EtPrice.Change})
 *
 * Title/subtitle colours come from MediaCard `foregroundColor` (variant), so we
 * compose children rather than relying on EtAssetInfo’s default theme text colours.
 */
function AssetCardFooter({
  symbol,
  name,
  logoUrl,
  price,
  currency,
  change,
  changePercent,
}: {
  symbol: string;
  name?: string;
  logoUrl?: string;
  price: number;
  currency?: string;
  change?: number;
  changePercent: number;
}) {
  const { foregroundColor } = useMediaCardContext();
  // Same as asset page / watchlist: absolute = currentPrice - referencePrice.
  const referencePrice = price / (1 + changePercent);
  const absoluteChange = change ?? price - referencePrice;
  /** EtPrice.Change expects percent units (e.g. `4.35`), not a ratio. */
  const changePercentage = changePercent * 100;

  return (
    <View style={styles.footerRow}>
      <EtAssetInfo
        data={{
          ...(logoUrl
            ? {
                avatar: {
                  source: logoUrl,
                  shape: 'square' as const,
                  size: 'medium' as const,
                  alt: symbol,
                },
              }
            : {}),
          title: symbol,
          subtitle: name,
        }}
        shrink
      >
        {logoUrl ? <EtAssetInfo.Avatar /> : null}
        <EtAssetInfo.Title>
          <EtText variant="label-primary-semibold" style={{ color: foregroundColor }} numberOfLines={1}>
            {symbol}
          </EtText>
        </EtAssetInfo.Title>
        {name ? (
          <EtAssetInfo.Subtitle>
            <EtText variant="label-tertiary-regular" style={{ color: foregroundColor }} numberOfLines={1}>
              {name}
            </EtText>
          </EtAssetInfo.Subtitle>
        ) : null}
      </EtAssetInfo>
      <View style={styles.footerEnd}>
        <EtNumber
          value={price}
          format={currency ? 'currency' : 'number'}
          {...(currency ? { symbol: getCurrencySymbolByName(currency) } : {})}
          color={foregroundColor}
        >
          <EtNumber.Value variant="num-ml-medium" />
        </EtNumber>
        <EtPrice price={price} change={absoluteChange} changePercentage={changePercentage}>
          {/* Glass footer only allows the variant foreground colour — no red/green verdict tokens. */}
          <EtPrice.Change variant="label-tertiary-regular" color={foregroundColor} />
        </EtPrice>
      </View>
    </View>
  );
}

const EtAssetCardMemo = memo(EtAssetCardBase);
EtAssetCardMemo.displayName = 'EtAssetCard';

export const EtAssetCard = EtAssetCardMemo;

const styles = StyleSheet.create({
  /** Stretch so `shrinkToFit` has a bounded width on the narrow small card. */
  price: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  priceValue: {
    flexGrow: 1,
    textAlign: 'center',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HALF,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: X1,
  },
  footerEnd: {
    alignItems: 'flex-end',
  },
});
