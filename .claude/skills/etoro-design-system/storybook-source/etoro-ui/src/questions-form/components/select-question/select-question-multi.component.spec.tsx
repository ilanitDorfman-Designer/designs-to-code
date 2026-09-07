import { fireEvent, render } from '@testing-library/react-native';
import { useEffect } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import type { OptionsQuestion, Question, QuestionsFormValues } from '../../interfaces';
import { mapValidationsToRhfRules } from '../../utils/validation-mapper.util';
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

jest.mock('../question-message-box', () => ({
  QuestionMessageBox: () => null,
}));

jest.mock('react-native-gesture-handler', () => {
  const { Switch } = require('react-native');
  return { Switch };
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const AnimatedView = React.forwardRef((props: unknown, ref: unknown) => React.createElement(View, { ...(props as object), ref }));
  AnimatedView.displayName = 'Animated.View';
  const noop = () => ({});
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: (v: unknown) => ({ value: v }),
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
  const { View: RNView, Pressable: RNPressable, Text: RNText } = require('react-native');

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

  const EtFormRadioGroup = Object.assign(EtFormRadioGroupRoot, {
    Control: EtFormRadioGroupControl,
    Option: EtFormRadioGroupOption,
    ErrorMessage: () => null,
  });

  return { EtFormInput: {}, EtFormRadioGroup };
});

const getFieldName = (q: Question) => q.id;
const getFieldRules = (q: Question): RegisterOptions | undefined => (q.validations?.length ? mapValidationsToRhfRules(q.validations, q) : undefined);

function createMultiSelectQuestion(overrides: Partial<OptionsQuestion> = {}): OptionsQuestion {
  return {
    id: 'q1',
    type: 'select',
    validations: [],
    isMultipleSelection: true,
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
  defaultValues = {},
  onFormReady,
}: {
  question: OptionsQuestion;
  defaultValues?: QuestionsFormValues;
  onFormReady?: (form: UseFormReturn<QuestionsFormValues>) => void;
}) {
  const form = useForm<QuestionsFormValues>({ defaultValues });
  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  return (
    <FormProvider {...form}>
      <SelectQuestion question={question} control={form.control} getFieldName={getFieldName} getFieldRules={getFieldRules} />
    </FormProvider>
  );
}

describe('SelectQuestion multi-select', () => {
  describe('GIVEN multi-select question', () => {
    it('WHEN multiple options pressed, THEN form value is array of selected values', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createMultiSelectQuestion();
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
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['a']);

      fireEvent.press(getByText('Option B'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['a', 'b']);

      fireEvent.press(getByText('Option C'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['a', 'b', 'c']);
    });

    it('WHEN one option deselected, THEN array excludes that value', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createMultiSelectQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: ['a', 'b', 'c'] }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Option B'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['a', 'c']);
    });

    it('WHEN all options deselected, THEN form value becomes null', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createMultiSelectQuestion();
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: ['a'] }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('Option A'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toBeNull();
    });

    it('WHEN form value is string[], THEN it is not string', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createMultiSelectQuestion();
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
      const value = (form as UseFormReturn<QuestionsFormValues>).getValues('q1');
      expect(Array.isArray(value)).toBe(true);
      expect(typeof value).not.toBe('string');
    });
  });

  describe('GIVEN unselectAll behavior', () => {
    it('WHEN unselectAll option selected, THEN only it remains in value', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createMultiSelectQuestion({
        options: [
          { value: 'a', text: 'Option A' },
          { value: 'b', text: 'Option B' },
          { value: 'none', text: 'None', behavior: 'unselectAll' },
        ],
      });
      const { getByText } = render(
        <SelectQuestionWrapper
          question={question}
          defaultValues={{ q1: ['a', 'b'] }}
          onFormReady={(f) => {
            form = f;
          }}
        />,
      );
      fireEvent.press(getByText('None'));
      expect((form as UseFormReturn<QuestionsFormValues>).getValues('q1')).toEqual(['none']);
    });

    it('WHEN normal option selected while unselectAll active, THEN unselectAll is deselected', () => {
      let form: UseFormReturn<QuestionsFormValues>;
      const question = createMultiSelectQuestion({
        options: [
          { value: 'a', text: 'Option A' },
          { value: 'b', text: 'Option B' },
          { value: 'none', text: 'None', behavior: 'unselectAll' },
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
      fireEvent.press(getByText('Option A'));
      const value = (form as UseFormReturn<QuestionsFormValues>).getValues('q1') as string[];
      expect(value).toContain('a');
      expect(value).not.toContain('none');
    });
  });
});
