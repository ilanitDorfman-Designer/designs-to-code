import { fireEvent, render } from '@testing-library/react-native';

import type { PhoneInputCountry } from './api/types';
import { PhoneInput } from './phone-input';

jest.mock('@etoro/common/utils/rn', () => ({
  useDebouncedValue: (value: string) => value,
}));

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#111111',
      textSecondaryNeutral: '#777777',
      dividerQuinary: '#333333',
    },
  }),
}));

jest.mock('../../foundations/text/et-text', () => ({
  EtText: ({ children }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('../../components/country-flag', () => ({
  EtCountryFlag: ({ isoCode }) => {
    const { Text } = require('react-native');
    return <Text>{isoCode}</Text>;
  },
}));

jest.mock('../../components/input/input-v2/et-input', () => {
  const { Text, TextInput, View } = require('react-native');
  const EtInput = ({ children }) => <View>{children}</View>;
  EtInput.Label = ({ children }) => <Text>{children}</Text>;
  EtInput.Field = ({ onChangeText }) => <TextInput testID="country-search-input" onChangeText={onChangeText} />;
  return { EtInput };
});

jest.mock('../../components/input/phone-input', () => ({
  EtPhoneInput: ({ prefix, isoCode, onPrefixPress }) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable testID="prefix-trigger" onPress={onPrefixPress}>
        <Text testID="selected-country-prefix">{`${isoCode}:${prefix}`}</Text>
      </Pressable>
    );
  },
}));

// Spies shared with the test body, populated as the mocked sheet mounts. The
// mock drives the consumer's `bottomSheetRef` and `onClose` so we can assert
// the present()/dismiss() call sequence around the gorhom #2669 workaround.
const mockSheetSpies = { present: jest.fn(), dismiss: jest.fn(), onClose: null as null | (() => void) };

jest.mock('../../components/overlays/bottom-sheet-v2', () => {
  const { useEffect } = require('react');
  const { View } = require('react-native');
  const EtBottomSheet = ({ bottomSheetRef, onClose, children }: any) => {
    useEffect(() => {
      mockSheetSpies.onClose = onClose ?? null;
      if (bottomSheetRef) {
        // eslint-disable-next-line react-compiler/react-compiler -- test mock: must assign imperative handle to prop ref
        bottomSheetRef.current = { present: mockSheetSpies.present, dismiss: mockSheetSpies.dismiss };
      }
    });
    return <View>{children}</View>;
  };

  EtBottomSheet.Header = ({ children }) => <View>{children}</View>;
  EtBottomSheet.List = ({ data, renderItem, keyExtractor, ListEmptyComponent }) => (
    <View>{data.length > 0 ? data.map((item) => <View key={keyExtractor(item)}>{renderItem({ item })}</View>) : ListEmptyComponent}</View>
  );

  return { EtBottomSheet };
});

describe('PhoneInput', () => {
  const TEST_COUNTRIES: PhoneInputCountry[] = [
    { countryId: 1, name: 'Brazil', isoCode: 'BR', phonePrefix: '+55', riskGroupID: 1 },
    { countryId: 2, name: 'Portugal', isoCode: 'PT', phonePrefix: '+351', riskGroupID: 1 },
    { countryId: 3, name: 'United States', isoCode: 'US', phonePrefix: '+1', riskGroupID: 1 },
  ];

  beforeEach(() => {
    mockSheetSpies.present.mockClear();
    mockSheetSpies.dismiss.mockClear();
    mockSheetSpies.onClose = null;
  });

  it('uses defaultCountryIsoCode as initial selection (case-insensitive)', () => {
    const { getByTestId } = render(<PhoneInput countries={TEST_COUNTRIES} defaultCountryIsoCode="us" placeholder="Phone number" />);

    expect(getByTestId('selected-country-prefix').props.children).toBe('US:+1');
  });

  it('falls back to first country when defaultCountryIsoCode is not found', () => {
    const { getByTestId } = render(<PhoneInput countries={TEST_COUNTRIES} defaultCountryIsoCode="ZZ" placeholder="Phone number" />);

    expect(getByTestId('selected-country-prefix').props.children).toBe('BR:+55');
  });

  it('filters countries by search input and shows empty state when no results', () => {
    const { getByTestId, getByText, queryByText } = render(<PhoneInput countries={TEST_COUNTRIES} placeholder="Phone number" />);

    fireEvent.changeText(getByTestId('country-search-input'), 'por');
    expect(getByText('Portugal')).toBeTruthy();
    expect(queryByText('Brazil')).toBeNull();

    fireEvent.changeText(getByTestId('country-search-input'), 'not-found');
    expect(getByText('No countries found.')).toBeTruthy();
  });

  it('updates selected country and calls onSelect when user picks a country', () => {
    const onSelect = jest.fn();
    const { getByText, getByTestId } = render(<PhoneInput countries={TEST_COUNTRIES} onSelect={onSelect} placeholder="Phone number" />);

    fireEvent.press(getByText('Portugal'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith({
      countryId: 2,
      name: 'Portugal',
      isoCode: 'PT',
      phonePrefix: '+351',
      riskGroupID: 1,
    });
    expect(getByTestId('selected-country-prefix').props.children).toBe('PT:+351');
  });

  // Regression for the gorhom >=5.2.11 (#2669) double-dismiss: tapping the
  // prefix then picking a country must NOT leave the sheet uncloseable. The
  // programmatic close fires dismiss() exactly once, and onClose (which runs
  // after the sheet finishes closing) must NOT dismiss() a second time —
  // otherwise the modal corrupts to a permanent DISMISSING state and the next
  // present() is ignored (the "tap once, then dead" bug).
  it('reopens the picker after a selection without a stray second dismiss()', () => {
    const { getByText, getByTestId } = render(<PhoneInput countries={TEST_COUNTRIES} placeholder="Phone number" />);

    // First open.
    fireEvent.press(getByTestId('prefix-trigger'));
    expect(mockSheetSpies.present).toHaveBeenCalledTimes(1);

    // Pick a country → programmatic close fires dismiss() once.
    fireEvent.press(getByText('Portugal'));
    expect(mockSheetSpies.dismiss).toHaveBeenCalledTimes(1);

    // Sheet finishes closing → onClose runs. It must only reset the gate, not
    // re-dismiss an already-INITIAL modal.
    mockSheetSpies.onClose?.();
    expect(mockSheetSpies.dismiss).toHaveBeenCalledTimes(1);

    // Second open must work.
    fireEvent.press(getByTestId('prefix-trigger'));
    expect(mockSheetSpies.present).toHaveBeenCalledTimes(2);
  });
});
