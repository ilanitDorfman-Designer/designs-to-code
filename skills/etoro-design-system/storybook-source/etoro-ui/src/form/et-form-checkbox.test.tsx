import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { EtFormCheckbox } from './et-form-checkbox';

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

jest.mock('../components/controls/checkbox/et-checkbox', () => {
  const { Pressable: RNPressable, Text: RNText } = require('react-native');

  const MockLabel = ({ children, ...props }: any) => <RNText {...props}>{children}</RNText>;
  MockLabel.displayName = 'EtCheckbox.Label';

  const MockCheckbox = ({ value, onChange, children, testID, ...rest }: any) => (
    <RNPressable testID={testID || 'mock-checkbox'} onPress={() => onChange(value !== true)} {...rest}>
      <RNText testID="checkbox-value">{String(value)}</RNText>
      {children}
    </RNPressable>
  );

  MockCheckbox.Label = MockLabel;

  return { EtCheckbox: MockCheckbox };
});

function TestForm({
  onSubmit,
  defaultValues = { agree: false },
  rules,
}: {
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  rules?: any;
}) {
  const { control, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
  });
  return (
    <>
      <EtFormCheckbox name="agree" control={control} rules={rules ?? { validate: (v: boolean) => v === true || 'Required' }}>
        <EtFormCheckbox.Control testID="checkbox-control">
          <EtFormCheckbox.Label>I agree</EtFormCheckbox.Label>
        </EtFormCheckbox.Control>
        <EtFormCheckbox.ErrorMessage testID="error-msg" />
      </EtFormCheckbox>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

describe('EtFormCheckbox', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without errors', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('checkbox-control')).toBeTruthy();
    });

    it('renders label text', () => {
      const { getByText } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByText('I agree')).toBeTruthy();
    });
  });

  describe('Value Binding', () => {
    it('flows default false value to underlying checkbox', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('checkbox-value').props.children).toBe('false');
    });

    it('flows default true value to underlying checkbox', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ agree: true }} />);
      expect(getByTestId('checkbox-value').props.children).toBe('true');
    });

    it('toggles value when pressed', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('checkbox-value').props.children).toBe('false');

      fireEvent.press(getByTestId('checkbox-control'));

      await waitFor(() => {
        expect(getByTestId('checkbox-value').props.children).toBe('true');
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
        const errorEl = getByTestId('error-msg');
        expect(errorEl.props.children).toBe('Required');
      });
    });

    it('sets checkbox value to error state when validation fails and unchecked', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('checkbox-value').props.children).toBe('error');
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
          defaultValues: { agree: false },
        });
        return (
          <>
            <EtFormCheckbox name="agree" control={control} rules={{ validate: (v: boolean) => v === true || 'Required' }}>
              <EtFormCheckbox.Control testID="checkbox-control" />
              <EtFormCheckbox.ErrorMessage testID="error-msg" />
            </EtFormCheckbox>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
            <Pressable testID="clear" onPress={() => clearErrors('agree')} />
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
          defaultValues: { agree: false },
        });
        return (
          <>
            <EtFormCheckbox name="agree" control={control} rules={{ validate: (v: boolean) => v === true || 'Must accept' }}>
              <EtFormCheckbox.Control testID="checkbox-control" />
              <EtFormCheckbox.ErrorMessage
                render={({ message, error }) => (
                  <Text testID="custom-error">
                    {message}-{error.type}
                  </Text>
                )}
              />
            </EtFormCheckbox>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
          </>
        );
      }

      const { getByTestId } = render(<CustomRenderForm />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        const customError = getByTestId('custom-error');
        expect(customError.props.children).toEqual(['Must accept', '-', 'validate']);
      });
    });
  });

  describe('Context error', () => {
    it('throws when Control is used outside EtFormCheckbox', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormCheckbox.Control testID="orphan" />);
      }).toThrow('EtFormCheckbox sub-components must be used within <EtFormCheckbox>');
      consoleSpy.mockRestore();
    });

    it('throws when ErrorMessage is used outside EtFormCheckbox', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormCheckbox.ErrorMessage testID="orphan" />);
      }).toThrow('EtFormCheckbox sub-components must be used within <EtFormCheckbox>');
      consoleSpy.mockRestore();
    });
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN rendered, THEN Control receives disabled=true from context', () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { agree: false }, disabled: true });
        return (
          <EtFormCheckbox name="agree" control={control}>
            <EtFormCheckbox.Control testID="checkbox-control" />
          </EtFormCheckbox>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      expect(getByTestId('checkbox-control').props.accessibilityState.disabled).toBe(true);
    });

    it('GIVEN disabled form, WHEN pressed, THEN value does not change', async () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { agree: false }, disabled: true });
        return (
          <EtFormCheckbox name="agree" control={control}>
            <EtFormCheckbox.Control testID="checkbox-control" />
          </EtFormCheckbox>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      fireEvent.press(getByTestId('checkbox-control'));
      await waitFor(() => {
        expect(getByTestId('checkbox-value').props.children).toBe('false');
      });
    });

    it('GIVEN disabled prop on Control, WHEN form is enabled, THEN Control is still disabled', () => {
      function FormWithDisabledControl() {
        const { control } = useForm({ defaultValues: { agree: false } });
        return (
          <EtFormCheckbox name="agree" control={control}>
            <EtFormCheckbox.Control testID="checkbox-control" disabled />
          </EtFormCheckbox>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      expect(getByTestId('checkbox-control').props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Submission', () => {
    it('calls onSubmit with form data when valid', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ agree: true }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ agree: true }, undefined);
      });
    });

    it('does not call onSubmit when validation fails', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
