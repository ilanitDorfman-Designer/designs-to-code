import { TileChartData, TileChartDirection, TileChartLayoutItem } from './tile-chart.interface';

export function layoutChart({
  data,
  width,
  height,
  gap,
  direction,
}: {
  data: TileChartData[];
  width: number;
  height: number;
  gap: number;
  direction: TileChartDirection;
}): TileChartLayoutItem[] {
  if (direction === 'mixed') {
    return layoutTreemapFixedColumns({ data, width, height, gap });
  }

  return layoutLinearBars({
    data,
    width,
    height,
    gap,
    direction,
  });
}

function layoutLinearBars({
  data,
  width,
  height,
  gap,
  direction,
  minBarSize = 8,
}: {
  data: TileChartData[];
  width: number;
  height: number;
  gap: number;
  direction: 'vertical' | 'horizontal' | 'mixed';
  minBarSize?: number;
}): TileChartLayoutItem[] {
  if (!data?.length || width <= 0 || height <= 0) {
    return [];
  }

  const stackAxis: 'x' | 'y' = direction === 'vertical' ? 'x' : 'y';

  const n = data.length;
  const totalGap = gap * (n - 1);
  const usable = Math.max(0, (stackAxis === 'x' ? width : height) - totalGap);

  const values = getBarWidthSizes(data, minBarSize, usable);
  const total = values.reduce((a, b) => a + b, 0);

  const sizes = values.map((v) => (usable * v) / total);

  let cursor = 0;
  return data.map((item, i) => {
    const rect = stackAxis === 'x' ? { x: cursor, y: 0, w: sizes[i], h: height } : { x: 0, y: cursor, w: width, h: sizes[i] };

    cursor += sizes[i] + gap;

    const result: TileChartLayoutItem = { ...item, rect };
    return result;
  });
}

function getBarWidthSizes(data: TileChartData[], minSize: number, usable: number): number[] {
  const total = data.map((d) => clamp0(d.value)).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return data.map(() => usable / data.length);
  }

  const minSizeValue = (minSize * usable) / total;
  return data.map((d) => {
    const barWidth = (clamp0(d.value) / total) * usable;
    if (barWidth < minSize) {
      return minSizeValue;
    }
    return barWidth;
  });
}

function layoutTreemapFixedColumns({
  data,
  width,
  height,
  gap = 8,
  order = 'desc',
}: {
  data: TileChartData[];
  width: number;
  height: number;
  gap?: number;
  order?: 'desc' | 'input';
}): TileChartLayoutItem[] {
  if (!data.length || width <= 0 || height <= 0) {
    return [];
  }

  const cols = data.length <= 5 ? 2 : 3;

  const items = order === 'desc' ? [...data].sort((a, b) => (b.value ?? 0) - (a.value ?? 0)) : [...data];

  const k = Math.max(1, Math.min(cols, items.length));

  const totalGapX = gap * (k - 1);
  const colW = clamp0(width - totalGapX) / k;

  const columns: { items: TileChartData[]; sum: number }[] = Array.from({ length: k }, () => ({
    items: [],
    sum: 0,
  }));

  for (const item of items) {
    const v = Math.max(0, Number(item.value) || 0);
    let best = 0;
    for (let c = 1; c < k; c++) {
      if (columns[c].sum < columns[best].sum) best = c;
    }
    columns[best].items.push(item);
    columns[best].sum += v;
  }

  const out: TileChartLayoutItem[] = [];

  for (let c = 0; c < k; c++) {
    const colX = c * (colW + gap);
    const colItems = columns[c].items;

    const sum = colItems.reduce((s, it) => s + Math.max(0, Number(it.value) || 0), 0);

    const totalGapY = gap * Math.max(0, colItems.length - 1);
    const usableH = Math.max(0, height - totalGapY);

    let y = 0;

    for (const it of colItems) {
      const v = Math.max(0, Number(it.value) || 0);

      const h = sum > 0 ? (usableH * v) / sum : usableH / Math.max(1, colItems.length);

      out.push({
        ...it,
        rect: { x: colX, y, w: colW, h },
      });

      y += h + gap;
    }
  }

  return out;
}

function clamp0(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
