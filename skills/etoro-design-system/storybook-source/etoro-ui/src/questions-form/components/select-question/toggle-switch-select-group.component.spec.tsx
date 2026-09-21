import './select-question-group.spec.mocks';

import { fireEvent, render } from '@testing-library/react-native';
import type { UseFormReturn } from 'react-hook-form';

import type { OptionsQuestion, QuestionsFormValues } from '../../interfaces';
import { getFieldName, getFieldRules, QuestionsFormTestHarness } from './select-question-group.spec.utils';
import { ToggleSwitchSelectGroup } from './toggle-switch-select-group.component';

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

/** Creates a question whose options use a non-checkRound style (renders via EtSelectionTileGroup.Option fallback). */
function createLegacyStyleQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
  return {
    id: 'q1',
    type: 'select',
    isMultipleSelection: true,
    validations: [],
    options: [
      { value: 'opt1', text: 'Option A', optionDefaultStyle: 'check' },
      { value: 'opt2', text: 'Option B', optionDefaultStyle: 'check' },
    ],
    ...overrides,
  };
}

describe('ToggleSwitchSelectGroup', () => {
  describe('GIVEN checkRound-style multi-select', () => {
    it('WHEN rendered, THEN shows all toggle options', () => {
      const question = createCheckRoundQuestion();
      const { getByText } = render(
        <QuestionsFormTestHarness defaultValues={{ q1: null }}>
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      expect(getByText('Toggle A')).toBeTruthy();
      expect(getByText('Toggle B')).toBeTruthy();
      expect(getByText('Toggle C')).toBeTruthy();
    });

    it('WHEN toggle pressed, THEN value is added to array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createCheckRoundQuestion();
      const { getByText } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByText('Toggle A'));
      expect(form.getValues('q1')).toEqual(['opt1']);
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
        <QuestionsFormTestHarness
          defaultValues={{ q1: ['opt1', 'opt2'] }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByText('None'));
      expect(form.getValues('q1')).toEqual(['none']);
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
        <QuestionsFormTestHarness
          defaultValues={{ q1: ['none'] }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByText('Toggle A'));
      expect(form.getValues('q1')).toEqual(['opt1']);
    });
  });

  describe('GIVEN legacy (non-checkRound) style options via handleLegacyPress', () => {
    it('WHEN option pressed with no prior selection, THEN value is added to array', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createLegacyStyleQuestion();
      const { getByTestId } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByTestId('select-option-opt1'));
      expect(form.getValues('q1')).toEqual(['opt1']);
    });

    it('WHEN selected option pressed again, THEN value is removed (deselect)', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createLegacyStyleQuestion();
      const { getByTestId } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: ['opt1'] }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByTestId('select-option-opt1'));
      expect(form.getValues('q1')).toBeNull();
    });

    it('WHEN multiple options selected and last one is deselected, THEN field becomes null', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createLegacyStyleQuestion();
      const { getByTestId } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: ['opt1', 'opt2'] }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByTestId('select-option-opt1'));
      expect(form.getValues('q1')).toEqual(['opt2']);
      fireEvent.press(getByTestId('select-option-opt2'));
      expect(form.getValues('q1')).toBeNull();
    });

    it('WHEN readOnly is true, THEN pressing does not change the value', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createLegacyStyleQuestion({ readOnly: true });
      const { getByTestId } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByTestId('select-option-opt1'));
      expect(form.getValues('q1')).toBeNull();
    });

    it('WHEN option.disabled is true, THEN pressing does not change the value', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createLegacyStyleQuestion({
        options: [{ value: 'opt1', text: 'Option A', optionDefaultStyle: 'check', disabled: true }],
      });
      const { getByTestId } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByTestId('select-option-opt1'));
      expect(form.getValues('q1')).toBeNull();
    });

    it('WHEN option pressed while unselectAll is active, THEN unselectAll is removed from selection', () => {
      let form!: UseFormReturn<QuestionsFormValues>;
      const question = createLegacyStyleQuestion({
        options: [
          { value: 'opt1', text: 'Option A', optionDefaultStyle: 'check' },
          { value: 'none', text: 'None', behavior: 'unselectAll' },
        ],
      });
      const { getByTestId } = render(
        <QuestionsFormTestHarness
          defaultValues={{ q1: ['none'] }}
          onFormReady={(f) => {
            form = f;
          }}
        >
          {({ control }) => (
            <ToggleSwitchSelectGroup question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
          )}
        </QuestionsFormTestHarness>,
      );
      fireEvent.press(getByTestId('select-option-opt1'));
      expect(form.getValues('q1')).toEqual(['opt1']);
    });
  });
});
