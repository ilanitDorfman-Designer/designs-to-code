import { StyleSheet } from 'react-native';

import { EtText } from '../../../foundations/text';
import type { TextVariant } from '../../../foundations/text/utils/variant-config';
import { useButtonContext } from '../utils/context';
import type { ButtonSize, EtButtonLabelProps } from '../utils/types';

const LABEL_VARIANTS: Record<ButtonSize, TextVariant> = {
  tiny: 'label-tertiary-semibold',
  small: 'label-secondary-semibold',
  medium: 'label-secondary-semibold',
  large: 'label-primary-semibold',
};

/**
 * EtButton.Label - Text label subcomponent for EtButton
 * Automatically styled based on parent button context
 */
export function ButtonLabel({ children, style, numberOfLines = 1, variant, ...props }: EtButtonLabelProps) {
  const { size, textColor } = useButtonContext();

  return (
    <EtText variant={variant ?? LABEL_VARIANTS[size]} style={[styles.label, { color: textColor }, style]} numberOfLines={numberOfLines} {...props}>
      {children}
    </EtText>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
});
