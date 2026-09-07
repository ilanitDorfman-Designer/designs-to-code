import { ReactNode } from 'react';

import { InfoText } from '../../_info-base/subcomponents';
import { useEtUserInfoContext } from '../hooks';

type Props = {
  children?: ReactNode | ReactNode[];
};

export function EtUserInfoSubtitle({ children }: Props) {
  const { data, ellipsizeMode } = useEtUserInfoContext();

  return <InfoText value={data.subtitle} variant="label-secondary-regular" ellipsizeMode={ellipsizeMode} children={children} />;
}

EtUserInfoSubtitle.displayName = 'EtUserInfo.Subtitle';
