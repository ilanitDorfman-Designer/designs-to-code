import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// Root Component Types
// ============================================================================

/**
 * Props for the EtCryptoCard root component.
 */
export interface EtCryptoCardProps {
  /**
   * CDN URL for the crypto asset logo.
   * Colors are automatically extracted from the URL for the gradient background
   * unless {@link backgroundColor} is provided.
   *
   * @example
   * "https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F0AF32_F7F7F7.svg"
   */
  logoUrl: string;

  /**
   * Optional brand background colour. When set, overrides colour extraction from
   * {@link logoUrl} (e.g. when the BFF supplies explicit instrument colours).
   */
  backgroundColor?: string;

  /**
   * Compound component children (Logo, Info, Pricing, etc.)
   */
  children: ReactNode;

  /**
   * Optional style overrides for the card container.
   * Use this to control the card's width.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional test ID for testing.
   */
  testID?: string;
}

// ============================================================================
// Subcomponent Props
// ============================================================================

/**
 * Props for EtCryptoCard.Logo subcomponent.
 */
export interface CryptoLogoProps {
  /**
   * Size of the logo in pixels.
   * @default 64
   */
  size?: number;

  /**
   * Optional accessibility label for screen readers.
   * Describes the logo for users with visual impairments.
   */
  accessibilityLabel?: string;
}

/**
 * Props for EtCryptoCard.Info container subcomponent.
 * Contains Symbol and Name.
 */
export interface CryptoInfoProps {
  /**
   * Children should be Symbol and Name subcomponents.
   */
  children: ReactNode;

  /**
   * Optional test ID for targeting in tests.
   */
  testID?: string;
}

/**
 * Props for EtCryptoCard.Symbol subcomponent.
 */
export interface CryptoSymbolProps {
  /**
   * The crypto symbol text (e.g., "BTC", "ETH").
   */
  children: ReactNode;

  /**
   * Optional test ID for targeting in tests.
   */
  testID?: string;
}

/**
 * Props for EtCryptoCard.Name subcomponent.
 */
export interface CryptoNameProps {
  /**
   * The crypto name text (e.g., "Bitcoin", "Ethereum").
   */
  children: ReactNode;

  /**
   * Optional test ID for targeting in tests.
   */
  testID?: string;
}

/**
 * Props for EtCryptoCard.Pricing container subcomponent.
 * Contains Price and Units.
 */
export interface CryptoPricingProps {
  /**
   * Children should be Price and Units subcomponents.
   */
  children: ReactNode;

  /**
   * Optional test ID for targeting in tests.
   */
  testID?: string;
}

/**
 * Props for EtCryptoCard.Price subcomponent.
 */
export interface CryptoPriceProps {
  /**
   * The price text (e.g., "$42,150.23").
   */
  children: ReactNode;

  /**
   * Optional test ID for targeting in tests.
   */
  testID?: string;
}

/**
 * Props for EtCryptoCard.Units subcomponent.
 */
export interface CryptoUnitsProps {
  /**
   * The units text (e.g., "0.5 BTC").
   */
  children: ReactNode;

  /**
   * Optional test ID for targeting in tests.
   */
  testID?: string;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Internal context value for CryptoCard compound component.
 * Minimal - only shares data, no registration functions.
 */
export interface CryptoCardContextValue {
  /** The CDN URL for the logo */
  logoUrl: string;

  /** Resolved brand background colour for the card surface */
  color: string;

  /** Optional test ID for the coloured surface layer (`${rootTestID}-surface`) */
  surfaceTestID?: string;
}
