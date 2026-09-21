import type { Meta, StoryObj } from '@storybook/react-native';
import { EtSearchInput, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// Story wrapper component
const EtSearchInputStory = (args: any) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <EtSearchInput
      {...args}
      value={value}
      onChangeText={setValue}
      onCancel={() => {
        setValue('');
        args.onCancel?.();
      }}
    />
  );
};

type Story = StoryObj<typeof EtSearchInputStory>;

const meta: Meta<typeof EtSearchInputStory> = {
  title: 'eToro-UI/Components/Input/EtSearchInput',
  component: EtSearchInputStory,
  parameters: {
    notes:
      'A specialized search input component with built-in search icon, cancel button, and optimized keyboard settings. Features auto-clear on cancel, search keyboard type, and no autocorrect/autocapitalize for better search UX.',
  },
  decorators: [
    (Story) => {
      const { colors } = useEtoroTheme();

      return (
        <View style={[styles.decorator, { backgroundColor: colors.bgNeutralSecondary }]}>
          <Story />
        </View>
      );
    },
  ],
};

export default meta;

// Interactive story with controls
export const Interactive: Story = {
  render: (args: any) => <EtSearchInputStory {...args} />,
  args: {
    placeholder: 'Search',
    disabled: false,
    maxLength: 100,
    testID: 'search-input',
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
    haptics: {
      control: 'boolean',
      description: 'Enable haptic feedback',
    },
  },
};

// Basic Examples
export const BasicExamples: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [search1, setSearch1] = useState('');
    const [search2, setSearch2] = useState('AAPL');
    const [search3, setSearch3] = useState('');

    return (
      <ScrollView style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Basic Search Input Examples
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Empty State
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Search icon visible, no cancel button
          </EtText>
          <EtSearchInput value={search1} onChangeText={setSearch1} placeholder="Search" testID="search-empty" />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            With Value
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Cancel button appears when typing
          </EtText>
          <EtSearchInput value={search2} onChangeText={setSearch2} placeholder="Search stocks..." testID="search-with-value" />
        </View>
      </ScrollView>
    );
  },
  args: {},
};

// Use Cases
export const UseCases: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [stockSearch, setStockSearch] = useState('');
    const [cryptoSearch, setCryptoSearch] = useState('');
    const [peopleSearch, setPeopleSearch] = useState('');

    return (
      <ScrollView style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Real-World Use Cases
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Stock Search
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Search stocks by name or symbol
          </EtText>
          <EtSearchInput value={stockSearch} onChangeText={setStockSearch} placeholder="Search stocks (e.g., AAPL, TSLA)" testID="stock-search" />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Crypto Search
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Find cryptocurrencies
          </EtText>
          <EtSearchInput value={cryptoSearch} onChangeText={setCryptoSearch} placeholder="Search crypto (e.g., BTC, ETH)" testID="crypto-search" />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            People Search
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Search for traders and investors
          </EtText>
          <EtSearchInput value={peopleSearch} onChangeText={setPeopleSearch} placeholder="Search" maxLength={50} testID="people-search" />
        </View>
      </ScrollView>
    );
  },
  args: {},
};

// Accessibility
export const Accessibility: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [basicSearch, setBasicSearch] = useState('');
    const [stockSearch, setStockSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    return (
      <ScrollView style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Accessibility Configuration
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Basic Accessibility
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Label: "Search field" • Hint: "Type to search"
          </EtText>
          <EtSearchInput
            value={basicSearch}
            onChangeText={setBasicSearch}
            placeholder="Search"
            accessibilityLabel="Search field"
            accessibilityHint="Type to search"
            testID="basic-a11y-search"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Descriptive Accessibility
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Label: "Stock search input" • Hint: "Search stocks by name or ticker symbol"
          </EtText>
          <EtSearchInput
            value={stockSearch}
            onChangeText={setStockSearch}
            placeholder="Search stocks (e.g., AAPL, TSLA)"
            accessibilityLabel="Stock search input"
            accessibilityHint="Search stocks by name or ticker symbol"
            testID="stock-a11y-search"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Contextual Accessibility
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Label: "User search" • Hint: "Find traders and copy investors by username"
          </EtText>
          <EtSearchInput
            value={userSearch}
            onChangeText={setUserSearch}
            placeholder="Search users"
            accessibilityLabel="User search"
            accessibilityHint="Find traders and copy investors by username"
            testID="user-a11y-search"
          />
        </View>
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    width: '100%',
    maxWidth: 600,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 8,
  },
});
