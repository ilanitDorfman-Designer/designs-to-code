import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { createRef } from 'react';
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { useHover } from '../../../../core/hooks/use-hover';
import type { AppLayoutAsideTrigger } from '../api/types';
import { useAsideAnimation } from '../hooks/use-aside-animation';
import { AppLayoutAside } from '../subcomponents';
import { AsideToggle } from '../subcomponents/aside-toggle';

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

/** Flattens any style prop into a plain object (empty object for undefined). */
const flat = (style: unknown): ViewStyle => StyleSheet.flatten(style as StyleProp<ViewStyle>) ?? {};

// The inactive/suppressed layers are aria-hidden — queries into them opt in.
const HIDDEN = { includeHiddenElements: true } as const;

const ORIGINAL_DIMENSIONS = {
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
};

/** Set BEFORE render — the breakpoint hooks read the width in their state initializers. */
const setWindowWidth = (width: number) => {
  Dimensions.set({ window: { ...ORIGINAL_DIMENSIONS.window, width } });
};

type OnExpandedChange = (expanded: boolean, trigger: AppLayoutAsideTrigger) => void;

interface HarnessProps {
  expanded?: boolean;
  onExpandedChange?: OnExpandedChange;
  toggleAccessibilityLabels?: { expand?: string; collapse?: string };
}

const aside = ({ expanded = false, onExpandedChange = jest.fn<OnExpandedChange>(), toggleAccessibilityLabels }: HarnessProps = {}) => (
  <AppLayoutAside expanded={expanded} onExpandedChange={onExpandedChange} testID="aside" toggleAccessibilityLabels={toggleAccessibilityLabels}>
    <View testID="aside-content" />
  </AppLayoutAside>
);

const renderAside = (props: HarnessProps = {}) => render(aside(props));

describe('AppLayoutAside (the aside rail/panel machine)', () => {
  beforeEach(() => {
    mockDirection = 'ltr';
    setWindowWidth(1024);
  });

  afterEach(() => {
    // In act — the restore fires Dimensions listeners while components are still mounted.
    act(() => Dimensions.set(ORIGINAL_DIMENSIONS));
  });

  describe('structure', () => {
    it('renders an end-anchored clipped surface with start-corner radii and the state-invariant shadow', () => {
      renderAside();
      const style = flat(screen.getByTestId('aside-surface').props.style);
      expect(style.position).toBe('absolute');
      expect(style.end).toBe(0);
      expect(style.top).toBe(0);
      expect(style.bottom).toBe(0);
      expect(style.overflow).toBe('hidden');
      expect(style.borderStartStartRadius).toBe(16);
      expect(style.borderEndStartRadius).toBe(16);
      expect(style.boxShadow).toBe('-4px 14px 20px rgba(0, 0, 0, 0.24)');
    });

    it('mirrors the shadow x-offset in RTL', () => {
      mockDirection = 'rtl';
      renderAside();
      expect(flat(screen.getByTestId('aside-surface').props.style).boxShadow).toBe('4px 14px 20px rgba(0, 0, 0, 0.24)');
    });

    it('paints the layers with the design tokens: elevated panel, overlay-bottom rail', () => {
      renderAside();
      const panel = flat(screen.getByTestId('aside-panel', HIDDEN).props.style);
      expect(panel.backgroundColor).toBe(colorsMock.colors.backgroundElevated);
      expect(panel.padding).toBe(32);
      const rail = flat(screen.getByTestId('aside-rail').props.style);
      expect(rail.backgroundColor).toBe(colorsMock.colors.overlayBottom);
    });

    it('sizes the panel layer and gap per the 1024 overlay tier', () => {
      renderAside();
      expect(flat(screen.getByTestId('aside-panel', HIDDEN).props.style).width).toBe(360);
      expect(flat(screen.getByTestId('aside').props.style).marginStart).toBe(8);
    });

    it('sizes the panel layer and gap per the 1440 inline tier', () => {
      setWindowWidth(1440);
      renderAside({ expanded: true });
      expect(flat(screen.getByTestId('aside-panel').props.style).width).toBe(376);
      expect(flat(screen.getByTestId('aside').props.style).marginStart).toBe(12);
    });

    it('renders children inside the panel content frame', () => {
      renderAside();
      expect(within(screen.getByTestId('aside-panel', HIDDEN)).getByTestId('aside-content', HIDDEN)).toBeTruthy();
    });

    /** Returns the `name` of the EtIconV2 rendered inside the toggle. */
    const toggleIconName = (): string => {
      const nodes = screen
        .getByTestId('aside-toggle', HIDDEN)
        .findAll((node) => typeof node.type !== 'string' && typeof node.props?.name === 'string');
      if (nodes.length === 0) {
        throw new Error('No named icon found inside the aside toggle');
      }
      return nodes[0].props.name as string;
    };

    it('uses the start-pointing DS glyph while closed, the end-pointing one while open', () => {
      renderAside({ expanded: false });
      expect(toggleIconName()).toBe('collapse-fill-left');
      screen.unmount();
      renderAside({ expanded: true });
      expect(toggleIconName()).toBe('collapse-fill-right');
    });

    it('RTL mirrors the glyph via scaleX(-1)', () => {
      mockDirection = 'rtl';
      renderAside({ expanded: false });
      const glyphWrap = screen
        .getByTestId('aside-toggle', HIDDEN)
        .findAll((node) => typeof node.type === 'string' && flat(node.props.style).transform !== undefined);
      expect(flat(glyphWrap[glyphWrap.length - 1].props.style).transform).toEqual([{ scaleX: -1 }]);
    });

    it('mounts the persistent toggle outside both crossfade layers', () => {
      renderAside();
      expect(screen.getAllByTestId('aside-toggle')).toHaveLength(1);
      expect(within(screen.getByTestId('aside-panel', HIDDEN)).queryByTestId('aside-toggle', HIDDEN)).toBeNull();
      expect(within(screen.getByTestId('aside-rail')).queryByTestId('aside-toggle', HIDDEN)).toBeNull();
    });
  });

  describe('rail-press focus hand-off', () => {
    /*
     * The hand-off is a ref on a component built by `create()` (React.memo). React 19 passes `ref`
     * as an ordinary prop, so no `forwardRef` is needed — but that is invisible at the call site,
     * and a reviewer has already read it as a bug once. Pin it: if the ref ever stops arriving,
     * the toggle silently loses focus on every rail-press expand and Escape close (WCAG 2.4.3).
     */
    it('delivers a ref through the memo wrapper to the toggle', () => {
      const toggleRef = createRef<View>();

      function ToggleHarness() {
        const animation = useAsideAnimation({ expanded: false, isInline: false, railHovered: false, reducedMotion: false });
        const { hoverProps } = useHover();
        return (
          <AsideToggle
            animation={animation}
            dirSign={1}
            expanded={false}
            hoverProps={hoverProps}
            onPress={jest.fn()}
            ref={toggleRef}
            suppressed={false}
            testID="lone-toggle"
          />
        );
      }

      render(<ToggleHarness />);

      expect(screen.getByTestId('lone-toggle')).toBeTruthy();
      expect(toggleRef.current).not.toBeNull();
    });
  });

  describe('controlled contract', () => {
    it('expands from a press anywhere on the closed rail body', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderAside({ onExpandedChange });
      fireEvent.press(screen.getByTestId('aside-rail'));
      expect(onExpandedChange).toHaveBeenCalledTimes(1);
      expect(onExpandedChange).toHaveBeenCalledWith(true, 'rail');
    });

    it('never fires from rail presses while expanded (close is button-only)', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderAside({ expanded: true, onExpandedChange });
      fireEvent.press(screen.getByTestId('aside-rail', HIDDEN));
      expect(onExpandedChange).not.toHaveBeenCalled();
    });

    it('requests expand from the toggle while closed', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderAside({ onExpandedChange });
      fireEvent.press(screen.getByTestId('aside-toggle'));
      expect(onExpandedChange).toHaveBeenCalledWith(true, 'button');
    });

    it('requests collapse from the toggle while expanded', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderAside({ expanded: true, onExpandedChange });
      fireEvent.press(screen.getByTestId('aside-toggle'));
      expect(onExpandedChange).toHaveBeenCalledWith(false, 'button');
    });

    it('holds no state itself — the expanded prop drives the layers', () => {
      const view = renderAside({ expanded: false });
      expect(screen.getByTestId('aside-rail').props['aria-hidden']).toBe(false);
      expect(screen.getByTestId('aside-panel', HIDDEN).props['aria-hidden']).toBe(true);

      view.rerender(aside({ expanded: true }));
      expect(screen.getByTestId('aside-rail', HIDDEN).props['aria-hidden']).toBe(true);
      expect(screen.getByTestId('aside-panel').props['aria-hidden']).toBe(false);
    });
  });

  describe('permanently mounted layers', () => {
    it('flips pointerEvents and tabIndex with the state, never unmounting a layer', () => {
      const view = renderAside({ expanded: false });
      let rail = screen.getByTestId('aside-rail');
      expect(flat(rail.props.style).pointerEvents).toBe('auto');
      expect(rail.props.tabIndex).toBe(0);
      expect(flat(screen.getByTestId('aside-panel', HIDDEN).props.style).pointerEvents).toBe('none');

      view.rerender(aside({ expanded: true }));
      rail = screen.getByTestId('aside-rail', HIDDEN);
      expect(flat(rail.props.style).pointerEvents).toBe('none');
      expect(rail.props.tabIndex).toBe(-1);
      expect(flat(screen.getByTestId('aside-panel').props.style).pointerEvents).toBe('auto');
      expect(screen.getAllByTestId('aside-toggle')).toHaveLength(1);
    });

    // aria-hidden + pointerEvents leave descendants in the web tab order, and
    // the panel hosts ARBITRARY app content the kit cannot tab-gate per element
    // — the settled-collapsed layer must be display-cut.
    it('display-cuts the settled-collapsed panel layer and restores it on expand', () => {
      const view = renderAside({ expanded: false });
      expect(flat(screen.getByTestId('aside-panel', HIDDEN).props.style).display).toBe('none');

      view.rerender(aside({ expanded: true }));
      expect(flat(screen.getByTestId('aside-panel').props.style).display).not.toBe('none');
    });
  });

  describe('accessibility', () => {
    it('exposes the panel as complementary and both press targets as buttons', () => {
      renderAside();
      expect(screen.getByTestId('aside-panel', HIDDEN).props.role).toBe('complementary');
      expect(screen.getByTestId('aside-rail').props.accessibilityRole).toBe('button');
      expect(screen.getByTestId('aside-toggle').props.accessibilityRole).toBe('button');
    });

    it('carries aria-expanded on the persistent toggle', () => {
      // RN's View merges `aria-expanded` into accessibilityState (RNW emits the DOM attribute).
      const view = renderAside({ expanded: false });
      expect(screen.getByTestId('aside-toggle').props.accessibilityState).toEqual(expect.objectContaining({ expanded: false }));
      view.rerender(aside({ expanded: true }));
      expect(screen.getByTestId('aside-toggle').props.accessibilityState).toEqual(expect.objectContaining({ expanded: true }));
    });

    it('labels the rail and toggle from toggleAccessibilityLabels with kit defaults', () => {
      const view = renderAside();
      expect(screen.getByTestId('aside-rail').props.accessibilityLabel).toBe('Expand panel');
      expect(screen.getByTestId('aside-toggle').props.accessibilityLabel).toBe('Expand panel');

      view.rerender(aside({ expanded: true, toggleAccessibilityLabels: { collapse: 'Hide panel', expand: 'Show panel' } }));
      expect(screen.getByTestId('aside-rail', HIDDEN).props.accessibilityLabel).toBe('Show panel');
      expect(screen.getByTestId('aside-toggle').props.accessibilityLabel).toBe('Hide panel');
    });
  });

  describe('sub-768 self-suppression', () => {
    beforeEach(() => {
      setWindowWidth(750);
    });

    it('collapses the in-flow footprint: no gap', () => {
      renderAside();
      expect(flat(screen.getByTestId('aside', HIDDEN).props.style).marginStart).toBe(0);
    });

    it('display-cuts the surface while keeping the layers mounted', () => {
      renderAside();
      const surface = screen.getByTestId('aside-surface', HIDDEN);
      expect(surface.props['aria-hidden']).toBe(true);
      // display none — invisible, inert and out of the tab order in one
      // property (aria-hidden alone would leave descendants reachable).
      expect(flat(surface.props.style).display).toBe('none');
      expect(screen.getByTestId('aside-rail', HIDDEN)).toBeTruthy();
      expect(screen.getByTestId('aside-panel', HIDDEN)).toBeTruthy();
    });

    it('removes the rail and toggle from the tab order', () => {
      renderAside();
      expect(screen.getByTestId('aside-rail', HIDDEN).props.tabIndex).toBe(-1);
      expect(screen.getByTestId('aside-toggle', HIDDEN).props.tabIndex).toBe(-1);
    });

    it('never expands from a rail press', () => {
      const onExpandedChange = jest.fn<OnExpandedChange>();
      renderAside({ onExpandedChange });
      fireEvent.press(screen.getByTestId('aside-rail', HIDDEN));
      expect(onExpandedChange).not.toHaveBeenCalled();
    });
  });
});
