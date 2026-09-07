import { render } from '@testing-library/react-native';
import React from 'react';

import { EtCryptoCard } from './et-crypto-card';
import { extractColorFromUrl } from './utils/color-utils';

// Mock EtText to properly handle text children
jest.mock('etoro-ui/foundations/text', () => ({
  EtText: ({ children, testID, style, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text testID={testID} style={style} {...props}>
        {children}
      </Text>
    );
  },
}));

// Mock useEtoroTheme hook
jest.mock('etoro-ui/core', () => ({
  useEtoroTheme: () => ({
    colors: {
      textBright: '#FFFFFF',
    },
  }),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({
    children,
    testID,
    style,
    ...props
  }: {
    children: React.ReactNode;
    testID?: string;
    style?: object;
    colors?: string[];
    start?: object;
    end?: object;
  }) => {
    const { View } = require('react-native');
    return (
      <View testID={testID || 'linear-gradient'} style={style} {...props}>
        {children}
      </View>
    );
  },
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: ({ testID, style, ...props }: { testID?: string; style?: object; source?: { uri: string } }) => {
    const { View } = require('react-native');
    return <View testID={testID || 'expo-image'} style={style} {...props} />;
  },
}));

const mockCdnUrl = 'https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F0AF32_F7F7F7.svg';

describe('EtCryptoCard', () => {
  describe('Color Extraction Utility', () => {
    it('extracts color from valid CDN URL', () => {
      const result = extractColorFromUrl(mockCdnUrl);
      expect(result).toBe('#F0AF32');
    });

    it('extracts color from URL with different color', () => {
      const url = 'https://etoro-cdn.etorostatic.com/market-avatars/100001/100001_627EEA_FFFFFF.svg';
      const result = extractColorFromUrl(url);
      expect(result).toBe('#627EEA');
    });

    it('returns null for URL without color', () => {
      const url = 'https://example.com/logo.svg';
      const result = extractColorFromUrl(url);
      expect(result).toBeNull();
    });

    it('returns null for invalid hex color', () => {
      const url = 'https://etoro-cdn.etorostatic.com/100000_ZZZZZZ_FFFFFF.svg';
      const result = extractColorFromUrl(url);
      expect(result).toBeNull();
    });

    it('returns null for empty string', () => {
      const result = extractColorFromUrl('');
      expect(result).toBeNull();
    });

    it('returns null for null input', () => {
      const result = extractColorFromUrl(null as unknown as string);
      expect(result).toBeNull();
    });
  });

  describe('Component Rendering', () => {
    it('renders with all subcomponents using layout wrappers', () => {
      const { getByText } = render(
        <EtCryptoCard logoUrl={mockCdnUrl}>
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
        </EtCryptoCard>,
      );

      expect(getByText('BTC')).toBeTruthy();
      expect(getByText('Bitcoin')).toBeTruthy();
      expect(getByText('$42,150.23')).toBeTruthy();
      expect(getByText('0.5 BTC')).toBeTruthy();
    });

    it('renders with flexible layout (children rendered directly)', () => {
      const { getByText } = render(
        <EtCryptoCard logoUrl={mockCdnUrl}>
          <EtCryptoCard.Info>
            <EtCryptoCard.Symbol>ETH</EtCryptoCard.Symbol>
            <EtCryptoCard.Name>Ethereum</EtCryptoCard.Name>
          </EtCryptoCard.Info>
        </EtCryptoCard>,
      );

      expect(getByText('ETH')).toBeTruthy();
      expect(getByText('Ethereum')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <EtCryptoCard logoUrl={mockCdnUrl} testID="crypto-card">
          <EtCryptoCard.BottomSection>
            <EtCryptoCard.Info>
              <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
              <EtCryptoCard.Name>Bitcoin</EtCryptoCard.Name>
            </EtCryptoCard.Info>
          </EtCryptoCard.BottomSection>
        </EtCryptoCard>,
      );

      expect(getByTestId('crypto-card')).toBeTruthy();
    });

    it('uses backgroundColor override instead of URL extraction', () => {
      const { getByTestId } = render(
        <EtCryptoCard logoUrl="https://example.com/logo.png" backgroundColor="#3D9970" testID="crypto-card">
          <EtCryptoCard.BottomSection>
            <EtCryptoCard.Info>
              <EtCryptoCard.Symbol>ETC</EtCryptoCard.Symbol>
            </EtCryptoCard.Info>
          </EtCryptoCard.BottomSection>
        </EtCryptoCard>,
      );

      expect(getByTestId('crypto-card-surface').props.style.backgroundColor).toBe('#3D9970');
    });

    it('renders without pricing section', () => {
      const { getByText, queryByText } = render(
        <EtCryptoCard logoUrl={mockCdnUrl}>
          <EtCryptoCard.BottomSection>
            <EtCryptoCard.Info>
              <EtCryptoCard.Symbol>DOGE</EtCryptoCard.Symbol>
              <EtCryptoCard.Name>Dogecoin</EtCryptoCard.Name>
            </EtCryptoCard.Info>
          </EtCryptoCard.BottomSection>
        </EtCryptoCard>,
      );

      expect(getByText('DOGE')).toBeTruthy();
      expect(getByText('Dogecoin')).toBeTruthy();
      expect(queryByText(/\$\s*[\d,.]+/)).toBeNull();
    });

    it('renders without info section', () => {
      const { getByText } = render(
        <EtCryptoCard logoUrl={mockCdnUrl}>
          <EtCryptoCard.BottomSection>
            <EtCryptoCard.Pricing>
              <EtCryptoCard.Price>$100.00</EtCryptoCard.Price>
              <EtCryptoCard.Units>10 USDT</EtCryptoCard.Units>
            </EtCryptoCard.Pricing>
          </EtCryptoCard.BottomSection>
        </EtCryptoCard>,
      );

      expect(getByText('$100.00')).toBeTruthy();
      expect(getByText('10 USDT')).toBeTruthy();
    });

    it('allows custom elements between subcomponents', () => {
      const { getByText, getByTestId } = render(
        <EtCryptoCard logoUrl={mockCdnUrl}>
          <EtCryptoCard.LogoSection>
            <EtCryptoCard.Logo />
          </EtCryptoCard.LogoSection>
          <EtCryptoCard.BottomSection testID="bottom">
            <EtCryptoCard.Info>
              <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
            </EtCryptoCard.Info>
          </EtCryptoCard.BottomSection>
        </EtCryptoCard>,
      );

      expect(getByText('BTC')).toBeTruthy();
      expect(getByTestId('bottom')).toBeTruthy();
    });
  });

  describe('Compound Component Assembly', () => {
    // Layout subcomponents
    it('has LogoSection subcomponent', () => {
      expect(EtCryptoCard.LogoSection).toBeDefined();
    });

    it('has BottomSection subcomponent', () => {
      expect(EtCryptoCard.BottomSection).toBeDefined();
    });

    // Content subcomponents
    it('has Logo subcomponent', () => {
      expect(EtCryptoCard.Logo).toBeDefined();
    });

    it('has Info subcomponent', () => {
      expect(EtCryptoCard.Info).toBeDefined();
    });

    it('has Symbol subcomponent', () => {
      expect(EtCryptoCard.Symbol).toBeDefined();
    });

    it('has Name subcomponent', () => {
      expect(EtCryptoCard.Name).toBeDefined();
    });

    it('has Pricing subcomponent', () => {
      expect(EtCryptoCard.Pricing).toBeDefined();
    });

    it('has Price subcomponent', () => {
      expect(EtCryptoCard.Price).toBeDefined();
    });

    it('has Units subcomponent', () => {
      expect(EtCryptoCard.Units).toBeDefined();
    });
  });

  describe('Display Names', () => {
    it('has correct display name for root component', () => {
      expect(EtCryptoCard.displayName).toBe('EtCryptoCard');
    });

    // Layout subcomponents
    it('has correct display name for LogoSection', () => {
      expect(EtCryptoCard.LogoSection.displayName).toBe('EtCryptoCard.LogoSection');
    });

    it('has correct display name for BottomSection', () => {
      expect(EtCryptoCard.BottomSection.displayName).toBe('EtCryptoCard.BottomSection');
    });

    // Content subcomponents
    it('has correct display name for Logo', () => {
      expect(EtCryptoCard.Logo.displayName).toBe('EtCryptoCard.Logo');
    });

    it('has correct display name for Info', () => {
      expect(EtCryptoCard.Info.displayName).toBe('EtCryptoCard.Info');
    });

    it('has correct display name for Symbol', () => {
      expect(EtCryptoCard.Symbol.displayName).toBe('EtCryptoCard.Symbol');
    });

    it('has correct display name for Name', () => {
      expect(EtCryptoCard.Name.displayName).toBe('EtCryptoCard.Name');
    });

    it('has correct display name for Pricing', () => {
      expect(EtCryptoCard.Pricing.displayName).toBe('EtCryptoCard.Pricing');
    });

    it('has correct display name for Price', () => {
      expect(EtCryptoCard.Price.displayName).toBe('EtCryptoCard.Price');
    });

    it('has correct display name for Units', () => {
      expect(EtCryptoCard.Units.displayName).toBe('EtCryptoCard.Units');
    });
  });
});
