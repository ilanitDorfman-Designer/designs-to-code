import type { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { InfoAvatar } from '../../_info-base/subcomponents';
import { useEtAssetInfoContext } from '../hooks';

type Props = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function EtAssetInfoAvatar({ style, children }: Props) {
  const {
    data: { avatar },
  } = useEtAssetInfoContext();

  if (!avatar?.source) {
    return null;
  }

  return (
    <InfoAvatar avatar={avatar} style={style}>
      {children}
    </InfoAvatar>
  );
}

EtAssetInfoAvatar.displayName = 'EtAssetInfo.Avatar';
