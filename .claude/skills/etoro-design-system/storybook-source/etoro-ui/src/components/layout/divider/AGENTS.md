# EtDivider Component

## Purpose & Scope

`EtDivider` is a horizontal separator line. It has two shapes, switched by the
presence of the `label` prop:

- **Plain** (`label` omitted) — a single full-width 1px line. Decorative; hidden
  from assistive tech unless an explicit `accessibilityLabel` is passed.
- **Labelled** — a centered label flanked by two lines (the classic
  "── Or ──" pattern between a primary and a secondary action).

Like every etoro-ui component, it is **i18n-agnostic**: pass a pre-translated
string to `label`. Do not pass a translation key.

## Entry Point & Contract

```tsx
<EtDivider
  label?: string             // centered label; omit for a plain line
  labelVariant?: TextVariant // default: 'body-secondary-regular'
  color?: string             // default: colors.dividerTertiary
  style?: StyleProp<ViewStyle>
  testID?: string
  accessibilityLabel?: string // default: label (labelled) / hidden (plain)
/>
```

| Prop                 | Type                   | Default                     | Notes                                                        |
| -------------------- | ---------------------- | --------------------------- | ------------------------------------------------------------ |
| `label`              | `string`               | —                           | Pre-translated text. Omit for a plain full-width line.       |
| `labelVariant`       | `TextVariant`          | `body-secondary-regular`    | Typography variant of the label.                             |
| `color`              | `string`               | `colors.dividerTertiary`    | Line color override.                                         |
| `style`              | `StyleProp<ViewStyle>` | —                           | Applied to the outer container.                              |
| `testID`             | `string`               | —                           | Forwarded to the outer container.                            |
| `accessibilityLabel` | `string`               | `label` / hidden when plain | Plain dividers are decorative and hidden unless this is set. |

## Usage Patterns

### "Or" separator between two CTAs

```tsx
import { EtDivider } from 'etoro-ui';

<EtScreen.Footer.Primary onPress={onPrimary}>Continue</EtScreen.Footer.Primary>
<EtDivider label="Or" />
<EtButton variant="primary-ghost" onPress={onSecondary}>
  <EtButton.Label>Sign up manually</EtButton.Label>
</EtButton>
```

### Plain section separator

```tsx
<EtDivider />
```

## Anti-patterns

### Don't pass a translation key

```tsx
// BAD — components are translation-free
<EtDivider label="registration.funnel.separator" />

// GOOD — translate at the call site
<EtDivider label={t('registration.funnel.separator')} />
```

### Don't reach for it as a list-row divider

For rows inside `EtListItem` use the list item's own `Divider` slot, which
aligns with the row's content insets. `EtDivider` is a standalone separator.

## Design Tokens

| Element    | Token                         | Notes                                          |
| ---------- | ----------------------------- | ---------------------------------------------- |
| Line       | `colors.dividerTertiary`      | Subtle neutral hairline; override via `color`. |
| Label text | `colors.textSecondaryNeutral` | Muted secondary text (`#666` light).           |
| Gap        | `X2` (8px)                    | Space between each line and the label.         |
| Thickness  | 1px                           | Matches the Figma divider line.                |

## Accessibility

- **Labelled** — the container is `accessibilityRole="text"` and announces the
  label (or a caller-supplied `accessibilityLabel`). The lines are marked
  `no-hide-descendants` so only the label is read.
- **Plain** — decorative by default (`accessibilityElementsHidden`). Pass
  `accessibilityLabel` only if the line genuinely conveys meaning.

## Dependencies & Edges

### Internal

- `EtText` — renders the label.
- `useEtoroTheme` — `dividerTertiary` (line) and `textSecondaryNeutral` (label).

### Design-system primitives

- Divider tokens: `core/styles/colors/tokens/text/dividers.ts`
- Spacing `X2`: `core/styles/spacing.ts`

## Related Context

- `EtListItem` Divider slot — for content-inset-aligned row separators.
- Figma source: UAE PASS funnel selector divider, node `94:8191`.
