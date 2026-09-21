import { memo, type ReactNode } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { EtBadge } from '../../status/badge';
import { useMediaCardContext } from '../api';

type Props = {
  children: ReactNode;
  testID?: string;
};

/**
 * EtMediaCard.Badge — translucent header pill for media cards (Figma label).
 *
 * Fill is surface-aware so the pill stays noticeable on every surface:
 * - bright / light surfaces → translucent grey (`bgGreyTransparentSecondary`)
 * - dark / image / video surfaces → translucent white (`bgTransparentPrimaryBright`)
 *
 * Label uses MediaCard `foregroundColor` so text contrast matches the surface.
 *
 * Intended as the **start** child of {@link EtMediaCard.Header} (Asset Card,
 * Smart Portfolio, etc.).
 */
function MediaCardBadgeComponent({ children, testID }: Props) {
  const { colors } = useEtoroTheme();
  const { foregroundColor, isBright } = useMediaCardContext();
  const backgroundColor = isBright ? colors.bgGreyTransparentSecondary : colors.bgTransparentPrimaryBright;

  return (
    <EtBadge color="neutral" size="medium" style={{ backgroundColor }} testID={testID}>
      <EtBadge.Label style={{ color: foregroundColor }}>{children}</EtBadge.Label>
    </EtBadge>
  );
}

export const MediaCardBadge = memo(MediaCardBadgeComponent);
MediaCardBadge.displayName = 'EtMediaCard.Badge';
