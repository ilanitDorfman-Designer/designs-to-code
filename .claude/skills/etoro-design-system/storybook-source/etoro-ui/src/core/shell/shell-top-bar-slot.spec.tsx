import { render } from '@testing-library/react-native';
import { memo, ReactNode, useEffect } from 'react';
import { Text } from 'react-native';

import { ShellSceneFocusProvider, ShellTopBarSlotProvider, useShellTopBarContent, useShellTopBarSlot } from './shell-top-bar-slot';

/*
 * Memoized on purpose. Screens re-render one at a time — a price tick re-renders the screen holding
 * the ticking price, not every mounted screen — so a publisher whose props did not change must not
 * re-render just because a sibling did. Without the memo, `rerender` re-renders every publisher in
 * one commit and the stack test below cannot tell the two orderings apart.
 */
const Publisher = memo(function Publisher({ label }: { label: string | null }) {
  useShellTopBarSlot(label == null ? null : { start: null, middle: null, end: <Text>{label}</Text> });
  return null;
});

function Panel() {
  return <>{useShellTopBarContent()?.end}</>;
}

const renderFrame = (children: ReactNode) =>
  render(
    <ShellTopBarSlotProvider>
      <Panel />
      {children}
    </ShellTopBarSlotProvider>,
  );

describe('useShellTopBarSlot', () => {
  it('GIVEN no frame around it WHEN a screen publishes THEN nothing happens and nothing throws', () => {
    expect(() => render(<Publisher label="actions" />)).not.toThrow();
  });

  /*
   * The stack case. A pushed screen does not unmount the one it covers, and the covered one
   * re-renders on its own — on every price tick, in this app. Its claim must never jump the queue.
   */
  it('GIVEN a covered screen re-renders after the screen on top mounted THEN the top screen keeps the slot', () => {
    const { rerender, queryByText } = render(
      <ShellTopBarSlotProvider>
        <Panel />
        <Publisher label="covered" />
        <Publisher label="on-top" />
      </ShellTopBarSlotProvider>,
    );

    // The covered screen re-renders with fresh content; the one on top does not.
    rerender(
      <ShellTopBarSlotProvider>
        <Panel />
        <Publisher label="covered again" />
        <Publisher label="on-top" />
      </ShellTopBarSlotProvider>,
    );

    expect(queryByText('on-top')).toBeTruthy();
    expect(queryByText('covered again')).toBeNull();
  });

  /*
   * The same case from the reader's side: a covered screen re-publishing leaves the visible slot
   * untouched, so the frame's panel is never notified. It re-renders on price ticks otherwise.
   */
  it('GIVEN a covered screen re-renders THEN the frame’s panel is not notified', () => {
    const panelRendered = jest.fn();
    // Memoized, so the only thing that can render it is a notification from the store.
    const CountingPanel = memo(function CountingPanel() {
      useShellTopBarContent();
      useEffect(panelRendered);
      return null;
    });

    const { rerender } = render(
      <ShellTopBarSlotProvider>
        <CountingPanel />
        <Publisher label="covered" />
        <Publisher label="on-top" />
      </ShellTopBarSlotProvider>,
    );

    const rendersBefore = panelRendered.mock.calls.length;

    rerender(
      <ShellTopBarSlotProvider>
        <CountingPanel />
        <Publisher label="covered again" />
        <Publisher label="on-top" />
      </ShellTopBarSlotProvider>,
    );

    expect(panelRendered).toHaveBeenCalledTimes(rendersBefore);
  });

  /*
   * A screen with nothing to show must still own the slot, or it inherits the actions of whatever
   * is underneath it — `/portfolio/options` publishing into the panel while you are on
   * `options-breakdown`.
   */
  it('GIVEN the screen on top has nothing to show THEN the panel is empty, not the covered screen’s content', () => {
    const { queryByText } = render(
      <ShellTopBarSlotProvider>
        <Panel />
        <Publisher label="covered" />
        <Publisher label={null} />
      </ShellTopBarSlotProvider>,
    );

    expect(queryByText('covered')).toBeNull();
  });

  it('GIVEN an unfocused scene WHEN it has nothing to show THEN it does not clear the visible screen either', () => {
    const { queryByText } = render(
      <ShellTopBarSlotProvider>
        <Panel />
        <Publisher label="visible" />
        <ShellSceneFocusProvider focused={false}>
          <Publisher label={null} />
        </ShellSceneFocusProvider>
      </ShellTopBarSlotProvider>,
    );

    expect(queryByText('visible')).toBeTruthy();
  });

  it('GIVEN one screen WHEN it publishes THEN the frame renders its content', () => {
    expect(renderFrame(<Publisher label="share" />).getByText('share')).toBeTruthy();
  });

  it('GIVEN a screen with nothing to publish THEN the frame renders nothing', () => {
    expect(renderFrame(<Publisher label={null} />).queryByText('share')).toBeNull();
  });

  // Four tab screens are mounted at once (`detachInactiveScreens={false}`), which is the referee
  // invariant: unfocused scenes must not claim the slot.
  it('GIVEN several mounted scenes WHEN only one is focused THEN only that one owns the slot', () => {
    const { queryByText } = renderFrame(
      <>
        <ShellSceneFocusProvider focused={false}>
          <Publisher label="home-actions" />
        </ShellSceneFocusProvider>
        <ShellSceneFocusProvider focused>
          <Publisher label="discover-share" />
        </ShellSceneFocusProvider>
        <ShellSceneFocusProvider focused={false}>
          <Publisher label="portfolio-actions" />
        </ShellSceneFocusProvider>
      </>,
    );

    expect(queryByText('discover-share')).toBeTruthy();
    expect(queryByText('home-actions')).toBeNull();
    expect(queryByText('portfolio-actions')).toBeNull();
  });

  it('GIVEN a screen pushed above another WHEN both publish THEN the one on top owns the slot', () => {
    const { queryByText } = renderFrame(
      <>
        <Publisher label="underneath" />
        <Publisher label="on-top" />
      </>,
    );

    expect(queryByText('on-top')).toBeTruthy();
    expect(queryByText('underneath')).toBeNull();
  });

  /*
   * The load-bearing property. If a publish re-rendered the provider, it would re-render the
   * navigator underneath it, the screen would produce fresh top-bar JSX, and that fresh JSX would
   * publish again — a render loop. Only the panel that reads the slot may re-render.
   */
  it('GIVEN a screen publishes THEN the tree under the provider does not re-render', () => {
    let bodyRenders = 0;
    function Body() {
      bodyRenders += 1;
      return null;
    }

    const { rerender, getByText } = render(
      <ShellTopBarSlotProvider>
        <Panel />
        <Body />
        <Publisher label="first" />
      </ShellTopBarSlotProvider>,
    );

    const rendersAfterFirstPublish = bodyRenders;
    expect(getByText('first')).toBeTruthy();

    rerender(
      <ShellTopBarSlotProvider>
        <Panel />
        <Body />
        <Publisher label="second" />
      </ShellTopBarSlotProvider>,
    );

    expect(getByText('second')).toBeTruthy();
    // One render for the rerender itself, and none caused by the publish.
    expect(bodyRenders).toBe(rendersAfterFirstPublish + 1);
  });

  it('GIVEN the screen on top unmounts THEN the slot returns to the screen underneath', () => {
    const { queryByText, rerender } = render(
      <ShellTopBarSlotProvider>
        <Panel />
        <Publisher label="underneath" />
        <Publisher label="on-top" />
      </ShellTopBarSlotProvider>,
    );

    rerender(
      <ShellTopBarSlotProvider>
        <Panel />
        <Publisher label="underneath" />
      </ShellTopBarSlotProvider>,
    );

    expect(queryByText('underneath')).toBeTruthy();
    expect(queryByText('on-top')).toBeNull();
  });
});
