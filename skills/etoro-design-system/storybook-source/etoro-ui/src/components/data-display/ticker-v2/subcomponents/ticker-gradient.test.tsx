import { render } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';

import { TickerGradient } from './ticker-gradient';

// Mock MaskedView
jest.mock('@react-native-masked-view/masked-view', () => {
  const MockView = require('react-native').View;
  return {
    __esModule: true,
    default: ({ children, maskElement, ...props }: any) => (
      <MockView testID="masked-view" {...props}>
        <MockView testID="mask-element">{maskElement}</MockView>
        <MockView testID="masked-content">{children}</MockView>
      </MockView>
    ),
  };
});

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ colors, style, ...props }: any) => {
    const MockView = require('react-native').View;
    return <MockView testID="linear-gradient" {...props} accessibilityLabel={`gradient-${colors.join('-')}`} style={style} />;
  },
}));

describe('TickerGradient', () => {
  describe('Basic rendering', () => {
    it('should render MaskedView wrapper', () => {
      const { getByTestId } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      expect(getByTestId('masked-view')).toBeDefined();
    });

    it('should render children inside masked content', () => {
      const { getByTestId } = render(
        <TickerGradient>
          <View testID="child-content" />
        </TickerGradient>,
      );

      expect(getByTestId('masked-content')).toBeDefined();
      expect(getByTestId('child-content')).toBeDefined();
    });

    it('should render mask element', () => {
      const { getByTestId } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      expect(getByTestId('mask-element')).toBeDefined();
    });
  });

  describe('Default gradient (both sides)', () => {
    it('should render left gradient by default', () => {
      const { getAllByLabelText } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      const leftGradient = getAllByLabelText('gradient-transparent-black');
      expect(leftGradient.length).toBeGreaterThan(0);
    });

    it('should render right gradient by default', () => {
      const { getAllByLabelText } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      const rightGradient = getAllByLabelText('gradient-black-transparent');
      expect(rightGradient.length).toBeGreaterThan(0);
    });

    it('should render center opaque section', () => {
      const { getByTestId } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      const maskElement = getByTestId('mask-element');
      // Center mask should exist in the mask structure
      expect(maskElement).toBeDefined();
    });

    it('should keep mask layout LTR so edge fades stay on physical left/right in RTL', () => {
      const { getByTestId } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      const maskElement = getByTestId('mask-element');
      const maskContainer = maskElement.children[0] as { props: { style: unknown } };
      const style = StyleSheet.flatten(maskContainer.props.style);
      expect(style.direction).toBe('ltr');
      expect(style.flexDirection).toBe('row');
    });
  });

  describe('rightOnly prop', () => {
    it('should not render left gradient when rightOnly is true', () => {
      const { queryAllByLabelText } = render(
        <TickerGradient rightOnly={true}>
          <View testID="content" />
        </TickerGradient>,
      );

      const leftGradients = queryAllByLabelText('gradient-transparent-black');
      expect(leftGradients).toHaveLength(0);
    });

    it('should still render right gradient when rightOnly is true', () => {
      const { getAllByLabelText } = render(
        <TickerGradient rightOnly={true}>
          <View testID="content" />
        </TickerGradient>,
      );

      const rightGradients = getAllByLabelText('gradient-black-transparent');
      expect(rightGradients.length).toBeGreaterThan(0);
    });

    it('should render both gradients when rightOnly is false', () => {
      const { getAllByLabelText } = render(
        <TickerGradient rightOnly={false}>
          <View testID="content" />
        </TickerGradient>,
      );

      const leftGradients = getAllByLabelText('gradient-transparent-black');
      const rightGradients = getAllByLabelText('gradient-black-transparent');

      expect(leftGradients.length).toBeGreaterThan(0);
      expect(rightGradients.length).toBeGreaterThan(0);
    });
  });

  describe('width prop', () => {
    it('should use default width of 30px', () => {
      const { getAllByTestId } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      const gradients = getAllByTestId('linear-gradient');
      expect(gradients.length).toBeGreaterThan(0);
      // Check first gradient has default width
      const firstGradientStyle = gradients[0].props.style;
      const width = Array.isArray(firstGradientStyle) ? firstGradientStyle.find((s) => s?.width)?.width : firstGradientStyle?.width;
      expect(width).toBe(30);
    });

    it('should accept custom width', () => {
      const { getAllByTestId } = render(
        <TickerGradient width={50}>
          <View testID="content" />
        </TickerGradient>,
      );

      const gradients = getAllByTestId('linear-gradient');
      expect(gradients.length).toBeGreaterThan(0);
      // Check first gradient has custom width
      const firstGradientStyle = gradients[0].props.style;
      const width = Array.isArray(firstGradientStyle) ? firstGradientStyle.find((s) => s?.width)?.width : firstGradientStyle?.width;
      expect(width).toBe(50);
    });
  });

  describe('Gradient colors', () => {
    it('should use transparent and black for mask gradients', () => {
      const { getAllByTestId } = render(
        <TickerGradient>
          <View testID="content" />
        </TickerGradient>,
      );

      const gradients = getAllByTestId('linear-gradient');
      // All gradients should use black/transparent (for masking)
      gradients.forEach((gradient) => {
        const label = gradient.props.accessibilityLabel;
        expect(label === 'gradient-transparent-black' || label === 'gradient-black-transparent').toBe(true);
      });
    });
  });

  describe('DisplayName', () => {
    it('should have correct displayName', () => {
      expect(TickerGradient.displayName).toBe('EtTicker.Gradient');
    });
  });
});
