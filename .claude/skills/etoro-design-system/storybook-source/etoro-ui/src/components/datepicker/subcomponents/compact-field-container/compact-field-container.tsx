import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useDatepickerConfig, useDatepickerInteraction } from '../../context';
import { useComponentChildren } from '../../hooks/use-component-children';
import { CompactFieldDisplay } from '../compact-field-display';
import { HelperText } from '../helper-text';
import { NativePickerModal } from '../native-picker-modal';

export interface CompactFieldContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function CompactFieldContainer({ style, children }: CompactFieldContainerProps) {
  const { error } = useDatepickerConfig();
  const { isPickerOpen } = useDatepickerInteraction();
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

CompactFieldContainer.displayName = 'EtDatepicker.CompactFieldContainer';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});
