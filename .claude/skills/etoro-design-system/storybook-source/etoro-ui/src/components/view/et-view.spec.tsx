import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { EtView } from './et-view';

jest.mock('../../core/hooks/accessibility', () => ({
  useReducedMotion: jest.fn(() => false),
}));

describe('EtView', () => {
  it('renders children as a plain View when no skeleton is provided', () => {
    const { getByText, queryByTestId } = render(
      <EtView testID="plain">
        <Text>content</Text>
      </EtView>,
    );

    expect(getByText('content')).toBeTruthy();
    expect(queryByTestId('plain')).toBeTruthy();
  });

  it('renders children as a plain View when skeleton is null', () => {
    const { getByText, queryByTestId } = render(
      <EtView loading skeleton={null}>
        <Text>content</Text>
      </EtView>,
    );

    expect(getByText('content')).toBeTruthy();
    expect(queryByTestId('skeleton')).toBeNull();
  });

  it('shows the skeleton and hides content while loading', () => {
    const { getByTestId, queryByText } = render(
      <EtView loading skeleton={<Text testID="skeleton">loading</Text>}>
        <Text>content</Text>
      </EtView>,
    );

    expect(getByTestId('skeleton')).toBeTruthy();
    expect(queryByText('content')).toBeNull();
  });

  it('mounts content once loading is false', () => {
    const { getByText } = render(
      <EtView loading={false} skeleton={<Text testID="skeleton">loading</Text>}>
        <Text>content</Text>
      </EtView>,
    );

    expect(getByText('content')).toBeTruthy();
  });
});
