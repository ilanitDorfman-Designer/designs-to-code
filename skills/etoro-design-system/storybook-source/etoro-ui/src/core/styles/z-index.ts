/**
 * Shell-chrome z-index tokens — SIBLING-SCOPED, not a global ladder.
 *
 * On react-native-web every `View` is its own stacking context (the base
 * style applies `position: relative; z-index: 0`), so a z-index value only
 * competes among DIRECT CHILDREN of the same parent — never globally. These
 * constants are meaningful solely among the direct children of the shell row
 * (the `EtSideMenu` root vs the content column): anything nested inside the
 * content column (screen headers with `zIndex: 1000`, card halos, toasts)
 * is trapped in the column's own stacking context and can never paint over
 * the menu, regardless of its own z-index. Do not reuse these values outside
 * that sibling scope.
 */

/** The shell row's content column — base layer. */
export const Z_SHELL_CONTENT = 0;

/** The shell row's side-menu root — paints above the content column. */
export const Z_SHELL_MENU = 100;

/**
 * The app-layout aside — a DIFFERENT sibling scope from the two above: it
 * competes only with `Main` (z 0) among the Body-row children inside the
 * content column. Equality with `Z_SHELL_MENU` is meaningless across scopes;
 * the menu's fixed backdrop still out-paints the aside.
 */
export const Z_SHELL_ASIDE = 100;
