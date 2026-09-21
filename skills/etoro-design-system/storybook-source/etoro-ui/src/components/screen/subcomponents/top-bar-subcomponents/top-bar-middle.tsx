import { memo, useEffect } from 'react';

import { useTopBarContext } from '../../api/top-bar-context';
import { TopBarMiddleProps } from '../../api/top-bar-types';

/**
 * EtScreen.TopBar.Middle - Registers centered content between Start and End.
 *
 * Content is absolutely positioned and centered within the topbar,
 * matching EtTopbar.Middle's behavior. Typically used with EtScreen.TopBar.Title.
 *
 * @example Centered title
 * ```tsx
 * <EtScreen.TopBar isInnerScreen>
 *   <EtScreen.TopBar.Start>
 *     <EtIconButton iconName="chevronLeft" onPress={router.back} />
 *   </EtScreen.TopBar.Start>
 *   <EtScreen.TopBar.Middle>
 *     <EtScreen.TopBar.Title>Settings</EtScreen.TopBar.Title>
 *   </EtScreen.TopBar.Middle>
 * </EtScreen.TopBar>
 * ```
 */
function TopBarMiddleComponent({ children }: TopBarMiddleProps) {
  const { actions } = useTopBarContext();

  // Split into two effects (same pattern as Start/End / Overlay): unregister only on unmount so
  // parent re-renders that produce a new `children` identity do not briefly null the slot.
  useEffect(() => {
    actions.registerMiddle(children);
  }, [children, actions]);

  useEffect(() => {
    return () => {
      actions.unregisterMiddle();
    };
  }, [actions]);

  return null;
}

export const TopBarMiddle = memo(TopBarMiddleComponent);
TopBarMiddle.displayName = 'EtScreen.TopBar.Middle';
