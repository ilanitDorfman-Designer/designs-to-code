import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

/**
 * Shared base props that every form field wrapper accepts.
 * Generic over the form's field values for type-safe name inference.
 *
 * @typeParam TFieldValues - The form's values shape (from useForm).
 * @typeParam TName - The field path (supports nested paths like "address.city").
 */
export type EtFormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = Pick<
  UseControllerProps<TFieldValues, TName>,
  'name' | 'control' | 'rules'
>;

/**
 * Represents a single field's validation error within an EtFormErrorMessage group.
 * Used when aggregating errors from multiple fields into a shared display.
 */
export interface FieldErrorEntry {
  /** Field name (or dotted path) that produced the error. */
  name: string;
  /** Human-readable validation message. */
  message: string | undefined;
  /** RHF error type (e.g. "required", "validate"). */
  type: string;
}
