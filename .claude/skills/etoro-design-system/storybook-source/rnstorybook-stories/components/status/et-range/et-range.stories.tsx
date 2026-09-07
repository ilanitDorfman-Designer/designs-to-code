import type { Meta, StoryObj } from '@storybook/react-native';
import { EtRange } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { StyleSheet, Text, View } from 'react-native';

type EtRangeStoryProps = {
  min: number;
  max: number;
  value: number;
  cursorHeight: number;
  isPositive: boolean;
};

const meta: Meta<EtRangeStoryProps> = {
  title: 'eToro-UI/Components/Status/EtRange',
  component: EtRange,
  argTypes: {
    min: {
      control: { type: 'number' },
      description: 'Minimum value displayed on the left side',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value displayed on the right side',
    },
    value: {
      control: { type: 'number' },
      description: 'Current value represented by the cursor',
    },
    cursorHeight: {
      control: { type: 'number' },
      description: 'Height of the cursor indicator',
    },
    isPositive: {
      control: { type: 'boolean' },
      description: 'Controls cursor color (green/red)',
    },
  },
  args: {
    min: 0,
    max: 100,
    value: 50,
    cursorHeight: 37,
    isPositive: true,
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<EtRangeStoryProps>;

// Interactive story with controls
export const Default: Story = {
  render: (args) => {
    const { colors } = useEtoroTheme();
    const currentValue = args.value;

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.valueText, { color: colors.textPrimaryNeutral }]}>Current Value: {currentValue.toFixed(2)}</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={args.min} max={args.max} value={args.value} isPositive={args.isPositive} cursorHeight={args.cursorHeight} />
        </View>
      </View>
    );
  },
};

// Compact layout matching the design spec
export const DesignSpec: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>Design Spec (Compact)</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={610.21} max={610.21} value={610.21} cursorHeight={37} />
        </View>
      </View>
    );
  },
};

// Price range example
export const PriceRange: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const lowPrice = 142.5;
    const highPrice = 189.75;
    const currentPrice = 166.12;

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>AAPL Price Range (52 Week)</Text>
        <Text style={[styles.valueText, { color: colors.actionBrandText }]}>${currentPrice.toFixed(2)}</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={lowPrice} max={highPrice} value={currentPrice} formatValue={(value) => `$${value.toFixed(2)}`} />
        </View>
      </View>
    );
  },
};

// Percentage range example
export const PercentageRange: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const currentValue = 72;

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>Portfolio Allocation</Text>
        <Text style={[styles.valueText, { color: colors.actionBrandText }]}>{currentValue.toFixed(0)}% Stocks</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={0} max={100} value={currentValue} formatValue={(value) => `${value.toFixed(0)}%`} />
        </View>
        <Text style={[styles.helperText, { color: colors.textSecondaryNeutral }]}>Static allocation preview</Text>
      </View>
    );
  },
};

// Read-only example
export const ReadOnly: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const value = 6.5;

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>Risk Score (Read Only)</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={1} max={10} value={value} formatValue={(val) => val.toFixed(1)} />
        </View>
        <Text style={[styles.helperText, { color: colors.textSecondaryNeutral }]}>Your risk score: 6.5/10</Text>
      </View>
    );
  },
};

// Disabled example
export const Disabled: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const value = 40;

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>Disabled State</Text>
        <View style={[styles.rangeContainer, { opacity: 0.5 }]}>
          <EtRange min={0} max={100} value={value} />
        </View>
        <Text style={[styles.helperText, { color: colors.textSecondaryNeutral }]}>This range slider is disabled</Text>
      </View>
    );
  },
};

// Custom cursor height
export const CustomCursorHeight: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>Cursor Height Variations</Text>

        <Text style={[styles.labelText, { color: colors.textSecondaryNeutral }]}>Small (12px)</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={0} max={100} value={50} cursorHeight={12} />
        </View>

        <Text style={[styles.labelText, { color: colors.textSecondaryNeutral }]}>Default (16px)</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={0} max={100} value={50} cursorHeight={37} />
        </View>

        <Text style={[styles.labelText, { color: colors.textSecondaryNeutral }]}>Large (24px)</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={0} max={100} value={50} cursorHeight={48} />
        </View>
      </View>
    );
  },
};

// Callbacks demo
export const WithCallbacks: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const status = 'Static';
    const currentValue = 50;

    return (
      <View style={styles.storyContainer}>
        <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>Callback Events</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: colors.bgNeutralSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: colors.textSecondaryNeutral,
              },
            ]}
          >
            Status: {status}
          </Text>
        </View>
        <Text style={[styles.valueText, { color: colors.textPrimaryNeutral }]}>Value: {currentValue.toFixed(0)}</Text>
        <View style={styles.rangeContainer}>
          <EtRange min={0} max={100} value={currentValue} />
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  storyContainer: {
    padding: 16,
  },
  rangeContainer: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  positionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  labelText: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
