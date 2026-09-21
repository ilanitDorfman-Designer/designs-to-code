import type { Meta, StoryObj } from '@storybook/react-native';
import { enUS, es, fr } from 'date-fns/locale';
import { EtDatepicker, EtText } from 'etoro-ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtDatepicker>;

const meta: Meta<typeof EtDatepicker> = {
  title: 'eToro-UI/Components/Datepicker/EtDatepicker/InputField',
  component: EtDatepicker,
  parameters: {
    notes:
      'InputField variant — boxed InputV2 chrome (idle border always visible, error border + helper both actionBrandVarText). Use StateMatrix for side-by-side eyeballing vs InputV2.',
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
 * Basic datepicker examples
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
          Simple date selection with default settings
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Uncontrolled (defaultValue)
            </EtText>
            <EtDatepicker defaultValue={null}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Controlled (value)
            </EtText>
            <EtDatepicker value={date1} onChange={(d) => setDate1(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              With initial value
            </EtText>
            <EtDatepicker value={date2} onChange={(d) => setDate2(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * State matrix — one field per chrome state for eyeballing vs InputV2.
 * Focus ring is a color-lift while the native picker is open (D9: idle border always visible).
 */
export const StateMatrix: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          State Matrix (InputV2 chrome)
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Empty · filled · error · disabled · readonly. Open a field to see the focus border lift during picker open.
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Empty (idle border visible)
            </EtText>
            <EtDatepicker defaultValue={null}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Filled
            </EtText>
            <EtDatepicker defaultValue={new Date(2026, 5, 15)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Error (border + helper, actionBrandVarText)
            </EtText>
            <EtDatepicker error="Please select a valid date" defaultValue={null}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Disabled (carbon300 border, no opacity wash)
            </EtText>
            <EtDatepicker disabled defaultValue={new Date(2026, 5, 15)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Readonly (no focus ring, no calendar icon)
            </EtText>
            <EtDatepicker readonly defaultValue={new Date(2026, 5, 15)}>
              <EtDatepicker.Label>Date (Read only)</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Disabled + error (D8: carbon300 border, no red)
            </EtText>
            <EtDatepicker disabled error="Please select a valid date" defaultValue={new Date(2026, 5, 15)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Readonly + error (quiet chrome: carbon300 border, no red)
            </EtText>
            <EtDatepicker readonly error="Please select a valid date" defaultValue={new Date(2026, 5, 15)}>
              <EtDatepicker.Label>Date (Read only)</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
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
          Different states of the datepicker
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Normal State
            </EtText>
            <EtDatepicker defaultValue={null}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Error State
            </EtText>
            <EtDatepicker error="Please select a valid date" defaultValue={null}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Disabled State
            </EtText>
            <EtDatepicker disabled defaultValue={new Date()}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Readonly State
            </EtText>
            <EtDatepicker readonly defaultValue={new Date()}>
              <EtDatepicker.Label>Date (Read only)</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Date constraints
 */
export const DateConstraints: Story = {
  render: () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() + 1, 11, 31);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Date Constraints
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Min and max date constraints
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Future dates only (next year)
            </EtText>
            <EtDatepicker defaultValue={null} minDate={today} maxDate={maxDate}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Custom formats
 */
export const CustomFormats: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(null);
    const [date2, setDate2] = useState<Date | null>(null);
    const [date3, setDate3] = useState<Date | null>(null);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Custom Formats
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Different date format options
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Default (dd MMM yyyy)
            </EtText>
            <EtDatepicker value={date1} onChange={(d) => setDate1(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              US Format (MM/dd/yyyy)
            </EtText>
            <EtDatepicker value={date2} onChange={(d) => setDate2(d as Date | null)} format="MM/dd/yyyy">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Long Format (dd MMMM yyyy)
            </EtText>
            <EtDatepicker value={date3} onChange={(d) => setDate3(d as Date | null)} format="dd MMMM yyyy">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Locale support
 */
export const LocaleSupport: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(null);
    const [date2, setDate2] = useState<Date | null>(null);
    const [date3, setDate3] = useState<Date | null>(null);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Locale Support
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Internationalization with different locales
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              English (enUS)
            </EtText>
            <EtDatepicker value={date1} onChange={(d) => setDate1(d as Date | null)} locale={enUS} format="dd MMMM yyyy">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Spanish (es)
            </EtText>
            <EtDatepicker value={date2} onChange={(d) => setDate2(d as Date | null)} locale={es} format="dd 'de' MMMM yyyy">
              <EtDatepicker.Label>Fecha</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              French (fr)
            </EtText>
            <EtDatepicker value={date3} onChange={(d) => setDate3(d as Date | null)} locale={fr} format="dd MMMM yyyy">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Value types
 */
export const ValueTypes: Story = {
  render: () => {
    const [dateValue, setDateValue] = useState<Date | null>(null);
    const [isoValue, setIsoValue] = useState<string | null>(null);
    const [formattedValue, setFormattedValue] = useState<string | null>(null);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Value Types
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Different value type conversions
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Date Object (default)
            </EtText>
            <EtDatepicker value={dateValue} onChange={(d) => setDateValue(d as Date | null)} valueType="date">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
            {dateValue && (
              <EtText variant="body-tiny-regular" style={styles.note}>
                Value: {dateValue.toString()}
              </EtText>
            )}
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              ISO String
            </EtText>
            <EtDatepicker value={isoValue} onChange={(d) => setIsoValue(d as string | null)} valueType="iso">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
            {isoValue && (
              <EtText variant="body-tiny-regular" style={styles.note}>
                Value: {isoValue}
              </EtText>
            )}
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Formatted String
            </EtText>
            <EtDatepicker value={formattedValue} onChange={(d) => setFormattedValue(d as string | null)} valueType="formatted" format="yyyy-MM-dd">
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field />
            </EtDatepicker>
            {formattedValue && (
              <EtText variant="body-tiny-regular" style={styles.note}>
                Value: {formattedValue}
              </EtText>
            )}
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
    const [requiredDate, setRequiredDate] = useState<Date | null>(null);
    const [hasError, setHasError] = useState(false);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Composition Examples
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Real-world use cases and combinations
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Required field
            </EtText>
            <EtDatepicker
              value={requiredDate}
              onChange={(d) => {
                const date = d as Date | null;
                setRequiredDate(date);
                setHasError(!date);
              }}
              error={hasError ? 'Date is required' : null}
            >
              <EtDatepicker.Label required>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Custom Icon Examples
 */
export const CustomIcon: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(null);
    const [date2, setDate2] = useState<Date | null>(null);
    const [date3, setDate3] = useState<Date | null>(null);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Custom Icon Examples
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Customize the calendar icon with different icons, sizes, and colors
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Default Calendar Icon
            </EtText>
            <EtDatepicker value={date1} onChange={(d) => setDate1(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
            </EtDatepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Icon is automatically rendered (default: calendar)
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Custom Icon (Notification)
            </EtText>
            <EtDatepicker value={date2} onChange={(d) => setDate2(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
              <EtDatepicker.CalendarIcon iconName="notification" />
            </EtDatepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Custom icon: notification (replaces auto-rendered icon)
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Custom Size & Color
            </EtText>
            <EtDatepicker value={date3} onChange={(d) => setDate3(d as Date | null)}>
              <EtDatepicker.Label>Date</EtDatepicker.Label>
              <EtDatepicker.Field placeholder="Select date" />
              <EtDatepicker.CalendarIcon iconName="calendar" size={44} color="#FF0000" />
            </EtDatepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Custom size: 44px
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
