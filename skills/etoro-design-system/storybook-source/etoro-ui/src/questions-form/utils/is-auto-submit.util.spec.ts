import type { Question, QuestionsFormValues } from '../interfaces';
import { isAutoSubmit, isAutoSubmitIdleEmpty } from './is-auto-submit.util';

describe('isAutoSubmitIdleEmpty', () => {
  describe('GIVEN a select with check option and empty values', () => {
    describe('WHEN checking idle empty', () => {
      it('THEN should return true', () => {
        const question: Question = {
          id: 'q1',
          type: 'select',
          text: 'Pick',
          optionsDefaultStyle: 'check',
          options: [{ value: 'a', text: 'A' }],
          validations: [],
        };
        expect(isAutoSubmitIdleEmpty(question, {})).toBe(true);
      });
    });
  });

  describe('GIVEN a select without check options', () => {
    describe('WHEN values are empty', () => {
      it('THEN should return false', () => {
        const question: Question = {
          id: 'q1',
          type: 'select',
          text: 'Pick',
          isMultipleSelection: true,
          optionsDefaultStyle: 'checkRound',
          options: [{ value: 'a', text: 'A' }],
          validations: [],
        };
        expect(isAutoSubmitIdleEmpty(question, {})).toBe(false);
      });
    });
  });

  describe('GIVEN a select with a selection', () => {
    describe('WHEN checking idle empty', () => {
      it('THEN should return false', () => {
        const question: Question = {
          id: 'q1',
          type: 'select',
          text: 'Pick',
          optionsDefaultStyle: 'check',
          options: [{ value: 'a', text: 'A' }],
          validations: [],
        };
        expect(isAutoSubmitIdleEmpty(question, { q1: 'a' })).toBe(false);
      });
    });
  });
});

describe('isAutoSubmit', () => {
  describe('GIVEN a non-select question', () => {
    describe('WHEN checking auto-submit', () => {
      it('THEN should return false', () => {
        const question: Question = {
          id: 'q1',
          type: 'input',
          text: 'Enter your name',
          inputType: 'text',
          placeholderText: 'Name',
          validations: [],
        };
        const values: QuestionsFormValues = {};

        const result = isAutoSubmit(question, values, true, true);

        expect(result).toBe(false);
      });
    });
  });

  describe('GIVEN a select question with pre-filled value', () => {
    describe('WHEN checking auto-submit', () => {
      it('THEN should return false', () => {
        const question: Question = {
          id: 'q1',
          type: 'select',
          text: 'Select option',
          value: 'preselected',
          optionsDefaultStyle: 'check',
          options: [
            { value: 'opt1', text: 'Option 1' },
            { value: 'opt2', text: 'Option 2' },
          ],
          validations: [],
        };
        const values: QuestionsFormValues = { q1: 'opt1' };

        const result = isAutoSubmit(question, values, true, true);

        expect(result).toBe(false);
      });
    });
  });

  describe('GIVEN a multi-select question with checkRound default style', () => {
    const baseQuestion: Question = {
      id: 'q1',
      type: 'select',
      text: 'What is your trading knowledge?',
      isMultipleSelection: true,
      optionsDefaultStyle: 'checkRound',
      options: [
        { value: 'cert', text: 'Professional certificate' },
        { value: 'degree', text: 'University degree' },
        { value: 'courses', text: 'Trading courses' },
        { value: 'none', text: 'None of these apply', optionDefaultStyle: 'check' },
      ],
      validations: [],
    };

    describe('WHEN nothing is selected (initial state)', () => {
      it('THEN should return false (empty never triggers submit)', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmit(baseQuestion, values, false, false)).toBe(false);
        expect(isAutoSubmit(baseQuestion, values, true, false)).toBe(false);
        expect(isAutoSubmit(baseQuestion, values, true, true)).toBe(false);
      });

      it('THEN isAutoSubmitIdleEmpty should be true (footer may stay hidden)', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmitIdleEmpty(baseQuestion, values)).toBe(true);
      });
    });

    describe('WHEN a checkRound option is selected', () => {
      it('THEN should return false (CTA visible)', () => {
        const values: QuestionsFormValues = { q1: ['cert'] };

        const result = isAutoSubmit(baseQuestion, values, true, true);

        expect(result).toBe(false);
      });
    });

    describe('WHEN multiple checkRound options are selected', () => {
      it('THEN should return false (CTA visible)', () => {
        const values: QuestionsFormValues = { q1: ['cert', 'degree', 'courses'] };

        const result = isAutoSubmit(baseQuestion, values, true, true);

        expect(result).toBe(false);
      });
    });

    describe('WHEN all options are unselected after being selected', () => {
      it('THEN should return false (no submit after clearing checkRound)', () => {
        const values: QuestionsFormValues = { q1: [] };

        const result = isAutoSubmit(baseQuestion, values, true, true);

        expect(result).toBe(false);
      });

      it('THEN isAutoSubmitIdleEmpty should still be true', () => {
        const values: QuestionsFormValues = { q1: [] };

        expect(isAutoSubmitIdleEmpty(baseQuestion, values)).toBe(true);
      });
    });

    describe('WHEN the check option is selected', () => {
      it('THEN should return true when form is valid and dirty', () => {
        const values: QuestionsFormValues = { q1: ['none'] };

        const result = isAutoSubmit(baseQuestion, values, true, true);

        expect(result).toBe(true);
      });

      it('THEN should return false when form is not valid', () => {
        const values: QuestionsFormValues = { q1: ['none'] };

        const result = isAutoSubmit(baseQuestion, values, false, true);

        expect(result).toBe(false);
      });

      it('THEN should return false when form is not dirty', () => {
        const values: QuestionsFormValues = { q1: ['none'] };

        const result = isAutoSubmit(baseQuestion, values, true, false);

        expect(result).toBe(false);
      });
    });

    describe('WHEN both checkRound and check options are selected', () => {
      it('THEN should return true (auto-submit because check is selected)', () => {
        const values: QuestionsFormValues = { q1: ['cert', 'none'] };

        const result = isAutoSubmit(baseQuestion, values, true, true);

        expect(result).toBe(true);
      });
    });
  });

  describe('GIVEN a single-select question with check style', () => {
    const singleSelectQuestion: Question = {
      id: 'q1',
      type: 'select',
      text: 'What is your trading strategy?',
      optionsDefaultStyle: 'check',
      disableUnselect: true,
      options: [
        { value: 'day', text: 'Day trader' },
        { value: 'position', text: 'Position trader' },
        { value: 'long', text: 'Long-term investor' },
      ],
      validations: [],
    };

    describe('WHEN nothing is selected (initial state)', () => {
      it('THEN should return false for any dirty flags', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmit(singleSelectQuestion, values, true, false)).toBe(false);
        expect(isAutoSubmit(singleSelectQuestion, values, true, true)).toBe(false);
      });

      it('THEN isAutoSubmitIdleEmpty should be true', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmitIdleEmpty(singleSelectQuestion, values)).toBe(true);
      });
    });

    describe('WHEN an option is selected', () => {
      it('THEN should return true because question-level check style enables auto-submit', () => {
        const values: QuestionsFormValues = { q1: 'day' };

        const result = isAutoSubmit(singleSelectQuestion, values, true, true);

        expect(result).toBe(true);
      });

      it('THEN should return false when form is not valid or dirty', () => {
        const values: QuestionsFormValues = { q1: 'day' };

        expect(isAutoSubmit(singleSelectQuestion, values, false, true)).toBe(false);
        expect(isAutoSubmit(singleSelectQuestion, values, true, false)).toBe(false);
      });
    });
  });

  describe('GIVEN a multi-select question without any check options', () => {
    const noCheckQuestion: Question = {
      id: 'q1',
      type: 'select',
      text: 'Select your preferences',
      isMultipleSelection: true,
      optionsDefaultStyle: 'checkRound',
      options: [
        { value: 'opt1', text: 'Option 1' },
        { value: 'opt2', text: 'Option 2' },
        { value: 'opt3', text: 'Option 3' },
      ],
      validations: [],
    };

    describe('WHEN nothing is selected', () => {
      it('THEN should return false (CTA visible)', () => {
        const values: QuestionsFormValues = {};

        const result = isAutoSubmit(noCheckQuestion, values, true, true);

        expect(result).toBe(false);
      });
    });

    describe('WHEN options are selected', () => {
      it('THEN should return false (CTA visible)', () => {
        const values: QuestionsFormValues = { q1: ['opt1', 'opt2'] };

        const result = isAutoSubmit(noCheckQuestion, values, true, true);

        expect(result).toBe(false);
      });
    });
  });

  describe('GIVEN a single-select question with mixed option styles', () => {
    const mixedStyleQuestion: Question = {
      id: 'q1',
      type: 'select',
      text: 'Select one',
      optionsDefaultStyle: 'checkRound',
      options: [
        { value: 'opt1', text: 'Option 1' },
        { value: 'opt2', text: 'Option 2' },
        { value: 'none', text: 'None', optionDefaultStyle: 'check' },
      ],
      validations: [],
    };

    describe('WHEN nothing is selected', () => {
      it('THEN should return false for any dirty flags', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmit(mixedStyleQuestion, values, true, false)).toBe(false);
        expect(isAutoSubmit(mixedStyleQuestion, values, true, true)).toBe(false);
      });

      it('THEN isAutoSubmitIdleEmpty should be true', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmitIdleEmpty(mixedStyleQuestion, values)).toBe(true);
      });
    });

    describe('WHEN a checkRound option is selected', () => {
      it('THEN should return false (no auto-submit)', () => {
        const values: QuestionsFormValues = { q1: 'opt1' };

        const result = isAutoSubmit(mixedStyleQuestion, values, true, true);

        expect(result).toBe(false);
      });
    });

    describe('WHEN the check option is selected', () => {
      it('THEN should return true (auto-submit)', () => {
        const values: QuestionsFormValues = { q1: 'none' };

        const result = isAutoSubmit(mixedStyleQuestion, values, true, true);

        expect(result).toBe(true);
      });
    });
  });

  describe('GIVEN edge cases with value formats', () => {
    const question: Question = {
      id: 'q1',
      type: 'select',
      text: 'Select',
      isMultipleSelection: true,
      optionsDefaultStyle: 'checkRound',
      options: [
        { value: 'opt1', text: 'Option 1' },
        { value: 'none', text: 'None', optionDefaultStyle: 'check' },
      ],
      validations: [],
    };

    describe('WHEN value is missing from values object', () => {
      it('THEN should return false (treated as empty)', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmit(question, values, true, false)).toBe(false);
        expect(isAutoSubmit(question, values, true, true)).toBe(false);
      });

      it('THEN isAutoSubmitIdleEmpty should be true', () => {
        const values: QuestionsFormValues = {};

        expect(isAutoSubmitIdleEmpty(question, values)).toBe(true);
      });
    });

    describe('WHEN value is null', () => {
      it('THEN should return false (treated as empty)', () => {
        const values: QuestionsFormValues = { q1: null };

        expect(isAutoSubmit(question, values, true, false)).toBe(false);
        expect(isAutoSubmit(question, values, true, true)).toBe(false);
      });

      it('THEN isAutoSubmitIdleEmpty should be true', () => {
        const values: QuestionsFormValues = { q1: null };

        expect(isAutoSubmitIdleEmpty(question, values)).toBe(true);
      });
    });

    describe('WHEN value is a single string (not array) for multi-select', () => {
      it('THEN should handle it as single value and check if it is check style', () => {
        const values: QuestionsFormValues = { q1: 'none' };

        const result = isAutoSubmit(question, values, true, true);

        expect(result).toBe(true);
      });
    });

    describe('WHEN value is a single non-check string for multi-select', () => {
      it('THEN should return false', () => {
        const values: QuestionsFormValues = { q1: 'opt1' };

        const result = isAutoSubmit(question, values, true, true);

        expect(result).toBe(false);
      });
    });

    describe('WHEN values are keyed by question text (textAsKeys mode)', () => {
      it('THEN should resolve selection and return true for a selected check option', () => {
        const values: QuestionsFormValues = { Select: 'none' };

        const result = isAutoSubmit(question, values, true, true);

        expect(result).toBe(true);
      });
    });
  });

  describe('GIVEN form state validation', () => {
    const question: Question = {
      id: 'q1',
      type: 'select',
      text: 'Select',
      optionsDefaultStyle: 'check',
      options: [
        { value: 'opt1', text: 'Option 1' },
        { value: 'opt2', text: 'Option 2' },
      ],
      validations: [],
    };

    describe('WHEN form is not valid', () => {
      it('THEN should return false for non-empty selection', () => {
        const values: QuestionsFormValues = { q1: 'opt1' };

        const result = isAutoSubmit(question, values, false, true);

        expect(result).toBe(false);
      });

      it('THEN should return false for empty selection when not dirty', () => {
        const values: QuestionsFormValues = {};

        const result = isAutoSubmit(question, values, false, false);

        expect(result).toBe(false);
      });
    });

    describe('WHEN form is not dirty', () => {
      it('THEN should return false for non-empty selection', () => {
        const values: QuestionsFormValues = { q1: 'opt1' };

        const result = isAutoSubmit(question, values, true, false);

        expect(result).toBe(false);
      });
    });

    describe('WHEN form is valid and dirty', () => {
      it('THEN should return true for check option selected', () => {
        const values: QuestionsFormValues = { q1: 'opt1' };

        const result = isAutoSubmit(question, values, true, true);

        expect(result).toBe(true);
      });
    });
  });
});
