import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleProp, Text, ViewStyle } from 'react-native';

import { EtSwipeableRow } from './et-swipeable-row';
import { SwipeableAction } from './subcomponents/swipeable-action';

jest.mock('../../../core/hooks/use-etoro-theme');

// Override the global gesture-handler mock with a fully chainable Pan gesture
// that includes all methods used by use-swipe-animation
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;

  const createPanMock = (): any => {
    const pan: any = {
      activeOffsetX: jest.fn((): any => pan),
      failOffsetY: jest.fn((): any => pan),
      onBegin: jest.fn((): any => pan),
      onUpdate: jest.fn((): any => pan),
      onEnd: jest.fn((): any => pan),
      onStart: jest.fn((): any => pan),
      onChange: jest.fn((): any => pan),
      onFinalize: jest.fn((): any => pan),
      enabled: jest.fn((): any => pan),
      withTestId: jest.fn((): any => pan),
    };
    return pan;
  };

  return {
    Gesture: {
      Pan: jest.fn(() => createPanMock()),
      Tap: jest.fn(() => createPanMock()),
      LongPress: jest.fn(() => createPanMock()),
    },
    GestureDetector: View,
    gestureHandlerRootHOC: jest.fn((component: any) => component),
    State: {},
  };
});

function flattenStyle(style: StyleProp<ViewStyle>): Record<string, unknown> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.flat(Infinity as 1).filter(Boolean));
  }
  return (style as Record<string, unknown>) ?? {};
}

describe('EtSwipeableRow', () => {
  describe('Rendering', () => {
    it('renders content children', () => {
      render(
        <EtSwipeableRow>
          <Text>Main Content</Text>
        </EtSwipeableRow>,
      );

      expect(screen.getByText('Main Content')).toBeTruthy();
    });

    it('renders a single action subcomponent', () => {
      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()}>
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      expect(screen.getByText('Delete')).toBeTruthy();
    });

    it('renders multiple action subcomponents', () => {
      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()}>
            <Text>Action 1</Text>
          </EtSwipeableRow.Action>
          <EtSwipeableRow.Action onPress={jest.fn()}>
            <Text>Action 2</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      expect(screen.getByText('Action 1')).toBeTruthy();
      expect(screen.getByText('Action 2')).toBeTruthy();
    });

    it('keeps content children separate from action elements', () => {
      render(
        <EtSwipeableRow>
          <Text>Row Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()}>
            <Text>Action</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      expect(screen.getByText('Row Content')).toBeTruthy();
      expect(screen.getByText('Action')).toBeTruthy();
    });
  });

  // ========== Actions container layout ==========

  describe('Actions container layout', () => {
    it('drag-in: container is anchored at right=-totalSwipeWidth so it sits off-screen at rest', () => {
      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()} width={80}>
            <Text>A</Text>
          </EtSwipeableRow.Action>
          <EtSwipeableRow.Action onPress={jest.fn()} width={60}>
            <Text>B</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      const actionsContainer = screen.getByTestId('et-swipeable-row-actions-container');
      const flatStyle = flattenStyle(actionsContainer.props.style);

      // 80 + 60 = 140
      expect(flatStyle.right).toBe(-140);
      expect(flatStyle.position).toBe('absolute');
      expect(flatStyle.flexDirection).toBe('row');
      // We removed the legacy width: 100% / justifyContent: flex-end pinning.
      expect(flatStyle.width).toBeUndefined();
      expect(flatStyle.justifyContent).toBeUndefined();
    });
  });

  // ========== Action width ==========

  describe('SwipeableAction width', () => {
    it('uses DEFAULT_BUTTON_WIDTH (70) when an action has no explicit width', () => {
      render(
        <EtSwipeableRow enableFullSwipe={false}>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()} accessibilityLabel="single">
            <Text>Action</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      const action = screen.getByLabelText('single');
      expect(flattenStyle(action.props.style).width).toBe(70);
    });

    it('honours the explicit width on each action', () => {
      render(
        <EtSwipeableRow enableFullSwipe={false}>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()} width={80} accessibilityLabel="action-1">
            <Text>Action 1</Text>
          </EtSwipeableRow.Action>
          <EtSwipeableRow.Action onPress={jest.fn()} width={60} accessibilityLabel="action-2">
            <Text>Action 2</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      expect(flattenStyle(screen.getByLabelText('action-1').props.style).width).toBe(80);
      expect(flattenStyle(screen.getByLabelText('action-2').props.style).width).toBe(60);
    });
  });

  // ========== Action icon fade wrapper ==========

  describe('Action icon fade-in', () => {
    it('wraps each action child in an opacity-driven Animated.View (opacity 0 at rest)', () => {
      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={jest.fn()} accessibilityLabel="delete-action">
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      // The Pressable's first child is the opacity wrapper. With closed row the opacity is 0.
      const action = screen.getByLabelText('delete-action');
      // Render-tree shape: <Pressable><Animated.View opacity><Text>Delete</Text></Animated.View></Pressable>
      const wrapper = action.children[0] as unknown as { props: { style: StyleProp<ViewStyle> } };
      const flatStyle = flattenStyle(wrapper.props.style);

      expect(flatStyle.opacity).toBe(0);
    });
  });

  // ========== Action Press ==========

  describe('Action press behavior', () => {
    it('calls onPress when an action is pressed', () => {
      const handlePress = jest.fn();

      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={handlePress}>
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      fireEvent.press(screen.getByText('Delete'));

      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('calls onPress for the correct action when multiple are present', () => {
      const handleDelete = jest.fn();
      const handleTrade = jest.fn();

      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={handleTrade}>
            <Text>Trade</Text>
          </EtSwipeableRow.Action>
          <EtSwipeableRow.Action onPress={handleDelete}>
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      fireEvent.press(screen.getByText('Delete'));

      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleTrade).not.toHaveBeenCalled();
    });
  });

  // ========== collapseOnLastAction opt-in ==========

  describe('collapseOnLastAction', () => {
    it('default (off): pressing the LAST action fires onPress synchronously (no collapse await)', () => {
      const handlePress = jest.fn();

      render(
        <EtSwipeableRow>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={handlePress}>
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      fireEvent.press(screen.getByText('Delete'));

      // Without collapse, the press fires the callback immediately on the same tick.
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('on: pressing the LAST action defers onPress until the collapse animation resolves', () => {
      const handlePress = jest.fn();

      render(
        <EtSwipeableRow collapseOnLastAction>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={handlePress}>
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      fireEvent.press(screen.getByText('Delete'));

      // The handler awaits runCollapse(); the timing animation does not complete in the
      // test environment (mocked withTiming never invokes its completion callback), so the
      // consumer's onPress must NOT have fired yet.
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('on: pressing a NON-last action still fires onPress immediately (no collapse for siblings)', () => {
      const handleFavorite = jest.fn();
      const handleDelete = jest.fn();

      render(
        <EtSwipeableRow collapseOnLastAction>
          <Text>Content</Text>
          <EtSwipeableRow.Action onPress={handleFavorite}>
            <Text>Favorite</Text>
          </EtSwipeableRow.Action>
          <EtSwipeableRow.Action onPress={handleDelete}>
            <Text>Delete</Text>
          </EtSwipeableRow.Action>
        </EtSwipeableRow>,
      );

      fireEvent.press(screen.getByText('Favorite'));

      expect(handleFavorite).toHaveBeenCalledTimes(1);
      expect(handleDelete).not.toHaveBeenCalled();
    });
  });

  // ========== Compound Component Shape ==========

  describe('Compound component shape', () => {
    it('EtSwipeableRow.Action is the SwipeableAction component', () => {
      expect(EtSwipeableRow.Action).toBe(SwipeableAction);
    });

    it('EtSwipeableRow has displayName "EtSwipeableRow"', () => {
      expect(EtSwipeableRow.displayName).toBe('EtSwipeableRow');
    });
  });

  // ========== Context Error ==========

  describe('Context error', () => {
    it('throws when Action is rendered outside EtSwipeableRow', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(
          <EtSwipeableRow.Action onPress={jest.fn()}>
            <Text>Orphan Action</Text>
          </EtSwipeableRow.Action>,
        );
      }).toThrow('useSwipeableRowContext must be used within an EtSwipeableRow component');

      consoleSpy.mockRestore();
    });
  });
});
