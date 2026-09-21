import React from 'react';
import { StyleSheet, View } from 'react-native';

import { X4, X10 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import type { ListErrorProps, SlotType } from '../api';

/**
 * `EtList.Error` - Rendered when `error` is non-null and `data` is empty.
 *
 * Consumers own the message text. String children are wrapped in an `EtText`
 * for convenience; other nodes pass through unchanged so callers can render
 * richer error states (e.g. an icon + text, a retry-less notice).
 */
function ListErrorBase({ children, style, testID }: ListErrorProps) {
  return (
    <View style={[styles.container, style]} testID={testID} accessibilityRole="alert">
      {typeof children === 'string' ? <EtText variant="body-base-medium">{children}</EtText> : children}
    </View>
  );
}

export const ListError = React.memo(ListErrorBase) as React.MemoExoticComponent<typeof ListErrorBase> & { __SLOT_TYPE: SlotType };
ListError.displayName = 'EtList.Error';
ListError.__SLOT_TYPE = 'error';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: X4,
    paddingTop: X10,
  },
});
