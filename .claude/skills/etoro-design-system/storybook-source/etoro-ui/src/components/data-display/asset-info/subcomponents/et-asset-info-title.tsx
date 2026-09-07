import { ReactNode } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { InfoText } from '../../_info-base/subcomponents';
import { useEtAssetInfoContext } from '../hooks';

type Props = {
  testID?: string;
  children?: ReactNode | ReactNode[];
};

export function EtAssetInfoTitle({ testID, children }: Props) {
  const { colors } = useEtoroTheme();
  const { data, ellipsizeMode } = useEtAssetInfoContext();

  return (
    <InfoText
      value={data.title}
      variant="label-primary-bold"
      ellipsizeMode={ellipsizeMode}
      style={{ color: colors.textPrimaryNeutral }}
      testID={testID}
      children={children}
    />
  );
}

EtAssetInfoTitle.displayName = 'EtAssetInfo.Title';
