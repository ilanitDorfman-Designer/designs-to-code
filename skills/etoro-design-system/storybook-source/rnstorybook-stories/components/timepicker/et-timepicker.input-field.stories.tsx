import type { Meta, StoryObj } from '@storybook/react-native';
import { EtTimepicker, EtText } from 'etoro-ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { TimeValue } from 'etoro-ui';
import { CodeBlock } from '../../utils/code-block';

type Story = StoryObj<typeof EtTimepicker>;

const meta: Meta<typeof EtTimepicker> = {
  title: 'eToro-UI/Components/Timepicker/EtTimepicker/InputField',
  component: EtTimepicker,
  parameters: {
    notes: 'InputField variant - form-style timepicker with floating label and compound components.',
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
 * Basic timepicker examples
 */
export const BasicExamples: Story = {
  render: () => {
    const [time1, setTime1] = useState<TimeValue | null>(null);
    const [time2, setTime2] = useState<TimeValue | null>({
      hours: 14,
      minutes: 30,
    });

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Basic Examples
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Simple time selection with default settings
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Uncontrolled (defaultValue)
            </EtText>
            <EtTimepicker defaultValue={null}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Controlled (value)
            </EtText>
            <EtTimepicker value={time1} onChange={(t) => setTime1(t)}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              With initial value
            </EtText>
            <EtTimepicker value={time2} onChange={(t) => setTime2(t)}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field />
            </EtTimepicker>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`import { EtTimepicker } from 'etoro-ui';

// Uncontrolled
<EtTimepicker defaultValue={null}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>

// Controlled
<EtTimepicker value={time} onChange={(t) => setTime(t)}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>`}
        />
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
          Different states of the timepicker
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Normal State
            </EtText>
            <EtTimepicker defaultValue={null}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Error State
            </EtText>
            <EtTimepicker error="Please select a valid time" defaultValue={null}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Disabled State
            </EtText>
            <EtTimepicker disabled defaultValue={{ hours: 9, minutes: 30 }}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Readonly State
            </EtText>
            <EtTimepicker readonly defaultValue={{ hours: 9, minutes: 30 }}>
              <EtTimepicker.Label>Time (Read only)</EtTimepicker.Label>
              <EtTimepicker.Field />
            </EtTimepicker>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`// Error state
<EtTimepicker error="Please select a valid time" defaultValue={null}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>

// Disabled state
<EtTimepicker disabled defaultValue={{ hours: 9, minutes: 30 }}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>

// Readonly state
<EtTimepicker readonly defaultValue={{ hours: 9, minutes: 30 }}>
  <EtTimepicker.Label>Time (Read only)</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>`}
        />
      </View>
    );
  },
};

/**
 * Time formats
 */
export const TimeFormats: Story = {
  render: () => {
    const [time1, setTime1] = useState<TimeValue | null>({
      hours: 14,
      minutes: 30,
    });
    const [time2, setTime2] = useState<TimeValue | null>({
      hours: 14,
      minutes: 30,
    });

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Time Formats
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          12-hour and 24-hour display formats
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              24-hour format (default)
            </EtText>
            <EtTimepicker value={time1} onChange={(t) => setTime1(t)} format="24h">
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              12-hour format (AM/PM)
            </EtText>
            <EtTimepicker value={time2} onChange={(t) => setTime2(t)} format="12h">
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field />
            </EtTimepicker>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`// 24-hour format (default)
<EtTimepicker value={time} onChange={(t) => setTime(t)} format="24h">
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>

// 12-hour format (AM/PM)
<EtTimepicker value={time} onChange={(t) => setTime(t)} format="12h">
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>`}
        />
      </View>
    );
  },
};

/**
 * Minute intervals
 */
export const MinuteIntervals: Story = {
  render: () => {
    const [time1, setTime1] = useState<TimeValue | null>(null);
    const [time2, setTime2] = useState<TimeValue | null>(null);
    const [time3, setTime3] = useState<TimeValue | null>(null);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Minute Intervals
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Configurable minute step intervals
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              5-minute interval
            </EtText>
            <EtTimepicker value={time1} onChange={(t) => setTime1(t)} minuteInterval={5}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              15-minute interval
            </EtText>
            <EtTimepicker value={time2} onChange={(t) => setTime2(t)} minuteInterval={15}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              30-minute interval
            </EtText>
            <EtTimepicker value={time3} onChange={(t) => setTime3(t)} minuteInterval={30}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`<EtTimepicker
  value={time}
  onChange={(t) => setTime(t)}
  minuteInterval={5}  // 5, 15, or 30
>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>`}
        />
      </View>
    );
  },
};

/**
 * Composition examples
 */
export const CompositionExamples: Story = {
  render: () => {
    const [requiredTime, setRequiredTime] = useState<TimeValue | null>(null);
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
            <EtTimepicker
              value={requiredTime}
              onChange={(t) => {
                setRequiredTime(t);
                setHasError(!t);
              }}
              error={hasError ? 'Time is required' : null}
            >
              <EtTimepicker.Label required>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`<EtTimepicker
  value={time}
  onChange={(t) => {
    setTime(t);
    setHasError(!t);
  }}
  error={hasError ? 'Time is required' : null}
>
  <EtTimepicker.Label required>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>`}
        />
      </View>
    );
  },
};

/**
 * Custom Icon Examples
 */
export const CustomIcon: Story = {
  render: () => {
    const [time1, setTime1] = useState<TimeValue | null>(null);
    const [time2, setTime2] = useState<TimeValue | null>(null);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Custom Icon Examples
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Customize the clock icon with different icons, sizes, and colors
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Default Clock Icon
            </EtText>
            <EtTimepicker value={time1} onChange={(t) => setTime1(t)}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Icon is automatically rendered (default: calendar)
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Custom Icon (Notification)
            </EtText>
            <EtTimepicker value={time2} onChange={(t) => setTime2(t)}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
              <EtTimepicker.ClockIcon iconName="notification" />
            </EtTimepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Custom icon: notification (replaces auto-rendered icon)
            </EtText>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`// Default clock icon (auto-rendered)
<EtTimepicker value={time} onChange={(t) => setTime(t)}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>

// Custom icon
<EtTimepicker value={time} onChange={(t) => setTime(t)}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
  <EtTimepicker.ClockIcon iconName="notification" />
</EtTimepicker>`}
        />
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
