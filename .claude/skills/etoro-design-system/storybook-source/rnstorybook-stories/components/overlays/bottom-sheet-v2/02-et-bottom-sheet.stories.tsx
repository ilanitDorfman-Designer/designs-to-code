import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtBottomSheetV2 as EtBottomSheet, EtButton, EtIconV2, EtText, EtoroIcon } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ============================================================================
// Meta Configuration
// ============================================================================

const meta = {
  title: 'eToro-UI/Components/Overlays/EtBottomSheet-v2/2. Examples',
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<object>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// CORE PATTERNS - Essential Stories
// ============================================================================

/**
 * Basic sheet with compound Header - The recommended pattern for 80% of use cases.
 * Shows title, subtitle, back button, and close button.
 */
export const BasicSheet: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Basic Sheet
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Header with title, subtitle, back & close
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel="Back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>Account Settings</EtBottomSheet.Header.Title>
                  <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                    Manage your preferences
                  </EtText>
                </View>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                <EtText variant="body-base-regular">
                  This is the recommended pattern for most bottom sheets. It provides a clean, consistent header with minimal code.
                </EtText>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: colors.bgNeutralQuaternary,
                  }}
                >
                  <EtText variant="body-base-semibold">Features:</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginTop: 4 }}>
                    • Auto-sizing to content{'\n'}• Swipe to dismiss{'\n'}• Tap backdrop to close{'\n'}• Keyboard aware
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleClose} style={{ width: '100%' }}>
                Save Changes
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Scrollable content with sticky footer.
 * Header and footer remain fixed while content scrolls.
 */
export const ScrollableContent: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    const items = Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      title: `Option ${i + 1}`,
      description: `Description for option ${i + 1}`,
    }));

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Scrollable Sheet
              </EtButton>
            </View>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Select Option</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              <View style={{ gap: 8 }}>
                {items.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={handleClose}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors.bgNeutralQuaternary,
                    }}
                  >
                    <EtText variant="body-base-semibold">{item.title}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.description}
                    </EtText>
                  </Pressable>
                ))}
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleClose} style={{ width: '100%' }}>
                Confirm Selection
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Confirmation dialog - Prevents accidental dismissal.
 * User must explicitly choose an action.
 */
export const ConfirmationDialog: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="negative-filled" onPress={handleOpen}>
                Delete Account
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Cannot dismiss by backdrop or swipe
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} closeOnBackdrop={false} enablePanDownToClose={false} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Delete Account?</EtBottomSheet.Header.Title>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                <EtText variant="body-base-regular">This action cannot be undone. All your data will be permanently deleted.</EtText>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: colors.bgNegativeSubtle,
                  }}
                >
                  <EtText variant="body-base-semibold" style={{ color: colors.textActionNegative }}>
                    Warning: This includes all your trading history, portfolio data, and account settings.
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="negative-filled" onPress={handleClose} style={{ width: '100%' }}>
                Delete Forever
              </EtButton>
              <EtButton variant="primary-subtle" onPress={handleClose} style={{ width: '100%' }}>
                Cancel
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Horizontal button layout in footer.
 * Buttons are arranged side-by-side for compact actions.
 */
export const HorizontalButtons: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Sheet
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Footer with horizontal button layout
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Save Changes?</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                <EtText variant="body-base-regular">You have unsaved changes. Would you like to save them before leaving?</EtText>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: colors.bgInfoSubtle,
                  }}
                >
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    Horizontal buttons work well for binary choices where both options have equal weight.
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <EtButton variant="negative-subtle" onPress={handleClose} style={{ width: '100%' }}>
                    Discard
                  </EtButton>
                </View>
                <View style={{ flex: 1 }}>
                  <EtButton variant="primary-filled" onPress={handleClose} style={{ width: '100%' }}>
                    Save
                  </EtButton>
                </View>
              </View>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// HEADER PATTERNS - Different header configurations
// ============================================================================

/**
 * Search header with custom middleSlot.
 * Uses fixed snapPoints to prevent resize during filtering.
 */
export const SearchHeader: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [searchText, setSearchText] = useState('');

    const allStocks = [
      {
        id: '1',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        price: '$178.72',
        change: '+2.34%',
      },
      {
        id: '2',
        name: 'Microsoft Corp.',
        ticker: 'MSFT',
        price: '$378.91',
        change: '+1.12%',
      },
      {
        id: '3',
        name: 'Amazon.com Inc.',
        ticker: 'AMZN',
        price: '$178.25',
        change: '-0.45%',
      },
      {
        id: '4',
        name: 'Alphabet Inc.',
        ticker: 'GOOGL',
        price: '$141.80',
        change: '+0.89%',
      },
      {
        id: '5',
        name: 'Tesla Inc.',
        ticker: 'TSLA',
        price: '$248.50',
        change: '+3.21%',
      },
      {
        id: '6',
        name: 'NVIDIA Corp.',
        ticker: 'NVDA',
        price: '$875.28',
        change: '+4.56%',
      },
      {
        id: '7',
        name: 'Meta Platforms',
        ticker: 'META',
        price: '$505.95',
        change: '+1.78%',
      },
      {
        id: '8',
        name: 'Netflix Inc.',
        ticker: 'NFLX',
        price: '$628.34',
        change: '-1.23%',
      },
    ];

    const filteredStocks = allStocks.filter(
      (stock) => stock.name.toLowerCase().includes(searchText.toLowerCase()) || stock.ticker.toLowerCase().includes(searchText.toLowerCase()),
    );

    const handleOpen = () => {
      setSearchText('');
      bottomSheetRef.current?.present();
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Search Stocks
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Fixed height prevents resize during search
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['70%']} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20, color: colors.textSecondaryNeutral }} />
                <BottomSheetTextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search by name or ticker..."
                  placeholderTextColor={colors.textSecondaryNeutral}
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor: colors.bgNeutralQuaternary,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: colors.textPrimaryNeutral,
                  }}
                />
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              <View style={{ gap: 8 }}>
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <Pressable
                      key={stock.id}
                      onPress={handleClose}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgNeutralQuaternary,
                      }}
                    >
                      <View>
                        <EtText variant="body-base-semibold">{stock.name}</EtText>
                        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                          {stock.ticker}
                        </EtText>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <EtText variant="body-base-semibold">{stock.price}</EtText>
                        <EtText
                          variant="body-secondary-regular"
                          style={{
                            color: stock.change.startsWith('+') ? colors.textActionPositive : colors.textActionNegative,
                          }}
                        >
                          {stock.change}
                        </EtText>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <EtoroIcon
                      icon={{ iconName: 'search' }}
                      appearance={{
                        size: 48,
                        color: colors.textSecondaryNeutral,
                      }}
                    />
                    <EtText
                      variant="body-base-semibold"
                      style={{
                        marginTop: 16,
                        color: colors.textSecondaryNeutral,
                      }}
                    >
                      No stocks found
                    </EtText>
                  </View>
                )}
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Multi-step wizard with progress indicator.
 * Shows dynamic header content based on current step.
 */
export const MultiStepWizard: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const steps = [
      {
        title: 'Select Amount',
        description: 'Choose how much to transfer',
        icon: 'wallet',
      },
      {
        title: 'Choose Recipient',
        description: 'Select destination account',
        icon: 'user',
      },
      {
        title: 'Confirm Transfer',
        description: 'Review and confirm details',
        icon: 'checkLine',
      },
    ];

    const handleOpen = () => {
      setStep(1);
      bottomSheetRef.current?.present();
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();
    const handleNext = () => (step < totalSteps ? setStep(step + 1) : handleClose());
    const handleBack = () => (step > 1 ? setStep(step - 1) : handleClose());

    const isLastStep = step === totalSteps;

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Start Transfer
              </EtButton>
            </View>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleBack} accessibilityRole="button" accessibilityLabel="Back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>{steps[step - 1].title}</EtBottomSheet.Header.Title>
                  <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                    {`Step ${step} of ${totalSteps}`}
                  </EtText>
                </View>
              </View>
              {isLastStep ? (
                <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Complete">
                  <EtoroIcon
                    icon={{ iconName: 'checkLine' }}
                    appearance={{
                      size: 24,
                      color: colors.textActionPositive,
                    }}
                  />
                </EtBottomSheet.Header.Action>
              ) : (
                <EtBottomSheet.Header.Action onPress={handleNext} accessibilityLabel="Next">
                  <EtText variant="body-base-semibold" style={{ color: colors.textActionBrand }}>
                    Next
                  </EtText>
                </EtBottomSheet.Header.Action>
              )}
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 20 }}>
                {/* Step Content */}
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: colors.bgActionBrand,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <EtoroIcon
                      icon={{ iconName: steps[step - 1].icon as any }}
                      appearance={{
                        size: 32,
                        color: colors.textInvertedPrimaryNeutral,
                      }}
                    />
                  </View>
                  <EtText variant="body-base-regular" style={{ textAlign: 'center' }}>
                    {steps[step - 1].description}
                  </EtText>
                </View>

                {/* Progress Dots */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {[1, 2, 3].map((s) => (
                    <View
                      key={s}
                      style={{
                        width: s === step ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: s <= step ? colors.bgActionBrand : colors.bgNeutralQuaternary,
                      }}
                    />
                  ))}
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleNext} style={{ width: '100%' }}>
                {isLastStep ? 'Complete Transfer' : 'Continue'}
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Compound Header - For complex headers with multiple actions.
 */
export const AdvancedHeader: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Advanced Header
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Multiple actions using compound Header
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleClose} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>Edit Profile</EtBottomSheet.Header.Title>
                </View>
              </View>
              <EtBottomSheet.Header.Action
                onPress={() => setIsFavorite(!isFavorite)}
                accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <EtIconV2 name="star" size={20} color={isFavorite ? colors.textWarning : colors.textSecondaryNeutral} />
              </EtBottomSheet.Header.Action>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Save">
                <EtText variant="body-base-semibold" style={{ color: colors.textActionBrand }}>
                  Save
                </EtText>
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <EtText variant="body-base-regular">
                  This example shows how to use the compound Header API for complete control over the header layout.
                </EtText>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: colors.bgInfoSubtle,
                  }}
                >
                  <EtText variant="body-base-semibold">When to use this pattern:</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    • Multiple actions in one slot{'\n'}• Toggle buttons (like favorite){'\n'}• Custom action components
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// DYNAMIC CONTENT DEMOS
// ============================================================================

/**
 * Dynamic Content - Sheet auto-resizes when content changes.
 * Add or remove stocks to see the sheet grow and shrink.
 */
export const DynamicContent: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [items, setItems] = useState(['Apple', 'Microsoft']);

    const handleOpen = () => {
      setItems(['Apple', 'Microsoft']);
      bottomSheetRef.current?.present();
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();

    const addItem = () => {
      const allStocks = ['Apple', 'Microsoft', 'Google', 'Amazon', 'Tesla'];
      if (items.length < 5) {
        const next = allStocks.find((s) => !items.includes(s));
        if (next) setItems([...items, next]);
      }
    };

    const removeItem = () => {
      if (items.length > 0) {
        setItems(items.slice(0, -1));
      }
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Dynamic Sheet
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Watch the sheet resize automatically
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Watchlist</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    justifyContent: 'center',
                  }}
                >
                  <EtButton variant="primary-filled" onPress={addItem} disabled={items.length >= 5}>
                    Add Stock
                  </EtButton>
                  <EtButton variant="primary-subtle" onPress={removeItem} disabled={items.length === 0}>
                    Remove
                  </EtButton>
                </View>
                <View style={{ gap: 8 }}>
                  {items.map((item) => (
                    <View
                      key={item}
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgNeutralQuaternary,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: colors.bgActionBrand,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <EtText variant="body-base-semibold" style={{ color: colors.textInvertedPrimaryNeutral }}>
                          {item[0]}
                        </EtText>
                      </View>
                      <View style={{ flex: 1 }}>
                        <EtText variant="body-base-semibold">{item}</EtText>
                        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                          Added to watchlist
                        </EtText>
                      </View>
                      <EtoroIcon
                        icon={{ iconName: 'checkLine' }}
                        appearance={{
                          size: 20,
                          color: colors.textActionPositive,
                        }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleClose} style={{ width: '100%' }}>
                Done
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Async Loading - Shows loading state with custom placeholder.
 */
export const AsyncLoading: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dots, setDots] = useState('');

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }, []);

    const handleOpen = () => {
      setIsLoading(true);
      setDots('');
      bottomSheetRef.current?.present();
      loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 2500);
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();

    // Animate dots
    React.useEffect(() => {
      if (!isLoading) return;
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 400);
      return () => clearInterval(interval);
    }, [isLoading]);

    const LoadingPlaceholder = () => {
      const { colors: themeColors } = useEtoroTheme();
      return (
        <View style={{ alignItems: 'center', paddingVertical: 32, gap: 16 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: themeColors.bgActionBrand,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <EtoroIcon
              icon={{ iconName: 'loader' }}
              appearance={{
                size: 32,
                color: themeColors.textInvertedPrimaryNeutral,
              }}
            />
          </View>
          <EtText variant="body-base-semibold">Loading your data{dots}</EtText>
          <EtText
            variant="body-secondary-regular"
            style={{
              color: themeColors.textSecondaryNeutral,
              textAlign: 'center',
            }}
          >
            Please wait while we fetch your information
          </EtText>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: themeColors.bgActionBrand,
                  opacity: dots.length > i ? 1 : 0.3,
                }}
              />
            ))}
          </View>
        </View>
      );
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Load Data
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Content loads after 2.5 seconds
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} loading={isLoading} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Account Summary</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content loadingPlaceholder={<LoadingPlaceholder />}>
              <View style={{ gap: 16 }}>
                <View
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    backgroundColor: colors.bgPositiveSubtle,
                    alignItems: 'center',
                  }}
                >
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    Total Balance
                  </EtText>
                  <EtText variant="display-main" style={{ color: colors.textActionPositive }}>
                    $24,567.89
                  </EtText>
                  <EtText variant="body-base-semibold" style={{ color: colors.textActionPositive }}>
                    +$1,234.56 (+5.29%)
                  </EtText>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors.bgNeutralQuaternary,
                      alignItems: 'center',
                    }}
                  >
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Available
                    </EtText>
                    <EtText variant="heading-compact">$5,432.10</EtText>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors.bgNeutralQuaternary,
                      alignItems: 'center',
                    }}
                  >
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Invested
                    </EtText>
                    <EtText variant="heading-compact">$19,135.79</EtText>
                  </View>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleClose} style={{ width: '100%' }}>
                View Details
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Snap Points - Expandable sheet with three heights (compact, expanded, full).
 */
export const ExpandableSheet: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpen = () => {
      setCurrentIndex(0);
      bottomSheetRef.current?.present();
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();

    const snapLabels = ['Compact', 'Expanded', 'Full Screen'];
    const isCompact = currentIndex === 0;
    const isExpanded = currentIndex === 1;
    const isFull = currentIndex === 2;

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Expandable Sheet
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Three snap points: 30%, 60%, 100%
            </EtText>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            snapPoints={['30%', '60%', '100%']}
            onChange={(index) => index >= 0 && setCurrentIndex(index)}
            onClose={handleClose}
          >
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>{snapLabels[currentIndex]}</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  {`Snap point ${currentIndex + 1} of 3`}
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              <View style={{ gap: 16 }}>
                {/* Snap Point Indicator */}
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    justifyContent: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Pressable
                      key={i}
                      onPress={() => bottomSheetRef.current?.snapToIndex(i)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 8,
                        backgroundColor: currentIndex === i ? colors.bgActionBrand : colors.bgNeutralQuaternary,
                        alignItems: 'center',
                      }}
                    >
                      <EtText
                        variant="body-secondary-semibold"
                        style={{
                          color: currentIndex === i ? colors.textInvertedPrimaryNeutral : colors.textSecondaryNeutral,
                        }}
                      >
                        {i === 0 ? '30%' : i === 1 ? '60%' : '100%'}
                      </EtText>
                    </Pressable>
                  ))}
                </View>

                {/* Always visible - Compact content */}
                <View
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: colors.bgNeutralQuaternary,
                  }}
                >
                  <EtText variant="body-base-semibold">Portfolio Summary</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    Quick overview of your investments
                  </EtText>
                </View>

                {/* Expanded content (60%+) */}
                {(isExpanded || isFull) && (
                  <>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgPositiveSubtle,
                      }}
                    >
                      <EtText variant="body-base-semibold">Top Performers</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Your best performing assets this month
                      </EtText>
                    </View>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgInfoSubtle,
                      }}
                    >
                      <EtText variant="body-base-semibold">Market News</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Latest updates affecting your portfolio
                      </EtText>
                    </View>
                  </>
                )}

                {/* Full screen content (100% only) */}
                {isFull && (
                  <>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgWarningSubtle,
                      }}
                    >
                      <EtText variant="body-base-semibold">Recommendations</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Personalized investment suggestions
                      </EtText>
                    </View>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgNegativeSubtle,
                      }}
                    >
                      <EtText variant="body-base-semibold">Risk Analysis</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Detailed risk assessment of your portfolio
                      </EtText>
                    </View>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgNeutralQuaternary,
                      }}
                    >
                      <EtText variant="body-base-semibold">Historical Performance</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Track your portfolio over time
                      </EtText>
                    </View>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: colors.bgInfoSubtle,
                      }}
                    >
                      <EtText variant="body-base-semibold">Dividend Calendar</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Upcoming dividend payments
                      </EtText>
                    </View>
                  </>
                )}
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// GLASS VARIANT
// ============================================================================

/**
 * Glass variant - Frosted glass effect with BlurView background.
 * Displayed over a full-bleed image so the blur is clearly visible.
 */
export const GlassVariant: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80' }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />

            <View style={[styles.content, { backgroundColor: 'transparent' }]}>
              <View style={{ alignSelf: 'center' }}>
                <EtButton variant="primary-filled" onPress={handleOpen}>
                  Open Glass Sheet
                </EtButton>
              </View>
              <EtText
                variant="body-secondary-regular"
                style={{
                  marginTop: 8,
                  color: '#fff',
                  textAlign: 'center',
                  textShadowColor: 'rgba(0,0,0,0.6)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                Frosted glass blur over a background image
              </EtText>
            </View>

            <EtBottomSheet bottomSheetRef={bottomSheetRef} variant="glass" snapPoints={['55%']} backdrop={{ enabled: false }} onClose={handleClose}>
              <EtBottomSheet.SimpleHeader
                title="Portfolio"
                subtitle="Today's performance"
                showCloseButton
                style={{ backgroundColor: 'transparent' }}
              />
              <EtBottomSheet.Content scrollable>
                <View style={{ gap: 12 }}>
                  <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                    <EtText variant="display-main">$24,567.89</EtText>
                    <EtText variant="body-base-semibold" style={{ color: colors.textActionPositive }}>
                      +$1,234.56 (+5.29%)
                    </EtText>
                  </View>
                  {[
                    { name: 'Apple Inc.', ticker: 'AAPL', change: '+2.34%', positive: true },
                    { name: 'Tesla Inc.', ticker: 'TSLA', change: '-1.12%', positive: false },
                    { name: 'NVIDIA Corp.', ticker: 'NVDA', change: '+4.56%', positive: true },
                    { name: 'Microsoft Corp.', ticker: 'MSFT', change: '+0.89%', positive: true },
                  ].map((stock) => (
                    <Pressable
                      key={stock.ticker}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 14,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <View>
                        <EtText variant="body-base-semibold">{stock.name}</EtText>
                        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                          {stock.ticker}
                        </EtText>
                      </View>
                      <EtText variant="body-base-semibold" style={{ color: stock.positive ? colors.textActionPositive : colors.textActionNegative }}>
                        {stock.change}
                      </EtText>
                    </Pressable>
                  ))}
                </View>
              </EtBottomSheet.Content>
            </EtBottomSheet>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// ADVANCED FEATURES - New props demonstrations
// ============================================================================

// NOTE: List stories (FlatList, SectionList, FlashList, ListWithSelection, ListWithLoading)
// have been moved to a dedicated file: et-bottom-sheet-list.stories.tsx
// See: eToro-UI/Components/Overlays/EtBottomSheet-v2/Lists

/**
 * Detached Mode - Floating modal not attached to bottom.
 */
export const DetachedMode: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Detached Sheet
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Floating modal with margin from edges
            </EtText>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            onClose={handleClose}
            detached
            bottomInset={46}
            style={{
              marginHorizontal: 16,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Detached Sheet</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                <EtText variant="body-base-regular">This sheet is detached from the bottom of the screen, creating a floating modal effect.</EtText>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: colors.bgInfoSubtle,
                  }}
                >
                  <EtText variant="body-base-semibold">Use cases:</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    • Centered dialogs{'\n'}• Floating action menus{'\n'}• Tooltip-style overlays
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleClose} style={{ width: '100%' }}>
                Close
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Animation Presets - Demonstrates open/close spring animation styles.
 * Distinct from over-drag: these control the present/dismiss animation.
 */
export const AnimationPresets: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bouncySheetRef = useRef<BottomSheetModal>(null);
    const smoothSheetRef = useRef<BottomSheetModal>(null);
    const fastSheetRef = useRef<BottomSheetModal>(null);

    const handleOpenBouncy = () => bouncySheetRef.current?.present();
    const handleOpenSmooth = () => smoothSheetRef.current?.present();
    const handleOpenFast = () => fastSheetRef.current?.present();
    const handleCloseBouncy = () => bouncySheetRef.current?.dismiss();
    const handleCloseSmooth = () => smoothSheetRef.current?.dismiss();
    const handleCloseFast = () => fastSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ gap: 12, alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpenBouncy}>
                Open Bouncy (default)
              </EtButton>
              <EtButton variant="secondary-outlined" onPress={handleOpenSmooth}>
                Open Smooth
              </EtButton>
              <EtButton variant="secondary-outlined" onPress={handleOpenFast}>
                Open Fast
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 24,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Compare how each sheet settles when opening
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bouncySheetRef} onClose={handleCloseBouncy} animationPreset="bouncy">
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Bouncy</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleCloseBouncy} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <EtText variant="body-base-regular">Default preset — slight overshoot when the sheet reaches its resting position.</EtText>
            </EtBottomSheet.Content>
          </EtBottomSheet>

          <EtBottomSheet bottomSheetRef={smoothSheetRef} onClose={handleCloseSmooth} animationPreset="smooth">
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Smooth</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleCloseSmooth} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <EtText variant="body-base-regular">Subtle spring with minimal bounce on settle.</EtText>
            </EtBottomSheet.Content>
          </EtBottomSheet>

          <EtBottomSheet bottomSheetRef={fastSheetRef} onClose={handleCloseFast} animationPreset="fast">
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Fast</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleCloseFast} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <EtText variant="body-base-regular">Snappy, overdamped transition with no overshoot.</EtText>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Over Drag Behavior - Demonstrates elastic over-drag effect.
 * Opens two different sheets to compare the behavior.
 */
export const OverDragBehavior: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const enabledSheetRef = useRef<BottomSheetModal>(null);
    const disabledSheetRef = useRef<BottomSheetModal>(null);

    const handleOpenEnabled = () => enabledSheetRef.current?.present();
    const handleOpenDisabled = () => disabledSheetRef.current?.present();
    const handleCloseEnabled = () => enabledSheetRef.current?.dismiss();
    const handleCloseDisabled = () => disabledSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ gap: 12, alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpenEnabled}>
                With Over-Drag (Elastic)
              </EtButton>
              <EtButton variant="primary-subtle" onPress={handleOpenDisabled}>
                Without Over-Drag (Hard Stop)
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 12,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Try dragging past the top of each sheet
            </EtText>
          </View>

          {/* Sheet with over-drag enabled */}
          <EtBottomSheet bottomSheetRef={enabledSheetRef} onClose={handleCloseEnabled} enableOverDrag={true} overDragResistanceFactor={2.5}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Over-Drag Enabled</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleCloseEnabled} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: colors.bgPositiveSubtle,
                  }}
                >
                  <EtText variant="body-base-semibold" style={{ color: colors.textActionPositive }}>
                    Elastic Feel
                  </EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    Drag up past the top - the sheet stretches and bounces back smoothly
                  </EtText>
                </View>

                <EtText variant="body-base-regular">
                  Over-drag creates a natural, elastic feel when users drag past the sheet boundaries. This is the default behavior and provides
                  better UX for most cases.
                </EtText>

                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgNeutralQuaternary,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    Props: enableOverDrag=true, overDragResistanceFactor=2.5
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>

          {/* Sheet with over-drag disabled */}
          <EtBottomSheet bottomSheetRef={disabledSheetRef} onClose={handleCloseDisabled} enableOverDrag={false}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Over-Drag Disabled</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleCloseDisabled} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <View
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: colors.bgWarningSubtle,
                  }}
                >
                  <EtText variant="body-base-semibold" style={{ color: colors.textWarning }}>
                    Hard Stop
                  </EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    Drag up past the top - the sheet stops immediately at the boundary
                  </EtText>
                </View>

                <EtText variant="body-base-regular">
                  Disabling over-drag creates a hard stop at sheet boundaries. Use this when you want strict control over sheet position.
                </EtText>

                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgNeutralQuaternary,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    Props: enableOverDrag=false
                  </EtText>
                </View>
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
