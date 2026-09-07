import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { IconVariant } from '../api';
import { resolveDsReactRegistryName } from '../ds-react/ds-react-icon-gallery';
import { DS_REACT_ICON_REGISTRY } from '../ds-react/ds-react-icon-registry';
import { getDsReactRegistryIcon } from '../ds-react/get-ds-react-registry-icon';
import { EtIconV2 } from '../et-icon-v2';

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: jest.fn(({ source, style, tintColor, ...props }) => {
    const { View } = require('react-native');
    return <View testID="mock-expo-image" source={source} style={style} tintColor={tintColor} {...props} />;
  }),
}));

// Mock useEtoroTheme
const mockColors = {
  carbon900: '#1F2937',
};

jest.mock('etoro-core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({ colors: mockColors })),
}));

// Mock useIconSource
jest.mock('../hooks/use-icon-source', () => ({
  useIconSource: jest.fn((name: string, variant: string) => ({
    iconUrl: `https://etoro-cdn.etorostatic.com/web-client/et-plus/zappicons/${name}/${variant}/${name}-${variant}.svg`,
  })),
}));

describe('EtIconV2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with minimum required props', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(getByTestId('mock-expo-image')).toBeTruthy();
    });

    it('renders renderIcon instead of CDN image when renderIcon is provided', () => {
      const renderIconMock = jest.fn(({ size, color }: { size: number; color: string }) => (
        <Text testID="local-svg-mock">
          {size}-{color}
        </Text>
      ));

      const { getByTestId, queryByTestId } = render(<EtIconV2 name="localTest" testID="test-icon" renderIcon={renderIconMock} />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(renderIconMock).toHaveBeenCalledTimes(1);
      expect(renderIconMock.mock.calls[0][0]).toEqual({
        size: 20,
        color: mockColors.carbon900,
      });
      expect(getByTestId('local-svg-mock')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders filled star from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="star" variant={IconVariant.Filled} testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders chart-line from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="chart-line" testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders caret fill icons from the bundled DS registry', () => {
      const { getByTestId, queryAllByTestId } = render(
        <>
          <EtIconV2 name="caret-fill-up" testID="caret-fill-up-icon" />
          <EtIconV2 name="caret-fill-down" testID="caret-fill-down-icon" />
        </>,
      );

      expect(getByTestId('caret-fill-up-icon')).toBeTruthy();
      expect(getByTestId('caret-fill-down-icon')).toBeTruthy();
      expect(queryAllByTestId('mock-expo-image')).toHaveLength(0);
    });

    it('renders chart-line-gradient from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="chart-line-gradient" testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders change-chart from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="change-chart" testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders change-chart-fill from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="change-chart-fill" testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('resolves change-chart filled variant from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="change-chart" variant={IconVariant.Filled} testID="test-icon" />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders newly added designer icons from the bundled DS registry', () => {
      const { getByTestId, queryAllByTestId } = render(
        <>
          <EtIconV2 name="block-account" testID="block-account-icon" />
          <EtIconV2 name="record-fill" testID="record-fill-icon" />
        </>,
      );

      expect(getByTestId('block-account-icon')).toBeTruthy();
      expect(getByTestId('record-fill-icon')).toBeTruthy();
      expect(queryAllByTestId('mock-expo-image')).toHaveLength(0);
    });

    it('resolves replaced watchlist filled variant from the bundled DS registry', () => {
      const { getByTestId, queryByTestId } = render(<EtIconV2 name="watchlist" variant={IconVariant.Filled} testID="test-icon" />);

      expect(resolveDsReactRegistryName('watchlist', IconVariant.Filled)).toBe('watchlist-fill');
      expect(getDsReactRegistryIcon('watchlist', IconVariant.Filled)).toBe(DS_REACT_ICON_REGISTRY['watchlist-fill']);
      expect(getByTestId('test-icon')).toBeTruthy();
      expect(queryByTestId('mock-expo-image')).toBeNull();
    });

    it('renders with all props', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <EtIconV2
          name="settings"
          variant={IconVariant.Filled}
          size="lg"
          color="#FF0000"
          testID="test-icon"
          accessibilityLabel="Settings icon"
          onPress={mockOnPress}
        />,
      );

      expect(getByTestId('test-icon')).toBeTruthy();
    });
  });

  describe('Icon Names', () => {
    const iconNames = ['settings', 'bell', 'search'] as const;

    iconNames.forEach((iconName) => {
      it(`renders ${iconName} icon correctly`, () => {
        const { getByTestId } = render(<EtIconV2 name={iconName} testID={`${iconName}-icon`} />);

        expect(getByTestId(`${iconName}-icon`)).toBeTruthy();
      });
    });
  });

  describe('Icon Variants', () => {
    it('uses regular variant by default', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toContain('/regular/');
    });

    it('uses filled variant when specified', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" variant={IconVariant.Filled} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toContain('/filled/');
    });

    it('uses outlined variant when specified', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" variant={IconVariant.Outlined} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toContain('/outlined/');
    });

    it('uses light variant when specified', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" variant={IconVariant.Light} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toContain('/light/');
    });

    it('uses duotone variant when specified', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" variant={IconVariant.Duotone} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toContain('/duotone/');
    });

    it('uses duotone-line variant when specified', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" variant={IconVariant.DuotoneLine} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toContain('/duotone-line/');
    });
  });

  describe('Icon Sizes', () => {
    const sizePresets = [
      { size: 'xs' as const, expected: 12 },
      { size: 'sm' as const, expected: 16 },
      { size: 'md' as const, expected: 20 },
      { size: 'lg' as const, expected: 24 },
      { size: 'xl' as const, expected: 32 },
      { size: '2xl' as const, expected: 48 },
    ];

    sizePresets.forEach(({ size, expected }) => {
      it(`renders with ${size} size (${expected}px) correctly`, () => {
        const { getByTestId } = render(<EtIconV2 name="settings" size={size} testID="test-icon" />);

        const container = getByTestId('test-icon');
        const image = getByTestId('mock-expo-image');

        // Container has size dimensions
        expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: expected, height: expected })]));

        // Image also has size dimensions
        expect(StyleSheet.flatten(image.props.style)).toEqual(expect.objectContaining({ width: expected, height: expected }));
      });
    });

    it('uses default size (md/20px) when size is not provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 20, height: 20 })]));
    });

    it('renders with custom numeric size', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" size={28} testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 28, height: 28 })]));
    });
  });

  describe('Color Handling', () => {
    it('applies custom color via tintColor', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" color="#FF0000" testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.tintColor).toBe('#FF0000');
    });

    it('applies default theme color when no color provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.tintColor).toBe(mockColors.carbon900);
    });

    it('uses carbon900 for icons without contextual name overrides', () => {
      const { getByTestId } = render(<EtIconV2 name="bell" testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.tintColor).toBe(mockColors.carbon900);
    });

    it('uses carbon900 for every icon without an explicit color', () => {
      const { getByTestId } = render(<EtIconV2 name="heart" testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.tintColor).toBe(mockColors.carbon900);
    });
  });

  describe('CDN URL Generation', () => {
    const CDN_BASE = 'https://etoro-cdn.etorostatic.com/web-client/et-plus/zappicons';

    it('generates correct CDN URL for regular variant', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" variant={IconVariant.Regular} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toBe(`${CDN_BASE}/settings/regular/settings-regular.svg`);
    });

    it('generates correct CDN URL for filled variant', () => {
      const { getByTestId } = render(<EtIconV2 name="bell" variant={IconVariant.Filled} testID="test-icon" />);

      const image = getByTestId('mock-expo-image');
      expect(image.props.source.uri).toBe(`${CDN_BASE}/bell/filled/bell-filled.svg`);
    });
  });

  describe('Accessibility', () => {
    it('does not generate accessibility label by default (non-interactive)', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityLabel).toBeUndefined();
    });

    it('generates accessibility label when onPress is provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" onPress={() => {}} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityLabel).toBe('settings icon');
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" accessibilityLabel="Open Settings" />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityLabel).toBe('Open Settings');
    });

    it('applies image accessibility role by default', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityRole).toBe('image');
    });

    it('applies button role when onPress is provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" onPress={() => {}} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityRole).toBe('button');
    });

    it('uses custom accessibility role when provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" accessibilityRole="link" />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityRole).toBe('link');
    });

    it('sets accessible to false by default (non-interactive, no label)', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.accessible).toBe(false);
    });

    it('sets accessible to true when onPress is provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" onPress={() => {}} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessible).toBe(true);
    });

    it('sets accessible to true when accessibilityLabel is provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" accessibilityLabel="Settings" />);

      const container = getByTestId('test-icon');
      expect(container.props.accessible).toBe(true);
    });

    it('derived accessible=false alone adds NO aria-hidden — kit-wide default unchanged', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);
      expect(getByTestId('test-icon').props['aria-hidden']).toBeUndefined();
    });

    it('explicit accessible={false} cuts the whole subtree from the accessibility tree', () => {
      const { getByTestId } = render(<EtIconV2 accessible={false} name="settings" testID="test-icon" />);
      // aria-hidden, not just accessible: on web `accessible` only maps to
      // focusability, leaving an UNNAMED image role (container + inner SVG)
      // announced by screen readers.
      expect(getByTestId('test-icon', { includeHiddenElements: true }).props['aria-hidden']).toBe(true);
    });

    it('never carries aria-hidden on the interactive (Pressable) form — a focusable element hidden from AT is a WCAG failure', () => {
      const { getByTestId } = render(<EtIconV2 accessible={false} name="settings" onPress={() => undefined} testID="test-icon" />);
      expect(getByTestId('test-icon').props['aria-hidden']).toBeUndefined();
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" onPress={mockOnPress} />);

      fireEvent.press(getByTestId('test-icon'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('renders as Pressable when onPress is provided', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" onPress={mockOnPress} />);

      const container = getByTestId('test-icon');
      // Pressable gets button role when interactive
      expect(container.props.accessibilityRole).toBe('button');
    });

    it('renders as View when onPress is not provided', () => {
      const { getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);

      const container = getByTestId('test-icon');
      // View does not have onPress prop
      expect(container.props.onPress).toBeUndefined();
    });
  });

  describe('Style Application', () => {
    it('applies container style with size dimensions', () => {
      const containerStyle = { padding: 10, backgroundColor: 'blue' };

      const { getByTestId } = render(<EtIconV2 name="settings" style={containerStyle} testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.style).toEqual([{ width: 20, height: 20 }, containerStyle]);
    });

    it('applies custom size with style', () => {
      const containerStyle = { margin: 5 };

      const { getByTestId } = render(<EtIconV2 name="settings" size="lg" style={containerStyle} testID="test-icon" />);

      const container = getByTestId('test-icon');
      expect(container.props.style).toEqual([{ width: 24, height: 24 }, containerStyle]);
    });
  });

  describe('Memoization', () => {
    it('is memoized component', () => {
      // React.memo wraps the component
      expect(EtIconV2).toBeDefined();
      // Component should render without issues when props don't change
      const { rerender, getByTestId } = render(<EtIconV2 name="settings" testID="test-icon" />);
      rerender(<EtIconV2 name="settings" testID="test-icon" />);
      expect(getByTestId('test-icon')).toBeTruthy();
    });
  });
});

describe('EtIconV2 DS — React', () => {
  it('falls back to Zappicons CDN when DS gallery name has no bundled SVG in the local registry', () => {
    const { getByTestId, queryByTestId } = render(<EtIconV2 name="chevron-Sort-up+down" size="md" testID="ds-chevron-sort" />);
    expect(getByTestId('ds-chevron-sort')).toBeTruthy();
    expect(queryByTestId('mock-expo-image')).toBeTruthy();
  });
});
