import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { getFlagComponent } from '../../core/country-flags';
import { EtCountryFlag } from './et-country-flag';

// Mock the flag registry — return a mock SVG component for known codes + 'zz' fallback
jest.mock('../../core/country-flags', () => {
  const { View } = require('react-native');
  const mockFlagComponent = (props: any) => <View testID="mock-flag-svg" {...props} />;
  const mockFallbackComponent = (props: any) => <View testID="mock-fallback-svg" {...props} />;
  return {
    getFlagComponent: jest.fn((code: string) => {
      const knownCodes = ['il', 'us', 'gb'];
      if (knownCodes.includes(code.toLowerCase())) return mockFlagComponent;
      if (code.toLowerCase() === 'zz') return mockFallbackComponent;
      return undefined;
    }),
  };
});

const mockGetFlagComponent = getFlagComponent as jest.MockedFunction<typeof getFlagComponent>;

describe('EtCountryFlag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders a flag for a valid ISO code', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag).toBeTruthy();

      // Verify the correct flag component was resolved (not fallback)
      expect(mockGetFlagComponent).toHaveBeenCalledWith('IL');
      expect(mockGetFlagComponent).not.toHaveBeenCalledWith('zz');
    });

    it('renders fallback (zz) flag for an unknown ISO code', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="XX" testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag).toBeTruthy();

      // Verify fallback was triggered: first call returns undefined, then 'zz' is used
      expect(mockGetFlagComponent).toHaveBeenCalledWith('XX');
      expect(mockGetFlagComponent).toHaveBeenCalledWith('zz');
    });

    it('renders different flags for different ISO codes', () => {
      const { getByTestId: getByTestIdUS } = render(<EtCountryFlag isoCode="US" testID="flag-us" />);
      const { getByTestId: getByTestIdGB } = render(<EtCountryFlag isoCode="GB" testID="flag-gb" />);

      expect(getByTestIdUS('flag-us')).toBeTruthy();
      expect(getByTestIdGB('flag-gb')).toBeTruthy();
    });

    it('handles lowercase ISO codes (case-insensitive)', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="il" testID="flag" />);

      expect(getByTestId('flag')).toBeTruthy();
    });

    it('handles mixed-case ISO codes', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="Us" testID="flag" />);

      expect(getByTestId('flag')).toBeTruthy();
    });
  });

  describe('Size', () => {
    it('uses default circular size (36px)', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag.props.width).toBe(36);
      expect(flag.props.height).toBe(36);
    });

    it('scales with custom size', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" size={20} testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag.props.width).toBe(20);
      expect(flag.props.height).toBe(20);
    });

    it('handles small sizes', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" size={14} testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag.props.width).toBe(14);
      expect(flag.props.height).toBe(14);
    });
  });

  describe('Accessibility', () => {
    it('defaults accessibilityLabel to isoCode', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag.props.accessibilityLabel).toBe('IL');
    });

    it('uses custom accessibilityLabel when provided', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" accessibilityLabel="Israel" testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag.props.accessibilityLabel).toBe('Israel');
    });

    it('has image accessibility role', () => {
      const { getByTestId } = render(<EtCountryFlag isoCode="IL" testID="flag" />);

      const flag = getByTestId('flag');
      expect(flag.props.accessibilityRole).toBe('image');
    });
  });

  describe('displayName', () => {
    it('has correct displayName on inner component', () => {
      const innerType = (EtCountryFlag as any).type;
      expect(innerType?.displayName).toBe('EtCountryFlag');
    });
  });
});
