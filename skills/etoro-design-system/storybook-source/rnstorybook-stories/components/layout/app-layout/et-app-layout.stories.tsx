import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { EtAppLayout } from 'etoro-ui/shell';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtAppLayout>;

// ─────────────────────────────────────────────────────────────
// Story chrome — fake slot fillers inside a bordered shell frame,
// matching the EtTopPanel story precedent for viewport-driven chrome.
// ─────────────────────────────────────────────────────────────

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <View style={[styles.shell, { borderColor: c.borderSubtle }]}>{children}</View>;
}

function FakeRail() {
  const { c } = useTheme();
  return (
    <View style={[styles.rail, { backgroundColor: c.bgMuted }]}>
      <EtText style={{ color: c.textTertiary }} variant="label-tertiary-regular">
        menu
      </EtText>
    </View>
  );
}

function FakeBar() {
  const { c } = useTheme();
  return (
    <View style={[styles.bar, { backgroundColor: c.bgMuted }]}>
      <EtText style={{ color: c.textTertiary }} variant="label-tertiary-regular">
        top panel
      </EtText>
    </View>
  );
}

function FakeAsideContent() {
  const { c } = useTheme();
  return (
    <View style={styles.asideContent}>
      <EtText style={{ color: c.text }} variant="body-secondary-regular">
        Aside content
      </EtText>
      <EtText style={{ color: c.textTertiary }} variant="label-tertiary-regular">
        The machine paints the elevated panel around this
      </EtText>
    </View>
  );
}

function Readout({ children }: { children: string }) {
  const { c } = useTheme();
  return (
    <EtText style={[styles.readout, { color: c.textTertiary }]} variant="label-tertiary-regular">
      {children}
    </EtText>
  );
}

function SelectPill({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.pill, { borderColor: c.borderSubtle }, selected && { backgroundColor: c.accentBg }]}>
      <EtText style={{ color: selected ? c.accentText : c.textMuted }} variant="label-tertiary-regular">
        {label}
      </EtText>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtAppLayout> = {
  component: EtAppLayout,
  parameters: {
    notes:
      'Web shell app-layout skeleton: SideMenu | TopPanel | Main | Aside slots around a permanently-mounted three-column skeleton (stable-navigator invariant).',
  },
  title: 'eToro-UI/Components/Layout/EtAppLayout',
};

export default meta;

// ─────────────────────────────────────────────────────────────
// 1. Basic — the slotted skeleton
// ─────────────────────────────────────────────────────────────

function BasicDemo() {
  const { c } = useTheme();
  const [asideExpanded, setAsideExpanded] = useState(false);
  return (
    <ShellFrame>
      <EtAppLayout>
        <EtAppLayout.SideMenu>
          <FakeRail />
        </EtAppLayout.SideMenu>
        <EtAppLayout.TopPanel>
          <FakeBar />
        </EtAppLayout.TopPanel>
        <EtAppLayout.Main>
          <View style={styles.mainContent}>
            <EtText style={{ color: c.textMuted }} variant="body-secondary-regular">
              Main — the navigator
            </EtText>
          </View>
        </EtAppLayout.Main>
        <EtAppLayout.Aside expanded={asideExpanded} onExpandedChange={setAsideExpanded}>
          <FakeAsideContent />
        </EtAppLayout.Aside>
      </EtAppLayout>
    </ShellFrame>
  );
}

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic — the slotted shell</Title>
        <Desc>
          EtAppLayout is a PURE slotted shell: it renders the three-column skeleton (side-menu column, content column with top panel + body row, aside
          column) and paints the backgroundBase page canvas. The real shell composes EtSideMenu and EtTopPanel into the slots; here those slots hold
          plain placeholder content. The Aside slot is the controlled rail/panel machine — geometry follows the WINDOW width (not this frame): overlay
          below 1440, inline at/above, self-suppressed below 768 (native storybook shows no aside at phone widths).
        </Desc>
        <Preview>
          <BasicDemo />
        </Preview>
        <CodeBlock
          code={`import { EtAppLayout } from 'etoro-ui/shell';

<EtAppLayout>
  <EtAppLayout.SideMenu>{composedSideMenu}</EtAppLayout.SideMenu>
  <EtAppLayout.TopPanel>{composedTopPanel}</EtAppLayout.TopPanel>
  <EtAppLayout.Main>{navigator}</EtAppLayout.Main>
  <EtAppLayout.Aside expanded={asideExpanded} onExpandedChange={setAsideExpanded}>
    {asideContent}
  </EtAppLayout.Aside>
</EtAppLayout>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 2. Stable skeleton — Main never remounts as slots toggle
// ─────────────────────────────────────────────────────────────

function CounterContent() {
  const { c } = useTheme();
  const [count, setCount] = useState(0);
  return (
    <Pressable onPress={() => setCount((value) => value + 1)} style={styles.mainContent}>
      <EtText style={{ color: c.text }} variant="body-secondary-regular">
        {`Presses: ${count}`}
      </EtText>
      <EtText style={{ color: c.textMuted }} variant="label-tertiary-regular">
        Press me, then toggle the slots — the count survives
      </EtText>
    </Pressable>
  );
}

function StableSkeletonDemo() {
  const [withChrome, setWithChrome] = useState(true);
  const [withAside, setWithAside] = useState(true);
  return (
    <>
      <View style={styles.controlRow}>
        <SelectPill label="Shell chrome" onPress={() => setWithChrome((value) => !value)} selected={withChrome} />
        <SelectPill label="Aside" onPress={() => setWithAside((value) => !value)} selected={withAside} />
      </View>
      <ShellFrame>
        <EtAppLayout>
          {withChrome ? (
            <EtAppLayout.SideMenu>
              <FakeRail />
            </EtAppLayout.SideMenu>
          ) : null}
          {withChrome ? (
            <EtAppLayout.TopPanel>
              <FakeBar />
            </EtAppLayout.TopPanel>
          ) : null}
          <EtAppLayout.Main>
            <CounterContent />
          </EtAppLayout.Main>
          {withAside ? (
            <EtAppLayout.Aside expanded={false} onExpandedChange={() => undefined}>
              <FakeAsideContent />
            </EtAppLayout.Aside>
          ) : null}
        </EtAppLayout>
      </ShellFrame>
      <Readout>Skeleton Views are permanently mounted — slot presence only fills or empties them</Readout>
    </>
  );
}

export const StableSkeleton: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Stable skeleton — the navigator never remounts</Title>
        <Desc>
          The full skeleton renders unconditionally; toggling a slot fills or empties a stable View, it never restructures the tree. That is the
          stable-navigator invariant: crossing 768, entering a full-bleed route, or changing aside presence must not remount Main&apos;s children. The
          counter below keeps its state while the chrome and aside slots come and go.
        </Desc>
        <Preview>
          <StableSkeletonDemo />
        </Preview>
        <CodeBlock
          code={`// Shell-side gate — only the slot CONTENT is conditional:
<EtAppLayout>
  {showShell ? <EtAppLayout.SideMenu>{menu}</EtAppLayout.SideMenu> : null}
  {showShell ? <EtAppLayout.TopPanel>{panel}</EtAppLayout.TopPanel> : null}
  <EtAppLayout.Main>{navigator}</EtAppLayout.Main>
  {showAside ? <EtAppLayout.Aside expanded={asideExpanded} onExpandedChange={setAsideExpanded}>{aside}</EtAppLayout.Aside> : null}
</EtAppLayout>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3. Aside machine — controlled rail/panel
// ─────────────────────────────────────────────────────────────

function AsideMachineDemo() {
  const { c } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [lastTrigger, setLastTrigger] = useState('none yet');
  return (
    <>
      <View style={styles.controlRow}>
        <SelectPill
          label={expanded ? 'Collapse (shell-driven)' : 'Expand (shell-driven)'}
          onPress={() => setExpanded((value) => !value)}
          selected={expanded}
        />
      </View>
      <ShellFrame>
        <EtAppLayout>
          <EtAppLayout.TopPanel>
            <FakeBar />
          </EtAppLayout.TopPanel>
          <EtAppLayout.Main>
            <View style={styles.mainContent}>
              <EtText style={{ color: c.textMuted }} variant="body-secondary-regular">
                Main stays interactive — no backdrop, outside clicks land here
              </EtText>
            </View>
          </EtAppLayout.Main>
          <EtAppLayout.Aside
            expanded={expanded}
            onExpandedChange={(next, trigger) => {
              setExpanded(next);
              setLastTrigger(`${next ? 'expand' : 'collapse'} via ${trigger}`);
            }}
          >
            <FakeAsideContent />
          </EtAppLayout.Aside>
        </EtAppLayout>
      </ShellFrame>
      <Readout>{`last kit trigger: ${lastTrigger}`}</Readout>
    </>
  );
}

export const AsideMachine: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Aside machine — rail, panel, one persistent toggle</Title>
        <Desc>
          Press anywhere on the closed rail body (or the toggle) to expand; closing is toggle-only. Hovering the closed rail widens the surface 60→68
          as the press affordance. The kit reports every user-driven change through onExpandedChange with its trigger (button | rail) — the shell owns
          the state, the analytics funnel, and the 1440 breakpoint-default reset. Overlay vs inline follows the real window width; resize across 1440
          to see the presentation snap (browser storybook only — the machine self-suppresses below 768).
        </Desc>
        <Preview>
          <AsideMachineDemo />
        </Preview>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 4. API reference
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtAppLayout</SubTitle>
        <Desc>Root component. Flex-row skeleton painting the backgroundBase page canvas; classifies children by slot.</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'children', type: 'SideMenu | TopPanel | Main | Aside' },
            { default: 'undefined', prop: 'style', type: 'StyleProp<ViewStyle> (root row)' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAppLayout.SideMenu</SubTitle>
        <Desc>Optional slot for the shell&apos;s composed EtSideMenu. The slot column carries Z_SHELL_MENU.</Desc>
        <PropsTable data={[{ default: '-', prop: 'children', type: 'ReactNode' }]} />
      </Section>

      <Section>
        <SubTitle>EtAppLayout.TopPanel</SubTitle>
        <Desc>Optional slot for the shell&apos;s composed EtTopPanel, above the body row.</Desc>
        <PropsTable data={[{ default: '-', prop: 'children', type: 'ReactNode' }]} />
      </Section>

      <Section>
        <SubTitle>EtAppLayout.Main</SubTitle>
        <Desc>The one required slot — the navigator / screen. Its skeleton View is flex:1 and never remounts.</Desc>
        <PropsTable data={[{ default: '-', prop: 'children', type: 'ReactNode' }]} />
      </Section>

      <Section>
        <SubTitle>EtAppLayout.Aside</SubTitle>
        <Desc>
          The controlled rail/panel machine; the slot column carries Z_SHELL_ASIDE. Closed = a 60px rail (68 on hover) whose whole body expands on
          press; open = the tier-width panel (344–384). Overlay below 1440 (floats over Main, NO backdrop — outside clicks land on content), inline
          at/above (Main reflows). Close is button-only. Breakpoint-driven changes snap; button/rail changes animate on the left-menu curves. Below
          768 the machine suppresses itself. The shell must reset expanded to the breakpoint default on every 1440 crossing.
        </Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'children', type: 'ReactNode (the whole content contract)' },
            { default: '-', prop: 'expanded', type: 'boolean (controlled)' },
            { default: '-', prop: 'onExpandedChange', type: "(expanded, trigger: 'button' | 'rail') => void" },
            { default: 'Expand/Collapse panel', prop: 'toggleAccessibilityLabels', type: '{ expand?, collapse? }' },
            { default: 'undefined', prop: 'testID', type: 'string (+ -surface/-rail/-panel/-toggle)' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  asideContent: {
    flex: 1,
    gap: 4,
  },
  bar: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mainContent: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  pill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rail: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: 56,
  },
  readout: {
    fontFamily: 'Menlo',
  },
  shell: {
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    height: 320,
    overflow: 'hidden',
  },
});
