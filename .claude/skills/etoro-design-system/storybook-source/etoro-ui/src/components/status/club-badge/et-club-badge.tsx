import React from 'react';

import type { EtClubBadgeProps } from './et-club-badge.types';
import { EtClubBadgeLegacy } from './et-club-badge-legacy';
import { EtClubBadgeV2 } from './et-club-badge-v2';

export type { EtClubBadgeColorScheme, EtClubBadgeProps, EtClubBadgeVariant } from './et-club-badge.types';

/**
 * `<EtClubBadge>` — pill marking eToro Club membership or gating.
 *
 * - `variant="legacy"` (default) — primary-bordered pill with sans-serif "Club" label.
 * - `variant="v2"` — carbon-bordered pill with serif wordmark (Club 2.0).
 *
 * See `AGENTS.mdc` for variants, theming, anti-patterns, and tokens.
 *
 * @example
 * ```tsx
 * <EtClubBadge />                              // legacy Club identifier
 * <EtClubBadge showLock variant="v2" />        // Club 2.0 gated content
 * <EtClubBadge colorScheme="dark" variant="v2" />
 * ```
 */
function EtClubBadgeBase({ variant = 'legacy', ...props }: EtClubBadgeProps): React.ReactNode {
  if (variant === 'v2') {
    return <EtClubBadgeV2 {...props} />;
  }

  return <EtClubBadgeLegacy {...props} />;
}

export const EtClubBadge = React.memo(EtClubBadgeBase);
EtClubBadge.displayName = 'EtClubBadge';
