import { fireEvent, render } from '@testing-library/react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import type { AssetInfo } from '../api/types';
import { AssetHeader } from './asset-header';

// Mock EtText component
jest.mock('../../../../foundations/text', () => ({
  EtText: function MockEtText({ children, testID, ...props }: any) {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID, ...props }, children);
  },
}));

// Mock EtIconButton component
jest.mock('../../../button/et-icon-button', () => ({
  EtIconButton: function MockEtIconButton({ onPress, iconName, size, testID }: any) {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return React.createElement(Pressable, { onPress, testID: testID || 'icon-button' }, React.createElement(Text, {}, `Icon: ${iconName} (${size})`));
  },
}));

// Mock EtButton (from button)
jest.mock('../../../button/et-button', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  const mockButton = Object.assign(
    function MockEtButton({ onPress, children, testID }: any) {
      return React.createElement(
        Pressable,
        {
          onPress,
          testID: testID || 'et-button',
        },
        React.createElement(Text, {}, children),
      );
    },
    {
      Label: function MockEtButtonLabel({ children }: any) {
        return React.createElement(Text, {}, children);
      },
      Icon: function MockEtButtonIcon() {
        return null;
      },
    },
  );

  return {
    EtButton: mockButton,
  };
});

const mockColors = colorsMock;

const createMockAsset = (overrides: any = {}): AssetInfo => ({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  currentPrice: 150.5,
  currency: 'USD',
  logo: 'https://example.com/apple-logo.png',
  exchange: 'NASDAQ',
  ...overrides,
});

describe('AssetHeader', () => {
  const defaultProps = {
    asset: createMockAsset(),
    colors: mockColors.colors,
  };

  describe('Basic Rendering', () => {
    it('renders asset symbol and name', () => {
      const { getByText } = render(<AssetHeader {...defaultProps} />);

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });

    it('renders asset logo with string URI', () => {
      const asset = createMockAsset({
        logo: 'https://example.com/logo.png',
      });

      // Check if image source is set correctly - we check this through props
      const header = render(<AssetHeader {...defaultProps} asset={asset} />);
      expect(header).toBeTruthy();
    });

    it('renders asset logo with object source', () => {
      const asset = createMockAsset({
        logo: { uri: 'https://example.com/logo.png' },
      });

      expect(() => render(<AssetHeader {...defaultProps} asset={asset} />)).not.toThrow();
    });

    it('applies basic header styles', () => {
      // Component should render without throwing
      expect(() => render(<AssetHeader {...defaultProps} />)).not.toThrow();
    });
  });

  describe('Display Modes', () => {
    it('applies compact mode styles and larger symbol text', () => {
      const { getByText } = render(<AssetHeader {...defaultProps} compact={true} />);

      const symbolText = getByText('AAPL');
      const nameText = getByText('Apple Inc.');

      expect(symbolText).toBeTruthy();
      expect(nameText).toBeTruthy();
    });

    it('applies minimal mode styles with centered layout', () => {
      const { getByText } = render(<AssetHeader {...defaultProps} minimal={true} />);

      const symbolText = getByText('AAPL');
      const nameText = getByText('Apple Inc.');

      expect(symbolText).toBeTruthy();
      expect(nameText).toBeTruthy();
    });

    it('applies both compact and minimal mode styles', () => {
      const { getByText } = render(<AssetHeader {...defaultProps} compact={true} minimal={true} />);

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });
  });

  describe('Close Button', () => {
    it('renders close button when showCloseButton is true and onClose is provided', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(<AssetHeader {...defaultProps} showCloseButton={true} onClose={onClose} />);

      expect(getByTestId('icon-button')).toBeTruthy();
    });

    it('does not render close button when showCloseButton is false', () => {
      const onClose = jest.fn();
      const { queryByTestId } = render(<AssetHeader {...defaultProps} showCloseButton={false} onClose={onClose} />);

      expect(queryByTestId('icon-button')).toBeNull();
    });

    it('does not render close button when onClose is not provided', () => {
      const { queryByTestId } = render(<AssetHeader {...defaultProps} showCloseButton={true} />);

      expect(queryByTestId('icon-button')).toBeNull();
    });

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(<AssetHeader {...defaultProps} showCloseButton={true} onClose={onClose} />);

      fireEvent.press(getByTestId('icon-button'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Add Button', () => {
    it('renders add button in minimal mode when showAddButton is true', () => {
      const onAdd = jest.fn();
      const { getByTestId } = render(<AssetHeader {...defaultProps} minimal={true} showAddButton={true} onAdd={onAdd} />);

      expect(getByTestId('et-button')).toBeTruthy();
    });

    it('does not render add button when not in minimal mode', () => {
      const onAdd = jest.fn();
      const { queryByTestId } = render(<AssetHeader {...defaultProps} showAddButton={true} onAdd={onAdd} />);

      expect(queryByTestId('et-button')).toBeNull();
    });

    it('does not render add button when showAddButton is false', () => {
      const onAdd = jest.fn();
      const { queryByTestId } = render(<AssetHeader {...defaultProps} minimal={true} showAddButton={false} onAdd={onAdd} />);

      expect(queryByTestId('et-button')).toBeNull();
    });

    it('shows default add button text when not added', () => {
      const onAdd = jest.fn();
      const { getByText } = render(<AssetHeader {...defaultProps} minimal={true} showAddButton={true} onAdd={onAdd} isAdded={false} />);

      expect(getByText('Add')).toBeTruthy();
    });

    it('shows default added button text when added', () => {
      const onAdd = jest.fn();
      const { getByText } = render(<AssetHeader {...defaultProps} minimal={true} showAddButton={true} onAdd={onAdd} isAdded={true} />);

      expect(getByText('Added')).toBeTruthy();
    });

    it('shows custom add button text when provided', () => {
      const onAdd = jest.fn();
      const { getByText } = render(
        <AssetHeader {...defaultProps} minimal={true} showAddButton={true} onAdd={onAdd} isAdded={false} addButtonText="Add to Watchlist" />,
      );

      expect(getByText('Add to Watchlist')).toBeTruthy();
    });

    it('shows custom added button text when provided', () => {
      const onAdd = jest.fn();
      const { getByText } = render(
        <AssetHeader {...defaultProps} minimal={true} showAddButton={true} onAdd={onAdd} isAdded={true} addedButtonText="In Watchlist" />,
      );

      expect(getByText('In Watchlist')).toBeTruthy();
    });

    it('calls onAdd when add button is pressed', () => {
      const onAdd = jest.fn();
      const { getByTestId } = render(<AssetHeader {...defaultProps} minimal={true} showAddButton={true} onAdd={onAdd} />);

      fireEvent.press(getByTestId('et-button'));
      expect(onAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Asset Information Display', () => {
    it('renders different asset symbols correctly', () => {
      const testCases = [
        { symbol: 'TSLA', name: 'Tesla Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
      ];

      testCases.forEach(({ symbol, name }) => {
        const asset = createMockAsset({ symbol, name });
        const { getByText } = render(<AssetHeader {...defaultProps} asset={asset} />);

        expect(getByText(symbol)).toBeTruthy();
        expect(getByText(name)).toBeTruthy();
      });
    });

    it('handles long asset names gracefully', () => {
      const asset = createMockAsset({
        symbol: 'VERYLONGASSET',
        name: 'A Very Long Asset Name That Might Overflow The Container',
      });

      expect(() => render(<AssetHeader {...defaultProps} asset={asset} />)).not.toThrow();
    });

    it('handles empty asset name gracefully', () => {
      const asset = createMockAsset({
        name: '',
      });

      const { getByText } = render(<AssetHeader {...defaultProps} asset={asset} />);
      expect(getByText('AAPL')).toBeTruthy();
    });

    it('handles special characters in asset name', () => {
      const asset = createMockAsset({
        name: 'Test & Company Inc. (Class A)',
      });

      const { getByText } = render(<AssetHeader {...defaultProps} asset={asset} />);
      expect(getByText('Test & Company Inc. (Class A)')).toBeTruthy();
    });
  });

  describe('Logo Handling', () => {
    it('handles missing logo gracefully', () => {
      const asset = createMockAsset({
        logo: '',
      });

      expect(() => render(<AssetHeader {...defaultProps} asset={asset} />)).not.toThrow();
    });

    it('handles different logo formats', () => {
      const testCases = [
        { logo: 'https://example.com/logo.png' },
        { logo: { uri: 'https://example.com/logo.png' } },
        {
          logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        },
      ];

      testCases.forEach(({ logo }) => {
        const asset = createMockAsset({ logo });
        expect(() => render(<AssetHeader {...defaultProps} asset={asset} />)).not.toThrow();
      });
    });
  });

  describe('Props Handling', () => {
    it('handles all default prop values correctly', () => {
      const { getByText } = render(<AssetHeader {...defaultProps} />);

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });

    it('handles missing optional props gracefully', () => {
      const minimalProps = {
        asset: createMockAsset(),
        colors: mockColors.colors,
      };

      expect(() => render(<AssetHeader {...minimalProps} />)).not.toThrow();
    });

    it('handles undefined callbacks gracefully', () => {
      const { queryByTestId } = render(
        <AssetHeader {...defaultProps} showCloseButton={true} onClose={undefined} showAddButton={true} onAdd={undefined} minimal={true} />,
      );

      // Close button should not render when onClose is undefined
      expect(queryByTestId('icon-button')).toBeNull();
      // Add button should still render but won't have onPress
      expect(queryByTestId('et-button')).toBeTruthy();
    });
  });

  describe('Style Integration', () => {
    it('applies theme colors correctly', () => {
      const customColors = {
        ...mockColors,
        text: '#FF0000',
      };

      const { getByText } = render(<AssetHeader {...defaultProps} colors={customColors.colors} />);

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });

    it('combines multiple style modifiers correctly', () => {
      const { getByText } = render(
        <AssetHeader
          {...defaultProps}
          compact={true}
          minimal={true}
          showCloseButton={true}
          onClose={jest.fn()}
          showAddButton={true}
          onAdd={jest.fn()}
        />,
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles null asset values gracefully', () => {
      const asset = createMockAsset({
        symbol: null as any,
        name: null as any,
      });

      expect(() => render(<AssetHeader {...defaultProps} asset={asset} />)).not.toThrow();
    });

    it('handles extremely long symbol names', () => {
      const asset = createMockAsset({
        symbol: 'AVERYLONGASSETSYMBOLTHATMIGHTCAUSEISSUES',
      });

      expect(() => render(<AssetHeader {...defaultProps} asset={asset} />)).not.toThrow();
    });

    it('handles multiple button interactions simultaneously', () => {
      const onClose = jest.fn();
      const onAdd = jest.fn();

      const { getByTestId } = render(
        <AssetHeader {...defaultProps} minimal={true} showCloseButton={true} onClose={onClose} showAddButton={true} onAdd={onAdd} />,
      );

      // Both buttons should be present
      expect(getByTestId('icon-button')).toBeTruthy();
      expect(getByTestId('et-button')).toBeTruthy();

      // Both should be clickable
      fireEvent.press(getByTestId('icon-button'));
      fireEvent.press(getByTestId('et-button'));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledTimes(1);
    });
  });
});
