import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X2 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text/et-text';
import type { EtDividerProps } from './api/types';

/** Line thickness in px (Figma divider: 1px). */
const LINE_THICKNESS = 1;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
  // Each side line grows to fill the space left by the centered label.
  flexLine: {
    flex: 1,
    height: LINE_THICKNESS,
  },
  // Full-width line for the label-less variant.
  line: {
    alignSelf: 'stretch',
    height: LINE_THICKNESS,
  },
});

/**
 * `<EtDivider>` — horizontal separator line.
 *
 * Two shapes, switched by the presence of `label`:
 * - **Plain** (`label` omitted) — a single full-width line. Decorative.
 * - **Labelled** — a centered label flanked by two lines, e.g. the
 *   "── Or ──" separator between primary and secondary actions.
 *
 * Translation-agnostic: pass a pre-translated string to `label`.
 * See `AGENTS.md` for usage, tokens, and anti-patterns.
 *
 * @example
 * ```tsx
 * <EtDivider />                 // plain full-width line
 * <EtDivider label="Or" />      // line — label — line
 * ```
 */
function EtDividerBase({ label, labelVariant = 'body-secondary-regular', color, style, testID, accessibilityLabel }: EtDividerProps) {
  const { colors } = useEtoroTheme();
  const lineColor = color ?? colors.dividerTertiary;

  if (label == null) {
    return (
      <View
        style={[styles.line, { backgroundColor: lineColor }, style]}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityElementsHidden={accessibilityLabel == null}
        importantForAccessibility={accessibilityLabel == null ? 'no-hide-descendants' : 'yes'}
      />
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID} accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? label}>
      <View style={[styles.flexLine, { backgroundColor: lineColor }]} importantForAccessibility="no-hide-descendants" />
      <EtText variant={labelVariant} style={{ color: colors.textSecondaryNeutral }} importantForAccessibility="no-hide-descendants">
        {label}
      </EtText>
      <View style={[styles.flexLine, { backgroundColor: lineColor }]} importantForAccessibility="no-hide-descendants" />
    </View>
  );
}

export const EtDivider = React.memo(EtDividerBase);
EtDivider.displayName = 'EtDivider';
