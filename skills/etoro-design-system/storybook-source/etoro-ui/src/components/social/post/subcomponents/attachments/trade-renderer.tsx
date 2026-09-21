import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X1, X3, X4, X6 } from '../../../../../core/styles/spacing';
import { EtText } from '../../../../../foundations/text';
import { EtChip } from '../../../../controls/chips';
import { InfoAvatar } from '../../../../data-display/_info-base/subcomponents';
import { type EtAssetData } from '../../../../data-display/asset-info';
import { EtNumber } from '../../../../data-display/number/et-number';
import { useIsSharedAttachment } from '../shared-post';

// ============================================================================
// Constants
// ============================================================================

/** Full-pill corner radius for the asset trade chip. */
const TRADE_PILL_RADIUS = 100;

/** Figma chip vertical padding (non-standard 6px on the eToro scale). */
const TRADE_PILL_PADDING_VERTICAL = 6;

/** Figma chip minimum height (component size, not a spacing token). */
const TRADE_PILL_MIN_HEIGHT = 28;

/** Rendered asset icon size (Figma). The smallest avatar is 24px, so it is scaled down. */
const AVATAR_TARGET_SIZE = 16;
const AVATAR_SOURCE_SIZE = 24; // avatar `size: 'small'`

// ============================================================================
// Types (internal - not exported from api/types)
// ============================================================================

export interface TradeRendererProps {
  /** Market symbol name (e.g., "AAPL", "BTC") */
  symbolName: string;
  /** Market display name (e.g., "Apple Inc.", "Bitcoin") */
  displayName?: string;
  /** Market avatar image URL (raster) */
  avatarSource?: string;
  /** Optional SVG avatar URL (preferred over raster when present) */
  avatarSvgSource?: string;
  /** Optional avatar background color (from SVG metadata, e.g., "#76B900") */
  avatarBackgroundColor?: string;
  /** Optional avatar text color (from SVG metadata, e.g., "#F7F7F7") */
  avatarTextColor?: string;
  /**
   * Absolute daily price change in currency units (e.g. -3.28).
   * Optional; not rendered. Prefer `priceChangePercent` for direction/color (FR-005).
   */
  priceChange?: number;
  /**
   * Daily price change as a percentage (e.g. -0.43).
   * Gates the change display: the directional caret + unsigned % render only when this is a finite number.
   */
  priceChangePercent?: number;
  /**
   * Current rate / price, rendered as currency (e.g. "$186.79") between the
   * symbol and the change, following the shared price convention (PE-1041):
   * `$` symbol, trailing zeros stripped, up to 5 decimals for sub-$1 assets.
   * Hidden while not a finite positive number (pricing pending).
   */
  currentPrice?: number;
  /** Called when the trade chip is pressed */
  onPress?: () => void;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID prefix for the chip and its sub-parts (e.g. `${testID}-avatar`) */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function TradeAssetAvatar({ avatar, testID }: { avatar: EtAssetData['avatar']; testID?: string }) {
  // EtAvatar's smallest size is 24px; scale it into a 16px box to match Figma
  // while keeping the instrument tint + fallback behaviour. Rendered directly
  // (not via EtAssetInfo) to avoid the info-row gap + empty text-block spacing.
  if (!avatar?.source) {
    return null;
  }
  return (
    <View style={avatarStyles.box} testID={testID ? `${testID}-avatar` : undefined}>
      <View style={avatarStyles.scale}>
        <InfoAvatar avatar={avatar} />
      </View>
    </View>
  );
}

TradeAssetAvatar.displayName = 'EtPost.Trade.Avatar';

const avatarStyles = StyleSheet.create({
  box: {
    width: AVATAR_TARGET_SIZE,
    height: AVATAR_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scale: {
    transform: [{ scale: AVATAR_TARGET_SIZE / AVATAR_SOURCE_SIZE }],
  },
});

// ============================================================================
// Component
// ============================================================================

/**
 * TradeRenderer - Sub-component of EtPost (exposed as `EtPost.Trade`).
 *
 * Renders a self-hugging, tappable asset chip (pill) showing, left to right:
 * - Asset avatar
 * - Symbol name
 * - Current price as currency (e.g. "$186.79") once pricing resolves
 * - Directional daily change (caret + unsigned %, e.g. "▲ 1.95%") once pricing resolves
 *
 * The avatar and symbol always render; the price and change fill in as their
 * values resolve (FR-011 — the chip never hides while pricing is pending).
 * Both follow the app-wide price conventions (InstrumentListCard / EtPrice,
 * PE-1040/PE-1041): the price uses `$` + adaptive decimals (up to 5 for sub-$1
 * assets, else 2, trailing zeros stripped); the change is the unsigned daily
 * percentage with direction conveyed via the caret + color only, composed from
 * `EtNumber` rather than `EtPrice.Change` (no sign, no parens, no absolute value).
 *
 * Dumb and translation-free: all data is passed in via props by the feature layer.
 * Use as `<EtPost.Trade symbolName="AAPL" currentPrice={186.79} priceChangePercent={1.95} onPress={handler} />`.
 *
 * @param props - {@link TradeRendererProps}
 * @returns The rendered asset trade chip.
 *
 * @example
 * ```tsx
 * <EtPost.Trade symbolName="AAPL" currentPrice={186.79} priceChangePercent={1.95} onPress={() => openAsset('AAPL')} />
 * ```
 */
function TradeRendererBase({
  symbolName: rawSymbolName,
  displayName: rawDisplayName,
  avatarSource: rawAvatarSource,
  avatarSvgSource,
  avatarBackgroundColor,
  avatarTextColor,
  priceChangePercent,
  currentPrice,
  onPress,
  style,
  testID = 'post-trade-tag',
  accessibilityLabel,
}: TradeRendererProps) {
  const isShared = useIsSharedAttachment();
  const { colors } = useEtoroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Guard against null/empty string props
  const symbolName = rawSymbolName ?? '';
  const displayName = rawDisplayName ?? '';
  const avatarSource = rawAvatarSource ?? '';

  // Prefer SVG source, fall back to raster
  const resolvedAvatarSource = avatarSvgSource || avatarSource;

  const fallbackTextStyle = useMemo(() => ({ color: avatarTextColor || colors.carbonStatic050 }), [avatarTextColor, colors.carbonStatic050]);

  const assetInfoData = useMemo<EtAssetData>(
    () => ({
      avatar: {
        source: resolvedAvatarSource,
        size: 'small',
        shape: 'square',
        variant: 'instrument',
        alt: symbolName,
        fallback: (
          <EtText variant="body-tiny-medium" style={fallbackTextStyle}>
            {symbolName?.trim().charAt(0) || '?'}
          </EtText>
        ),
        backgroundColor: avatarBackgroundColor,
      },
      title: symbolName,
      subtitle: displayName,
    }),
    [avatarBackgroundColor, displayName, fallbackTextStyle, resolvedAvatarSource, symbolName],
  );

  // FR-011: always render avatar + symbol; the current price and directional
  // change fill in once their values resolve to finite numbers. `currentPrice`
  // additionally requires > 0 — pricing hooks report 0 while pending.
  const hasCurrentPrice = Number.isFinite(currentPrice) && (currentPrice as number) > 0;
  const hasChange = Number.isFinite(priceChangePercent);
  // Adaptive precision mirrors EtPrice.Value / InstrumentListCard (PE-1041):
  // sub-$1 assets get up to 5 decimals so cheap crypto doesn't round to $0.00.
  const priceMaxDecimals = hasCurrentPrice && (currentPrice as number) < 1 ? 5 : 2;
  // Design shows a directional caret + the unsigned percentage (no sign, no parens),
  // so we compose EtNumber directly rather than using EtPrice.Change.
  // Color/caret direction follow the displayed % so caret and value never disagree.
  const changeColor = (priceChangePercent as number) >= 0 ? colors.verdictPositive600 : colors.verdictNegative600;

  const containerStyle = isShared ? [styles.container, sharedOverrides.container, style] : [styles.container, style];

  return (
    <View style={containerStyle}>
      <EtChip onPress={onPress} style={styles.chip} testID={testID} accessibilityLabel={accessibilityLabel}>
        <View style={styles.pill}>
          <TradeAssetAvatar avatar={assetInfoData.avatar} testID={testID} />
          <EtText variant="body-tiny-medium" style={styles.symbolText}>
            {symbolName}
          </EtText>
          {hasCurrentPrice && (
            <EtNumber
              value={currentPrice}
              format="currency"
              symbol="$"
              minDecimals={0}
              maxDecimals={priceMaxDecimals}
              color={colors.textPrimaryNeutral}
              testID={`${testID}-price`}
            >
              <EtNumber.Value variant="body-tiny-medium" />
            </EtNumber>
          )}
          {hasChange && (
            <EtNumber
              value={(priceChangePercent as number) / 100}
              format="percentage"
              color={changeColor}
              showAbsoluteValue
              minDecimals={0}
              maxDecimals={2}
              testID={`${testID}-change`}
            >
              <EtNumber.Arrow />
              <EtNumber.Value variant="num-xs-medium" />
            </EtNumber>
          )}
        </View>
      </EtChip>
    </View>
  );
}

export const TradeRenderer = React.memo(TradeRendererBase);
TradeRenderer.displayName = 'EtPost.Trade';

// ============================================================================
// Styles
// ============================================================================

const sharedOverrides = StyleSheet.create({
  container: { paddingHorizontal: 0 },
});

/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
const createStyles = (colors: ReturnType<typeof useEtoroTheme>['colors']) =>
  StyleSheet.create({
    container: {
      marginTop: X4,
      paddingHorizontal: X6,
      alignItems: 'flex-start',
    },
    // EtChip forces a transparent animated background, so the chip acts as a
    // borderless, padding-free pressable shell and the inner pill carries the surface.
    chip: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderWidth: 0,
      borderRadius: TRADE_PILL_RADIUS,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: X1,
      minHeight: TRADE_PILL_MIN_HEIGHT,
      paddingVertical: TRADE_PILL_PADDING_VERTICAL,
      paddingHorizontal: X3,
      borderRadius: TRADE_PILL_RADIUS,
      backgroundColor: colors.cardDefault,
    },
    symbolText: {
      color: colors.textPrimaryNeutral,
    },
  });
