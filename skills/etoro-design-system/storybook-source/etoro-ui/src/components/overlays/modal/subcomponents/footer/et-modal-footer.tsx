import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EtModalFooterProps } from '../../api';
import { FOOTER_BUTTON_GAP, FOOTER_PADDING_BOTTOM, FOOTER_PADDING_HORIZONTAL, FOOTER_PADDING_TOP } from '../../constants';
import { useModalConfig } from '../../context';

/**
 * EtModal.Footer - Footer section for action buttons
 *
 * Matches the API and styling of EtBottomSheetV2.Footer.
 * Inherits the modal's surface colour (driven by EtModal's `surface` prop) so the footer reads as
 * one continuous surface with content & header — no two-tone seam when a non-default surface is used.
 */
export function EtModalFooter({ children, style }: EtModalFooterProps): ReactNode {
  const { colors } = useModalConfig();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(FOOTER_PADDING_BOTTOM, insets.bottom);

  return (
    <View
      style={[
        styles.footer,
        { backgroundColor: colors.background },
        style,
        // Safe-area inset applied last so a caller `style` can't clobber it and drop CTAs under the home indicator.
        { paddingBottom: bottomPadding },
      ]}
    >
      {children}
    </View>
  );
}

EtModalFooter.displayName = 'EtModal.Footer';

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: FOOTER_PADDING_HORIZONTAL,
    paddingTop: FOOTER_PADDING_TOP,
    gap: FOOTER_BUTTON_GAP,
  },
});
