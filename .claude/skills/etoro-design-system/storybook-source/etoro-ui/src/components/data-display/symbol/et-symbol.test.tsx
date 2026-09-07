import { render } from '@testing-library/react-native';

import { EtSymbol } from './et-symbol';

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

jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      avatarOverlayTop: 'rgba(255,255,255,0.75)',
      avatarOverlayBottom: 'rgba(44,44,44,0)',
    },
  })),
}));

jest.mock('../../et-icon-v2/et-icon-v2', () => ({
  EtIconV2: ({ name, color, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID={`icon-${name}`} color={color} {...props} />;
  },
}));

describe('EtSymbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      const { getByTestId } = render(
        <EtSymbol testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toBeTruthy();
    });

    it('always renders gradient overlay', () => {
      const { getByTestId } = render(
        <EtSymbol testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('gradient-overlay')).toBeTruthy();
    });

    it('uses default background color when not provided', () => {
      const { getByTestId } = render(
        <EtSymbol testID="symbol">
          <EtSymbol.Icon name="chat" />
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({ backgroundColor: '#232733' });
    });

    it('applies custom background color when provided', () => {
      const { getByTestId } = render(
        <EtSymbol testID="symbol" backgroundColor="#FF5500">
          <EtSymbol.Icon name="chat" />
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({ backgroundColor: '#FF5500' });
    });
  });

  describe('Size Variations', () => {
    it('renders small size with correct dimensions', () => {
      const { getByTestId } = render(
        <EtSymbol size="small" testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({
        width: 24,
        height: 24,
      });
    });

    it('renders medium size with correct dimensions', () => {
      const { getByTestId } = render(
        <EtSymbol size="medium" testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({
        width: 36,
        height: 36,
      });
    });

    it('renders large size with correct dimensions', () => {
      const { getByTestId } = render(
        <EtSymbol size="large" testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({
        width: 48,
        height: 48,
      });
    });
  });

  describe('Shape Variations', () => {
    it('renders with rounded shape and correct border radius', () => {
      const { getByTestId } = render(
        <EtSymbol shape="rounded" testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({ borderRadius: 8 });
    });

    it('renders with sharp shape and zero border radius', () => {
      const { getByTestId } = render(
        <EtSymbol shape="sharp" testID="symbol" backgroundColor="#037fd9">
          <EtSymbol.Currency>£</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({ borderRadius: 0 });
    });

    it('renders small size with rounded shape and correct border radius', () => {
      const { getByTestId } = render(
        <EtSymbol size="small" shape="rounded" testID="symbol" backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByTestId('symbol')).toHaveStyle({ borderRadius: 4 });
    });
  });

  describe('Currency Subcomponent', () => {
    it('renders currency text', () => {
      const { getByText } = render(
        <EtSymbol backgroundColor="#005ca4">
          <EtSymbol.Currency>€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByText('€')).toBeTruthy();
    });

    it('renders multi-character currency text', () => {
      const { getByText } = render(
        <EtSymbol backgroundColor="#0C3556">
          <EtSymbol.Currency>A$</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByText('A$')).toBeTruthy();
    });

    it('renders with custom color', () => {
      const { getByText } = render(
        <EtSymbol backgroundColor="#005ca4">
          <EtSymbol.Currency color="#FFD700">€</EtSymbol.Currency>
        </EtSymbol>,
      );

      expect(getByText('€')).toHaveStyle({ color: '#FFD700' });
    });
  });

  describe('Icon Subcomponent', () => {
    it('renders icon', () => {
      const { getByTestId } = render(
        <EtSymbol>
          <EtSymbol.Icon name="chat" />
        </EtSymbol>,
      );

      expect(getByTestId('icon-chat')).toBeTruthy();
    });

    it('renders with custom color', () => {
      const { getByTestId } = render(
        <EtSymbol>
          <EtSymbol.Icon name="chat" color="#FF0000" />
        </EtSymbol>,
      );

      const icon = getByTestId('icon-chat');
      expect(icon).toBeTruthy();
      expect(icon.props.color).toBe('#FF0000');
    });
  });

  describe('Date Subcomponent', () => {
    it('renders day and month', () => {
      const { getByText } = render(
        <EtSymbol>
          <EtSymbol.Date day="29" month="Apr" />
        </EtSymbol>,
      );

      expect(getByText('29')).toBeTruthy();
      expect(getByText('Apr')).toBeTruthy();
    });

    it('renders with custom color', () => {
      const { getByText } = render(
        <EtSymbol>
          <EtSymbol.Date day="15" month="Dec" color="#00FF00" />
        </EtSymbol>,
      );

      expect(getByText('15')).toHaveStyle({ color: '#00FF00' });
      expect(getByText('Dec')).toHaveStyle({ color: '#00FF00' });
    });
  });

  describe('Text Subcomponent', () => {
    it('renders text content', () => {
      const { getByText } = render(
        <EtSymbol>
          <EtSymbol.Text>PNG</EtSymbol.Text>
        </EtSymbol>,
      );

      expect(getByText('PNG')).toBeTruthy();
    });

    it('renders with custom color', () => {
      const { getByText } = render(
        <EtSymbol>
          <EtSymbol.Text color="#FF0000">BTC</EtSymbol.Text>
        </EtSymbol>,
      );

      expect(getByText('BTC')).toHaveStyle({ color: '#FF0000' });
    });

    it('throws error when used outside EtSymbol', () => {
      expect(() => {
        render(<EtSymbol.Text>PNG</EtSymbol.Text>);
      }).toThrow('EtSymbol compound components must be used within an EtSymbol component');
    });
  });

  describe('Context Error Handling', () => {
    it('throws error when Currency is used outside EtSymbol', () => {
      expect(() => {
        render(<EtSymbol.Currency>€</EtSymbol.Currency>);
      }).toThrow('EtSymbol compound components must be used within an EtSymbol component');
    });

    it('throws error when Icon is used outside EtSymbol', () => {
      expect(() => {
        render(<EtSymbol.Icon name="chat" />);
      }).toThrow('EtSymbol compound components must be used within an EtSymbol component');
    });

    it('throws error when Date is used outside EtSymbol', () => {
      expect(() => {
        render(<EtSymbol.Date day="29" month="Apr" />);
      }).toThrow('EtSymbol compound components must be used within an EtSymbol component');
    });
  });
});
