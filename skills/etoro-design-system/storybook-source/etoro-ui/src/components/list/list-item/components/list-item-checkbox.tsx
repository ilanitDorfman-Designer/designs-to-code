import { EtCheckbox } from '../../../controls/checkbox/et-checkbox';

interface ListItemCheckboxProps {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function ListItemCheckbox({ checked, onPress, disabled = false }: ListItemCheckboxProps) {
  return <EtCheckbox value={checked} onChange={onPress} disabled={disabled} variant="add" />;
}
