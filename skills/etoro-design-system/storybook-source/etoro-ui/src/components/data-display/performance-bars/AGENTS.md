# EtPerformanceBars Component

## Purpose & Scope

`EtPerformanceBars` is a data-display chart component for the eToro design system. It renders center-based performance bars where positive values extend upward and negative values extend downward, with:

- **Center-based layout**: positive bars grow up from the vertical center, negative bars grow down
- **Gradient fills**: Bars use theme-aware green/red gradients for positive/negative values
- **Scale indicators**: Optional side labels showing max positive, zero, and max negative percentages
- **Selection support**: Parent-controlled `selectedIndex` / `onBarClick` for interactive highlighting
- **Empty slot support**: `numberOfBars` can exceed `data.length` to show placeholder grey background slots
- **Configurable appearance**: Height, bar gap, border radius, and scale visibility
- **Optional grow-in animation**: opt-in via `animated` — bars grow out from the center line in a left-to-right cascade on mount / data change, honoring reduce-motion

**Does NOT handle:**

- Selection state management (parent owns `selectedIndex` and toggles via `onBarClick`)
- Data fetching or transformation (expects pre-computed `{ value }` items)
- Labels or tooltips for individual bars (parent renders these based on `selectedIndex`)
- Transitions between data changes beyond the opt-in grow-in animation (`animated`)

## Entry Points & Contracts

### `EtPerformanceBars` (main component)

```tsx
<EtPerformanceBars
  data: PerformanceBarsDataItem[]   // required - array of { value } items
  numberOfBars?: number              // default: data.length - total bar slots to render
  selectedIndex?: number | null      // default: null - currently selected bar
  onBarClick?: (index: number) => void  // called when a bar is pressed
  height?: number                    // default: 120 - chart height in pixels
  barGap?: number                    // default: 4 (X1) - gap between bars in pixels
  barBorderRadius?: number           // default: 4 - border radius of value bars
  showScale?: boolean                // default: true - show scale labels on side
  animated?: boolean                 // default: false - grow bars out from center on mount/data change (honors reduce-motion)
  animationDuration?: number         // default: 320 - per-bar grow duration (ms) when animated
  animationStagger?: number          // default: 60 - delay between consecutive bars, left→right (ms) when animated
  style?: StyleProp<ViewStyle>       // container style override
  testID?: string
  accessibilityLabel?: string
/>
```

Returns `null` when `totalSlots <= 0` (no data and no `numberOfBars`).

### Types

```typescript
type PerformanceBarsDataItem = {
  /** Numeric value; sign determines bar direction and color (positive = green up, negative = red down) */
  value: number;
  /** When true, render with the neutral `colorScheme.mutedBar` gradient instead of the sign color (e.g. back-tested results). */
  muted?: boolean;
};
```

## Usage Patterns

### Basic chart (simplest)

```tsx
const data: PerformanceBarsDataItem[] = [{ value: 2.5 }, { value: -1.2 }, { value: 3.8 }, { value: 0.5 }, { value: -2.1 }];

<EtPerformanceBars data={data} height={160} />;
```

### With selection (parent manages state)

```tsx
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

const handleBarClick = useCallback((index: number) => {
  setSelectedIndex((prev) => (prev === index ? null : index));
}, []);

<EtPerformanceBars data={data} selectedIndex={selectedIndex} onBarClick={handleBarClick} height={140} />;
{
  selectedIndex != null && data[selectedIndex] && <Text>{data[selectedIndex].value.toFixed(2)}%</Text>;
}
```

### Empty slots (fixed bar count exceeding data)

```tsx
// 10 bar slots, but only 5 have data — remaining 5 show grey background
<EtPerformanceBars data={data} numberOfBars={10} height={140} />
```

### Without scale labels

```tsx
<EtPerformanceBars data={data} showScale={false} />
```

### Muted (neutral) bars

Flag individual data items with `muted: true` and supply `colorScheme.mutedBar` to render them with a
neutral gradient instead of their sign-based color — used to de-emphasise data points such as
back-tested / simulated results. Muted bars keep their sign (direction) and remain pressable; only the
fill color changes. If `mutedBar` is omitted, muted items fall back to their positive/negative color.

```tsx
<EtPerformanceBars
  data={[{ value: 2.5 }, { value: 3.1, muted: true }, { value: -1.2, muted: true }]}
  colorScheme={{
    positiveBar: [colors.verdictPositive400Static, colors.verdictPositive600Static],
    negativeBar: [colors.verdictNegative600Static, colors.verdictNegative400Static],
    slot: [colors.carbon100, makeTransparent(colors.carbon100)],
    selectedPositive: [colors.carbon100, makeTransparent(colors.carbon100)],
    selectedNegative: [colors.carbon100, makeTransparent(colors.carbon100)],
    mutedBar: [colors.carbon500, colors.carbon400],
  }}
/>
```

### Custom bar styling

```tsx
// Square bars with wide gaps
<EtPerformanceBars data={data} barBorderRadius={0} barGap={12} />

// Rounded bars with no gaps
<EtPerformanceBars data={data} barBorderRadius={8} barGap={0} />
```

## Anti-patterns

### Expecting the component to manage selection state

```tsx
// BAD - selectedIndex is not managed internally
<EtPerformanceBars data={data} onBarClick={handleClick} />
// selectedIndex will always be null unless you pass it
```

**Fix:** Parent must manage `selectedIndex` state and pass it as a prop. The component only calls `onBarClick` — it does not track which bar is selected.

### Passing negative numberOfBars or zero

```tsx
// BAD - component returns null when totalSlots <= 0
<EtPerformanceBars data={[]} numberOfBars={0} />
```

**Fix:** Ensure `numberOfBars` (or `data.length` if omitted) is greater than 0.

### Manually styling bar colors

```tsx
// BAD - no color props; colors come from theme gradients
<EtPerformanceBars data={data} style={{ backgroundColor: 'green' }} />
```

**Fix:** Bar colors are derived from `useEtoroTheme().colors` (positive/negative gradients). The `style` prop only affects the outer container.

### Assuming bars are clickable when data is missing

```tsx
// Empty slots (index >= data.length) are not pressable
// onBarClick is only fired for slots that have data
```

## Dependencies & Edges

### Internal Dependencies

- `useEtoroTheme` - provides theme colors for bar gradients, backgrounds, text, and divider
- `EtText` - renders scale labels (`label-tertiary-regular` variant)
- `usePerformanceBarsConfig` - configuration hook that computes `barConfigs` and `scaleValues`
- `PerformanceBar` - memoized subcomponent rendering individual bar slots with `LinearGradient`

### External Dependencies

- `expo-linear-gradient` - `LinearGradient` for bar and background gradients
- `react-native` - `View`, `Pressable`, `StyleSheet`

### Design System Integration

- Colors come from theme (`useEtoroTheme().colors`):
  - Positive bars: `positiveGradientPrimary50` / `positiveGradientPrimary70`
  - Negative bars: `negativeGradientPrimary70` / `negativeGradientPrimary50`
  - Slot backgrounds: `bgGreyTransparentPrimary` / `bgGreyTransparentSecondary`
  - Center line: `dividerSecondary`
  - Scale text: `textSecondaryNeutral`
- Spacing uses design tokens (`X1` for default bar gap, `X2` for scale padding)
- Typography: scale labels use `label-tertiary-regular` variant

## Patterns & Pitfalls

### Selection dimming

When `selectedIndex` is set to a valid data index:

- The selected bar renders at full opacity with colored gradient on its slot background
- All other bars render at 0.2 opacity
- When `selectedIndex` is `null`, all bars render at full opacity

### Bar height scaling

Bar heights are proportional to the maximum absolute value in the dataset. The formula is:

```text
barHeight = (|value| / maxAbsValue) * halfHeight
```

This means the tallest bar always fills exactly half the chart height.

### Scale values

Scale labels show `+{max}%`, `0%`, and `-{max}%` where `max` is the largest absolute value in the data, rounded to an integer.

### Empty slots vs data slots

- Data slots (index < `data.length`): show a colored bar (green or red gradient) and are pressable
- Empty slots (index >= `data.length`, when `numberOfBars > data.length`): show only the grey background gradient and are not pressable (`pointerEvents: 'none'`)

### Component renders null for zero slots

If both `data` is empty and `numberOfBars` is 0 or not provided, the component returns `null` (renders nothing).

## File Structure

```text
performance-bars/
├── api/
│   ├── index.ts                        # Re-exports types
│   └── types.ts                        # PerformanceBarsDataItem, EtPerformanceBarsProps
├── subcomponents/
│   ├── index.ts                        # Re-exports PerformanceBar, BarConfig, PerformanceBarProps
│   └── performance-bar.tsx             # Individual bar slot (gradient background + value bar)
├── et-performance-bars.tsx             # Main component (layout, scale, maps barConfigs)
├── use-performance-bars-config.ts      # Config hook (computes barConfigs, scaleValues, maxAbs)
├── index.ts                            # Public exports (component, hook, types)
└── AGENTS.md                           # This file
```

## Related Context

- `EtText (et-text.tsx)` - Text component used for scale labels
- `useEtoroTheme` - Theme hook providing color tokens
- `expo-linear-gradient` - LinearGradient used for bar and background fills
