import type { Question, QuestionValidatorRegistry } from '../interfaces';
import { mapValidationsToRhfRules } from './validation-mapper.util';

const createQuestion = (validations: Question['validations']): Question => ({
  id: 'q1',
  type: 'input',
  inputType: 'text',
  placeholderText: 'Enter',
  validations,
});

describe('mapValidationsToRhfRules', () => {
  describe('required validation', () => {
    it('GIVEN a required validation WHEN mapped THEN RHF rules have required: { value: true, message }', () => {
      // GIVEN
      const validations = [{ required: true, errorMessage: 'This field is required' }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.required).toEqual({ value: true, message: 'This field is required' });
    });

    it('GIVEN a required validation without errorMessage WHEN mapped THEN uses default message', () => {
      // GIVEN
      const validations = [{ required: true }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.required).toEqual({ value: true, message: 'Validation failed' });
    });
  });

  describe('minlength validation', () => {
    it('GIVEN a minlength validation with value 3 WHEN mapped THEN RHF rules have minLength: { value: 3, message }', () => {
      // GIVEN
      const validations = [{ minlength: 3, errorMessage: 'Min 3 characters' }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.minLength).toEqual({ value: 3, message: 'Min 3 characters' });
    });
  });

  describe('maxlength validation', () => {
    it('GIVEN a maxlength validation with value 100 WHEN mapped THEN RHF rules have maxLength: { value: 100, message }', () => {
      // GIVEN
      const validations = [{ maxlength: 100, errorMessage: 'Max 100 characters' }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.maxLength).toEqual({ value: 100, message: 'Max 100 characters' });
    });
  });

  describe('pattern validation', () => {
    it('GIVEN a pattern validation WHEN mapped THEN RHF rules have pattern: { value: RegExp, message }', () => {
      // GIVEN
      const validations = [{ pattern: '^[a-z]+$', errorMessage: 'Lowercase only' }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.pattern).toBeDefined();
      expect(rules.pattern?.value).toBeInstanceOf(RegExp);
      expect((rules.pattern?.value as RegExp).source).toBe('^[a-z]+$');
      expect(rules.pattern?.message).toBe('Lowercase only');
    });
  });

  describe('custom validation', () => {
    it('GIVEN a custom validation with validatorRegistry WHEN mapped THEN RHF rules have validate with function', () => {
      // GIVEN
      const validatorFn = jest.fn().mockReturnValue(null);
      const validatorRegistry: QuestionValidatorRegistry = {
        get: (name) => (name === 'email' ? validatorFn : undefined),
      };
      const validations = [
        {
          custom: [{ name: 'email', errorMessage: 'Invalid email' }],
        },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, validatorRegistry);

      // THEN
      expect(rules.validate).toBeDefined();
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      expect(typeof validateObj.email).toBe('function');

      const result = validateObj.email('test@example.com');
      expect(validatorFn).toHaveBeenCalledWith('test@example.com', question);
      expect(result).toBe(true);
    });

    it('GIVEN a custom validation with validator returning undefined WHEN mapped THEN validate returns true', () => {
      // GIVEN - validator returns undefined (success)
      const validatorFn = jest.fn().mockReturnValue(undefined);
      const validatorRegistry: QuestionValidatorRegistry = {
        get: (name) => (name === 'email' ? validatorFn : undefined),
      };
      const validations = [
        {
          custom: [{ name: 'email', errorMessage: 'Invalid email' }],
        },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, validatorRegistry);
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      const result = validateObj.email('test@example.com');

      // THEN
      expect(result).toBe(true);
    });

    it('GIVEN a custom validation with validatorRegistry returning error WHEN mapped THEN validate returns error message', () => {
      // GIVEN
      const validatorFn = jest.fn().mockReturnValue('Invalid format');
      const validatorRegistry: QuestionValidatorRegistry = {
        get: (name) => (name === 'email' ? validatorFn : undefined),
      };
      const validations = [
        {
          custom: [{ name: 'email', errorMessage: 'Invalid email' }],
        },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, validatorRegistry);
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      const result = validateObj.email('bad');

      // THEN
      expect(result).toBe('Invalid format');
    });

    it('GIVEN a custom validation without validatorRegistry WHEN mapped THEN validate function returns error message', () => {
      // GIVEN
      const validations = [
        {
          custom: [{ name: 'unknownValidator', errorMessage: 'Custom error' }],
        },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.validate).toBeDefined();
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      const result = validateObj.unknownValidator('value');

      expect(result).toBe('Custom error');
    });

    it('GIVEN multiple custom validations in array WHEN mapped THEN reuses existing validate object', () => {
      // GIVEN - two CustomValidation entries; second reuses rules.validate
      const validator1 = jest.fn().mockReturnValue(null);
      const validator2 = jest.fn().mockReturnValue(null);
      const validatorRegistry: QuestionValidatorRegistry = {
        get: (name) => (name === 'email' ? validator1 : name === 'unique' ? validator2 : undefined),
      };
      const validations = [
        { custom: [{ name: 'email', errorMessage: 'Invalid email' }] },
        { custom: [{ name: 'unique', errorMessage: 'Already exists' }] },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, validatorRegistry);

      // THEN - both validators present, validate object created once and reused
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      expect(Object.keys(validateObj)).toEqual(['email', 'unique']);
    });

    it('GIVEN a custom validation with multiple validators WHEN mapped THEN all validators are in validate object', () => {
      // GIVEN
      const validator1 = jest.fn().mockReturnValue(null);
      const validator2 = jest.fn().mockReturnValue(null);
      const validatorRegistry: QuestionValidatorRegistry = {
        get: (name) => (name === 'email' ? validator1 : name === 'unique' ? validator2 : undefined),
      };
      const validations = [
        {
          custom: [
            { name: 'email', errorMessage: 'Invalid email' },
            { name: 'unique', errorMessage: 'Already exists' },
          ],
        },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, validatorRegistry);

      // THEN
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      expect(Object.keys(validateObj)).toEqual(['email', 'unique']);

      validateObj.email('test@example.com');
      expect(validator1).toHaveBeenCalled();

      validateObj.unique('value');
      expect(validator2).toHaveBeenCalled();
    });
  });

  describe('multiple validations', () => {
    it('GIVEN multiple validations WHEN mapped THEN all rules are combined', () => {
      // GIVEN
      const validations = [
        { required: true, errorMessage: 'Required' },
        { minlength: 3, errorMessage: 'Min 3' },
        { maxlength: 100, errorMessage: 'Max 100' },
        { pattern: '\\d+', errorMessage: 'Digits only' },
      ];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules.required).toEqual({ value: true, message: 'Required' });
      expect(rules.minLength).toEqual({ value: 3, message: 'Min 3' });
      expect(rules.maxLength).toEqual({ value: 100, message: 'Max 100' });
      expect(rules.pattern).toBeDefined();
      expect((rules.pattern?.value as RegExp).source).toBe('\\d+');
    });
  });

  describe('resolveText integration', () => {
    it('GIVEN a resolveText function WHEN mapped THEN error messages are resolved', () => {
      // GIVEN
      const resolveText = (text: string | undefined) => (text === 'error.required' ? 'This field is required' : (text ?? ''));
      const validations = [{ required: true, errorMessage: 'error.required' }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, undefined, resolveText);

      // THEN
      expect(rules.required).toEqual({ value: true, message: 'This field is required' });
    });

    it('GIVEN a resolveText function WHEN custom validation mapped THEN custom error messages are resolved', () => {
      // GIVEN
      const resolveText = (text: string | undefined) => (text === 'error.custom' ? 'Resolved custom error' : (text ?? ''));
      const validations = [{ custom: [{ name: 'myValidator', errorMessage: 'error.custom' }] }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, undefined, resolveText);

      // THEN
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      const result = validateObj.myValidator('value');
      expect(result).toBe('Resolved custom error');
    });

    it('GIVEN resolveText WHEN validator returns i18n key THEN validate returns resolved message', () => {
      // GIVEN
      const validatorFn = jest.fn().mockReturnValue('error.conflict');
      const resolveText = (text: string | undefined) => (text === 'error.conflict' ? 'Human readable conflict' : (text ?? ''));
      const validatorRegistry: QuestionValidatorRegistry = {
        get: (name) => (name === 'occupation' ? validatorFn : undefined),
      };
      const validations = [{ custom: [{ name: 'occupation', errorMessage: 'fallback' }] }];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question, validatorRegistry, resolveText);
      const validateObj = rules.validate as Record<string, (value: unknown) => string | boolean>;
      const result = validateObj.occupation('78');

      // THEN
      expect(result).toBe('Human readable conflict');
    });
  });

  describe('empty validations', () => {
    it('GIVEN empty validations array WHEN mapped THEN empty rules object returned', () => {
      // GIVEN
      const validations: Question['validations'] = [];
      const question = createQuestion(validations);

      // WHEN
      const rules = mapValidationsToRhfRules(validations, question);

      // THEN
      expect(rules).toEqual({});
    });
  });
});
