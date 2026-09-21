import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

import { EtSelectionTileGroup } from '../components/controls/selection-tile-group/et-selection-tile-group';
import { FormField } from './form-field';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      statusNegative: 'red',
      textPrimaryNeutral: '#000',
      textSecondaryNeutral: '#666',
      textTertiaryNeutral: '#999',
      textQuaternaryNeutral: '#bbb',
      actionBrandText: '#00C176',
      bgNeutralGreyPrimary: '#f0f0f0',
      dividerPrimary: '#222',
    },
    gradients: {},
    fonts: {},
  }),
}));

jest.mock('../foundations/text/et-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { EtText: ({ children, ...props }: any) => React.createElement(Text, props, children) };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
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
// Test wrapper — provides RHF context
// ---------------------------------------------------------------------------

interface TestForm {
  name: string;
  age: number;
  accepted: boolean;
  tileIcon?: string | null;
  tileRadio?: string | null;
  tileToggle?: string | null;
  tileToggleMulti?: string[];
  tileToggleInput?: string[];
}

function TestHarness({
  defaultValues,
  children,
}: {
  defaultValues: Partial<TestForm>;
  children: (control: ReturnType<typeof useForm<TestForm>>['control']) => React.ReactNode;
}) {
  const { control } = useForm<TestForm>({ defaultValues, mode: 'onChange' });
  return <View>{children(control)}</View>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FormField', () => {
  describe('Rendering', () => {
    it('GIVEN a field WHEN rendered THEN passes value to children', () => {
      const { getByText } = render(
        <TestHarness defaultValues={{ name: 'John', age: 25, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control}>
              {(field) => <Text testID="value">{field.value}</Text>}
            </FormField>
          )}
        </TestHarness>,
      );

      expect(getByText('John')).toBeTruthy();
    });

    it('GIVEN a field WHEN onChange called THEN updates value', async () => {
      const { getByTestId } = render(
        <TestHarness defaultValues={{ name: '', age: 0, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control}>
              {(field) => <TextInput testID="input" value={field.value} onChangeText={field.onChange} />}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.changeText(getByTestId('input'), 'Jane');

      await waitFor(() => {
        expect(getByTestId('input').props.value).toBe('Jane');
      });
    });
  });

  describe('Error display', () => {
    it('GIVEN required rule WHEN field is empty THEN shows default error text', async () => {
      const { getByTestId, getByText } = render(
        <TestHarness defaultValues={{ name: '', age: 0, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control} rules={{ required: 'Name is required' }}>
              {(field) => <TextInput testID="input" value={field.value} onChangeText={field.onChange} />}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.changeText(getByTestId('input'), 'a');
      fireEvent.changeText(getByTestId('input'), '');

      await waitFor(() => {
        expect(getByText('Name is required')).toBeTruthy();
      });
    });

    it('GIVEN showError=false WHEN error exists THEN does not render error text', async () => {
      const { getByTestId, queryByText } = render(
        <TestHarness defaultValues={{ name: '', age: 0, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control} rules={{ required: 'Required' }} showError={false}>
              {(field) => <TextInput testID="input" value={field.value} onChangeText={field.onChange} />}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.changeText(getByTestId('input'), 'a');
      fireEvent.changeText(getByTestId('input'), '');

      await waitFor(() => {
        expect(queryByText('Required')).toBeNull();
      });
    });

    it('GIVEN renderError WHEN error exists THEN uses custom renderer', async () => {
      const { getByTestId, getByText } = render(
        <TestHarness defaultValues={{ name: '', age: 0, accepted: false }}>
          {(control) => (
            <FormField
              name="name"
              control={control}
              rules={{ required: 'Required' }}
              renderError={(err) => <Text testID="custom-error">Custom: {err.message}</Text>}
            >
              {(field) => <TextInput testID="input" value={field.value} onChangeText={field.onChange} />}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.changeText(getByTestId('input'), 'a');
      fireEvent.changeText(getByTestId('input'), '');

      await waitFor(() => {
        expect(getByText('Custom: Required')).toBeTruthy();
      });
    });

    it('GIVEN error exists WHEN children receive error arg THEN error is accessible', async () => {
      const { getByTestId, getByText } = render(
        <TestHarness defaultValues={{ name: '', age: 0, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control} rules={{ required: 'Required' }} showError={false}>
              {(field, error) => (
                <View>
                  <TextInput testID="input" value={field.value} onChangeText={field.onChange} />
                  {error && <Text testID="inline-error">{error.message}</Text>}
                </View>
              )}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.changeText(getByTestId('input'), 'a');
      fireEvent.changeText(getByTestId('input'), '');

      await waitFor(() => {
        expect(getByText('Required')).toBeTruthy();
      });
    });
  });

  describe('Disabled state', () => {
    it('GIVEN a standard form, WHEN rendered, THEN field.disabled is boolean false', () => {
      const { getByTestId } = render(
        <TestHarness defaultValues={{ name: 'test', age: 0, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control}>
              {(field) => <Text testID="disabled-value">{String(field.disabled)}</Text>}
            </FormField>
          )}
        </TestHarness>,
      );
      expect(getByTestId('disabled-value').props.children).toBe('false');
    });

    it('GIVEN a disabled form, WHEN rendered, THEN field.disabled is boolean true', () => {
      function DisabledHarness() {
        const { control } = useForm<TestForm>({ defaultValues: { name: '', age: 0, accepted: false }, disabled: true });
        return (
          <View>
            <FormField name="name" control={control}>
              {(field) => <Text testID="disabled-value">{String(field.disabled)}</Text>}
            </FormField>
          </View>
        );
      }
      const { getByTestId } = render(<DisabledHarness />);
      expect(getByTestId('disabled-value').props.children).toBe('true');
    });
  });

  describe('Style', () => {
    it('GIVEN style prop WHEN rendered THEN applies to wrapper View', () => {
      const { toJSON } = render(
        <TestHarness defaultValues={{ name: '', age: 0, accepted: false }}>
          {(control) => (
            <FormField name="name" control={control} style={{ marginTop: 16 }}>
              {(field) => <Text>{field.value}</Text>}
            </FormField>
          )}
        </TestHarness>,
      );

      const tree = toJSON() as any;
      const formFieldView = tree.children[0];
      expect(formFieldView.props.style).toEqual({ marginTop: 16 });
    });
  });

  describe('EtSelectionTileGroup integration', () => {
    it('works with FormField in icon variant', async () => {
      const { getByTestId } = render(
        <TestHarness defaultValues={{ tileIcon: null }}>
          {(control) => (
            <FormField name="tileIcon" control={control}>
              {(field) => (
                <EtSelectionTileGroup value={(field.value as string | null) ?? null} onChange={(value) => field.onChange(value)}>
                  <EtSelectionTileGroup.Option value="stocks" testID="icon-stocks">
                    Stocks
                  </EtSelectionTileGroup.Option>
                  <EtSelectionTileGroup.Option value="crypto" testID="icon-crypto">
                    Crypto
                  </EtSelectionTileGroup.Option>
                </EtSelectionTileGroup>
              )}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.press(getByTestId('icon-crypto'));

      await waitFor(() => {
        expect(getByTestId('icon-crypto').props.accessibilityState.selected).toBe(true);
        expect(getByTestId('icon-stocks').props.accessibilityState.selected).toBe(false);
      });
    });

    it('works with FormField in radio variant', async () => {
      const { getByTestId } = render(
        <TestHarness defaultValues={{ tileRadio: null }}>
          {(control) => (
            <FormField name="tileRadio" control={control}>
              {(field) => (
                <EtSelectionTileGroup variant="radio" value={(field.value as string | null) ?? null} onChange={(value) => field.onChange(value)}>
                  <EtSelectionTileGroup.Option value="moderate" testID="radio-moderate">
                    Moderate
                  </EtSelectionTileGroup.Option>
                  <EtSelectionTileGroup.Option value="aggressive" testID="radio-aggressive">
                    Aggressive
                  </EtSelectionTileGroup.Option>
                </EtSelectionTileGroup>
              )}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.press(getByTestId('radio-aggressive'));

      await waitFor(() => {
        expect(getByTestId('radio-aggressive').props.accessibilityState.selected).toBe(true);
        expect(getByTestId('radio-moderate').props.accessibilityState.selected).toBe(false);
      });
    });

    it('works with FormField in toggle variant (single)', async () => {
      const { getByTestId } = render(
        <TestHarness defaultValues={{ tileToggle: null }}>
          {(control) => (
            <FormField name="tileToggle" control={control}>
              {(field) => (
                <EtSelectionTileGroup variant="toggle" value={(field.value as string | null) ?? null} onChange={(value) => field.onChange(value)}>
                  <EtSelectionTileGroup.Option value="pep" testID="toggle-pep">
                    PEP
                  </EtSelectionTileGroup.Option>
                  <EtSelectionTileGroup.Option value="insider" testID="toggle-insider">
                    Insider
                  </EtSelectionTileGroup.Option>
                </EtSelectionTileGroup>
              )}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.press(getByTestId('toggle-pep'));

      await waitFor(() => {
        expect(getByTestId('toggle-pep').props.accessibilityState.selected).toBe(true);
      });
    });

    it('works with FormField in toggle variant (multi) even when field starts undefined', async () => {
      const { getByTestId } = render(
        <TestHarness defaultValues={{}}>
          {(control) => (
            <FormField name="tileToggleMulti" control={control}>
              {(field) => (
                <EtSelectionTileGroup
                  variant="toggle"
                  selectionMode="multi"
                  value={field.value as string[]}
                  onChange={(value) => field.onChange(value)}
                >
                  <EtSelectionTileGroup.Option value="director" testID="toggle-multi-director">
                    Director
                  </EtSelectionTileGroup.Option>
                  <EtSelectionTileGroup.Option value="brokerage" testID="toggle-multi-brokerage">
                    Brokerage
                  </EtSelectionTileGroup.Option>
                </EtSelectionTileGroup>
              )}
            </FormField>
          )}
        </TestHarness>,
      );

      fireEvent.press(getByTestId('toggle-multi-director'));

      await waitFor(() => {
        expect(getByTestId('toggle-multi-director').props.accessibilityState.selected).toBe(true);
      });
    });

    it('works with FormField in toggleInput variant and shows inline input on selection', async () => {
      const { getByTestId, queryByTestId } = render(
        <TestHarness defaultValues={{}}>
          {(control) => (
            <FormField name="tileToggleInput" control={control}>
              {(field) => (
                <EtSelectionTileGroup
                  variant="toggleInput"
                  selectionMode="multi"
                  value={field.value as string[]}
                  onChange={(value) => field.onChange(value)}
                >
                  <EtSelectionTileGroup.Option
                    value="director"
                    testID="toggle-input-director"
                    input={{
                      label: 'Please enter stock ticker',
                      fieldProps: {
                        testID: 'toggle-input-field',
                        placeholder: 'AAPL',
                      },
                    }}
                  >
                    A director or a 10% shareholder of a publicly traded corporation.
                  </EtSelectionTileGroup.Option>
                </EtSelectionTileGroup>
              )}
            </FormField>
          )}
        </TestHarness>,
      );

      expect(queryByTestId('toggle-input-field')).toBeNull();

      fireEvent.press(getByTestId('toggle-input-director'));

      await waitFor(() => {
        expect(queryByTestId('toggle-input-field')).toBeTruthy();
        expect(getByTestId('toggle-input-director').props.accessibilityState.selected).toBe(true);
      });
    });
  });
});
