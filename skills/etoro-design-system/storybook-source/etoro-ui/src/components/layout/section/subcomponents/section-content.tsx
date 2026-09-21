import { View } from 'react-native';

import { SectionContentProps } from '../api/types';

/**
 * EtSection.Content - Content wrapper subcomponent
 *
 * A flexible container for section content.
 * Can contain any content: lists, text, custom components, etc.
 *
 * @example
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>Settings</EtSection.Title>
 *   <EtSection.Content>
 *     <EtListItem ... />
 *   </EtSection.Content>
 * </EtSection>
 * ```
 */
export function SectionContent({ children, style, testID }: SectionContentProps) {
  return (
    <View style={style} testID={testID}>
      {children}
    </View>
  );
}

SectionContent.displayName = 'EtSection.Content';
