import type { Meta, StoryObj } from '@storybook/react-native';
import { EtMotionSwap, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X4, X6 } from 'etoro-ui/core/styles/spacing';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Story = StoryObj<{}>;

function MotionSwapDemo({ axis }: { axis: 'x' | 'y' }) {
  const { colors } = useEtoroTheme();
  const [showSecond, setShowSecond] = useState(false);

  return (
    <View style={styles.demo}>
      <EtMotionSwap
        axis={axis}
        showSecond={showSecond}
        first={
          <EtText variant="body-base-semibold" style={{ color: colors.textPrimaryNeutral }}>
            First layer
          </EtText>
        }
        second={
          <EtText variant="body-base-semibold" style={{ color: colors.actionBrandText }}>
            Second layer
          </EtText>
        }
      />
      <Pressable style={[styles.button, { backgroundColor: colors.actionBrandBackground }]} onPress={() => setShowSecond((v) => !v)}>
        <EtText variant="label-primary-semibold" style={{ color: colors.textPrimaryNeutral }}>
          Toggle
        </EtText>
      </Pressable>
    </View>
  );
}

MotionSwapDemo.displayName = 'MotionSwapDemo';

const meta: Meta<{}> = {
  title: 'Layout/MotionSwap',
  component: MotionSwapDemo,
};

export default meta;

export const HorizontalXAxis: Story = {
  render: () => <MotionSwapDemo axis="x" />,
  name: 'Horizontal (axis=x)',
};

export const VerticalYAxis: Story = {
  render: () => <MotionSwapDemo axis="y" />,
  name: 'Vertical (axis=y)',
};

const styles = StyleSheet.create({
  demo: {
    alignItems: 'center',
    gap: X6,
    paddingVertical: X6,
  },
  button: {
    paddingHorizontal: X6,
    paddingVertical: X4,
    borderRadius: 16,
  },
});
