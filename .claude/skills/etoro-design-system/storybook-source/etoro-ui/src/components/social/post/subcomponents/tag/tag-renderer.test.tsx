import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { TagRenderer } from './tag-renderer';

// Use the automatic theme mock (returns colorsMock) — same approach as sibling
// etoro-ui component tests (e.g. et-asset-info.spec.tsx).
jest.mock('../../../../../core/hooks/use-etoro-theme');

describe('EtPost.Tag (TagRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders caller-provided children', () => {
      const { getByText } = render(
        <TagRenderer>
          <Text>Opened a position on $AAPL</Text>
        </TagRenderer>,
      );

      expect(getByText('Opened a position on $AAPL')).toBeTruthy();
    });

    it('defaults the root testID to "post-trade-badge"', () => {
      const { getByTestId } = render(
        <TagRenderer>
          <Text>content</Text>
        </TagRenderer>,
      );

      expect(getByTestId('post-trade-badge')).toBeTruthy();
    });

    it('honors a custom testID', () => {
      const { getByTestId, queryByTestId } = render(
        <TagRenderer testID="feed-tag">
          <Text>content</Text>
        </TagRenderer>,
      );

      expect(getByTestId('feed-tag')).toBeTruthy();
      expect(queryByTestId('post-trade-badge')).toBeNull();
    });
  });

  describe('Non-interactive shell (interactivity is opt-in via children)', () => {
    it('exposes no button accessibility role', () => {
      const { getByTestId, queryByRole } = render(
        <TagRenderer testID="tag">
          <Text>content</Text>
        </TagRenderer>,
      );

      expect(getByTestId('tag').props.accessibilityRole).toBeUndefined();
      expect(queryByRole('button')).toBeNull();
    });

    it('pressing the pill shell does nothing (no press handler wired up)', () => {
      const { getByTestId } = render(
        <TagRenderer testID="tag">
          <Text>content</Text>
        </TagRenderer>,
      );

      const root = getByTestId('tag');
      // Plain View: there is no onPress/onStartShouldSetResponder handler.
      expect(root.props.onStartShouldSetResponder).toBeUndefined();
      expect(() => fireEvent.press(root)).not.toThrow();
    });
  });

  describe('Style override', () => {
    it('merges a caller-supplied style onto the container', () => {
      const { getByTestId } = render(
        <TagRenderer testID="tag" style={{ marginTop: 12 }}>
          <Text>content</Text>
        </TagRenderer>,
      );

      const style = getByTestId('tag').props.style;
      const flattened = Array.isArray(style) ? Object.assign({}, ...style) : style;
      expect(flattened).toEqual(expect.objectContaining({ marginTop: 12 }));
    });
  });

  describe('displayName', () => {
    it('has the correct displayName', () => {
      expect(TagRenderer.displayName).toBe('EtPost.Tag');
    });
  });
});
