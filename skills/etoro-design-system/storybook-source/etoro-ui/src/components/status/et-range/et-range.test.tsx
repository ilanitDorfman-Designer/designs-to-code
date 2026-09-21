import { render } from '@testing-library/react-native';

import { EtRange } from './et-range';

// Mock gesture handler to avoid native dependency issues in tests
jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Pan: () => ({
        enabled: jest.fn().mockReturnThis(),
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
      Tap: () => ({
        enabled: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
      Simultaneous: jest.fn((a, b) => [a, b]),
    },
    GestureDetector: ({ children }: any) => children,
  };
});

// Mock theme hook used by subcomponents
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgActionDisabled: '#e5e5e5',
      actionBrandText: '#13C636',
      actionBrandVarText: '#0fbf2f',
      textPrimaryNeutral: '#1a1a1a',
      textSecondaryNeutral: '#666666',
    },
  }),
}));

describe('EtRange', () => {
  it('renders left and right labels with default formatting', () => {
    const { getByText } = render(<EtRange min={10} max={20} />);

    expect(getByText('10.00')).toBeTruthy();
    expect(getByText('20.00')).toBeTruthy();
  });

  it('applies custom formatter to labels', () => {
    const { getByText } = render(<EtRange min={5} max={15} formatValue={(v) => `$${v.toFixed(1)}`} />);

    expect(getByText('$5.0')).toBeTruthy();
    expect(getByText('$15.0')).toBeTruthy();
  });
});
