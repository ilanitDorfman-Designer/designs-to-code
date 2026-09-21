import type { Meta, StoryObj } from '@storybook/react';
import { EtButton } from 'etoro-ui';
import { EtText } from 'etoro-ui/foundations/text/et-text';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  ToastProvider,
  useToast,
  type ToastBadgeStatus,
  type ToastStatus,
  type ToastType,
} from '../../../../../libs/etoro-ui/src/components/feedback/toast';

const meta: Meta = {
  title: 'Components/Feedback/Toast/Examples',
  decorators: [
    (Story) => (
      <ToastProvider>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Story />
        </ScrollView>
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj;

// Mock asset logos (these would come from CDN in real app)
const MOCK_ASSETS = {
  TSLA: 'https://etoro-cdn.etorostatic.com/market-avatars/1111/1111_E82127_F7F7F7.svg',
  AAPL: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg',
  GOOG: 'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg',
  META: 'https://etoro-cdn.etorostatic.com/market-avatars/1003/1003_F7F7F7_2C2C2C.svg',
  AMZN: 'https://etoro-cdn-images.etoro.com/market-avatars/amzn/150x150.png',
};

// ============ Interactive Story ============
function InteractiveToasts() {
  const { showToast, dismissAll, toastCount } = useToast();
  const [selectedType, setSelectedType] = useState<ToastType>('asset');
  const [selectedStatus, setSelectedStatus] = useState<ToastStatus>('success');

  const isBadge = selectedType === 'badge';
  const badgeStatuses: ToastBadgeStatus[] = ['success', 'error'];
  const allStatuses: ToastStatus[] = ['neutral', 'loader', 'success', 'error', 'disconnect'];
  const availableStatuses = isBadge ? badgeStatuses : allStatuses;

  const handleShowToast = () => {
    const baseMessage = 'Order Received for buy ';
    const assetName = 'TSLA';

    const message = (
      <EtText variant="body-secondary-regular">
        {baseMessage}
        <EtText variant="body-secondary-semibold">{assetName}</EtText>
        {' at market'}
      </EtText>
    );

    switch (selectedType) {
      case 'asset':
        showToast({
          type: 'asset',
          status: selectedStatus,
          asset: { logoUrl: MOCK_ASSETS.TSLA },
          message,
        });
        break;
      case 'image':
        showToast({
          type: 'image',
          status: selectedStatus,
          image: { uri: MOCK_ASSETS.AAPL },
          message,
        });
        break;
      case 'assetGroup':
        showToast({
          type: 'assetGroup',
          status: selectedStatus,
          assetGroup: {
            assets: [{ logoUrl: MOCK_ASSETS.META }, { logoUrl: MOCK_ASSETS.TSLA }, { logoUrl: MOCK_ASSETS.GOOG }],
          },
          message: 'Portfolio rebalanced successfully',
        });
        break;
      case 'icon':
        showToast({
          type: 'icon',
          status: selectedStatus,
          icon: { name: 'notification' },
          message: 'You have new messages',
        });
        break;
      case 'badge':
        showToast({
          type: 'badge',
          status: selectedStatus as ToastBadgeStatus,
          message: selectedStatus === 'error' ? 'Something went wrong' : 'Action completed successfully',
        });
        break;
    }
  };

  const types: ToastType[] = ['asset', 'image', 'assetGroup', 'icon', 'badge'];

  return (
    <View style={styles.section}>
      <EtText variant="heading-base">Interactive Demo</EtText>
      <EtText variant="body-secondary-regular" style={styles.hint}>
        Select a type and status, then tap "Show Toast" to see it in action. Swipe down to dismiss, or hold to pause auto-dismiss.
      </EtText>

      <View style={styles.optionGroup}>
        <EtText variant="body-base-semibold">Type</EtText>
        <View style={styles.optionRow}>
          {types.map((type) => (
            <Pressable
              key={type}
              style={[styles.optionButton, selectedType === type && styles.optionButtonSelected]}
              onPress={() => {
                setSelectedType(type);
                if (type === 'badge' && !badgeStatuses.includes(selectedStatus as ToastBadgeStatus)) {
                  setSelectedStatus('success');
                }
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedType === type }}
            >
              <EtText variant="body-secondary-regular" style={[styles.optionText, selectedType === type && styles.optionTextSelected]}>
                {type}
              </EtText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.optionGroup}>
        <EtText variant="body-base-semibold">Status</EtText>
        <View style={styles.optionRow}>
          {availableStatuses.map((status) => (
            <Pressable
              key={status}
              style={[styles.optionButton, selectedStatus === status && styles.optionButtonSelected]}
              onPress={() => setSelectedStatus(status)}
              accessible={true}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedStatus === status }}
            >
              <EtText variant="body-secondary-regular" style={[styles.optionText, selectedStatus === status && styles.optionTextSelected]}>
                {status}
              </EtText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <EtButton onPress={handleShowToast} variant="primary-filled">
          Show Toast
        </EtButton>
        <EtButton onPress={dismissAll} variant="info-subtle">
          {`Dismiss All (${toastCount})`}
        </EtButton>
      </View>
    </View>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveToasts />,
};

// ============ Asset Types Story ============
function AssetTypesDemo() {
  const { showToast } = useToast();

  return (
    <View style={styles.section}>
      <EtText variant="heading-base">Toast Types</EtText>

      <View style={styles.demoRow}>
        <EtButton
          onPress={() =>
            showToast({
              type: 'asset',
              status: 'success',
              asset: { logoUrl: MOCK_ASSETS.TSLA },
              message: 'Single asset toast',
            })
          }
          variant="info-subtle"
        >
          Asset
        </EtButton>

        <EtButton
          onPress={() =>
            showToast({
              type: 'image',
              status: 'success',
              image: { uri: MOCK_ASSETS.AAPL },
              message: 'Image toast',
            })
          }
          variant="info-subtle"
        >
          Image
        </EtButton>
      </View>

      <View style={styles.demoRow}>
        <EtButton
          onPress={() =>
            showToast({
              type: 'assetGroup',
              status: 'success',
              assetGroup: {
                assets: [{ logoUrl: MOCK_ASSETS.META }, { logoUrl: MOCK_ASSETS.TSLA }, { logoUrl: MOCK_ASSETS.GOOG }],
              },
              message: 'Asset group toast',
            })
          }
          variant="info-subtle"
        >
          Asset Group
        </EtButton>

        <EtButton
          onPress={() =>
            showToast({
              type: 'icon',
              status: 'neutral',
              icon: { name: 'notification' },
              message: 'Icon toast',
            })
          }
          variant="info-subtle"
        >
          Icon
        </EtButton>
      </View>

      <View style={styles.demoRow}>
        <EtButton
          onPress={() =>
            showToast({
              type: 'badge',
              status: 'success',
              message: 'Action completed successfully',
            })
          }
          variant="primary-subtle"
        >
          Badge Success
        </EtButton>

        <EtButton
          onPress={() =>
            showToast({
              type: 'badge',
              status: 'error',
              message: 'Something went wrong',
            })
          }
          variant="negative-subtle"
        >
          Badge Error
        </EtButton>
      </View>
    </View>
  );
}

export const Types: Story = {
  render: () => <AssetTypesDemo />,
};

// ============ Status Variants Story ============
function StatusVariantsDemo() {
  const { showToast } = useToast();

  const showStatusToast = (status: ToastStatus) => {
    showToast({
      type: 'asset',
      status,
      asset: { logoUrl: MOCK_ASSETS.TSLA },
      message: `This is a ${status} toast`,
    });
  };

  return (
    <View style={styles.section}>
      <EtText variant="heading-base">Toast Statuses</EtText>

      <View style={styles.demoRow}>
        <EtButton onPress={() => showStatusToast('neutral')} variant="info-subtle">
          Neutral
        </EtButton>
        <EtButton onPress={() => showStatusToast('loader')} variant="info-subtle">
          Loader
        </EtButton>
      </View>

      <View style={styles.demoRow}>
        <EtButton onPress={() => showStatusToast('success')} variant="primary-subtle">
          Success
        </EtButton>
        <EtButton onPress={() => showStatusToast('error')} variant="negative-subtle">
          Error
        </EtButton>
      </View>

      <View style={styles.demoRow}>
        <EtButton onPress={() => showStatusToast('disconnect')} variant="negative-subtle">
          Disconnect
        </EtButton>
      </View>
    </View>
  );
}

export const Statuses: Story = {
  render: () => <StatusVariantsDemo />,
};

// ============ Stacking Demo Story ============
function StackingDemo() {
  const { showToast, dismissAll, toastCount } = useToast();

  const showMultipleToasts = () => {
    showToast({
      type: 'asset',
      status: 'success',
      asset: { logoUrl: MOCK_ASSETS.TSLA },
      message: 'First toast - TSLA',
    });

    setTimeout(() => {
      showToast({
        type: 'asset',
        status: 'loader',
        asset: { logoUrl: MOCK_ASSETS.AAPL },
        message: 'Second toast - AAPL',
      });
    }, 500);

    setTimeout(() => {
      showToast({
        type: 'asset',
        status: 'error',
        asset: { logoUrl: MOCK_ASSETS.GOOG },
        message: 'Third toast - GOOG',
      });
    }, 1000);
  };

  return (
    <View style={styles.section}>
      <EtText variant="heading-base">Toast Stacking</EtText>
      <EtText variant="body-secondary-regular" style={styles.hint}>
        Multiple toasts stack visually. Maximum 3 are shown at once.
      </EtText>

      <View style={styles.buttonRow}>
        <EtButton onPress={showMultipleToasts} variant="primary-filled">
          Show 3 Toasts
        </EtButton>
        <EtButton onPress={dismissAll} variant="info-subtle">
          {`Clear (${toastCount})`}
        </EtButton>
      </View>
    </View>
  );
}

export const Stacking: Story = {
  render: () => <StackingDemo />,
};

// ============ Closable (PBD-1105) ============
function ClosableWithActionDemo() {
  const { showToast } = useToast();

  return (
    <View style={styles.section}>
      <EtText variant="heading-base">Closable + body action</EtText>
      <EtText variant="body-secondary-regular" style={styles.hint}>
        X dismisses without firing onPress. Body tap still runs the action then dismisses.
      </EtText>
      <EtButton
        onPress={() =>
          showToast({
            type: 'icon',
            status: 'neutral',
            icon: { name: 'exclamationCircleLine' },
            duration: 6000,
            message: 'Disclaimer copy — tap body for Learn more, or X to dismiss',
            onPress: () => {
              // Storybook demo only — body action
            },
            closable: true,
            testID: 'story-closable-toast',
          })
        }
        variant="primary-filled"
      >
        Show closable toast
      </EtButton>
    </View>
  );
}

export const ClosableWithAction: Story = {
  render: () => <ClosableWithActionDemo />,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
    gap: 16,
  },
  hint: {
    color: '#999',
  },
  optionGroup: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#00C853',
  },
  optionText: {},
  optionTextSelected: {
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
