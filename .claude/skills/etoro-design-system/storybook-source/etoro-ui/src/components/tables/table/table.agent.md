# EtTable Component - Agent Guide

## When to use `EtTable` vs `EtList`

- Use **`EtTable`** when rows are composed of cells driven by a column descriptor (`columns: EtTableColumn[]` + `renderColumn(item, column)`), or when you need horizontal column scrolling, a fixed first column, or built-in cell formatters (currency, change%, etc.). The body is "a 2D cell grid" — think a holdings spreadsheet on a wide screen.
- Use **`EtList`** (`libs/etoro-ui/src/components/list/list/`) when each row is one opaque UI element (`EtAssetItem`, `EtPositionCard`, user card, …) and the columns above are just a labeled, optionally sortable header. No horizontal scroll, no fixed column, no per-cell formatting. The body is "a stack of self-rendering rows".

Concretely:

|                      | `EtTable.Column`                                        | `EtList.Column`                                   |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| What it is           | A vertical strip of cells driven by a column descriptor | A single label cell in the header row only        |
| Body row composition | `renderColumn(item, column)` per cell                   | `renderItem({ item })` returns one opaque element |
| Horizontal scroll    | Yes                                                     | No                                                |
| Fixed-column         | Yes                                                     | No                                                |

If both could plausibly fit, prefer `EtList` — its API surface is smaller and its mental model is closer to what most feature screens actually want. Reach for `EtTable` when you genuinely need the spreadsheet ergonomics (many columns, horizontal scroll, fixed first column, per-cell formatting).

## Overview

The `EtTable` is a composable React Native table component built with separate head, body, and row components. It supports dynamic colum5. **Performance monitoring**: Real-time performance optimization for smooth scrolling experience 6. **Glass morphism effects**: Configurable visual overlays for enhanced fixed column appearance

## Performance Features responsive layouts, infinite scrolling via FlashList, fixed column functionality with synchronized scrolling, and customizable rendering for table sections.

## Component Location

- Main component: [`et-table.tsx`](./et-table.tsx)
- Sub-components: [`components/et-table-head.tsx`](./components/et-table-head.tsx), [`components/et-table-body.tsx`](./components/et-table-body.tsx), [`components/et-table-row.tsx`](./components/et-table-row.tsx)
- Fixed column component: [`components/et-table-body-with-fixed-column.tsx`](./components/et-table-body-with-fixed-column.tsx)
- Configuration: [`components/table-config-provider.tsx`](./components/table-config-provider.tsx)
- Performance hooks: [`hooks/use-table-row-callbacks.ts`](./hooks/use-table-row-callbacks.ts)
- Tests: [`components/__tests__/`](./components/__tests__/) and [`__tests__/`](./__tests__/)
- Types: [`api/types.ts`](./api/types.ts)

## Key Features

- Composable architecture with separate head, body, and row components
- Dynamic column management with responsive width calculation
- Context-based configuration sharing
- Generic typing support (`<T>`) with infinite scrolling via FlashList
- **Fixed first column** with synchronized dual FlashList implementation
- **Performance-optimized scrolling** with hardware-adaptive throttling
- **Glass morphism effects** with configurable blur and gradient overlays
- Theme integration and accessibility support

## Architecture

### Component Structure

- `EtTable`: Main container providing layout and configuration context with optional horizontal scroll wrapping
- `EtTableHead`: Header component with customizable column rendering (auto-hidden in fixed column mode)
- `EtTableBody`: Body component with FlashList that automatically switches to fixed column mode when needed
- `EtTableBodyWithFixedColumn`: Specialized component for fixed column layout with dual synchronized FlashLists
- `EtTableRow`: Row component with customizable cell rendering and column override support
- `GlassOverlay`: Glass morphism overlay component for visual effects in fixed column mode

### Core Hooks

- `useTableConfig`: Context hook for accessing shared table configuration including fixed column setup
- `useMemoizedTableRowCallbacks`: Optimized callback extraction for fixed column mode rendering

### Utilities

- `column-utils.ts`: Column width calculations and visibility logic
- `render-utils.ts`: Style generators for headers, cells, containers, and performance constants
- `flash-list-utils.ts`: FlashList props filtering for fixed column mode

## Usage Examples

### Basic Table

```tsx
<EtTable id="basic-table" columns={columns} keyExtractor={(item, index) => item.id || index.toString()}>
  <EtTableHead />
  <EtTableBody
    items={data}
    renderItem={({ item }) => (
      <EtTableRow item={item} onRowClick={handleRowClick} renderColumn={(item, column) => <Text>{item[column.name]}</Text>} />
    )}
  />
</EtTable>
```

### Fixed First Column Table

```tsx
<EtTable
  id="fixed-column-table"
  columns={columns}
  fixFirstColumn
  keyExtractor={(item, index) => item.id}
>
  <EtTableBody
    items={data}
    renderHeaderColumn={(column) => (
      <EtText style={{ fontWeight: 'bold' }}>{column.title}</Text>
    )}
    renderItem={({ item }) => (
      <EtTableRow
        item={item}
        onRowClick={handleRowClick}
        renderColumn={(item, column) => (
          <CustomCell item={item} column={column} />
        )}
      />
    )}
  />
</EtTable>
```

### Fixed First Column Table with Glass Effects

```tsx
<EtTable id="glass-effects-table" columns={columns} fixFirstColumn keyExtractor={(item, index) => item.id}>
  <EtTableBody
    items={data}
    renderHeaderColumn={(column) => <EtText style={{ fontWeight: 'bold' }}>{column.title}</EtText>}
    renderItem={({ item }) => (
      <EtTableRow item={item} onRowClick={handleRowClick} renderColumn={(item, column) => <CustomCell item={item} column={column} />} />
    )}
    glassEffect={{
      enabled: true,
      blurIntensity: 10,
      gradientColors: ['rgba(0, 0, 0, 0.25)', 'rgba(64, 64, 64, 0.20)', 'rgba(128, 128, 128, 0.15)'],
      overlayStyle: {
        shadowColor: '#000000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
      },
    }}
  />
</EtTable>
```

### Custom Column Override

```tsx
<EtTableRow
  item={item}
  columnsOverride={[
    { name: 'name', title: 'Name', width: 120 },
    { name: 'action', title: 'Actions', width: 80 },
  ]}
  renderColumn={(item, column) => {
    if (column.name === 'action') {
      return <ActionButton onPress={() => handleAction(item)} />;
    }
    return <EtText>{item[column.name]}</EtText>;
  }}
/>
```

## Column Configuration

```tsx
const columns: EtTableColumn[] = [
  { name: 'name', title: 'Asset Name', visible: true, width: 150 },
  { name: 'price', title: 'Price', visible: true, width: 100 },
  { name: 'change', title: 'Change', visible: true, width: 80 },
  { name: 'volume', title: 'Volume', visible: true, width: 120 },
];
```

## Fixed Column Architecture

When `fixFirstColumn={true}` is enabled:

1. **EtTableHead** returns `null` (headers handled by body component)
2. **EtTableBody** switches to `EtTableBodyWithFixedColumn`
3. **renderHeaderColumn prop required**: Must provide `renderHeaderColumn` on `EtTableBody` for fixed column mode
4. **Dual FlashList setup**:
   - Left side: Fixed column with its own FlashList and header
   - Right side: Scrollable columns wrapped in horizontal ScrollView with shared FlashList and header
5. **Synchronized scrolling**: Both FlashLists sync their scroll positions with frame-time-aware throttling
6. **Performance monitoring**: Real-time performance optimization for smooth scrolling experience

## Performance Features

### Scroll Synchronization System

- **Frame time monitoring**: Uses `performance.now()` for precise timing measurements
- **Smooth state management**: Prevents scroll conflicts with efficient state tracking
- **Bi-directional sync**: Scrolling either fixed or moving columns syncs the other section

### Glass Morphism Features

- **Configurable blur effects**: Use `BlurView` with customizable intensity settings
- **Gradient overlays**: Support for custom gradient colors using `LinearGradient`
- **Professional styling**: Frosted glass appearance with shadow and elevation support
- **Automatic activation**: Effects activate when table is horizontally scrolled
- **Theme integration**: Default colors from eToro theme system
- **Performance optimized**: Positioned behind content with `zIndex: -1`

### Constants

```tsx
// From render-utils.ts
export const MIN_COLUMN_WIDTH = 60;
```

## Testing

```bash
# Run all UI kit tests
npm run test:libs:all

# Run specific EtTable tests
npx jest libs/etoro-ui/src/data-display/table/components/__tests__/
npx jest libs/etoro-ui/src/data-display/table/__tests__/

# Run tests with coverage
npx jest libs/etoro-ui/src/data-display/table --coverage

# Type check
npm run ts:check

# Lint
npm run lint
```

## Build Commands

- `npm run ts:check` - TypeScript validation
- `npm run lint` / `npm run lint:fix` - ESLint checking/fixing
- `npm run storybook` - Visual component testing

## Customization

- **Header rendering**: Use `renderColumn` prop on `EtTableHead` for custom header content (disabled in fixed column mode)
- **Cell rendering**: Use `renderColumn` prop on `EtTableRow` for custom cell content
- **Column override**: Use `columnsOverride` prop on `EtTableRow` to render specific columns independent of table configuration
- **Row interaction**: Use `onRowClick` prop on `EtTableRow` for row click handling
- **Fixed column layout**: Enable with `fixFirstColumn={true}` for split-screen scrolling
- **Performance tuning**: FlashList props can be customized via `flashListProps` parameter
- **Glass morphism effects**: Configure visual overlays via `glassEffect` prop with blur intensity, gradient colors, and styling options
- **Styling**: Use `style` props on individual components for custom styling

## Migration Notes

- **FlashList**: Component now uses `@shopify/flash-list` instead of FlatList for better performance
- **Fixed columns**: New architecture automatically handles complex fixed column scenarios
- **Header behavior**: Headers are automatically managed in fixed column mode
- **Performance**: Built-in scroll synchronization requires no additional configuration
- **Props filtering**: FlashList props are automatically filtered for fixed column mode compatibility
