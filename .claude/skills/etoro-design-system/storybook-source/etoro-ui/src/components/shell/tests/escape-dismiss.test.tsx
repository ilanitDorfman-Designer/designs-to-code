import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { Dimensions, View } from 'react-native';

import type { AppLayoutAsideTrigger } from '../app-layout/api/types';
import { AppLayoutAside } from '../app-layout/subcomponents';
import type { SideMenuCloseReason } from '../side-menu/api/types';
import { EtSideMenu } from '../side-menu/et-side-menu';

// The RN jest preset resolves the native no-op splits — force the web close
// hooks and the shared dismiss stack, which are the behaviour under test.
jest.mock('../../../core/web/use-dismissable', () => jest.requireActual('../../../core/web/use-dismissable.web'));
jest.mock('../side-menu/hooks/use-side-menu-web-close', () => jest.requireActual('../side-menu/hooks/use-side-menu-web-close.web'));
jest.mock('../app-layout/hooks/use-aside-web-close', () => jest.requireActual('../app-layout/hooks/use-aside-web-close.web'));

jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../core/hooks/accessibility/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

jest.mock('../../../core/hooks/use-layout-direction', () => ({
  useLayoutDirection: () => 'ltr',
}));

jest.mock('../../../foundations/text/et-text', () => {
  const { Text } = require('react-native');
  return {
    EtText: function MockEtText({ children, ...props }: { children?: ReactNode }) {
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('../../et-icon-v2', () => {
  const { View: RNView } = require('react-native');
  const { IconVariant } = jest.requireActual('../../et-icon-v2/api/types') as { IconVariant: Record<string, string> };
  return {
    IconVariant,
    EtIconV2: function MockEtIconV2(props: { name: string }) {
      return <RNView {...props} testID={`et-icon-${props.name}`} />;
    },
  };
});

// Jest runs in a node environment — stub the global document per test.
const globalWithDocument = globalThis as unknown as { document?: unknown };
const ORIGINAL_DOCUMENT = globalWithDocument.document;

const handlers = new Set<(event: { key: string; defaultPrevented: boolean; preventDefault: () => void }) => void>();
const pressEscape = () => {
  const event = { key: 'Escape', defaultPrevented: false, preventDefault: jest.fn() };
  act(() => {
    [...handlers].forEach((handler) => handler(event));
  });
};

const ORIGINAL_DIMENSIONS = {
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
};

type OnMenuChange = (expanded: boolean, reason: SideMenuCloseReason | 'open') => void;
type OnAsideChange = (expanded: boolean, trigger: AppLayoutAsideTrigger) => void;

interface HarnessProps {
  menuExpanded: boolean;
  asideExpanded: boolean;
  onMenuChange: OnMenuChange;
  onAsideChange: OnAsideChange;
}

/** The shell composition that double-closed: menu panel + overlay aside. */
const harness = ({ menuExpanded, asideExpanded, onMenuChange, onAsideChange }: HarnessProps) => (
  <View>
    <EtSideMenu expanded={menuExpanded} onExpandedChange={onMenuChange} tier={0}>
      <EtSideMenu.Header />
    </EtSideMenu>
    <AppLayoutAside expanded={asideExpanded} onExpandedChange={onAsideChange}>
      <View testID="aside-content" />
    </AppLayoutAside>
  </View>
);

describe('Escape dismissal across stacked shell layers', () => {
  beforeEach(() => {
    handlers.clear();
    globalWithDocument.document = {
      addEventListener: (_type: string, handler: (event: { key: string }) => void) => {
        handlers.add(handler as never);
      },
      removeEventListener: (_type: string, handler: (event: { key: string }) => void) => {
        handlers.delete(handler as never);
      },
    };
    // 1200: the aside is live (≥768) and in overlay mode (<1440) — dismissible.
    Dimensions.set({ window: { ...ORIGINAL_DIMENSIONS.window, width: 1200 } });
  });

  afterEach(() => {
    globalWithDocument.document = ORIGINAL_DOCUMENT;
    // In act — the restore fires Dimensions listeners while components are still mounted.
    act(() => Dimensions.set(ORIGINAL_DIMENSIONS));
  });

  it('GIVEN the menu panel and the overlay aside are both open WHEN Escape is pressed once THEN only the top layer closes', () => {
    const onMenuChange = jest.fn<OnMenuChange>();
    const onAsideChange = jest.fn<OnAsideChange>();
    const { rerender } = render(harness({ menuExpanded: true, asideExpanded: true, onMenuChange, onAsideChange }));

    // Both activated on mount, in tree order — the aside is the top layer.
    pressEscape();

    expect(onAsideChange).toHaveBeenCalledTimes(1);
    expect(onAsideChange).toHaveBeenCalledWith(false, 'escape');
    expect(onMenuChange).not.toHaveBeenCalled();

    // The shell applies the close; the menu is now the top layer.
    rerender(harness({ menuExpanded: true, asideExpanded: false, onMenuChange, onAsideChange }));
    pressEscape();

    expect(onMenuChange).toHaveBeenCalledTimes(1);
    expect(onMenuChange).toHaveBeenCalledWith(false, 'escape');
    expect(onAsideChange).toHaveBeenCalledTimes(1);
  });

  it('GIVEN only the menu panel is open WHEN Escape is pressed THEN the closed aside never hears about it', () => {
    const onMenuChange = jest.fn<OnMenuChange>();
    const onAsideChange = jest.fn<OnAsideChange>();
    render(harness({ menuExpanded: true, asideExpanded: false, onMenuChange, onAsideChange }));

    pressEscape();

    expect(onMenuChange).toHaveBeenCalledTimes(1);
    expect(onMenuChange).toHaveBeenCalledWith(false, 'escape');
    expect(onAsideChange).not.toHaveBeenCalled();
  });
});
