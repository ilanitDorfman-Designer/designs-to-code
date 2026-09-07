import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X3 } from '../../../../core/styles/spacing';
import type { BannerActionsProps } from '../api/types';

/**
 * EtBanner.Actions — horizontal row for EtButton and/or EtLink CTAs.
 */
function BannerActionsBase({ children, style, testID }: BannerActionsProps) {
  return (
    <View style={[styles.row, style]} testID={testID}>
      {children}
    </View>
  );
}

export const BannerActions = memo(BannerActionsBase);
BannerActions.displayName = 'EtBanner.Actions';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: X3,
  },
});
