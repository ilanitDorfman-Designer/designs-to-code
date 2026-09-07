import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAvatar, EtIconV2, EtListItemV2, EtSwipeableRow, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { CodeBlock, Desc, Label, Page, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

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

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const MOCK_ASSETS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$186.79', change: '+1.95 (+1.05%)', positive: true },
  { symbol: 'GOOG', name: 'Alphabet', price: '$142.50', change: '-0.83 (-0.58%)', positive: false },
  { symbol: 'TSLA', name: 'Tesla Motors, Inc', price: '$248.12', change: '+4.20 (+1.72%)', positive: true },
  { symbol: 'META', name: 'Meta Platforms', price: '$502.34', change: '-2.11 (-0.42%)', positive: false },
];

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtSwipeableRow> = {
  title: 'eToro-UI/Components/List/EtSwipeableRow',
  component: EtSwipeableRow,
};

export default meta;

type Story = StoryObj<typeof EtSwipeableRow>;

// ─────────────────────────────────────────────────────────────
// 1. Basic
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: function BasicStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            Wrap any content with EtSwipeableRow and compose EtSwipeableRow.Action subcomponents to reveal action buttons on left swipe. The default
            action width is 70px.
          </Desc>
        </Section>

        <ListDemo>
          <EtSwipeableRow>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <EtText variant="label-primary-semibold">Swipe me left</EtText>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <EtText variant="label-tertiary-regular">← swipe</EtText>
              </EtListItemV2.End>
            </EtListItemV2>
            <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.statusNegative }}>
              <EtIconV2 name="trash" size="lg" color={colors.textBright} />
            </EtSwipeableRow.Action>
          </EtSwipeableRow>
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtIconV2, EtListItemV2, EtSwipeableRow } from 'etoro-ui';

<EtSwipeableRow>
  <EtListItemV2 size="large">
    <EtListItemV2.Start>
      <EtText variant="label-primary-semibold">Item label</EtText>
    </EtListItemV2.Start>
  </EtListItemV2>
  <EtSwipeableRow.Action
    onPress={handleDelete}
    style={{ backgroundColor: colors.statusNegative }}
    accessibilityLabel="Delete"
  >
    <EtIconV2 name="trash" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
</EtSwipeableRow>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 2. MultipleButtons
// ─────────────────────────────────────────────────────────────

export const MultipleButtons: Story = {
  render: function MultipleButtonsStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Multiple Actions</Title>
          <Desc>
            Compose multiple EtSwipeableRow.Action subcomponents to reveal more than one action. Actions are rendered left-to-right in the order
            provided. The total swipe distance equals the sum of all action widths (default 70px each).
          </Desc>
        </Section>

        <Section>
          <SubTitle>Trade + Delete</SubTitle>
          <Desc>The most common pattern: a neutral trade action and a destructive delete action.</Desc>
        </Section>

        <ListDemo>
          <EtSwipeableRow>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <EtAvatar size="medium" shape="square" variant="instrument">
                    <EtAvatar.Fallback>A</EtAvatar.Fallback>
                  </EtAvatar>
                  <View>
                    <EtText variant="label-primary-semibold">AAPL</EtText>
                    <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Apple Inc.
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                    $186.79
                  </EtText>
                  <EtText variant="label-tertiary-regular" style={{ color: colors.statusPositive, textAlign: 'right' }}>
                    +1.95 (+1.05%)
                  </EtText>
                </View>
              </EtListItemV2.End>
            </EtListItemV2>
            <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.bgNeutralSecondary }}>
              <EtIconV2 name="trade" size="lg" color={colors.textBright} />
            </EtSwipeableRow.Action>
            <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.statusNegative }}>
              <EtIconV2 name="trash" size="lg" color={colors.textBright} />
            </EtSwipeableRow.Action>
          </EtSwipeableRow>
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtIconV2, EtListItemV2, EtSwipeableRow } from 'etoro-ui';

<EtSwipeableRow>
  <EtListItemV2 size="large">
    <EtListItemV2.Start>...</EtListItemV2.Start>
    <EtListItemV2.End>...</EtListItemV2.End>
  </EtListItemV2>
  <EtSwipeableRow.Action
    onPress={handleTrade}
    style={{ backgroundColor: colors.bgNeutralSecondary }}
    accessibilityLabel="Trade"
  >
    <EtIconV2 name="trade" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
  <EtSwipeableRow.Action
    onPress={handleDelete}
    style={{ backgroundColor: colors.statusNegative }}
    accessibilityLabel="Delete"
  >
    <EtIconV2 name="trash" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
</EtSwipeableRow>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 3. WithListItemV2
// ─────────────────────────────────────────────────────────────

export const WithListItemV2: Story = {
  render: function WithListItemV2Story() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>With EtListItemV2</Title>
          <Desc>
            Wrap EtListItemV2 with EtSwipeableRow to add swipe actions to a list. Use the onPress prop on EtListItemV2 — do NOT wrap it in a raw
            Pressable, as swipe gestures would conflict.
          </Desc>
        </Section>

        <ListDemo>
          {MOCK_ASSETS.map((asset) => (
            <EtSwipeableRow key={asset.symbol}>
              <EtListItemV2 size="large" onPress={() => {}} accessibilityLabel={asset.symbol}>
                <EtListItemV2.Start>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
                <EtListItemV2.End>
                  <View>
                    <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                      {asset.price}
                    </EtText>
                    <EtText
                      variant="label-tertiary-regular"
                      style={{
                        color: asset.positive ? colors.statusPositive : colors.statusNegative,
                        textAlign: 'right',
                      }}
                    >
                      {asset.change}
                    </EtText>
                  </View>
                </EtListItemV2.End>
                <EtListItemV2.Divider />
              </EtListItemV2>
              <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.bgNeutralSecondary }}>
                <EtIconV2 name="trade" size="lg" color={colors.textBright} />
              </EtSwipeableRow.Action>
              <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.statusNegative }}>
                <EtIconV2 name="trash" size="lg" color={colors.textBright} />
              </EtSwipeableRow.Action>
            </EtSwipeableRow>
          ))}
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtIconV2, EtListItemV2, EtSwipeableRow } from 'etoro-ui';

// Use onPress on EtListItemV2 — do NOT wrap in Pressable
<EtSwipeableRow>
  <EtListItemV2 size="large" onPress={handleNavigate} accessibilityLabel={asset.symbol}>
    <EtListItemV2.Start>
      <AssetInfo asset={asset} />
    </EtListItemV2.Start>
    <EtListItemV2.End>
      <PriceDisplay asset={asset} />
    </EtListItemV2.End>
    <EtListItemV2.Divider />
  </EtListItemV2>
  <EtSwipeableRow.Action
    onPress={() => handleTrade(asset)}
    style={{ backgroundColor: colors.bgNeutralSecondary }}
    accessibilityLabel="Trade"
  >
    <EtIconV2 name="trade" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
  <EtSwipeableRow.Action
    onPress={() => handleRemove(asset)}
    style={{ backgroundColor: colors.statusNegative }}
    accessibilityLabel="Delete"
  >
    <EtIconV2 name="trash" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
</EtSwipeableRow>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 4. CoordinatedRows
// ─────────────────────────────────────────────────────────────

export const CoordinatedRows: Story = {
  render: function CoordinatedRowsStory() {
    const { colors } = useEtoroTheme();
    const activeCloseRef = useRef<(() => void) | null>(null);

    const handleSwipeStart = useCallback((close: () => void) => {
      if (activeCloseRef.current && activeCloseRef.current !== close) {
        activeCloseRef.current();
      }
      activeCloseRef.current = close;
    }, []);

    return (
      <Page>
        <Section>
          <Title>Coordinated Rows</Title>
          <Desc>
            Use onSwipeStart to coordinate multiple rows so only one stays open at a time. When a new row is swiped, the previously open row
            automatically closes. Pass the same handler to all rows in the list.
          </Desc>
        </Section>

        <ListDemo>
          {MOCK_ASSETS.slice(0, 3).map((asset) => (
            <EtSwipeableRow key={asset.symbol} onSwipeStart={handleSwipeStart}>
              <EtListItemV2 size="large" onPress={() => {}} accessibilityLabel={asset.symbol}>
                <EtListItemV2.Start>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
                <EtListItemV2.End>
                  <View>
                    <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                      {asset.price}
                    </EtText>
                    <EtText
                      variant="label-tertiary-regular"
                      style={{
                        color: asset.positive ? colors.statusPositive : colors.statusNegative,
                        textAlign: 'right',
                      }}
                    >
                      {asset.change}
                    </EtText>
                  </View>
                </EtListItemV2.End>
                <EtListItemV2.Divider />
              </EtListItemV2>
              <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.bgNeutralSecondary }}>
                <EtIconV2 name="trade" size="lg" color={colors.textBright} />
              </EtSwipeableRow.Action>
              <EtSwipeableRow.Action onPress={() => {}} style={{ backgroundColor: colors.statusNegative }}>
                <EtIconV2 name="trash" size="lg" color={colors.textBright} />
              </EtSwipeableRow.Action>
            </EtSwipeableRow>
          ))}
        </ListDemo>

        <Section>
          <Label>Swipe any row — the previously open one will automatically close.</Label>
          <CodeBlock
            code={`import { EtListItemV2, EtSwipeableRow } from 'etoro-ui';
import { useRef, useCallback } from 'react';

// Single ref shared across all rows in the list
const activeCloseRef = useRef<(() => void) | null>(null);

const handleSwipeStart = useCallback((close: () => void) => {
  // Close the previously open row before opening a new one
  if (activeCloseRef.current && activeCloseRef.current !== close) {
    activeCloseRef.current();
  }
  activeCloseRef.current = close;
}, []);

// Pass the same handler to every row
{items.map((item) => (
  <EtSwipeableRow key={item.id} onSwipeStart={handleSwipeStart}>
    <EtListItemV2 size="large">
      ...
    </EtListItemV2>
    <EtSwipeableRow.Action
      onPress={() => handleTrade(item)}
      style={{ backgroundColor: colors.bgNeutralSecondary }}
    >
      <EtIconV2 name="trade" size="lg" color={colors.textBright} />
    </EtSwipeableRow.Action>
    <EtSwipeableRow.Action
      onPress={() => handleDelete(item)}
      style={{ backgroundColor: colors.statusNegative }}
    >
      <EtIconV2 name="trash" size="lg" color={colors.textBright} />
    </EtSwipeableRow.Action>
  </EtSwipeableRow>
))}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 5. CustomButtonWidths
// ─────────────────────────────────────────────────────────────

export const CustomActionWidths: Story = {
  render: function CustomActionWidthsStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Custom Action Widths</Title>
          <Desc>
            Use the width prop on individual EtSwipeableRow.Action subcomponents to override the default 70px width. The total swipe distance is the
            sum of all action widths. Useful for wider touch targets or asymmetric layouts.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Narrow Actions (56px each)</SubTitle>
        </Section>
        <ListDemo>
          <EtSwipeableRow>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <EtText variant="label-primary-semibold">Narrow actions (56px)</EtText>
              </EtListItemV2.Start>
            </EtListItemV2>
            <EtSwipeableRow.Action onPress={() => {}} width={56} style={{ backgroundColor: colors.bgNeutralSecondary }}>
              <EtIconV2 name="trade" size="lg" color={colors.textBright} />
            </EtSwipeableRow.Action>
            <EtSwipeableRow.Action onPress={() => {}} width={56} style={{ backgroundColor: colors.statusNegative }}>
              <EtIconV2 name="trash" size="lg" color={colors.textBright} />
            </EtSwipeableRow.Action>
          </EtSwipeableRow>
        </ListDemo>

        <Section>
          <SubTitle>Wide Delete Action (100px)</SubTitle>
        </Section>
        <ListDemo>
          <EtSwipeableRow>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <EtText variant="label-primary-semibold">Wide delete action (100px)</EtText>
              </EtListItemV2.Start>
            </EtListItemV2>
            <EtSwipeableRow.Action onPress={() => {}} width={100} style={{ backgroundColor: colors.statusNegative }}>
              <EtIconV2 name="trash" size="lg" color={colors.textBright} />
            </EtSwipeableRow.Action>
          </EtSwipeableRow>
        </ListDemo>

        <Section>
          <CodeBlock
            code={`import { EtSwipeableRow } from 'etoro-ui';

// Each action can have its own width
<EtSwipeableRow>
  <EtSwipeableRow.Action
    onPress={handleTrade}
    width={56}  // narrower than default 70px
    style={{ backgroundColor: colors.bgNeutralSecondary }}
  >
    <TradeIcon />
  </EtSwipeableRow.Action>
  <EtSwipeableRow.Action
    onPress={handleDelete}
    width={100}  // wider for larger touch target
    style={{ backgroundColor: colors.statusNegative }}
  >
    <DeleteIcon />
  </EtSwipeableRow.Action>
  ...
</EtSwipeableRow>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 6. APIReference (always last)
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtSwipeableRow</SubTitle>
        <Desc>Root component. Wrap any content with EtSwipeableRow.Action subcomponents and content as children.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'EtSwipeableRow.Action subcomponents may be declared before or after the content; examples use content first.',
            },
            {
              prop: 'isDragging',
              type: 'boolean',
              default: '-',
              description: 'When true (e.g. parent list is reordering), automatically closes any open swipe.',
            },
            {
              prop: 'onSwipeStart',
              type: '(closeSwipe: () => void) => void',
              default: '-',
              description: 'Called when a swipe begins. Receives a close function to coordinate with other rows.',
            },
            {
              prop: 'contentContainerStyle',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description:
                'Style applied to the sliding content container. Defaults to bgNeutralPrimary background. Override when rendering on non-neutral surfaces.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSwipeableRow.Action</SubTitle>
        <Desc>
          Action subcomponent revealed on left swipe. Must be a direct child of EtSwipeableRow; may be declared before or after the content.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Content rendered inside the action (icon, text, etc.).',
            },
            {
              prop: 'onPress',
              type: '() => void',
              default: '-',
              description:
                'Called when the action is tapped. The swipe does not close automatically; call closeSwipe via onSwipeStart ref if needed.',
            },
            {
              prop: 'width',
              type: 'number',
              default: '70',
              description: 'Width of this action in pixels. Affects snap distance.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Style for the action container. Use backgroundColor to color the action.',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '-',
              description: 'Accessibility label for screen readers.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Gesture Behavior</SubTitle>
        <Desc>EtSwipeableRow uses react-native-gesture-handler pan gestures with these thresholds.</Desc>
        <PropsTable
          data={[
            {
              prop: 'activeOffsetX',
              type: '[-5, 5]',
              default: '-',
              description: 'Horizontal movement threshold before the gesture activates.',
            },
            {
              prop: 'failOffsetY',
              type: '[-10, 10]',
              default: '-',
              description: 'Vertical movement threshold that cancels the gesture (yields to scroll).',
            },
            {
              prop: 'snapVelocity',
              type: '300 px/s',
              default: '-',
              description: 'Flick velocity that triggers snap-open even if displacement is under 50%.',
            },
            {
              prop: 'snapThreshold',
              type: '50%',
              default: '-',
              description: 'If translateX passes 50% of total action width, the row snaps fully open on release.',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
