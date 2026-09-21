/**
 * Form UI — RHF-enabled wrappers for core input components.
 *
 * Import from `etoro-ui/form` or `@etoro/etoro-ui/form`.
 *
 * Single-value wrappers: EtFormInput, EtFormRadio, EtFormRadioGroup, EtFormCheckbox, EtFormChip, EtFormToggleSwitch.
 * Multi-select group wrappers: EtFormChipGroup, EtFormToggleSwitchGroup, EtFormSelectionTileGroup.
 * Shared errors: EtFormErrorMessage (requires FormProvider).
 */
// Single-value form field wrappers
// Generic form field
export { FormField, type FormFieldProps } from './form-field';

// Form field wrappers
export { EtFormCheckbox } from './et-form-checkbox';
export { EtFormChip } from './et-form-chip';
export { EtFormInput } from './et-form-input';
export { EtFormRadio } from './et-form-radio';
export { EtFormRadioGroup } from './et-form-radio-group';
export { EtFormToggleSwitch } from './et-form-toggle-switch';

// Multi-select group wrappers (string[] fields)
export { type ChipsGroupItem, EtFormChipGroup, useEtFormChipGroupContext } from './et-form-chip-group';
export { EtFormSelectionTileGroup } from './et-form-selection-tile-group';
export { EtFormToggleSwitchGroup, useEtFormToggleSwitchGroupContext } from './et-form-toggle-switch-group';

// Composable shared error display
export { EtFormErrorMessage } from './et-form-error-message';

// Shared types
export type { EtFormFieldProps, FieldErrorEntry } from './types';

// Re-exported RHF utilities
export type { Control, FieldError, FieldErrors, SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form';
export { Controller, FormProvider, useController, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
