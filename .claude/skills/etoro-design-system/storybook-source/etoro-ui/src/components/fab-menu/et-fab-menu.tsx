import React, { Children, isValidElement, useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { X3 } from '../../core/styles';
import { modalRequestClose } from '../../core/web/modal-request-close';
import { useDismissable } from '../../core/web/use-dismissable';
import type { EtFabMenuProps } from './api';
import { FabMenuContext } from './context';
import { EtFabMenuActions, EtFabMenuButton, EtFabMenuTrigger } from './subcomponents';

const OVERLAY_BACKGROUND = 'transparent';

/**
 * EtFabMenu - Floating Action Button menu that expands to reveal actions
 *
 * A FAB Menu expands from a Floating Action Button to reveal multiple related actions.
 * It groups secondary actions under a single primary trigger.
 *
 * When positioned (e.g. `position: absolute`, bottom-right), pass `contentInset` with
 * the same bottom/right values so the FAB stays fixed when the menu opens in the Modal.
 *
 * @example
 * ```tsx
 * <EtFabMenu contentInset={{ bottom: 100, right: 16 }}>
 *   <EtFabMenu.Trigger />
 *   <EtFabMenu.Actions>
 *     <EtFabMenu.Button iconName="star" label="Action 01" onPress={handleAction1} />
 *     <EtFabMenu.Button iconName="star" label="Action 02" onPress={handleAction2} />
 *   </EtFabMenu.Actions>
 * </EtFabMenu>
 * ```
 *
 * @example With custom trigger
 * ```tsx
 * <EtFabMenu>
 *   <EtFabMenu.Trigger>
 *     {(isOpen) => (
 *       <EtButton>
 *         <EtButton.Icon name={isOpen ? 'close' : 'plus'} />
 *       </EtButton>
 *     )}
 *   </EtFabMenu.Trigger>
 *   <EtFabMenu.Actions>...</EtFabMenu.Actions>
 * </EtFabMenu>
 * ```
 */
function EtFabMenuRoot({ children, style, closeOnOutsidePress = true, contentInset, testID }: EtFabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // ESC closes the menu via the shared web dismiss stack (topmost open layer
  // only; no-op on native). Android back is handled by Modal onRequestClose —
  // native-only via `modalRequestClose`: RNW's Modal would otherwise ALSO
  // close on Escape keyup, behind the stack's back.
  useDismissable({ active: isOpen, onDismiss: close });

  const contextValue = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);

  const { triggerChild, actionsChild } = useMemo(() => {
    const childArray = Children.toArray(children);
    let trigger: React.ReactNode = null;
    let actions: React.ReactNode = null;

    childArray.forEach((child) => {
      if (isValidElement(child)) {
        if (child.type === EtFabMenuTrigger) {
          trigger = child;
        } else if (child.type === EtFabMenuActions) {
          actions = child;
        }
      }
    });

    return { triggerChild: trigger, actionsChild: actions };
  }, [children]);

  if (__DEV__ && (triggerChild == null || actionsChild == null)) {
    console.warn('EtFabMenu is missing required children. Include both EtFabMenu.Trigger and EtFabMenu.Actions.');
  }

  const fabContent = (
    <View style={[styles.container, style]} testID={testID} pointerEvents="box-none">
      <View style={styles.menu} pointerEvents="box-none">
        {actionsChild}
        {triggerChild}
      </View>
    </View>
  );

  return (
    <FabMenuContext.Provider value={contextValue}>
      {closeOnOutsidePress && isOpen ? (
        <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={modalRequestClose(close)}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.overlay}
              onPress={close}
              testID="et-fab-menu-overlay"
              accessibilityLabel="Close menu"
              accessibilityRole="button"
              accessibilityHint="Double tap to close the menu"
            />
            <View
              style={[
                styles.fabAboveOverlay,
                contentInset && {
                  bottom: contentInset.bottom ?? 0,
                  right: contentInset.right ?? 0,
                },
              ]}
            >
              {fabContent}
            </View>
          </View>
        </Modal>
      ) : (
        fabContent
      )}
    </FabMenuContext.Provider>
  );
}

EtFabMenuRoot.displayName = 'EtFabMenu';

/**
 * EtFabMenu with compound components attached
 */
export const EtFabMenu = Object.assign(React.memo(EtFabMenuRoot), {
  Trigger: EtFabMenuTrigger,
  Actions: EtFabMenuActions,
  Button: EtFabMenuButton,
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OVERLAY_BACKGROUND,
  },
  modalContent: {
    flex: 1,
  },
  fabAboveOverlay: {
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'box-none',
    bottom: 0,
    right: 0,
  },
  container: {},
  menu: {
    alignItems: 'flex-end',
    gap: X3,
  },
});
