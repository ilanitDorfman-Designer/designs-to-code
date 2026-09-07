import type { Meta, StoryObj } from '@storybook/react';
import { EtText } from 'etoro-ui/foundations/text/et-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ToastProvider, useToast } from '../../../../../libs/etoro-ui/src/components/feedback/toast';

const meta: Meta = {
  title: 'Components/Feedback/Toast/Introduction',
  decorators: [
    (Story) => (
      <ToastProvider>
        <View style={styles.container}>
          <Story />
        </View>
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj;

function IntroContent() {
  const { showToast } = useToast();

  const handleShowToast = () => {
    showToast({
      type: 'asset',
      status: 'success',
      asset: { logoUrl: 'https://etoro-cdn-images.etoro.com/market-avatars/tsla/150x150.png' },
      message: 'Order executed for TSLA at $245.00',
    });
  };

  return (
    <View style={styles.content}>
      <EtText variant="heading-base">EtToast</EtText>
      <EtText variant="body-base-regular" style={styles.description}>
        A global toast notification system for displaying temporary messages to users. Toasts appear at the bottom of the screen and can be dismissed
        by swiping down or holding to pause the auto-dismiss timer.
      </EtText>

      <View style={styles.section}>
        <EtText variant="body-base-semibold">Types</EtText>
        <EtText variant="body-secondary-regular">
          • Asset - Single asset logo{'\n'}• Image - Custom image{'\n'}• Asset Group - Multiple stacked assets{'\n'}• Icon - Icon from the registry
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="body-base-semibold">Statuses</EtText>
        <EtText variant="body-secondary-regular">
          • Neutral - No badge{'\n'}• Loader - Animated spinner{'\n'}• Success - Green checkmark{'\n'}• Error - Red error icon{'\n'}• Disconnect - Red
          error icon
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="body-base-semibold">Usage</EtText>
        <View style={styles.codeBlock}>
          <EtText variant="body-secondary-regular" style={{ fontSize: 12 }}>
            {`// Wrap your app with ToastProvider
<ToastProvider>
  <App />
</ToastProvider>

// Use the hook to show toasts
const { showToast } = useToast();

showToast({
  type: 'asset',
  status: 'success',
  asset: { logoUrl: '...' },
  message: 'Order executed!',
});`}
          </EtText>
        </View>
      </View>

      <View style={styles.tryButton}>
        <EtText variant="body-base-semibold" onPress={handleShowToast}>
          Tap here to see a toast
        </EtText>
      </View>
    </View>
  );
}

export const Introduction: Story = {
  render: () => <IntroContent />,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  description: {
    color: '#999',
    marginTop: 8,
  },
  section: {
    gap: 8,
    marginTop: 16,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  tryButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
