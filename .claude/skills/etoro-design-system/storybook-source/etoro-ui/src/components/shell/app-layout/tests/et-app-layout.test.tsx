import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, within } from '@testing-library/react-native';
import { Component, ReactNode, useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { Z_SHELL_ASIDE, Z_SHELL_CONTENT, Z_SHELL_MENU } from '../../../../core/styles/z-index';
import { EtAppLayout } from '../et-app-layout';
import { AppLayoutAside, AppLayoutMain, AppLayoutSideMenu, AppLayoutTopPanel } from '../subcomponents';

jest.mock('../../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../../core/hooks/accessibility/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

/** Flattens any style prop into a plain object (empty object for undefined). */
const flat = (style: unknown): ViewStyle => StyleSheet.flatten(style as StyleProp<ViewStyle>) ?? {};

// The Aside machine's inactive/suppressed layers are aria-hidden, so queries
// into the aside must opt in (its behavior specs live in app-layout-aside.test).
const HIDDEN = { includeHiddenElements: true } as const;

const noopExpandedChange = () => undefined;

const renderLayout = (children: ReactNode) => render(<EtAppLayout testID="app-layout">{children}</EtAppLayout>);

// An array, not a fragment — Children.toArray does not flatten fragments
// (side-menu precedent; the shell passes slots as direct children).
const fullSlots: ReactNode[] = [
  <EtAppLayout.SideMenu key="side-menu">
    <View testID="menu-content" />
  </EtAppLayout.SideMenu>,
  <EtAppLayout.TopPanel key="top-panel">
    <View testID="top-panel-content" />
  </EtAppLayout.TopPanel>,
  <EtAppLayout.Main key="main">
    <View testID="main-content" />
  </EtAppLayout.Main>,
  <EtAppLayout.Aside expanded={false} key="aside" onExpandedChange={noopExpandedChange}>
    <View testID="aside-content" />
  </EtAppLayout.Aside>,
];

describe('EtAppLayout', () => {
  describe('compound structure', () => {
    it('exposes the subcomponents as static properties', () => {
      expect(EtAppLayout.SideMenu).toBe(AppLayoutSideMenu);
      expect(EtAppLayout.TopPanel).toBe(AppLayoutTopPanel);
      expect(EtAppLayout.Main).toBe(AppLayoutMain);
      expect(EtAppLayout.Aside).toBe(AppLayoutAside);
    });

    it('is a memoized component with the correct displayName', () => {
      expect((EtAppLayout as { $$typeof?: symbol }).$$typeof).toBe(Symbol.for('react.memo'));
      expect(EtAppLayout.displayName).toBe('EtAppLayout');
    });

    it('subcomponents carry displayNames', () => {
      expect(AppLayoutSideMenu.displayName).toBe('EtAppLayout.SideMenu');
      expect(AppLayoutTopPanel.displayName).toBe('EtAppLayout.TopPanel');
      expect(AppLayoutMain.displayName).toBe('EtAppLayout.Main');
      expect(AppLayoutAside.displayName).toBe('EtAppLayout.Aside');
    });

    it('slot subcomponents carry minification-safe __SLOT_TYPE statics', () => {
      expect(AppLayoutSideMenu.__SLOT_TYPE).toBe('side-menu');
      expect(AppLayoutTopPanel.__SLOT_TYPE).toBe('top-panel');
      expect(AppLayoutMain.__SLOT_TYPE).toBe('main');
      expect(AppLayoutAside.__SLOT_TYPE).toBe('aside');
    });
  });

  describe('skeleton', () => {
    it('renders as a flex row painting the theme backgroundBase and merging the consumer style', () => {
      render(
        <EtAppLayout style={{ opacity: 0.5 }} testID="app-layout">
          {fullSlots}
        </EtAppLayout>,
      );
      const style = flat(screen.getByTestId('app-layout').props.style);
      expect(style.flex).toBe(1);
      expect(style.flexDirection).toBe('row');
      expect(style.backgroundColor).toBe(colorsMock.colors.backgroundBase);
      expect(style.opacity).toBe(0.5);
    });

    it('renders the full skeleton even when only Main is provided', () => {
      renderLayout(
        <EtAppLayout.Main>
          <View testID="main-content" />
        </EtAppLayout.Main>,
      );
      for (const id of [
        'et-app-layout-side-menu',
        'et-app-layout-content',
        'et-app-layout-top-panel',
        'et-app-layout-body',
        'et-app-layout-main',
        'et-app-layout-aside',
      ]) {
        expect(screen.getByTestId(id)).toBeTruthy();
      }
    });

    it('places the shell-scoped z tokens: menu slot vs content column, aside slot vs main', () => {
      renderLayout(fullSlots);
      expect(flat(screen.getByTestId('et-app-layout-side-menu').props.style).zIndex).toBe(Z_SHELL_MENU);
      expect(flat(screen.getByTestId('et-app-layout-content').props.style).zIndex).toBe(Z_SHELL_CONTENT);
      expect(flat(screen.getByTestId('et-app-layout-aside').props.style).zIndex).toBe(Z_SHELL_ASIDE);
      expect(flat(screen.getByTestId('et-app-layout-main').props.style).zIndex).toBeUndefined();
    });

    it('gives the content column, body row and main the filling flex geometry', () => {
      renderLayout(fullSlots);
      const content = flat(screen.getByTestId('et-app-layout-content').props.style);
      expect(content.flex).toBe(1);
      const body = flat(screen.getByTestId('et-app-layout-body').props.style);
      expect(body.flex).toBe(1);
      expect(body.flexDirection).toBe('row');
      expect(flat(screen.getByTestId('et-app-layout-main').props.style).flex).toBe(1);
    });
  });

  describe('landmarks', () => {
    it('stamps a labelled navigation landmark on a filled SideMenu slot — the only one in the tree', () => {
      renderLayout(fullSlots);
      const slot = screen.getByTestId('et-app-layout-side-menu');
      expect(slot.props.role).toBe('navigation');
      expect(slot.props.accessibilityLabel).toBe('Main navigation');
      // ONE landmark in the whole tree — the slot's content must not nest a second `navigation`.
      const landmarks = screen.getByTestId('app-layout').findAll((node) => typeof node.type === 'string' && node.props.role === 'navigation');
      expect(landmarks).toHaveLength(1);
    });

    it('the SideMenu slot landmark label is overridable — the shell passes translated copy', () => {
      renderLayout([
        <EtAppLayout.SideMenu accessibilityLabel="Hauptnavigation" key="side-menu">
          <View testID="menu-content" />
        </EtAppLayout.SideMenu>,
        <EtAppLayout.Main key="main">
          <View testID="main-content" />
        </EtAppLayout.Main>,
      ]);
      expect(screen.getByTestId('et-app-layout-side-menu').props.accessibilityLabel).toBe('Hauptnavigation');
    });

    it('an empty SideMenu slot stamps neither role nor label — no noise in the landmark list', () => {
      renderLayout(
        <EtAppLayout.Main>
          <View testID="main-content" />
        </EtAppLayout.Main>,
      );
      const slot = screen.getByTestId('et-app-layout-side-menu');
      expect(slot.props.role).toBeUndefined();
      expect(slot.props.accessibilityLabel).toBeUndefined();
    });
  });

  describe('slot classification', () => {
    it('renders every slot child inside its own skeleton View', () => {
      renderLayout(fullSlots);
      expect(within(screen.getByTestId('et-app-layout-side-menu')).getByTestId('menu-content')).toBeTruthy();
      expect(within(screen.getByTestId('et-app-layout-top-panel')).getByTestId('top-panel-content')).toBeTruthy();
      expect(within(screen.getByTestId('et-app-layout-main')).getByTestId('main-content')).toBeTruthy();
      expect(within(screen.getByTestId('et-app-layout-aside')).getByTestId('aside-content', HIDDEN)).toBeTruthy();
    });

    it('ignores unknown children', () => {
      renderLayout([
        <View key="stray" testID="stray" />,
        <EtAppLayout.Main key="main">
          <View testID="main-content" />
        </EtAppLayout.Main>,
      ]);
      expect(screen.queryByTestId('stray')).toBeNull();
      expect(screen.getByTestId('main-content')).toBeTruthy();
    });

    // `getSlotType` is an unchecked cast — a child from ANOTHER family carries
    // a truthy __SLOT_TYPE ('header', 'search', …) that is not an app-layout
    // slot and must be ignored, not index a missing bucket and crash.
    it("ignores a child carrying another family's __SLOT_TYPE instead of crashing", () => {
      const Foreign = () => <View testID="foreign" />;
      (Foreign as { __SLOT_TYPE?: string }).__SLOT_TYPE = 'header';
      renderLayout([
        <Foreign key="foreign" />,
        <EtAppLayout.Main key="main">
          <View testID="main-content" />
        </EtAppLayout.Main>,
      ]);
      expect(screen.queryByTestId('foreign')).toBeNull();
      expect(screen.getByTestId('main-content')).toBeTruthy();
    });

    it('tolerates conditional (falsy) children', () => {
      const condition = false as boolean;
      renderLayout([
        condition && (
          <EtAppLayout.SideMenu key="side-menu">
            <View testID="menu-content" />
          </EtAppLayout.SideMenu>
        ),
        condition ? (
          <EtAppLayout.Aside expanded={false} key="aside" onExpandedChange={noopExpandedChange}>
            <View testID="aside-content" />
          </EtAppLayout.Aside>
        ) : null,
        <EtAppLayout.Main key="main">
          <View testID="main-content" />
        </EtAppLayout.Main>,
      ]);
      expect(screen.queryByTestId('menu-content')).toBeNull();
      expect(screen.queryByTestId('aside-content')).toBeNull();
      expect(screen.getByTestId('main-content')).toBeTruthy();
    });

    it('warns in dev when a slot appears twice and uses the first', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      renderLayout([
        <EtAppLayout.Main key="main-a">
          <View testID="main-a" />
        </EtAppLayout.Main>,
        <EtAppLayout.Main key="main-b">
          <View testID="main-b" />
        </EtAppLayout.Main>,
      ]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Multiple EtAppLayout.Main'));
      expect(screen.getByTestId('main-a')).toBeTruthy();
      expect(screen.queryByTestId('main-b')).toBeNull();
      warnSpy.mockRestore();
    });
  });

  describe('stable skeleton (stable-navigator invariant)', () => {
    let mountCount = 0;

    function MountProbe() {
      useEffect(() => {
        mountCount += 1;
      }, []);
      return <View testID="mount-probe" />;
    }

    class InstanceProbe extends Component {
      override render() {
        return <View testID="instance-probe" />;
      }
    }

    const shell = (slots: { sideMenu: boolean; topPanel: boolean; aside: boolean }) => (
      <EtAppLayout testID="app-layout">
        {slots.sideMenu ? (
          <EtAppLayout.SideMenu>
            <View testID="menu-content" />
          </EtAppLayout.SideMenu>
        ) : null}
        {slots.topPanel ? (
          <EtAppLayout.TopPanel>
            <View testID="top-panel-content" />
          </EtAppLayout.TopPanel>
        ) : null}
        <EtAppLayout.Main>
          <MountProbe />
          <InstanceProbe />
        </EtAppLayout.Main>
        {slots.aside ? (
          <EtAppLayout.Aside expanded={false} onExpandedChange={noopExpandedChange}>
            <View testID="aside-content" />
          </EtAppLayout.Aside>
        ) : null}
      </EtAppLayout>
    );

    it('mounts Main children exactly once across every slot-presence toggle', () => {
      mountCount = 0;
      const view = render(shell({ sideMenu: true, topPanel: true, aside: true }));
      expect(mountCount).toBe(1);

      // Full-bleed route: the whole chrome empties, Main stays.
      view.rerender(shell({ sideMenu: false, topPanel: false, aside: true }));
      // Aside presence follows the route registry.
      view.rerender(shell({ sideMenu: false, topPanel: false, aside: false }));
      // Chrome returns.
      view.rerender(shell({ sideMenu: true, topPanel: true, aside: false }));
      view.rerender(shell({ sideMenu: true, topPanel: true, aside: true }));

      expect(mountCount).toBe(1);
      expect(screen.getByTestId('mount-probe')).toBeTruthy();
    });

    it('keeps the same Main child fiber instance across slot-presence toggles', () => {
      const view = render(shell({ sideMenu: true, topPanel: true, aside: true }));
      const instance = view.UNSAFE_getByType(InstanceProbe).instance;
      expect(instance).toBeTruthy();

      view.rerender(shell({ sideMenu: false, topPanel: false, aside: false }));
      expect(view.UNSAFE_getByType(InstanceProbe).instance).toBe(instance);

      view.rerender(shell({ sideMenu: true, topPanel: true, aside: true }));
      expect(view.UNSAFE_getByType(InstanceProbe).instance).toBe(instance);
    });

    // The ternary shape above keeps every slot's SOURCE position (a null child
    // still counts in React's positional keying). This shape does not: the slot
    // expressions are absent, so without the classifier's pinned per-slot keys
    // Main's auto-key would shift and the navigator would remount.
    it('keeps Main mounted across structurally different consumer JSX (slot expressions absent)', () => {
      mountCount = 0;
      const mainOnly = (
        <EtAppLayout testID="app-layout">
          <EtAppLayout.Main>
            <MountProbe />
            <InstanceProbe />
          </EtAppLayout.Main>
        </EtAppLayout>
      );
      const view = render(shell({ sideMenu: true, topPanel: true, aside: true }));
      const instance = view.UNSAFE_getByType(InstanceProbe).instance;

      view.rerender(mainOnly);
      view.rerender(shell({ sideMenu: true, topPanel: true, aside: true }));

      expect(mountCount).toBe(1);
      expect(view.UNSAFE_getByType(InstanceProbe).instance).toBe(instance);
    });

    // The pin never overwrites an author key — keyed identity stays the
    // author's, including its escape hatch: changing the key forces a remount.
    it('preserves an author key on Main — the consumer can still force a remount by changing it', () => {
      mountCount = 0;
      const make = (key: string) => (
        <EtAppLayout testID="app-layout">
          <EtAppLayout.Main key={key}>
            <MountProbe />
          </EtAppLayout.Main>
        </EtAppLayout>
      );
      const view = render(make('one'));
      view.rerender(make('one'));
      expect(mountCount).toBe(1);

      view.rerender(make('two'));
      expect(mountCount).toBe(2);
    });
  });
});
