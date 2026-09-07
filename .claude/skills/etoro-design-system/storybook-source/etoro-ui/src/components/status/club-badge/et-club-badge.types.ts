/** Pin the badge to a specific color-scheme appearance. */
export type EtClubBadgeColorScheme = 'light' | 'dark';

/** Visual generation of the Club badge. Defaults to `legacy` for backward compatibility. */
export type EtClubBadgeVariant = 'legacy' | 'v2';

export interface EtClubBadgeProps {
  /** Render the lock icon prefix to signal Club-gated content. */
  showLock?: boolean;
  /**
   * Pin the badge to one variant regardless of theme. Omit to adapt
   * to the active theme.
   */
  colorScheme?: EtClubBadgeColorScheme;
  /**
   * `legacy` — primary-bordered pill with sans-serif "Club" label.
   * `v2` — carbon-bordered pill with serif wordmark (Club 2.0).
   */
  variant?: EtClubBadgeVariant;
  /**
   * Override the default screen-reader label (`"eToro Club"` with
   * lock, `"eToro Club member"` without).
   */
  accessibilityLabel?: string;
  /** Test id forwarded to the outer wrapper. */
  testID?: string;
}
