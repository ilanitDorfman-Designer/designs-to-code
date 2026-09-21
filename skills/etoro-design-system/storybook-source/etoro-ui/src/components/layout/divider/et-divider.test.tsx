import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { EtDivider } from './et-divider';

const MOCK_DIVIDER_TERTIARY = '#D5D5D5';
const MOCK_TEXT_SECONDARY = '#666666';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      dividerTertiary: '#D5D5D5',
      textSecondaryNeutral: '#666666',
    },
  }),
}));

// The label is rendered with `importantForAccessibility="no-hide-descendants"`,
// so include hidden elements when querying by text.
const HIDDEN = { includeHiddenElements: true } as const;

describe('EtDivider', () => {
  describe('plain (label-less) variant', () => {
    it('renders a single stretched line in dividerTertiary', () => {
      const { getByTestId } = render(<EtDivider testID="divider" />);
      const flatStyle = StyleSheet.flatten(getByTestId('divider', HIDDEN).props.style) ?? {};

      expect(flatStyle.backgroundColor).toBe(MOCK_DIVIDER_TERTIARY);
      expect(flatStyle.height).toBe(1);
      expect(flatStyle.alignSelf).toBe('stretch');
    });

    it('is hidden from accessibility when no label is provided', () => {
      const { getByTestId } = render(<EtDivider testID="divider" />);
      expect(getByTestId('divider', HIDDEN).props.accessibilityElementsHidden).toBe(true);
    });
  });

  describe('labelled variant', () => {
    it('renders the label between two lines', () => {
      const { getByText } = render(<EtDivider label="Or" />);
      const label = getByText('Or', HIDDEN);
      const flatStyle = StyleSheet.flatten(label.props.style) ?? {};

      expect(flatStyle.color).toBe(MOCK_TEXT_SECONDARY);
    });

    it('announces the label by default', () => {
      const { getByLabelText } = render(<EtDivider label="Or" />);
      expect(getByLabelText('Or')).toBeTruthy();
    });

    it('honors a caller-supplied accessibilityLabel', () => {
      const { getByLabelText } = render(<EtDivider label="Or" accessibilityLabel="separator" />);
      expect(getByLabelText('separator')).toBeTruthy();
    });
  });

  describe('color override', () => {
    it('uses the provided color for the line', () => {
      const { getByTestId } = render(<EtDivider testID="divider" color="#FF0000" />);
      const flatStyle = StyleSheet.flatten(getByTestId('divider', HIDDEN).props.style) ?? {};

      expect(flatStyle.backgroundColor).toBe('#FF0000');
    });
  });

  it('forwards testID', () => {
    const { getByTestId } = render(<EtDivider testID="my-divider" label="Or" />);
    expect(getByTestId('my-divider')).toBeTruthy();
  });
});
