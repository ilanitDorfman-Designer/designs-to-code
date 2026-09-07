import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtText, EtTextToggle } from 'etoro-ui';

// ============================================================================
// Interactive Wrapper Components for Each Story
// ============================================================================

function BasicToggle() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth>
      <EtTextToggle.Option id="option1" label="Option 1" />
      <EtTextToggle.Option id="option2" label="Option 2" />
      <EtTextToggle.Option id="option3" label="Option 3" />
    </EtTextToggle>
  );
}

function SmallSizeToggle() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="small" fullWidth>
      <EtTextToggle.Option id="option1" label="Option 1" />
      <EtTextToggle.Option id="option2" label="Option 2" />
      <EtTextToggle.Option id="option3" label="Option 3" />
    </EtTextToggle>
  );
}

function TimeFrameToggle() {
  const [selectedId, setSelectedId] = useState('1d');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="small" fullWidth>
      <EtTextToggle.Option id="1d" label="1D" />
      <EtTextToggle.Option id="1w" label="1W" />
      <EtTextToggle.Option id="1m" label="1M" />
      <EtTextToggle.Option id="3m" label="3M" />
      <EtTextToggle.Option id="1y" label="1Y" />
    </EtTextToggle>
  );
}

function TwoOptionsToggle() {
  const [selectedId, setSelectedId] = useState('buy');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth>
      <EtTextToggle.Option id="buy" label="Buy" />
      <EtTextToggle.Option id="sell" label="Sell" />
    </EtTextToggle>
  );
}

function FullWidthToggle() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth>
      <EtTextToggle.Option id="option1" label="Option 1" />
      <EtTextToggle.Option id="option2" label="Option 2" />
      <EtTextToggle.Option id="option3" label="Option 3" />
    </EtTextToggle>
  );
}

function DisabledToggle() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth disabled>
      <EtTextToggle.Option id="option1" label="Option 1" />
      <EtTextToggle.Option id="option2" label="Option 2" />
      <EtTextToggle.Option id="option3" label="Option 3" />
    </EtTextToggle>
  );
}

function LongLabelsToggle() {
  const [selectedId, setSelectedId] = useState('very-long');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth>
      <EtTextToggle.Option id="very-long" label="Very Long Label" />
      <EtTextToggle.Option id="short" label="Short" />
      <EtTextToggle.Option id="medium-length" label="Medium Length" />
    </EtTextToggle>
  );
}

function DisabledOptionToggle() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth>
      <EtTextToggle.Option id="option1" label="Option 1" />
      <EtTextToggle.Option id="option2" label="Disabled" disabled />
      <EtTextToggle.Option id="option3" label="Option 3" />
    </EtTextToggle>
  );
}

// ============================================================================
// Custom Styling Examples - Demonstrating Flexibility
// ============================================================================

function ColorfulLabelsToggle() {
  const [selectedId, setSelectedId] = useState('red');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="large" fullWidth>
      <EtTextToggle.Option id="red" label="Red" textStyle={{ color: '#FF6B6B', fontWeight: '600' }} />
      <EtTextToggle.Option id="green" label="Green" textStyle={{ color: '#51CF66', fontWeight: '600' }} />
      <EtTextToggle.Option id="blue" label="Blue" textStyle={{ color: '#339AF0', fontWeight: '600' }} />
    </EtTextToggle>
  );
}

function OutlineStyleToggle() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} variant="outline" size="large" fullWidth>
      <EtTextToggle.Option id="option1" label="Option 1" />
      <EtTextToggle.Option id="option2" label="Option 2" />
      <EtTextToggle.Option id="option3" label="Option 3" />
    </EtTextToggle>
  );
}

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof EtTextToggle> = {
  title: 'eToro-UI/Components/Controls/EtTextToggle',
  component: EtTextToggle,
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

export const Basic: Story = {
  render: () => <BasicToggle />,
};

export const SmallSize: Story = {
  render: () => <SmallSizeToggle />,
};

export const TimeFrameSelector: Story = {
  render: () => <TimeFrameToggle />,
};

export const TwoOptions: Story = {
  render: () => <TwoOptionsToggle />,
};

export const FullWidth: Story = {
  render: () => <FullWidthToggle />,
};

export const Disabled: Story = {
  render: () => <DisabledToggle />,
};

export const LongLabels: Story = {
  render: () => <LongLabelsToggle />,
};

export const DisabledOption: Story = {
  render: () => <DisabledOptionToggle />,
};

// ============================================================================
// Custom Styling Stories - Flexibility Examples
// ============================================================================

export const ColorfulLabels: Story = {
  render: () => <ColorfulLabelsToggle />,
};

export const OutlineStyle: Story = {
  render: () => <OutlineStyleToggle />,
};

// Showcase all variations
export const AllVariations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Text Toggle Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Size Variants
      </EtText>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Large (default)
        </EtText>
        <BasicToggle />
      </View>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Small
        </EtText>
        <SmallSizeToggle />
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Option Counts
      </EtText>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Two Options
        </EtText>
        <TwoOptionsToggle />
      </View>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Five Options (Time Frame)
        </EtText>
        <TimeFrameToggle />
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        States
      </EtText>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Disabled
        </EtText>
        <DisabledToggle />
      </View>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Disabled Option
        </EtText>
        <DisabledOptionToggle />
      </View>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Long Labels
        </EtText>
        <LongLabelsToggle />
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Variant Styles
      </EtText>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Outline Style
        </EtText>
        <OutlineStyleToggle />
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Custom Styling Examples
      </EtText>

      <View style={styles.exampleContainer}>
        <EtText variant="body-secondary-regular" style={styles.exampleLabel}>
          Colorful Labels
        </EtText>
        <ColorfulLabelsToggle />
      </View>
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showcase: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  exampleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  exampleLabel: {
    marginBottom: 8,
    opacity: 0.7,
  },
});
