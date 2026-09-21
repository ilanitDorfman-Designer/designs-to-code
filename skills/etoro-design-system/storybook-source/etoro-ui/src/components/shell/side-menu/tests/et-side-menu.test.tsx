import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { ReactNode, useEffect } from 'react';
import { View } from 'react-native';

import { Z_SHELL_MENU } from '../../../../core/styles/z-index';
import type { SideMenuCloseReason, SideMenuTier } from '../api/types';
import { PANEL_WIDTH, RAIL_WIDTH_BY_TIER } from '../constants';
import { EtSideMenu } from '../et-side-menu';
import { SideMenuFooter, SideMenuHeader, SideMenuItem, SideMenuProfile, SideMenuSection } from '../subcomponents';
import { findLayerByWidth, flat, glyphIconName, glyphTransform } from './side-menu-test-helpers';

jest.mock('../../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../../core/hooks/accessibility/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

let mockDirection: 'ltr' | 'rtl' = 'ltr';
jest.mock('../../../../core/hooks/use-layout-direction', () => ({
  useLayoutDirection: () => mockDirection,
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
  const { IconVariant } = jest.requireActual('../../../et-icon-v2/api/types') as {
    IconVariant: Record<string, string>;
  };
  return {
    IconVariant,
    EtIconV2: function MockEtIconV2(props: { name: string }) {
      return <RNView {...props} testID={`et-icon-${props.name}`} />;
    },
  };
});

jest.mock('../../../../core/icons/etoro-mark', () => {
  const { View: RNView } = require('react-native');
  return {
    EtoroMark: function MockEtoroMark(props: { size?: number }) {
      return <RNView {...props} testID="etoro-mark" />;
    },
  };
});

type OnExpandedChange = (expanded: boolean, reason: SideMenuCloseReason | 'open') => void;

interface HarnessProps {
  tier?: SideMenuTier;
  expanded?: boolean;
  onExpandedChange?: OnExpandedChange;
  activeItemId?: string;
  onItemPress?: (id: string) => void;
  children?: ReactNode;
}

const defaultChildren: ReactNode[] = [
  <EtSideMenu.Header key="header" logo={<View testID="logo" />} testID="header" />,
  <EtSideMenu.Profile avatar={<View testID="avatar" />} handle="@jane" key="profile" name="Jane Doe" testID="profile" />,
  <EtSideMenu.Section key="primary" testID="primary-section">
    <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" />
    <EtSideMenu.Item icon="watchlist" id="watchlist" label="Watchlist" testID="item-watchlist" />
  </EtSideMenu.Section>,
  <EtSideMenu.Section key="secondary" label="More" secondary testID="secondary-section">
    <EtSideMenu.Item id="settings" label="Settings" testID="item-settings" />
  </EtSideMenu.Section>,
  <EtSideMenu.Footer key="footer" testID="footer">
    <EtSideMenu.Item icon="more" id="more" label="More" testID="item-more" />
  </EtSideMenu.Footer>,
];

const renderMenu = ({
  tier = 0,
  expanded = false,
  onExpandedChange = jest.fn<OnExpandedChange>(),
  activeItemId,
  onItemPress,
  children = defaultChildren,
}: HarnessProps = {}) =>
  render(
    <EtSideMenu
      activeItemId={activeItemId}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      onItemPress={onItemPress}
      testID="side-menu"
      tier={tier}
    >
      {children}
    </EtSideMenu>,
  );

const railLayer = (railWidth: number = RAIL_WIDTH_BY_TIER[0]) => findLayerByWidth(screen.getByTestId('side-menu'), railWidth);
const panelLayer = () => findLayerByWidth(screen.getByTestId('side-menu'), PANEL_WIDTH);

// The INACTIVE layer is aria-hidden, so queries into it must opt in explicitly.
const HIDDEN = { includeHiddenElements: true } as const;

describe('EtSideMenu', () => {
  beforeEach(() => {
    mockDirection = 'ltr';
  });

  describe('compound structure', () => {
    it('exposes the subcomponents as static properties', () => {
      expect(EtSideMenu.Header).toBe(SideMenuHeader);
      expect(EtSideMenu.Profile).toBe(SideMenuProfile);
      expect(EtSideMenu.Section).toBe(SideMenuSection);
      expect(EtSideMenu.Item).toBe(SideMenuItem);
      expect(EtSideMenu.Footer).toBe(SideMenuFooter);
    });

    it('is a memoized component with the correct displayName', () => {
      expect((EtSideMenu as { $$typeof?: symbol }).$$typeof).toBe(Symbol.for('react.memo'));
      expect((EtSideMenu as { displayName?: string }).displayName).toBe('EtSideMenu');
    });

    it('subcomponents carry displayNames', () => {
      expect(SideMenuHeader.displayName).toBe('EtSideMenu.Header');
      expect(SideMenuProfile.displayName).toBe('EtSideMenu.Profile');
      expect(SideMenuSection.displayName).toBe('EtSideMenu.Section');
      expect(SideMenuItem.displayName).toBe('EtSideMenu.Item');
      expect(SideMenuFooter.displayName).toBe('EtSideMenu.Footer');
    });

    it('slot subcomponents carry minification-safe __SLOT_TYPE statics; Item carries none', () => {
      expect(SideMenuHeader.__SLOT_TYPE).toBe('header');
      expect(SideMenuProfile.__SLOT_TYPE).toBe('profile');
      expect(SideMenuSection.__SLOT_TYPE).toBe('section');
      expect(SideMenuFooter.__SLOT_TYPE).toBe('footer');
      expect((SideMenuItem as { __SLOT_TYPE?: string }).__SLOT_TYPE).toBeUndefined();
    });
  });

  describe('placeholder and tiers', () => {
    it.each<[SideMenuTier, number]>([
      [-1, 0],
      [0, 72],
      [1, 80],
      [2, 84],
    ])('tier %i reserves placeholder width %i', (tier, width) => {
      renderMenu({ tier });
      expect(flat(screen.getByTestId('side-menu').props.style).width).toBe(width);
    });

    it('placeholder carries the shell-scoped elevation and merges the consumer style', () => {
      renderMenu({ children: [] });
      const style = flat(screen.getByTestId('side-menu').props.style);
      expect(style.zIndex).toBe(Z_SHELL_MENU);
      expect(style.height).toBe('100%');
    });

    it('renders slot children twice at a visible tier, layer-suffixing the testID', () => {
      renderMenu({ tier: 0 });
      expect(within(railLayer()).getByTestId('item-home-rail')).toBeTruthy();
      expect(within(panelLayer()).getByTestId('item-home-panel', HIDDEN)).toBeTruthy();
      // The un-suffixed consumer value never mounts as-is.
      expect(screen.queryByTestId('item-home', HIDDEN)).toBeNull();
    });

    it('does not render the rail layer at tier -1', () => {
      renderMenu({ tier: -1 });
      expect(screen.queryByTestId('item-home-rail', HIDDEN)).toBeNull();
      expect(screen.getByTestId('item-home-panel', HIDDEN)).toBeTruthy();
      expect(screen.queryByLabelText('Expand menu', HIDDEN)).toBeNull();
      // Footer is rail-only, so it disappears entirely at the hidden tier.
      expect(screen.queryByTestId('item-more-rail', HIDDEN)).toBeNull();
    });
  });

  describe('slot classification', () => {
    it('places Header and Profile in both layers', () => {
      renderMenu();
      const rail = within(railLayer());
      const panel = within(panelLayer());
      expect(rail.getByLabelText('Expand menu')).toBeTruthy();
      expect(panel.getByLabelText('Collapse menu', HIDDEN)).toBeTruthy();
      expect(rail.getByTestId('avatar')).toBeTruthy();
      expect(panel.getByTestId('avatar', HIDDEN)).toBeTruthy();
      // Logo and profile texts are panel-only forms.
      expect(rail.queryByTestId('logo')).toBeNull();
      expect(panel.getByTestId('logo', HIDDEN)).toBeTruthy();
      expect(rail.queryByText('Jane Doe')).toBeNull();
      expect(panel.getByText('Jane Doe', HIDDEN)).toBeTruthy();
      expect(panel.getByText('@jane', HIDDEN)).toBeTruthy();
    });

    it('renders the Footer in the rail layer only', () => {
      renderMenu();
      expect(within(railLayer()).getByTestId('item-more-rail')).toBeTruthy();
      expect(within(panelLayer()).queryByTestId('item-more-panel', HIDDEN)).toBeNull();
    });

    it('hides secondary sections in the rail and shows their label in the panel', () => {
      renderMenu();
      expect(within(railLayer()).queryByTestId('item-settings-rail')).toBeNull();
      expect(within(panelLayer()).getByTestId('item-settings-panel', HIDDEN)).toBeTruthy();
      // "More" divider label renders once — panel layer only.
      expect(screen.getAllByText('More', HIDDEN)).toHaveLength(1);
      expect(within(panelLayer()).getByText('More', HIDDEN)).toBeTruthy();
    });

    it('ignores a label on a primary section', () => {
      renderMenu({
        children: [
          <EtSideMenu.Section key="s" label="Primary label">
            <EtSideMenu.Item icon="home" id="home" label="Home" />
          </EtSideMenu.Section>,
        ],
      });
      expect(screen.queryByText('Primary label', HIDDEN)).toBeNull();
    });

    it('ignores unknown children', () => {
      renderMenu({
        children: [
          <View key="stray" testID="stray" />,
          <EtSideMenu.Section key="s">
            <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" />
          </EtSideMenu.Section>,
        ],
      });
      expect(screen.queryByTestId('stray', HIDDEN)).toBeNull();
      expect(screen.getByTestId('item-home-rail')).toBeTruthy();
      expect(screen.getByTestId('item-home-panel', HIDDEN)).toBeTruthy();
    });

    it('tolerates conditional (falsy) children', () => {
      const condition = false as boolean;
      renderMenu({
        children: [
          condition ? <EtSideMenu.Header key="header" testID="header" /> : null,
          <EtSideMenu.Section key="s">
            <EtSideMenu.Item icon="home" id="home" label="Home" testID="item-home" />
          </EtSideMenu.Section>,
        ],
      });
      expect(screen.queryByTestId('header-rail', HIDDEN)).toBeNull();
      expect(screen.queryByTestId('header-panel', HIDDEN)).toBeNull();
      expect(screen.getByTestId('item-home-rail')).toBeTruthy();
      expect(screen.getByTestId('item-home-panel', HIDDEN)).toBeTruthy();
    });

    it('warns in dev when multiple headers are provided and uses the first', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      renderMenu({
        children: [<EtSideMenu.Header key="a" logo={<View testID="logo-a" />} />, <EtSideMenu.Header key="b" logo={<View testID="logo-b" />} />],
      });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Multiple EtSideMenu.Header'));
      expect(screen.getByTestId('logo-a', HIDDEN)).toBeTruthy();
      expect(screen.queryByTestId('logo-b', HIDDEN)).toBeNull();
      warnSpy.mockRestore();
    });

    // The classifier pins per-slot keys: without them, a slot expression that is
    // structurally ABSENT from the consumer's JSX (the club tile before its data
    // resolves) shifts the positional auto-keys of every later sibling and
    // remounts the sections.
    it('keeps mounted sections alive when the Tile slot appears later (structural JSX change)', () => {
      let mounts = 0;
      function MountProbe() {
        useEffect(() => {
          mounts += 1;
        }, []);
        return null;
      }
      const menu = (tile: boolean) =>
        tile ? (
          <EtSideMenu expanded={false} onExpandedChange={jest.fn<OnExpandedChange>()} testID="side-menu" tier={0}>
            <EtSideMenu.Tile icon="star" onPress={jest.fn()} subtitle="Manage benefits" title="Club" />
            <EtSideMenu.Section testID="probe-section">
              <MountProbe />
            </EtSideMenu.Section>
          </EtSideMenu>
        ) : (
          <EtSideMenu expanded={false} onExpandedChange={jest.fn<OnExpandedChange>()} testID="side-menu" tier={0}>
            <EtSideMenu.Section testID="probe-section">
              <MountProbe />
            </EtSideMenu.Section>
          </EtSideMenu>
        );

      const view = render(menu(false));
      const initialMounts = mounts; // the probe renders once per layer
      expect(initialMounts).toBeGreaterThan(0);

      view.rerender(menu(true));
      view.rerender(menu(false));
      expect(mounts).toBe(initialMounts);
    });

    // Author keys survive classification: the pin applies only to UNKEYED
    // sections, so a keyed dynamic list moves on reorder instead of remounting
    // (an index pin would swap identities and drop focus mid-interaction).
    it('preserves author keys on sections — a reordered keyed list moves instead of remounting', () => {
      let mounts = 0;
      function MountProbe() {
        useEffect(() => {
          mounts += 1;
        }, []);
        return null;
      }
      const menu = (order: 'ab' | 'ba') => {
        const a = (
          <EtSideMenu.Section key="a" testID="section-a">
            <MountProbe />
          </EtSideMenu.Section>
        );
        const b = <EtSideMenu.Section key="b" testID="section-b" />;
        return (
          <EtSideMenu expanded={false} onExpandedChange={jest.fn<OnExpandedChange>()} testID="side-menu" tier={0}>
            {order === 'ab' ? [a, b] : [b, a]}
          </EtSideMenu>
        );
      };

      const view = render(menu('ab'));
      const initialMounts = mounts;
      expect(initialMounts).toBeGreaterThan(0);

      view.rerender(menu('ba'));
      view.rerender(menu('ab'));
      expect(mounts).toBe(initialMounts);
    });
  });

  describe('controlled expanded wiring', () => {
    it('rail toggle press requests opening: onExpandedChange(true, "open")', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderMenu({ expanded: false, onExpandedChange });
      fireEvent.press(screen.getByLabelText('Expand menu'));
      expect(onExpandedChange).toHaveBeenCalledTimes(1);
      expect(onExpandedChange).toHaveBeenCalledWith(true, 'open');
    });

    it('panel toggle press requests collapsing: onExpandedChange(false, "toggle")', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderMenu({ expanded: true, onExpandedChange });
      fireEvent.press(screen.getByLabelText('Collapse menu'));
      expect(onExpandedChange).toHaveBeenCalledTimes(1);
      expect(onExpandedChange).toHaveBeenCalledWith(false, 'toggle');
    });

    it('panel item press while expanded calls onItemPress first, then closes with reason "item"', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      const onItemPress = jest.fn<(id: string) => void>();
      renderMenu({ expanded: true, onExpandedChange, onItemPress });
      fireEvent.press(within(panelLayer()).getByTestId('item-home-panel'));
      expect(onItemPress).toHaveBeenCalledWith('home');
      expect(onExpandedChange).toHaveBeenCalledWith(false, 'item');
      expect(onItemPress.mock.invocationCallOrder[0]).toBeLessThan(onExpandedChange.mock.invocationCallOrder[0]);
    });

    it('rail item press while collapsed navigates without a spurious close', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      const onItemPress = jest.fn<(id: string) => void>();
      renderMenu({ expanded: false, onExpandedChange, onItemPress });
      fireEvent.press(within(railLayer()).getByTestId('item-home-rail'));
      expect(onItemPress).toHaveBeenCalledWith('home');
      expect(onExpandedChange).not.toHaveBeenCalled();
    });

    it('fires Profile onPress from the panel row while expanded', () => {
      const onPress = jest.fn();
      renderMenu({
        expanded: true, // The collapsed panel layer has pointerEvents 'none' — presses must not land there.
        children: [<EtSideMenu.Profile avatar={<View testID="avatar" />} key="p" name="Jane" onPress={onPress} testID="profile" />],
      });
      const panelProfile = within(panelLayer()).getByTestId('profile-panel');
      fireEvent.press(within(panelProfile).getByRole('button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('collapsed: rail layer receives pointer events, panel layer does not', () => {
      renderMenu({ expanded: false });
      expect(flat(railLayer().props.style).pointerEvents).toBe('auto');
      expect(flat(panelLayer().props.style).pointerEvents).toBe('none');
    });

    it('expanded: panel layer receives pointer events, rail layer does not', () => {
      renderMenu({ expanded: true });
      expect(flat(railLayer().props.style).pointerEvents).toBe('none');
      expect(flat(panelLayer().props.style).pointerEvents).toBe('auto');
    });
  });

  describe('accessibility', () => {
    it('carries NO navigation landmark of its own — EtAppLayout stamps it on the SideMenu slot', () => {
      renderMenu({ expanded: true });
      const root = screen.getByTestId('side-menu');
      const landmarks = root.findAll((node) => typeof node.type === 'string' && node.props.role === 'navigation');
      expect(landmarks).toHaveLength(0);
      expect(screen.queryByLabelText('Main navigation', HIDDEN)).toBeNull();
    });

    it('rail items expose their label as accessibility label on a button', () => {
      renderMenu();
      const cell = within(railLayer()).getByTestId('item-home-rail');
      expect(cell.props.accessibilityLabel).toBe('Home');
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('toggle labels default by layer and accept per-state overrides', () => {
      renderMenu();
      expect(screen.getByLabelText('Expand menu')).toBeTruthy();
      expect(screen.getByLabelText('Collapse menu', HIDDEN)).toBeTruthy();

      renderMenu({
        children: [<EtSideMenu.Header key="h" toggleAccessibilityLabels={{ collapse: 'Hide navigation', expand: 'Open navigation' }} />],
      });
      expect(screen.getByLabelText('Open navigation')).toBeTruthy();
      expect(screen.getByLabelText('Hide navigation', HIDDEN)).toBeTruthy();
    });

    it('collapsed: the panel layer is aria-hidden and its controls are not keyboard-focusable', () => {
      renderMenu({ expanded: false });
      expect(panelLayer().props['aria-hidden']).toBe(true);
      expect(railLayer().props['aria-hidden']).toBe(false);
      expect(within(panelLayer()).getByTestId('item-home-panel', HIDDEN).props.focusable).toBe(false);
      // Explicit tabIndex mirrors focusable — RNW 0.21 Pressable ignores focusable={false}.
      expect(within(panelLayer()).getByTestId('item-home-panel', HIDDEN).props.tabIndex).toBe(-1);
      expect(within(railLayer()).getByTestId('item-home-rail').props.focusable).toBe(true);
      expect(within(railLayer()).getByTestId('item-home-rail').props.tabIndex).toBe(0);
      // Default (accessibility-respecting) queries must not see the hidden layer at all.
      expect(screen.queryByTestId('item-home-panel')).toBeNull();
    });

    it('expanded: the rail layer is aria-hidden and its controls are not keyboard-focusable', () => {
      renderMenu({ expanded: true });
      expect(railLayer().props['aria-hidden']).toBe(true);
      expect(panelLayer().props['aria-hidden']).toBe(false);
      expect(within(railLayer()).getByTestId('item-home-rail', HIDDEN).props.focusable).toBe(false);
      expect(within(railLayer()).getByTestId('item-home-rail', HIDDEN).props.tabIndex).toBe(-1);
      expect(within(panelLayer()).getByTestId('item-home-panel').props.focusable).toBe(true);
      expect(within(panelLayer()).getByTestId('item-home-panel').props.tabIndex).toBe(0);
      expect(screen.queryByTestId('item-home-rail')).toBeNull();
    });

    it('the surface is click-focusable (tabIndex -1) so clicks on non-focusable panel content stay inside', () => {
      renderMenu({ expanded: true });
      // The surface is the nearest host ancestor of the panel layer. Without
      // tabIndex -1, a click on panel padding/headings blurs focus to body and
      // the web close hook reads the null-relatedTarget focusout as "outside".
      let node = panelLayer().parent;
      while (node && typeof node.type !== 'string') node = node.parent;
      expect(node?.props.tabIndex).toBe(-1);
    });
  });

  describe('context isolation', () => {
    it('throws the canonical message when Item renders outside <EtSideMenu>', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      expect(() => render(<EtSideMenu.Item id="x" label="X" />)).toThrow('EtSideMenu compound components must be used within <EtSideMenu>');
      errorSpy.mockRestore();
    });

    it('throws the canonical message when Header renders outside <EtSideMenu>', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      expect(() => render(<EtSideMenu.Header />)).toThrow('EtSideMenu compound components must be used within <EtSideMenu>');
      errorSpy.mockRestore();
    });
  });

  describe('direction-aware styles', () => {
    it('LTR: the rail toggle rests on the brand mark, reveals the expand glyph on hover; panel glyph unrotated', () => {
      mockDirection = 'ltr';
      renderMenu();
      const railToggle = screen.getByLabelText('Expand menu');
      expect(within(railToggle).getByTestId('etoro-mark')).toBeTruthy();
      fireEvent(railToggle, 'hoverIn');
      expect(within(railToggle).queryByTestId('etoro-mark')).toBeNull();
      expect(glyphIconName(railToggle)).toBe('collapse-fill-right');
      expect(glyphTransform(railToggle)).toEqual([{ scaleX: 1 }]);
      fireEvent(railToggle, 'hoverOut');
      expect(within(railToggle).getByTestId('etoro-mark')).toBeTruthy();
      expect(glyphIconName(screen.getByLabelText('Collapse menu', HIDDEN))).toBe('collapse-fill-left');
      expect(glyphTransform(screen.getByLabelText('Collapse menu', HIDDEN))).toEqual([{ scaleX: 1 }]);
    });

    it('hovering anywhere on the rail also reveals the expand glyph', () => {
      mockDirection = 'ltr';
      renderMenu();
      const railToggle = screen.getByLabelText('Expand menu');
      fireEvent(railLayer(), 'pointerEnter');
      expect(within(railToggle).queryByTestId('etoro-mark')).toBeNull();
      expect(glyphIconName(railToggle)).toBe('collapse-fill-right');
      fireEvent(railLayer(), 'pointerLeave');
      expect(within(railToggle).getByTestId('etoro-mark')).toBeTruthy();
    });

    it('keyboard focus also reveals the expand glyph — focus never hovers', () => {
      mockDirection = 'ltr';
      renderMenu();
      const railToggle = screen.getByLabelText('Expand menu');
      fireEvent(railToggle, 'focus');
      expect(glyphIconName(railToggle)).toBe('collapse-fill-right');
      fireEvent(railToggle, 'blur');
      expect(within(railToggle).getByTestId('etoro-mark')).toBeTruthy();
    });

    it('a hover the expand left stale (pointer-none eats the leave) is cleared — the mark is back after collapse', () => {
      mockDirection = 'ltr';
      const menuAt = (expanded: boolean) => (
        <EtSideMenu expanded={expanded} onExpandedChange={jest.fn<OnExpandedChange>()} testID="side-menu" tier={0}>
          {defaultChildren}
        </EtSideMenu>
      );
      const view = render(menuAt(false));
      const railToggle = screen.getByLabelText('Expand menu');
      fireEvent(railToggle, 'hoverIn');
      expect(glyphIconName(railToggle)).toBe('collapse-fill-right');
      // Expanding flips the rail pointer-none mid-hover — no hoverOut will ever
      // fire, so the layer deactivation itself must clear the hover state.
      view.rerender(menuAt(true));
      view.rerender(menuAt(false));
      expect(within(screen.getByLabelText('Expand menu')).getByTestId('etoro-mark')).toBeTruthy();
    });

    it('RTL: hovered rail glyph and panel glyph mirror via scaleX(-1)', () => {
      mockDirection = 'rtl';
      renderMenu();
      const railToggle = screen.getByLabelText('Expand menu');
      fireEvent(railToggle, 'hoverIn');
      expect(glyphIconName(railToggle)).toBe('collapse-fill-right');
      expect(glyphTransform(railToggle)).toEqual([{ scaleX: -1 }]);
      expect(glyphIconName(screen.getByLabelText('Collapse menu', HIDDEN))).toBe('collapse-fill-left');
      expect(glyphTransform(screen.getByLabelText('Collapse menu', HIDDEN))).toEqual([{ scaleX: -1 }]);
    });
  });
});
