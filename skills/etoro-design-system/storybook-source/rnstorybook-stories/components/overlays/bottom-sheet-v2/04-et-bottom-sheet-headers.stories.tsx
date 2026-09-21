import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtBottomSheetV2 as EtBottomSheet, EtButton, EtIconV2, EtText, EtoroIcon } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ============================================================================
// Meta Configuration
// ============================================================================

const meta = {
  title: 'eToro-UI/Components/Overlays/EtBottomSheet-v2/4. Header Patterns',
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
// SECTION INTRO
// ============================================================================

/**
 * Header Patterns Introduction
 *
 * This section demonstrates all the ways to configure headers in EtBottomSheet.
 */
export const Introduction: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <EtText variant="heading-compact" style={{ marginBottom: 8 }}>
          Header Patterns
        </EtText>
        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 24 }}>
          Choose the right header pattern based on your use case complexity.
        </EtText>

        {/* Decision Guide */}
        <View
          style={{
            padding: 16,
            backgroundColor: colors.bgNeutralQuaternary,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <EtText variant="body-base-semibold" style={{ marginBottom: 12 }}>
            Which pattern should I use?
          </EtText>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.bgPositiveSubtle,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <EtText variant="body-secondary-semibold" style={{ color: colors.textActionPositive }}>
                  1
                </EtText>
              </View>
              <View style={{ flex: 1 }}>
                <EtText variant="body-base-semibold">Header (80%)</EtText>
                <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  Title, subtitle, back button, close button
                </EtText>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.bgInfoSubtle,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <EtText variant="body-secondary-semibold" style={{ color: colors.textActionBrand }}>
                  2
                </EtText>
              </View>
              <View style={{ flex: 1 }}>
                <EtText variant="body-base-semibold">Header + Slots (15%)</EtText>
                <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  Search inputs, custom actions, icons
                </EtText>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.bgNeutralTertiary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <EtText variant="body-secondary-semibold" style={{ color: colors.textSecondaryNeutral }}>
                  3
                </EtText>
              </View>
              <View style={{ flex: 1 }}>
                <EtText variant="body-base-semibold">Compound Header — custom layout (5%)</EtText>
                <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  Multiple actions, complex layouts
                </EtText>
              </View>
            </View>
          </View>
        </View>

        {/* Stories in this section */}
        <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textSecondaryNeutral }}>
          STORIES IN THIS SECTION
        </EtText>
        <View style={{ gap: 8 }}>
          {[
            {
              name: 'Header Playground',
              desc: 'Interactive configuration tool',
            },
            { name: 'Title Only', desc: 'Minimal header' },
            { name: 'Title with Subtitle', desc: 'Additional context' },
            { name: 'Navigation Header', desc: 'Multi-step flows' },
            { name: 'Search Header', desc: 'Custom middle slot' },
            { name: 'Link Button Header', desc: 'Text action button' },
            { name: 'Link + Close Button', desc: 'Combined actions' },
            { name: 'Action Header', desc: 'Custom right slot' },
            { name: 'Compound Header (full)', desc: 'Complete control' },
          ].map((item) => (
            <View
              key={item.name}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.dividerPrimary,
              }}
            >
              <EtText variant="body-base-regular">{item.name}</EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                {item.desc}
              </EtText>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  },
};

// ============================================================================
// HEADER PLAYGROUND - Interactive header configuration
// ============================================================================

/**
 * Interactive Header Playground
 *
 * Experiment with different header configurations in real-time.
 * Toggle options to see how the compound Header adapts to different use cases.
 */
export const HeaderPlayground: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // Playground state
    const [showTitle, setShowTitle] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(true);
    const [useCustomLeftSlot, setUseCustomLeftSlot] = useState(false);
    const [useCustomMiddleSlot, setUseCustomMiddleSlot] = useState(false);
    const [useCustomRightSlot, setUseCustomRightSlot] = useState(false);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    // Helper function to render toggle - not a component to avoid recreation
    const renderToggle = (label: string, value: boolean, onToggle: () => void, disabled = false) => (
      <Pressable
        key={label}
        onPress={onToggle}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: disabled ? colors.bgNeutralTertiary : colors.bgNeutralQuaternary,
          borderRadius: 8,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <EtText variant="body-base-regular" style={{ color: disabled ? colors.textSecondaryNeutral : undefined }}>
          {label}
        </EtText>
        <View
          style={{
            width: 48,
            height: 28,
            borderRadius: 14,
            backgroundColor: value ? colors.bgActionBrand : colors.dividerPrimary,
            justifyContent: 'center',
            paddingHorizontal: 2,
            borderWidth: value ? 0 : 1,
            borderColor: colors.dividerSecondary,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: value ? colors.bgNeutralPrimary : colors.bgNeutralSecondary,
              alignSelf: value ? 'flex-end' : 'flex-start',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        </View>
      </Pressable>
    );

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ScrollView style={styles.playgroundContainer} contentContainerStyle={{ paddingBottom: 40 }}>
            <EtText variant="heading-compact" style={{ marginBottom: 16 }}>
              Header Playground
            </EtText>
            <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 24 }}>
              Configure header options and see the result in real-time
            </EtText>

            {/* Basic Options */}
            <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textSecondaryNeutral }}>
              BASIC OPTIONS
            </EtText>
            <View style={{ gap: 8, marginBottom: 24 }}>
              {renderToggle('Show Title', showTitle, () => setShowTitle(!showTitle), useCustomMiddleSlot)}
              {renderToggle('Show Subtitle', showSubtitle, () => setShowSubtitle(!showSubtitle), useCustomMiddleSlot)}
              {renderToggle('Show Back Button', showBackButton, () => setShowBackButton(!showBackButton), useCustomLeftSlot)}
              {renderToggle('Show Close Button', showCloseButton, () => setShowCloseButton(!showCloseButton), useCustomRightSlot)}
            </View>

            {/* Slot Overrides */}
            <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textSecondaryNeutral }}>
              SLOT OVERRIDES
            </EtText>
            <View style={{ gap: 8, marginBottom: 24 }}>
              {renderToggle('Custom Left Slot', useCustomLeftSlot, () => setUseCustomLeftSlot(!useCustomLeftSlot))}
              {renderToggle('Custom Middle Slot', useCustomMiddleSlot, () => setUseCustomMiddleSlot(!useCustomMiddleSlot))}
              {renderToggle('Custom Right Slot', useCustomRightSlot, () => setUseCustomRightSlot(!useCustomRightSlot))}
            </View>

            {/* Preview Button */}
            <EtButton variant="primary-filled" onPress={handleOpen}>
              Preview Header
            </EtButton>

            {/* Info Box */}
            <View
              style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: colors.bgInfoSubtle,
                borderRadius: 12,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8 }}>
                Current Configuration
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                {useCustomLeftSlot ? '• leftSlot: Custom icon\n' : showBackButton ? '• onBack: Enabled\n' : '• Left: Empty\n'}
                {useCustomMiddleSlot
                  ? '• middleSlot: Custom content\n'
                  : `• title: ${showTitle ? '"Sheet Title"' : 'None'}\n• subtitle: ${showSubtitle ? '"Optional subtitle"' : 'None'}\n`}
                {useCustomRightSlot ? '• Custom right: Done action' : `• Close button: ${showCloseButton}`}
              </EtText>
            </View>
          </ScrollView>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {useCustomLeftSlot ? (
                  <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20, color: colors.textSecondaryNeutral }} />
                ) : showBackButton ? (
                  <Pressable onPress={handleClose} accessibilityLabel="Back">
                    <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                  </Pressable>
                ) : null}
                {useCustomMiddleSlot ? (
                  <View
                    style={{
                      flex: 1,
                      height: 36,
                      backgroundColor: colors.bgNeutralQuaternary,
                      borderRadius: 8,
                      justifyContent: 'center',
                      paddingHorizontal: 12,
                    }}
                  >
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Custom middle slot...
                    </EtText>
                  </View>
                ) : (
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    {showTitle && <EtBottomSheet.Header.Title>Sheet Title</EtBottomSheet.Header.Title>}
                    {showSubtitle && (
                      <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                        Optional subtitle
                      </EtText>
                    )}
                  </View>
                )}
              </View>
              {useCustomRightSlot ? (
                <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Done">
                  <EtText variant="body-base-semibold" style={{ color: colors.textActionBrand }}>
                    Done
                  </EtText>
                </EtBottomSheet.Header.Action>
              ) : showCloseButton ? (
                <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                  <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
                </EtBottomSheet.Header.Action>
              ) : null}
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                <EtText variant="body-base-regular">
                  This is a preview of your header configuration. The header above reflects the options you selected in the playground.
                </EtText>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgNeutralQuaternary,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-base-semibold">Try it out!</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
                    Tap the back button, close button, or any custom actions to see them work.
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
// SIMPLE HEADER PATTERNS
// ============================================================================

/**
 * Title Only - The simplest header configuration
 */
export const TitleOnly: Story = {
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
                Title Only
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
              Minimal header with just a title
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Simple Title</EtBottomSheet.Header.Title>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <EtText variant="body-base-regular">
                The simplest header pattern. Use when the sheet content is self-explanatory and doesn't need navigation controls.
              </EtText>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Title with Subtitle - For additional context
 */
export const TitleWithSubtitle: Story = {
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
                Title + Subtitle
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
              Header with additional context
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Account Settings</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Manage your preferences
                </EtText>
              </View>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <EtText variant="body-base-regular">Use subtitle for additional context like step indicators, counts, or brief descriptions.</EtText>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Navigation Header - Back button for multi-step flows
 */
export const NavigationHeader: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [step, setStep] = useState(1);

    const handleOpen = () => {
      setStep(1);
      bottomSheetRef.current?.present();
    };
    const handleClose = () => bottomSheetRef.current?.dismiss();
    const handleBack = () => (step > 1 ? setStep(step - 1) : handleClose());
    const handleNext = () => (step < 3 ? setStep(step + 1) : handleClose());

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Navigation Header
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
              Multi-step flow with back navigation
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleBack} accessibilityLabel="Back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>{`Step ${step}`}</EtBottomSheet.Header.Title>
                  <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                    {`${step} of 3`}
                  </EtText>
                </View>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
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
                <EtText variant="body-base-regular" style={{ textAlign: 'center' }}>
                  {step === 1 && 'Enter your details'}
                  {step === 2 && 'Review your information'}
                  {step === 3 && 'Confirm and submit'}
                </EtText>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleNext} style={{ width: '100%' }}>
                {step === 3 ? 'Complete' : 'Continue'}
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Search Header - Custom middle slot with search input
 */
export const SearchHeader: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [searchText, setSearchText] = useState('');

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
                Search Header
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
              Custom middle slot with search input
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['60%']} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20, color: colors.textSecondaryNeutral }} />
                <BottomSheetTextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search..."
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
            <EtBottomSheet.Content>
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 48, color: colors.textSecondaryNeutral }} />
                <EtText variant="body-base-semibold" style={{ marginTop: 16, color: colors.textSecondaryNeutral }}>
                  {searchText ? `Searching for "${searchText}"` : 'Start typing to search'}
                </EtText>
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * Link-style header - Text action using Header.Action
 *
 * Use this pattern when you need a simple text action button (like Save, Done, Reset)
 * as a trailing EtBottomSheet.Header.Action, alongside a leading back control.
 */
export const LinkButtonHeader: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();
    const handleSave = () => {
      // Save logic here
      handleClose();
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Link Button Header
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
              Text action button using Header.Action
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleClose} accessibilityLabel="Back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>Edit Profile</EtBottomSheet.Header.Title>
                </View>
              </View>
              <EtBottomSheet.Header.Action onPress={handleSave} accessibilityLabel="Save">
                <EtText variant="body-base-semibold" style={{ color: colors.textActionBrand }}>
                  Save
                </EtText>
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <EtText variant="body-base-regular">
                  Use EtBottomSheet.Header.Action with text children for a compact text action (e.g. Save) on the trailing edge.
                </EtText>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgInfoSubtle,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-base-semibold">Usage:</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    {'<EtBottomSheet.Header.Action onPress={handleSave} accessibilityLabel="Save">…</EtBottomSheet.Header.Action>'}
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

/**
 * Text action + Close — Two trailing Header.Action children
 *
 * Multiple EtBottomSheet.Header.Action components render in order on the trailing edge:
 * [Reset] [Close]
 */
export const LinkButtonWithClose: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();
    const handleReset = () => {
      // Reset logic here
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Link + Close Button
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
              Both link button and close button
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleReset} accessibilityLabel="Reset">
                <EtText variant="body-base-semibold" style={{ color: colors.textActionBrand }}>
                  Reset
                </EtText>
              </EtBottomSheet.Header.Action>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <EtText variant="body-base-regular">
                  Stack two EtBottomSheet.Header.Action components for a text action and a close icon: [Reset] [X]
                </EtText>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgInfoSubtle,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-base-semibold">Note:</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    Actions are always rendered on the trailing edge, in child order.
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

/**
 * Action Header - Trailing text action with Header.Action
 *
 * Use EtBottomSheet.Header.Action when you need:
 * - A text action on the trailing edge next to the title row
 * - Full control over press handling and accessibility
 *
 * For multiple trailing actions, add several Header.Action siblings — see LinkButtonWithClose.
 */
export const ActionHeader: Story = {
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
                Action Header (trailing action)
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
              Custom right slot with Save action
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleClose} accessibilityLabel="Back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>Edit Profile</EtBottomSheet.Header.Title>
                </View>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Save">
                <EtText variant="body-base-semibold" style={{ color: colors.textActionBrand }}>
                  Save
                </EtText>
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <EtText variant="body-base-regular">
                  Use EtBottomSheet.Header.Action for the trailing Save control while placing the back chevron in the header content area with a
                  Pressable.
                </EtText>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgInfoSubtle,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-base-semibold">When to use:</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    • Trailing text or icon actions{'\n'}• Pair with custom rows in the header content area{'\n\n'}
                    For two trailing actions, add two Header.Action components.
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
// FULL ETHEADER PATTERNS
// ============================================================================

/**
 * Compound Header (full layout) — Complete control with multiple actions
 */
export const FullEtTopbar: Story = {
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
            <View style={{ alignItems: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Compound Header (full)
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
              Multiple actions using the compound Header API
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={handleClose} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>Asset Details</EtBottomSheet.Header.Title>
                </View>
              </View>
              <EtBottomSheet.Header.Action
                onPress={() => setIsFavorite(!isFavorite)}
                accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <EtIconV2 name="star" size={20} color={isFavorite ? colors.textWarning : colors.textSecondaryNeutral} />
              </EtBottomSheet.Header.Action>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Share">
                <EtoroIcon icon={{ iconName: 'share' }} appearance={{ size: 20 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 16 }}>
                <EtText variant="body-base-regular">
                  Use the compound Header API when you need complete control over the header layout, such as multiple trailing actions.
                </EtText>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.bgInfoSubtle,
                    borderRadius: 8,
                  }}
                >
                  <EtText variant="body-base-semibold">When to use:</EtText>
                  <EtText variant="body-secondary-regular" style={{ marginTop: 4 }}>
                    • Multiple actions in one slot{'\n'}• Toggle buttons (like favorite){'\n'}• Complex custom layouts
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
  playgroundContainer: {
    flex: 1,
    padding: 20,
  },
});
