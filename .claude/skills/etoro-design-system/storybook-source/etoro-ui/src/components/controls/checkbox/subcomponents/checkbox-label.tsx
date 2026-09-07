import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import { CheckboxLabelProps } from '../api/types';

/**
 * EtCheckbox.Label - Text label subcomponent for EtCheckbox.
 *
 * The label text is rendered without `onPress` so that nested interactive
 * elements (e.g. `<Text onPress>` links inside `Trans`) can receive touches.
 * The parent `EtCheckbox` handles "tap label to toggle" via a responder-based
 * View wrapper that defers to child text touches.
 */
export function CheckboxLabel({ children, style, disabled = false }: CheckboxLabelProps) {
  const { colors } = useEtoroTheme();

  const textColor = disabled ? colors.carbon400 : colors.carbon600;

  return (
    <EtText variant="body-secondary-regular" style={[styles.label, { color: textColor }, style]}>
      {children}
    </EtText>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
  },
});

CheckboxLabel.displayName = 'EtCheckbox.Label';
