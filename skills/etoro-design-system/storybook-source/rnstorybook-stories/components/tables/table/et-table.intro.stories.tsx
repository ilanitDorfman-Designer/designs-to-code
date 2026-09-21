import type { Meta, StoryObj } from '@storybook/react-native';
import { useEtoroTheme } from 'etoro-ui/core/hooks';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const EtTableIntroStory = () => {
  const { colors } = useEtoroTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Et Table Component</Text>

      <Text style={[styles.description, { color: colors.text }]}>
        A composable, responsive data table component designed for mobile devices and tablets. Built with composable architecture using EtTable as a
        container with EtTableHead, EtTableBody, and EtTableRow components. Features advanced fixed column support with synchronized scrolling and
        FlashList integration for optimal performance.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>

      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.text }]}>• Composable architecture with EtTableHead, EtTableBody, EtTableRow</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Context-based configuration sharing across components</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Fixed first column with synchronized dual FlashList implementation</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Performance-optimized scrolling with hardware-adaptive throttling</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• FlashList integration with infinite scrolling support</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Glass morphism effects with configurable blur and gradient overlays</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Theme integration with useEtoroTheme</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Customizable render functions for columns and rows</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Accessibility support with proper labels and roles</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• TypeScript support with generic data types</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Column override system for custom row configurations</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Use Cases</Text>

      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.text }]}>• Financial data tables with fixed asset names and scrollable metrics</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Portfolio views with fixed symbols and horizontal price data</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Transaction history with infinite scrolling support</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• User lists with actions (contacts, followers, leaderboards)</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Product catalogs with dynamic column configurations</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Settings panels with custom cell renderers and toggle actions</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Large datasets requiring performance-optimized rendering</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Any structured data needing mobile-friendly presentation with scrolling</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Component Architecture</Text>

      <Text style={[styles.description, { color: colors.text }]}>
        The Et Table follows a composable architecture pattern with specialized components for different table modes:
      </Text>

      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.text }]}>• EtTable: Container component providing layout and configuration context</Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          • EtTableHead: Header component with customizable column rendering (should not be used in fixed column mode)
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>• EtTableBody: FlashList-based body component with automatic mode switching</Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          • EtTableBodyWithFixedColumn: Specialized component for fixed column layout with dual synchronized FlashLists
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          • EtTableRow: Individual row component with column rendering and override support
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>• TableConfigProvider: Context for sharing configuration across components</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Performance hooks: useMemoizedTableRowCallbacks for optimized rendering</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Fixed Column Features</Text>

      <Text style={[styles.description, { color: colors.text }]}>Advanced fixed column implementation for complex data presentations:</Text>

      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.text }]}>• Dual FlashList architecture with synchronized scrolling</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Performance-optimized synchronization with frame-time monitoring</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Bi-directional scroll sync between fixed and moving columns</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Independent column rendering with coordinated headers</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Automatic mode switching based on fixFirstColumn prop</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Glass morphism visual effects with BlurView and LinearGradient</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Features</Text>

      <Text style={[styles.description, { color: colors.text }]}>Built-in performance optimizations for smooth scrolling experience:</Text>

      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.text }]}>• FlashList integration with windowing and batch rendering</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Frame time monitoring using performance.now() for precise timing</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Hardware-adaptive throttling (16.67ms target for 60fps)</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Memoized configuration context to prevent unnecessary re-renders</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Optimized callback extraction for fixed column mode</Text>
        <Text style={[styles.feature, { color: colors.text }]}>• Glass morphism effects with minimal performance impact</Text>
      </View>
    </ScrollView>
  );
};

const meta: Meta<typeof EtTableIntroStory> = {
  title: 'eToro-UI/Components/Tables/EtTable/Introduction',
  component: EtTableIntroStory,
  parameters: {
    docs: {
      description: {
        component: 'Introduction and overview of the Et Table component.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Introduction: Story = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  featureList: {
    marginLeft: 8,
  },
  feature: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
