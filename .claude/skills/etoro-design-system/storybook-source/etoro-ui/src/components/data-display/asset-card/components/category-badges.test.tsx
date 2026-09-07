import { render } from '@testing-library/react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { CategoryBadges } from './category-badges';

// Mock dependencies
jest.mock('../../../../foundations/text', () => ({
  EtText: ({ children }: any) => children,
}));

const mockColors = colorsMock.colors;

describe('CategoryBadges', () => {
  const defaultProps = {
    categories: [
      { label: 'Technology', backgroundColor: '#0066CC', color: '#FFFFFF' },
      { label: 'Growth', backgroundColor: '#00AA44', color: '#FFFFFF' },
    ],
    colors: mockColors,
  };

  describe('Basic Rendering', () => {
    it('should render without crashing with categories', () => {
      const { toJSON } = render(<CategoryBadges {...defaultProps} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should return null when categories array is empty', () => {
      const { toJSON } = render(<CategoryBadges categories={[]} colors={mockColors} />);
      expect(toJSON()).toBeNull();
    });

    it('should return null when categories is undefined', () => {
      const { toJSON } = render(<CategoryBadges categories={undefined as any} colors={mockColors} />);
      expect(toJSON()).toBeNull();
    });

    it('should return null when categories is null', () => {
      const { toJSON } = render(<CategoryBadges categories={null as any} colors={mockColors} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('Category Handling', () => {
    it('should render single category', () => {
      const categories = [{ label: 'Finance', backgroundColor: '#FF6600', color: '#FFFFFF' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render multiple categories', () => {
      const categories = [
        { label: 'Tech', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: 'Value', backgroundColor: '#CC6600', color: '#FFFFFF' },
        { label: 'Dividend', backgroundColor: '#006600', color: '#FFFFFF' },
        { label: 'ESG', backgroundColor: '#660066', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle category with only label', () => {
      const categories = [{ label: 'Basic' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle category with custom colors', () => {
      const categories = [
        {
          label: 'Custom',
          backgroundColor: '#PURPLE',
          color: '#YELLOW',
        },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle mixed categories with and without colors', () => {
      const categories = [
        { label: 'WithColors', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: 'NoColors' },
        { label: 'OnlyBackground', backgroundColor: '#CC6600' },
        { label: 'OnlyColor', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Label Content', () => {
    it('should handle empty label', () => {
      const categories = [{ label: '', backgroundColor: '#0066CC', color: '#FFFFFF' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle long labels', () => {
      const categories = [
        {
          label: 'Very Long Category Name That Might Wrap',
          backgroundColor: '#0066CC',
          color: '#FFFFFF',
        },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle special characters in labels', () => {
      const categories = [
        { label: 'Tech & AI', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: 'S&P 500', backgroundColor: '#CC6600', color: '#FFFFFF' },
        { label: 'ESG/SRI', backgroundColor: '#006600', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle numeric labels', () => {
      const categories = [
        { label: '2024', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: '100%', backgroundColor: '#CC6600', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle unicode labels', () => {
      const categories = [
        { label: '🚀 Growth', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: '💎 Value', backgroundColor: '#CC6600', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Fallback Colors', () => {
    it('should handle missing backgroundColor', () => {
      const categories = [{ label: 'NoBackground', color: '#FFFFFF' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle missing text color', () => {
      const categories = [{ label: 'NoTextColor', backgroundColor: '#0066CC' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle missing both colors', () => {
      const categories = [{ label: 'NoColors' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle undefined colors', () => {
      const categories = [
        {
          label: 'UndefinedColors',
          backgroundColor: undefined,
          color: undefined,
        },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle many categories', () => {
      const categories = Array.from({ length: 50 }, (_, i) => ({
        label: `Category ${i + 1}`,
        backgroundColor: `#${(i * 100000).toString(16).padStart(6, '0')}`,
        color: '#FFFFFF',
      }));

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle categories with null values', () => {
      const categories = [
        { label: 'Valid', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: null as any, backgroundColor: '#CC6600', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle duplicate category labels', () => {
      const categories = [
        { label: 'Duplicate', backgroundColor: '#0066CC', color: '#FFFFFF' },
        { label: 'Duplicate', backgroundColor: '#CC6600', color: '#FFFFFF' },
        { label: 'Duplicate', backgroundColor: '#006600', color: '#FFFFFF' },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Color Themes', () => {
    it('should work with different color themes', () => {
      const darkColors = colorsMock.colors;

      const categories = [{ label: 'Dark Theme' }];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={darkColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle all props together', () => {
      const categories = [
        {
          label: 'Complete',
          backgroundColor: '#0066CC',
          color: '#FFFFFF',
        },
      ];

      const { toJSON } = render(<CategoryBadges categories={categories} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render consistently with same props', () => {
      const { toJSON: first } = render(<CategoryBadges {...defaultProps} />);
      const { toJSON: second } = render(<CategoryBadges {...defaultProps} />);

      expect(first()).toEqual(second());
    });
  });
});
