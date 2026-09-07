import { ReactNode } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { InfoText } from '../../_info-base/subcomponents';
import { useEtAssetInfoContext } from '../hooks';

type Props = {
  children?: ReactNode | ReactNode[];
};

export function EtAssetInfoSubtitle({ children }: Props) {
  const { data, ellipsizeMode } = useEtAssetInfoContext();
  const { colors } = useEtoroTheme();

  return (
    <InfoText
      value={data.subtitle}
      variant="label-tertiary-regular"
      style={{ color: colors.carbon600 }}
      ellipsizeMode={ellipsizeMode}
      children={children}
    />
  );
}

EtAssetInfoSubtitle.displayName = 'EtAssetInfo.Subtitle';
