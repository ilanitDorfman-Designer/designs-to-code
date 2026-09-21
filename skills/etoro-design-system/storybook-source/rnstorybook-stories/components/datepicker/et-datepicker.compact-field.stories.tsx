import type { Meta, StoryObj } from '@storybook/react-native';
import { EtDatepicker, EtText } from 'etoro-ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtDatepicker>;

const meta: Meta<typeof EtDatepicker> = {
  title: 'eToro-UI/Components/Datepicker/EtDatepicker/CompactField',
  component: EtDatepicker,
  parameters: {
    notes: 'CompactField variant - pill-style datepicker for compact layouts and filters.',
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

/**
 * Basic examples
 */
export const BasicExamples: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(null);
    const [date2, setDate2] = useState<Date | null>(new Date());

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Basic Examples
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Pill-style date picker for compact layouts
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              No date selected (shows format hint)
            </EtText>
            <EtDatepicker variant="compactField" value={date1} onChange={(d) => setDate1(d as Date | null)} />
            <EtText variant="body-tiny-regular" style={styles.note}>
              When empty, displays the format string as a hint
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              With date selected
            </EtText>
            <EtDatepicker variant="compactField" value={date2} onChange={(d) => setDate2(d as Date | null)} />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Custom format
            </EtText>
            <EtDatepicker variant="compactField" value={date2} onChange={(d) => setDate2(d as Date | null)} format="MM/dd/yyyy" />
          </View>
        </View>
      </View>
    );
  },
};

/**
 * State variations
 */
export const StateVariations: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          State Variations
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Different states of the compact field variant
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Normal State
            </EtText>
            <EtDatepicker variant="compactField" defaultValue={new Date()} />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Error State
            </EtText>
            <EtDatepicker variant="compactField" defaultValue={null} error="Please select a date" />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Disabled State
            </EtText>
            <EtDatepicker variant="compactField" defaultValue={new Date()} disabled />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Readonly State
            </EtText>
            <EtDatepicker variant="compactField" defaultValue={new Date()} readonly />
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Customization with composition
 */
export const Composition: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(new Date());
    const [date2, setDate2] = useState<Date | null>(new Date());

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Composition
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Customize the compact display using composition
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Default (auto-rendered)
            </EtText>
            <EtDatepicker variant="compactField" value={date1} onChange={(d) => setDate1(d as Date | null)} />
            <EtText variant="body-tiny-regular" style={styles.note}>
              No children needed - CompactFieldDisplay auto-rendered
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Without icon
            </EtText>
            <EtDatepicker variant="compactField" value={date1} onChange={(d) => setDate1(d as Date | null)}>
              <EtDatepicker.CompactFieldDisplay showIcon={false} />
            </EtDatepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              showIcon=false hides the calendar icon
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Custom icon
            </EtText>
            <EtDatepicker variant="compactField" value={date2} onChange={(d) => setDate2(d as Date | null)}>
              <EtDatepicker.CompactFieldDisplay iconName="notification" />
            </EtDatepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Custom icon: notification
            </EtText>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Variant Comparison - inputField vs compactField
 */
export const VariantComparison: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date());

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Variant Comparison
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Side-by-side comparison of inputField and compactField variants
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              inputField (default)
            </EtText>
            <EtDatepicker variant="inputField" value={date} onChange={(d) => setDate(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Form-style with floating label
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              compactField
            </EtText>
            <EtDatepicker variant="compactField" value={date} onChange={(d) => setDate(d as Date | null)} />
            <EtText variant="body-tiny-regular" style={styles.note}>
              Pill-style button, no label
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
  column: {
    gap: 12,
    alignItems: 'flex-start',
  },
  example: {
    width: '100%',
    minWidth: 280,
    maxWidth: 400,
    gap: 8,
  },
  exampleLabel: {
    marginBottom: 4,
  },
  note: {
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
