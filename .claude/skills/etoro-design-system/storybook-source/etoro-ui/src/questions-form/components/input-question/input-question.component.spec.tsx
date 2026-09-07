import { fireEvent, render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';

import type { InputQuestion as InputQuestionType, QuestionsFormValues } from '../../interfaces';
import { InputQuestion } from './input-question.component';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#FFFFFF',
      textSecondaryNeutral: '#888888',
      textBrandPrimary: '#00D395',
    },
  }),
}));

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

jest.mock('../../../form', () => {
  const React = require('react');
  const { useController } = require('react-hook-form');
  const { View: RNView, TextInput: RNTextInput } = require('react-native');

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

  return { EtFormInput, FormField };
});

function TestWrapper({ question, defaultValues = {} }: { question: InputQuestionType; defaultValues?: Partial<QuestionsFormValues> }) {
  const { control } = useForm<QuestionsFormValues>({
    defaultValues: { [question.id]: defaultValues[question.id] ?? null },
  });
  return <InputQuestion question={question} control={control} getFieldName={(q) => q.id} getFieldRules={() => undefined} />;
}

describe('InputQuestion', () => {
  describe('GIVEN text input', () => {
    it('WHEN rendered, THEN shows placeholder', () => {
      const question: InputQuestionType = {
        id: 'q1',
        type: 'input',
        inputType: 'text',
        placeholderText: 'Enter your name',
        validations: [],
      };
      const { getByPlaceholderText } = render(<TestWrapper question={question} />);
      expect(getByPlaceholderText('Enter your name')).toBeTruthy();
    });
  });

  describe('GIVEN number input', () => {
    it('WHEN rendered, THEN has numeric keyboard type', () => {
      const question: InputQuestionType = {
        id: 'q1',
        type: 'input',
        inputType: 'number',
        placeholderText: 'Enter amount',
        validations: [],
      };
      const { getByTestId } = render(<TestWrapper question={question} />);
      const input = getByTestId('input-question-q1');
      expect(input.props.keyboardType).toBe('numeric');
    });
  });

  describe('GIVEN textbox (multiline)', () => {
    it('WHEN rendered, THEN is multiline', () => {
      const question: InputQuestionType = {
        id: 'q1',
        type: 'input',
        inputType: 'textbox',
        placeholderText: 'Describe here',
        validations: [],
      };
      const { getByTestId } = render(<TestWrapper question={question} />);
      const input = getByTestId('input-question-q1');
      expect(input.props.multiline).toBe(true);
    });
  });

  describe('GIVEN value change', () => {
    it('WHEN user types, THEN form value updates', () => {
      const question: InputQuestionType = {
        id: 'q1',
        type: 'input',
        inputType: 'text',
        placeholderText: 'Type here',
        validations: [],
      };
      const { getByTestId } = render(<TestWrapper question={question} />);
      const input = getByTestId('input-question-q1');
      fireEvent.changeText(input, 'Hello');
      expect(input.props.value).toBe('Hello');
    });
  });

  describe('GIVEN readOnly', () => {
    it('WHEN rendered, THEN input is not editable', () => {
      const question: InputQuestionType = {
        id: 'q1',
        type: 'input',
        inputType: 'text',
        placeholderText: 'Read only',
        readOnly: true,
        validations: [],
      };
      const { getByTestId } = render(<TestWrapper question={question} />);
      const input = getByTestId('input-question-q1');
      expect(input.props.editable).toBe(false);
    });
  });
});
