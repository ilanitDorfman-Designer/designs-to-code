import type { IllustrationName, IllustrationSize } from './api/types';
import { ILLUSTRATION_META } from './illustration-meta';

/**
 * Nominal pixel box for each Figma size token. An illustration is a single CDN asset with
 * its own intrinsic aspect ratio; `size` scales that asset to *fit* this box (aspect
 * preserved). Default size per illustration comes from {@link ILLUSTRATION_META}.
 * Some illustrations ship a dedicated variant asset for a size (e.g. the XL status art),
 * rendered at its own intrinsic dimensions rather than fit into this box — see
 * `ILLUSTRATION_META[name].variants`.
 * - `s`  — 124×124 (CMS / cards)
 * - `m`  — 152×152 (drawer / empty)
 * - `xl` — 375×158 nominal box; XL variants (the status set) render at their
 *          own intrinsic size, so height varies per illustration
 * - `xxl` — 375×230 (UX / screens, coast-to-coast)
 */
export const ILLUSTRATION_SIZE_PX: Record<IllustrationSize, { width: number; height: number }> = {
  s: { width: 124, height: 124 },
  m: { width: 152, height: 152 },
  xl: { width: 375, height: 158 },
  xxl: { width: 375, height: 230 },
};

export { ILLUSTRATION_META };

/** Every registered illustration name, in the same order as {@link ILLUSTRATION_META}. */
export const ILLUSTRATION_NAMES = Object.keys(ILLUSTRATION_META) as IllustrationName[];

/** The size to render for `name`: the requested token, else the illustration's Figma default. */
export function resolveIllustrationSize(name: IllustrationName, requested?: IllustrationSize): IllustrationSize {
  return requested ?? ILLUSTRATION_META[name]?.defaultSize ?? 'm';
}

/** Type guard: `true` when `name` is a key of {@link ILLUSTRATION_META}. */
export function isIllustrationName(name: string): name is IllustrationName {
  return Object.prototype.hasOwnProperty.call(ILLUSTRATION_META, name);
}
