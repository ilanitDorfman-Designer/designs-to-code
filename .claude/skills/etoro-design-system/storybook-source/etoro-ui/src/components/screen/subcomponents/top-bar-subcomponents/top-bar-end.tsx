import { memo, useEffect } from 'react';

import { useTopBarContext } from '../../api/top-bar-context';
import { TopBarEndProps } from '../../api/top-bar-types';

/**
 * EtScreen.TopBar.End - Registers content for the trailing (end) side.
 *
 * @example Multiple actions
 * ```tsx
 * <EtScreen.TopBar isInnerScreen>
 *   <EtScreen.TopBar.End>
 *     <NotificationButton />
 *     <MoreButton />
 *   </EtScreen.TopBar.End>
 * </EtScreen.TopBar>
 * ```
 */
function TopBarEndComponent({ children }: TopBarEndProps) {
  const { actions } = useTopBarContext();

  // Split into two effects (same pattern as `<EtScreenOverlay>` / TopBar.Start): unregister must
  // NOT run on every children identity change. Inline JSX creates a new reference each parent
  // render; unmount→remount nulls the slot and rematerializes Liquid Glass (PAH-788 flicker).
  useEffect(() => {
    actions.registerEnd(children);
  }, [children, actions]);

  useEffect(() => {
    return () => {
      actions.unregisterEnd();
    };
  }, [actions]);

  return null;
}

export const TopBarEnd = memo(TopBarEndComponent);
TopBarEnd.displayName = 'EtScreen.TopBar.End';
