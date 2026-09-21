import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { X4, X6 } from '../../../core/styles/spacing';
import { create } from '../../../utils/create';
import { EtButton } from '../../button/et-button';
import type { EtScreenFooterButtonProps, EtScreenFooterProps } from '../api/types';

/**
 * EtScreen.Footer — Footer area with button presets.
 *
 * Supports two placement modes:
 *
 * **Inline (default)** — Place inside `EtScreen.ScrollView`.
 * Renders without `SafeAreaView` so the footer scrolls with content.
 * Note: the inline footer does not reserve the bottom safe-area inset itself —
 * the host scroll container is expected to clear the system inset (e.g. via
 * `contentContainerStyle.paddingBottom`). See `QuestionsForm` for an example.
 *
 * **Sticky** — Place as a sibling of `EtScreen.ScrollView` with `sticky` prop.
 * Wraps in `SafeAreaView` (bottom edge) so the footer stays pinned.
 *
 * @example Inline footer (default, scrolls with content)
 * ```tsx
 * import { useSafeAreaInsets } from 'react-native-safe-area-context';
 *
 * function MyScreen() {
 *   const insets = useSafeAreaInsets();
 *   // The host scroll container clears the system bottom inset so the
 *   // inline footer doesn't overlap the Android nav bar / iOS home indicator.
 *   const scrollContentContainerStyle = { paddingBottom: insets.bottom };
 *   return (
 *     <EtScreen>
 *       <EtScreen.ScrollView contentContainerStyle={scrollContentContainerStyle}>
 *         <EtScreen.Content>...</EtScreen.Content>
 *         <EtScreen.Footer>
 *           <EtScreen.Footer.Primary onPress={submit}>Submit</EtScreen.Footer.Primary>
 *         </EtScreen.Footer>
 *       </EtScreen.ScrollView>
 *     </EtScreen>
 *   );
 * }
 * ```
 *
 * @example Sticky footer (pinned at bottom)
 * ```tsx
 * <EtScreen>
 *   <EtScreen.ScrollView>
 *     <EtScreen.Content>...</EtScreen.Content>
 *   </EtScreen.ScrollView>
 *   <EtScreen.Footer sticky>
 *     <EtScreen.Footer.Primary onPress={submit}>Submit</EtScreen.Footer.Primary>
 *   </EtScreen.Footer>
 * </EtScreen>
 * ```
 */
function ScreenFooterBase({ children, style, sticky = false }: EtScreenFooterProps) {
  if (sticky) {
    return (
      <SafeAreaView edges={['bottom']} style={[styles.footer, style]}>
        <View style={styles.buttons}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.footer, style]}>
      <View style={styles.buttons}>{children}</View>
    </View>
  );
}

function FooterButtonWrapper({
  variant,
  entering,
  exiting,
  size = 'large',
  stretch = true,
  ...buttonProps
}: EtScreenFooterButtonProps & { variant: 'primary-filled' | 'primary-subtle' | 'primary-ghost' }) {
  const button = <EtButton {...buttonProps} variant={variant} stretch={stretch} size={size} />;
  if (!entering && !exiting) {
    return button;
  }
  return (
    <Animated.View entering={entering} exiting={exiting}>
      {button}
    </Animated.View>
  );
}

/** Full-width filled button (`primary-filled`, large). */
const FooterPrimary = create(function FooterPrimary(props: EtScreenFooterButtonProps) {
  return <FooterButtonWrapper {...props} variant="primary-filled" />;
}, 'EtScreen.Footer.Primary');

/** Full-width outlined button (`primary-subtle`, large). */
const FooterSecondary = create(function FooterSecondary(props: EtScreenFooterButtonProps) {
  return <FooterButtonWrapper {...props} variant="primary-subtle" />;
}, 'EtScreen.Footer.Secondary');

/** Full-width text-only button (`primary-ghost`, large). */
const FooterGhost = create(function FooterGhost(props: EtScreenFooterButtonProps) {
  return <FooterButtonWrapper {...props} variant="primary-ghost" />;
}, 'EtScreen.Footer.Ghost');

const ScreenFooterMemo = memo(ScreenFooterBase);
ScreenFooterMemo.displayName = 'EtScreen.Footer';

export const ScreenFooter = Object.assign(ScreenFooterMemo, {
  Primary: FooterPrimary,
  Secondary: FooterSecondary,
  Ghost: FooterGhost,
});

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: X6,
    paddingTop: X4,
    paddingBottom: X6,
  },
  buttons: {
    gap: X4,
  },
});
