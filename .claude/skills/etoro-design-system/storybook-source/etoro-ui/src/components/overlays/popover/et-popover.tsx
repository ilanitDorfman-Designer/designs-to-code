import React, { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import type { PopoverContextValue, PopoverRootProps, PopoverTargetProps } from './api/types';
import { PopoverContext } from './context';
import { usePopoverTiming } from './hooks';
import { PopoverArrow, PopoverButton, PopoverCloseButton, PopoverContent, PopoverTarget, PopoverText, PopoverTitle } from './subcomponents';
import { getPopoverColors } from './utils';

/**
 * EtPopover.Root - Main wrapper component for the popover
 *
 * Provides context to all child components and handles:
 * - Theme-based colors
 * - Show/hide timing
 * - Restructures children so Content renders inside Target for proper positioning
 * - Arrow is shown by default (use `hideArrow` prop to hide it)
 *
 * @example Basic usage
 * ```tsx
 * <EtPopover.Root
 *   visible={isVisible}
 *   popoverDirection="above"
 *   onClose={() => setIsVisible(false)}
 * >
 *   <EtPopover.Target>
 *     <Button onPress={() => setIsVisible(true)}>Show Popover</Button>
 *   </EtPopover.Target>
 *   <EtPopover.Content>
 *     <EtPopover.Title>Hello!</EtPopover.Title>
 *     <EtPopover.Text>This is a popover</EtPopover.Text>
 *     <EtPopover.CloseButton />
 *   </EtPopover.Content>
 * </EtPopover.Root>
 * ```
 *
 * @example Hide the arrow
 * ```tsx
 * <EtPopover.Root hideArrow popoverDirection="above">
 *   ...
 * </EtPopover.Root>
 * ```
 */
function EtPopoverRoot({
  children,
  visible = true,
  popoverDirection = 'above',
  arrowAlignment = 'center',
  showDelay = 500,
  autoHideDelay = 3000,
  onClose,
  closeOnOutsidePress = true,
  hideArrow = false,
  anchorMode = 'modal',
  style,
  testID,
  accessibilityLabel,
}: PopoverRootProps) {
  const { colors } = useEtoroTheme();

  // Handle timing
  const { isVisible, hide } = usePopoverTiming({
    visible,
    showDelay,
    autoHideDelay,
    onClose,
  });

  // Calculate colors based on theme (inverted)
  const popoverColors = useMemo(() => getPopoverColors(colors), [colors]);

  // Create context value for subcomponents
  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      textColor: popoverColors.textColor,
      iconColor: popoverColors.iconColor,
      backgroundColor: popoverColors.backgroundColor,
      popoverDirection,
      arrowAlignment,
      isVisible,
      onClose: hide,
      closeOnOutsidePress,
      hideArrow,
      anchorMode,
    }),
    [popoverColors, popoverDirection, arrowAlignment, isVisible, hide, closeOnOutsidePress, hideArrow, anchorMode],
  );

  // Parse children to find Target and Content (memoized to avoid recomputation)
  const { targetChild, contentChild } = useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    const target = childrenArray.find(
      (child) => React.isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtPopover.Target',
    );

    const content = childrenArray.find(
      (child) => React.isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtPopover.Content',
    );

    // Development-only warnings for missing required children
    if (__DEV__) {
      if (!target) {
        console.warn(
          'EtPopover.Root: Missing EtPopover.Target child. ' +
            'Ensure you have <EtPopover.Target> as a direct child of <EtPopover.Root>. ' +
            'The component must have displayName="EtPopover.Target".',
        );
      }
      if (!content) {
        console.warn(
          'EtPopover.Root: Missing EtPopover.Content child. ' +
            'Ensure you have <EtPopover.Content> as a direct child of <EtPopover.Root>. ' +
            'The component must have displayName="EtPopover.Content".',
        );
      }
    }

    return {
      targetChild: target as React.ReactElement<PopoverTargetProps> | undefined,
      contentChild: content,
    };
  }, [children]);

  // Clone Target and inject Content inside it, along with Root's props (memoized)
  const renderedTarget = useMemo(() => {
    if (!targetChild) {
      return null;
    }

    return React.cloneElement(targetChild, {
      style: [targetChild.props.style, style] as ViewStyle[],
      testID,
      accessibilityLabel,
      children: (
        <>
          {targetChild.props.children}
          {contentChild}
        </>
      ),
    });
  }, [targetChild, contentChild, style, testID, accessibilityLabel]);

  return <PopoverContext.Provider value={contextValue}>{renderedTarget}</PopoverContext.Provider>;
}

EtPopoverRoot.displayName = 'EtPopover.Root';

/**
 * EtPopover compound component
 *
 * Arrow is shown by default. Use `hideArrow` prop to hide it.
 *
 * Usage:
 * ```tsx
 * <EtPopover.Root visible={visible} popoverDirection="above">
 *   <EtPopover.Target>
 *     <YourTargetElement />
 *   </EtPopover.Target>
 *   <EtPopover.Content>
 *     <EtPopover.Title>Title</EtPopover.Title>
 *     <EtPopover.Text>Description</EtPopover.Text>
 *     <EtPopover.Button onPress={handleAction}>Action</EtPopover.Button>
 *     <EtPopover.CloseButton />
 *   </EtPopover.Content>
 * </EtPopover.Root>
 * ```
 */
export const EtPopover = {
  Root: React.memo(EtPopoverRoot),
  Target: PopoverTarget,
  Content: PopoverContent,
  Title: PopoverTitle,
  Text: PopoverText,
  Button: PopoverButton,
  CloseButton: PopoverCloseButton,
  Arrow: PopoverArrow,
};
