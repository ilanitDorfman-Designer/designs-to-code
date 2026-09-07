import type { eToroTheme } from '../colors';

/**
 * The role a region plays in the app's surface hierarchy. `base` is the app
 * canvas and the only role native ever resolves; `elevated` is the screen area
 * under the web app frame.
 *
 * Deliberately only two. The frame's own regions — the rail, the panel, the aside
 * — are not variable: each paints one token, always, and a role that nothing ever
 * sets and nothing ever asks for is a branch that cannot be right or wrong.
 * `backgroundShell` and `backgroundMenu` are still there in the token file for
 * whoever gives those regions a second state.
 */
export type SurfaceRole = 'base' | 'elevated';

/**
 * The one place a surface role becomes a colour.
 *
 * Roles map straight onto the v2 surface tokens, so a theme decision (light Elevated
 * paints the light background) is made once in the token
 * file and never restated here.
 */
export function resolveSurface(role: SurfaceRole, colors: eToroTheme['colors']): string {
  switch (role) {
    case 'elevated':
      return colors.backgroundElevated;
    case 'base':
      return colors.backgroundBase;
  }
}
