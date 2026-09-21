import { fireEvent, render } from '@testing-library/react-native';

import { EtAlertBanner } from './et-alert-banner';
import { getAlertBannerSeverityStyles } from './et-alert-banner.styles';

const themeMock = {
  colors: {
    accentF100: '#accentF100',
    accentG700: '#accentG700',
    textPrimaryNeutral: '#textPrimary',
    primary600: '#primary600',
  },
};

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => themeMock,
}));

// The CTA is an EtButton, which fires light haptics on press — stub the native module
// like the sibling component tests do.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('../../../foundations/text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtText: ({ children, testID }: { children?: React.ReactNode; testID?: string }) => React.createElement(Text, { testID }, children),
  };
});

jest.mock('../../et-icon-v2', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    EtIconV2: ({ name, color, testID }: { name: string; color?: string; testID?: string }) =>
      React.createElement(View, { testID: testID ?? `icon-${name}`, accessibilityLabel: `icon-${name}`, color }),
  };
});

describe('EtAlertBanner', () => {
  const onCtaPress = jest.fn();
  const onPress = jest.fn();

  const defaultProps = {
    severity: 'warning' as const,
    icon: 'info-circle',
    title: 'Account Liquidated',
    description: "You can't perform any trading activity until you deposit.",
    ctaLabel: 'Learn More',
    onCtaPress,
    testID: 'alert-banner',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN default props WHEN rendered THEN it shows title, description, and CTA label', () => {
    const { getByText } = render(<EtAlertBanner {...defaultProps} />);

    expect(getByText('Account Liquidated')).toBeTruthy();
    expect(getByText("You can't perform any trading activity until you deposit.")).toBeTruthy();
    expect(getByText('Learn More')).toBeTruthy();
  });

  it('GIVEN a ctaLabel WHEN the CTA is pressed THEN onCtaPress fires', () => {
    const { getByTestId } = render(<EtAlertBanner {...defaultProps} />);

    fireEvent.press(getByTestId('alert-banner-cta'));

    expect(onCtaPress).toHaveBeenCalledTimes(1);
  });

  it('GIVEN no ctaLabel WHEN rendered THEN no CTA is shown', () => {
    const { queryByText, queryByTestId } = render(<EtAlertBanner {...defaultProps} ctaLabel={undefined} />);

    expect(queryByText('Learn More')).toBeNull();
    expect(queryByTestId('alert-banner-cta')).toBeNull();
  });

  it('GIVEN an onPress handler WHEN the whole banner is pressed THEN onPress fires', () => {
    const { getByTestId } = render(<EtAlertBanner {...defaultProps} onPress={onPress} />);

    fireEvent.press(getByTestId('alert-banner-pressable'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('GIVEN no onPress handler WHEN rendered THEN the banner is a static (non-pressable) container', () => {
    const { queryByTestId } = render(<EtAlertBanner {...defaultProps} />);

    expect(queryByTestId('alert-banner-pressable')).toBeNull();
  });

  it('GIVEN warning severity WHEN rendered THEN it uses the warning color tokens', () => {
    const warning = getAlertBannerSeverityStyles('warning', themeMock.colors as never);

    const { getByTestId } = render(<EtAlertBanner {...defaultProps} />);

    expect(getByTestId('alert-banner').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: warning.backgroundColor })]),
    );
  });

  it('GIVEN warning severity WHEN rendered THEN the icon uses the severity icon color', () => {
    const warning = getAlertBannerSeverityStyles('warning', themeMock.colors as never);

    const { getByTestId } = render(<EtAlertBanner {...defaultProps} />);

    expect(getByTestId('icon-info-circle').props.color).toBe(warning.iconColor);
  });

  it('GIVEN no accessibilityLabel prop WHEN rendered THEN it derives one from title + description', () => {
    const { getByTestId } = render(<EtAlertBanner {...defaultProps} />);

    const root = getByTestId('alert-banner');
    expect(root.props.accessibilityRole).toBe('alert');
    expect(root.props.accessibilityLabel).toBe("Account Liquidated. You can't perform any trading activity until you deposit.");
  });
});
