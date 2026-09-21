import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { EtTopTraderCard } from './et-top-trader-card';

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

const mockFooter = jest.fn(
  ({ children, testID, overlay, onPress }: { children?: React.ReactNode; testID?: string; overlay?: string; onPress?: () => void }) => {
    const { View, Text, Pressable } = require('react-native');
    const body = (
      <View testID={testID || 'footer'}>
        <Text testID="footer-overlay-prop">{overlay}</Text>
        {children}
      </View>
    );
    if (onPress) {
      return (
        <Pressable testID={testID ? `${testID}-pressable` : 'footer-pressable'} onPress={onPress}>
          {body}
        </Pressable>
      );
    }
    return body;
  },
);

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
    useMediaCardContext: () => ({ foregroundColor: '#FFFFFF' }),
  };
});

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: { statusPositive: '#00CC44', carbonStatic050: '#FFFFFF', verdictPositive600: '#00CC44' },
  }),
}));

jest.mock('../../foundations/text', () => ({
  EtText: ({ children }: { children: React.ReactNode }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('../data-display/number', () => {
  const { Text, View } = require('react-native');
  const Value = () => <Text testID="et-number-value">$204.13</Text>;
  const Arrow = () => <Text testID="et-number-arrow">▲</Text>;
  const Root = ({ children }: { children: React.ReactNode }) => <View testID="et-number">{children}</View>;
  return { EtNumber: Object.assign(Root, { Value, Arrow }) };
});

jest.mock('../data-display/price', () => {
  const { View, Text } = require('react-native');
  const Change = () => <Text testID="et-price-change">0.09 (+0.05%)</Text>;
  const Value = () => <Text testID="et-price-value">$204.13</Text>;
  const Root = ({ children }: { children: React.ReactNode }) => <View testID="et-price">{children}</View>;
  return { EtPrice: Object.assign(Root, { Change, Value }) };
});

jest.mock('../data-display/user-info', () => {
  const { View, Text } = require('react-native');
  const Avatar = ({ children }: { children?: React.ReactNode }) => <View testID="et-user-info-avatar">{children}</View>;
  const Title = ({ children }: { children?: React.ReactNode }) => <View testID="et-user-info-title">{children}</View>;
  const Subtitle = ({ children }: { children?: React.ReactNode }) => <View testID="et-user-info-subtitle">{children}</View>;
  const Root = ({ children, data }: { children?: React.ReactNode; data?: { title?: string; subtitle?: string } }) => (
    <View testID="et-user-info">
      <Text>{data?.title}</Text>
      <Text>{data?.subtitle}</Text>
      {children}
    </View>
  );
  return {
    EtUserInfo: Object.assign(Root, { Avatar, Title, Subtitle }),
  };
});

jest.mock('../social/avatar', () => {
  const { View } = require('react-native');
  const Badge = ({ children }: { children?: React.ReactNode }) => <View testID="et-avatar-badge">{children}</View>;
  const Root = ({ children }: { children: React.ReactNode }) => <View testID="et-avatar">{children}</View>;
  return { EtAvatar: Object.assign(Root, { Badge }) };
});

const user = {
  avatar: {
    source: 'https://example.com/avatar.jpg',
    size: 'medium' as const,
    alt: 'Robert Steven',
  },
  title: 'Robert Steven',
  subtitle: '@reobertsteven',
};

const hero = { uri: 'https://example.com/top-trader-hero.jpg' };

describe('EtTopTraderCard', () => {
  beforeEach(() => {
    mockEtMediaCard.mockClear();
    mockContent.mockClear();
    mockFooter.mockClear();
  });

  it('renders MediaCard with large image + content stack + user/rates footer', () => {
    render(
      <EtTopTraderCard
        user={user}
        backgroundImage={hero}
        title="Global Markets Investor"
        description="Long-term, diversified strategy."
        price={204.13}
        changePercent={0.0005}
        change={0.09}
        testID="top-trader"
      />,
    );

    expect(screen.getByTestId('top-trader')).toBeTruthy();
    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'large',
        variant: 'standard',
        backgroundImage: hero,
        testID: 'top-trader',
      }),
    );
    expect(mockContent).toHaveBeenCalledWith(
      expect.objectContaining({
        blur: true,
        title: 'Global Markets Investor',
        description: 'Long-term, diversified strategy.',
      }),
    );
    expect(mockContent.mock.calls[0][0].eyebrow).toBeUndefined();
    expect(mockFooter).toHaveBeenCalledWith(expect.objectContaining({ overlay: 'media' }));
    expect(screen.getByTestId('et-user-info')).toBeTruthy();
    expect(screen.getAllByText('Robert Steven').length).toBeGreaterThan(0);
    expect(screen.getAllByText('@reobertsteven').length).toBeGreaterThan(0);
    expect(screen.getByTestId('et-number')).toBeTruthy();
    expect(screen.getByTestId('et-price-change')).toBeTruthy();
    expect(screen.queryByText('Subtitle')).toBeNull();
  });

  it('renders trader badge on the avatar when provided', () => {
    const { Text } = require('react-native');
    render(
      <EtTopTraderCard
        user={user}
        badge={<Text testID="crown-badge">Pi</Text>}
        backgroundImage={hero}
        title="Global Markets Investor"
        price={204.13}
        changePercent={0.0005}
        testID="top-trader"
      />,
    );

    expect(screen.getByTestId('et-avatar-badge')).toBeTruthy();
    expect(screen.getByTestId('crown-badge')).toBeTruthy();
  });

  it('forwards onPress', () => {
    const onPress = jest.fn();
    render(
      <EtTopTraderCard
        user={user}
        backgroundImage={hero}
        title="Global Markets Investor"
        price={204.13}
        changePercent={0.0005}
        onPress={onPress}
        testID="top-trader"
      />,
    );

    fireEvent.press(screen.getByTestId('top-trader-footer-pressable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('formats the fallback accessibility label as a signed percentage', () => {
    render(
      <EtTopTraderCard
        user={user}
        backgroundImage={hero}
        title="Global Markets Investor"
        price={204.13}
        changePercent={0.0005}
        testID="top-trader"
      />,
    );

    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Robert Steven, Global Markets Investor, 204.13, +0.05%',
      }),
    );
  });

  it('formats a negative change percent in the accessibility label', () => {
    render(
      <EtTopTraderCard
        user={user}
        backgroundImage={hero}
        title="Global Markets Investor"
        price={204.13}
        changePercent={-0.0123}
        testID="top-trader"
      />,
    );

    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Robert Steven, Global Markets Investor, 204.13, -1.23%',
      }),
    );
  });
});
