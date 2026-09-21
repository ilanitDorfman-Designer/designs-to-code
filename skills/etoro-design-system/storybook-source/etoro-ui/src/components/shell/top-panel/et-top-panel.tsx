import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { create } from '../../../utils/create';
import { getSlotType, keyed } from '../slot-children';
import type { EtTopPanelProps, TopPanelSlotType } from './api/types';
import { SEARCH_GROUP_GAP, TOP_PANEL_HEIGHT_REGULAR, TOP_PANEL_HEIGHT_TALL, TOP_PANEL_PADDING_END, TOP_PANEL_PADDING_START } from './constants';
import { TopPanelActions, TopPanelLeading, TopPanelSearch, TopPanelToriBadge } from './subcomponents';

/**
 * EtTopPanel — the web shell's global top panel (≥768; below that the mobile
 * chrome owns navigation). Three zones on one row (start padding 24, end
 * padding 40):
 *
 * - Leading hugs the start (the menu opener at tier -1, the screen's hand-up);
 *   renders nothing when empty.
 * - Search + ToriBadge render as one group (gap 10) centered in the flexible
 *   zone between the edge zones.
 * - Actions hugs the end: the screen's handed-up action, then the bell.
 *
 * Height is fully controlled by the `tall` prop (76 regular / 84 tall — the
 * shell passes `useBreakpoint(BREAKPOINT_DESKTOP_S)`); the kit never measures
 * the window.
 *
 * Slot-based and dumb: no navigation, no data, no analytics — the shell
 * composes `EtSideMenuTrigger`, the bell, and all handlers. NO corner radius
 * (D8): rounded shell corners belong to the container-card's top edge, not
 * bar chrome.
 *
 * @example
 * ```tsx
 * <EtTopPanel tall={isTall}>
 *   <EtTopPanel.Leading>{tier === -1 ? <EtSideMenuTrigger onPress={openMenu} /> : null}</EtTopPanel.Leading>
 *   <EtTopPanel.Search placeholder={t('topPanel.searchPlaceholder')} onPress={openSearch} />
 *   <EtTopPanel.ToriBadge label={t('topPanel.askToriPrefix')} accentLabel="Tori" />
 *   <EtTopPanel.Actions><DeferredNotificationsBell /></EtTopPanel.Actions>
 * </EtTopPanel>
 * ```
 */
function EtTopPanelBase({ tall, children, style, testID }: EtTopPanelProps) {
  const { colors } = useEtoroTheme();

  let leadingChild: ReactNode | undefined;
  let searchChild: ReactNode | undefined;
  let toriChild: ReactNode | undefined;
  let actionsChild: ReactNode | undefined;
  // Children.forEach, not Children.toArray: forEach hands back the ORIGINAL
  // elements, so an author key survives to `keyed` instead of being rewritten.
  Children.forEach(children, (child) => {
    switch (getSlotType<TopPanelSlotType>(child)) {
      case 'leading':
        if (__DEV__ && leadingChild) console.warn('EtTopPanel: Multiple EtTopPanel.Leading children detected. Only the first will be used.');
        leadingChild ??= child;
        break;
      case 'search':
        if (__DEV__ && searchChild) console.warn('EtTopPanel: Multiple EtTopPanel.Search children detected. Only the first will be used.');
        searchChild ??= child;
        break;
      case 'tori':
        if (__DEV__ && toriChild) console.warn('EtTopPanel: Multiple EtTopPanel.ToriBadge children detected. Only the first will be used.');
        toriChild ??= child;
        break;
      case 'actions':
        if (__DEV__ && actionsChild) console.warn('EtTopPanel: Multiple EtTopPanel.Actions children detected. Only the first will be used.');
        actionsChild ??= child;
        break;
      default:
        // Slots hidden behind a wrapper/fragment lose their __SLOT_TYPE and
        // would silently vanish — same trap EtSideMenu documents. forEach also
        // visits null/false conditional children — those are fine, not a miss.
        if (__DEV__ && child != null && typeof child !== 'boolean')
          console.warn('EtTopPanel: Child without a slot type ignored — pass EtTopPanel.* elements directly, not wrapped.');
    }
  });

  return (
    <View
      style={[styles.panel, { height: tall ? TOP_PANEL_HEIGHT_TALL : TOP_PANEL_HEIGHT_REGULAR, backgroundColor: colors.backgroundBase }, style]}
      testID={testID}
    >
      {keyed(leadingChild, 'slot-leading')}
      <View style={styles.searchZone}>
        {keyed(searchChild, 'slot-search')}
        {keyed(toriChild, 'slot-tori')}
      </View>
      {keyed(actionsChild, 'slot-actions')}
    </View>
  );
}

export const EtTopPanel = Object.assign(create(EtTopPanelBase, 'EtTopPanel'), {
  Leading: TopPanelLeading,
  Search: TopPanelSearch,
  ToriBadge: TopPanelToriBadge,
  Actions: TopPanelActions,
});

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: TOP_PANEL_PADDING_START,
    paddingEnd: TOP_PANEL_PADDING_END,
  },
  // The search group centers in whatever is left between the hugging edge
  // zones — the simple-rule approximation of Figma's content-column centering.
  searchZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SEARCH_GROUP_GAP,
    minWidth: 0,
  },
});
