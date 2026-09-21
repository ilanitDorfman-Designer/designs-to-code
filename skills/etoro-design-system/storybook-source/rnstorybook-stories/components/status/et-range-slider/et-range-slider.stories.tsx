import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { EtRangeSlider } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core/hooks';

type SliderStoryProps = {
  min: number;
  max: number;
  value: number;
  cursorColor: 'positive' | 'negative';
};

const meta: Meta<SliderStoryProps> = {
  title: 'eToro-UI/Components/Status/EtRangeSlider',
  component: EtRangeSlider,
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    value: { control: { type: 'number' } },
    cursorColor: {
      control: { type: 'radio' },
      options: ['positive', 'negative'],
    },
  },
  args: {
    min: 0,
    max: 100,
    value: 45,
    cursorColor: 'positive',
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<SliderStoryProps>;

export const Default: Story = {
  render: (args) => {
    const { colors } = useEtoroTheme();
    const [val, setVal] = useState(args.value);
    useEffect(() => {
      setVal(args.value);
    }, [args.value]);

    return (
      <View
        style={{
          padding: 16,
          backgroundColor: colors.bgSecondaryNeutral,
          borderRadius: 8,
        }}
      >
        <EtRangeSlider
          min={args.min}
          max={args.max}
          value={val}
          cursorColor={args.cursorColor}
          onValueChange={setVal}
          minLabel="MIN"
          maxLabel="MAX"
        />
      </View>
    );
  },
};

export const RedCursor: Story = {
  args: {
    cursorColor: 'negative',
  },
  render: (args) => {
    const { colors } = useEtoroTheme();
    const [val, setVal] = useState(25);
    return (
      <View
        style={{
          padding: 16,
          backgroundColor: colors.bgSecondaryNeutral,
          borderRadius: 8,
        }}
      >
        <EtRangeSlider min={0} max={100} value={val} cursorColor={args.cursorColor} onValueChange={setVal} minLabel="MIN" maxLabel="MAX" />
      </View>
    );
  },
};

export const TightLayout: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [val, setVal] = useState(60);
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 12,
          backgroundColor: colors.bgSecondaryNeutral,
        }}
      >
        <EtRangeSlider min={0} max={120} value={val} onValueChange={setVal} minLabel="MIN" maxLabel="MAX" />
      </View>
    );
  },
};

export const CustomLabels: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [val, setVal] = useState(50);
    return (
      <View
        style={{
          padding: 16,
          backgroundColor: colors.bgSecondaryNeutral,
          borderRadius: 8,
        }}
      >
        <EtRangeSlider min={0} max={100} value={val} onValueChange={setVal} minLabel="Low" maxLabel="High" />
      </View>
    );
  },
};
