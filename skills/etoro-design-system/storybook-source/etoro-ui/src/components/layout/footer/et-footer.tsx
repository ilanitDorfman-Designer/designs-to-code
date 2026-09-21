import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X4, X6, X9 } from '../../../core/styles/spacing';
import { EtFooterProps } from './api';
import { FooterLink, FooterScrollable, FooterSection } from './subcomponents';

/**
 * Footer component for page layouts.
 *
 * A flexible compound component for building page footers with disclaimer text,
 * buttons, checkboxes, pagination, and navigation links.
 *
 * ## Component Structure
 * - `EtFooter` - Root container
 * - `EtFooter.Scrollable` - Scrollable container (vertical by default, horizontal with pagination)
 * - `EtFooter.Section` - Section wrapper for elements (disclaimer, buttons, checkbox, links)
 * - `EtFooter.Link` - Individual navigation link
 *
 * @example Links only
 * ```tsx
 * <EtFooter>
 *   <EtFooter.Section style={styles.linksRow}>
 *     <EtFooter.Link onPress={handleTerms}>Terms</EtFooter.Link>
 *     <EtFooter.Link onPress={handlePrivacy}>Privacy</EtFooter.Link>
 *   </EtFooter.Section>
 * </EtFooter>
 *
 * // styles.linksRow = { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }
 * ```
 *
 * @example With disclaimer and button
 * ```tsx
 * <EtFooter>
 *   <EtFooter.Section>
 *     <EtText variant="body-tiny-regular">
 *       By continuing, you agree to our terms of service.
 *     </EtText>
 *   </EtFooter.Section>
 *   <EtFooter.Section>
 *     <EtButton stretch onPress={handleContinue}>Continue</EtButton>
 *   </EtFooter.Section>
 * </EtFooter>
 * ```
 *
 * @example With vertical scrolling (tall content)
 * ```tsx
 * <EtFooter>
 *   <EtFooter.Scrollable>
 *     <EtFooter.Section>
 *       <EtText>Long scrollable content...</EtText>
 *     </EtFooter.Section>
 *   </EtFooter.Scrollable>
 *   <EtFooter.Section>
 *     <EtButton stretch onPress={handleContinue}>Continue</EtButton>
 *   </EtFooter.Section>
 * </EtFooter>
 * ```
 *
 * @example With horizontal pagination (scrollable pages with dots)
 * ```tsx
 * <EtFooter contentStyle={{ padding: 0 }}>
 *   <EtFooter.Scrollable direction="horizontal">
 *     <EtFooter.Section>
 *       <EtText>Page 1 content</EtText>
 *     </EtFooter.Section>
 *     <EtFooter.Section>
 *       <EtText>Page 2 content</EtText>
 *     </EtFooter.Section>
 *   </EtFooter.Scrollable>
 *   <EtFooter.Section style={{ paddingHorizontal: 36, paddingVertical: 24 }}>
 *     <EtButton stretch onPress={handleContinue}>Continue</EtButton>
 *   </EtFooter.Section>
 * </EtFooter>
 * ```
 */
function EtFooterBase({ children, style, contentStyle, ...rest }: EtFooterProps) {
  const { colors } = useEtoroTheme();

  const containerStyles = [styles.container, { backgroundColor: colors.backgroundBase }, style];

  return (
    <View {...rest} style={containerStyles}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

EtFooterBase.displayName = 'EtFooter';

const EtFooterMemoized = memo(EtFooterBase);

export const EtFooter = Object.assign(EtFooterMemoized, {
  Link: FooterLink,
  Scrollable: FooterScrollable,
  Section: FooterSection,
}) as typeof EtFooterMemoized & {
  Link: typeof FooterLink;
  Scrollable: typeof FooterScrollable;
  Section: typeof FooterSection;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    paddingHorizontal: X9,
    paddingVertical: X6,
    gap: X4,
  },
});
