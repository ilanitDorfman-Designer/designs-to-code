import type { RegisterOptions } from 'react-hook-form';

import type {
  CustomValidation,
  MaxLengthValidation,
  MinLengthValidation,
  PatternValidation,
  Question,
  QuestionValidation,
  QuestionValidatorRegistry,
} from '../interfaces';

/**
 * Maps an array of QuestionValidation rules to a React Hook Form `rules` object.
 *
 * Iterates through each validation, and based on its shape:
 * - required: true -> { required: { value: true, message: errorMessage } }
 * - minlength: N -> { minLength: { value: N, message: errorMessage } }
 * - maxlength: N -> { maxLength: { value: N, message: errorMessage } }
 * - pattern: "regex" -> { pattern: { value: new RegExp(regex), message: errorMessage } }
 * - custom: [...] -> { validate: { [name]: (value) => resolveText(validator i18n key) or true } }
 *
 * @param validations - Config-driven validation rules
 * @param question - The question config (needed for custom validators)
 * @param validatorRegistry - Optional registry for custom validator lookup
 * @returns RHF RegisterOptions with mapped validation rules
 */
export function mapValidationsToRhfRules(
  validations: QuestionValidation[],
  question: Question,
  validatorRegistry?: QuestionValidatorRegistry,
  resolveText?: (text: string | undefined) => string,
): RegisterOptions {
  const rules: RegisterOptions = {};
  const resolve = resolveText ?? ((t: string | undefined) => t ?? '');

  for (const validation of validations) {
    const errorMessage = resolve(validation.errorMessage) || 'Validation failed';

    if ('required' in validation && validation.required === true) {
      rules.required = { value: true, message: errorMessage };
    } else if ('minlength' in validation) {
      const v = validation as MinLengthValidation;
      rules.minLength = { value: v.minlength, message: errorMessage };
    } else if ('maxlength' in validation) {
      const v = validation as MaxLengthValidation;
      rules.maxLength = { value: v.maxlength, message: errorMessage };
    } else if ('pattern' in validation) {
      const v = validation as PatternValidation;
      rules.pattern = { value: new RegExp(v.pattern), message: errorMessage };
    } else if ('custom' in validation) {
      const v = validation as CustomValidation;
      if (!rules.validate) {
        rules.validate = {};
      }
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      for (const customItem of v.custom) {
        const validatorFn = validatorRegistry?.get(customItem.name);
        const msg = resolve(customItem.errorMessage) || 'Validation failed';
        validateObj[customItem.name] = (value: unknown) => {
          if (!validatorFn) {
            return msg;
          }
          const result = validatorFn(value, question);
          if (result == null || result === '') {
            return true;
          }
          if (typeof result === 'string') {
            return resolve(result) || result;
          }
          return result ?? true;
        };
      }
    }
  }

  return rules;
}
