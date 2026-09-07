import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { EtText } from '../../foundations/text';
import { EtIconV2 } from '../et-icon-v2';
import { EtReadMoreText } from './et-read-more-text';
import type { TextSegment } from './utils/parse-text-entities';
import { parseTextLinks } from './utils/parse-text-entities';
import { truncateChildren } from './utils/truncate-children';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Animated: RNAnimated } = require('react-native');
  return {
    __esModule: true,
    default: {
      ...RNAnimated,
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: jest.fn((initial: any) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue: any) => toValue),
    runOnJS: jest.fn((fn: any) => fn),
    Easing: {
      out: jest.fn(() => undefined),
      in: jest.fn(() => undefined),
      inOut: jest.fn(() => undefined),
      quad: undefined,
      cubic: undefined,
    },
    LinearTransition: {
      springify: jest.fn(() => ({
        damping: jest.fn().mockReturnThis(),
        stiffness: jest.fn().mockReturnThis(),
        mass: jest.fn().mockReturnThis(),
      })),
      duration: jest.fn(() => ({
        easing: jest.fn(() => ({})),
      })),
    },
    createAnimatedComponent: (Component: any) => Component,
  };
});

// Mock useEtoroTheme
jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#FFFFFF',
      actionBrandText: '#00B050',
    },
  }),
}));

// Mock EtText to render as plain Text for testing
jest.mock('../../foundations/text', () => {
  const ReactMock = require('react');
  const { Text } = require('react-native');
  const mockEtText = ReactMock.forwardRef(({ children, onTextLayout, testID, style, onPress, ...rest }: any, ref: any) => (
    <Text ref={ref} testID={testID} style={style} onTextLayout={onTextLayout} onPress={onPress} {...rest}>
      {children}
    </Text>
  ));
  mockEtText.displayName = 'EtText';
  return { EtText: ReactMock.memo(mockEtText) };
});

// Mock EtIconV2 to render as View for testing
jest.mock('../et-icon-v2', () => {
  const ReactMock = require('react');
  const { View } = require('react-native');
  const mockEtIconV2 = ({ name, testID, ...rest }: any) => <View testID={testID} {...rest} accessibilityLabel={`icon-${name}`} />;
  mockEtIconV2.displayName = 'EtIconV2';
  return { EtIconV2: ReactMock.memo(mockEtIconV2) };
});

/**
 * Simulate onTextLayout on the hidden measurement text (found via testID)
 * so the component detects whether the content exceeds maxLines.
 */
function simulateMeasurement(getByTestId: (id: string, options?: Record<string, unknown>) => any, testID: string, lineCount: number) {
  // The measurement element lives inside an accessibilityElementsHidden
  // container, so we need includeHiddenElements to reach it.
  const measureElement = getByTestId(`${testID}-measure`, {
    includeHiddenElements: true,
  });
  act(() => {
    fireEvent(measureElement, 'textLayout', {
      nativeEvent: {
        lines: Array.from({ length: lineCount }, (_, i) => ({
          text: `Line ${i + 1} of measured text content. `,
        })),
      },
    });
  });
}

const SHORT_TEXT = 'Short text that fits in one line.';
const LONG_TEXT =
  'This is a very long text that should span multiple lines when rendered. ' +
  'It contains enough content to exceed the default maximum of four lines. ' +
  'The component should detect this and show a truncated version with an ' +
  'inline Show More button at the end of the last visible line. ' +
  'When the user taps Show More, the full text should be revealed with ' +
  'an inline Show Less button at the end.';

describe('EtReadMoreText', () => {
  // ===========================================================================
  // Core rendering
  // ===========================================================================

  describe('rendering', () => {
    it('renders with default props', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" text={SHORT_TEXT} />);
      expect(getByTestId('read-more')).toBeTruthy();
    });

    it('sets displayName correctly', () => {
      expect(EtReadMoreText.displayName).toBe('EtReadMoreText');
    });

    it('shows text optimistically before measurement completes', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={4} text={SHORT_TEXT} />);

      // Text should be visible even before measurement
      expect(getByTestId('read-more-text')).toBeTruthy();
    });
  });

  // ===========================================================================
  // Short text (no truncation)
  // ===========================================================================

  describe('short text (no truncation needed)', () => {
    it('renders full text without Show More when text fits', () => {
      const { queryByTestId, getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={4} text={SHORT_TEXT} />);

      simulateMeasurement(getByTestId, 'read-more', 2);

      expect(queryByTestId('read-more-toggle')).toBeNull();
      expect(getByTestId('read-more-text')).toBeTruthy();
    });
  });

  // ===========================================================================
  // Long text (truncation)
  // ===========================================================================

  describe('long text (truncation needed)', () => {
    it('shows truncated text with Show More after measurement', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} />);

      simulateMeasurement(getByTestId, 'read-more', 6);

      expect(getByTestId('read-more-toggle')).toBeTruthy();
      expect(getByTestId('read-more-text')).toBeTruthy();
    });
  });

  // ===========================================================================
  // Expansion toggle
  // ===========================================================================

  describe('expansion toggle', () => {
    it('calls onExpandedChange when action text is pressed', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} onExpandedChange={onExpandedChange} />);

      simulateMeasurement(getByTestId, 'read-more', 6);

      const toggleElement = getByTestId('read-more-toggle');
      fireEvent.press(toggleElement);
      expect(onExpandedChange).toHaveBeenCalledTimes(1);
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });
  });

  // ===========================================================================
  // Custom props
  // ===========================================================================

  describe('custom props', () => {
    it('accepts custom showMoreText and showLessText', () => {
      const { getByTestId } = render(
        <EtReadMoreText testID="read-more" showMoreText="Read more" showLessText="Read less" maxLines={2} text={LONG_TEXT} />,
      );

      expect(getByTestId('read-more')).toBeTruthy();
    });

    it('accepts initialExpanded prop', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" initialExpanded maxLines={2} text={LONG_TEXT} />);

      expect(getByTestId('read-more')).toBeTruthy();
    });

    it('accepts custom textVariant', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" textVariant="body-base-regular" maxLines={2} text={LONG_TEXT} />);

      expect(getByTestId('read-more')).toBeTruthy();
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe('accessibility', () => {
    it('supports accessibilityLabel', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" accessibilityLabel="Post content" text={SHORT_TEXT} />);

      expect(getByTestId('read-more').props.accessibilityLabel).toBe('Post content');
    });

    it('supports testID', () => {
      const { getByTestId } = render(<EtReadMoreText testID="my-read-more" text={SHORT_TEXT} />);

      expect(getByTestId('my-read-more')).toBeTruthy();
    });
  });

  // ===========================================================================
  // Toggle via action text
  // ===========================================================================

  describe('toggle via action text only', () => {
    it('toggles expand/collapse when action text is pressed', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} onExpandedChange={onExpandedChange} />);

      simulateMeasurement(getByTestId, 'read-more', 6);

      // Expand
      fireEvent.press(getByTestId('read-more-toggle'));
      expect(onExpandedChange).toHaveBeenCalledWith(true);

      // Re-query after re-render, then collapse
      fireEvent.press(getByTestId('read-more-toggle'));
      expect(onExpandedChange).toHaveBeenCalledWith(false);
      expect(onExpandedChange).toHaveBeenCalledTimes(2);
    });

    it('applies layout transition only while expanded', () => {
      const { getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} />);

      simulateMeasurement(getByTestId, 'read-more', 6);

      const getLayoutHost = () => {
        const host = getByTestId('read-more');
        const views = host.children.filter((child: string | { props?: { layout?: unknown } }) => typeof child !== 'string');
        return views[views.length - 1] as { props: { layout?: unknown } };
      };

      expect(getLayoutHost().props.layout).toBeFalsy();

      fireEvent.press(getByTestId('read-more-toggle'));
      expect(getLayoutHost().props.layout).toBeDefined();

      fireEvent.press(getByTestId('read-more-toggle'));
      expect(getLayoutHost().props.layout).toBeFalsy();
    });

    it('preserves isExpanded when text changes (re-measures without collapsing)', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId, rerender } = render(
        <EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} onExpandedChange={onExpandedChange} />,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      // User expands the original text.
      fireEvent.press(getByTestId('read-more-toggle'));
      expect(onExpandedChange).toHaveBeenLastCalledWith(true);

      // Text prop changes in place (e.g. translation toggle on the same item).
      const TRANSLATED_TEXT = `${LONG_TEXT} (translated)`;
      rerender(<EtReadMoreText testID="read-more" maxLines={2} text={TRANSLATED_TEXT} onExpandedChange={onExpandedChange} />);

      // New text re-measures.
      simulateMeasurement(getByTestId, 'read-more', 7);

      // Expansion state must be preserved — no extra onExpandedChange(false) call.
      expect(onExpandedChange).toHaveBeenCalledTimes(1);
      expect(onExpandedChange).not.toHaveBeenCalledWith(false);
    });

    it('keeps full text and action visible during re-measurement when already expanded (no flash)', () => {
      const { getByTestId, queryByTestId, rerender } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} />);

      simulateMeasurement(getByTestId, 'read-more', 6);
      fireEvent.press(getByTestId('read-more-toggle'));

      rerender(<EtReadMoreText testID="read-more" maxLines={2} text={`${LONG_TEXT} (translated)`} />);

      // While re-measuring (hasMeasured is false but isExpanded was preserved):
      // 1. Visible text must not be clipped via numberOfLines (no OS "…" flash).
      // 2. The toggle action must remain mounted (no button blink).
      const visible = getByTestId('read-more-text');
      expect(visible.props.numberOfLines).toBeUndefined();
      expect(queryByTestId('read-more-toggle')).toBeTruthy();
    });

    it('resets isExpanded when initialExpanded prop changes (parent intent)', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId, rerender } = render(
        <EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} initialExpanded={false} onExpandedChange={onExpandedChange} />,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      // Parent explicitly switches to expanded.
      rerender(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} initialExpanded onExpandedChange={onExpandedChange} />);

      // The toggle should now reflect the expanded state — pressing collapses.
      fireEvent.press(getByTestId('read-more-toggle'));
      expect(onExpandedChange).toHaveBeenLastCalledWith(false);
    });
  });

  // ===========================================================================
  // Custom action component
  // ===========================================================================

  describe('custom action component', () => {
    it('supports customActionComponent with icon', () => {
      const { getByTestId, getByLabelText } = render(
        <EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} customActionComponent={() => <EtIconV2 name="chevron-down" />} />,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);
      expect(getByTestId('read-more')).toBeTruthy();
      expect(getByLabelText('icon-chevron-down')).toBeTruthy();
    });

    it('passes isExpanded to customActionComponent', () => {
      const mockRenderFn = jest.fn((isExpanded) => <EtText>{isExpanded ? 'Less' : 'More'}</EtText>);

      const { getByTestId, getByText } = render(
        <EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} customActionComponent={mockRenderFn} />,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      expect(mockRenderFn).toHaveBeenCalledWith(false);
      expect(getByText('More')).toBeTruthy();

      fireEvent.press(getByTestId('read-more-toggle'));
      expect(mockRenderFn).toHaveBeenCalledWith(true);
    });

    it('renders default text action when no customActionComponent provided', () => {
      const { getByTestId, getByText } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} showMoreText="Read more" />);

      simulateMeasurement(getByTestId, 'read-more', 6);
      expect(getByText('Read more')).toBeTruthy();
    });
  });

  // ===========================================================================
  // parseTextLinks — pure utility tests
  // ===========================================================================

  describe('parseTextLinks', () => {
    it('returns empty array for empty string', () => {
      expect(parseTextLinks('')).toEqual([]);
    });

    it('returns a single text segment when no URLs are found', () => {
      const result = parseTextLinks('Hello world');
      expect(result).toEqual([{ type: 'text', content: 'Hello world', value: 'Hello world' }]);
    });

    it('detects a URL', () => {
      const result = parseTextLinks('Visit https://example.com today');
      expect(result).toEqual([
        { type: 'text', content: 'Visit ', value: 'Visit ' },
        {
          type: 'link',
          content: 'https://example.com',
          value: 'https://example.com',
        },
        { type: 'text', content: ' today', value: ' today' },
      ]);
    });

    it('detects multiple URLs', () => {
      const result = parseTextLinks('Go to https://a.com and https://b.com now');
      const links = result.filter((s: TextSegment) => s.type === 'link');
      expect(links).toHaveLength(2);
      expect(links[0].value).toBe('https://a.com');
      expect(links[1].value).toBe('https://b.com');
    });

    it('handles text with no trailing content after URL', () => {
      const result = parseTextLinks('Visit https://example.com');
      expect(result).toEqual([
        { type: 'text', content: 'Visit ', value: 'Visit ' },
        {
          type: 'link',
          content: 'https://example.com',
          value: 'https://example.com',
        },
      ]);
    });

    it('excludes trailing period from URL', () => {
      const result = parseTextLinks('Visit https://example.com.');
      const link = result.find((s: TextSegment) => s.type === 'link');
      expect(link!.value).toBe('https://example.com');
    });

    it('handles URL with query params', () => {
      const result = parseTextLinks('Go to https://example.com?param=value&other=123 now');
      const link = result.find((s: TextSegment) => s.type === 'link');
      expect(link!.value).toBe('https://example.com?param=value&other=123');
    });

    it('handles URL with fragment', () => {
      const result = parseTextLinks('See https://example.com#section for info');
      const link = result.find((s: TextSegment) => s.type === 'link');
      expect(link!.value).toBe('https://example.com#section');
    });

    it('handles URL in parentheses', () => {
      const result = parseTextLinks('(https://example.com)');
      const link = result.find((s: TextSegment) => s.type === 'link');
      expect(link!.value).toBe('https://example.com');
    });

    it('handles URL ending with slash', () => {
      const result = parseTextLinks('Visit https://example.com/ for more');
      const link = result.find((s: TextSegment) => s.type === 'link');
      expect(link!.value).toBe('https://example.com/');
    });
  });

  // ===========================================================================
  // truncateChildren — pure utility tests
  // ===========================================================================

  describe('truncateChildren', () => {
    it('returns null for maxChars <= 0', () => {
      expect(truncateChildren('Hello', 0)).toBeNull();
    });

    it('returns full string when it fits within budget', () => {
      expect(truncateChildren('Hello', 10)).toBe('Hello');
    });

    it('truncates a string at maxChars', () => {
      expect(truncateChildren('Hello World', 5)).toBe('Hello');
    });

    it('truncates across siblings', () => {
      const children = ['Hello ', 'World'];
      const result = truncateChildren(children, 8);
      expect(result).toEqual(['Hello ', 'Wo']);
    });

    it('preserves element wrappers when recursing', () => {
      // @ts-expect-error -- 'Text' is a RN component; createElement string overload does not include onPress
      const element = React.createElement('Text', { onPress: jest.fn() }, 'Hello World');
      const result = truncateChildren(element, 5) as React.ReactElement;

      expect(React.isValidElement(result)).toBe(true);
      // @ts-expect-error -- ReactElement.props is typed as unknown; test asserts mock element shape
      expect(result.props.onPress).toBeDefined();
      // @ts-expect-error -- ReactElement.props is typed as unknown; test asserts mock element shape
      expect(result.props.children).toBe('Hello');
    });

    it('handles mixed string and element children', () => {
      const children = [
        'Buy ',
        // @ts-expect-error -- 'Text' is a RN component; createElement string overload does not include onPress
        React.createElement('Text', { key: 'tag', onPress: jest.fn() }, '$AAPL'),
        '! Follow',
      ];
      // Budget: 9 = "Buy " (4) + "$AAPL" (5) = exactly fits tag
      const result = truncateChildren(children, 9) as React.ReactNode[];
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('Buy ');
      expect(React.isValidElement(result[1])).toBe(true);
      // @ts-expect-error -- ReactElement.props is typed as unknown; test asserts mock element shape
      expect((result[1] as React.ReactElement).props.children).toBe('$AAPL');
    });

    it('truncates inside an element child', () => {
      const children = ['Hi ', React.createElement('Text', { key: 'link' }, 'https://very-long-url.com')];
      // Budget: 7 = "Hi " (3) + 4 chars from URL
      const result = truncateChildren(children, 7) as React.ReactNode[];
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('Hi ');
      // @ts-expect-error -- ReactElement.props is typed as unknown; test asserts mock element shape
      expect((result[1] as React.ReactElement).props.children).toBe('http');
    });

    it('handles empty children', () => {
      expect(truncateChildren(null, 10)).toBeNull();
      expect(truncateChildren(undefined, 10)).toBeNull();
    });
  });

  // ===========================================================================
  // URL link rendering (string mode)
  // ===========================================================================

  describe('URL link rendering', () => {
    it('renders URLs as plain text when no onLinkPress is provided', () => {
      const textWithUrl = 'Visit https://example.com today';
      const { getByText } = render(<EtReadMoreText testID="read-more" text={textWithUrl} />);

      expect(getByText(textWithUrl)).toBeTruthy();
    });

    it('renders URLs with link styling when onLinkPress is provided', () => {
      const onLinkPress = jest.fn();
      const { getByText } = render(<EtReadMoreText testID="read-more" text="Visit https://example.com today" onLinkPress={onLinkPress} />);

      const linkElement = getByText('https://example.com');
      expect(linkElement).toBeTruthy();
      expect(linkElement.props.style).toEqual(expect.objectContaining({ color: '#00B050' }));
    });

    it('calls onLinkPress with the URL when a link is pressed', () => {
      const onLinkPress = jest.fn();
      const { getByText } = render(<EtReadMoreText testID="read-more" text="Visit https://example.com today" onLinkPress={onLinkPress} />);

      fireEvent.press(getByText('https://example.com'));

      expect(onLinkPress).toHaveBeenCalledTimes(1);
      expect(onLinkPress).toHaveBeenCalledWith('https://example.com');
    });
  });

  // ===========================================================================
  // Children mode (rich content)
  // ===========================================================================

  describe('children mode', () => {
    it('renders children when provided and no truncation needed', () => {
      const { getByText } = render(
        <EtReadMoreText testID="read-more" text="Hello world" maxLines={4}>
          <EtText>Hello</EtText>
          <EtText onPress={jest.fn()} style={{ color: '#00B050' }}>
            {' '}
            world
          </EtText>
        </EtReadMoreText>,
      );

      expect(getByText('Hello')).toBeTruthy();
      expect(getByText(' world')).toBeTruthy();
    });

    it('renders children in hidden measurement area', () => {
      const { getByTestId } = render(
        <EtReadMoreText testID="read-more" text="Buy AAPL" maxLines={2}>
          <EtText>Buy </EtText>
          <EtText onPress={jest.fn()}>AAPL</EtText>
        </EtReadMoreText>,
      );

      // Hidden measurement element should exist before measurement
      const measureElement = getByTestId('read-more-measure', {
        includeHiddenElements: true,
      });
      expect(measureElement).toBeTruthy();
    });

    it('shows Show More toggle when children content exceeds maxLines', () => {
      const { getByTestId } = render(
        <EtReadMoreText testID="read-more" text={LONG_TEXT} maxLines={2}>
          <EtText>{LONG_TEXT}</EtText>
        </EtReadMoreText>,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      expect(getByTestId('read-more-toggle')).toBeTruthy();
    });

    it('expands to show full children when toggle is pressed', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId } = render(
        <EtReadMoreText testID="read-more" text={LONG_TEXT} maxLines={2} onExpandedChange={onExpandedChange}>
          <EtText>{LONG_TEXT}</EtText>
        </EtReadMoreText>,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      fireEvent.press(getByTestId('read-more-toggle'));
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('preserves onPress handlers on child elements in collapsed state', () => {
      const onTagPress = jest.fn();
      const { getByText, getByTestId } = render(
        <EtReadMoreText testID="read-more" text="Buy AAPL stock now" maxLines={2}>
          <EtText>Buy </EtText>
          <EtText onPress={onTagPress}>AAPL</EtText>
          <EtText> stock now</EtText>
        </EtReadMoreText>,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      // The interactive element should still have its onPress
      const tagElement = getByText('AAPL');
      expect(tagElement.props.onPress).toBeDefined();
    });
  });

  // ===========================================================================
  // Press handling
  // ===========================================================================

  describe('press handling', () => {
    it('toggles via action text in string mode', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId } = render(<EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} onExpandedChange={onExpandedChange} />);

      simulateMeasurement(getByTestId, 'read-more', 6);

      const toggleElement = getByTestId('read-more-toggle');
      fireEvent.press(toggleElement);
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('toggles via action text in children mode', () => {
      const onExpandedChange = jest.fn();
      const { getByTestId } = render(
        <EtReadMoreText testID="read-more" maxLines={2} text={LONG_TEXT} onExpandedChange={onExpandedChange}>
          <EtText>{LONG_TEXT}</EtText>
        </EtReadMoreText>,
      );

      simulateMeasurement(getByTestId, 'read-more', 6);

      const toggleElement = getByTestId('read-more-toggle');
      fireEvent.press(toggleElement);
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });
  });
});
