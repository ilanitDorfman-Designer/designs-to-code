import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPhoneInput, EtText } from 'etoro-ui';
import { eToroLightColors } from 'etoro-ui/core/styles/colors';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtPhoneInput>;

const meta: Meta<typeof EtPhoneInput> = {
  title: 'eToro-UI/Components/Input/EtPhoneInput',
  component: EtPhoneInput,
  parameters: {
    notes: 'Phone number input with country code prefix and number field.',
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

/**
 * All visual states of the phone input
 */
export const States: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          States
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          All visual states of the EtPhoneInput component
        </EtText>

        {/* Default (Empty) */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Default (Empty)
          </EtText>
          <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" onPrefixPress={() => {}} />
        </View>

        {/* Interactive */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Interactive (type to see focused state)
          </EtText>
          <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" onChangeText={setValue} onPrefixPress={() => {}} />
          <EtText variant="body-tiny-regular" style={styles.note}>
            Current value: {value || '(empty)'}
          </EtText>
        </View>

        {/* Filled */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Filled
          </EtText>
          <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" defaultValue="233233233" />
        </View>

        {/* Error */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Error
          </EtText>
          <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" defaultValue="233233233" error="Error Validation" />
        </View>

        {/* Disabled */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Disabled
          </EtText>
          <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" defaultValue="233233233" disabled prefixDisabled />
        </View>

        {/* Prefix Disabled Only */}
        <View style={styles.stateSection}>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Prefix Disabled Only
          </EtText>
          <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" prefixDisabled onChangeText={() => {}} />
          <EtText variant="body-tiny-regular" style={styles.note}>
            Number field is editable, prefix is disabled.
          </EtText>
        </View>
      </View>
    );
  },
};

/**
 * Different country prefixes
 */
export const CountryVariants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Country Variants
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Different country code prefixes and flags
      </EtText>

      <View style={styles.stateSection}>
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          United Kingdom (+44)
        </EtText>
        <EtPhoneInput prefix="+44" isoCode="GB" placeholder="Number" defaultValue="7911123456" />
      </View>

      <View style={styles.stateSection}>
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          United States (+1)
        </EtText>
        <EtPhoneInput prefix="+1" isoCode="US" placeholder="Number" defaultValue="2025551234" />
        <EtText variant="body-tiny-regular" style={styles.note}>
          Single digit prefix
        </EtText>
      </View>

      <View style={styles.stateSection}>
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          Israel (+972)
        </EtText>
        <EtPhoneInput prefix="+972" isoCode="IL" placeholder="Number" defaultValue="523456789" />
        <EtText variant="body-tiny-regular" style={styles.note}>
          Three digit prefix
        </EtText>
      </View>
    </View>
  ),
};

/**
 * Interactive callbacks
 */
export const Callbacks: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [events, setEvents] = useState<Array<{ id: string; text: string }>>([]);

    const addEvent = (eventText: string) => {
      setEvents((prev) => [...prev.slice(-4), { id: `${Date.now()}-${Math.random()}`, text: eventText }]);
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Callbacks
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Interactive example showing all callback events
        </EtText>

        <EtPhoneInput
          prefix="+44"
          isoCode="GB"
          placeholder="Number"
          onChangeText={(val) => {
            setValue(val);
            addEvent(`onChangeText: "${val}"`);
          }}
          onFocus={() => addEvent('onFocus')}
          onBlur={() => addEvent('onBlur')}
          onSubmitEditing={(val) => addEvent(`onSubmitEditing: "${val}"`)}
          onPrefixPress={() => addEvent('onPrefixPress')}
        />

        <View style={styles.eventsContainer}>
          <EtText variant="label-primary-semibold">Value: {value || '(empty)'}</EtText>
          <EtText variant="label-primary-semibold" style={styles.groupTitle}>
            Events:
          </EtText>
          {events.map((event) => (
            <EtText key={event.id} variant="body-tiny-regular">
              {event.text}
            </EtText>
          ))}
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
    marginBottom: 8,
  },
  stateSection: {
    marginBottom: 24,
  },
  note: {
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 4,
  },
  eventsContainer: {
    marginTop: 16,
    gap: 4,
  },
});
