import { memo, ReactNode, useEffect } from 'react';

import { useScreenContext } from '../api/context';

export interface ScreenHeaderProps {
  children: ReactNode;

  /**
   * Whether the header should collapse together with the TopBar.
   *
   * - `false` (default): When the TopBar collapses on scroll, the header
   *   slides up to take the TopBar's place and stays visible.
   * - `true`: The header collapses together with the TopBar as a single unit,
   *   both sliding completely off-screen.
   *
   * @default false
   */
  collapseWithTopBar?: boolean;
}

/**
 * EtScreen.Header - Extended header content rendered below the TopBar.
 *
 * Use for search bars, tab navigation, filter chips, or any content that
 * should sit between the TopBar and the scrollable area.
 *
 * By default, only the TopBar collapses on scroll, and the header slides up
 * to take its place. Set `collapseWithTopBar` to collapse both together.
 *
 * @example Header that stays visible when TopBar collapses
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.Header>
 *     <SearchBar />
 *     <TabChips />
 *   </EtScreen.Header>
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example Header that collapses with the TopBar
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.Header collapseWithTopBar>
 *     <PromoBar />
 *   </EtScreen.Header>
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 */
function ScreenHeaderComponent({ children, collapseWithTopBar = false }: ScreenHeaderProps) {
  const { registerHeader, unregisterHeader, setCollapseHeaderWithTopBar } = useScreenContext();

  useEffect(() => {
    registerHeader(children);
    return () => {
      unregisterHeader();
    };
  }, [children, registerHeader, unregisterHeader]);

  useEffect(() => {
    setCollapseHeaderWithTopBar(collapseWithTopBar);
    return () => {
      setCollapseHeaderWithTopBar(false);
    };
  }, [collapseWithTopBar, setCollapseHeaderWithTopBar]);

  return null;
}

export const ScreenHeader = memo(ScreenHeaderComponent);
ScreenHeader.displayName = 'EtScreen.Header';
