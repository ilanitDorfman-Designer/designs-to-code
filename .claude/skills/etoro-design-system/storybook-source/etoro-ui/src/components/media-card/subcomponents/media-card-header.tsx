import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import type { MediaCardHeaderProps, MediaCardSlotType } from '../api';

/**
 * EtMediaCard.Header — top row on medium / large cards.
 *
 * Full-width row so content can sit at the **start** (e.g. {@link EtMediaCard.Badge})
 * and/or the **end** (e.g. {@link EtIconButton}).
 *
 * Prefer `start` / `end` for the standard badge + action recipe; pass `children`
 * for fully custom layouts.
 *
 * @example Badge + action
 * ```tsx
 * <EtMediaCard.Header
 *   start={<EtMediaCard.Badge>Daily gainer</EtMediaCard.Badge>}
 *   end={<EtIconButton iconName="close" size={24} onPress={…} />}
 * />
 * ```
 *
 * @example End-only (spacer keeps the action pinned to the trailing edge)
 * ```tsx
 * <EtMediaCard.Header end={<EtIconButton iconName="star" size={24} onPress={…} />} />
 * ```
 */
function MediaCardHeaderComponent({ start, end, children, style, testID }: MediaCardHeaderProps) {
  const useSlots = start !== undefined || end !== undefined;
  const content: ReactNode = useSlots ? (
    <>
      {start ?? <View />}
      {end ?? null}
    </>
  ) : (
    children
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      {content}
    </View>
  );
}

export const MediaCardHeader = memo(MediaCardHeaderComponent);
MediaCardHeader.displayName = 'EtMediaCard.Header';
(MediaCardHeader as typeof MediaCardHeader & { __SLOT_TYPE: MediaCardSlotType }).__SLOT_TYPE = 'header';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    width: '100%',
    zIndex: 1,
  },
});
