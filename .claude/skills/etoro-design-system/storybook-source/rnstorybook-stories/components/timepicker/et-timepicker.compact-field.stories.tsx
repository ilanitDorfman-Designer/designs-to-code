import type { Meta, StoryObj } from '@storybook/react-native';
import { EtTimepicker, EtText } from 'etoro-ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { TimeValue } from 'etoro-ui';
import { CodeBlock } from '../../utils/code-block';

type Story = StoryObj<typeof EtTimepicker>;

const meta: Meta<typeof EtTimepicker> = {
  title: 'eToro-UI/Components/Timepicker/EtTimepicker/CompactField',
  component: EtTimepicker,
  parameters: {
    notes: 'CompactField variant - pill-style timepicker for compact layouts and filters.',
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
          Pill-style time picker for compact layouts
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              No time selected (shows format hint)
            </EtText>
            <EtTimepicker variant="compactField" value={time1} onChange={(t) => setTime1(t)} />
            <EtText variant="body-tiny-regular" style={styles.note}>
              When empty, displays the format hint string
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              With time selected
            </EtText>
            <EtTimepicker variant="compactField" value={time2} onChange={(t) => setTime2(t)} />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              12-hour format
            </EtText>
            <EtTimepicker variant="compactField" value={time2} onChange={(t) => setTime2(t)} format="12h" />
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`import { EtTimepicker } from 'etoro-ui';

<EtTimepicker
  variant="compactField"
  value={time}
  onChange={(t) => setTime(t)}
/>

// 12-hour format
<EtTimepicker
  variant="compactField"
  value={time}
  onChange={(t) => setTime(t)}
  format="12h"
/>`}
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
          Different states of the compact field variant
        </EtText>

        <View style={styles.column}>
          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Normal State
            </EtText>
            <EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Error State
            </EtText>
            <EtTimepicker variant="compactField" defaultValue={null} error="Please select a time" />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Disabled State
            </EtText>
            <EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} disabled />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Readonly State
            </EtText>
            <EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} readonly />
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`// Error state
<EtTimepicker
  variant="compactField"
  defaultValue={null}
  error="Please select a time"
/>

// Disabled state
<EtTimepicker
  variant="compactField"
  defaultValue={{ hours: 9, minutes: 30 }}
  disabled
/>

// Readonly state
<EtTimepicker
  variant="compactField"
  defaultValue={{ hours: 9, minutes: 30 }}
  readonly
/>`}
        />
      </View>
    );
  },
};

/**
 * Customization with composition
 */
export const Composition: Story = {
  render: () => {
    const [time1, setTime1] = useState<TimeValue | null>({
      hours: 14,
      minutes: 30,
    });
    const [time2, setTime2] = useState<TimeValue | null>({
      hours: 9,
      minutes: 0,
    });

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
            <EtTimepicker variant="compactField" value={time1} onChange={(t) => setTime1(t)} />
            <EtText variant="body-tiny-regular" style={styles.note}>
              No children needed - CompactFieldDisplay auto-rendered
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Without icon
            </EtText>
            <EtTimepicker variant="compactField" value={time1} onChange={(t) => setTime1(t)}>
              <EtTimepicker.CompactFieldDisplay showIcon={false} />
            </EtTimepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              showIcon=false hides the icon
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              Custom icon
            </EtText>
            <EtTimepicker variant="compactField" value={time2} onChange={(t) => setTime2(t)}>
              <EtTimepicker.CompactFieldDisplay iconName="notification" />
            </EtTimepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Custom icon: notification
            </EtText>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`// Without icon
<EtTimepicker variant="compactField" value={time} onChange={setTime}>
  <EtTimepicker.CompactFieldDisplay showIcon={false} />
</EtTimepicker>

// Custom icon
<EtTimepicker variant="compactField" value={time} onChange={setTime}>
  <EtTimepicker.CompactFieldDisplay iconName="notification" />
</EtTimepicker>`}
        />
      </View>
    );
  },
};

/**
 * Minute Intervals
 */
export const MinuteIntervals: Story = {
  render: () => {
    const [time1, setTime1] = useState<TimeValue | null>({
      hours: 10,
      minutes: 0,
    });
    const [time2, setTime2] = useState<TimeValue | null>({
      hours: 10,
      minutes: 15,
    });
    const [time3, setTime3] = useState<TimeValue | null>({
      hours: 10,
      minutes: 30,
    });

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
            <EtTimepicker variant="compactField" value={time1} onChange={(t) => setTime1(t)} minuteInterval={5} />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              15-minute interval
            </EtText>
            <EtTimepicker variant="compactField" value={time2} onChange={(t) => setTime2(t)} minuteInterval={15} />
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              30-minute interval
            </EtText>
            <EtTimepicker variant="compactField" value={time3} onChange={(t) => setTime3(t)} minuteInterval={30} />
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`<EtTimepicker
  variant="compactField"
  value={time}
  onChange={(t) => setTime(t)}
  minuteInterval={5}  // 5, 15, or 30
/>`}
        />
      </View>
    );
  },
};

/**
 * Variant Comparison - inputField vs compactField
 */
export const VariantComparison: Story = {
  render: () => {
    const [time, setTime] = useState<TimeValue | null>({
      hours: 14,
      minutes: 30,
    });

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
            <EtTimepicker variant="inputField" value={time} onChange={(t) => setTime(t)}>
              <EtTimepicker.Label>Time</EtTimepicker.Label>
              <EtTimepicker.Field placeholder="Select time" />
            </EtTimepicker>
            <EtText variant="body-tiny-regular" style={styles.note}>
              Form-style with floating label
            </EtText>
          </View>

          <View style={styles.example}>
            <EtText variant="label-secondary-semibold" style={styles.exampleLabel}>
              compactField
            </EtText>
            <EtTimepicker variant="compactField" value={time} onChange={(t) => setTime(t)} />
            <EtText variant="body-tiny-regular" style={styles.note}>
              Pill-style button, no label
            </EtText>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`// inputField variant (form-style with label)
<EtTimepicker variant="inputField" value={time} onChange={setTime}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>

// compactField variant (pill-style)
<EtTimepicker
  variant="compactField"
  value={time}
  onChange={(t) => setTime(t)}
/>`}
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
