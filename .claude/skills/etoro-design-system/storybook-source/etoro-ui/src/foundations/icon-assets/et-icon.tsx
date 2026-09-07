import { AccessibilityRole, View } from 'react-native';

import { rtlMirrorTransform } from '../../utils/rtl';
import { EtoroIconProps } from './api';
import { useIconAccessibility, useIconTheme } from './hooks';
import { getIconComponent, getIconSize, iconSupportsFill, initProps } from './utils';

/**
 * @deprecated Use `EtIconV2` instead.
 */
export function EtoroIcon(props: EtoroIconProps) {
  const { icon, appearance, style, accessibility, advanced } = initProps(props);

  // Use theme-aware icon handling
  const { iconName: themeAwareIconName, color: themeAwareColor } = useIconTheme({
    iconName: icon?.iconName,
    color: appearance.color,
  });

  // Use accessibility helpers
  const { accessibilityProps } = useIconAccessibility({
    iconName: icon?.iconName,
    size: typeof appearance.size === 'number' ? appearance.size : undefined,
    accessibilityLabel: accessibility.accessibilityLabel,
    accessibilityRole: accessibility.accessibilityRole,
  });

  // Get the actual icon component
  const IconComponent = getIconComponent(themeAwareIconName);

  if (!IconComponent) {
    return null;
  }

  // Calculate final size
  const finalSize = getIconSize(appearance.size);

  // Calculate final color (theme-aware takes precedence)
  const finalColor = themeAwareColor;

  // Check if icon supports fill and apply if requested
  const shouldApplyFill = style.hasFill && iconSupportsFill(icon?.iconName);
  const finalFill = shouldApplyFill ? style.fill || finalColor : undefined;

  // Registered navigation glyphs (chevrons, back/forward) mirror in RTL. RN
  // doesn't flip icon content, so wrap the glyph — not the caller-styled
  // container — so any caller `transform` composes with the mirror.
  const mirrorTransform = rtlMirrorTransform(themeAwareIconName, icon?.flipInRTL);
  const glyph = <IconComponent size={finalSize} color={finalColor} hasFill={shouldApplyFill} fill={finalFill} {...advanced?.svgProps} />;

  return (
    <View
      style={style.style}
      testID={accessibility.testID}
      accessibilityLabel={accessibilityProps.accessibilityLabel}
      accessibilityRole={accessibilityProps.accessibilityRole as AccessibilityRole}
      accessible={accessibilityProps.accessible}
    >
      {mirrorTransform ? <View style={{ transform: mirrorTransform }}>{glyph}</View> : glyph}
    </View>
  );
}
