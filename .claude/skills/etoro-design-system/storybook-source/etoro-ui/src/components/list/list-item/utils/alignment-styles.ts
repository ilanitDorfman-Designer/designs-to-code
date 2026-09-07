export type AlignmentType = 'top' | 'center' | 'bottom';

/**
 * Gets flex alignment styles based on content alignment
 */
export function getAlignmentStyles(alignment: AlignmentType = 'center') {
  switch (alignment) {
    case 'top':
      return { alignItems: 'flex-start' as const };
    case 'bottom':
      return { alignItems: 'flex-end' as const };
    default: // 'center'
      return { alignItems: 'center' as const };
  }
}
