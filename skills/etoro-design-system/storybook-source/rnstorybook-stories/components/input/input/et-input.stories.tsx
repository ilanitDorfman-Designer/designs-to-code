import type { Meta, StoryObj } from '@storybook/react-native';
import { EtInput, EtText, type InputType } from 'etoro-ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtInput>;

const meta: Meta<typeof EtInput> = {
  title: 'eToro-UI/Components/Input/EtInput',
  component: EtInput,
  parameters: {
    notes: 'New compositional input API with types, states, and subcomponents.',
  },
  decorators: [
    (Story) => (
      <ScrollView contentContainerStyle={styles.decorator}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;

// All input types for the matrix
const inputTypes: InputType[] = ['text', 'password', 'email', 'number', 'phone'];

/**
 * Simplified type × state matrix - key examples only
 */
export const TypeStateMatrix: Story = {
  render: () => {
    const [textValue, setTextValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [suffixValue1, setSuffixValue1] = useState('');
    const [suffixValue2, setSuffixValue2] = useState('');
    const [suffixValue3, setSuffixValue3] = useState('');
    const [suffixValue4, setSuffixValue4] = useState('');
    const [suffixValue5, setSuffixValue5] = useState('');
    const [suffixValue6, setSuffixValue6] = useState('');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Type × State Matrix
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Key input types across different states (interactive - type to see changes)
        </EtText>

        {/* Normal State */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Normal State
          </EtText>
          <View style={styles.typesGrid}>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                text
              </EtText>
              <EtInput type="text">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setTextValue} placeholder="Enter text..." />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                email
              </EtText>
              <EtInput type="email">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setEmailValue} placeholder="Enter email..." />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                password
              </EtText>
              <EtInput type="password">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setPasswordValue} placeholder="Enter password..." />
              </EtInput>
            </View>
          </View>
        </View>

        {/* Error State */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Error State
          </EtText>
          <View style={styles.typesGrid}>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                text
              </EtText>
              <EtInput type="text" error="Error message" defaultValue="invalid">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                email
              </EtText>
              <EtInput type="email" error="Invalid email format" defaultValue="invalid@email">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field />
              </EtInput>
            </View>
          </View>
        </View>

        {/* Disabled State */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Disabled State
          </EtText>
          <View style={styles.typesGrid}>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                text
              </EtText>
              <EtInput type="text" disabled defaultValue="Disabled value">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                email
              </EtText>
              <EtInput type="email" disabled defaultValue="user@example.com">
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field />
              </EtInput>
            </View>
          </View>
        </View>

        {/* Readonly State */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Readonly State
          </EtText>
          <View style={styles.typesGrid}>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                text
              </EtText>
              <EtInput type="text" readonly defaultValue="Read only value">
                <EtInput.Label>Label (Read only)</EtInput.Label>
                <EtInput.Field />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                email
              </EtText>
              <EtInput type="email" readonly defaultValue="readonly@example.com">
                <EtInput.Label>Label (Read only)</EtInput.Label>
                <EtInput.Field />
              </EtInput>
            </View>
          </View>
        </View>

        {/* Suffix Variations */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Adornment Variations
          </EtText>
          <View style={styles.typesGrid}>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                No suffix
              </EtText>
              <EtInput>
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setSuffixValue1} placeholder="Enter text..." />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                Text adornment only
              </EtText>
              <EtInput>
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setSuffixValue2} placeholder="Enter text..." />
                <EtInput.TextAdornment>Suffix</EtInput.TextAdornment>
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                Text adornment + counter
              </EtText>
              <EtInput maxLength={20} showCharCounter>
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setSuffixValue3} placeholder="Enter text..." />
                <EtInput.TextAdornment>Suffix</EtInput.TextAdornment>
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                Icon adornment only
              </EtText>
              <EtInput>
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setSuffixValue4} placeholder="Enter text..." />
                <EtInput.IconAdornment iconName="search" />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                Icon adornment + counter
              </EtText>
              <EtInput maxLength={20} showCharCounter>
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setSuffixValue5} placeholder="Enter text..." />
                <EtInput.IconAdornment iconName="user" />
              </EtInput>
            </View>
            <View style={styles.typeCell}>
              <EtText variant="caption-medium" style={styles.typeLabel}>
                Counter only
              </EtText>
              <EtInput maxLength={20} showCharCounter>
                <EtInput.Label>Label</EtInput.Label>
                <EtInput.Field onChangeText={setSuffixValue6} placeholder="Enter text..." />
              </EtInput>
            </View>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Compositional Input API - use subcomponents
 */
export const InputAPI: Story = {
  render: () => {
    const [basicValue, setBasicValue] = useState('');
    const [textAdornmentValue, setTextAdornmentValue] = useState('');
    const [iconAdornmentValue, setIconAdornmentValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [counterValue, setCounterValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Input API
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Use EtInput.Label, EtInput.Field, and optional subcomponents for explicit composition
        </EtText>

        {/* Basic Examples */}
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          Basic Examples
        </EtText>
        <View style={styles.column}>
          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Basic Input
            </EtText>
            <EtInput>
              <EtInput.Label>Name</EtInput.Label>
              <EtInput.Field onChangeText={setBasicValue} placeholder="Enter your name" />
            </EtInput>
            <View style={styles.codeBlock}>
              <EtText style={styles.codeText}>
                {`<EtInput>
  <EtInput.Label>Name</EtInput.Label>
  <EtInput.Field
    onChangeText={setValue}
    placeholder="Enter your name"
  />
</EtInput>`}
              </EtText>
            </View>
          </View>

          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Email Input
            </EtText>
            <EtInput>
              <EtInput.Label>Email</EtInput.Label>
              <EtInput.Field onChangeText={setEmailValue} placeholder="your@email.com" />
            </EtInput>
            <View style={styles.codeBlock}>
              <EtText style={styles.codeText}>
                {`<EtInput>
  <EtInput.Label>Email</EtInput.Label>
  <EtInput.Field
    onChangeText={setEmail}
    placeholder="your@email.com"
  />
</EtInput>`}
              </EtText>
            </View>
          </View>
        </View>

        {/* Adornment Examples */}
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          Adornment Examples
        </EtText>
        <View style={styles.column}>
          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Text Adornment
            </EtText>
            <EtInput type="number" maxLength={10} showCharCounter>
              <EtInput.Label>Amount</EtInput.Label>
              <EtInput.Field onChangeText={setTextAdornmentValue} placeholder="0.00" />
              <EtInput.TextAdornment>USD</EtInput.TextAdornment>
            </EtInput>
            <View style={styles.codeBlock}>
              <EtText style={styles.codeText}>
                {`<EtInput type="number" maxLength={10} showCharCounter>
  <EtInput.Label>Amount</EtInput.Label>
  <EtInput.Field
    onChangeText={setAmount}
    placeholder="0.00"
  />
  <EtInput.TextAdornment>USD</EtInput.TextAdornment>
</EtInput>`}
              </EtText>
            </View>
          </View>

          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Icon Adornment
            </EtText>
            <EtInput>
              <EtInput.Label>Search</EtInput.Label>
              <EtInput.Field onChangeText={setIconAdornmentValue} placeholder="Search..." />
              <EtInput.IconAdornment iconName="search" />
            </EtInput>
            <View style={styles.codeBlock}>
              <EtText style={styles.codeText}>
                {`<EtInput>
  <EtInput.Label>Search</EtInput.Label>
  <EtInput.Field
    onChangeText={setSearch}
    placeholder="Search..."
  />
  <EtInput.IconAdornment iconName="search" />
</EtInput>`}
              </EtText>
            </View>
          </View>
        </View>

        {/* Advanced Examples */}
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          Advanced Examples
        </EtText>
        <View style={styles.column}>
          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Character Counter
            </EtText>
            <EtInput type="email" maxLength={50} showCharCounter>
              <EtInput.Label>Email</EtInput.Label>
              <EtInput.Field onChangeText={setCounterValue} placeholder="your@email.com" />
            </EtInput>
            <View style={styles.codeBlock}>
              <EtText style={styles.codeText}>
                {`<EtInput type="email" maxLength={50} showCharCounter>
  <EtInput.Label>Email</EtInput.Label>
  <EtInput.Field
    onChangeText={setEmail}
    placeholder="your@email.com"
  />
</EtInput>`}
              </EtText>
            </View>
          </View>

          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Password (Auto-toggle)
            </EtText>
            <EtInput type="password">
              <EtInput.Label>Password</EtInput.Label>
              <EtInput.Field onChangeText={setPasswordValue} placeholder="Enter password" />
            </EtInput>
            <View style={styles.codeBlock}>
              <EtText style={styles.codeText}>
                {`<EtInput type="password">
  <EtInput.Label>Password</EtInput.Label>
  <EtInput.Field
    onChangeText={setPassword}
    placeholder="Enter password"
  />
</EtInput>`}
              </EtText>
            </View>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Password toggle is automatically rendered when type="password"
            </EtText>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Composition examples
 */
export const CompositionExamples: Story = {
  render: () => {
    const [requiredValue, setRequiredValue] = useState('');
    const [currencyValue, setCurrencyValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [transitionValue, setTransitionValue] = useState('');
    const [hasError, setHasError] = useState(false);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Composition Examples
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Real-world use cases and unique combinations
        </EtText>

        <View style={styles.column}>
          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Required field
            </EtText>
            <EtInput>
              <EtInput.Label required>Email</EtInput.Label>
              <EtInput.Field onChangeText={setRequiredValue} placeholder="your@email.com" />
            </EtInput>
          </View>

          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Currency input with counter
            </EtText>
            <EtInput type="number" maxLength={10} showCharCounter>
              <EtInput.Label>Amount</EtInput.Label>
              <EtInput.Field onChangeText={setCurrencyValue} placeholder="0.00" />
              <EtInput.TextAdornment>USD</EtInput.TextAdornment>
            </EtInput>
          </View>

          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Search with icon
            </EtText>
            <EtInput>
              <EtInput.Label>Search</EtInput.Label>
              <EtInput.Field onChangeText={setSearchValue} placeholder="Search..." />
              <EtInput.IconAdornment iconName="search" />
            </EtInput>
          </View>

          <View style={styles.apiExample}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Interactive transition (empty → filled → error)
            </EtText>
            <EtInput error={hasError && transitionValue.length < 3 ? 'Must be at least 3 characters' : null}>
              <EtInput.Label>Username</EtInput.Label>
              <EtInput.Field
                onChangeText={(text) => {
                  setTransitionValue(text);
                  setHasError(text.length > 0 && text.length < 3);
                }}
                placeholder="Enter username..."
              />
            </EtInput>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Type to see state transitions. Error appears when length is 1-2 characters.
            </EtText>
          </View>
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  showcase: {
    gap: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 12,
  },
  groupTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  column: {
    gap: 12,
    alignItems: 'flex-start',
  },
  statesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  stateColumn: {
    gap: 8,
    alignItems: 'flex-start',
    minWidth: 150,
  },
  stateSection: {
    marginBottom: 32,
  },
  stateTitle: {
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  typeCell: {
    width: '100%',
    minWidth: 280,
    maxWidth: 350,
    gap: 8,
  },
  typeLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  apiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  apiExample: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    gap: 8,
  },
  exampleLabel: {
    marginBottom: 4,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    width: '100%',
  },
  codeLabel: {
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  note: {
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
