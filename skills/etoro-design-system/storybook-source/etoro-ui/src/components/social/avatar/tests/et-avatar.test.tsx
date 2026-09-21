import { act, render } from '@testing-library/react-native';
import { Image } from 'expo-image';
import React from 'react';
import { I18nManager, StyleSheet, Text, View } from 'react-native';

import { EtAvatar } from '../et-avatar';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style, ...props }: any) => {
    const { View } = require('react-native');
    return (
      <View testID="gradient-overlay" style={style} {...props}>
        {children}
      </View>
    );
  },
}));

// Mock useEtoroTheme
jest.mock('../../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      backgroundBase: '#FFFFFF',
      cardDefault: '#F5F5F5',
      carbon500: '#666666',
      verdictPositive600: '#00C853',
      verdictNegative600: '#E53935',
      carbonStatic900: '#1A1A1A',
    },
  })),
}));

describe('EtAvatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(getByTestId('avatar')).toBeTruthy();
    });

    it('renders with fallback', () => {
      const placeholder = 'JD';
      const { getByText } = render(
        <EtAvatar>
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Fallback>{placeholder}</EtAvatar.Fallback>
        </EtAvatar>,
      );

      expect(getByText('JD')).toBeTruthy();
    });
  });

  describe('Size Variations', () => {
    it.each(['small', 'medium', 'large'] as const)('renders correctly with size %s', (size) => {
      const { getByTestId } = render(
        <EtAvatar size={size} testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(getByTestId('avatar')).toBeTruthy();
    });
  });

  describe('Shape Variations', () => {
    it('renders with square shape (default)', () => {
      const { getByTestId } = render(
        <EtAvatar shape="square" testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(getByTestId('avatar')).toBeTruthy();
    });

    it('renders with circle shape', () => {
      const { getByTestId } = render(
        <EtAvatar shape="circle" testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(getByTestId('avatar')).toBeTruthy();
    });
  });

  describe('Variant Options', () => {
    it('renders without overlay for default variant', () => {
      const { queryByTestId } = render(
        <EtAvatar variant="default" testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(queryByTestId('gradient-overlay')).toBeNull();
    });

    it('renders without overlay for user variant', () => {
      const { queryByTestId } = render(
        <EtAvatar variant="user" testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(queryByTestId('gradient-overlay')).toBeNull();
    });

    it('renders with overlay for instrument variant', () => {
      const { getByTestId } = render(
        <EtAvatar variant="instrument" testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
        </EtAvatar>,
      );

      expect(getByTestId('gradient-overlay')).toBeTruthy();
    });

    it('renders with overlay for currency variant', () => {
      const { getByTestId, getByText } = render(
        <EtAvatar variant="currency" imageBackgroundColor="#00AEEF" testID="avatar">
          <EtAvatar.Currency>$</EtAvatar.Currency>
        </EtAvatar>,
      );

      expect(getByTestId('gradient-overlay')).toBeTruthy();
      expect(getByText('$')).toBeTruthy();
    });
  });

  describe('MarketOpen Component', () => {
    it('renders market-open dot at default position (bottomRight)', () => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.MarketOpen testID="market-open" />
        </EtAvatar>,
      );

      expect(getByTestId('avatar')).toBeTruthy();
      expect(getByTestId('market-open')).toBeTruthy();
    });

    it.each(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const)('renders market-open dot at %s position', (position) => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.MarketOpen position={position} testID="market-open" />
        </EtAvatar>,
      );

      expect(getByTestId('market-open')).toBeTruthy();
    });

    it('renders with status="closed" (red dot)', () => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.MarketOpen status="closed" testID="market-closed" />
        </EtAvatar>,
      );

      expect(getByTestId('market-closed')).toBeTruthy();
    });

    it('defaults to status="open" when status prop is omitted', () => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.MarketOpen testID="market-open" />
        </EtAvatar>,
      );

      expect(getByTestId('market-open')).toBeTruthy();
    });

    it('uses custom backgroundColor for the status dot ring', () => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.MarketOpen testID="market-open" backgroundColor="#442222" />
        </EtAvatar>,
      );

      expect(StyleSheet.flatten(getByTestId('market-open').props.style)).toEqual(expect.objectContaining({ backgroundColor: '#442222' }));
    });

    it('scales the market-open dot down for small avatars', () => {
      const { getByTestId } = render(
        <View>
          <EtAvatar size="small">
            <EtAvatar.MarketOpen testID="small-market-open" />
          </EtAvatar>
          <EtAvatar size="medium">
            <EtAvatar.MarketOpen testID="medium-market-open" />
          </EtAvatar>
        </View>,
      );

      const smallContainerStyle = StyleSheet.flatten(getByTestId('small-market-open').props.style);
      const smallDotStyle = StyleSheet.flatten(getByTestId('small-market-open').findByType(View).props.style);
      const mediumContainerStyle = StyleSheet.flatten(getByTestId('medium-market-open').props.style);
      const mediumDotStyle = StyleSheet.flatten(getByTestId('medium-market-open').findByType(View).props.style);

      expect(smallContainerStyle).toEqual(expect.objectContaining({ width: 10, height: 10, borderRadius: 5 }));
      expect(smallDotStyle).toEqual(expect.objectContaining({ width: 6, height: 6, borderRadius: 3 }));
      expect(mediumContainerStyle).toEqual(expect.objectContaining({ width: 14, height: 14, borderRadius: 7 }));
      expect(mediumDotStyle).toEqual(expect.objectContaining({ width: 8, height: 8, borderRadius: 4 }));
    });

    it('throws error when MarketOpen is used outside EtAvatar', () => {
      expect(() => {
        render(<EtAvatar.MarketOpen testID="market-open" />);
      }).toThrow('EtAvatar compound components must be used within an EtAvatar component');
    });
  });

  describe('Badge Component', () => {
    it('renders badge at default position (bottomRight)', () => {
      const { getByText } = render(
        <EtAvatar>
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge>
            <Text>!</Text>
          </EtAvatar.Badge>
        </EtAvatar>,
      );

      expect(getByText('!')).toBeTruthy();
    });

    it.each(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const)('renders badge at %s position', (position) => {
      const { getByText } = render(
        <EtAvatar>
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge position={position}>
            <Text>{position}</Text>
          </EtAvatar.Badge>
        </EtAvatar>,
      );

      expect(getByText(position)).toBeTruthy();
    });
  });

  describe('Avatar Group', () => {
    it('renders group container', () => {
      const { getByTestId } = render(
        <EtAvatar.Group testID="avatar-group">
          <EtAvatar size="small" shape="circle">
            <EtAvatar.Image src="https://example.com/avatar1.jpg" />
          </EtAvatar>
          <EtAvatar size="small" shape="circle">
            <EtAvatar.Image src="https://example.com/avatar2.jpg" />
          </EtAvatar>
        </EtAvatar.Group>,
      );

      expect(getByTestId('avatar-group')).toBeTruthy();
    });

    it('renders group with count', () => {
      const count = '+3';
      const { getByText } = render(
        <EtAvatar.Group>
          <EtAvatar size="small" shape="circle">
            <EtAvatar.Image src="https://example.com/avatar1.jpg" />
          </EtAvatar>
          <EtAvatar.GroupCount>{count}</EtAvatar.GroupCount>
        </EtAvatar.Group>,
      );

      expect(getByText(count)).toBeTruthy();
    });
  });

  describe('Context Error Handling', () => {
    it('throws error when Image is used outside EtAvatar', () => {
      expect(() => {
        render(<EtAvatar.Image src="https://example.com/avatar.jpg" />);
      }).toThrow('EtAvatar compound components must be used within an EtAvatar component');
    });

    it('throws error when Fallback is used outside EtAvatar', () => {
      const placeholder = 'JD';
      expect(() => {
        render(<EtAvatar.Fallback>{placeholder}</EtAvatar.Fallback>);
      }).toThrow('EtAvatar compound components must be used within an EtAvatar component');
    });
  });

  describe('Fallback Behavior', () => {
    it('renders fallback with custom content', () => {
      const { getByText } = render(
        <EtAvatar>
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Fallback>
            <View>
              <Text>Custom Fallback</Text>
            </View>
          </EtAvatar.Fallback>
        </EtAvatar>,
      );

      expect(getByText('Custom Fallback')).toBeTruthy();
    });
  });

  describe('Badge Icon Mode', () => {
    const StarIcon = () => <View testID="star-icon" />;

    it('renders icon inside badge when icon prop is provided', () => {
      const { getByTestId } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge testID="icon-badge" icon={<StarIcon />} />
        </EtAvatar>,
      );

      expect(getByTestId('icon-badge')).toBeTruthy();
      expect(getByTestId('star-icon')).toBeTruthy();
    });

    it('ignores children when icon prop is provided', () => {
      const { getByTestId, queryByText } = render(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge testID="icon-badge" icon={<StarIcon />}>
            <Text>should not render</Text>
          </EtAvatar.Badge>
        </EtAvatar>,
      );

      expect(getByTestId('star-icon')).toBeTruthy();
      expect(queryByText('should not render')).toBeNull();
    });

    it('renders children when icon prop is not provided (generic mode)', () => {
      const { getByText, queryByTestId } = render(
        <EtAvatar>
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge>
            <Text>badge content</Text>
          </EtAvatar.Badge>
        </EtAvatar>,
      );

      expect(getByText('badge content')).toBeTruthy();
      expect(queryByTestId('star-icon')).toBeNull();
    });
  });

  describe('Badge RTL Awareness', () => {
    const originalIsRTL = I18nManager.isRTL;
    const StarIcon = () => <View testID="star-icon" />;

    afterEach(() => {
      I18nManager.isRTL = originalIsRTL;
    });

    it('does not flip position for generic badge (children mode) in RTL', () => {
      I18nManager.isRTL = true;

      const { getByText } = render(
        <EtAvatar size="large" shape="square">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge position="bottomRight" testID="generic-badge">
            <Text>badge</Text>
          </EtAvatar.Badge>
        </EtAvatar>,
      );

      expect(getByText('badge')).toBeTruthy();
    });

    it('flips icon badge position in RTL', () => {
      I18nManager.isRTL = true;

      const { getByTestId } = render(
        <EtAvatar size="large" shape="square">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge testID="icon-badge" icon={<StarIcon />} position="bottomRight" />
        </EtAvatar>,
      );

      const badge = getByTestId('icon-badge');
      const flatStyle = Object.assign({}, ...[badge.props.style].flat(Infinity).filter(Boolean));
      expect(flatStyle.left).toBeDefined();
      expect(flatStyle.right).toBeUndefined();
    });

    it('does not flip icon badge position in LTR', () => {
      I18nManager.isRTL = false;

      const { getByTestId } = render(
        <EtAvatar size="large" shape="square">
          <EtAvatar.Image src="https://example.com/avatar.jpg" />
          <EtAvatar.Badge testID="icon-badge" icon={<StarIcon />} position="bottomRight" />
        </EtAvatar>,
      );

      const badge = getByTestId('icon-badge');
      const flatStyle = Object.assign({}, ...[badge.props.style].flat(Infinity).filter(Boolean));
      expect(flatStyle.right).toBeDefined();
      expect(flatStyle.left).toBeUndefined();
    });
  });

  describe('Recycling (src change / Image removal)', () => {
    const renderAvatar = (src: string | undefined, withImage = true) =>
      render(
        <EtAvatar testID="avatar">
          {withImage ? <EtAvatar.Image src={src} /> : null}
          <EtAvatar.Fallback>
            <Text>JD</Text>
          </EtAvatar.Fallback>
        </EtAvatar>,
      );

    it('GIVEN a loaded image WHEN src changes THEN the fallback shows again until the new image loads', () => {
      const { UNSAFE_getByType, queryByText, rerender } = renderAvatar('https://example.com/a.png');
      expect(queryByText('JD')).toBeTruthy();

      act(() => {
        UNSAFE_getByType(Image).props.onLoad({});
      });
      expect(queryByText('JD')).toBeNull();

      rerender(
        <EtAvatar testID="avatar">
          <EtAvatar.Image src="https://example.com/b.png" />
          <EtAvatar.Fallback>
            <Text>JD</Text>
          </EtAvatar.Fallback>
        </EtAvatar>,
      );

      // The rebound item's image has not loaded yet: initials must be back, not the old bitmap.
      expect(queryByText('JD')).toBeTruthy();
      expect(UNSAFE_getByType(Image).props.recyclingKey).toBe('https://example.com/b.png');
    });

    it('GIVEN a loaded image WHEN the Image child is removed THEN the fallback shows', () => {
      const { UNSAFE_getByType, queryByText, rerender } = renderAvatar('https://example.com/a.png');
      act(() => {
        UNSAFE_getByType(Image).props.onLoad({});
      });
      expect(queryByText('JD')).toBeNull();

      rerender(
        <EtAvatar testID="avatar">
          <EtAvatar.Fallback>
            <Text>JD</Text>
          </EtAvatar.Fallback>
        </EtAvatar>,
      );

      expect(queryByText('JD')).toBeTruthy();
    });
  });
});
