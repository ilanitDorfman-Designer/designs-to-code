import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, renderHook, within } from '@testing-library/react-native';
import { Dimensions, Text } from 'react-native';

import { useSplitLayoutContext } from './api/context';
import { EtSplitLayout } from './et-split-layout';

const DESKTOP_WIDTH = 1280;
const TABLET_WIDTH = 800;

const MAIN_PANE = 'et-split-layout-main-pane';
const ASIDE_PANE = 'et-split-layout-aside-pane';

const ORIGINAL_DIMENSIONS = {
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
};

function setWindowWidth(width: number) {
  act(() => {
    Dimensions.set({ window: { width, height: 900, scale: 2, fontScale: 1 } });
  });
}

afterEach(() => {
  act(() => {
    Dimensions.set(ORIGINAL_DIMENSIONS);
  });
});

function TopBarHeightProbe() {
  const { topBarHeight } = useSplitLayoutContext();
  return <Text testID="top-bar-height">{String(topBarHeight)}</Text>;
}

function renderLayout(props: Partial<React.ComponentProps<typeof EtSplitLayout>> = {}) {
  return render(
    <EtSplitLayout {...props}>
      <EtSplitLayout.TopBar testID="top-bar">
        <Text>chrome</Text>
      </EtSplitLayout.TopBar>
      <EtSplitLayout.Main testID="main">
        <Text>main content</Text>
      </EtSplitLayout.Main>
      <EtSplitLayout.Aside testID="aside">
        <Text>aside content</Text>
      </EtSplitLayout.Aside>
    </EtSplitLayout>,
  );
}

describe('EtSplitLayout', () => {
  describe('layout mode', () => {
    it('GIVEN a desktop viewport, WHEN rendered, THEN both panes are mounted', () => {
      setWindowWidth(DESKTOP_WIDTH);

      const { getByText, getByTestId } = renderLayout();

      expect(getByText('main content')).toBeTruthy();
      expect(getByText('aside content')).toBeTruthy();
      expect(getByTestId(ASIDE_PANE)).toBeTruthy();
    });

    it('GIVEN a viewport below the desktop breakpoint, WHEN rendered, THEN the aside pane is unmounted', () => {
      setWindowWidth(TABLET_WIDTH);

      const { getByText, queryByText, queryByTestId } = renderLayout();

      expect(getByText('main content')).toBeTruthy();
      expect(queryByText('aside content')).toBeNull();
      expect(queryByTestId(ASIDE_PANE)).toBeNull();
    });

    it('GIVEN a mounted layout, WHEN the viewport resizes across the breakpoint, THEN the aside mounts and unmounts reactively', () => {
      setWindowWidth(TABLET_WIDTH);
      const { queryByText } = renderLayout();
      expect(queryByText('aside content')).toBeNull();

      setWindowWidth(DESKTOP_WIDTH);
      expect(queryByText('aside content')).toBeTruthy();

      setWindowWidth(TABLET_WIDTH);
      expect(queryByText('aside content')).toBeNull();
    });
  });

  describe('top bar', () => {
    it('GIVEN a top bar child, WHEN rendered, THEN it renders inside the main pane', () => {
      setWindowWidth(DESKTOP_WIDTH);

      const { getByTestId } = renderLayout();

      expect(within(getByTestId(MAIN_PANE)).getByTestId('top-bar')).toBeTruthy();
      expect(within(getByTestId(ASIDE_PANE)).queryByTestId('top-bar')).toBeNull();
    });

    it('GIVEN a top bar, WHEN it lays out, THEN its height is published on the context', () => {
      setWindowWidth(DESKTOP_WIDTH);
      const { getByTestId } = render(
        <EtSplitLayout>
          <EtSplitLayout.TopBar testID="top-bar">
            <Text>chrome</Text>
          </EtSplitLayout.TopBar>
          <EtSplitLayout.Main>
            <TopBarHeightProbe />
          </EtSplitLayout.Main>
        </EtSplitLayout>,
      );
      expect(getByTestId('top-bar-height').props.children).toBe('0');

      fireEvent(getByTestId('top-bar'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 960, height: 116 } } });

      expect(getByTestId('top-bar-height').props.children).toBe('116');
    });
  });

  describe('aside position', () => {
    it('GIVEN asidePosition "end" (default), WHEN split, THEN the aside pane renders after the main pane', () => {
      setWindowWidth(DESKTOP_WIDTH);

      const { getByTestId } = renderLayout({ testID: 'layout' });

      const paneOrder = getByTestId('layout').children.map((child) => (typeof child === 'string' ? child : child.props.testID));
      expect(paneOrder).toEqual([MAIN_PANE, ASIDE_PANE]);
    });

    it('GIVEN asidePosition "start", WHEN split, THEN the aside pane renders before the main pane', () => {
      setWindowWidth(DESKTOP_WIDTH);

      const { getByTestId } = renderLayout({ testID: 'layout', asidePosition: 'start' });

      const paneOrder = getByTestId('layout').children.map((child) => (typeof child === 'string' ? child : child.props.testID));
      expect(paneOrder).toEqual([ASIDE_PANE, MAIN_PANE]);
    });
  });

  describe('ratio', () => {
    it('GIVEN a 2:1 ratio at a desktop viewport, WHEN rendered, THEN pane flex weights match the snapshot', () => {
      setWindowWidth(DESKTOP_WIDTH);

      const { toJSON } = render(
        <EtSplitLayout ratio={[2, 1]} asidePosition="start">
          <EtSplitLayout.Main>
            <Text>content</Text>
          </EtSplitLayout.Main>
          <EtSplitLayout.Aside>
            <Text>rail</Text>
          </EtSplitLayout.Aside>
        </EtSplitLayout>,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('context', () => {
    it('GIVEN no surrounding EtSplitLayout, WHEN useSplitLayoutContext is called, THEN it throws', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => renderHook(() => useSplitLayoutContext())).toThrow('useSplitLayoutContext must be used within an EtSplitLayout component.');

      consoleError.mockRestore();
    });

    it('GIVEN an inline ratio array, WHEN the parent re-renders with equal weights, THEN the context value keeps its identity', () => {
      setWindowWidth(DESKTOP_WIDTH);
      const seenValues: unknown[] = [];

      function IdentityProbe() {
        seenValues.push(useSplitLayoutContext());
        return null;
      }

      function renderTree() {
        return (
          <EtSplitLayout ratio={[2, 1]}>
            <EtSplitLayout.Main>
              <IdentityProbe />
            </EtSplitLayout.Main>
          </EtSplitLayout>
        );
      }

      const { rerender } = render(renderTree());
      rerender(renderTree());

      expect(seenValues.length).toBeGreaterThanOrEqual(2);
      expect(seenValues[seenValues.length - 1]).toBe(seenValues[0]);
    });

    it('GIVEN a bailed-out subtree, WHEN the parent re-renders with an equal inline ratio, THEN context consumers re-render only on a real ratio change', () => {
      setWindowWidth(DESKTOP_WIDTH);
      const onProbeRender = jest.fn();

      function CountingProbe() {
        onProbeRender();
        useSplitLayoutContext();
        return null;
      }

      // Stable element reference: React skips this subtree on parent re-renders —
      // unless a context-value change pierces the bailout (the pre-fix behavior).
      const stableChildren = (
        <EtSplitLayout.Main>
          <CountingProbe />
        </EtSplitLayout.Main>
      );

      const { rerender } = render(<EtSplitLayout ratio={[2, 1]}>{stableChildren}</EtSplitLayout>);
      const rendersAfterMount = onProbeRender.mock.calls.length;

      rerender(<EtSplitLayout ratio={[2, 1]}>{stableChildren}</EtSplitLayout>);
      expect(onProbeRender).toHaveBeenCalledTimes(rendersAfterMount);

      rerender(<EtSplitLayout ratio={[3, 1]}>{stableChildren}</EtSplitLayout>);
      expect(onProbeRender).toHaveBeenCalledTimes(rendersAfterMount + 1);
    });

    it('GIVEN a split layout, WHEN read from the main pane, THEN the context reports the layout mode', () => {
      setWindowWidth(DESKTOP_WIDTH);

      function Probe() {
        const { isSplit, ratio, asidePosition } = useSplitLayoutContext();
        return <Text testID="probe">{[String(isSplit), ratio.join(':'), asidePosition].join('|')}</Text>;
      }

      const { getByTestId } = render(
        <EtSplitLayout ratio={[2, 1]} asidePosition="start">
          <EtSplitLayout.Main>
            <Probe />
          </EtSplitLayout.Main>
        </EtSplitLayout>,
      );

      expect(getByTestId('probe').props.children).toBe('true|2:1|start');
    });
  });
});
