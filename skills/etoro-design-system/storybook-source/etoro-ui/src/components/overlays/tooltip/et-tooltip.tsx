import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactNode } from 'react';
import React, { Children, isValidElement, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X6 } from '../../../core/styles/spacing';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { EtText } from '../../../foundations/text/et-text';
import { getChildrenByType } from '../../../utils/elements';
import { LEADING_TEXT_STYLE } from '../../../utils/rtl';
import { EtBottomSheet } from '../bottom-sheet-v2';
import type { EtTooltipProps } from './api/types';
import { TooltipBody, TooltipTitle } from './subcomponents';

const HEADER_ICON_SIZE = 24;

/**
 * EtTooltip - Informational tooltip as a bottom sheet
 *
 * A convenience wrapper around EtBottomSheetV2 that provides a standardized
 * pattern for displaying contextual information with a title, close button,
 * and body text. Replaces verbose EtBottomSheetV2 + EtTopbar boilerplate.
 *
 * Header layout matches Figma: left-aligned title (heading-large) with
 * close button at the trailing edge, using EtTopbar.Start / EtTopbar.End.
 *
 * Manages its own BottomSheetModal internally. Consumers control presentation
 * via the imperative ref handle (`present` / `dismiss`).
 *
 * Supports two APIs:
 * 1. Props-based (simplest): title prop + string children
 * 2. Compound children: EtTooltip.Title + EtTooltip.Body
 *
 * @example Props-based
 * ```tsx
 * const tooltipRef = useRef<EtTooltipRef>(null);
 * tooltipRef.current?.present();
 *
 * <EtTooltip ref={tooltipRef} title="Recently Traded">
 *   {t('recentlyTraded.disclaimer')}
 * </EtTooltip>
 * ```
 *
 * @example Compound children
 * ```tsx
 * <EtTooltip ref={tooltipRef}>
 *   <EtTooltip.Title>Recently Traded</EtTooltip.Title>
 *   <EtTooltip.Body>
 *     <EtText variant="body-base-regular">Custom rich content</EtText>
 *   </EtTooltip.Body>
 * </EtTooltip>
 * ```
 */
function EtTooltipInner({
  children,
  title,
  onClose,
  onClosePress,
  stackBehavior,
  testID = 'et-tooltip',
  accessibilityLabel,
  closeButtonAccessibilityLabel = 'Close',
  closeButtonIcon = 'close',
  ref,
}: EtTooltipProps) {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { colors } = useEtoroTheme();

  useImperativeHandle(
    ref,
    () => ({
      present: () => bottomSheetRef.current?.present(),
      dismiss: () => bottomSheetRef.current?.dismiss(),
    }),
    [],
  );

  const childArray = Children.toArray(children);
  const titleMatches = getChildrenByType(childArray, TooltipTitle);
  const extractedTitle = isValidElement<{ children: string }>(titleMatches[0]) ? titleMatches[0].props.children : undefined;
  const bodyParts = childArray.filter((child) => !titleMatches.includes(child));

  const resolvedTitle = (title ?? extractedTitle) || undefined;

  let renderedBody: ReactNode = null;
  if (bodyParts.length === 1 && typeof bodyParts[0] === 'string') {
    renderedBody = (
      <EtText variant="body-base-regular" style={[styles.alignedText, { color: colors.textSecondaryNeutral }]}>
        {bodyParts[0]}
      </EtText>
    );
  } else if (bodyParts.length > 0) {
    renderedBody = bodyParts;
  }

  const warnedRef = useRef(false);
  useEffect(() => {
    if (__DEV__ && !resolvedTitle && !warnedRef.current) {
      warnedRef.current = true;
      console.warn('EtTooltip: Missing title. Provide a title prop or use <EtTooltip.Title>.');
    }
  }, [resolvedTitle]);

  const handleClose = () => {
    onClosePress?.();
    bottomSheetRef.current?.dismiss();
  };

  const contentElement = <EtBottomSheet.Content key="content">{renderedBody}</EtBottomSheet.Content>;

  const dismissIconName = closeButtonIcon === 'back' ? 'chevronLeft' : 'close';
  const dismissIcon = <EtoroIcon icon={{ iconName: dismissIconName }} appearance={{ size: HEADER_ICON_SIZE, color: colors.textPrimaryNeutral }} />;

  const headerElement =
    closeButtonIcon === 'back' ? (
      <EtBottomSheet.Header key="header" style={styles.header}>
        <View style={styles.backHeaderRow}>
          <EtBottomSheet.Header.Action
            onPress={handleClose}
            accessibilityLabel={closeButtonAccessibilityLabel}
            testID={testID ? `${testID}-close-button` : undefined}
            style={styles.backHeaderAction}
          >
            {dismissIcon}
          </EtBottomSheet.Header.Action>
          {resolvedTitle != null ? (
            <EtText variant="heading-large" style={[styles.backHeaderTitle, styles.alignedText]} numberOfLines={1}>
              {resolvedTitle}
            </EtText>
          ) : null}
        </View>
      </EtBottomSheet.Header>
    ) : (
      <EtBottomSheet.Header key="header" style={styles.header}>
        {resolvedTitle != null && (
          <EtText variant="heading-large" style={styles.alignedText}>
            {resolvedTitle}
          </EtText>
        )}
        <EtBottomSheet.Header.Action
          onPress={handleClose}
          accessibilityLabel={closeButtonAccessibilityLabel}
          testID={testID ? `${testID}-close-button` : undefined}
        >
          {dismissIcon}
        </EtBottomSheet.Header.Action>
      </EtBottomSheet.Header>
    );

  const sheetChildren = [headerElement, contentElement];

  const effectiveAccessibilityLabel = accessibilityLabel ?? resolvedTitle;

  return (
    <EtBottomSheet
      bottomSheetRef={bottomSheetRef}
      testID={testID}
      accessibilityLabel={effectiveAccessibilityLabel}
      onClose={onClose}
      stackBehavior={stackBehavior}
    >
      {sheetChildren}
    </EtBottomSheet>
  );
}

EtTooltipInner.displayName = 'EtTooltip';

/**
 * EtTooltip compound component for informational tooltip bottom sheets.
 *
 * @example
 * ```tsx
 * const tooltipRef = useRef<EtTooltipRef>(null);
 *
 * <EtTooltip ref={tooltipRef} title="Info">
 *   Informational text here
 * </EtTooltip>
 * ```
 */
export const EtTooltip = Object.assign(React.memo(EtTooltipInner), {
  Title: TooltipTitle,
  Body: TooltipBody,
});

const styles = StyleSheet.create({
  backHeaderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },
  backHeaderAction: {
    marginStart: -8,
  },
  backHeaderTitle: {
    flex: 1,
    minWidth: 0,
  },
  alignedText: LEADING_TEXT_STYLE,
  header: {
    paddingHorizontal: X6,
  },
});
