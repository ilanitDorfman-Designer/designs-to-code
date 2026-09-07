import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { EtFormToggleSwitch } from './et-form-toggle-switch';

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

jest.mock('../components/controls/toggle-switch', () => {
  const { Pressable: RNPressable, Text: RNText } = require('react-native');

  const MockToggleSwitch = ({ value, onValueChange, testID, disabled, ...rest }: any) => (
    <RNPressable testID={testID || 'mock-toggle'} onPress={() => !disabled && onValueChange(!value)} disabled={disabled} {...rest}>
      <RNText testID="toggle-value">{String(value)}</RNText>
    </RNPressable>
  );

  return { EtToggleSwitch: MockToggleSwitch };
});

function TestForm({
  onSubmit,
  defaultValues = { notifications: false },
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
      <EtFormToggleSwitch name="notifications" control={control} rules={rules ?? { validate: (v: boolean) => v === true || 'Required' }}>
        <EtFormToggleSwitch.Control testID="toggle-control" />
        <EtFormToggleSwitch.ErrorMessage testID="error-msg" />
      </EtFormToggleSwitch>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

describe('EtFormToggleSwitch', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN a form, WHEN rendered, THEN toggle control is visible', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('toggle-control')).toBeTruthy();
    });
  });

  describe('Value Binding', () => {
    it('GIVEN default false, WHEN rendered, THEN underlying toggle shows false', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('toggle-value').props.children).toBe('false');
    });

    it('GIVEN default true, WHEN rendered, THEN underlying toggle shows true', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ notifications: true }} />);
      expect(getByTestId('toggle-value').props.children).toBe('true');
    });

    it('GIVEN false value, WHEN toggle pressed, THEN value becomes true', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('toggle-value').props.children).toBe('false');

      fireEvent.press(getByTestId('toggle-control'));

      await waitFor(() => {
        expect(getByTestId('toggle-value').props.children).toBe('true');
      });
    });
  });

  describe('Custom onValueChange', () => {
    it('GIVEN custom onValueChange, WHEN toggled, THEN both RHF and custom handler run', async () => {
      const customHandler = jest.fn();

      function CustomForm() {
        const { control } = useForm({ defaultValues: { notifications: false }, mode: 'onChange' });
        return (
          <EtFormToggleSwitch name="notifications" control={control}>
            <EtFormToggleSwitch.Control testID="toggle-control" onValueChange={customHandler} />
          </EtFormToggleSwitch>
        );
      }

      const { getByTestId } = render(<CustomForm />);
      fireEvent.press(getByTestId('toggle-control'));

      await waitFor(() => {
        expect(customHandler).toHaveBeenCalledWith(true);
        expect(getByTestId('toggle-value').props.children).toBe('true');
      });
    });
  });

  describe('Validation', () => {
    it('GIVEN required rule, WHEN submit without toggling, THEN error message appears', async () => {
      const { getByTestId, queryByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      expect(queryByTestId('error-msg')).toBeNull();

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg')).toBeTruthy();
      });
    });

    it('GIVEN required rule, WHEN submit without toggling, THEN error text is displayed', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg').props.children).toBe('Required');
      });
    });
  });

  describe('ErrorMessage', () => {
    it('GIVEN no error, WHEN rendered, THEN error message is null', () => {
      const { queryByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(queryByTestId('error-msg')).toBeNull();
    });

    it('GIVEN error shown, WHEN error cleared, THEN error message disappears', async () => {
      function HidesErrorForm() {
        const { control, handleSubmit, clearErrors } = useForm({
          defaultValues: { notifications: false },
        });
        return (
          <>
            <EtFormToggleSwitch name="notifications" control={control} rules={{ validate: (v: boolean) => v === true || 'Required' }}>
              <EtFormToggleSwitch.Control testID="toggle-control" />
              <EtFormToggleSwitch.ErrorMessage testID="error-msg" />
            </EtFormToggleSwitch>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
            <Pressable testID="clear" onPress={() => clearErrors('notifications')} />
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
    it('GIVEN custom render, WHEN validation fails, THEN custom renderer receives error data', async () => {
      function CustomRenderForm() {
        const { control, handleSubmit } = useForm({
          defaultValues: { notifications: false },
        });
        return (
          <>
            <EtFormToggleSwitch name="notifications" control={control} rules={{ validate: (v: boolean) => v === true || 'Enable notifications' }}>
              <EtFormToggleSwitch.Control testID="toggle-control" />
              <EtFormToggleSwitch.ErrorMessage
                render={({ message, error }) => (
                  <Text testID="custom-error">
                    {message}-{error.type}
                  </Text>
                )}
              />
            </EtFormToggleSwitch>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
          </>
        );
      }

      const { getByTestId } = render(<CustomRenderForm />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        const customError = getByTestId('custom-error');
        expect(customError.props.children).toEqual(['Enable notifications', '-', 'validate']);
      });
    });
  });

  describe('Context error', () => {
    it('GIVEN no parent provider, WHEN Control rendered, THEN throws context error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormToggleSwitch.Control testID="orphan" />);
      }).toThrow('EtFormToggleSwitch sub-components must be used within <EtFormToggleSwitch>');
      consoleSpy.mockRestore();
    });

    it('GIVEN no parent provider, WHEN ErrorMessage rendered, THEN throws context error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormToggleSwitch.ErrorMessage testID="orphan" />);
      }).toThrow('EtFormToggleSwitch sub-components must be used within <EtFormToggleSwitch>');
      consoleSpy.mockRestore();
    });
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN rendered, THEN Control receives disabled=true from context', () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { notifications: false }, disabled: true });
        return (
          <EtFormToggleSwitch name="notifications" control={control}>
            <EtFormToggleSwitch.Control testID="toggle-control" />
          </EtFormToggleSwitch>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      expect(getByTestId('toggle-control').props.accessibilityState.disabled).toBe(true);
    });

    it('GIVEN disabled form, WHEN pressed, THEN value does not change', async () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { notifications: false }, disabled: true });
        return (
          <EtFormToggleSwitch name="notifications" control={control}>
            <EtFormToggleSwitch.Control testID="toggle-control" />
          </EtFormToggleSwitch>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      fireEvent.press(getByTestId('toggle-control'));
      await waitFor(() => {
        expect(getByTestId('toggle-value').props.children).toBe('false');
      });
    });

    it('GIVEN disabled prop on Control, WHEN form is enabled, THEN Control is still disabled', () => {
      function FormWithDisabledControl() {
        const { control } = useForm({ defaultValues: { notifications: false } });
        return (
          <EtFormToggleSwitch name="notifications" control={control}>
            <EtFormToggleSwitch.Control testID="toggle-control" disabled />
          </EtFormToggleSwitch>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      expect(getByTestId('toggle-control').props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Submission', () => {
    it('GIVEN valid form, WHEN submitted, THEN onSubmit receives form data', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ notifications: true }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ notifications: true }, undefined);
      });
    });

    it('GIVEN invalid form, WHEN submitted, THEN onSubmit is not called', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
