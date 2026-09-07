# eToro UI Kit Component Reference

> **Purpose**: This document provides component mapping for Figma-to-code workflows. Use this when processing Figma designs to identify which etoro-ui components to use.

---

## Component Categories

### Foundations

| Component         | Import                | Usage                                           |
| ----------------- | --------------------- | ----------------------------------------------- |
| `EtText`          | `@etoroplus/etoro-ui` | Text display with typography variants           |
| `EtIconV2`        | `@etoroplus/etoro-ui` | Icon component with size/color variants         |
| `EtoroIcon`       | `@etoroplus/etoro-ui` | Legacy icon component                           |
| `EtoroWordmark`   | `@etoroplus/etoro-ui` | eToro text logo SVG — `size` (height) + `color` |
| `EtAnimatedCount` | `@etoroplus/etoro-ui` | Animated number transitions                     |

### Layout Components

| Component             | Import                | Figma Pattern                                                       | Usage                                     |
| --------------------- | --------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `EtCard`              | `@etoroplus/etoro-ui` | Card container with shadow/border                                   | Container for grouped content             |
| `EtHeader`            | `@etoroplus/etoro-ui` | Top navigation bar                                                  | Screen headers                            |
| `EtSection`           | `@etoroplus/etoro-ui` | Section with title                                                  | Grouping related content                  |
| `EtFooter`            | `@etoroplus/etoro-ui` | Bottom section                                                      | Screen footers with links                 |
| `EtAccordion`         | `@etoroplus/etoro-ui` | Expandable section                                                  | Collapsible content                       |
| `EtExpandable`        | `@etoroplus/etoro-ui` | Show more/less                                                      | Truncated content expansion               |
| `EtDivider`           | `@etoroplus/etoro-ui` | Separator line / "Or" divider                                       | Separating content or actions             |
| `EtView`              | `@etoroplus/etoro-ui` | Region container (+ optional loading/skeleton crossfade)            | A region that loads; plain View otherwise |
| `EtScrollView`        | `@etoroplus/etoro-ui` | Scrollable region container (+ optional loading/skeleton crossfade) | A scrollable region that loads            |
| `EtUserProfileHeader` | `@etoroplus/etoro-ui` | Profile header                                                      | User profile top section                  |

### Button Components

| Component      | Import                | Figma Pattern            | Props                                             |
| -------------- | --------------------- | ------------------------ | ------------------------------------------------- |
| `EtButton`     | `@etoroplus/etoro-ui` | Primary/Secondary button | `variant`: primary, secondary, tertiary, ghost    |
| `EtIconButton` | `@etoroplus/etoro-ui` | Icon-only button         | `icon`, `size`, `variant`                         |
| `EtLink`       | `@etoroplus/etoro-ui` | Text link                | `variant`: primary, secondary; `size`: sm, md, lg |

**Button Sizes**: `small`, `medium`, `large`
**Button Variants**: `primary`, `secondary`, `tertiary`, `ghost`, `danger`

### Control Components

| Component           | Import                | Figma Pattern       | Usage                         |
| ------------------- | --------------------- | ------------------- | ----------------------------- |
| `EtCheckbox`        | `@etoroplus/etoro-ui` | Checkbox with label | Boolean selection             |
| `EtRadioGroup`      | `@etoroplus/etoro-ui` | Radio button group  | Single selection from options |
| `EtSelect`          | `@etoroplus/etoro-ui` | Dropdown selector   | Option selection              |
| `EtToggleSwitch`    | `@etoroplus/etoro-ui` | On/off switch       | Binary toggle                 |
| `EtToggle`          | `@etoroplus/etoro-ui` | Toggle button       | Toggle state                  |
| `EtButtonGroup`     | `@etoroplus/etoro-ui` | Segmented control   | Tab-like selection            |
| `EtChip`            | `@etoroplus/etoro-ui` | Tag/chip            | Compact selection             |
| `EtChipsGroupV2`    | `@etoroplus/etoro-ui` | Chip group          | Multiple chip selection       |
| `EtTextToggle`      | `@etoroplus/etoro-ui` | Text-based toggle   | Text switching                |
| `EtTimeFrameToggle` | `@etoroplus/etoro-ui` | Time range selector | 1D, 1W, 1M, etc.              |
| `TimeFrameSelector` | `@etoroplus/etoro-ui` | Time frame picker   | Chart time ranges             |
| `EtNumberPicker`    | `@etoroplus/etoro-ui` | +/- number input    | Quantity selection            |
| `EtStepper`         | `@etoroplus/etoro-ui` | Step indicator      | Multi-step flows              |

### Input Components

| Component       | Import                | Figma Pattern      | Props                                   |
| --------------- | --------------------- | ------------------ | --------------------------------------- |
| `EtInput`       | `@etoroplus/etoro-ui` | Text input field   | `label`, `placeholder`, `error`, `type` |
| `EtSearchInput` | `@etoroplus/etoro-ui` | Search bar         | `placeholder`, `onSearch`               |
| `EtPhoneInput`  | `@etoroplus/etoro-ui` | Phone number input | Country code + number                   |
| `EtDatepicker`  | `@etoroplus/etoro-ui` | Date selector      | `variant`: input, compact               |
| `EtTimepicker`  | `@etoroplus/etoro-ui` | Time selector      | `variant`: input, compact               |

**Input Types**: `text`, `email`, `password`, `number`, `tel`

### Questions Form (dynamic questionnaires)

Schema-driven multi-question flows (KYC, onboarding, surveys). Composes primitives such as `EtInput`, `EtSelect`, `EtRadioGroup`, and `EtBottomSheetV2` (e.g. autocomplete). Requires **`QuestionsFormTextProvider`** so question copy (keys or literals) resolves consistently.

| Component                   | Import                    | Figma Pattern              | Usage                                                                            |
| --------------------------- | ------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `QuestionsForm`             | `etoro-ui/questions-form` | Multi-step / question list | Config-driven form + `react-hook-form`; submit via ref or props                  |
| `QuestionsFormTextProvider` | `etoro-ui/questions-form` | —                          | Wrap tree; supply `QuestionsFormTextResolver` for i18n / copy                    |
| `QuestionRenderer`          | `etoro-ui/questions-form` | Single question block      | Renders one `Question` by `type` (used inside `QuestionsForm` or custom layouts) |
| `useQuestionsForm`          | `etoro-ui/questions-form` | —                          | Headless hook for values, validation, and diff (same model as the form)          |

**Related exports** (same entry): `InputQuestion`, `SelectQuestion`, `AutocompleteQuestion`, `SelectQuestionOption`, `QuestionHeader`, `QuestionMessageBox`, and config/types (`QuestionsFormConfig`, `Question`, etc.). See `libs/etoro-ui/src/questions-form/questions-form.ui.md` for patterns.

### Status Components

| Component           | Import                | Figma Pattern       | Usage                             |
| ------------------- | --------------------- | ------------------- | --------------------------------- |
| `EtBadge`           | `@etoroplus/etoro-ui` | Status badge        | Labels, counts, status indicators |
| `EtLoader`          | `@etoroplus/etoro-ui` | Spinner             | Loading states                    |
| `EtProgressBar`     | `@etoroplus/etoro-ui` | Progress indicator  | Progress tracking                 |
| `EtProgressV2`      | `@etoroplus/etoro-ui` | Enhanced progress   | Circular/linear progress          |
| `EtRiskScore`       | `@etoroplus/etoro-ui` | Risk indicator      | Risk level display (1-10)         |
| `EtSkeleton`        | `@etoroplus/etoro-ui` | Loading placeholder | Content skeleton                  |
| `EtSkeletonCard`    | `@etoroplus/etoro-ui` | Card skeleton       | Card loading state                |
| `EtSkeletonList`    | `@etoroplus/etoro-ui` | List skeleton       | List loading state                |
| `EtSkeletonProfile` | `@etoroplus/etoro-ui` | Profile skeleton    | Profile loading state             |
| `EtRange`           | `@etoroplus/etoro-ui` | Range slider        | Value range selection             |
| `EtRangeSlider`     | `@etoroplus/etoro-ui` | Dual range slider   | Min/max range selection           |

**Badge Colors**: `primary`, `success`, `warning`, `error`, `info`
**Badge Sizes**: `small`, `medium`, `large`

### List Components

| Component      | Import                | Figma Pattern        | Usage                         |
| -------------- | --------------------- | -------------------- | ----------------------------- |
| `EtListItem`   | `@etoroplus/etoro-ui` | List row             | Standard list items           |
| `EtListItemV2` | `@etoroplus/etoro-ui` | Enhanced list row    | Complex list items with slots |
| `EtAssetItem`  | `@etoroplus/etoro-ui` | Asset/instrument row | Trading asset display         |

**List Item Slots**: `start`, `middle`, `end`
**List Item Sizes**: `small`, `medium`, `large`

### Data Display Components

| Component          | Import                | Figma Pattern    | Usage                    |
| ------------------ | --------------------- | ---------------- | ------------------------ |
| `EtAssetCard`      | `@etoroplus/etoro-ui` | Asset card       | Trading asset with chart |
| `EtCryptoCard`     | `@etoroplus/etoro-ui` | Crypto card      | Brand-colour crypto summary (`logoUrl`, optional `backgroundColor`) |
| `EtPositionCard`   | `@etoroplus/etoro-ui` | Position card    | Open position display    |
| `EtSparkChart`     | `@etoroplus/etoro-ui` | Mini chart       | Inline price chart       |
| `EtLineChart`      | `@etoroplus/etoro-ui` | Line chart       | Price/performance chart  |
| `EtBreakdownChart` | `@etoroplus/etoro-ui` | Pie/donut chart  | Portfolio breakdown      |
| `EtTicker`         | `@etoroplus/etoro-ui` | Scrolling ticker | Live price updates       |
| `EtStory`          | `@etoroplus/etoro-ui` | Story circle     | Social story indicator   |
| `EtCountryFlag`    | `@etoroplus/etoro-ui` | Flag icon        | Country indicator        |
| `EtReadMoreText`   | `@etoroplus/etoro-ui` | Truncated text   | Expandable text          |

### Social Components

| Component      | Import                | Figma Pattern    | Usage                 |
| -------------- | --------------------- | ---------------- | --------------------- |
| `EtAvatar`     | `@etoroplus/etoro-ui` | User avatar      | Profile pictures      |
| `EtPost`       | `@etoroplus/etoro-ui` | Social post      | Feed post             |
| `EtPostV2`     | `@etoroplus/etoro-ui` | Enhanced post    | Post with attachments |
| `EtSocialCard` | `@etoroplus/etoro-ui` | Social user card | User profile card     |

**Avatar Sizes**: `xs`, `sm`, `md`, `lg`, `xl`
**Avatar Shapes**: `circle`, `square`

### Navigation Components

| Component      | Import                | Figma Pattern | Usage               |
| -------------- | --------------------- | ------------- | ------------------- |
| `EtPagination` | `@etoroplus/etoro-ui` | Page dots     | Carousel pagination |

### Overlay Components

| Component         | Import                | Figma Pattern         | Usage                  |
| ----------------- | --------------------- | --------------------- | ---------------------- |
| `EtBottomSheet`   | `@etoroplus/etoro-ui` | Bottom modal          | Modal from bottom      |
| `EtBottomSheetV2` | `@etoroplus/etoro-ui` | Enhanced bottom sheet | Complex bottom modals  |
| `EtPopover`       | `@etoroplus/etoro-ui` | Tooltip/popover       | Contextual information |

**Popover Directions**: `top`, `bottom`, `left`, `right`

### Feedback Components

| Component       | Import                | Figma Pattern      | Usage                |
| --------------- | --------------------- | ------------------ | -------------------- |
| `EtToast`       | `@etoroplus/etoro-ui` | Toast notification | Temporary messages   |
| `ToastProvider` | `@etoroplus/etoro-ui` | Toast context      | Toast system wrapper |

**Toast Types**: `success`, `error`, `warning`, `info`

### Table Components

| Component     | Import                | Usage                |
| ------------- | --------------------- | -------------------- |
| `EtTable`     | `@etoroplus/etoro-ui` | Data table container |
| `EtTableHead` | `@etoroplus/etoro-ui` | Table header         |
| `EtTableBody` | `@etoroplus/etoro-ui` | Table body           |
| `EtTableRow`  | `@etoroplus/etoro-ui` | Table row            |

---

## Figma-to-Component Mapping

### Common Figma Patterns

| Figma Element                  | etoro-ui Component                          | Notes                                                                                   |
| ------------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| "Button/Primary"               | `EtButton variant="primary"`                | Main CTA                                                                                |
| "Button/Secondary"             | `EtButton variant="secondary"`              | Secondary actions                                                                       |
| "Button/Ghost"                 | `EtButton variant="ghost"`                  | Tertiary actions                                                                        |
| "Input/Text"                   | `EtInput`                                   | Standard text field                                                                     |
| "Input/Search"                 | `EtSearchInput`                             | Search with icon                                                                        |
| "Card"                         | `EtCard`                                    | Content container                                                                       |
| "List Item"                    | `EtListItemV2`                              | List row                                                                                |
| "Avatar"                       | `EtAvatar`                                  | User picture                                                                            |
| "Badge"                        | `EtBadge`                                   | Status indicator                                                                        |
| "Switch"                       | `EtToggleSwitch`                            | Boolean toggle                                                                          |
| "Checkbox"                     | `EtCheckbox`                                | Multi-select                                                                            |
| "Radio"                        | `EtRadioGroup`                              | Single-select                                                                           |
| "Dropdown"                     | `EtSelect`                                  | Option picker                                                                           |
| "Chip/Tag"                     | `EtChip`                                    | Compact label                                                                           |
| "Tab Bar"                      | `EtButtonGroup`                             | Segmented control                                                                       |
| "Loading"                      | `EtLoader` or `EtSkeleton`                  | Loading states                                                                          |
| "Progress"                     | `EtProgressBar` or `EtProgressV2`           | Progress indicator                                                                      |
| "Bottom Sheet"                 | `EtBottomSheetV2`                           | Modal drawer                                                                            |
| "Toast"                        | `EtToast`                                   | Notification                                                                            |
| "Chart/Line"                   | `EtLineChart`                               | Price chart                                                                             |
| "Chart/Spark"                  | `EtSparkChart`                              | Mini chart                                                                              |
| "Questionnaire" / dynamic form | `QuestionsForm` (`etoro-ui/questions-form`) | Wrap with `QuestionsFormTextProvider`; maps to inputs/selects/radio per question `type` |

### State Mapping

| Figma State | Component Prop                       |
| ----------- | ------------------------------------ |
| Default     | (no modifier)                        |
| Hover       | Handled by component                 |
| Pressed     | Handled by component                 |
| Disabled    | `disabled={true}`                    |
| Error       | `error={true}` or `status="error"`   |
| Loading     | `loading={true}`                     |
| Selected    | `selected={true}` or `active={true}` |

---

## Design Tokens

### Colors

The etoro-ui library uses theme-based colors. Map Figma colors to semantic tokens:

| Figma Color    | Theme Token             |
| -------------- | ----------------------- |
| Primary Green  | `colors.primary`        |
| Error Red      | `colors.error`          |
| Warning Orange | `colors.warning`        |
| Success Green  | `colors.success`        |
| Info Blue      | `colors.info`           |
| Text Primary   | `colors.text.primary`   |
| Text Secondary | `colors.text.secondary` |
| Background     | `colors.background`     |
| Surface        | `colors.surface`        |

### Spacing

| Figma Spacing | Token         |
| ------------- | ------------- |
| 4px           | `spacing.xs`  |
| 8px           | `spacing.sm`  |
| 12px          | `spacing.md`  |
| 16px          | `spacing.lg`  |
| 24px          | `spacing.xl`  |
| 32px          | `spacing.2xl` |

### Typography

| Figma Style | Component                  |
| ----------- | -------------------------- |
| H1-H6       | `EtText variant="h1-h6"`   |
| Body        | `EtText variant="body"`    |
| Caption     | `EtText variant="caption"` |
| Label       | `EtText variant="label"`   |

---

## Custom Component Identification

If a Figma element doesn't map to an existing component, flag it:

```markdown
### New Component Required

**Figma Element**: {element-name}
**Description**: {what-it-does}
**Closest Match**: {nearest-etoro-ui-component}
**Gap Analysis**: {what's-missing}
**Recommendation**: Extend existing / Create new
```

---

## Usage Notes

1. **Version Check**: Components may have V2 variants (`EtListItemV2`, `EtBottomSheetV2`) - prefer V2 when available
2. **Import Path**: Most components import from `@etoroplus/etoro-ui`. **Questions Form** lives on the secondary entry **`etoro-ui/questions-form`** (see [Questions Form](#questions-form-dynamic-questionnaires) above).
3. **Type Safety**: Most components export prop types (e.g., `EtButtonProps`)
4. **Theming**: Components respect the global theme context
5. **Accessibility**: Components include built-in accessibility props

---

## Quick Reference: Top 20 Components

| Priority | Component         | Use Case      |
| -------- | ----------------- | ------------- |
| 1        | `EtButton`        | Actions       |
| 2        | `EtInput`         | Text entry    |
| 3        | `EtCard`          | Containers    |
| 4        | `EtListItemV2`    | Lists         |
| 5        | `EtText`          | Typography    |
| 6        | `EtIconV2`        | Icons         |
| 7        | `EtAvatar`        | Users         |
| 8        | `EtBadge`         | Status        |
| 9        | `EtToggleSwitch`  | Toggles       |
| 10       | `EtSelect`        | Dropdowns     |
| 11       | `EtSearchInput`   | Search        |
| 12       | `EtLoader`        | Loading       |
| 13       | `EtSkeleton`      | Placeholders  |
| 14       | `EtBottomSheetV2` | Modals        |
| 15       | `EtToast`         | Notifications |
| 16       | `EtChip`          | Tags          |
| 17       | `EtSparkChart`    | Mini charts   |
| 18       | `EtSection`       | Grouping      |
| 19       | `EtLink`          | Links         |
| 20       | `EtPositionCard`  | Trading       |
