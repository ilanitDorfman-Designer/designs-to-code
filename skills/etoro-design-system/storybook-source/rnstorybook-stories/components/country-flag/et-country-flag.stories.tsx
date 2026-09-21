import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtCountryFlag, EtText } from 'etoro-ui';
import { eToroLightColors } from 'etoro-ui/core/styles/colors';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtCountryFlag>;

const meta: Meta<typeof EtCountryFlag> = {
  title: 'eToro-UI/Components/EtCountryFlag',
  component: EtCountryFlag,
  parameters: {
    notes: 'Country flag component that renders a circular SVG flag by ISO code.',
  },
  decorators: [
    (Story) => (
      <NavigationIndependentTree>
        <NavigationContainer theme={eToroLightColors}>
          <ScrollView contentContainerStyle={styles.decorator}>
            <Story />
          </ScrollView>
        </NavigationContainer>
      </NavigationIndependentTree>
    ),
  ],
};

export default meta;

/** ISO code to country name mapping */
const FLAG_NAMES: Record<string, string> = {
  AB: 'Abkhazia',
  AD: 'Andorra',
  AE: 'UAE',
  AF: 'Afghanistan',
  AG: 'Antigua',
  AI: 'Anguilla',
  AL: 'Albania',
  AM: 'Armenia',
  AN: 'Neth. Antilles',
  AO: 'Angola',
  AQ: 'Antarctica',
  AR: 'Argentina',
  AS: 'Am. Samoa',
  AT: 'Austria',
  AU: 'Australia',
  AW: 'Aruba',
  AX: 'Åland',
  AZ: 'Azerbaijan',
  AZR: 'Azores',
  BA: 'Bosnia',
  BAL: 'Balearic Is.',
  BASQ: 'Basque',
  BB: 'Barbados',
  BCOL: 'Brit. Columbia',
  BD: 'Bangladesh',
  BE: 'Belgium',
  BF: 'Burkina Faso',
  BG: 'Bulgaria',
  BH: 'Bahrain',
  BI: 'Burundi',
  BJ: 'Benin',
  BL: 'St. Barts',
  BM: 'Bermuda',
  BN: 'Brunei',
  BO: 'Bolivia',
  BQ: 'Bonaire',
  BR: 'Brazil',
  BS: 'Bahamas',
  BT: 'Bhutan',
  BV: 'Bouvet Is.',
  BW: 'Botswana',
  BY: 'Belarus',
  BZ: 'Belize',
  CA: 'Canada',
  CAF: 'C. African Rep.',
  CC: 'Cocos Is.',
  CD: 'DR Congo',
  CEU: 'Ceuta',
  CF: 'C. African Rep.',
  CG: 'Congo',
  CH: 'Switzerland',
  CI: 'Ivory Coast',
  CK: 'Cook Is.',
  CL: 'Chile',
  CM: 'Cameroon',
  CN: 'China',
  CNA: 'Canary Is.',
  CO: 'Colombia',
  COC: 'Corsica',
  CR: 'Costa Rica',
  CU: 'Cuba',
  CV: 'Cape Verde',
  CW: 'Curaçao',
  CX: 'Christmas Is.',
  CY: 'Cyprus',
  CZ: 'Czechia',
  DE: 'Germany',
  DJ: 'Djibouti',
  DK: 'Denmark',
  DM: 'Dominica',
  DO: 'Dominican Rep.',
  DZ: 'Algeria',
  EC: 'Ecuador',
  EE: 'Estonia',
  EG: 'Egypt',
  EH: 'W. Sahara',
  ENG: 'England',
  ER: 'Eritrea',
  ES: 'Spain',
  ET: 'Ethiopia',
  EU: 'EU',
  FI: 'Finland',
  FJ: 'Fiji',
  FK: 'Falkland Is.',
  FM: 'Micronesia',
  FO: 'Faroe Is.',
  FR: 'France',
  GA: 'Gabon',
  GAL: 'Galápagos',
  GB: 'UK',
  GD: 'Grenada',
  GE: 'Georgia',
  GF: 'Fr. Guiana',
  GG: 'Guernsey',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GL: 'Greenland',
  GM: 'Gambia',
  GN: 'Guinea',
  GP: 'Guadeloupe',
  GQ: 'Eq. Guinea',
  GR: 'Greece',
  GS: 'S. Georgia',
  GT: 'Guatemala',
  GU: 'Guam',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HI: 'Hawaii',
  HK: 'Hong Kong',
  HM: 'Heard Is.',
  HN: 'Honduras',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  ID: 'Indonesia',
  IE: 'Ireland',
  IL: 'Israel',
  IM: 'Isle of Man',
  IN: 'India',
  IO: 'BIOT',
  IQ: 'Iraq',
  IR: 'Iran',
  IS: 'Iceland',
  IT: 'Italy',
  JE: 'Jersey',
  JM: 'Jamaica',
  JO: 'Jordan',
  JP: 'Japan',
  KE: 'Kenya',
  KG: 'Kyrgyzstan',
  KH: 'Cambodia',
  KI: 'Kiribati',
  KM: 'Comoros',
  KN: 'St. Kitts',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KY: 'Cayman Is.',
  KZ: 'Kazakhstan',
  LA: 'Laos',
  LB: 'Lebanon',
  LC: 'St. Lucia',
  LI: 'Liechtenstein',
  LK: 'Sri Lanka',
  LR: 'Liberia',
  LS: 'Lesotho',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  LY: 'Libya',
  MA: 'Morocco',
  MAD: 'Madeira',
  MC: 'Monaco',
  MD: 'Moldova',
  ME: 'Montenegro',
  MEL: 'Melilla',
  MF: 'St. Martin',
  MG: 'Madagascar',
  MH: 'Marshall Is.',
  MK: 'N. Macedonia',
  ML: 'Mali',
  MM: 'Myanmar',
  MN: 'Mongolia',
  MO: 'Macao',
  MP: 'N. Mariana Is.',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MS: 'Montserrat',
  MT: 'Malta',
  MU: 'Mauritius',
  MV: 'Maldives',
  MW: 'Malawi',
  MX: 'Mexico',
  MY: 'Malaysia',
  MZ: 'Mozambique',
  NA: 'Namibia',
  NATO: 'NATO',
  NC: 'New Caledonia',
  NCY: 'N. Cyprus',
  NE: 'Niger',
  NF: 'Norfolk Is.',
  NG: 'Nigeria',
  NI: 'Nicaragua',
  NL: 'Netherlands',
  NO: 'Norway',
  NP: 'Nepal',
  NR: 'Nauru',
  NU: 'Niue',
  NZ: 'New Zealand',
  OM: 'Oman',
  ORK: 'Orkney Is.',
  OSS: 'Ossetia',
  PA: 'Panama',
  PE: 'Peru',
  PF: 'Fr. Polynesia',
  PG: 'Papua N.G.',
  PH: 'Philippines',
  PK: 'Pakistan',
  PL: 'Poland',
  PM: 'St. Pierre',
  PN: 'Pitcairn Is.',
  PR: 'Puerto Rico',
  PS: 'Palestine',
  PT: 'Portugal',
  PW: 'Palau',
  PY: 'Paraguay',
  QA: 'Qatar',
  RAP: 'Rapa Nui',
  RE: 'Réunion',
  RO: 'Romania',
  RS: 'Serbia',
  RU: 'Russia',
  RW: 'Rwanda',
  SA: 'Saudi Arabia',
  SAB: 'Saba',
  SAR: 'Sardinia',
  SB: 'Solomon Is.',
  SC: 'Seychelles',
  SCT: 'Scotland',
  SD: 'Sudan',
  SE: 'Sweden',
  SEU: 'St. Eustatius',
  SG: 'Singapore',
  SH: 'St. Helena',
  SI: 'Slovenia',
  SJ: 'Svalbard',
  SK: 'Slovakia',
  SL: 'Sierra Leone',
  SM: 'San Marino',
  SN: 'Senegal',
  SO: 'Somalia',
  SOM: 'Somaliland',
  SR: 'Suriname',
  SS: 'South Sudan',
  ST: 'São Tomé',
  SV: 'El Salvador',
  SX: 'Sint Maarten',
  SY: 'Syria',
  SZ: 'Eswatini',
  TC: 'Turks & Caicos',
  TD: 'Chad',
  TF: 'Fr. Southern',
  TG: 'Togo',
  TH: 'Thailand',
  TIB: 'Tibet',
  TJ: 'Tajikistan',
  TK: 'Tokelau',
  TL: 'East Timor',
  TM: 'Turkmenistan',
  TN: 'Tunisia',
  TNS: 'Transnistria',
  TO: 'Tonga',
  TR: 'Turkey',
  TT: 'Trinidad',
  TV: 'Tuvalu',
  TW: 'Taiwan',
  TZ: 'Tanzania',
  UA: 'Ukraine',
  UG: 'Uganda',
  UM: 'US Minor Is.',
  UN: 'UN',
  US: 'USA',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VA: 'Vatican',
  VC: 'St. Vincent',
  VE: 'Venezuela',
  VG: 'Brit. Virgin Is.',
  VI: 'US Virgin Is.',
  VN: 'Vietnam',
  VU: 'Vanuatu',
  WAL: 'Wales',
  WF: 'Wallis & Futuna',
  WS: 'Samoa',
  XK: 'Kosovo',
  YE: 'Yemen',
  YT: 'Mayotte',
  ZA: 'South Africa',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  ZZ: 'Unknown',
};

/** All available ISO codes in the flag registry */
const ALL_FLAGS = Object.keys(FLAG_NAMES);

/**
 * All available country flags ({ALL_FLAGS.length} total)
 */
export const AllFlags: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        All Country Flags ({ALL_FLAGS.length})
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Every flag in the registry, rendered at default size (36px circle)
      </EtText>

      <View style={styles.flagGrid}>
        {ALL_FLAGS.map((code) => (
          <View key={code} style={styles.flagItem}>
            <EtCountryFlag isoCode={code} />
            <EtText variant="body-tiny-regular" style={styles.flagCode}>
              {code}
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.flagName} numberOfLines={1}>
              {FLAG_NAMES[code] ?? code}
            </EtText>
          </View>
        ))}
      </View>
    </View>
  ),
};

/**
 * Flags at different sizes
 */
export const Sizes: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Sizes
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        The size prop controls the circle diameter
      </EtText>

      <View style={styles.sizesRow}>
        {[14, 24, 36, 56, 84].map((size) => (
          <View key={size} style={styles.sizeItem}>
            <EtCountryFlag isoCode="IL" size={size} />
            <EtText variant="body-tiny-regular" style={styles.flagCode}>
              {size}px
            </EtText>
          </View>
        ))}
      </View>
    </View>
  ),
};

/**
 * Unknown ISO code falls back to ZZ placeholder flag
 */
export const UnknownCode: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Unknown Code (Fallback)
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        An unrecognized ISO code falls back to the ZZ placeholder flag
      </EtText>

      <View style={styles.unknownRow}>
        <EtText variant="body-secondary-regular">Before</EtText>
        <EtCountryFlag isoCode="XX" />
        <EtText variant="body-secondary-regular">After</EtText>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    padding: 16,
  },
  showcase: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 12,
    opacity: 0.7,
  },
  flagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  flagItem: {
    alignItems: 'center',
    gap: 4,
    width: 56,
  },
  flagCode: {
    opacity: 0.8,
  },
  flagName: {
    opacity: 0.7,
    fontSize: 10,
    textAlign: 'center',
  },
  sizesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 24,
  },
  sizeItem: {
    alignItems: 'center',
    gap: 4,
  },
  unknownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
