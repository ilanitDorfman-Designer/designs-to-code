# Storybook Template Guide

This document explains how to create consistent, well-documented storybook stories for eToro UI components.

## File Location

Template utilities: `.rnstorybook/stories/utils/storybook-template.tsx`

## Quick Start

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  Page,
  Section,
  Title,
  Desc,
  Preview,
  CodeBlock,
  PropsTable,
  Row,
  Col,
  Label,
  SubTitle,
  Divider,
  Spacer,
  useTheme,
} from '../utils/storybook-template';
import { MyComponent } from 'path/to/component';

type Story = StoryObj<typeof MyComponent>;

const meta: Meta<typeof MyComponent> = {
  title: 'eToro-UI/Components/Category/MyComponent',
  component: MyComponent,
};

export default meta;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>A brief description of the component.</Desc>
        <Preview>
          <MyComponent />
        </Preview>
        <CodeBlock
          code={`import { MyComponent } from 'etoro-ui';

<MyComponent prop="value" />`}
        />
      </Section>
    </Page>
  ),
};
```

## Available Components

### Page Layout

| Component | Purpose                                                     |
| --------- | ----------------------------------------------------------- |
| `Page`    | Root wrapper with theme provider and compact theme switcher |
| `Section` | Content section with spacious padding (24px) and gap (16px) |

### Typography

| Component  | Purpose                                       |
| ---------- | --------------------------------------------- |
| `Title`    | Main section heading with optional accent bar |
| `SubTitle` | Subsection heading with green dot indicator   |
| `Desc`     | Description text (muted color)                |
| `Label`    | Small label text below components             |

### Content

| Component    | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `Preview`    | Container with green glow effect for component demos |
| `CodeBlock`  | Card-style code block with header and copy button    |
| `PropsTable` | API reference table with refined styling             |

### Layout Helpers

| Component | Purpose                                           |
| --------- | ------------------------------------------------- |
| `Row`     | Horizontal flex container with gap and wrap props |
| `Col`     | Vertical flex container with customizable gap     |
| `Divider` | Horizontal separator line                         |
| `Spacer`  | Vertical spacing (default 24px)                   |

### Theme Access

| Hook         | Purpose                                 |
| ------------ | --------------------------------------- |
| `useTheme()` | Access theme colors and dark mode state |

## Component Props

### Preview

```tsx
{
  /* glow: boolean, default true */
}
<Preview glow={true}>
  <MyComponent />
</Preview>;
```

- `glow` - Enables green glow effect around preview (only visible in dark mode)

### CodeBlock

```tsx
<CodeBlock
  code={`const x = 1;`}
  title="tsx"  {/* title: string, default "tsx" */}
/>
```

- `code` - The code string to display
- `title` - Language badge shown in header (e.g., "tsx", "jsx", "bash")

### Section

```tsx
<Section noPadding={false}>
  {' '}
  {/* noPadding: boolean, default false */}
  {children}
</Section>
```

- `noPadding` - Removes horizontal padding (useful for full-width content)

### Row

```tsx
<Row gap={24} wrap={false}>
  {' '}
  {/* gap: number, wrap: boolean */}
  {children}
</Row>
```

- `gap` - Space between items (default 24)
- `wrap` - Enable flex wrap for responsive layouts

### Col

```tsx
<Col gap={8}>
  {' '}
  {/* gap: number */}
  {children}
</Col>
```

- `gap` - Space between items (default 8)

### Spacer

```tsx
<Spacer size={24} />  {/* size: number, default 24 */}
```

- `size` - Height in pixels

## Story Structure

Follow this structure for each component. **All stories go in a single file**, with API Reference always last.

### Recommended Story Order

1. **Basic** (Required) - Simplest usage
2. **Sizes** - If component has size variants
3. **States** - Enabled, disabled, loading, error states
4. **Variants/CustomColors** - Style variants or theming options
5. **Examples** - Real-world usage patterns (e.g., `SettingsExample`)
6. **APIReference** (Required) - Props documentation, **always last**

### 1. Basic Story (Required)

Show the simplest usage of the component.

```tsx
export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>Brief description.</Desc>
        <Preview>
          <MyComponent />
        </Preview>
        <CodeBlock code={`...full code example...`} />
      </Section>
    </Page>
  ),
};
```

### 2. Variant Stories

Create separate stories for each major feature/variant:

- `Sizes` - If component has size variants
- `Variants` - If component has style variants
- `States` - Loading, disabled, error states
- `CustomColors` - Custom theming options
- `WithX` - Badge, icon, or other additions
- `XExample` - Real-world usage patterns

### 3. API Reference Story (Required, Always Last)

Document all props. **This must be the final story in the file**:

```tsx
export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>MyComponent</SubTitle>
        <Desc>Root component description.</Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: '"primary" | "secondary"',
              default: '"primary"',
            },
            {
              prop: 'size',
              type: '"small" | "medium" | "large"',
              default: '"medium"',
            },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'onPress', type: '() => void', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
```

## Code Block Guidelines

### Always Include Import Statement

```tsx
<CodeBlock
  code={`import { MyComponent } from 'etoro-ui';

<MyComponent variant="primary" />`}
/>
```

### Show Complete, Copy-Pasteable Examples

Bad:

```tsx
<CodeBlock code={`<MyComponent ... />`} />
```

Good:

```tsx
<CodeBlock
  code={`import { MyComponent } from 'etoro-ui';

<MyComponent
  variant="primary"
  size="medium"
  onPress={() => console.log('pressed')}
>
  Button Label
</MyComponent>`}
/>
```

### Use Title for Different Languages

```tsx
<CodeBlock title="bash" code={`npm install etoro-ui`} />
<CodeBlock title="json" code={`{ "key": "value" }`} />
```

## Using Theme Colors

When components need theme-aware styling in stories:

```tsx
export const WithBadge: Story = {
  render: function BadgeStory() {
    const { c, isDark } = useTheme();
    return (
      <Page>
        <Section>
          <Title>Badge</Title>
          <Preview>
            <MyComponent>
              <View style={{ backgroundColor: c.accent }} />
            </MyComponent>
          </Preview>
        </Section>
      </Page>
    );
  },
};
```

**Note:** When using hooks inside render, use a named function (`function BadgeStory()`) instead of arrow function for proper hook rules.

## Available Theme Colors

Access via `const { c, isDark } = useTheme();`

### Background Colors

| Color          | Usage                         |
| -------------- | ----------------------------- |
| `c.bg`         | Page background               |
| `c.bgMuted`    | Preview background, cards     |
| `c.bgElevated` | Elevated surfaces, code bg    |
| `c.bgCode`     | Code block content background |

### Glow Effects (Dark Mode)

| Color          | Usage                           |
| -------------- | ------------------------------- |
| `c.glowSubtle` | Subtle green glow (30% opacity) |
| `c.glowMedium` | Medium green glow (45% opacity) |

### Text Colors

| Color            | Usage                      |
| ---------------- | -------------------------- |
| `c.text`         | Primary text               |
| `c.textMuted`    | Secondary/description text |
| `c.textTertiary` | Tertiary/disabled text     |
| `c.textCode`     | Code text                  |

### Border Colors

| Color            | Usage            |
| ---------------- | ---------------- |
| `c.border`       | Standard borders |
| `c.borderSubtle` | Subtle borders   |

### Accent Colors (eToro Green)

| Color          | Usage                      |
| -------------- | -------------------------- |
| `c.accent`     | Primary accent color       |
| `c.accentBg`   | Accent background (badges) |
| `c.accentText` | Text on accent backgrounds |

## File Naming Convention

```text
.rnstorybook/stories/components/
├── category/
│   └── component-name/
│       └── et-component.stories.tsx      # Single file with all stories
```

**Important:** Use a single stories file per component. Do NOT split into separate intro/non-intro files. All stories (Basic, variants, examples, and API Reference) should be in one file.

## Checklist for New Stories

- [ ] **Single file** - All stories in one `et-component.stories.tsx` file (no intro/non-intro split)
- [ ] Import template components from `../utils/storybook-template`
- [ ] Set correct `title` in meta (follows `eToro-UI/Components/Category/Name` pattern)
- [ ] Create `Basic` story showing simplest usage
- [ ] Create stories for each major variant/feature
- [ ] Create `APIReference` story with PropsTable for all components
- [ ] **`APIReference` is the last story** in the file
- [ ] All CodeBlocks have full, copy-pasteable examples with imports
- [ ] Theme-dependent styles use `useTheme()` hook
- [ ] Page wraps all content (provides theme switcher)

## Anti-Patterns (What NOT to Do)

### Do NOT split stories into multiple files

```tsx
// BAD - separate intro and non-intro files
component.intro.stories.tsx; // Basic, Sizes, States, APIReference
component.stories.tsx; // Interactive, CustomColors
```

**Fix:** Put all stories in a single file with API Reference last:

```tsx
// GOOD - single file
component.stories.tsx;
// Contains: Basic, Sizes, States, CustomColors, SettingsExample, APIReference
```

### Do NOT define custom CodeBlock components

```tsx
// BAD - reinventing the wheel
const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();
  // ... 40 lines of custom implementation with Alert, Clipboard, etc.
};
```

**Fix:** Import `CodeBlock` from the template utilities:

```tsx
import { CodeBlock } from '../utils/storybook-template';
```

### Do NOT use hardcoded colors

```tsx
// BAD - breaks in dark mode, inconsistent with design system
const styles = StyleSheet.create({
  card: { backgroundColor: '#F8F9FA', borderColor: '#E9ECEF' },
  header: { borderBottomColor: '#E9ECEF' },
});
```

**Fix:** Use `useTheme()` hook colors or template components that handle theming automatically:

```tsx
const { c } = useTheme();
// Then use c.bgMuted, c.border, c.borderSubtle, etc.
```

### Do NOT put everything in a single story

```tsx
// BAD - one giant Introduction story with all features
export const Introduction: Story = {
  render: () => <ScrollView>{/* 300+ lines covering basic usage, sizes, states, settings, API... */}</ScrollView>,
};
```

**Fix:** Split into separate exports for better navigation and testing:

```tsx
export const Basic: Story = { ... };
export const Sizes: Story = { ... };
export const States: Story = { ... };
export const APIReference: Story = { ... };
```

### Do NOT use manual ScrollView/styling

```tsx
// BAD - manual layout management, no theme switcher
export const MyStory: Story = {
  render: () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>...</View>
      <View style={styles.section}>...</View>
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 24 },
  // ... 50+ more lines of custom styles
});
```

**Fix:** Use `<Page>` and `<Section>` components that handle layout consistently:

```tsx
export const MyStory: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>My Feature</Title>
        <Preview>...</Preview>
      </Section>
    </Page>
  ),
};
```

### Do NOT skip the theme switcher

Stories should allow switching between light/dark mode for testing. The `<Page>` component provides this automatically - don't bypass it with custom ScrollViews.

### Do NOT use decorators for basic layout

```tsx
// BAD - using decorators for styling that Page handles
const meta: Meta<{}> = {
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};
```

**Fix:** Just use `<Page>` in your render function - it handles all layout concerns.

## Migrating Old Stories

If you find a story not using the template system, follow these steps:

1. **Consolidate multiple files** into a single `et-component.stories.tsx` file. If there are separate intro/non-intro files, merge them.

2. **Replace custom imports** with template utilities:

   ```tsx
   // Remove these
   import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
   import * as Clipboard from 'expo-clipboard';

   // Add these
   import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, Row, Col, Label, SubTitle, useTheme } from '../utils/storybook-template';
   ```

3. **Wrap content in `<Page>`** (provides theme switcher automatically)

4. **Split monolithic renders** into separate story exports in this order:
   - `Basic` - simplest usage
   - `Sizes` / `Variants` - different configurations
   - `States` - disabled, loading, error
   - `CustomColors` - theming options
   - `XExample` - real-world usage patterns
   - `APIReference` - PropsTable with all props (always last)

5. **Replace custom styling** with template components:
   - `ScrollView` → `Page`
   - Custom cards/sections → `Section` + `Preview`
   - Manual row layouts → `Row` + `Col` + `Label`
   - Inline CodeBlock → template `CodeBlock`

6. **Delete custom `StyleSheet`** definitions - template components handle styling

7. **Use `<PropsTable>`** for API documentation instead of code blocks with interface definitions

8. **Ensure `APIReference` is the last export** in the file

### Migration Example

Before (367 lines):

```tsx
const CodeBlock = ({ code, title }) => {
  /* 45 lines */
};

export const Introduction: Story = {
  render: () => <ScrollView style={styles.container}>{/* All features in one place */}</ScrollView>,
};

const styles = StyleSheet.create({
  /* 100 lines */
});
```

After (~180 lines):

```tsx
import { Page, Section, Title, Preview, CodeBlock, PropsTable } from '../utils/storybook-template';

export const Basic: Story = { render: () => <Page>...</Page> };
export const Sizes: Story = { render: () => <Page>...</Page> };
export const States: Story = { render: () => <Page>...</Page> };
export const APIReference: Story = { render: () => <Page>...</Page> };
```
