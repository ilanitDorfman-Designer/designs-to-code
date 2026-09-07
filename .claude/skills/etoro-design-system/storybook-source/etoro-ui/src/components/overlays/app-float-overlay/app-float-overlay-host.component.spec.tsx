import { notifySheetDismissed, notifySheetPresented, OverlayPriority, registerOverlaySurface } from '@etoro/common/infra/app-float-overlay';
import { act, render } from '@testing-library/react-native';
import React from 'react';
import { Platform, Text } from 'react-native';

import { AppFloatOverlayHost } from './app-float-overlay-host.component';

jest.mock('react-native-gesture-handler', () => {
  const ReactMod = require('react');
  const RN = require('react-native');
  return {
    __esModule: true,
    GestureHandlerRootView: ({ children, ...props }: { children: React.ReactNode }) => ReactMod.createElement(RN.View, props, children),
  };
});

jest.mock('react-native-screens', () => {
  const ReactMod = require('react');
  const RN = require('react-native');
  return {
    __esModule: true,
    FullWindowOverlay: ({ children, ...props }: { children: React.ReactNode }) =>
      ReactMod.createElement(RN.View, { ...props, testID: props['testID'] ?? 'full-window-overlay' }, children),
  };
});

describe('AppFloatOverlayHost', () => {
  const originalOS = Platform.OS;
  const cleanups: Array<() => void> = [];

  const track = (unregister: () => void) => {
    cleanups.push(unregister);
    return unregister;
  };

  afterEach(() => {
    Platform.OS = originalOS;
    act(() => {
      while (cleanups.length > 0) {
        cleanups.pop()?.();
      }
    });
  });

  const SurfaceA = () => <Text testID="surface-a">A</Text>;
  const SurfaceB = () => <Text testID="surface-b">B</Text>;
  const SurfaceC = () => <Text testID="surface-c">C</Text>;

  it('GIVEN Platform.OS === "android" WHEN the host renders THEN surfaces render inline without FullWindowOverlay', () => {
    // Android has no FullWindowOverlay primitive — the host must fall through to
    // an inline stack so registered surfaces still paint via the normal RN
    // Modal / view hierarchy.
    Platform.OS = 'android';
    track(registerOverlaySurface('a', OverlayPriority.Toast, SurfaceA));

    const { queryByTestId, getByTestId } = render(<AppFloatOverlayHost />);

    expect(getByTestId('surface-a')).toBeTruthy();
    expect(queryByTestId('full-window-overlay')).toBeNull();
  });

  it('GIVEN Platform.OS === "ios" WHEN the host renders THEN surfaces render inside a FullWindowOverlay', () => {
    // On iOS the host owns a single non-modal FullWindowOverlay that hosts
    // every registered app-controlled surface (toast, in-app WebView,
    // network-status). This is the core paint-order mechanism the tests
    // must regression-check.
    Platform.OS = 'ios';
    track(registerOverlaySurface('a', OverlayPriority.Toast, SurfaceA));

    const { getByTestId } = render(<AppFloatOverlayHost />);

    expect(getByTestId('full-window-overlay')).toBeTruthy();
    expect(getByTestId('surface-a')).toBeTruthy();
  });

  it('GIVEN multiple surfaces registered at different priorities WHEN the host renders THEN they render in ascending priority order', () => {
    // Paint order is the whole point of the OverlayPriority enum — higher
    // number paints closer to the user. A regression here would let a
    // NetworkStatus banner cover a Critical surface.
    //
    // Uses arbitrary non-reserved numeric priorities to exercise the sort
    // order without registering reserved slots (`NetworkStatus`, `DataDome`)
    // with this host — the enum's own comments and this component's
    // `AGENTS.md` mark those as invariants ("reserved priorities must not be
    // registered with `AppFloatOverlayHost`"). If a future runtime guard
    // rejects reserved priorities, this test would break for the wrong
    // reason; using bare numbers keeps the sort assertion isolated from that
    // invariant.
    Platform.OS = 'ios';
    track(registerOverlaySurface('web', 350 as OverlayPriority, SurfaceC));
    track(registerOverlaySurface('toast', 250 as OverlayPriority, SurfaceB));
    track(registerOverlaySurface('net', 150 as OverlayPriority, SurfaceA));

    const { getAllByText } = render(<AppFloatOverlayHost />);

    const order = getAllByText(/^[A-C]$/).map((node) => node.props.children);
    expect(order).toEqual(['A', 'B', 'C']);
  });

  it('GIVEN Platform.OS === "ios" WHEN a sheet is presented THEN the surface subtree is NOT remounted (front-order is re-asserted natively)', () => {
    // Front-order is re-asserted imperatively in native code (the app-level
    // reassert bridge → `OverlayReasserter` → `[window bringSubviewToFront:]`),
    // NOT by a keyed React remount. So a sheet-present must leave the host's
    // subtree intact — toast timers and the in-app WebView keep their state.
    // Observed via a per-mount token: it must stay STABLE across
    // `notifySheetPresented` (a regression to the keyed remount would change
    // it). The native reorder itself is out of JS reach and verified on device.
    Platform.OS = 'ios';
    const StatefulSurface = () => {
      // useState's initializer runs once per component instance: a live
      // re-render preserves the token, an unmount+remount would produce a new
      // one. Random ensures cross-mount inequality without shared state.
      const [mountToken] = React.useState(() => Math.random());
      return <Text testID="stateful-generation">{String(mountToken)}</Text>;
    };
    track(registerOverlaySurface('s', OverlayPriority.Toast, StatefulSurface));

    const { getByTestId } = render(<AppFloatOverlayHost />);
    const initialToken = getByTestId('stateful-generation').props.children;

    let sheetToken = 0;
    act(() => {
      sheetToken = notifySheetPresented();
    });

    // The subtree instance must be the SAME after the bump — no teardown.
    expect(getByTestId('stateful-generation').props.children).toBe(initialToken);

    act(() => {
      notifySheetDismissed(sheetToken);
    });
  });

  it('GIVEN no surfaces registered WHEN the host renders on iOS THEN it still renders the FullWindowOverlay wrapper (empty)', () => {
    // Empty-state safety: consumers may mount the host before any registrar
    // effect has fired. The host must render its wrapper regardless so the
    // native overlay window exists at the top of the RN stack from the first
    // paint.
    Platform.OS = 'ios';

    const { getByTestId } = render(<AppFloatOverlayHost />);

    expect(getByTestId('full-window-overlay')).toBeTruthy();
  });
});
