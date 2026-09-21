import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import type { EtAssetCardAsset } from '../asset-card';
import { EtTrendingStockCard } from './et-trending-stock-card';

const mockEtAssetCard = jest.fn(
  ({
    children,
    testID,
    onFooterPress,
    accessibilityLabel,
  }: {
    children?: React.ReactNode;
    testID?: string;
    onFooterPress?: () => void;
    accessibilityLabel?: string;
  }) => {
    const { Pressable, View, Text } = require('react-native');
    if (onFooterPress) {
      return (
        <Pressable testID={testID || 'et-asset-card'} onPress={onFooterPress} accessibilityLabel={accessibilityLabel}>
          <Text>asset-card</Text>
          {children}
        </Pressable>
      );
    }
    return (
      <View testID={testID || 'et-asset-card'} accessibilityLabel={accessibilityLabel}>
        <Text>asset-card</Text>
        {children}
      </View>
    );
  },
);

jest.mock('../asset-card', () => ({
  EtAssetCard: (props: object) => mockEtAssetCard(props),
}));

const sampleAsset: EtAssetCardAsset = {
  symbol: 'AAPL',
  name: 'Apple',
  logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg',
  price: 186.79,
  changePercent: 0.0435,
  currency: 'USD',
};

const hero = { uri: 'https://example.com/trending-hero.jpg' };
const headline = 'Tesla experienced a significant sales slump in early 2026';

describe('EtTrendingStockCard', () => {
  beforeEach(() => {
    mockEtAssetCard.mockClear();
  });

  it('renders EtAssetCard with the large image + in-content eyebrow/title recipe', () => {
    render(<EtTrendingStockCard asset={sampleAsset} backgroundImage={hero} title={headline} description="Optional subtitle" testID="trending" />);

    expect(screen.getByTestId('trending')).toBeTruthy();
    expect(mockEtAssetCard).toHaveBeenCalledWith(
      expect.objectContaining({
        asset: sampleAsset,
        size: 'large',
        variant: 'standard',
        backgroundImage: hero,
        eyebrow: 'Trending Stock',
        title: headline,
        description: 'Optional subtitle',
        logoInFooter: true,
        footerOverlay: 'media',
        contentBlur: true,
        testID: 'trending',
      }),
    );
    // No header badge — label must not be passed
    expect(mockEtAssetCard.mock.calls[0][0]).not.toHaveProperty('label');
  });

  it('allows overriding the default eyebrow', () => {
    render(<EtTrendingStockCard asset={sampleAsset} backgroundImage={hero} title={headline} eyebrow="Hot mover" />);

    expect(mockEtAssetCard).toHaveBeenCalledWith(expect.objectContaining({ eyebrow: 'Hot mover', title: headline }));
  });

  it('forwards onPress as onFooterPress', () => {
    const onPress = jest.fn();
    render(<EtTrendingStockCard asset={sampleAsset} backgroundImage={hero} title={headline} onPress={onPress} testID="trending" />);

    expect(mockEtAssetCard).toHaveBeenCalledWith(expect.objectContaining({ onFooterPress: onPress, testID: 'trending' }));
    fireEvent.press(screen.getByTestId('trending'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
