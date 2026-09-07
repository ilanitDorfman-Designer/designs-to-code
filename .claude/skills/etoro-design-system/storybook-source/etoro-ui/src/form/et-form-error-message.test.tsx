import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Text } from 'react-native';

import { EtFormCheckbox } from './et-form-checkbox';
import { EtFormErrorMessage } from './et-form-error-message';

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
  const MockCheckbox = ({ value, onChange, children, testID, ...rest }: any) => (
    <RNPressable testID={testID || 'mock-checkbox'} onPress={() => onChange(value !== true)} {...rest}>
      {children}
    </RNPressable>
  );
  MockCheckbox.Label = MockLabel;
  return { EtCheckbox: MockCheckbox };
});

jest.mock('../components/controls/radio-group/et-radio-group', () => {
  const { Pressable: RNPressable, Text: RNText } = require('react-native');
  const MockOption = ({ value, testID }: any) => <RNText testID={testID}>{value}</RNText>;
  const MockRadioGroup = ({ onChange, children, testID }: any) => (
    <RNPressable testID={testID || 'mock-radio'} onPress={() => onChange('optionA')}>
      {children}
    </RNPressable>
  );
  MockRadioGroup.Option = MockOption;
  return { EtRadioGroup: MockRadioGroup };
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function CheckboxForm({ names, mode }: { names: string[]; mode?: 'first' | 'all' }) {
  const methods = useForm<{ agree: boolean; notify: boolean }>({
    defaultValues: { agree: false, notify: false },
    mode: 'onSubmit',
  });
  const { control, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <EtFormErrorMessage names={names}>
        <EtFormCheckbox name="agree" control={control} rules={{ validate: (v) => Boolean(v) || 'agree is required' }}>
          <EtFormCheckbox.Control testID="checkbox-agree" />
        </EtFormCheckbox>

        <EtFormCheckbox name="notify" control={control} rules={{ validate: (v) => Boolean(v) || 'notify is required' }}>
          <EtFormCheckbox.Control testID="checkbox-notify" />
        </EtFormCheckbox>

        <EtFormErrorMessage.Text mode={mode} testID="shared-error" />
      </EtFormErrorMessage>

      <Text testID="submit" onPress={handleSubmit(() => {})} accessibilityRole="button">
        Submit
      </Text>
    </FormProvider>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('EtFormErrorMessage', () => {
  describe('Text — renders nothing when no errors', () => {
    it('returns null before submit', () => {
      const { queryByTestId } = render(<CheckboxForm names={['agree', 'notify']} />);
      expect(queryByTestId('shared-error')).toBeNull();
    });
  });

  describe('Text — mode="first"', () => {
    it('shows only the first error after submit', async () => {
      const { getByTestId, queryAllByText } = render(<CheckboxForm names={['agree', 'notify']} mode="first" />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(queryAllByText('agree is required')).toHaveLength(1);
        expect(queryAllByText('notify is required')).toHaveLength(0);
      });
    });
  });

  describe('Text — mode="all"', () => {
    it('shows all errors after submit', async () => {
      const { getByTestId, queryAllByText } = render(<CheckboxForm names={['agree', 'notify']} mode="all" />);

      fireEvent.press(getByTestId('submit'));

      await waitFor(() => {
        expect(queryAllByText('agree is required')).toHaveLength(1);
        expect(queryAllByText('notify is required')).toHaveLength(1);
      });
    });
  });

  describe('Text — render prop', () => {
    it('calls render prop with errors array', async () => {
      function CustomForm() {
        const m = useForm<{ agree: boolean }>({
          defaultValues: { agree: false },
          mode: 'onSubmit',
        });
        const { control, handleSubmit } = m;

        return (
          <FormProvider {...m}>
            <EtFormErrorMessage names={['agree']}>
              <EtFormCheckbox name="agree" control={control} rules={{ validate: (v) => Boolean(v) || 'custom error' }}>
                <EtFormCheckbox.Control testID="checkbox-agree2" />
              </EtFormCheckbox>
              <EtFormErrorMessage.Text render={({ errors }) => <Text testID="custom-render">{errors.map((e) => e.message).join(', ')}</Text>} />
            </EtFormErrorMessage>
            <Text testID="submit2" onPress={handleSubmit(() => {})} accessibilityRole="button">
              Submit
            </Text>
          </FormProvider>
        );
      }

      const { getByTestId } = render(<CustomForm />);
      fireEvent.press(getByTestId('submit2'));

      await waitFor(() => {
        expect(getByTestId('custom-render').props.children).toBe('custom error');
      });
    });
  });

  describe('Text — missing field names silently skipped', () => {
    it('does not throw for field names not in the form', async () => {
      function FormWithUnknown() {
        const m = useForm<{ agree: boolean }>({
          defaultValues: { agree: false },
          mode: 'onSubmit',
        });
        const { control, handleSubmit } = m;
        return (
          <FormProvider {...m}>
            <EtFormErrorMessage names={['agree', 'nonExistentField']}>
              <EtFormCheckbox name="agree" control={control} rules={{ validate: (v) => Boolean(v) || 'agree error' }}>
                <EtFormCheckbox.Control testID="checkbox-agree3" />
              </EtFormCheckbox>
              <EtFormErrorMessage.Text mode="all" testID="unknown-error" />
            </EtFormErrorMessage>
            <Text testID="submit3" onPress={handleSubmit(() => {})} accessibilityRole="button">
              Submit
            </Text>
          </FormProvider>
        );
      }

      const { getByTestId, queryAllByText } = render(<FormWithUnknown />);
      fireEvent.press(getByTestId('submit3'));

      await waitFor(() => {
        expect(queryAllByText('agree error')).toHaveLength(1);
      });
    });
  });

  describe('context error outside provider', () => {
    it('throws when Text is used outside EtFormErrorMessage', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      function InvalidComponent() {
        const methods = useForm();
        return (
          <FormProvider {...methods}>
            <EtFormErrorMessage.Text />
          </FormProvider>
        );
      }

      expect(() => render(<InvalidComponent />)).toThrow('EtFormErrorMessage sub-components must be used within <EtFormErrorMessage>');

      consoleError.mockRestore();
    });
  });

  describe('nested path support', () => {
    it('reads errors via dot notation', async () => {
      function SimpleNestedForm() {
        const m = useForm<{ address: { city: string } }>({
          defaultValues: { address: { city: '' } },
          mode: 'onSubmit',
        });
        const { setError } = m;
        React.useEffect(() => {
          setError('address.city', {
            type: 'required',
            message: 'City is required',
          });
        }, [setError]);
        return (
          <FormProvider {...m}>
            <EtFormErrorMessage names={['address.city']}>
              <EtFormErrorMessage.Text testID="nested-error2" />
            </EtFormErrorMessage>
          </FormProvider>
        );
      }

      const { getByTestId: getByTestId2 } = render(<SimpleNestedForm />);

      await waitFor(() => {
        expect(getByTestId2('nested-error2')).toBeTruthy();
      });
    });
  });
});
