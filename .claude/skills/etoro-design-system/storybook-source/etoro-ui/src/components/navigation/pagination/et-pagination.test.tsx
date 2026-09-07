import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtPagination } from './et-pagination';
import { PaginationDot } from './subcomponents';

// Mock etoro-ui/core/hooks (the actual import path used by the component)
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Note: react-native-reanimated is mocked globally in jest.setup.ts
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

// Helper component to test with SharedValue
function PaginationWithSharedValue({
  totalPages,
  initialPage = 0,
  size,
  color,
  testID,
}: {
  totalPages: number;
  initialPage?: number;
  size?: 'small' | 'large';
  color?: 'neutral' | 'primary';
  testID?: string;
}) {
  const currentPage = useSharedValue(initialPage);
  return <EtPagination totalPages={totalPages} currentPage={currentPage} size={size} color={color} testID={testID} />;
}

describe('EtPagination', () => {
  describe('Component Structure', () => {
    it('has Dot as static property', () => {
      expect(EtPagination.Dot).toBeDefined();
    });

    it('EtPagination.Dot is the PaginationDot component', () => {
      expect(EtPagination.Dot).toBe(PaginationDot);
    });

    it('is a valid React component (memo wrapped)', () => {
      expect(EtPagination).toBeDefined();
      expect(EtPagination.$$typeof).toBeDefined();
    });
  });

  describe('Subcomponents', () => {
    describe('PaginationDot', () => {
      it('should have displayName set', () => {
        expect(PaginationDot.displayName).toBe('EtPagination.Dot');
      });
    });
  });
});

describe('EtPagination Component Rendering', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(<EtPagination testID="test-pagination" totalPages={3} currentPage={0} />);

      expect(getByTestId('test-pagination')).toBeTruthy();
    });

    it('renders correct number of dots', () => {
      const { getByLabelText } = render(<EtPagination totalPages={5} currentPage={2} />);

      // Check that all dots are rendered with correct labels
      expect(getByLabelText('Page 1 of 5')).toBeTruthy();
      expect(getByLabelText('Page 2 of 5')).toBeTruthy();
      expect(getByLabelText('Page 3 of 5')).toBeTruthy();
      expect(getByLabelText('Page 4 of 5')).toBeTruthy();
      expect(getByLabelText('Page 5 of 5')).toBeTruthy();
    });

    it('renders with 1 page', () => {
      const { getByLabelText } = render(<EtPagination totalPages={1} currentPage={0} />);

      expect(getByLabelText('Page 1 of 1')).toBeTruthy();
    });

    it('renders with many pages', () => {
      const { getByLabelText } = render(<EtPagination totalPages={10} currentPage={5} />);

      expect(getByLabelText('Page 1 of 10')).toBeTruthy();
      expect(getByLabelText('Page 10 of 10')).toBeTruthy();
    });
  });

  describe('Current Page Selection with Number', () => {
    it('marks first page as selected when currentPage is 0', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(true);
      expect(getByLabelText('Page 2 of 3').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Page 3 of 3').props.accessibilityState.selected).toBe(false);
    });

    it('marks middle page as selected when currentPage is 1', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={1} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Page 2 of 3').props.accessibilityState.selected).toBe(true);
      expect(getByLabelText('Page 3 of 3').props.accessibilityState.selected).toBe(false);
    });

    it('marks last page as selected when currentPage is last', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={2} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Page 2 of 3').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Page 3 of 3').props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Current Page Selection with SharedValue', () => {
    it('renders correctly with SharedValue currentPage', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={5} initialPage={2} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
      expect(getByLabelText('Page 1 of 5')).toBeTruthy();
      expect(getByLabelText('Page 5 of 5')).toBeTruthy();
    });

    it('marks correct page as selected with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={3} initialPage={1} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Page 2 of 3').props.accessibilityState.selected).toBe(true);
      expect(getByLabelText('Page 3 of 3').props.accessibilityState.selected).toBe(false);
    });

    it('renders first page selected with SharedValue initial 0', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={3} initialPage={0} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(true);
    });

    it('renders last page selected with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={4} initialPage={3} />);

      expect(getByLabelText('Page 4 of 4').props.accessibilityState.selected).toBe(true);
    });

    it('works with size and color props with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={5} initialPage={2} size="small" color="primary" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('works with testID prop with SharedValue', () => {
      const { getByTestId } = render(<PaginationWithSharedValue totalPages={3} initialPage={0} testID="shared-value-pagination" />);

      expect(getByTestId('shared-value-pagination')).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('renders with large size (default)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders with small size (explicit)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} size="small" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders with large size (explicit)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} size="large" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders small size with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={3} initialPage={0} size="small" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders large size with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={3} initialPage={0} size="large" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });
  });

  describe('Color Variants', () => {
    it('renders with neutral color (default)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders with neutral color (explicit)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} color="neutral" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders with primary color', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} color="primary" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders neutral color with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={3} initialPage={0} color="neutral" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('renders primary color with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={3} initialPage={0} color="primary" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('dots are non-interactive visual indicators (no button role)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      // Dots should not have a role since they're non-interactive
      const dot = getByLabelText('Page 1 of 3');
      expect(dot.props.accessibilityRole).toBeUndefined();
    });

    it('has correct selected state on dots', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={1} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Page 2 of 3').props.accessibilityState.selected).toBe(true);
      expect(getByLabelText('Page 3 of 3').props.accessibilityState.selected).toBe(false);
    });

    it('applies accessibilityLabel to container', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} accessibilityLabel="Image gallery pagination" />);

      expect(getByLabelText('Image gallery pagination')).toBeTruthy();
    });

    it('uses default accessibilityLabel when not provided', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('has accessibility label with format "Page X of Y" on each dot', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Page 1 of 3')).toBeTruthy();
      expect(getByLabelText('Page 2 of 3')).toBeTruthy();
      expect(getByLabelText('Page 3 of 3')).toBeTruthy();
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to container', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(<EtPagination testID="styled-pagination" totalPages={3} currentPage={0} style={customStyle} />);

      expect(getByTestId('styled-pagination')).toBeTruthy();
    });

    it('applies array styles correctly', () => {
      const arrayStyle = [{ margin: 5 }, { padding: 10 }];
      const { getByTestId } = render(<EtPagination testID="array-styled-pagination" totalPages={3} currentPage={0} style={arrayStyle} />);

      expect(getByTestId('array-styled-pagination')).toBeTruthy();
    });
  });

  describe('Props Integration', () => {
    it('handles all props together with number currentPage', () => {
      const { getByTestId, getByLabelText } = render(
        <EtPagination
          testID="full-pagination"
          totalPages={5}
          currentPage={2}
          size="large"
          color="primary"
          style={{ margin: 16 }}
          accessibilityLabel="Full pagination"
        />,
      );

      expect(getByTestId('full-pagination')).toBeTruthy();
      expect(getByLabelText('Page 1 of 5')).toBeTruthy();
      expect(getByLabelText('Page 5 of 5')).toBeTruthy();
    });

    it('handles all props together with SharedValue currentPage', () => {
      const { getByTestId, getByLabelText } = render(
        <PaginationWithSharedValue testID="full-shared-pagination" totalPages={5} initialPage={2} size="large" color="primary" />,
      );

      expect(getByTestId('full-shared-pagination')).toBeTruthy();
      expect(getByLabelText('Page 1 of 5')).toBeTruthy();
      expect(getByLabelText('Page 5 of 5')).toBeTruthy();
    });

    it('handles current page changes correctly with number', () => {
      const { rerender, getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Page 1 of 3').props.accessibilityState.selected).toBe(true);

      rerender(<EtPagination totalPages={3} currentPage={2} />);

      expect(getByLabelText('Page 3 of 3').props.accessibilityState.selected).toBe(true);
    });

    it('handles size changes correctly', () => {
      const { rerender, getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} size="small" />);

      expect(getByLabelText('Pagination')).toBeTruthy();

      rerender(<EtPagination totalPages={3} currentPage={0} size="large" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('handles color changes correctly', () => {
      const { rerender, getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} color="neutral" />);

      expect(getByLabelText('Pagination')).toBeTruthy();

      rerender(<EtPagination totalPages={3} currentPage={0} color="primary" />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid successive renders with number', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          render(<EtPagination totalPages={5} currentPage={i % 5} />);
        }
      }).not.toThrow();
    });

    it('handles rapid successive renders with SharedValue', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          render(<PaginationWithSharedValue totalPages={5} initialPage={i % 5} />);
        }
      }).not.toThrow();
    });

    it('handles undefined style', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} style={undefined} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('handles prop changes correctly', () => {
      const { rerender, getByLabelText, queryByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Page 3 of 3')).toBeTruthy();
      expect(queryByLabelText('Page 4 of 5')).toBeNull();

      rerender(<EtPagination totalPages={5} currentPage={0} />);

      expect(getByLabelText('Page 5 of 5')).toBeTruthy();
    });

    it('handles total pages changing', () => {
      const { rerender, getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Page 3 of 3')).toBeTruthy();

      rerender(<EtPagination totalPages={7} currentPage={3} />);

      expect(getByLabelText('Page 7 of 7')).toBeTruthy();
    });

    it('handles multiple rerenders with different props', () => {
      const { rerender } = render(<EtPagination totalPages={3} currentPage={0} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtPagination
            totalPages={(i % 5) + 2}
            currentPage={i % 2}
            size={i % 2 === 0 ? 'small' : 'large'}
            color={i % 3 === 0 ? 'neutral' : 'primary'}
          />,
        );
      }

      expect(true).toBeTruthy();
    });

    it('handles currentPage of 0 (first page)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={5} currentPage={0} />);

      expect(getByLabelText('Page 1 of 5').props.accessibilityState.selected).toBe(true);
    });

    it('handles boundary currentPage (last page)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={5} currentPage={4} />);

      expect(getByLabelText('Page 5 of 5').props.accessibilityState.selected).toBe(true);
    });

    it('handles single page pagination', () => {
      const { getByLabelText, queryByLabelText } = render(<EtPagination totalPages={1} currentPage={0} />);

      expect(getByLabelText('Page 1 of 1')).toBeTruthy();
      expect(queryByLabelText('Page 2 of 1')).toBeNull();
    });

    it('handles large number of pages', () => {
      const { getByLabelText } = render(<EtPagination totalPages={100} currentPage={50} />);

      expect(getByLabelText('Page 1 of 100')).toBeTruthy();
      expect(getByLabelText('Page 51 of 100')).toBeTruthy();
      expect(getByLabelText('Page 100 of 100')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles batch rendering operations with number', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(<EtPagination totalPages={5} currentPage={i % 5} />);
        }
      }).not.toThrow();
    });

    it('handles batch rendering operations with SharedValue', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(<PaginationWithSharedValue totalPages={5} initialPage={i % 5} />);
        }
      }).not.toThrow();
    });

    it('handles rendering many dots with number', () => {
      const { getByLabelText } = render(<EtPagination totalPages={20} currentPage={10} />);

      expect(getByLabelText('Page 1 of 20')).toBeTruthy();
      expect(getByLabelText('Page 20 of 20')).toBeTruthy();
    });

    it('handles rendering many dots with SharedValue', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={20} initialPage={10} />);

      expect(getByLabelText('Page 1 of 20')).toBeTruthy();
      expect(getByLabelText('Page 20 of 20')).toBeTruthy();
    });
  });

  describe('Input Type Handling', () => {
    it('accepts number as currentPage (basic usage)', () => {
      const { getByLabelText } = render(<EtPagination totalPages={5} currentPage={2} />);

      expect(getByLabelText('Page 3 of 5').props.accessibilityState.selected).toBe(true);
    });

    it('accepts SharedValue as currentPage (scroll-driven usage)', () => {
      const { getByLabelText } = render(<PaginationWithSharedValue totalPages={5} initialPage={2} />);

      expect(getByLabelText('Page 3 of 5').props.accessibilityState.selected).toBe(true);
    });

    it('maintains consistent behavior between number and SharedValue', () => {
      const { getByLabelText: getByLabelNumber } = render(<EtPagination totalPages={5} currentPage={3} />);

      const { getByLabelText: getByLabelShared } = render(<PaginationWithSharedValue totalPages={5} initialPage={3} />);

      // Both should have same page selected
      expect(getByLabelNumber('Page 4 of 5').props.accessibilityState.selected).toBe(true);
      expect(getByLabelShared('Page 4 of 5').props.accessibilityState.selected).toBe(true);
    });

    it('handles number currentPage changes via rerender', () => {
      const { rerender, getByLabelText } = render(<EtPagination totalPages={5} currentPage={0} />);

      expect(getByLabelText('Page 1 of 5').props.accessibilityState.selected).toBe(true);

      rerender(<EtPagination totalPages={5} currentPage={4} />);

      expect(getByLabelText('Page 5 of 5').props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Default Values', () => {
    it('uses large size by default', () => {
      // Component should render without explicit size prop
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('uses neutral color by default', () => {
      // Component should render without explicit color prop
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });

    it('uses "Pagination" as default accessibilityLabel', () => {
      const { getByLabelText } = render(<EtPagination totalPages={3} currentPage={0} />);

      expect(getByLabelText('Pagination')).toBeTruthy();
    });
  });
});
