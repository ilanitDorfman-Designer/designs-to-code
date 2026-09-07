import { memo } from 'react';

import { TopbarAction, TopbarTitle } from '../../../topbar/subcomponents';
import { TopBarContextProvider } from '../../api/top-bar-context';
import { EtScreenTopBarRootProps } from '../../api/top-bar-types';
import { TopBarEnd, TopBarMiddle, TopBarStart } from '../top-bar-subcomponents';
import { ScreenTopBarContent } from './screen-top-bar-content';

/**
 * EtScreen.TopBar - Configures the TopBar for the screen using compound pattern.
 *
 * Subcomponents align with EtTopbar's slot model (Start, Middle, End).
 * When no Start content is provided, a default button is shown based on `isInnerScreen`.
 *
 * @example Basic usage (home screen with default menu button)
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.ScrollView>...</EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Inner screen with title and actions
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen>
 *     <EtScreen.TopBar.Start>
 *       <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={router.back}>
 *         <EtoroIcon name="chevronLeft" size={24} />
 *       </EtScreen.TopBar.Action>
 *     </EtScreen.TopBar.Start>
 *     <EtScreen.TopBar.Middle>
 *       <EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
 *     </EtScreen.TopBar.Middle>
 *     <EtScreen.TopBar.End>
 *       <EtScreen.TopBar.Action accessibilityLabel="Search" onPress={openSearch}>
 *         <EtoroIcon name="search" size={24} />
 *       </EtScreen.TopBar.Action>
 *     </EtScreen.TopBar.End>
 *   </EtScreen.TopBar>
 *   <EtScreen.ScrollView>...</EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 */
function ScreenTopBarComponent({
  children,
  isInnerScreen,
  animation,
  animationOptions,
  blurEffect,
  transparent,
  style,
  raw,
}: EtScreenTopBarRootProps) {
  // In `raw` mode the children ARE the topbar body — render them once via the registered config
  // (see {@link ScreenTopBarContent}) and skip the slot-based context entirely. In slot mode the
  // children are Start/Middle/End components that register through {@link TopBarContextProvider}.
  if (raw) {
    return (
      <ScreenTopBarContent
        isInnerScreen={isInnerScreen}
        animation={animation}
        animationOptions={animationOptions}
        blurEffect={blurEffect}
        transparent={transparent}
        style={style}
        raw
        rawContent={children}
      />
    );
  }

  return (
    <TopBarContextProvider>
      {children}
      <ScreenTopBarContent
        isInnerScreen={isInnerScreen}
        animation={animation}
        animationOptions={animationOptions}
        blurEffect={blurEffect}
        transparent={transparent}
        style={style}
      />
    </TopBarContextProvider>
  );
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

const ScreenTopBarBase = memo(ScreenTopBarComponent);
ScreenTopBarBase.displayName = 'EtScreen.TopBar';

/**
 * EtScreen.TopBar compound component with subcomponents.
 */
export const ScreenTopBar = Object.assign(ScreenTopBarBase, {
  Start: TopBarStart,
  Middle: TopBarMiddle,
  End: TopBarEnd,
  Action: TopbarAction,
  Title: TopbarTitle,
});
