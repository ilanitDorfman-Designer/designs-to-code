import { ReactNode, useCallback, useMemo } from 'react';

import { EtText } from '../../../foundations/text';
import { ELLIPSIS_SUFFIX } from '../constants';
import { parseTextLinks } from '../utils/parse-text-entities';
import { truncateChildren } from '../utils/truncate-children';
import { ReadMoreTextConfig } from './use-read-more-text-config';

interface UseReadMoreTextContentParams {
  safeText: string;
  children: ReactNode;
  hasMeasured: boolean;
  needsTruncation: boolean;
  isExpanded: boolean;
  toggleExpanded: () => void;
  truncatedText: string | null;
  config: ReadMoreTextConfig;
  customActionComponent?: (isExpanded: boolean) => ReactNode;
  onLinkPress?: (url: string) => void;
  testID?: string;
}

interface UseReadMoreTextContentResult {
  visibleContent: ReactNode;
  measurementContent: ReactNode;
}

/**
 * Assembles the visible and measurement content for EtReadMoreText.
 *
 * Extracts all rendering logic (memoized styles, parsed segments,
 * truncated children, conditional branches) so the component itself
 * remains a thin presentational shell.
 */
export function useReadMoreTextContent({
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
}: UseReadMoreTextContentParams): UseReadMoreTextContentResult {
  const hasChildren = children != null;

  // ── Guard: 0 when no measurement yet, ≥1 once truncatedText exists ──
  const truncatedCharCount = truncatedText ? Math.max(1, truncatedText.length) : 0;

  // ── Memoized style objects (avoid inline allocations) ───────────────
  const textColor = useMemo(() => ({ color: config.textColor }), [config.textColor]);

  const actionTextColor = useMemo(() => ({ color: config.actionTextColor }), [config.actionTextColor]);

  const entityTextColor = useMemo(() => ({ color: config.entityTextColor }), [config.entityTextColor]);

  // ── Memoized parseTextLinks results ─────────────────────────────────
  const parsedFullSegments = useMemo(() => (onLinkPress ? parseTextLinks(safeText) : null), [onLinkPress, safeText]);

  const parsedTruncatedSegments = useMemo(() => (onLinkPress && truncatedText ? parseTextLinks(truncatedText) : null), [onLinkPress, truncatedText]);

  // ── Memoized truncateChildren result ────────────────────────────────
  const truncatedChildrenContent = useMemo(
    () => (hasChildren && truncatedCharCount > 0 ? truncateChildren(children, truncatedCharCount) : null),
    [hasChildren, children, truncatedCharCount],
  );

  // ── Segment renderer (string mode) ─────────────────────────────────
  const renderSegments = useCallback(
    (content: string, segments: ReturnType<typeof parseTextLinks> | null) => {
      if (!segments) return content;

      // Fast path: no links detected
      if (segments.length === 1 && segments[0].type === 'text') {
        return content;
      }

      return segments.map((segment, index) => {
        if (segment.type === 'text') return segment.content;

        return (
          <EtText
            key={`link-${index}`}
            variant={config.textVariant}
            style={entityTextColor}
            onPress={() => onLinkPress?.(segment.value)}
            accessibilityRole="link"
            accessibilityHint="Opens external link"
          >
            {segment.content}
          </EtText>
        );
      });
    },
    [config.textVariant, entityTextColor, onLinkPress],
  );

  // ── Action text renderer ────────────────────────────────────────────
  const renderActionText = useCallback(
    (actionText: string) => (
      <EtText
        variant={config.actionTextVariant}
        style={actionTextColor}
        onPress={toggleExpanded}
        accessibilityRole="button"
        testID={testID ? `${testID}-toggle` : undefined}
      >
        {actionText}
      </EtText>
    ),
    [config.actionTextVariant, actionTextColor, toggleExpanded, testID],
  );

  // ── Measurement content ─────────────────────────────────────────────
  // Always measure against the plain-text value (safeText / the text prop)
  // regardless of hasChildren, so truncation is deterministic and driven
  // by the text prop rather than children.
  const measurementContent = useMemo(() => safeText, [safeText]);

  // ── Visible content ─────────────────────────────────────────────────
  const contentTestID = testID ? `${testID}-text` : undefined;

  const visibleContent = useMemo(() => {
    if (!hasMeasured) {
      // Optimistic render before (re-)measurement completes.
      // When the user has expanded the text (preserved across in-place text
      // changes such as a translation toggle), keep the same visual as the
      // measured/expanded branch — full text plus the "Show Less" action —
      // so neither the body height nor the action button flicker during the
      // brief re-measurement window. If the new text turns out not to need
      // truncation, the action will disappear after measurement settles.
      if (isExpanded) {
        const fullContent = hasChildren ? children : renderSegments(safeText, parsedFullSegments);

        if (customActionComponent) {
          return (
            <EtText variant={config.textVariant} style={textColor} testID={contentTestID}>
              {fullContent}{' '}
              <EtText onPress={toggleExpanded} accessibilityRole="button" testID={testID ? `${testID}-toggle` : undefined}>
                {customActionComponent(true)}
              </EtText>
            </EtText>
          );
        }

        return (
          <EtText variant={config.textVariant} style={textColor} testID={contentTestID}>
            {fullContent} {renderActionText(config.showLessText)}
          </EtText>
        );
      }

      return (
        <EtText variant={config.textVariant} style={textColor} numberOfLines={config.maxLines} testID={contentTestID}>
          {hasChildren ? children : renderSegments(safeText, parsedFullSegments)}
        </EtText>
      );
    }

    if (!needsTruncation) {
      return (
        <EtText variant={config.textVariant} style={textColor} testID={contentTestID}>
          {hasChildren ? children : renderSegments(safeText, parsedFullSegments)}
        </EtText>
      );
    }

    // Custom action component
    if (customActionComponent) {
      const displayContent = hasChildren
        ? isExpanded
          ? children
          : truncatedChildrenContent
        : renderSegments(isExpanded ? safeText : (truncatedText ?? ''), isExpanded ? parsedFullSegments : parsedTruncatedSegments);

      return (
        <EtText
          variant={config.textVariant}
          style={textColor}
          onPress={isExpanded ? undefined : toggleExpanded}
          accessibilityRole={isExpanded ? undefined : 'button'}
          accessibilityHint={isExpanded ? undefined : 'Double tap to expand'}
          testID={contentTestID}
        >
          {displayContent}
          {!isExpanded && ELLIPSIS_SUFFIX}{' '}
          <EtText onPress={toggleExpanded} accessibilityRole="button" testID={testID ? `${testID}-toggle` : undefined}>
            {customActionComponent(isExpanded)}
          </EtText>
        </EtText>
      );
    }

    // Default text action
    const actionText = isExpanded ? config.showLessText : config.showMoreText;

    if (isExpanded) {
      return (
        <EtText variant={config.textVariant} style={textColor} testID={contentTestID}>
          {hasChildren ? children : renderSegments(safeText, parsedFullSegments)} {renderActionText(actionText)}
        </EtText>
      );
    }

    // Collapsed — entire text area is tappable to expand
    return (
      <EtText
        variant={config.textVariant}
        style={textColor}
        onPress={toggleExpanded}
        accessibilityRole="button"
        accessibilityHint="Double tap to expand"
        testID={contentTestID}
      >
        {hasChildren ? truncatedChildrenContent : renderSegments(truncatedText ?? '', parsedTruncatedSegments)}
        {ELLIPSIS_SUFFIX}
        {renderActionText(actionText)}
      </EtText>
    );
  }, [
    hasMeasured,
    needsTruncation,
    config.textVariant,
    config.maxLines,
    config.showMoreText,
    config.showLessText,
    textColor,
    contentTestID,
    hasChildren,
    children,
    safeText,
    isExpanded,
    truncatedText,
    truncatedChildrenContent,
    parsedFullSegments,
    parsedTruncatedSegments,
    customActionComponent,
    toggleExpanded,
    testID,
    renderSegments,
    renderActionText,
  ]);

  return { visibleContent, measurementContent };
}
