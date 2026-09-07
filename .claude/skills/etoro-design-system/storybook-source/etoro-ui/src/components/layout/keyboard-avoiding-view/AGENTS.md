# EtKeyboardAvoidingView

Keyboard-avoiding container built on `react-native-keyboard-controller`'s
**native** `KeyboardAvoidingView`. Use it for screens where an input footer
(comment / chat composer) must sit above the soft keyboard with a scroll
surface above it.

**Location:** `libs/etoro-ui/src/components/layout/keyboard-avoiding-view/`

## When to use

Wrap the scroll surface **and** the footer together:

```tsx
<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtKeyboardAvoidingView style={{ flex: 1 }}>
    <CommentList />
    <View style={{ paddingBottom: isKeyboardVisible ? 0 : insets.bottom }}>
      <CommentComposer />
    </View>
  </EtKeyboardAvoidingView>
</EtScreen>
```

On iOS the container's bottom is padded by the keyboard height (`behavior:
'padding'`), so the footer rises and the list shrinks. On Android it relies on
`adjustResize` (set by `KeyboardProvider`), so `behavior` resolves to
`undefined`.

## Why this replaced `EtKeyboardStickyView`

`EtKeyboardStickyView` drove a `translateY` from keyboard-controller's
animated/shared keyboard values (`useReanimatedKeyboardAnimation`). That
JS-driven path works in the iOS simulator / Debug but is silently **not driven
in Release builds on physical iOS devices** under the New Architecture — the
composer stays hidden behind the keyboard. `KeyboardAvoidingView` (like
`KeyboardAwareScrollView`) is a native component that doesn't depend on that
stream, so it survives Release on device. This mirrors the proven pattern in
the sibling app (chat composer over a `FlashList`).

## Requirements

- Mount `<KeyboardProvider>` from `react-native-keyboard-controller` above the
  tree. The mobile app mounts it once at the root in
  `apps/etoro-mobile/src/app/_layout.tsx`; Storybook mounts it in
  `.rnstorybook/preview.tsx`.

## Safe area

This primitive only handles keyboard motion. A footer that must clear the
Android 3-button nav bar / iOS home indicator while the keyboard is **closed**
should add its own `paddingBottom` (e.g. `insets.bottom`), gated to the
keyboard-closed state so it doesn't leave a gap once the keyboard pads the
container. See `post-comments-panel.component.tsx` for the reference usage.

## Props

| Prop                     | Type                                  | Default                              | Description                                                                 |
| ------------------------ | ------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `children`               | `ReactNode`                           | —                                    | Scroll surface + footer.                                                    |
| `style`                  | `StyleProp<ViewStyle>`                | —                                    | Container style, usually `{ flex: 1 }`.                                     |
| `behavior`               | `'padding' \| 'height' \| 'position'` | iOS `'padding'`, Android `undefined` | Keyboard-avoidance strategy.                                                |
| `keyboardVerticalOffset` | `number`                              | `0`                                  | Distance from the top of the view to the top of the screen (header height). |
| `enabled`                | `boolean`                             | `true`                               | Toggle avoidance.                                                           |
| `testID`                 | `string`                              | —                                    | Forwarded to the underlying view.                                           |

## Don'ts

- Don't wrap only the footer — `KeyboardAvoidingView` must contain the scroll
  surface too, otherwise the list won't shrink when the keyboard opens.
- Don't nest inside another keyboard-avoiding container.
