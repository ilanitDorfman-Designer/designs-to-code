import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, renderHook } from '@testing-library/react-native';
import { View } from 'react-native';

import { EtSelect } from './et-select';

// Mock etoro-core/hooks
jest.mock('etoro-core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('EtSelect', () => {
  // ─── RENDERING ───────────────────────────────────────────────────────

  describe('Component rendering', () => {
    it('renders field type without crashing', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Value>Select option</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('renders text type without crashing', () => {
      const { getByRole } = render(
        <EtSelect type="text" onPress={jest.fn()}>
          <EtSelect.Value>Select option</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('renders field type with value (filled state)', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>eToro</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('defaults to field type when type is omitted', () => {
      const { getByRole } = render(
        <EtSelect onPress={jest.fn()}>
          <EtSelect.Value>Select option</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} testID="test-select">
          <EtSelect.Value>Select option</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('test-select')).toBeTruthy();
    });

    it('displays text content correctly via EtSelect.Value', () => {
      const { getByText } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Value>United States</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByText('United States')).toBeTruthy();
    });

    it('displays label in field type filled state', () => {
      const { getByText } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Label>Country of residence</EtSelect.Label>
          <EtSelect.Value>eToro</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByText('Country of residence')).toBeTruthy();
      expect(getByText('eToro')).toBeTruthy();
    });
  });

  // ─── COMPOUND COMPONENTS ────────────────────────────────────────────

  describe('Compound component API', () => {
    it('renders EtSelect.Label and EtSelect.Value', () => {
      const { getByText } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Label>Time</EtSelect.Label>
          <EtSelect.Value>10:15 AM</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByText('Time')).toBeTruthy();
      expect(getByText('10:15 AM')).toBeTruthy();
    });

    it('renders EtSelect.LeadingContent', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.LeadingContent>
            <View testID="flag-icon" />
          </EtSelect.LeadingContent>
          <EtSelect.Value>eToro</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('flag-icon')).toBeTruthy();
    });

    it('supports string children as value shorthand on text type', () => {
      const { getByText } = render(
        <EtSelect type="text" onPress={jest.fn()}>
          Select
        </EtSelect>,
      );
      expect(getByText('Select')).toBeTruthy();
    });

    it('supports string children as value shorthand on field type', () => {
      const { getByText } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          Select
        </EtSelect>,
      );
      expect(getByText('Select')).toBeTruthy();
    });
  });

  // ─── DISABLED STATE ─────────────────────────────────────────────────

  describe('Disabled state', () => {
    it('does not call onPress when disabled - field type', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="field" onPress={handlePress} disabled={true} testID="disabled-select">
          <EtSelect.Value>Disabled</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('disabled-select'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not call onPress when disabled - field type with value', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="field" onPress={handlePress} disabled={true} testID="disabled-filled-select">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>eToro</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('disabled-filled-select'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('has correct accessibilityState when disabled', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} disabled={true}>
          <EtSelect.Value>Disabled</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByRole('button');
      expect(select.props.accessibilityState.disabled).toBe(true);
    });

    it('has correct accessibilityState when not disabled', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} disabled={false}>
          <EtSelect.Value>Enabled</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByRole('button');
      expect(select.props.accessibilityState.disabled).toBe(false);
    });

    it('text type is always interactive (disabled prop ignored)', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="text" onPress={handlePress} testID="text-select">
          <EtSelect.Value>Text always enabled</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('text-select'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('text type always has disabled=false in accessibilityState', () => {
      const { getByRole } = render(
        <EtSelect type="text" onPress={jest.fn()}>
          <EtSelect.Value>Text</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByRole('button');
      expect(select.props.accessibilityState.disabled).toBe(false);
    });
  });

  // ─── HAPTICS ────────────────────────────────────────────────────────

  describe('Haptic feedback', () => {
    const Haptics = require('expo-haptics');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('triggers haptic feedback by default on press', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} testID="haptic-select">
          <EtSelect.Value>Haptic test</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('haptic-select'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when haptics is false', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} haptics={false} testID="no-haptic-select">
          <EtSelect.Value>No haptic</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('no-haptic-select'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does not trigger haptic feedback when disabled - field type', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} disabled={true} testID="disabled-haptic-select">
          <EtSelect.Value>Disabled haptic</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('disabled-haptic-select'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('triggers haptic feedback on text type', () => {
      const { getByTestId } = render(
        <EtSelect type="text" onPress={jest.fn()} testID="text-haptic-select">
          <EtSelect.Value>Text haptic</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('text-haptic-select'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });
  });

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────

  describe('Accessibility props', () => {
    it('has button accessibility role', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Value>Accessible</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('applies accessibilityLabel prop', () => {
      const { getByLabelText } = render(
        <EtSelect type="field" onPress={jest.fn()} accessibilityLabel="Select currency: United States Dollar">
          <EtSelect.Value>USD</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByLabelText('Select currency: United States Dollar')).toBeTruthy();
    });

    it('applies accessibilityHint prop', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} accessibilityHint="Opens a list of available countries">
          <EtSelect.Value>Country</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByRole('button');
      expect(select.props.accessibilityHint).toBe('Opens a list of available countries');
    });
  });

  // ─── CUSTOM STYLES ─────────────────────────────────────────────────

  describe('Custom style application', () => {
    it('applies custom style to select', () => {
      const customStyle = { width: 320 };
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} testID="styled-select" style={customStyle}>
          <EtSelect.Value>Styled</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('styled-select')).toBeTruthy();
    });
  });

  // ─── ONPRESS ────────────────────────────────────────────────────────

  describe('onPress callback invocation', () => {
    it('calls onPress when pressed', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="field" onPress={handlePress} testID="press-select">
          <EtSelect.Value>Press me</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('press-select'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('calls onPress multiple times on successive presses', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="field" onPress={handlePress} testID="multi-press-select">
          <EtSelect.Value>Multiple press</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('multi-press-select'));
      fireEvent.press(getByTestId('multi-press-select'));
      fireEvent.press(getByTestId('multi-press-select'));
      expect(handlePress).toHaveBeenCalledTimes(3);
    });
  });

  // ─── EDGE CASES ─────────────────────────────────────────────────────

  describe('Edge cases', () => {
    it('handles undefined style', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} style={undefined}>
          <EtSelect.Value>Test</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('handles field type without label (empty placeholder)', () => {
      const { getByText, getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Value>Value only</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
      expect(getByText('Value only')).toBeTruthy();
    });
  });

  // ─── WIDTH PROP ─────────────────────────────────────────────────────

  describe('Width prop (field type)', () => {
    it('applies default width of 335 to field type', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} testID="default-width-select">
          <EtSelect.Value>Default width</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByTestId('default-width-select');
      expect(select.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 335 })]));
    });

    it('applies custom numeric width', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} width={320} testID="custom-width-select">
          <EtSelect.Value>Custom width</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByTestId('custom-width-select');
      expect(select.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 320 })]));
    });

    it('applies undefined width when width is auto', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} width="auto" testID="auto-width-select">
          <EtSelect.Value>Auto width</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByTestId('auto-width-select');
      const hasDefinedWidth = select.props.style?.some(
        (styleObj: any) => styleObj && typeof styleObj === 'object' && 'width' in styleObj && styleObj.width !== undefined,
      );
      expect(hasDefinedWidth).toBe(false);
    });

    it('applies percentage width (100%)', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} width="100%" testID="full-width-select">
          <EtSelect.Value>Full width</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByTestId('full-width-select');
      expect(select.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: '100%' })]));
    });

    it('applies width to field type with value (filled state)', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} width="100%" testID="filled-width-select">
          <EtSelect.Label>Label</EtSelect.Label>
          <EtSelect.Value>Filled</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByTestId('filled-width-select');
      expect(select.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: '100%' })]));
    });
  });

  // ─── LEADING CONTENT ──────────────────────────────────────────────

  describe('LeadingContent', () => {
    it('renders leading content in field type (triggers filled appearance)', () => {
      const { getByRole, getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.LeadingContent>
            <View testID="country-flag" />
          </EtSelect.LeadingContent>
          <EtSelect.Value>United Kingdom</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
      expect(getByTestId('country-flag')).toBeTruthy();
    });

    it('field without LeadingContent does not render flag', () => {
      const { getByRole, queryByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()}>
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Select Country</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByRole('button')).toBeTruthy();
      expect(queryByTestId('country-flag')).toBeNull();
    });

    it('ignores leading content in text type (only chevron shown)', () => {
      const { getByTestId, queryByTestId } = render(
        <EtSelect type="text" onPress={jest.fn()} testID="text-leading">
          <EtSelect.LeadingContent>
            <View testID="leading-icon" />
          </EtSelect.LeadingContent>
          <EtSelect.Value>Time</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('text-leading')).toBeTruthy();
      expect(queryByTestId('leading-icon')).toBeNull();
    });
  });

  // ─── READONLY STATE ─────────────────────────────────────────────────

  describe('Readonly state', () => {
    const Haptics = require('expo-haptics');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('does not call onPress when readonly (field type)', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="field" onPress={handlePress} readonly testID="readonly-select">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('readonly-select'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when readonly', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly testID="readonly-haptic-select">
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('readonly-haptic-select'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('hides chevron icon when readonly', () => {
      const { queryByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly testID="readonly-no-chevron">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      expect(queryByTestId('et-select-chevron')).toBeNull();
    });

    it('shows chevron icon when not readonly (baseline)', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} testID="enabled-with-chevron">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('et-select-chevron')).toBeTruthy();
    });

    it('keeps Pressable non-disabled at the RN layer when readonly (handler no-ops instead)', () => {
      // Per D1: Pressable stays enabled when readonly so platform a11y semantics align with
      // accessibilityState.disabled. The press is blocked inside handlePress, not by RN.
      // RN does not surface `disabled={false}` on the rendered host — assert it's not truthy instead.
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly testID="readonly-pressable">
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByTestId('readonly-pressable');
      expect(select.props.disabled).not.toBe(true);
    });

    it('keeps accessibilityState.disabled=false when readonly', () => {
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByRole('button');
      expect(select.props.accessibilityState.disabled).toBe(false);
    });

    it('forwards accessibilityHint to Pressable when readonly (consumer owns a11y messaging)', () => {
      const hint = 'Country is fixed for DKK accounts';
      const { getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly accessibilityHint={hint}>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      const select = getByRole('button');
      expect(select.props.accessibilityHint).toBe(hint);
    });

    it('text type ignores readonly (still interactive, chevron visible)', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="text" onPress={handlePress} readonly testID="text-readonly">
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('text-readonly'));
      expect(handlePress).toHaveBeenCalledTimes(1);
      expect(getByTestId('et-select-chevron')).toBeTruthy();
    });

    it('readonly + disabled: disabled wins — chevron stays visible (D5)', () => {
      const { getByTestId, getByRole } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly disabled testID="readonly-disabled">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      // Chevron stays visible (dimmed) — visual uniformity with the rest of a globally-disabled form.
      expect(getByTestId('et-select-chevron')).toBeTruthy();
      // accessibilityState reflects disabled, not readonly.
      const select = getByRole('button');
      expect(select.props.accessibilityState.disabled).toBe(true);
    });

    it('readonly + disabled: does not call onPress (Pressable blocks at RN layer)', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtSelect type="field" onPress={handlePress} readonly disabled testID="readonly-disabled-press">
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      fireEvent.press(getByTestId('readonly-disabled-press'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  // ─── READONLY COLOR CONTRACT ─────────────────────────────────────────

  describe('Readonly color contract (useSelectConfig)', () => {
    // Mock provides dark-theme carbon tokens (carbonDark):
    //   carbon900 = '#FFFFFF', carbon500 = '#B3B3B3', carbon300 = '#666666'
    const CARBON_900 = '#FFFFFF';
    const CARBON_500 = '#B3B3B3';
    const CARBON_300 = '#666666';

    const { useSelectConfig } = require('./hooks/use-select-config');

    function renderConfig(props: { type?: 'text' | 'field'; disabled?: boolean; readonly?: boolean; hasValue?: boolean }) {
      const { result } = renderHook(() => useSelectConfig({ type: 'field', hasValue: true, ...props }));
      return result.current;
    }

    it('readonly: text color uses enabled carbon900, not dimmed carbon300', () => {
      const config = renderConfig({ readonly: true });
      expect(config.contextValue.meta.textColor).toBe(CARBON_900);
    });

    it('disabled: text color uses dimmed carbon500 (still legible)', () => {
      const config = renderConfig({ disabled: true });
      expect(config.contextValue.meta.textColor).toBe(CARBON_500);
    });

    it('enabled: text color uses carbon900 (filled field)', () => {
      const config = renderConfig({});
      expect(config.contextValue.meta.textColor).toBe(CARBON_900);
    });

    it('readonly: icon color uses carbon500 (same as enabled)', () => {
      const config = renderConfig({ readonly: true });
      expect(config.contextValue.meta.iconColor).toBe(CARBON_500);
    });

    it('disabled: icon color uses carbon300', () => {
      const config = renderConfig({ disabled: true });
      expect(config.contextValue.meta.iconColor).toBe(CARBON_300);
    });

    it('readonly: label color uses carbon500 (same as enabled)', () => {
      const config = renderConfig({ readonly: true });
      expect(config.contextValue.meta.labelColor).toBe(CARBON_500);
    });

    it('disabled: label color uses carbon500 (still legible)', () => {
      const config = renderConfig({ disabled: true });
      expect(config.contextValue.meta.labelColor).toBe(CARBON_500);
    });
  });

  // ─── SHOWCHEVRON PROP ───────────────────────────────────────────────

  describe('showChevron prop', () => {
    it('hides chevron on enabled field when showChevron={false}', () => {
      const { queryByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} showChevron={false} testID="no-chevron-enabled">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      expect(queryByTestId('et-select-chevron')).toBeNull();
    });

    it('hides chevron on disabled field when showChevron={false}', () => {
      const { queryByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} disabled showChevron={false} testID="no-chevron-disabled">
          <EtSelect.Value>Disabled</EtSelect.Value>
        </EtSelect>,
      );
      expect(queryByTestId('et-select-chevron')).toBeNull();
    });

    it('shows chevron by default (showChevron defaults to true)', () => {
      const { getByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} testID="default-chevron">
          <EtSelect.Value>Default</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('et-select-chevron')).toBeTruthy();
    });

    it('readonly forces chevron hidden even with showChevron={true}', () => {
      const { queryByTestId } = render(
        <EtSelect type="field" onPress={jest.fn()} readonly showChevron={true} testID="readonly-explicit-show">
          <EtSelect.Label>Country</EtSelect.Label>
          <EtSelect.Value>Denmark</EtSelect.Value>
        </EtSelect>,
      );
      expect(queryByTestId('et-select-chevron')).toBeNull();
    });

    it('text type ignores showChevron={false} — chevron is structural, stays visible', () => {
      const { getByTestId } = render(
        <EtSelect type="text" onPress={jest.fn()} showChevron={false} testID="text-no-chevron">
          <EtSelect.Value>Time</EtSelect.Value>
        </EtSelect>,
      );
      expect(getByTestId('et-select-chevron')).toBeTruthy();
    });
  });
});
