# EtScreen Component - Agent Guide

## Overview

`EtScreen` is the primary screen container component in the etoro-ui library. It replaces the legacy _screen-container_ role that `EtView` / `EtScrollView` used to play, with a modern compound component pattern that provides better composability, type safety, and developer experience.

> **Note on `EtView` / `EtScrollView`.** Those names have been **revived** for a different role: they are now neutral **region/content containers** (`/libs/etoro-ui/src/components/view/`) — a plain `View`/`ScrollView` until handed `loading` + `skeleton`, at which point they crossfade skeleton → content. They are **not** screen containers and never take a `topBar` prop. The screen root is still `EtScreen` / `EtScreenV2`. See `libs/etoro-ui/src/components/view/AGENTS.md`.

**Location:** `/libs/etoro-ui/src/components/screen/et-screen.tsx`

> **`EtScreen` (v1) vs `EtScreenV2`.** Everything below the next section describes the v1 compound API. `EtScreenV2` is a different, intentionally smaller contract — read **[EtScreenV2](#etscreenv2)** first if you are building a new screen.

## EtScreenV2

**Location:** `/libs/etoro-ui/src/components/screen/et-screen-v2.tsx`

`EtScreenV2` is **only a wrapper and a scroll provider.** It owns the safe area, base background/halo, and a per-screen `scrollY` shared value — and nothing else. It deliberately does **not** ship body/list/topbar/scroll-container subcomponents. You compose the screen yourself with normal components (`EtTopbar`, `View`, `ScrollView`, `FlatList`) or `@shopify/flash-list` as **direct children**.

### What it exposes

`EtScreenV2` exposes no attached subcomponents. Do not write `EtScreenV2.TopBar`, `EtScreenV2.FlashList`, `EtScreenV2.View`, etc.

- Use `EtTopbar` directly when the screen needs a top bar.
- Use `EtScreenOverlay` directly only for the special overlay behavior: content hoisted above the body / behind chrome (progressive blur, scroll-driven titles). Registering one opts the screen into the "content scrolls behind top chrome" pattern, so V2 stops adding the top inset and **you** own top spacing (e.g. `contentContainerStyle.paddingTop = headerAreaHeight`).

There is **no** `EtScreenV2.TopBar`, `.Body`, `.View`, `.ScrollView`, `.FlashList`, `.Header`, `.Content`, or `.Footer`. If you reach for one of these, you are using the wrong component — render the primitive/direct component instead.

```tsx
// ✅ V2: wrapper + normal direct children
<EtScreenV2 animateHalo>
  <EtTopbar>
    <EtTopbar.Start>
      <EtIconButton iconName="chevronLeft" onPress={router.back} />
    </EtTopbar.Start>
  </EtTopbar>
  <FlatList data={items} renderItem={renderRow} {...scrollHandlers} />
</EtScreenV2>

// ❌ V2 does not have topbar/body/list subcomponents
<EtScreenV2>
  <EtScreenV2.TopBar />        {/* use EtTopbar directly */}
  <EtScreenV2.FlashList ... />   {/* removed */}
  <EtScreenV2.View>...</EtScreenV2.View>  {/* never existed */}
</EtScreenV2>
```

### Hooking a list or view onto the halo (`useScrollHandlers`)

Because V2 doesn't own the scroll component, the child that _does_ scroll must feed its scroll position back to the screen. The screen's halo (and any other scroll-driven UI) reacts to the per-screen `scrollY` shared value, which a child publishes via `useScrollHandlers()`.

Two moving parts:

1. Set `animateHalo` on `<EtScreenV2>` to enable the halo.
2. In the **scroll owner**, call `useScrollHandlers()` and spread the returned `onScroll` + `scrollEventThrottle` onto the scroll component. The handler writes `contentOffset.y` into the screen's `scrollY` on the UI thread (no React re-render per frame), and the halo animates off it automatically.

```tsx
import { EtScreenV2, EtTopbar, useScrollHandlers } from 'etoro-ui';
import { FlatList } from 'react-native';

function InstrumentsScreen() {
  // onScroll/scrollEventThrottle wire the list into the screen's scrollY.
  const scrollHandlers = useScrollHandlers();

  return (
    <EtScreenV2 animateHalo>
      <EtTopbar>
        <EtTopbar.Start>
          <EtIconButton iconName="chevronLeft" onPress={router.back} />
        </EtTopbar.Start>
      </EtTopbar>

      <FlatList
        data={instruments}
        renderItem={({ item }) => <InstrumentRow item={item} />}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandlers.onScroll}
        scrollEventThrottle={scrollHandlers.scrollEventThrottle}
      />
    </EtScreenV2>
  );
}
```

`useScrollHandlers` also accepts your own `onScroll` (composed, fired after the internal `scrollY` update) and a custom `scrollEventThrottle` (default `16`):

```tsx
const scrollHandlers = useScrollHandlers({
  onScroll: (e) => myAnalytics(e.nativeEvent.contentOffset.y),
  scrollEventThrottle: 16,
});
```

**A non-scrolling `View` body** doesn't need any of this — drop it straight in. With `animateHalo` set it still shows the base halo; there's simply no scroll position to animate from:

```tsx
<EtScreenV2 animateHalo>
  <View style={{ flex: 1 }}>
    <StaticContent />
  </View>
</EtScreenV2>
```

### Siblings reading the scroll position

`useScrollHandlers()` returns the same `scrollY` shared value to every caller on the screen. A **sibling** (e.g. a collapsible header that hides on scroll-down) ignores `onScroll` and reads `scrollY` directly inside a worklet — `useAnimatedStyle` / `useAnimatedReaction` — so the scroll owner and the reactive UI share one source of truth without prop drilling. The watchlist's collapsible header is a live example (`libs/features/watchlist/.../collapsible-watchlist-header`).

### When to use V2 vs v1

- **V2** — new screens that want full control of their own body/scroller and just need the screen chrome + halo + scroll context. Bring your own `FlatList`/`ScrollView`/`View`.
- **v1 (`EtScreen`)** — existing screens already using the compound body API (`EtScreen.ScrollView` / `.FlashList` / `.View` / `.Content` / `.Footer`). Documented below.

## Key Concepts

### Compound Component Pattern

`EtScreen` uses a compound component pattern where the main component has subcomponents attached to it:

```tsx
<EtScreen>
  <EtScreen.TopBar />
  <EtScreen.ScrollView>{/* optional: <EtScreen.Content> … Title / Subtitle / Body … </EtScreen.Content> */}</EtScreen.ScrollView>
  {/* optional: <EtScreen.Footer sticky>…</EtScreen.Footer> */}
</EtScreen>
```

Pick exactly one main body container: `EtScreen.ScrollView`, `EtScreen.View`, or `EtScreen.FlashList` (see their sections). Optional `EtScreen.Content` and `EtScreen.Footer` layer on top for structured steps and actions.

This pattern provides:

- **Better composition** - Mix and match subcomponents as needed
- **Cleaner API** - No prop drilling, each subcomponent handles its own configuration
- **Type safety** - Full TypeScript support with proper inference
- **Context-based** - Internal state sharing without explicit prop passing

### Architecture

```text
EtScreen (Root)
├── ScreenContextProvider (manages shared state)
├── EtScreen.TopBar (optional)
│   ├── TopBar.Start (optional - leading content, defaults based on isInnerScreen)
│   ├── TopBar.Middle (optional - centered content, typically a Title)
│   ├── TopBar.End (optional - trailing content)
│   ├── TopBar.Action (utility - pressable action button, re-exported from EtTopbar)
│   └── TopBar.Title (utility - centered text, re-exported from EtTopbar)
├── EtScreen.Header (optional - extended header, slides up when TopBar collapses)
├── EtScreen.ScrollView OR EtScreen.FlashList OR EtScreen.View (required - choose one)
│   └── EtScreen.Content (optional — wizard / form layouts inside ScrollView or View only)
│       ├── Content.Title
│       ├── Content.Subtitle (secondary line under the title; replaces the old `Description` slot name)
│       ├── Content.Disclaimer
│       └── Content.Body
└── EtScreen.Footer (optional — Primary / Secondary / Ghost; `sticky` pins below the scroll area)
```

Place `EtScreen.Content` inside `EtScreen.ScrollView` or `EtScreen.View`. Use `EtScreen.Footer` either inside the scroll container (scrolls with content) or as a direct child of `EtScreen` with `sticky` for a bottom bar that respects the safe area.

## Component API

### `<EtScreen>`

Root container component that provides context to all subcomponents.

**Props:**

- `children`: React.ReactNode - Must contain EtScreen subcomponents
- `style`: StyleProp<ViewStyle> - Optional style overrides
- `animateHalo`: boolean - Enable global halo animation (default: false)
- `gradient`: object - Background gradient configuration
  - `colors`: string[] - Gradient color stops
  - `start`: { x: number, y: number } - Gradient start point
  - `end`: { x: number, y: number } - Gradient end point

**Example:**

```tsx
<EtScreen animateHalo style={{ backgroundColor: colors.backgroundBase }}>
  {/* subcomponents */}
</EtScreen>
```

### `<EtScreen.TopBar>`

Configures the TopBar for the screen using nested compound components.

**Props:**

- `children`: React.ReactNode - TopBar subcomponents
- `isInnerScreen`: boolean - Shows back button instead of menu (default: false)
- `animation`: 'fade' | 'collapse' | 'none' - Scroll animation type (default: 'collapse')
- `animationOptions`: object - Animation configuration
  - `threshold`: number - Scroll threshold for direction change (default: 5)
  - `animationDuration`: number - Animation duration in ms (default: 300)
  - `minScrollPosition`: number - Min scroll before animation starts (default: 10)
- `blurEffect`: boolean - Apply blur to TopBar background (default: true)

**Example:**

```tsx
<EtScreen.TopBar isInnerScreen animation="collapse">
  <EtScreen.TopBar.Start>
    <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={router.back}>
      <EtoroIcon name="chevronLeft" size={24} />
    </EtScreen.TopBar.Action>
  </EtScreen.TopBar.Start>
  <EtScreen.TopBar.Middle>
    <EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
  </EtScreen.TopBar.Middle>
  <EtScreen.TopBar.End>
    <EtScreen.TopBar.Action accessibilityLabel="Search" onPress={openSearch}>
      <EtoroIcon name="search" size={24} />
    </EtScreen.TopBar.Action>
  </EtScreen.TopBar.End>
</EtScreen.TopBar>
```

### `<EtScreen.TopBar.Start>`

Custom content for the leading (start) side. When not provided, a default button is shown based on `isInnerScreen` (back button for inner screens, menu button for root screens).

**Props:**

- `children`: React.ReactNode - Leading content

**Example:**

```tsx
<EtScreen.TopBar.Start>
  <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={router.back}>
    <EtoroIcon name="chevronLeft" size={24} />
  </EtScreen.TopBar.Action>
</EtScreen.TopBar.Start>
```

### `<EtScreen.TopBar.Middle>`

Centered content between Start and End slots. Absolutely positioned so it stays centered regardless of slot widths. Typically used with `EtScreen.TopBar.Title`.

**Props:**

- `children`: React.ReactNode - Centered content

**Example:**

```tsx
<EtScreen.TopBar.Middle>
  <EtScreen.TopBar.Title>Settings</EtScreen.TopBar.Title>
</EtScreen.TopBar.Middle>
```

### `<EtScreen.TopBar.End>`

Content for the trailing (end) side of the TopBar.

**Props:**

- `children`: React.ReactNode - Single button or multiple buttons

**Example:**

```tsx
<EtScreen.TopBar.End>
  <EtScreen.TopBar.Action accessibilityLabel="Notifications" onPress={openNotifications}>
    <EtoroIcon name="notification" size={24} />
  </EtScreen.TopBar.Action>
  <EtScreen.TopBar.Action accessibilityLabel="More" onPress={openMenu}>
    <EtoroIcon name="more" size={24} />
  </EtScreen.TopBar.Action>
</EtScreen.TopBar.End>
```

### `<EtScreen.TopBar.Action>`

A pressable action button with built-in hit slop and accessibility support. Re-exported from `EtTopbar.Action`.

**Props:** Extends React Native `PressableProps`

- `accessibilityLabel`: string - Required for screen readers
- `onPress`: () => void - Press handler
- `hitSlop`: number - Touch hit slop (default: 10)

**Example:**

```tsx
<EtScreen.TopBar.Action accessibilityLabel="Search" onPress={openSearch}>
  <EtoroIcon name="search" size={24} />
</EtScreen.TopBar.Action>
```

### `<EtScreen.TopBar.Title>`

A centered text component for header titles. Re-exported from `EtTopbar.Title`.

**Props:** Extends `EtTextProps`

- `variant`: EtTextVariant - Text style variant (default: 'heading-compact')
- `numberOfLines`: number - Max lines before truncation (default: 1)

**Example:**

```tsx
<EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
```

### `<EtScreen.Header>`

Extended header content rendered below the TopBar. Use as a **sibling** of `EtScreen.TopBar` (not a child).

By default, when the TopBar collapses on scroll, the header **slides up** to take the TopBar's place and stays visible. Set `collapseWithTopBar` to collapse both together.

**Props:**

- `children`: React.ReactNode - Extended header content (search bars, tabs, filters)
- `collapseWithTopBar`: boolean - When true, the header collapses together with the TopBar (default: false)

**Example (default - header stays visible):**

```tsx
<EtScreen>
  <EtScreen.TopBar>
    <EtScreen.TopBar.Start>
      <MenuButton />
    </EtScreen.TopBar.Start>
  </EtScreen.TopBar>
  <EtScreen.Header>
    <SearchBar />
    <TabNavigation />
  </EtScreen.Header>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>
```

**Example (collapses with TopBar):**

```tsx
<EtScreen>
  <EtScreen.TopBar />
  <EtScreen.Header collapseWithTopBar>
    <PromoBanner />
  </EtScreen.Header>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>
```

### `<EtScreen.ScrollView>`

Scrollable content area with scroll event handling and animations.

**Props:** Extends React Native `ScrollViewProps`

- All standard ScrollView props are supported
- `children`: React.ReactNode - Scrollable content
- `keyboardAware?: boolean` - Opt-in keyboard-aware scrolling. When `true`, the
  scroll container is rendered as `KeyboardAwareScrollView` (from
  `react-native-keyboard-controller`) so the focused `TextInput` is
  automatically scrolled above the soft keyboard. Default: `false`.
- `keyboardBottomOffset?: number` - Distance (in px) kept between the focused
  input and the top of the keyboard. Forwarded as `bottomOffset`. Ignored when
  `keyboardAware` is `false`. Default: `24`.

**Example:**

```tsx
<EtScreen.ScrollView>
  <Feed />
  <AdditionalContent />
</EtScreen.ScrollView>
```

**Example (keyboard-aware form):**

```tsx
<EtScreen.ScrollView keyboardAware keyboardShouldPersistTaps="handled">
  <EtScreen.Content>
    <TextInput />
  </EtScreen.Content>
  <EtScreen.Footer>
    <EtScreen.Footer.Primary onPress={onSubmit}>Submit</EtScreen.Footer.Primary>
  </EtScreen.Footer>
</EtScreen.ScrollView>
```

> **Requirement:** when `keyboardAware` is enabled, an ancestor must wrap the
> tree in `<KeyboardProvider>` (from `react-native-keyboard-controller`).
> Without it, the auto-scroll behaviour is silently disabled. The mobile app
> sets up the provider per feature (e.g. `KycLayout`); Storybook does this in
> `.rnstorybook/preview.tsx`.
>
> Internally, `EtScreen.ScrollView` uses `mode="layout"` so the keyboard space
> participates in flex layout — required for footers pinned via
> `marginTop: 'auto'` and for manual scroll past the visible viewport while
> the keyboard is open.

### `<EtScreen.FlashList>`

Virtualized list container using `@shopify/flash-list`. Automatically handles scroll tracking for TopBar animations and header padding, just like `EtScreen.ScrollView`.

**Props:** Extends `FlashListProps<T>` from `@shopify/flash-list`

- All standard FlashList props are supported (`data`, `renderItem`, `keyExtractor`, etc.)
- TopBar padding and scroll animation are handled automatically

**Example:**

```tsx
<EtScreen.FlashList
  data={items}
  renderItem={({ item }) => <ItemRow item={item} />}
  keyExtractor={(item) => item.id}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

### `<EtScreen.View>`

Non-scrollable content area. Use when you have a custom internal scroller (custom Feed component, etc.).

**Props:** Extends React Native `ViewProps`

- All standard View props are supported
- `children`: React.ReactNode - Content

**Example:**

```tsx
<EtScreen.View>
  <CustomFeedComponent onScroll={handleScroll} />
</EtScreen.View>
```

### `<EtScreen.Content>`

Structured layout for onboarding- and wizard-style screens. Extends React Native `ViewProps`. Must live inside `EtScreen.ScrollView` or `EtScreen.View` — not as a substitute for the `FlashList` scroll container (use `FlashList` for virtualized lists).

**Subcomponents:**

- `EtScreen.Content.Title` — primary heading (`children`: string)
- `EtScreen.Content.Subtitle` — secondary line under the title (`children`: string)
- `EtScreen.Content.Disclaimer` — small helper or legal line below the subtitle
- `EtScreen.Content.Body` — main interactive content (`children`: `ReactNode`)

Title, Subtitle, and Disclaimer use string `children`; Body accepts any `ReactNode`. All four support optional `alignment?: 'left' | 'center' | 'right'` (default `'left'`).

**Exported types (from `etoro-ui`):** `EtScreenContentProps`, `EtScreenContentTitleProps`, `EtScreenContentSubtitleProps`, `EtScreenContentDisclaimerProps`, `EtScreenContentBodyProps`, `EtScreenContentAlignment`.

**Example:**

```tsx
<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Personal details</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>Fill in the form below to continue.</EtScreen.Content.Subtitle>
      <EtScreen.Content.Body>
        <NameForm />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.ScrollView>
  <EtScreen.Footer sticky>
    <EtScreen.Footer.Primary onPress={onNext}>Next</EtScreen.Footer.Primary>
  </EtScreen.Footer>
</EtScreen>
```

### `<EtScreen.Footer>`

Footer area with full-width button presets. **Inline (default):** place inside `EtScreen.ScrollView` so it scrolls with content. **Sticky:** set `sticky` and place as a direct child of `EtScreen` (typically after `ScrollView`) to pin above the bottom safe area.

**Subcomponents:** `EtScreen.Footer.Primary`, `.Secondary`, `.Ghost` — large, stretched `EtButton` variants (`primary-filled`, `primary-subtle`, `primary-ghost`).

**Props:** `sticky?: boolean` (default `false`), plus `View` style props where applicable.

## Common Usage Patterns

### 1. Home Screen (Root Screen with Menu)

```tsx
export function HomeScreen() {
  return (
    <EtScreen animateHalo>
      <EtScreen.TopBar />
      <EtScreen.ScrollView>
        <PortfolioOverview />
        <Feed />
      </EtScreen.ScrollView>
    </EtScreen>
  );
}
```

**Notes:**

- No `isInnerScreen` prop - defaults to false, showing menu button
- `animateHalo` enables the green halo animation
- `EtScreen.ScrollView` for scrollable content

### 2. Inner Screen with Back Button

```tsx
export function MarketScreen({ instrument }: MarketScreenProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtScreen style={{ backgroundColor: colors.backgroundBase }}>
      <EtScreen.TopBar isInnerScreen>
        <EtScreen.TopBar.Start>
          <BackButton />
        </EtScreen.TopBar.Start>
        <EtScreen.TopBar.End>
          <NotificationButton />
          <MoreButton />
        </EtScreen.TopBar.End>
      </EtScreen.TopBar>
      <EtScreen.View>
        <MarketContent />
      </EtScreen.View>
    </EtScreen>
  );
}
```

**Notes:**

- `isInnerScreen` shows back button instead of menu
- `EtScreen.View` used because MarketContent has internal scrolling
- End slot for additional action buttons

### 3. Screen with FlashList (Virtualized List)

```tsx
export function InstrumentsScreen() {
  return (
    <EtScreen>
      <EtScreen.TopBar isInnerScreen animation="collapse">
        <EtScreen.TopBar.Start>
          <EtIconButton iconName="chevronLeft" onPress={router.back} />
        </EtScreen.TopBar.Start>
      </EtScreen.TopBar>
      <EtScreen.FlashList
        data={instruments}
        renderItem={({ item }) => <InstrumentRow item={item} />}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
      />
    </EtScreen>
  );
}
```

**Notes:**

- `EtScreen.FlashList` handles scroll tracking and TopBar animations automatically
- Full `@shopify/flash-list` API is available
- No manual scroll event wiring needed

### 3b. Screen with Custom Internal Scroller

```tsx
export function UserScreen() {
  const scrollY = useSharedValue(0);
  useScrollHandler({ externalScrollY: scrollY });

  const handleFeedScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = e.nativeEvent.contentOffset.y;
    },
    [scrollY],
  );

  return (
    <EtScreen animateHalo>
      <EtScreen.TopBar isInnerScreen>
        <EtScreen.TopBar.Start>
          <EtIconButton iconName="chevronLeft" onPress={router.back} />
        </EtScreen.TopBar.Start>
      </EtScreen.TopBar>
      <EtScreen.View>
        <Feed onScroll={handleFeedScroll} header={<ProfileHeader />} />
      </EtScreen.View>
    </EtScreen>
  );
}
```

**Notes:**

- Use `EtScreen.View` when content has its own custom scroller
- Manually connect scroll events for halo animation
- `Feed` component handles its own scrolling

### 4. Screen with Extended Header (Search, Tabs)

```tsx
export function SearchScreen() {
  return (
    <EtScreen>
      <EtScreen.TopBar isInnerScreen>
        <EtScreen.TopBar.Start>
          <BackButton />
        </EtScreen.TopBar.Start>
      </EtScreen.TopBar>
      <EtScreen.Header>
        <SearchBar placeholder="Search instruments..." />
        <CategoryChips />
      </EtScreen.Header>
      <EtScreen.ScrollView>
        <SearchResults />
      </EtScreen.ScrollView>
    </EtScreen>
  );
}
```

**Notes:**

- `EtScreen.Header` is a sibling of `EtScreen.TopBar`, not a child
- Search bar and category chips animate together with the TopBar
- They will collapse/fade with the TopBar if animations are enabled

### 5. Extracting TopBar to Separate Component

For cleaner code organization:

```tsx
// market-screen-top-bar.tsx
export const MarketScreenTopBar = memo(() => {
  return (
    <EtScreen.TopBar isInnerScreen>
      <EtScreen.TopBar.Start>
        <BackButton />
      </EtScreen.TopBar.Start>
      <EtScreen.TopBar.End>
        <ClosePriceAlertMode />
        <MoreButton />
      </EtScreen.TopBar.End>
    </EtScreen.TopBar>
  );
});

// market-screen.tsx
export function MarketScreen() {
  return (
    <EtScreen style={{ backgroundColor: colors.backgroundBase }}>
      <MarketScreenTopBar />
      <EtScreen.View>
        <MarketContent />
      </EtScreen.View>
    </EtScreen>
  );
}
```

**Benefits:**

- Cleaner main screen component
- Reusable TopBar configuration
- Easier to test TopBar in isolation

## Important Considerations

### 1. Choose the Right Content Component

**Use `EtScreen.ScrollView` when:**

- ✅ Content is static and needs to scroll
- ✅ You want automatic scroll event handling
- ✅ You want TopBar animations to work automatically
- ✅ Simple list of components

**Use `EtScreen.FlashList` when:**

- ✅ You have a large dataset that needs virtualized rendering
- ✅ You want automatic TopBar animation support with FlashList
- ✅ You need the full `@shopify/flash-list` API

**Use `EtScreen.View` when:**

- ✅ Content has its own custom scroller (custom Feed component)
- ✅ You need fine-grained scroll control
- ✅ Content might not scroll at all

### 2. Scroll Event Handling

If using `EtScreen.View` with internal scrollers and you want halo animation:

```tsx
const scrollY = useSharedValue(0);
useScrollHandler({ externalScrollY: scrollY });

const handleScroll = useCallback(
  (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
  },
  [scrollY],
);

<EtScreen.View>
  <Feed onScroll={handleScroll} />
</EtScreen.View>;
```

### 3. TopBar is Optional

You can have a screen without a TopBar:

```tsx
<EtScreen>
  <EtScreen.View>
    <CustomFullScreenContent />
  </EtScreen.View>
</EtScreen>
```

### 4. Context-Based Architecture

EtScreen uses React Context internally. All subcomponents communicate through context:

- No prop drilling required
- Type-safe context usage
- Clean separation of concerns
- Each subcomponent registers its configuration independently

### 5. Safe Area Handling

`EtScreen` automatically handles safe areas:

- Top safe area is handled by TopBar
- Bottom safe area is your responsibility (use `useSafeAreaInsets` if needed)
- Side safe areas are automatically handled by `SafeAreaView`

## Migration from the legacy EtView/EtScrollView _screen containers_

If you encounter old code using `EtView` / `EtScrollView` **as a screen container** (i.e. with a `topBar` prop), migrate it to `EtScreen`. This is unrelated to the revived `EtView` / `EtScrollView` region containers — those take `loading`/`skeleton`, never `topBar`.

**Old Pattern (legacy screen container):**

```tsx
<EtScrollView
  topBar={{
    isInnerScreen: true,
    backButtonComponent: <BackButton />,
    trailingActions: <MoreButton />,
  }}
>
  <Content />
</EtScrollView>
```

**New Pattern (EtScreen):**

```tsx
<EtScreen>
  <EtScreen.TopBar isInnerScreen>
    <EtScreen.TopBar.Start>
      <BackButton />
    </EtScreen.TopBar.Start>
    <EtScreen.TopBar.End>
      <MoreButton />
    </EtScreen.TopBar.End>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>
```

## Do's and Don'ts

### ✅ Do:

- Use `EtScreen` for all screen-level containers
- Extract complex TopBar configurations to separate components
- Use `EtScreen.View` when you have internal scrollers
- Use `EtScreen.ScrollView` for simple scrollable content
- Use `EtScreen.Content` + `EtScreen.Footer` for wizard-style steps (title, subtitle, body, actions)
- Leverage the compound pattern for clean composition
- Use TypeScript - all components have full type support

### ❌ Don't:

- Don't use `EtScreen` for inner layout components (use regular `View` instead)
- Don't nest `EtScreen` components
- Don't use multiple content containers (`ScrollView`, `FlashList`, `View`) in the same screen
- Don't pass TopBar props directly to `EtScreen` (use `EtScreen.TopBar` instead)
- Don't use `EtView` / `EtScrollView` as **screen containers** — they are region/content containers now (use `EtScreen` for the screen root)
- Don't forget to handle scroll events if using `EtScreen.View` with animations

## Troubleshooting

### TopBar not showing

- Ensure `<EtScreen.TopBar>` is a direct child of `<EtScreen>`
- Check that you're not conditionally rendering the TopBar in a way that breaks context

### Scroll animations not working

- If using `EtScreen.View`, ensure you're manually updating scrollY
- Check that `animation` prop is not set to `'none'`
- Verify `EtScreen.ScrollView` is being used if you want automatic animation

### Halo not animating

- Ensure `animateHalo` prop is set on `<EtScreen>`
- If using `EtScreen.View`, ensure scroll events are connected
- Check that global scroll context is properly set up

### TypeScript errors

- Ensure you're using the correct props for each subcomponent
- Check that you're not mixing ScrollView and View props incorrectly
- Verify all imports are from `'etoro-ui'`

## Related Files

- `/libs/etoro-ui/src/components/screen/et-screen.tsx` - Main v1 component
- `/libs/etoro-ui/src/components/screen/et-screen-v2.tsx` - `EtScreenV2` wrapper + `useScrollHandlers` hook
- `/libs/etoro-ui/src/components/screen/et-screen-v2.test.tsx` - V2 test file with examples
- `/libs/etoro-ui/src/components/screen/api/types.ts` - Type definitions
- `/libs/etoro-ui/src/components/screen/api/context.tsx` - Context implementation
- `/libs/etoro-ui/src/components/screen/subcomponents/screen-top-bar/` - TopBar components
- `/libs/etoro-ui/src/components/screen/subcomponents/screen-flash-list.tsx` - FlashList container
- `/libs/etoro-ui/src/components/screen/subcomponents/screen-header.tsx` - Extended header component
- `/libs/etoro-ui/src/components/screen/subcomponents/screen-content.tsx` - `EtScreen.Content` compound
- `/libs/etoro-ui/src/components/screen/subcomponents/screen-footer.tsx` - `EtScreen.Footer` compound
- `/libs/etoro-ui/src/components/screen/et-screen.test.tsx` - Test file with examples

## Questions?

If you're unsure about which approach to use, consider:

1. Is this a screen-level container? → Use `EtScreen`
2. Does it need a TopBar? → Add `EtScreen.TopBar`
3. Does content need to scroll? → Use `EtScreen.ScrollView`
4. Does it render a large virtualized list? → Use `EtScreen.FlashList`
5. Does content have its own custom scroller? → Use `EtScreen.View`
6. Does it need special TopBar buttons? → Use TopBar subcomponents
7. Does it need a titled step with subtitle and sticky actions? → Use `EtScreen.Content` + `EtScreen.Footer`

Always prefer composition over configuration. The compound pattern makes it easy to build exactly what you need.

## Design System Integration

Internal subcomponents resolve colors through V2 tokens. V1 → V2 mapping for `EtScreen` and its subcomponents:

| Slot                                   | V1 token               | V2 token         |
| -------------------------------------- | ---------------------- | ---------------- |
| Animated header / `Content` background | `bgNeutralPrimary`     | `backgroundBase` |
| Gradient stop A (top)                  | `bgNeutralSecondary`   | `cardDefault`    |
| Gradient stop B (bottom)               | `bgNeutralPrimary`     | `backgroundBase` |
| `Content.Subtitle` text                | `textSecondaryNeutral` | `carbon500`      |
| `Content.Disclaimer` text              | `textSecondaryNeutral` | `carbon500`      |

## Behavior deltas vs production

- The inline color overrides on `Content.Subtitle` / `Content.Disclaimer` resolve to the same value (`carbon500`) that `EtText`'s `body-base-regular` and `body-tiny-regular` variants already produce after the `EtText` foundation migration. The override is now redundant but is preserved here to keep this PR token-only; cleanup is a follow-up.
