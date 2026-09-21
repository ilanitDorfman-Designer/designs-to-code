import { formatTimestamp } from '@etoro/common/utils';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
// Get reference to the mocked module
import * as Haptics from 'expo-haptics';
import React from 'react';

import { X2 } from '../../../core/styles';
import { EtPost } from './et-post';
import { PollAnswer } from './subcomponents/poll/api';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Cast to jest mock for mockClear access
const mockImpactAsync = Haptics.impactAsync as jest.Mock;

// Mock useEtoroTheme hook
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

// Mock etoro-ui/core/hooks (path alias used by poll subcomponents)
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

// Mock EtAvatar (path alias used by PollVoterAvatars)
jest.mock('etoro-ui', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockAvatar = (props: any) => React.createElement(View, { testID: props.testID }, props.children);
  MockAvatar.Image = ({ _src }: any) => React.createElement(View, { testID: 'mock-avatar-image' });
  MockAvatar.Fallback = ({ children }: any) => React.createElement(View, { testID: 'mock-avatar-fallback' }, children);
  return { EtAvatar: MockAvatar };
});

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) => {
      const translations: Record<string, string> = {
        'poll.voteCount_one': '{{count}} Vote',
        'poll.voteCount_other': '{{count}} Votes',
        'poll.otherVoters_one': '+{{count}} other voter',
        'poll.otherVoters_other': '+{{count}} other voters',
        'poll.undo': 'Undo',
        'poll.undoVoteAccessibility': 'Undo vote',
        'poll.pollAttachment': 'Poll attachment',
        'post.edited': 'Edited',
      };
      if (opts?.count !== undefined) {
        const pluralKey = opts.count === 1 ? `${key}_one` : `${key}_other`;
        const template = translations[pluralKey] ?? key;
        return template.replace('{{count}}', String(opts.count));
      }
      return translations[key] ?? key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock expo-blur (used by VideoRenderer)
jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: (props: any) => React.createElement(View, { testID: 'mock-blur-view', ...props }, props.children),
  };
});

// Mock expo-linear-gradient (used by VideoRenderer)
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: (props: any) => React.createElement(View, { testID: 'mock-gradient', ...props }, props.children),
  };
});

// ============================================================================
// Test Utilities
// ============================================================================

const defaultProps = {
  displayName: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  text: 'This is a test post content',
  timestamp: '2h',
};

const defaultFooterProps = {
  likes: 10,
  comments: 5,
  shares: 2,
};

const DefaultFooter = ({
  testID,
  onLike,
  onComment,
  onShare,
  onSave,
  onLikesCountPress,
  onSharesCountPress,
  isLiked,
  isSaved,
  likes,
  comments,
  shares,
}: any = {}) => (
  <EtPost.Footer testID={testID}>
    <EtPost.Likes onPress={onLike} onCountPress={onLikesCountPress} isActive={isLiked} testID={testID}>
      {likes ?? defaultFooterProps.likes}
    </EtPost.Likes>
    <EtPost.Comments onPress={onComment} testID={testID}>
      {comments ?? defaultFooterProps.comments}
    </EtPost.Comments>
    <EtPost.Shares onPress={onShare} onCountPress={onSharesCountPress} testID={testID}>
      {shares ?? defaultFooterProps.shares}
    </EtPost.Shares>
    {onSave !== undefined && <EtPost.Save onPress={onSave} isActive={isSaved} testID={testID} />}
  </EtPost.Footer>
);

// Helper to render with default composition children (with testIDs for testing)
const renderWithChildren = (props: any, children?: React.ReactNode) => {
  const { onLike, onComment, onShare, onSave, onLikesCountPress, onSharesCountPress, isLiked, isSaved, likes, comments, shares, ...postProps } =
    props;
  const finalChildren = children ?? (
    <>
      <EtPost.Header testID="header" />
      <EtPost.Body testID="body" />
      <DefaultFooter
        testID="footer"
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onSave={onSave}
        onLikesCountPress={onLikesCountPress}
        onSharesCountPress={onSharesCountPress}
        isLiked={isLiked}
        isSaved={isSaved}
        likes={likes}
        comments={comments}
        shares={shares}
      />
    </>
  );
  return render(
    <EtPost {...defaultProps} {...postProps}>
      {finalChildren}
    </EtPost>,
  );
};

// ============================================================================
// EtPost Component Tests
// ============================================================================

describe('EtPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // Render Tests
  // ============================================================================

  describe('Rendering', () => {
    it('renders with required props', () => {
      const { getByText } = renderWithChildren({});

      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('This is a test post content')).toBeTruthy();
      expect(getByText('2h')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = renderWithChildren({ testID: 'test-post' });

      expect(getByTestId('test-post')).toBeTruthy();
    });

    it('renders location when provided', () => {
      const { getByText } = renderWithChildren({ location: 'Germany' });

      expect(getByText('Germany')).toBeTruthy();
    });

    it('renders "Edited" badge when isEdited is true', () => {
      const { getByText } = renderWithChildren({ isEdited: true });

      expect(getByText('Edited')).toBeTruthy();
    });

    it('does not render "Edited" badge when isEdited is false', () => {
      const { queryByText } = renderWithChildren({});

      expect(queryByText('Edited')).toBeNull();
    });

    it('renders engagement counts', () => {
      const { getByText } = renderWithChildren({});

      expect(getByText('10')).toBeTruthy(); // likes
      expect(getByText('5')).toBeTruthy(); // comments
      expect(getByText('2')).toBeTruthy(); // shares
    });

    it('renders with zero engagement counts', () => {
      const { getAllByText } = renderWithChildren({
        likes: 0,
        comments: 0,
        shares: 0,
      });

      // Should find the zeros in footer
      expect(getAllByText('0').length).toBeGreaterThanOrEqual(3);
    });

    it('renders with maxLines prop', () => {
      const { getByText } = renderWithChildren({ maxLines: 2 });

      expect(getByText('This is a test post content')).toBeTruthy();
    });

    it('renders with custom style', () => {
      const { getByTestId } = renderWithChildren({
        testID: 'post',
        style: { marginTop: X2 },
      });

      expect(getByTestId('post')).toBeTruthy();
    });

    it('renders with accessibilityHint', () => {
      const { getByA11yHint } = renderWithChildren({
        accessibilityHint: 'Double tap to view post',
      });

      expect(getByA11yHint('Double tap to view post')).toBeTruthy();
    });

    it('renders with isLiked state', () => {
      const { getByText } = renderWithChildren({ isLiked: true });

      expect(getByText('10')).toBeTruthy();
    });

    it('renders with isSaved state', () => {
      const onSave = jest.fn();
      const { getByText } = renderWithChildren({ isSaved: true, onSave });

      expect(getByText('Test User')).toBeTruthy();
    });
  });

  // ============================================================================
  // Interaction Tests
  // ============================================================================

  describe('Interactions', () => {
    it('calls onPress when container is pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithChildren({ onPress, testID: 'post' });

      fireEvent.press(getByTestId('post'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onLike when like button is pressed', () => {
      const onLike = jest.fn();
      const { getByTestId } = renderWithChildren({ onLike });

      fireEvent.press(getByTestId('footer-like-icon'));
      expect(onLike).toHaveBeenCalledTimes(1);
    });

    it('calls onComment when comment button is pressed', () => {
      const onComment = jest.fn();
      const { getByTestId } = renderWithChildren({ onComment });

      fireEvent.press(getByTestId('footer-comment'));
      expect(onComment).toHaveBeenCalledTimes(1);
    });

    it('calls onShare when share button is pressed', () => {
      const onShare = jest.fn();
      const { getByTestId } = renderWithChildren({ onShare });

      fireEvent.press(getByTestId('footer-share-icon'));
      expect(onShare).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when onPress prop is not provided', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithChildren({ testID: 'post' });

      fireEvent.press(getByTestId('post'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('calls onSave when save button is pressed', () => {
      const onSave = jest.fn();
      const { getByTestId } = renderWithChildren({ onSave });

      // Use testID to find and press the save button
      fireEvent.press(getByTestId('footer-save'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onUserPress when avatar is pressed', () => {
      const onUserPress = jest.fn();
      const { getByTestId } = renderWithChildren({ onUserPress });

      // Use testID to find and press the avatar
      fireEvent.press(getByTestId('header-avatar'));
      expect(onUserPress).toHaveBeenCalledTimes(1);
    });

    it('calls onMenuPress when menu is pressed', () => {
      const onMenuPress = jest.fn();
      const { getByTestId } = renderWithChildren({ onMenuPress });

      // Use testID to find and press the menu button
      fireEvent.press(getByTestId('header-menu'));
      expect(onMenuPress).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback on like when haptics enabled', () => {
      const onLike = jest.fn();
      const { getByTestId } = renderWithChildren({ onLike, haptics: true });

      fireEvent.press(getByTestId('footer-like-icon'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('does not trigger haptic feedback when haptics disabled', () => {
      const onLike = jest.fn();
      const { getByTestId } = renderWithChildren({ onLike, haptics: false });

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('footer-like-icon'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Compound Component Tests
  // ============================================================================

  describe('Compound Components', () => {
    it('renders custom children when provided', () => {
      const { getByText, queryByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.Header />
          <EtPost.Body />
        </EtPost>,
      );

      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('This is a test post content')).toBeTruthy();

      // Footer should NOT render (not included in children)
      expect(queryByText('10')).toBeNull();
    });

    it('renders with compound footer', () => {
      const { getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.Header />
          <EtPost.Body />
          <DefaultFooter />
        </EtPost>,
      );

      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('renders with image attachment', () => {
      const { getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Image source="https://example.com/image.jpg" />
          <DefaultFooter />
        </EtPost>,
      );

      expect(getByText('Test User')).toBeTruthy();
    });

    it('throws error when subcomponent used outside context', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<EtPost.Header />);
      }).toThrow('EtPost compound components must be used within an EtPost component');

      consoleSpy.mockRestore();
    });

    it('throws error when Body used outside context', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<EtPost.Body />);
      }).toThrow('EtPost compound components must be used within an EtPost component');

      consoleSpy.mockRestore();
    });

    it('throws error when Footer.Likes used outside context', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<EtPost.Likes>{0}</EtPost.Likes>);
      }).toThrow('EtPost compound components must be used within an EtPost component');

      consoleSpy.mockRestore();
    });

    it('throws error when Image used outside context', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<EtPost.Image source="https://example.com/image.jpg" />);
      }).toThrow('EtPost compound components must be used within an EtPost component');

      consoleSpy.mockRestore();
    });
  });

  // ============================================================================
  // Variant Tests
  // ============================================================================

  describe('Variants', () => {
    it('renders with location', () => {
      const { getByText } = renderWithChildren({ location: 'Germany' });

      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('Germany')).toBeTruthy();
    });

    it('renders with image attachment', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps} testID="post">
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Image source="https://example.com/image.jpg" />
          <DefaultFooter />
        </EtPost>,
      );

      expect(getByTestId('post')).toBeTruthy();
    });

    it('renders with image attachment as string source', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps} testID="post">
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Image source="https://example.com/image.jpg" />
          <DefaultFooter />
        </EtPost>,
      );

      expect(getByTestId('post')).toBeTruthy();
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    it('sets accessibilityLabel', () => {
      const { getByLabelText } = renderWithChildren({
        accessibilityLabel: 'Post by Test User',
      });

      expect(getByLabelText('Post by Test User')).toBeTruthy();
    });

    it('has button accessibility role', () => {
      const { getByRole } = renderWithChildren({ onPress: () => {} });

      expect(getByRole('button')).toBeTruthy();
    });

    it('has no accessibility role when not pressable', () => {
      const { getByText } = renderWithChildren({});

      expect(getByText('Test User')).toBeTruthy();
    });
  });

  // ============================================================================
  // displayName Tests
  // ============================================================================

  describe('displayName', () => {
    it('has displayName set on main component', () => {
      expect(EtPost.displayName).toBe('EtPost');
    });

    it('has displayName set on Header subcomponent', () => {
      expect(EtPost.Header.displayName).toBe('EtPost.Header');
    });

    it('has displayName set on Body subcomponent', () => {
      expect(EtPost.Body.displayName).toBe('EtPost.Body');
    });

    it('has displayName set on Footer subcomponent', () => {
      expect(EtPost.Footer.displayName).toBe('EtPost.Footer');
    });

    it('has displayName set on Footer.Likes subcomponent', () => {
      expect(EtPost.Likes.displayName).toBe('EtPost.Likes');
    });

    it('has displayName set on Footer.Comments subcomponent', () => {
      expect(EtPost.Comments.displayName).toBe('EtPost.Comments');
    });

    it('has displayName set on Footer.Shares subcomponent', () => {
      expect(EtPost.Shares.displayName).toBe('EtPost.Shares');
    });

    it('has displayName set on Footer.Save subcomponent', () => {
      expect(EtPost.Save.displayName).toBe('EtPost.Save');
    });

    it('has displayName set on Image subcomponent', () => {
      expect(EtPost.Image.displayName).toBe('EtPost.Image');
    });

    it('has displayName set on Video subcomponent', () => {
      expect(EtPost.Video.displayName).toBe('EtPost.Video');
    });

    it('has displayName set on Link subcomponent', () => {
      expect(EtPost.Link.displayName).toBe('EtPost.Link');
    });

    it('has displayName set on Trade subcomponent', () => {
      expect(EtPost.Trade.displayName).toBe('EtPost.Trade');
    });

    it('has displayName set on Poll subcomponent', () => {
      expect(EtPost.Poll.displayName).toBe('EtPost.Poll');
    });
  });
});

// ============================================================================
// PostHeader Subcomponent Tests
// ============================================================================

describe('PostHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders menu button when onMenuPress is provided and triggers handleMenuPress', () => {
    const onMenuPress = jest.fn();
    const { getByTestId } = renderWithChildren({ onMenuPress, haptics: true });

    // Use testID to find and press the menu button
    const menuButton = getByTestId('header-menu');
    fireEvent.press(menuButton);

    expect(onMenuPress).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('renders avatar with EtAvatar component', () => {
    const { getByTestId } = renderWithChildren({});

    // Verify EtAvatar component is rendered with correct testIDs
    expect(getByTestId('header-avatar-component')).toBeTruthy();
    expect(getByTestId('header-avatar-image')).toBeTruthy();
    // Fallback is always rendered by EtAvatar (but hidden when image loads)
    expect(getByTestId('header-avatar-fallback')).toBeTruthy();
  });

  it('handles avatar press with onUserPress handler', () => {
    const onUserPress = jest.fn();
    const { getByTestId } = renderWithChildren({ onUserPress });

    // Use testID to find and press the avatar
    const avatarButton = getByTestId('header-avatar');
    fireEvent.press(avatarButton);

    expect(onUserPress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalled();
  });

  it('handles user info press with onUserPress handler', () => {
    const onUserPress = jest.fn();
    const { getByTestId } = renderWithChildren({ onUserPress, haptics: true });

    // Use testID to find and press the user info area
    const userInfoButton = getByTestId('header-user-info');
    fireEvent.press(userInfoButton);

    expect(onUserPress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('handles menu press with onMenuPress handler', () => {
    const onMenuPress = jest.fn();
    const { getByTestId } = renderWithChildren({ onMenuPress });

    // Use testID to find and press the menu button
    const menuButton = getByTestId('header-menu');
    fireEvent.press(menuButton);

    expect(onMenuPress).toHaveBeenCalled();
  });

  it('renders without menu when onMenuPress is not provided', () => {
    const { getByText, queryByTestId } = renderWithChildren({});

    expect(getByText('Test User')).toBeTruthy();
    // Menu button should not be rendered
    expect(queryByTestId('header-menu')).toBeNull();
  });

  it('renders with custom header style', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Header style={{ padding: X2 }} testID="header" />
        <EtPost.Body testID="body" />
        <DefaultFooter testID="footer" />
      </EtPost>,
    );

    expect(getByText('Test User')).toBeTruthy();
  });
});

// ============================================================================
// PostBody Subcomponent Tests
// ============================================================================

describe('PostBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text content', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Body testID="body" />
      </EtPost>,
    );

    expect(getByText('This is a test post content')).toBeTruthy();
  });

  it('handles text layout measurement', () => {
    const longText = 'This is a very long text that spans multiple lines. '.repeat(10);
    const { getByText } = renderWithChildren({ text: longText, maxLines: 2 });

    // Should render the text
    expect(getByText(longText)).toBeTruthy();
  });

  it('handles content press when onPress provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps} onPress={onPress} testID="post">
        <EtPost.Body testID="body" />
      </EtPost>,
    );

    // Press the body - event bubbles to container which calls onPress
    const contentArea = getByTestId('body-text');
    fireEvent.press(contentArea);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom body style', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Header testID="header" />
        <EtPost.Body style={{ marginBottom: X2 }} testID="body" />
        <DefaultFooter testID="footer" />
      </EtPost>,
    );

    expect(getByText('This is a test post content')).toBeTruthy();
  });

  it('renders body with testID', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps} maxLines={2}>
        <EtPost.Body testID="body" />
      </EtPost>,
    );

    // Verify the body component renders with testID
    expect(getByTestId('body')).toBeTruthy();
    expect(getByTestId('body-text')).toBeTruthy();
  });
});

// ============================================================================
// PostFooter Subcomponent Tests
// ============================================================================

describe('PostFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders engagement counts', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter />
      </EtPost>,
    );

    expect(getByText('10')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('renders save button when onSave provided', () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" onSave={onSave} />
      </EtPost>,
    );

    expect(getByTestId('footer-save')).toBeTruthy();
    expect(getByTestId('footer-like-icon')).toBeTruthy();
    expect(getByTestId('footer-comment')).toBeTruthy();
    expect(getByTestId('footer-share-icon')).toBeTruthy();
  });

  it('does not render save button when onSave not provided', () => {
    const { queryByTestId, getByTestId } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" />
      </EtPost>,
    );

    expect(queryByTestId('footer-save')).toBeNull();
    expect(getByTestId('footer-like-icon')).toBeTruthy();
  });

  it('handles save button press and calls onSave', () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" onSave={onSave} isSaved />
      </EtPost>,
    );

    fireEvent.press(getByTestId('footer-save'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('renders liked state and handles like press', () => {
    const onLike = jest.fn();
    const { getByTestId, getByText } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" onLike={onLike} isLiked />
      </EtPost>,
    );

    expect(getByText('10')).toBeTruthy();
    const likeButton = getByTestId('footer-like-icon');
    fireEvent.press(likeButton);
    expect(onLike).toHaveBeenCalledTimes(1);
  });

  it('does not trigger haptics on like press without handler', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" />
      </EtPost>,
    );

    mockImpactAsync.mockClear();
    fireEvent.press(getByTestId('footer-like-icon'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('does not trigger haptics on comment press without handler', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" />
      </EtPost>,
    );

    mockImpactAsync.mockClear();
    fireEvent.press(getByTestId('footer-comment'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('does not trigger haptics on share press without handler', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <DefaultFooter testID="footer" />
      </EtPost>,
    );

    mockImpactAsync.mockClear();
    fireEvent.press(getByTestId('footer-share-icon'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('renders with custom footer style', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Footer style={{ paddingTop: X2 }}>
          <EtPost.Likes>{10}</EtPost.Likes>
          <EtPost.Comments>{5}</EtPost.Comments>
          <EtPost.Shares>{2}</EtPost.Shares>
        </EtPost.Footer>
      </EtPost>,
    );

    expect(getByText('10')).toBeTruthy();
  });
});

// ============================================================================
// EtPost.Image (ImageRenderer) Subcomponent Tests
// ============================================================================

describe('EtPost.Image (ImageRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image with URL string source', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Image source="https://example.com/image.jpg" testID="image-attachment" />
        <DefaultFooter />
      </EtPost>,
    );

    expect(getByTestId('image-attachment')).toBeTruthy();
  });

  it('renders image with string source in minimal context', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" testID="image-attachment" />
      </EtPost>,
    );

    expect(getByTestId('image-attachment')).toBeTruthy();
  });

  it('renders image with default styles', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" testID="image-attachment" />
      </EtPost>,
    );

    expect(getByTestId('image-attachment')).toBeTruthy();
  });

  it('handles image press with onPress handler', () => {
    const onImagePress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" onPress={onImagePress} testID="image-attachment" />
      </EtPost>,
    );

    fireEvent.press(getByTestId('image-attachment'));
    expect(onImagePress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalled();
  });

  it('renders as View when no onPress handler', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" testID="image-attachment" />
      </EtPost>,
    );

    const element = getByTestId('image-attachment');
    expect(element.props.accessibilityRole).toBe('image');
  });

  it('renders as Pressable when onPress handler provided', () => {
    const onImagePress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" onPress={onImagePress} testID="image-attachment" />
      </EtPost>,
    );

    const element = getByTestId('image-attachment');
    expect(element.props.accessibilityRole).toBe('imagebutton');
  });

  it('handles image error', async () => {
    const { getByTestId, queryByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/broken-image.jpg" testID="image-attachment" />
      </EtPost>,
    );

    // Trigger image error - expo-image expects { nativeEvent } in the event
    const imageElement = getByTestId('image-attachment-image');
    fireEvent(imageElement, 'error', { nativeEvent: {} });

    await waitFor(() => {
      // After error, component should return null
      expect(queryByTestId('image-attachment')).toBeNull();
    });
  });

  it('renders with custom accessibilityLabel', () => {
    const { getAllByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" accessibilityLabel="Custom image description" />
      </EtPost>,
    );

    // Both the container and the image have the accessibilityLabel
    expect(getAllByLabelText('Custom image description').length).toBeGreaterThanOrEqual(1);
  });

  it('renders with default accessibilityLabel', () => {
    const { getAllByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" />
      </EtPost>,
    );

    // Both the container and the image have the default accessibilityLabel
    expect(getAllByLabelText('Post image').length).toBeGreaterThanOrEqual(1);
  });

  it('renders with custom style', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Image source="https://example.com/image.jpg" testID="image-attachment" style={{ marginTop: X2 }} />
      </EtPost>,
    );

    expect(getByTestId('image-attachment')).toBeTruthy();
  });
});

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('formatTimestamp', () => {
  it('returns display format timestamps as-is', () => {
    expect(formatTimestamp('2h')).toBe('2h');
    expect(formatTimestamp('3d')).toBe('3d');
    expect(formatTimestamp('1m')).toBe('1m');
    expect(formatTimestamp('5w')).toBe('5w');
    expect(formatTimestamp('10s')).toBe('10s');
    expect(formatTimestamp('1y')).toBe('1y');
  });

  it('returns invalid timestamps as-is', () => {
    expect(formatTimestamp('invalid')).toBe('invalid');
    expect(formatTimestamp('not a date')).toBe('not a date');
    expect(formatTimestamp('')).toBe('');
  });

  it('formats recent timestamps as "now"', () => {
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
    expect(formatTimestamp(thirtySecondsAgo.toISOString())).toBe('now');
  });

  it('formats timestamps in minutes', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatTimestamp(fiveMinutesAgo.toISOString())).toBe('5m');

    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    expect(formatTimestamp(thirtyMinutesAgo.toISOString())).toBe('30m');
  });

  it('formats timestamps in hours', () => {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(formatTimestamp(twoHoursAgo.toISOString())).toBe('2h');

    const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
    expect(formatTimestamp(twentyThreeHoursAgo.toISOString())).toBe('23h');
  });

  it('formats timestamps in days', () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(formatTimestamp(twoDaysAgo.toISOString())).toBe('2d');

    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    expect(formatTimestamp(sixDaysAgo.toISOString())).toBe('6d');
  });

  it('formats timestamps in weeks', () => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    expect(formatTimestamp(twoWeeksAgo.toISOString())).toBe('2w');

    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
    expect(formatTimestamp(threeWeeksAgo.toISOString())).toBe('3w');
  });

  it('formats old timestamps as absolute date', () => {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const result = formatTimestamp(sixtyDaysAgo.toISOString());
    // Should be in "Mon D" format
    expect(result).toMatch(/[A-Z][a-z]+ \d+/);
  });

  it('formats with absolute format', () => {
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const result = formatTimestamp(fiveDaysAgo.toISOString(), 'absolute');
    // Should be in "Mon D" format
    expect(result).toMatch(/[A-Z][a-z]+ \d+/);
  });

  it('formats absolute timestamp with year for different year', () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const result = formatTimestamp(lastYear.toISOString(), 'absolute');
    // Should include year
    expect(result).toMatch(/[A-Z][a-z]+ \d+, \d{4}/);
  });

  it('handles parsing errors gracefully', () => {
    // Test with malformed date strings that might throw
    expect(formatTimestamp('2024-13-45')).toBe('2024-13-45');
  });
});

describe('usePostConfig hook', () => {
  it('provides default values for optional props', () => {
    const { getByText } = render(
      <EtPost displayName="Test User" avatar="https://example.com/avatar.jpg" text="Test text" timestamp="1h">
        <EtPost.Header />
        <EtPost.Body />
      </EtPost>,
    );

    expect(getByText('Test User')).toBeTruthy();
  });

  it('handles all prop combinations', () => {
    const { getByText } = render(
      <EtPost
        displayName="Test User"
        avatar="https://example.com/avatar.jpg"
        text="Test text"
        timestamp="1h"
        location="USA"
        isEdited={true}
        haptics={true}
        onPress={() => {}}
        onUserPress={() => {}}
        onMenuPress={() => {}}
      >
        <EtPost.Header />
        <EtPost.Body />
        <DefaultFooter
          likes={100}
          comments={50}
          shares={25}
          isLiked
          onSave={() => {}}
          isSaved
          onLike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
        />
      </EtPost>,
    );

    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('USA')).toBeTruthy();
    expect(getByText('Edited')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
    expect(getByText('50')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
  });
});

// ============================================================================
// Context Tests
// ============================================================================

describe('PostContext', () => {
  it('throws descriptive error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<EtPost.Header />);
    }).toThrow(/EtPost compound components must be used within an EtPost component/);

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('Edge Cases', () => {
  it('handles undefined optional props', () => {
    const { getByText } = render(
      <EtPost displayName="Test User" avatar="https://example.com/avatar.jpg" text="Test text" timestamp="1h">
        <EtPost.Header />
        <EtPost.Body />
        <DefaultFooter likes={0} comments={0} shares={0} />
      </EtPost>,
    );

    expect(getByText('Test User')).toBeTruthy();
  });

  it('handles empty string text', () => {
    const { getByText } = renderWithChildren({ text: '' });

    expect(getByText('Test User')).toBeTruthy();
  });

  it('handles special characters in text', () => {
    const specialText = '<script>alert("xss")</script> & < > "quotes"';
    const { getByText } = renderWithChildren({ text: specialText });

    expect(getByText(specialText)).toBeTruthy();
  });

  it('handles very long displayName', () => {
    const longUsername = 'A'.repeat(100);
    const { getByText } = renderWithChildren({ displayName: longUsername });

    expect(getByText(longUsername)).toBeTruthy();
  });

  it('handles very large engagement numbers', () => {
    const { getByText } = renderWithChildren({
      likes: 999999999,
      comments: 888888888,
      shares: 777777777,
    });

    expect(getByText('Test User')).toBeTruthy();
  });

  it('renders correctly when all handlers are provided', () => {
    const handlers = {
      onPress: jest.fn(),
      onUserPress: jest.fn(),
      onLike: jest.fn(),
      onComment: jest.fn(),
      onShare: jest.fn(),
      onSave: jest.fn(),
      onMenuPress: jest.fn(),
    };

    const { getByText } = renderWithChildren(handlers);

    expect(getByText('Test User')).toBeTruthy();
  });
});

// ============================================================================
// Additional Coverage Tests - Using testIDs for reliable element selection
// ============================================================================

describe('Additional Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PostFooter - Save Button Press', () => {
    it('calls onSave with haptics when save button is pressed', () => {
      const onSave = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps} haptics={true}>
          <DefaultFooter testID="footer" onSave={onSave} />
        </EtPost>,
      );

      const saveButton = getByTestId('footer-save');
      fireEvent.press(saveButton);

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('calls onSave without haptics when haptics is disabled', () => {
      const onSave = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps} haptics={false}>
          <DefaultFooter testID="footer" onSave={onSave} />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      const saveButton = getByTestId('footer-save');
      fireEvent.press(saveButton);

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('PostHeader - Menu Button Press with testID', () => {
    it('calls onMenuPress with haptics when menu button is pressed', () => {
      const onMenuPress = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps} onMenuPress={onMenuPress} haptics={true}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      const menuButton = getByTestId('header-menu');
      fireEvent.press(menuButton);

      expect(onMenuPress).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('calls onMenuPress without haptics when haptics is disabled', () => {
      const onMenuPress = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps} onMenuPress={onMenuPress} haptics={false}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      const menuButton = getByTestId('header-menu');
      fireEvent.press(menuButton);

      expect(onMenuPress).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('formatTimestamp - Error Handling', () => {
    it('handles Date constructor errors gracefully', () => {
      const result = formatTimestamp('invalid-date-format-xyz');
      expect(result).toBe('invalid-date-format-xyz');
    });

    it('returns original for empty strings', () => {
      expect(formatTimestamp('')).toBe('');
    });
  });

  describe('Footer interactions with testIDs', () => {
    it('triggers all footer handlers correctly using testIDs', () => {
      const onLike = jest.fn();
      const onComment = jest.fn();
      const onShare = jest.fn();
      const onSave = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} haptics={true}>
          <DefaultFooter testID="footer" onLike={onLike} onComment={onComment} onShare={onShare} onSave={onSave} />
        </EtPost>,
      );

      fireEvent.press(getByTestId('footer-like-icon'));
      expect(onLike).toHaveBeenCalledTimes(1);

      fireEvent.press(getByTestId('footer-comment'));
      expect(onComment).toHaveBeenCalledTimes(1);

      fireEvent.press(getByTestId('footer-share-icon'));
      expect(onShare).toHaveBeenCalledTimes(1);

      fireEvent.press(getByTestId('footer-save'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onLikesCountPress (and not onLike) when likes count is pressed', () => {
      const onLike = jest.fn();
      const onLikesCountPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <DefaultFooter testID="footer" onLike={onLike} onLikesCountPress={onLikesCountPress} />
        </EtPost>,
      );

      fireEvent.press(getByTestId('footer-like-count'));
      expect(onLikesCountPress).toHaveBeenCalledTimes(1);
      expect(onLike).not.toHaveBeenCalled();
    });

    it('calls onSharesCountPress (and not onShare) when shares count is pressed', () => {
      const onShare = jest.fn();
      const onSharesCountPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <DefaultFooter testID="footer" onShare={onShare} onSharesCountPress={onSharesCountPress} />
        </EtPost>,
      );

      fireEvent.press(getByTestId('footer-share-count'));
      expect(onSharesCountPress).toHaveBeenCalledTimes(1);
      expect(onShare).not.toHaveBeenCalled();
    });

    it('verifies haptics are triggered for all footer buttons', () => {
      const onLike = jest.fn();
      const onComment = jest.fn();
      const onShare = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} haptics={true}>
          <DefaultFooter testID="footer" onLike={onLike} onComment={onComment} onShare={onShare} />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('footer-like-icon'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('footer-comment'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('footer-share-icon'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });
  });

  describe('Header interactions with testIDs', () => {
    it('triggers all header handlers correctly using testIDs', () => {
      const onUserPress = jest.fn();
      const onMenuPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} onUserPress={onUserPress} onMenuPress={onMenuPress} haptics={true}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      // Press avatar using testID
      fireEvent.press(getByTestId('header-avatar'));
      expect(onUserPress).toHaveBeenCalledTimes(1);

      // Press user info using testID (also triggers onUserPress - same handler as avatar)
      fireEvent.press(getByTestId('header-user-info'));
      expect(onUserPress).toHaveBeenCalledTimes(2);

      // Press menu using testID
      fireEvent.press(getByTestId('header-menu'));
      expect(onMenuPress).toHaveBeenCalledTimes(1);
    });

    it('verifies haptics are triggered for all header buttons', () => {
      const onUserPress = jest.fn();
      const onPress = jest.fn();
      const onMenuPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} onUserPress={onUserPress} onPress={onPress} onMenuPress={onMenuPress} haptics={true}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('header-avatar'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('header-user-info'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('header-menu'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('does not trigger haptics when disabled', () => {
      const onUserPress = jest.fn();
      const onPress = jest.fn();
      const onMenuPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} onUserPress={onUserPress} onPress={onPress} onMenuPress={onMenuPress} haptics={false}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('header-avatar'));
      fireEvent.press(getByTestId('header-user-info'));
      fireEvent.press(getByTestId('header-menu'));

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('calls onUserPress (not onHeaderPress) when the user zone is pressed', () => {
      const onUserPress = jest.fn();
      const onHeaderPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} onUserPress={onUserPress} onHeaderPress={onHeaderPress}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      fireEvent.press(getByTestId('header-user-section'));
      expect(onUserPress).toHaveBeenCalledTimes(1);
      expect(onHeaderPress).not.toHaveBeenCalled();
    });

    it('calls onHeaderPress when the header container is pressed', () => {
      const onUserPress = jest.fn();
      const onHeaderPress = jest.fn();

      const { getByTestId } = render(
        <EtPost {...defaultProps} onUserPress={onUserPress} onHeaderPress={onHeaderPress} location={undefined} haptics={true}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      fireEvent.press(getByTestId('header'));
      expect(onHeaderPress).toHaveBeenCalledTimes(1);
      expect(onUserPress).not.toHaveBeenCalled();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });
  });

  describe('Avatar rendering with EtAvatar', () => {
    it('renders EtAvatar with image and fallback components', () => {
      const { getByTestId, getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.Header testID="header" />
        </EtPost>,
      );

      // EtAvatar component should be rendered
      expect(getByTestId('header-avatar-component')).toBeTruthy();
      // EtAvatar.Image should be rendered
      expect(getByTestId('header-avatar-image')).toBeTruthy();
      // EtAvatar.Fallback should be rendered (handles fallback internally)
      expect(getByTestId('header-avatar-fallback')).toBeTruthy();
      // Fallback should contain first letter of displayName
      expect(getByText('T')).toBeTruthy();
    });
  });
});

// ============================================================================
// VideoRenderer Tests
// ============================================================================

describe('EtPost.Video (VideoRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders thumbnail image', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" testID="video" />
      </EtPost>,
    );

    expect(getByTestId('video')).toBeTruthy();
    expect(getByTestId('video-thumbnail')).toBeTruthy();
  });

  it('renders with all metadata (title, description, host)', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video
          thumbnailSource="https://example.com/thumb.jpg"
          title="Intel Stock Analysis"
          host="www.youtube.com"
          description="Intel is investing big on dominating the AI semiconductor..."
          testID="video"
        />
      </EtPost>,
    );

    expect(getByText('Intel Stock Analysis')).toBeTruthy();
    expect(getByText('www.youtube.com')).toBeTruthy();
    expect(getByText('Intel is investing big on dominating the AI semiconductor...')).toBeTruthy();
  });

  it('renders with partial metadata (title only)', () => {
    const { getByText, queryByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" title="Video Title" testID="video" />
      </EtPost>,
    );

    expect(getByText('Video Title')).toBeTruthy();
    expect(queryByText('www.youtube.com')).toBeNull();
  });

  it('renders without metadata overlay when no metadata provided', () => {
    const { getByTestId, queryByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" testID="video" />
      </EtPost>,
    );

    // Thumbnail should render but no metadata text
    expect(getByTestId('video-thumbnail')).toBeTruthy();
    expect(queryByText('www.youtube.com')).toBeNull();
  });

  it('calls onPress handler when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" onPress={onPress} testID="video" />
      </EtPost>,
    );

    fireEvent.press(getByTestId('video'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('triggers haptics on press when enabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps} haptics={true}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" onPress={onPress} testID="video" />
      </EtPost>,
    );

    mockImpactAsync.mockClear();
    fireEvent.press(getByTestId('video'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('does not trigger haptics when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps} haptics={false}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" onPress={onPress} testID="video" />
      </EtPost>,
    );

    mockImpactAsync.mockClear();
    fireEvent.press(getByTestId('video'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('renders as Pressable with button role when onPress provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" onPress={onPress} testID="video" />
      </EtPost>,
    );

    expect(getByTestId('video').props.accessibilityRole).toBe('button');
  });

  it('renders as View with image role when no onPress', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" testID="video" />
      </EtPost>,
    );

    expect(getByTestId('video').props.accessibilityRole).toBe('image');
  });

  it('returns null when thumbnail errors', async () => {
    const { getByTestId, queryByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/broken.jpg" testID="video" />
      </EtPost>,
    );

    const thumbnail = getByTestId('video-thumbnail');
    fireEvent(thumbnail, 'error', { nativeEvent: {} });

    await waitFor(() => {
      expect(queryByTestId('video')).toBeNull();
    });
  });

  it('uses default accessibilityLabel', () => {
    const { getByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" />
      </EtPost>,
    );

    expect(getByLabelText('Video attachment')).toBeTruthy();
  });

  it('uses custom accessibilityLabel', () => {
    const { getByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Video thumbnailSource="https://example.com/thumb.jpg" accessibilityLabel="Custom video" />
      </EtPost>,
    );

    expect(getByLabelText('Custom video')).toBeTruthy();
  });

  it('throws error when used outside EtPost context', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<EtPost.Video thumbnailSource="https://example.com/thumb.jpg" />);
    }).toThrow('EtPost compound components must be used within an EtPost component');

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// LinkPreviewRenderer Tests
// ============================================================================

describe('EtPost.Link (LinkPreviewRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with all props (thumbnail + metadata)', () => {
    const { getByText, getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link
          url="https://www.etoro.com/people/marcomazzali"
          title="@MarcoMazzali's profile"
          host="www.etoro.com"
          description="The Wallaby Project is an ethical investment portfolio"
          thumbnailSource="https://example.com/thumb.jpg"
          testID="link"
        />
      </EtPost>,
    );

    expect(getByTestId('link')).toBeTruthy();
    expect(getByText("@MarcoMazzali's profile")).toBeTruthy();
    expect(getByText('www.etoro.com')).toBeTruthy();
    expect(getByText('The Wallaby Project is an ethical investment portfolio')).toBeTruthy();
    expect(getByTestId('link-thumbnail')).toBeTruthy();
  });

  it('renders without thumbnail', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" host="www.etoro.com" testID="link" />
      </EtPost>,
    );

    expect(getByTestId('link')).toBeTruthy();
    expect(getByText('eToro')).toBeTruthy();
    expect(queryByTestId('link-thumbnail')).toBeNull();
  });

  it('derives host from URL when host prop not provided', () => {
    const { getByText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com/people/marcomazzali" title="Profile" testID="link" />
      </EtPost>,
    );

    expect(getByText('www.etoro.com')).toBeTruthy();
  });

  it('returns null when no metadata and no thumbnail', () => {
    const { queryByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="" testID="link" />
      </EtPost>,
    );

    expect(queryByTestId('link')).toBeNull();
  });

  it('hides thumbnail on image error', async () => {
    const { getByTestId, queryByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" thumbnailSource="https://example.com/broken.jpg" testID="link" />
      </EtPost>,
    );

    const thumbnail = getByTestId('link-thumbnail');
    fireEvent(thumbnail, 'error', { nativeEvent: {} });

    await waitFor(() => {
      expect(queryByTestId('link-thumbnail')).toBeNull();
    });
  });

  it('calls onPress handler when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" onPress={onPress} testID="link" />
      </EtPost>,
    );

    fireEvent.press(getByTestId('link'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('triggers haptics on press when enabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps} haptics={true}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" onPress={onPress} testID="link" />
      </EtPost>,
    );

    mockImpactAsync.mockClear();
    fireEvent.press(getByTestId('link'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('renders as Pressable with link role when onPress provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" onPress={onPress} testID="link" />
      </EtPost>,
    );

    expect(getByTestId('link').props.accessibilityRole).toBe('link');
  });

  it('renders as View without onPress', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" testID="link" />
      </EtPost>,
    );

    // View doesn't have onPress, verify it rendered
    expect(getByTestId('link')).toBeTruthy();
  });

  it('renders outside EtPost without PostContext', () => {
    const { getByTestId } = render(<EtPost.Link url="https://www.etoro.com" title="eToro" host="www.etoro.com" testID="link" />);
    expect(getByTestId('link')).toBeTruthy();
  });

  it('uses default accessibilityLabel', () => {
    const { getByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" />
      </EtPost>,
    );

    expect(getByLabelText('Link preview')).toBeTruthy();
  });

  it('uses custom accessibilityLabel', () => {
    const { getByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Link url="https://www.etoro.com" title="eToro" accessibilityLabel="Custom link" />
      </EtPost>,
    );

    expect(getByLabelText('Custom link')).toBeTruthy();
  });
});

// ============================================================================
// TradeRenderer Tests
// ============================================================================

describe('EtPost.Trade (TradeRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // EtPost.Trade is the compact, tappable asset chip (avatar + symbol +
  // directional price change). Its detailed behaviour is covered in
  // subcomponents/attachments/trade-renderer.test.tsx; here we assert the
  // compound integration + wiring only.
  const tradeProps = {
    symbolName: 'NVDA',
    displayName: 'NVIDIA Corporation',
    avatarSource: 'https://etoro-cdn.etorostatic.com/market-avatars/nvda/80x80.png',
    priceChange: 1.01,
    priceChangePercent: 0.54,
  };

  it('renders the symbol + avatar', () => {
    const { getByText, getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Trade {...tradeProps} testID="trade" />
      </EtPost>,
    );

    expect(getByTestId('trade')).toBeTruthy();
    expect(getByText('NVDA')).toBeTruthy();
    expect(getByTestId('trade-avatar')).toBeTruthy();
  });

  it('renders the directional change node when priceChangePercent is finite', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Trade {...tradeProps} testID="trade" />
      </EtPost>,
    );

    expect(getByTestId('trade-change')).toBeTruthy();
  });

  it('hides the directional change node when priceChangePercent is not finite', () => {
    const { queryByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Trade {...tradeProps} priceChangePercent={Infinity} testID="trade" />
      </EtPost>,
    );

    expect(queryByTestId('trade-change')).toBeNull();
  });

  it('calls onPress handler when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Trade {...tradeProps} onPress={onPress} testID="trade" />
      </EtPost>,
    );

    fireEvent.press(getByTestId('trade'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses custom accessibilityLabel', () => {
    const { getByLabelText } = render(
      <EtPost {...defaultProps}>
        <EtPost.Trade {...tradeProps} accessibilityLabel="NVDA trade" />
      </EtPost>,
    );

    expect(getByLabelText('NVDA trade')).toBeTruthy();
  });

  it('prefers SVG avatar source over raster', () => {
    const { getByTestId } = render(
      <EtPost {...defaultProps}>
        <EtPost.Trade {...tradeProps} avatarSvgSource="https://example.com/nvda.svg" testID="trade" />
      </EtPost>,
    );

    expect(getByTestId('trade-avatar')).toBeTruthy();
  });
});

// ============================================================================
// EtPost.SharedPost Tests
// ============================================================================

const sharedPostProps = {
  displayName: 'Jane Doe',
  avatar: 'https://example.com/shared-avatar.jpg',
  timestamp: '3h',
  text: 'This is the original shared post content.',
};

describe('EtPost.SharedPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('displayName checks', () => {
    it('SharedPostFrame has correct displayName', () => {
      expect(EtPost.SharedPost.displayName).toBe('EtPost.SharedPost');
    });

    it('SharedPost.Header has correct displayName', () => {
      expect(EtPost.SharedPost.Header.displayName).toBe('EtPost.SharedPost.Header');
    });

    it('SharedPost.Body has correct displayName', () => {
      expect(EtPost.SharedPost.Body.displayName).toBe('EtPost.SharedPost.Body');
    });

    it('SharedPost.Attachment has correct displayName', () => {
      expect(EtPost.SharedPost.Attachment.displayName).toBe('EtPost.SharedPost.Attachment');
    });

    it('SharedPost.Deleted has correct displayName', () => {
      expect(EtPost.SharedPost.Deleted.displayName).toBe('EtPost.SharedPost.Deleted');
    });
  });

  describe('Rendering', () => {
    it('renders displayName, timestamp, and text', () => {
      const { getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost testID="shared-post">
            <EtPost.SharedPost.Header {...sharedPostProps} testID="shared-header" />
            <EtPost.SharedPost.Body text={sharedPostProps.text} testID="shared-body" />
          </EtPost.SharedPost>
        </EtPost>,
      );

      expect(getByText('Jane Doe')).toBeTruthy();
      expect(getByText(sharedPostProps.text)).toBeTruthy();
    });

    it('renders with an attachment wrapper', () => {
      const { getByTestId, getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost testID="shared-post">
            <EtPost.SharedPost.Header {...sharedPostProps} testID="shared-header" />
            <EtPost.SharedPost.Body text={sharedPostProps.text} testID="shared-body" />
            <EtPost.SharedPost.Attachment testID="shared-attachment">
              <EtPost.Link url="https://etoro.com" title="eToro" testID="shared-link" />
            </EtPost.SharedPost.Attachment>
          </EtPost.SharedPost>
        </EtPost>,
      );

      expect(getByTestId('shared-attachment')).toBeTruthy();
      expect(getByText('eToro')).toBeTruthy();
    });

    it('renders testIDs on Frame, Header, Body, and Attachment', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost testID="frame">
            <EtPost.SharedPost.Header {...sharedPostProps} testID="header" />
            <EtPost.SharedPost.Body text={sharedPostProps.text} testID="body" />
            <EtPost.SharedPost.Attachment testID="attachment">
              <EtPost.Link url="https://etoro.com" title="eToro" />
            </EtPost.SharedPost.Attachment>
          </EtPost.SharedPost>
        </EtPost>,
      );

      expect(getByTestId('frame')).toBeTruthy();
      expect(getByTestId('header')).toBeTruthy();
      expect(getByTestId('attachment')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('forwards accessibilityLabel and accessibilityHint on Frame', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost testID="frame" accessibilityLabel="Shared post" accessibilityHint="Contains the original post">
            <EtPost.SharedPost.Header {...sharedPostProps} />
            <EtPost.SharedPost.Body text={sharedPostProps.text} />
          </EtPost.SharedPost>
        </EtPost>,
      );

      const frame = getByTestId('frame');
      expect(frame.props.accessibilityLabel).toBe('Shared post');
      expect(frame.props.accessibilityHint).toBe('Contains the original post');
    });

    it('forwards accessibilityLabel and accessibilityHint on Header', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost>
            <EtPost.SharedPost.Header
              {...sharedPostProps}
              testID="header"
              accessibilityLabel="Shared post header"
              accessibilityHint="Tap to view original author"
            />
            <EtPost.SharedPost.Body text={sharedPostProps.text} />
          </EtPost.SharedPost>
        </EtPost>,
      );

      const header = getByTestId('header');
      expect(header.props.accessibilityLabel).toBe('Shared post header');
      expect(header.props.accessibilityHint).toBe('Tap to view original author');
    });

    it('forwards accessibilityLabel and accessibilityHint on Attachment', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost>
            <EtPost.SharedPost.Header {...sharedPostProps} />
            <EtPost.SharedPost.Attachment testID="attachment" accessibilityLabel="Shared attachment" accessibilityHint="Shared media content">
              <EtPost.Link url="https://etoro.com" title="eToro" />
            </EtPost.SharedPost.Attachment>
          </EtPost.SharedPost>
        </EtPost>,
      );

      const attachment = getByTestId('attachment');
      expect(attachment.props.accessibilityLabel).toBe('Shared attachment');
      expect(attachment.props.accessibilityHint).toBe('Shared media content');
    });

    it('avatar Pressable has accessibilityRole="button" when onUserPress is provided', () => {
      const onUserPress = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost>
            <EtPost.SharedPost.Header {...sharedPostProps} testID="header" onUserPress={onUserPress} />
            <EtPost.SharedPost.Body text={sharedPostProps.text} />
          </EtPost.SharedPost>
        </EtPost>,
      );

      const avatarPressable = getByTestId('header-avatar');
      expect(avatarPressable.props.accessibilityRole).toBe('button');
    });

    it('avatar Pressable has no accessibilityRole when onUserPress is absent', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost>
            <EtPost.SharedPost.Header {...sharedPostProps} testID="header" />
            <EtPost.SharedPost.Body text={sharedPostProps.text} />
          </EtPost.SharedPost>
        </EtPost>,
      );

      const avatarPressable = getByTestId('header-avatar');
      expect(avatarPressable.props.accessibilityRole).toBeUndefined();
    });
  });

  describe('Interaction', () => {
    it('calls onUserPress when avatar is pressed', () => {
      const onUserPress = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost>
            <EtPost.SharedPost.Header {...sharedPostProps} testID="header" onUserPress={onUserPress} />
            <EtPost.SharedPost.Body text={sharedPostProps.text} />
          </EtPost.SharedPost>
        </EtPost>,
      );

      fireEvent.press(getByTestId('header-avatar'));
      expect(onUserPress).toHaveBeenCalledTimes(1);
    });

    it('does not call any handler when avatar is pressed with no onUserPress', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost>
            <EtPost.SharedPost.Header {...sharedPostProps} testID="header" />
            <EtPost.SharedPost.Body text={sharedPostProps.text} />
          </EtPost.SharedPost>
        </EtPost>,
      );

      // Should not throw when pressing a disabled avatar
      expect(() => fireEvent.press(getByTestId('header-avatar'))).not.toThrow();
    });
  });
});

// ============================================================================
// EtPost.Poll (PollRenderer) Tests
// ============================================================================

const mockPollAnswers: PollAnswer[] = [
  { id: 'a1', value: 'Long-term' },
  { id: 'a2', value: 'Short-term' },
  { id: 'a3', value: 'Day trading' },
];

const mockPollAnswersWithVotes: PollAnswer[] = [
  { id: 'a1', value: 'Long-term', votes: 120 },
  { id: 'a2', value: 'Short-term', votes: 60 },
  { id: 'a3', value: 'Day trading', votes: 30 },
];

describe('EtPost.Poll (PollRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Pre-vote state', () => {
    it('renders votable options when no selectedId provided', () => {
      const { getByText, getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={mockPollAnswers} question="What's your investing style?" voteCount={0} testID="poll" />
        </EtPost>,
      );

      expect(getByText("What's your investing style?")).toBeTruthy();
      expect(getByText('Long-term')).toBeTruthy();
      expect(getByText('Short-term')).toBeTruthy();
      expect(getByText('Day trading')).toBeTruthy();
      expect(getByTestId('poll-vote-count')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} testID="poll" />
        </EtPost>,
      );

      expect(getByTestId('poll')).toBeTruthy();
      expect(getByTestId('poll-frame')).toBeTruthy();
    });
  });

  describe('Rendering - Post-vote state', () => {
    it('renders result options when selectedId is provided', () => {
      const { getByText, getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={mockPollAnswersWithVotes} question="What's your investing style?" voteCount={210} selectedId="a1" testID="poll" />
        </EtPost>,
      );

      // 120/210 = 57.142857...% -> 57%
      expect(getByText('57%')).toBeTruthy();
      // 60/210 = 28.571428...% -> 29%
      expect(getByText('29%')).toBeTruthy();
      // 30/210 = 14.285714...% -> 14%
      expect(getByText('14%')).toBeTruthy();
      expect(getByText('+210 other voters')).toBeTruthy();
      expect(getByTestId('poll-undo-button')).toBeTruthy();
    });
  });

  describe('Haptics', () => {
    it('triggers haptics on vote when haptics enabled', () => {
      const onVote = jest.fn();
      const { getByText } = render(
        <EtPost {...defaultProps} haptics={true}>
          <EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} onVote={onVote} testID="poll" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByText('Long-term'));
      expect(onVote).toHaveBeenCalledWith('a1');
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('does not trigger haptics on vote when haptics disabled', () => {
      const onVote = jest.fn();
      const { getByText } = render(
        <EtPost {...defaultProps} haptics={false}>
          <EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} onVote={onVote} testID="poll" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByText('Long-term'));
      expect(onVote).toHaveBeenCalledWith('a1');
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('triggers haptics on undo when haptics enabled', () => {
      const onUndo = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps} haptics={true}>
          <EtPost.Poll answers={mockPollAnswersWithVotes} question="Question?" voteCount={210} selectedId="a1" onUndo={onUndo} testID="poll" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('poll-undo-button'));
      expect(onUndo).toHaveBeenCalled();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('does not trigger haptics on undo when haptics disabled', () => {
      const onUndo = jest.fn();
      const { getByTestId } = render(
        <EtPost {...defaultProps} haptics={false}>
          <EtPost.Poll answers={mockPollAnswersWithVotes} question="Question?" voteCount={210} selectedId="a1" onUndo={onUndo} testID="poll" />
        </EtPost>,
      );

      mockImpactAsync.mockClear();
      fireEvent.press(getByTestId('poll-undo-button'));
      expect(onUndo).toHaveBeenCalled();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('uses default accessibilityLabel', () => {
      const { getByLabelText } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} />
        </EtPost>,
      );

      expect(getByLabelText('Poll attachment')).toBeTruthy();
    });

    it('uses custom accessibilityLabel', () => {
      const { getByLabelText } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} accessibilityLabel="Custom poll" />
        </EtPost>,
      );

      expect(getByLabelText('Custom poll')).toBeTruthy();
    });

    it('propagates testID to inner elements', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} testID="poll" />
        </EtPost>,
      );

      expect(getByTestId('poll')).toBeTruthy();
      expect(getByTestId('poll-frame')).toBeTruthy();
      expect(getByTestId('poll-option-a1')).toBeTruthy();
      expect(getByTestId('poll-option-a2')).toBeTruthy();
      expect(getByTestId('poll-option-a3')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('renders with empty answers array', () => {
      const { getByText, getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.Poll answers={[]} question="Empty poll?" voteCount={0} testID="poll" />
        </EtPost>,
      );

      expect(getByTestId('poll')).toBeTruthy();
      expect(getByText('Empty poll?')).toBeTruthy();
      expect(getByTestId('poll-vote-count')).toBeTruthy();
    });

    it('throws when used outside EtPost context', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<EtPost.Poll answers={mockPollAnswers} question="Question?" voteCount={0} />);
      }).toThrow('EtPost compound components must be used within an EtPost component');

      consoleSpy.mockRestore();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(EtPost.Poll.displayName).toBe('EtPost.Poll');
    });
  });
});

// ============================================================================
// EtPost.SharedPost.Deleted Tests
// ============================================================================

const sharedPostDeletedText = 'The shared post was deleted';

describe('EtPost.SharedPost.Deleted', () => {
  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(EtPost.SharedPost.Deleted.displayName).toBe('EtPost.SharedPost.Deleted');
    });
  });

  describe('Rendering', () => {
    it('renders the caller-provided text', () => {
      const { getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} />
        </EtPost>,
      );
      expect(getByText(sharedPostDeletedText)).toBeTruthy();
    });

    it('honors the testID on the card root', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} testID="feed-shared-post-deleted" />
        </EtPost>,
      );
      expect(getByTestId('feed-shared-post-deleted')).toBeTruthy();
    });

    it('renders without a testID (optional prop)', () => {
      const { getByText } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} />
        </EtPost>,
      );
      expect(getByText(sharedPostDeletedText)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('falls back to text as the accessibility label', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} testID="placeholder" />
        </EtPost>,
      );
      expect(getByTestId('placeholder').props.accessibilityLabel).toBe(sharedPostDeletedText);
    });

    it('respects an explicit accessibilityLabel override', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} accessibilityLabel="Shared post unavailable" testID="placeholder" />
        </EtPost>,
      );
      expect(getByTestId('placeholder').props.accessibilityLabel).toBe('Shared post unavailable');
    });

    it('forwards accessibilityHint', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} accessibilityHint="No further action available" testID="placeholder" />
        </EtPost>,
      );
      expect(getByTestId('placeholder').props.accessibilityHint).toBe('No further action available');
    });
  });

  describe('Style override', () => {
    it('merges a caller-supplied style onto the card', () => {
      const { getByTestId } = render(
        <EtPost {...defaultProps}>
          <EtPost.SharedPost.Deleted text={sharedPostDeletedText} style={{ borderWidth: 2 }} testID="placeholder" />
        </EtPost>,
      );
      const style = getByTestId('placeholder').props.style;
      const flattened = Array.isArray(style) ? Object.assign({}, ...style) : style;
      expect(flattened).toEqual(expect.objectContaining({ borderWidth: 2 }));
    });
  });
});
