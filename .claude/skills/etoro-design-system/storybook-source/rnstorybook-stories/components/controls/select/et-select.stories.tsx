import type { Meta, StoryObj } from '@storybook/react-native';
import { EtCountryFlag, EtSelect, EtText } from 'etoro-ui';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Desc, Page, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/EtSelect/Component',
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

const handlePress = () => {
  Alert.alert('Select Pressed', 'Field was pressed');
};

export const Text: Story = {
  render: () => (
    <EtSelect type="text" onPress={handlePress}>
      <EtSelect.Value>Select</EtSelect.Value>
    </EtSelect>
  ),
};

export const Field: Story = {
  render: () => (
    <EtSelect type="field" onPress={handlePress}>
      <EtSelect.Value>Select</EtSelect.Value>
    </EtSelect>
  ),
};

export const FieldWithValue: Story = {
  render: () => (
    <EtSelect type="field" onPress={handlePress}>
      <EtSelect.Label>Country of residence</EtSelect.Label>
      <EtSelect.LeadingContent>
        <EtCountryFlag isoCode="GB" size={20} />
      </EtSelect.LeadingContent>
      <EtSelect.Value>United Kingdom</EtSelect.Value>
    </EtSelect>
  ),
};

export const FieldDisabled: Story = {
  render: () => (
    <EtSelect type="field" onPress={handlePress} disabled>
      <EtSelect.Value>Select</EtSelect.Value>
    </EtSelect>
  ),
};

export const FieldWithValueDisabled: Story = {
  render: () => (
    <EtSelect type="field" onPress={handlePress} disabled>
      <EtSelect.Label>Country</EtSelect.Label>
      <EtSelect.LeadingContent>
        <EtCountryFlag isoCode="GB" size={20} />
      </EtSelect.LeadingContent>
      <EtSelect.Value>United Kingdom</EtSelect.Value>
    </EtSelect>
  ),
};

export const FieldReadonly: Story = {
  render: () => (
    <EtSelect type="field" onPress={handlePress} readonly accessibilityHint="Country is fixed for DKK accounts">
      <EtSelect.Label>Account country</EtSelect.Label>
      <EtSelect.LeadingContent>
        <EtCountryFlag isoCode="DK" size={20} />
      </EtSelect.LeadingContent>
      <EtSelect.Value>Denmark</EtSelect.Value>
    </EtSelect>
  ),
};

export const FieldNoChevron: Story = {
  render: () => (
    <EtSelect type="field" onPress={handlePress} showChevron={false}>
      <EtSelect.Label>Account country</EtSelect.Label>
      <EtSelect.LeadingContent>
        <EtCountryFlag isoCode="GB" size={20} />
      </EtSelect.LeadingContent>
      <EtSelect.Value>United Kingdom</EtSelect.Value>
    </EtSelect>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.grid}>
      {/* ── Text Type ── */}
      <EtText variant="heading-base" style={styles.sectionTitle}>
        type=&quot;text&quot; (inline + chevron)
      </EtText>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Basic
        </EtText>
        <EtSelect type="text" onPress={handlePress}>
          <EtSelect.Value>Select</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.divider} />

      {/* ── Field Type ── */}
      <EtText variant="heading-base" style={styles.sectionTitle}>
        type=&quot;field&quot; (bordered container)
      </EtText>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Empty (placeholder)
        </EtText>
        <EtSelect type="field" onPress={handlePress}>
          <EtSelect.Value>Select</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          With Label + Value (auto-filled)
        </EtText>
        <EtSelect type="field" onPress={handlePress}>
          <EtSelect.Label>Time</EtSelect.Label>
          <EtSelect.Value>10:15 AM</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          With Country Flag
        </EtText>
        <EtSelect type="field" onPress={handlePress}>
          <EtSelect.Label>Country of residence</EtSelect.Label>
          <EtSelect.LeadingContent>
            <EtCountryFlag isoCode="GB" size={20} />
          </EtSelect.LeadingContent>
          <EtSelect.Value>United Kingdom</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.divider} />

      {/* ── Disabled States ── */}
      <EtText variant="heading-base" style={styles.sectionTitle}>
        Disabled States
      </EtText>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Field Disabled (empty)
        </EtText>
        <EtSelect type="field" onPress={handlePress} disabled>
          <EtSelect.Value>Select</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Field Disabled (with value)
        </EtText>
        <EtSelect type="field" onPress={handlePress} disabled>
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.LeadingContent>
            <EtCountryFlag isoCode="GB" size={20} />
          </EtSelect.LeadingContent>
          <EtSelect.Value>United Kingdom</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.divider} />

      {/* ── Readonly States ── */}
      <EtText variant="heading-base" style={styles.sectionTitle}>
        Readonly States
      </EtText>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Field Readonly (DKK locked country — normal colors, no chevron)
        </EtText>
        <EtSelect type="field" onPress={handlePress} readonly accessibilityHint="Country is fixed for DKK accounts">
          <EtSelect.Label>Account country</EtSelect.Label>
          <EtSelect.LeadingContent>
            <EtCountryFlag isoCode="DK" size={20} />
          </EtSelect.LeadingContent>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Field Readonly + Disabled (D5 — disabled wins, chevron stays visible dimmed)
        </EtText>
        <EtSelect type="field" onPress={handlePress} readonly disabled>
          <EtSelect.Label>Account country</EtSelect.Label>
          <EtSelect.LeadingContent>
            <EtCountryFlag isoCode="DK" size={20} />
          </EtSelect.LeadingContent>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.row}>
        <EtText variant="body-base-semibold" style={styles.stateTitle}>
          Field with showChevron=&#123;false&#125; (enabled, no chevron)
        </EtText>
        <EtSelect type="field" onPress={handlePress} showChevron={false}>
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.LeadingContent>
            <EtCountryFlag isoCode="GB" size={20} />
          </EtSelect.LeadingContent>
          <EtSelect.Value>United Kingdom</EtSelect.Value>
        </EtSelect>
      </View>

      <View style={styles.divider} />
    </ScrollView>
  ),
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>
      <Section>
        <SubTitle>EtSelect</SubTitle>
        <Desc>Root select trigger component. Uses compound children for composition.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'type', type: "'text' | 'field'", default: "'field'" },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'readonly', type: 'boolean', default: 'false' },
            { prop: 'showChevron', type: 'boolean', default: 'true' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'width', type: 'DimensionValue', default: '335' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'accessibilityHint', type: 'string', default: '-' },
          ]}
        />
      </Section>
      <Section>
        <SubTitle>EtSelect.Label</SubTitle>
        <Desc>Label text above the value. Triggers filled appearance in field type.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'string', default: '-' }]} />
      </Section>
      <Section>
        <SubTitle>EtSelect.Value</SubTitle>
        <Desc>Value or placeholder text.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'string | number | ReactElement', default: '-' }]} />
      </Section>
      <Section>
        <SubTitle>EtSelect.LeadingContent</SubTitle>
        <Desc>Content before the value (e.g. flag, icon). Field type only.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'ReactNode', default: '-' }]} />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    gap: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  row: {
    gap: 8,
  },
  stateTitle: {
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
});
