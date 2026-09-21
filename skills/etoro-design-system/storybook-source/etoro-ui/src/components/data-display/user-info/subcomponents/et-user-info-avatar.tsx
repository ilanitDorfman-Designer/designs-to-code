import type { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { InfoAvatar } from '../../_info-base/subcomponents';
import { useEtUserInfoContext } from '../hooks';

type Props = {
  style?: StyleProp<ViewStyle>;
  /** Optional overlay (e.g. {@link EtAvatar.Badge} for a trader crown). */
  children?: ReactNode;
};

export function EtUserInfoAvatar({ style, children }: Props) {
  const {
    data: { avatar },
  } = useEtUserInfoContext();

  if (!avatar?.source) {
    return null;
  }

  return (
    <InfoAvatar avatar={avatar} shapeOverride="square" style={style}>
      {children}
    </InfoAvatar>
  );
}

EtUserInfoAvatar.displayName = 'EtUserInfo.Avatar';
