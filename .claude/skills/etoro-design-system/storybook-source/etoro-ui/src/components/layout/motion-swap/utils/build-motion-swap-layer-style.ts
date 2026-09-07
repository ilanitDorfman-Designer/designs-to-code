type MotionSwapLayer = 'first' | 'second';

export function buildMotionSwapLayerStyle(
  progress: number,
  axis: 'x' | 'y',
  distance: number,
  layer: MotionSwapLayer,
  opacityOnly: boolean,
): { opacity: number; transform?: Array<{ translateX: number } | { translateY: number }> } {
  'worklet';
  const isFirst = layer === 'first';
  const opacity = isFirst ? 1 - progress : progress;

  if (opacityOnly) {
    return { opacity };
  }

  const rawTranslate = isFirst ? -distance * progress : distance * (1 - progress);
  const translate = rawTranslate === 0 ? 0 : rawTranslate;
  return {
    opacity,
    transform: axis === 'x' ? [{ translateX: translate }] : [{ translateY: translate }],
  };
}
