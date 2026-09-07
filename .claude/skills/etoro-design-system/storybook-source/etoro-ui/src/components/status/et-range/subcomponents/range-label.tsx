import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';

interface RangeLabelProps {
  value: string;
  position: 'left' | 'right';
}

export function RangeLabel({ value, position }: RangeLabelProps) {
  const { colors } = useEtoroTheme();
  const color = colors.textPrimaryNeutral;

  return (
    <EtText variant="num-xs" style={[styles.label, position === 'right' && styles.rightLabel, { color }]}>
      {value}
    </EtText>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
  },
  rightLabel: {
    textAlign: 'right',
  },
});
