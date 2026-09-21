import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { EtMediaCard } from './et-media-card';
import { MEDIA_CARD_SIZES } from './utils';

jest.mock('../../foundations/text', () => ({
  EtText: ({ children, testID, style, ...props }: { children: React.ReactNode; testID?: string; style?: object }) => {
    const { Text: RNText } = require('react-native');
    return (
      <RNText testID={testID} style={style} {...props}>
        {children}
      </RNText>
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
      bgDarkSurface: '#333333',
      carbonStatic050: '#FFFFFF',
      carbonStatic900: '#1B1E21',
      dividerQuinary: '#E5E5E5',
      bgTransparentPrimaryBright: '#FFFFFF25',
      bgGreyTransparentSecondary: '#CCCCCC30',
    },
    isDarkMode: false,
  }),
}));

jest.mock('expo-image', () => ({
  Image: ({ testID, style, ...props }: { testID?: string; style?: object }) => {
    const { View } = require('react-native');
    return <View testID={testID || 'expo-image'} style={style} {...props} />;
  },
}));

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: (props: object) => <View testID="BlurView" {...props} /> };
});

jest.mock('@react-native-masked-view/masked-view', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, maskElement, ...props }: { children?: React.ReactNode; maskElement?: React.ReactNode }) => (
      <View testID="masked-view" {...props}>
        {maskElement}
        {children}
      </View>
    ),
  };
});

function flattenStyle(style: unknown) {
  return Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
}

describe('EtMediaCard', () => {
  describe('sizes', () => {
    it.each([
      ['small', MEDIA_CARD_SIZES.small],
      ['medium', MEDIA_CARD_SIZES.medium],
      ['large', MEDIA_CARD_SIZES.large],
    ] as const)('applies %s dimensions', (size, dimensions) => {
      render(
        <EtMediaCard size={size} testID="card">
          <EtMediaCard.Title>100</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('card').props.style)).toEqual(
        expect.objectContaining({ width: dimensions.width, height: dimensions.height }),
      );
    });

    it('lets consumers override the preset width / height', () => {
      render(
        <EtMediaCard size="medium" width="100%" height={260} testID="card">
          <EtMediaCard.Title>100</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('card').props.style)).toEqual(expect.objectContaining({ width: '100%', height: 260 }));
    });
  });

  describe('card Overlay (Figma)', () => {
    it('is off by default', () => {
      render(
        <EtMediaCard size="medium" backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="card">
          <EtMediaCard.Content>Body</EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(screen.queryByTestId('card-overlay')).toBeNull();
    });

    it('renders the full-surface gloss overlay when overlay is enabled', () => {
      render(
        <EtMediaCard size="medium" overlay backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="card">
          <EtMediaCard.Content>Body</EtMediaCard.Content>
        </EtMediaCard>,
      );

      const overlay = screen.getByTestId('card-overlay');
      expect(overlay).toBeTruthy();
      expect(overlay.props.colors).toEqual(['rgba(255, 255, 255, 0.75)', 'rgba(44, 44, 44, 0)']);
      // Jest/RN default platform is iOS — mixBlendMode is applied when supported.
      expect(flattenStyle(overlay.props.style)).toEqual(expect.objectContaining({ mixBlendMode: 'overlay' }));
    });

    it('omits mixBlendMode on Android API 28', () => {
      const { Platform } = require('react-native');
      const originalOS = Platform.OS;
      const originalVersion = Platform.Version;
      Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
      Object.defineProperty(Platform, 'Version', { configurable: true, value: 28 });

      try {
        render(
          <EtMediaCard size="medium" overlay backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="card">
            <EtMediaCard.Content>Body</EtMediaCard.Content>
          </EtMediaCard>,
        );

        const overlay = screen.getByTestId('card-overlay');
        expect(flattenStyle(overlay.props.style).mixBlendMode).toBeUndefined();
      } finally {
        Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOS });
        Object.defineProperty(Platform, 'Version', { configurable: true, value: originalVersion });
      }
    });
  });

  describe('small asset card', () => {
    it('renders logo, title, and subtitle', () => {
      render(
        <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914" testID="small-card">
          <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.png' }} testID="logo" />
          <EtMediaCard.Title testID="title">186.79</EtMediaCard.Title>
          <EtMediaCard.Subtitle testID="subtitle">▲ 4.35%</EtMediaCard.Subtitle>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('small-card')).toBeTruthy();
      expect(screen.getByTestId('logo')).toBeTruthy();
      expect(screen.getByTestId('title')).toHaveTextContent('186.79');
      expect(screen.getByTestId('subtitle')).toHaveTextContent('▲ 4.35%');
    });

    it('keeps white text on a dark brand fill (standard)', () => {
      render(
        <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914" testID="dark-fill">
          <EtMediaCard.Title testID="title">186.79</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('title').props.style)).toEqual(expect.objectContaining({ color: '#FFFFFF' }));
    });

    it('flips to dark text on a light brand fill so it stays legible (standard)', () => {
      render(
        <EtMediaCard size="small" variant="standard" backgroundColor="#F5F5F5" testID="light-fill">
          <EtMediaCard.Title testID="title">186.79</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('title').props.style)).toEqual(expect.objectContaining({ color: '#1B1E21' }));
    });

    it('keeps white text on a near-dark charcoal brand fill (standard)', () => {
      render(
        <EtMediaCard size="small" variant="standard" backgroundColor="#1B1E21" testID="charcoal-fill">
          <EtMediaCard.Title testID="title">186.79</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('title').props.style)).toEqual(expect.objectContaining({ color: '#FFFFFF' }));
    });
  });

  describe('header badge (EtMediaCard.Badge)', () => {
    it('uses a translucent grey fill on a bright surface so it stays noticeable', () => {
      render(
        <EtMediaCard size="medium" variant="bright" testID="bright">
          <EtMediaCard.Header start={<EtMediaCard.Badge testID="badge">Label</EtMediaCard.Badge>} />
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('badge').props.style)).toEqual(expect.objectContaining({ backgroundColor: '#CCCCCC30' }));
    });

    it('uses a translucent white fill on a dark / brand surface', () => {
      render(
        <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914" testID="dark">
          <EtMediaCard.Header start={<EtMediaCard.Badge testID="badge">Label</EtMediaCard.Badge>} />
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('badge').props.style)).toEqual(expect.objectContaining({ backgroundColor: '#FFFFFF25' }));
    });
  });

  describe('medium / large optional slots', () => {
    it('renders header, content, footer, and background logo', () => {
      render(
        <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914" testID="medium-card">
          <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.png' }} placement="background" testID="logo" />
          <EtMediaCard.Header testID="header">
            <Text>Label</Text>
          </EtMediaCard.Header>
          <EtMediaCard.Content testID="content">
            <Text>Body copy</Text>
          </EtMediaCard.Content>
          <EtMediaCard.Footer testID="footer">
            <Text>Footer</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('medium-card')).toBeTruthy();
      expect(screen.getByTestId('logo')).toBeTruthy();
      expect(screen.getByTestId('header')).toHaveTextContent('Label');
      expect(screen.getByTestId('content')).toHaveTextContent('Body copy');
      expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
      expect(screen.getByTestId('content-blur')).toBeTruthy();
    });

    it('applies X5 (20) header padding, X5/X4 content padding (20 20 16 20), and X5/X4 footer padding (Figma)', () => {
      render(
        <EtMediaCard size="medium" testID="padded">
          <EtMediaCard.Header testID="header">
            <Text>H</Text>
          </EtMediaCard.Header>
          <EtMediaCard.Content testID="content">
            <Text>C</Text>
          </EtMediaCard.Content>
          <EtMediaCard.Footer testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('padded-body').props.style)).toEqual(expect.objectContaining({ paddingTop: 20 }));
      expect(flattenStyle(screen.getByTestId('content-inner').props.style)).toEqual(
        expect.objectContaining({ paddingTop: 20, paddingRight: 20, paddingBottom: 16, paddingLeft: 20 }),
      );
      expect(flattenStyle(screen.getByTestId('footer-content').props.style)).toEqual(
        expect.objectContaining({ paddingVertical: 16, paddingHorizontal: 20 }),
      );
    });

    it('applies the footer glass blur and media overlay (Carbon 900 @ 0.15) by default', () => {
      render(
        <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914" testID="glass">
          <EtMediaCard.Footer testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('BlurView').props.intensity).toBe(30);
      expect(flattenStyle(screen.getByTestId('footer-overlay').props.style)).toEqual(
        expect.objectContaining({ backgroundColor: '#1B1E21', opacity: 0.15 }),
      );
    });

    it('defaults footer overlay to muted for bright / dark variants', () => {
      const { rerender } = render(
        <EtMediaCard size="medium" variant="bright" testID="glass">
          <EtMediaCard.Footer testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );
      expect(flattenStyle(screen.getByTestId('footer-overlay').props.style)).toEqual(
        expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
      );

      rerender(
        <EtMediaCard size="medium" variant="dark" testID="glass">
          <EtMediaCard.Footer testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );
      expect(flattenStyle(screen.getByTestId('footer-overlay').props.style)).toEqual(
        expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
      );
    });

    it('defaults footer overlay to muted for near-white standard fills', () => {
      render(
        <EtMediaCard size="medium" variant="standard" backgroundColor="#FFFFFF" testID="glass">
          <EtMediaCard.Footer testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('footer-overlay').props.style)).toEqual(
        expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
      );
      expect(screen.getByTestId('BlurView').props.tint).toBe('light');
    });

    it('blurs content by default when background image is set', () => {
      render(
        <EtMediaCard size="medium" backgroundImage={{ uri: 'https://example.com/hero.jpg' }}>
          <EtMediaCard.Content testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('content-blur').props.intensity).toBe(20);
    });

    it('blurs content by default when background logo is set', () => {
      render(
        <EtMediaCard size="medium">
          <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.svg' }} placement="background" />
          <EtMediaCard.Content testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('content-blur')).toBeTruthy();
    });

    it('allows disabling content blur', () => {
      render(
        <EtMediaCard size="medium" backgroundImage={{ uri: 'https://example.com/hero.jpg' }}>
          <EtMediaCard.Content blur={false} testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(screen.queryByTestId('content-blur')).toBeNull();
    });

    it('allows forcing content blur on solid fill', () => {
      render(
        <EtMediaCard size="medium" variant="bright">
          <EtMediaCard.Content blur testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('content-blur').props.intensity).toBe(20);
      expect(screen.getByTestId('content-blur').props.tint).toBe('light');
    });

    it('applies progressive frost on solid fills (blur + variant-tinted scrim)', () => {
      render(
        <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914">
          <EtMediaCard.Content testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('content-blur').props.intensity).toBe(20);
      // Standard/dark: progressive white tint @ 8% (mask uses white alpha stops).
      expect(screen.getByTestId('content-scrim').props.colors).toEqual(['transparent', 'rgba(255, 255, 255, 0.08)']);
      expect(screen.getByTestId('content-mask').props.colors[0]).toBe('rgba(255,255,255,0)');
      expect(screen.getByTestId('content-mask').props.colors.at(-1)).toBe('rgba(255,255,255,1)');
    });

    it('uses progressive frost darker at the bottom on bright content', () => {
      render(
        <EtMediaCard size="medium" variant="bright">
          <EtMediaCard.Content testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      // Bright: progressive Carbon 900 tint @ 8% (mask uses black alpha stops).
      expect(screen.getByTestId('content-scrim').props.colors).toEqual(['transparent', 'rgba(27, 30, 33, 0.08)']);
      expect(screen.getByTestId('content-mask').props.colors[0]).toBe('rgba(0,0,0,0)');
      expect(screen.getByTestId('content-mask').props.colors.at(-1)).toBe('rgba(0,0,0,1)');
      expect(screen.getByTestId('content-blur').props.tint).toBe('light');
      expect(screen.getByTestId('content-blur').props.intensity).toBe(20);
    });

    it('pulls progressive frost above the content top over the background logo', () => {
      render(
        <EtMediaCard size="medium">
          <EtMediaCard.Logo source={{ uri: 'https://example.com/logo.svg' }} placement="background" />
          <EtMediaCard.Content testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      // Medium logo is 80px; frost pulls up 40px so the lower half of the logo is frosted.
      expect(flattenStyle(screen.getByTestId('masked-view').props.style).top).toBe(-40);
    });

    it('applies Figma content min size (68) and hugs children on large cards', () => {
      render(
        <EtMediaCard size="large">
          <EtMediaCard.Content testID="content">
            <Text>Body</Text>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('content').props.style)).toEqual(expect.objectContaining({ minHeight: 68, minWidth: 68 }));
      // Large no longer force-fills the body — height follows content.
      expect(flattenStyle(screen.getByTestId('content').props.style).flex).toBeUndefined();
      expect(flattenStyle(screen.getByTestId('masked-view').props.style).top).toBe(-48);
    });

    it('renders structured eyebrow + title + description stack', () => {
      render(
        <EtMediaCard size="large" backgroundImage={{ uri: 'https://example.com/hero.jpg' }}>
          <EtMediaCard.Content testID="content" eyebrow="Top Trader" title="Global Markets Investor" description="Long-term diversified strategy." />
        </EtMediaCard>,
      );

      expect(screen.getByText('Top Trader')).toBeTruthy();
      expect(screen.getByText('Global Markets Investor')).toBeTruthy();
      expect(screen.getByText('Long-term diversified strategy.')).toBeTruthy();
      expect(screen.getByTestId('content-blur')).toBeTruthy();
    });

    it('applies muted overlay (Carbon 500 @ 0.1)', () => {
      render(
        <EtMediaCard size="medium">
          <EtMediaCard.Footer overlay="muted" testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('footer-overlay').props.style)).toEqual(
        expect.objectContaining({ backgroundColor: '#999999', opacity: 0.1 }),
      );
    });

    it('allows overlayColor / overlayOpacity overrides', () => {
      render(
        <EtMediaCard size="medium">
          <EtMediaCard.Footer overlayColor="#FF0000" overlayOpacity={0.1} testID="footer">
            <Text>F</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('footer-overlay').props.style)).toEqual(
        expect.objectContaining({ backgroundColor: '#FF0000', opacity: 0.1 }),
      );
    });

    it('renders with only footer (all other slots omitted)', () => {
      render(
        <EtMediaCard size="large" testID="large-card">
          <EtMediaCard.Footer testID="footer">
            <Text>Only footer</Text>
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('large-card')).toBeTruthy();
      expect(screen.getByTestId('footer')).toHaveTextContent('Only footer');
      expect(screen.queryByTestId('header')).toBeNull();
    });
  });

  describe('variants', () => {
    it('applies bright border', () => {
      render(
        <EtMediaCard size="small" variant="bright" testID="bright-card">
          <EtMediaCard.Title>1</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(flattenStyle(screen.getByTestId('bright-card-surface').props.style).borderWidth).toBeGreaterThan(0);
    });
  });

  describe('media backgrounds', () => {
    it('renders background image when provided', () => {
      render(
        <EtMediaCard size="medium" backgroundImage={{ uri: 'https://example.com/hero.jpg' }} testID="image-card">
          <EtMediaCard.Title>1</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('expo-image')).toBeTruthy();
    });

    it('renders background video when provided (takes precedence over image)', () => {
      render(
        <EtMediaCard
          size="large"
          backgroundImage={{ uri: 'https://example.com/hero.jpg' }}
          backgroundVideo="https://example.com/clip.mp4"
          testID="video-card"
        >
          <EtMediaCard.Title>1</EtMediaCard.Title>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('media-card-background-video')).toBeTruthy();
      expect(screen.queryByTestId('expo-image')).toBeNull();
    });
  });

  describe('interaction', () => {
    it('calls content onPress when provided', () => {
      const onPress = jest.fn();
      render(
        <EtMediaCard size="small" testID="pressable">
          <EtMediaCard.Content onPress={onPress} accessibilityLabel="Asset" testID="pressable-content">
            <EtMediaCard.Title>1</EtMediaCard.Title>
          </EtMediaCard.Content>
        </EtMediaCard>,
      );

      fireEvent.press(screen.getByTestId('pressable-content-pressable'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls footer onPress when provided', () => {
      const onPress = jest.fn();
      render(
        <EtMediaCard size="large" testID="pressable">
          <EtMediaCard.Footer onPress={onPress} accessibilityLabel="Footer" testID="pressable-footer">
            Footer
          </EtMediaCard.Footer>
        </EtMediaCard>,
      );

      fireEvent.press(screen.getByTestId('pressable-footer-pressable'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not group a labeled root as a single accessible element', () => {
      render(
        <EtMediaCard size="medium" accessibilityLabel="Card" testID="labeled">
          <EtMediaCard.Content title="Body" />
        </EtMediaCard>,
      );

      expect(screen.getByTestId('labeled').props.accessible).not.toBe(true);
      expect(screen.getByTestId('labeled').props.accessibilityLabel).toBe('Card');
    });
  });

  describe('compound slots', () => {
    it('resolves slots wrapped in a Fragment', () => {
      render(
        <EtMediaCard size="medium" testID="card">
          <>
            <EtMediaCard.Header testID="header">
              <EtMediaCard.Badge>Label</EtMediaCard.Badge>
            </EtMediaCard.Header>
            <EtMediaCard.Content testID="content">
              <Text>Body</Text>
            </EtMediaCard.Content>
            <EtMediaCard.Footer testID="footer">
              <Text>Footer</Text>
            </EtMediaCard.Footer>
          </>
        </EtMediaCard>,
      );

      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
      expect(screen.getByText('Body')).toBeTruthy();
      expect(screen.getByTestId('footer')).toBeTruthy();
      expect(screen.getByText('Footer')).toBeTruthy();
    });

    it('resolves slots wrapped in nested Fragments', () => {
      render(
        <EtMediaCard size="medium">
          {/* Nested Fragments are the scenario under test. */}
          {/* eslint-disable react/jsx-no-useless-fragment */}
          <>
            <>
              <EtMediaCard.Content testID="nested-content">
                <Text>Nested</Text>
              </EtMediaCard.Content>
            </>
          </>
          {/* eslint-enable react/jsx-no-useless-fragment */}
        </EtMediaCard>,
      );

      expect(screen.getByTestId('nested-content')).toBeTruthy();
      expect(screen.getByText('Nested')).toBeTruthy();
    });
  });

  describe('compound export', () => {
    it('exposes all subcomponents', () => {
      expect(EtMediaCard.Header).toBeDefined();
      expect(EtMediaCard.Badge).toBeDefined();
      expect(EtMediaCard.Content).toBeDefined();
      expect(EtMediaCard.Footer).toBeDefined();
      expect(EtMediaCard.Logo).toBeDefined();
      expect(EtMediaCard.Title).toBeDefined();
      expect(EtMediaCard.Subtitle).toBeDefined();
    });
  });
});
