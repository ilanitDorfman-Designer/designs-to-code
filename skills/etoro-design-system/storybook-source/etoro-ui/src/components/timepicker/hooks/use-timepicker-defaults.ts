export interface UseTimepickerDefaultsProps {
  haptics?: boolean;
  disabled?: boolean;
}

/**
 * Normalizes timepicker props with sensible defaults.
 * Extracted for reuse across hooks that need consistent defaults.
 */
export function useTimepickerDefaults(props?: UseTimepickerDefaultsProps) {
  return {
    haptics: props?.haptics ?? true,
    disabled: props?.disabled ?? false,
  };
}
