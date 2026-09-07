import type { Meta, StoryObj } from '@storybook/react-native';
import { EtIconV2, EtText } from 'etoro-ui';
import { EtSideMenuTrigger, EtTopPanel } from 'etoro-ui/shell';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
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
    notes: 'Complete guide for the EtTopPanel component with a live, interactive example.',
  },
  title: 'eToro-UI/Components/Navigation/EtTopPanel/📖 Introduction',
};

export default meta;

function LiveDemo() {
  const { colors } = useEtoroTheme();
  const [tall, setTall] = useState(false);
  const [hiddenTier, setHiddenTier] = useState(true);
  const [lastPress, setLastPress] = useState('—');

  return (
    <View style={[styles.demoShell, { borderColor: colors.dividerPrimary }]}>
      <EtTopPanel tall={tall}>
        <EtTopPanel.Leading>{hiddenTier ? <EtSideMenuTrigger onPress={() => setLastPress('trigger')} /> : null}</EtTopPanel.Leading>
        <EtTopPanel.Search onPress={() => setLastPress('search')} placeholder="Search for…" />
        <EtTopPanel.ToriBadge accentLabel="Tori" label="Ask" onPress={() => setLastPress('tori')} />
        <EtTopPanel.Actions>
          <EtIconV2 accessibilityLabel="Notifications" name="notification-fill" onPress={() => setLastPress('bell')} size={20} />
        </EtTopPanel.Actions>
      </EtTopPanel>
      <View style={[styles.demoContent, { backgroundColor: colors.bgNeutralSecondary }]}>
        <View style={styles.demoControls}>
          <Pressable onPress={() => setTall((value) => !value)} style={[styles.demoControl, { borderColor: colors.dividerPrimary }]}>
            <EtText style={{ color: colors.textPrimaryNeutral }} variant="label-tertiary-regular">
              {tall ? 'tall (84px)' : 'regular (76px)'}
            </EtText>
          </Pressable>
          <Pressable onPress={() => setHiddenTier((value) => !value)} style={[styles.demoControl, { borderColor: colors.dividerPrimary }]}>
            <EtText style={{ color: colors.textPrimaryNeutral }} variant="label-tertiary-regular">
              {hiddenTier ? 'leading: trigger' : 'leading: empty'}
            </EtText>
          </Pressable>
        </View>
        <EtText style={{ color: colors.textSecondaryNeutral }} variant="body-secondary-regular">
          Last press: {lastPress}
        </EtText>
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
            🔍 EtTopPanel
          </EtText>
          <EtText style={styles.subtitle} variant="heading-compact">
            The web shell's global top panel — Leading | Search + ToriBadge | Actions in a controlled-height bar
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText style={styles.featuresTitle} variant="heading-base">
            Features
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Height fully controlled by `tall` — 76px regular / 84px tall (≥1280); the kit never measures the window
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Three zones: Leading hugs the start (padding 24) · Search 280×40 + ToriBadge centered as one group · Actions hugs the end (padding 40)
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Search is a PRESSABLE rest-state pill, not an input — it never focuses a keyboard
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • The "Ask Tori" badge: accent tint, theme-gradient logo and label (one gradient run, token-bound stops), skeleton via `loading`
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Empty Leading renders nothing; Actions renders a handed-up screen action raw before the bell
          </EtText>
          <EtText style={styles.featureText} variant="body-base-regular">
            • Slot-based and dumb — no navigation, no data, no analytics; the shell wires every handler
          </EtText>
        </View>

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Live demo
        </EtText>
        <EtText style={styles.selectedText} variant="body-secondary-regular">
          Toggle the height and the Leading slot content — the search group re-centers in the flexible zone between the edge clusters.
        </EtText>
        <LiveDemo />

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Anatomy
        </EtText>
        <EtText style={styles.featureText} variant="body-base-regular">
          A single row, height 76/84 with the 44px bar row centered. The search + Tori group centers in the flexible zone between the hugging edge
          clusters:
        </EtText>
        <CodeBlock
          code={`EtTopPanel (row, height 76/84, ps 24 pe 40, bg backgroundBase)
├── Leading    44-tall — trigger at tier -1; nothing when empty
├── (centered) Search 280×40 (radius 100, carbon900 @ 8%) · gap 10 · ToriBadge
└── Actions    hug ×44 — [handed-up action raw] + bell in a 36×36 slot, padding 4`}
          title="Structure"
        />

        <EtText style={styles.sectionTitle} variant="heading-compact">
          Basic Usage
        </EtText>
        <CodeBlock
          code={`import { EtTopPanel, EtSideMenuTrigger } from 'etoro-ui/shell';

const isTall = useBreakpoint(BREAKPOINT_DESKTOP_S); // 1280, shell-side

<EtTopPanel tall={isTall}>
  <EtTopPanel.Leading>
    {tier === -1 ? <EtSideMenuTrigger onPress={openMenu} /> : null}
  </EtTopPanel.Leading>
  <EtTopPanel.Search
    placeholder={t('topPanel.searchPlaceholder', { defaultValue: 'Search for…' })}
    onPress={openSearch}
  />
  <EtTopPanel.ToriBadge
    label={t('topPanel.askToriPrefix', { defaultValue: 'Ask' })}
    accentLabel="Tori"
  />
  <EtTopPanel.Actions>
    <DeferredNotificationsBell />
  </EtTopPanel.Actions>
</EtTopPanel>`}
          title="Shell composition"
        />

        <View style={[styles.apiReference, { borderColor: colors.dividerPrimary }]}>
          <EtText style={styles.apiTitle} variant="heading-base">
            Quick API Reference
          </EtText>
          <CodeBlock
            code={`interface EtTopPanelProps {
  tall: boolean;             // from useBreakpoint(BREAKPOINT_DESKTOP_S); 76px / 84px
  children: ReactNode;       // Leading | Search | ToriBadge | Actions
  style?: StyleProp<ViewStyle>;
  testID?: string;
}`}
            title="EtTopPanelProps"
          />
          <CodeBlock
            code={`interface EtTopPanelSearchProps {
  placeholder: string;          // pill text AND default accessibility label
  onPress: () => void;          // shell navigates to /search
  accessibilityLabel?: string;  // defaults to placeholder
  testID?: string;              // emits {testID}-clear on the hidden xmark wrapper
}`}
            title="EtTopPanelSearchProps"
          />
          <CodeBlock
            code={`TOP_PANEL_HEIGHT_REGULAR: 76   // below BREAKPOINT_DESKTOP_S (1280)
TOP_PANEL_HEIGHT_TALL: 84      // at ≥BREAKPOINT_DESKTOP_S`}
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
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
    padding: 16,
  },
  demoControl: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  demoControls: {
    flexDirection: 'row',
    gap: 8,
  },
  demoShell: {
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    height: 280,
    overflow: 'hidden',
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
