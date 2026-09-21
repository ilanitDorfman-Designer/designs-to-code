/**
 * Generates an SVG arc path for the progress indicator.
 * Uses SVG arc command which properly supports strokeLinecap="round".
 *
 * @param center - Center point of the SVG
 * @param radius - Radius of the circle
 * @param progress - Progress value (0-1)
 * @returns SVG path string, empty string for 0 progress, or null for full circle
 */
export function getArcPath(center: number, radius: number, progress: number): string | null {
  // Guard invalid inputs
  if (!Number.isFinite(progress) || !Number.isFinite(radius) || radius <= 0) {
    return '';
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Handle edge cases
  if (clampedProgress <= 0) return '';
  // For full circle, return null - component should render a Circle element instead
  // Using a Path for full circle causes overlapping rounded caps at the join point
  if (clampedProgress >= 1) return null;

  // Calculate the arc angle (starting from top, going clockwise)
  const startAngle = -Math.PI / 2; // Start at top (12 o'clock)
  const endAngle = startAngle + clampedProgress * 2 * Math.PI;

  // Calculate start and end points
  const startX = center + radius * Math.cos(startAngle);
  const startY = center + radius * Math.sin(startAngle);
  const endX = center + radius * Math.cos(endAngle);
  const endY = center + radius * Math.sin(endAngle);

  // Large arc flag: 1 if arc > 180 degrees
  const largeArcFlag = clampedProgress > 0.5 ? 1 : 0;

  // Sweep flag: 1 for clockwise
  const sweepFlag = 1;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
}
