import { memo, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { EntryOrExitLayoutType } from 'react-native-reanimated';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../../core/hooks';
import { X4, X6 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text/et-text';
import type {
  EtScreenContentAlignment,
  EtScreenContentBodyProps,
  EtScreenContentDisclaimerProps,
  EtScreenContentProps,
  EtScreenContentSubtitleProps,
  EtScreenContentTitleProps,
} from '../api/types';
import { ScreenContentRenderer } from './screen-content-renderer';

const ALIGN_ITEMS_MAP: Record<EtScreenContentAlignment, ViewStyle['alignItems']> = {
  left: 'stretch',
  center: 'center',
  right: 'flex-end',
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * EtScreen.Content.Title — Primary heading rendered at the top.
 *
 * Uses `display-main` text variant by default (`display-compact` available via
 * `variant`). Supports left, center, and right alignment.
 *
 * @example
 * ```tsx
 * <EtScreen.Content.Title>Personal Details</EtScreen.Content.Title>
 * <EtScreen.Content.Title alignment="center">All Done!</EtScreen.Content.Title>
 * <EtScreen.Content.Title variant="display-compact">How do you plan to fund?</EtScreen.Content.Title>
 * ```
 */
function ScreenContentTitle({ children, alignment = 'left', style, variant = 'display-main' }: EtScreenContentTitleProps) {
  return (
    <View style={[styles.title, { alignItems: ALIGN_ITEMS_MAP[alignment] }, style]}>
      <EtText variant={variant} style={{ textAlign: alignment }}>
        {children}
      </EtText>
    </View>
  );
}

/**
 * EtScreen.Content.Subtitle — Secondary line rendered below the title.
 *
 * Uses `body-base-regular` text variant with `textSecondaryNeutral` colour.
 *
 * @example
 * ```tsx
 * <EtScreen.Content.Subtitle>
 *   Tell us a bit about yourself so we can set up your account.
 * </EtScreen.Content.Subtitle>
 * ```
 */
function ScreenContentSubtitle({ children, alignment = 'left', style }: EtScreenContentSubtitleProps) {
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.subtitle, { alignItems: ALIGN_ITEMS_MAP[alignment] }, style]}>
      <EtText variant="body-base-regular" style={{ textAlign: alignment, color: colors.carbon500 }}>
        {children}
      </EtText>
    </View>
  );
}

/**
 * EtScreen.Content.Disclaimer — Small disclaimer text below the subtitle.
 *
 * Uses `body-tiny-regular` text variant with `carbon500` colour.
 *
 * @example
 * ```tsx
 * <EtScreen.Content.Disclaimer>
 *   Your data is encrypted and securely stored.
 * </EtScreen.Content.Disclaimer>
 * ```
 */
function ScreenContentDisclaimer({ children, alignment = 'left', style }: EtScreenContentDisclaimerProps) {
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.disclaimer, { alignItems: ALIGN_ITEMS_MAP[alignment] }, style]}>
      <EtText variant="body-tiny-regular" style={{ textAlign: alignment, color: colors.carbon500 }}>
        {children}
      </EtText>
    </View>
  );
}

/**
 * EtScreen.Content.Body — Main body area for forms, lists, or custom content.
 *
 * Adds top margin and horizontal padding. Supports alignment for centered layouts.
 *
 * @example
 * ```tsx
 * <EtScreen.Content.Body>
 *   <TextInput placeholder="Full name" />
 *   <TextInput placeholder="Email" />
 * </EtScreen.Content.Body>
 * ```
 */
function ScreenContentBody({ children, alignment = 'left', style }: EtScreenContentBodyProps) {
  return <View style={[styles.body, { alignItems: ALIGN_ITEMS_MAP[alignment] }, style]}>{children}</View>;
}

// ============================================================================
// Root wrapper — content slot container
// ============================================================================

/**
 * EtScreen.Content — Structured content layout with Title, Subtitle, and Body slots.
 *
 * Must be placed inside `EtScreen.ScrollView` or `EtScreen.View`.
 * Provides a consistent structure for wizard steps, onboarding screens,
 * and any layout that needs a title + subtitle + body pattern.
 *
 * Extends React Native's ViewProps for full native API access.
 *
 * @example Inside ScrollView
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtScreen.ScrollView>
 *     <EtScreen.Content>
 *       <EtScreen.Content.Title>Step 1</EtScreen.Content.Title>
 *       <EtScreen.Content.Subtitle>Enter your details.</EtScreen.Content.Subtitle>
 *       <EtScreen.Content.Body>
 *         <NameForm />
 *       </EtScreen.Content.Body>
 *     </EtScreen.Content>
 *   </EtScreen.ScrollView>
 *   <EtScreen.Footer sticky>
 *     <EtScreen.Footer.Primary onPress={next}>Next</EtScreen.Footer.Primary>
 *   </EtScreen.Footer>
 * </EtScreen>
 * ```
 *
 * @example Inside View (static layout)
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtScreen.View>
 *     <EtScreen.Content>
 *       <EtScreen.Content.Title alignment="center">All Done!</EtScreen.Content.Title>
 *       <EtScreen.Content.Subtitle alignment="center">
 *         Your account is verified.
 *       </EtScreen.Content.Subtitle>
 *     </EtScreen.Content>
 *   </EtScreen.View>
 * </EtScreen>
 * ```
 */
function ScreenContentBase({ children, style, ...rest }: EtScreenContentProps) {
  return (
    <View style={[styles.contentContainer, style]} {...rest}>
      {children}
    </View>
  );
}

const ScreenContentMemo = memo(ScreenContentBase);
ScreenContentMemo.displayName = 'EtScreen.Content';

export const ScreenContent = Object.assign(ScreenContentMemo, {
  Title: ScreenContentTitle,
  Subtitle: ScreenContentSubtitle,
  Disclaimer: ScreenContentDisclaimer,
  Body: ScreenContentBody,
});

// ============================================================================
// EtScreenContent — internal animated wrapper used by EtScreen root
// ============================================================================

interface EtScreenContentProps_Internal {
  gradient?: boolean;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
  style?: StyleProp<ViewStyle>;
  safeAreaProps?: Omit<SafeAreaViewProps, 'children' | 'style'>;
  children: ReactNode;
}

/**
 * Inner component that sits below ScreenContextProvider.
 * Handles optional enter/exit layout animations, then delegates to ScreenContentRenderer.
 */
export function EtScreenContent({ gradient, entering, exiting, style, safeAreaProps, children }: EtScreenContentProps_Internal) {
  const { colors } = useEtoroTheme();
  const useAnimatedContainer = Boolean(entering) || Boolean(exiting);
  const Container = useAnimatedContainer ? Animated.View : View;

  return (
    <Container style={[styles.animatedContainer, { backgroundColor: colors.backgroundBase }]} {...(useAnimatedContainer && { entering, exiting })}>
      <ScreenContentRenderer gradient={gradient} style={style} safeAreaProps={safeAreaProps}>
        {children}
      </ScreenContentRenderer>
    </Container>
  );
}

EtScreenContent.displayName = 'EtScreenContent';

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  title: {
    marginTop: X4,
    paddingHorizontal: X6,
  },
  subtitle: {
    marginTop: X4,
    paddingHorizontal: X6,
  },
  disclaimer: {
    marginTop: X4,
    marginBottom: X4,
    paddingHorizontal: X6,
  },
  body: {
    marginTop: X6,
    paddingHorizontal: X6,
  },
});
