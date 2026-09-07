import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtCryptoCard, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X4, X5, X6 } from 'etoro-ui/core/styles/spacing';

const MOCK_URLS = {
  bitcoin: 'https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F0AF32_F7F7F7.svg',
  ethereum: 'https://etoro-cdn.etorostatic.com/market-avatars/100001/100001_2C2C2C_F7F7F7.svg',
  solana: 'https://etoro-cdn.etorostatic.com/market-avatars/100063/100063_2C2C2C_F7F7F7.svg',
};

const meta = {
  title: 'eToro-UI/Components/DataDisplay/EtCryptoCard',
  component: EtCryptoCard,
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtCryptoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bitcoin: Story = {
  render: () => (
    <EtCryptoCard logoUrl={MOCK_URLS.bitcoin}>
      <EtCryptoCard.LogoSection>
        <EtCryptoCard.Logo />
      </EtCryptoCard.LogoSection>
      <EtCryptoCard.BottomSection>
        <EtCryptoCard.Info>
          <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
          <EtCryptoCard.Name>Bitcoin</EtCryptoCard.Name>
        </EtCryptoCard.Info>
        <EtCryptoCard.Pricing>
          <EtCryptoCard.Price>$42,150.23</EtCryptoCard.Price>
          <EtCryptoCard.Units>0.5 BTC</EtCryptoCard.Units>
        </EtCryptoCard.Pricing>
      </EtCryptoCard.BottomSection>
    </EtCryptoCard>
  ),
};

export const Ethereum: Story = {
  render: () => (
    <EtCryptoCard logoUrl={MOCK_URLS.ethereum}>
      <EtCryptoCard.LogoSection>
        <EtCryptoCard.Logo />
      </EtCryptoCard.LogoSection>
      <EtCryptoCard.BottomSection>
        <EtCryptoCard.Info>
          <EtCryptoCard.Symbol>ETH</EtCryptoCard.Symbol>
          <EtCryptoCard.Name>Ethereum</EtCryptoCard.Name>
        </EtCryptoCard.Info>
        <EtCryptoCard.Pricing>
          <EtCryptoCard.Price>$2,485.67</EtCryptoCard.Price>
          <EtCryptoCard.Units>1.2 ETH</EtCryptoCard.Units>
        </EtCryptoCard.Pricing>
      </EtCryptoCard.BottomSection>
    </EtCryptoCard>
  ),
};

export const CustomBackgroundColor: Story = {
  render: () => (
    <EtCryptoCard logoUrl="https://example.com/market-avatars/etc/150x150.png" backgroundColor="#3D9970">
      <EtCryptoCard.LogoSection>
        <EtCryptoCard.Logo size={80} />
      </EtCryptoCard.LogoSection>
      <EtCryptoCard.BottomSection>
        <EtCryptoCard.Info>
          <EtCryptoCard.Symbol>ETC</EtCryptoCard.Symbol>
          <EtCryptoCard.Name>Ethereum Classic</EtCryptoCard.Name>
        </EtCryptoCard.Info>
        <EtCryptoCard.Pricing>
          <EtCryptoCard.Price>$20</EtCryptoCard.Price>
        </EtCryptoCard.Pricing>
      </EtCryptoCard.BottomSection>
    </EtCryptoCard>
  ),
};

export const AllCryptos: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    return (
      <ScrollView contentContainerStyle={styles.showcase}>
        <EtText variant="heading-base" style={{ color: colors.textPrimaryNeutral, marginBottom: X5 }}>
          Crypto Card Showcase
        </EtText>
        <View style={styles.grid}>
          <EtCryptoCard logoUrl={MOCK_URLS.bitcoin}>
            <EtCryptoCard.LogoSection>
              <EtCryptoCard.Logo />
            </EtCryptoCard.LogoSection>
            <EtCryptoCard.BottomSection>
              <EtCryptoCard.Info>
                <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
                <EtCryptoCard.Name>Bitcoin</EtCryptoCard.Name>
              </EtCryptoCard.Info>
              <EtCryptoCard.Pricing>
                <EtCryptoCard.Price>$42,150</EtCryptoCard.Price>
                <EtCryptoCard.Units>0.5 BTC</EtCryptoCard.Units>
              </EtCryptoCard.Pricing>
            </EtCryptoCard.BottomSection>
          </EtCryptoCard>
          <EtCryptoCard logoUrl={MOCK_URLS.ethereum}>
            <EtCryptoCard.LogoSection>
              <EtCryptoCard.Logo />
            </EtCryptoCard.LogoSection>
            <EtCryptoCard.BottomSection>
              <EtCryptoCard.Info>
                <EtCryptoCard.Symbol>ETH</EtCryptoCard.Symbol>
                <EtCryptoCard.Name>Ethereum</EtCryptoCard.Name>
              </EtCryptoCard.Info>
              <EtCryptoCard.Pricing>
                <EtCryptoCard.Price>$2,485</EtCryptoCard.Price>
                <EtCryptoCard.Units>1.2 ETH</EtCryptoCard.Units>
              </EtCryptoCard.Pricing>
            </EtCryptoCard.BottomSection>
          </EtCryptoCard>
          <EtCryptoCard logoUrl={MOCK_URLS.solana}>
            <EtCryptoCard.LogoSection>
              <EtCryptoCard.Logo />
            </EtCryptoCard.LogoSection>
            <EtCryptoCard.BottomSection>
              <EtCryptoCard.Info>
                <EtCryptoCard.Symbol>SOL</EtCryptoCard.Symbol>
                <EtCryptoCard.Name>Solana</EtCryptoCard.Name>
              </EtCryptoCard.Info>
              <EtCryptoCard.Pricing>
                <EtCryptoCard.Price>$98.45</EtCryptoCard.Price>
                <EtCryptoCard.Units>15 SOL</EtCryptoCard.Units>
              </EtCryptoCard.Pricing>
            </EtCryptoCard.BottomSection>
          </EtCryptoCard>
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: X6, justifyContent: 'center' },
  showcase: { padding: X4 },
  grid: { gap: X4, justifyContent: 'center' },
});
