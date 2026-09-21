import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BehaviorSubject } from 'rxjs';

import { AddressAutocompleteFacadeService } from '@etoro/common/compliance/address-autocomplete/core/facade';
import type { AddressAutocompleteState, AddressFormatted, AddressPrediction } from '@etoro/common/compliance/address-autocomplete/core/interfaces';
import { AddressAutocompleteSheet, AddressListSkeleton, AddressResultItem } from '@etoro/common/compliance/address-autocomplete/rn';
import { EtoroDiCtx } from '@etoro/common/di/react';
import { EtButton, EtText } from 'etoro-ui';

import { Page, Section, Title, SubTitle, Desc, Preview, CodeBlock, PropsTable, Spacer, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof AddressAutocompleteSheet>;

const meta: Meta<typeof AddressAutocompleteSheet> = {
  title: 'Features/Compliance/AddressAutocomplete',
  component: AddressAutocompleteSheet,
  decorators: [
    (Story: React.ComponentType) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Story />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    ),
  ],
};

export default meta;

// ─── Mock Data ─────────────────────────────────────────────

const MOCK_PREDICTIONS: AddressPrediction[] = [
  {
    placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
    mainText: '10 Downing Street',
    secondaryText: 'London, SW1A 2AA, UK',
    fullText: '10 Downing Street, London SW1A 2AA, UK',
  },
  {
    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    mainText: '221B Baker Street',
    secondaryText: 'London, NW1 6XE, UK',
    fullText: '221B Baker Street, London NW1 6XE, UK',
  },
  {
    placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
    mainText: '350 Fifth Avenue',
    secondaryText: 'New York, NY 10118, USA',
    fullText: '350 Fifth Avenue, New York, NY 10118, USA',
  },
];

const MOCK_SELECTED_ADDRESS: AddressFormatted = {
  buildingNumber: '10',
  address: 'Downing Street',
  city: 'London',
  zip: 'SW1A 2AA',
  provinceCode: '',
};

const INITIAL_STATE: AddressAutocompleteState = {
  status: 'idle',
  error: null,
  predictions: [],
  predictionsStatus: 'idle',
  selectedAddress: null,
  detailsStatus: 'idle',
  sessionToken: null,
  searchText: '',
};

// ─── Mock Facade Factory ──────────────────────────────────

function createMockFacade(overrides?: Partial<AddressAutocompleteState>) {
  const initialState: AddressAutocompleteState = { ...INITIAL_STATE, ...overrides };
  const subject = new BehaviorSubject<AddressAutocompleteState>(initialState);

  return {
    state$: subject.asObservable(),
    get stateSnapshot() {
      return subject.getValue();
    },

    startSession() {
      subject.next({ ...subject.getValue(), sessionToken: 'mock-session-token' });
    },

    async searchAddresses(searchText: string, _countryCode: string) {
      subject.next({ ...subject.getValue(), predictionsStatus: 'loading', searchText });
      await new Promise((r) => setTimeout(r, 600));
      subject.next({
        ...subject.getValue(),
        predictions: MOCK_PREDICTIONS,
        predictionsStatus: 'success',
      });
    },

    async selectAddress(placeId: string) {
      subject.next({ ...subject.getValue(), detailsStatus: 'loading' });
      await new Promise((r) => setTimeout(r, 400));
      const prediction = MOCK_PREDICTIONS.find((p) => p.placeId === placeId);
      const address: AddressFormatted = prediction ? { ...MOCK_SELECTED_ADDRESS, address: prediction.mainText } : MOCK_SELECTED_ADDRESS;
      subject.next({ ...subject.getValue(), selectedAddress: address, detailsStatus: 'success' });
    },

    clearSearch() {
      subject.next({ ...subject.getValue(), predictions: [], predictionsStatus: 'idle', searchText: '' });
    },

    endSession() {
      subject.next(initialState);
    },

    reset() {
      subject.next(initialState);
    },

    updateState(partial: Partial<AddressAutocompleteState>) {
      subject.next({ ...subject.getValue(), ...partial });
    },

    normalizeError(error: unknown) {
      return error instanceof Error ? error : new Error(String(error));
    },

    execute: async (_name: string, operation: () => Promise<unknown>) => operation(),
  };
}

// ─── Stories ───────────────────────────────────────────────

export const Basic: Story = {
  render: function BasicStory() {
    const { c } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressFormatted | null>(null);
    const facadeRef = useRef(createMockFacade());

    const handleAddressSelected = useCallback((address: AddressFormatted) => {
      setSelectedAddress(address);
      setIsVisible(false);
    }, []);

    const handleClose = useCallback(() => {
      setIsVisible(false);
    }, []);

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            Interactive address autocomplete powered by Google Places. Tap the button to open the bottom sheet, type at least 3 characters to search,
            and select an address to populate structured fields.
          </Desc>
          <Preview>
            <View style={{ width: '100%', gap: 16 }}>
              <EtButton onPress={() => setIsVisible(true)} stretch>
                Search Address
              </EtButton>

              {selectedAddress && (
                <View style={{ gap: 4, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: c.border }}>
                  <EtText variant="label-primary-semibold">Selected Address</EtText>
                  <EtText variant="body-secondary-regular">
                    {selectedAddress.buildingNumber} {selectedAddress.address}
                  </EtText>
                  <EtText variant="body-secondary-regular">
                    {selectedAddress.city} {selectedAddress.zip}
                  </EtText>
                  {selectedAddress.provinceCode ? <EtText variant="body-secondary-regular">{selectedAddress.provinceCode}</EtText> : null}
                </View>
              )}

              <EtoroDiCtx providers={[{ provide: AddressAutocompleteFacadeService, useFactory: () => facadeRef.current }]}>
                <AddressAutocompleteSheet
                  isVisible={isVisible}
                  countryCode="DE"
                  onAddressSelected={handleAddressSelected}
                  onClose={handleClose}
                  testID="basic-story"
                />
              </EtoroDiCtx>
            </View>
          </Preview>
          <CodeBlock
            code={`import { AddressAutocompleteSheet } from '@etoro/common/compliance/address-autocomplete/rn';
import type { AddressFormatted } from '@etoro/common/compliance/address-autocomplete/core/interfaces';
import { AddressAutocompleteFacadeService } from '@etoro/common/compliance/address-autocomplete/core/facade';
import { AddressAutocompleteBlService } from '@etoro/common/compliance/address-autocomplete/core/bl';
import { AddressAutocompleteDalService } from '@etoro/common/compliance/address-autocomplete/core/dal';
import { EtoroDiCtx } from '@etoro/common/di/react';

const [isVisible, setIsVisible] = useState(false);

<EtoroDiCtx providers={[
  AddressAutocompleteDalService,
  AddressAutocompleteBlService,
  AddressAutocompleteFacadeService,
]}>
  <AddressAutocompleteSheet
    isVisible={isVisible}
    countryCode="DE"
    onAddressSelected={(address) => {
      console.log(address);
      setIsVisible(false);
    }}
    onClose={() => setIsVisible(false)}
  />
</EtoroDiCtx>`}
          />
        </Section>
      </Page>
    );
  },
};

export const SubComponents: Story = {
  render: function SubComponentsStory() {
    return (
      <Page>
        <Section>
          <Title>Sub-Components</Title>
          <Desc>The AddressAutocompleteSheet is composed of three sub-components that can be used independently.</Desc>
        </Section>

        <Section>
          <SubTitle>AddressSearchField</SubTitle>
          <Desc>
            Pill-shaped search input with search icon and clear button. Uses BottomSheetTextInput internally, so it must be rendered inside a
            BottomSheet context (e.g. EtBottomSheetV2). See the Basic story for a live demo.
          </Desc>
          <CodeBlock
            code={`import { AddressSearchField } from '@etoro/common/compliance/address-autocomplete/rn';

<AddressSearchField
  value={searchText}
  onChangeText={setSearchText}
  onClear={() => setSearchText('')}
  placeholder="Search address..."
/>`}
          />
        </Section>

        <Section>
          <SubTitle>AddressResultItem</SubTitle>
          <Desc>List row displaying main text (street) and secondary text (city, country). Calls onSelect with placeId on tap.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <AddressResultItem prediction={MOCK_PREDICTIONS[0]} onSelect={(placeId) => console.log('Selected:', placeId)} testID="story-result" />
            </View>
          </Preview>
          <CodeBlock
            code={`import { AddressResultItem } from '@etoro/common/compliance/address-autocomplete/rn';
import type { AddressPrediction } from '@etoro/common/compliance/address-autocomplete/core/interfaces';

const prediction: AddressPrediction = {
  placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
  mainText: '10 Downing Street',
  secondaryText: 'London, SW1A 2AA, UK',
  fullText: '10 Downing Street, London SW1A 2AA, UK',
};

<AddressResultItem
  prediction={prediction}
  onSelect={(placeId) => console.log(placeId)}
/>`}
          />
        </Section>

        <Section>
          <SubTitle>AddressListSkeleton</SubTitle>
          <Desc>Loading placeholder with 5 skeleton rows. Used as loadingPlaceholder inside EtBottomSheetV2.List.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <AddressListSkeleton />
            </View>
          </Preview>
          <CodeBlock
            code={`import { AddressListSkeleton } from '@etoro/common/compliance/address-autocomplete/rn';

<AddressListSkeleton />`}
          />
        </Section>
      </Page>
    );
  },
};

export const KYCExample: Story = {
  render: function KYCExampleStory() {
    const { c } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [address, setAddress] = useState<AddressFormatted | null>(null);
    const facadeRef = useRef(createMockFacade());

    const handleAddressSelected = useCallback((selected: AddressFormatted) => {
      setAddress(selected);
      setIsVisible(false);
    }, []);

    const fields: { label: string; value: string }[] = address
      ? [
          { label: 'Building Number', value: address.buildingNumber },
          { label: 'Street', value: address.address },
          { label: 'City', value: address.city },
          { label: 'ZIP / Postal Code', value: address.zip },
          { label: 'Province Code', value: address.provinceCode || '—' },
        ]
      : [];

    return (
      <Page>
        <Section>
          <Title>KYC Example</Title>
          <Desc>
            Real-world usage for KYC address verification. Selecting an address populates structured form fields used for identity verification.
          </Desc>
          <Preview>
            <View style={{ width: '100%', gap: 16 }}>
              <EtButton onPress={() => setIsVisible(true)} stretch>
                {address ? 'Change Address' : 'Enter Address'}
              </EtButton>

              {address && (
                <View style={{ gap: 8, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: c.border }}>
                  {fields.map((field) => (
                    <View key={field.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <EtText variant="label-primary-regular">{field.label}</EtText>
                      <EtText variant="label-primary-semibold">{field.value}</EtText>
                    </View>
                  ))}
                </View>
              )}

              <EtoroDiCtx providers={[{ provide: AddressAutocompleteFacadeService, useFactory: () => facadeRef.current }]}>
                <AddressAutocompleteSheet
                  isVisible={isVisible}
                  countryCode="DE"
                  onAddressSelected={handleAddressSelected}
                  onClose={() => setIsVisible(false)}
                  testID="kyc-example"
                />
              </EtoroDiCtx>
            </View>
          </Preview>
          <CodeBlock
            code={`import { AddressAutocompleteSheet } from '@etoro/common/compliance/address-autocomplete/rn';
import { AddressAutocompleteFacadeService } from '@etoro/common/compliance/address-autocomplete/core/facade';
import { AddressAutocompleteBlService } from '@etoro/common/compliance/address-autocomplete/core/bl';
import { AddressAutocompleteDalService } from '@etoro/common/compliance/address-autocomplete/core/dal';
import { EtoroDiCtx } from '@etoro/common/di/react';

const [isVisible, setIsVisible] = useState(false);
const [address, setAddress] = useState<AddressFormatted | null>(null);

<EtoroDiCtx providers={[
  AddressAutocompleteDalService,
  AddressAutocompleteBlService,
  AddressAutocompleteFacadeService,
]}>
  <AddressAutocompleteSheet
    isVisible={isVisible}
    countryCode="DE"
    onAddressSelected={(selected) => {
      setAddress(selected);
      setIsVisible(false);
    }}
    onClose={() => setIsVisible(false)}
  />
</EtoroDiCtx>

// address.buildingNumber, address.address, address.city,
// address.zip, address.provinceCode`}
          />
        </Section>
      </Page>
    );
  },
};

/**
 * API Reference — always the LAST exported story.
 */
export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>AddressAutocompleteSheetProps</SubTitle>
        <Desc>Main bottom sheet component for address autocomplete with Google Places.</Desc>
        <PropsTable
          data={[
            { prop: 'isVisible', type: 'boolean', default: '(required)' },
            { prop: 'countryCode', type: 'string', default: '(required)' },
            {
              prop: 'onAddressSelected',
              type: '(address: AddressFormatted) => void',
              default: '(required)',
            },
            { prop: 'onClose', type: '() => void', default: '(required)' },
            {
              prop: 'bottomSheetRef',
              type: 'RefObject<BottomSheetModal | null>',
              default: 'internal ref',
            },
            { prop: 'testID', type: 'string', default: '"address-autocomplete-sheet"' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>AddressSearchFieldProps</SubTitle>
        <Desc>Pill-shaped search bar for address autocomplete (uses BottomSheetTextInput).</Desc>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '(required)' },
            { prop: 'onChangeText', type: '(text: string) => void', default: '(required)' },
            { prop: 'onClear', type: '() => void', default: '(required)' },
            { prop: 'placeholder', type: 'string', default: '"Search address..."' },
            { prop: 'testID', type: 'string', default: '—' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>AddressResultItemProps</SubTitle>
        <Desc>Address row for autocomplete results. Displays main text and secondary text.</Desc>
        <PropsTable
          data={[
            { prop: 'prediction', type: 'AddressPrediction', default: '(required)' },
            {
              prop: 'onSelect',
              type: '(placeId: string) => void',
              default: '(required)',
            },
            { prop: 'testID', type: 'string', default: '—' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>AddressFormatted</SubTitle>
        <Desc>Parsed address fields returned by onAddressSelected for KYC form population.</Desc>
        <PropsTable
          data={[
            { prop: 'buildingNumber', type: 'string', default: '—' },
            { prop: 'address', type: 'string', default: '—' },
            { prop: 'city', type: 'string', default: '—' },
            { prop: 'zip', type: 'string', default: '—' },
            { prop: 'provinceCode', type: 'string', default: '—' },
          ]}
        />
      </Section>

      <Spacer />
    </Page>
  ),
};
