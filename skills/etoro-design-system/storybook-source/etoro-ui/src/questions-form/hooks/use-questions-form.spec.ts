import { act, renderHook } from '@testing-library/react-native';
import { createElement } from 'react';

import { QuestionsFormTextProvider } from '../contexts';
import type { InputQuestion, OptionsQuestion, Question } from '../interfaces';
import { useQuestionsForm } from './use-questions-form';

const createSelectQuestion = (overrides?: Partial<OptionsQuestion>): OptionsQuestion =>
  ({
    id: 'q1',
    type: 'select',
    text: 'Select an option',
    options: [
      { value: 'opt1', text: 'Option 1' },
      { value: 'opt2', text: 'Option 2' },
    ],
    validations: [],
    ...overrides,
  }) as OptionsQuestion;

describe('useQuestionsForm', () => {
  describe('GIVEN a config with one select question', () => {
    it('WHEN hook is called, THEN form is initialized', () => {
      const question = createSelectQuestion();
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [question] },
        }),
      );

      expect(result.current.form).toBeDefined();
      expect(result.current.question).toEqual(question);
      expect(result.current.getValues()).toEqual({ q1: null });
      expect(result.current.getFieldName(question)).toBe('q1');
    });
  });

  describe('GIVEN a config with textAsKeys', () => {
    it('WHEN resolveText is called, THEN getText function is used', () => {
      const getText = jest.fn((key: string) => `Translated: ${key}`);
      const question = createSelectQuestion({ text: 'question.key' });
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: {
            questions: [question],
            textAsKeys: true,
            getText,
          },
        }),
      );

      const resolved = result.current.textResolver.resolveText('question.key');
      expect(getText).toHaveBeenCalledWith('question.key');
      expect(resolved).toBe('Translated: question.key');
    });

    it('WHEN resolveText is called without getText, THEN returns raw text', () => {
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: {
            questions: [createSelectQuestion()],
            textAsKeys: true,
          },
        }),
      );

      expect(result.current.textResolver.resolveText('raw.text')).toBe('raw.text');
    });

    it('WHEN resolveText is called with undefined or empty string, THEN returns empty string', () => {
      const getText = jest.fn((key: string) => `Translated: ${key}`);
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: {
            questions: [createSelectQuestion()],
            textAsKeys: true,
            getText,
          },
        }),
      );

      expect(result.current.textResolver.resolveText(undefined)).toBe('');
      expect(result.current.textResolver.resolveText('')).toBe('');
      expect(getText).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN QuestionsFormTextProvider and config without getText', () => {
    it('WHEN resolveText is called, THEN provider resolveText is used', () => {
      const resolver = { resolveText: jest.fn((t: string | undefined) => `CTX:${t ?? ''}`) };
      const question = createSelectQuestion();
      const { result } = renderHook(() => useQuestionsForm({ config: { questions: [question] } }), {
        wrapper: ({ children }) => createElement(QuestionsFormTextProvider, { resolver }, children),
      });

      expect(result.current.textResolver.resolveText('hello')).toBe('CTX:hello');
      expect(resolver.resolveText).toHaveBeenCalledWith('hello');
    });

    it('WHEN resolveNode is called and provider supplies one, THEN provider resolveNode is used', () => {
      const node = createElement('span');
      const resolver = {
        resolveText: jest.fn((t: string | undefined) => `CTX:${t ?? ''}`),
        resolveNode: jest.fn(() => node),
      };
      const { result } = renderHook(() => useQuestionsForm({ config: { questions: [createSelectQuestion()] } }), {
        wrapper: ({ children }) => createElement(QuestionsFormTextProvider, { resolver }, children),
      });

      expect(result.current.textResolver.resolveNode?.('hello')).toBe(node);
      expect(resolver.resolveNode).toHaveBeenCalledWith('hello');
    });

    it('WHEN resolveNode is called and provider omits one, THEN it falls back to resolveText', () => {
      const resolver = { resolveText: jest.fn((t: string | undefined) => `CTX:${t ?? ''}`) };
      const { result } = renderHook(() => useQuestionsForm({ config: { questions: [createSelectQuestion()] } }), {
        wrapper: ({ children }) => createElement(QuestionsFormTextProvider, { resolver }, children),
      });

      expect(result.current.textResolver.resolveNode?.('hello')).toBe('CTX:hello');
    });

    it('WHEN resolveNode is called with empty/undefined, THEN returns empty string', () => {
      const resolver = { resolveText: jest.fn((t: string | undefined) => `CTX:${t ?? ''}`), resolveNode: jest.fn() };
      const { result } = renderHook(() => useQuestionsForm({ config: { questions: [createSelectQuestion()] } }), {
        wrapper: ({ children }) => createElement(QuestionsFormTextProvider, { resolver }, children),
      });

      expect(result.current.textResolver.resolveNode?.(undefined)).toBe('');
      expect(result.current.textResolver.resolveNode?.('')).toBe('');
      expect(resolver.resolveNode).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN form values change', () => {
    it('WHEN onValuesChange callback is provided, THEN callback fires with diff', () => {
      const onValuesChange = jest.fn();
      const question = createSelectQuestion();
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [question] },
          onValuesChange,
        }),
      );

      act(() => {
        result.current.form.setValue('q1', 'opt1');
      });

      expect(onValuesChange).toHaveBeenCalled();
      const lastCall = onValuesChange.mock.calls[onValuesChange.mock.calls.length - 1][0];
      expect(lastCall).toMatchObject({
        current: expect.objectContaining({ q1: 'opt1' }),
        diff: expect.objectContaining({ q1: 'opt1' }),
      });
    });
  });

  describe('GIVEN select question with innerQuestionsIds', () => {
    const innerQuestion: InputQuestion = {
      id: 'q-inner',
      type: 'input',
      inputType: 'text',
      placeholderText: 'Inner',
      validations: [],
    };

    const selectWithInner: OptionsQuestion = createSelectQuestion({
      options: [
        { value: 'a', text: 'Option A', innerQuestionsIds: ['q-inner'] },
        { value: 'b', text: 'Option B' },
      ],
    });

    const allQuestions: Question[] = [selectWithInner, innerQuestion];

    it('WHEN no option selected, THEN visibleInnerQuestions is empty', () => {
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [selectWithInner], allQuestions },
        }),
      );

      expect(result.current.visibleInnerQuestions).toEqual([]);
    });

    it('WHEN option with innerQuestionsIds selected, THEN visibleInnerQuestions contains inner questions', () => {
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [selectWithInner], allQuestions },
        }),
      );

      act(() => {
        result.current.form.setValue('q1', 'a');
      });

      expect(result.current.visibleInnerQuestions).toHaveLength(1);
      expect(result.current.visibleInnerQuestions[0].id).toBe('q-inner');
    });

    it('WHEN selection changes to option without inner questions, THEN visibleInnerQuestions becomes empty', () => {
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [selectWithInner], allQuestions },
        }),
      );

      act(() => {
        result.current.form.setValue('q1', 'a');
      });
      expect(result.current.visibleInnerQuestions).toHaveLength(1);

      act(() => {
        result.current.form.setValue('q1', 'b');
      });
      expect(result.current.visibleInnerQuestions).toEqual([]);
    });
  });

  describe('GIVEN inner question with isPersistValue: true', () => {
    const innerQuestion: InputQuestion = {
      id: 'q-inner-persist',
      type: 'input',
      inputType: 'text',
      placeholderText: 'Specify',
      isPersistValue: true,
      validations: [],
    };

    const selectWithInner: OptionsQuestion = createSelectQuestion({
      options: [
        { value: 'a', text: 'Option A', innerQuestionsIds: ['q-inner-persist'] },
        { value: 'b', text: 'Option B' },
      ],
    });

    const allQuestions: Question[] = [selectWithInner, innerQuestion];

    it('WHEN inner question is filled, hidden, then shown again, THEN value is restored', () => {
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [selectWithInner], allQuestions },
        }),
      );

      // GIVEN - select option A to show inner question, then type a value
      act(() => {
        result.current.form.setValue('q1', 'a');
      });
      expect(result.current.visibleInnerQuestions).toHaveLength(1);

      act(() => {
        result.current.form.setValue('q-inner-persist', 'user typed value');
      });
      expect(result.current.getValues()['q-inner-persist']).toBe('user typed value');

      // WHEN - switch to option B (hides inner question), then back to A
      act(() => {
        result.current.form.setValue('q1', 'b');
      });
      expect(result.current.visibleInnerQuestions).toEqual([]);

      act(() => {
        result.current.form.setValue('q1', 'a');
      });

      // THEN - inner question value is restored
      expect(result.current.visibleInnerQuestions).toHaveLength(1);
      expect(result.current.getValues()['q-inner-persist']).toBe('user typed value');
    });
  });

  describe('GIVEN outer question in allQuestions with config value and no isPersistValue', () => {
    const outerInput: InputQuestion = {
      id: 'q-outer',
      type: 'input',
      inputType: 'text',
      placeholderText: 'Employer',
      validations: [],
    };

    const selectWithOuter: OptionsQuestion = createSelectQuestion({
      options: [{ value: 'job', text: 'Job', sharedOuterQuestionsIds: ['q-outer'] }],
    });

    it('WHEN hook is called, THEN outer field is seeded from config (e.g. step restore)', () => {
      const allQuestions: Question[] = [selectWithOuter, { ...outerInput, value: 'Restored Inc' }];
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [selectWithOuter], allQuestions },
        }),
      );

      expect(result.current.getValues()).toEqual(expect.objectContaining({ q1: null, 'q-outer': 'Restored Inc' }));
    });
  });

  describe('GIVEN inner question WITHOUT isPersistValue', () => {
    const innerQuestion: InputQuestion = {
      id: 'q-inner-no-persist',
      type: 'input',
      inputType: 'text',
      placeholderText: 'Specify',
      validations: [],
    };

    const selectWithInner: OptionsQuestion = createSelectQuestion({
      options: [
        { value: 'a', text: 'Option A', innerQuestionsIds: ['q-inner-no-persist'] },
        { value: 'b', text: 'Option B' },
      ],
    });

    const allQuestions: Question[] = [selectWithInner, innerQuestion];

    it('WHEN inner question is filled, hidden, then shown again, THEN value is reset to default', () => {
      const { result } = renderHook(() =>
        useQuestionsForm({
          config: { questions: [selectWithInner], allQuestions },
        }),
      );

      // GIVEN - select option A, type a value
      act(() => {
        result.current.form.setValue('q1', 'a');
      });
      act(() => {
        result.current.form.setValue('q-inner-no-persist', 'user typed value');
      });

      // WHEN - hide and show again
      act(() => {
        result.current.form.setValue('q1', 'b');
      });
      act(() => {
        result.current.form.setValue('q1', 'a');
      });

      // THEN - value is reset to default (empty string for input)
      expect(result.current.getValues()['q-inner-no-persist']).toBe('');
    });
  });
});
