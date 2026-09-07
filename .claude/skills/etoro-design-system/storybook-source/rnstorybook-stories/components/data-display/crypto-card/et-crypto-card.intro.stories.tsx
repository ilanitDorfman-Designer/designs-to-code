import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtCryptoCard, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X2, X3, X4, X6 } from 'etoro-ui/core/styles/spacing';

type Story = StoryObj<{}>;

const MOCK_URL = 'https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F0AF32_F7F7F7.svg';

function IntroductionContent() {
  const { colors } = useEtoroTheme();

  return (
    <ScrollView style={styles.container}>
      <EtText variant="display-main" style={styles.title}>
        EtCryptoCard
      </EtText>
      <EtText variant="heading-compact" style={styles.subtitle}>
        Crypto asset card with gradient background
      </EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Features
      </EtText>
      <EtText variant="body-secondary-regular">- Compound component pattern</EtText>
      <EtText variant="body-secondary-regular">- Automatic color extraction from CDN URL</EtText>
      <EtText variant="body-secondary-regular">- Optional `backgroundColor` override for BFF explicit colours</EtText>
      <EtText variant="body-secondary-regular">- Gradient background based on asset colors</EtText>
      <EtText variant="body-secondary-regular">- Centered logo with customizable size</EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.note}>
        Note: The logo may not be visible in Storybook as the CDN requires authentication headers to access the logos.
      </EtText>
      <View style={styles.cardDemo}>
        <EtCryptoCard logoUrl={MOCK_URL}>
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
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Usage
      </EtText>
      <EtText variant="body-secondary-regular" style={[styles.code, { backgroundColor: colors.bgNeutralSecondary }]}>
        {`<EtCryptoCard logoUrl={cdnUrl}>
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
</EtCryptoCard>`}
      </EtText>
    </ScrollView>
  );
}

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/EtCryptoCard/Introduction',
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
  render: () => <IntroductionContent />,
};

const styles = StyleSheet.create({
  decorator: { flex: 1, padding: X4 },
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: X2 },
  subtitle: { textAlign: 'center', opacity: 0.8, marginBottom: X6 },
  sectionTitle: { marginTop: X6, marginBottom: X3 },
  note: { marginBottom: X3, opacity: 0.7, fontStyle: 'italic' },
  cardDemo: { marginVertical: X4, paddingHorizontal: X6 },
  code: { fontFamily: 'Courier', fontSize: 12, padding: X3, borderRadius: X2 },
});
