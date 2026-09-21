import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtProgressBar, EtProgressBarFillType } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={styles.codeHeader}>
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Status/EtProgressBar/📖 Introduction',
  parameters: {
    notes: 'Overview and usage guide for the EtProgressBar component.',
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

export const Introduction: Story = {
  render: () => {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>📊 EtProgressBar</Text>
        <Text style={styles.subtitle}>A linear progress bar to represent loading or investment performance progress.</Text>

        <View style={styles.demoBlock}>
          <Text style={styles.label}>Progress: 50%</Text>
          <EtProgressBar progress={0.5} height={12} fillType={EtProgressBarFillType.Solid} progressColor="#4caf50" style={styles.progressBar} />
        </View>

        <CodeBlock
          title="Basic Usage"
          code={`
            <EtProgressBar
              progress={0.5}
              height={12}
              fillType={EtProgressBarFillType.Solid}
              progressColor="#4caf50"
              style={styles.progressBar}
            />`}
        />

        <View style={styles.demoBlock}>
          <Text style={styles.label}>Progress: 75%</Text>
          <EtProgressBar
            progress={0.75}
            height={12}
            fillType={EtProgressBarFillType.Gradient}
            gradientColors={['#4de22b', '#3fb923']}
            style={styles.progressBar}
          />
        </View>

        <CodeBlock
          title="Custom Height with gradient"
          code={`<EtProgressBar
            progress={0.75}
            height={12}
            fillType={EtProgressBarFillType.Gradient}
            gradientColors={["#4de22b", "#3fb923"]}
            style={styles.progressBar}
          />`}
        />

        <View style={styles.demoBlock}>
          <Text style={styles.label}>Progress: 100%</Text>
          <EtProgressBar progress={1} height={12} fillType={EtProgressBarFillType.Solid} progressColor="#4caf50" style={styles.progressBar} />
        </View>

        <CodeBlock
          title="Full Progress"
          code={`<EtProgressBar
            progress={1}
            height={12}
            fillType={EtProgressBarFillType.Solid}
            progressColor="#4caf50"
            style={styles.progressBar}
          />`}
        />
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  demoBlock: {
    marginBottom: 24,
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  progressBar: {
    minWidth: 200,
    borderRadius: 20,
  },
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
});
