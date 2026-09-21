import React from 'react';
import { View } from 'react-native';

import type { ListFooterProps, SlotType } from '../api';

/**
 * `EtList.Footer` - Rendered as the FlashList's `ListFooterComponent`.
 *
 * Use this for inline batch-loader skeletons or inline batch-error banners
 * that should scroll into view at the bottom of the data. The conditional
 * render of those states is owned by the consumer.
 */
function ListFooterBase({ children, style, testID }: ListFooterProps) {
  return (
    <View style={style} testID={testID}>
      {children}
    </View>
  );
}

export const ListFooter = React.memo(ListFooterBase) as React.MemoExoticComponent<typeof ListFooterBase> & { __SLOT_TYPE: SlotType };
ListFooter.displayName = 'EtList.Footer';
ListFooter.__SLOT_TYPE = 'footer';
