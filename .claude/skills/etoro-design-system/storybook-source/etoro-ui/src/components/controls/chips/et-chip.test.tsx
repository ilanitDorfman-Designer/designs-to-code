import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import { EtChip } from './et-chip';
import { ChipIcon } from './subcomponents/et-chip-icon';
import { ChipLabel } from './subcomponents/et-chip-label';

// Mock etoro-ui/core
jest.mock('etoro-ui/core', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

const mockedUseEtoroTheme = useEtoroTheme as unknown as jest.Mock;

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Note: react-native-reanimated is mocked globally in jest.setup.ts
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

describe('EtChip', () => {
  describe('Component Structure', () => {
    it('has Label as static property', () => {
      expect(EtChip.Label).toBeDefined();
    });

    it('has Icon as static property', () => {
      expect(EtChip.Icon).toBeDefined();
    });

    it('EtChip.Label is the ChipLabel component', () => {
      expect(EtChip.Label).toBe(ChipLabel);
    });

    it('EtChip.Icon is the ChipIcon component', () => {
      expect(EtChip.Icon).toBe(ChipIcon);
    });

    it('is a valid React component (memo wrapped)', () => {
      expect(EtChip).toBeDefined();
      expect(EtChip.$$typeof).toBeDefined();
    });
  });

  describe('Subcomponents', () => {
    describe('ChipLabel', () => {
      it('should have displayName set', () => {
        expect(ChipLabel.displayName).toBe('EtChip.Label');
      });
    });

    describe('ChipIcon', () => {
      it('should have displayName set', () => {
        expect(ChipIcon.displayName).toBe('EtChip.Icon');
      });
    });
  });
});

describe('EtChip Component Rendering', () => {
  const mockOnPress = jest.fn();
  const mockOnSelectionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByRole } = render(
        <EtChip>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(
        <EtChip testID="test-chip">
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      expect(getByTestId('test-chip')).toBeTruthy();
    });

    it('renders with EtChip.Label subcomponent', () => {
      const { getByText } = render(
        <EtChip>
          <EtChip.Label>Test Label</EtChip.Label>
        </EtChip>,
      );

      expect(getByText('Test Label')).toBeTruthy();
    });

    it('renders with EtChip.Icon subcomponent', () => {
      const { getByRole } = render(
        <EtChip>
          <EtChip.Icon iconName="heart" />
        </EtChip>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('renders with both Label and Icon', () => {
      const { getByText, getByRole } = render(
        <EtChip>
          <EtChip.Icon iconName="heart" />
          <EtChip.Label>Favorites</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button')).toBeTruthy();
      expect(getByText('Favorites')).toBeTruthy();
    });

    it('renders with trailing icon (label before icon)', () => {
      const { getByText, getByRole } = render(
        <EtChip>
          <EtChip.Label>Watchlist</EtChip.Label>
          <EtChip.Icon iconName="watched" />
        </EtChip>,
      );

      expect(getByRole('button')).toBeTruthy();
      expect(getByText('Watchlist')).toBeTruthy();
    });
  });

  describe('Selection States', () => {
    it('renders unselected state (default)', () => {
      const { getByRole } = render(
        <EtChip>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.selected).toBe(false);
    });

    it('renders unselected state (explicit false)', () => {
      const { getByRole } = render(
        <EtChip selected={false}>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.selected).toBe(false);
    });

    it('renders selected state', () => {
      const { getByRole } = render(
        <EtChip selected={true}>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Press Events', () => {
    it('calls onPress when pressed', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="press-chip" onPress={handlePress}>
          <EtChip.Label>Press Me</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('press-chip'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('calls onSelectionChange with toggled value when unselected', () => {
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" selected={false} onSelectionChange={handleSelectionChange}>
          <EtChip.Label>Toggle</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));
      expect(handleSelectionChange).toHaveBeenCalledWith(true);
    });

    it('updates selected state optimistically on press before parent re-renders', () => {
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" selected={false} onSelectionChange={handleSelectionChange}>
          <EtChip.Label>Filter</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));

      expect(getByTestId('chip').props.accessibilityState.selected).toBe(true);
      expect(handleSelectionChange).toHaveBeenCalledWith(true);
    });

    it('rolls back optimistic selected state when the controlled parent rejects it', async () => {
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" selected={false} onSelectionChange={handleSelectionChange}>
          <EtChip.Label>Filter</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));
      expect(getByTestId('chip').props.accessibilityState.selected).toBe(true);

      await waitFor(() => {
        expect(getByTestId('chip').props.accessibilityState.selected).toBe(false);
      });
    });

    it('calls onSelectionChange with toggled value when selected', () => {
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" selected={true} onSelectionChange={handleSelectionChange}>
          <EtChip.Label>Toggle</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));
      expect(handleSelectionChange).toHaveBeenCalledWith(false);
    });

    it('calls both onPress and onSelectionChange when both are provided', () => {
      const handlePress = jest.fn();
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" selected={false} onPress={handlePress} onSelectionChange={handleSelectionChange}>
          <EtChip.Label>Both</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));
      expect(handleSelectionChange).toHaveBeenCalledWith(true);
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback by default on press', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(
        <EtChip testID="haptic-chip" onPress={mockOnPress}>
          <EtChip.Label>Haptic</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('haptic-chip'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when haptics is false', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtChip testID="no-haptic-chip" onPress={mockOnPress} haptics={false}>
          <EtChip.Label>No Haptic</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('no-haptic-chip'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('does not call onPress when disabled', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="disabled-chip" onPress={handlePress} disabled={true}>
          <EtChip.Label>Disabled</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('disabled-chip'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not call onSelectionChange when disabled', () => {
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="disabled-chip" onSelectionChange={handleSelectionChange} disabled={true}>
          <EtChip.Label>Disabled</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('disabled-chip'));
      expect(handleSelectionChange).not.toHaveBeenCalled();
    });

    it('has correct accessibilityState when disabled', () => {
      const { getByRole } = render(
        <EtChip disabled={true}>
          <EtChip.Label>Disabled</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.disabled).toBe(true);
    });

    it('has correct accessibilityState when not disabled', () => {
      const { getByRole } = render(
        <EtChip disabled={false} onPress={jest.fn()}>
          <EtChip.Label>Enabled</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.disabled).toBe(false);
    });

    it('does not trigger haptic feedback when disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtChip testID="disabled-haptic-chip" onPress={jest.fn()} disabled={true}>
          <EtChip.Label>Disabled Haptic</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('disabled-haptic-chip'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('works correctly when disabled and selected', () => {
      const handlePress = jest.fn();
      const { getByRole, getByTestId } = render(
        <EtChip testID="disabled-selected-chip" selected={true} disabled={true} onPress={handlePress}>
          <EtChip.Label>Disabled Selected</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.selected).toBe(true);
      expect(chip.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(getByTestId('disabled-selected-chip'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('has accessibilityState.disabled true when no handlers provided (non-interactive)', () => {
      const { getByRole } = render(
        <EtChip>
          <EtChip.Label>Static Chip</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      // accessibilityState.disabled should match Pressable disabled state
      // When no handlers, chip is non-interactive, so disabled should be true
      expect(chip.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Interactive vs Non-Interactive', () => {
    it('is non-interactive when no handlers provided', () => {
      const { getByRole } = render(
        <EtChip>
          <EtChip.Label>Static</EtChip.Label>
        </EtChip>,
      );

      // Component should render but be disabled (non-interactive)
      const chip = getByRole('button');
      expect(chip).toBeTruthy();
    });

    it('is interactive when onPress is provided', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" onPress={handlePress}>
          <EtChip.Label>Interactive</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));
      expect(handlePress).toHaveBeenCalled();
    });

    it('is interactive when onSelectionChange is provided', () => {
      const handleSelectionChange = jest.fn();
      const { getByTestId } = render(
        <EtChip testID="chip" onSelectionChange={handleSelectionChange}>
          <EtChip.Label>Interactive</EtChip.Label>
        </EtChip>,
      );

      fireEvent.press(getByTestId('chip'));
      expect(handleSelectionChange).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has button accessibility role', () => {
      const { getByRole } = render(
        <EtChip>
          <EtChip.Label>Accessible</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('has correct accessibility state when unselected', () => {
      const { getByRole } = render(
        <EtChip selected={false}>
          <EtChip.Label>Unselected</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.selected).toBe(false);
    });

    it('has correct accessibility state when selected', () => {
      const { getByRole } = render(
        <EtChip selected={true}>
          <EtChip.Label>Selected</EtChip.Label>
        </EtChip>,
      );

      const chip = getByRole('button');
      expect(chip.props.accessibilityState.selected).toBe(true);
    });

    it('applies accessibilityLabel prop', () => {
      const { getByLabelText } = render(
        <EtChip accessibilityLabel="Technology filter chip">
          <EtChip.Label>Technology</EtChip.Label>
        </EtChip>,
      );

      expect(getByLabelText('Technology filter chip')).toBeTruthy();
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to chip', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <EtChip testID="styled-chip" style={customStyle}>
          <EtChip.Label>Styled</EtChip.Label>
        </EtChip>,
      );

      const chip = getByTestId('styled-chip');
      expect(chip).toBeTruthy();
    });

    it('applies array styles correctly', () => {
      const arrayStyle = [{ margin: 5 }, { padding: 10 }];
      const { getByTestId } = render(
        <EtChip testID="array-styled-chip" style={arrayStyle}>
          <EtChip.Label>Array Styled</EtChip.Label>
        </EtChip>,
      );

      const chip = getByTestId('array-styled-chip');
      expect(chip).toBeTruthy();
    });
  });

  describe('Context Error Handling', () => {
    it('throws error when ChipLabel used outside EtChip', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<ChipLabel>Outside</ChipLabel>);
      }).toThrow('EtChip compound components must be used within an EtChip component');

      consoleError.mockRestore();
    });

    it('throws error when ChipIcon used outside EtChip', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<ChipIcon iconName="heart" />);
      }).toThrow('EtChip compound components must be used within an EtChip component');

      consoleError.mockRestore();
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handlePress = jest.fn();
      const handleSelectionChange = jest.fn();
      const { getByTestId, getByText } = render(
        <EtChip
          testID="full-chip"
          selected={true}
          onPress={handlePress}
          onSelectionChange={handleSelectionChange}
          haptics={true}
          style={{ margin: 16 }}
          accessibilityLabel="Full chip"
        >
          <EtChip.Icon iconName="heart" />
          <EtChip.Label>Favorites</EtChip.Label>
        </EtChip>,
      );

      expect(getByTestId('full-chip')).toBeTruthy();
      expect(getByText('Favorites')).toBeTruthy();
    });

    it('handles selection state changes', () => {
      const { rerender, getByRole } = render(
        <EtChip selected={false}>
          <EtChip.Label>Toggle</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button').props.accessibilityState.selected).toBe(false);

      rerender(
        <EtChip selected={true}>
          <EtChip.Label>Toggle</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button').props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Single Selection Pattern', () => {
    it('handles single selection correctly', () => {
      const categories = ['Technology', 'Finance', 'Healthcare'];
      const selectedCategory = 'Technology';

      const { getByText } = render(
        <>
          {categories.map((category) => (
            <EtChip key={category} selected={selectedCategory === category} onSelectionChange={mockOnSelectionChange}>
              <EtChip.Label>{category}</EtChip.Label>
            </EtChip>
          ))}
        </>,
      );

      expect(getByText('Technology')).toBeTruthy();
      expect(getByText('Finance')).toBeTruthy();
      expect(getByText('Healthcare')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid successive renders', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          render(
            <EtChip selected={i % 2 === 0}>
              <EtChip.Label>Rapid {i}</EtChip.Label>
            </EtChip>,
          );
        }
      }).not.toThrow();
    });

    it('handles undefined style', () => {
      const { getByRole } = render(
        <EtChip style={undefined}>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('handles prop changes correctly', () => {
      const { rerender, getByRole } = render(
        <EtChip selected={false}>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button').props.accessibilityState.selected).toBe(false);

      rerender(
        <EtChip selected={true}>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      expect(getByRole('button').props.accessibilityState.selected).toBe(true);
    });

    it('reveals close icon optimistically when showCloseOnSelected is enabled', () => {
      const { getByTestId } = render(
        <EtChip testID="chip" selected={false} showCloseOnSelected onSelectionChange={jest.fn()}>
          <EtChip.Label>Filter</EtChip.Label>
        </EtChip>,
      );

      const closeSlot = getByTestId('chip-close-slot');
      expect(StyleSheet.flatten(closeSlot.props.style)).toEqual(expect.objectContaining({ opacity: 0, width: 0 }));

      fireEvent.press(getByTestId('chip'));

      expect(StyleSheet.flatten(getByTestId('chip-close-slot').props.style)).toEqual(expect.objectContaining({ opacity: 1, width: 22 }));
    });

    it('handles multiple rerenders with different props', () => {
      const { rerender } = render(
        <EtChip selected={false}>
          <EtChip.Label>Test</EtChip.Label>
        </EtChip>,
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtChip selected={i % 2 === 0} haptics={i % 3 === 0}>
            <EtChip.Label>Rerender {i}</EtChip.Label>
          </EtChip>,
        );
      }

      expect(true).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles batch rendering operations', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(
            <EtChip selected={i % 2 === 0} onPress={mockOnPress}>
              <EtChip.Label>Chip {i}</EtChip.Label>
            </EtChip>,
          );
        }
      }).not.toThrow();
    });

    it('handles rendering many chips at once', () => {
      const chips = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        label: `Chip ${i}`,
        selected: i % 3 === 0,
      }));

      const { getAllByRole } = render(
        <>
          {chips.map((chip) => (
            <EtChip key={chip.id} selected={chip.selected}>
              <EtChip.Label>{chip.label}</EtChip.Label>
            </EtChip>
          ))}
        </>,
      );

      expect(getAllByRole('button')).toHaveLength(20);
    });
  });

  describe('Disabled visuals', () => {
    // Sentinel hex values let us verify which conditional branch the label took without
    // relying on colorsMock (which predates the V2 rollout and currently has no carbon* tokens).
    const SENTINEL_CARBON_300 = '#AAA300';
    const SENTINEL_CARBON_050 = '#FAFAFA';
    const SENTINEL_CARBON_900 = '#111900';

    const themeWithV2Sentinels = {
      colors: {
        ...colorsMock.colors,
        carbon300: SENTINEL_CARBON_300,
        carbon050: SENTINEL_CARBON_050,
        carbon900: SENTINEL_CARBON_900,
      },
      gradients: {},
      fonts: {},
    };

    const getResolvedLabelColor = (label: { props: { style: unknown } }) => {
      const flat = StyleSheet.flatten(label.props.style as any) as { color?: string };
      return flat.color;
    };

    beforeEach(() => {
      mockedUseEtoroTheme.mockImplementation(() => themeWithV2Sentinels);
    });

    it('renders the label in carbon300 when disabled is explicitly true (with handler)', () => {
      const { getByText } = render(
        <EtChip disabled onPress={jest.fn()}>
          <EtChip.Label>Disabled</EtChip.Label>
        </EtChip>,
      );

      expect(getResolvedLabelColor(getByText('Disabled'))).toBe(SENTINEL_CARBON_300);
    });

    it('keeps the default carbon900 label color for an interactive chip (not disabled)', () => {
      const { getByText } = render(
        <EtChip onPress={jest.fn()}>
          <EtChip.Label>Active</EtChip.Label>
        </EtChip>,
      );

      const labelColor = getResolvedLabelColor(getByText('Active'));
      expect(labelColor).toBe(SENTINEL_CARBON_900);
      expect(labelColor).not.toBe(SENTINEL_CARBON_300);
    });

    it('keeps the default carbon900 label color for a static chip (no handlers, no disabled prop)', () => {
      const { getByText } = render(
        <EtChip>
          <EtChip.Label>Static</EtChip.Label>
        </EtChip>,
      );

      const labelColor = getResolvedLabelColor(getByText('Static'));
      expect(labelColor).toBe(SENTINEL_CARBON_900);
      expect(labelColor).not.toBe(SENTINEL_CARBON_300);
    });

    it('renders the label in carbon300 when both selected and disabled are true (disabled overrides selected)', () => {
      const { getByText } = render(
        <EtChip disabled selected onPress={jest.fn()}>
          <EtChip.Label>Disabled Selected</EtChip.Label>
        </EtChip>,
      );

      const labelColor = getResolvedLabelColor(getByText('Disabled Selected'));
      expect(labelColor).toBe(SENTINEL_CARBON_300);
      expect(labelColor).not.toBe(SENTINEL_CARBON_050);
    });
  });
});
