import { I18nManager } from 'react-native';

export type LayoutDirection = 'ltr' | 'rtl';

/**
 * The app's layout direction. Native variant: reads `I18nManager.isRTL`
 * (changing it requires an app restart, so no subscription is needed).
 * The web sibling (`use-layout-direction.web.ts`) reads the document `dir`
 * attribute instead — on react-native-web `I18nManager` is a dead stub
 * (`isRTL` always `false`).
 *
 * Use it to sign mirrored transforms and flip direction-sensitive glyphs
 * (chevrons); prefer logical `start`/`end` style props for plain layout.
 */
export const useLayoutDirection = (): LayoutDirection => (I18nManager.isRTL ? 'rtl' : 'ltr');
