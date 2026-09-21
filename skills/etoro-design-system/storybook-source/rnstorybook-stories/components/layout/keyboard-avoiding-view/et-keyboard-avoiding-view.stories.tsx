import type { Meta, StoryObj } from '@storybook/react-native';
import { EtKeyboardAvoidingView, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

const meta: Meta<typeof EtKeyboardAvoidingView> = {
  title: 'eToro-UI/Components/Layout/EtKeyboardAvoidingView',
  component: EtKeyboardAvoidingView,
};

export default meta;

type Story = StoryObj<typeof EtKeyboardAvoidingView>;

function Demo() {
  const { colors } = useEtoroTheme();
  const insets = useSafeAreaInsets();
  const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

  return (
    <View style={[styles.demoContainer, { backgroundColor: colors.bgNeutralPrimary }]}>
      <EtKeyboardAvoidingView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.demoList}>
          {items.map((label) => (
            <View key={label} style={[styles.row, { backgroundColor: colors.bgNeutralSecondary }]}>
              <EtText variant="body-secondary-regular">{label}</EtText>
            </View>
          ))}
        </ScrollView>
        <View style={[styles.composer, { backgroundColor: colors.bgNeutralSecondary, paddingBottom: insets.bottom }]}>
          <TextInput
            placeholder="Write a message…"
            placeholderTextColor={colors.textSecondaryNeutral}
            style={[styles.input, { color: colors.textPrimaryNeutral }]}
          />
        </View>
      </EtKeyboardAvoidingView>
    </View>
  );
}

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Keyboard-avoiding composer</Title>
        <Desc>
          Wraps the scroll surface and the footer composer together. Open the keyboard to see the composer rise above it while the list shrinks. On
          Android the composer also clears the system nav bar via the footer&apos;s bottom safe-area padding.
        </Desc>
        <Preview>
          <Demo />
        </Preview>
        <CodeBlock
          code={`import { EtKeyboardAvoidingView } from 'etoro-ui';

<EtKeyboardAvoidingView style={{ flex: 1 }}>
  <CommentList />
  <View style={{ paddingBottom: isKeyboardVisible ? 0 : insets.bottom }}>
    <CommentComposer />
  </View>
</EtKeyboardAvoidingView>`}
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
        <SubTitle>EtKeyboardAvoidingView</SubTitle>
        <Desc>Native keyboard-avoiding container. Wrap the scroll surface and footer together so the footer rises with the keyboard.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'behavior', type: "'padding' | 'height' | 'position'", default: "iOS 'padding'" },
            { prop: 'keyboardVerticalOffset', type: 'number', default: '0' },
            { prop: 'enabled', type: 'boolean', default: 'true' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  demoContainer: {
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
  },
  demoList: {
    padding: 16,
    gap: 8,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  composer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    fontSize: 14,
  },
});
