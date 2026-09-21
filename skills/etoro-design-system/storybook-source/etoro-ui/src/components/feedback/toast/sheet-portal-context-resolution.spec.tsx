import { Portal, PortalProvider } from '@gorhom/portal';
import { render } from '@testing-library/react-native';
import { type ReactNode, useContext } from 'react';
import { Platform, Text } from 'react-native';

import { ToastContext, ToastProvider } from './api/context';

/**
 * Static portal-context resolution — with the REAL `ToastProvider`.
 *
 * Scope: pin the direction in which React resolves context for a
 * `@gorhom/portal` `<Portal>` — at the `PortalProvider`'s tree location, not
 * the `<Portal>`'s. This is the mechanism `BottomSheetModalProvider` relies on
 * (it wraps children in a `PortalProvider` and every `BottomSheetModal`
 * teleports its content into that host), and it's why the root-layout provider
 * order matters: if `BottomSheetModalProvider` sits ABOVE `ToastProvider`, a
 * root-bound sheet's footer teleports to a host outside Toast and loses that
 * context.
 *
 * These tests deliberately render the app's REAL `ToastProvider` and read its
 * REAL `ToastContext` (not a synthetic stand-in) so the assertion tracks the
 * actual context a sheet footer consumes via `useToast()`. What they still do
 * NOT cover: a real `BottomSheetModal` mount/unmount inside
 * `AppFloatOverlayHost` (that remount path is covered in
 * `libs/etoro-ui/src/components/overlays/app-float-overlay/app-float-overlay-host.component.spec.tsx`
 * and `libs/common/infra/app-float-overlay/src/lib/sheet-presentation.store.spec.ts`).
 *
 * The live guard for the real root provider *order* remains
 * `apps/etoro-mobile/src/app/_layout.tsx` (the `BottomSheetModalProvider`
 * placement note there); this spec proves the portal + real-ToastProvider
 * mechanism that ordering depends on.
 */

function SheetFooterConsumer(): ReactNode {
  // Mirrors a footer calling `useToast()` from inside a teleported sheet: it
  // reads the real ToastContext. Non-null === it resolved a ToastProvider
  // up-tree from the PortalProvider host.
  const toast = useContext(ToastContext);
  return <Text testID="footer">{toast ? 'HAS_TOAST' : 'NO_TOAST'}</Text>;
}

describe('root-bound sheet resolves Toast context through the gorhom portal', () => {
  const originalOS = Platform.OS;

  // iOS is the platform the provider-order fix targets; on iOS `ToastProvider`
  // renders only its context + the overlay registrar (no inline container), so
  // this stays a lightweight context-resolution test.
  beforeEach(() => {
    Platform.OS = 'ios';
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('GIVEN ToastProvider wraps BottomSheetModalProvider (fixed order) THEN a teleported sheet footer resolves Toast context', () => {
    const { getByTestId } = render(
      <ToastProvider>
        {/* PortalProvider === the BottomSheetModalProvider host; it is INSIDE
            ToastProvider, so the teleported footer resolves Toast. */}
        <PortalProvider>
          <Portal>
            <SheetFooterConsumer />
          </Portal>
        </PortalProvider>
      </ToastProvider>,
    );

    expect(getByTestId('footer').props.children).toBe('HAS_TOAST');
  });

  it('GIVEN BottomSheetModalProvider wraps ToastProvider (the pre-fix bug) THEN the teleported footer LOSES Toast context', () => {
    const { getByTestId } = render(
      // PortalProvider (host) is OUTSIDE ToastProvider, so the teleported footer
      // resolves the default (null) — exactly the regression the reorder fixes.
      <PortalProvider>
        <ToastProvider>
          <Portal>
            <SheetFooterConsumer />
          </Portal>
        </ToastProvider>
      </PortalProvider>,
    );

    expect(getByTestId('footer').props.children).toBe('NO_TOAST');
  });
});
