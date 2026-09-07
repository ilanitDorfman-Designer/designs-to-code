import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { HALF, X1 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import type { TextVariant } from '../../../../foundations/text/utils/variant-config';
import { create } from '../../../../utils/create';
import { EtIconV2 } from '../../../et-icon-v2';
import type { SegmentLegendItemProps, SegmentLegendItemSize } from '../api/types';

/** Figma "Dot" container — a 20×20 hit box that visually centers an 8px circle. */
const DOT_CONTAINER_SIZE = 20;
const DOT_SIZE = 8;
/** Figma "Text Container" height — keeps label/value baseline aligned with the 20px dot box. */
const TEXT_CONTAINER_HEIGHT = 20;

/** Label/value variants per scale. The value carries the extra weight at both sizes. */
const TEXT_VARIANTS = {
  medium: { label: 'body-secondary-regular', value: 'body-secondary-medium' },
  small: { label: 'caption-regular', value: 'caption-medium' },
} as const satisfies Record<SegmentLegendItemSize, { label: TextVariant; value: TextVariant }>;

/**
 * A single legend row: colored dot + label, with an optional trailing value and
 * chevron. Dumb by design — becomes an accessible button only when `onPress` is
 * provided; it never navigates on its own.
 *
 * Structure mirrors the Figma allocation-card "Chart Legend" node:
 *   [Dot container 20×20 (dot 8)] — gap X1(4) — [Text container: label — gap HALF(2) — value] [chevron]
 */
function SegmentLegendItemBase({
  dotColor,
  label,
  value,
  size = 'medium',
  showChevron = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: SegmentLegendItemProps) {
  const { colors } = useEtoroTheme();
  const textVariants = TEXT_VARIANTS[size];

  // Announce the value alongside the label (e.g. "Stocks 50%") so screen-reader
  // users get the numeric context, not just the category name.
  const defaultAccessibilityLabel = value != null ? `${label} ${value}` : label;

  const content = (
    <View style={[styles.row, style]}>
      <View style={styles.dotContainer}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} testID={testID ? `${testID}-dot` : undefined} />
      </View>
      <View style={styles.rightGroup}>
        <View style={styles.textContainer}>
          <EtText
            variant={textVariants.label}
            numberOfLines={1}
            style={[styles.label, { color: colors.textSecondaryNeutral }]}
            testID={testID ? `${testID}-label` : undefined}
          >
            {label}
          </EtText>
          {value != null && (
            <EtText
              variant={textVariants.value}
              numberOfLines={1}
              style={{ color: colors.textPrimaryNeutral }}
              testID={testID ? `${testID}-value` : undefined}
            >
              {value}
            </EtText>
          )}
        </View>
        {showChevron && <EtIconV2 name="angle-right" size="sm" color={colors.textTertiaryNeutral} />}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} testID={testID} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? defaultAccessibilityLabel}>
        {content}
      </Pressable>
    );
  }

  return (
    <View testID={testID} accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? defaultAccessibilityLabel}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // Figma: [Chart Legend] gap X1(4) between dot container and right group.
    gap: X1,
  },
  dotContainer: {
    width: DOT_CONTAINER_SIZE,
    height: DOT_CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TEXT_CONTAINER_HEIGHT,
    // Figma: [Text Container] gap 2 between label and value.
    gap: HALF,
    flexShrink: 1,
  },
  label: {
    flexShrink: 1,
  },
});

export const SegmentLegendItem = create(SegmentLegendItemBase, 'EtPieChart.SegmentLegendItem');
