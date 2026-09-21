import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtTextProps } from '../../../foundations/text/api/types';
import { EtText } from '../../../foundations/text/et-text';

export function TopbarTitle({ children, variant = 'heading-compact', numberOfLines = 1, style, ...rest }: EtTextProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant={variant} numberOfLines={numberOfLines} style={[styles.title, { color: colors.carbon900 }, style]} {...rest}>
      {children}
    </EtText>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
