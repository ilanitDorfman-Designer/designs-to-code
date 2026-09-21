import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X4 } from '../../../../core/styles/spacing';
import { EtFooterSectionProps } from '../api';

/**
 * Section container for footer content.
 * Use as a child of EtFooter or EtFooter.Scrollable.
 */
export const FooterSection = memo<EtFooterSectionProps>(({ children, style, ...rest }) => (
  <View {...rest} style={[styles.container, style]}>
    {children}
  </View>
));

FooterSection.displayName = 'EtFooter.Section';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: X4,
    alignItems: 'center',
  },
});
