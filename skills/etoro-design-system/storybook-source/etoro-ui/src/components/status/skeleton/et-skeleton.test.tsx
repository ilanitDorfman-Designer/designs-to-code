import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { EtSkeleton } from './et-skeleton';

const mockUseReducedMotionState = jest.fn(() => ({
  isReducedMotionEnabled: false,
  hasResolved: true,
}));

jest.mock('../../../core/hooks/accessibility', () => ({
  useReducedMotionState: () => mockUseReducedMotionState(),
}));

jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    colors: {
      carbon300: '#d0d0d0',
    },
  }),
}));

describe('EtSkeleton', () => {
  it('shares reduced-motion state across grouped atoms', () => {
    render(
      <EtSkeleton.Group>
        <EtSkeleton.Box testID="box" />
        <EtSkeleton.Text testID="text" />
        <EtSkeleton.Circle testID="circle" />
      </EtSkeleton.Group>,
    );

    expect(mockUseReducedMotionState).toHaveBeenCalledTimes(1);
  });
});
