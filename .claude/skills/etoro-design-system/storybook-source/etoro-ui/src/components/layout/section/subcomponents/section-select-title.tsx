import { EtSelect } from '../../../controls/select';
import { SectionSelectTitleProps } from '../api/types';

/**
 * EtSection.SelectTitle - Pressable title with chevron icon
 *
 * Uses EtSelect with type="text" internally for consistent styling.
 * The title is pressable and shows a chevron down icon to indicate
 * it opens a picker/selector.
 *
 * @example
 * ```tsx
 * <EtSection>
 *   <EtSection.SelectTitle
 *     text="Selected Option"
 *     onPress={() => openPicker()}
 *   />
 *   <EtSection.Chips items={chips} ... />
 * </EtSection>
 * ```
 */
export function SectionSelectTitle({ text, onPress, haptics = true, style, testID, accessibilityLabel, accessibilityHint }: SectionSelectTitleProps) {
  return (
    <EtSelect
      type="text"
      onPress={onPress}
      haptics={haptics}
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {text}
    </EtSelect>
  );
}

SectionSelectTitle.displayName = 'EtSection.SelectTitle';
