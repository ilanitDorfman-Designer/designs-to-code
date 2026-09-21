import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPhoneInput } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core/hooks';
import { eToroLightColors } from 'etoro-ui/core/styles/colors';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const IntroContent = () => {
  const { colors } = useEtoroTheme();
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>EtPhoneInput Component</Text>

      <Text style={[styles.description, { color: colors.textPrimaryNeutral }]}>
        A two-part phone number input with country code prefix (flag + dial code + dropdown chevron) and a number input field. Supports default,
        focused, error, and disabled states.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Features</Text>
      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Prefix section: Flag icon + dial code + dropdown chevron</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Number field: Phone-pad keyboard, placeholder support</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• States: Default, Focused, Filled, Error, Disabled</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Independent disabled control for prefix and number</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Uncontrolled mode with defaultValue</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Basic Usage</Text>
      <View style={styles.exampleContainer}>
        <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" onChangeText={setPhoneNumber} onPrefixPress={() => {}} />
      </View>
      <View style={[styles.codeBlock, { backgroundColor: colors.bgNeutralQuaternary }]}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>
          {`import { EtPhoneInput } from 'etoro-ui';

<EtPhoneInput
  prefix="+44"
  isoCode="GB"
  placeholder="Number"
  onChangeText={setPhoneNumber}
  onPrefixPress={openCountryPicker}
/>`}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Error State</Text>
      <View style={styles.exampleContainer}>
        <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" defaultValue="12345" error="Invalid phone number" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Disabled State</Text>
      <View style={styles.exampleContainer}>
        <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" defaultValue="233233233" disabled prefixDisabled />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Component API</Text>
      <View style={[styles.codeBlock, { backgroundColor: colors.bgNeutralQuaternary }]}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>
          {`<EtPhoneInput
  prefix: string            // Required - dial code (e.g., "+44")
  isoCode: string           // Required - country ISO code (e.g., "GB")
  placeholder: string       // Required - placeholder text
  defaultValue?: string     // Initial phone number
  error?: string | null     // Error message
  disabled?: boolean        // Disable number input
  prefixDisabled?: boolean  // Disable prefix section
  autoFocus?: boolean       // Auto-focus on mount
  onChangeText?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onSubmitEditing?: (value: string) => void
  onPrefixPress?: () => void
/>`}
        </Text>
      </View>

      <Text
        style={[
          styles.tip,
          {
            color: colors.textPrimaryNeutral,
            backgroundColor: colors.bgNeutralSecondary,
          },
        ]}
      >
        Explore the other stories to see all states, country variants, and callback examples in action!
      </Text>
    </ScrollView>
  );
};

const meta: Meta<typeof IntroContent> = {
  title: 'eToro-UI/Components/Input/EtPhoneInput/📖 Introduction',
  component: IntroContent,
  decorators: [
    (Story) => (
      <NavigationIndependentTree>
        <NavigationContainer theme={eToroLightColors}>
          <View style={{ flex: 1 }}>
            <Story />
          </View>
        </NavigationContainer>
      </NavigationIndependentTree>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Introduction: Story = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  exampleContainer: {
    marginBottom: 16,
    gap: 16,
  },
  codeBlock: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
  },
  tip: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
  },
});
