import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTimepickerConfig, useTimepickerInteraction } from '../../context';
import { useComponentChildren } from '../../hooks/use-component-children';
import { CompactFieldDisplay } from '../compact-field-display';
import { HelperText } from '../helper-text';
import { NativePickerModal } from '../native-picker-modal';

export interface CompactFieldContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

function CompactFieldContainerComponent({ style, children }: CompactFieldContainerProps) {
  const { error } = useTimepickerConfig();
  const { isPickerOpen } = useTimepickerInteraction();
  const { hasCompactFieldDisplay } = useComponentChildren(children);

  const shouldShowHelperText = Boolean(error);

  return (
    <View style={[styles.container, style]}>
      {hasCompactFieldDisplay ? children : <CompactFieldDisplay />}
      {shouldShowHelperText && <HelperText error={error} />}
      {isPickerOpen && <NativePickerModal />}
    </View>
  );
}

export const CompactFieldContainer = React.memo(CompactFieldContainerComponent);
CompactFieldContainer.displayName = 'EtTimepicker.CompactFieldContainer';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});
