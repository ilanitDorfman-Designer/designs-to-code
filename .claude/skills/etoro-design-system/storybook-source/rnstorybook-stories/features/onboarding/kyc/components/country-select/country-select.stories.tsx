import { CountrySelect } from '@etoro/features/onboarding/kyc/rn/ui/components';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, Spacer, SubTitle, Title } from '../../../../../utils/storybook-template';

type Story = StoryObj<typeof CountrySelect>;

const meta: Meta<typeof CountrySelect> = {
  title: 'Features/Onboarding/KYC/CountrySelect',
  component: CountrySelect,
  parameters: {
    notes:
      'Self-contained country picker with two variants. Switch to Dark mode for best visibility — this component is designed for dark KYC screens.',
  },
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

export const Basic: Story = {
  render: function BasicStory() {
    const [countryId, setCountryId] = useState<number | null>(null);
    const [countryName, setCountryName] = useState('');

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>Self-contained country picker. Tap to open a searchable bottom sheet. Switch to Dark mode for proper appearance.</Desc>
          <Preview>
            <CountrySelect
              label="Country of residence"
              selectedCountryId={countryId}
              onCountrySelected={(country) => {
                setCountryId(country.countryId);
                setCountryName(country.name);
              }}
              variant="available"
              searchPlaceholder="Search countries"
              emptyResultsText="No countries found."
            />
          </Preview>
          <Desc>{countryName ? `Selected: ${countryName}` : 'No country selected'}</Desc>
          <CodeBlock
            code={`import { CountrySelect } from '@etoro/features/onboarding/kyc/rn/ui/components';

const [countryId, setCountryId] = useState<number | null>(null);

<CountrySelect
  label="Country of residence"
  selectedCountryId={countryId}
  onCountrySelected={(country) => setCountryId(country.countryId)}
  variant="available"
  searchPlaceholder="Search countries"
  emptyResultsText="No countries found."
/>`}
          />
        </Section>
      </Page>
    );
  },
};

export const Variants: Story = {
  render: function VariantsStory() {
    const [allId, setAllId] = useState<number | null>(null);
    const [availableId, setAvailableId] = useState<number | null>(218);

    return (
      <Page>
        <Section>
          <Title>Variants</Title>
          <Desc>Two variants control which countries are fetched.</Desc>
        </Section>

        <Section>
          <SubTitle>variant="available"</SubTitle>
          <Desc>Excludes internal entries. Use for country of residence or tax country.</Desc>
          <Preview>
            <CountrySelect
              label="Country of residence"
              selectedCountryId={availableId}
              onCountrySelected={(c) => setAvailableId(c.countryId)}
              variant="available"
            />
          </Preview>
        </Section>

        <Section>
          <SubTitle>variant="all" (default)</SubTitle>
          <Desc>Fetches every country including internal entries. Use for nationality or country of birth.</Desc>
          <Preview>
            <CountrySelect label="Nationality" selectedCountryId={allId} onCountrySelected={(c) => setAllId(c.countryId)} variant="all" />
          </Preview>
        </Section>
      </Page>
    );
  },
};

export const PreSelected: Story = {
  render: function PreSelectedStory() {
    const [countryId, setCountryId] = useState<number | null>(218);

    return (
      <Page>
        <Section>
          <Title>Pre-selected</Title>
          <Desc>Pass a selectedCountryId to show a country on mount.</Desc>
          <Preview>
            <CountrySelect
              label="Country of residence"
              selectedCountryId={countryId}
              onCountrySelected={(c) => setCountryId(c.countryId)}
              variant="available"
            />
          </Preview>
          <CodeBlock
            code={`<CountrySelect
  label="Country of residence"
  selectedCountryId={218} // United Kingdom
  onCountrySelected={(c) => setCountryId(c.countryId)}
  variant="available"
/>`}
          />
        </Section>
      </Page>
    );
  },
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>CountrySelectProps</SubTitle>
        <Desc>Self-contained country picker with searchable bottom sheet.</Desc>
        <PropsTable
          data={[
            { prop: 'label', type: 'string', default: '(required)' },
            { prop: 'selectedCountryId', type: 'number | null', default: '(required)' },
            { prop: 'onCountrySelected', type: '(country: Country) => void', default: '(required)' },
            { prop: 'variant', type: '"all" | "available"', default: '"all"' },
            { prop: 'searchPlaceholder', type: 'string', default: '"Search"' },
            { prop: 'emptyResultsText', type: 'string', default: '"No countries found."' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>CountrySelectVariant</SubTitle>
        <PropsTable
          data={[
            { prop: '"all"', type: 'Fetches all countries (including internal entries)', default: 'default' },
            { prop: '"available"', type: 'Excludes "Not available" and "eToro" entries', default: '-' },
          ]}
        />
      </Section>

      <Spacer />
    </Page>
  ),
};
