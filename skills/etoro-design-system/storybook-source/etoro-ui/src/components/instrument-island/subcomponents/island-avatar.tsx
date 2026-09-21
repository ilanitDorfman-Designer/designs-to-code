import { memo } from 'react';

import type { AvatarSize } from '../../social/avatar';
import { EtAvatar } from '../../social/avatar';
import { IslandInstrument } from '../api/types';

interface IslandAvatarProps {
  item: IslandInstrument;
  size: AvatarSize;
}

/**
 * Renders a single instrument/trader as an `EtAvatar` with image + initials
 * fallback. Shared by the collapsed pill and the expanded rail so both states
 * present identical artwork.
 */
function IslandAvatarBase({ item, size }: IslandAvatarProps) {
  return (
    <EtAvatar size={size} shape={item.shape ?? 'square'} variant="instrument" imageBackgroundColor={item.backgroundColor}>
      {item.imageUrl != null && <EtAvatar.Image src={item.imageUrl} accessibilityLabel={item.symbol} />}
      <EtAvatar.Fallback>{item.fallback ?? item.symbol.slice(0, 2).toUpperCase()}</EtAvatar.Fallback>
    </EtAvatar>
  );
}

export const IslandAvatar = memo(IslandAvatarBase);
IslandAvatar.displayName = 'EtInstrumentIsland.Avatar';
