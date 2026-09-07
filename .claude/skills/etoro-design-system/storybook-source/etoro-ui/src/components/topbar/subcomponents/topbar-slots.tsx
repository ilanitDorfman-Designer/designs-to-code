import { StyleSheet, View } from 'react-native';

import { X5, X6 } from '../../../core/styles';
import type { useSlots } from '../hooks';
import { mergeAdditionalProps } from '../utils';
import { GlassSlotWrapper } from './glass-slot-wrapper';

interface TopbarSlotsProps {
  slots: ReturnType<typeof useSlots>;
  disableLiquidGlass: boolean;
}

/**
 * Renders the slot structure shared by both EtTopbar and EtTopbar.Animated.
 *
 * In Liquid Glass mode the render order is start → middle → end as flex siblings
 * (with equal-flex edge slots for true centering). In standard mode the middle
 * slot is absolutely positioned so it can sit behind the start/end slots.
 */
export function TopbarSlots({ slots, disableLiquidGlass }: TopbarSlotsProps) {
  const { start, middle, end, hasAnySlot } = slots;

  if (!disableLiquidGlass) {
    return (
      <>
        <View
          testID={start.testID}
          style={[styles.glassEdgeSlot, styles.startSlot, ...start.styles]}
          {...mergeAdditionalProps(start.additionalProps)}
        >
          <GlassSlotWrapper disableLiquidGlass={false}>{start.children}</GlassSlotWrapper>
        </View>

        {middle.children.length > 0 && (
          <View testID={middle.testID} style={[styles.middleSlotGlass, ...middle.styles]} {...mergeAdditionalProps(middle.additionalProps)}>
            {middle.children}
          </View>
        )}

        <View testID={end.testID} style={[styles.glassEdgeSlot, styles.endSlot, ...end.styles]} {...mergeAdditionalProps(end.additionalProps)}>
          <GlassSlotWrapper disableLiquidGlass={false}>{end.children}</GlassSlotWrapper>
        </View>
      </>
    );
  }

  return (
    <>
      <View testID={start.testID} style={[styles.startSlot, ...start.styles]} {...mergeAdditionalProps(start.additionalProps)}>
        {start.children}
      </View>

      <View testID={end.testID} style={[styles.endSlot, ...end.styles]} {...mergeAdditionalProps(end.additionalProps)}>
        {end.children}
      </View>

      {middle.children.length > 0 && (
        <View
          testID={middle.testID}
          pointerEvents={hasAnySlot ? 'box-none' : undefined}
          style={[styles.middleSlot, ...middle.styles]}
          {...mergeAdditionalProps(middle.additionalProps)}
        >
          {middle.children}
        </View>
      )}
    </>
  );
}

TopbarSlots.displayName = 'TopbarSlots';

const styles = StyleSheet.create({
  startSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // Replaces the inter-button spacing previously provided by TopbarAction's
    // horizontal padding. Only takes effect in non-glass mode; glass mode lays
    // children out via GlassSlotWrapper's own row + gap.
    gap: X6,
    zIndex: 2,
  },
  endSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: X6,
    zIndex: 2,
  },
  middleSlot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  glassEdgeSlot: {
    flex: 1,
  },
  middleSlotGlass: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: X5,
  },
});
