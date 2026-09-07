import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAvatar, EtoroWordmark, EtText } from 'etoro-ui';
import { EtSideMenu, WORDMARK_GLYPH_HEIGHT } from 'etoro-ui/shell';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = async (codeText: string) => {
    try {
      await Clipboard.setStringAsync(codeText);
      Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Copy Failed', 'Could not copy code to clipboard', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={[styles.codeContainer, { backgroundColor: colors.bgNeutralQuaternary, borderColor: colors.dividerPrimary }]}>
      {title && (
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]} variant="label-primary-semibold">
            {title}
          </EtText>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <EtText style={{ color: colors.actionBrandText }} variant="label-tertiary-regular">
              Copy
            </EtText>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <EtText style={[styles.codeText, { color: colors.textPrimaryNeutral }]} variant="body-base-regular">
          {code}
        </EtText>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    notes: 'Complete guide for the EtSideMenu component with a live, interactive example.',
  },
  title: 'eToro-UI/Components/Navigation/EtSideMenu/📖 Introduction',
};

export default meta;

const AVATAR_URL = 'https://etoro-cdn.etorostatic.com/avatars/150X150/918269/10.jpg';

function LiveDemo() {
  const { colors } = useEtoroTheme();
  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState('home');

  const onExpandedChange = useCallback((next: boolean) => setExpanded(next), []);

  return (
    <View style={[styles.demoShell, { borderColor: colors.dividerPrimary }]}>
      <EtSideMenu activeItemId={activeId} expanded={expanded} onExpandedChange={onExpandedChange} onItemPress={setActiveId} tier={1}>
        <EtSideMenu.Header logo={<EtoroWordmark size={WORDMARK_GLYPH_HEIGHT} />} />
        <EtSideMenu.Profile
          avatar={
            <EtAvatar shape="square" size="medium">
              <EtAvatar.Image src={AVATAR_URL} />
            </EtAvatar>
          }
          handle="@janeappleseed"
          name="Jane Appleseed"
        />
        <EtSideMenu.Tile icon="star" onPress={() => undefined} subtitle="Manage benefits" title="Club Select" />
        <EtSideMenu.Section>
          <EtSideMenu.Item icon="home" id="home" label="Home" />
          <EtSideMenu.Item icon="watchlist" id="watchlist" label="Watchlist" />
          <EtSideMenu.Item icon="portfolio" id="portfolio" label="Portfolio" />
          <EtSideMenu.Item icon="discover" id="discover" label="Discover" />
          <EtSideMenu.Item icon="social" id="social" label="Social" />
        </EtSideMenu.Section>
        <EtSideMenu.Section label="More" secondary>
          <EtSideMenu.Item icon="gear" id="settings" label="Settings" />
          <EtSideMenu.Item icon="help" id="help" label="Help Center" />
        </EtSideMenu.Section>
        <EtSideMenu.Footer>
          <EtSideMenu.Item icon="more" id="more" label="More" />
        </EtSideMenu.Footer>
      </EtSideMenu>
      <View style={[styles.demoContent, { backgroundColor: colors.bgNeutralSecondary }]}>
        <View style={[styles.demoTopBar, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText style={{ color: colors.textSecondaryNeutral }} variant="body-secondary-regular">
            Active: {activeId} · {expanded ? 'expanded' : 'rail'}
          </EtText>
        </View>
      </View>
    </View>
  );
}

export const Introduction: Story = {
  args: {},
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={[styles.header, { borderColor: colors.dividerPrimary }]}>
          <EtText style={styles.title} variant="display-main">
            🧭 EtSideMenu
          </EtText>
          <EtText style={styles.subtitle} variant="heading-compact">
            The web shell's left navigation — a collapsed icon rail that morphs into a 280px panel
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText style={styles.featuresTitle} variant="heading-base">
            Features
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Rail width tracks the shell breakpoint tier — 72 / 80 / 84px
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Rail ↔ 280px panel morph — a single `progress` value drives width, end-corner radius, and every crossfade
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Fully controlled: `expanded` + `onExpandedChange(next, reason)` — the kit holds no menu state itself
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Compound API: Header · Profile · Tile · Section (primary/secondary) · Item · Footer
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Navigation-agnostic — item ids in, `onItemPress(id)` out; no router, no BL
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Web close behaviors: Escape, focusout, and backdrop-click, each reported via `reason`
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Reduced-motion aware; RTL-aware via `useLayoutDirection` — no `entering`/`exiting` layout animations anywhere
          </EtText>
        </View>

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Live demo
        </EtText>
        <EtText style={styles.selectedText} variant="body-secondary-regular">
          Hover or focus the `&lt;e&gt;` mark at the top of the rail — it becomes the expand control; press it to expand, and use the panel's header
          toggle to collapse. Click an item row to set it active and close the panel. (`EtSideMenuTrigger` is strictly the hidden-tier (-1) opener —
          see the Hidden tier section below.)
        </EtText>
        <LiveDemo />

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Anatomy
        </EtText>
        <EtText style={styles.featureText} variant="body-base-regular">
          An in-flow PLACEHOLDER reserves the rail width. Inside it, an absolutely-positioned SURFACE animates width (rail → 280) and the logical
          END-corner radius (0 → 32), clipped via `overflow: hidden`. Slot children are rendered TWICE — once per crossfading layer — so nothing ever
          mounts or unmounts during the animation:
        </EtText>
        <CodeBlock
          code={`placeholder (width = railWidthForTier(tier))
├── backdrop (web-only, position:fixed, mounted only while expanded)
└── surface (animated width + end-radii, overflow hidden)
    ├── rail layer   ← not rendered at tier -1
    └── panel layer  ← fixed 280px width`}
          title="Structure"
        />

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Basic Usage
        </EtText>
        <CodeBlock
          code={`import { EtoroWordmark, EtAvatar } from 'etoro-ui';
import { EtSideMenu, WORDMARK_GLYPH_HEIGHT } from 'etoro-ui/shell';

const [expanded, setExpanded] = useState(false);

<EtSideMenu
  tier={tier}                        // from useBreakpointTier(SHELL_TIERS)
  expanded={expanded}
  onExpandedChange={(next, reason) => setExpanded(next)}
  activeItemId={activeId}
  onItemPress={navigate}
>
  <EtSideMenu.Header logo={<EtoroWordmark size={WORDMARK_GLYPH_HEIGHT} />} />
  <EtSideMenu.Profile avatar={<EtAvatar size="medium" shape="square">…</EtAvatar>} name="Jane" handle="@jane" />
  <EtSideMenu.Tile icon="star" title="Club Select" subtitle="Manage benefits" onPress={openClub} />

  <EtSideMenu.Section>
    <EtSideMenu.Item id="home" label="Home" icon="home" />
    <EtSideMenu.Item id="watchlist" label="Watchlist" icon="watchlist" />
  </EtSideMenu.Section>

  <EtSideMenu.Section label="More" secondary>
    <EtSideMenu.Item id="settings" label="Settings" icon="gear" />
  </EtSideMenu.Section>

  <EtSideMenu.Footer>
    <EtSideMenu.Item id="more" label="More" icon="more" />
  </EtSideMenu.Footer>
</EtSideMenu>`}
          title="Compound composition"
        />

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Hidden tier (-1) — trigger
        </EtText>
        <EtText style={styles.featureText} variant="body-base-regular">
          Below the narrowest tier the rail disappears entirely. Mount `EtSideMenuTrigger` — a context-free button — in the top panel, OUTSIDE
          `EtSideMenu`, to open it as a full overlay.
        </EtText>
        <CodeBlock
          code={`// Top panel — no side-menu context needed here
<EtSideMenuTrigger onPress={() => setExpanded(true)} />

<EtSideMenu tier={-1} expanded={expanded} onExpandedChange={setExpanded}>
  {/* same children */}
</EtSideMenu>`}
          title="Hidden-tier overlay"
        />

        <View style={[styles.apiReference, { borderColor: colors.dividerPrimary }]}>
          <EtText style={styles.apiTitle} variant="heading-base">
            Quick API Reference
          </EtText>
          <CodeBlock
            code={`interface EtSideMenuProps {
  tier: -1 | 0 | 1 | 2;                                   // from useBreakpointTier(SHELL_TIERS)
  expanded: boolean;                                      // fully controlled
  onExpandedChange: (
    expanded: boolean,
    reason: 'toggle' | 'outside' | 'escape' | 'focusout' | 'item' | 'open'
  ) => void;
  activeItemId?: string;
  onItemPress?: (id: string) => void;
  children: ReactNode;                                    // Header | Profile | Tile | Section | Footer
  style?: StyleProp<ViewStyle>;                           // placeholder root only
  testID?: string;
}`}
            title="EtSideMenuProps"
          />
          <CodeBlock
            code={`interface EtSideMenuItemProps {
  id: string;
  label: string;          // ALWAYS required — the rail cell's accessibility label
  icon?: IconName;        // absent ⇒ text-only row, invisible in the rail
  iconColor?: string;
  badge?: ReactNode;
  disabled?: boolean;
  testID?: string;
}`}
            title="EtSideMenuItemProps"
          />
          <CodeBlock
            code={`RAIL_WIDTH_BY_TIER: readonly [72, 80, 84]
railWidthForTier(tier: SideMenuTier): number
PANEL_WIDTH: 280
WORDMARK_GLYPH_HEIGHT: 13.3   // pass to <EtoroWordmark size={…} />
// Top-panel heights live in the top-panel family:
// TOP_PANEL_HEIGHT_REGULAR: 76 / TOP_PANEL_HEIGHT_TALL: 84`}
            title="Shell-facing constants"
          />
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  apiReference: {
    borderTopWidth: 1,
    marginTop: 24,
    paddingTop: 24,
  },
  apiTitle: {
    marginBottom: 16,
  },
  codeContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 12,
    overflow: 'hidden',
  },
  codeHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeText: {
    fontFamily: 'Menlo',
    lineHeight: 18,
    padding: 12,
  },
  codeTitle: {},
  container: {
    flex: 1,
    padding: 16,
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  decorator: {
    flex: 1,
  },
  demoContent: {
    flex: 1,
  },
  demoShell: {
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 560,
    overflow: 'hidden',
  },
  demoTopBar: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    height: 76,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
  },
  featureText: {
    marginBottom: 4,
    opacity: 0.85,
  },
  features: {
    marginBottom: 24,
  },
  featuresTitle: {
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 24,
  },
  selectedText: {
    marginBottom: 12,
    opacity: 0.7,
  },
  subtitle: {
    opacity: 0.8,
    textAlign: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
});
