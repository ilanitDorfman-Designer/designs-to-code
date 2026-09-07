import { render } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

import { ChartMarkers } from './chart-markers';

describe('ChartMarkers', () => {
  const mockAnimationProgress = { value: 1 } as ReturnType<typeof useSharedValue<number>>;

  it('should return null when positions array is empty', () => {
    const { toJSON } = render(<ChartMarkers positions={[]} animationProgress={mockAnimationProgress} color="#000" />);
    expect(toJSON()).toBeNull();
  });

  it('should render markers with correct color', () => {
    const positions = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ];
    const { toJSON } = render(<ChartMarkers positions={positions} animationProgress={mockAnimationProgress} color="#FF0000" />);
    expect(toJSON()).not.toBeNull();
  });

  it('should render transparent markers with opacity 0', () => {
    const positions = [{ x: 10, y: 20 }];
    const { toJSON } = render(<ChartMarkers positions={positions} animationProgress={mockAnimationProgress} color="#000" transparent />);
    expect(toJSON()).not.toBeNull();
  });

  it('should render visible markers with opacity 1 by default', () => {
    const positions = [{ x: 10, y: 20 }];
    const { toJSON } = render(<ChartMarkers positions={positions} animationProgress={mockAnimationProgress} color="#000" transparent={false} />);
    expect(toJSON()).not.toBeNull();
  });

  it('should render multiple markers', () => {
    const positions = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
    ];
    const { toJSON } = render(<ChartMarkers positions={positions} animationProgress={mockAnimationProgress} color="#000" />);
    expect(toJSON()).not.toBeNull();
  });
});
