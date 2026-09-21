import { SkeletonVariant } from '../api/types';

export function getDefaultBorderRadius(variant: SkeletonVariant, height: number, borderRadius: number | undefined) {
  if (borderRadius !== undefined) return borderRadius;

  switch (variant) {
    case 'circular':
      return typeof height === 'number' ? height / 2 : 25;
    case 'text':
      // Full pill: text/line placeholders read as soft rounded bars, not rectangles.
      return typeof height === 'number' ? height / 2 : 8;
    case 'rounded':
      return 12;
    case 'rectangular':
    default:
      return 0;
  }
}
