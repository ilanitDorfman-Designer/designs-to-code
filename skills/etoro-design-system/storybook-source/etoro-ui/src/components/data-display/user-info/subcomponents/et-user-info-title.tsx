import { ReactNode } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { InfoText } from '../../_info-base/subcomponents';
import { useEtUserInfoContext } from '../hooks';

type Props = {
  children?: ReactNode | ReactNode[];
};

export function EtUserInfoTitle({ children }: Props) {
  const { colors } = useEtoroTheme();
  const { data, ellipsizeMode } = useEtUserInfoContext();

  return (
    <InfoText
      value={data.title}
      variant="label-primary-semibold"
      ellipsizeMode={ellipsizeMode}
      style={{ color: colors.textPrimaryNeutral }}
      children={children}
    />
  );
}

EtUserInfoTitle.displayName = 'EtUserInfo.Title';
