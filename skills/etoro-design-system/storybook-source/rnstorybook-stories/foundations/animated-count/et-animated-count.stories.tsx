import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtAnimatedCount, EtButton } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

const meta: Meta<typeof EtAnimatedCount> = {
  title: 'eToro-UI/Foundations/AnimatedCount',
  component: EtAnimatedCount,
  parameters: {
    notes: 'Animated counter component with smooth digit transitions and spring physics.',
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

type Story = StoryObj<typeof EtAnimatedCount>;

export const Default: Story = {
  render: () => <EtAnimatedCount number={1234} />,
  args: {},
};

export const SmallSize: Story = {
  render: () => <EtAnimatedCount number={567} fontSize={24} textDigitHeight={30} textDigitWidth={20} />,
  args: {},
};

export const LargeSize: Story = {
  render: () => <EtAnimatedCount number={890} fontSize={72} textDigitHeight={80} textDigitWidth={60} />,
  args: {},
};

export const CustomColor: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    return <EtAnimatedCount number={4321} color={colors.actionBrandText} />;
  },
  args: {},
};

export const InteractiveDemo: Story = {
  render: () => {
    const [count, setCount] = useState(100);

    const handleIncrement = () => setCount((prev) => prev + 1);
    const handleDecrement = () => setCount((prev) => Math.max(0, prev - 1));
    const handleReset = () => setCount(0);
    const handleRandomize = () => setCount(Math.floor(Math.random() * 10000));

    return (
      <View style={styles.interactiveContainer}>
        <View style={styles.countContainer}>
          <EtAnimatedCount number={count} />
        </View>
        <View style={styles.buttonsContainer}>
          <EtButton onPress={handleIncrement}>
            <EtButton.Label>+1</EtButton.Label>
          </EtButton>
          <EtButton onPress={handleDecrement}>
            <EtButton.Label>-1</EtButton.Label>
          </EtButton>
          <EtButton onPress={handleReset}>
            <EtButton.Label>Reset</EtButton.Label>
          </EtButton>
          <EtButton onPress={handleRandomize}>
            <EtButton.Label>Random</EtButton.Label>
          </EtButton>
        </View>
      </View>
    );
  },
  args: {},
};

export const FormattedNumbers: Story = {
  render: () => {
    const [selectedFormat, setSelectedFormat] = useState('1,234');

    const formatExamples = [
      { label: 'Commas', value: '1,234,567' },
      { label: 'Decimals', value: '5,745.42' },
      { label: 'Currency', value: '$12,345.67' },
      { label: 'Percentage', value: '98.76%' },
    ];

    return (
      <View style={styles.formatTestContainer}>
        <View style={styles.countContainer}>
          <EtAnimatedCount number={selectedFormat} />
        </View>
        <View style={styles.buttonsContainer}>
          {formatExamples.map((example) => (
            <EtButton key={example.label} onPress={() => setSelectedFormat(example.value)}>
              <EtButton.Label>{example.label}</EtButton.Label>
            </EtButton>
          ))}
        </View>
      </View>
    );
  },
  args: {},
};

export const CharacterSpacing: Story = {
  render: () => {
    const [spacing, setSpacing] = useState(0);

    const spacingOptions = [0, 2, 4, 6, 8];

    return (
      <View style={styles.spacingTestContainer}>
        <View style={styles.countContainer}>
          <EtAnimatedCount number="$12,345.67" characterSpacing={spacing} />
        </View>
        <View style={styles.buttonsContainer}>
          {spacingOptions.map((space) => (
            <EtButton key={space} onPress={() => setSpacing(space)}>
              <EtButton.Label>{`${space}px`}</EtButton.Label>
            </EtButton>
          ))}
        </View>
      </View>
    );
  },
  args: {},
};

export const ZeroHandling: Story = {
  render: () => {
    const [number, setNumber] = useState(1000);

    const testValues = [0, 5, 10, 100, 1000, 10000];

    return (
      <View style={styles.zeroTestContainer}>
        <View style={styles.countContainer}>
          <EtAnimatedCount number={number} />
        </View>
        <View style={styles.buttonsContainer}>
          {testValues.map((value) => (
            <EtButton key={value} onPress={() => setNumber(value)}>
              <EtButton.Label>{value.toString()}</EtButton.Label>
            </EtButton>
          ))}
        </View>
      </View>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactiveContainer: {
    alignItems: 'center',
    gap: 24,
  },
  formatTestContainer: {
    alignItems: 'center',
    gap: 24,
  },
  spacingTestContainer: {
    alignItems: 'center',
    gap: 24,
  },
  zeroTestContainer: {
    alignItems: 'center',
    gap: 24,
  },
  countContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 24,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
});
