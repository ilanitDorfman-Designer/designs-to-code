import type { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { EtAvatar } from '../../../social/avatar';
import type { InfoAvatarData, InfoAvatarShape } from '../types';

export type InfoAvatarProps = {
  avatar: InfoAvatarData;
  /** Override shape when data.avatar.shape should be ignored (e.g. EtUserInfo always uses square). */
  shapeOverride?: InfoAvatarShape;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Shared avatar renderer for info components.
 */
export function InfoAvatar({ avatar, shapeOverride, style, children }: InfoAvatarProps) {
  if (!avatar?.source) {
    return null;
  }

  const shape = shapeOverride ?? avatar.shape ?? 'square';
  const variant = avatar.variant ?? 'default';

  return (
    <EtAvatar size={avatar.size} shape={shape} variant={variant} imageBackgroundColor={avatar.backgroundColor} style={style}>
      <EtAvatar.Image src={avatar.source} alt={avatar.alt} />
      {avatar.fallback != null && <EtAvatar.Fallback>{avatar.fallback}</EtAvatar.Fallback>}
      {children}
    </EtAvatar>
  );
}
