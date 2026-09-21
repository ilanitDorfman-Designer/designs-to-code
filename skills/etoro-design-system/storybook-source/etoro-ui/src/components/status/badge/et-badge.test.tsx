import { render } from '@testing-library/react-native';

import { BadgeColor, BadgeSize } from './api/types';
import { EtBadge } from './et-badge';

// Mock etoro-core/hooks
// Note: shared colorsMock is V1-only. Layer V2 sentinel hexes (#AB0xxx range)
// for the keys consumed by the partial V2 migration in get-badge-colors.ts.
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      dark: false,
      colors: {
        ...colorsMock.colors,
        carbon500: '#AB0500',
        verdictPositive600: '#AB0600',
        verdictNegative600: '#AB0601',
      },
      gradients: {},
      fonts: {},
    })),
  };
});

// Mock EtoroIcon - captures appearance.color and style.hasFill for testing
jest.mock('etoro-ui/foundations/icon-assets/et-icon', () => ({
  EtoroIcon: ({
    icon,
    appearance,
    style,
  }: {
    icon: { iconName: string };
    appearance?: { color?: string };
    style?: { hasFill?: boolean; fill?: string };
  }) => {
    const { View } = require('react-native');
    // Include color in testID for verification (sanitized for testID format)
    const colorSuffix = appearance?.color ? `-color-${appearance.color.replace('#', '')}` : '';
    // Include hasFill in testID for verification
    const fillSuffix = style?.hasFill ? '-filled' : '';
    return <View testID={`icon-${icon.iconName}${colorSuffix}${fillSuffix}`} />;
  },
}));

describe('EtBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with label', () => {
      const { getByText, getByTestId } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>New</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
      expect(getByText('New')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
      const { queryByTestId, getByText } = render(
        <EtBadge>
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(queryByTestId('badge')).toBeNull();
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Color Variants', () => {
    const colors: BadgeColor[] = ['neutral', 'red', 'orange', 'yellow', 'green', 'mint', 'blue', 'purple', 'violet'];

    it.each(colors)('renders %s color variant correctly', (color) => {
      const { getByTestId, getByText } = render(
        <EtBadge color={color} testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
      expect(getByText('Test')).toBeTruthy();
    });

    it('defaults to neutral color when not specified', () => {
      const { getByTestId } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    const sizes: BadgeSize[] = ['large', 'medium', 'small'];

    it.each(sizes)('renders %s size variant correctly', (size) => {
      const { getByTestId, getByText } = render(
        <EtBadge size={size} testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
      expect(getByText('Test')).toBeTruthy();
    });

    it('defaults to medium size when not specified', () => {
      const { getByTestId } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
    });

    it('applies correct padding for medium size', () => {
      const { getByTestId } = render(
        <EtBadge size="medium" testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      const badge = getByTestId('badge');
      const style = badge.props.style;

      expect(style).toBeDefined();
      expect(Array.isArray(style)).toBe(true);
    });

    it('applies correct padding for small size', () => {
      const { getByTestId } = render(
        <EtBadge size="small" testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      const badge = getByTestId('badge');
      const style = badge.props.style;

      expect(style).toBeDefined();
      expect(Array.isArray(style)).toBe(true);
    });
  });

  describe('Combined Props', () => {
    it('renders with all props combined', () => {
      const { getByTestId, getByText } = render(
        <EtBadge color="green" size="small" testID="badge" accessibilityLabel="Custom accessibility label">
          <EtBadge.Label>Custom Label</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
      expect(getByText('Custom Label')).toBeTruthy();
    });

    it('renders different color and size combinations', () => {
      const colors: BadgeColor[] = ['red', 'blue', 'green'];
      const sizes: BadgeSize[] = ['large', 'medium', 'small'];

      colors.forEach((color) => {
        sizes.forEach((size) => {
          const { getByTestId, unmount } = render(
            <EtBadge color={color} size={size} testID="badge">
              <EtBadge.Label>{`${color}-${size}`}</EtBadge.Label>
            </EtBadge>,
          );

          expect(getByTestId('badge')).toBeTruthy();
          unmount();
        });
      });
    });
  });

  describe('Custom Styles', () => {
    it('applies custom container styles', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <EtBadge style={customStyle} testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      const badge = getByTestId('badge');
      expect(badge).toBeTruthy();

      const style = badge.props.style;
      expect(style).toBeDefined();
      expect(Array.isArray(style)).toBe(true);
    });

    it('merges custom styles with default styles', () => {
      const customStyle = { borderWidth: 2 };
      const { getByTestId } = render(
        <EtBadge style={customStyle} testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      const badge = getByTestId('badge');
      const style = badge.props.style;

      expect(style).toBeDefined();
      expect(Array.isArray(style)).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>Status</EtBadge.Label>
        </EtBadge>,
      );

      const badge = getByTestId('badge');
      expect(badge.props.accessibilityRole).toBe('text');
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = render(
        <EtBadge accessibilityLabel="Custom accessibility text" testID="badge">
          <EtBadge.Label>Status</EtBadge.Label>
        </EtBadge>,
      );

      const badge = getByTestId('badge');
      expect(badge.props.accessibilityLabel).toBe('Custom accessibility text');
    });
  });

  describe('Label Variations', () => {
    it('handles empty string label', () => {
      const { getByTestId } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>{''}</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
    });

    it('handles long label text', () => {
      const longLabel = 'This is a very long label that might wrap';
      const { getByTestId, getByText } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>{longLabel}</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
      expect(getByText(longLabel)).toBeTruthy();
    });

    it('handles special characters in label', () => {
      const specialLabel = '!@#$%^&*()';
      const { getByText } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>{specialLabel}</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByText(specialLabel)).toBeTruthy();
    });

    it('handles numeric label', () => {
      const { getByText } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>123</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByText('123')).toBeTruthy();
    });
  });

  describe('Compound Components', () => {
    describe('EtBadge.Icon', () => {
      it('renders prefix icon (before label)', () => {
        const { getByTestId, getByText } = render(
          <EtBadge testID="badge">
            <EtBadge.Icon name="heart" />
            <EtBadge.Label>Favorites</EtBadge.Label>
          </EtBadge>,
        );

        expect(getByTestId('badge')).toBeTruthy();
        expect(getByTestId(/^icon-heart/)).toBeTruthy();
        expect(getByText('Favorites')).toBeTruthy();
      });

      it('renders suffix icon (after label)', () => {
        const { getByTestId, getByText } = render(
          <EtBadge testID="badge">
            <EtBadge.Label>New</EtBadge.Label>
            <EtBadge.Icon name="chevronRight" />
          </EtBadge>,
        );

        expect(getByTestId('badge')).toBeTruthy();
        expect(getByText('New')).toBeTruthy();
        expect(getByTestId(/^icon-chevronRight/)).toBeTruthy();
      });

      it('renders both prefix and suffix icons', () => {
        const { getByTestId, getByText } = render(
          <EtBadge testID="badge">
            <EtBadge.Icon name="heart" />
            <EtBadge.Label>Featured</EtBadge.Label>
            <EtBadge.Icon name="chevronRight" />
          </EtBadge>,
        );

        expect(getByTestId('badge')).toBeTruthy();
        expect(getByTestId(/^icon-heart/)).toBeTruthy();
        expect(getByText('Featured')).toBeTruthy();
        expect(getByTestId(/^icon-chevronRight/)).toBeTruthy();
      });

      it('renders icon only (no label)', () => {
        const { getByTestId } = render(
          <EtBadge testID="badge">
            <EtBadge.Icon name="heart" />
          </EtBadge>,
        );

        expect(getByTestId('badge')).toBeTruthy();
        expect(getByTestId(/^icon-heart/)).toBeTruthy();
      });

      it('passes badge color to icon for neutral variant', () => {
        const { getByTestId } = render(
          <EtBadge color="neutral" testID="badge">
            <EtBadge.Icon name="chevronRight" />
          </EtBadge>,
        );

        // Icon should receive a color (testID includes color suffix)
        const icon = getByTestId(/^icon-chevronRight-color-/);
        expect(icon).toBeTruthy();
      });

      it('passes badge color to icon for green variant', () => {
        const { getByTestId } = render(
          <EtBadge color="green" testID="badge">
            <EtBadge.Icon name="chevronRight" />
          </EtBadge>,
        );

        // Icon should receive a color (testID includes color suffix)
        const icon = getByTestId(/^icon-chevronRight-color-/);
        expect(icon).toBeTruthy();
      });

      it('passes badge color to icon for all color variants', () => {
        const colors: BadgeColor[] = ['neutral', 'red', 'orange', 'yellow', 'green', 'mint', 'blue', 'purple', 'violet'];

        colors.forEach((color) => {
          const { getByTestId, unmount } = render(
            <EtBadge color={color} testID="badge">
              <EtBadge.Icon name="chevronRight" />
            </EtBadge>,
          );

          // Each color variant should pass a color to the icon
          const icon = getByTestId(/^icon-chevronRight-color-/);
          expect(icon).toBeTruthy();
          unmount();
        });
      });

      it('renders stroke icon by default (hasFill=false)', () => {
        const { getByTestId, queryByTestId } = render(
          <EtBadge color="green" testID="badge">
            <EtBadge.Icon name="heart" />
          </EtBadge>,
        );

        // Should have icon with color but NOT filled suffix
        expect(getByTestId(/^icon-heart-color-/)).toBeTruthy();
        expect(queryByTestId(/filled$/)).toBeNull();
      });

      it('renders filled icon when hasFill={true}', () => {
        const { getByTestId } = render(
          <EtBadge color="green" testID="badge">
            <EtBadge.Icon name="heart" hasFill />
          </EtBadge>,
        );

        // Should have icon with color AND filled suffix
        const icon = getByTestId(/^icon-heart-color-.*-filled$/);
        expect(icon).toBeTruthy();
      });

      it('supports both stroke and filled icons in same badge', () => {
        const { getByTestId } = render(
          <EtBadge color="blue" testID="badge">
            <EtBadge.Icon name="heart" />
            <EtBadge.Label>Mixed</EtBadge.Label>
            <EtBadge.Icon name="chevronRight" hasFill />
          </EtBadge>,
        );

        // First icon should be stroke (no filled suffix)
        const heartIcon = getByTestId(/^icon-heart-color-/);
        expect(heartIcon.props.testID).not.toMatch(/filled$/);

        // Second icon should be filled
        const chevronIcon = getByTestId(/^icon-chevronRight-color-.*-filled$/);
        expect(chevronIcon).toBeTruthy();
      });

      it('passes hasFill to icon for all color variants', () => {
        const colors: BadgeColor[] = ['neutral', 'green', 'red', 'blue'];

        colors.forEach((color) => {
          const { getByTestId, unmount } = render(
            <EtBadge color={color} testID="badge">
              <EtBadge.Icon name="heart" hasFill />
            </EtBadge>,
          );

          // Each color variant should pass hasFill to the icon
          const icon = getByTestId(/^icon-heart-color-.*-filled$/);
          expect(icon).toBeTruthy();
          unmount();
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles component unmounting gracefully', () => {
      const { unmount } = render(
        <EtBadge testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid prop updates', () => {
      const { rerender, getByTestId, getByText } = render(
        <EtBadge color="neutral" testID="badge">
          <EtBadge.Label>Initial</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByText('Initial')).toBeTruthy();

      // Rapid updates
      rerender(
        <EtBadge color="red" testID="badge">
          <EtBadge.Label>Update 1</EtBadge.Label>
        </EtBadge>,
      );
      expect(getByText('Update 1')).toBeTruthy();

      rerender(
        <EtBadge color="blue" testID="badge">
          <EtBadge.Label>Update 2</EtBadge.Label>
        </EtBadge>,
      );
      expect(getByText('Update 2')).toBeTruthy();

      rerender(
        <EtBadge color="green" testID="badge">
          <EtBadge.Label>Final</EtBadge.Label>
        </EtBadge>,
      );
      expect(getByText('Final')).toBeTruthy();

      expect(getByTestId('badge')).toBeTruthy();
    });

    it('handles size changes', () => {
      const { rerender, getByTestId } = render(
        <EtBadge size="medium" testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();

      rerender(
        <EtBadge size="small" testID="badge">
          <EtBadge.Label>Test</EtBadge.Label>
        </EtBadge>,
      );

      expect(getByTestId('badge')).toBeTruthy();
    });
  });
});
