# EtText

Typography with variant-based styling. Supports optional **shrink to fit** for single-line values in tight layouts.

## shrinkToFit

Use when a value must stay on one line without ellipsis (amounts, SL/TP strings, dates in detail rows).

| Platform | Mechanism                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| iOS      | Native `adjustsFontSizeToFit` + `minimumFontScale`                                                                        |
| Android  | `onTextLayout` overflow detection; steps `fontSize` from variant size by `scaleStep` until one line or `minimumFontScale` |

```tsx
<EtText variant="num-s-medium" shrinkToFit minimumFontScale={0.85}>
  {formattedAmount}
</EtText>
```

| Prop               | Default | Description                                        |
| ------------------ | ------- | -------------------------------------------------- |
| `shrinkToFit`      | `false` | Enables single-line shrink behavior                |
| `minimumFontScale` | `0.85`  | Lower bound relative to variant size (when shrink) |
| `scaleStep`        | `0.05`  | Android shrink step per overflow pass              |

Implementation: `hooks/use-et-shrink-text-model.ts` (used internally when `shrinkToFit` is true).

## Import

```tsx
import { EtText } from 'etoro-ui';
```

## Related primitives

- **`EtBlurredText`** (`libs/etoro-ui/src/foundations/text/et-blurred-text/`) — same variant union, but rendered through a Skia `<Canvas>` with a Gaussian `<BlurMask>` on the glyphs. Used to gate unauthorized values behind an unreadable placeholder; see `libs/etoro-ui/src/foundations/text/et-blurred-text/AGENTS.md` for the full contract.
