import { useEtoroTheme } from '../../../../core/hooks';
import { EtChipsGroupV2 } from '../../../controls/chips-group-v2/et-chips-group-v2';
import type { SectionChipsProps } from '../api/types';

/**
 * EtSection.Chips - Chips group subcomponent
 *
 * A wrapper for EtChipsGroupV2 that automatically handles fadeColor
 * default to match the section background.
 *
 * @example
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>Filters</EtSection.Title>
 *   <EtSection.Chips
 *     items={filterChips}
 *     selectionMode="single"
 *     value={selected}
 *     onChange={setSelected}
 *   />
 * </EtSection>
 * ```
 */
export function SectionChips(props: SectionChipsProps) {
  const { colors } = useEtoroTheme();
  const { fadeColor = colors.backgroundBase, ...restProps } = props;

  return <EtChipsGroupV2 {...restProps} fadeColor={fadeColor} />;
}

SectionChips.displayName = 'EtSection.Chips';
