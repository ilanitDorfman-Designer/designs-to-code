import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';

import { EtFormRadio } from './et-form-radio';

jest.mock('../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: { statusNegative: 'red', textPrimaryNeutral: '#000' },
    gradients: {},
    fonts: {},
  })),
}));

jest.mock('../components/controls/radio-group/components/radio-indicator', () => {
  const ReactModule = require('react');
  const { View, Text } = require('react-native');
  return {
    RadioIndicator: ({ selected, disabled, error }: { selected: boolean; disabled: boolean; error: boolean }) =>
      ReactModule.createElement(
        View,
        {
          testID: 'radio-indicator',
          accessibilityLabel: 'radio-indicator',
          accessibilityState: { selected, disabled, checked: selected },
        },
        ReactModule.createElement(Text, { testID: 'radio-indicator-state' }, `${selected}-${disabled}-${error}`),
      ),
  };
});

function TestForm({ defaultValue = false }: { defaultValue?: boolean }) {
  const { control } = useForm<{ r: boolean }>({ defaultValues: { r: defaultValue } });
  return (
    <EtFormRadio name="r" control={control}>
      <EtFormRadio.Control disabled={false} />
    </EtFormRadio>
  );
}

describe('EtFormRadio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN default false, WHEN rendered, THEN RadioIndicator shows unselected', () => {
    const { getByTestId } = render(<TestForm defaultValue={false} />);
    expect(getByTestId('radio-indicator-state').props.children).toBe('false-false-false');
  });

  it('GIVEN default true, WHEN rendered, THEN RadioIndicator shows selected', () => {
    const { getByTestId } = render(<TestForm defaultValue={true} />);
    expect(getByTestId('radio-indicator-state').props.children).toBe('true-false-false');
  });

  describe('Disabled state', () => {
    it('GIVEN disabled form, WHEN rendered, THEN RadioIndicator receives disabled=true from context', () => {
      function DisabledForm() {
        const { control } = useForm<{ r: boolean }>({ defaultValues: { r: false }, disabled: true });
        return (
          <EtFormRadio name="r" control={control}>
            <EtFormRadio.Control />
          </EtFormRadio>
        );
      }
      const { getByTestId } = render(<DisabledForm />);
      expect(getByTestId('radio-indicator-state').props.children).toBe('false-true-false');
    });

    it('GIVEN disabled prop on Control, WHEN form is enabled, THEN RadioIndicator receives disabled=true', () => {
      function FormWithDisabledControl() {
        const { control } = useForm<{ r: boolean }>({ defaultValues: { r: false } });
        return (
          <EtFormRadio name="r" control={control}>
            <EtFormRadio.Control disabled />
          </EtFormRadio>
        );
      }
      const { getByTestId } = render(<FormWithDisabledControl />);
      expect(getByTestId('radio-indicator-state').props.children).toBe('false-true-false');
    });
  });
});
