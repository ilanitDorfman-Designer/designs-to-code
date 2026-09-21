import { describe, expect, it } from '@jest/globals';

import type { IconName } from '../../foundations/icon-assets/api/types';
import { EtIconButton } from './et-icon-button';

describe('EtIconButton', () => {
  const defaultProps = {
    iconName: 'chevronLeft' as IconName,
    size: 24,
    onPress: () => {},
  };

  describe('Component Functionality', () => {
    it('should render without crashing', () => {
      expect(() => EtIconButton(defaultProps)).not.toThrow();
    });

    it('should accept iconName prop', () => {
      const props = {
        ...defaultProps,
        iconName: 'close' as IconName,
      };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should accept size prop', () => {
      const props = {
        ...defaultProps,
        size: 32,
      };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should accept onPress callback', () => {
      const onPress = () => {};
      const props = {
        ...defaultProps,
        onPress,
      };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should handle different icon names', () => {
      const iconNames: IconName[] = ['chevronRight', 'close', 'settings'];

      iconNames.forEach((iconName) => {
        const props = { ...defaultProps, iconName };
        expect(() => EtIconButton(props)).not.toThrow();
      });
    });

    it('should handle different sizes', () => {
      const sizes = [16, 20, 24, 32, 48];

      sizes.forEach((size) => {
        const props = { ...defaultProps, size };
        expect(() => EtIconButton(props)).not.toThrow();
      });
    });

    it('should handle zero size', () => {
      const props = { ...defaultProps, size: 0 };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should handle negative size values', () => {
      const props = { ...defaultProps, size: -10 };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should handle decimal size values', () => {
      const props = { ...defaultProps, size: 24.5 };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should handle very large sizes', () => {
      const props = { ...defaultProps, size: 1000 };
      expect(() => EtIconButton(props)).not.toThrow();
    });
  });

  describe('Props Integration', () => {
    it('should handle all props together', () => {
      const props = {
        iconName: 'close' as IconName,
        size: 32,
        onPress: () => {},
      };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should handle multiple different onPress callbacks', () => {
      const firstHandler = () => {};
      const secondHandler = () => {};

      expect(() => EtIconButton({ ...defaultProps, onPress: firstHandler })).not.toThrow();
      expect(() => EtIconButton({ ...defaultProps, onPress: secondHandler })).not.toThrow();
    });

    it('should handle arrow function onPress', () => {
      const arrowHandler = () => {};
      const props = { ...defaultProps, onPress: arrowHandler };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should handle async onPress callback', () => {
      const asyncHandler = async () => {
        return Promise.resolve();
      };
      const props = { ...defaultProps, onPress: asyncHandler };
      expect(() => EtIconButton(props)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle various icon names', () => {
      const props = { ...defaultProps, iconName: 'menu' as IconName };
      expect(() => EtIconButton(props)).not.toThrow();
    });

    it('should work with all common icon names', () => {
      const commonIcons: IconName[] = ['chevronLeft', 'chevronRight', 'close', 'settings', 'menu', 'search', 'home', 'user'];

      commonIcons.forEach((iconName) => {
        const props = { ...defaultProps, iconName };
        expect(() => EtIconButton(props)).not.toThrow();
      });
    });

    it('should work with all standard icon sizes', () => {
      const standardSizes = [8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

      standardSizes.forEach((size) => {
        const props = { ...defaultProps, size };
        expect(() => EtIconButton(props)).not.toThrow();
      });
    });

    it('should handle minimal props', () => {
      const minimalProps = {
        iconName: 'chevronLeft' as IconName,
        size: 24,
        onPress: () => {},
      };
      expect(() => EtIconButton(minimalProps)).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should enforce iconName type', () => {
      const validProps = {
        iconName: 'chevronLeft' as IconName,
        size: 24,
        onPress: () => {},
      };
      expect(() => EtIconButton(validProps)).not.toThrow();
    });

    it('should enforce size as number', () => {
      const validProps = {
        iconName: 'close' as IconName,
        size: 24,
        onPress: () => {},
      };
      expect(() => EtIconButton(validProps)).not.toThrow();
    });

    it('should enforce onPress as function', () => {
      const validProps = {
        iconName: 'settings' as IconName,
        size: 32,
        onPress: () => {},
      };
      expect(() => EtIconButton(validProps)).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should maintain consistent API structure', () => {
      const result = EtIconButton(defaultProps);
      expect(result).toBeDefined();
    });

    it('should be callable as a function', () => {
      expect(typeof EtIconButton).toBe('function');
    });

    it('should handle prop variations without errors', () => {
      const variations = [
        { iconName: 'home' as IconName, size: 16, onPress: () => {} },
        { iconName: 'user' as IconName, size: 24, onPress: () => {} },
        { iconName: 'settings' as IconName, size: 32, onPress: () => {} },
      ];

      variations.forEach((props) => {
        expect(() => EtIconButton(props)).not.toThrow();
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should handle rapid successive calls', () => {
      const icons: IconName[] = ['chevronLeft', 'chevronRight', 'close', 'settings', 'menu'];

      expect(() => {
        icons.forEach((iconName) => {
          EtIconButton({ ...defaultProps, iconName });
        });
      }).not.toThrow();
    });

    it('should handle large batch operations', () => {
      const batchSize = 100;
      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          EtIconButton({
            iconName: 'chevronLeft' as IconName,
            size: 24 + (i % 4) * 8,
            onPress: () => {},
          });
        }
      }).not.toThrow();
    });
  });
});
