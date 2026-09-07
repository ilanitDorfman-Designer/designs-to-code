import { fireEvent, render } from '@testing-library/react-native';
import { useEffect, useMemo } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import { QuestionRendererProvider } from '../../contexts';
import type { OptionsQuestion, Question, QuestionsFormValues } from '../../interfaces';
import { collectOuterQuestionIds, getOuterQuestions } from '../../utils/question-resolver.util';
import { mapValidationsToRhfRules } from '../../utils/validation-mapper.util';
import { QuestionRenderer } from '../question-renderer';
import { SelectQuestion } from './select-question.component';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#FFFFFF',
      textBrandPrimary: '#00D395',
      textBright: '#FFFFFF',
      bgGreyTertiary: '#333333',
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

jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: ({ testID, ...rest }: { source?: { uri?: string }; testID?: string }) =>
      React.createElement(View, { testID: testID ?? 'mock-image', ...rest }),
  };
});

jest.mock('../../../components/input/input-v2/et-input', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');

  const InputContext = React.createContext<{ value: string; setValue: (next: string) => void } | null>(null);

  const EtInputRoot = ({ defaultValue, children }: any) => {
    const [value, setValue] = React.useState(typeof defaultValue === 'string' ? defaultValue : '');
    return React.createElement(InputContext.Provider, { value: { value, setValue } }, React.createElement(View, null, children));
  };

  const EtInputLabel = ({ children }: any) => React.createElement(Text, null, children);

  const EtInputField = ({ onChangeText, ...props }: any) => {
    const ctx = React.useContext(InputContext);
    return React.createElement(TextInput, {
      testID: 'input-field',
      ...props,
      value: ctx?.value ?? '',
      onChangeText: (text: string) => {
        ctx?.setValue(text);
        onChangeText?.(text);
      },
    });
  };

  const EtInput = Object.assign(EtInputRoot, { Label: EtInputLabel, Field: EtInputField });

  return { EtInput };
});

jest.mock('../question-message-box', () => ({
  QuestionMessageBox: () => null,
}));

jest.mock('../autocomplete-question', () => ({
  AutocompleteQuestion: () => null,
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const AnimatedView = React.forwardRef((props: unknown, ref: unknown) => React.createElement(View, { ...(props as object), ref }));
  AnimatedView.displayName = 'Animated.View';
  const noop = () => ({});
  const createSharedValue = (initial: unknown) => ({
    value: initial,
    get() {
      return this.value;
    },
    set(next: unknown) {
      this.value = typeof next === 'function' ? (next as any)(this.value) : next;
    },
  });
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: createSharedValue,
    useAnimatedStyle: (fn: () => unknown) => fn(),
    withTiming: (v: unknown) => v,
    interpolate: () => 0,
    interpolateColor: () => 'transparent',
    Easing: {
      bezier: () => noop,
      out: (easing: (t: number) => number) => easing,
      cubic: (t: number) => t * t * (3 - 2 * t),
    },
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
    FadeInUp: { delay: () => ({ duration: () => ({}) }), duration: () => ({}) },
    FadeOutDown: { duration: () => ({}) },
  };
});

jest.mock('../../../form', () => {
  const React = require('react');
  const { useController } = require('react-hook-form');
  const { View: RNView, TextInput: RNTextInput, Pressable: RNPressable, Text: RNText } = require('react-native');

  const FieldContext = React.createContext<any>(null);

  const EtFormInputRoot = ({ name, control, rules, children }: any) => {
    const { field } = useController({ name, control, rules });
    return React.createElement(FieldContext.Provider, { value: field }, children);
  };
  EtFormInputRoot.displayName = 'EtFormInput.Root';

  const EtFormInputControl = ({ readonly, style, children }: any) => {
    const field = React.useContext(FieldContext);
    const fieldChild = React.Children.toArray(children).find((c: any) => c?.type?.displayName === 'EtFormInput.Field');
    const fieldProps = (fieldChild as any)?.props ?? {};
    const editable = fieldProps.editable ?? !readonly;
    return React.createElement(
      RNView,
      { testID: 'input-control', style },
      React.createElement(RNTextInput, {
        testID: 'input-field',
        value: field?.value ?? '',
        onChangeText: field?.onChange,
        onBlur: field?.onBlur,
        placeholder: fieldProps.placeholder,
        multiline: fieldProps.multiline,
        keyboardType: fieldProps.keyboardType,
        editable,
      }),
    );
  };
  EtFormInputControl.displayName = 'EtFormInput.Control';

  const EtFormInputField = (props: any) => React.createElement(RNTextInput, props);
  EtFormInputField.displayName = 'EtFormInput.Field';

  const EtFormInputErrorMessage = () => null;
  EtFormInputErrorMessage.displayName = 'EtFormInput.ErrorMessage';

  const EtFormInput = Object.assign(EtFormInputRoot, {
    Control: EtFormInputControl,
    Field: EtFormInputField,
    ErrorMessage: EtFormInputErrorMessage,
  });

  const RadioGroupContext = React.createContext<any>(null);

  const EtFormRadioGroupRoot = ({ name, control, rules, children }: any) => {
    const { field, fieldState } = useController({ name, control, rules });
    return React.createElement(RadioGroupContext.Provider, { value: { field, error: fieldState.error } }, children);
  };

  const EtFormRadioGroupControl = ({ children, disabled }: any) => {
    return React.createElement(
      RNView,
      { testID: 'radio-group-control', accessibilityRole: 'radiogroup', pointerEvents: disabled ? 'none' : 'auto' },
      children,
    );
  };

  const EtFormRadioGroupOption = ({ value, children, disabled }: any) => {
    const ctx = React.useContext(RadioGroupContext);
    const isSelected = ctx?.field?.value === value;
    const handlePress = () => {
      if (!disabled && ctx?.field?.onChange) ctx.field.onChange(value);
    };
    return React.createElement(
      RNPressable,
      { onPress: handlePress, disabled, accessibilityRole: 'radio', accessibilityState: { selected: isSelected, disabled: !!disabled } },
      React.createElement(RNText, null, children),
    );
  };

  const EtFormRadioGroupErrorMessage = () => null;

  const EtFormRadioGroup = Object.assign(EtFormRadioGroupRoot, {
    Control: EtFormRadioGroupControl,
    Option: EtFormRadioGroupOption,
    ErrorMessage: EtFormRadioGroupErrorMessage,
  });

  const FormField = ({ name, control, rules, children }: any) => {
    const {
      field,
      fieldState: { error },
    } = useController({ name, control, rules });

    return children(
      {
        value: field.value,
        onChange: field.onChange,
        onBlur: field.onBlur,
        disabled: !!field.disabled,
      },
      error,
    );
  };

  return { EtFormInput, EtFormRadioGroup, FormField };
});

const getFieldName = (q: Question) => q.id;
const getFieldRules = (q: Question): RegisterOptions | undefined => (q.validations?.length ? mapValidationsToRhfRules(q.validations, q) : undefined);

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

function SelectQuestionWithOuterWrapper({
  question,
  allQuestions,
  defaultValues = {},
  onFormReady,
}: {
  question: OptionsQuestion;
  allQuestions: Question[];
  defaultValues?: QuestionsFormValues;
  onFormReady?: (form: UseFormReturn<QuestionsFormValues>) => void;
}) {
  const form = useForm<QuestionsFormValues>({ defaultValues });
  const watchedValues = form.watch();
  const fieldName = getFieldName(question);
  const selectedValue = watchedValues[fieldName] as string | string[] | null | undefined;

  const visibleOuterQuestions = useMemo(() => {
    const ids = collectOuterQuestionIds(question, selectedValue ?? null);
    return getOuterQuestions(ids, allQuestions);
  }, [question, selectedValue, allQuestions]);

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
          visibleOuterQuestions={visibleOuterQuestions}
          getFieldName={getFieldName}
          getFieldRules={getFieldRules}
        />
      </FormProvider>
    </QuestionRendererProvider>
  );
}

describe('SelectQuestion outer questions', () => {
  const outerInputQuestion: Question = {
    id: 'q-outer-1',
    type: 'input',
    inputType: 'text',
    placeholderText: 'Outer details',
    validations: [],
  };

  const questionWithOuter = createSingleSelectQuestion({
    options: [
      { value: 'a', text: 'Option A', sharedOuterQuestionsIds: ['q-outer-1'] },
      { value: 'b', text: 'Option B' },
      { value: 'c', text: 'Option C' },
    ],
  });

  const allQuestions: Question[] = [questionWithOuter, outerInputQuestion];

  it('WHEN option with sharedOuterQuestionsIds selected, THEN outer questions appear below options', () => {
    const { getByText, getByPlaceholderText } = render(
      <SelectQuestionWithOuterWrapper question={questionWithOuter} allQuestions={allQuestions} defaultValues={{ q1: null }} />,
    );

    expect(() => getByPlaceholderText('Outer details')).toThrow();

    fireEvent.press(getByText('Option A'));

    expect(getByPlaceholderText('Outer details')).toBeTruthy();
  });

  it('WHEN selection changes to option without outer questions, THEN outer questions disappear', () => {
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
      <SelectQuestionWithOuterWrapper question={questionWithOuter} allQuestions={allQuestions} defaultValues={{ q1: 'a' }} />,
    );

    expect(getByPlaceholderText('Outer details')).toBeTruthy();

    fireEvent.press(getByText('Option B'));

    expect(queryByPlaceholderText('Outer details')).toBeNull();
  });

  it('WHEN switching between options sharing same outer question ID, THEN outer question persists', () => {
    const questionWithSharedOuter = createSingleSelectQuestion({
      options: [
        { value: 'a', text: 'Option A', sharedOuterQuestionsIds: ['q-outer-1'] },
        { value: 'b', text: 'Option B', sharedOuterQuestionsIds: ['q-outer-1'] },
        { value: 'c', text: 'Option C' },
      ],
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <SelectQuestionWithOuterWrapper question={questionWithSharedOuter} allQuestions={allQuestions} defaultValues={{ q1: null }} />,
    );

    fireEvent.press(getByText('Option A'));
    const input = getByTestId('input-question-q-outer-1');
    fireEvent.changeText(input, 'Persisted value');

    expect(getByPlaceholderText('Outer details')).toBeTruthy();

    fireEvent.press(getByText('Option B'));

    expect(getByPlaceholderText('Outer details')).toBeTruthy();
    expect(input.props.value).toBe('Persisted value');
  });

  it('WHEN outer question filled, THEN value is included in form', () => {
    let form: UseFormReturn<QuestionsFormValues>;
    const { getByText, getByTestId } = render(
      <SelectQuestionWithOuterWrapper
        question={questionWithOuter}
        allQuestions={allQuestions}
        defaultValues={{ q1: null }}
        onFormReady={(f) => {
          form = f;
        }}
      />,
    );

    fireEvent.press(getByText('Option A'));
    const input = getByTestId('input-question-q-outer-1');
    fireEvent.changeText(input, 'My outer answer');

    expect((form as UseFormReturn<QuestionsFormValues>).getValues()).toMatchObject({
      q1: 'a',
      'q-outer-1': 'My outer answer',
    });
  });

  it('WHEN option has sharedOuterQuestionsId (legacy), THEN outer question appears', () => {
    const questionWithLegacyOuter = createSingleSelectQuestion({
      options: [
        { value: 'a', text: 'Option A', sharedOuterQuestionsId: 'q-outer-1' },
        { value: 'b', text: 'Option B' },
      ],
    });

    const { getByText, getByPlaceholderText } = render(
      <SelectQuestionWithOuterWrapper question={questionWithLegacyOuter} allQuestions={allQuestions} defaultValues={{ q1: null }} />,
    );

    fireEvent.press(getByText('Option A'));

    expect(getByPlaceholderText('Outer details')).toBeTruthy();
  });
});
