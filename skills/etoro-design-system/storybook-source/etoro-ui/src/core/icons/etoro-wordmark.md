# EtoroWordmark

SVG component rendering the eToro text logo (wordmark) with automatic aspect-ratio scaling.

## Import

```tsx
import { EtoroWordmark } from 'etoro-ui';
```

## Props

| Prop    | Type     | Default           | Description                                                       |
| ------- | -------- | ----------------- | ----------------------------------------------------------------- |
| `size`  | `number` | `22`              | Logo height in pixels. Width scales automatically (3.18:1 ratio). |
| `color` | `string` | `actionBrandText` | Fill color. Defaults to the theme's brand color (green).          |

## Usage

```tsx
// Default — brand green, 22px height
<EtoroWordmark />

// Custom size
<EtoroWordmark size={30} />

// White (e.g. on dark backgrounds)
<EtoroWordmark color="#FFFFFF" />

// Black
<EtoroWordmark color="#000021" />

// Using a theme token
const { colors } = useEtoroTheme();
<EtoroWordmark color={colors.textPrimaryNeutral} />
```

## Design Notes

- Aspect ratio is fixed at 156:49 (~3.18:1). Only `size` (height) needs to be specified; width is computed.
- The component uses `useEtoroTheme` internally, so it responds to light/dark theme switches when no explicit `color` is provided.
- `accessibilityLabel="eToro"` is set on the SVG root.
