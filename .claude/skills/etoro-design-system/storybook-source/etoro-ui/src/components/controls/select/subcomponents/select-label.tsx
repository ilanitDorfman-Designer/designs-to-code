import { EtText } from '../../../../foundations/text/et-text';
import { EtSelectLabelProps } from '../api/types';
import { useSelectContext } from '../context/select-context';

/**
 * EtSelect.Label - Label subcomponent for the field variant's filled state.
 * Renders with body-secondary-medium typography and label color from context.
 */
export function SelectLabel({ children, style }: EtSelectLabelProps) {
  const { meta } = useSelectContext();

  return (
    <EtText variant="body-secondary-medium" style={[{ color: meta.labelColor }, style]}>
      {children}
    </EtText>
  );
}

SelectLabel.displayName = 'EtSelect.Label';
