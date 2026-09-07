import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { EtStepIndicator, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<typeof EtStepIndicator>;

const ONBOARDING_STEPS = ['Profile', 'Verification', 'Deposit'];

// =============================================================================
// CODE BLOCK HELPER
// =============================================================================

const CodeBlock = ({ code }: { code: string }) => {
  const { colors } = useEtoroTheme();
  return (
    <View style={[styles.codeBlock, { backgroundColor: colors.bgNeutralSecondary }]}>
      <EtText variant="body-tiny-regular" style={styles.codeText}>
        {code}
      </EtText>
    </View>
  );
};

const meta: Meta<typeof EtStepIndicator> = {
  title: 'eToro-UI/Components/Status/EtStepIndicator',
  component: EtStepIndicator,
  parameters: {
    notes: 'Horizontal step indicator with a progress track, step dots and labels underneath.',
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

// =============================================================================
// PLAYGROUND
// =============================================================================

export const Playground: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Playground
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Default fill reaches the active step
        </EtText>

        <View style={styles.indicatorWrapper}>
          <EtStepIndicator steps={ONBOARDING_STEPS} currentStep={1} testID="step-indicator" />
        </View>

        <CodeBlock code={`<EtStepIndicator steps={['Profile', 'Verification', 'Deposit']} currentStep={1} />`} />
      </View>
    );
  },
};

// =============================================================================
// ONBOARDING CARD (FIGMA)
// =============================================================================

export const OnboardingCard: Story = {
  name: 'On Dark Card (Figma)',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Onboarding Card
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          The component has no background of its own — the dark card below is an external wrapper; only track/label colors are passed in
        </EtText>

        <View style={styles.darkCard}>
          <EtStepIndicator
            steps={ONBOARDING_STEPS}
            currentStep={0}
            progress={0.5}
            trackColor="rgba(255, 255, 255, 0.25)"
            labelColor="#8c8c91"
            activeLabelColor="#ffffff"
            testID="step-indicator-card"
          />
        </View>

        <CodeBlock
          code={`// Background is owned by the surrounding card, not the component
<View style={styles.darkCard}>
  <EtStepIndicator
    steps={['Profile', 'Verification', 'Deposit']}
    currentStep={0}
    progress={0.5}
    trackColor="rgba(255, 255, 255, 0.25)"
    labelColor="#8c8c91"
    activeLabelColor="#ffffff"
  />
</View>`}
        />
      </View>
    );
  },
};

// =============================================================================
// STEP STATES
// =============================================================================

export const StepStates: Story = {
  name: 'Step States',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Step States
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Active step moving through the flow
        </EtText>

        {ONBOARDING_STEPS.map((_, step) => (
          <View key={step} style={styles.indicatorWrapper}>
            <EtStepIndicator steps={ONBOARDING_STEPS} currentStep={step} testID={`step-indicator-${step}`} />
          </View>
        ))}

        <CodeBlock
          code={`<EtStepIndicator steps={steps} currentStep={0} />
<EtStepIndicator steps={steps} currentStep={1} />
<EtStepIndicator steps={steps} currentStep={2} />`}
        />
      </View>
    );
  },
};

// =============================================================================
// CUSTOM
// =============================================================================

export const Custom: Story = {
  name: 'Custom Colors & Steps',
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Custom Colors & Steps
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Any number of steps; size scales line + dots together; fill color overridable
        </EtText>

        <View style={styles.indicatorWrapper}>
          <EtStepIndicator
            steps={['Account', 'Details', 'Funding', 'Review', 'Done']}
            currentStep={2}
            size={14}
            color={colors.bgPositivePrimary}
            testID="step-indicator-custom"
          />
        </View>

        <CodeBlock
          code={`<EtStepIndicator
  steps={['Account', 'Details', 'Funding', 'Review', 'Done']}
  currentStep={2}
  size={14}
  color={colors.bgPositivePrimary}
/>`}
        />
      </View>
    );
  },
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    gap: 8,
  },
  storyTitle: {
    marginBottom: 4,
  },
  storyDesc: {
    opacity: 0.7,
    marginBottom: 12,
  },
  indicatorWrapper: {
    paddingVertical: 12,
  },
  darkCard: {
    backgroundColor: '#233329',
    borderRadius: 16,
    padding: 20,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  codeText: {
    fontFamily: 'Courier',
  },
});
