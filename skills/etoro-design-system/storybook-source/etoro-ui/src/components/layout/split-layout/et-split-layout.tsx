import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SplitLayoutProvider } from './api/context';
import { EtSplitLayoutProps } from './api/types';
import { useSplitLayoutChildren } from './hooks/use-split-layout-children';
import { useSplitLayoutConfig } from './hooks/use-split-layout-config';
import { SplitLayoutAside, SplitLayoutMain, SplitLayoutTopBar } from './subcomponents';

/**
 * EtSplitLayout — responsive two-pane layout primitive.
 *
 * At or above `BREAKPOINT_DESKTOP` (1024) it renders Main and Aside side by
 * side with `ratio` flex weights; below it the Aside pane UNMOUNTS and Main
 * fills the layout. The optional TopBar is an absolute overlay at the top of
 * the Main pane only — it never displaces content and never covers the Aside.
 *
 * Dimension-driven and platform-agnostic: no `Platform.OS` branches. Adopt it
 * per-screen (e.g. inside a `.web.tsx` layout shell) to keep other platforms
 * untouched.
 *
 * @example 50/50 auth screen (content left, brand panel right)
 * ```tsx
 * <EtSplitLayout>
 *   <EtSplitLayout.TopBar>{chrome}</EtSplitLayout.TopBar>
 *   <EtSplitLayout.Main>{scrollableContent}</EtSplitLayout.Main>
 *   <EtSplitLayout.Aside>{brandPanel}</EtSplitLayout.Aside>
 * </EtSplitLayout>
 * ```
 *
 * @example Multi-step flow — narrow steps rail on the left
 * ```tsx
 * <EtSplitLayout ratio={[2, 1]} asidePosition="start">
 *   <EtSplitLayout.Main>{stepContent}</EtSplitLayout.Main>
 *   <EtSplitLayout.Aside>{stepsRail}</EtSplitLayout.Aside>
 * </EtSplitLayout>
 * ```
 */
function EtSplitLayoutBase({ children, ratio, asidePosition, style, testID }: EtSplitLayoutProps) {
  const config = useSplitLayoutConfig({ ratio, asidePosition });
  const { isSplit } = config;
  const { topBar, main, aside } = useSplitLayoutChildren(children);
  const [topBarHeight, setTopBarHeight] = useState(0);

  const asidePane =
    isSplit && aside ? (
      <View style={{ flex: config.ratio[1] }} testID="et-split-layout-aside-pane">
        {aside}
      </View>
    ) : null;

  return (
    <SplitLayoutProvider {...config} topBarHeight={topBarHeight} setTopBarHeight={setTopBarHeight}>
      <View style={[styles.container, style]} testID={testID}>
        {config.asidePosition === 'start' && asidePane}
        <View style={[styles.mainPane, isSplit && { flex: config.ratio[0] }]} testID="et-split-layout-main-pane">
          {main}
          {topBar}
        </View>
        {config.asidePosition === 'end' && asidePane}
      </View>
    </SplitLayoutProvider>
  );
}

EtSplitLayoutBase.displayName = 'EtSplitLayout';

/**
 * EtSplitLayout compound component with subcomponents.
 *
 * Subcomponents:
 * - `EtSplitLayout.Main` - The content pane; survives collapse
 * - `EtSplitLayout.Aside` - The secondary pane; unmounts below the desktop breakpoint
 * - `EtSplitLayout.TopBar` - Absolute chrome overlay over the Main pane only
 */
export const EtSplitLayout = Object.assign(memo(EtSplitLayoutBase), {
  Main: SplitLayoutMain,
  Aside: SplitLayoutAside,
  TopBar: SplitLayoutTopBar,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainPane: {
    flex: 1,
  },
});
