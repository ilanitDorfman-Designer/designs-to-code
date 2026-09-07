import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { EtFormChip } from './et-form-chip';

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

jest.mock('../components/controls/chips/et-chip', () => {
  const { Pressable: RNPressable, Text: RNText, View: RNView } = require('react-native');

  const MockLabel = ({ children, ...props }: any) => <RNText {...props}>{children}</RNText>;
  MockLabel.displayName = 'EtChip.Label';

  const MockIcon = ({ iconName, ...props }: any) => <RNView testID={`chip-icon-${iconName}`} {...props} />;
  MockIcon.displayName = 'EtChip.Icon';

  const MockChip = ({ selected, onPress, onSelectionChange, children, testID, disabled, ...rest }: any) => {
    const handlePress = () => {
      if (disabled) return;
      const next = !selected;
      onSelectionChange?.(next);
      onPress?.();
    };
    return (
      <RNPressable testID={testID || 'mock-chip'} onPress={handlePress} disabled={disabled} {...rest}>
        <RNText testID="chip-selected">{String(selected)}</RNText>
        {children}
      </RNPressable>
    );
  };

  MockChip.Label = MockLabel;
  MockChip.Icon = MockIcon;

  return { EtChip: MockChip };
});

function TestForm({
  onSubmit,
  defaultValues = { premium: false },
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
      <EtFormChip name="premium" control={control} rules={rules ?? { validate: (v: boolean) => v === true || 'Required' }}>
        <EtFormChip.Control testID="chip-control">
          <EtFormChip.Label>Premium</EtFormChip.Label>
        </EtFormChip.Control>
        <EtFormChip.ErrorMessage testID="error-msg" />
      </EtFormChip>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

describe('EtFormChip', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN a form, WHEN rendered, THEN chip control is visible', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('chip-control')).toBeTruthy();
    });

    it('GIVEN a label, WHEN rendered, THEN label text is visible', () => {
      const { getByText } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByText('Premium')).toBeTruthy();
    });
  });

  describe('Value Binding', () => {
    it('GIVEN default false, WHEN rendered, THEN underlying chip shows unselected', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('chip-selected').props.children).toBe('false');
    });

    it('GIVEN default true, WHEN rendered, THEN underlying chip shows selected', () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ premium: true }} />);
      expect(getByTestId('chip-selected').props.children).toBe('true');
    });

    it('GIVEN unselected chip, WHEN pressed, THEN chip becomes selected', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('chip-selected').props.children).toBe('false');

      fireEvent.press(getByTestId('chip-control'));

      await waitFor(() => {
        expect(getByTestId('chip-selected').props.children).toBe('true');
      });
    });

    it('GIVEN selected chip, WHEN pressed, THEN chip becomes unselected', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ premium: true }} />);
      expect(getByTestId('chip-selected').props.children).toBe('true');

      fireEvent.press(getByTestId('chip-control'));

      await waitFor(() => {
        expect(getByTestId('chip-selected').props.children).toBe('false');
      });
    });
  });

  describe('Custom onSelectionChange', () => {
    it('GIVEN custom onSelectionChange, WHEN pressed, THEN both RHF and custom handler run', async () => {
      const customHandler = jest.fn();

      function CustomForm() {
        const { control } = useForm({ defaultValues: { premium: false }, mode: 'onChange' });
        return (
          <EtFormChip name="premium" control={control}>
            <EtFormChip.Control testID="chip-control" onSelectionChange={customHandler}>
              <EtFormChip.Label>Premium</EtFormChip.Label>
            </EtFormChip.Control>
          </EtFormChip>
        );
      }

      const { getByTestId } = render(<CustomForm />);
      fireEvent.press(getByTestId('chip-control'));

      await waitFor(() => {
        expect(customHandler).toHaveBeenCalledWith(true);
        expect(getByTestId('chip-selected').props.children).toBe('true');
      });
    });
  });

  describe('Validation', () => {
    it('GIVEN required rule, WHEN submit without selecting, THEN error message appears', async () => {
      const { getByTestId, queryByTestId } = render(<TestForm onSubmit={mockOnSubmit} />);

      expect(queryByTestId('error-msg')).toBeNull();

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg')).toBeTruthy();
      });
    });

    it('GIVEN required rule, WHEN submit without selecting, THEN error text is displayed', async () => {
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
          defaultValues: { premium: false },
        });
        return (
          <>
            <EtFormChip name="premium" control={control} rules={{ validate: (v: boolean) => v === true || 'Required' }}>
              <EtFormChip.Control testID="chip-control">
                <EtFormChip.Label>Premium</EtFormChip.Label>
              </EtFormChip.Control>
              <EtFormChip.ErrorMessage testID="error-msg" />
            </EtFormChip>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
            <Pressable testID="clear" onPress={() => clearErrors('premium')} />
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
          defaultValues: { premium: false },
        });
        return (
          <>
            <EtFormChip name="premium" control={control} rules={{ validate: (v: boolean) => v === true || 'Select premium' }}>
              <EtFormChip.Control testID="chip-control">
                <EtFormChip.Label>Premium</EtFormChip.Label>
              </EtFormChip.Control>
              <EtFormChip.ErrorMessage
                render={({ message, error }) => (
                  <Text testID="custom-error">
                    {message}-{error.type}
                  </Text>
                )}
              />
            </EtFormChip>
            <Pressable testID="submit" onPress={handleSubmit(jest.fn())} />
          </>
        );
      }

      const { getByTestId } = render(<CustomRenderForm />);
      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        const customError = getByTestId('custom-error');
        expect(customError.props.children).toEqual(['Select premium', '-', 'validate']);
      });
    });
  });

  describe('Context error', () => {
    it('GIVEN no parent provider, WHEN Control rendered, THEN throws context error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(
          <EtFormChip.Control testID="orphan">
            <EtFormChip.Label>Orphan</EtFormChip.Label>
          </EtFormChip.Control>,
        );
      }).toThrow('EtFormChip sub-components must be used within <EtFormChip>');
      consoleSpy.mockRestore();
    });

    it('GIVEN no parent provider, WHEN ErrorMessage rendered, THEN throws context error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormChip.ErrorMessage testID="orphan" />);
      }).toThrow('EtFormChip sub-components must be used within <EtFormChip>');
      consoleSpy.mockRestore();
    });
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN rendered, THEN Control receives disabled=true from context', () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { premium: false }, disabled: true });
        return (
          <EtFormChip name="premium" control={control}>
            <EtFormChip.Control testID="chip-control">
              <EtFormChip.Label>Premium</EtFormChip.Label>
            </EtFormChip.Control>
          </EtFormChip>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      expect(getByTestId('chip-control').props.accessibilityState.disabled).toBe(true);
    });

    it('GIVEN disabled form, WHEN pressed, THEN value does not change', async () => {
      function DisabledForm() {
        const { control } = useForm({ defaultValues: { premium: false }, disabled: true });
        return (
          <EtFormChip name="premium" control={control}>
            <EtFormChip.Control testID="chip-control">
              <EtFormChip.Label>Premium</EtFormChip.Label>
            </EtFormChip.Control>
          </EtFormChip>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      fireEvent.press(getByTestId('chip-control'));
      await waitFor(() => {
        expect(getByTestId('chip-selected').props.children).toBe('false');
      });
    });

    it('GIVEN disabled prop on Control, WHEN form is enabled, THEN Control is still disabled', () => {
      function FormWithDisabledControl() {
        const { control } = useForm({ defaultValues: { premium: false } });
        return (
          <EtFormChip name="premium" control={control}>
            <EtFormChip.Control testID="chip-control" disabled>
              <EtFormChip.Label>Premium</EtFormChip.Label>
            </EtFormChip.Control>
          </EtFormChip>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      expect(getByTestId('chip-control').props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Submission', () => {
    it('GIVEN valid form, WHEN submitted, THEN onSubmit receives form data', async () => {
      const { getByTestId } = render(<TestForm onSubmit={mockOnSubmit} defaultValues={{ premium: true }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ premium: true }, undefined);
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
