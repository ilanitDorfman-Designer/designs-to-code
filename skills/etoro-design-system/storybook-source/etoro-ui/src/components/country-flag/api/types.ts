export interface EtCountryFlagProps {
  /** ISO country code (e.g., "IL", "US", "GB") */
  isoCode: string;

  /** Flag circle diameter in pixels. @default 36 */
  size?: number;

  /** Test identifier */
  testID?: string;

  /** Accessibility label (defaults to isoCode if not provided) */
  accessibilityLabel?: string;
}
