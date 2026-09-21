import { etInject } from '@etoro/common/di/core';
import { LOCALIZATION_LANGUAGE_MANAGER_TOKEN } from '@etoro/common/infra/translations';
import React, { FC, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, type LayoutChangeEvent, Modal, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { X1, X4, X5 } from '../../../../core/styles';
import type { PopoverArrowAlignment, PopoverContentProps, PopoverDirection } from '../api/types';
import { usePopoverContext } from '../context';
import { getArrowPositionFromDirection, getContainerDirection, popoverBodyStyles } from '../utils';
import { PopoverArrow } from './popover-arrow';
import { PopoverButton } from './popover-button';
import { PopoverCloseButton } from './popover-close-button';
import { PopoverText } from './popover-text';
import { PopoverTitle } from './popover-title';

interface TargetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculate horizontal position based on alignment (RTL-aware)
 * - "start" = logical start (left in LTR, right in RTL)
 * - "end" = logical end (right in LTR, left in RTL)
 */
function calculateHorizontalPosition(target: TargetLayout, popoverWidth: number, alignment: PopoverArrowAlignment, isRTL: boolean): number {
  switch (alignment) {
    case 'start':
      if (isRTL) {
        // RTL: start = right side, align popover's right edge with target's right edge
        return target.x + target.width - popoverWidth;
      }
      // LTR: start = left side, align popover's left edge with target's left edge
      return target.x;
    case 'center':
      // Center popover over target (same in both directions)
      return target.x + (target.width - popoverWidth) / 2;
    case 'end':
      if (isRTL) {
        // RTL: end = left side, align popover's left edge with target's left edge
        return target.x;
      }
      // LTR: end = right side, align popover's right edge with target's right edge
      return target.x + target.width - popoverWidth;
  }
}

/**
 * Calculate vertical position based on alignment, for horizontal popovers
 * (`left` / `right`). Vertical alignment has no RTL semantics — top/bottom
 * do not swap with text direction.
 * - "start" = top of target
 * - "center" = vertical center of target
 * - "end" = bottom of target
 */
function calculateVerticalPosition(target: TargetLayout, popoverHeight: number, alignment: PopoverArrowAlignment): number {
  switch (alignment) {
    case 'start':
      return target.y;
    case 'center':
      return target.y + (target.height - popoverHeight) / 2;
    case 'end':
      return target.y + target.height - popoverHeight;
  }
}

/**
 * Calculate popover position based on target layout and direction.
 *
 * All four branches use `top` / `left` (with screen-edge clamping) so the
 * bubble cannot render partially off-screen even when the target sits near
 * an edge. The opacity gate in `PopoverContent` (`isPositioned`) keeps the
 * bubble at `opacity: 0` until BOTH `targetLayout` and the bubble's own
 * `onLayout` size have arrived, so the first visible frame is already at
 * the final, correctly-clamped position — no flash, no jump.
 *
 *  - `above`  → top edge `gap` above the target, clamped to stay on-screen
 *               so a near-top target does not push the bubble out of view.
 *  - `below`  → top edge `gap` below the target.
 *  - `left`   → right edge `gap` left of the target.
 *  - `right`  → left edge `gap` right of the target.
 *
 * The cross-axis position honours `arrowAlignment` (`start` / `center` /
 * `end`) for all four directions:
 *  - above / below — horizontal alignment via {@link calculateHorizontalPosition}
 *    (RTL-aware: start = logical start of text direction).
 *  - left / right — vertical alignment via {@link calculateVerticalPosition}
 *    (RTL-agnostic: start = top, end = bottom).
 */
function calculatePosition(
  target: TargetLayout,
  popoverSize: { width: number; height: number },
  direction: PopoverDirection,
  alignment: PopoverArrowAlignment,
  isRTL: boolean,
): ViewStyle {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const gap = X1;
  const padding = X5; // Minimum padding from screen edges

  // Clamp a horizontal `left` so the popover stays within screen bounds.
  const clampLeft = (left: number) => Math.max(padding, Math.min(left, screenWidth - popoverSize.width - padding));
  // Clamp a vertical `top` so the popover stays within screen bounds.
  const clampTop = (top: number) => Math.max(padding, Math.min(top, screenHeight - popoverSize.height - padding));

  switch (direction) {
    case 'above':
      return {
        top: clampTop(target.y - popoverSize.height - gap),
        left: clampLeft(calculateHorizontalPosition(target, popoverSize.width, alignment, isRTL)),
      };
    case 'below':
      return {
        top: clampTop(target.y + target.height + gap),
        left: clampLeft(calculateHorizontalPosition(target, popoverSize.width, alignment, isRTL)),
      };
    case 'left':
      return {
        top: clampTop(calculateVerticalPosition(target, popoverSize.height, alignment)),
        left: clampLeft(target.x - popoverSize.width - gap),
      };
    case 'right':
      return {
        top: clampTop(calculateVerticalPosition(target, popoverSize.height, alignment)),
        left: clampLeft(target.x + target.width + gap),
      };
  }
}

/**
 * Cross-axis `alignItems` for inline placement (horizontal directions).
 * Mirrors {@link calculateHorizontalPosition}: the container spans the target
 * (`left: 0; right: 0`) and `direction: 'ltr'` is forced on it so `flex-start`
 * / `flex-end` map to physical left / right deterministically (not flipped by
 * `I18nManager`), letting us replicate the RTL logic explicitly.
 */
function getInlineCrossAlign(alignment: PopoverArrowAlignment, isRTL: boolean): ViewStyle['alignItems'] {
  switch (alignment) {
    case 'center':
      return 'center';
    case 'start':
      return isRTL ? 'flex-end' : 'flex-start';
    case 'end':
      return isRTL ? 'flex-start' : 'flex-end';
  }
}

/**
 * Main-axis `justifyContent` for inline placement (vertical alignment on
 * the `left` / `right` horizontal popovers). Vertical alignment has no RTL
 * semantics — top/bottom do not swap with text direction.
 */
function getInlineMainAlign(alignment: PopoverArrowAlignment): ViewStyle['justifyContent'] {
  switch (alignment) {
    case 'start':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'end':
      return 'flex-end';
  }
}

/**
 * Position styles for the INLINE anchor mode (no `Modal`, no measurement).
 *
 * The bubble is an absolutely-positioned child of the relatively-positioned
 * `EtPopover.Target`, so anchoring is pure relative layout that shares the
 * target's coordinate space exactly — immune to the window-vs-modal
 * coordinate drift that breaks the modal path inside nested native modals.
 *
 *  - `above` → bubble bottom pinned to target top (`bottom: '100%'`), lifted
 *    `gap` further with `marginBottom`.
 *  - `below` → bubble top pinned to target bottom (`top: '100%'`).
 *  - `left`/`right` → bubble side pinned to the matching target side; the
 *    bubble's vertical placement within the target's height honours
 *    `arrowAlignment` via {@link getInlineMainAlign}.
 */
function getInlinePositionStyle(direction: PopoverDirection, alignment: PopoverArrowAlignment, isRTL: boolean): ViewStyle {
  const gap = X1;
  const base: ViewStyle = { position: 'absolute' };

  switch (direction) {
    case 'above':
      return { ...base, bottom: '100%', left: 0, right: 0, marginBottom: gap, alignItems: getInlineCrossAlign(alignment, isRTL) };
    case 'below':
      return { ...base, top: '100%', left: 0, right: 0, marginTop: gap, alignItems: getInlineCrossAlign(alignment, isRTL) };
    case 'left':
      return { ...base, right: '100%', top: 0, bottom: 0, marginRight: gap, justifyContent: getInlineMainAlign(alignment), alignItems: 'flex-end' };
    case 'right':
      return { ...base, left: '100%', top: 0, bottom: 0, marginLeft: gap, justifyContent: getInlineMainAlign(alignment), alignItems: 'flex-start' };
  }
}

/**
 * Normalizes props-based API into compound children elements
 */
function useNormalizedChildren(props: PopoverContentProps): React.ReactNode[] {
  const { children, title, text, button, onButtonPress, closeButton, arrow } = props;

  return useMemo(() => {
    const normalizedChildren: React.ReactNode[] = [];

    // If children are provided, use them as-is (compound children API)
    if (children !== undefined) {
      // Handle string children as text
      if (typeof children === 'string') {
        normalizedChildren.push(<PopoverText key="text">{children}</PopoverText>);
      } else if (Array.isArray(children)) {
        // Handle mixed arrays: wrap strings in PopoverText, pass elements as-is
        const allStrings = children.every((child) => typeof child === 'string');
        if (allStrings) {
          normalizedChildren.push(<PopoverText key="text">{(children as string[]).join(' ')}</PopoverText>);
        } else {
          // Map over children: wrap strings in PopoverText, keep elements as-is
          const mappedChildren = children.map((child, index) => {
            if (typeof child === 'string') {
              return <PopoverText key={`text-${index}`}>{child}</PopoverText>;
            }
            return child;
          });
          normalizedChildren.push(...mappedChildren);
        }
      } else {
        normalizedChildren.push(children);
      }
      return normalizedChildren;
    }

    // Props-based API: normalize props into children

    // Title
    if (title !== undefined) {
      if (typeof title === 'string') {
        normalizedChildren.push(<PopoverTitle key="title">{title}</PopoverTitle>);
      } else {
        const { text: titleText, ...titleProps } = title;
        normalizedChildren.push(
          <PopoverTitle key="title" {...titleProps}>
            {titleText}
          </PopoverTitle>,
        );
      }
    }

    // Text
    if (text !== undefined) {
      if (typeof text === 'string') {
        normalizedChildren.push(<PopoverText key="text">{text}</PopoverText>);
      } else {
        const { text: textContent, ...textProps } = text;
        normalizedChildren.push(
          <PopoverText key="text" {...textProps}>
            {textContent}
          </PopoverText>,
        );
      }
    }

    // Button
    if (button !== undefined) {
      if (typeof button === 'string') {
        if (onButtonPress) {
          normalizedChildren.push(
            <PopoverButton key="button" onPress={onButtonPress}>
              {button}
            </PopoverButton>,
          );
        } else if (__DEV__) {
          // Runtime check: skip rendering button and warn in development
          console.warn(
            'EtPopover.Content: button prop is a string but onButtonPress is not provided. ' +
              'Button will not be rendered. Either provide onButtonPress or use a config object ' +
              'with { label: string, onPress: () => void }.',
          );
        }
      } else {
        const { label, ...buttonProps } = button;
        normalizedChildren.push(
          <PopoverButton key="button" {...buttonProps}>
            {label}
          </PopoverButton>,
        );
      }
    }

    // Close button
    if (closeButton !== undefined && closeButton !== false) {
      if (closeButton === true) {
        normalizedChildren.push(<PopoverCloseButton key="closeButton" />);
      } else {
        normalizedChildren.push(<PopoverCloseButton key="closeButton" {...closeButton} />);
      }
    }

    // Arrow
    if (arrow !== undefined && arrow !== false) {
      if (arrow === true) {
        normalizedChildren.push(<PopoverArrow key="arrow" />);
      } else {
        normalizedChildren.push(<PopoverArrow key="arrow" {...arrow} />);
      }
    }

    return normalizedChildren;
  }, [children, title, text, button, onButtonPress, closeButton, arrow]);
}

/**
 * EtPopover.Content - Contains and renders the popover content
 * Uses Modal for proper positioning outside layout flow
 * Supports both compound children API and props-based API
 */
export const PopoverContent: FC<PopoverContentProps> = React.memo(function PopoverContent(props: PopoverContentProps) {
  const { style } = props;
  const normalizedChildren = useNormalizedChildren(props);
  const { isVisible, backgroundColor, popoverDirection, arrowAlignment, onClose, closeOnOutsidePress, hideArrow, anchorMode } = usePopoverContext();
  const isInline = anchorMode === 'inline';

  const [targetLayout, setTargetLayout] = useState<TargetLayout | null>(null);
  const [popoverSize, setPopoverSize] = useState({ width: 250, height: 100 });
  // Tracks whether the bubble has reported its real size via `onLayout`.
  // Until it has, `popoverSize` is only a default guess and any position we
  // compute would be wrong (the bubble would flash overlapping the target,
  // then jump to the correct spot once the real size arrives). We keep the
  // bubble invisible until BOTH the target position and the bubble size are
  // known, so consumers only ever see the final, correctly-placed frame.
  const [hasMeasuredSize, setHasMeasuredSize] = useState(false);
  const measureRef = useRef<View>(null);

  // Measure the target element (parent of this Content). Only the modal
  // anchor mode needs absolute window coordinates; inline mode positions the
  // bubble with pure relative layout and never measures.
  useLayoutEffect(() => {
    if (isInline) {
      return;
    }

    let cancelled = false;

    if (isVisible && measureRef.current) {
      measureRef.current.measureInWindow((x, y, width, height) => {
        // Guard against state updates on unmounted component
        if (!cancelled && width > 0 && height > 0) {
          setTargetLayout({ x, y, width, height });
        }
      });
    } else if (!isVisible) {
      // Reset on hide so a subsequent show re-measures from scratch instead
      // of positioning against a stale target/size.
      setTargetLayout(null);
      setHasMeasuredSize(false);
    }

    return () => {
      cancelled = true;
    };
  }, [isVisible, isInline]);

  const handlePopoverLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    // Only update when the measured size actually changes. An absolutely
    // positioned view re-fires `onLayout` whenever its top/left changes, so
    // bailing on unchanged dimensions avoids a needless render loop.
    setPopoverSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    setHasMeasuredSize(true);
  }, []);

  const handleContentPress = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  }, []);

  // Memoize child lookup to avoid re-iterating on every render
  // This must be called before the early return to respect React's Rules of Hooks
  const { arrowChild, closeButtonChild, titleChild, textChild, buttonChild } = useMemo(() => {
    const childrenArray = React.Children.toArray(normalizedChildren);

    const getChildByDisplayName = (displayName: string) =>
      childrenArray.find((child) => React.isValidElement(child) && (child.type as { displayName?: string }).displayName === displayName);

    return {
      arrowChild: getChildByDisplayName('EtPopover.Arrow'),
      closeButtonChild: getChildByDisplayName('EtPopover.CloseButton'),
      titleChild: getChildByDisplayName('EtPopover.Title'),
      textChild: getChildByDisplayName('EtPopover.Text'),
      buttonChild: getChildByDisplayName('EtPopover.Button'),
    };
  }, [normalizedChildren]);

  // Don't render if not visible. The modal path keeps a hidden placeholder
  // mounted so `measureInWindow` has a node to read; inline mode never
  // measures, so nothing needs to stay mounted.
  if (!isVisible) {
    return isInline ? null : <View ref={measureRef} style={styles.measurePlaceholder} />;
  }

  // Resolve text direction once per render (single DI lookup) instead of
  // re-reading it inside the per-axis position helpers / the inline branch.
  const isRTL = etInject(LOCALIZATION_LANGUAGE_MANAGER_TOKEN).getCurrentDirection() === 'rtl';

  const arrowPosition = getArrowPositionFromDirection(popoverDirection);
  const containerDirection = getContainerDirection(arrowPosition);
  const isHorizontalPopover = popoverDirection === 'left' || popoverDirection === 'right';

  const hasTitle = !!titleChild;
  const hasCloseButton = !!closeButtonChild;

  // The bubble's visual content (body + arrow) — identical for both anchor
  // modes; only the wrapper that positions it differs.
  const bubbleInner = (
    /* direction:ltr only for horizontal popovers to prevent RTL auto-flip */
    <View style={[styles.innerWrapper, isHorizontalPopover && styles.ltrDirection, { flexDirection: containerDirection }]}>
      {/* Popover body */}
      <View style={[styles.body, popoverBodyStyles, { backgroundColor }]}>
        <View style={styles.content}>
          {/* Title row with close button */}
          {(hasTitle || hasCloseButton) && (
            <View style={styles.titleRow}>
              {titleChild}
              {!hasTitle && textChild}
              {!hasTitle && hasCloseButton && <View style={styles.spacer} />}
              {closeButtonChild}
            </View>
          )}

          {/* Text (shown below title if title exists) */}
          {hasTitle && textChild && <View style={styles.textContainer}>{textChild}</View>}

          {/* Text only (no title, no close button) */}
          {!hasTitle && !hasCloseButton && textChild}

          {/* Button */}
          {buttonChild && <View style={styles.buttonContainer}>{buttonChild}</View>}
        </View>
      </View>

      {/* Arrow - shown by default unless hideArrow is true */}
      {!hideArrow && (arrowChild ?? <PopoverArrow />)}
    </View>
  );

  // INLINE anchor mode: absolutely-positioned child of the target wrapper.
  // No Modal, no measurement, no opacity gate — the placement is correct on
  // the first frame because it is pure relative layout. `box-none` lets
  // touches outside the bubble reach the target/screen underneath (the bubble
  // sits beside the target, never over it, so it never blocks the CTA).
  if (isInline) {
    return (
      <View
        style={[getInlinePositionStyle(popoverDirection, arrowAlignment, isRTL), styles.inlineLtr, style]}
        pointerEvents="box-none"
        accessibilityRole="alert"
        accessibilityLabel="Popover content"
      >
        <Pressable onPress={handleContentPress} accessible={false}>
          {bubbleInner}
        </Pressable>
      </View>
    );
  }

  // MODAL anchor mode (default): render in a full-screen Modal positioned from
  // absolute window coordinates. Keep the bubble invisible until the target
  // position AND the bubble's own size are both known — otherwise the first
  // frame is positioned with the default size guess and visibly overlaps/jumps
  // before settling.
  const isPositioned = targetLayout !== null && hasMeasuredSize;
  const positionStyles = targetLayout
    ? { ...calculatePosition(targetLayout, popoverSize, popoverDirection, arrowAlignment, isRTL), opacity: isPositioned ? 1 : 0 }
    : { top: 0, left: 0, opacity: 0 };

  return (
    <>
      {/* Hidden view to measure target position */}
      <View ref={measureRef} style={styles.measurePlaceholder} />

      {/* Modal renders outside normal layout */}
      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
        {/* Overlay to catch outside presses */}
        <Pressable style={styles.modalOverlay} onPress={closeOnOutsidePress ? onClose : undefined}>
          <View
            style={[styles.container, positionStyles, style]}
            onLayout={handlePopoverLayout}
            accessibilityRole="alert"
            accessibilityLabel="Popover content"
            accessibilityViewIsModal
          >
            <Pressable onPress={handleContentPress} accessible={false}>
              {bubbleInner}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
});

PopoverContent.displayName = 'EtPopover.Content';

const styles = StyleSheet.create({
  measurePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
  modalOverlay: {
    flex: 1,
  },
  container: {
    position: 'absolute',
  },
  // Force LTR on the inline wrapper so `getInlineCrossAlign`'s explicit
  // `flex-start`/`flex-end` map to physical left/right (not auto-flipped by
  // `I18nManager`); the RTL logic is handled in `getInlineCrossAlign` itself.
  inlineLtr: {
    direction: 'ltr',
  },
  innerWrapper: {
    // Groups body + arrow so arrow aligns relative to body width
  },
  ltrDirection: {
    // Prevents RTL auto-flip of flex layout for arrow positioning
    direction: 'ltr',
  },
  body: {
    padding: X5,
    minWidth: 250,
    maxWidth: 350,
    flexShrink: 0,
  },
  content: {
    gap: X1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: X4,
  },
  spacer: {
    flex: 1,
  },
  textContainer: {
    marginEnd: X4,
  },
  buttonContainer: {
    marginTop: X4 - X1,
  },
});
