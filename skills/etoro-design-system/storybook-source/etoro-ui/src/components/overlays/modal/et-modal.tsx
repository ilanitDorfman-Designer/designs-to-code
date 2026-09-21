import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  GestureResponderEvent,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  PanResponderGestureState,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { useReducedMotion } from '../../../core/hooks/accessibility/use-reduced-motion';
import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import type { EtModalProps } from './api';
import { ACCESSIBILITY_ANNOUNCEMENT_DELAY, ANIMATION_DURATION, SWIPE_THRESHOLD, VELOCITY_THRESHOLD } from './constants';
import { ModalProvider } from './context';
import { EtModalBackdrop, EtModalContent, EtModalFooter, EtModalHandle, EtModalHeader } from './subcomponents';
import { parseModalChildren } from './utils';

// ============================================================================
// Default Props
// ============================================================================

const DEFAULT_PROPS = {
  enableSwipeToClose: true,
  closeOnBackdrop: true,
  showHandle: true,
  loading: false,
  testID: 'et-modal',
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * EtModal - A compound component for modal overlays
 *
 * Uses React Native's native Modal with custom animations and gestures.
 * API matches EtBottomSheetV2 for easy migration.
 *
 * ## Usage
 *
 * ```tsx
 * const modalRef = useRef<EtModalRef>(null);
 *
 * <EtModal modalRef={modalRef} onClose={handleClose}>
 *   <EtModal.Content>
 *     <Text>Your content</Text>
 *   </EtModal.Content>
 *   <EtModal.Footer>
 *     <EtButton onPress={() => modalRef.current?.dismiss()}>
 *       <EtButton.Label>Close</EtButton.Label>
 *     </EtButton>
 *   </EtModal.Footer>
 * </EtModal>
 *
 * // Open modal
 * modalRef.current?.present();
 * ```
 */
function EtModalRoot(props: EtModalProps): React.JSX.Element {
  const {
    modalRef,
    children,
    visible: controlledVisible,
    onOpen,
    onClose,
    onBeforeClose,
    enableSwipeToClose = DEFAULT_PROPS.enableSwipeToClose,
    closeOnBackdrop = DEFAULT_PROPS.closeOnBackdrop,
    showHandle = DEFAULT_PROPS.showHandle,
    surface = 'tertiary',
    backdrop,
    style,
    backgroundStyle,
    loading = DEFAULT_PROPS.loading,
    accessibilityLabel,
    testID = DEFAULT_PROPS.testID,
  } = props;

  const { colors } = useEtoroTheme();
  const isReducedMotion = useReducedMotion();
  const { height: screenHeight } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(false);
  const [isPresented, setIsPresented] = useState(false);
  // Android: RN <Modal> renders in a separate window that does NOT inherit the
  // Activity's android:windowSoftInputMode="adjustResize", so the window never
  // resizes for the keyboard and KeyboardAvoidingView has nothing to react to —
  // the keyboard covers the sheet. Track the keyboard height from the global
  // Keyboard events (which do fire inside the modal) and lift the sheet manually.
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const isMountedRef = useRef(true);
  const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { headerChild, contentChild, footerChild, headerTitle } = parseModalChildren(children);
  const sheetName = accessibilityLabel || headerTitle || 'Modal';
  const animationDuration = isReducedMotion ? 0 : ANIMATION_DURATION;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, []);

  // Android-only: mirror the keyboard height so the sheet can sit above it.
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates?.height ?? 0));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const present = useCallback(() => {
    // Prevent multiple present calls while already visible
    if (isVisible) {
      return;
    }

    setIsVisible(true);

    const onPresentComplete = () => {
      if (isMountedRef.current) {
        setIsPresented(true);
        onOpen?.();
        announcementTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            AccessibilityInfo.announceForAccessibility(`${sheetName} opened`);
          }
        }, ACCESSIBILITY_ANNOUNCEMENT_DELAY);
      }
    };

    if (isReducedMotion) {
      translateY.setValue(0);
      onPresentComplete();
    } else {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start(onPresentComplete);
    }
  }, [translateY, onOpen, sheetName, isReducedMotion, isVisible]);

  // Track if dismiss animation is in progress
  const isDismissingRef = useRef(false);

  const dismiss = useCallback(() => {
    // Prevent multiple dismiss calls
    if (isDismissingRef.current || !isVisible) {
      return;
    }

    if (onBeforeClose) {
      const shouldClose = onBeforeClose();
      if (shouldClose === false) return;
    }

    isDismissingRef.current = true;
    setIsPresented(false);
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }

    // Capture whether this dismiss was triggered by prop change
    const wasTriggeredByProp = isDismissingFromPropRef.current;

    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: animationDuration,
      useNativeDriver: true,
    }).start(() => {
      if (isMountedRef.current) {
        setIsVisible(false);
        // Only call onClose if dismiss was NOT triggered by visible prop change
        // This prevents infinite loops when external state controls visibility
        if (!wasTriggeredByProp) {
          onClose?.();
        }
        // Reset all flags after animation completes
        isDismissingFromPropRef.current = false;
        hasBeenPresentedRef.current = false;
        isDismissingRef.current = false;
        AccessibilityInfo.announceForAccessibility(`${sheetName} closed`);
      }
    });
  }, [translateY, animationDuration, onBeforeClose, onClose, sheetName, isVisible, screenHeight]);

  // Track if modal has ever been presented to avoid calling dismiss on mount
  const hasBeenPresentedRef = useRef(false);
  // Track if dismiss was triggered by visible prop change (external) vs user action (internal)
  const isDismissingFromPropRef = useRef(false);

  useEffect(() => {
    if (controlledVisible !== undefined) {
      if (controlledVisible) {
        hasBeenPresentedRef.current = true;
        isDismissingFromPropRef.current = false;
        present();
      } else if (hasBeenPresentedRef.current) {
        // Only dismiss if modal was previously opened
        // Mark as external dismissal to prevent onClose callback loop
        isDismissingFromPropRef.current = true;
        dismiss();
      }
    }
  }, [controlledVisible, present, dismiss]);

  useImperativeHandle(
    modalRef,
    () => ({
      present,
      dismiss,
    }),
    [present, dismiss],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => enableSwipeToClose,
        onMoveShouldSetPanResponder: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          return enableSwipeToClose && gestureState.dy > 10;
        },
        onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > VELOCITY_THRESHOLD / 1000) {
            dismiss();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 4,
            }).start();
          }
        },
      }),
    [enableSwipeToClose, translateY, dismiss],
  );

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdrop) {
      dismiss();
    }
  }, [closeOnBackdrop, dismiss]);

  // Handle Android back button - only allow if some dismissal method is enabled
  const handleRequestClose = useCallback(() => {
    if (closeOnBackdrop || enableSwipeToClose) {
      dismiss();
    }
  }, [closeOnBackdrop, enableSwipeToClose, dismiss]);

  const sheetBackgroundColor = useMemo(() => {
    switch (surface) {
      case 'primary':
        return colors.bgNeutralPrimary;
      case 'secondary':
        return colors.bgNeutralSecondary;
      case 'tertiary':
      default:
        return colors.bgNeutralTertiary;
    }
  }, [colors.bgNeutralPrimary, colors.bgNeutralSecondary, colors.bgNeutralTertiary, surface]);

  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={handleRequestClose} testID={testID}>
      <View style={styles.container}>
        <EtModalBackdrop
          config={backdrop}
          closeOnBackdrop={closeOnBackdrop}
          onPress={handleBackdropPress}
          accessibilityLabel={backdrop?.accessibilityLabel}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.keyboardAvoid, Platform.OS === 'android' && keyboardHeight > 0 ? { paddingBottom: keyboardHeight } : null]}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheet,
              style,
              {
                transform: [{ translateY }],
              },
            ]}
            {...(enableSwipeToClose ? panResponder.panHandlers : {})}
            accessibilityViewIsModal
            accessibilityLabel={accessibilityLabel}
          >
            <ModalProvider
              showHandle={showHandle}
              closeOnBackdrop={closeOnBackdrop}
              enableSwipeToClose={enableSwipeToClose}
              isLoading={loading}
              isPresented={isPresented}
              dismiss={dismiss}
              backgroundColor={sheetBackgroundColor}
            >
              <EtModalHandle showHandle={showHandle} />
              <View style={[styles.sheetContent, { backgroundColor: sheetBackgroundColor }, backgroundStyle]}>
                {headerChild}
                {contentChild}
                {footerChild}
              </View>
            </ModalProvider>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

EtModalRoot.displayName = 'EtModal';

/**
 * EtModal with compound components attached
 */
export const EtModal = Object.assign(EtModalRoot, {
  Header: EtModalHeader,
  Content: EtModalContent,
  Footer: EtModalFooter,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
  },
  sheetContent: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
