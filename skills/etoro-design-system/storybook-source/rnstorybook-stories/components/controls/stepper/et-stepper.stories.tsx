import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import { EtStepper } from 'etoro-ui';

const EtStepperWrapper = (props: any) => {
  const [value, setValue] = useState(props.value ?? 1);

  return (
    <EtStepper
      value={value}
      onChange={setValue}
      min={props.min}
      max={props.max}
      step={props.step}
      disabled={props.disabled}
      size={props.size}
      haptics={props.haptics}
    />
  );
};

const meta = {
  title: 'eToro-UI/Components/Controls/EtStepper',
  component: EtStepperWrapper,
  argTypes: {
    value: { control: { type: 'number' }, description: 'Current value' },
    min: { control: { type: 'number' }, description: 'Minimum value' },
    max: { control: { type: 'number' }, description: 'Maximum value' },
    step: { control: { type: 'number' }, description: 'Step increment' },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable all interactions',
    },
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size preset',
    },
    haptics: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback',
    },
  },
  args: {
    value: 1,
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
    size: 'md',
    haptics: true,
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtStepperWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ClampedMin: Story = {
  args: {
    value: 0,
    min: 0,
    max: 5,
  },
};

export const ClampedMax: Story = {
  args: {
    value: 5,
    min: 0,
    max: 5,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const AllSizes: Story = {
  render: () => {
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          paddingVertical: 12,
        }}
      >
        {sizes.map((size) => (
          <EtStepperWrapper key={size} size={size} />
        ))}
      </View>
    );
  },
};
