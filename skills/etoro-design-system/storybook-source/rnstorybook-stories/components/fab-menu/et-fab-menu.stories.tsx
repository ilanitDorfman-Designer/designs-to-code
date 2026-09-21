import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { EtButton, EtFabMenu } from 'etoro-ui';
import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, SubTitle } from '../../utils/storybook-template';

type Story = StoryObj<typeof EtFabMenu>;

const meta: Meta<typeof EtFabMenu> = {
  title: 'eToro-UI/Components/FabMenu/EtFabMenu',
  component: EtFabMenu,
  parameters: {
    notes: 'FAB Menu expands from a Floating Action Button to reveal multiple related actions.',
  },
};

export default meta;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>Default FAB menu with trigger and action buttons. Tap the FAB to expand, tap an action or outside to close.</Desc>
        <Preview>
          <View style={styles.fabContainer}>
            <EtFabMenu contentInset={CONTENT_INSET}>
              <EtFabMenu.Trigger />
              <EtFabMenu.Actions>
                <EtFabMenu.Button iconName="star" label="Action 01" onPress={() => {}} />
                <EtFabMenu.Button iconName="heart" label="Action 02" onPress={() => {}} />
                <EtFabMenu.Button iconName="share" label="Action 03" onPress={() => {}} />
              </EtFabMenu.Actions>
            </EtFabMenu>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtFabMenu } from 'etoro-ui';

<EtFabMenu contentInset={{ bottom: 24, right: 24 }}>
  <EtFabMenu.Trigger />
  <EtFabMenu.Actions>
    <EtFabMenu.Button
      iconName="star"
      label="Action 01"
      onPress={handleAction1}
    />
    <EtFabMenu.Button
      iconName="heart"
      label="Action 02"
      onPress={handleAction2}
    />
  </EtFabMenu.Actions>
</EtFabMenu>`}
        />
      </Section>
    </Page>
  ),
};

export const WithCustomTrigger: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>With Custom Trigger</Title>
        <Desc>Use a function as children to render different content based on open state (e.g. plus icon when closed, close icon when open).</Desc>
        <Preview>
          <View style={styles.fabContainer}>
            <EtFabMenu contentInset={CONTENT_INSET}>
              <EtFabMenu.Trigger>
                {(isOpen) => (
                  <EtButton>
                    <EtButton.Icon name={isOpen ? 'close' : 'plus'} />
                  </EtButton>
                )}
              </EtFabMenu.Trigger>
              <EtFabMenu.Actions>
                <EtFabMenu.Button iconName="star" label="Custom Action" onPress={() => {}} />
              </EtFabMenu.Actions>
            </EtFabMenu>
          </View>
        </Preview>
        <CodeBlock
          code={`<EtFabMenu>
  <EtFabMenu.Trigger>
    {(isOpen) => (
      <EtButton>
        <EtButton.Icon name={isOpen ? 'close' : 'plus'} />
      </EtButton>
    )}
  </EtFabMenu.Trigger>
  <EtFabMenu.Actions>...</EtFabMenu.Actions>
</EtFabMenu>`}
        />
      </Section>
    </Page>
  ),
};

export const Positioned: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Positioned (bottom-right)</Title>
        <Desc>
          When using position absolute, pass contentInset with the same bottom/right values as your container so the FAB stays fixed when the menu
          opens.
        </Desc>
        <Preview>
          <View style={styles.positionedContainer}>
            <View style={styles.placeholder} />
            <View style={styles.fabPositioned}>
              <EtFabMenu contentInset={CONTENT_INSET}>
                <EtFabMenu.Trigger />
                <EtFabMenu.Actions>
                  <EtFabMenu.Button iconName="star" label="Action 01" onPress={() => {}} />
                  <EtFabMenu.Button iconName="heart" label="Action 02" onPress={() => {}} />
                </EtFabMenu.Actions>
              </EtFabMenu>
            </View>
          </View>
        </Preview>
        <CodeBlock
          code={`<View style={{ position: 'absolute', bottom: 100, right: 16 }}>
  <EtFabMenu contentInset={{ bottom: 100, right: 16 }}>
    <EtFabMenu.Trigger />
    <EtFabMenu.Actions>...</EtFabMenu.Actions>
  </EtFabMenu>
</View>`}
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
        <SubTitle>EtFabMenu</SubTitle>
        <Desc>Root component. Wraps Trigger and Actions.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'EtFabMenuChildren', default: '-' },
            { prop: 'closeOnOutsidePress', type: 'boolean', default: 'true' },
            {
              prop: 'contentInset',
              type: '{ bottom?: number; right?: number }',
              default: '-',
            },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtFabMenu.Trigger</SubTitle>
        <Desc>Main FAB button. Renders default FAB or custom children.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode | ((isOpen: boolean) => ReactNode)',
              default: '-',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtFabMenu.Actions</SubTitle>
        <Desc>Container for action buttons. Visible when menu is open.</Desc>
        <PropsTable data={[{ prop: 'children', type: 'ReactNode', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>EtFabMenu.Button</SubTitle>
        <Desc>Individual action button with icon and label. Icons are 20×20; padding is X3 (vertical) X4 (horizontal).</Desc>
        <PropsTable
          data={[
            { prop: 'iconName', type: 'IconName', default: '-' },
            { prop: 'label', type: 'string', default: '-' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'label' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const CONTENT_INSET = { bottom: 24, right: 24 };

const styles = StyleSheet.create({
  fabContainer: {
    minHeight: 200,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 24,
  },
  positionedContainer: {
    minHeight: 200,
    position: 'relative',
  },
  placeholder: {
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  fabPositioned: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
