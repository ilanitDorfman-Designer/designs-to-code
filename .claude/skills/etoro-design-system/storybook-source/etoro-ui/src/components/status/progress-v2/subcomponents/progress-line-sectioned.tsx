import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { HALF } from '../../../../core/styles/spacing';
import { PROGRESS_SECTIONED_SWEEP_DURATION, ProgressLineSectionedProps } from '../api';
import { ProgressLine } from './progress-line';

/**
 * Sectioned Line variant of the progress indicator.
 * Displays multiple horizontal bars with gaps.
 *
 * The whole sweep takes a fixed total time (`PROGRESS_SECTIONED_SWEEP_DURATION`)
 * regardless of how many sections there are. Each section gets a slice of that
 * budget proportional to the width it fills, and starts exactly when the
 * previous one finishes — with linear easing inside each section. The filled
 * portion therefore crosses every section at one constant speed, so the row
 * reads as a single continuous line instead of jumping per section.
 */
export const ProgressLineSectioned = memo<ProgressLineSectionedProps>(
  ({ progress, sections, gap = HALF, size = 'small', color = 'positive', showBackground = false, style, testID, fillEntering, customColor }) => {
    const clampedProgress = Math.max(0, Math.min(progress, 1));

    const gapStyles = useMemo(() => StyleSheet.create({ withGap: { marginLeft: gap } }), [gap]);

    // Total filled width expressed in "section units" (e.g. 0.5 over 4 sections
    // = 2 units). The sweep budget is split across these units so speed is
    // constant; guard against 0 to avoid dividing by zero when nothing fills.
    const totalFilledUnits = clampedProgress * sections;
    const durationPerUnit = totalFilledUnits > 0 ? PROGRESS_SECTIONED_SWEEP_DURATION / totalFilledUnits : 0;

    const sectionViews = [];
    let elapsedDelay = 0;
    for (let i = 0; i < sections; i++) {
      const sectionProgress = Math.max(0, Math.min(clampedProgress * sections - i, 1));
      const sectionDuration = sectionProgress * durationPerUnit;

      sectionViews.push(
        <ProgressLine
          key={i}
          progress={sectionProgress}
          size={size}
          color={color}
          showBackground={showBackground}
          customColor={customColor}
          showLabel={false}
          style={[styles.section, i > 0 && gapStyles.withGap]}
          testID={testID ? `${testID}-section-${i}` : undefined}
          fillEntering={fillEntering}
          fillDelay={elapsedDelay}
          fillDuration={sectionDuration}
          animateOnMount={fillEntering ?? false}
        />,
      );

      // The next section starts exactly when this one finishes its slice.
      elapsedDelay += sectionDuration;
    }

    return (
      <View style={[styles.container, style]} testID={testID}>
        {sectionViews}
      </View>
    );
  },
);

ProgressLineSectioned.displayName = 'EtProgressV2.LineSectioned';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  section: {
    flex: 1,
  },
});
