import type { PerformanceBarsDataItem } from 'etoro-ui/components/data-display/performance-bars';

type DataMode = 'positive' | 'negative' | 'mixed';

/**
 * Generates deterministic sample data for performance-bars stories.
 * Uses a seeded approach so stories render consistently across reloads.
 */
export function generateSampleData(count: number, mode: DataMode): PerformanceBarsDataItem[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = ((i + 1) * 37) % 100;
    const magnitude = 1 + (seed % 15);

    switch (mode) {
      case 'positive':
        return { value: magnitude };
      case 'negative':
        return { value: -magnitude };
      case 'mixed':
        return { value: seed % 2 === 0 ? magnitude : -magnitude };
    }
  });
}
