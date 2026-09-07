import { memo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import type { BannerDescriptionProps } from '../api/types';

/**
 * EtBanner.Description — Body/Secondary/Regular supporting copy.
 */
function BannerDescriptionBase({ children, style, testID }: BannerDescriptionProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="body-secondary-regular" style={[{ color: colors.textPrimaryNeutral }, style]} testID={testID}>
      {children}
    </EtText>
  );
}

export const BannerDescription = memo(BannerDescriptionBase);
BannerDescription.displayName = 'EtBanner.Description';
