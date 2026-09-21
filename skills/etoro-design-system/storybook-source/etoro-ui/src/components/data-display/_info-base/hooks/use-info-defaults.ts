import { useMemo } from 'react';

import type { InfoAvatarData, InfoDataBase, InfoDefaultsBase, InfoDefaultsConfig } from '../types';

/** Input type allows optional layout/ellipsizeMode (resolved by hook). */
type InputDefaults = {
  data: InfoDataBase;
  layout?: InfoDefaultsBase['layout'];
  ellipsizeMode?: InfoDefaultsBase['ellipsizeMode'];
  maxWidth?: number;
};

/**
 * Generic defaults hook for info components.
 * Resolves layout, ellipsizeMode, maxWidth, and avatar defaults.
 *
 * @param input - Raw props (data, layout, ellipsizeMode, maxWidth)
 * @param config - Optional config for avatar defaults and data handling
 */
export function useInfoDefaults(input: InputDefaults, config: InfoDefaultsConfig = {}): InfoDefaultsBase {
  const { defaultAvatarShape = 'square', defaultAvatarSize = 'medium', defaultAvatarVariant } = config;

  const { data: rawData, layout, ellipsizeMode, maxWidth } = input;

  return useMemo<InfoDefaultsBase>(() => {
    const safeData: InfoDataBase = rawData;

    const normalizedAvatar: InfoAvatarData | undefined = safeData.avatar
      ? {
          ...safeData.avatar,
          source: safeData.avatar.source,
          shape: safeData.avatar.shape ?? defaultAvatarShape,
          size: safeData.avatar.size ?? defaultAvatarSize,
          alt: safeData.avatar.alt,
          variant: safeData.avatar.variant ?? defaultAvatarVariant,
        }
      : undefined;
    const normalizedData: InfoDataBase = normalizedAvatar ? { ...safeData, avatar: normalizedAvatar } : safeData;

    return {
      layout: layout ?? 'horizontal',
      ellipsizeMode: ellipsizeMode ?? 'tail',
      maxWidth: layout === 'vertical' ? undefined : maxWidth,
      data: normalizedData,
    };
  }, [rawData, layout, ellipsizeMode, maxWidth, defaultAvatarShape, defaultAvatarSize, defaultAvatarVariant]);
}
