import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { EtBottomSheetHeader } from './et-bottom-sheet-header';
import { HEADER_PADDING_BOTTOM, HEADER_PADDING_HORIZONTAL } from './et-bottom-sheet-header.const';

const mockColors = {
  background: '#FFFFFF',
  handle: '#E0E0E0',
  text: '#000000',
  textSecondary: '#666666',
  divider: '#EEEEEE',
};

jest.mock('../../context', () => ({
  useBottomSheetConfig: jest.fn(() => ({
    showHandle: true,
    closeOnBackdrop: true,
    enablePanDownToClose: true,
    colors: mockColors,
  })),
}));

describe('EtBottomSheetHeader', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      const { getByText } = render(
        <EtBottomSheetHeader>
          <Text>Header Content</Text>
        </EtBottomSheetHeader>,
      );

      expect(getByText('Header Content')).toBeTruthy();
    });

    it('renders with custom testID', () => {
      const { getByTestId } = render(
        <EtBottomSheetHeader testID="custom-header">
          <Text>Content</Text>
        </EtBottomSheetHeader>,
      );

      expect(getByTestId('custom-header')).toBeTruthy();
    });

    it('applies background color from context', () => {
      const { getByTestId } = render(
        <EtBottomSheetHeader testID="header">
          <Text>Content</Text>
        </EtBottomSheetHeader>,
      );

      const header = getByTestId('header');
      expect(header.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: mockColors.background,
          }),
        ]),
      );
    });

    it('applies zIndex for stacking context', () => {
      const { getByTestId } = render(
        <EtBottomSheetHeader testID="header">
          <Text>Content</Text>
        </EtBottomSheetHeader>,
      );

      const header = getByTestId('header');
      expect(header.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            zIndex: 1,
          }),
        ]),
      );
    });
  });

  describe('Custom Content (arbitrary children)', () => {
    it('applies default horizontal padding for custom content', () => {
      const { getByTestId } = render(
        <EtBottomSheetHeader testID="header">
          <View testID="custom-content">
            <Text>Custom Content</Text>
          </View>
        </EtBottomSheetHeader>,
      );

      const header = getByTestId('header');
      expect(header.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingHorizontal: HEADER_PADDING_HORIZONTAL,
          }),
        ]),
      );
    });

    it('renders multiple custom children', () => {
      const { getByText } = render(
        <EtBottomSheetHeader>
          <Text>First</Text>
          <Text>Second</Text>
          <Text>Third</Text>
        </EtBottomSheetHeader>,
      );

      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
      expect(getByText('Third')).toBeTruthy();
    });
  });

  describe('Compound children (Title + Action)', () => {
    it('renders Title subcomponent', () => {
      const { getByText } = render(
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>Settings</EtBottomSheetHeader.Title>
        </EtBottomSheetHeader>,
      );

      expect(getByText('Settings')).toBeTruthy();
    });

    it('renders Action subcomponent', () => {
      const handlePress = jest.fn();
      const { getByLabelText } = render(
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Action onPress={handlePress} accessibilityLabel="Close">
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      const action = getByLabelText('Close');
      fireEvent.press(action);
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('renders Title and Action together', () => {
      const handlePress = jest.fn();
      const { getByText, getByLabelText } = render(
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>My Title</EtBottomSheetHeader.Title>
          <EtBottomSheetHeader.Action onPress={handlePress} accessibilityLabel="Close">
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      expect(getByText('My Title')).toBeTruthy();
      expect(getByLabelText('Close')).toBeTruthy();
    });

    it('uses compound row layout when compound children detected', () => {
      const { getByTestId } = render(
        <EtBottomSheetHeader testID="header">
          <EtBottomSheetHeader.Title>Title</EtBottomSheetHeader.Title>
          <EtBottomSheetHeader.Action onPress={() => undefined} accessibilityLabel="Close">
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      const header = getByTestId('header');
      expect(header.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            flexDirection: 'row',
            paddingBottom: HEADER_PADDING_BOTTOM,
          }),
        ]),
      );
    });

    it('positions Action at trailing edge', () => {
      const { getByText } = render(
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>Title</EtBottomSheetHeader.Title>
          <EtBottomSheetHeader.Action onPress={() => undefined} accessibilityLabel="Close">
            <Text>CloseBtn</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      expect(getByText('CloseBtn')).toBeTruthy();
    });

    it('supports multiple Action subcomponents', () => {
      const { getByLabelText } = render(
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>Title</EtBottomSheetHeader.Title>
          <EtBottomSheetHeader.Action onPress={() => undefined} accessibilityLabel="Favorite">
            <Text>Star</Text>
          </EtBottomSheetHeader.Action>
          <EtBottomSheetHeader.Action onPress={() => undefined} accessibilityLabel="Close">
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      expect(getByLabelText('Favorite')).toBeTruthy();
      expect(getByLabelText('Close')).toBeTruthy();
    });

    it('renders non-Title/Action custom content alongside Action', () => {
      const { getByText, getByLabelText } = render(
        <EtBottomSheetHeader>
          <View>
            <Text>Custom Content</Text>
          </View>
          <EtBottomSheetHeader.Action onPress={() => undefined} accessibilityLabel="Close">
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      expect(getByText('Custom Content')).toBeTruthy();
      expect(getByLabelText('Close')).toBeTruthy();
    });
  });

  describe('Title subcomponent', () => {
    it('has correct displayName', () => {
      expect(EtBottomSheetHeader.Title.displayName).toBe('EtBottomSheet.Header.Title');
    });
  });

  describe('Action subcomponent', () => {
    it('has correct displayName', () => {
      expect(EtBottomSheetHeader.Action.displayName).toBe('EtBottomSheet.Header.Action');
    });

    it('has button accessibility role', () => {
      const { getByRole } = render(
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Action onPress={() => undefined}>
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>,
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Style Props', () => {
    it('applies custom style prop', () => {
      const customStyle = { borderBottomWidth: 1, borderBottomColor: '#000' };

      const { getByTestId } = render(
        <EtBottomSheetHeader testID="header" style={customStyle}>
          <Text>Content</Text>
        </EtBottomSheetHeader>,
      );

      const header = getByTestId('header');
      expect(header.props.style).toEqual(expect.arrayContaining([customStyle]));
    });

    it('merges custom style with default styles', () => {
      const customStyle = { marginTop: 20 };

      const { getByTestId } = render(
        <EtBottomSheetHeader testID="header" style={customStyle}>
          <Text>Content</Text>
        </EtBottomSheetHeader>,
      );

      const header = getByTestId('header');
      expect(header.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ backgroundColor: mockColors.background }), customStyle]));
    });
  });

  describe('displayName', () => {
    it('has correct displayName on root', () => {
      expect(EtBottomSheetHeader.displayName).toBe('EtBottomSheet.Header');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { getByTestId } = render(<EtBottomSheetHeader testID="header">{null}</EtBottomSheetHeader>);

      expect(getByTestId('header')).toBeTruthy();
    });

    it('handles undefined children', () => {
      const { getByTestId } = render(<EtBottomSheetHeader testID="header">{undefined}</EtBottomSheetHeader>);

      expect(getByTestId('header')).toBeTruthy();
    });

    it('handles mixed valid and invalid children', () => {
      const { getByTestId, getByText } = render(
        <EtBottomSheetHeader testID="header">
          {null}
          <Text>Valid</Text>
          {undefined}
          {false}
        </EtBottomSheetHeader>,
      );

      expect(getByTestId('header')).toBeTruthy();
      expect(getByText('Valid')).toBeTruthy();
    });
  });
});
