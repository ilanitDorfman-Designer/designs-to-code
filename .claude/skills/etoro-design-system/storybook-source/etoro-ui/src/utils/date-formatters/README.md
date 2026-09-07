# Date formatters (`libs/etoro-ui/src/utils/date-formatters`)

Shared **date-fns** helpers used by `EtDatepicker` and by features that need consistent date strings (for example `formatDate` from the `etoro-ui` package).

## Public API

| Export                   | Re-exported from `etoro-ui` | Purpose                                                                                      |
| ------------------------ | --------------------------- | -------------------------------------------------------------------------------------------- |
| `formatDate`             | Yes                         | Format a `Date` or ISO string; safe for `null` / `undefined` / invalid input (returns `''`). |
| `convertDateToValueType` | Via `utils` barrel only     | Map a `Date` to `date` / `iso` / `formatted` for the datepicker.                             |
| `parseDateValue`         | Via `utils` barrel only     | Parse controlled `value` / `defaultValue` (`Date` or ISO string only).                       |

Default display pattern for `formatDate` is `dd MMM yyyy` (for example `05 Jan 2026`). Override with a [date-fns format string](https://date-fns.org/docs/format).

## How to verify it works

### Unit tests (recommended)

From the repo root:

```bash
npx nx run ui:test -- --testPathPatterns=date-formatters
```

Run the full UI library test suite:

```bash
npx nx run ui:test
```

### Typecheck and lint (this library)

```bash
npx tsc -p libs/etoro-ui/tsconfig.lib.json --noEmit
npx tsc -p libs/etoro-ui/tsconfig.spec.json --noEmit
npx nx run ui:lint
```

### Manual check in a feature

Import from the package (same as production):

```ts
import { formatDate } from 'etoro-ui';

formatDate(someDate, 'dd/MM/yyyy');
```

## Related code

- `datepicker-provider.tsx` imports `convertDateToValueType`, `formatDate`, and `parseDateValue` from this folder.
- For **numbers** in JSX, prefer `EtNumber` (see workspace rule `number-formatting.mdc`).
