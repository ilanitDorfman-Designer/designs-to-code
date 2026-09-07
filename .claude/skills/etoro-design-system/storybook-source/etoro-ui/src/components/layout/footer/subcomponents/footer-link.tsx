import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1, X2 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { EtFooterLinkProps } from '../api';

/**
 * Individual footer link.
 */
export const FooterLink = memo<EtFooterLinkProps>(({ children, style, ...rest }) => {
  const { colors } = useEtoroTheme();

  return (
    <Pressable accessibilityRole="link" {...rest} style={[styles.container, style]}>
      <EtText variant="body-secondary-regular" style={{ color: colors.primary600 }}>
        {children}
      </EtText>
    </Pressable>
  );
});

FooterLink.displayName = 'EtFooter.Link';

const styles = StyleSheet.create({
  container: {
    paddingVertical: X1,
    paddingHorizontal: X2,
  },
});
