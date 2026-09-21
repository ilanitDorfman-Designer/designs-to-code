import { type ReactNode, type RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';

/**
 * Test double for {@link EtBottomSheet} from this folder (exported from `etoro-ui` as `EtBottomSheetV2`).
 * When `shouldKeepOpen()` is falsy while the sheet is open, the sheet closes (e.g. mirrored selected row cleared).
 */
export function createEtBottomSheetV2Mock(shouldKeepOpen: () => unknown) {
  function EtBottomSheetV2({
    bottomSheetRef,
    children,
    testID,
    onClose,
  }: {
    bottomSheetRef: RefObject<{ present: () => void; dismiss: () => void } | null>;
    children?: ReactNode;
    testID?: string;
    onClose?: () => void;
  }) {
    const [open, setOpen] = useState(false);
    const keepOpen = shouldKeepOpen();

    useImperativeHandle(
      bottomSheetRef,
      () => ({
        present: () => setOpen(true),
        dismiss: () => {
          setOpen(false);
          onClose?.();
        },
      }),
      [onClose],
    );

    useEffect(() => {
      if (!keepOpen && open) {
        setOpen(false);
      }
    }, [keepOpen, open]);

    if (!open) return <></>;

    return <View testID={testID}>{children}</View>;
  }

  function EtBottomSheetV2Content({ children }: { children?: ReactNode }) {
    return <View>{children}</View>;
  }

  function EtBottomSheetV2Footer({ children }: { children?: ReactNode }) {
    return <View>{children}</View>;
  }

  EtBottomSheetV2.Content = EtBottomSheetV2Content;
  EtBottomSheetV2.Footer = EtBottomSheetV2Footer;

  return EtBottomSheetV2;
}
