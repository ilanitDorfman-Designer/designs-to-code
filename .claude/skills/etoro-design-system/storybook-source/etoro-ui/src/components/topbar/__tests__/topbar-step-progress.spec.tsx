import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';

import { TopbarStepProgress } from '../subcomponents/topbar-step-progress';

// Sentinel hex values for V2 tokens that the shared (V1-only) `colorsMock` doesn't expose.
const CARBON_900_SENTINEL = '#AA0903';

jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => {
    const { colorsMock } = require('../../../core/hooks/__mocks__/colors-mock');
    return {
      dark: colorsMock.dark,
      colors: {
        ...colorsMock.colors,
        carbon900: '#AA0903',
        backgroundBase: '#AA0904',
      },
      gradients: {},
      fonts: colorsMock.fonts ?? {},
    };
  },
}));

function Wrapper({
  steps,
  currentStep,
  progress,
  animatingStep,
  color,
}: {
  steps: number;
  currentStep: number;
  progress?: SharedValue<number>;
  animatingStep?: SharedValue<number>;
  color?: string;
}) {
  return (
    <TopbarStepProgress
      testID="step-progress"
      steps={steps}
      currentStep={currentStep}
      stepProgress={progress}
      animatingStep={animatingStep}
      color={color}
    />
  );
}

function WrapperWithSharedValues({ steps, currentStep, color }: { steps: number; currentStep: number; color?: string }) {
  const progress = useSharedValue(0.5);
  const animating = useSharedValue(currentStep);

  return (
    <TopbarStepProgress
      testID="step-progress"
      steps={steps}
      currentStep={currentStep}
      stepProgress={progress}
      animatingStep={animating}
      color={color}
    />
  );
}

describe('TopbarStepProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders the correct number of segments', () => {
      const tree = render(<Wrapper steps={4} currentStep={0} />).toJSON();
      const segmentsRow = !Array.isArray(tree) && tree ? tree.children?.[0] : null;
      const count = typeof segmentsRow === 'object' && segmentsRow?.children ? segmentsRow.children.length : 0;
      expect(count).toBe(4);
    });

    it('renders with testID', () => {
      const { getByTestId } = render(<Wrapper steps={3} currentStep={0} />);

      expect(getByTestId('step-progress')).toBeTruthy();
    });

    it('renders a single segment', () => {
      const { getByTestId } = render(<Wrapper steps={1} currentStep={0} />);

      expect(getByTestId('step-progress')).toBeTruthy();
    });

    it('renders many segments', () => {
      const { getByTestId } = render(<Wrapper steps={10} currentStep={0} />);

      expect(getByTestId('step-progress')).toBeTruthy();
    });
  });

  describe('Static display name', () => {
    it('has displayName set', () => {
      expect(TopbarStepProgress.displayName).toBe('TopbarStepProgress');
    });

    it('has etTopbarStepProgress flag', () => {
      expect(TopbarStepProgress.etTopbarStepProgress).toBe(true);
    });
  });

  describe('With animated values', () => {
    it('renders with stepProgress and animatingStep shared values', () => {
      const { getByTestId } = render(<WrapperWithSharedValues steps={3} currentStep={1} />);

      expect(getByTestId('step-progress')).toBeTruthy();
    });

    it('renders with different currentStep values', () => {
      const { getByTestId, rerender } = render(<WrapperWithSharedValues steps={5} currentStep={0} />);

      expect(getByTestId('step-progress')).toBeTruthy();

      rerender(<WrapperWithSharedValues steps={5} currentStep={2} />);
      expect(getByTestId('step-progress')).toBeTruthy();

      rerender(<WrapperWithSharedValues steps={5} currentStep={4} />);
      expect(getByTestId('step-progress')).toBeTruthy();
    });
  });

  describe('Custom color', () => {
    it('applies the custom color to completed segment fills', () => {
      const tree = render(<Wrapper steps={3} currentStep={1} color="#FF0000" />).toJSON();

      const segmentsRow = tree?.children?.[0];
      const completedSegment = typeof segmentsRow === 'object' ? segmentsRow?.children?.[0] : null;
      const completedFill = typeof completedSegment === 'object' ? completedSegment?.children?.[1] : null;

      expect(completedFill).toBeTruthy();
      expect(typeof completedFill === 'object' && completedFill?.props?.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: '#FF0000' })]),
      );
    });

    it('uses theme carbon900 color when no color prop is provided', () => {
      const tree = render(<Wrapper steps={3} currentStep={1} />).toJSON();

      const segmentsRow = tree?.children?.[0];
      const completedSegment = typeof segmentsRow === 'object' ? segmentsRow?.children?.[0] : null;
      const completedFill = typeof completedSegment === 'object' ? completedSegment?.children?.[1] : null;

      expect(completedFill).toBeTruthy();
      expect(typeof completedFill === 'object' && completedFill?.props?.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: CARBON_900_SENTINEL })]),
      );
    });
  });

  describe('Edge cases', () => {
    it('handles component unmounting gracefully', () => {
      const { unmount } = render(<Wrapper steps={3} currentStep={0} />);

      expect(() => unmount()).not.toThrow();
    });

    it('handles rerender with changed step count', () => {
      const { getByTestId, rerender } = render(<Wrapper steps={3} currentStep={0} />);

      expect(getByTestId('step-progress')).toBeTruthy();

      rerender(<Wrapper steps={5} currentStep={0} />);
      expect(getByTestId('step-progress')).toBeTruthy();
    });
  });
});
