import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAvatar, EtBadge, EtCheckbox, EtListItemV2, EtText, EtToggleSwitch } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CodeBlock, Desc, Label, Page, PropsTable, Section, Spacer, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtListItemV2>;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Bordered wrapper so list demos are clearly visible against the page. */
function ListDemo({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: c.borderSubtle,
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 12,
      }}
    >
      {children}
    </View>
  );
}

/** Vertical border to visualize slot boundaries in wireframe demos. */
const wireframeSlot = {
  borderRightWidth: 0.5,
  borderStyle: 'dashed' as const,
  borderColor: '#D0D0D0',
  paddingRight: 8,
};

/** Last slot in a row — no right border needed. */
const wireframeSlotLast = {
  borderLeftWidth: 0.5,
  borderStyle: 'dashed' as const,
  borderColor: '#D0D0D0',
  paddingLeft: 8,
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const MOCK_PEOPLE = [
  { name: 'Emma Collins', handle: 'emmacollins', followers: '36.5K' },
  { name: 'Liam Parker', handle: 'liamparker', followers: '36.5K' },
  { name: 'Sofia Nguyen', handle: 'sofian', followers: '36.5K' },
  { name: 'Noah Bennett', handle: 'noahbennett', followers: '31.8K' },
];

const MOCK_ASSETS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$186.79',
    change: '1.95 (-1.03%)',
    color: '#F7931A',
  },
  {
    symbol: 'GOOG',
    name: 'Alphabet',
    price: '$186.79',
    change: '1.95 (-1.03%)',
    color: '#4285F4',
  },
  {
    symbol: 'META',
    name: 'Meta Platform Inc',
    price: '$186.79',
    change: '1.95 (-1.03%)',
    color: '#1877F2',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Motors, Inc',
    price: '$186.79',
    change: '1.95 (-1.03%)',
    color: '#CC0000',
  },
];

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtListItemV2> = {
  title: 'eToro-UI/Components/List/EtListItemV2',
  component: EtListItemV2,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// 1. Layouts
// ─────────────────────────────────────────────────────────────

export const Layouts: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Layout Modes</Title>
        <Desc>
          The component auto-detects which slots are present and adjusts flex behavior accordingly. Below are the three layout modes shown as simple
          wireframes, followed by real-world examples.
        </Desc>
      </Section>

      {/* ── Wireframe: Start Only ── */}
      <Section>
        <SubTitle>Start Only</SubTitle>
        <Desc>Start slot takes the full width when used alone.</Desc>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Start</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.Divider />
        </EtListItemV2>
      </ListDemo>

      {/* ── Wireframe: Start + End ── */}
      <Section>
        <SubTitle>Start + End</SubTitle>
        <Desc>
          Start fills remaining space (flex: 1), End sizes to its content (flexShrink: 0). Intentionally not equal width — matches the standard list
          item pattern where primary content takes more room and trailing content stays compact. For equal columns use Start + Middle + End.
        </Desc>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Start style={wireframeSlot}>
            <EtText variant="label-primary-semibold">Start</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End style={wireframeSlotLast}>
            <EtText variant="label-primary-semibold">End</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      </ListDemo>

      {/* ── Wireframe: Start + Middle + End ── */}
      <Section>
        <SubTitle>Start + Middle + End</SubTitle>
        <Desc>All three slots get equal width (flex: 1 each). Useful for table-like layouts with a center column.</Desc>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Start style={wireframeSlot}>
            <EtText variant="label-primary-semibold">Start</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.Middle
            style={{
              borderLeftWidth: 0.5,
              borderRightWidth: 0.5,
              borderStyle: 'dashed' as const,
              borderColor: '#D0D0D0',
              paddingHorizontal: 8,
            }}
          >
            <EtText variant="label-primary-semibold">Middle</EtText>
          </EtListItemV2.Middle>
          <EtListItemV2.End style={wireframeSlotLast}>
            <EtText variant="label-primary-semibold">End</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      </ListDemo>

      {/* ── Real-world: Start + End ── */}
      <Section>
        <SubTitle>Start + End Example</SubTitle>
      </Section>
      <ListDemo>
        <StartEndExample />
      </ListDemo>
      <Section>
        <CodeBlock
          code={`import { EtAvatar, EtListItemV2, EtText } from 'etoro-ui';

<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <EtAvatar size="medium" shape="circle">
        <EtAvatar.Fallback>EC</EtAvatar.Fallback>
      </EtAvatar>
      <View>
        <EtText variant="label-primary-semibold">Emma Collins</EtText>
        <EtText variant="label-tertiary-regular">@emmacollins</EtText>
      </View>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <View>
      <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
        36.5K
      </EtText>
      <EtText variant="label-tertiary-regular" style={{ textAlign: 'right' }}>
        Followers
      </EtText>
    </View>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
        />
      </Section>

      {/* ── Real-world: Start + Middle + End with badge ── */}
      <Section>
        <SubTitle>Start + Middle + End with EtBadge</SubTitle>
        <Desc>
          {
            "Note: EtBadge has alignSelf: 'flex-start' internally, which overrides the Middle slot's centering. This is by-design — badges should not stretch to fill their container. Override with style={{ alignSelf: 'center' }} if centering is needed."
          }
        </Desc>
      </Section>
      <ListDemo>
        <ThreeColumnExample />
      </ListDemo>

      <Section>
        <CodeBlock
          code={`import { EtAvatar, EtBadge, EtListItemV2, EtText } from 'etoro-ui';

// Badge in Middle (left-aligned due to EtBadge alignSelf: flex-start)
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <EtAvatar size="medium" shape="square" variant="instrument">
        <EtAvatar.Fallback>B</EtAvatar.Fallback>
      </EtAvatar>
      <EtText variant="label-primary-semibold">BTC</EtText>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.Middle>
    <EtBadge color="neutral" size="small">
      <EtBadge.Label>Edited</EtBadge.Label>
    </EtBadge>
  </EtListItemV2.Middle>
  <EtListItemV2.End>...</EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
        />
      </Section>
    </Page>
  ),
};

function StartEndExample() {
  const { colors } = useEtoroTheme();
  return (
    <EtListItemV2 size="large">
      <EtListItemV2.Start>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <EtAvatar size="medium" shape="circle">
            <EtAvatar.Fallback>EC</EtAvatar.Fallback>
          </EtAvatar>
          <View>
            <EtText variant="label-primary-semibold">Emma Collins</EtText>
            <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
              @emmacollins
            </EtText>
          </View>
        </View>
      </EtListItemV2.Start>
      <EtListItemV2.End>
        <View>
          <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
            36.5K
          </EtText>
          <EtText
            variant="label-tertiary-regular"
            style={{
              color: colors.textSecondaryNeutral,
              textAlign: 'right',
            }}
          >
            Followers
          </EtText>
        </View>
      </EtListItemV2.End>
      <EtListItemV2.Divider />
    </EtListItemV2>
  );
}

function ThreeColumnExample() {
  const { colors } = useEtoroTheme();
  return (
    <EtListItemV2 size="large">
      <EtListItemV2.Start>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <EtAvatar size="medium" shape="square" variant="instrument">
            <EtAvatar.Fallback>B</EtAvatar.Fallback>
          </EtAvatar>
          <View>
            <EtText variant="label-primary-semibold">BTC</EtText>
            <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
              Bitcoin
            </EtText>
          </View>
        </View>
      </EtListItemV2.Start>
      <EtListItemV2.Middle>
        <EtBadge color="neutral" size="small">
          <EtBadge.Label>Edited</EtBadge.Label>
        </EtBadge>
      </EtListItemV2.Middle>
      <EtListItemV2.End>
        <View>
          <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
            $186.79
          </EtText>
          <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
            1.95 (-1.03%)
          </EtText>
        </View>
      </EtListItemV2.End>
      <EtListItemV2.Divider />
    </EtListItemV2>
  );
}

const MOCK_SETTINGS = [
  { key: 'notifications', label: 'Push Notifications' },
  { key: 'darkmode', label: 'Dark Mode' },
  { key: 'biometrics', label: 'Biometric Login' },
];

const MOCK_OPTIONS = [
  { key: 'usd', label: 'US Dollar (USD)' },
  { key: 'eur', label: 'Euro (EUR)' },
  { key: 'gbp', label: 'British Pound (GBP)' },
];

function SingleSelectExample() {
  const [selected, setSelected] = useState<string>('usd');

  return (
    <ListDemo>
      {MOCK_OPTIONS.map((option) => (
        <EtListItemV2 key={option.key} size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">{option.label}</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtCheckbox variant="round" value={selected === option.key} onChange={() => setSelected(option.key)} />
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      ))}
    </ListDemo>
  );
}

function SwitchToggleExample() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    darkmode: false,
    biometrics: true,
  });

  return (
    <ListDemo>
      {MOCK_SETTINGS.map((setting) => (
        <EtListItemV2 key={setting.key} size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">{setting.label}</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtToggleSwitch value={toggles[setting.key]} onValueChange={(val) => setToggles((prev) => ({ ...prev, [setting.key]: val }))} />
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      ))}
    </ListDemo>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Sizes
// ─────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Sizes</Title>
        <Desc>Two size variants control vertical padding. Large (16px) is the default, small (12px) is compact.</Desc>
      </Section>

      <Section>
        <SubTitle>Large (paddingVertical: 16px)</SubTitle>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Large item</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">Value</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <SubTitle>Small (paddingVertical: 12px)</SubTitle>
      </Section>
      <ListDemo>
        <EtListItemV2 size="small">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Small item</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">Value</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <CodeBlock
          code={`import { EtListItemV2, EtText } from 'etoro-ui';

// Large (default)
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Large item</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">Value</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>

// Small
<EtListItemV2 size="small">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Small item</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">Value</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3b. Disabled
// ─────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Disabled</Title>
        <Desc>The disabled prop dims the whole row to 50% opacity, suppresses onPress, and sets accessibilityState.disabled for screen readers.</Desc>
      </Section>

      <Section>
        <SubTitle>Enabled vs disabled</SubTitle>
      </Section>
      <ListDemo>
        <EtListItemV2 onPress={() => undefined}>
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Enabled item</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">Value</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
        <EtListItemV2 onPress={() => undefined} disabled>
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Disabled item</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">Value</EtText>
          </EtListItemV2.End>
        </EtListItemV2>
      </ListDemo>

      <Section>
        <CodeBlock
          code={`import { EtListItemV2, EtText } from 'etoro-ui';

<EtListItemV2 onPress={handlePress} disabled>
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Disabled item</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">Value</EtText>
  </EtListItemV2.End>
</EtListItemV2>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 4. Divider
// ─────────────────────────────────────────────────────────────

export const Divider: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Divider</Title>
        <Desc>
          Add EtListItemV2.Divider as a child to render a hairline separator below the item content. Useful for creating a continuous list appearance.
        </Desc>
      </Section>

      <Section>
        <SubTitle>With Divider</SubTitle>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Item one</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">A</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Item two</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">B</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Item three</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">C</EtText>
          </EtListItemV2.End>
          <EtListItemV2.Divider />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <SubTitle>Without Divider</SubTitle>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Item one</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">A</EtText>
          </EtListItemV2.End>
        </EtListItemV2>
        <EtListItemV2 size="large">
          <EtListItemV2.Start>
            <EtText variant="label-primary-semibold">Item two</EtText>
          </EtListItemV2.Start>
          <EtListItemV2.End>
            <EtText variant="label-primary-semibold">B</EtText>
          </EtListItemV2.End>
        </EtListItemV2>
      </ListDemo>

      <Section>
        <CodeBlock
          code={`import { EtListItemV2, EtText } from 'etoro-ui';

// With divider
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Item one</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">A</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>

// Without divider
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Item one</EtText>
  </EtListItemV2.Start>
</EtListItemV2>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 5. Skeletons
// ─────────────────────────────────────────────────────────────

export const Skeletons: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Skeleton Loading States</Title>
        <Desc>
          Four built-in skeleton variants via EtListItemV2.Skeleton. Used as a compound child of EtListItemV2 when data is loading. Each variant is
          shown in both large and small sizes.
        </Desc>
      </Section>

      <Section>
        <SubTitle>1-line</SubTitle>
        <Desc>Single bar left + small bar right.</Desc>
        <Label>Large</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Skeleton variant="1-line" />
        </EtListItemV2>
      </ListDemo>
      <Section>
        <Label>Small</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="small">
          <EtListItemV2.Skeleton variant="1-line" />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <SubTitle>2-lines</SubTitle>
        <Desc>Two bars left + one bar right.</Desc>
        <Label>Large</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Skeleton variant="2-lines" />
        </EtListItemV2>
      </ListDemo>
      <Section>
        <Label>Small</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="small">
          <EtListItemV2.Skeleton variant="2-lines" />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <SubTitle>asset-1-line</SubTitle>
        <Desc>Small square + bar left + small bar right.</Desc>
        <Label>Large</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Skeleton variant="asset-1-line" />
        </EtListItemV2>
      </ListDemo>
      <Section>
        <Label>Small</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="small">
          <EtListItemV2.Skeleton variant="asset-1-line" />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <SubTitle>asset-2-lines</SubTitle>
        <Desc>Large square + two bars left + bar right.</Desc>
        <Label>Large</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="large">
          <EtListItemV2.Skeleton variant="asset-2-lines" />
        </EtListItemV2>
      </ListDemo>
      <Section>
        <Label>Small</Label>
      </Section>
      <ListDemo>
        <EtListItemV2 size="small">
          <EtListItemV2.Skeleton variant="asset-2-lines" />
        </EtListItemV2>
      </ListDemo>

      <Section>
        <CodeBlock
          code={`import { EtListItemV2 } from 'etoro-ui';

// 1-line skeleton
<EtListItemV2 size="large">
  <EtListItemV2.Skeleton variant="1-line" />
</EtListItemV2>

// 2-lines skeleton
<EtListItemV2 size="large">
  <EtListItemV2.Skeleton variant="2-lines" />
</EtListItemV2>

// Asset + 1-line skeleton
<EtListItemV2 size="large">
  <EtListItemV2.Skeleton variant="asset-1-line" />
</EtListItemV2>

// Asset + 2-lines skeleton
<EtListItemV2 size="large">
  <EtListItemV2.Skeleton variant="asset-2-lines" />
</EtListItemV2>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 6. SkeletonToLoaded (Loading Transition Demo)
// ─────────────────────────────────────────────────────────────

export const SkeletonToLoaded: Story = {
  render: function SkeletonToLoadedStory() {
    const { colors } = useEtoroTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!isLoading) return;
      const timer = setTimeout(() => setIsLoading(false), 2500);
      return () => clearTimeout(timer);
    }, [isLoading]);

    return (
      <Page>
        <Section>
          <Title>Loading Transition</Title>
          <Desc>
            Simulates a real data-loading scenario. Skeleton placeholders are shown for 2.5 seconds, then replaced by real content. Tap "Reload" to
            replay.
          </Desc>
        </Section>
        <ListDemo>
          {isLoading ? (
            <>
              <EtListItemV2 size="large">
                <EtListItemV2.Skeleton variant="asset-2-lines" />
                <EtListItemV2.Divider />
              </EtListItemV2>
              <EtListItemV2 size="large">
                <EtListItemV2.Skeleton variant="asset-2-lines" />
                <EtListItemV2.Divider />
              </EtListItemV2>
              <EtListItemV2 size="large">
                <EtListItemV2.Skeleton variant="asset-2-lines" />
                <EtListItemV2.Divider />
              </EtListItemV2>
            </>
          ) : (
            MOCK_ASSETS.slice(0, 3).map((asset) => (
              <EtListItemV2 key={asset.symbol} size="large">
                <EtListItemV2.Start>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <EtAvatar size="medium" shape="square" variant="instrument">
                      <EtAvatar.Fallback>{asset.symbol.charAt(0)}</EtAvatar.Fallback>
                    </EtAvatar>
                    <View>
                      <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
                      <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        {asset.name}
                      </EtText>
                    </View>
                  </View>
                </EtListItemV2.Start>
                <EtListItemV2.End>
                  <View>
                    <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                      {asset.price}
                    </EtText>
                    <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
                      {asset.change}
                    </EtText>
                  </View>
                </EtListItemV2.End>
                <EtListItemV2.Divider />
              </EtListItemV2>
            ))
          )}
        </ListDemo>
        <Section>
          <EtText variant="label-tertiary-regular" style={{ textAlign: 'center', opacity: 0.6 }} onPress={() => setIsLoading(true)}>
            {isLoading ? 'Loading...' : 'Tap here to reload'}
          </EtText>
          <CodeBlock
            code={`import { EtListItemV2 } from 'etoro-ui';
import { useState, useEffect } from 'react';

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchData().then(() => setIsLoading(false));
}, []);

// Render
{isLoading ? (
  <>
    <EtListItemV2 size="large">
      <EtListItemV2.Skeleton variant="asset-2-lines" />
    </EtListItemV2>
    <EtListItemV2 size="large">
      <EtListItemV2.Skeleton variant="asset-2-lines" />
    </EtListItemV2>
    <EtListItemV2 size="large">
      <EtListItemV2.Skeleton variant="asset-2-lines" />
    </EtListItemV2>
  </>
) : (
  assets.map((asset) => (
    <EtListItemV2 key={asset.id} size="large">
      <EtListItemV2.Start>
        <AssetInfo asset={asset} />
      </EtListItemV2.Start>
      <EtListItemV2.End>
        <PriceInfo asset={asset} />
      </EtListItemV2.End>
      <EtListItemV2.Divider />
    </EtListItemV2>
  ))
)}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 7. EdgeCases (Stress Tests)
// ─────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: function EdgeCasesStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Edge Cases</Title>
          <Desc>Stress tests and potential problem areas. Useful for verifying layout behavior under unusual conditions.</Desc>
        </Section>

        <Section>
          <SubTitle>Long Text (no truncation)</SubTitle>
          <Desc>When text is not truncated with numberOfLines, it wraps and expands the item height. This may be undesirable in production.</Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View>
                <EtText variant="label-primary-semibold">Very Long Company Name That Goes On And On International Corp</EtText>
                <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  This is an extremely long description that should demonstrate what happens when text wraps to multiple lines without any truncation
                  applied
                </EtText>
              </View>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">$999,999.99</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>
        <Section>
          <CodeBlock
            code={`// No truncation — text wraps and expands item height
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View>
      <EtText variant="label-primary-semibold">
        Very Long Company Name That Goes On And On International Corp
      </EtText>
      <EtText variant="label-tertiary-regular">
        This is an extremely long description...
      </EtText>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">$999,999.99</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Section>
          <SubTitle>Long Text (with numberOfLines)</SubTitle>
          <Desc>Using numberOfLines on EtText properly truncates long content with an ellipsis. This is the recommended approach.</Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View>
                <EtText variant="label-primary-semibold" numberOfLines={1}>
                  Very Long Company Name That Goes On And On International Corp
                </EtText>
                <EtText variant="label-tertiary-regular" numberOfLines={1} style={{ color: colors.textSecondaryNeutral }}>
                  This is an extremely long description that should be truncated
                </EtText>
              </View>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">$999,999.99</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>
        <Section>
          <CodeBlock
            code={`// Truncation with numberOfLines (recommended)
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View>
      <EtText variant="label-primary-semibold" numberOfLines={1}>
        Very Long Company Name That Goes On...
      </EtText>
      <EtText variant="label-tertiary-regular" numberOfLines={1}>
        This is an extremely long description...
      </EtText>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">$999,999.99</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Section>
          <SubTitle>Minimal Start Content + Long End</SubTitle>
          <Desc>When Start has short content and End has long content, End stays content-sized while Start fills remaining space.</Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <EtText variant="label-primary-semibold">A</EtText>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">This is a very long end value</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>
        <Section>
          <CodeBlock
            code={`// Short Start + long End — End stays content-sized
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">A</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">
      This is a very long end value
    </EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Section>
          <SubTitle>3-Column Overflow (Start content too wide)</SubTitle>
          <Desc>
            In start-middle-end mode all slots get equal width (flex: 1). When the Start slot contains an avatar + long text, content can visually
            overflow into the Middle column. Use numberOfLines to truncate.
          </Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <EtAvatar size="medium" shape="square" variant="instrument">
                  <EtAvatar.Fallback>M</EtAvatar.Fallback>
                </EtAvatar>
                <View>
                  <EtText variant="label-primary-semibold">META</EtText>
                  <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    Meta Platform Inc
                  </EtText>
                </View>
              </View>
            </EtListItemV2.Start>
            <EtListItemV2.Middle>
              <EtBadge color="neutral" size="small">
                <EtBadge.Label>Edited</EtBadge.Label>
              </EtBadge>
            </EtListItemV2.Middle>
            <EtListItemV2.End>
              <View>
                <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                  $186.79
                </EtText>
                <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
                  1.95 (-1.03%)
                </EtText>
              </View>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>

        <Section>
          <Label>Fix: truncate with numberOfLines</Label>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <EtAvatar size="medium" shape="square" variant="instrument">
                  <EtAvatar.Fallback>M</EtAvatar.Fallback>
                </EtAvatar>
                <View style={{ flex: 1 }}>
                  <EtText variant="label-primary-semibold" numberOfLines={1}>
                    META
                  </EtText>
                  <EtText variant="label-tertiary-regular" numberOfLines={1} style={{ color: colors.textSecondaryNeutral }}>
                    Meta Platform Inc
                  </EtText>
                </View>
              </View>
            </EtListItemV2.Start>
            <EtListItemV2.Middle>
              <EtBadge color="neutral" size="small">
                <EtBadge.Label>Edited</EtBadge.Label>
              </EtBadge>
            </EtListItemV2.Middle>
            <EtListItemV2.End>
              <View>
                <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                  $186.79
                </EtText>
                <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
                  1.95 (-1.03%)
                </EtText>
              </View>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>

        <Section>
          <CodeBlock
            code={`// Fix: use numberOfLines + flex: 1 on text container
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <EtAvatar size="medium" shape="square" variant="instrument">
        <EtAvatar.Fallback>M</EtAvatar.Fallback>
      </EtAvatar>
      <View style={{ flex: 1 }}>
        <EtText variant="label-primary-semibold" numberOfLines={1}>META</EtText>
        <EtText variant="label-tertiary-regular" numberOfLines={1}>
          Meta Platform Inc
        </EtText>
      </View>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.Middle>
    <EtBadge color="neutral" size="small">
      <EtBadge.Label>Edited</EtBadge.Label>
    </EtBadge>
  </EtListItemV2.Middle>
  <EtListItemV2.End>...</EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Section>
          <SubTitle>Empty Slot Content</SubTitle>
          <Desc>When a slot has no visible content, the layout should still hold. Start keeps flex: 1, End stays in place.</Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <EtText variant="label-primary-semibold">Start with content</EtText>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <View />
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View />
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">End with content</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>
        <Section>
          <CodeBlock
            code={`// Empty End slot
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Start with content</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <View />
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>

// Empty Start slot
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View />
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">End with content</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Section>
          <SubTitle>Mixed Content Heights</SubTitle>
          <Desc>
            Start has 3 lines, End has 1 line. Verifies that vertical centering (alignItems: center) keeps the shorter side properly aligned.
          </Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View>
                <EtText variant="label-primary-semibold">Primary text</EtText>
                <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  Secondary line
                </EtText>
                <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  Third line of content
                </EtText>
              </View>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">Short</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>
        <Section>
          <CodeBlock
            code={`// Start: 3 lines, End: 1 line — vertical centering test
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View>
      <EtText variant="label-primary-semibold">Primary text</EtText>
      <EtText variant="label-tertiary-regular">Secondary line</EtText>
      <EtText variant="label-tertiary-regular">Third line of content</EtText>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">Short</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Section>
          <SubTitle>Single-line vs Multi-line in Same List</SubTitle>
          <Desc>Mixed item heights in one list — row heights adjust per item, dividers stay consistent.</Desc>
        </Section>
        <ListDemo>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <EtText variant="label-primary-semibold">Single line item</EtText>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">A</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <View>
                <EtText variant="label-primary-semibold">Two line item</EtText>
                <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                  With a subtitle below
                </EtText>
              </View>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">B</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
          <EtListItemV2 size="large">
            <EtListItemV2.Start>
              <EtText variant="label-primary-semibold">Single line again</EtText>
            </EtListItemV2.Start>
            <EtListItemV2.End>
              <EtText variant="label-primary-semibold">C</EtText>
            </EtListItemV2.End>
            <EtListItemV2.Divider />
          </EtListItemV2>
        </ListDemo>
        <Section>
          <CodeBlock
            code={`// Mixed single-line and multi-line items in one list
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Single line item</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">A</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>

<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View>
      <EtText variant="label-primary-semibold">Two line item</EtText>
      <EtText variant="label-tertiary-regular">With a subtitle below</EtText>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">B</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 8. RealWorldExamples
// ─────────────────────────────────────────────────────────────

export const RealWorldExamples: Story = {
  render: function RealWorldStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Real-World Examples</Title>
          <Desc>Compositions matching Figma designs. These demonstrate how EtListItemV2 is used in production screens.</Desc>
        </Section>

        <Section>
          <SubTitle>People List (Large)</SubTitle>
        </Section>
        <ListDemo>
          {MOCK_PEOPLE.map((person) => (
            <EtListItemV2 key={person.handle} size="large">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="circle">
                    <EtAvatar.Fallback>
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </EtAvatar.Fallback>
                  </EtAvatar>
                  <View>
                    <EtText variant="label-primary-semibold">{person.name}</EtText>
                    <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      @{person.handle}
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                    {person.followers}
                  </EtText>
                  <EtText
                    variant="label-tertiary-regular"
                    style={{
                      color: colors.textSecondaryNeutral,
                      textAlign: 'right',
                    }}
                  >
                    Followers
                  </EtText>
                </View>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          ))}
        </ListDemo>

        <Section>
          <SubTitle>People List (Small)</SubTitle>
          <Desc>Small variant — single-line name, no subtitle. Matches Figma compact people list.</Desc>
        </Section>
        <ListDemo>
          {MOCK_PEOPLE.slice(0, 3).map((person) => (
            <EtListItemV2 key={person.handle} size="small">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="circle">
                    <EtAvatar.Fallback>
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </EtAvatar.Fallback>
                  </EtAvatar>
                  <EtText variant="label-primary-semibold">{person.name}</EtText>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right', color: '#4CAF50' }}>
                    {person.followers}
                  </EtText>
                  <EtText
                    variant="label-tertiary-regular"
                    style={{
                      color: colors.textSecondaryNeutral,
                      textAlign: 'right',
                    }}
                  >
                    Followers
                  </EtText>
                </View>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          ))}
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtAvatar, EtListItemV2, EtText } from 'etoro-ui';

// People list item
{people.map((person) => (
  <EtListItemV2 key={person.handle} size="large">
    <EtListItemV2.Start>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <EtAvatar size="medium" shape="circle">
          <EtAvatar.Fallback>{person.name[0]}</EtAvatar.Fallback>
        </EtAvatar>
        <View>
          <EtText variant="label-primary-semibold">{person.name}</EtText>
          <EtText variant="label-tertiary-regular">@{person.handle}</EtText>
        </View>
      </View>
    </EtListItemV2.Start>
    <EtListItemV2.End>
      <View>
        <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
          {person.followers}
        </EtText>
        <EtText variant="label-tertiary-regular" style={{ textAlign: 'right' }}>
          Followers
        </EtText>
      </View>
    </EtListItemV2.End>
    <EtListItemV2.Divider />
  </EtListItemV2>
))}`}
          />
        </Section>

        <Spacer />

        <Section>
          <SubTitle>Asset List (Large)</SubTitle>
          <Desc>Full-width layout — asset names display in full. Start fills remaining space (flex: 1), End sizes to its content.</Desc>
        </Section>
        <ListDemo>
          {MOCK_ASSETS.map((asset) => (
            <EtListItemV2 key={asset.symbol} size="large">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="square" variant="instrument">
                    <EtAvatar.Fallback>{asset.symbol.charAt(0)}</EtAvatar.Fallback>
                  </EtAvatar>
                  <View>
                    <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
                    <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {asset.name}
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                    {asset.price}
                  </EtText>
                  <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
                    {asset.change}
                  </EtText>
                </View>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          ))}
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtAvatar, EtListItemV2, EtText } from 'etoro-ui';

// Asset list item with icon, name, price and change
{assets.map((asset) => (
  <EtListItemV2 key={asset.symbol} size="large">
    <EtListItemV2.Start>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <EtAvatar size="medium" shape="square" variant="instrument">
          <EtAvatar.Fallback>{asset.symbol[0]}</EtAvatar.Fallback>
        </EtAvatar>
        <View>
          <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
          <EtText variant="label-tertiary-regular" numberOfLines={1}>
            {asset.name}
          </EtText>
        </View>
      </View>
    </EtListItemV2.Start>
    <EtListItemV2.End>
      <View>
        <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
          {asset.price}
        </EtText>
        <EtText variant="label-tertiary-regular" style={{ textAlign: 'right' }}>
          {asset.change}
        </EtText>
      </View>
    </EtListItemV2.End>
    <EtListItemV2.Divider />
  </EtListItemV2>
))}`}
          />
        </Section>

        <Section>
          <SubTitle>Asset List (Small)</SubTitle>
          <Desc>Compact variant — names truncate with ellipsis when space is limited. Use numberOfLines and flex: 1 on the text container.</Desc>
        </Section>
        <ListDemo>
          {MOCK_ASSETS.map((asset) => (
            <EtListItemV2 key={asset.symbol} size="small">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="square" variant="instrument">
                    <EtAvatar.Fallback>{asset.symbol.charAt(0)}</EtAvatar.Fallback>
                  </EtAvatar>
                  <View style={{ flex: 1 }}>
                    <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
                    <EtText variant="label-tertiary-regular" numberOfLines={1} style={{ color: colors.textSecondaryNeutral }}>
                      {asset.name}
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                    {asset.price}
                  </EtText>
                  <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
                    {asset.change}
                  </EtText>
                </View>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          ))}
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtAvatar, EtListItemV2, EtText } from 'etoro-ui';

// Small asset list — truncate names with numberOfLines
{assets.map((asset) => (
  <EtListItemV2 key={asset.symbol} size="small">
    <EtListItemV2.Start>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <EtAvatar size="medium" shape="square" variant="instrument">
          <EtAvatar.Fallback>{asset.symbol[0]}</EtAvatar.Fallback>
        </EtAvatar>
        <View style={{ flex: 1 }}>
          <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
          <EtText variant="label-tertiary-regular" numberOfLines={1}>
            {asset.name}
          </EtText>
        </View>
      </View>
    </EtListItemV2.Start>
    <EtListItemV2.End>
      <View>
        <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
          {asset.price}
        </EtText>
        <EtText variant="label-tertiary-regular" style={{ textAlign: 'right' }}>
          {asset.change}
        </EtText>
      </View>
    </EtListItemV2.End>
    <EtListItemV2.Divider />
  </EtListItemV2>
))}`}
          />
        </Section>

        <Spacer />

        <Section>
          <SubTitle>Single Select List</SubTitle>
          <Desc>Start slot with content + EtCheckbox at the End. Tap items to toggle selection. Matches Figma "SingleSelectListItem" variant.</Desc>
        </Section>
        <SingleSelectExample />

        <Section>
          <CodeBlock
            code={`import { EtCheckbox, EtListItemV2, EtText } from 'etoro-ui';

const [selected, setSelected] = useState<string | null>(null);

<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Option label</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtCheckbox
      variant="round"
      value={selected === 'option'}
      onChange={() => setSelected('option')}
    />
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Spacer />

        <Section>
          <SubTitle>Switch Toggle List</SubTitle>
          <Desc>
            Start slot with content + EtToggleSwitch at the End. Tap the toggle to switch on/off. Matches Figma "SwitchToggleListItem" variant.
          </Desc>
        </Section>
        <SwitchToggleExample />

        <Section>
          <CodeBlock
            code={`import { EtListItemV2, EtText, EtToggleSwitch } from 'etoro-ui';

const [enabled, setEnabled] = useState(false);

<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Notifications</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtToggleSwitch value={enabled} onValueChange={setEnabled} />
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>

        <Spacer />

        <Section>
          <SubTitle>Asset + Badge (3-column)</SubTitle>
          <Desc>Three-slot layout matching the Figma design with an "Edited" badge in the middle column and price on the right.</Desc>
        </Section>
        <ListDemo>
          {MOCK_ASSETS.map((asset) => (
            <EtListItemV2 key={asset.symbol} size="large">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="square" variant="instrument">
                    <EtAvatar.Fallback>{asset.symbol.charAt(0)}</EtAvatar.Fallback>
                  </EtAvatar>
                  <View>
                    <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
                    <EtText variant="label-tertiary-regular" numberOfLines={1} style={{ color: colors.textSecondaryNeutral }}>
                      {asset.name}
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.Middle>
                <EtBadge color="neutral" size="small">
                  <EtBadge.Label>Edited</EtBadge.Label>
                </EtBadge>
              </EtListItemV2.Middle>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                    {asset.price}
                  </EtText>
                  <EtText variant="label-tertiary-regular" style={{ color: '#4CAF50', textAlign: 'right' }}>
                    {asset.change}
                  </EtText>
                </View>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          ))}
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtAvatar, EtBadge, EtListItemV2, EtText } from 'etoro-ui';

// 3-column layout with badge in the middle
<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <EtAvatar size="medium" shape="square" variant="instrument">
        <EtAvatar.Fallback>B</EtAvatar.Fallback>
      </EtAvatar>
      <View>
        <EtText variant="label-primary-semibold">BTC</EtText>
        <EtText variant="label-tertiary-regular">Bitcoin</EtText>
      </View>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.Middle>
    <EtBadge color="neutral" size="small">
      <EtBadge.Label>Edited</EtBadge.Label>
    </EtBadge>
  </EtListItemV2.Middle>
  <EtListItemV2.End>
    <View>
      <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
        $186.79
      </EtText>
      <EtText variant="label-tertiary-regular" style={{ textAlign: 'right', color: '#4CAF50' }}>
        1.95 (-1.03%)
      </EtText>
    </View>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 9. APIReference (always last)
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtListItemV2</SubTitle>
        <Desc>Root container component. Renders slot children in a row.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'EtListItemChildren',
              default: '-',
              description: 'Slot children (Start, Middle, End, Divider).',
            },
            {
              prop: 'size',
              type: '"large" | "small"',
              default: '"large"',
              description: 'Vertical padding size. Large = 16px, Small = 12px.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Container style override.',
            },
            {
              prop: 'onPress',
              type: '() => void',
              default: '-',
              description: 'Press handler; renders content as Pressable when set.',
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Lowers opacity and disables press handling.',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test ID for testing.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtListItemV2.Start</SubTitle>
        <Desc>Left-aligned slot for primary content. Gets flex: 1 in all layout modes. Default: alignItems flex-start (left).</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Slot content.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Override default alignment (e.g. { alignItems: "center" }).',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test ID for testing.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtListItemV2.Middle</SubTitle>
        <Desc>
          Center-aligned slot. Only used in 3-slot mode (Start + Middle + End). Gets flex: 1 for equal-width distribution. Default: alignItems center.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Slot content.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Override default alignment (e.g. { alignItems: "flex-start" }).',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test ID for testing.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtListItemV2.End</SubTitle>
        <Desc>
          Right-aligned slot for trailing content. In 2-slot mode, sizes to content (flexShrink: 0). In 3-slot mode, gets flex: 1. Default: alignItems
          flex-end (right).
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Slot content.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Override default alignment (e.g. { alignItems: "center" }).',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test ID for testing.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtListItemV2.Divider</SubTitle>
        <Desc>Hairline separator rendered below the slot row. Use as a child of EtListItemV2.</Desc>
        <PropsTable
          data={[
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Override divider style.',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test ID for testing.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtListItemV2.Skeleton</SubTitle>
        <Desc>Skeleton loading placeholder. Must be used as a compound child of EtListItemV2. Inherits size, style, and testID from the parent.</Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: '"1-line" | "2-lines" | "asset-1-line" | "asset-2-lines"',
              default: '-',
              description: 'Skeleton layout variant.',
            },
            {
              prop: 'size',
              type: '"large" | "small"',
              default: '"large"',
              description: 'Vertical padding size.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Container style override.',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
              description: 'Test ID for testing.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Layout Modes</SubTitle>
        <Desc>The layout mode is auto-detected based on which slots are present.</Desc>
        <PropsTable
          data={[
            {
              prop: 'start-only',
              type: 'Start only',
              default: '-',
              description: 'Start fills full width (flex: 1).',
            },
            {
              prop: 'start-end',
              type: 'Start + End',
              default: '-',
              description: 'Start flex: 1, End flexShrink: 0 (content-sized).',
            },
            {
              prop: 'start-middle-end',
              type: 'Start + Middle + End',
              default: '-',
              description: 'All three slots get flex: 1 (equal width).',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Skeleton Variants</SubTitle>
        <PropsTable
          data={[
            {
              prop: '1-line',
              type: 'skeleton',
              default: '-',
              description: 'Single bar left + small bar right.',
            },
            {
              prop: '2-lines',
              type: 'skeleton',
              default: '-',
              description: 'Two bars left + one bar right.',
            },
            {
              prop: 'asset-1-line',
              type: 'skeleton',
              default: '-',
              description: 'Small square + bar left + small bar right.',
            },
            {
              prop: 'asset-2-lines',
              type: 'skeleton',
              default: '-',
              description: 'Large square + two bars left + bar right.',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
