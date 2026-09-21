// NATIVE TWIN: the advanced watchlist table renders EtAvatar (instrument variant: small square, SVG background from the URL, gradient overlay, initials fallback) natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/EtNativeInstrumentAvatar.swift and
// apps/etoro-mobile/modules/advanced-table/android/src/main/java/expo/modules/advancedtable/EtNativeInstrumentAvatar.kt. A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { AvatarBadge, AvatarCurrency, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, AvatarMarketOpen } from './subcomponents';
import { AvatarContext, useAvatarGroupContext } from './utils/context';
import { getBorderRadius, getSizeValue } from './utils/styles';
import type { AvatarContextValue, EtAvatarProps } from './utils/types';

/**
 * EtAvatar - A compositional avatar component
 *
 * @example Basic usage with fallback
 * ```tsx
 * <EtAvatar size="medium" shape="circle">
 *   <EtAvatar.Image src={user.avatarUrl} alt={user.name} />
 *   <EtAvatar.Fallback>JD</EtAvatar.Fallback>
 * </EtAvatar>
 * ```
 *
 * @example With badge
 * ```tsx
 * <EtAvatar size="large" shape="square">
 *   <EtAvatar.Image src={user.avatarUrl} />
 *   <EtAvatar.Fallback>JD</EtAvatar.Fallback>
 *   <EtAvatar.Badge position="bottomRight">
 *     <OnlineIndicator />
 *   </EtAvatar.Badge>
 * </EtAvatar>
 * ```
 *
 * @example Instrument with overlay
 * ```tsx
 * <EtAvatar size="medium" variant="instrument">
 *   <EtAvatar.Image src={stock.logo} />
 * </EtAvatar>
 * ```
 *
 * @example Currency with overlay
 * ```tsx
 * <EtAvatar size="medium" variant="currency" imageBackgroundColor="#00AEEF">
 *   <EtAvatar.Currency>$</EtAvatar.Currency>
 * </EtAvatar>
 * ```
 *
 * @example Avatar group
 * ```tsx
 * <EtAvatar.Group>
 *   <EtAvatar size="small" shape="circle">
 *     <EtAvatar.Image src={user1.avatar} />
 *   </EtAvatar>
 *   <EtAvatar size="small" shape="circle">
 *     <EtAvatar.Image src={user2.avatar} />
 *   </EtAvatar>
 *   <EtAvatar.GroupCount>+3</EtAvatar.GroupCount>
 * </EtAvatar.Group>
 * ```
 */
function EtAvatarRoot({ children, size, shape = 'square', variant = 'default', imageBackgroundColor, style, ...rest }: EtAvatarProps) {
  const { colors } = useEtoroTheme();
  const group = useAvatarGroupContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [svgBackgroundColor, setSvgBackgroundColor] = useState<string | undefined>(undefined);

  // Size precedence: explicit prop > enclosing group's size > medium default.
  const resolvedSize = size ?? group?.size ?? 'medium';
  const sizeValue = getSizeValue(resolvedSize);
  const borderRadius = getBorderRadius(resolvedSize, shape);

  const contextValue: AvatarContextValue = useMemo(
    () => ({
      size: resolvedSize,
      shape,
      variant,
      imageLoaded,
      imageError,
      setImageLoaded,
      setImageError,
      svgBackgroundColor,
      setSvgBackgroundColor,
    }),
    [imageError, imageLoaded, shape, resolvedSize, svgBackgroundColor, variant],
  );

  const backgroundColor = svgBackgroundColor ?? imageBackgroundColor;
  const containerStyle = useMemo(() => ({ width: sizeValue, height: sizeValue, borderRadius }), [borderRadius, sizeValue]);
  const rootStyle = useMemo(() => [containerStyle, style], [containerStyle, style]);
  const clippedLayerStyle = useMemo(() => [StyleSheet.absoluteFill, styles.clippedLayer, { borderRadius }], [borderRadius]);
  const backgroundStyle = useMemo(() => [clippedLayerStyle, { backgroundColor }], [backgroundColor, clippedLayerStyle]);

  const gradientColors = useMemo(
    () => [colors.avatarOverlayTop, colors.avatarOverlayBottom] as const,
    [colors.avatarOverlayBottom, colors.avatarOverlayTop],
  );

  return (
    <AvatarContext.Provider value={contextValue}>
      <View style={rootStyle} {...rest}>
        {backgroundColor != null && <View style={backgroundStyle} pointerEvents="none" />}
        {children}

        {/* Clip only the overlay so market-status badges can still sit outside the avatar edge. */}
        {(variant === 'instrument' || variant === 'currency') && (
          <View style={clippedLayerStyle} pointerEvents="none">
            <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
          </View>
        )}
      </View>
    </AvatarContext.Provider>
  );
}

EtAvatarRoot.displayName = 'EtAvatar';

/**
 * EtAvatar with compound components attached
 */
export const EtAvatar = Object.assign(EtAvatarRoot, {
  Image: AvatarImage,
  Currency: AvatarCurrency,
  Fallback: AvatarFallback,
  Badge: AvatarBadge,
  MarketOpen: AvatarMarketOpen,
  Group: AvatarGroup,
  GroupCount: AvatarGroupCount,
});
export { EtAvatarRoot };

const styles = StyleSheet.create({
  clippedLayer: {
    overflow: 'hidden',
  },
});
