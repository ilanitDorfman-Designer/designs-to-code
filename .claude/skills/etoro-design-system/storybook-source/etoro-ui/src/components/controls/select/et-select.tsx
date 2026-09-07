import * as Haptics from 'expo-haptics';
import { memo, useCallback, useMemo } from 'react';
import { DimensionValue, Pressable, StyleSheet, View } from 'react-native';

import { X1, X2, X3, X5, X7, X17 } from '../../../core/styles/spacing';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { EtText } from '../../../foundations/text/et-text';
import { EtSelectProps } from './api/types';
import { SelectContext } from './context/select-context';
import { useSelectChildren } from './hooks/use-select-children';
import { useSelectConfig } from './hooks/use-select-config';
import { SelectLabel } from './subcomponents/select-label';
import { SelectLeadingContent } from './subcomponents/select-leading-content';
import { SelectValue } from './subcomponents/select-value';

/**
 * EtSelect — Composable select trigger component.
 *
 * Uses `type` prop to determine layout:
 * - `type="text"` — Inline semibold text with trailing chevron only (no leading icons)
 * - `type="field"` — Bordered container that auto-switches between empty and filled appearance
 *
 * Compound subcomponents for composition:
 * - `EtSelect.Label` — Label text (triggers filled appearance in field type)
 * - `EtSelect.Value` — Value/placeholder text
 * - `EtSelect.LeadingContent` — Content before value (e.g., icon or flag). Field type only.
 *
 * @example
 * <EtSelect type="text" onPress={handlePress}>
 *   <EtSelect.Value>Select</EtSelect.Value>
 * </EtSelect>
 *
 * @example
 * <EtSelect type="field" onPress={handlePress}>
 *   <EtSelect.Label>Country</EtSelect.Label>
 *   <EtSelect.LeadingContent>
 *     <EtCountryFlag isoCode="GB" size={20} />
 *   </EtSelect.LeadingContent>
 *   <EtSelect.Value>United Kingdom</EtSelect.Value>
 * </EtSelect>
 */
export function EtSelectBase({
  children,
  onPress,
  type = 'field',
  disabled = false,
  readonly = false,
  showChevron: showChevronProp = true,
  haptics = true,
  width = 335,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: EtSelectProps) {
  const { labelChild, valueChild, leadingContentChild } = useSelectChildren(children);

  const isText = type === 'text';
  const hasValue = !isText && (labelChild !== undefined || leadingContentChild !== undefined);

  const { contextValue, isDisabled, isReadonly, backgroundColor } = useSelectConfig({
    type,
    disabled,
    readonly,
    hasValue,
  });

  // Chevron visibility (field type only; text type chevron is structural).
  // Per D5: when both `disabled` and `readonly` are true, disabled wins → chevron stays visible (dimmed).
  // The chevron is only hidden when readonly is set without disabled, or when consumer opts out via `showChevron={false}`.
  const isReadonlyOnly = isReadonly && !isDisabled;
  const shouldShowChevron = showChevronProp && !isReadonlyOnly;

  const handlePress = useCallback(() => {
    // Readonly: handler no-ops (Pressable stays enabled at the RN layer to keep a11y semantics honest).
    // Disabled: Pressable.disabled blocks the event upstream, but guard here as defense-in-depth.
    if (isDisabled || isReadonly) return;
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  }, [haptics, isDisabled, isReadonly, onPress]);

  const chevronIcon = useMemo(
    () => (
      <EtoroIcon
        icon={{ iconName: 'chevronDown' }}
        appearance={{
          size: contextValue.meta.iconSize,
          color: contextValue.meta.iconColor,
        }}
        accessibility={{ testID: 'et-select-chevron' }}
      />
    ),
    [contextValue.meta.iconSize, contextValue.meta.iconColor],
  );

  const valueContent = useMemo(() => {
    if (valueChild === undefined) return null;
    if (typeof valueChild === 'string' || typeof valueChild === 'number') {
      const textVariant = isText ? 'heading-large' : 'heading-compact';
      return (
        <EtText variant={textVariant} numberOfLines={1} style={[styles.textShrink, { color: contextValue.meta.textColor }]}>
          {valueChild}
        </EtText>
      );
    }
    return valueChild;
  }, [valueChild, isText, contextValue.meta.textColor]);

  const valueChildText = typeof valueChild === 'string' || typeof valueChild === 'number' ? String(valueChild) : undefined;
  const accessLabel = accessibilityLabel || valueChildText || '';

  // ── Text type: inline text with chevron ──
  if (isText) {
    return (
      <SelectContext.Provider value={contextValue}>
        <Pressable
          onPress={handlePress}
          style={[styles.textContainer, { gap: X1 }, style]}
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={accessLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled: false }}
        >
          {valueContent}
          {chevronIcon}
        </Pressable>
      </SelectContext.Provider>
    );
  }

  // ── Field type: bordered container ──
  const inputWidth = width === 'auto' ? undefined : (width as DimensionValue);

  // Filled appearance (has label or leading content)
  if (hasValue) {
    return (
      <SelectContext.Provider value={contextValue}>
        <Pressable
          onPress={handlePress}
          disabled={isDisabled}
          style={[styles.filledContainer, { width: inputWidth, backgroundColor }, style]}
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={accessLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled: isDisabled }}
        >
          <View style={styles.filledContent}>
            <View style={styles.filledLeftColumn}>
              {labelChild}
              <View style={styles.filledValueRow}>
                {leadingContentChild}
                {valueContent}
              </View>
            </View>
            {shouldShowChevron ? chevronIcon : null}
          </View>
        </Pressable>
      </SelectContext.Provider>
    );
  }

  // Empty / placeholder appearance
  return (
    <SelectContext.Provider value={contextValue}>
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={[styles.fieldContainer, { width: inputWidth, backgroundColor }, style]}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
      >
        <View style={styles.fieldContent}>
          {valueContent}
          {shouldShowChevron ? chevronIcon : null}
        </View>
      </Pressable>
    </SelectContext.Provider>
  );
}

EtSelectBase.displayName = 'EtSelect';

const EtSelectMemo = memo(EtSelectBase);

/**
 * EtSelect component with compound subcomponents.
 *
 * @example
 * <EtSelect type="text" onPress={handlePress}>
 *   <EtSelect.Value>Select</EtSelect.Value>
 * </EtSelect>
 */
export const EtSelect = Object.assign(EtSelectMemo, {
  Label: SelectLabel,
  Value: SelectValue,
  LeadingContent: SelectLeadingContent,
});

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: X7,
    alignSelf: 'flex-start',
  },
  textShrink: {
    flexShrink: 1,
  },
  fieldContainer: {
    justifyContent: 'center',
    height: X17,
    paddingHorizontal: X5,
    borderRadius: X3,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filledContainer: {
    justifyContent: 'center',
    height: X17,
    paddingHorizontal: X5,
    borderRadius: X2,
  },
  filledContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filledLeftColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  filledValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
});
