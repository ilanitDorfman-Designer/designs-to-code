import { backOrReplace, guardedRouter } from '@etoro/common/utils/rn';

import { EtIconButton } from '../../button/et-icon-button';
import { DefaultMenuButton } from './default-menu-button';

interface DefaultStartButtonProps {
  isInnerScreen?: boolean;
}

/**
 * Cold-start deep links (push notification / universal link) land with no
 * prior history after the Airship/AppsFlyer `replace` — a bare `back()` is
 * then a silent no-op and the chevron reads as dead. `backOrReplace` falls
 * back to `/home`, the same fix the market asset page (#2204) and FullPost
 * (PAC-391) each hand-rolled before it reached this shared default. The
 * protected root marks `(drawer)` with `animationTypeForReplace: 'pop'`, so
 * the fallback plays as a normal back transition.
 */
function goBackOrHome(): void {
  backOrReplace(guardedRouter, '/home');
}

/**
 * Default leading button based on screen type.
 * Inner screens get a back chevron; root screens get a hamburger menu.
 */
export function DefaultStartButton({ isInnerScreen }: DefaultStartButtonProps) {
  return isInnerScreen ? <EtIconButton iconName="chevronLeft" size={24} onPress={goBackOrHome} testID="screen-back" /> : <DefaultMenuButton />;
}
