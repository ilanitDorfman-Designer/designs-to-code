import type { Meta, StoryObj } from '@storybook/react-native';
import { EtIconV2, EtText } from 'etoro-ui';
import { EtSideMenuTrigger, EtTopPanel, TOP_PANEL_HEIGHT_REGULAR, TOP_PANEL_HEIGHT_TALL } from 'etoro-ui/shell';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtTopPanel>;

// ─────────────────────────────────────────────────────────────
// Story chrome — a bordered shell column with fake page content below the
// panel, matching the EtSideMenu story precedent for viewport-driven chrome.
// ─────────────────────────────────────────────────────────────

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <View style={[styles.shell, { borderColor: c.borderSubtle }]}>{children}</View>;
}

function FakeContent() {
  const { c } = useTheme();
  return (
    <View style={[styles.content, { backgroundColor: c.bgMuted }]}>
      <EtText style={{ color: c.textMuted }} variant="body-secondary-regular">
        Page content
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

function DemoBell() {
  return <EtIconV2 accessibilityLabel="Notifications" name="notification-fill" size={20} />;
}

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtTopPanel> = {
  component: EtTopPanel,
  parameters: {
    notes:
      "Web shell's global top panel: Leading | Search + ToriBadge (centered group) | Actions, height controlled by the `tall` prop (76/84). Slot-based and dumb.",
  },
  title: 'eToro-UI/Components/Navigation/EtTopPanel',
};

export default meta;

// ─────────────────────────────────────────────────────────────
// 1. Heights — `tall` controls 76 vs 84
// ─────────────────────────────────────────────────────────────

function HeightsDemo() {
  const [tall, setTall] = useState(false);
  return (
    <>
      <View style={styles.controlRow}>
        <SelectPill label={`Regular · ${TOP_PANEL_HEIGHT_REGULAR}px`} onPress={() => setTall(false)} selected={!tall} />
        <SelectPill label={`Tall · ${TOP_PANEL_HEIGHT_TALL}px`} onPress={() => setTall(true)} selected={tall} />
      </View>
      <ShellFrame>
        <EtTopPanel tall={tall}>
          <EtTopPanel.Leading />
          <EtTopPanel.Search onPress={() => {}} placeholder="Search for…" />
          <EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" />
          <EtTopPanel.Actions>
            <DemoBell />
          </EtTopPanel.Actions>
        </EtTopPanel>
        <FakeContent />
      </ShellFrame>
      <Readout>{`tall=${String(tall)} → height ${tall ? TOP_PANEL_HEIGHT_TALL : TOP_PANEL_HEIGHT_REGULAR}px (44px bar row unchanged)`}</Readout>
    </>
  );
}

export const Heights: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Heights — regular / tall</Title>
        <Desc>
          The panel is 76px below the 1280 breakpoint and 84px at ≥1280 — only the vertical padding grows (16→20), the 44px bar row is identical. The
          kit never measures the window: the shell passes `tall` from `useBreakpoint(BREAKPOINT_DESKTOP_S)`, and the change snaps with the breakpoint
          (not animated), like the side-menu rail widths.
        </Desc>
        <Preview>
          <HeightsDemo />
        </Preview>
        <CodeBlock
          code={`const isTall = useBreakpoint(BREAKPOINT_DESKTOP_S); // shell-side, 1280

<EtTopPanel tall={isTall}>
  <EtTopPanel.Leading />
  <EtTopPanel.Search placeholder="Search for…" onPress={openSearch} />
  <EtTopPanel.ToriBadge label="Ask" accentLabel="Tori" />
  <EtTopPanel.Actions>{bell}</EtTopPanel.Actions>
</EtTopPanel>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 2. Leading slot — trigger, or nothing at all
// ─────────────────────────────────────────────────────────────

function LeadingDemo() {
  const [withTrigger, setWithTrigger] = useState(true);
  return (
    <>
      <View style={styles.controlRow}>
        <SelectPill label="Tier -1 · trigger" onPress={() => setWithTrigger(true)} selected={withTrigger} />
        <SelectPill label="Rail visible · empty" onPress={() => setWithTrigger(false)} selected={!withTrigger} />
      </View>
      <ShellFrame>
        <EtTopPanel tall={false}>
          <EtTopPanel.Leading>{withTrigger ? <EtSideMenuTrigger onPress={() => {}} /> : null}</EtTopPanel.Leading>
          <EtTopPanel.Search onPress={() => {}} placeholder="Search for…" />
          <EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" />
          <EtTopPanel.Actions>
            <DemoBell />
          </EtTopPanel.Actions>
        </EtTopPanel>
        <FakeContent />
      </ShellFrame>
      <Readout>{withTrigger ? 'Leading hosts EtSideMenuTrigger (rail hidden, 768–1023)' : 'Leading is empty and renders nothing'}</Readout>
    </>
  );
}

export const LeadingSlot: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Leading — trigger or nothing</Title>
        <Desc>
          At tier -1 (rail hidden) the shell mounts `EtSideMenuTrigger` in the Leading slot. At every other tier the slot is EMPTY — and renders
          nothing: the search group centers in the flexible zone between the edge clusters, so an empty slot holds no geometry. Toggle above — the
          group re-centers in the remaining span.
        </Desc>
        <Preview>
          <LeadingDemo />
        </Preview>
        <CodeBlock
          code={`<EtTopPanel.Leading>
  {tier === -1 ? <EtSideMenuTrigger onPress={openMenu} /> : null}
</EtTopPanel.Leading>
// no children ⇒ renders nothing
// (false/null children count as empty too)`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3. Search — pressable pill, not an input
// ─────────────────────────────────────────────────────────────

function SearchDemo() {
  const [presses, setPresses] = useState(0);
  return (
    <>
      <ShellFrame>
        <EtTopPanel tall={false}>
          <EtTopPanel.Leading />
          <EtTopPanel.Search onPress={() => setPresses((count) => count + 1)} placeholder="Search for…" />
          <EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" />
          <EtTopPanel.Actions>
            <DemoBell />
          </EtTopPanel.Actions>
        </EtTopPanel>
        <FakeContent />
      </ShellFrame>
      <Readout>{`onPress fired ${presses} time${presses === 1 ? '' : 's'} — the shell navigates to /search here`}</Readout>
    </>
  );
}

export const PressableSearch: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Search — a press target, not an input</Title>
        <Desc>
          The pill mimics the DS Search Field rest state (280×40, radius 100, on-surface 8% background, primary-color text, rest-visible clear icon)
          but is a plain Pressable — it must never focus a keyboard. The shell navigates to the search screen on press. The trailing xmark is
          decorative and hidden from assistive technology.
        </Desc>
        <Preview>
          <SearchDemo />
        </Preview>
        <CodeBlock
          code={`<EtTopPanel.Search placeholder={t('topPanel.searchPlaceholder')} onPress={() => guardedRouter.navigate('/(protected)/search')} />`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 4. Tori badge — two-tone pill, skeleton state
// ─────────────────────────────────────────────────────────────

function ToriBadgeDemo() {
  const [loading, setLoading] = useState(false);
  const [presses, setPresses] = useState(0);
  return (
    <>
      <View style={styles.controlRow}>
        <SelectPill label="Loaded" onPress={() => setLoading(false)} selected={!loading} />
        <SelectPill label="Skeleton" onPress={() => setLoading(true)} selected={loading} />
      </View>
      <ShellFrame>
        <EtTopPanel tall={false}>
          <EtTopPanel.Leading />
          <EtTopPanel.Search onPress={() => {}} placeholder="Search for…" />
          <EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" loading={loading} onPress={() => setPresses((count) => count + 1)} />
          <EtTopPanel.Actions>
            <DemoBell />
          </EtTopPanel.Actions>
        </EtTopPanel>
        <FakeContent />
      </ShellFrame>
      <Readout>
        {loading ? 'Same-footprint skeleton — the centered group cannot shift' : `onPress fired ${presses} time${presses === 1 ? '' : 's'}`}
      </Readout>
    </>
  );
}

export const ToriBadge: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>ToriBadge — the "Ask Tori" pill</Title>
        <Desc>
          A pill on the accent tint next to the search: the theme-gradient tori-logo mark, then the label painted as ONE gradient run — primary text
          color into the positive green, fully green from 35.577% of the text width (it merely reads as two-tone). Every stop is a theme token, so
          dark/light flips automatically. It is a button only when `onPress` is given — the shell wires the Tori surface when it exists. `loading`
          swaps in a same-footprint skeleton so the centered group holds its position while availability resolves.
        </Desc>
        <Preview>
          <ToriBadgeDemo />
        </Preview>
        <CodeBlock
          code={`<EtTopPanel.ToriBadge label={t('topPanel.askToriPrefix')} accentLabel="Tori" loading={isResolving} onPress={openTori} />`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 5. API reference
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtTopPanel</SubTitle>
        <Desc>
          Root component. Three zones — Leading hugs the start, Search + ToriBadge center as one group, Actions hugs the end. Height fully controlled
          by `tall`.
        </Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'tall', type: 'boolean (76px / 84px)' },
            { default: '-', prop: 'children', type: 'Leading | Search | ToriBadge | Actions' },
            { default: 'undefined', prop: 'style', type: 'StyleProp<ViewStyle>' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopPanel.Leading</SubTitle>
        <Desc>44px-tall slot at the start. Empty ⇒ renders nothing (the centered group owes it no geometry).</Desc>
        <PropsTable
          data={[
            { default: 'undefined', prop: 'children', type: 'ReactNode' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopPanel.Search</SubTitle>
        <Desc>Pressable rest-state pill, 280×40. Accessibility role button; label defaults to the placeholder.</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'placeholder', type: 'string' },
            { default: '-', prop: 'onPress', type: '() => void' },
            { default: 'placeholder', prop: 'accessibilityLabel', type: 'string' },
            { default: 'undefined', prop: 'testID', type: 'string (emits {testID}-clear on the xmark wrapper)' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopPanel.ToriBadge</SubTitle>
        <Desc>The "Ask Tori" pill: accentE100 tint, theme-gradient logo, one-gradient-run label. Button only when `onPress` is given.</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'label', type: 'string (gradient start half)' },
            { default: '-', prop: 'accentLabel', type: 'string (gradient end half)' },
            { default: 'false', prop: 'loading', type: 'boolean (same-footprint skeleton)' },
            { default: 'undefined', prop: 'onPress', type: '() => void' },
            { default: 'label + accentLabel', prop: 'accessibilityLabel', type: 'string' },
            { default: 'undefined', prop: 'testID', type: 'string (emits {testID}-skeleton while loading)' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopPanel.Actions</SubTitle>
        <Desc>
          Trailing hug cluster: `leading` (the screen's handed-up action) rendered raw when present, then children (the bell) in a 36×36 slot.
        </Desc>
        <PropsTable
          data={[
            { default: 'undefined', prop: 'children', type: 'ReactNode' },
            { default: 'undefined', prop: 'leading', type: 'ReactNode' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Constants</SubTitle>
        <Desc>Shell-facing exports for computing layout around the panel.</Desc>
        <PropsTable
          data={[
            { default: '76', prop: 'TOP_PANEL_HEIGHT_REGULAR', type: 'number' },
            { default: '84', prop: 'TOP_PANEL_HEIGHT_TALL', type: 'number' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
