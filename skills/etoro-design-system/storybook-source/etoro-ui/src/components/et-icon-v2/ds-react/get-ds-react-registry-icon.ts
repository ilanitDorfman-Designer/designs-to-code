import type { ComponentType } from 'react';

import { IconVariant } from '../api/types';
import type { DsReactIconName } from './ds-react-icon-gallery';
import { resolveDsReactRegistryName } from './ds-react-icon-gallery';
import { DS_REACT_ICON_REGISTRY } from './ds-react-icon-registry';
import type { DsReactLocalIconProps } from './ds-react-local-icon-props';

function baseNameFromFilledKey(name: string): string {
  if (name.endsWith('-fill')) {
    return name.replace(/-fill$/, '');
  }
  // e.g. `notification-fill-1` → `notification-1`
  const m = name.match(/^(.*)-fill-(\d+)$/);
  if (m) {
    return `${m[1]}-${m[2]}`;
  }
  return name;
}

/**
 * Local DS SVG from registry: primary key from {@link resolveDsReactRegistryName}, then fallbacks when only one asset exists:
 * - **Filled** requested but no `*-fill` → use base name (regular SVG).
 * - **Regular** requested but no base → use `{base}-fill` (fill-only symbol).
 */
export function getDsReactRegistryIcon(name: string, resolvedVariant: IconVariant): ComponentType<DsReactLocalIconProps> | undefined {
  const primary = resolveDsReactRegistryName(name, resolvedVariant);
  let icon = DS_REACT_ICON_REGISTRY[primary as DsReactIconName];
  if (icon != null) {
    return icon;
  }

  if (resolvedVariant === IconVariant.Filled) {
    const baseName = baseNameFromFilledKey(primary);
    icon = DS_REACT_ICON_REGISTRY[baseName as DsReactIconName];
    if (icon != null) {
      return icon;
    }
  }

  if (resolvedVariant === IconVariant.Regular) {
    const fillOnlyKey = resolveDsReactRegistryName(name, IconVariant.Filled);
    icon = DS_REACT_ICON_REGISTRY[fillOnlyKey as DsReactIconName];
    if (icon != null) {
      return icon;
    }
  }

  return undefined;
}

/** True when a bundled DS — React SVG exists for this name + variant (including single-asset fallbacks). */
export function hasDsReactRegistrySvg(name: string, variant: IconVariant): boolean {
  return getDsReactRegistryIcon(name, variant) != null;
}
