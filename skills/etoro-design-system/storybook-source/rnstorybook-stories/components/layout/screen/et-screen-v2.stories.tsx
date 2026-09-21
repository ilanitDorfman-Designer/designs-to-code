import { NavigationContainer, NavigationIndependentTree, type Theme } from '@react-navigation/native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtScreenOverlay, EtScreenV2, EtText, EtTopbar, ScrollProvider, useScrollHandlers } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { eToroDarkColors, eToroLightColors, X3, X4 } from 'etoro-ui/core/styles';
import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

interface ExampleRow {
  id: string;
  title: string;
}

function ScreenDecorator({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useColorScheme() ?? 'light';
  const { colors } = useEtoroTheme();

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={resolvedTheme === 'dark' ? (eToroDarkColors as Theme) : (eToroLightColors as Theme)}>
        <ScrollProvider hideHalo>
          <View style={[styles.storyRoot, { backgroundColor: colors.bgNeutralPrimary }]}>{children}</View>
        </ScrollProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function StaticBodyExample() {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.screenContainer}>
      <EtScreenV2>
        <EtTopbar>
          <EtTopbar.Middle>
            <EtTopbar.Title>Static Body</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>
        <View style={[styles.card, { backgroundColor: colors.bgNeutralSecondary, borderColor: colors.dividerTertiary }]}>
          <EtText variant="heading-compact">Screen shell only</EtText>
          <EtText variant="body-secondary-regular">
            EtScreenV2 provides the shell + horizontal padding. Your content chooses whether it scrolls.
          </EtText>
        </View>
      </EtScreenV2>
    </View>
  );
}

function ExplicitListOwnerExample() {
  const { colors } = useEtoroTheme();
  const { onScroll, scrollEventThrottle } = useScrollHandlers();
  const data = useMemo<ExampleRow[]>(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        id: String(index),
        title: `Instrument ${index + 1}`,
      })),
    [],
  );

  return (
    <FlatList
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <EtText variant="heading-large">Watchlist</EtText>
          <View style={[styles.card, { backgroundColor: colors.bgNeutralSecondary, borderColor: colors.dividerTertiary }]}>
            <EtText variant="body-base-semibold">One scroll owner</EtText>
            <EtText variant="body-secondary-regular">The title and card are part of the list header, so rows stay virtualized below.</EtText>
          </View>
        </View>
      }
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.row, { backgroundColor: colors.bgNeutralSecondary, borderColor: colors.dividerTertiary }]}
          onPress={() => Alert.alert(item.title)}
        >
          <EtText variant="body-base-semibold">{item.title}</EtText>
          <EtText variant="body-secondary-regular">Tap row</EtText>
        </Pressable>
      )}
    />
  );
}

function ExplicitListScreen() {
  return (
    <View style={styles.screenContainer}>
      <EtScreenV2 animateHalo>
        <EtTopbar>
          <EtTopbar.Middle>
            <EtTopbar.Title>Explicit List</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>
        <ExplicitListOwnerExample />
      </EtScreenV2>
    </View>
  );
}

function RawTopBarExample() {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.screenContainer}>
      <EtScreenV2 animateHalo>
        <EtTopbar style={styles.transparentTopbar} disableLiquidGlass>
          <EtTopbar.Middle>
            <EtText variant="body-base-semibold">Custom topbar</EtText>
          </EtTopbar.Middle>
        </EtTopbar>
        <View style={[styles.card, { backgroundColor: colors.bgNeutralSecondary, borderColor: colors.dividerTertiary }]}>
          <EtText variant="heading-compact">Raw TopBar</EtText>
          <EtText variant="body-secondary-regular">
            EtScreenV2 does not own topbar composition. Render EtTopbar directly when a screen needs top chrome.
          </EtText>
        </View>
      </EtScreenV2>
    </View>
  );
}

function OverlaySlotExample() {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.screenContainer}>
      <EtScreenV2 animateHalo>
        <EtTopbar style={styles.transparentTopbar} disableLiquidGlass>
          <EtTopbar.Middle>
            <EtText variant="body-base-semibold">Overlay demo</EtText>
          </EtTopbar.Middle>
        </EtTopbar>
        <View style={[styles.card, { backgroundColor: colors.bgNeutralSecondary, borderColor: colors.dividerTertiary }]}>
          <EtText variant="heading-compact">Body content</EtText>
          <EtText variant="body-secondary-regular">
            The overlay below sits ABOVE this card but BELOW the topbar — typical pattern for scroll-driven blur backdrops and compact titles.
          </EtText>
        </View>
        <EtScreenOverlay>
          <View
            pointerEvents="none"
            style={[styles.overlayBanner, { backgroundColor: colors.bgNeutralSecondary, borderColor: colors.dividerTertiary }]}
          >
            <EtText variant="body-base-semibold">EtScreenOverlay</EtText>
          </View>
        </EtScreenOverlay>
      </EtScreenV2>
    </View>
  );
}

const meta: Meta<typeof EtScreenV2> = {
  title: 'eToro-UI/Components/Layout/EtScreenV2',
  component: EtScreenV2,
  decorators: [
    (Story) => (
      <ScreenDecorator>
        <Story />
      </ScreenDecorator>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EtScreenV2>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>EtScreenV2 is a screen shell. Render normal children directly and let content decide whether it scrolls.</Desc>
        <Preview>
          <StaticBodyExample />
        </Preview>
        <CodeBlock
          code={`import { EtScreenV2, EtTopbar } from 'etoro-ui';

<EtScreenV2>
  <EtTopbar />
  <Content />
</EtScreenV2>`}
        />
      </Section>
    </Page>
  ),
};

export const ExplicitListOwner: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Explicit List Owner</Title>
        <Desc>Attach the V2 scroll hook to the list that owns vertical scrolling. Header content lives in ListHeaderComponent.</Desc>
        <Preview>
          <ExplicitListScreen />
        </Preview>
        <CodeBlock
          code={`import { EtScreenV2, useScrollHandlers } from 'etoro-ui';
import { FlatList } from 'react-native';

function ListBody() {
  const { onScroll, scrollEventThrottle } = useScrollHandlers();

  return (
    <FlatList
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      data={items}
      ListHeaderComponent={<HeaderAndCard />}
      renderItem={renderItem}
    />
  );
}`}
        />
      </Section>
    </Page>
  ),
};

export const DirectTopBar: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Direct TopBar</Title>
        <Desc>EtScreenV2 does not expose a topbar subcomponent. Render EtTopbar directly when the screen needs top chrome.</Desc>
        <Preview>
          <RawTopBarExample />
        </Preview>
        <CodeBlock
          code={`<EtScreenV2>
  <EtTopbar>
    <EtTopbar.Middle>
      <EtTopbar.Title>Screen title</EtTopbar.Title>
    </EtTopbar.Middle>
  </EtTopbar>
  <Body />
</EtScreenV2>`}
        />
      </Section>
    </Page>
  ),
};

export const OverlaySlot: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Overlay Slot</Title>
        <Desc>
          `&lt;EtScreenOverlay&gt;` registers content via context, so it can be declared at any depth and gets hoisted to the screen shell. It sits
          BETWEEN scrolled content and the topbar, which is the pattern progressive-blur backdrops and compact titles rely on.
        </Desc>
        <Preview>
          <OverlaySlotExample />
        </Preview>
        <CodeBlock
          code={`<EtScreenV2>
  <EtTopbar>
    <EtTopbar.Middle>
      <EtTopbar.Title>Screen title</EtTopbar.Title>
    </EtTopbar.Middle>
  </EtTopbar>
  <Body />
  <EtScreenOverlay>
    <ScrollDrivenBlur />
  </EtScreenOverlay>
</EtScreenV2>`}
        />
      </Section>
    </Page>
  ),
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>
      <Section>
        <SubTitle>EtScreenV2</SubTitle>
        <Desc>
          Root screen shell. Full-bleed by default (no horizontal padding) — add your own gutters via `style` or a content container. Renders children
          directly (Bluesky-style — no `.Body` subcomponent).
        </Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'animateHalo', type: 'boolean', default: 'false' },
            { prop: 'gradient', type: 'boolean', default: 'false' },
            { prop: 'noHeaderOffset', type: 'boolean', default: 'false' },
          ]}
        />
      </Section>
      <Section>
        <SubTitle>EtTopbar</SubTitle>
        <Desc>Normal topbar component. Render it directly as a child of EtScreenV2 when the screen needs top chrome.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'EtTopbar.Start | EtTopbar.Middle | EtTopbar.End', default: '-' },
            { prop: 'disableLiquidGlass', type: 'boolean', default: 'false' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
          ]}
        />
      </Section>
      <Section>
        <SubTitle>EtScreenOverlay</SubTitle>
        <Desc>
          Screen-level overlay slot. Children render between the body and the topbar via context registration — declare at any depth in the tree.
        </Desc>
        <PropsTable data={[{ prop: 'children', type: 'ReactNode', default: '-' }]} />
      </Section>
      <Section>
        <SubTitle>useScrollHandlers</SubTitle>
        <Desc>
          Single hook for the screen scroll owner AND its siblings. Owners spread onScroll + scrollEventThrottle; siblings read scrollY in worklets.
        </Desc>
        <PropsTable
          data={[
            { prop: 'onScroll', type: '(event) => void', default: '-' },
            { prop: 'scrollEventThrottle', type: 'number', default: '16' },
            { prop: 'scrollY', type: 'SharedValue<number>', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  storyRoot: {
    flex: 1,
  },
  screenContainer: {
    height: 520,
    overflow: 'hidden',
    borderRadius: X4,
  },
  card: {
    gap: X3,
    padding: X4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: X4,
  },
  listHeader: {
    gap: X4,
    padding: X4,
  },
  listContent: {
    paddingBottom: X4,
  },
  row: {
    marginHorizontal: X4,
    marginBottom: X3,
    padding: X4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: X3,
  },
  transparentTopbar: {
    backgroundColor: 'transparent',
  },
  overlayBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: X3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
});
