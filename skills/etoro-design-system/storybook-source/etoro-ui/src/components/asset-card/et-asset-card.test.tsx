import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import type { EtAssetCardAsset } from './api';
import { EtAssetCard } from './et-asset-card';

jest.mock('../../foundations/text', () => ({
  EtText: ({ children, testID, ...props }: { children: React.ReactNode; testID?: string }) => {
    const { Text } = require('react-native');
    return (
      <Text testID={testID} {...props}>
        {children}
      </Text>
    );
  },
}));

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textBright: '#FFFFFF',
      textPrimaryNeutral: '#1B1E21',
      bgNeutralPrimary: '#FFFFFF',
      bgNeutralSecondary: '#F2F3F7',
      bgTransparentPrimaryBright: 'rgba(255,255,255,0.25)',
      bgDarkSurface: '#333333',
      carbonStatic050: '#FFFFFF',
      carbonStatic900: '#1B1E21',
      dividerQuinary: '#E5E5E5',
    },
    isDarkMode: false,
  }),
}));

jest.mock('expo-image', () => ({
  Image: ({ testID, ...props }: { testID?: string }) => {
    const { View } = require('react-native');
    return <View testID={testID || 'expo-image'} {...props} />;
  },
}));

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: (props: object) => <View testID="BlurView" {...props} /> };
});

jest.mock('../data-display/number', () => {
  const { Text, View } = require('react-native');
  const Value = ({
    children,
    testID,
    ...props
  }: {
    children?: React.ReactNode;
    testID?: string;
    shrinkToFit?: boolean;
    minimumFontScale?: number;
    numberOfLines?: number;
  }) => (
    <Text testID={testID || 'et-number-value'} {...props}>
      {children ?? 'num'}
    </Text>
  );
  const Arrow = () => <Text testID="arrow">▲</Text>;
  const Root = ({ children, value, testID }: { children: React.ReactNode; value: number; testID?: string }) => (
    <View testID={testID || `et-number-${value}`}>{children}</View>
  );
  return { EtNumber: Object.assign(Root, { Value, Arrow }) };
});

jest.mock('../data-display/price', () => {
  const { View, Text } = require('react-native');
  const Change = () => <Text testID="et-price-change">rates</Text>;
  const Value = () => <Text testID="et-price-value">price</Text>;
  const Root = ({ children, testID }: { children: React.ReactNode; testID?: string }) => <View testID={testID || 'et-price'}>{children}</View>;
  return { EtPrice: Object.assign(Root, { Value, Change }) };
});

jest.mock('../data-display/asset-info', () => {
  const { View } = require('react-native');
  const Avatar = () => <View testID="et-asset-info-avatar" />;
  const Title = ({ children }: { children?: React.ReactNode }) => <View testID="et-asset-info-title">{children}</View>;
  const Subtitle = ({ children }: { children?: React.ReactNode }) => <View testID="et-asset-info-subtitle">{children}</View>;
  const Root = ({ children, testID }: { children: React.ReactNode; testID?: string }) => <View testID={testID || 'et-asset-info'}>{children}</View>;
  return { EtAssetInfo: Object.assign(Root, { Avatar, Title, Subtitle }) };
});

jest.mock('../status/badge', () => {
  const { Text, View } = require('react-native');
  const Label = ({ children }: { children: React.ReactNode }) => <Text testID="et-badge-label">{children}</Text>;
  const Root = ({ children, testID }: { children: React.ReactNode; testID?: string }) => <View testID={testID || 'et-badge'}>{children}</View>;
  return { EtBadge: Object.assign(Root, { Label }) };
});

jest.mock('../social/avatar', () => {
  const { Text, View } = require('react-native');
  const Image = () => <View testID="et-avatar-image" />;
  const Fallback = ({ children }: { children?: React.ReactNode }) => <Text testID="et-avatar-fallback">{children}</Text>;
  const Root = ({ children, accessibilityLabel }: { children?: React.ReactNode; accessibilityLabel?: string }) => (
    <View testID="et-avatar" accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
  return { EtAvatar: Object.assign(Root, { Image, Fallback }) };
});

const sampleAsset: EtAssetCardAsset = {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg',
  price: 186.79,
  changePercent: 0.0435,
  currency: 'USD',
};

const flattenStyle = (style: unknown) => (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style);

describe('EtAssetCard', () => {
  it('renders small card with logo, price, and change', () => {
    render(<EtAssetCard asset={sampleAsset} testID="asset-card" />);

    expect(screen.getByTestId('asset-card')).toBeTruthy();
    expect(screen.getByTestId('et-number-186.79')).toBeTruthy();
    expect(screen.getByTestId('et-number-0.0435')).toBeTruthy();
    expect(screen.getByTestId('arrow')).toBeTruthy();
  });

  it('shrinks the small-card price to one line when digits overflow', () => {
    render(<EtAssetCard asset={{ ...sampleAsset, price: 1234567.89 }} testID="asset-card" />);

    const priceValues = screen.getAllByTestId('et-number-value');
    const price = priceValues[0];
    expect(price.props.numberOfLines).toBe(1);
    expect(price.props.shrinkToFit).toBe(true);
    expect(price.props.minimumFontScale).toBe(0.65);
  });

  it('renders medium card with label, description, and footer symbol', () => {
    render(<EtAssetCard size="medium" asset={sampleAsset} label="Trending Stock" description="Sales slump in early 2026." testID="medium-asset" />);

    expect(screen.getByTestId('medium-asset')).toBeTruthy();
    expect(screen.getByTestId('et-badge')).toBeTruthy();
    expect(screen.getByTestId('et-badge-label')).toHaveTextContent('Trending Stock');
    expect(screen.getByText('Sales slump in early 2026.')).toBeTruthy();
    expect(screen.getByText('TSLA')).toBeTruthy();
    expect(screen.getByText('Tesla Inc')).toBeTruthy();
    expect(screen.getByTestId('BlurView')).toBeTruthy();
    expect(screen.getByTestId('BlurView').props.intensity).toBe(30);
    expect(screen.getByTestId('medium-asset-content-blur').props.intensity).toBe(20);
    expect(screen.getByTestId('et-price-change')).toBeTruthy();
    expect(screen.getByTestId('et-asset-info')).toBeTruthy();
    expect(screen.queryByTestId('et-asset-info-avatar')).toBeNull();
  });

  it('renders headerEnd button at the end without a badge when label is omitted', () => {
    const { Text } = require('react-native');
    render(<EtAssetCard size="medium" asset={sampleAsset} headerEnd={<Text testID="header-btn">Close</Text>} testID="header-end-only" />);

    expect(screen.getByTestId('header-end-only-header')).toBeTruthy();
    expect(screen.getByTestId('header-btn')).toBeTruthy();
    expect(screen.queryByTestId('et-badge')).toBeNull();
  });

  it('renders in-content eyebrow + title stack without a header badge', () => {
    render(
      <EtAssetCard
        size="large"
        asset={sampleAsset}
        eyebrow="Trending Stock"
        title="Tesla experienced a significant sales slump in early 2026"
        description="Optional subtitle"
        testID="content-stack"
      />,
    );

    expect(screen.getByText('Trending Stock')).toBeTruthy();
    expect(screen.getByText('Tesla experienced a significant sales slump in early 2026')).toBeTruthy();
    expect(screen.getByText('Optional subtitle')).toBeTruthy();
    expect(screen.queryByTestId('et-badge')).toBeNull();
    expect(screen.queryByTestId('content-stack-header')).toBeNull();
  });

  it('renders EtBadge at start and headerEnd together', () => {
    const { Text } = require('react-native');
    render(<EtAssetCard size="medium" asset={sampleAsset} label="Label" headerEnd={<Text testID="header-btn">Action</Text>} testID="header-both" />);

    expect(screen.getByTestId('et-badge-label')).toHaveTextContent('Label');
    expect(screen.getByTestId('header-btn')).toBeTruthy();
  });

  it('renders logo inside footer when logoInFooter is set', () => {
    render(<EtAssetCard size="medium" logoInFooter asset={sampleAsset} testID="footer-logo" />);

    expect(screen.getByTestId('et-asset-info')).toBeTruthy();
    expect(screen.getByTestId('et-asset-info-avatar')).toBeTruthy();
    expect(screen.getByText('TSLA')).toBeTruthy();
    expect(screen.getByTestId('et-price-change')).toBeTruthy();
  });

  it('defaults logoInFooter on when a background image is set (and can be forced off)', () => {
    const { rerender } = render(
      <EtAssetCard size="medium" asset={sampleAsset} backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="auto" />,
    );
    expect(screen.getByTestId('et-asset-info-avatar')).toBeTruthy();

    rerender(
      <EtAssetCard size="medium" asset={sampleAsset} backgroundImage={{ uri: 'https://example.com/hero.jpg' }} logoInFooter={false} testID="auto" />,
    );
    expect(screen.queryByTestId('et-asset-info-avatar')).toBeNull();
  });

  it('enables the EtMediaCard full-surface Overlay gloss', () => {
    const { rerender } = render(<EtAssetCard size="medium" asset={sampleAsset} testID="asset" />);
    expect(screen.getByTestId('asset-overlay')).toBeTruthy();

    rerender(<EtAssetCard size="small" asset={sampleAsset} testID="asset" />);
    expect(screen.getByTestId('asset-overlay')).toBeTruthy();
  });

  it('picks the footer overlay by variant: media for standard, muted for dark / bright', () => {
    const { rerender } = render(<EtAssetCard size="medium" asset={sampleAsset} variant="standard" testID="std" />);
    expect(flattenStyle(screen.getByTestId('std-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#1B1E21', opacity: 0.15 }),
    );

    rerender(<EtAssetCard size="medium" asset={sampleAsset} variant="bright" testID="br" />);
    expect(flattenStyle(screen.getByTestId('br-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
    );

    rerender(<EtAssetCard size="medium" asset={sampleAsset} variant="dark" testID="dk" />);
    expect(flattenStyle(screen.getByTestId('dk-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
    );
  });

  it('keeps the variant-keyed footer scrim regardless of a background image fill', () => {
    const { rerender } = render(
      <EtAssetCard size="medium" asset={sampleAsset} variant="dark" backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="img" />,
    );
    expect(flattenStyle(screen.getByTestId('img-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
    );

    rerender(
      <EtAssetCard size="medium" asset={sampleAsset} variant="bright" backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="img" />,
    );
    expect(flattenStyle(screen.getByTestId('img-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
    );

    rerender(
      <EtAssetCard size="medium" asset={sampleAsset} variant="standard" backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="img" />,
    );
    expect(flattenStyle(screen.getByTestId('img-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#1B1E21', opacity: 0.15 }),
    );
  });

  it('allows explicit footerOverlay / footerOverlayColor / footerOverlayOpacity overrides', () => {
    const { rerender } = render(<EtAssetCard size="medium" asset={sampleAsset} variant="standard" footerOverlay="muted" testID="fo" />);
    expect(flattenStyle(screen.getByTestId('fo-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
    );

    rerender(<EtAssetCard size="medium" asset={sampleAsset} footerOverlayColor="#FF0000" footerOverlayOpacity={0.15} testID="fo" />);
    expect(flattenStyle(screen.getByTestId('fo-footer-overlay').props.style)).toEqual(
      expect.objectContaining({ backgroundColor: '#FF0000', opacity: 0.15 }),
    );
  });

  it('blurs content by default with background logo and allows contentBlur={false}', () => {
    const { rerender } = render(<EtAssetCard size="medium" asset={sampleAsset} description="Body" testID="cb" />);
    expect(screen.getByTestId('cb-content-blur').props.intensity).toBe(20);

    rerender(<EtAssetCard size="medium" asset={sampleAsset} description="Body" contentBlur={false} testID="cb" />);
    expect(screen.queryByTestId('cb-content-blur')).toBeNull();
  });

  it('uses asset.backgroundColor as card fill for variant="standard"', () => {
    const asset = { ...sampleAsset, backgroundColor: '#112233' };
    const { getByTestId } = render(<EtAssetCard asset={asset} variant="standard" testID="colored" />);
    const surface = getByTestId('colored-surface');
    const flat = flattenStyle(surface.props.style);
    expect(flat.backgroundColor).toBe('#112233');
  });

  it('extracts background color from logo CDN URL when backgroundColor omitted (standard)', () => {
    const { getByTestId } = render(<EtAssetCard asset={sampleAsset} testID="colored" />);
    const surface = getByTestId('colored-surface');
    const flat = flattenStyle(surface.props.style);
    expect(flat.backgroundColor).toBe('#CC2914');
  });

  it('does not apply asset brand color for bright / dark variants', () => {
    const asset = { ...sampleAsset, backgroundColor: '#112233' };
    const { getByTestId } = render(<EtAssetCard asset={asset} variant="bright" testID="bright" />);
    const surface = getByTestId('bright-surface');
    const flat = flattenStyle(surface.props.style);
    expect(flat.backgroundColor).toBe('#FFFFFF'); // carbonStatic050
  });

  it('uses bgDarkSurface for dark variant when no media fill', () => {
    const asset = { ...sampleAsset, backgroundColor: '#112233' };
    const { getByTestId } = render(<EtAssetCard asset={asset} variant="dark" testID="dark" />);
    const surface = getByTestId('dark-surface');
    const flat = flattenStyle(surface.props.style);
    expect(flat.backgroundColor).toBe('#333333'); // bgDarkSurface
  });

  it('calls onContentPress on small cards', () => {
    const onContentPress = jest.fn();
    render(<EtAssetCard asset={sampleAsset} onContentPress={onContentPress} testID="pressable" />);
    fireEvent.press(screen.getByTestId('pressable-content-pressable'));
    expect(onContentPress).toHaveBeenCalledTimes(1);
  });

  it('calls onFooterPress on medium cards', () => {
    const onFooterPress = jest.fn();
    render(<EtAssetCard asset={sampleAsset} size="medium" onFooterPress={onFooterPress} testID="pressable-medium" />);
    fireEvent.press(screen.getByTestId('pressable-medium-footer-pressable'));
    expect(onFooterPress).toHaveBeenCalledTimes(1);
  });

  it('maps deprecated onPress to content on small and footer on medium', () => {
    const onPressSmall = jest.fn();
    render(<EtAssetCard asset={sampleAsset} onPress={onPressSmall} testID="legacy-small" />);
    fireEvent.press(screen.getByTestId('legacy-small-content-pressable'));
    expect(onPressSmall).toHaveBeenCalledTimes(1);

    const onPressMedium = jest.fn();
    render(<EtAssetCard asset={sampleAsset} size="medium" onPress={onPressMedium} testID="legacy-medium" />);
    fireEvent.press(screen.getByTestId('legacy-medium-footer-pressable'));
    expect(onPressMedium).toHaveBeenCalledTimes(1);
  });

  it('builds a default accessibility label with formatted percent and currency', () => {
    render(<EtAssetCard asset={sampleAsset} onContentPress={jest.fn()} testID="a11y" />);
    expect(screen.getByTestId('a11y-content-pressable').props.accessibilityLabel).toBe('TSLA, 186.79 USD, +4.35%');
  });

  it('formats a negative change and omits currency when absent in the default label', () => {
    const asset: EtAssetCardAsset = { ...sampleAsset, currency: undefined, changePercent: -0.021 };
    render(<EtAssetCard asset={asset} onContentPress={jest.fn()} testID="a11y-neg" />);
    expect(screen.getByTestId('a11y-neg-content-pressable').props.accessibilityLabel).toBe('TSLA, 186.79, -2.10%');
  });

  it('exposes a non-pressable labeled card without grouping nested accessibility', () => {
    render(<EtAssetCard asset={sampleAsset} accessibilityLabel="Tesla card" testID="static" />);
    const root = screen.getByTestId('static');
    expect(root.props.accessible).not.toBe(true);
    expect(root.props.accessibilityLabel).toBe('Tesla card');
  });
});
