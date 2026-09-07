import {
  computeChartGeometry,
  computeMarkerPositions,
  computeUnifiedYDomain,
  computeYAxisTickPositions,
  findDataIndexAtPosition,
  findNearestMarkerX,
  MarkerPosition,
} from './chart-calculations';

jest.mock('react-native-redash', () => ({
  getYForX: jest.fn((_path, x: number) => x * 2),
  parse: jest.fn(() => 'parsed-path'),
}));

jest.mock('@shopify/react-native-skia', () => ({
  Skia: {
    Path: {
      Make: jest.fn(() => ({})),
      MakeFromSVGString: jest.fn(() => ({ toSVGString: () => 'svg' })),
    },
  },
}));

describe('findNearestMarkerX', () => {
  const markerPositions: MarkerPosition[] = [
    { x: 50, y: 100 },
    { x: 150, y: 120 },
    { x: 250, y: 80 },
  ];

  it('should return null when no markers exist', () => {
    const result = findNearestMarkerX(100, [], 20);
    expect(result).toBeNull();
  });

  it('should return marker x when cursor is exactly on marker', () => {
    const result = findNearestMarkerX(150, markerPositions, 20);
    expect(result).toBe(150);
  });

  it('should return marker x when cursor is within hit buffer', () => {
    const result = findNearestMarkerX(160, markerPositions, 20);
    expect(result).toBe(150);
  });

  it('should return marker x when cursor is slightly before marker within buffer', () => {
    const result = findNearestMarkerX(145, markerPositions, 20);
    expect(result).toBe(150);
  });

  it('should return null when cursor is outside hit buffer of all markers', () => {
    const result = findNearestMarkerX(200, markerPositions, 20);
    expect(result).toBeNull();
  });

  it('should return nearest marker when multiple markers are in range', () => {
    const result = findNearestMarkerX(155, markerPositions, 50);
    expect(result).toBe(150);
  });

  it('should return marker at edge of hit buffer', () => {
    const result = findNearestMarkerX(169, markerPositions, 20);
    expect(result).toBe(150);
  });

  it('should return marker at exactly the hit buffer distance', () => {
    const result = findNearestMarkerX(170, markerPositions, 20);
    expect(result).toBe(150);
  });

  it('should handle single marker', () => {
    const singleMarker: MarkerPosition[] = [{ x: 100, y: 50 }];
    expect(findNearestMarkerX(110, singleMarker, 20)).toBe(100);
    expect(findNearestMarkerX(121, singleMarker, 20)).toBeNull();
  });
});

describe('computeMarkerPositions', () => {
  const createGeometry = (timestamps: string[]) => {
    const xMap = new Map(timestamps.map((t, i) => [t, 10 + i * 30]));
    return {
      xScale: ((t: string) => xMap.get(t)) as any,
      yScale: jest.fn() as any,
      stepX: 30,
      curvedLine: 'M0,0L100,50',
      linePath: {} as any,
      parsedPath: 'parsed-path' as any,
    };
  };

  const createChartData = (timestamps: string[]) =>
    timestamps.map((timestamp) => ({ timestamp, equity: 100, cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 }));

  it('returns empty array for empty markers', () => {
    const timestamps = ['2023-01-01T00:00:00Z'];
    const geometry = createGeometry(timestamps);
    const chartData = createChartData(timestamps);
    const result = computeMarkerPositions([], geometry, chartData);
    expect(result).toEqual([]);
  });

  it('returns empty array when curvedLine is empty', () => {
    const timestamps = ['2023-01-01T00:00:00Z'];
    const geometry = createGeometry(timestamps);
    geometry.curvedLine = '';
    const chartData = createChartData(timestamps);
    const markers = [{ timestamp: '2023-01-01T00:00:00Z' }];

    const result = computeMarkerPositions(markers, geometry, chartData);

    expect(result).toEqual([]);
  });

  it('finds nearest timestamp for marker with exact match', () => {
    const timestamps = ['2023-01-01T00:00:00Z', '2023-01-02T00:00:00Z', '2023-01-03T00:00:00Z'];
    const geometry = createGeometry(timestamps);
    const chartData = createChartData(timestamps);
    const markers = [{ timestamp: '2023-01-01T00:00:00Z' }, { timestamp: '2023-01-03T00:00:00Z' }];

    const result = computeMarkerPositions(markers, geometry, chartData);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual<MarkerPosition>({ x: 10, y: 20 });
    expect(result[1]).toEqual<MarkerPosition>({ x: 70, y: 140 });
  });

  it('finds nearest timestamp for marker with time precision', () => {
    const timestamps = ['2023-01-01T00:00:00Z', '2023-01-02T00:00:00Z', '2023-01-03T00:00:00Z'];
    const geometry = createGeometry(timestamps);
    const chartData = createChartData(timestamps);

    // Marker at 2pm on Jan 2 is closer to Jan 3 midnight (9.5h) than Jan 2 midnight (14.5h)
    const markers = [{ timestamp: '2023-01-02T14:30:00Z' }];
    const result = computeMarkerPositions(markers, geometry, chartData);

    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(70);
  });

  it('handles single marker', () => {
    const timestamps = ['2023-01-01T00:00:00Z', '2023-01-02T00:00:00Z'];
    const geometry = createGeometry(timestamps);
    const chartData = createChartData(timestamps);
    const markers = [{ timestamp: '2023-01-02T00:00:00Z' }];

    const result = computeMarkerPositions(markers, geometry, chartData);

    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(40);
  });

  it('skips markers with invalid timestamps', () => {
    const timestamps = ['2023-01-01T00:00:00Z', '2023-01-02T00:00:00Z'];
    const geometry = createGeometry(timestamps);
    const chartData = createChartData(timestamps);
    const markers = [{ timestamp: 'invalid-date' }, { timestamp: '2023-01-02T00:00:00Z' }];

    const result = computeMarkerPositions(markers, geometry, chartData);

    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(40);
  });
});

// ============================================================================
// findDataIndexAtPosition + duplicate-baseline geometry (EI-1643)
// ============================================================================

describe('findDataIndexAtPosition', () => {
  it('returns index 0 for x at left edge', () => {
    expect(findDataIndexAtPosition(0, 10, 5)).toBe(0);
  });

  it('returns last index for x at right edge', () => {
    expect(findDataIndexAtPosition(40, 10, 5)).toBe(4);
  });

  it('rounds to nearest data point on midpoints', () => {
    // step=10, n=5, slot midpoints at 5, 15, 25, 35.
    expect(findDataIndexAtPosition(4, 10, 5)).toBe(0); // <5 → slot 0
    expect(findDataIndexAtPosition(5, 10, 5)).toBe(1); // exactly 5 → rounds up
    expect(findDataIndexAtPosition(14, 10, 5)).toBe(1);
    expect(findDataIndexAtPosition(16, 10, 5)).toBe(2);
  });

  it('clamps to data bounds when xPos is outside [0, (n-1)*step]', () => {
    expect(findDataIndexAtPosition(-100, 10, 5)).toBe(0);
    expect(findDataIndexAtPosition(9999, 10, 5)).toBe(4);
  });

  it('returns 0 for empty data', () => {
    expect(findDataIndexAtPosition(50, 10, 0)).toBe(0);
  });

  it('returns 0 for single-point data', () => {
    expect(findDataIndexAtPosition(50, 10, 1)).toBe(0);
  });

  it('handles zero stepX gracefully', () => {
    expect(findDataIndexAtPosition(50, 0, 5)).toBe(4);
  });
});

describe('computeChartGeometry — duplicate baseline (EI-1643)', () => {
  // The BFF emits this baseline pattern at the start of every gain series:
  //   [{ ts: T, equity: 0 }, { ts: T, equity: <first move> }]
  // d3 scalePoint dedupes its domain by default, which used to collapse the
  // pair onto a single slot and shifted every following point one slot left.
  // findDataIndexAtPosition stayed `Math.round(xPos / stepX)` clamped to
  // `[0, n-1]`, so the cursor reported `data[i-1]` for whatever the user
  // visually targeted. computeChartGeometry now disambiguates the colliding
  // key so each data row gets its own slot.

  const buildSeries = () => [
    { timestamp: '2024-08-01T00:00:00Z', equity: 0, pnL: 0 },
    { timestamp: '2024-08-01T00:00:00Z', equity: -0.63, pnL: -0.63 }, // duplicate
    { timestamp: '2024-09-01T00:00:00Z', equity: 1.79, pnL: 1.79 },
    { timestamp: '2024-10-01T00:00:00Z', equity: 10.08, pnL: 10.08 },
    { timestamp: '2024-11-01T00:00:00Z', equity: 20.67, pnL: 20.67 },
  ];

  it('uses width / (n - 1) as stepX even when first two points share a timestamp', () => {
    const data = buildSeries();
    const geometry = computeChartGeometry(data, 400, 100, 0);
    expect(geometry.stepX).toBeCloseTo(400 / (data.length - 1), 5);
  });

  it('places data[0] at x=0 and data[n-1] at x=width', () => {
    const data = buildSeries();
    const geometry = computeChartGeometry(data, 400, 100, 0);
    // The disambiguated key for data[0] is the raw timestamp (first occurrence).
    expect(geometry.xScale(data[0].timestamp)).toBe(0);
    // The disambiguated key for data[n-1] is the raw timestamp.
    expect(geometry.xScale(data[data.length - 1].timestamp)).toBeCloseTo(400, 5);
  });

  it('keeps the duplicate-baseline pair on adjacent slots, not the same slot', () => {
    const data = buildSeries();
    const geometry = computeChartGeometry(data, 400, 100, 0);
    // The first point (data[0]) keeps the raw timestamp key.
    const firstX = geometry.xScale(data[0].timestamp);
    // The second point (data[1]) gets a disambiguated key (`<ts>#1`).
    const secondX = geometry.xScale(`${data[1].timestamp}#1`);
    expect(firstX).toBe(0);
    expect(secondX).toBeCloseTo(geometry.stepX, 5);
    expect(secondX).not.toBe(firstX);
  });

  it('makes findDataIndexAtPosition correct at the right edge (the EI-1643 case)', () => {
    const data = buildSeries();
    const geometry = computeChartGeometry(data, 400, 100, 0);
    // Touching the right edge must resolve to the last data row, not n-2.
    const indexAtRightEdge = findDataIndexAtPosition(400, geometry.stepX, data.length);
    expect(indexAtRightEdge).toBe(data.length - 1);
  });
});

describe('computeUnifiedYDomain', () => {
  const buildPoint = (equity: number, index = 0) => ({ timestamp: `2024-01-0${index + 1}T00:00:00Z`, equity });

  it('returns the min/max across a single series', () => {
    const domain = computeUnifiedYDomain([[buildPoint(5), buildPoint(-3, 1), buildPoint(12, 2)]]);
    expect(domain).toEqual([-3, 12]);
  });

  it('unifies min/max across multiple series', () => {
    const primary = [buildPoint(0), buildPoint(10, 1)];
    const seriesA = [buildPoint(-20), buildPoint(5, 1)];
    const seriesB = [buildPoint(3), buildPoint(42, 1)];
    expect(computeUnifiedYDomain([primary, seriesA, seriesB])).toEqual([-20, 42]);
  });

  it('ignores empty series in the list', () => {
    const domain = computeUnifiedYDomain([[], [buildPoint(1), buildPoint(2, 1)], []]);
    expect(domain).toEqual([1, 2]);
  });

  it('returns null when every series is empty', () => {
    expect(computeUnifiedYDomain([])).toBeNull();
    expect(computeUnifiedYDomain([[], []])).toBeNull();
  });

  it('pads a flat domain by ±1, mirroring the single-series behavior', () => {
    const domain = computeUnifiedYDomain([[buildPoint(100)], [buildPoint(100)]]);
    expect(domain).toEqual([99, 101]);
  });
});

describe('computeChartGeometry — yDomain override', () => {
  const buildSeries = () => [
    { timestamp: '2024-08-01T00:00:00Z', equity: 0 },
    { timestamp: '2024-09-01T00:00:00Z', equity: 5 },
    { timestamp: '2024-10-01T00:00:00Z', equity: 10 },
  ];

  it('uses the provided yDomain instead of the series min/max', () => {
    const geometry = computeChartGeometry(buildSeries(), 400, 100, 0, [-50, 50]);
    expect(geometry.yScale.domain()).toEqual([-50, 50]);
  });

  it('keeps the series-derived domain when yDomain is omitted', () => {
    const geometry = computeChartGeometry(buildSeries(), 400, 100, 0);
    expect(geometry.yScale.domain()).toEqual([0, 10]);
  });

  it('produces identical scales for two series sharing a unified domain', () => {
    const seriesA = buildSeries();
    const seriesB = [
      { timestamp: '2024-08-01T00:00:00Z', equity: 10 },
      { timestamp: '2024-09-01T00:00:00Z', equity: 5 },
      { timestamp: '2024-10-01T00:00:00Z', equity: 0 },
    ];
    const domain = computeUnifiedYDomain([seriesA, seriesB]);
    expect(domain).not.toBeNull();

    const geometryA = computeChartGeometry(seriesA, 400, 100, 0, domain ?? undefined);
    const geometryB = computeChartGeometry(seriesB, 400, 100, 0, domain ?? undefined);
    expect(geometryA.yScale.domain()).toEqual(geometryB.yScale.domain());
    expect(geometryA.yScale.range()).toEqual(geometryB.yScale.range());
  });
});

describe('computeYAxisTickPositions', () => {
  it('returns an empty array for zero or negative counts', () => {
    expect(computeYAxisTickPositions(0, 200)).toEqual([]);
    expect(computeYAxisTickPositions(-1, 200)).toEqual([]);
  });

  it('centers ticks in equal bands with space-around (default)', () => {
    expect(computeYAxisTickPositions(2, 100)).toEqual([25, 75]);
    expect(computeYAxisTickPositions(4, 200)).toEqual([25, 75, 125, 175]);
  });

  it('pins first/last ticks to the edges with space-between', () => {
    expect(computeYAxisTickPositions(3, 100, 'space-between')).toEqual([0, 50, 100]);
  });

  it('places a single space-between tick at the top', () => {
    expect(computeYAxisTickPositions(1, 100, 'space-between')).toEqual([0]);
  });

  it('places a single space-around tick at the middle', () => {
    expect(computeYAxisTickPositions(1, 100)).toEqual([50]);
  });
});
