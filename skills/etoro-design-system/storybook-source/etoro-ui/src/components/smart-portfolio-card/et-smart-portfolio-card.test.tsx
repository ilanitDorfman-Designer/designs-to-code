import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { EtSmartPortfolioCard } from './et-smart-portfolio-card';

const mockEtMediaCard = jest.fn(({ children, testID }: { children?: React.ReactNode; testID?: string }) => {
  const { View } = require('react-native');
  return <View testID={testID || 'et-media-card'}>{children}</View>;
});

const mockContent = jest.fn(
  ({ children, testID, blur, onPress }: { children?: React.ReactNode; testID?: string; blur?: boolean; onPress?: () => void }) => {
    const { View, Text, Pressable } = require('react-native');
    const body = (
      <>
        <Text testID="content-blur-prop">{String(blur)}</Text>
        {children}
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

const mockHeader = jest.fn(({ start, end, testID }: { start?: React.ReactNode; end?: React.ReactNode; testID?: string }) => {
  const { View } = require('react-native');
  return (
    <View testID={testID || 'header'}>
      {start}
      {end}
    </View>
  );
});

const mockBadge = jest.fn(({ children }: { children?: React.ReactNode }) => {
  const { Text } = require('react-native');
  return <Text testID="media-card-badge">{children}</Text>;
});

jest.mock('../media-card', () => {
  const Root = (props: object) => mockEtMediaCard(props);
  return {
    EtMediaCard: Object.assign(Root, {
      Content: (props: object) => mockContent(props),
      Header: (props: object) => mockHeader(props),
      Badge: (props: object) => mockBadge(props),
    }),
    useMediaCardContext: () => ({ foregroundColor: '#FFFFFF', isBright: false }),
  };
});

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      verdictPositive400Static: '#6EFF8B',
      verdictNegative400Static: '#FF665E',
    },
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
  const Value = ({ children }: { children?: React.ReactNode }) => <Text testID="et-number-value">{children}</Text>;
  const Root = ({ children, value }: { children?: React.ReactNode; value?: number }) => (
    <View testID="et-number">
      <Text testID="et-number-raw">{String(value)}</Text>
      {children}
    </View>
  );
  return { EtNumber: Object.assign(Root, { Value }) };
});

jest.mock('../data-display/line-chart/et-line-chart', () => ({
  EtLineChart: ({ testID }: { testID?: string }) => {
    const { View } = require('react-native');
    return <View testID={testID || 'et-line-chart'} />;
  },
}));

jest.mock('react-native-reanimated', () => ({
  useSharedValue: (v: number) => ({ value: v }),
}));

const hero = { uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=654&h=754&fit=crop' };
const chartData = [
  { timestamp: '2024-01-01T00:00:00Z', equity: 1 },
  { timestamp: '2024-01-02T00:00:00Z', equity: 1.1 },
  { timestamp: '2024-01-03T00:00:00Z', equity: 1.1551 },
];

describe('EtSmartPortfolioCard', () => {
  beforeEach(() => {
    mockEtMediaCard.mockClear();
    mockContent.mockClear();
    mockHeader.mockClear();
    mockBadge.mockClear();
  });

  it('renders MediaCard large + custom content stack with gain and period', () => {
    render(
      <EtSmartPortfolioCard
        backgroundImage={hero}
        title="Chip-Tech"
        changePercent={0.1551}
        periodLabel="Last 24 hours"
        description="Tesla (TSLA) is experiencing a surge in investor interest"
        chartData={chartData}
        testID="smart-portfolio"
      />,
    );

    expect(screen.getByTestId('smart-portfolio')).toBeTruthy();
    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'large',
        variant: 'standard',
        backgroundImage: hero,
        testID: 'smart-portfolio',
      }),
    );
    expect(mockContent).toHaveBeenCalledWith(expect.objectContaining({ blur: true }));
    expect(screen.getByText('Chip-Tech')).toBeTruthy();
    expect(screen.getByText('Last 24 hours')).toBeTruthy();
    expect(screen.getByText('Tesla (TSLA) is experiencing a surge in investor interest')).toBeTruthy();
    expect(screen.getByTestId('et-number-raw')).toHaveTextContent('0.1551');
    expect(screen.getByTestId('et-line-chart')).toBeTruthy();
    expect(screen.queryByTestId('smart-portfolio-header')).toBeNull();
  });

  it('renders reusable header badge + end action', () => {
    const { Text } = require('react-native');
    render(
      <EtSmartPortfolioCard
        backgroundImage={hero}
        label="Smart Portfolio"
        headerEnd={<Text testID="header-end">★</Text>}
        title="Chip-Tech"
        changePercent={0.1551}
        periodLabel="Last 24 hours"
        testID="smart-portfolio"
      />,
    );

    expect(screen.getByTestId('smart-portfolio-header')).toBeTruthy();
    expect(mockHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        end: expect.anything(),
      }),
    );
    expect(screen.getByTestId('media-card-badge')).toHaveTextContent('Smart Portfolio');
    expect(screen.getByTestId('header-end')).toBeTruthy();
  });

  it('formats the fallback accessibility label as a signed percentage', () => {
    render(
      <EtSmartPortfolioCard backgroundImage={hero} title="Chip-Tech" changePercent={0.1551} periodLabel="Last 24 hours" testID="smart-portfolio" />,
    );

    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Chip-Tech, +15.51%, Last 24 hours',
      }),
    );
  });

  it('hides sparkline when chartData is empty and forwards onPress / backgroundVideo', () => {
    const onPress = jest.fn();
    render(
      <EtSmartPortfolioCard
        backgroundVideo="https://etoro-cdn.etorostatic.com/videos/demo.mp4"
        title="Chip-Tech"
        changePercent={-0.02}
        periodLabel="Last week"
        chartData={[]}
        onPress={onPress}
        testID="smart-portfolio"
      />,
    );

    expect(mockEtMediaCard).toHaveBeenCalledWith(
      expect.objectContaining({
        backgroundVideo: 'https://etoro-cdn.etorostatic.com/videos/demo.mp4',
      }),
    );
    expect(screen.queryByTestId('et-line-chart')).toBeNull();
    fireEvent.press(screen.getByTestId('smart-portfolio-content-pressable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
