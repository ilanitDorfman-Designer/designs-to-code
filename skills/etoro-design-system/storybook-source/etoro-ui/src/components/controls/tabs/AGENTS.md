# EtTabs Component

A compound component for full-page swipeable tabbed interfaces.
Uses `react-native-tab-view` internally for native swipe gestures.
Supports both controlled and uncontrolled modes.

## Architecture

```text
tabs/
├── et-tabs.tsx                # Main component — composes Provider + Root, exports compound API
├── et-tabs.test.tsx           # Tests
├── index.ts                   # Public exports (EtTabs, useTabsContext, types)
├── AGENTS.md                  # This file
├── api/
│   ├── index.ts               # Barrel export
│   └── types.ts               # All TypeScript interfaces and type definitions
├── context/
│   ├── index.ts               # Barrel export
│   └── tabs-context.tsx       # TabsContext + useTabsContext hook (React 19 use())
├── hooks/
│   ├── index.ts               # Barrel export
│   ├── use-tabs-state.ts      # Controlled/uncontrolled state management
│   ├── use-tab-indicator.ts   # Animated indicator positioning (Reanimated SharedValues)
│   ├── use-tabs-children.ts   # Extracts routes, sceneMap, listElement from children
│   └── use-scroll-fade.ts     # Scroll fade overlay logic (overflow detection, RTL)
└── subcomponents/
    ├── index.ts               # Barrel export
    ├── tabs-provider.tsx       # Context provider — wires state + indicator hooks
    ├── tabs-root.tsx           # TabView wrapper — reads context, renders scenes
    ├── tabs-list.tsx           # Scrollable trigger container with fade overlays
    ├── tabs-trigger.tsx        # Individual tab button (registers layout for indicator)
    ├── tabs-content.tsx        # Marker component — children extracted by useTabsChildren
    ├── tabs-indicator.tsx      # Animated underline (Reanimated translateX + width)
    └── scroll-fade-overlay.tsx # Gradient fade overlay for scroll edges (LinearGradient)
```

## Key Patterns

### Compound Component Pattern

Uses `Object.assign` to attach subcomponents to the main export:

- `EtTabs` — Convenience wrapper that composes Provider + Root
- `EtTabs.Provider` — Context provider (state + indicator management)
- `EtTabs.Root` — TabView container (reads context, renders scenes)
- `EtTabs.List` — Scrollable container for triggers (variants: "line" | "plain")
- `EtTabs.Trigger` — Individual tab button
- `EtTabs.Content` — Marker component for tab content
- `EtTabs.Indicator` — Animated underline indicator

### Provider/Root Split

EtTabs is a convenience wrapper that combines Provider + Root for simple usage.
For advanced use cases (dependency injection, external state access), use them separately:

```tsx
<EtTabs.Provider defaultValue="overview">
  <EtTabs.Root>
    <EtTabs.List>...</EtTabs.List>
    <EtTabs.Content value="overview">...</EtTabs.Content>
  </EtTabs.Root>
  <ExternalComponentThatReadsTabState />
</EtTabs.Provider>
```

### Context Interface (State/Actions/Meta)

```typescript
interface TabsContextValue {
  state: {
    activeValue: string;
  };
  actions: {
    setActiveValue: (value: string) => void;
  };
  meta: {
    getTriggerLayouts: () => ReadonlyMap<string, TriggerLayout>;
    registerTrigger: (value: string, layout: TriggerLayout) => void;
    animateToValue: (value: string) => void;
    indicatorX: SharedValue<number>;
    indicatorWidth: SharedValue<number>;
    animationDuration: number;
  };
}
```

### Controlled/Uncontrolled Modes

- **Uncontrolled**: Use `defaultValue` prop
- **Controlled**: Use `value` + `onValueChange` props

### Content Extraction (TabView Integration)

`EtTabs.Content` is a **marker component** — its children are extracted by `useTabsChildren`
and rendered through TabView's `renderScene`. The component itself is never rendered in the
render tree (render output) during normal usage. Its render function serves as a fallback only.

### Lazy Loading (TabView)

`TabsRoot` sets `lazy={true}` by default (overriding `react-native-tab-view`'s own default of `false`). This means only the **active tab's content** is mounted on initial render — inactive tabs are not rendered until the user navigates to them. Once mounted, a tab stays mounted for the lifetime of the component.

- **Performance:** Lazy loading avoids mounting expensive content trees for tabs the user may never visit, reducing initial render time and memory usage.
- **Adjacent preloading:** Pass `lazyPreloadDistance={n}` to `EtTabs` (or `EtTabs.Root`) to mount `n` adjacent tabs ahead of time (e.g. `lazyPreloadDistance={1}` pre-mounts the tabs immediately before and after the active one).
- **Placeholder:** While a lazy tab is not yet mounted, TabView renders a placeholder. Override it with `renderLazyPlaceholder` on `EtTabs` / `EtTabs.Root`; the default shows a centered `ActivityIndicator`.
- **Disabling:** Set `lazy={false}` on `EtTabs` or `EtTabs.Root` to mount **all** tab content immediately. Use this when every tab is lightweight or when you need all tabs to start data fetching in parallel.

```tsx
// Eager — all tabs mounted immediately
<EtTabs defaultValue="tab1" lazy={false}>
  ...
</EtTabs>

// Lazy with preloading — active tab + 1 neighbour
<EtTabs defaultValue="tab1" lazyPreloadDistance={1}>
  ...
</EtTabs>
```

### Scroll Fade Overlays

`TabsList` is always horizontally scrollable. When tabs overflow, gradient fade overlays
appear at the edges. The `useScrollFade` hook manages this with Reanimated SharedValues
for 60fps animations. RTL layout is fully supported.

### Indicator Animation

`useTabIndicator` manages the animated indicator:

- Each `TabsTrigger` registers its layout (x, width) on mount/layout change
- `animateToValue` animates the indicator to the target tab's registered layout
- Uses Reanimated `withTiming` for smooth animations
- `TabsProvider` calls `animateToValue` in a `useEffect` when `activeValue` changes

### Accessibility

#### Supported Props by Subcomponent

| Subcomponent             | Key Accessibility Props                                                  | Notes                                                                                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EtTabs` / `EtTabs.Root` | `testID`                                                                 | Container `View`; `testID` passed to outer wrapper                                                                                                                                                                               |
| `EtTabs.Provider`        | —                                                                        | Context-only; no rendered element of its own                                                                                                                                                                                     |
| `EtTabs.List`            | `accessibilityLabel`, `testID`                                           | `accessibilityRole` is **omitted** from `TabsListProps` and hard-coded to `"tablist"` — consumers cannot override it. Extends `ViewProps` (minus `children` and `accessibilityRole`), so `accessibilityHint`, etc. are accepted. |
| `EtTabs.Trigger`         | `testID`, `accessibilityLabel`                                           | Extends `PressableProps` (minus `onPress`, `disabled`, `children`), so `accessibilityHint` is accepted. `accessibilityLabel` **defaults to the `children` text** when omitted.                                                   |
| `EtTabs.Content`         | `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`, `testID` | Extends `ViewProps` (minus `children`). **Marker component** — see note below on how content is actually rendered.                                                                                                               |

#### ARIA Semantics (React Native Accessibility Mapping)

EtTabs maps React Native accessibility props to platform-native equivalents (iOS `UIAccessibility`, Android `AccessibilityNodeInfo`) and to ARIA attributes on web via `react-native-web`:

| Element          | React Native prop                                       | ARIA equivalent                      | Set by                                                                 |
| ---------------- | ------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `EtTabs.List`    | `accessibilityRole="tablist"`                           | `role="tablist"`                     | Hard-coded in `TabsList` (after `...viewProps` spread, so always wins) |
| `EtTabs.Trigger` | `accessibilityRole="tab"`                               | `role="tab"`                         | Hard-coded in `TabsTriggerBase`                                        |
| `EtTabs.Trigger` | `accessibilityState={{ selected, disabled }}`           | `aria-selected`, `aria-disabled`     | Derived from context (`isSelected`) and `disabled` prop                |
| `EtTabs.Content` | `accessible={true}`, `accessibilityLabel="Tab content"` | `role` not set (defaults to generic) | Set in fallback render only                                            |

**Trigger → Content linkage (`aria-controls`):**
There is currently **no automatic `aria-controls` / `nativeID` linkage** between Trigger and Content. To achieve this on web targets, consumers must manually set `nativeID` on their content wrapper and pass a matching `aria-controls` via the Trigger's spread props:

```tsx
<EtTabs.Trigger
  value="overview"
  aria-controls="panel-overview"   // spread to Pressable
>
  Overview
</EtTabs.Trigger>
<EtTabs.Content value="overview" nativeID="panel-overview">
  ...
</EtTabs.Content>
```

> **Note on Content rendering:** `EtTabs.Content` is a marker component — its children are extracted by `useTabsChildren` and rendered through `TabView`'s `renderScene` inside a plain `<View style={{ flex: 1 }}>` in `TabsRoot`. The accessibility attributes on `TabsContent` itself (e.g. `accessible`, `accessibilityLabel`) only apply if the component is rendered outside the normal `EtTabs` flow. For proper `tabpanel` semantics, wrap your scene content:
>
> ```tsx
> <EtTabs.Content value="overview">
>   <View accessibilityRole="summary" nativeID="panel-overview">
>     <OverviewScreen />
>   </View>
> </EtTabs.Content>
> ```

#### Keyboard Interaction (Web / react-native-web)

On web targets, keyboard interaction follows the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

| Key                        | Behaviour                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Enter` / `Space`          | Activates the focused trigger (handled by `Pressable`'s built-in keyboard support)                   |
| `ArrowRight` / `ArrowLeft` | Not built-in — requires custom `onKeyDown` handler on `EtTabs.List` or individual triggers if needed |
| `Tab`                      | Moves focus into / out of the tab list (browser default)                                             |

On **native** (iOS / Android), VoiceOver and TalkBack provide swipe-based traversal; physical keyboard arrow-key handling is managed by the platform's accessibility focus engine and does not need custom implementation.

#### Focus Management on Tab Switch

- **Swipe navigation:** `react-native-tab-view` handles scene transitions natively. Screen-reader focus stays on the content pager area; VoiceOver announces the new scene automatically.
- **Press navigation:** When a `TabsTrigger` is pressed, `actions.setActiveValue` updates context, which triggers `TabView`'s `onIndexChange`. Focus remains on the pressed trigger — this is the correct WAI-ARIA "manual activation" pattern.
- **Controlled mode:** When the parent changes `value`, the same `useEffect` in `TabsProvider` fires `animateToValue` for the indicator. Focus is **not** programmatically moved — consumers should manage focus if their use case requires it (e.g. `ref.current?.focus()` on the new content panel).

#### RTL Support

- `useScrollFade` reads `I18nManager.isRTL` and swaps start/end fade opacity so gradient overlays appear on the correct edges.
- `useTabIndicator` does **not** adjust for RTL — `registerTrigger` records the `x` offset from the `onLayout` event, which React Native already mirrors in RTL. No additional transform is needed.
- `ScrollFadeOverlay` positions itself with `left: 0` (start) or `right: 0` (end) and flips via `transform: [{ scaleX: -1 }]` in RTL — verify that the fade direction stays correct when adding new triggers.

#### Animated Indicator & Screen Readers

`useTabIndicator` drives the indicator with Reanimated `SharedValue`s (`indicatorX`, `indicatorWidth`). This is purely decorative and **does not affect the accessibility tree** — screen readers ignore Reanimated transforms.

Key points for implementers:

- **`registerTrigger` and layout:** Each `TabsTrigger` calls `meta.registerTrigger(value, { x, width })` in its `onLayout` handler. If you create a custom trigger, you **must** call `registerTrigger` to keep the indicator working; omitting it will not break screen readers but will break the visual indicator.
- **`onLayout` composition:** Both `TabsList` and `TabsTrigger` compose consumer-provided `onLayout` with their internal handler — pass `onLayout` freely without breaking indicator tracking or scroll-fade sizing.
- **Animation duration:** `TabsProvider`'s `animationDuration` prop controls `withTiming` duration. Keep it ≤ 300 ms to respect reduced-motion preferences (a future enhancement could check `AccessibilityInfo.isReduceMotionEnabled` and set duration to 0).

#### Accessible Usage Examples

**Uncontrolled mode with accessibility props:**

```tsx
<EtTabs defaultValue="overview" testID="profile-tabs">
  <EtTabs.List accessibilityLabel="Profile sections">
    <EtTabs.Trigger value="overview" testID="trigger-overview" accessibilityLabel="Overview tab" accessibilityHint="Shows account overview">
      Overview
    </EtTabs.Trigger>
    <EtTabs.Trigger value="portfolio" testID="trigger-portfolio" accessibilityHint="Shows portfolio details">
      Portfolio
    </EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">
    <OverviewScreen />
  </EtTabs.Content>
  <EtTabs.Content value="portfolio">
    <PortfolioScreen />
  </EtTabs.Content>
</EtTabs>
```

**Controlled mode with accessibility props:**

```tsx
const [activeTab, setActiveTab] = useState('overview');

<EtTabs value={activeTab} onValueChange={setActiveTab} testID="profile-tabs">
  <EtTabs.List accessibilityLabel="Profile sections">
    <EtTabs.Trigger value="overview" accessibilityLabel="Overview tab">
      Overview
    </EtTabs.Trigger>
    <EtTabs.Trigger value="portfolio" accessibilityLabel="Portfolio tab">
      Portfolio
    </EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">
    <OverviewScreen />
  </EtTabs.Content>
  <EtTabs.Content value="portfolio">
    <PortfolioScreen />
  </EtTabs.Content>
</EtTabs>;
```

**Split Provider/Root with accessibility (advanced):**

```tsx
<EtTabs.Provider defaultValue="overview">
  <EtTabs.Root testID="tabs-root">
    <EtTabs.List accessibilityLabel="Dashboard tabs">
      <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
      <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
    </EtTabs.List>
    <EtTabs.Content value="overview">
      <OverviewScreen />
    </EtTabs.Content>
    <EtTabs.Content value="analytics">
      <AnalyticsScreen />
    </EtTabs.Content>
  </EtTabs.Root>
  {/* External component can read context without affecting a11y tree */}
  <TabSummaryBadge />
</EtTabs.Provider>
```

#### Hooks That Must Preserve Accessibility

| Hook                                    | A11y concern                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useScrollFade`                         | Manages `ScrollView` scroll handler and fade overlays. The `Animated.ScrollView` must **not** have `accessible={false}` or `importantForAccessibility="no"` — doing so would hide trigger children from screen readers. The fade overlays (`ScrollFadeOverlay`) are decorative and do not interfere with the a11y tree. |
| `useTabIndicator`                       | `registerTrigger` is called from `onLayout` — avoid wrapping triggers in containers that suppress layout events (`display: 'none'`, `opacity: 0` with `pointerEvents: 'none'`). Indicator `SharedValue`s are decorative-only.                                                                                           |
| `useTabsState`                          | Drives `accessibilityState.selected` on triggers via `state.activeValue`. In controlled mode, stale `value` props will cause selected state to be out of sync with the visual indicator — always keep `value` and `onValueChange` in sync.                                                                              |
| `TabsProvider` / `TabsRoot` integration | `TabsProvider` fires `animateToValue` in a `useEffect` when `activeValue` changes. `TabsRoot` converts between value/index for `TabView`. Neither component modifies accessibility focus — if you need focus to move to the new panel on tab change, handle it in `onValueChange`.                                      |

## Usage Examples

```tsx
// Uncontrolled
<EtTabs defaultValue="overview">
  <EtTabs.List>
    <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">Content here</EtTabs.Content>
  <EtTabs.Content value="analytics">Analytics content</EtTabs.Content>
</EtTabs>

// Controlled
const [tab, setTab] = useState('overview');
<EtTabs value={tab} onValueChange={setTab}>
  ...
</EtTabs>

// With variants and options (lazy is true by default)
<EtTabs defaultValue="tab1" swipeEnabled={false}>
  <EtTabs.List variant="plain">
    ...
  </EtTabs.List>
  ...
</EtTabs>
```

## Dependencies

- `react-native-tab-view` — Full-page swipeable tab navigation
- `react-native-reanimated` — Indicator animation (SharedValues, withTiming)
- `expo-linear-gradient` — Scroll fade overlays
- `etoro-ui/core/hooks` — Theme (useEtoroTheme)
- `etoro-ui/foundations/text` — EtText for trigger labels

## Developer Resources

- **Test suite** — `et-tabs.test.tsx` (same directory). Comprehensive coverage of component structure, compound component exports, controlled & uncontrolled modes, tab selection & switching, disabled state, `line`/`plain` variants, accessibility roles & labels, context error boundaries, `onLayout` composition, lazy rendering, and edge cases (rapid rerenders, single tab). Start here when verifying behaviour or adding new features.
- **Storybook (intro)** — `.rnstorybook/stories/components/controls/tabs/et-tabs.intro.stories.tsx`. Interactive documentation stories showcasing common configurations, prop combinations, and visual variants. Useful for design review and manual QA.
- **Storybook (stories)** — `.rnstorybook/stories/components/controls/tabs/et-tabs.stories.tsx`. Additional playground stories for ad-hoc exploration and edge-case testing in the Storybook dev environment.
