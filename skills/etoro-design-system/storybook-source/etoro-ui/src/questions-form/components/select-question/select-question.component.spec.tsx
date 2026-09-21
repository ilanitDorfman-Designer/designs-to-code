import './select-question-group.spec.mocks';

import { act, fireEvent, render } from '@testing-library/react-native';
import { useEffect } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import { QuestionRendererProvider } from '../../contexts';
import type { OptionsQuestion, Question, QuestionsFormValues } from '../../interfaces';
import { QuestionRenderer } from '../question-renderer';
import { SelectQuestion } from './select-question.component';
import { getFieldName, getFieldRules } from './select-question-group.spec.utils';

function createSingleSelectQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
  return {
    id: 'q1',
    type: 'select',
    validations: [],
    options: [
      { value: 'a', text: 'Option A' },
      { value: 'b', text: 'Option B' },
      { value: 'c', text: 'Option C' },
    ],
    ...overrides,
  };
}

function SelectQuestionWrapper({
  question,
  allQuestions,
  defaultValues = {},
  onFormReady,
}: {
  question: OptionsQuestion;
  allQuestions?: Question[];
  defaultValues?: QuestionsFormValues;
  onFormReady?: (form: UseFormReturn<QuestionsFormValues>) => void;
}) {
  const form = useForm<QuestionsFormValues>({ defaultValues });
  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  return (
    <QuestionRendererProvider renderer={QuestionRenderer}>
      <FormProvider {...form}>
        <SelectQuestion
          question={question}
          control={form.control}
          allQuestions={allQuestions}
          getFieldName={getFieldName}
          getFieldRules={getFieldRules}
        />
      </FormProvider>
    </QuestionRendererProvider>
  );
}

describe('SelectQuestion', () => {
  describe('GIVEN single-select question', () => {
    it('WHEN rendered, THEN shows all options', () => {
      const question = createSingleSelectQuestion();
      const { getByText } = render(<SelectQuestionWrapper question={question} defaultValues={{ q1: null }} />);
      expect(getByText('Option A')).toBeTruthy();
      expect(getByText('Option B')).toBeTruthy();
      expect(getByText('Option C')).toBeTruthy();
    });
  });

  describe('GIVEN single-select', () => {
    it('WHEN option pressed, THEN form value changes to option.value', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createSingleSelectQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Option A'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toBe('a');
    });
  });

  describe('GIVEN single-select with selected value (check style via EtSelectionTileGroup)', () => {
    it('WHEN same option pressed, THEN value does NOT change (icon variant disallows deselect)', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createSingleSelectQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: 'a' }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Option A'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toBe('a');
    });
  });

  describe('GIVEN disableUnselect', () => {
    it('WHEN selected option pressed, THEN value does NOT change', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createSingleSelectQuestion({ disableUnselect: true });
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: 'a' }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Option A'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toBe('a');
    });
  });

  describe('GIVEN required validation', () => {
    it('WHEN no selection, THEN form is invalid', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createSingleSelectQuestion({
        validations: [{ required: true, errorMessage: 'Required' }],
      });
      render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      expect((form as UseFormReturn<QuestionsFormValues>).formState.isValid).toBe(false);
    });
  });

  describe('GIVEN inner questions (innerQuestionsIds)', () => {
    const innerInputQuestion: Question = {
      id: 'q-extra-1',
      type: 'input',
      inputType: 'text',
      placeholderText: 'Extra details',
      validations: [],
    };

    const questionWithInner = createSingleSelectQuestion({
      options: [
        { value: 'a', text: 'Option A', innerQuestionsIds: ['q-extra-1'] },
        { value: 'b', text: 'Option B' },
        { value: 'c', text: 'Option C' },
      ],
    });

    const allQuestions: Question[] = [questionWithInner, innerInputQuestion];

    it('WHEN option with innerQuestionsIds selected, THEN inner questions appear', () => {
      const { getByText, getByPlaceholderText } = render(
        <SelectQuestionWrapper question={questionWithInner} allQuestions={allQuestions} defaultValues={{ q1: null }} />,
      );

      expect(() => getByPlaceholderText('Extra details')).toThrow();

      fireEvent.press(getByText('Option A'));

      expect(getByPlaceholderText('Extra details')).toBeTruthy();
    });

    it('WHEN selection changes, THEN old inner questions disappear and new ones appear', () => {
      const innerForB: Question = {
        id: 'q-extra-b',
        type: 'input',
        inputType: 'text',
        placeholderText: 'Option B details',
        validations: [],
      };

      const questionWithTwoInner = createSingleSelectQuestion({
        options: [
          { value: 'a', text: 'Option A', innerQuestionsIds: ['q-extra-1'] },
          { value: 'b', text: 'Option B', innerQuestionsIds: ['q-extra-b'] },
          { value: 'c', text: 'Option C' },
        ],
      });

      const allQuestionsWithB: Question[] = [questionWithTwoInner, innerInputQuestion, innerForB];

      const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
        <SelectQuestionWrapper question={questionWithTwoInner} allQuestions={allQuestionsWithB} defaultValues={{ q1: null }} />,
      );

      fireEvent.press(getByText('Option A'));
      expect(getByPlaceholderText('Extra details')).toBeTruthy();
      expect(queryByPlaceholderText('Option B details')).toBeNull();

      fireEvent.press(getByText('Option B'));
      expect(queryByPlaceholderText('Extra details')).toBeNull();
      expect(getByPlaceholderText('Option B details')).toBeTruthy();
    });

    it('WHEN inner question filled, THEN value is included in form', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const { getByText, getByTestId } = render(
        <SelectQuestionWrapper
          question={questionWithInner}
          allQuestions={allQuestions}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );

      fireEvent.press(getByText('Option A'));
      const input = getByTestId('input-question-q-extra-1');
      fireEvent.changeText(input, 'My extra answer');

      expect((form as UseFormReturn<QuestionsFormValues>).getValues()).toMatchObject({
        q1: 'a',
        'q-extra-1': 'My extra answer',
      });
    });

    it('WHEN inner question is required, THEN form validity blocks submit', () => {
      const requiredInner: Question = {
        id: 'q-required-inner',
        type: 'input',
        inputType: 'text',
        placeholderText: 'Required field',
        validations: [{ required: true, errorMessage: 'Required' }],
      };

      const questionWithRequiredInner = createSingleSelectQuestion({
        options: [
          { value: 'a', text: 'Option A', innerQuestionsIds: ['q-required-inner'] },
          { value: 'b', text: 'Option B' },
        ],
      });

      const allQuestionsRequired: Question[] = [questionWithRequiredInner, requiredInner];

      let form!: UseFormReturn<QuestionsFormValues>;
      render(
        <SelectQuestionWrapper
          question={questionWithRequiredInner}
          allQuestions={allQuestionsRequired}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );

      act(() => {
        (form as UseFormReturn<QuestionsFormValues>).setValue('q1', 'a');
      });

      expect((form as UseFormReturn<QuestionsFormValues>).formState.isValid).toBe(false);
    });
  });

  describe('GIVEN chip style (uses EtFormChipGroup)', () => {
    function createChipQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
      return {
        id: 'q1',
        type: 'select',
        optionsDefaultStyle: 'chip',
        isMultipleSelection: true,
        validations: [],
        options: [
          { value: 'stocks', text: 'Stocks' },
          { value: 'crypto', text: 'Crypto' },
          { value: 'forex', text: 'Forex' },
        ],
        ...overrides,
      };
    }

    it('WHEN rendered, THEN shows all chip options', () => {
      const question = createChipQuestion();
      const { getByText } = render(<SelectQuestionWrapper question={question} defaultValues={{ q1: null }} />);
      expect(getByText('Stocks')).toBeTruthy();
      expect(getByText('Crypto')).toBeTruthy();
      expect(getByText('Forex')).toBeTruthy();
    });

    it('WHEN chip pressed, THEN value is added to array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createChipQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Stocks'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['stocks']);
    });

    it('WHEN multiple chips pressed, THEN all values are in array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createChipQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Stocks'));
      fireEvent.press(getByText('Crypto'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['stocks', 'crypto']);
    });

    it('WHEN selected chip pressed again, THEN value is removed from array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createChipQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: ['stocks', 'crypto'] }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Stocks'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['crypto']);
    });
  });

  describe('GIVEN checkRound style multi-select (uses EtFormToggleSwitchGroup)', () => {
    function createCheckRoundQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
      return {
        id: 'q1',
        type: 'select',
        optionsDefaultStyle: 'checkRound',
        isMultipleSelection: true,
        validations: [],
        options: [
          { value: 'opt1', text: 'Toggle A' },
          { value: 'opt2', text: 'Toggle B' },
          { value: 'opt3', text: 'Toggle C' },
        ],
        ...overrides,
      };
    }

    it('WHEN rendered, THEN shows all toggle options', () => {
      const question = createCheckRoundQuestion();
      const { getByText } = render(<SelectQuestionWrapper question={question} defaultValues={{ q1: null }} />);
      expect(getByText('Toggle A')).toBeTruthy();
      expect(getByText('Toggle B')).toBeTruthy();
      expect(getByText('Toggle C')).toBeTruthy();
    });

    it('WHEN toggle pressed, THEN value is added to array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createCheckRoundQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Toggle A'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['opt1']);
    });

    it('WHEN unselectAll option pressed, THEN only that value remains', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createCheckRoundQuestion({
        options: [
          { value: 'opt1', text: 'Toggle A' },
          { value: 'opt2', text: 'Toggle B' },
          { value: 'none', text: 'None', optionDefaultStyle: 'check', behavior: 'unselectAll' },
        ],
      });
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: ['opt1', 'opt2'] }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('None'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['none']);
    });

    it('WHEN normal option pressed while unselectAll is active, THEN unselectAll is removed', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createCheckRoundQuestion({
        options: [
          { value: 'opt1', text: 'Toggle A' },
          { value: 'opt2', text: 'Toggle B' },
          { value: 'none', text: 'None', optionDefaultStyle: 'check', behavior: 'unselectAll' },
        ],
      });
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: ['none'] }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Toggle A'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['opt1']);
    });
  });

  describe('GIVEN single-select checkBox style (tile + radio, same layout as check)', () => {
    function createCheckBoxQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
      return {
        id: 'q1',
        type: 'select',
        optionsDefaultStyle: 'checkBox',
        disableUnselect: true,
        validations: [],
        options: [
          { value: 'conservative', text: 'Very conservative' },
          { value: 'moderate', text: 'Moderate' },
          { value: 'aggressive', text: 'Aggressive' },
        ],
        ...overrides,
      };
    }

    it('WHEN rendered, THEN shows all options as radio group options', () => {
      const question = createCheckBoxQuestion();
      const { getByText } = render(<SelectQuestionWrapper question={question} defaultValues={{ q1: null }} />);
      expect(getByText('Very conservative')).toBeTruthy();
      expect(getByText('Moderate')).toBeTruthy();
      expect(getByText('Aggressive')).toBeTruthy();
    });

    it('WHEN option pressed, THEN form value updates', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createCheckBoxQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Moderate'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toBe('moderate');
    });

    it('WHEN option with innerQuestionsIds selected, THEN inner questions appear', () => {
      const innerQuestion: Question = {
        id: 'q-inner',
        type: 'input',
        inputType: 'text',
        placeholderText: 'Extra details',
        validations: [],
      };

      const question = createCheckBoxQuestion({
        options: [
          { value: 'conservative', text: 'Very conservative', innerQuestionsIds: ['q-inner'] },
          { value: 'moderate', text: 'Moderate' },
        ],
      });

      const allQuestions: Question[] = [question, innerQuestion];

      const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
        <SelectQuestionWrapper question={question} allQuestions={allQuestions} defaultValues={{ q1: null }} />,
      );

      expect(queryByPlaceholderText('Extra details')).toBeNull();
      fireEvent.press(getByText('Very conservative'));
      expect(getByPlaceholderText('Extra details')).toBeTruthy();
    });
  });
});
