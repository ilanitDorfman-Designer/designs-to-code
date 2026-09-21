import { LinearGradient } from 'expo-linear-gradient';
import { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { X5, X6, X9 } from '../../core/styles/spacing';
import { CryptoCardProvider, useCryptoCardContext } from './api/context';
import { EtCryptoCardProps } from './api/types';
import {
  CryptoBottomSection,
  CryptoInfo,
  CryptoLogo,
  CryptoLogoSection,
  CryptoName,
  CryptoPrice,
  CryptoPricing,
  CryptoSymbol,
  CryptoUnits,
} from './subcomponents';
import { getOverlayColor } from './utils/overlay-util';

// ============================================================================
// Card Content (Layout Component)
// ============================================================================

interface CryptoCardContentProps {
  children: ReactNode;
}

function CryptoCardContent({ children }: CryptoCardContentProps) {
  const { color, surfaceTestID } = useCryptoCardContext();
  const overlayColor = getOverlayColor();

  return (
    <View style={{ backgroundColor: color }} testID={surfaceTestID}>
      {/* Gradient Overlay */}
      <LinearGradient colors={overlayColor} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientOverlay} />

      {/* Content Layer - render children directly */}
      <View style={styles.contentLayer}>{children}</View>
    </View>
  );
}

// ============================================================================
// Root Component
// ============================================================================

/**
 * EtCryptoCard - A crypto asset card with gradient background.
 *
 * Uses a compound component pattern for flexible composition.
 * Colors are automatically extracted from the CDN URL unless
 * {@link EtCryptoCardProps.backgroundColor} is provided.
 * Children are rendered directly for maximum flexibility.
 *
 * @example
 * ```tsx
 * <EtCryptoCard logoUrl="https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F0AF32_F7F7F7.svg">
 *   <EtCryptoCard.LogoSection>
 *     <EtCryptoCard.Logo />
 *   </EtCryptoCard.LogoSection>
 *   <EtCryptoCard.BottomSection>
 *     <EtCryptoCard.Info>
 *       <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
 *       <EtCryptoCard.Name>Bitcoin</EtCryptoCard.Name>
 *     </EtCryptoCard.Info>
 *     <EtCryptoCard.Pricing>
 *       <EtCryptoCard.Price>$42,150.23</EtCryptoCard.Price>
 *       <EtCryptoCard.Units>0.5 BTC</EtCryptoCard.Units>
 *     </EtCryptoCard.Pricing>
 *   </EtCryptoCard.BottomSection>
 * </EtCryptoCard>
 * ```
 */
function CryptoCardComponent({ logoUrl, backgroundColor, children, style, testID }: EtCryptoCardProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <CryptoCardProvider logoUrl={logoUrl} backgroundColor={backgroundColor} testID={testID}>
        <CryptoCardContent>{children}</CryptoCardContent>
      </CryptoCardProvider>
    </View>
  );
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

const CryptoCardBase = memo(CryptoCardComponent);
CryptoCardBase.displayName = 'EtCryptoCard';

/**
 * EtCryptoCard compound component with subcomponents.
 *
 * Layout Subcomponents:
 * - `EtCryptoCard.LogoSection` - Centered container for logo (use at top)
 * - `EtCryptoCard.BottomSection` - Row container for Info and Pricing
 *
 * Content Subcomponents:
 * - `EtCryptoCard.Logo` - Crypto logo image
 * - `EtCryptoCard.Info` - Container for Symbol and Name
 * - `EtCryptoCard.Symbol` - Crypto symbol (e.g., "BTC")
 * - `EtCryptoCard.Name` - Crypto name (e.g., "Bitcoin")
 * - `EtCryptoCard.Pricing` - Container for Price and Units
 * - `EtCryptoCard.Price` - Current price
 * - `EtCryptoCard.Units` - Units owned
 */
export const EtCryptoCard = Object.assign(CryptoCardBase, {
  // Layout
  LogoSection: CryptoLogoSection,
  BottomSection: CryptoBottomSection,
  // Content
  Logo: CryptoLogo,
  Info: CryptoInfo,
  Symbol: CryptoSymbol,
  Name: CryptoName,
  Pricing: CryptoPricing,
  Price: CryptoPrice,
  Units: CryptoUnits,
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: X5,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentLayer: {
    paddingHorizontal: X6,
    paddingTop: X9,
    paddingBottom: X5,
  },
});
