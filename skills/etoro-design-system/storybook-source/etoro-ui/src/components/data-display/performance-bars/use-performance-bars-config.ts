import { useMemo } from 'react';

import type { EtPerformanceBarsLayout, PerformanceBarsColors, PerformanceBarsDataItem } from './api';
import type { BarConfig } from './subcomponents';

const EMPTY_DATA: PerformanceBarsDataItem[] = [];
const UNSELECTED_OPACITY = 0.2;

interface UsePerformanceBarsConfigParams {
  data?: PerformanceBarsDataItem[];
  totalSlots: number;
  halfHeight: number;
  chartHeight: number;
  layout?: EtPerformanceBarsLayout;
  selectedIndex?: number | null;
  /** Resolved colour scheme (theme default or caller override) — see {@link EtPerformanceBars}. */
  colors: PerformanceBarsColors;
}

export function usePerformanceBarsConfig({
  data = EMPTY_DATA,
  totalSlots,
  halfHeight,
  chartHeight,
  layout = 'centered',
  selectedIndex = null,
  colors,
}: UsePerformanceBarsConfigParams) {
  const isBottomUp = layout === 'bottom-up';
  // Centered bars fill a half (above/below the axis); bottom-up bars fill the full height from the floor.
  const barAreaHeight = isBottomUp ? chartHeight : halfHeight;
  const displayedData = useMemo(() => (data.length <= totalSlots ? data : data.slice(0, totalSlots)), [data, totalSlots]);

  const hasData = displayedData.length > 0;

  const normalizedSelectedIndex = selectedIndex != null && selectedIndex >= 0 && selectedIndex < displayedData.length ? selectedIndex : null;

  const maxAbs = useMemo(() => {
    if (!hasData) return 1;
    const values = displayedData.map((d) => (isBottomUp ? Math.max(0, d.value) : Math.abs(d.value)));
    return Math.max(1, ...values);
  }, [displayedData, hasData, isBottomUp]);

  const scaleValues = useMemo(
    () =>
      isBottomUp
        ? {
            // Bottom-up bars grow from a zero floor to a positive max — the axis runs 0 → +max.
            top: `+${maxAbs.toFixed(0)}%`,
            middle: `+${(maxAbs / 2).toFixed(0)}%`,
            bottom: '0%',
          }
        : {
            top: `+${maxAbs.toFixed(0)}%`,
            middle: '0%',
            bottom: `-${maxAbs.toFixed(0)}%`,
          },
    [maxAbs, isBottomUp],
  );

  const barConfigs = useMemo((): BarConfig[] => {
    // Bottom-up empty months show a faded "ghost" slot track instead of the centered slot gradients.
    const ghostTrackColors: [string, string] = colors.slot;
    return Array.from({ length: totalSlots }, (_, index): BarConfig => {
      const item: PerformanceBarsDataItem | null = displayedData[index] ?? null;
      const hasBar = item != null;
      const isSelected = normalizedSelectedIndex === index;
      const isPositive = hasBar && (isBottomUp ? item.value > 0 : item.value >= 0);
      const magnitude = hasBar ? (isBottomUp ? Math.max(0, item.value) : Math.abs(item.value)) : 0;
      const isGhostTrack = isBottomUp && (!hasBar || magnitude === 0);
      const barHeight = hasBar && magnitude > 0 ? (magnitude / maxAbs) * barAreaHeight : 0;
      const isPressable = isBottomUp ? hasBar && magnitude > 0 : hasBar;

      // Muted bars (e.g. back-tested / simulated results) use the neutral gradient when the caller
      // provides one; otherwise they fall back to the sign-based color so the bar is never invisible.
      const isMuted = hasBar && item.muted === true;
      const signGradientColors: [string, string] = isPositive ? colors.positiveBar : colors.negativeBar;
      const barGradientColors: [string, string] = isMuted && colors.mutedBar ? colors.mutedBar : signGradientColors;

      // The centered bar always keeps the *true* sign colours underneath and picks between them from
      // its animated position (green above the axis, red below) so it flips exactly at zero. Muting is
      // layered on top as a separate grey overlay (`mutedGradientColors`), so a bar can hold grey
      // through a height morph and reveal colour only once it has settled (and vice-versa).
      const positiveGradientColors: [string, string] = colors.positiveBar;
      const negativeGradientColors: [string, string] = colors.negativeBar;
      const mutedGradientColors: [string, string] | undefined = colors.mutedBar;

      // Selected bar gets its own backing (the colour scheme decides whether that's a highlight or a
      // soft fade); every other slot uses the shared slot background. Unselected bars are dimmed.
      const topBackgroundColors = isSelected && hasBar && isPositive ? colors.selectedPositive : colors.slot;
      const bottomBackgroundColors = isSelected && hasBar && !isPositive ? colors.selectedNegative : colors.slot;

      const barOpacity = normalizedSelectedIndex != null && !isSelected ? UNSELECTED_OPACITY : 1;

      return {
        item,
        hasBar,
        isPressable,
        isPositive,
        isGhostTrack,
        barHeight,
        index,
        isMuted,
        barGradientColors,
        positiveGradientColors,
        negativeGradientColors,
        mutedGradientColors,
        topBackgroundColors,
        bottomBackgroundColors,
        ghostTrackColors,
        barOpacity,
        layout,
      };
    });
  }, [totalSlots, displayedData, maxAbs, barAreaHeight, normalizedSelectedIndex, colors, isBottomUp, layout]);

  return { barConfigs, hasData, maxAbs, scaleValues };
}
