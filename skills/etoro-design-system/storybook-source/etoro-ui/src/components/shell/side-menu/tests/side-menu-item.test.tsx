import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { IconVariant } from '../../../et-icon-v2';
import type { SideMenuCloseReason, SideMenuTier } from '../api/types';
import { PANEL_WIDTH, PRIMARY_ROW_HEIGHT, RAIL_ITEM_HEIGHT, RAIL_WIDTH_BY_TIER, SECONDARY_ROW_HEIGHT } from '../constants';
import { EtSideMenu } from '../et-side-menu';
import { findLayerByWidth, flat } from './side-menu-test-helpers';

jest.mock('../../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../../core/hooks/accessibility/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

jest.mock('../../../../core/hooks/use-layout-direction', () => ({
  useLayoutDirection: () => 'ltr',
}));

jest.mock('../../../../foundations/text/et-text', () => {
  const { Text } = require('react-native');
  return {
    EtText: function MockEtText({ children, ...props }: { children?: ReactNode }) {
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('../../../et-icon-v2', () => {
  const { View: RNView } = require('react-native');
  const { IconVariant: ActualIconVariant } = jest.requireActual('../../../et-icon-v2/api/types') as {
    IconVariant: Record<string, string>;
  };
  return {
    IconVariant: ActualIconVariant,
    EtIconV2: function MockEtIconV2(props: { name: string }) {
      return <RNView {...props} testID={`et-icon-${props.name}`} />;
    },
  };
});

jest.mock('expo-linear-gradient', () => {
  const { View: RNView } = require('react-native');
  return {
    LinearGradient: function MockLinearGradient(props: { children?: ReactNode }) {
      return <RNView {...props} testID="active-bar-gradient" />;
    },
  };
});

type OnExpandedChange = (expanded: boolean, reason: SideMenuCloseReason | 'open') => void;

interface ItemsHarnessProps {
  tier?: SideMenuTier;
  expanded?: boolean;
  activeItemId?: string;
  onItemPress?: (id: string) => void;
  onExpandedChange?: OnExpandedChange;
  secondary?: boolean;
  items: ReactNode;
}

const renderItems = ({
  tier = 0,
  expanded = false,
  activeItemId,
  onItemPress,
  onExpandedChange = jest.fn<OnExpandedChange>(),
  secondary = false,
  items,
}: ItemsHarnessProps) =>
  render(
    <EtSideMenu
      activeItemId={activeItemId}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      onItemPress={onItemPress}
      testID="side-menu"
      tier={tier}
    >
      <EtSideMenu.Section secondary={secondary}>{items}</EtSideMenu.Section>
    </EtSideMenu>,
  );

const railLayer = (railWidth: number = RAIL_WIDTH_BY_TIER[0]) => findLayerByWidth(screen.getByTestId('side-menu'), railWidth);
const panelLayer = () => findLayerByWidth(screen.getByTestId('side-menu'), PANEL_WIDTH);

// The INACTIVE layer is aria-hidden, so queries into it must opt in explicitly.
const HIDDEN = { includeHiddenElements: true } as const;

describe('EtSideMenu.Item', () => {
  describe('mode 1 — rail cell', () => {
    it('renders a railWidth x 60 cell with the icon and the label as accessibility label only', () => {
      renderItems({ items: <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" /> });
      const rail = within(railLayer());
      const cell = rail.getByTestId('item-home-rail');
      const style = flat(cell.props.style);
      expect(style.width).toBe(RAIL_WIDTH_BY_TIER[0]);
      expect(style.height).toBe(RAIL_ITEM_HEIGHT);
      expect(cell.props.accessibilityLabel).toBe('Home');
      expect(rail.getByTestId('et-icon-home')).toBeTruthy();
      // No visible label text in the rail — the panel instance owns the text.
      expect(rail.queryByText('Home')).toBeNull();
    });

    it('cell width follows the tier rail width', () => {
      renderItems({ tier: 1, items: <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" /> });
      const cell = within(railLayer(RAIL_WIDTH_BY_TIER[1])).getByTestId('item-home-rail');
      expect(flat(cell.props.style).width).toBe(RAIL_WIDTH_BY_TIER[1]);
    });
  });

  describe('mode 2 — expanded row', () => {
    it('primary row is 40px text-only with a single-line heading-base label (the icon stays in the rail)', () => {
      renderItems({ items: <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" /> });
      const panel = within(panelLayer());
      const row = panel.getByTestId('item-home-panel', HIDDEN);
      expect(flat(row.props.style).height).toBe(PRIMARY_ROW_HEIGHT);
      expect(panel.queryByTestId('et-icon-home', HIDDEN)).toBeNull();
      const label = panel.getByText('Home', HIDDEN);
      expect(label.props.variant).toBe('heading-base');
      expect(label.props.numberOfLines).toBe(1);
      const labelStyle = flat(label.props.style);
      expect(labelStyle.letterSpacing).toBe(0);
      expect(labelStyle.color).toBe(colorsMock.colors.carbon900);
    });

    it('secondary row is 40px with its icon and a label-primary-regular label', () => {
      renderItems({
        secondary: true,
        items: <EtSideMenu.Item icon="gear" id="settings" label="Settings" testID="item-settings" />,
      });
      const panel = within(panelLayer());
      const row = panel.getByTestId('item-settings-panel', HIDDEN);
      expect(flat(row.props.style).height).toBe(SECONDARY_ROW_HEIGHT);
      expect(panel.getByTestId('et-icon-gear', HIDDEN)).toBeTruthy();
      expect(panel.getByText('Settings', HIDDEN).props.variant).toBe('label-primary-regular');
    });

    it('renders the badge slot after the label in the panel only', () => {
      renderItems({
        items: <EtSideMenu.Item badge={<View testID="badge" />} icon="home" id="home" label="Home" testID="item-home" />,
      });
      expect(within(panelLayer()).getByTestId('badge', HIDDEN)).toBeTruthy();
      expect(within(railLayer()).queryByTestId('badge')).toBeNull();
    });
  });

  describe('mode 3 — invisible in rail', () => {
    it('secondary items render only the panel instance', () => {
      renderItems({
        secondary: true,
        items: <EtSideMenu.Item id="settings" label="Settings" testID="item-settings" />,
      });
      expect(screen.queryByTestId('item-settings-rail', HIDDEN)).toBeNull();
      expect(within(panelLayer()).getByTestId('item-settings-panel', HIDDEN)).toBeTruthy();
    });

    it('a primary item without an icon renders null in the rail', () => {
      renderItems({ items: <EtSideMenu.Item id="plain" label="Plain" testID="item-plain" /> });
      expect(screen.queryByTestId('item-plain-rail', HIDDEN)).toBeNull();
      expect(screen.getByTestId('item-plain-panel', HIDDEN)).toBeTruthy();
    });

    it('at tier -1 only the panel instance exists', () => {
      renderItems({ tier: -1, items: <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" /> });
      expect(screen.queryByTestId('item-home-rail', HIDDEN)).toBeNull();
      expect(within(panelLayer()).getByTestId('item-home-panel', HIDDEN)).toBeTruthy();
    });
  });

  describe('active treatment', () => {
    it('the active rail cell swaps to the Filled icon variant', () => {
      renderItems({
        activeItemId: 'home',
        items: [
          <EtSideMenu.Item icon="home" id="home" key="home" label="Home" />,
          <EtSideMenu.Item icon="watchlist" id="watchlist" key="watchlist" label="Watchlist" />,
        ],
      });
      // Panel primary rows are text-only, so each icon exists once — in the rail.
      const homeIcons = screen.getAllByTestId('et-icon-home', HIDDEN);
      expect(homeIcons).toHaveLength(1);
      expect(homeIcons[0].props.variant).toBe(IconVariant.Filled);
      const watchlistIcons = screen.getAllByTestId('et-icon-watchlist', HIDDEN);
      expect(watchlistIcons).toHaveLength(1);
      expect(watchlistIcons[0].props.variant).toBe(IconVariant.Regular);
    });

    it('the active item renders the gradient edge bar in both layers, nothing on inactive items', () => {
      renderItems({
        activeItemId: 'home',
        items: [
          <EtSideMenu.Item icon="home" id="home" key="home" label="Home" />,
          <EtSideMenu.Item icon="watchlist" id="watchlist" key="watchlist" label="Watchlist" />,
        ],
      });
      const bars = screen.getAllByTestId('active-bar-gradient', HIDDEN);
      expect(bars).toHaveLength(2); // rail cell + panel row
      bars.forEach((bar) => {
        expect(bar.props.colors).toEqual([colorsMock.colors.primary600, colorsMock.colors.verdictPositive400Static]);
        expect(bar.props.start).toEqual({ x: 0, y: 0 });
        expect(bar.props.end).toEqual({ x: 0, y: 1 });
      });
    });

    it('the active item exposes aria-current="page" in both layers — the fill swap alone is invisible to AT', () => {
      renderItems({
        activeItemId: 'home',
        items: [
          <EtSideMenu.Item icon="home" id="home" key="home" label="Home" testID="item-home" />,
          <EtSideMenu.Item icon="watchlist" id="watchlist" key="watchlist" label="Watchlist" testID="item-watchlist" />,
        ],
      });
      expect(screen.getByTestId('item-home-rail').props['aria-current']).toBe('page');
      expect(screen.getByTestId('item-home-panel', HIDDEN).props['aria-current']).toBe('page');
      expect(screen.getByTestId('item-watchlist-rail').props['aria-current']).toBeUndefined();
      expect(screen.getByTestId('item-watchlist-panel', HIDDEN).props['aria-current']).toBeUndefined();
    });

    it('defaults the icon color to carbon900 and passes iconColor through', () => {
      renderItems({
        items: [
          <EtSideMenu.Item icon="home" id="home" key="home" label="Home" />,
          <EtSideMenu.Item icon="more" iconColor="#00FF00" id="more" key="more" label="More" />,
        ],
      });
      expect(screen.getAllByTestId('et-icon-home', HIDDEN)[0].props.color).toBe(colorsMock.colors.carbon900);
      expect(screen.getAllByTestId('et-icon-more', HIDDEN)[0].props.color).toBe('#00FF00');
    });
  });

  describe('disabled', () => {
    it('exposes the disabled accessibility state and suppresses presses', () => {
      const onItemPress = jest.fn<(id: string) => void>();
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderItems({
        expanded: true,
        onItemPress,
        onExpandedChange,
        items: <EtSideMenu.Item disabled icon="home" id="home" label="Home" testID="item-home" />,
      });
      const instances = [screen.getByTestId('item-home-panel'), screen.getByTestId('item-home-rail', HIDDEN)];
      instances.forEach((instance) => {
        expect(instance.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
        fireEvent.press(instance);
      });
      expect(onItemPress).not.toHaveBeenCalled();
      expect(onExpandedChange).not.toHaveBeenCalled();
    });
  });
});
