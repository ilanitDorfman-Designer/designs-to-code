import { CompleteProfileStatus } from '@etoro/features/onboarding/kyc/rn/ui/components';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText variant="body-secondary-semibold">{title}</EtText>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <EtText variant="body-tiny-regular" style={styles.codeText}>
          {code}
        </EtText>
      </ScrollView>
    </View>
  );
};

const SectionTitle = ({ children }: { children: string }) => (
  <EtText variant="heading-compact" style={styles.sectionTitle}>
    {children}
  </EtText>
);

const meta: Meta<{}> = {
  title: 'Features/Onboarding/KYC/Components/CompleteProfileStatus/📖 Introduction',
  parameters: {
    notes: 'Overview and usage guide for the CompleteProfileStatus compound component.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

export const Introduction: Story = {
  render: () => {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <EtText variant="display-main" style={styles.header}>
          CompleteProfileStatus
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          A compound component that displays KYC profile completion progress with a percentage label, progress bar, and action link.
        </EtText>

        {/* Component Structure */}
        <SectionTitle>Component Structure</SectionTitle>
        <CodeBlock
          code={`CompleteProfileStatus          (container — provides percentage via context)
├── CompleteProfileStatus.Percent   (text label, e.g. "25% Complete")
├── CompleteProfileStatus.Progress  (progress bar powered by EtProgressV2)
└── CompleteProfileStatus.Link      (action link powered by EtLink)`}
        />

        {/* Default */}
        <SectionTitle>Default</SectionTitle>
        <View style={styles.demoContainer}>
          <CompleteProfileStatus percentage={25}>
            <CompleteProfileStatus.Percent>25% Complete</CompleteProfileStatus.Percent>
            <CompleteProfileStatus.Progress />
            <CompleteProfileStatus.Link>Complete your profile</CompleteProfileStatus.Link>
          </CompleteProfileStatus>
        </View>

        {/* Basic Usage */}
        <SectionTitle>Basic Usage</SectionTitle>
        <CodeBlock
          title="Import"
          code={`import {
  CompleteProfileStatus,
  type CompleteProfileStatusProps,
} from '@etoro/features/onboarding/kyc/rn/ui/components';`}
        />

        <CodeBlock
          title="Minimal example"
          code={`<CompleteProfileStatus percentage={25}>
  <CompleteProfileStatus.Percent>
    25% Complete
  </CompleteProfileStatus.Percent>
  <CompleteProfileStatus.Progress />
  <CompleteProfileStatus.Link onPress={handlePress}>
    Complete your profile
  </CompleteProfileStatus.Link>
</CompleteProfileStatus>`}
        />

        {/* Props Table */}
        <SectionTitle>CompleteProfileStatusProps</SectionTitle>
        <EtText variant="body-secondary-regular" style={styles.description}>
          Extends ViewProps from react-native.
        </EtText>

        <View style={styles.propsTable}>
          <View style={styles.propsHeader}>
            <EtText variant="body-secondary-semibold" style={styles.propCol1}>
              Prop
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol2}>
              Type
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol3}>
              Default
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              percentage
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              number (0–100)
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              (required)
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              children
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              ReactNode
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              —
            </EtText>
          </View>
        </View>

        {/* Subcomponent Props */}
        <SectionTitle>Subcomponent Props</SectionTitle>

        <EtText variant="body-secondary-semibold" style={styles.subHeader}>
          Percent (extends EtTextProps)
        </EtText>
        <View style={styles.propsTable}>
          <View style={styles.propsHeader}>
            <EtText variant="body-secondary-semibold" style={styles.propCol1}>
              Prop
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol2}>
              Type
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol3}>
              Default
            </EtText>
          </View>
          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              children
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              string
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              (required)
            </EtText>
          </View>
        </View>

        <EtText variant="body-secondary-semibold" style={styles.subHeader}>
          Progress (Pick{'<'}EtProgressV2Props, 'color' | 'size' | 'testID'{'>'})
        </EtText>
        <View style={styles.propsTable}>
          <View style={styles.propsHeader}>
            <EtText variant="body-secondary-semibold" style={styles.propCol1}>
              Prop
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol2}>
              Type
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol3}>
              Default
            </EtText>
          </View>
          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              color
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              'positive' | 'neutral'
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              'positive'
            </EtText>
          </View>
          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              size
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              'small' | 'medium' | 'large'
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              'small'
            </EtText>
          </View>
        </View>

        <EtText variant="body-secondary-semibold" style={styles.subHeader}>
          Link (Omit{'<'}EtLinkProps, 'variant' | 'size'{'>'})
        </EtText>
        <View style={styles.propsTable}>
          <View style={styles.propsHeader}>
            <EtText variant="body-secondary-semibold" style={styles.propCol1}>
              Prop
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol2}>
              Type
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol3}>
              Default
            </EtText>
          </View>
          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              children
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              string
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              (required)
            </EtText>
          </View>
          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              onPress
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              () ={'>'} void
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              —
            </EtText>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    opacity: 0.7,
    marginBottom: 16,
  },
  demoContainer: {
    marginBottom: 16,
  },
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeText: {
    fontFamily: 'Courier',
    padding: 12,
  },
  propsTable: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  propsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  propsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  propCol1: {
    flex: 1,
  },
  propCol2: {
    flex: 1.5,
  },
  propCol3: {
    flex: 1,
  },
  spacer: {
    height: 40,
  },
});
