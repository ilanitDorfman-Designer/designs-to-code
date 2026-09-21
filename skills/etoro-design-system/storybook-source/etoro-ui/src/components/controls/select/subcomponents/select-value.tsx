import { EtText } from '../../../../foundations/text/et-text';
import { EtSelectValueProps } from '../api/types';
import { useSelectContext } from '../context/select-context';

/**
 * EtSelect.Value - Value text subcomponent.
 * Typography adapts based on variant from context:
 * - 'text' variant: heading-large (22px, semibold)
 * - 'field' variant: heading-compact (18px, medium)
 */
const valueStyle = { flexShrink: 1 };

export function SelectValue({ children, style, testID }: EtSelectValueProps) {
  const { state, meta } = useSelectContext();
  const textVariant = state.type === 'text' ? 'heading-large' : 'heading-compact';

  return (
    <EtText variant={textVariant} numberOfLines={1} style={[valueStyle, { color: meta.textColor }, style]} testID={testID}>
      {children}
    </EtText>
  );
}

SelectValue.displayName = 'EtSelect.Value';
