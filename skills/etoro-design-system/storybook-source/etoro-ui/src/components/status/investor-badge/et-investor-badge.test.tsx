import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { EtPopularInvestorBadge, EtProInvestorBadge } from './et-investor-badge';

jest.mock('../../../core/icons/pro-investor', () => ({
  __esModule: true,
  default: ({ size }: { size: number }) => {
    const { View } = require('react-native');
    return <View testID={`pro-investor-icon-${size}`} />;
  },
}));

jest.mock('../../../core/icons/popular-investor', () => ({
  __esModule: true,
  default: ({ size }: { size: number }) => {
    const { View } = require('react-native');
    return <View testID={`popular-investor-icon-${size}`} />;
  },
}));

const HIDDEN = { includeHiddenElements: true } as const;

describe('Investor badges', () => {
  it('renders the Pro badge with its fixed label color', () => {
    const { getByText, getByLabelText } = render(<EtProInvestorBadge />);
    const label = getByText('Pro', HIDDEN);
    const labelStyle = StyleSheet.flatten(label.props.style) ?? {};

    expect(labelStyle.color).toBe('#F1C056');
    expect(labelStyle.lineHeight).toBe(20);
    expect(getByLabelText('Pro')).toBeTruthy();
  });

  it('renders the Popular badge with its fixed label color', () => {
    const { getByText, getByLabelText } = render(<EtPopularInvestorBadge />);
    const label = getByText('Popular', HIDDEN);
    const labelStyle = StyleSheet.flatten(label.props.style) ?? {};

    expect(labelStyle.color).toBe('#9EB1DD');
    expect(labelStyle.lineHeight).toBe(20);
    expect(getByLabelText('Popular')).toBeTruthy();
  });

  it('allows overriding the accessibility label', () => {
    const { getByLabelText } = render(<EtPopularInvestorBadge accessibilityLabel="Popular Investor badge" />);

    expect(getByLabelText('Popular Investor badge')).toBeTruthy();
  });

  it('renders the icon at 18px by default', () => {
    const { getByTestId } = render(<EtPopularInvestorBadge />);

    expect(getByTestId('popular-investor-icon-18')).toBeTruthy();
  });

  it('supports icon-only rendering with a custom icon size', () => {
    const { getByLabelText, getByTestId, queryByText } = render(<EtProInvestorBadge showLabel={false} iconSize={24} />);

    expect(getByTestId('pro-investor-icon-24')).toBeTruthy();
    expect(queryByText('Pro', HIDDEN)).toBeNull();
    expect(getByLabelText('Pro')).toBeTruthy();
  });
});
