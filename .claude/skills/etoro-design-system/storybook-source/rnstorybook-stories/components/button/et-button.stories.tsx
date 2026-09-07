import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtButton, EtText } from 'etoro-ui';

type Story = StoryObj<typeof EtButton>;

const meta: Meta<typeof EtButton> = {
  title: 'eToro-UI/Components/Button/EtButton',
  component: EtButton,
  parameters: {
    notes: 'Button component with variants, sizes, and states.',
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

export const Interactive: Story = {
  render: (args) => (
    <EtButton {...args}>
      <EtButton.Label>Button</EtButton.Label>
    </EtButton>
  ),
  args: {
    variant: 'primary-filled',
    size: 'medium',
    disabled: false,
    loading: false,
    onPress: () => console.log('Button pressed'),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary-filled',
        'info-filled',
        'negative-filled',
        'primary-subtle',
        'info-subtle',
        'negative-subtle',
        'primary-ghost',
        'info-ghost',
        'negative-ghost',
      ],
    },
    size: {
      control: 'select',
      options: ['tiny', 'small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export const Variants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Button Variants
      </EtText>
      <View style={styles.grid}>
        <EtButton variant="primary-filled" onPress={() => {}}>
          <EtButton.Label>Primary</EtButton.Label>
        </EtButton>
        <EtButton variant="info-filled" onPress={() => {}}>
          <EtButton.Label>Info</EtButton.Label>
        </EtButton>
        <EtButton variant="primary-subtle" onPress={() => {}}>
          <EtButton.Label>Subtle</EtButton.Label>
        </EtButton>
        <EtButton variant="primary-ghost" onPress={() => {}}>
          <EtButton.Label>Ghost</EtButton.Label>
        </EtButton>
      </View>
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Button Sizes
      </EtText>
      <View style={styles.grid}>
        <EtButton size="small" onPress={() => {}}>
          <EtButton.Label>Small</EtButton.Label>
        </EtButton>
        <EtButton size="medium" onPress={() => {}}>
          <EtButton.Label>Medium</EtButton.Label>
        </EtButton>
        <EtButton size="large" onPress={() => {}}>
          <EtButton.Label>Large</EtButton.Label>
        </EtButton>
      </View>
    </View>
  ),
};

// All variants and sizes for the matrix
const variants: Array<
  | 'primary-filled'
  | 'info-filled'
  | 'negative-filled'
  | 'primary-subtle'
  | 'info-subtle'
  | 'negative-subtle'
  | 'primary-ghost'
  | 'info-ghost'
  | 'negative-ghost'
> = [
  'primary-filled',
  'info-filled',
  'negative-filled',
  'primary-subtle',
  'info-subtle',
  'negative-subtle',
  'primary-ghost',
  'info-ghost',
  'negative-ghost',
];

const sizes: Array<'tiny' | 'small' | 'medium' | 'large'> = ['tiny', 'small', 'medium', 'large'];

/**
 * Complete matrix of variants and sizes
 */
export const VariantSizeMatrix: Story = {
  render: () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Variant × Size Matrix
        </EtText>

        {/* Header row */}
        <View style={styles.matrixRow}>
          <View style={styles.matrixLabelCell} />
          {sizes.map((size) => (
            <View key={size} style={styles.matrixHeaderCell}>
              <EtText variant="label-tertiary-bold">{size}</EtText>
            </View>
          ))}
        </View>

        {/* Variant rows */}
        {variants.map((variant) => (
          <View key={variant} style={styles.matrixRow}>
            <View style={styles.matrixLabelCell}>
              <EtText variant="caption-medium">{variant}</EtText>
            </View>
            {sizes.map((size) => (
              <View key={`${variant}-${size}`} style={styles.matrixCell}>
                <EtButton variant={variant} size={size} onPress={() => {}}>
                  <EtButton.Label>Label</EtButton.Label>
                </EtButton>
              </View>
            ))}
          </View>
        ))}

        {/* With icons */}
        <EtText variant="label-primary-semibold" style={styles.groupTitle}>
          With Icons
        </EtText>
        {variants.map((variant) => (
          <View key={`${variant}-icon`} style={styles.matrixRow}>
            <View style={styles.matrixLabelCell}>
              <EtText variant="caption-medium">{variant}</EtText>
            </View>
            {sizes.map((size) => (
              <View key={`${variant}-${size}-icon`} style={styles.matrixCell}>
                <EtButton variant={variant} size={size} onPress={() => {}}>
                  <EtButton.Icon name="settings" />
                  <EtButton.Label>Label</EtButton.Label>
                </EtButton>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  ),
};

/**
 * Compositional Button API - use subcomponents
 */
export const ButtonAPI: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Button API
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Use EtButton.Label and EtButton.Icon for explicit composition
      </EtText>

      <View style={styles.column}>
        <EtText variant="label-secondary-semibold">Icon on the right:</EtText>
        <EtButton onPress={() => {}}>
          <EtButton.Label>Continue</EtButton.Label>
          <EtButton.Icon name="chevronRight" />
        </EtButton>
        <View style={styles.codeBlock}>
          <EtText style={styles.codeText}>
            {`<EtButton onPress={() => {}}>
  <EtButton.Label>Continue</EtButton.Label>
  <EtButton.Icon name="chevronRight" />
</EtButton>`}
          </EtText>
        </View>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          Icon on the left:
        </EtText>
        <EtButton onPress={() => {}}>
          <EtButton.Icon name="plus" />
          <EtButton.Label>Add Item</EtButton.Label>
        </EtButton>
        <View style={styles.codeBlock}>
          <EtText style={styles.codeText}>
            {`<EtButton onPress={() => {}}>
  <EtButton.Icon name="plus" />
  <EtButton.Label>Add Item</EtButton.Label>
</EtButton>`}
          </EtText>
        </View>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          Text only:
        </EtText>
        <EtButton onPress={() => {}} size="small">
          <EtButton.Label>Click me</EtButton.Label>
        </EtButton>
        <View style={styles.codeBlock}>
          <EtText style={styles.codeText}>
            {`<EtButton onPress={() => {}} size="small">
  <EtButton.Label>Click me</EtButton.Label>
</EtButton>`}
          </EtText>
        </View>
      </View>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Button States
      </EtText>
      <View style={styles.grid}>
        <EtButton onPress={() => {}}>
          <EtButton.Label>Normal</EtButton.Label>
        </EtButton>
        <EtButton loading onPress={() => {}}>
          <EtButton.Label>Loading</EtButton.Label>
        </EtButton>
        <EtButton variant="negative-filled" onPress={() => {}}>
          <EtButton.Label>Error</EtButton.Label>
        </EtButton>
        <EtButton disabled onPress={() => {}}>
          <EtButton.Label>Disabled</EtButton.Label>
        </EtButton>
        <EtButton stretch onPress={() => {}}>
          <EtButton.Label>Full Width</EtButton.Label>
        </EtButton>
      </View>

      {/* Disabled states for all variants */}
      <EtText variant="label-primary-semibold" style={styles.groupTitle}>
        Disabled States
      </EtText>
      <View style={styles.row}>
        <EtButton variant="primary-filled" disabled onPress={() => {}}>
          <EtButton.Label>Filled</EtButton.Label>
        </EtButton>
        <EtButton variant="primary-subtle" disabled onPress={() => {}}>
          <EtButton.Label>Subtle</EtButton.Label>
        </EtButton>
        <EtButton variant="primary-ghost" disabled onPress={() => {}}>
          <EtButton.Label>Ghost</EtButton.Label>
        </EtButton>
      </View>
    </View>
  ),
};

export const AnimatedWidth: Story = {
  render: () => {
    const [buttonStates, setButtonStates] = React.useState({
      save: { loading: false, text: 'Save Changes' },
      submit: { loading: false, text: 'Submit' },
      download: { loading: false, text: 'Download' },
    });

    const handleButtonPress = (buttonKey: 'save' | 'submit' | 'download') => {
      setButtonStates((prev) => ({
        ...prev,
        [buttonKey]: {
          loading: true,
          text: buttonKey === 'save' ? 'Saving...' : buttonKey === 'submit' ? 'Submitting...' : 'Downloading...',
        },
      }));

      setTimeout(() => {
        setButtonStates((prev) => ({
          ...prev,
          [buttonKey]: {
            loading: false,
            text: buttonKey === 'save' ? 'Saved!' : buttonKey === 'submit' ? 'Submitted!' : 'Downloaded!',
          },
        }));

        setTimeout(() => {
          setButtonStates((prev) => ({
            ...prev,
            [buttonKey]: {
              loading: false,
              text: buttonKey === 'save' ? 'Save Changes' : buttonKey === 'submit' ? 'Submit' : 'Download',
            },
          }));
        }, 1500);
      }, 2000);
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Animated Width Transitions
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Watch the buttons smoothly resize when text changes
        </EtText>

        <View style={styles.animatedGrid}>
          <EtButton loading={buttonStates.save.loading} onPress={() => handleButtonPress('save')}>
            <EtButton.Label>{buttonStates.save.text}</EtButton.Label>
          </EtButton>
          <EtButton loading={buttonStates.submit.loading} onPress={() => handleButtonPress('submit')}>
            <EtButton.Label>{buttonStates.submit.text}</EtButton.Label>
          </EtButton>
          <EtButton loading={buttonStates.download.loading} onPress={() => handleButtonPress('download')}>
            <EtButton.Label>{buttonStates.download.text}</EtButton.Label>
          </EtButton>
        </View>
      </View>
    );
  },
};

export const ErrorShakeAnimation: Story = {
  render: () => {
    const [errorStates, setErrorStates] = React.useState({
      payment: false,
      transfer: false,
      trade: false,
    });

    const triggerError = (buttonKey: 'payment' | 'transfer' | 'trade') => {
      setErrorStates((prev) => ({ ...prev, [buttonKey]: true }));

      // Auto-clear error after 3 seconds
      setTimeout(() => {
        setErrorStates((prev) => ({ ...prev, [buttonKey]: false }));
      }, 3000);
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Error Shake Animation
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Tap buttons to trigger iPhone Dynamic Island-style error feedback
        </EtText>

        <View style={styles.animatedGrid}>
          <EtButton variant={errorStates.payment ? 'negative-filled' : 'primary-filled'} onPress={() => triggerError('payment')}>
            <EtButton.Label>Process Payment</EtButton.Label>
          </EtButton>
          <EtButton variant={errorStates.transfer ? 'negative-filled' : 'primary-filled'} onPress={() => triggerError('transfer')}>
            <EtButton.Label>Transfer Funds</EtButton.Label>
          </EtButton>
          <EtButton variant={errorStates.trade ? 'negative-filled' : 'primary-filled'} onPress={() => triggerError('trade')}>
            <EtButton.Label>Execute Trade</EtButton.Label>
          </EtButton>
        </View>

        <EtText variant="body-secondary-regular" style={styles.errorNote}>
          🎯 Error state automatically clears after 3 seconds
        </EtText>
      </View>
    );
  },
};

export const TextFadeTransitions: Story = {
  render: () => {
    const [currentState, setCurrentState] = React.useState<'normal' | 'loading' | 'error'>('normal');

    const cycleStates = () => {
      setCurrentState((prev) => {
        switch (prev) {
          case 'normal':
            return 'loading';
          case 'loading':
            return 'error';
          case 'error':
            return 'normal';
          default:
            return 'normal';
        }
      });
    };

    const getButtonProps = () => {
      switch (currentState) {
        case 'loading':
          return { loading: true, variant: 'primary-filled' as const, title: 'Process Payment' };
        case 'error':
          return { loading: false, variant: 'negative-filled' as const, title: 'Process Payment' };
        default:
          return { loading: false, variant: 'primary-filled' as const, title: 'Process Payment' };
      }
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Text Fade Transitions
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Watch text smoothly fade between states
        </EtText>

        <View style={styles.animatedGrid}>
          <EtButton variant={getButtonProps().variant} loading={getButtonProps().loading} onPress={cycleStates}>
            <EtButton.Label>{getButtonProps().title}</EtButton.Label>
          </EtButton>

          <EtText variant="body-secondary-regular" style={styles.stateIndicator}>
            Current State: <EtText variant="label-primary-bold">{currentState}</EtText>
          </EtText>

          <EtText variant="body-secondary-regular" style={styles.fadeDetails}>
            • "Process Payment" → "Loading..." → "Something went wrong"
            {'\n'}• Each transition: 150ms fade out + 150ms fade in
            {'\n'}• Coordinated with width and shake animations
          </EtText>
        </View>
      </View>
    );
  },
};

export const TextClipping: Story = {
  render: () => {
    const longText = 'Process Very Long Payment Transaction';

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Text Clipping & Truncation
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Compare different ellipsize modes with long text
        </EtText>

        <View style={styles.clippingGrid}>
          {/* Fixed width container to show clipping */}
          <View style={styles.fixedWidthContainer}>
            <EtText variant="label-primary-bold" style={styles.clippingLabel}>
              Tail (default)
            </EtText>
            <EtButton onPress={() => {}}>
              <EtButton.Label numberOfLines={1} ellipsizeMode="tail">
                {longText}
              </EtButton.Label>
            </EtButton>
          </View>

          <View style={styles.fixedWidthContainer}>
            <EtText variant="label-primary-bold" style={styles.clippingLabel}>
              Middle
            </EtText>
            <EtButton onPress={() => {}}>
              <EtButton.Label numberOfLines={1} ellipsizeMode="middle">
                {longText}
              </EtButton.Label>
            </EtButton>
          </View>

          <View style={styles.fixedWidthContainer}>
            <EtText variant="label-primary-bold" style={styles.clippingLabel}>
              Head
            </EtText>
            <EtButton onPress={() => {}}>
              <EtButton.Label numberOfLines={1} ellipsizeMode="head">
                {longText}
              </EtButton.Label>
            </EtButton>
          </View>

          <View style={styles.fixedWidthContainer}>
            <EtText variant="label-primary-bold" style={styles.clippingLabel}>
              Clip (no ellipsis)
            </EtText>
            <EtButton onPress={() => {}}>
              <EtButton.Label numberOfLines={1} ellipsizeMode="clip">
                {longText}
              </EtButton.Label>
            </EtButton>
          </View>

          <View style={styles.fixedWidthContainer}>
            <EtText variant="label-primary-bold" style={styles.clippingLabel}>
              No clipping (auto width)
            </EtText>
            <EtButton onPress={() => {}}>
              <EtButton.Label>{longText}</EtButton.Label>
            </EtButton>
          </View>
        </View>

        <EtText variant="body-secondary-regular" style={styles.clippingNote}>
          💡 Set numberOfLines={0} to disable truncation and allow full text
        </EtText>
      </View>
    );
  },
};

export const TradingInterface: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Trading Interface
      </EtText>
      <View style={styles.tradingExample}>
        <EtButton variant="primary-filled" size="large" onPress={() => {}}>
          <EtButton.Label>Buy AAPL</EtButton.Label>
        </EtButton>
        <EtButton variant="info-filled" size="large" onPress={() => {}}>
          <EtButton.Label>Sell</EtButton.Label>
        </EtButton>
      </View>
      <View style={styles.formExample}>
        <EtButton stretch onPress={() => {}}>
          <EtButton.Label>Save Portfolio</EtButton.Label>
        </EtButton>
        <EtButton variant="primary-ghost" stretch onPress={() => {}}>
          <EtButton.Label>Cancel</EtButton.Label>
        </EtButton>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  animatedGrid: {
    gap: 16,
    alignItems: 'center',
    width: '100%',
  },
  errorNote: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 16,
  },
  stateIndicator: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
  },
  fadeDetails: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    lineHeight: 18,
  },
  clippingGrid: {
    gap: 20,
    alignItems: 'center',
    width: '100%',
  },
  fixedWidthContainer: {
    width: 200,
    alignItems: 'center',
    gap: 8,
  },
  clippingLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  clippingNote: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 16,
    fontStyle: 'italic',
  },
  tradingExample: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formExample: {
    width: '100%',
    maxWidth: 300,
    gap: 8,
  },
  groupTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  column: {
    gap: 12,
    alignItems: 'flex-start',
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  matrixLabelCell: {
    width: 120,
    paddingRight: 8,
  },
  matrixHeaderCell: {
    width: 100,
    alignItems: 'center',
  },
  matrixCell: {
    width: 100,
    alignItems: 'center',
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    width: '100%',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
