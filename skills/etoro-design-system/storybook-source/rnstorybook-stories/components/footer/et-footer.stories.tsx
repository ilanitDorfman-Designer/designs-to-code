import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtButton, EtCheckbox, EtFooter, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<typeof EtFooter>;

const meta: Meta<typeof EtFooter> = {
  title: 'eToro-UI/Components/Layout/EtFooter/Examples',
  component: EtFooter,
  parameters: {
    notes: 'Example usage patterns for EtFooter component.',
  },
};

export default meta;

// =============================================================================
// HELPERS
// =============================================================================

const FooterShowcase = ({ children, title, description, code }: { children: React.ReactNode; title: string; description?: string; code: string }) => {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.showcaseItem}>
      <EtText variant="label-primary-semibold">{title}</EtText>
      {description && (
        <EtText variant="caption-regular" style={styles.showcaseDesc}>
          {description}
        </EtText>
      )}
      <View style={styles.footerWrapper}>
        <View style={styles.footerContainer}>{children}</View>
      </View>
      <View style={[styles.codeBlock, { backgroundColor: colors.bgNeutralSecondary }]}>
        <EtText variant="body-tiny-regular" style={styles.codeText}>
          {code}
        </EtText>
      </View>
    </View>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <EtText variant="heading-base">{title}</EtText>
  </View>
);

// =============================================================================
// MAIN STORY - All Examples
// =============================================================================

export const AllExamples: Story = {
  render: () => {
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <EtText variant="display-main">EtFooter Examples</EtText>
          <EtText variant="body-secondary-regular" style={styles.heroSubtitle}>
            Copy-paste ready code snippets for common patterns.
          </EtText>
        </View>

        {/* ============ BASIC EXAMPLES ============ */}
        <View style={styles.section}>
          <SectionHeader title="Basic Examples" />

          <FooterShowcase
            title="Links Only"
            description="Simple footer with navigation links"
            code={`<EtFooter>
  <EtFooter.Section style={{ flexDirection: 'row', gap: 8 }}>
    <EtFooter.Link onPress={handleTerms}>Terms</EtFooter.Link>
    <EtFooter.Link onPress={handlePrivacy}>Privacy</EtFooter.Link>
    <EtFooter.Link onPress={handleHelp}>Help</EtFooter.Link>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section style={styles.linksRow}>
                <EtFooter.Link onPress={() => {}}>Terms</EtFooter.Link>
                <EtFooter.Link onPress={() => {}}>Privacy</EtFooter.Link>
                <EtFooter.Link onPress={() => {}}>Help</EtFooter.Link>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>

          <FooterShowcase
            title="Single Button"
            description="Primary action button"
            code={`<EtFooter>
  <EtFooter.Section>
    <EtButton stretch onPress={handleContinue}>
      Continue
    </EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section>
                <EtButton stretch onPress={() => {}}>
                  Continue
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>

          <FooterShowcase
            title="With Disclaimer"
            description="Disclaimer text above button"
            code={`<EtFooter>
  <EtFooter.Section>
    <EtText variant="body-tiny-regular">
      By continuing, you agree to our terms...
    </EtText>
  </EtFooter.Section>
  <EtFooter.Section>
    <EtButton stretch onPress={handleContinue}>
      Continue
    </EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section>
                <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                  By continuing, you agree to our terms of service and privacy policy.
                </EtText>
              </EtFooter.Section>
              <EtFooter.Section>
                <EtButton stretch onPress={() => {}}>
                  Continue
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>
        </View>

        {/* ============ BUTTON VARIANTS ============ */}
        <View style={styles.section}>
          <SectionHeader title="Button Variants" />

          <FooterShowcase
            title="Main + Subtle"
            description="Primary and secondary action"
            code={`<EtFooter>
  <EtFooter.Section style={{ gap: 12 }}>
    <EtButton stretch onPress={handleConfirm}>
      Confirm
    </EtButton>
    <EtButton stretch variant="primary-subtle" onPress={handleCancel}>
      Cancel
    </EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section style={styles.buttonsColumn}>
                <EtButton stretch onPress={() => {}}>
                  Confirm
                </EtButton>
                <EtButton stretch variant="primary-subtle" onPress={() => {}}>
                  Cancel
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>

          <FooterShowcase
            title="Side by Side"
            description="Two buttons in a row"
            code={`<EtFooter>
  <EtFooter.Section>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <EtButton style={{ flex: 1 }} onPress={handleBuy}>
        Buy
      </EtButton>
      <EtButton style={{ flex: 1 }} onPress={handleSell}>
        Sell
      </EtButton>
    </View>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section>
                <View style={styles.buttonsRow}>
                  <EtButton style={styles.flexButton} onPress={() => {}}>
                    Buy
                  </EtButton>
                  <EtButton style={styles.flexButton} onPress={() => {}}>
                    Sell
                  </EtButton>
                </View>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>

          <FooterShowcase
            title="Three Buttons"
            description="Two main + one subtle"
            code={`<EtFooter>
  <EtFooter.Section style={{ gap: 12 }}>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <EtButton style={{ flex: 1 }} onPress={handleBuy}>Buy</EtButton>
      <EtButton style={{ flex: 1 }} onPress={handleSell}>Sell</EtButton>
    </View>
    <EtButton stretch variant="primary-subtle" onPress={handleMore}>
      More Options
    </EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section style={styles.buttonsColumn}>
                <View style={styles.buttonsRow}>
                  <EtButton style={styles.flexButton} onPress={() => {}}>
                    Buy
                  </EtButton>
                  <EtButton style={styles.flexButton} onPress={() => {}}>
                    Sell
                  </EtButton>
                </View>
                <EtButton stretch variant="primary-subtle" onPress={() => {}}>
                  More Options
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>
        </View>

        {/* ============ WITH CHECKBOX ============ */}
        <View style={styles.section}>
          <SectionHeader title="With Checkbox" />

          <FooterShowcase
            title="Terms Acceptance"
            description="Checkbox enables button"
            code={`const [checked, setChecked] = useState(false);

<EtFooter>
  <EtFooter.Section>
    <EtText variant="body-tiny-regular">
      Please read and accept our terms...
    </EtText>
  </EtFooter.Section>
  <EtFooter.Section>
    <EtCheckbox value={checked} onChange={setChecked}>
      <EtCheckbox.Label>I agree to the terms</EtCheckbox.Label>
    </EtCheckbox>
  </EtFooter.Section>
  <EtFooter.Section>
    <EtButton stretch onPress={handleAccept} disabled={!checked}>
      Accept & Continue
    </EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section>
                <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                  Please read and accept our terms before continuing.
                </EtText>
              </EtFooter.Section>
              <EtFooter.Section>
                <EtCheckbox value={checkbox1} onChange={setCheckbox1}>
                  <EtCheckbox.Label>I agree to the terms</EtCheckbox.Label>
                </EtCheckbox>
              </EtFooter.Section>
              <EtFooter.Section>
                <EtButton stretch onPress={() => {}} disabled={!checkbox1}>
                  Accept & Continue
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>
        </View>

        {/* ============ SCROLLABLE CONTENT ============ */}
        <View style={styles.section}>
          <SectionHeader title="Scrollable Content" />

          <FooterShowcase
            title="Horizontal Pagination"
            description='direction="horizontal" - Swipe between pages'
            code={`<EtFooter contentStyle={{ padding: 0 }}>
  <EtFooter.Scrollable direction="horizontal">
    <EtFooter.Section>
      <EtText variant="body-tiny-regular">Page 1 content...</EtText>
    </EtFooter.Section>
    <EtFooter.Section>
      <EtText variant="body-tiny-regular">Page 2 content...</EtText>
    </EtFooter.Section>
    <EtFooter.Section>
      <EtText variant="body-tiny-regular">Page 3 content...</EtText>
    </EtFooter.Section>
  </EtFooter.Scrollable>
  <EtFooter.Section style={{ padding: 24 }}>
    <EtButton stretch onPress={handleContinue}>Continue</EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter contentStyle={styles.noPadding}>
              <EtFooter.Scrollable direction="horizontal">
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Page 1: Apple Inc. is a technology company that designs and manufactures smartphones.
                  </EtText>
                </EtFooter.Section>
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Page 2: Founded in 1976, headquartered in Cupertino, California.
                  </EtText>
                </EtFooter.Section>
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Page 3: Products include iPhone, iPad, Mac, and Apple Watch.
                  </EtText>
                </EtFooter.Section>
              </EtFooter.Scrollable>
              <EtFooter.Section style={styles.footerActions}>
                <EtButton stretch onPress={() => {}}>
                  Continue
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>

          <FooterShowcase
            title="Pagination + Checkbox"
            description="Multi-step flow with terms acceptance"
            code={`const [checked, setChecked] = useState(false);

<EtFooter contentStyle={{ padding: 0 }}>
  <EtFooter.Scrollable direction="horizontal">
    <EtFooter.Section>
      <EtText variant="body-tiny-regular">Step 1...</EtText>
    </EtFooter.Section>
    <EtFooter.Section>
      <EtText variant="body-tiny-regular">Step 2...</EtText>
    </EtFooter.Section>
  </EtFooter.Scrollable>
  <EtFooter.Section style={{ padding: 24, gap: 16 }}>
    <EtCheckbox value={checked} onChange={setChecked}>
      <EtCheckbox.Label>I accept the terms</EtCheckbox.Label>
    </EtCheckbox>
    <EtButton stretch onPress={handleContinue} disabled={!checked}>
      Continue
    </EtButton>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter contentStyle={styles.noPadding}>
              <EtFooter.Scrollable direction="horizontal">
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Step 1: Welcome to eToro! Let's get started.
                  </EtText>
                </EtFooter.Section>
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Step 2: Review our terms and conditions carefully.
                  </EtText>
                </EtFooter.Section>
                <EtFooter.Section>
                  <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                    Step 3: Accept to proceed with your account.
                  </EtText>
                </EtFooter.Section>
              </EtFooter.Scrollable>
              <EtFooter.Section style={styles.footerActions}>
                <EtCheckbox value={checkbox2} onChange={setCheckbox2}>
                  <EtCheckbox.Label>I accept the terms</EtCheckbox.Label>
                </EtCheckbox>
                <EtButton stretch onPress={() => {}} disabled={!checkbox2}>
                  Continue
                </EtButton>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>
        </View>

        {/* ============ COMBINED EXAMPLES ============ */}
        <View style={styles.section}>
          <SectionHeader title="Combined Examples" />

          <FooterShowcase
            title="Full Footer"
            description="All elements combined"
            code={`const [checked, setChecked] = useState(false);

<EtFooter>
  <EtFooter.Section>
    <EtText variant="body-tiny-regular">
      Trading involves risk...
    </EtText>
  </EtFooter.Section>
  <EtFooter.Section>
    <EtCheckbox value={checked} onChange={setChecked}>
      <EtCheckbox.Label>I understand the risks</EtCheckbox.Label>
    </EtCheckbox>
  </EtFooter.Section>
  <EtFooter.Section style={{ gap: 12 }}>
    <EtButton stretch onPress={handleTrade} disabled={!checked}>
      Open Trade
    </EtButton>
    <EtButton stretch variant="primary-subtle" onPress={handleCancel}>
      Cancel
    </EtButton>
  </EtFooter.Section>
  <EtFooter.Section style={{ flexDirection: 'row', gap: 8 }}>
    <EtFooter.Link onPress={handleTerms}>Terms</EtFooter.Link>
    <EtFooter.Link onPress={handlePrivacy}>Privacy</EtFooter.Link>
    <EtFooter.Link onPress={handleHelp}>Help</EtFooter.Link>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section>
                <EtText variant="body-tiny-regular" style={styles.disclaimer}>
                  Trading involves risk. Past performance is not indicative of future results.
                </EtText>
              </EtFooter.Section>
              <EtFooter.Section>
                <EtCheckbox value={checkbox3} onChange={setCheckbox3}>
                  <EtCheckbox.Label>I understand the risks</EtCheckbox.Label>
                </EtCheckbox>
              </EtFooter.Section>
              <EtFooter.Section style={styles.buttonsColumn}>
                <EtButton stretch onPress={() => {}} disabled={!checkbox3}>
                  Open Trade
                </EtButton>
                <EtButton stretch variant="primary-subtle" onPress={() => {}}>
                  Cancel
                </EtButton>
              </EtFooter.Section>
              <EtFooter.Section style={styles.linksRow}>
                <EtFooter.Link onPress={() => {}}>Terms</EtFooter.Link>
                <EtFooter.Link onPress={() => {}}>Privacy</EtFooter.Link>
                <EtFooter.Link onPress={() => {}}>Help</EtFooter.Link>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>

          <FooterShowcase
            title="Button + Links"
            description="Action with navigation"
            code={`<EtFooter>
  <EtFooter.Section>
    <EtButton stretch onPress={handleStart}>
      Get Started
    </EtButton>
  </EtFooter.Section>
  <EtFooter.Section style={{ flexDirection: 'row', gap: 8 }}>
    <EtFooter.Link onPress={handleTerms}>Terms</EtFooter.Link>
    <EtFooter.Link onPress={handlePrivacy}>Privacy</EtFooter.Link>
  </EtFooter.Section>
</EtFooter>`}
          >
            <EtFooter>
              <EtFooter.Section>
                <EtButton stretch onPress={() => {}}>
                  Get Started
                </EtButton>
              </EtFooter.Section>
              <EtFooter.Section style={styles.linksRow}>
                <EtFooter.Link onPress={() => {}}>Terms</EtFooter.Link>
                <EtFooter.Link onPress={() => {}}>Privacy</EtFooter.Link>
              </EtFooter.Section>
            </EtFooter>
          </FooterShowcase>
        </View>
      </ScrollView>
    );
  },
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  heroSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 300,
  },
  section: {
    marginTop: 32,
    gap: 16,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 8,
  },
  showcaseItem: {
    gap: 8,
  },
  showcaseDesc: {
    opacity: 0.6,
  },
  footerWrapper: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#E8E8E8',
  },
  footerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 11,
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
  buttonsColumn: {
    gap: 12,
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  flexButton: {
    flex: 1,
  },
  noPadding: {
    padding: 0,
  },
  footerActions: {
    paddingHorizontal: 36,
    paddingVertical: 24,
    gap: 16,
  },
});
