import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  HANDLE_INDICATOR_BORDER_RADIUS,
  HANDLE_INDICATOR_HEIGHT,
  HANDLE_INDICATOR_WIDTH,
  HANDLE_PADDING_BOTTOM,
  HANDLE_PADDING_TOP,
  MODAL_BORDER_RADIUS,
} from '../../constants';
import { useModalConfig } from '../../context';

interface EtModalHandleProps {
  showHandle?: boolean;
}

/**
 * Handle component for EtModal with floating effect.
 * Matches the visual style of EtBottomSheetV2's handle.
 *
 * Reads its colours from the modal config context (same as Header & Footer), so the rounded-top cap
 * paints with the sheet's surface (driven by EtModal's `surface` prop) and the grabber with the
 * handle colour — keeping the whole sheet a single uniform surface.
 */
export function EtModalHandle({ showHandle = true }: EtModalHandleProps): React.JSX.Element {
  const { colors } = useModalConfig();

  return (
    <View style={styles.container}>
      <View style={styles.floatingArea}>
        <View style={[styles.indicator, showHandle ? { backgroundColor: colors.handle } : styles.hiddenIndicator]} />
      </View>
      <View style={[styles.roundedTop, { backgroundColor: colors.background }]} />
    </View>
  );
}

EtModalHandle.displayName = 'EtModal.Handle';

const styles = StyleSheet.create({
  container: {},
  floatingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: HANDLE_PADDING_TOP,
    paddingBottom: HANDLE_PADDING_BOTTOM,
  },
  indicator: {
    width: HANDLE_INDICATOR_WIDTH,
    height: HANDLE_INDICATOR_HEIGHT,
    borderRadius: HANDLE_INDICATOR_BORDER_RADIUS,
  },
  hiddenIndicator: {
    height: 0,
    opacity: 0,
  },
  roundedTop: {
    height: MODAL_BORDER_RADIUS,
    borderTopLeftRadius: MODAL_BORDER_RADIUS,
    borderTopRightRadius: MODAL_BORDER_RADIUS,
  },
});
