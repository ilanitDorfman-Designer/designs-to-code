import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { EtFormInput } from './et-form-input';

jest.mock('../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: { statusNegative: 'red' },
    gradients: {},
    fonts: {},
  })),
}));

jest.mock('../foundations/text/et-text', () => ({
  EtText: ({ children, testID, style, ...props }: any) => {
    const { Text: RNText } = require('react-native');
    return (
      <RNText testID={testID} style={style} {...props}>
        {children}
      </RNText>
    );
  },
}));

jest.mock('../components/input/input-v2/et-input', () => {
  const { View, Text: RNText } = require('react-native');

  const MockLabel = ({ children, ...props }: any) => <RNText {...props}>{children}</RNText>;
  MockLabel.displayName = 'EtInput.Label';

  const MockTextAdornment = ({ children, ...props }: any) => <View {...props}>{children}</View>;
  MockTextAdornment.displayName = 'EtInput.TextAdornment';

  const MockIconAdornment = ({ children, ...props }: any) => <View {...props}>{children}</View>;
  MockIconAdornment.displayName = 'EtInput.IconAdornment';

  const MockInput = ({ defaultValue, error, children, testID, disabled, ...rest }: any) => (
    <View testID={testID || 'mock-input'} {...rest}>
      <RNText testID="input-default-value">{String(defaultValue ?? '')}</RNText>
      <RNText testID="input-error">{String(error)}</RNText>
      <RNText testID="input-disabled">{String(disabled ?? false)}</RNText>
      {children}
    </View>
  );

  MockInput.Label = MockLabel;
  MockInput.Field = View;
  MockInput.TextAdornment = MockTextAdornment;
  MockInput.IconAdornment = MockIconAdornment;

  return { EtInput: MockInput };
});

jest.mock('../components/input/input-v2/subcomponents/input-field', () => {
  const React = require('react');
  const { TextInput } = require('react-native');

  const MockInputField = React.forwardRef(({ onChangeText, onBlur, testID, ...rest }: any, ref: any) => (
    <TextInput ref={ref} testID={testID || 'mock-input-field'} onChangeText={onChangeText} onBlur={onBlur} {...rest} />
  ));
  MockInputField.displayName = 'InputField';

  return { InputField: MockInputField };
});

function TestForm({
  onSubmit,
  defaultValues = { username: '' },
  rules,
  hideError,
}: {
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  rules?: any;
  hideError?: boolean;
}) {
  const { control, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
  });
  return (
    <>
      <EtFormInput name="username" control={control} rules={rules ?? { required: 'Username is required' }} hideError={hideError}>
        <EtFormInput.Control testID="input-control">
          <EtFormInput.Label>Username</EtFormInput.Label>
          <EtFormInput.Field testID="input-field" />
        </EtFormInput.Control>
        <EtFormInput.ErrorMessage testID="error-msg" />
      </EtFormInput>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

describe('EtFormInput', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without errors', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('input-control')).toBeTruthy();
    });

    it('renders label text', () => {
      const { getByText } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByText('Username')).toBeTruthy();
    });

    it('renders the input field', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('input-field')).toBeTruthy();
    });
  });

  describe('Value Binding', () => {
    it('passes empty string default value to underlying input', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('input-default-value').props.children).toBe('');
    });

    it('passes default value to underlying input', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ username: 'john' }} />);
      expect(getByTestId('input-default-value').props.children).toBe('john');
    });

    it('wires onChangeText from field to RHF', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.changeText(getByTestId('input-field'), 'newuser');
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ username: 'newuser' }, undefined);
      });
    });
  });

  describe('Validation', () => {
    it('shows error message after failed validation', async () => {
      const { getByTestId, queryByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      expect(queryByTestId('error-msg')).toBeNull();
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg')).toBeTruthy();
      });
    });

    it('displays the validation message text', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg').props.children).toBe('Username is required');
      });
    });

    it('passes error to underlying input by default', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('input-error').props.children).toBe('Username is required');
      });
    });

    it('hides error on underlying input when hideError is true', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} hideError />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('input-error').props.children).toBe('null');
      });
    });
  });

  describe('ErrorMessage', () => {
    it('renders null when no error exists', () => {
      const { queryByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(queryByTestId('error-msg')).toBeNull();
    });

    it('hides error when error is cleared', async () => {
      function HidesErrorForm() {
        const { control, handleSubmit, clearErrors } = useForm({
          defaultValues: { username: '' },
        });
        return (
          <>
            <EtFormInput name="username" control={control} rules={{ required: 'Username is required' }}>
              <EtFormInput.Control>
                <EtFormInput.Field testID="input-field" />
              </EtFormInput.Control>
              <EtFormInput.ErrorMessage testID="error-msg" />
            </EtFormInput>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
            <Pressable testID="clear" onPress={() => clearErrors('username')} />
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<HidesErrorForm />);

      fireEvent.press(getByTestId('submit'));
      await waitFor(() => {
        expect(getByTestId('error-msg')).toBeTruthy();
      });

      fireEvent.press(getByTestId('clear'));
      await waitFor(() => {
        expect(queryByTestId('error-msg')).toBeNull();
      });
    });
  });

  describe('Custom render prop', () => {
    it('passes error data to custom render function', async () => {
      function CustomRenderForm() {
        const { control, handleSubmit } = useForm({
          defaultValues: { username: '' },
        });
        return (
          <>
            <EtFormInput name="username" control={control} rules={{ required: 'Provide username' }}>
              <EtFormInput.Control>
                <EtFormInput.Field testID="input-field" />
              </EtFormInput.Control>
              <EtFormInput.ErrorMessage
                render={({ message, error }) => (
                  <Text testID="custom-error">
                    {message}-{error.type}
                  </Text>
                )}
              />
            </EtFormInput>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
          </>
        );
      }

      const { getByTestId } = render(<CustomRenderForm />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        const el = getByTestId('custom-error');
        expect(el.props.children).toEqual(['Provide username', '-', 'required']);
      });
    });
  });

  describe('Context error', () => {
    it('throws when Control is used outside EtFormInput', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormInput.Control />);
      }).toThrow('EtFormInput sub-components must be used within <EtFormInput>');
      consoleSpy.mockRestore();
    });

    it('throws when Field is used outside EtFormInput', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormInput.Field />);
      }).toThrow('EtFormInput sub-components must be used within <EtFormInput>');
      consoleSpy.mockRestore();
    });

    it('throws when ErrorMessage is used outside EtFormInput', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormInput.ErrorMessage />);
      }).toThrow('EtFormInput sub-components must be used within <EtFormInput>');
      consoleSpy.mockRestore();
    });
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN rendered, THEN Control passes disabled=true to EtInput', () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { username: '' }, disabled: true });
        return (
          <EtFormInput name="username" control={control}>
            <EtFormInput.Control testID="input-control" />
          </EtFormInput>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      expect(getByTestId('input-disabled').props.children).toBe('true');
    });

    it('GIVEN disabled prop on Control, WHEN form is enabled, THEN disabled=true is passed to EtInput', () => {
      function FormWithDisabledControl() {
        const { control } = useForm({ defaultValues: { username: '' } });
        return (
          <EtFormInput name="username" control={control}>
            <EtFormInput.Control testID="input-control" disabled />
          </EtFormInput>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      expect(getByTestId('input-disabled').props.children).toBe('true');
    });
  });

  describe('Static sub-components', () => {
    it('has Label attached', () => {
      expect(EtFormInput.Label).toBeDefined();
    });

    it('has TextAdornment attached', () => {
      expect(EtFormInput.TextAdornment).toBeDefined();
    });

    it('has IconAdornment attached', () => {
      expect(EtFormInput.IconAdornment).toBeDefined();
    });
  });

  describe('Submission', () => {
    it('submits with the entered text', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ username: 'admin' }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ username: 'admin' }, undefined);
      });
    });
  });
});
