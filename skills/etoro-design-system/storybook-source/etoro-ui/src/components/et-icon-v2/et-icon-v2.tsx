import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { rtlMirrorTransform } from '../../utils/rtl';
import { EtIconProps, IconVariant } from './api/types';
import { isDsReactIconName } from './ds-react/ds-react-icon-gallery';
import { DsReactPlaceholderIcon } from './ds-react/ds-react-placeholder-icon';
import { getDsReactRegistryIcon } from './ds-react/get-ds-react-registry-icon';
import { useIconAccessibility, useIconConfig } from './hooks';

/**
 * Resolution: (1) `renderIcon` (2) `DS_REACT_ICON_REGISTRY` via {@link getDsReactRegistryIcon} (3) Zappicons CDN when no bundled SVG (4) DS gallery name with no URL → placeholder.
 */
function EtIconV2Base({
  name,
  variant,
  size,
  color,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole,
  onPress,
  accessible,
  flipInRTL,
  renderIcon,
}: EtIconProps) {
  const hasRenderIcon = typeof renderIcon === 'function';
  const resolvedVariant = variant ?? IconVariant.Regular;
  const registryIcon = getDsReactRegistryIcon(name, resolvedVariant);

  /** Skip CDN only when a local renderer exists (`renderIcon` or bundled registry SVG). DS names without a local asset may fall back to Zappicons CDN. */
  const skipCdn = hasRenderIcon || registryIcon != null;

  const {
    iconUrl,
    resolvedSize,
    resolvedColor,
    resolvedVariant: configVariant,
  } = useIconConfig({
    name,
    variant,
    size,
    color,
    skipCdn,
  });

  const a11y = useIconAccessibility({
    name,
    accessibilityLabel,
    accessibilityRole,
    onPress,
    accessible,
  });

  const hasRenderableLocal =
    hasRenderIcon || registryIcon != null || Boolean(iconUrl) || (isDsReactIconName(name) && !iconUrl && !hasRenderIcon && registryIcon == null);
  if (!hasRenderableLocal) {
    return null;
  }

  // Registered navigation glyphs (chevrons, back/forward arrows) mirror in RTL;
  // RN doesn't flip icon content, so do it here once for every consumer. The
  // mirror goes on the *inner* icon box — never the outer container — so a
  // caller `transform` in `style` composes with it instead of colliding.
  const mirrorTransform = rtlMirrorTransform(name, flipInRTL);
  const mirrorStyle = mirrorTransform && { transform: mirrorTransform };

  const sizeStyle = { width: resolvedSize, height: resolvedSize };
  const innerBoxStyle = [styles.innerIconWrap, sizeStyle, mirrorStyle];

  let content: React.ReactNode;
  if (hasRenderIcon && renderIcon) {
    content = <View style={innerBoxStyle}>{renderIcon({ size: resolvedSize, color: resolvedColor })}</View>;
  } else if (registryIcon) {
    const DsLocalIcon = registryIcon;
    content = (
      <View style={innerBoxStyle}>
        <DsLocalIcon size={resolvedSize} color={resolvedColor} />
      </View>
    );
  } else if (iconUrl) {
    content = <Image source={{ uri: iconUrl }} style={[sizeStyle, mirrorStyle]} contentFit="contain" cachePolicy="disk" tintColor={resolvedColor} />;
  } else if (isDsReactIconName(name)) {
    content = (
      <View style={innerBoxStyle}>
        <DsReactPlaceholderIcon size={resolvedSize} color={resolvedColor} variant={configVariant} />
      </View>
    );
  }

  const containerStyle = [sizeStyle, style];
  // An EXPLICITLY decorative icon (`accessible={false}`) must be cut from the
  // accessibility tree for real: on web, `accessible` only maps to
  // focusability, leaving the container's image role and the inner SVG's
  // implicit image role announced as an UNNAMED graphic. `aria-hidden` hides
  // the whole subtree on web and maps to the native hiding props on RN.
  // Two deliberate exclusions: the derived `a11y.accessible` default (any
  // unlabeled icon) would flip kit-wide behavior, and the interactive
  // (Pressable) form must NEVER carry aria-hidden — a focusable element
  // hidden from AT is a WCAG failure.
  const ariaHidden = !onPress && accessible === false ? true : undefined;

  if (onPress) {
    return (
      <Pressable
        style={containerStyle}
        testID={testID}
        accessibilityLabel={a11y.accessibilityLabel}
        accessibilityRole={a11y.accessibilityRole}
        accessible={a11y.accessible}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={containerStyle}
      testID={testID}
      accessibilityLabel={a11y.accessibilityLabel}
      accessibilityRole={a11y.accessibilityRole}
      accessible={a11y.accessible}
      aria-hidden={ariaHidden}
    >
      {content}
    </View>
  );
}

EtIconV2Base.displayName = 'EtIconV2';

/**
 * EtIconV2 — Icon component with outlined/filled variants loaded from CDN; **DS — React** symbols use
 * bundled SVGs from `DS_REACT_ICON_REGISTRY` (`{regularName}-fill` when `variant` is Filled, matching export filenames). If only one of regular / fill
 * exists, the other variant reuses that asset. You can pass `renderIcon`; DS sheet names with no local asset fall back to Zappicons CDN, and a placeholder appears only if no CDN URL is available.
 *
 * @example
 * // Use default icon variant (regular)
 * <EtIconV2 name="settings" />
 *
 * @example
 * // With size preset
 * <EtIconV2 name="settings" size="lg" />
 *
 * @example
 * // Force specific variant
 * <EtIconV2 name="settings" variant="filled" />
 *
 * @example
 * // With custom color
 * <EtIconV2 name="bell" color="#FF0000" />
 *
 * @example
 * // Interactive icon (button) — becomes Pressable when onPress is provided
 * <EtIconV2 name="settings" onPress={() => openSettings()} accessibilityLabel="Open settings" />
 */
export const EtIconV2 = React.memo(EtIconV2Base);

const styles = StyleSheet.create({
  innerIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
