import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { neutralV2Opacity } from '../../../../core/styles/colors/primitives';
import type { EtPieChartProps, PieChartSize } from '../api/types';

/**
 * DS pixel diameters for each named size variant. Kept as an internal detail
 * of the hook so the public API stays semantic (`'small' | 'large'`) and
 * consumers never hardcode pixel numbers.
 */
const SIZE_PX: Record<PieChartSize, number> = {
  small: 100,
  large: 150,
};

/**
 * Default ring thickness as a ratio of the glyph size.
 * Measured from Figma renders of both DS chart sizes:
 *   - small (100 px) → 6 px stroke (6 / 100 = 0.06)
 *   - large (150 px) → 9 px stroke (9 / 150 = 0.06)
 * Source: file `o76z9XJeYzwQ7ls4vg2hzI`, nodes `12771:62438` (small) and `12866:8031` (large).
 */
const DEFAULT_THICKNESS_RATIO = 0.06;

/** Stroke width of the decorative dashed outer ring. */
const OUTER_RING_STROKE = 1.5;

/**
 * Gap between the donut's outer edge and the dashed ring centerline, as a ratio
 * of the glyph diameter. Figma positions the ring with `inset: -5%` around the
 * donut box, so on the 150 px chart the ring's 165 px box sits 7.5 px outside the
 * donut on every side. Expressing it as a ratio keeps both DS sizes in proportion
 * (small 100 px → 5 px, large 150 px → 7.5 px).
 * Source: file `o76z9XJeYzwQ7ls4vg2hzI`, node `12771:61538` ("Breakdown chart").
 */
const OUTER_RING_GAP_RATIO = 0.05;

/**
 * Color of the decorative dashed outer ring — Figma variable `--primary-divider`,
 * which resolves to `#B2B2B24D` on this node.
 *
 * Deliberately the primitive rather than the `carbonPrimaryDivider` semantic token:
 * that token is `neutralV2Opacity[500.3]` (`#B2B2B24D`) in light but drops to
 * `neutralV2Opacity[500.25]` (`#B2B2B240`) in dark, which renders the ring almost
 * invisible against a dark surface. The primitive is a mid-grey with alpha, so it
 * reads correctly on both light and dark backgrounds.
 */
const OUTER_RING_COLOR = neutralV2Opacity[500.3];

/** Dash pattern for the decorative outer ring `[dash, gap]`. */
const OUTER_RING_DASH: [number, number] = [2, 3];

export type PieChartOuterRingConfig = {
  radius: number;
  strokeWidth: number;
  dashArray: [number, number];
  color: string;
};

export type PieChartConfig = {
  /** Layout size in px — the container/View width & height (unchanged by `showOuterRing`). */
  px: number;
  /**
   * SVG viewBox size. Equal to `px` when the outer ring is off; larger than `px`
   * when it's on, so the dashed ring can render outside the donut's `px` footprint
   * (matching Figma's `-5%` inset background). The SVG element uses this size and
   * is centered over the `px × px` container via negative offsets + overflow:visible.
   */
  viewBoxSize: number;
  /** SVG viewBox center coordinate */
  center: number;
  /** Centerline radius of the donut stroke */
  radius: number;
  /** Ring thickness (SVG stroke width) */
  strokeWidth: number;
  /** Full circumference of the centerline circle */
  circumference: number;
  /** Color of the empty-state track ring (only drawn when there are no segments) */
  trackColor: string;
  /** Decorative dashed outer ring config, or null when disabled */
  outerRing: PieChartOuterRingConfig | null;
};

type UsePieChartConfigParams = Pick<EtPieChartProps, 'size' | 'innerRadius' | 'showOuterRing'>;

/**
 * Computes all derived donut geometry + theme-resolved track colors for
 * {@link EtPieChart}. All sizing logic lives here so the component stays layout-free.
 *
 * The donut always occupies the full `size × size` box (outer radius = `size / 2`),
 * so its footprint matches the Figma DS spec regardless of `showOuterRing`. When the
 * outer dashed ring is enabled it sits **outside** that footprint (in the Figma
 * `-5%` inset region), and the caller renders the SVG with a `viewBoxSize` larger
 * than `px` and centers it over the `px × px` container with `overflow: 'visible'`.
 */
export function usePieChartConfig({ size = 'small', innerRadius, showOuterRing = false }: UsePieChartConfigParams): PieChartConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const px = SIZE_PX[size];

    // Room needed OUTSIDE the donut for the dashed ring. The ring centerline sits
    // `ringGap` out; reserving a further full stroke (rather than the half the ring
    // actually occupies) leaves slack so the antialiased edge isn't clipped by the
    // SVG viewport.
    const ringGap = px * OUTER_RING_GAP_RATIO;
    const outerRingExtent = showOuterRing ? ringGap + OUTER_RING_STROKE : 0;
    const viewBoxSize = px + 2 * outerRingExtent;
    const center = viewBoxSize / 2;

    // Donut fills the full `px` footprint — outer edge at radius px / 2.
    const donutOuterRadius = px / 2;

    const defaultThickness = px * DEFAULT_THICKNESS_RATIO;
    // Only honor an explicit `innerRadius` when it's a finite number; a NaN /
    // Infinity override would otherwise poison `radius` and `circumference`.
    const thickness =
      innerRadius != null && Number.isFinite(innerRadius)
        ? Math.min(Math.max(donutOuterRadius - innerRadius, 1), donutOuterRadius)
        : Math.min(defaultThickness, donutOuterRadius);

    const radius = donutOuterRadius - thickness / 2;
    const circumference = 2 * Math.PI * radius;

    const outerRing: PieChartOuterRingConfig | null = showOuterRing
      ? {
          // Centerline sits `ringGap` outside the donut edge, matching the ring's
          // Figma geometry box (110% of the donut box, i.e. `inset: -5%`).
          radius: donutOuterRadius + ringGap,
          strokeWidth: OUTER_RING_STROKE,
          dashArray: OUTER_RING_DASH,
          color: OUTER_RING_COLOR,
        }
      : null;

    return {
      px,
      viewBoxSize,
      center,
      radius,
      strokeWidth: thickness,
      circumference,
      trackColor: colors.dividerTertiary,
      outerRing,
    };
  }, [size, innerRadius, showOuterRing, colors.dividerTertiary]);
}
