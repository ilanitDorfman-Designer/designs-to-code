import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import { EtNumberPicker } from 'etoro-ui';

// Transform args for the new grouped API
const transformArgs = (args: any) => ({
  state: {
    value: args.value || 0,
    onValueChange: args.onValueChange,
    min: args.min,
    max: args.max,
    step: args.step,
    disabled: args.disabled,
  },
  appearance: {
    size: args.size,
    buttonColor: args.buttonColor,
    textColor: args.textColor,
    backgroundColor: args.backgroundColor,
  },
  interaction: {
    haptics: args.haptics,
  },
  style: {
    style: args.style,
  },
  accessibility: {
    testID: args.testID,
    accessibilityLabel: args.accessibilityLabel,
  },
});

// Wrapper component to manage state for interactive stories
const EtNumberPickerWrapper = (props: any) => {
  const [value, setValue] = useState(props.value || 0);

  const transformedArgs = transformArgs({
    ...props,
    value,
    onValueChange: setValue,
  });

  return <EtNumberPicker {...transformedArgs} />;
};

const meta = {
  title: 'eToro-UI/Components/Controls/EtNumberPicker',
  component: EtNumberPickerWrapper,
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'Current number value',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number' },
      description: 'Step increment',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the picker is disabled',
    },
    haptics: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback',
    },
    buttonColor: {
      control: { type: 'color' },
      description: 'Custom button color',
    },
    textColor: {
      control: { type: 'color' },
      description: 'Custom text color',
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Custom background color',
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessibility label',
    },
  },
  args: {
    value: 13,
    min: 0,
    max: 100,
    step: 1,
    size: 'medium',
    disabled: false,
    haptics: true,
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtNumberPickerWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive story with controls
export const Interactive: Story = {};

// Size variants
export const Small: Story = {
  args: {
    size: 'small',
    value: 5,
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    value: 13,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    value: 25,
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    value: 8,
    buttonColor: '#FF6B6B',
    backgroundColor: '#2D2D2D',
    textColor: '#FFFFFF',
  },
};

// Range examples
export const SmallRange: Story = {
  args: {
    value: 3,
    min: 1,
    max: 5,
    step: 1,
  },
};

export const LargeNumbers: Story = {
  args: {
    value: 1500,
    min: 1000,
    max: 2000,
    step: 50,
  },
};

export const CustomStep: Story = {
  args: {
    value: 25,
    min: 10,
    max: 100,
    step: 5,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    value: 10,
    disabled: true,
  },
};

export const AtMinimum: Story = {
  args: {
    value: 0,
    min: 0,
    max: 10,
  },
};

export const AtMaximum: Story = {
  args: {
    value: 10,
    min: 0,
    max: 10,
  },
};

// Showcase stories
export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <EtNumberPickerWrapper size="small" value={5} />
      <EtNumberPickerWrapper size="medium" value={13} />
      <EtNumberPickerWrapper size="large" value={25} />
    </View>
  ),
  args: {},
};

export const ColorVariants: Story = {
  render: () => (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <EtNumberPickerWrapper value={8} buttonColor="#FF6B6B" backgroundColor="#2D2D2D" />
      <EtNumberPickerWrapper value={12} buttonColor="#4ECDC4" backgroundColor="#2A2A2A" />
      <EtNumberPickerWrapper value={16} buttonColor="#45B7D1" backgroundColor="#1E1E1E" />
    </View>
  ),
  args: {},
};
