import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { EtText } from '../../foundations/text';
import { EtReadMoreTextProps } from './api/types';
import { useReadMoreTextConfig } from './hooks/use-read-more-text-config';
import { useReadMoreTextContent } from './hooks/use-read-more-text-content';
import { useReadMoreTextState } from './hooks/use-read-more-text-state';

// ============================================================================
// Animated helpers
// ============================================================================

const BOUNCE_SPRING = { damping: 12, stiffness: 220, mass: 0.5 };

const LAYOUT_TRANSITION = LinearTransition.springify().damping(BOUNCE_SPRING.damping).stiffness(BOUNCE_SPRING.stiffness).mass(BOUNCE_SPRING.mass);

// ============================================================================
// Component
// ============================================================================

/**
 * EtReadMoreText — inline "Show More / Show Less" text truncation component.
 *
 * Supports two content modes:
 * 1. **String mode** — pass `text` only. URLs are auto-detected via `onLinkPress`.
 * 2. **Children mode** — pass `children` (ReactNode) with pre-built interactive
 *    elements (e.g., `<EtText onPress>`). Rich content is shown in both
 *    collapsed and expanded states.
 *
 * @example
 * ```tsx
 * // String mode with URL auto-detection
 * <EtReadMoreText maxLines={3} text={longText} onLinkPress={handleLink} />
 *
 * // Children mode with pre-built rich content
 * <EtReadMoreText text={plainText} maxLines={3}>
 *   Buy <EtText onPress={handleTag} style={linkStyle}>$AAPL</EtText>!{' '}
 *   Follow <EtText onPress={handleMention} style={linkStyle}>@meiramar</EtText>
 * </EtReadMoreText>
 *
 * // With custom action component
 * <EtReadMoreText
 *   maxLines={3}
 *   text={longText}
 *   customActionComponent={(isExpanded) => <EtIconV2 name="chevron-down" />}
 * />
 * ```
 */
function EtReadMoreTextBase({
  text,
  children,
  maxLines,
  showMoreText: showMoreTextProp,
  showLessText: showLessTextProp,
  textVariant,
  actionTextVariant,
  customActionComponent,
  initialExpanded,
  onExpandedChange,
  onTruncationChange,
  onLinkPress,
  style,
  testID,
  accessibilityLabel,
}: EtReadMoreTextProps) {
  const safeText = text ?? '';

  const config = useReadMoreTextConfig({
    textVariant,
    actionTextVariant,
    maxLines,
    showMoreText: showMoreTextProp,
    showLessText: showLessTextProp,
  });

  const { isExpanded, toggleExpanded, needsTruncation, truncatedText, hasMeasured, onHiddenTextLayout } = useReadMoreTextState({
    text: safeText,
    maxLines: config.maxLines,
    showMoreText: config.showMoreText,
    initialExpanded,
    onExpandedChange,
    onTruncationChange,
  });

  const textColor = useMemo(() => ({ color: config.textColor }), [config.textColor]);

  const { visibleContent, measurementContent } = useReadMoreTextContent({
    safeText,
    children,
    hasMeasured,
    needsTruncation,
    isExpanded,
    toggleExpanded,
    truncatedText,
    config,
    customActionComponent,
    onLinkPress,
    testID,
  });

  return (
    <View style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      {/* Hidden text for measurement — unmount after measured. Placed outside Animated.View
          so the absolutely-positioned container gets proper layout from the regular View parent. */}
      {!hasMeasured && (
        <View style={styles.hiddenTextContainer} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <EtText variant={config.textVariant} style={textColor} onTextLayout={onHiddenTextLayout} testID={testID ? `${testID}-measure` : undefined}>
            {measurementContent}
          </EtText>
        </View>
      )}

      {/* Expand animates; collapse is instant so list scroll compensation can run (PE-1150). */}
      <Animated.View layout={needsTruncation && isExpanded ? LAYOUT_TRANSITION : undefined}>{visibleContent}</Animated.View>
    </View>
  );
}

EtReadMoreTextBase.displayName = 'EtReadMoreText';

const MemoizedEtReadMoreText = React.memo(EtReadMoreTextBase);
MemoizedEtReadMoreText.displayName = 'EtReadMoreText';

export const EtReadMoreText = MemoizedEtReadMoreText;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  hiddenTextContainer: { position: 'absolute', opacity: 0, left: 0, right: 0 },
});
