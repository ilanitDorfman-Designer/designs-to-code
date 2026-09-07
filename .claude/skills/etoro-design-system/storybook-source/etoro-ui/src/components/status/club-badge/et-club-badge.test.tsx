import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { EtClubBadge } from './et-club-badge';

// Capture EtIconV2's `name`, `size`, and `color` props in the testID
// so we can assert the badge wires its lock-fill icon correctly
// without depending on the icon's own rendering implementation.
jest.mock('../../et-icon-v2', () => ({
  EtIconV2: ({ name, size, color }: { name: string; size?: number; color?: string }) => {
    const { View } = require('react-native');
    return <View testID={`icon-${name}-size-${size}-color-${color}`} />;
  },
}));

// Adaptive carbon — picked up by the default (no-`colorScheme`) path.
const MOCK_CARBON_900 = '#1B1E21';
const MOCK_CARBON_900_INVERTED = '#FFFFFF';
const MOCK_PRIMARY_600 = '#00C200';

// Static carbon — picked up by the pinned `colorScheme` paths.
const MOCK_CARBON_STATIC_900 = '#101317';
const MOCK_CARBON_STATIC_050 = '#FAFAFA';

// The "Club" label is rendered inside an `accessible` wrapper with
// `importantForAccessibility="no-hide-descendants"`, so it's hidden
// from the default accessibility-aware queries.
const HIDDEN = { includeHiddenElements: true } as const;

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    dark: false,
    colors: {
      carbon900: '#1B1E21',
      carbon900Inverted: '#FFFFFF',
      carbonStatic900: '#101317',
      carbonStatic050: '#FAFAFA',
      primary600: '#00C200',
      textPrimaryNeutral: '#111111',
      textSecondaryNeutral: '#444444',
      textTertiaryNeutral: '#888888',
    },
  }),
}));

describe('EtClubBadge', () => {
  describe('legacy (default)', () => {
    describe('rendering', () => {
      it('renders the literal "Club" label in carbon900', () => {
        const { getByText } = render(<EtClubBadge />);
        const label = getByText('Club', HIDDEN);
        const flatStyle = StyleSheet.flatten(label.props.style) ?? {};

        expect(flatStyle.color).toBe(MOCK_CARBON_900);
      });

      it('forwards testID to the outer wrapper', () => {
        const { getByTestId } = render(<EtClubBadge testID="club-badge" />);
        expect(getByTestId('club-badge')).toBeTruthy();
      });
    });

    describe('lock variant', () => {
      it('omits the lock icon by default', () => {
        const { queryByTestId } = render(<EtClubBadge />);
        expect(queryByTestId(`icon-lock-fill-size-10-color-${MOCK_CARBON_900}`)).toBeNull();
      });

      it('renders the lock icon in carbon900 when showLock is true', () => {
        const { getByTestId } = render(<EtClubBadge showLock />);
        expect(getByTestId(`icon-lock-fill-size-10-color-${MOCK_CARBON_900}`)).toBeTruthy();
      });

      it('still renders the "Club" label when the lock is shown', () => {
        const { getByText } = render(<EtClubBadge showLock />);
        expect(getByText('Club', HIDDEN)).toBeTruthy();
      });
    });

    describe('accessibility', () => {
      it('announces "eToro Club member" by default (no-lock variant)', () => {
        const { getByLabelText } = render(<EtClubBadge />);
        expect(getByLabelText('eToro Club member')).toBeTruthy();
      });

      it('announces "eToro Club" when the lock is shown', () => {
        const { getByLabelText } = render(<EtClubBadge showLock />);
        expect(getByLabelText('eToro Club')).toBeTruthy();
      });

      it('honors a caller-supplied accessibilityLabel', () => {
        const { getByLabelText } = render(<EtClubBadge accessibilityLabel="Premium membership" />);
        expect(getByLabelText('Premium membership')).toBeTruthy();
      });
    });

    describe('theming', () => {
      it('applies the primary600 border + carbon900Inverted background', () => {
        const { getByTestId } = render(<EtClubBadge testID="club-badge" />);
        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};

        expect(flatStyle.borderColor).toBe(MOCK_PRIMARY_600);
        expect(flatStyle.backgroundColor).toBe(MOCK_CARBON_900_INVERTED);
      });

      it('uses 1px vertical / 5px horizontal padding and 2px gap', () => {
        const { getByTestId } = render(<EtClubBadge testID="club-badge" />);
        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};

        expect(flatStyle.paddingVertical).toBe(1);
        expect(flatStyle.paddingHorizontal).toBe(5);
        expect(flatStyle.gap).toBe(2);
      });
    });

    describe('colorScheme override', () => {
      it('forces the static light appearance when colorScheme="light"', () => {
        const { getByTestId, getByText } = render(<EtClubBadge testID="club-badge" colorScheme="light" showLock />);

        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};
        const labelStyle = StyleSheet.flatten(getByText('Club', HIDDEN).props.style) ?? {};

        expect(flatStyle.borderColor).toBe(MOCK_PRIMARY_600);
        expect(flatStyle.backgroundColor).toBe(MOCK_CARBON_STATIC_050);
        expect(labelStyle.color).toBe(MOCK_CARBON_STATIC_900);
        expect(getByTestId(`icon-lock-fill-size-10-color-${MOCK_CARBON_STATIC_900}`)).toBeTruthy();
      });

      it('forces the static dark appearance when colorScheme="dark"', () => {
        const { getByTestId, getByText } = render(<EtClubBadge testID="club-badge" colorScheme="dark" showLock />);

        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};
        const labelStyle = StyleSheet.flatten(getByText('Club', HIDDEN).props.style) ?? {};

        expect(flatStyle.borderColor).toBe(MOCK_PRIMARY_600);
        expect(flatStyle.backgroundColor).toBe(MOCK_CARBON_STATIC_900);
        expect(labelStyle.color).toBe(MOCK_CARBON_STATIC_050);
        expect(getByTestId(`icon-lock-fill-size-10-color-${MOCK_CARBON_STATIC_050}`)).toBeTruthy();
      });
    });
  });

  describe('v2', () => {
    describe('rendering', () => {
      it('renders the Club wordmark in Playfair italic', () => {
        const { getByText } = render(<EtClubBadge variant="v2" />);
        const label = getByText('Club', HIDDEN);
        const flatStyle = StyleSheet.flatten(label.props.style) ?? {};

        expect(flatStyle.color).toBe(MOCK_CARBON_900);
        expect(flatStyle.fontFamily).toBe('PlayfairDisplay-MediumItalic');
      });
    });

    describe('theming', () => {
      it('applies the carbon900 border', () => {
        const { getByTestId } = render(<EtClubBadge testID="club-badge" variant="v2" />);
        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};

        expect(flatStyle.borderColor).toBe(MOCK_CARBON_900);
      });

      it('uses 1.5px border and 18px height', () => {
        const { getByTestId } = render(<EtClubBadge testID="club-badge" variant="v2" />);
        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};

        expect(flatStyle.borderWidth).toBe(1.5);
        expect(flatStyle.height).toBe(18);
      });
    });

    describe('colorScheme override', () => {
      it('forces the static dark appearance when colorScheme="dark"', () => {
        const { getByTestId } = render(<EtClubBadge testID="club-badge" colorScheme="dark" showLock variant="v2" />);

        const wrapper = getByTestId('club-badge');
        const flatStyle = StyleSheet.flatten(wrapper.props.style) ?? {};

        expect(flatStyle.borderColor).toBe(MOCK_CARBON_STATIC_050);
        expect(getByTestId(`icon-lock-fill-size-10-color-${MOCK_CARBON_STATIC_050}`)).toBeTruthy();
      });
    });
  });
});
