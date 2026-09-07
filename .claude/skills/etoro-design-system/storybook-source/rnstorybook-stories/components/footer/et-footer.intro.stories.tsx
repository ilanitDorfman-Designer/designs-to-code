import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtButton, EtFooter, EtText, EtoroIcon } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Layout/EtFooter/Introduction',
  parameters: {
    notes: 'Introduction to the EtFooter component.',
  },
};

export default meta;

// =============================================================================
// INTRODUCTION
// =============================================================================

export const Introduction: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <EtText variant="display-hero">EtFooter</EtText>
          <EtText variant="body-base-regular" style={styles.heroSubtitle}>
            A flexible compound component for building page footers with disclaimer text, buttons, pagination, and links.
          </EtText>
          <View style={styles.figmaLink}>
            <EtoroIcon icon={{ iconName: 'torii' }} appearance={{ size: 16 }} />
            <EtText variant="body-secondary-regular">Figma: DS - React / Footer</EtText>
          </View>
        </View>

        {/* Live Demo */}
        <View style={styles.section}>
          <EtText variant="heading-base">Live Demo</EtText>
          <View style={styles.demoWrapper}>
            <View style={styles.demoContainer}>
              <EtFooter testID="demo-footer">
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Apple Inc. is a technology company that engages in the design, manufacturing, and marketing of smartphones.
                  </EtText>
                </EtFooter.Section>
                <EtFooter.Section>
                  <EtButton stretch onPress={() => {}}>
                    Continue
                  </EtButton>
                </EtFooter.Section>
                <EtFooter.Section style={styles.linksRow}>
                  <EtFooter.Link onPress={() => {}}>Terms</EtFooter.Link>
                  <EtFooter.Link onPress={() => {}}>Privacy</EtFooter.Link>
                  <EtFooter.Link onPress={() => {}}>Help</EtFooter.Link>
                </EtFooter.Section>
              </EtFooter>
            </View>
          </View>
        </View>

        {/* Anatomy */}
        <View style={styles.section}>
          <EtText variant="heading-base">Anatomy</EtText>
          <EtText variant="body-secondary-regular" style={styles.sectionDesc}>
            The footer is composed of multiple optional elements that can be combined based on the use case.
          </EtText>
          <View style={styles.anatomyContainer}>
            <View style={styles.anatomyRow}>
              <View style={[styles.anatomySlot, { backgroundColor: colors.bgNeutralTertiary }]}>
                <EtText variant="label-secondary-bold">DISCLAIMER</EtText>
                <EtText variant="caption-regular">Optional text content</EtText>
              </View>
            </View>
            <View style={styles.anatomyRow}>
              <View style={[styles.anatomySlot, { backgroundColor: colors.bgActionBrand }]}>
                <EtText variant="label-secondary-bold">BUTTONS</EtText>
                <EtText variant="caption-regular">Primary, Secondary, Text</EtText>
              </View>
            </View>
            <View style={styles.anatomyRow}>
              <View style={[styles.anatomySlot, { backgroundColor: colors.bgNeutralSecondary }]}>
                <EtText variant="label-secondary-bold">LINKS</EtText>
                <EtText variant="caption-regular">Terms, Privacy, Help</EtText>
              </View>
            </View>
          </View>
        </View>

        {/* Component Structure */}
        <View style={styles.section}>
          <EtText variant="heading-base">Component Structure</EtText>
          <View style={[styles.codeBlock, { backgroundColor: colors.bgNeutralSecondary }]}>
            <EtText variant="body-secondary-regular" style={styles.codeText}>
              {`EtFooter                  // Root container
├── EtFooter.Section      // Content wrapper
├── EtFooter.Link         // Individual link
└── EtFooter.Scrollable   // Scrollable container
    ├── direction="vertical"    // Default, for tall content
    └── direction="horizontal"  // Paginated with dots`}
            </EtText>
          </View>
        </View>

        {/* API Reference */}
        <View style={styles.section}>
          <EtText variant="heading-base">API Reference</EtText>

          <View style={styles.apiSection}>
            <EtText variant="label-primary-semibold">EtFooter</EtText>
            <View style={[styles.propsTable, { backgroundColor: colors.bgNeutralSecondary }]}>
              <PropsRow prop="children" type="ReactNode" desc="Footer content" />
              <PropsRow prop="style" type="ViewStyle" desc="Container styles" />
              <PropsRow prop="contentStyle" type="ViewStyle" desc="Content wrapper styles" />
              <PropsRow prop="testID" type="string" desc="Test identifier" />
              <PropsRow prop="...rest" type="ViewProps" desc="All View props" />
            </View>
          </View>

          <View style={styles.apiSection}>
            <EtText variant="label-primary-semibold">EtFooter.Section</EtText>
            <View style={[styles.propsTable, { backgroundColor: colors.bgNeutralSecondary }]}>
              <PropsRow prop="children" type="ReactNode" desc="Section content" />
              <PropsRow prop="style" type="ViewStyle" desc="Custom styles" />
              <PropsRow prop="...rest" type="ViewProps" desc="All View props" />
            </View>
          </View>

          <View style={styles.apiSection}>
            <EtText variant="label-primary-semibold">EtFooter.Scrollable</EtText>
            <View style={[styles.propsTable, { backgroundColor: colors.bgNeutralSecondary }]}>
              <PropsRow prop="children" type="ReactNode" desc="Scrollable content" />
              <PropsRow prop="direction" type="'vertical' | 'horizontal'" desc="Default: 'vertical'" />
              <PropsRow prop="style" type="ViewStyle" desc="Container styles" />
              <PropsRow prop="contentStyle" type="ViewStyle" desc="Vertical mode only" />
              <PropsRow prop="...rest" type="ViewProps" desc="All View props" />
            </View>
          </View>

          <View style={styles.apiSection}>
            <EtText variant="label-primary-semibold">EtFooter.Link</EtText>
            <View style={[styles.propsTable, { backgroundColor: colors.bgNeutralSecondary }]}>
              <PropsRow prop="children" type="ReactNode" desc="Link text" />
              <PropsRow prop="onPress" type="() => void" desc="Press handler" />
              <PropsRow prop="style" type="ViewStyle" desc="Custom styles" />
              <PropsRow prop="...rest" type="PressableProps" desc="All Pressable props" />
            </View>
          </View>
        </View>

        {/* Best Practices */}
        <View style={styles.section}>
          <EtText variant="heading-base">Best Practices</EtText>

          <View style={styles.tipsList}>
            <Tip
              icon="A"
              title="Use EtButton for actions"
              description="Always use EtButton with stretch prop for full-width buttons and better touch targets."
            />
            <Tip
              icon="L"
              title="Link text should be descriptive"
              description='Footer links should clearly describe their destination (e.g., "Privacy Policy" instead of "Click here").'
            />
            <Tip
              icon="1"
              title="Use EtFooter.Section for structure"
              description="Wrap each logical section in EtFooter.Section for proper spacing and alignment."
            />
            <Tip
              icon="2"
              title="Button order matters"
              description="Primary action should come first, followed by secondary actions. Use primary-subtle variant for secondary buttons."
            />
            <Tip
              icon="H"
              title="Use Scrollable for multi-step flows"
              description='Use direction="horizontal" for paginated content with multiple pages of disclaimers or terms.'
            />
            <Tip
              icon="X"
              title="Don't overcrowd the footer"
              description="Limit to 2-3 buttons maximum. Place links at the bottom as the last Section."
            />
            <Tip
              icon="!"
              title="Always include checkbox for terms"
              description="For legal agreements or terms acceptance, always include a checkbox before enabling the submit button."
            />
          </View>
        </View>
      </ScrollView>
    );
  },
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const PropsRow = ({ prop, type, desc }: { prop: string; type: string; desc: string }) => (
  <View style={styles.propRow}>
    <EtText variant="label-secondary-bold" style={styles.propName}>
      {prop}
    </EtText>
    <EtText variant="caption-regular" style={styles.propType}>
      {type}
    </EtText>
    <EtText variant="caption-regular" style={styles.propDesc}>
      {desc}
    </EtText>
  </View>
);

const Tip = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <View style={styles.tipCard}>
    <EtText variant="heading-compact">{icon}</EtText>
    <View style={styles.tipContent}>
      <EtText variant="label-primary-semibold">{title}</EtText>
      <EtText variant="body-secondary-regular">{description}</EtText>
    </View>
  </View>
);

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  heroSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 300,
  },
  figmaLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    opacity: 0.6,
  },
  section: {
    gap: 12,
  },
  sectionDesc: {
    opacity: 0.7,
  },
  demoWrapper: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#E8E8E8',
  },
  demoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  anatomyContainer: {
    marginTop: 8,
    gap: 4,
  },
  anatomyRow: {
    flexDirection: 'row',
    gap: 4,
  },
  anatomySlot: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  codeText: {
    fontFamily: 'Courier',
  },
  disclaimer: {
    textAlign: 'center',
    opacity: 0.8,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  apiSection: {
    gap: 8,
  },
  propsTable: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  propRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  propName: {
    width: 100,
  },
  propType: {
    width: 120,
    opacity: 0.7,
  },
  propDesc: {
    flex: 1,
    opacity: 0.7,
  },
  tipsList: {
    gap: 8,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  tipContent: {
    flex: 1,
    gap: 4,
  },
});
