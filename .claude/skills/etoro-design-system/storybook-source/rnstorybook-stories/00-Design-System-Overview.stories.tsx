import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const CategoryCard = ({ title, description, components, color }: { title: string; description: string; components: string[]; color: string }) => {
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.categoryCard, { borderLeftColor: color }]}>
      <EtText variant="heading-compact" style={[styles.categoryTitle, { color }]}>
        {title}
      </EtText>
      <EtText variant="body-base-regular" style={[styles.categoryDescription, { color: colors.textPrimaryNeutral }]}>
        {description}
      </EtText>
      <View style={styles.componentList}>
        {components.map((component, index) => (
          <View key={index} style={[styles.componentTag, { backgroundColor: `${color}15` }]}>
            <EtText variant="body-secondary-regular" style={[styles.componentName, { color }]}>
              {component}
            </EtText>
          </View>
        ))}
      </View>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/🏠 Design System Overview',
  parameters: {
    notes: 'Complete overview of the eToro UI component library structure and organization.',
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

export const Overview: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-hero" style={styles.title}>
            eToro UI Design System
          </EtText>
          <EtText variant="heading-compact" style={[styles.subtitle, { color: colors.textPrimaryNeutral }]}>
            A comprehensive, hierarchically organized component library for React Native
          </EtText>
        </View>

        <View style={styles.section}>
          <EtText variant="heading-large" style={styles.sectionTitle}>
            📁 Component Organization
          </EtText>
          <EtText variant="body-base-regular" style={[styles.sectionDescription, { color: colors.textPrimaryNeutral }]}>
            Our components are organized into logical categories for easy navigation and discovery. Each category serves a specific purpose in the
            design system hierarchy.
          </EtText>
        </View>

        <View style={styles.categoriesContainer}>
          <CategoryCard
            title="🏗️ Foundations"
            description="Core design tokens and base components that form the foundation of the design system"
            components={['EtText', 'EtAnimatedCount', 'EtoroIcon']}
            color="#8B5CF6"
          />

          <CategoryCard
            title="📐 Layout"
            description="Components for structuring and organizing page layouts"
            components={['Headers', 'Expandable', 'View']}
            color="#3B82F6"
          />

          <CategoryCard
            title="🔘 Button"
            description="Button components for user actions"
            components={['EtButton', 'EtIconButton']}
            color="#06B6D4"
          />

          <CategoryCard
            title="🎛️ Controls"
            description="Interactive components for user input and form controls"
            components={['TextToggle', 'Checkbox', 'NumberPicker', 'Chips', 'TimeFrame', 'Toggle']}
            color="#14B8A6"
          />

          <CategoryCard
            title="📊 Status"
            description="Components for showing progress and loading states"
            components={['EtRange', 'ProgressBar', 'Skeleton']}
            color="#22C55E"
          />

          <CategoryCard title="📋 List" description="Components for displaying list items" components={['AssetItem', 'ListItem']} color="#84CC16" />

          <CategoryCard
            title="✏️ Input"
            description="Text input components for user data entry"
            components={['Input', 'SearchInput']}
            color="#EAB308"
          />

          <CategoryCard
            title="📱 Overlays"
            description="Modal components and overlays that appear above the main content"
            components={['BottomSheet']}
            color="#F97316"
          />

          <CategoryCard title="📑 Tables" description="Components for tabular data display" components={['Table', 'SectionList']} color="#EF4444" />

          <CategoryCard title="👥 Social" description="Social and community-related components" components={['Post', 'Avatar']} color="#EC4899" />

          <CategoryCard
            title="📈 Data Display"
            description="Components for data visualization and presentation"
            components={['AssetCard', 'LineChart', 'BreakdownChart', 'Ticker']}
            color="#A855F7"
          />
        </View>

        <View style={styles.section}>
          <EtText variant="heading-large" style={styles.sectionTitle}>
            📋 Naming Conventions
          </EtText>
          <View style={styles.conventionsList}>
            <View style={styles.conventionItem}>
              <EtText variant="body-base-semibold" style={styles.conventionTitle}>
                Component Stories:
              </EtText>
              <Text style={[styles.codeExample, { color: colors.textPrimaryNeutral }]}>eToro-UI/Category/ComponentName</Text>
            </View>
            <View style={styles.conventionItem}>
              <EtText variant="body-base-semibold" style={styles.conventionTitle}>
                Introduction Docs:
              </EtText>
              <Text style={[styles.codeExample, { color: colors.textPrimaryNeutral }]}>eToro-UI/Category/ComponentName/📖 Introduction</Text>
            </View>
            <View style={styles.conventionItem}>
              <EtText variant="body-base-semibold" style={styles.conventionTitle}>
                Examples:
              </EtText>
              <Text style={[styles.codeExample, { color: colors.textPrimaryNeutral }]}>
                • eToro-UI/Components/Button/EtButton{'\n'}• eToro-UI/Components/DataDisplay/LineChart{'\n'}• eToro-UI/Foundations/Typography/EtText
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <EtText variant="heading-large" style={styles.sectionTitle}>
            📂 Folder Structure
          </EtText>
          <Text style={[styles.codeExample, { color: colors.textPrimaryNeutral }]}>
            {`etoro-ui/src/
├── foundations/
│   ├── text/
│   ├── animated-digits/
│   └── icon-assets/
├── components/
│   ├── layout/
│   │   ├── headers/
│   │   ├── expandable/
│   │   └── view/
│   ├── button/
│   ├── controls/
│   │   ├── text-toggle/
│   │   ├── checkbox/
│   │   ├── number-picker/
│   │   ├── chips/
│   │   ├── time-frame/
│   │   └── toggle/
│   ├── status/
│   │   ├── et-range/
│   │   ├── progress-bar/
│   │   └── skeleton/
│   ├── list/
│   │   ├── asset-item/
│   │   └── list-item/
│   ├── input/
│   │   ├── input/
│   │   └── search-input/
│   ├── overlays/
│   │   └── bottom-sheet/
│   ├── tables/
│   │   ├── table/
│   │   └── section-list/
│   ├── social/
│   │   ├── post/
│   │   └── avatar/
│   └── data-display/
│       ├── asset-card/
│       ├── line-chart/
│       ├── breakdown-chart/
│       └── ticker/
└── core/`}
          </Text>
        </View>

        <View style={styles.section}>
          <EtText variant="heading-large" style={styles.sectionTitle}>
            ➕ Adding New Components
          </EtText>
          <View style={styles.guidelinesList}>
            <EtText variant="body-base-regular" style={styles.guideline}>
              <EtText variant="body-base-semibold">1. Choose the Right Category:</EtText> Determine which category best fits your component's primary
              purpose
            </EtText>
            <EtText variant="body-base-regular" style={styles.guideline}>
              <EtText variant="body-base-semibold">2. Follow Naming Patterns:</EtText> Use the established naming convention for consistency
            </EtText>
            <EtText variant="body-base-regular" style={styles.guideline}>
              <EtText variant="body-base-semibold">3. Create Both Stories:</EtText> Include both the main story and comprehensive introduction guide
            </EtText>
            <EtText variant="body-base-regular" style={styles.guideline}>
              <EtText variant="body-base-semibold">4. Document Thoroughly:</EtText> Include live examples, code snippets, and API references
            </EtText>
          </View>
        </View>

        <View style={styles.section}>
          <EtText variant="heading-large" style={styles.sectionTitle}>
            🎯 Best Practices
          </EtText>
          <View style={styles.practicesList}>
            <View style={styles.practiceItem}>
              <EtText variant="body-base-semibold" style={styles.practiceTitle}>
                📖 Documentation First
              </EtText>
              <EtText variant="body-base-regular" style={styles.practiceDescription}>
                Every component should have comprehensive documentation with examples
              </EtText>
            </View>
            <View style={styles.practiceItem}>
              <EtText variant="body-base-semibold" style={styles.practiceTitle}>
                🎮 Interactive Examples
              </EtText>
              <EtText variant="body-base-regular" style={styles.practiceDescription}>
                Provide interactive controls for testing different component states
              </EtText>
            </View>
            <View style={styles.practiceItem}>
              <EtText variant="body-base-semibold" style={styles.practiceTitle}>
                💼 Real-world Context
              </EtText>
              <EtText variant="body-base-regular" style={styles.practiceDescription}>
                Show components in realistic trading interface scenarios
              </EtText>
            </View>
            <View style={styles.practiceItem}>
              <EtText variant="body-base-semibold" style={styles.practiceTitle}>
                🚀 Performance Notes
              </EtText>
              <EtText variant="body-base-regular" style={styles.practiceDescription}>
                Include performance considerations and optimization patterns
              </EtText>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { backgroundColor: colors.bgNeutralQuaternary }]}>
          <EtText variant="body-secondary-regular" style={[styles.footerText, { color: colors.textPrimaryNeutral }]}>
            This structure follows industry standards from Material-UI, Ant Design, and Chakra UI for maximum developer experience and scalability.
          </EtText>
        </View>
      </ScrollView>
    );
  },
  args: {},
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
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionDescription: {
    opacity: 0.8,
    lineHeight: 24,
  },
  categoriesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  categoryCard: {
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryTitle: {
    marginBottom: 8,
  },
  categoryDescription: {
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 20,
  },
  componentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  componentTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  componentName: {
    fontWeight: '500',
  },
  conventionsList: {
    gap: 16,
  },
  conventionItem: {
    gap: 4,
  },
  conventionTitle: {},
  codeExample: {
    fontFamily: 'Courier',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#06B6D4',
  },
  guidelinesList: {
    gap: 12,
  },
  guideline: {
    lineHeight: 22,
    opacity: 0.9,
  },
  practicesList: {
    gap: 16,
  },
  practiceItem: {
    gap: 4,
  },
  practiceTitle: {},
  practiceDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
