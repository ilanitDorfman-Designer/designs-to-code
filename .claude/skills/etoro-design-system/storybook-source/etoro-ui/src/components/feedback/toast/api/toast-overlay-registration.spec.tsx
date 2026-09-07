import { OverlayPriority } from '@etoro/common/infra/app-float-overlay';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform, Text } from 'react-native';

import { ToastProvider, useToastContext } from './context';

// Track which surface (id, priority, Component) `ToastProvider` registers with
// the shared `AppFloatOverlayHost`. On iOS the provider must register the
// toast container at `OverlayPriority.Toast` so a regression to e.g.
// `NetworkStatus` would silently invert the paint order (network banner
// covering toasts) — that inversion has no other test to catch it, since
// nothing else in the app touches `useRegisterOverlaySurface('toast', ...)`.
const mockUseRegisterOverlaySurface = jest.fn();

jest.mock('@etoro/common/infra/app-float-overlay', () => {
  const actual = jest.requireActual('@etoro/common/infra/app-float-overlay');
  return {
    ...actual,
    useRegisterOverlaySurface: (...args: [string, number, React.ComponentType]) => {
      mockUseRegisterOverlaySurface(...args);
    },
  };
});

// Stub `ToastContainer` with a plain testID-bearing view so this spec asserts
// on the provider's iOS registration wiring / Android inline render, not on
// the container's own rendering (that's covered by its dedicated specs).
jest.mock('../subcomponents/toast-container', () => {
  const { Text } = require('react-native');
  return {
    ToastContainer: ({ toasts }: { toasts: Array<{ id: string }> }) => (
      <Text testID="toast-container-inline">{toasts.map((t) => t.id).join(',')}</Text>
    ),
  };
});

function ShowOneToastOnMount() {
  const { showToast } = useToastContext();
  React.useEffect(() => {
    // Use `useEffect` (not `onLayout`) — jest's RN renderer doesn't
    // synthesise layout events, so `onLayout` never fires here.
    showToast({ type: 'icon', status: 'success', message: 'hi', icon: { name: 'check-circle' } as never });
  }, [showToast]);
  return <Text testID="trigger">trigger</Text>;
}

describe('ToastProvider iOS overlay registration', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('GIVEN Platform.OS === "ios" WHEN ToastProvider mounts THEN it registers `toast` at OverlayPriority.Toast with the shared AppFloatOverlayHost', () => {
    // Pins the iOS wiring: the provider must NOT mint its own overlay layer;
    // instead it feeds the container into the shared `AppFloatOverlayHost`
    // via `useRegisterOverlaySurface`. Wrong priority would break the
    // documented paint order (NetworkStatus < Toast < InAppWeb < Critical).
    Platform.OS = 'ios';

    render(
      <ToastProvider>
        <Text testID="app-root">APP</Text>
      </ToastProvider>,
    );

    expect(mockUseRegisterOverlaySurface).toHaveBeenCalledTimes(1);
    const [id, priority, Component] = mockUseRegisterOverlaySurface.mock.calls[0];
    expect(id).toBe('toast');
    expect(priority).toBe(OverlayPriority.Toast);
    expect(typeof Component).toBe('function');
  });

  it('GIVEN Platform.OS === "ios" WHEN ToastProvider re-renders THEN it registers the SAME Component reference (stable ref — no per-render host remount)', () => {
    // The registered Component must be a stable module-level reference so the
    // shared host doesn't remount its subtree on every ToastProvider render.
    // A regression to `() => <ToastContainer />` inside the provider body would
    // hand a FRESH function to `useRegisterOverlaySurface` each render, tripping
    // the "Don't register a fresh component every render" anti-pattern in
    // AppFloatOverlayHost's AGENTS.md. Asserting referential stability across a
    // re-render is what actually guards that — a `typeof === 'function'` check
    // would pass even for the buggy fresh-closure-per-render case.
    Platform.OS = 'ios';

    const { rerender } = render(
      <ToastProvider>
        <Text testID="app-root">APP</Text>
      </ToastProvider>,
    );
    rerender(
      <ToastProvider>
        <Text testID="app-root">APP (re-render)</Text>
      </ToastProvider>,
    );

    const calls = mockUseRegisterOverlaySurface.mock.calls;
    expect(calls.length).toBeGreaterThanOrEqual(2);
    const firstComponent = calls[0][2];
    const lastComponent = calls[calls.length - 1][2];
    expect(lastComponent).toBe(firstComponent);
  });

  it('GIVEN Platform.OS === "ios" WHEN ToastProvider re-renders THEN it does NOT render ToastContainer inline (the container lives inside the shared host)', () => {
    // On iOS the container is rendered by `AppFloatOverlayHost`, not by
    // `ToastProvider` itself. If the provider ever regresses to also
    // rendering it inline (e.g. dropping the `isIos` branch), the container
    // would paint twice — once inline behind sheets, once above via the host.
    Platform.OS = 'ios';

    const { queryByTestId } = render(
      <ToastProvider>
        <Text testID="app-root">APP</Text>
      </ToastProvider>,
    );

    expect(queryByTestId('toast-container-inline')).toBeNull();
  });

  it('GIVEN Platform.OS === "android" WHEN ToastProvider mounts THEN it does NOT touch the shared registrar (Android renders the container inline)', () => {
    // Android has no `FullWindowOverlay` layer to coordinate — its native
    // `Modal` primitive already lifts things above bottom sheets. The
    // provider must skip `useRegisterOverlaySurface` entirely on Android;
    // registering would leak an iOS-only surface into a code path where the
    // host observes an empty list.
    Platform.OS = 'android';

    render(
      <ToastProvider>
        <Text testID="app-root">APP</Text>
      </ToastProvider>,
    );

    expect(mockUseRegisterOverlaySurface).not.toHaveBeenCalled();
  });

  it('GIVEN Platform.OS === "android" WHEN ToastProvider mounts THEN it renders ToastContainer inline (Android has no shared host to feed)', () => {
    Platform.OS = 'android';

    const { getByTestId } = render(
      <ToastProvider>
        <Text testID="app-root">APP</Text>
      </ToastProvider>,
    );

    expect(getByTestId('toast-container-inline')).toBeTruthy();
  });

  it('GIVEN the iOS-registered slot component WHEN rendered under the ToastProvider THEN it reads toast state from context (proves the slot resolves ToastProvider up-tree)', () => {
    // The slot is a module-level component (stable ref for the host) that
    // reads state via `useToastContext()`. This test proves the host-side
    // contract: rendering the slot INSIDE the ToastProvider's tree resolves
    // the same context the provider owns — a regression to a fresh context
    // (or a slot defined outside the provider's scope) would throw
    // `useToastContext must be used within a ToastProvider`.
    Platform.OS = 'ios';

    // Render one ToastProvider tree with both the trigger and the
    // registered slot inside it. The trigger's `onLayout` fires `showToast`,
    // and — because the slot lives in the same provider — the stubbed
    // container reflects the queued toast id on the next render pass.
    const { getByTestId } = render(<SlotRenderProbe />);

    expect(getByTestId('toast-container-inline').props.children).toMatch(/^toast-/);
  });
});

function SlotRenderProbe(): React.ReactElement {
  const [SlotComponent, setSlotComponent] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    const call = mockUseRegisterOverlaySurface.mock.calls[0];
    if (call) {
      setSlotComponent(() => call[2] as React.ComponentType);
    }
  }, []);

  return (
    <ToastProvider>
      <ShowOneToastOnMount />
      {SlotComponent ? <SlotComponent /> : null}
    </ToastProvider>
  );
}
