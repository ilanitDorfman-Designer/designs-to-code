## Functional Requirements for eToro Table Component

### **Core Table Structure**

1. **Composable architecture**: Built with separate `EtTable`, `EtTableHead`, `EtTableBody`, and `EtTableRow` components
2. **Column configuration**: Accept array of column definitions with name, title, width, and visibility
3. **Container component**: `EtTable` provides layout container and shared configuration via context
4. **Fixed column support**: Advanced fixed first column implementation with synchronized scrolling

### **Column Management**

5. **Column definitions**: Simple column objects with `name`, `title`, `width`, and `visible` properties
6. **Responsive visibility**: Show/hide columns based on `visible` property
7. **Dynamic width calculation**: Automatic width distribution based on available table width
8. **Width constraints**: Columns are limited by available table width to prevent overflow
9. **Column override system**: Support for custom column configurations per row with `columnsOverride`

### **Component Structure**

10. **EtTable**: Main container component providing layout and configuration context
11. **EtTableHead**: Header component rendering column titles with custom render support (auto-hidden in fixed column mode)
12. **EtTableBody**: Body component using FlashList with automatic mode switching for fixed columns
13. **EtTableRow**: Row component rendering data cells with custom render support and column override capability
14. **EtTableBodyWithFixedColumn**: Specialized component for fixed column layout with dual FlashList implementation

### **Fixed Column Features**

15. **Horizontal scroll wrapping**: Automatic ScrollView wrapping when `fixFirstColumn` is false
16. **Dual FlashList architecture**: Separate FlashLists for fixed and scrollable columns with synchronized scrolling
17. **Performance-optimized synchronization**: Frame-time-aware performance monitoring for smooth scroll sync
18. **Independent column rendering**: Fixed and moving columns rendered separately with coordinated headers
19. **Required header renderer**: `renderHeaderColumn` prop must be provided on `EtTableBody` when `fixFirstColumn` is true

### **Data Handling**

20. **Generic typing**: Support for typed data items (`<T>`)
21. **FlashList integration**: Built-in infinite scrolling via FlashList with performance optimizations
22. **Custom key extraction**: Support for custom key extractor functions or automatic generation
23. **Item interaction**: Row click events with item data passed to handlers
24. **Memoized row callbacks**: Optimized callback extraction for fixed column mode

### **Rendering System**

25. **Custom column rendering**: Support for custom column renderers in both head and body
26. **Default cell rendering**: Automatic text rendering with fallback to 'n/a' for missing data
27. **Theme integration**: Built-in theme support using eToro design system colors
28. **Conditional header rendering**: Smart header rendering based on fixed column mode

### **Layout Options**

29. **Full height mode**: Toggle between fixed and full viewport height
30. **Responsive layout**: Dynamic width calculation based on screen dimensions
31. **Theme-aware styling**: Automatic color application based on current theme
32. **Fixed column layout**: Split-screen layout with fixed left column and horizontally scrollable right section

### **Configuration Context**

33. **Shared configuration**: Table configuration passed to child components via React Context
34. **Column distribution**: Automatic separation of first column and moving columns for fixed mode
35. **Scroll event handling**: Centralized scroll end event handling for infinite loading
36. **Context-aware rendering**: Components automatically adapt behavior based on configuration

### **Performance Features**

37. **FlashList optimizations**: Built-in performance settings (windowing, batch rendering). Note: do not pass `removeClippedSubviews` — FlashList v2 recycles internally and ignores it, so it reaches the native Android ScrollView and enables legacy subview clipping, which crashes in `dispatchDraw` on a null child.
38. **Efficient re-renders**: Memoized configuration context to prevent unnecessary re-renders
39. **Frame time monitoring**: Real-time performance tracking using `performance.now()` for scroll synchronization
40. **Bi-directional sync**: Scrolling either fixed or moving columns syncs the other section

### **Advanced Synchronization**

42. **Bi-directional scroll sync**: Scrolling either fixed or moving columns syncs the other section
43. **Performance-aware throttling**: Dynamic throttle adjustment based on measured frame times
44. **Smooth scroll state management**: Advanced state tracking to prevent scroll conflicts
45. **FlashList props filtering**: Automatic filtering of incompatible props for fixed column mode

### **Glass Morphism Effects**

46. **Configurable glass effects**: Optional glass morphism overlay for fixed columns when scrolled
47. **Blur intensity control**: Customizable blur intensity using `BlurView` component
48. **Gradient overlays**: Support for custom gradient colors with `LinearGradient`
49. **Professional visual effects**: Frosted glass appearance with configurable styling
50. **Automatic scroll state detection**: Glass effects activate automatically when horizontally scrolled

### **Integration Features**

51. **Theme system**: Integration with eToro theme system for consistent styling
52. **TypeScript support**: Full TypeScript support with generic data types
53. **Testing support**: Comprehensive test coverage with clear component boundaries
54. **FlashList props forwarding**: Support for custom FlashList properties while maintaining core functionality
55. **Hook access**: Export of `useTableConfig` hook for advanced component integration
