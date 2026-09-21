import { StyleSheet } from 'react-native';

import { EtText } from '../../../../foundations/text';
import { SectionTitleProps } from '../api/types';
import { useSectionContext } from '../context';

/**
 * EtSection.Title - Static title subcomponent
 *
 * Renders a heading-large styled text for section titles.
 * Automatically styled based on parent section context.
 *
 * @example
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>My Watchlist</EtSection.Title>
 *   <EtSection.Content>...</EtSection.Content>
 * </EtSection>
 * ```
 */
export function SectionTitle({ children, style, testID }: SectionTitleProps) {
  const { textColor } = useSectionContext();

  // `textAlign: 'left'` follows layout direction (leading edge) under RTL —
  // default `'auto'` would keep Latin/fallback titles physically left.
  return (
    <EtText variant="heading-large" style={[{ color: textColor }, styles.alignedText, style]} testID={testID}>
      {children}
    </EtText>
  );
}

SectionTitle.displayName = 'EtSection.Title';

const styles = StyleSheet.create({
  alignedText: {
    textAlign: 'left',
  },
});
