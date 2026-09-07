import { useDebouncedValue } from '@etoro/common/utils/rn';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef, memo, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EtCountryFlag } from '../../components/country-flag';
import { EtInput } from '../../components/input/input-v2/et-input';
import type { EtPhoneInputHandle } from '../../components/input/phone-input';
import { EtPhoneInput } from '../../components/input/phone-input';
import { EtBottomSheet } from '../../components/overlays/bottom-sheet-v2';
import { useEtoroTheme } from '../../core/hooks';
import { X1, X2, X4 } from '../../core/styles/spacing';
import { EtText } from '../../foundations/text/et-text';
import type { PhoneInputProps } from './api';
import { PHONE_INPUT_COUNTRIES } from './default-countries';

const DEFAULT_SEARCH_PLACEHOLDER = 'Search country';

/** This component is the smart wrapper around the EtPhoneInput component. It provides a bottom sheet for selecting a country code. */
const PhoneInputBase = forwardRef<EtPhoneInputHandle, PhoneInputProps>(function PhoneInputBase(
  {
    countries = PHONE_INPUT_COUNTRIES,
    defaultCountryIsoCode = 'GB',
    onSelect,
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    ...etPhoneInputProps
  },
  ref,
) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // WORKAROUND for @gorhom/bottom-sheet >=5.2.11 (issue #2669): calling
  // dismiss() on a modal whose status has reset to INITIAL (which it does
  // after a full close) corrupts it to a permanent DISMISSING state, so the
  // next present() is silently ignored — the prefix picker opens once, then
  // can no longer be reopened until the screen is remounted. The sheet's
  // onClose already runs after dismissal, so guarding the programmatic
  // dismiss() behind "was actually presented" prevents the double-dismiss.
  const hasPresentedRef = useRef(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText, 300);
  const { colors } = useEtoroTheme();

  const effectiveCountries = countries.length > 0 ? countries : PHONE_INPUT_COUNTRIES;
  const selectedCountryFallback = effectiveCountries[0];

  const [selectedCountry, setSelectedCountry] = useState(() => {
    const initialCountry = effectiveCountries.find((country) => country.isoCode.toUpperCase() === defaultCountryIsoCode.toUpperCase());
    return initialCountry ?? selectedCountryFallback;
  });

  const filteredCountries = useMemo(() => {
    const normalizedSearch = debouncedSearchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return effectiveCountries;
    }

    return effectiveCountries.filter((country) => {
      const matchesName = country.name.toLowerCase().includes(normalizedSearch);
      const matchesPrefix = country.phonePrefix.includes(normalizedSearch);
      const matchesIso = country.isoCode.toLowerCase().includes(normalizedSearch);

      return matchesName || matchesPrefix || matchesIso;
    });
  }, [debouncedSearchText, effectiveCountries]);

  const openCountryPicker = () => {
    setSearchText(''); // Reset input after each open. Should we?
    hasPresentedRef.current = true;
    bottomSheetRef.current?.present();
  };

  // Programmatic close (used when the user picks a country). Skips dismiss()
  // if the sheet was never presented to avoid the upstream INITIAL-status
  // corruption in @gorhom/bottom-sheet >=5.2.11 (see hasPresentedRef above).
  const closeCountryPicker = () => {
    if (!hasPresentedRef.current) return;
    hasPresentedRef.current = false;
    bottomSheetRef.current?.dismiss();
  };

  // Fires from EtBottomSheet.onClose after the sheet has finished closing
  // (pan-down, backdrop tap, or the dismiss() above). Only reset the gate —
  // must NOT call dismiss() again here.
  const handleSheetClosed = () => {
    hasPresentedRef.current = false;
  };

  const handleSelectCountry = (country: (typeof countries)[number]) => {
    setSelectedCountry(country);
    onSelect?.(country);
    closeCountryPicker();
  };

  return (
    <>
      <EtPhoneInput ref={ref} {...etPhoneInputProps} prefix={selectedCountry.phonePrefix} isoCode={selectedCountry.isoCode} onPrefixPress={openCountryPicker} />

      <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['80%']} onClose={handleSheetClosed} accessibilityLabel="Select country code">
        <EtBottomSheet.Header>
          <EtInput defaultValue={searchText}>
            <EtInput.Label>{searchPlaceholder}</EtInput.Label>
            <EtInput.Field
              autoFocus
              onChangeText={setSearchText}
              testID={etPhoneInputProps.testID ? `${etPhoneInputProps.testID}-country-search` : 'phone-input-country-search'}
            />
          </EtInput>
        </EtBottomSheet.Header>

        <EtBottomSheet.List
          data={filteredCountries}
          initialNumToRender={10}
          keyExtractor={(item: (typeof filteredCountries)[number]) => `${item.isoCode}-${item.phonePrefix}`}
          renderItem={({ item }: { item: (typeof filteredCountries)[number] }) => (
            <Pressable
              onPress={() => handleSelectCountry(item)}
              style={styles.countryRow}
              testID={`phone-input-country-${item.isoCode.toLowerCase()}`}
            >
              <EtCountryFlag isoCode={item.isoCode} size={24} />
              <View style={styles.countryTextGroup}>
                <EtText variant="label-primary-semibold" style={{ color: colors.textPrimaryNeutral }}>
                  {item.name}
                </EtText>
                <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  {item.phonePrefix}
                </EtText>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.dividerQuinary }]} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <EtText variant="body-base-regular" style={{ color: colors.textSecondaryNeutral }}>
                No countries found.
              </EtText>
            </View>
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </EtBottomSheet>
    </>
  );
});

PhoneInputBase.displayName = 'PhoneInput';

export const PhoneInput = memo(PhoneInputBase);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: X4,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
    paddingVertical: X4,
  },
  countryTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: X2,
  },
  separator: {
    height: 1,
    marginVertical: X1,
  },
  emptyState: {
    paddingVertical: X4,
    alignItems: 'center',
  },
});
