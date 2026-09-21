import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { type RegisterOptions, type SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { EtFormRadioGroup } from './et-form-radio-group';

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

jest.mock('../components/controls/radio-group/et-radio-group', () => {
  const { View, Pressable: RNPressable, Text: RNText } = require('react-native');
  const ReactModule = require('react');
  const MockRadioCtx = ReactModule.createContext<any>(null);

  const MockOption = ({ value: optionValue, label, testID, ...props }: any) => {
    const radioCtxValue = ReactModule.useContext(MockRadioCtx);
    return (
      <RNPressable testID={testID || `radio-option-${optionValue}`} onPress={() => radioCtxValue?.onChange(optionValue)} {...props}>
        <RNText testID={`radio-label-${optionValue}`}>{label}</RNText>
        <RNText testID={`radio-selected-${optionValue}`}>{String(radioCtxValue?.value === optionValue)}</RNText>
      </RNPressable>
    );
  };
  MockOption.displayName = 'EtRadioGroup.Option';

  const MockRadioGroup = ({ value, onChange, error, children, testID, disabled, ...rest }: any) => (
    <MockRadioCtx.Provider value={{ value, onChange }}>
      <View testID={testID || 'mock-radio-group'} {...rest}>
        <RNText testID="radio-error">{String(error)}</RNText>
        <RNText testID="radio-disabled">{String(disabled ?? false)}</RNText>
        {children}
      </View>
    </MockRadioCtx.Provider>
  );

  MockRadioGroup.Option = MockOption;

  return { EtRadioGroup: MockRadioGroup };
});

type FormValues = { color: string };

function TestForm({
  onSubmit,
  defaultValues = { color: '' },
  rules,
}: {
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: Partial<FormValues>;
  rules?: RegisterOptions<FormValues, 'color'>;
}) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
    mode: 'onChange',
  });
  return (
    <>
      <EtFormRadioGroup name="color" control={control} rules={rules ?? { required: 'Pick a color' }}>
        <EtFormRadioGroup.Control testID="radio-group">
          <EtFormRadioGroup.Option value="red" label="Red" testID="opt-red" />
          <EtFormRadioGroup.Option value="blue" label="Blue" testID="opt-blue" />
        </EtFormRadioGroup.Control>
        <EtFormRadioGroup.ErrorMessage testID="error-msg" />
      </EtFormRadioGroup>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

describe('EtFormRadioGroup', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without errors', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('radio-group')).toBeTruthy();
    });

    it('renders option labels', () => {
      const { getByText } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByText('Red')).toBeTruthy();
      expect(getByText('Blue')).toBeTruthy();
    });
  });

  describe('Value Binding', () => {
    it('passes empty string default when no option selected', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('radio-selected-red').props.children).toBe('false');
      expect(getByTestId('radio-selected-blue').props.children).toBe('false');
    });

    it('passes default value to underlying radio group', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ color: 'red' }} />);
      expect(getByTestId('radio-selected-red').props.children).toBe('true');
    });

    it('updates value when option is pressed', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('opt-blue'));

      await waitFor(() => {
        expect(getByTestId('radio-selected-blue').props.children).toBe('true');
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
        expect(getByTestId('error-msg').props.children).toBe('Pick a color');
      });
    });

    it('passes error flag to underlying radio group', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('radio-error').props.children).toBe('true');
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
          defaultValues: { color: '' },
        });
        return (
          <>
            <EtFormRadioGroup name="color" control={control} rules={{ required: 'Pick a color' }}>
              <EtFormRadioGroup.Control />
              <EtFormRadioGroup.ErrorMessage testID="error-msg" />
            </EtFormRadioGroup>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
            <Pressable testID="clear" onPress={() => clearErrors('color')} />
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
          defaultValues: { color: '' },
        });
        return (
          <>
            <EtFormRadioGroup name="color" control={control} rules={{ required: 'Select one' }}>
              <EtFormRadioGroup.Control />
              <EtFormRadioGroup.ErrorMessage
                render={({ message, error }) => (
                  <Text testID="custom-error">
                    {message}-{error.type}
                  </Text>
                )}
              />
            </EtFormRadioGroup>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
          </>
        );
      }

      const { getByTestId } = render(<CustomRenderForm />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        const customError = getByTestId('custom-error');
        expect(customError.props.children).toEqual(['Select one', '-', 'required']);
      });
    });
  });

  describe('Context error', () => {
    it('throws when Control is used outside EtFormRadioGroup', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormRadioGroup.Control />);
      }).toThrow('EtFormRadioGroup sub-components must be used within <EtFormRadioGroup>');
      consoleSpy.mockRestore();
    });

    it('throws when ErrorMessage is used outside EtFormRadioGroup', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormRadioGroup.ErrorMessage testID="orphan" />);
      }).toThrow('EtFormRadioGroup sub-components must be used within <EtFormRadioGroup>');
      consoleSpy.mockRestore();
    });
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN rendered, THEN Control passes disabled=true to EtRadioGroup', () => {
      function DisabledForm() {
        const { control } = useForm<FormValues>({ defaultValues: { color: '' }, disabled: true });
        return (
          <EtFormRadioGroup name="color" control={control}>
            <EtFormRadioGroup.Control testID="radio-group" />
          </EtFormRadioGroup>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      expect(getByTestId('radio-disabled').props.children).toBe('true');
    });

    it('GIVEN disabled prop on Control, WHEN form is enabled, THEN disabled=true is passed to EtRadioGroup', () => {
      function FormWithDisabledControl() {
        const { control } = useForm<FormValues>({ defaultValues: { color: '' } });
        return (
          <EtFormRadioGroup name="color" control={control}>
            <EtFormRadioGroup.Control testID="radio-group" disabled />
          </EtFormRadioGroup>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      expect(getByTestId('radio-disabled').props.children).toBe('true');
    });
  });

  describe('Submission', () => {
    it('submits with selected value', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ color: 'blue' }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ color: 'blue' }, undefined);
      });
    });
  });
});
