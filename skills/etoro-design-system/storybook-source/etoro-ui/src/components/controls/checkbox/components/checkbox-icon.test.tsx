import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

import type { CheckboxValue, CheckboxVariant } from '../api/types';
import type { CheckboxColors } from '../utils/get-checkbox-colors';
import { CheckboxIcon } from './checkbox-icon';

// Mock EtoroIcon
jest.mock('etoro-ui/foundations/icon-assets/et-icon', () => ({
  EtoroIcon: ({ icon, appearance }: { icon: { iconName: string }; appearance: { size: number; color: string } }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`etoro-icon-${icon.iconName}`}>
        <Text>{icon.iconName}</Text>
        <Text testID="icon-color">{appearance.color}</Text>
        <Text testID="icon-size">{appearance.size}</Text>
      </View>
    );
  },
}));

// Mock EtIconV2 used by the checked state
jest.mock('../../../et-icon-v2', () => ({
  EtIconV2: ({ name, color, size }: { name: string; color?: string; size?: string | number }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`etoro-icon-${name}`}>
        <Text>{name}</Text>
        <Text testID="icon-color">{color}</Text>
        <Text testID="icon-size">{size}</Text>
      </View>
    );
  },
}));

// Note: react-native-reanimated is mocked globally in jest.setup.ts

// Wrapper component to provide SharedValue
function TestWrapper({
  variant,
  value,
  isChecked,
  animationValue,
  colors,
}: {
  variant: CheckboxVariant;
  value: CheckboxValue;
  isChecked: boolean;
  animationValue: number;
  colors: CheckboxColors;
}) {
  const checkAnimationValue = useSharedValue(animationValue);
  return <CheckboxIcon variant={variant} value={value} isChecked={isChecked} checkAnimationValue={checkAnimationValue} colors={colors} />;
}

describe('CheckboxIcon', () => {
  const mockColors: CheckboxColors = {
    unchecked: '#999999',
    checked: '#00AA00',
    icon: '#FFFFFF',
    error: '#FF0000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Check Icon Rendering', () => {
    it('should render check icon when isChecked=true', () => {
      const { getByTestId } = render(<TestWrapper variant="square" value={true} isChecked={true} animationValue={1} colors={mockColors} />);

      expect(getByTestId('check-icon-container')).toBeTruthy();
      expect(getByTestId('etoro-icon-check-fill')).toBeTruthy();
    });

    it('should not render check icon when isChecked=false', () => {
      const { queryByTestId } = render(<TestWrapper variant="square" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

      expect(queryByTestId('check-icon-container')).toBeNull();
    });

    it('should render check icon with correct color', () => {
      const { getAllByTestId } = render(<TestWrapper variant="square" value={true} isChecked={true} animationValue={1} colors={mockColors} />);

      const iconColors = getAllByTestId('icon-color');
      expect(iconColors[0].props.children).toBe(mockColors.icon);
    });

    it('should render check icon with correct size', () => {
      const { getAllByTestId } = render(<TestWrapper variant="square" value={true} isChecked={true} animationValue={1} colors={mockColors} />);

      const iconSizes = getAllByTestId('icon-size');
      expect(iconSizes[0].props.children).toBe('md');
    });
  });

  describe('Plus Icon Rendering (Add Variant)', () => {
    it('should render plus icon when variant="add" and isChecked=false', () => {
      const { getByTestId } = render(<TestWrapper variant="add" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

      expect(getByTestId('plus-icon-container')).toBeTruthy();
      expect(getByTestId('etoro-icon-plusLine')).toBeTruthy();
    });

    it('should not render plus icon when variant="add" and isChecked=true', () => {
      const { queryByTestId } = render(<TestWrapper variant="add" value={true} isChecked={true} animationValue={1} colors={mockColors} />);

      // Should show check icon, not plus icon
      expect(queryByTestId('plus-icon-container')).toBeNull();
      expect(queryByTestId('check-icon-container')).toBeTruthy();
    });

    it('should not render plus icon when variant="square"', () => {
      const { queryByTestId } = render(<TestWrapper variant="square" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

      expect(queryByTestId('plus-icon-container')).toBeNull();
    });

    it('should not render plus icon when variant="round"', () => {
      const { queryByTestId } = render(<TestWrapper variant="round" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

      expect(queryByTestId('plus-icon-container')).toBeNull();
    });
  });

  describe('Plus Icon Color', () => {
    it('should use unchecked color for plus icon when value is false', () => {
      const { getAllByTestId } = render(<TestWrapper variant="add" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

      const iconColors = getAllByTestId('icon-color');
      expect(iconColors[0].props.children).toBe(mockColors.unchecked);
    });

    it('should use error color for plus icon when value="error"', () => {
      const { getAllByTestId } = render(<TestWrapper variant="add" value="error" isChecked={false} animationValue={0} colors={mockColors} />);

      const iconColors = getAllByTestId('icon-color');
      expect(iconColors[0].props.children).toBe(mockColors.error);
    });
  });

  describe('Variant-Specific Icon Behavior', () => {
    describe('Square Variant', () => {
      it('should show check icon when checked', () => {
        const { getByTestId, queryByTestId } = render(
          <TestWrapper variant="square" value={true} isChecked={true} animationValue={1} colors={mockColors} />,
        );

        expect(getByTestId('check-icon-container')).toBeTruthy();
        expect(queryByTestId('plus-icon-container')).toBeNull();
      });

      it('should show nothing when unchecked', () => {
        const { queryByTestId } = render(<TestWrapper variant="square" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

        expect(queryByTestId('check-icon-container')).toBeNull();
        expect(queryByTestId('plus-icon-container')).toBeNull();
      });

      it('should show nothing when indeterminate (filled background, no icon)', () => {
        const { queryByTestId } = render(
          <TestWrapper variant="square" value="indeterminate" isChecked={false} animationValue={0} colors={mockColors} />,
        );

        expect(queryByTestId('check-icon-container')).toBeNull();
        expect(queryByTestId('plus-icon-container')).toBeNull();
      });
    });

    describe('Round Variant', () => {
      it('should show check icon when checked', () => {
        const { getByTestId, queryByTestId } = render(
          <TestWrapper variant="round" value={true} isChecked={true} animationValue={1} colors={mockColors} />,
        );

        expect(getByTestId('check-icon-container')).toBeTruthy();
        expect(queryByTestId('plus-icon-container')).toBeNull();
      });

      it('should show nothing when unchecked', () => {
        const { queryByTestId } = render(<TestWrapper variant="round" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

        expect(queryByTestId('check-icon-container')).toBeNull();
        expect(queryByTestId('plus-icon-container')).toBeNull();
      });
    });

    describe('Add Variant', () => {
      it('should show check icon when checked', () => {
        const { getByTestId, queryByTestId } = render(
          <TestWrapper variant="add" value={true} isChecked={true} animationValue={1} colors={mockColors} />,
        );

        expect(getByTestId('check-icon-container')).toBeTruthy();
        expect(queryByTestId('plus-icon-container')).toBeNull();
      });

      it('should show plus icon when unchecked', () => {
        const { getByTestId, queryByTestId } = render(
          <TestWrapper variant="add" value={false} isChecked={false} animationValue={0} colors={mockColors} />,
        );

        expect(queryByTestId('check-icon-container')).toBeNull();
        expect(getByTestId('plus-icon-container')).toBeTruthy();
      });
    });
  });

  describe('TestID Presence', () => {
    it('should have check-icon-container testID when check icon is visible', () => {
      const { getByTestId } = render(<TestWrapper variant="square" value={true} isChecked={true} animationValue={1} colors={mockColors} />);

      expect(getByTestId('check-icon-container')).toBeTruthy();
    });

    it('should have plus-icon-container testID when plus icon is visible', () => {
      const { getByTestId } = render(<TestWrapper variant="add" value={false} isChecked={false} animationValue={0} colors={mockColors} />);

      expect(getByTestId('plus-icon-container')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle error state for square variant', () => {
      const { queryByTestId } = render(<TestWrapper variant="square" value="error" isChecked={false} animationValue={0} colors={mockColors} />);

      // Error state shows no icons (empty checkbox with error border)
      expect(queryByTestId('check-icon-container')).toBeNull();
      expect(queryByTestId('plus-icon-container')).toBeNull();
    });

    it('should handle error state for round variant', () => {
      const { queryByTestId } = render(<TestWrapper variant="round" value="error" isChecked={false} animationValue={0} colors={mockColors} />);

      expect(queryByTestId('check-icon-container')).toBeNull();
      expect(queryByTestId('plus-icon-container')).toBeNull();
    });

    it('should handle error state for add variant', () => {
      const { getByTestId } = render(<TestWrapper variant="add" value="error" isChecked={false} animationValue={0} colors={mockColors} />);

      // Add variant in error state still shows plus icon with error color
      expect(getByTestId('plus-icon-container')).toBeTruthy();
    });

    it('should render without crashing with all variants', () => {
      const variants: CheckboxVariant[] = ['square', 'round', 'add'];

      variants.forEach((variant) => {
        expect(() => {
          render(<TestWrapper variant={variant} value={false} isChecked={false} animationValue={0} colors={mockColors} />);
        }).not.toThrow();
      });
    });
  });
});
