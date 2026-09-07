import { EtPagination } from '../../../navigation/pagination/et-pagination';
import type { SectionPaginationProps } from '../api/types';

/**
 * EtSection.Pagination - Pagination dots subcomponent
 *
 * A wrapper for EtPagination that defaults to section-appropriate styling
 * (size="small", color="neutral"). Consumer can override any prop.
 *
 * @example
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>Featured</EtSection.Title>
 *   <Animated.FlatList horizontal data={items} onScroll={scrollHandler} ... />
 *   <EtSection.Pagination
 *     totalPages={5}
 *     currentPage={currentPageAnimated}
 *   />
 * </EtSection>
 * ```
 */
export function SectionPagination(props: SectionPaginationProps) {
  const { size = 'small', color = 'neutral', ...restProps } = props;

  return <EtPagination {...restProps} size={size} color={color} />;
}

SectionPagination.displayName = 'EtSection.Pagination';
