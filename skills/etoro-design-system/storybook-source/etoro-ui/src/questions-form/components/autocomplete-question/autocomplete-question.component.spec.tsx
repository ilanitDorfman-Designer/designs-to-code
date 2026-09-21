import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import type { CustomValidatorFn, OptionsQuestion, Question, QuestionsFormValues, QuestionValidatorRegistry } from '../../interfaces';
import { mapValidationsToRhfRules } from '../../utils/validation-mapper.util';
import { AutocompleteQuestion } from './autocomplete-question.component';

jest.mock('@etoro/common/utils/rn', () => ({
  useDebouncedValue: (value: string) => value,
}));

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#FFFFFF',
      textSecondaryNeutral: '#AAAAAA',
      textTertiaryNeutral: '#666666',
      textBrandPrimary: '#00D395',
      bgGreyTransparentPrimary: '#333333',
      bgNeutralTertiary: '#222222',
      dividerQuinary: '#444444',
    },
  }),
}));

jest.mock('../../../foundations/text/et-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtText: ({ children, ...rest }: { children?: React.ReactNode }) => React.createElement(Text, rest, children),
  };
});

jest.mock('../../../components/et-icon-v2', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    EtIconV2: ({ name, testID }: { name: string; testID?: string }) =>
      React.createElement(View, {
        testID: testID ?? `icon-${name}`,
        accessibilityLabel: `icon-${name}`,
      }),
  };
});

jest.mock('../../../components/input/search-input', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    EtSearchInput: ({ value, onChangeText, placeholder, testID }: any) =>
      React.createElement(TextInput, {
        value,
        onChangeText,
        placeholder,
        testID: testID ?? 'search-input',
      }),
  };
});

jest.mock('../../../components/controls/select/et-select', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  const Value = ({ children }: { children: React.ReactNode }) => React.createElement(Text, {}, children);
  Value.displayName = 'EtSelect.Value';
  return {
    EtSelect: Object.assign(
      ({ children, onPress, testID }: { children: React.ReactNode; onPress: () => void; testID?: string }) => {
        const valueChild = React.Children.toArray(children).find((c: any) => c?.type?.displayName === 'EtSelect.Value') as
          | React.ReactElement<{ children: React.ReactNode }>
          | undefined;
        const displayText = valueChild?.props?.children ?? '';
        return React.createElement(Pressable, { onPress, testID: testID ?? 'et-select' }, React.createElement(Text, {}, displayText));
      },
      { Value },
    ),
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BottomSheetModal: React.forwardRef(({ children }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        present: () => {},
        dismiss: () => {},
      }));
      return React.createElement(View, { testID: 'bottom-sheet' }, children);
    }),
  };
});

jest.mock('../../../components/overlays/bottom-sheet-v2', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Header = ({ children }: any) => React.createElement(View, { testID: 'sheet-header' }, children);
  const List = ({ data, renderItem, ListEmptyComponent }: any) =>
    React.createElement(
      View,
      { testID: 'sheet-list' },
      data?.length ? data.map((item: any) => React.createElement(View, { key: item.value }, renderItem({ item }))) : ListEmptyComponent,
    );
  const Root = ({ children }: any) => {
    const header = React.Children.toArray(children).find((c: any) => c?.type === Header);
    const list = React.Children.toArray(children).find((c: any) => c?.type === List);
    return React.createElement(View, { testID: 'et-bottom-sheet' }, header, list);
  };
  Root.Header = Header;
  Root.List = List;
  return { EtBottomSheet: Root };
});

jest.mock('../question-message-box', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    QuestionMessageBox: ({ message }: { message: { message: string; type?: string } }) =>
      React.createElement(Text, { testID: 'question-message-box' }, message?.message),
  };
});

const getFieldName = (q: Question) => q.id;

function createAutocompleteQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
  return {
    id: 'q1',
    type: 'select',
    selectType: 'autoComplete',
    validations: [],
    options: [
      { value: 'a', text: 'Option A' },
      { value: 'b', text: 'Option B' },
      { value: 'c', text: 'Option C' },
      { value: 'd', text: 'Delta' },
    ],
    ...overrides,
  };
}

function AutocompleteQuestionWrapper({
  question,
  defaultValues = {},
  onFormReady,
  validatorRegistry,
  formMode,
}: {
  question: OptionsQuestion;
  defaultValues?: QuestionsFormValues;
  onFormReady?: (form: UseFormReturn<QuestionsFormValues>) => void;
  validatorRegistry?: QuestionValidatorRegistry;
  formMode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}) {
  const form = useForm<QuestionsFormValues>({ defaultValues, mode: formMode });
  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  const fieldRules = (q: Question): RegisterOptions | undefined =>
    q.validations?.length ? mapValidationsToRhfRules(q.validations, q, validatorRegistry) : undefined;

  return (
    <FormProvider {...form}>
      <AutocompleteQuestion question={question} control={form.control} getFieldName={getFieldName} getFieldRules={fieldRules} />
    </FormProvider>
  );
}

describe('AutocompleteQuestion', () => {
  describe('GIVEN no selection', () => {
    it('WHEN rendered, THEN trigger shows placeholder', () => {
      const question = createAutocompleteQuestion({ placeholderText: 'Choose one' });
      const { getByText } = render(<AutocompleteQuestionWrapper question={question} defaultValues={{ q1: null }} />);
      expect(getByText('Choose one')).toBeTruthy();
    });

    it('WHEN no placeholderText, THEN shows default placeholder', () => {
      const question = createAutocompleteQuestion();
      const { getByText } = render(<AutocompleteQuestionWrapper question={question} defaultValues={{ q1: null }} />);
      expect(getByText('questionsForm.selectPlaceholder')).toBeTruthy();
    });
  });

  describe('GIVEN selected value', () => {
    it('WHEN option selected, THEN trigger shows selected option text', () => {
      const question = createAutocompleteQuestion();
      const { getAllByText } = render(<AutocompleteQuestionWrapper question={question} defaultValues={{ q1: 'a' }} />);
      expect(getAllByText('Option A').length).toBeGreaterThanOrEqual(1);
    });

    it('WHEN option has no text, THEN trigger shows option value', () => {
      const question = createAutocompleteQuestion({
        options: [
          { value: 'x', text: undefined },
          { value: 'y', text: 'Yes' },
        ],
      });
      const { getAllByText } = render(<AutocompleteQuestionWrapper question={question} defaultValues={{ q1: 'x' }} />);
      expect(getAllByText('x').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GIVEN search', () => {
    it('WHEN typing in search, THEN options are filtered (case-insensitive)', () => {
      const question = createAutocompleteQuestion();
      const { getByPlaceholderText, getAllByTestId, queryAllByTestId } = render(
        <AutocompleteQuestionWrapper question={question} defaultValues={{ q1: null }} />,
      );
      const searchInput = getByPlaceholderText('questionsForm.searchPlaceholder');
      fireEvent.changeText(searchInput, 'opt');
      expect(getAllByTestId('autocomplete-option-a').length).toBeGreaterThanOrEqual(1);
      expect(getAllByTestId('autocomplete-option-b').length).toBeGreaterThanOrEqual(1);
      expect(getAllByTestId('autocomplete-option-c').length).toBeGreaterThanOrEqual(1);
      expect(queryAllByTestId('autocomplete-option-d')).toHaveLength(0);
    });

    it('WHEN typing "delta", THEN only Delta option shown', () => {
      const question = createAutocompleteQuestion();
      const { getByPlaceholderText, getAllByTestId, queryAllByTestId } = render(
        <AutocompleteQuestionWrapper question={question} defaultValues={{ q1: null }} />,
      );
      fireEvent.changeText(getByPlaceholderText('questionsForm.searchPlaceholder'), 'delta');
      expect(getAllByTestId('autocomplete-option-d').length).toBeGreaterThanOrEqual(1);
      expect(queryAllByTestId('autocomplete-option-a')).toHaveLength(0);
    });
  });

  describe('GIVEN option selection', () => {
    it('WHEN option pressed, THEN form value updates', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createAutocompleteQuestion();
      const { getByTestId } = render(
        <AutocompleteQuestionWrapper
          question={question}
          defaultValues={{ q1: null }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByTestId('autocomplete-option-b'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toBe('b');
    });
  });

  describe('GIVEN custom validation error', () => {
    const ERROR_MESSAGE = 'Your occupation is not aligned with your source of income';
    const alwaysFailValidator: CustomValidatorFn = () => ERROR_MESSAGE;
    const registry: QuestionValidatorRegistry = { get: (name) => (name === 'occupation' ? alwaysFailValidator : undefined) };

    it('WHEN validation fails, THEN error message box is rendered', async () => {
      const question = createAutocompleteQuestion({
        validations: [{ custom: [{ name: 'occupation', errorMessage: ERROR_MESSAGE }] }],
      });

      let form!: UseFormReturn<QuestionsFormValues>;
      const { getByTestId } = render(
        <AutocompleteQuestionWrapper
          question={question}
          defaultValues={{ q1: 'a' }}
          validatorRegistry={registry}
          formMode="onChange"
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );

      await waitFor(() => {
        form.trigger('q1');
      });

      await waitFor(() => {
        expect(getByTestId('question-message-box')).toBeTruthy();
      });
    });

    it('WHEN validation passes, THEN no error message box is rendered', () => {
      const question = createAutocompleteQuestion();
      const { queryByTestId } = render(<AutocompleteQuestionWrapper question={question} defaultValues={{ q1: 'a' }} />);
      expect(queryByTestId('question-message-box')).toBeNull();
    });
  });
});
