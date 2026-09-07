import type { Meta, StoryObj } from '@storybook/react-native';
import { EtSplitLayout, EtText, useSplitLayoutContext } from 'etoro-ui';
import { StyleSheet, View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtSplitLayout>;

const meta: Meta<typeof EtSplitLayout> = {
  title: 'eToro-UI/Components/Layout/EtSplitLayout',
  component: EtSplitLayout,
};

export default meta;

function ModeBadge() {
  const { isSplit, topBarHeight } = useSplitLayoutContext();
  return (
    <EtText variant="caption-regular">
      {isSplit ? 'split (≥1024)' : 'single pane (<1024)'} · topBarHeight {topBarHeight}
    </EtText>
  );
}

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>EtSplitLayout</Title>
        <Desc>
          Responsive two-pane layout. At ≥1024px viewport width Main and Aside render side by side with `ratio` flex weights; below that the Aside
          pane unmounts and Main fills the layout. On a phone/simulator this preview therefore shows the single-pane mode — run the web target ≥1024px
          wide to see the split.
        </Desc>
        <Preview>
          <View style={styles.frame}>
            <EtSplitLayout>
              <EtSplitLayout.TopBar>
                <View style={styles.topBar}>
                  <EtText variant="label-secondary-semibold">TopBar (overlay, Main pane only)</EtText>
                </View>
              </EtSplitLayout.TopBar>
              <EtSplitLayout.Main style={styles.mainDemo}>
                <ModeBadge />
                <EtText variant="body-base-medium">Main — survives collapse</EtText>
              </EtSplitLayout.Main>
              <EtSplitLayout.Aside style={styles.asideDemo}>
                <EtText variant="body-base-medium">Aside — unmounts below 1024</EtText>
              </EtSplitLayout.Aside>
            </EtSplitLayout>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtSplitLayout } from 'etoro-ui';

<EtSplitLayout>
  <EtSplitLayout.TopBar>{chrome}</EtSplitLayout.TopBar>
  <EtSplitLayout.Main>{content}</EtSplitLayout.Main>
  <EtSplitLayout.Aside>{brandPanel}</EtSplitLayout.Aside>
</EtSplitLayout>`}
        />
      </Section>

      <Section>
        <SubTitle>Ratio + aside position</SubTitle>
        <Desc>
          `ratio` is semantic `[main, aside]` order, independent of `asidePosition`. A multi-step flow with a narrow steps rail on the left:
        </Desc>
        <CodeBlock
          code={`<EtSplitLayout ratio={[2, 1]} asidePosition="start">
  <EtSplitLayout.Main>{stepContent}</EtSplitLayout.Main>
  <EtSplitLayout.Aside>{stepsRail}</EtSplitLayout.Aside>
</EtSplitLayout>`}
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
        <SubTitle>EtSplitLayout</SubTitle>
        <Desc>Responsive two-pane layout primitive; panes are transparent — consumers paint backgrounds via `style`.</Desc>
        <PropsTable
          data={[
            { prop: 'ratio', type: '[main, aside]', default: '[1, 1]' },
            { prop: 'asidePosition', type: "'start' | 'end'", default: "'end'" },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
      <Section>
        <SubTitle>useSplitLayoutContext()</SubTitle>
        <Desc>
          Public context for consumers inside the layout: `isSplit`, `ratio`, `asidePosition`, `topBarHeight`. The TopBar never displaces content —
          use `topBarHeight` to inset scroll content on short viewports. Throws outside EtSplitLayout.
        </Desc>
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  frame: {
    height: 260,
    alignSelf: 'stretch',
    borderRadius: 12,
    overflow: 'hidden',
  },
  topBar: {
    padding: 12,
    alignItems: 'flex-start',
  },
  mainDemo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B0D10',
  },
  asideDemo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242628',
  },
});
