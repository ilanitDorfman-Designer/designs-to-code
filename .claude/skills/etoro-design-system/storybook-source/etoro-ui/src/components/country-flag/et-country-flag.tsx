import { memo, useMemo } from 'react';

import { getFlagComponent } from '../../core/country-flags';
import { EtCountryFlagProps } from './api/types';

/** Default flag circle diameter matching the Figma design (36px) */
const DEFAULT_SIZE = 36;

function EtCountryFlagBase({ isoCode, size = DEFAULT_SIZE, testID, accessibilityLabel }: EtCountryFlagProps) {
  const FlagSvg = useMemo(() => getFlagComponent(isoCode) ?? getFlagComponent('zz'), [isoCode]);

  if (!FlagSvg) {
    return null;
  }

  return <FlagSvg width={size} height={size} testID={testID} accessibilityLabel={accessibilityLabel ?? isoCode} accessibilityRole="image" />;
}

EtCountryFlagBase.displayName = 'EtCountryFlag';

export const EtCountryFlag = memo(EtCountryFlagBase);
