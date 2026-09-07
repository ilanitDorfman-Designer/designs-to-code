import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { EtTrendingAssetsCard } from './et-trending-assets-card';

const mockEtMediaCard = jest.fn(({ children, testID }: { children?: React.ReactNode; testID?: string }) => {
  const { View } = require('react-native');
  return <View testID={testID || 'et-media-card'}>{children}</View>;
});

const mockContent = jest.fn(
  ({
    testID,
    eyebrow,
    title,
    description,
    onPress,
  }: {
    testID?: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    onPress?: () => void;
  }) => {
    const { View, Text, Pressable } = require('react-native');
    const body = (
      <>
        {eyebrow ? <Text>{eyebrow}</Text> : null}
        {title ? <Text>{title}</Text> : null}
        {description ? <Text>{description}</Text> : null}
      </>
    );
    if (onPress) {
      return (
        <Pressable testID={testID ? `${testID}-pressable` : 'content-pressable'} onPress={onPress}>
          <View testID={testID || 'content'}>{body}</View>
        </Pressable>
      );
    }
    return <View testID={testID || 'content'}>{body}</View>;
  },
);

const mockFooter = jest.fn(({ children, testID, overlay }: { children?: React.ReactNode; testID?: string; overlay?: string }) => {
  const { View, Text } = require('react-native');
  return (
    <View testID={testID || 'footer'}>
      <Text testID="footer-overlay-prop">{overlay}</Text>
      {children}
    </View>
  );
});

const mockHeader = jest.fn(({ children, testID }: { children?: React.ReactNode; testID?: string }) => {
  const { View } = require('react-native');
  return <View testID={testID || 'header'}>{children}</View>;
});

jest.mock('../media-card', () => {
  const Root = (props: object) => mockEtMediaCard(props);
  return {
    EtMediaCard: Object.assign(Root, {
      Content: (props: object) => mockContent(props),
      Footer: (props: object) => mockFooter(props),
      Header: (props: object) => mockHeader(props),
    }),
  };
});

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgGreyTransparentSecondary: '#CCCCCC30',
      carbonStatic050: '#FFFFFF',
    },
  }),
}));

jest.mock('../../foundations/text', () => ({
  EtText: ({ children }: { children: React.ReactNode }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('../social/avatar', () => {
  const { View, Text } = require('react-native');
  const Image = ({ alt }: { alt?: string }) => <Text testID={`avatar-image-${alt}`}>{alt}</Text>;
  const Fallback = ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>;
  const Root = ({ children, accessibilityLabel }: { children: React.ReactNode; accessibilityLabel?: string }) => (
    <View testID={`et-avatar-${accessibilityLabel}`}>{children}</View>
  );
  return { EtAvatar: Object.assign(Root, { Image, Fallback }) };
});

const assets = [
  { symbol: 'ADBE', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_E4231D_FFFFFF.svg', backgroundColor: '#E4231D' },
  { symbol: 'AAPL', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_00A4EF_FFFFFF.svg', backgroundColor: '#434351' },
  { symbol: 'TSLA', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg', backgroundColor: '#ED2520' },
  { symbol: 'AMZN', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg', backgroundColor: '#494D5A' },
  { symbol: 'SPOT', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_1ED761_FFFFFF.svg', backgroundColor: '#1ED761' },
  { symbol: 'NVDA', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_76B900_FFFFFF.svg' },
  { symbol: 'MSFT', logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_00A4EF_FFFFFF.svg' },
];

const hero = { uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=654&h=754&fit=crop' };
const headline = 'Trump – Musk feud reignites as megabill hits snags in Senate';

describe('EtTrendingAssetsCard', () => {
  beforeEach(() => {
    mockEtMediaCard.mockClear();
    mockContent.mockClear();
    mockFooter.mockClear();
  });

  it('renders MediaCard with large media + content stack + asset logo footer', () => {
    render(
      <EtTrendingAssetsCard
        assets={assets}
        backgroundImage={hero}
        title={headline}
        description="TSLA is seeing increased investor activity amid political uncertainty"
        testID="trending-assets"
      />,
    );

    expect(screen.getByTestId('trending-assets')).toBeTruthy();
    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'large',
        variant: 'standard',
        backgroundImage: hero,
        testID: 'trending-assets',
      }),
    );
    expect(mockEtMediaCard.mock.calls[0][0].accessibilityLabel).toBeUndefined();
    expect(screen.getByTestId('trending-assets-overflow').props.accessibilityRole).toBe('button');
    expect(mockContent).toHaveBeenCalledWith(
      expect.objectContaining({
        blur: true,
        title: headline,
        description: 'TSLA is seeing increased investor activity amid political uncertainty',
      }),
    );
    expect(mockContent.mock.calls[0][0].eyebrow).toBeUndefined();
    expect(mockFooter).toHaveBeenCalledWith(expect.objectContaining({ overlay: 'media' }));
    expect(screen.getByTestId('et-avatar-ADBE')).toBeTruthy();
    expect(screen.getByTestId('et-avatar-SPOT')).toBeTruthy();
    expect(screen.queryByTestId('et-avatar-NVDA')).toBeNull();
    expect(screen.getByTestId('trending-assets-overflow')).toBeTruthy();
    expect(screen.getByText('+2')).toBeTruthy();
  });

  it('expands into a carousel with all logos when the +N pill is pressed', () => {
    render(<EtTrendingAssetsCard assets={assets} backgroundImage={hero} title={headline} testID="trending-assets" />);

    expect(screen.queryByTestId('et-avatar-NVDA')).toBeNull();
    expect(screen.queryByTestId('trending-assets-carousel')).toBeNull();

    fireEvent.press(screen.getByTestId('trending-assets-overflow'));

    expect(screen.getByTestId('trending-assets-carousel')).toBeTruthy();
    expect(screen.getByTestId('et-avatar-NVDA')).toBeTruthy();
    expect(screen.getByTestId('et-avatar-MSFT')).toBeTruthy();
    expect(screen.queryByTestId('trending-assets-overflow')).toBeNull();
  });

  it('delegates to onOverflowPress instead of expanding when provided', () => {
    const onOverflowPress = jest.fn();
    render(
      <EtTrendingAssetsCard assets={assets} backgroundImage={hero} title={headline} onOverflowPress={onOverflowPress} testID="trending-assets" />,
    );

    fireEvent.press(screen.getByTestId('trending-assets-overflow'));

    expect(onOverflowPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('trending-assets-carousel')).toBeNull();
    expect(screen.queryByTestId('et-avatar-NVDA')).toBeNull();
  });

  it('forwards backgroundVideo and onPress', () => {
    const onPress = jest.fn();
    render(
      <EtTrendingAssetsCard
        assets={assets.slice(0, 3)}
        backgroundVideo="https://etoro-cdn.etorostatic.com/videos/demo.mp4"
        title={headline}
        onPress={onPress}
        testID="trending-assets"
      />,
    );

    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        backgroundVideo: 'https://etoro-cdn.etorostatic.com/videos/demo.mp4',
      }),
    );
    expect(screen.queryByTestId('trending-assets-overflow')).toBeNull();
    fireEvent.press(screen.getByTestId('trending-assets-content-pressable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
