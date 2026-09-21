import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { EtScrollView } from './et-scroll-view';

jest.mock('../../core/hooks/accessibility', () => ({
  useReducedMotion: jest.fn(() => false),
}));

describe('EtScrollView', () => {
  it('renders children as a plain ScrollView when no skeleton is provided', () => {
    const { getByText } = render(
      <EtScrollView>
        <Text>content</Text>
      </EtScrollView>,
    );

    expect(getByText('content')).toBeTruthy();
  });

  it('shows the skeleton and hides content while loading', () => {
    const { getByTestId, queryByText } = render(
      <EtScrollView loading testID="scroll-view" skeleton={<Text testID="skeleton">loading</Text>}>
        <Text>content</Text>
      </EtScrollView>,
    );

    expect(getByTestId('skeleton')).toBeTruthy();
    expect(queryByText('content')).toBeNull();
    expect(getByTestId('scroll-view').props.scrollEnabled).toBe(false);
  });

  it('mounts content once loading is false', () => {
    const { getByText } = render(
      <EtScrollView loading={false} skeleton={<Text testID="skeleton">loading</Text>}>
        <Text>content</Text>
      </EtScrollView>,
    );

    expect(getByText('content')).toBeTruthy();
  });

  it('renders as a plain ScrollView when skeleton is null', () => {
    const { getByText, queryByTestId } = render(
      <EtScrollView loading skeleton={null}>
        <Text>content</Text>
      </EtScrollView>,
    );

    expect(getByText('content')).toBeTruthy();
    expect(queryByTestId('skeleton')).toBeNull();
  });

  it('keeps scrolling disabled while the skeleton is mounted during transition', () => {
    const { getByTestId, rerender } = render(
      <EtScrollView loading testID="scroll-view" skeleton={<Text testID="skeleton">loading</Text>}>
        <Text>content</Text>
      </EtScrollView>,
    );

    expect(getByTestId('scroll-view').props.scrollEnabled).toBe(false);

    rerender(
      <EtScrollView loading={false} testID="scroll-view" skeleton={<Text testID="skeleton">loading</Text>}>
        <Text>content</Text>
      </EtScrollView>,
    );

    expect(getByTestId('scroll-view').props.scrollEnabled).toBe(false);
  });
});
