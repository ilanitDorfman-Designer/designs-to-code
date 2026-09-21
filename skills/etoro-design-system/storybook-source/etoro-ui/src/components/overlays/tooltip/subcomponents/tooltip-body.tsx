import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import { LEADING_TEXT_STYLE } from '../../../../utils/rtl';
import type { TooltipBodyProps } from '../api/types';

/**
 * EtTooltip.Body - Body content subcomponent
 *
 * Renders body content with automatic text styling.
 * String children are wrapped in EtText with body-base-regular variant.
 * ReactNode children are rendered as-is for custom content.
 *
 * Uses useEtoroTheme directly instead of context because BottomSheetModal
 * renders via a portal, breaking the React context chain.
 *
 * @example String content (auto-styled)
 * ```tsx
 * <EtTooltip.Body>This will be styled automatically</EtTooltip.Body>
 * ```
 *
 * @example Custom content
 * ```tsx
 * <EtTooltip.Body>
 *   <EtText variant="body-base-regular">Custom styled text</EtText>
 *   <EtButton onPress={handleAction}>Learn More</EtButton>
 * </EtTooltip.Body>
 * ```
 */
export function TooltipBodyComponent({ children, style, testID }: TooltipBodyProps) {
  const { colors } = useEtoroTheme();
  const textStyle = [styles.alignedText, { color: colors.textSecondaryNeutral }];

  if (typeof children === 'string') {
    return (
      <View style={style} testID={testID}>
        <EtText variant="body-base-regular" style={textStyle}>
          {children}
        </EtText>
      </View>
    );
  }

  return (
    <View style={style} testID={testID}>
      {children}
    </View>
  );
}

TooltipBodyComponent.displayName = 'EtTooltip.Body';

export const TooltipBody = React.memo(TooltipBodyComponent);
TooltipBody.displayName = 'EtTooltip.Body';

const styles = StyleSheet.create({
  alignedText: LEADING_TEXT_STYLE,
});
