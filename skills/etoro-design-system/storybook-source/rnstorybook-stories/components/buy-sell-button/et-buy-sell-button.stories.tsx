import type { Meta, StoryObj } from '@storybook/react-native';
import type { BuySellButtonSize, BuySellButtonType } from 'etoro-ui';
import { EtBuySellButton, EtText } from 'etoro-ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtBuySellButton>;

const meta: Meta<typeof EtBuySellButton> = {
  title: 'eToro-UI/Components/BuySellButton',
  component: EtBuySellButton,
  parameters: {
    notes: 'Specialized button for buy/sell trading actions with 7 visual states.',
  },
  decorators: [
    (Story) => (
      <ScrollView contentContainerStyle={styles.decorator}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;

const types: BuySellButtonType[] = ['buy', 'sell'];
const sizes: BuySellButtonSize[] = ['tiny', 'small', 'medium', 'large'];

/**
 * All 7 Visual States
 */
export const AllStates: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        All 7 Visual States (Buy)
      </EtText>

      <View style={styles.statesGrid}>
        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">1. Default</EtText>
          <EtBuySellButton type="buy" price={11756.62} onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">2. Pressed</EtText>
          <EtText variant="caption-regular" style={styles.hint}>
            (Press and hold to see)
          </EtText>
          <EtBuySellButton type="buy" price={11756.62} onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">3. One-Click Trading</EtText>
          <EtBuySellButton type="buy" price={11756.62} oneClickTrading onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">4. One-Click Trading Pressed</EtText>
          <EtText variant="caption-regular" style={styles.hint}>
            (Press and hold to see)
          </EtText>
          <EtBuySellButton type="buy" price={11756.62} oneClickTrading onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">5. Positive Indication</EtText>
          <EtBuySellButton type="buy" price={11756.62} positiveIndication onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">6. Negative Indication</EtText>
          <EtBuySellButton type="buy" price={11756.62} negativeIndication onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">7. Disabled</EtText>
          <EtBuySellButton type="buy" price={11756.62} disabled />
        </View>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        All 7 Visual States (Sell)
      </EtText>

      <View style={styles.statesGrid}>
        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">1. Default</EtText>
          <EtBuySellButton type="sell" price={11756.62} onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">2. Pressed</EtText>
          <EtText variant="caption-regular" style={styles.hint}>
            (Press and hold to see)
          </EtText>
          <EtBuySellButton type="sell" price={11756.62} onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">3. One-Click Trading</EtText>
          <EtBuySellButton type="sell" price={11756.62} oneClickTrading onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">4. One-Click Trading Pressed</EtText>
          <EtText variant="caption-regular" style={styles.hint}>
            (Press and hold to see)
          </EtText>
          <EtBuySellButton type="sell" price={11756.62} oneClickTrading onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">5. Positive Indication</EtText>
          <EtBuySellButton type="sell" price={11756.62} positiveIndication onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">6. Negative Indication</EtText>
          <EtBuySellButton type="sell" price={11756.62} negativeIndication onPress={() => {}} />
        </View>

        <View style={styles.stateItem}>
          <EtText variant="label-secondary-semibold">7. Disabled</EtText>
          <EtBuySellButton type="sell" price={11756.62} disabled />
        </View>
      </View>
    </View>
  ),
};

/**
 * Size Matrix
 */
export const SizeMatrix: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Size Matrix
      </EtText>

      {/* Header row - Buy / Sell horizontally */}
      <View style={styles.matrixRow}>
        <View style={styles.matrixLabelCellWide} />
        {types.map((type) => (
          <View key={type} style={styles.matrixHeaderCellWide}>
            <EtText variant="label-tertiary-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</EtText>
          </View>
        ))}
      </View>

      {/* Size rows - tiny, small, medium, large vertically */}
      {sizes.map((size) => (
        <View key={size} style={styles.matrixRow}>
          <View style={styles.matrixLabelCellWide}>
            <EtText variant="caption-medium">{size}</EtText>
          </View>
          {types.map((type) => (
            <View key={`${size}-${type}`} style={styles.matrixCellWide}>
              <EtBuySellButton type={type} size={size} price={1234.56} onPress={() => {}} />
            </View>
          ))}
        </View>
      ))}
    </View>
  ),
};

/**
 * Interactive Demo
 */
export const InteractiveDemo: Story = {
  render: function InteractiveDemoStory() {
    const [oneClickBuy, setOneClickBuy] = useState(false);
    const [oneClickSell, setOneClickSell] = useState(false);
    const [buyIndication, setBuyIndication] = useState<'none' | 'positive' | 'negative'>('none');
    const [sellIndication, setSellIndication] = useState<'none' | 'positive' | 'negative'>('none');
    const [buyPrice, setBuyPrice] = useState(11756.62);
    const [sellPrice, setSellPrice] = useState(11756.12);

    const updatePrices = () => {
      const delta = (Math.random() - 0.5) * 2;
      setBuyPrice((prev) => Math.max(0, prev + delta));
      setSellPrice((prev) => Math.max(0, prev + delta));
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Interactive Demo
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Tap buttons to see press states. Use toggles below to change modes.
        </EtText>

        <View style={styles.tradingPanel}>
          <EtBuySellButton
            type="buy"
            size="large"
            price={buyPrice}
            oneClickTrading={oneClickBuy}
            positiveIndication={buyIndication === 'positive'}
            negativeIndication={buyIndication === 'negative'}
            onPress={updatePrices}
          />
          <EtBuySellButton
            type="sell"
            size="large"
            price={sellPrice}
            oneClickTrading={oneClickSell}
            positiveIndication={sellIndication === 'positive'}
            negativeIndication={sellIndication === 'negative'}
            onPress={updatePrices}
          />
        </View>

        <View style={styles.controlsSection}>
          <EtText variant="label-primary-semibold">Buy Button Controls:</EtText>
          <View style={styles.toggleRow}>
            <EtText variant="label-secondary-regular" onPress={() => setOneClickBuy((prev) => !prev)} style={styles.toggleButton}>
              {oneClickBuy ? '✓ One-Click ON' : '○ One-Click OFF'}
            </EtText>
            <EtText
              variant="label-secondary-regular"
              onPress={() => setBuyIndication((prev) => (prev === 'positive' ? 'none' : 'positive'))}
              style={styles.toggleButton}
            >
              {buyIndication === 'positive' ? '✓ Positive' : '○ Positive'}
            </EtText>
            <EtText
              variant="label-secondary-regular"
              onPress={() => setBuyIndication((prev) => (prev === 'negative' ? 'none' : 'negative'))}
              style={styles.toggleButton}
            >
              {buyIndication === 'negative' ? '✓ Negative' : '○ Negative'}
            </EtText>
          </View>

          <EtText variant="label-primary-semibold" style={{ marginTop: 16 }}>
            Sell Button Controls:
          </EtText>
          <View style={styles.toggleRow}>
            <EtText variant="label-secondary-regular" onPress={() => setOneClickSell((prev) => !prev)} style={styles.toggleButton}>
              {oneClickSell ? '✓ One-Click ON' : '○ One-Click OFF'}
            </EtText>
            <EtText
              variant="label-secondary-regular"
              onPress={() => setSellIndication((prev) => (prev === 'positive' ? 'none' : 'positive'))}
              style={styles.toggleButton}
            >
              {sellIndication === 'positive' ? '✓ Positive' : '○ Positive'}
            </EtText>
            <EtText
              variant="label-secondary-regular"
              onPress={() => setSellIndication((prev) => (prev === 'negative' ? 'none' : 'negative'))}
              style={styles.toggleButton}
            >
              {sellIndication === 'negative' ? '✓ Negative' : '○ Negative'}
            </EtText>
          </View>
        </View>
      </View>
    );
  },
};

/**
 * Price Formatting
 */
export const PriceFormatting: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Price Formatting
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        All prices are automatically formatted with 2 decimal places.
      </EtText>

      <View style={styles.priceList}>
        <View style={styles.priceRow}>
          <EtText variant="label-secondary-semibold" style={styles.priceLabel}>
            Small (1.5):
          </EtText>
          <EtBuySellButton type="buy" price={1.5} onPress={() => {}} />
        </View>

        <View style={styles.priceRow}>
          <EtText variant="label-secondary-semibold" style={styles.priceLabel}>
            Integer (100):
          </EtText>
          <EtBuySellButton type="buy" price={100} onPress={() => {}} />
        </View>

        <View style={styles.priceRow}>
          <EtText variant="label-secondary-semibold" style={styles.priceLabel}>
            Large (12345.67):
          </EtText>
          <EtBuySellButton type="sell" price={12345.67} onPress={() => {}} />
        </View>

        <View style={styles.priceRow}>
          <EtText variant="label-secondary-semibold" style={styles.priceLabel}>
            Many decimals (99.999):
          </EtText>
          <EtBuySellButton type="sell" price={99.999} onPress={() => {}} />
        </View>

        <View style={styles.priceRow}>
          <EtText variant="label-secondary-semibold" style={styles.priceLabel}>
            Zero (0):
          </EtText>
          <EtBuySellButton type="buy" price={0} onPress={() => {}} />
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  showcase: {
    gap: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 12,
  },
  hint: {
    opacity: 0.5,
    marginBottom: 4,
  },
  statesGrid: {
    gap: 16,
  },
  stateItem: {
    gap: 4,
  },
  matrixContainer: {
    paddingRight: 16,
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  matrixLabelCellWide: {
    width: 60,
  },
  matrixHeaderCellWide: {
    flex: 1,
    alignItems: 'center',
  },
  matrixCellWide: {
    flex: 1,
    alignItems: 'center',
  },
  tradingPanel: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  controlsSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 16,
    borderRadius: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  priceList: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceLabel: {
    width: 140,
  },
});
