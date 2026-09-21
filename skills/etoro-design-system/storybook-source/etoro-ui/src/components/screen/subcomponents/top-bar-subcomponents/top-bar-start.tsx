import { memo, useEffect } from 'react';

import { useTopBarContext } from '../../api/top-bar-context';
import { TopBarStartProps } from '../../api/top-bar-types';

/**
 * EtScreen.TopBar.Start - Registers content for the leading (start) side.
 *
 * When not provided, a default button is shown based on `isInnerScreen`:
 * - Inner screens: back chevron button
 * - Root screens: hamburger menu button
 *
 * **Performance note:** Children are tracked by reference identity. Inline JSX
 * creates a new reference on every render, causing unnecessary re-registrations.
 * For complex or inline children, wrap them with `React.useMemo` or extract them
 * into a memoized component to keep the identity stable.
 *
 * @example Custom back button
 * ```tsx
 * <EtScreen.TopBar isInnerScreen>
 *   <EtScreen.TopBar.Start>
 *     <EtIconButton iconName="chevronLeft" onPress={router.back} />
 *   </EtScreen.TopBar.Start>
 * </EtScreen.TopBar>
 * ```
 */
function TopBarStartComponent({ children }: TopBarStartProps) {
  const { actions } = useTopBarContext();

  // Split into two effects (same pattern as `<EtScreenOverlay>`): unregister must NOT run on
  // every children identity change. Inline JSX from the parent creates a new `children`
  // reference each render; chaining unmount→remount briefly nulls the slot and forces the
  // painted TopBar (including iOS Liquid Glass capsules) to rematerialize — visible flicker
  // on Home (PAH-788). Content effect only re-publishes; lifecycle effect cleans up on unmount.
  useEffect(() => {
    actions.registerStart(children);
  }, [children, actions]);

  useEffect(() => {
    return () => {
      actions.unregisterStart();
    };
  }, [actions]);

  return null;
}

export const TopBarStart = memo(TopBarStartComponent);
TopBarStart.displayName = 'EtScreen.TopBar.Start';
