import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { type RegisterOptions, type SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput } from 'react-native';

import { EtFormSelectionTileGroup } from './et-form-selection-tile-group';

jest.mock('../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: { statusNegative: 'red', textPrimaryNeutral: '#000', textSecondaryNeutral: '#666', textTertiaryNeutral: '#999' },
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

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    Easing: {
      bezier: jest.fn(() => jest.fn()),
      out: jest.fn((fn: unknown) => fn),
      cubic: jest.fn((t: number) => t),
      ease: jest.fn((v: number) => v),
    },
    useSharedValue: jest.fn((v: number) => {
      let currentValue = v;
      return {
        get value() {
          return currentValue;
        },
        set value(nextValue: number) {
          currentValue = nextValue;
        },
        get: jest.fn(() => currentValue),
        set: jest.fn((nextValue: number) => {
          currentValue = nextValue;
        }),
      };
    }),
    useAnimatedStyle: jest.fn((fn: () => object) => fn()),
    useDerivedValue: jest.fn((fn: () => number) => ({ value: fn() })),
    withTiming: jest.fn((v: number) => v),
    interpolate: jest.fn((v: number, _input: number[], output: number[]) => (v === 0 ? output[0] : output[1])),
    interpolateColor: jest.fn((_v: number, _input: number[], output: string[]) => output[0]),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { Switch } = require('react-native');
  return { Switch };
});

// ---------------------------------------------------------------------------
// Single-select test form
// ---------------------------------------------------------------------------

type SingleFormValues = { color: string };

function SingleTestForm({
  onSubmit,
  defaultValues = { color: '' },
  rules,
}: {
  onSubmit: SubmitHandler<SingleFormValues>;
  defaultValues?: Partial<SingleFormValues>;
  rules?: RegisterOptions<SingleFormValues, 'color'>;
}) {
  const { control, handleSubmit } = useForm<SingleFormValues>({
    defaultValues,
    mode: 'onChange',
  });
  return (
    <>
      <EtFormSelectionTileGroup name="color" control={control} rules={rules ?? { required: 'Pick a color' }}>
        <EtFormSelectionTileGroup.Control testID="tile-group">
          <EtFormSelectionTileGroup.Option value="red" testID="opt-red">
            Red
          </EtFormSelectionTileGroup.Option>
          <EtFormSelectionTileGroup.Option value="blue" testID="opt-blue">
            Blue
          </EtFormSelectionTileGroup.Option>
        </EtFormSelectionTileGroup.Control>
        <EtFormSelectionTileGroup.ErrorMessage testID="error-msg" />
      </EtFormSelectionTileGroup>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Multi-select test form
// ---------------------------------------------------------------------------

type MultiFormValues = { tags: string[] };

function MultiTestForm({
  onSubmit,
  defaultValues = { tags: [] },
}: {
  onSubmit: SubmitHandler<MultiFormValues>;
  defaultValues?: Partial<MultiFormValues>;
}) {
  const { control, handleSubmit } = useForm<MultiFormValues>({
    defaultValues,
    mode: 'onChange',
  });
  return (
    <>
      <EtFormSelectionTileGroup name="tags" control={control}>
        <EtFormSelectionTileGroup.Control variant="toggle" selectionMode="multi" testID="multi-group">
          <EtFormSelectionTileGroup.Option value="a" testID="opt-a">
            Tag A
          </EtFormSelectionTileGroup.Option>
          <EtFormSelectionTileGroup.Option value="b" testID="opt-b">
            Tag B
          </EtFormSelectionTileGroup.Option>
          <EtFormSelectionTileGroup.Option value="c" testID="opt-c">
            Tag C
          </EtFormSelectionTileGroup.Option>
        </EtFormSelectionTileGroup.Control>
      </EtFormSelectionTileGroup>
      <Pressable testID="submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EtFormSelectionTileGroup', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without errors', () => {
      const { getByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('tile-group')).toBeTruthy();
    });

    it('renders option labels', () => {
      const { getByText } = render(<SingleTestForm onSubmit={mockOnSubmit} />);
      expect(getByText('Red')).toBeTruthy();
      expect(getByText('Blue')).toBeTruthy();
    });
  });

  describe('Value Binding — single select', () => {
    it('passes default value to underlying tile group', () => {
      const { getByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} defaultValues={{ color: 'red' }} />);
      expect(getByTestId('opt-red').props.accessibilityState.selected).toBe(true);
      expect(getByTestId('opt-blue').props.accessibilityState.selected).toBe(false);
    });

    it('no option selected when default is empty', () => {
      const { getByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('opt-red').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('opt-blue').props.accessibilityState.selected).toBe(false);
    });

    it('updates value when option is pressed', async () => {
      const { getByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('opt-blue'));

      await waitFor(() => {
        expect(getByTestId('opt-blue').props.accessibilityState.selected).toBe(true);
      });
    });
  });

  describe('Value Binding — multi select', () => {
    it('renders with default values', () => {
      const { getByTestId } = render(<MultiTestForm onSubmit={mockOnSubmit} defaultValues={{ tags: ['a', 'c'] }} />);
      expect(getByTestId('opt-a').props.accessibilityState.selected).toBe(true);
      expect(getByTestId('opt-b').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('opt-c').props.accessibilityState.selected).toBe(true);
    });

    it('renders with empty default', () => {
      const { getByTestId } = render(<MultiTestForm onSubmit={mockOnSubmit} />);
      expect(getByTestId('opt-a').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('opt-b').props.accessibilityState.selected).toBe(false);
    });
  });

  describe('toggleInput variant', () => {
    it('supports toggleInput variant with inline input visibility', async () => {
      function ToggleInputTestForm() {
        const { control } = useForm({
          defaultValues: { tags: [] as string[] },
          mode: 'onChange',
        });

        return (
          <EtFormSelectionTileGroup name="tags" control={control}>
            <EtFormSelectionTileGroup.Control variant="toggleInput" selectionMode="multi" testID="toggle-input-group">
              <EtFormSelectionTileGroup.Option
                value="director"
                testID="opt-director"
                input={{ fieldProps: { testID: 'director-input', placeholder: 'Please enter stock ticker' } }}
              >
                A director or a 10% shareholder of a publicly traded corporation.
              </EtFormSelectionTileGroup.Option>
              <EtFormSelectionTileGroup.Option value="brokerage" testID="opt-brokerage">
                Employed by a brokerage firm or securities exchange.
              </EtFormSelectionTileGroup.Option>
            </EtFormSelectionTileGroup.Control>
          </EtFormSelectionTileGroup>
        );
      }

      const { getByTestId, queryByTestId, UNSAFE_queryAllByType } = render(<ToggleInputTestForm />);

      expect(queryByTestId('director-input')).toBeNull();
      expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(0);

      fireEvent.press(getByTestId('opt-director'));
      await waitFor(() => {
        expect(queryByTestId('director-input')).toBeTruthy();
        expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(1);
      });

      fireEvent.press(getByTestId('opt-brokerage'));
      await waitFor(() => {
        expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(1);
      });

      fireEvent.press(getByTestId('opt-brokerage'));
      await waitFor(() => {
        expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(1);
      });

      fireEvent.press(getByTestId('opt-director'));
      await waitFor(() => {
        expect(queryByTestId('director-input')).toBeNull();
        expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(0);
      });
    });
  });

  describe('Validation', () => {
    it('shows error message after failed validation', async () => {
      const { getByTestId, queryByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} />);

      expect(queryByTestId('error-msg')).toBeNull();

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg')).toBeTruthy();
      });
    });

    it('displays the validation message text', async () => {
      const { getByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(getByTestId('error-msg').props.children).toBe('Pick a color');
      });
    });
  });

  describe('ErrorMessage', () => {
    it('renders null when no error exists', () => {
      const { queryByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} />);
      expect(queryByTestId('error-msg')).toBeNull();
    });

    it('hides error when error is cleared', async () => {
      function HidesErrorForm() {
        const { control, handleSubmit, clearErrors } = useForm({
          defaultValues: { color: '' },
        });
        return (
          <>
            <EtFormSelectionTileGroup name="color" control={control} rules={{ required: 'Pick a color' }}>
              <EtFormSelectionTileGroup.Control>
                <EtFormSelectionTileGroup.Option value="red">Red</EtFormSelectionTileGroup.Option>
              </EtFormSelectionTileGroup.Control>
              <EtFormSelectionTileGroup.ErrorMessage testID="error-msg" />
            </EtFormSelectionTileGroup>
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
            <EtFormSelectionTileGroup name="color" control={control} rules={{ required: 'Select one' }}>
              <EtFormSelectionTileGroup.Control>
                <EtFormSelectionTileGroup.Option value="red">Red</EtFormSelectionTileGroup.Option>
              </EtFormSelectionTileGroup.Control>
              <EtFormSelectionTileGroup.ErrorMessage
                render={({ message, error }) => (
                  <Text testID="custom-error">
                    {message}-{error.type}
                  </Text>
                )}
              />
            </EtFormSelectionTileGroup>
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
    it('throws when Control is used outside EtFormSelectionTileGroup', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(
          <EtFormSelectionTileGroup.Control>
            <EtFormSelectionTileGroup.Option value="x">X</EtFormSelectionTileGroup.Option>
          </EtFormSelectionTileGroup.Control>,
        );
      }).toThrow('EtFormSelectionTileGroup sub-components must be used within <EtFormSelectionTileGroup>');
      consoleSpy.mockRestore();
    });

    it('throws when ErrorMessage is used outside EtFormSelectionTileGroup', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<EtFormSelectionTileGroup.ErrorMessage testID="orphan" />);
      }).toThrow('EtFormSelectionTileGroup sub-components must be used within <EtFormSelectionTileGroup>');
      consoleSpy.mockRestore();
    });
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN option pressed, THEN value does not change', async () => {
      function DisabledForm() {
        const { control } = useForm<SingleFormValues>({ defaultValues: { color: '' }, disabled: true });
        return (
          <EtFormSelectionTileGroup name="color" control={control}>
            <EtFormSelectionTileGroup.Control testID="tile-group">
              <EtFormSelectionTileGroup.Option value="red" testID="opt-red">
                Red
              </EtFormSelectionTileGroup.Option>
            </EtFormSelectionTileGroup.Control>
          </EtFormSelectionTileGroup>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      fireEvent.press(getByTestId('opt-red'));
      await waitFor(() => {
        expect(getByTestId('opt-red').props.accessibilityState.selected).toBe(false);
      });
    });

    it('GIVEN disabled prop on Control, WHEN option pressed, THEN value does not change', async () => {
      function FormWithDisabledControl() {
        const { control } = useForm<SingleFormValues>({ defaultValues: { color: '' } });
        return (
          <EtFormSelectionTileGroup name="color" control={control}>
            <EtFormSelectionTileGroup.Control testID="tile-group" disabled>
              <EtFormSelectionTileGroup.Option value="red" testID="opt-red">
                Red
              </EtFormSelectionTileGroup.Option>
            </EtFormSelectionTileGroup.Control>
          </EtFormSelectionTileGroup>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      fireEvent.press(getByTestId('opt-red'));
      await waitFor(() => {
        expect(getByTestId('opt-red').props.accessibilityState.selected).toBe(false);
      });
    });
  });

  describe('Submission', () => {
    it('submits with selected single value', async () => {
      const { getByTestId } = render(<SingleTestForm onSubmit={mockOnSubmit} defaultValues={{ color: 'blue' }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ color: 'blue' }, undefined);
      });
    });

    it('submits with multi-select values', async () => {
      const { getByTestId } = render(<MultiTestForm onSubmit={mockOnSubmit} defaultValues={{ tags: ['a', 'c'] }} />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ tags: ['a', 'c'] }, undefined);
      });
    });
  });
});
