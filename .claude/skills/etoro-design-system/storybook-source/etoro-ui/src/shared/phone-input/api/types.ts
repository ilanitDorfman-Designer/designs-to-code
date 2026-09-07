import type { EtPhoneInputProps } from '../../../components/input/phone-input';

export interface PhoneInputCountry {
  /** Country ID used for internal identification */
  countryId: number;
  /** Country display name shown in the picker */
  name: string;
  /** ISO 3166-1 alpha-2 code used by EtCountryFlag */
  isoCode: string;
  /** Dial prefix including + sign */
  phonePrefix: string;
  /** Risk group ID used for risk assessment */
  riskGroupID: number;
}

export interface PhoneInputProps extends Omit<EtPhoneInputProps, 'prefix' | 'isoCode' | 'onPrefixPress'> {
  /** Optional custom countries list shown in the bottom sheet */
  countries?: PhoneInputCountry[];
  /** Initial selected country ISO code (defaults to GB) */
  defaultCountryIsoCode?: string;
  /** Called when user selects a country from the picker */
  onSelect?: (country: PhoneInputCountry) => void;
  /** Placeholder text for the country search input in the sheet */
  searchPlaceholder?: string;
}
