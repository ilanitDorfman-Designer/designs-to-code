import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleProp, Text, ViewStyle } from 'react-native';

import { EtAssetItem } from './et-asset-item';

/**
 * Flattens a (possibly array) style prop into a single object for inspection.
 */
function flattenStyle(style: StyleProp<ViewStyle>): Record<string, unknown> {
  if (Array.isArray(style)) {
    const flat = (style as unknown[]).flat(Infinity as 1).filter(Boolean) as Record<string, unknown>[];
    return Object.assign({}, ...flat);
  }
  return (style as Record<string, unknown>) ?? {};
}

// Sentinel hex values for V2 tokens consumed by et-asset-item. The shared
// `colorsMock` is V1-only, so we extend it locally with the V2 keys used here
// (`verdictPositive600Opacity15` / `verdictNegative600Opacity15` / `carbon900`)
// so style assertions can compare against deterministic values.
const SENTINEL_VERDICT_POSITIVE_600_OPACITY_15 = '#AAAA1500';
const SENTINEL_VERDICT_NEGATIVE_600_OPACITY_15 = '#BBBB1500';
const SENTINEL_VERDICT_POSITIVE_600 = '#0EB12E';
const SENTINEL_VERDICT_NEGATIVE_600 = '#D12515';
const SENTINEL_CARBON_900 = '#1B1E21';
const SENTINEL_CARBON_SECONDARY_DIVIDER = '#B2B2B226';

jest.mock('../../../core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: {
        ...colorsMock.colors,
        verdictPositive600: SENTINEL_VERDICT_POSITIVE_600,
        verdictNegative600: SENTINEL_VERDICT_NEGATIVE_600,
        verdictPositive600Opacity15: SENTINEL_VERDICT_POSITIVE_600_OPACITY_15,
        verdictNegative600Opacity15: SENTINEL_VERDICT_NEGATIVE_600_OPACITY_15,
        carbon900: SENTINEL_CARBON_900,
        carbonSecondaryDivider: SENTINEL_CARBON_SECONDARY_DIVIDER,
      },
      gradients: {},
      fonts: {},
    })),
  };
});

describe('EtAssetItem', () => {
  // ========== Rendering ==========

  describe('Rendering', () => {
    it('renders Logo, Symbol, Name, Price and Change subcomponents', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Logo source="https://example.com/aapl.svg" testID="logo" />
          <EtAssetItem.Content testID="content">
            <EtAssetItem.Symbol testID="symbol">AAPL</EtAssetItem.Symbol>
            <EtAssetItem.Name testID="name">Apple Inc</EtAssetItem.Name>
          </EtAssetItem.Content>
          <EtAssetItem.Price value="$186.79" testID="price" />
          <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" testID="change" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('asset-item')).toBeTruthy();
      expect(screen.getByTestId('logo')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
      expect(screen.getByTestId('symbol')).toBeTruthy();
      expect(screen.getByTestId('name')).toBeTruthy();
      expect(screen.getByTestId('price')).toBeTruthy();
      expect(screen.getByTestId('change')).toBeTruthy();
      expect(screen.getByText('AAPL')).toBeTruthy();
      expect(screen.getByText('Apple Inc')).toBeTruthy();
      expect(screen.getByText('$186.79')).toBeTruthy();
      expect(screen.getByText('1.95 (-1.03%)')).toBeTruthy();
    });

    it('respects deterministic render order regardless of JSX order', () => {
      const { toJSON } = render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Trailing testID="trailing">trailing</EtAssetItem.Trailing>
          <EtAssetItem.Symbol testID="symbol">AAPL</EtAssetItem.Symbol>
          <EtAssetItem.Logo testID="logo" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('logo')).toBeTruthy();
      expect(screen.getByTestId('trailing')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });

    it('renders Trailing subcomponent', () => {
      render(
        <EtAssetItem>
          <EtAssetItem.Logo />
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Trailing testID="trailing">
            <Text>CTA</Text>
          </EtAssetItem.Trailing>
        </EtAssetItem>,
      );

      expect(screen.getByTestId('trailing')).toBeTruthy();
      expect(screen.getByText('CTA')).toBeTruthy();
    });

    it('renders logo fallback and optional market status', () => {
      render(
        <EtAssetItem>
          <EtAssetItem.Logo
            fallback="AA"
            imageBackgroundColor="#F7F7F7"
            marketStatus="closed"
            marketStatusBackgroundColor="#442222"
            marketStatusTestID="market-status"
          />
        </EtAssetItem>,
      );

      expect(screen.getByText('AA')).toBeTruthy();
      expect(screen.getByTestId('market-status')).toBeTruthy();
      expect(flattenStyle(screen.getByTestId('market-status').props.style)).toEqual(expect.objectContaining({ backgroundColor: '#442222' }));
    });
  });

  // ========== Label ==========

  describe('Label', () => {
    it('renders label pill content', () => {
      render(
        <EtAssetItem>
          <EtAssetItem.Logo />
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Label testID="label">Edited</EtAssetItem.Label>
        </EtAssetItem>,
      );

      expect(screen.getByTestId('label')).toBeTruthy();
      expect(screen.getByText('Edited')).toBeTruthy();
    });
  });

  // ========== Size ==========

  describe('Size', () => {
    it('defaults to large size (paddingVertical X4 = 16)', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Logo />
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      const flat = flattenStyle(root.props.style);
      expect(flat.paddingVertical).toBe(16);
    });

    it('applies small size padding (paddingVertical X3 = 12)', () => {
      render(
        <EtAssetItem size="small" testID="asset-item">
          <EtAssetItem.Logo />
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      const flat = flattenStyle(root.props.style);
      expect(flat.paddingVertical).toBe(12);
    });
  });

  // ========== Disabled ==========

  describe('Disabled', () => {
    it('lowers opacity when disabled', () => {
      render(
        <EtAssetItem disabled testID="asset-item">
          <EtAssetItem.Logo />
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      const flat = flattenStyle(root.props.style);
      expect(flat.opacity).toBe(0.5);
    });

    it('keeps button semantics when disabled (announces a disabled button to AT)', () => {
      const onPress = jest.fn();
      render(
        <EtAssetItem disabled onPress={onPress} testID="asset-item">
          <EtAssetItem.Logo />
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      expect(root.props.accessibilityRole).toBe('button');
      expect(root.props.accessibilityState).toEqual({ disabled: true });
    });

    it('does not call onPress when disabled even with onPress provided', () => {
      const onPress = jest.fn();
      render(
        <EtAssetItem disabled onPress={onPress} testID="asset-item">
          <EtAssetItem.Logo />
        </EtAssetItem>,
      );

      fireEvent.press(screen.getByTestId('asset-item'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // ========== onPress ==========

  describe('Press handling', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      render(
        <EtAssetItem onPress={onPress} testID="asset-item">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
        </EtAssetItem>,
      );

      fireEvent.press(screen.getByTestId('asset-item'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders as a button role when onPress is set', () => {
      render(
        <EtAssetItem onPress={() => undefined} testID="asset-item" accessibilityLabel="AAPL row">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      expect(root.props.accessibilityRole).toBe('button');
      expect(root.props.accessibilityLabel).toBe('AAPL row');
    });
  });

  // ========== Divider ==========

  describe('Divider', () => {
    it('renders divider when EtAssetItem.Divider is included', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Divider testID="divider" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('divider')).toBeTruthy();
    });

    it('does not render divider when omitted', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
        </EtAssetItem>,
      );

      expect(screen.queryByTestId('divider')).toBeNull();
    });

    it('uses paddingTop only (no paddingVertical) when divider is present', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Divider />
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      const flat = flattenStyle(root.props.style);
      expect(flat.paddingTop).toBe(16);
      expect(flat.paddingVertical).toBeUndefined();
    });
  });

  // ========== Skeleton ==========

  describe('Skeleton', () => {
    it('renders skeleton in loading mode', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Skeleton testID="skeleton" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('skeleton')).toBeTruthy();
    });

    it('renders symbol-only skeleton variant', () => {
      const { toJSON } = render(
        <EtAssetItem>
          <EtAssetItem.Skeleton variant="symbol-only" testID="skeleton" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('skeleton')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });

    it('renders divider together with skeleton', () => {
      render(
        <EtAssetItem testID="asset-item">
          <EtAssetItem.Skeleton testID="skeleton" />
          <EtAssetItem.Divider testID="divider" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('skeleton')).toBeTruthy();
      expect(screen.getByTestId('divider')).toBeTruthy();
    });

    it('inherits parent size on the skeleton', () => {
      render(
        <EtAssetItem size="small">
          <EtAssetItem.Skeleton testID="skeleton" />
        </EtAssetItem>,
      );

      const skeleton = screen.getByTestId('skeleton');
      const flat = flattenStyle(skeleton.props.style);
      expect(flat.paddingVertical).toBe(12);
    });

    it('skeleton size prop overrides parent size', () => {
      render(
        <EtAssetItem size="large">
          <EtAssetItem.Skeleton size="small" testID="skeleton" />
        </EtAssetItem>,
      );

      const skeleton = screen.getByTestId('skeleton');
      const flat = flattenStyle(skeleton.props.style);
      expect(flat.paddingVertical).toBe(12);
    });
  });

  // ========== Accessibility ==========

  describe('Accessibility', () => {
    it('forwards testID, accessibilityLabel, and accessibilityHint', () => {
      render(
        <EtAssetItem testID="asset-item" accessibilityLabel="AAPL price row" accessibilityHint="Opens asset details">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
        </EtAssetItem>,
      );

      const root = screen.getByTestId('asset-item');
      expect(root.props.accessibilityLabel).toBe('AAPL price row');
      expect(root.props.accessibilityHint).toBe('Opens asset details');
    });
  });

  // ========== Context ==========

  describe('Context validation', () => {
    it('throws when subcomponents needing context are used standalone', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => render(<EtAssetItem.Content>orphan</EtAssetItem.Content>)).toThrow(
        'EtAssetItem subcomponents must be used within an <EtAssetItem> component',
      );

      consoleSpy.mockRestore();
    });
  });

  // ========== Trading-view layout ==========

  describe('Trading-view layout', () => {
    it('renders Logo, Symbol, Change, and two RateChip siblings', () => {
      render(
        <EtAssetItem layout="trading-view" testID="asset-item">
          <EtAssetItem.Logo testID="logo" />
          <EtAssetItem.Content testID="content">
            <EtAssetItem.Symbol>AUS200</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Change value="4.35% (-1.03%)" sentiment="positive" testID="change" />
          <EtAssetItem.RateChip value="11756.62" sentiment="positive" label="Buy" testID="buy-chip" />
          <EtAssetItem.RateChip value="11756.62" sentiment="neutral" label="Sell" testID="sell-chip" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('asset-item')).toBeTruthy();
      expect(screen.getByTestId('logo')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
      expect(screen.getByTestId('change')).toBeTruthy();
      expect(screen.getByTestId('buy-chip')).toBeTruthy();
      expect(screen.getByTestId('sell-chip')).toBeTruthy();
      expect(screen.getByText('AUS200')).toBeTruthy();
      expect(screen.getByText('Buy')).toBeTruthy();
      expect(screen.getByText('Sell')).toBeTruthy();
    });

    it('renders multiple RateChip siblings (does not collapse to the first one)', () => {
      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="100.00" sentiment="positive" testID="chip-1" />
          <EtAssetItem.RateChip value="200.00" sentiment="negative" testID="chip-2" />
          <EtAssetItem.RateChip value="300.00" sentiment="neutral" testID="chip-3" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('chip-1')).toBeTruthy();
      expect(screen.getByTestId('chip-2')).toBeTruthy();
      expect(screen.getByTestId('chip-3')).toBeTruthy();
    });

    it('left-aligns Change in trading-view (vs. right-aligned in default)', () => {
      const { rerender } = render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Change value="4.35%" sentiment="positive" testID="change" />
        </EtAssetItem>,
      );

      let flat = flattenStyle(screen.getByTestId('change').props.style);
      expect(flat.textAlign).toBe('left');

      rerender(
        <EtAssetItem>
          <EtAssetItem.Change value="4.35%" sentiment="positive" testID="change" />
        </EtAssetItem>,
      );

      flat = flattenStyle(screen.getByTestId('change').props.style);
      expect(flat.textAlign).toBe('right');
    });

    it('enables shrinkToFit on Change in trading-view to prevent truncation', () => {
      const { rerender } = render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Change value="▲ 0.00308 (+0.31%)" sentiment="positive" testID="change" />
        </EtAssetItem>,
      );

      const tradingViewProps = screen.getByTestId('change').props;
      expect(tradingViewProps.adjustsFontSizeToFit).toBe(true);

      rerender(
        <EtAssetItem>
          <EtAssetItem.Change value="▲ 0.00308 (+0.31%)" sentiment="positive" testID="change" />
        </EtAssetItem>,
      );

      const defaultProps = screen.getByTestId('change').props;
      expect(defaultProps.adjustsFontSizeToFit).toBeFalsy();
    });

    it('disables shrinkToFit on Change when shrinkToFit={false} is passed in trading-view', () => {
      // Opt-out for values sized to fit statically — avoids iOS latching a single
      // row to an illegibly small scale (PE-814).
      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Change value="▼ 0.00236 (-0.14%)" sentiment="negative" shrinkToFit={false} testID="change" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('change').props.adjustsFontSizeToFit).toBeFalsy();
    });

    it('warns in dev when Price is mixed with trading-view', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AUS200</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Price value="$100" />
          <EtAssetItem.RateChip value="100.00" />
        </EtAssetItem>,
      );

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('layout="trading-view" ignores EtAssetItem.Price'));
      warnSpy.mockRestore();
    });

    it('warns in dev when Trailing is mixed with trading-view', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AUS200</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Trailing>
            <Text>cta</Text>
          </EtAssetItem.Trailing>
          <EtAssetItem.RateChip value="100.00" />
        </EtAssetItem>,
      );

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('layout="trading-view" ignores EtAssetItem.Trailing'));
      warnSpy.mockRestore();
    });

    it('warns in dev when Label is mixed with trading-view', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AUS200</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.Label>NEW</EtAssetItem.Label>
          <EtAssetItem.RateChip value="100.00" />
        </EtAssetItem>,
      );

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('layout="trading-view" ignores EtAssetItem.Label'));
      warnSpy.mockRestore();
    });
  });

  // ========== RateChip ==========

  describe('RateChip', () => {
    it('renders the value', () => {
      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="11756.62" testID="chip" />
        </EtAssetItem>,
      );

      expect(screen.getByText('11756.62')).toBeTruthy();
      expect(screen.getByTestId('chip')).toBeTruthy();
    });

    it('renders the optional label above the value', () => {
      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="11756.62" label="Buy" testID="chip" />
        </EtAssetItem>,
      );

      expect(screen.getByText('Buy')).toBeTruthy();
      expect(screen.getByText('11756.62')).toBeTruthy();
    });

    it('does not render a label when none is provided', () => {
      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="11756.62" testID="chip" />
        </EtAssetItem>,
      );

      expect(screen.queryByText('Buy')).toBeNull();
      expect(screen.queryByText('Sell')).toBeNull();
    });

    it('applies a positive background to the chip container', () => {
      render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="100.00" sentiment="positive" testID="chip" />
        </EtAssetItem>,
      );

      const flat = flattenStyle(screen.getByTestId('chip').props.style);
      expect(flat.backgroundColor).toBeDefined();
      expect(typeof flat.backgroundColor).toBe('string');
      expect(flat.backgroundColor).not.toBe('transparent');
    });

    it('positive and negative sentiments resolve to different backgrounds', () => {
      const { rerender } = render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="100.00" sentiment="positive" testID="chip" />
        </EtAssetItem>,
      );
      const positiveBg = flattenStyle(screen.getByTestId('chip').props.style).backgroundColor;

      rerender(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.RateChip value="100.00" sentiment="negative" testID="chip" />
        </EtAssetItem>,
      );
      const negativeBg = flattenStyle(screen.getByTestId('chip').props.style).backgroundColor;

      expect(positiveBg).not.toEqual(negativeBg);
    });

    it('warns in dev when RateChip is used with the default layout', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <EtAssetItem>
          <EtAssetItem.RateChip value="100.00" testID="chip" />
        </EtAssetItem>,
      );

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('EtAssetItem.RateChip is only rendered with layout="trading-view"'));
      warnSpy.mockRestore();
    });

    it('does not render RateChip in the default layout', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <EtAssetItem>
          <EtAssetItem.Content>
            <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
          </EtAssetItem.Content>
          <EtAssetItem.RateChip value="100.00" testID="chip" />
        </EtAssetItem>,
      );

      expect(screen.queryByTestId('chip')).toBeNull();
      warnSpy.mockRestore();
    });
  });

  // ========== Rate-chips skeleton ==========

  describe('Skeleton rate-chips variant', () => {
    it('renders the rate-chips skeleton variant without crashing', () => {
      const { toJSON } = render(
        <EtAssetItem layout="trading-view">
          <EtAssetItem.Skeleton variant="rate-chips" testID="skeleton" />
        </EtAssetItem>,
      );

      expect(screen.getByTestId('skeleton')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });
  });
});
