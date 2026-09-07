import './select-question-group.spec.mocks';

import { fireEvent, render } from '@testing-library/react-native';
import type { UseFormReturn } from 'react-hook-form';

import type { OptionsQuestion, QuestionsFormValues } from '../../interfaces';
import { ChipSelectGroup } from './chip-select-group.component';
import { getFieldName, getFieldRules, QuestionsFormTestHarness } from './select-question-group.spec.utils';

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

describe('ChipSelectGroup', () => {
  describe('GIVEN chip-style multi-select', () => {
    it('WHEN rendered, THEN shows all chip options', () => {
      const question = createChipQuestion();
      const { getByText } = render(
        <QuestionsFormTestHarness defaultValues={{ q1: null }}>
          {({ control }) => <ChipSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />}
        </QuestionsFormTestHarness>,
      );
      expect(getByText('Stocks')).toBeTruthy();
      expect(getByText('Crypto')).toBeTruthy();
      expect(getByText('Forex')).toBeTruthy();
    });

    it('WHEN chip pressed, THEN value is added to array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createChipQuestion();
      const { getByText } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => <ChipSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByText('Stocks'));
      expect(form.getValues('q1')).toEqual(['stocks']);
    });

    it('WHEN multiple chips pressed, THEN all values are in array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createChipQuestion();
      const { getByText } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => <ChipSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByText('Stocks'));
      fireEvent.press(getByText('Crypto'));
      expect(form.getValues('q1')).toEqual(['stocks', 'crypto']);
    });

    it('WHEN selected chip pressed again, THEN value is removed from array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createChipQuestion();
      const { getByText } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: ['stocks', 'crypto'] }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => <ChipSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByText('Stocks'));
      expect(form.getValues('q1')).toEqual(['crypto']);
    });
  });
});
