# EtTicker Component - Agent Guide

This guide helps AI agents understand and work with the EtTicker component effectively.

## Component Overview

**Purpose**: Infinite scrolling ticker for financial market data display  
**Performance**: 60-120fps using @animatereactnative/marquee + Reanimated 3  
**Interaction**: Drag gesture support for manual scrolling control + pressable asset names  
**Theme**: Full dark/light mode support via useEtoroTheme

## File Structure

```
/ticker/
├── api/
│   ├── index.ts                 # Public API exports
│   └── types.ts                # All TypeScript interfaces
├── components/
│   ├── index.ts                # Component exports
│   ├── ticker-item.tsx         # Individual ticker item component
│   ├── ticker-item.test.tsx    # Ticker item tests
│   ├── ticker-content.tsx      # Content wrapper component
│   └── ticker-content.test.tsx # Content wrapper tests
├── utils/
│   ├── index.ts                # Utility exports
│   ├── format-price.ts         # Smart price formatting
│   ├── format-price.test.ts    # Price formatter tests
│   └── USAGE.md               # Utility documentation
├── et-ticker.tsx              # Main component implementation
├── et-ticker.test.tsx         # Main component tests
├── index.ts                   # Public component exports
├── README.md                  # Component documentation
└── ticker.agent.md           # This file
```

## Key Interfaces

```typescript
interface TickerItem {
  instrumentId: number; // For tracking
  name: string; // Display name (e.g., "AAPL", "BTC", "SPX500") - pressable!
  currentPrice: number; // Numeric price value
  dailyChange: number; // Percentage change (can be negative)
  navigationUrl: string; // URL for navigation to the asset
}

interface EtTickerProps {
  tickersData: TickerItem[]; // Required data array
  speed?: number; // Animation speed (default: 0.5, range: 0.1-2.0)
  style?: ViewStyle; // Container styling
  accessibility?: TickerAccessibilityConfig; // Accessibility configuration
}

interface TickerAccessibilityConfig {
  accessibilityLabel?: string; // Custom accessibility label
  accessibilityHint?: string; // Additional accessibility hint
  testID?: string; // Test identifier for automation
}
```

## Common Patterns

### Basic Stock Ticker

```typescript
const stockData: TickerItem[] = [
  { symbol: 'AAPL', currentPrice: 186.79, dailyChange: 2.1 },
  { symbol: 'TSLA', currentPrice: 245.67, dailyChange: -1.2 },
];

<EtTicker tickersData={stockData} speed={0.5} />
```

### Crypto Ticker

```typescript
const cryptoData: TickerItem[] = [
  { symbol: 'BTC', currentPrice: 45230.67, dailyChange: 4.2 },
  { symbol: 'ETH', currentPrice: 3125.45, dailyChange: -2.8 },
];

<EtTicker tickersData={cryptoData} speed={0.7} />
```

### With Accessibility

```typescript
<EtTicker
  tickersData={stockData}
  speed={0.5}
  accessibility={{
    accessibilityLabel: 'Live stock market ticker',
    accessibilityHint: 'Swipe to pause scrolling',
    testID: 'main-ticker'
  }}
/>
```

## Speed Guidelines

| Speed   | Use Case      | Description                     |
| ------- | ------------- | ------------------------------- |
| 1.5-2.0 | Breaking news | Fast updates for urgent alerts  |
| 0.5-1.0 | Standard      | Balanced speed for general data |
| 0.1-0.4 | Detailed      | Slow pace for easy reading      |

**Content volume affects optimal speed:**

- 1-3 items: 0.8-1.5
- 4-6 items: 0.5-0.8
- 7+ items: 0.3-0.5

## Price Formatting Logic

The `formatPrice` utility uses smart formatting:

```typescript
// Large amounts (>= 1000): No decimals, comma separators
formatPrice(1234) → "$1,234"
formatPrice(10000) → "$10,000"

// Standard amounts (1-999): Two decimal places
formatPrice(156.79) → "$156.79"
formatPrice(1.50) → "$1.50"

// Small amounts (< 1): Four decimal places
formatPrice(0.1234) → "$0.1234"
formatPrice(0.0056) → "$0.0056"
```

## Theme Integration

Always use theme colors for consistency:

```typescript
import { useEtoroTheme } from 'etoro-ui/core';

const { colors } = useEtoroTheme();

// Automatic color application:
// - Positive changes: colors.statusPositive (green)
// - Negative changes: colors.statusNegative (red)
// - Text: colors.textSecondaryNeutral
// - Background: colors.bgNeutralPrimary
```

## Testing Patterns

### Component Testing

```typescript
// Test basic rendering
expect(screen.getByText('AAPL:')).toBeInTheDocument();

// Test price formatting
expect(screen.getByText('$186.79')).toBeInTheDocument();

// Test change indicators
expect(screen.getByTestId('AAPL-change-icon')).toBeInTheDocument();
```

### Utility Testing

```typescript
// Test price formatter edge cases
expect(formatPrice(1000)).toBe('$1,000');
expect(formatPrice(0.1234)).toBe('$0.1234');
expect(formatPrice(156.79)).toBe('$156.79');
```

## Storybook Stories

Current stories demonstrate:

- **Interactive**: Playground with controls
- **BasicExample**: Simple usage with code snippet
- **AnimationSpeeds**: Speed 0.3, 0.5, 1.2 comparisons
- **AssetTypes**: Stocks vs crypto vs forex
- **ContentVolume**: Single item vs many items
- **MarketSentiment**: All positive vs all negative
- **AccessibilityFeatures**: Comprehensive accessibility showcase

## Common Modifications

### Adding New Props

1. Update `EtTickerProps` interface in `api/types.ts`
2. Add prop handling in `et-ticker.tsx`
3. Update tests in `et-ticker.test.tsx`
4. Add story example if visual

### Styling Changes

1. Modify styles in `et-ticker.tsx` (container level)
2. Update component styles in `components/` (item level)
3. Ensure theme compatibility
4. Test dark/light mode

### Performance Optimization

1. Check animation library configuration
2. Optimize component rendering in `components/`
3. All components already use React.memo
4. Profile with large datasets using React DevTools

## Debugging Tips

**Ticker not visible:**

- Check `tickersData` is not empty array (returns `null` if empty)
- Verify container height (default: 40px)
- Ensure speed is between 0.1 and 2.0

**Performance issues:**

- Reduce ticker item count
- Decrease speed (slower = less CPU)
- Check React DevTools for unnecessary re-renders

**Theme not applied:**

- Verify `useEtoroTheme` context availability
- Check color property names match theme
- Test in both light/dark modes

## Integration Points

**With other components:**

- Uses `EtTickerItem` for individual items
- Uses `EtTickerContent` for content wrapper
- Uses `EtoroIcon` for change indicators
- Integrates with theme system via `useEtoroTheme`

**Data flow:**

- Accepts `TickerItem[]` array
- Renders via component architecture in `components/`
- Formats prices via `format-price.ts`
- Animates via `@animatereactnative/marquee`

## Best Practices

1. **Always provide meaningful ticker data** - empty arrays return `null`
2. **Use appropriate speeds** - balance readability vs engagement (0.1-2.0)
3. **Test with various data sizes** - single item vs many items
4. **Verify theme integration** - test light/dark modes
5. **Consider content volume** - adjust speed based on amount of data
6. **Use TypeScript strictly** - leverage provided interfaces
7. **Test gesture interaction** - ensure drag works on all platforms
8. **Implement accessibility** - provide meaningful labels and testIDs
9. **Test screen readers** - verify VoiceOver/TalkBack compatibility

## Migration Notes

When updating from older versions:

- **Architecture Change**: Helper functions converted to React components
- **API Change**: `duration` prop replaced with `speed` prop (0.1-2.0 range)
- **Removed**: `children` prop no longer supported
- **Added**: `accessibility` prop for screen reader support
- **Components**: New `EtTickerItem`, `EtTickerContent`
- **Performance**: All components now use React.memo
- **Testing**: Comprehensive test coverage added

## Dependencies

- `@animatereactnative/marquee`: Animation engine
- `react-native-reanimated`: Performance layer
- `etoro-ui/core`: Theme system
- `etoro-ui/foundations/icon-assets`: Icons for change indicators
