import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { EtText } from '../../../../../foundations/text/et-text';
import type { EtBottomSheetHeaderTitleProps } from './et-bottom-sheet-header.types';

/**
 * EtBottomSheet.Header.Title - Centered title text for the header.
 */
function EtBottomSheetHeaderTitleComponent({
  children,
  variant = 'label-primary-semibold',
  numberOfLines = 1,
  style,
  ...rest
}: EtBottomSheetHeaderTitleProps) {
  return (
    <EtText variant={variant} numberOfLines={numberOfLines} style={[styles.title, style]} {...rest}>
      {children}
    </EtText>
  );
}

export const EtBottomSheetHeaderTitle = memo(EtBottomSheetHeaderTitleComponent);
EtBottomSheetHeaderTitle.displayName = 'EtBottomSheet.Header.Title';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: -4,
  },
});
