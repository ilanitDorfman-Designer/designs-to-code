import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAvatar, EtoroWordmark, EtText } from 'etoro-ui';
import {
  EtSideMenu,
  EtSideMenuTrigger,
  RAIL_WIDTH_BY_TIER,
  type SideMenuCloseReason,
  type SideMenuTier,
  TOP_PANEL_HEIGHT_REGULAR,
  WORDMARK_GLYPH_HEIGHT,
} from 'etoro-ui/shell';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtSideMenu>;

// ─────────────────────────────────────────────────────────────
// Demo data + shared menu content (mirrors the kit's own et-side-menu.tsx doc example)
// ─────────────────────────────────────────────────────────────

const AVATAR_URL = 'https://etoro-cdn.etorostatic.com/avatars/150X150/918269/10.jpg';

const PRIMARY_ITEMS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'watchlist', icon: 'watchlist', label: 'Watchlist' },
  { id: 'portfolio', icon: 'portfolio', label: 'Portfolio' },
  { id: 'discover', icon: 'discover', label: 'Discover' },
  { id: 'social', icon: 'social', label: 'Social' },
] as const;

const SECONDARY_ITEMS = [
  { id: 'settings', icon: 'gear', label: 'Settings' },
  { id: 'help', icon: 'help', label: 'Help Center' },
  { id: 'logout', icon: 'logout', label: 'Log Out' },
] as const;

/**
 * Returns the demo slots as an ARRAY, not a `<DemoMenuContent />` element:
 * `EtSideMenu` classifies its DIRECT children by `__SLOT_TYPE` (and
 * `Children.toArray` flattens arrays but not fragments or wrapper
 * components), so slots hidden behind a wrapper are silently dropped and
 * the menu renders empty.
 */
function useDemoMenuContent({ tileLoading = false }: { tileLoading?: boolean } = {}): React.ReactNode[] {
  return [
    <EtSideMenu.Header key="header" logo={<EtoroWordmark size={WORDMARK_GLYPH_HEIGHT} />} />,
    <EtSideMenu.Profile
      avatar={
        <EtAvatar shape="square" size="medium">
          <EtAvatar.Image src={AVATAR_URL} />
        </EtAvatar>
      }
      handle="@janeappleseed"
      key="profile"
      name="Jane Appleseed"
    />,
    <EtSideMenu.Tile icon="star" key="tile" loading={tileLoading} onPress={() => undefined} subtitle="Manage benefits" title="Club Select" />,
    <EtSideMenu.Section key="primary">
      {PRIMARY_ITEMS.map((item) => (
        <EtSideMenu.Item icon={item.icon} id={item.id} key={item.id} label={item.label} />
      ))}
    </EtSideMenu.Section>,
    <EtSideMenu.Section key="secondary" label="More" secondary>
      {SECONDARY_ITEMS.map((item) => (
        <EtSideMenu.Item icon={item.icon} id={item.id} key={item.id} label={item.label} />
      ))}
    </EtSideMenu.Section>,
    <EtSideMenu.Footer key="footer">
      <EtSideMenu.Item icon="more" id="more" label="More" />
    </EtSideMenu.Footer>,
  ];
}

// ─────────────────────────────────────────────────────────────
// Story chrome — a fixed-height shell row + fake page content, matching
// EtSplitLayout's story precedent for previewing a viewport-driven layout.
// ─────────────────────────────────────────────────────────────

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <View style={[styles.shell, { borderColor: c.borderSubtle }]}>{children}</View>;
}

function FakeContent({ children }: { children?: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={[styles.content, { backgroundColor: c.bgMuted }]}>
      <View style={[styles.topBar, { borderBottomColor: c.borderSubtle }]}>
        {children}
        <EtText style={{ color: c.textMuted }} variant="body-secondary-regular">
          Page content
        </EtText>
      </View>
    </View>
  );
}

function StateReadout({ expanded, lastReason }: { expanded: boolean; lastReason: string }) {
  const { c } = useTheme();
  return (
    <EtText style={[styles.readout, { color: c.textTertiary }]} variant="label-tertiary-regular">
      {`expanded=${String(expanded)} · last onExpandedChange reason="${lastReason}"`}
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

/** Controlled `expanded`/`activeItemId` state a shell would own, plus a readout of the last close reason. */
function useSideMenuDemoState(initialExpanded: boolean, initialActiveId: string = 'home') {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [activeId, setActiveId] = useState(initialActiveId);
  const [lastReason, setLastReason] = useState('—');

  const onExpandedChange = useCallback((next: boolean, reason: SideMenuCloseReason | 'open') => {
    setExpanded(next);
    setLastReason(reason);
  }, []);

  return { activeId, expanded, lastReason, onExpandedChange, setActiveId };
}

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtSideMenu> = {
  component: EtSideMenu,
  parameters: {
    notes: "Web shell's left navigation: a collapsed icon rail that morphs into a 280px panel. Fully controlled, web-only.",
  },
  title: 'eToro-UI/Components/Navigation/EtSideMenu',
};

export default meta;

// ─────────────────────────────────────────────────────────────
// 1. Rail — tier controls the collapsed width
// ─────────────────────────────────────────────────────────────

function RailDemo() {
  const menuContent = useDemoMenuContent();
  const [tier, setTier] = useState<SideMenuTier>(0);
  const { activeId, expanded, lastReason, onExpandedChange, setActiveId } = useSideMenuDemoState(false);

  return (
    <>
      <View style={styles.controlRow}>
        {([0, 1, 2] as const).map((t) => (
          <SelectPill key={t} label={`Tier ${t} · ${RAIL_WIDTH_BY_TIER[t]}px`} onPress={() => setTier(t)} selected={tier === t} />
        ))}
      </View>
      <ShellFrame>
        <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={tier}>
          {menuContent}
        </EtSideMenu>
        <FakeContent />
      </ShellFrame>
      <StateReadout expanded={expanded} lastReason={lastReason} />
    </>
  );
}

export const Rail: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Rail (collapsed)</Title>
        <Desc>
          The collapsed rail width tracks the shell's breakpoint tier — 72 / 80 / 84px — passed in as a controlled prop; EtSideMenu never measures the
          window itself. Switch tiers below: while collapsed, a tier change resizes the placeholder with no animation (`progress` stays 0). The
          `&lt;e&gt;` mark at the top doubles as the expand control — hover or focus it and it becomes the expand glyph; press to expand.
        </Desc>
        <Preview>
          <RailDemo />
        </Preview>
        <CodeBlock
          code={`<EtSideMenu tier={tier} expanded={expanded} onExpandedChange={onExpandedChange}
            activeItemId={activeId} onItemPress={setActiveId}>
  <EtSideMenu.Header logo={<EtoroWordmark size={WORDMARK_GLYPH_HEIGHT} />} />
  <EtSideMenu.Profile avatar={<EtAvatar … />} name="Jane" handle="@jane" />
  <EtSideMenu.Tile icon="star" title="Club Select" subtitle="Manage benefits" onPress={openClub} />
  <EtSideMenu.Section>{/* primary items */}</EtSideMenu.Section>
  <EtSideMenu.Section label="More" secondary>{/* secondary items, each with an icon */}</EtSideMenu.Section>
  <EtSideMenu.Footer>
    <EtSideMenu.Item id="more" icon="more" label="More" />
  </EtSideMenu.Footer>
</EtSideMenu>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 2. Expanded — controlled `expanded` prop, no hook mocking needed
// ─────────────────────────────────────────────────────────────

function ExpandedDemo() {
  const menuContent = useDemoMenuContent();
  const { activeId, expanded, lastReason, onExpandedChange, setActiveId } = useSideMenuDemoState(true);
  return (
    <>
      <ShellFrame>
        <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={1}>
          {menuContent}
        </EtSideMenu>
        <FakeContent />
      </ShellFrame>
      <StateReadout expanded={expanded} lastReason={lastReason} />
    </>
  );
}

export const Expanded: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Expanded (panel)</Title>
        <Desc>
          `expanded` starts `true` here — a fixed 280px panel, at every tier. Click the header toggle, an item row, or outside the surface (the
          full-viewport backdrop) to collapse it; the readout below shows which `reason` each path reports. Primary rows are text-only; the icons live
          in the collapsed rail and on the secondary "More" rows.
        </Desc>
        <Preview>
          <ExpandedDemo />
        </Preview>
        <CodeBlock code={'<EtSideMenu tier={1} expanded onExpandedChange={onExpandedChange} …>'} />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3. Hidden-tier overlay — tier -1 + a standalone EtSideMenuTrigger
// ─────────────────────────────────────────────────────────────

function HiddenTierDemo() {
  const menuContent = useDemoMenuContent();
  const { activeId, expanded, lastReason, onExpandedChange, setActiveId } = useSideMenuDemoState(false);
  return (
    <>
      <ShellFrame>
        <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={-1}>
          {menuContent}
        </EtSideMenu>
        <FakeContent>
          <EtSideMenuTrigger onPress={() => onExpandedChange(true, 'open')} />
        </FakeContent>
      </ShellFrame>
      <StateReadout expanded={expanded} lastReason={lastReason} />
    </>
  );
}

export const HiddenTierOverlay: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Hidden tier (-1) — trigger overlay</Title>
        <Desc>
          At `tier` -1 the rail is not rendered (0px placeholder) and the panel opens as a full overlay clip-revealed from the edge.
          `EtSideMenuTrigger` is context-free — mounted standalone in the top panel, OUTSIDE `EtSideMenu` — the shell wires its `onPress` to
          `onExpandedChange(true, 'open')` itself.
        </Desc>
        <Preview>
          <HiddenTierDemo />
        </Preview>
        <CodeBlock
          code={`// Top panel, OUTSIDE <EtSideMenu> — no context needed
<EtSideMenuTrigger onPress={() => onExpandedChange(true, 'open')} />

<EtSideMenu tier={-1} expanded={expanded} onExpandedChange={onExpandedChange} …>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 4. Active states — cycling `activeItemId` verifies the fill swap
// ─────────────────────────────────────────────────────────────

function ActiveStatesDemo() {
  const menuContent = useDemoMenuContent();
  const { activeId, expanded, lastReason, onExpandedChange, setActiveId } = useSideMenuDemoState(true);
  return (
    <>
      <View style={styles.controlRow}>
        {PRIMARY_ITEMS.map((item) => (
          <SelectPill key={item.id} label={item.label} onPress={() => setActiveId(item.id)} selected={activeId === item.id} />
        ))}
      </View>
      <ShellFrame>
        <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={1}>
          {menuContent}
        </EtSideMenu>
        <FakeContent />
      </ShellFrame>
      <StateReadout expanded={expanded} lastReason={lastReason} />
    </>
  );
}

export const ActiveStates: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Active item — band + edge bar</Title>
        <Desc>
          `activeItemId` marks a row with a full-width 3% `carbon900` band plus a 2px green gradient bar flush to the surface's start edge
          (`primary600` → `verdictPositive400Static`, top to bottom), in both states; where an icon renders (rail cells, secondary rows) it also swaps
          to `IconVariant.Filled`. Use the pills above to change it externally, or click a row in the menu itself — that also fires `onItemPress` AND
          collapses the panel via `requestClose('item')`, the real click-to-navigate contract.
        </Desc>
        <Preview>
          <ActiveStatesDemo />
        </Preview>
        <CodeBlock code={'<EtSideMenu activeItemId={activeId} onItemPress={setActiveId} …>'} />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 5. Club tile — content vs loading skeleton
// ─────────────────────────────────────────────────────────────

function ClubTileDemo() {
  const [loading, setLoading] = useState(false);
  const menuContent = useDemoMenuContent({ tileLoading: loading });
  const { activeId, expanded, lastReason, onExpandedChange, setActiveId } = useSideMenuDemoState(true);
  return (
    <>
      <View style={styles.controlRow}>
        <SelectPill label={loading ? 'loading: true' : 'loading: false'} onPress={() => setLoading((v) => !v)} selected={loading} />
      </View>
      <ShellFrame>
        <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={1}>
          {menuContent}
        </EtSideMenu>
        <FakeContent />
      </ShellFrame>
      <StateReadout expanded={expanded} lastReason={lastReason} />
    </>
  );
}

export const ClubTile: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Club tile</Title>
        <Desc>
          `EtSideMenu.Tile` is the Club card between the profile row and the menu — an icon + title line, a subtitle, and a trailing chevron on the
          `cardDefault` surface, inset 24px from the panel edges. It is a dumb slot: the shell resolves what it says (club tier, member state) and
          where it navigates. While `loading` it renders its exact card footprint as a skeleton, so the menu below never jumps. It only exists in the
          expanded panel — the rail has no tile.
        </Desc>
        <Preview>
          <ClubTileDemo />
        </Preview>
        <CodeBlock code={'<EtSideMenu.Tile icon="star" title="Club Select" subtitle="Manage benefits" loading={loading} onPress={openClub} />'} />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 6. Hover — real pointer hover (web preview only)
// ─────────────────────────────────────────────────────────────

export const Hover: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Hover</Title>
        <Desc>
          Real pointer hover, driven by `useHover().isHovered` — hover any rail cell or panel row with an actual mouse in the web preview (touch never
          sets hover) to see the full-bleed `carbon900` overlay animate to 3% opacity (80ms in / 160ms out, linear). No radius, no inset, no text/icon
          color change.
        </Desc>
        <Preview>
          <ExpandedDemo />
        </Preview>
        <CodeBlock code={'const { isHovered, hoverProps } = useHover();\n<Pressable {...hoverProps}>…</Pressable>'} />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 6. Reduced motion — documented, not decorator-mocked
// ─────────────────────────────────────────────────────────────

export const ReducedMotion: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Reduced motion</Title>
        <Desc>
          `useReducedMotion()` reads `AccessibilityInfo` (RNW bridges to `matchMedia('(prefers-reduced-motion: reduce)')`) once per mount — it is not
          a story-controllable prop, so this page does not fake it with a module-mock decorator (that would diverge from the real runtime path). To
          see the real effect: enable "Reduce motion" in your OS accessibility settings, or emulate `prefers-reduced-motion: reduce` via your browser
          DevTools' Rendering panel, then reload this story and toggle the menu below.
        </Desc>
        <Desc>
          Under reduced motion every geometry change snaps instantly (`progress` jumps rather than animating) and the two layers cross-fade over a
          single 80ms opacity swap (`crossfade`) instead of the full asymmetric expand/collapse timeline. That 80ms contract is covered by
          `et-side-menu.test.tsx`, not by this visual page.
        </Desc>
        <Preview>
          <ExpandedDemo />
        </Preview>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 7. Forced RTL — web-only decorator + remount key
// ─────────────────────────────────────────────────────────────

function ForcedRtlDecorator({ children }: { children: React.ReactNode }) {
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    const doc = typeof document === 'undefined' ? null : document;
    if (!doc) return undefined;
    const previousDir = doc.documentElement.dir;
    doc.documentElement.dir = 'rtl';
    // `useLayoutDirection`'s web sibling reads `document.documentElement.dir` once, in a
    // `useState` initializer — force a full remount now that 'rtl' is committed so every
    // already-mounted instance underneath re-reads it correctly.
    setMountKey((key) => key + 1);
    return () => {
      doc.documentElement.dir = previousDir;
    };
  }, []);

  return <View key={mountKey}>{children}</View>;
}

function ForcedRtlDemo() {
  const menuContent = useDemoMenuContent();
  const { activeId, expanded, lastReason, onExpandedChange, setActiveId } = useSideMenuDemoState(true);
  return (
    <ForcedRtlDecorator>
      <ShellFrame>
        <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={1}>
          {menuContent}
        </EtSideMenu>
        <FakeContent />
      </ShellFrame>
      <StateReadout expanded={expanded} lastReason={lastReason} />
    </ForcedRtlDecorator>
  );
}

export const ForcedRTL: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Forced RTL</Title>
        <Desc>
          Web-only: sets `document.documentElement.dir = 'rtl'` on mount, then forces a full remount (a React `key` bump) so `useLayoutDirection`'s
          web sibling — which reads the `dir` attribute once, in a `useState` initializer, not reactively — actually picks it up; restores the
          previous `dir` on unmount.
        </Desc>
        <Desc>
          Exercises the logical `start`/`end` insets (surface position, end-corner radius, backdrop) and every `dirSign`-signed transform: rail icon
          drift, panel row drift, and the toggle glyph's `scaleX` mirror.
        </Desc>
        <Preview>
          <ForcedRtlDemo />
        </Preview>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 8. API reference
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtSideMenu</SubTitle>
        <Desc>Root component. Fully controlled — holds no expanded state itself.</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'tier', type: '-1 | 0 | 1 | 2' },
            { default: '-', prop: 'expanded', type: 'boolean' },
            { default: '-', prop: 'onExpandedChange', type: '(expanded: boolean, reason: SideMenuCloseReason | "open") => void' },
            { default: 'undefined', prop: 'activeItemId', type: 'string' },
            { default: 'undefined', prop: 'onItemPress', type: '(id: string) => void' },
            { default: '-', prop: 'children', type: 'Header | Profile | Tile | Section | Footer' },
            { default: 'undefined', prop: 'style', type: 'StyleProp<ViewStyle>' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSideMenu.Header</SubTitle>
        <Desc>
          Rail: the `&lt;e&gt;` mark doubling as the expand toggle (hover/focus reveals the glyph). Panel: logo slot + collapse toggle, 36px row.
        </Desc>
        <PropsTable
          data={[
            { default: 'undefined', prop: 'logo', type: 'ReactNode' },
            { default: "'Expand'/'Collapse menu'", prop: 'toggleAccessibilityLabels', type: '{ expand?: string; collapse?: string }' },
            { default: 'undefined', prop: 'testID', type: 'string (emitted as {testID}-rail / {testID}-panel)' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSideMenu.Profile</SubTitle>
        <Desc>Rail: avatar only. Panel: avatar + name/@handle, 36px row.</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'avatar', type: 'ReactNode' },
            { default: 'undefined', prop: 'name', type: 'string' },
            { default: 'undefined', prop: 'handle', type: 'string' },
            { default: 'undefined (no-op)', prop: 'onPress', type: '() => void' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSideMenu.Tile</SubTitle>
        <Desc>Panel-only Club card between Profile and the menu: icon + title line, subtitle, trailing chevron on the `cardDefault` surface.</Desc>
        <PropsTable
          data={[
            { default: 'undefined', prop: 'icon', type: 'IconName' },
            { default: '-', prop: 'title', type: 'string' },
            { default: 'undefined', prop: 'subtitle', type: 'string' },
            { default: 'undefined', prop: 'onPress', type: '() => void' },
            { default: 'false', prop: 'loading', type: 'boolean (card-footprint skeleton)' },
            { default: 'undefined', prop: 'testID', type: 'string (emitted as {testID}-panel / {testID}-skeleton)' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSideMenu.Section</SubTitle>
        <Desc>
          Primary (default): rail cells / staggered 40px text-only panel rows. Secondary: hidden in rail; "More" divider + 40px icon+label rows in
          panel.
        </Desc>
        <PropsTable
          data={[
            { default: 'undefined', prop: 'label', type: 'string' },
            { default: 'false', prop: 'secondary', type: 'boolean' },
            { default: '-', prop: 'children', type: 'EtSideMenu.Item[]' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSideMenu.Item</SubTitle>
        <Desc>Rail cell / expanded 40px row (primary text-only, secondary icon+label) / null (secondary items are invisible in the rail).</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'id', type: 'string' },
            { default: '-', prop: 'label', type: 'string (always required — rail a11y label)' },
            { default: 'undefined', prop: 'icon', type: 'IconName' },
            { default: 'carbon900', prop: 'iconColor', type: 'string' },
            { default: 'undefined', prop: 'badge', type: 'ReactNode' },
            { default: 'false', prop: 'disabled', type: 'boolean' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSideMenu.Footer</SubTitle>
        <Desc>Rail-only bottom group. Renders `null` in the panel layer.</Desc>
        <PropsTable data={[{ default: '-', prop: 'children', type: 'EtSideMenu.Item[]' }]} />
      </Section>

      <Section>
        <SubTitle>EtSideMenuTrigger</SubTitle>
        <Desc>Context-free opener for the hidden tier's top panel. Imports no side-menu context.</Desc>
        <PropsTable
          data={[
            { default: '-', prop: 'onPress', type: '() => void' },
            { default: "'Open menu'", prop: 'accessibilityLabel', type: 'string' },
            { default: 'undefined', prop: 'testID', type: 'string' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Constants</SubTitle>
        <Desc>Shell-facing exports for computing layout around the menu.</Desc>
        <PropsTable
          data={[
            { default: '[72, 80, 84]', prop: 'RAIL_WIDTH_BY_TIER', type: 'readonly [number, number, number]' },
            { default: '(tier) => number', prop: 'railWidthForTier', type: '(tier: SideMenuTier) => number' },
            { default: '280', prop: 'PANEL_WIDTH', type: 'number' },
            { default: '13.3', prop: 'WORDMARK_GLYPH_HEIGHT', type: 'number (pass to <EtoroWordmark size>)' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
    flexDirection: 'row',
    height: 640,
    overflow: 'hidden',
  },
  topBar: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    height: TOP_PANEL_HEIGHT_REGULAR,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
});
