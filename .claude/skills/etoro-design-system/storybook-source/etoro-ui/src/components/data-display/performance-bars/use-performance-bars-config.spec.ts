import { renderHook } from '@testing-library/react-native';

import type { PerformanceBarsColors } from './api';
import { usePerformanceBarsConfig } from './use-performance-bars-config';

const POSITIVE: [string, string] = ['#pos0', '#pos1'];
const NEGATIVE: [string, string] = ['#neg0', '#neg1'];
const MUTED: [string, string] = ['#mut0', '#mut1'];

const baseColors: PerformanceBarsColors = {
  positiveBar: POSITIVE,
  negativeBar: NEGATIVE,
  slot: ['#slot0', '#slot1'],
  selectedPositive: ['#selpos0', '#selpos1'],
  selectedNegative: ['#selneg0', '#selneg1'],
};

function runConfig(colors: PerformanceBarsColors) {
  return renderHook(() =>
    usePerformanceBarsConfig({
      // index 0: muted positive, 1: non-muted positive, 2: muted negative
      data: [{ value: 5, muted: true }, { value: 5 }, { value: -5, muted: true }],
      totalSlots: 3,
      halfHeight: 50,
      chartHeight: 100,
      colors,
    }),
  );
}

describe('usePerformanceBarsConfig — muted bars (PE-1140)', () => {
  it('uses the mutedBar gradient for muted items when the scheme provides one', () => {
    const { result } = runConfig({ ...baseColors, mutedBar: MUTED });
    const { barConfigs } = result.current;

    expect(barConfigs[0].barGradientColors).toEqual(MUTED);
    expect(barConfigs[2].barGradientColors).toEqual(MUTED);
  });

  it('keeps the sign-based gradient for non-muted items', () => {
    const { result } = runConfig({ ...baseColors, mutedBar: MUTED });

    expect(result.current.barConfigs[1].barGradientColors).toEqual(POSITIVE);
  });

  it('falls back to the sign-based gradient when mutedBar is not provided', () => {
    const { result } = runConfig(baseColors);
    const { barConfigs } = result.current;

    expect(barConfigs[0].barGradientColors).toEqual(POSITIVE);
    expect(barConfigs[2].barGradientColors).toEqual(NEGATIVE);
  });
});
