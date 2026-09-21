import React, { type ComponentType, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

function FullWindowOverlayContainer({ children }: PropsWithChildren): React.JSX.Element {
  return <FullWindowOverlay>{children}</FullWindowOverlay>;
}

/**
 * Gorhom `BottomSheetModal` portal container.
 *
 * On iOS we default to `FullWindowOverlay`, which attaches the sheet to the key
 * window in its own native layer. Besides letting the sheet render above native
 * stack `fullScreenModal`s, this lifts the modal out of the screen's Fabric
 * view-recycling pool — which is what prevents the New Architecture crash
 * `RCTComponentViewRegistry: Attempt to recycle a mounted view` when another
 * animated overlay is mounted at the same time (e.g. a visible toast/BlurView,
 * or a second stacked sheet).
 *
 * Android keeps the default portal (no equivalent issue / no `FullWindowOverlay`).
 *
 * @param disableFullWindowOverlay - escape hatch to fall back to the default
 *   gorhom portal on iOS (e.g. when debugging with the RN inspector, which
 *   renders beneath `FullWindowOverlay`). Avoid unless you have a concrete need.
 */
export function resolveBottomSheetContainerComponent(disableFullWindowOverlay?: boolean): ComponentType<PropsWithChildren> | undefined {
  if (!disableFullWindowOverlay && Platform.OS === 'ios') {
    return FullWindowOverlayContainer;
  }
  return undefined;
}
