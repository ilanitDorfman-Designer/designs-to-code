import { memo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import type { BannerTitleProps } from '../api/types';

/**
 * EtBanner.Title — Label/Primary/Semibold title slot.
 */
function BannerTitleBase({ children, style, testID }: BannerTitleProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="label-primary-semibold" style={[{ color: colors.textPrimaryNeutral }, style]} testID={testID}>
      {children}
    </EtText>
  );
}

export const BannerTitle = memo(BannerTitleBase);
BannerTitle.displayName = 'EtBanner.Title';
