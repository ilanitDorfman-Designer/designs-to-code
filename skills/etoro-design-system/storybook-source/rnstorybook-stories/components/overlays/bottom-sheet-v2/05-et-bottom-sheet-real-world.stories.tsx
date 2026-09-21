import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtBottomSheetV2 as EtBottomSheet, EtButton, EtText, EtoroIcon } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Animated as RNAnimated, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ============================================================================
// Meta Configuration
// ============================================================================

const meta = {
  title: 'eToro-UI/Components/Overlays/EtBottomSheet-v2/5. Real-World Examples',
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
// TRADING SHEET - Complete trading interface with animations
// ============================================================================

/**
 * Trading Order Sheet
 *
 * A production-ready trading interface demonstrating:
 * - Buy/Sell toggle with smooth color transitions
 * - Amount input with quick selection chips
 * - Order summary with live calculations
 * - Loading state during order submission
 * - Proper accessibility labels and testID
 * - Keyboard dismissal before close
 */
export const TradingSheet: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('1,000');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation for the toggle indicator
    const toggleAnim = useRef(new RNAnimated.Value(0)).current;

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
      };
    }, []);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => {
      Keyboard.dismiss();
      bottomSheetRef.current?.dismiss();
    };

    const handleSubmit = () => {
      Keyboard.dismiss();
      setIsSubmitting(true);
      // Simulate API call
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 1500);
    };

    const handleToggle = (type: 'buy' | 'sell') => {
      setOrderType(type);
      RNAnimated.spring(toggleAnim, {
        toValue: type === 'sell' ? 1 : 0,
        useNativeDriver: false,
        friction: 8,
      }).start();
    };

    const isBuy = orderType === 'buy';

    // Mock data
    const asset = {
      name: 'Apple Inc.',
      ticker: 'AAPL',
      exchange: 'NASDAQ',
      price: 178.72,
      change: 2.34,
      changePercent: 1.33,
      marketCap: '2.8T',
      volume: '52.3M',
    };

    const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
    const estimatedShares = (numericAmount / asset.price).toFixed(4);
    const isPositiveChange = asset.change >= 0;

    // Animated toggle background position
    const toggleBgLeft = toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['2%', '50%'],
    });

    const toggleBgColor = toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.bgPositiveSubtle, colors.bgNegativeSubtle],
    });

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            {/* Preview Card */}
            <View style={[styles.previewCard, { backgroundColor: colors.bgNeutralSecondary }]}>
              <View style={styles.previewHeader}>
                <View style={[styles.assetLogo, { backgroundColor: colors.bgNeutralQuaternary }]}>
                  <EtText variant="heading-compact">🍎</EtText>
                </View>
                <View style={{ flex: 1 }}>
                  <EtText variant="body-base-semibold">{asset.ticker}</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    {asset.name}
                  </EtText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <EtText variant="heading-compact">${asset.price.toFixed(2)}</EtText>
                  <EtText
                    variant="body-secondary-semibold"
                    style={{
                      color: isPositiveChange ? colors.textActionPositive : colors.textActionNegative,
                    }}
                  >
                    {isPositiveChange ? '↑' : '↓'} {Math.abs(asset.change)}%
                  </EtText>
                </View>
              </View>
              <EtButton variant="primary-filled" onPress={handleOpen} stretch>
                {`Trade ${asset.ticker}`}
              </EtButton>
            </View>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            onClose={handleClose}
            accessibilityLabel={`Trade ${asset.name}`}
            testID="trading-sheet"
            loading={isSubmitting}
          >
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>{asset.name}</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  {`${asset.ticker} • ${asset.exchange}`}
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ gap: 12 }}>
                {/* Price + Stats Row */}
                <View style={styles.priceStatsRow}>
                  <View>
                    <EtText variant="heading-large">${asset.price.toFixed(2)}</EtText>
                    <View
                      style={[
                        styles.changeBadge,
                        {
                          backgroundColor: isPositiveChange ? colors.bgPositiveSubtle : colors.bgNegativeSubtle,
                          marginTop: 2,
                        },
                      ]}
                    >
                      <EtText
                        variant="body-secondary-semibold"
                        style={{
                          color: isPositiveChange ? colors.textActionPositive : colors.textActionNegative,
                        }}
                      >
                        {isPositiveChange ? '+' : ''}
                        {asset.changePercent}%
                      </EtText>
                    </View>
                  </View>
                  <View style={styles.statsCompact}>
                    <View style={styles.statItemCompact}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        MCap
                      </EtText>
                      <EtText variant="body-secondary-semibold">{asset.marketCap}</EtText>
                    </View>
                    <View style={styles.statItemCompact}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Vol
                      </EtText>
                      <EtText variant="body-secondary-semibold">{asset.volume}</EtText>
                    </View>
                  </View>
                </View>

                {/* Animated Buy/Sell Toggle */}
                <View style={[styles.toggleContainer, { backgroundColor: colors.bgNeutralQuaternary }]}>
                  <RNAnimated.View
                    style={[
                      styles.toggleIndicator,
                      {
                        left: toggleBgLeft,
                        backgroundColor: toggleBgColor,
                      },
                    ]}
                  />
                  <Pressable
                    onPress={() => handleToggle('buy')}
                    style={styles.toggleButton}
                    accessibilityRole="button"
                    accessibilityLabel="Buy"
                    accessibilityState={{ selected: isBuy }}
                  >
                    <EtText
                      variant="body-base-semibold"
                      style={{
                        color: isBuy ? colors.textActionPositive : colors.textSecondaryNeutral,
                      }}
                    >
                      Buy
                    </EtText>
                  </Pressable>
                  <Pressable
                    onPress={() => handleToggle('sell')}
                    style={styles.toggleButton}
                    accessibilityRole="button"
                    accessibilityLabel="Sell"
                    accessibilityState={{ selected: !isBuy }}
                  >
                    <EtText
                      variant="body-base-semibold"
                      style={{
                        color: !isBuy ? colors.textActionNegative : colors.textSecondaryNeutral,
                      }}
                    >
                      Sell
                    </EtText>
                  </Pressable>
                </View>

                {/* Amount Input */}
                <View style={[styles.amountInputCompact, { backgroundColor: colors.bgNeutralQuaternary }]}>
                  <EtText variant="body-base-semibold" style={{ color: colors.textSecondaryNeutral }}>
                    $
                  </EtText>
                  <BottomSheetTextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={[styles.amountTextInputCompact, { color: colors.textPrimaryNeutral }]}
                    accessibilityLabel="Enter amount in USD"
                  />
                </View>

                {/* Quick Amount Chips */}
                <View style={styles.chipsContainer}>
                  {['100', '500', '1,000', '5,000'].map((value) => {
                    const isSelected = amount === value;
                    return (
                      <Pressable
                        key={value}
                        onPress={() => setAmount(value)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected ? (isBuy ? colors.bgPositiveSubtle : colors.bgNegativeSubtle) : colors.bgNeutralQuaternary,
                            borderColor: isSelected ? (isBuy ? colors.borderPositive : colors.borderNegative) : 'transparent',
                            borderWidth: isSelected ? 1 : 0,
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${value} dollars`}
                        accessibilityState={{ selected: isSelected }}
                      >
                        <EtText
                          variant="body-secondary-semibold"
                          style={{
                            color: isSelected ? (isBuy ? colors.textActionPositive : colors.textActionNegative) : colors.textSecondaryNeutral,
                          }}
                        >
                          ${value}
                        </EtText>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Order Summary */}
                <View style={[styles.summaryCardCompact, { backgroundColor: colors.bgNeutralQuaternary }]}>
                  <View style={styles.summaryRow}>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Est. shares
                    </EtText>
                    <EtText variant="body-secondary-semibold">{`${estimatedShares} ${asset.ticker}`}</EtText>
                  </View>
                  <View style={styles.summaryRow}>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Commission
                    </EtText>
                    <View style={[styles.freeBadge, { backgroundColor: colors.bgPositiveSubtle }]}>
                      <EtText variant="body-secondary-semibold" style={{ color: colors.textActionPositive }}>
                        FREE
                      </EtText>
                    </View>
                  </View>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton
                variant={isBuy ? 'primary-filled' : 'negative-filled'}
                onPress={handleSubmit}
                disabled={numericAmount <= 0}
                loading={isSubmitting}
                style={{ width: '100%' }}
              >
                {`${isBuy ? 'Buy' : 'Sell'} $${amount}`}
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// MULTI-STEP WIZARD - Onboarding flow
// ============================================================================

/**
 * Multi-Step Wizard
 *
 * A step-by-step onboarding flow demonstrating:
 * - Step navigation with back button
 * - Progress indicator
 * - Step validation
 * - Dynamic trailing Header.Action for next/complete actions
 * - Smooth transitions between steps
 */
export const MultiStepWizard: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [step, setStep] = useState(1);
    const [riskLevel, setRiskLevel] = useState<string | null>(null);
    const [investmentGoal, setInvestmentGoal] = useState<string | null>(null);
    const [experience, setExperience] = useState<string | null>(null);

    const totalSteps = 3;

    const handleOpen = () => {
      setStep(1);
      setRiskLevel(null);
      setInvestmentGoal(null);
      setExperience(null);
      bottomSheetRef.current?.present();
    };

    const handleClose = () => {
      Keyboard.dismiss();
      bottomSheetRef.current?.dismiss();
    };

    const canProceed = () => {
      switch (step) {
        case 1:
          return riskLevel !== null;
        case 2:
          return investmentGoal !== null;
        case 3:
          return experience !== null;
        default:
          return false;
      }
    };

    const handleNext = () => {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleClose();
      }
    };

    const handleBack = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };

    const stepTitles = ['Risk Tolerance', 'Investment Goals', 'Experience'];

    const riskOptions = [
      {
        id: 'conservative',
        title: 'Conservative',
        desc: 'Preserve capital, minimal risk',
        icon: '🛡️',
      },
      {
        id: 'moderate',
        title: 'Moderate',
        desc: 'Balanced growth and safety',
        icon: '⚖️',
      },
      {
        id: 'aggressive',
        title: 'Aggressive',
        desc: 'Maximum growth potential',
        icon: '🚀',
      },
    ];

    const goalOptions = [
      {
        id: 'retirement',
        title: 'Retirement',
        desc: 'Long-term wealth building',
        icon: '🏖️',
      },
      {
        id: 'growth',
        title: 'Wealth Growth',
        desc: 'Grow my investments',
        icon: '📈',
      },
      {
        id: 'income',
        title: 'Passive Income',
        desc: 'Generate regular income',
        icon: '💰',
      },
      {
        id: 'savings',
        title: 'Savings',
        desc: 'Beat inflation',
        icon: '🏦',
      },
    ];

    const experienceOptions = [
      {
        id: 'beginner',
        title: 'Beginner',
        desc: 'New to investing',
        icon: '🌱',
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        desc: '1-3 years experience',
        icon: '📊',
      },
      {
        id: 'advanced',
        title: 'Advanced',
        desc: '3+ years experience',
        icon: '🎯',
      },
    ];

    const OptionCard = ({
      option,
      isSelected,
      onSelect,
    }: {
      option: { id: string; title: string; desc: string; icon: string };
      isSelected: boolean;
      onSelect: () => void;
    }) => (
      <Pressable
        onPress={onSelect}
        style={[
          styles.optionCard,
          {
            backgroundColor: isSelected ? colors.bgBrandSecondary : colors.bgNeutralQuaternary,
            borderColor: isSelected ? colors.borderBrandPrimary : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          },
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${option.title}: ${option.desc}`}
      >
        <EtText variant="heading-compact" style={{ fontSize: 28 }}>
          {option.icon}
        </EtText>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <EtText variant="body-base-semibold">{option.title}</EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
            {option.desc}
          </EtText>
        </View>
        {isSelected && <EtoroIcon icon={{ iconName: 'checkLine' }} appearance={{ size: 24, color: colors.textBrandPrimary }} />}
      </Pressable>
    );

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={[styles.previewCard, { backgroundColor: colors.bgNeutralSecondary }]}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={[styles.wizardIcon, { backgroundColor: colors.bgBrandSecondary }]}>
                  <EtText variant="display-main">🎯</EtText>
                </View>
                <EtText variant="heading-compact" style={{ marginTop: 12, textAlign: 'center' }}>
                  Personalize Your Experience
                </EtText>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  Answer a few questions to get tailored recommendations
                </EtText>
              </View>
              <EtButton variant="primary-filled" onPress={handleOpen} stretch>
                Get Started
              </EtButton>
            </View>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            onClose={handleClose}
            accessibilityLabel={`Investment profile wizard, step ${step} of ${totalSteps}`}
            testID="wizard-sheet"
          >
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {step > 1 ? (
                  <Pressable onPress={handleBack} accessibilityLabel="Back">
                    <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                  </Pressable>
                ) : (
                  <View style={{ width: 24 }} />
                )}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <EtBottomSheet.Header.Title>{stepTitles[step - 1]}</EtBottomSheet.Header.Title>
                  <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                    {`Step ${step} of ${totalSteps}`}
                  </EtText>
                </View>
              </View>
              <EtBottomSheet.Header.Action
                onPress={handleNext}
                accessibilityLabel={step === totalSteps ? 'Complete wizard' : 'Next step'}
                disabled={!canProceed()}
              >
                <EtText
                  variant="body-base-semibold"
                  style={{
                    color: canProceed() ? colors.textActionBrand : colors.textSecondaryNeutral,
                  }}
                >
                  {step === totalSteps ? 'Done' : 'Next'}
                </EtText>
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              {/* Progress Bar */}
              <View style={[styles.progressContainer, { backgroundColor: colors.bgNeutralQuaternary }]}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: colors.bgActionBrand,
                      width: `${(step / totalSteps) * 100}%`,
                    },
                  ]}
                />
              </View>

              {/* Step Content */}
              <View style={{ gap: 12, marginTop: 20 }}>
                {step === 1 &&
                  riskOptions.map((option) => (
                    <OptionCard key={option.id} option={option} isSelected={riskLevel === option.id} onSelect={() => setRiskLevel(option.id)} />
                  ))}

                {step === 2 &&
                  goalOptions.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      isSelected={investmentGoal === option.id}
                      onSelect={() => setInvestmentGoal(option.id)}
                    />
                  ))}

                {step === 3 &&
                  experienceOptions.map((option) => (
                    <OptionCard key={option.id} option={option} isSelected={experience === option.id} onSelect={() => setExperience(option.id)} />
                  ))}
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// PORTFOLIO OVERVIEW - FlashList with large dataset
// ============================================================================

/**
 * Portfolio Overview with FlashList
 *
 * A portfolio view demonstrating:
 * - FlashList for 100+ items with optimal performance
 * - Proper snapPoints for virtualized lists
 * - Portfolio summary header
 * - Color-coded gains/losses
 * - Pull-to-refresh pattern (simulated)
 */
export const PortfolioOverview: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      };
    }, []);

    // Generate 150 portfolio positions
    const positions = Array.from({ length: 150 }, (_, i) => {
      const tickers = [
        'AAPL',
        'MSFT',
        'GOOGL',
        'AMZN',
        'TSLA',
        'META',
        'NVDA',
        'BRK.B',
        'JPM',
        'V',
        'JNJ',
        'WMT',
        'PG',
        'MA',
        'HD',
        'DIS',
        'PYPL',
        'NFLX',
        'ADBE',
        'CRM',
      ];
      const names = [
        'Apple Inc.',
        'Microsoft',
        'Alphabet',
        'Amazon',
        'Tesla',
        'Meta',
        'NVIDIA',
        'Berkshire',
        'JPMorgan',
        'Visa',
        'Johnson & Johnson',
        'Walmart',
        'Procter & Gamble',
        'Mastercard',
        'Home Depot',
        'Disney',
        'PayPal',
        'Netflix',
        'Adobe',
        'Salesforce',
      ];
      const ticker = tickers[i % tickers.length];
      const name = names[i % names.length];
      const shares = Math.floor(Math.random() * 100) + 1;
      const avgPrice = Math.random() * 300 + 50;
      const currentPrice = avgPrice * (1 + (Math.random() - 0.5) * 0.4);
      const value = shares * currentPrice;
      const gain = (currentPrice - avgPrice) * shares;
      const gainPercent = ((currentPrice - avgPrice) / avgPrice) * 100;

      return {
        id: String(i + 1),
        ticker: `${ticker}${i >= 20 ? Math.floor(i / 20) : ''}`,
        name: `${name}${i >= 20 ? ` ${Math.floor(i / 20)}` : ''}`,
        shares,
        avgPrice,
        currentPrice,
        value,
        gain,
        gainPercent,
      };
    });

    const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
    const totalGain = positions.reduce((sum, p) => sum + p.gain, 0);
    const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    const handleRefresh = () => {
      setIsRefreshing(true);
      refreshTimeoutRef.current = setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={[styles.previewCard, { backgroundColor: colors.bgNeutralSecondary }]}>
              <View style={styles.portfolioPreview}>
                <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  Total Portfolio Value
                </EtText>
                <EtText variant="display-main">
                  $
                  {totalValue.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}
                </EtText>
                <View
                  style={[
                    styles.gainBadge,
                    {
                      backgroundColor: totalGain >= 0 ? colors.bgPositiveSubtle : colors.bgNegativeSubtle,
                    },
                  ]}
                >
                  <EtText
                    variant="body-secondary-semibold"
                    style={{
                      color: totalGain >= 0 ? colors.textActionPositive : colors.textActionNegative,
                    }}
                  >
                    {totalGain >= 0 ? '+' : ''}
                    {totalGainPercent.toFixed(2)}% ($
                    {totalGain.toLocaleString('en-US', {
                      maximumFractionDigits: 0,
                    })}
                    )
                  </EtText>
                </View>
              </View>
              <EtButton variant="primary-filled" onPress={handleOpen} stretch>
                {`View All Positions (${positions.length})`}
              </EtButton>
            </View>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            snapPoints={['60%', '90%']}
            onClose={handleClose}
            accessibilityLabel="Portfolio positions"
            testID="portfolio-sheet"
          >
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Portfolio</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  {`${positions.length} positions`}
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleRefresh} accessibilityLabel="Refresh portfolio">
                {isRefreshing ? (
                  <ActivityIndicator size="small" color={colors.textActionBrand} />
                ) : (
                  <EtoroIcon icon={{ iconName: 'refresh' }} appearance={{ size: 20, color: colors.textActionBrand }} />
                )}
              </EtBottomSheet.Header.Action>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.FlashList
              data={positions}
              // keyExtractor is REQUIRED in FlashList v2 to prevent glitches
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isPositive = item.gain >= 0;
                return (
                  <Pressable onPress={handleClose} style={[styles.positionRow, { backgroundColor: colors.bgNeutralQuaternary }]}>
                    <View
                      style={[
                        styles.tickerBadge,
                        {
                          backgroundColor: isPositive ? colors.bgPositiveSubtle : colors.bgNegativeSubtle,
                        },
                      ]}
                    >
                      <EtText
                        variant="body-secondary-semibold"
                        style={{
                          color: isPositive ? colors.textActionPositive : colors.textActionNegative,
                        }}
                      >
                        {item.ticker.substring(0, 4)}
                      </EtText>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <EtText variant="body-base-semibold" numberOfLines={1}>
                        {item.name}
                      </EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        {`${item.shares} shares @ $${item.avgPrice.toFixed(2)}`}
                      </EtText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <EtText variant="body-base-semibold">
                        $
                        {item.value.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}
                      </EtText>
                      <EtText
                        variant="body-secondary-regular"
                        style={{
                          color: isPositive ? colors.textActionPositive : colors.textActionNegative,
                        }}
                      >
                        {isPositive ? '+' : ''}
                        {item.gainPercent.toFixed(1)}%
                      </EtText>
                    </View>
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// ASSET SEARCH - Enhanced search experience
// ============================================================================

/**
 * Asset Search Sheet
 *
 * An enhanced search interface demonstrating:
 * - Search input in header with auto-focus
 * - Recent searches section
 * - Category filter tabs
 * - Filtered results with empty state
 * - Fixed height to prevent resize during filtering
 */
export const AssetSearch: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const categories = [
      { id: 'all', label: 'All', icon: '🌐' },
      { id: 'stocks', label: 'Stocks', icon: '📊' },
      { id: 'crypto', label: 'Crypto', icon: '₿' },
      { id: 'etf', label: 'ETFs', icon: '📦' },
      { id: 'commodities', label: 'Commodities', icon: '🛢️' },
    ];

    const recentSearches = ['Tesla', 'Bitcoin', 'S&P 500'];

    const allAssets = [
      {
        id: '1',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        type: 'stocks',
        price: 178.72,
        change: 2.34,
      },
      {
        id: '2',
        name: 'Microsoft Corp.',
        ticker: 'MSFT',
        type: 'stocks',
        price: 378.91,
        change: 1.12,
      },
      {
        id: '3',
        name: 'Amazon.com Inc.',
        ticker: 'AMZN',
        type: 'stocks',
        price: 178.25,
        change: -0.45,
      },
      {
        id: '4',
        name: 'Tesla Inc.',
        ticker: 'TSLA',
        type: 'stocks',
        price: 248.5,
        change: 3.21,
      },
      {
        id: '5',
        name: 'Bitcoin',
        ticker: 'BTC',
        type: 'crypto',
        price: 43250.0,
        change: 2.15,
      },
      {
        id: '6',
        name: 'Ethereum',
        ticker: 'ETH',
        type: 'crypto',
        price: 2280.0,
        change: -1.32,
      },
      {
        id: '7',
        name: 'Gold',
        ticker: 'XAU',
        type: 'commodities',
        price: 2024.5,
        change: 0.45,
      },
      {
        id: '8',
        name: 'S&P 500 ETF',
        ticker: 'SPY',
        type: 'etf',
        price: 478.23,
        change: 0.89,
      },
      {
        id: '9',
        name: 'Solana',
        ticker: 'SOL',
        type: 'crypto',
        price: 98.5,
        change: 5.2,
      },
      {
        id: '10',
        name: 'NVIDIA Corp.',
        ticker: 'NVDA',
        type: 'stocks',
        price: 875.28,
        change: 4.1,
      },
      {
        id: '11',
        name: 'Silver',
        ticker: 'XAG',
        type: 'commodities',
        price: 23.45,
        change: -0.8,
      },
      {
        id: '12',
        name: 'Nasdaq 100 ETF',
        ticker: 'QQQ',
        type: 'etf',
        price: 412.56,
        change: 1.2,
      },
    ];

    const filteredAssets = allAssets.filter((asset) => {
      const matchesSearch =
        searchText === '' ||
        asset.name.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.ticker.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = activeCategory === null || activeCategory === 'all' || asset.type === activeCategory;
      return matchesSearch && matchesCategory;
    });

    const handleOpen = () => {
      setSearchText('');
      setActiveCategory(null);
      bottomSheetRef.current?.present();
    };
    const handleClose = () => {
      Keyboard.dismiss();
      bottomSheetRef.current?.dismiss();
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'stocks':
          return '📊';
        case 'crypto':
          return '₿';
        case 'etf':
          return '📦';
        case 'commodities':
          return '🛢️';
        default:
          return '📈';
      }
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={[styles.previewCard, { backgroundColor: colors.bgNeutralSecondary }]}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 48, color: colors.textActionBrand }} />
                <EtText variant="heading-compact" style={{ marginTop: 12, textAlign: 'center' }}>
                  Discover Assets
                </EtText>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  Search stocks, crypto, ETFs, and more
                </EtText>
              </View>
              <EtButton variant="primary-filled" onPress={handleOpen} stretch>
                Search Assets
              </EtButton>
            </View>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            snapPoints={['80%']}
            onClose={handleClose}
            accessibilityLabel="Search assets"
            testID="search-sheet"
          >
            <EtBottomSheet.Header>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20, color: colors.textSecondaryNeutral }} />
                <BottomSheetTextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search stocks, crypto, ETFs..."
                  placeholderTextColor={colors.textSecondaryNeutral}
                  autoFocus
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: colors.bgNeutralQuaternary,
                      color: colors.textPrimaryNeutral,
                    },
                  ]}
                  accessibilityLabel="Search input"
                />
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              {/* Category Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20, paddingHorizontal: 20 }}
                contentContainerStyle={{ gap: 8, paddingRight: 40 }}
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id || (activeCategory === null && cat.id === 'all');
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setActiveCategory(cat.id === 'all' ? null : cat.id)}
                      style={[
                        styles.categoryTab,
                        {
                          backgroundColor: isActive ? colors.bgActionBrand : colors.bgNeutralQuaternary,
                        },
                      ]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: isActive }}
                    >
                      <EtText style={{ fontSize: 14 }}>{cat.icon}</EtText>
                      <EtText
                        variant="body-secondary-semibold"
                        style={{
                          color: isActive ? colors.textInvertedPrimaryNeutral : colors.textSecondaryNeutral,
                          marginLeft: 4,
                        }}
                      >
                        {cat.label}
                      </EtText>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Recent Searches (only show when no search text) */}
              {searchText === '' && (
                <View style={{ marginTop: 20 }}>
                  <EtText
                    variant="body-secondary-semibold"
                    style={{
                      color: colors.textSecondaryNeutral,
                      marginBottom: 12,
                    }}
                  >
                    Recent Searches
                  </EtText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {recentSearches.map((term) => (
                      <Pressable
                        key={term}
                        onPress={() => setSearchText(term)}
                        style={[styles.recentChip, { backgroundColor: colors.bgNeutralQuaternary }]}
                      >
                        <EtoroIcon
                          icon={{ iconName: 'clock' }}
                          appearance={{
                            size: 14,
                            color: colors.textSecondaryNeutral,
                          }}
                        />
                        <EtText
                          variant="body-secondary-regular"
                          style={{
                            color: colors.textSecondaryNeutral,
                            marginLeft: 6,
                          }}
                        >
                          {term}
                        </EtText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Results */}
              <View style={{ marginTop: 20, gap: 8 }}>
                <EtText variant="body-secondary-semibold" style={{ color: colors.textSecondaryNeutral }}>
                  {searchText ? `Results (${filteredAssets.length})` : 'Popular'}
                </EtText>

                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <Pressable key={asset.id} onPress={handleClose} style={[styles.assetRow, { backgroundColor: colors.bgNeutralQuaternary }]}>
                      <View style={[styles.assetIcon, { backgroundColor: colors.bgNeutralTertiary }]}>
                        <EtText style={{ fontSize: 20 }}>{getTypeIcon(asset.type)}</EtText>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <EtText variant="body-base-semibold">{asset.name}</EtText>
                        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                          {asset.ticker}
                        </EtText>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <EtText variant="body-base-semibold">${asset.price.toLocaleString()}</EtText>
                        <EtText
                          variant="body-secondary-regular"
                          style={{
                            color: asset.change >= 0 ? colors.textActionPositive : colors.textActionNegative,
                          }}
                        >
                          {asset.change >= 0 ? '+' : ''}
                          {asset.change}%
                        </EtText>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <EtText style={{ fontSize: 48 }}>🔍</EtText>
                    <EtText
                      variant="body-base-semibold"
                      style={{
                        marginTop: 16,
                        color: colors.textSecondaryNeutral,
                      }}
                    >
                      No results found
                    </EtText>
                    <EtText
                      variant="body-secondary-regular"
                      style={{
                        marginTop: 4,
                        color: colors.textSecondaryNeutral,
                        textAlign: 'center',
                      }}
                    >
                      Try a different search term or category
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

// ============================================================================
// PAYMENT CONFIRMATION - Enhanced with biometric
// ============================================================================

/**
 * Payment Confirmation Sheet
 *
 * A payment flow demonstrating:
 * - Non-dismissable confirmation (closeOnBackdrop=false, enablePanDownToClose=false)
 * - Biometric authentication simulation
 * - Loading state during confirmation
 * - Animated success state
 */
export const PaymentConfirmation: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const authTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [state, setState] = useState<'confirm' | 'authenticating' | 'success'>('confirm');

    // Cleanup timeouts on unmount
    React.useEffect(() => {
      return () => {
        if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      };
    }, []);

    const handleOpen = () => {
      setState('confirm');
      bottomSheetRef.current?.present();
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();

    const handleConfirm = () => {
      setState('authenticating');
      // Simulate biometric auth
      authTimeoutRef.current = setTimeout(() => {
        setState('success');
        // Auto-close after success
        closeTimeoutRef.current = setTimeout(handleClose, 1500);
      }, 2000);
    };

    const payment = {
      recipient: 'John Smith',
      recipientAvatar: 'JS',
      amount: 500.0,
      fee: 0.0,
      total: 500.0,
      method: 'Bank Transfer',
      accountLast4: '4242',
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={[styles.previewCard, { backgroundColor: colors.bgNeutralSecondary }]}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={[styles.paymentIcon, { backgroundColor: colors.bgPositiveSubtle }]}>
                  <EtText variant="display-main">💸</EtText>
                </View>
                <EtText variant="heading-compact" style={{ marginTop: 12, textAlign: 'center' }}>
                  Send Money
                </EtText>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  Secure payment with biometric verification
                </EtText>
              </View>
              <EtButton variant="primary-filled" onPress={handleOpen} stretch>
                {`Send $${payment.amount.toFixed(0)}`}
              </EtButton>
            </View>
          </View>

          <EtBottomSheet
            bottomSheetRef={bottomSheetRef}
            snapPoints={['70%']}
            closeOnBackdrop={false}
            enablePanDownToClose={false}
            onClose={handleClose}
            accessibilityLabel="Confirm payment"
            testID="payment-sheet"
          >
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>{state === 'success' ? 'Success' : 'Confirm Payment'}</EtBottomSheet.Header.Title>
              {state === 'confirm' ? (
                <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                  <EtoroIcon
                    icon={{ iconName: 'close' }}
                    appearance={{
                      size: 24,
                      color: colors.textSecondaryNeutral,
                    }}
                  />
                </EtBottomSheet.Header.Action>
              ) : null}
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              {state === 'success' ? (
                <View style={styles.successState}>
                  <View style={[styles.successIcon, { backgroundColor: colors.bgPositiveSubtle }]}>
                    <EtoroIcon
                      icon={{ iconName: 'checkLine' }}
                      appearance={{
                        size: 48,
                        color: colors.textActionPositive,
                      }}
                    />
                  </View>
                  <EtText variant="heading-large" style={{ marginTop: 20, textAlign: 'center' }}>
                    Payment Sent!
                  </EtText>
                  <EtText
                    variant="body-base-regular"
                    style={{
                      marginTop: 8,
                      color: colors.textSecondaryNeutral,
                      textAlign: 'center',
                    }}
                  >
                    {`$${payment.amount.toFixed(2)} sent to ${payment.recipient}`}
                  </EtText>
                </View>
              ) : state === 'authenticating' ? (
                <View style={styles.authState}>
                  <View style={[styles.authIcon, { backgroundColor: colors.bgActionBrand }]}>
                    <EtoroIcon
                      icon={{ iconName: 'fingerprint' }}
                      appearance={{
                        size: 48,
                        color: colors.textInvertedPrimaryNeutral,
                      }}
                    />
                  </View>
                  <EtText variant="heading-compact" style={{ marginTop: 20, textAlign: 'center' }}>
                    Authenticating...
                  </EtText>
                  <EtText
                    variant="body-secondary-regular"
                    style={{
                      marginTop: 8,
                      color: colors.textSecondaryNeutral,
                      textAlign: 'center',
                    }}
                  >
                    Please verify your identity
                  </EtText>
                  <ActivityIndicator size="large" color={colors.textActionBrand} style={{ marginTop: 24 }} />
                </View>
              ) : (
                <View style={{ gap: 20 }}>
                  {/* Recipient */}
                  <View style={styles.recipientCard}>
                    <View style={[styles.recipientAvatar, { backgroundColor: colors.bgActionBrand }]}>
                      <EtText variant="heading-compact" style={{ color: colors.textInvertedPrimaryNeutral }}>
                        {payment.recipientAvatar}
                      </EtText>
                    </View>
                    <View style={{ marginLeft: 16 }}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Sending to
                      </EtText>
                      <EtText variant="body-base-semibold">{payment.recipient}</EtText>
                    </View>
                  </View>

                  {/* Amount Display */}
                  <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                    <EtText variant="display-main">{`$${payment.amount.toFixed(2)}`}</EtText>
                  </View>

                  {/* Details */}
                  <View style={[styles.detailsCard, { backgroundColor: colors.bgNeutralQuaternary }]}>
                    <View style={styles.detailRow}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Payment Method
                      </EtText>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <EtText variant="body-base-semibold">{payment.method}</EtText>
                        <EtText
                          variant="body-secondary-regular"
                          style={{
                            color: colors.textSecondaryNeutral,
                            marginLeft: 4,
                          }}
                        >
                          {`•••• ${payment.accountLast4}`}
                        </EtText>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        Fee
                      </EtText>
                      <View style={[styles.freeBadge, { backgroundColor: colors.bgPositiveSubtle }]}>
                        <EtText variant="body-secondary-semibold" style={{ color: colors.textActionPositive }}>
                          FREE
                        </EtText>
                      </View>
                    </View>
                    <View style={[styles.detailDivider, { backgroundColor: colors.dividerPrimary }]} />
                    <View style={styles.detailRow}>
                      <EtText variant="body-base-semibold">Total</EtText>
                      <EtText variant="body-base-semibold">{`$${payment.total.toFixed(2)}`}</EtText>
                    </View>
                  </View>

                  {/* Security Note */}
                  <View style={[styles.securityNote, { backgroundColor: colors.bgInfoSubtle }]}>
                    <EtoroIcon icon={{ iconName: 'lock' }} appearance={{ size: 20, color: colors.textActionBrand }} />
                    <EtText
                      variant="body-secondary-regular"
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        color: colors.textSecondaryNeutral,
                      }}
                    >
                      Your payment is protected with bank-level encryption
                    </EtText>
                  </View>
                </View>
              )}
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              {state === 'confirm' ? (
                <>
                  <EtButton variant="primary-filled" onPress={handleConfirm} stretch>
                    Confirm with Biometrics
                  </EtButton>
                  <EtButton variant="primary-subtle" onPress={handleClose} stretch>
                    Cancel
                  </EtButton>
                </>
              ) : (
                <EtButton variant="primary-filled" onPress={handleClose} stretch>
                  Done
                </EtButton>
              )}
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// SETTINGS MENU - Enhanced with toggles
// ============================================================================

/**
 * Settings Menu Sheet
 *
 * A settings/action menu demonstrating:
 * - List of actions with icons
 * - Toggle switches for settings
 * - Destructive action styling
 * - Version info in footer
 */
export const SettingsMenu: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [biometrics, setBiometrics] = useState(true);

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    const ToggleSwitch = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
      <Pressable
        onPress={onToggle}
        style={[
          styles.toggle,
          {
            backgroundColor: value ? colors.bgActionBrand : colors.bgNeutralQuaternary,
          },
        ]}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: colors.bgNeutralPrimary,
              transform: [{ translateX: value ? 20 : 2 }],
            },
          ]}
        />
      </Pressable>
    );

    const menuSections = [
      {
        title: 'Preferences',
        items: [
          {
            id: 'notifications',
            icon: 'bell',
            label: 'Push Notifications',
            toggle: true,
            value: notifications,
            onToggle: () => setNotifications(!notifications),
          },
          {
            id: 'darkMode',
            icon: 'moon',
            label: 'Dark Mode',
            toggle: true,
            value: darkMode,
            onToggle: () => setDarkMode(!darkMode),
          },
          {
            id: 'biometrics',
            icon: 'fingerprint',
            label: 'Biometric Login',
            toggle: true,
            value: biometrics,
            onToggle: () => setBiometrics(!biometrics),
          },
        ],
      },
      {
        title: 'Account',
        items: [
          { id: 'profile', icon: 'user', label: 'Edit Profile' },
          { id: 'security', icon: 'lock', label: 'Security Settings' },
          { id: 'payment', icon: 'creditCard', label: 'Payment Methods' },
        ],
      },
      {
        title: 'Support',
        items: [
          { id: 'help', icon: 'help', label: 'Help Center' },
          { id: 'contact', icon: 'chat', label: 'Contact Support' },
        ],
      },
      {
        title: '',
        items: [
          {
            id: 'logout',
            icon: 'logout',
            label: 'Sign Out',
            destructive: true,
          },
        ],
      },
    ];

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={[styles.previewCard, { backgroundColor: colors.bgNeutralSecondary }]}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={[styles.settingsIcon, { backgroundColor: colors.bgNeutralQuaternary }]}>
                  <EtoroIcon
                    icon={{ iconName: 'settings' }}
                    appearance={{
                      size: 32,
                      color: colors.textSecondaryNeutral,
                    }}
                  />
                </View>
                <EtText variant="heading-compact" style={{ marginTop: 12, textAlign: 'center' }}>
                  Settings
                </EtText>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  Customize your app experience
                </EtText>
              </View>
              <EtButton variant="primary-filled" onPress={handleOpen} stretch>
                Open Settings
              </EtButton>
            </View>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} onClose={handleClose} accessibilityLabel="Settings menu" testID="settings-sheet">
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              <View style={{ gap: 24 }}>
                {menuSections.map((section, sectionIndex) => (
                  <View key={sectionIndex}>
                    {section.title && (
                      <EtText
                        variant="body-secondary-semibold"
                        style={{
                          color: colors.textSecondaryNeutral,
                          marginBottom: 8,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {section.title}
                      </EtText>
                    )}
                    <View style={{ gap: 4 }}>
                      {section.items.map((item: any) => (
                        <Pressable
                          key={item.id}
                          onPress={item.toggle ? item.onToggle : handleClose}
                          style={[
                            styles.menuItem,
                            {
                              backgroundColor: item.destructive ? colors.bgNegativeSubtle : colors.bgNeutralQuaternary,
                            },
                          ]}
                          accessibilityRole={item.toggle ? 'switch' : 'button'}
                          accessibilityState={item.toggle ? { checked: item.value } : undefined}
                          accessibilityLabel={item.label}
                        >
                          <EtoroIcon
                            icon={{ iconName: item.icon }}
                            appearance={{
                              size: 24,
                              color: item.destructive ? colors.textActionNegative : colors.textSecondaryNeutral,
                            }}
                          />
                          <EtText
                            variant="body-base-semibold"
                            style={{
                              flex: 1,
                              marginLeft: 16,
                              color: item.destructive ? colors.textActionNegative : colors.textPrimaryNeutral,
                            }}
                          >
                            {item.label}
                          </EtText>
                          {item.toggle ? (
                            <ToggleSwitch value={item.value} onToggle={item.onToggle} />
                          ) : (
                            !item.destructive && (
                              <EtoroIcon
                                icon={{ iconName: 'chevronRight' }}
                                appearance={{
                                  size: 20,
                                  color: colors.textSecondaryNeutral,
                                }}
                              />
                            )
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}

                {/* Version Info */}
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    eToro Plus v2.4.1
                  </EtText>
                  <EtText
                    variant="body-secondary-regular"
                    style={{
                      color: colors.textSecondaryNeutral,
                      marginTop: 4,
                      fontSize: 12,
                    }}
                  >
                    Made with ❤️ by eToro
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
  previewCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  assetLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statsCompact: {
    flexDirection: 'row',
    gap: 16,
  },
  statItemCompact: {
    alignItems: 'flex-end',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
    position: 'relative',
  },
  toggleIndicator: {
    position: 'absolute',
    top: 3,
    width: '48%',
    height: '100%',
    borderRadius: 6,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  amountInputCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  amountTextInputCompact: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  summaryCardCompact: {
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryDivider: {
    height: 1,
  },
  freeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  wizardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  portfolioPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gainBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  tickerBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  assetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  paymentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailDivider: {
    height: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  authState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  authIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
