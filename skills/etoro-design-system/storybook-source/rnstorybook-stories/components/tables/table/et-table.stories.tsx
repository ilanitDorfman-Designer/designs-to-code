import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EtTable, EtTableBody, EtTableColumn, EtTableHead, EtTableRow, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core/hooks';

import { useTableConfig } from 'etoro-ui/components/tables/table';
import { largeDataset, sampleData, SampleDataItem } from './data.mock';

// Column definitions with more options for visibility testing
const columns: EtTableColumn[] = [
  { name: 'gain', title: 'Gain', visible: true, width: 100 },
  { name: 'peak', title: 'Peak', visible: true, width: 200 },
  { name: 'buyPrice', title: 'Buy', visible: true, width: 80 },
  { name: 'sellPrice', title: 'Sell', visible: false, width: 80 },
];

// Story component with column visibility controls
const ColumnVisibilityStory = (args: any) => {
  const { colors } = useEtoroTheme();
  const [availableColumns, setAvailableColumns] = useState<EtTableColumn[]>(columns);

  // Toggle column visibility
  const toggleColumnVisibility = (columnName: string) => {
    setAvailableColumns((prev) => prev.map((col) => (col.name === columnName ? { ...col, visible: !col.visible } : col)));
  };

  const renderColumn = (item: SampleDataItem, column: EtTableColumn) => {
    switch (column.name) {
      case 'gain':
        return (
          <View style={styles.gainColumn}>
            <EtText variant="body-secondary-semibold" style={{ color: colors.primary }}>
              {item.gain.toLocaleString()}
            </EtText>
            <EtText variant="body-tiny-regular" style={[{ fontSize: 11, marginTop: 2 }, { color: colors.primary }]}>
              [{item.gain}]
            </EtText>
          </View>
        );

      case 'peak':
        return (
          <View style={styles.peakColumn}>
            <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
              {item.peak}
            </EtText>
          </View>
        );

      case 'buyPrice':
        return (
          <View style={styles.chartColumn}>
            <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
              {item.buyPrice}
            </EtText>
          </View>
        );

      case 'sellPrice':
        return (
          <View style={styles.chartColumn}>
            <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
              {item.sellPrice}
            </EtText>
          </View>
        );

      default:
        const value = item[column.name];
        return (
          <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: colors.text }]}>
            {value ? String(value) : 'n/a'}
          </EtText>
        );
    }
  };

  const renderHeaderColumn = (column: EtTableColumn) => (
    <View style={{ width: column.width }}>
      <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
        {column.title} ({column.width})
      </EtText>
    </View>
  );

  // Column toggle controls
  const renderColumnControls = () => (
    <View style={[styles.controlsContainer, { backgroundColor: colors.background }]}>
      <EtText variant="body-base-semibold" style={[{ marginBottom: 12 }, { color: colors.text }]}>
        Toggle Column Visibility:
      </EtText>
      <View style={styles.toggleContainer}>
        {availableColumns.map((column) => (
          <Pressable
            key={column.name}
            style={[
              styles.toggleButton,
              {
                backgroundColor: column.visible ? colors.primary : colors.textSecondaryNeutral,
              },
            ]}
            onPress={() => toggleColumnVisibility(column.name)}
          >
            <EtText variant="body-secondary-medium" style={{ color: '#fff' }}>
              {column.title}
            </EtText>
          </Pressable>
        ))}
      </View>
      <EtText variant="body-tiny-regular" style={[{ fontStyle: 'italic', textAlign: 'center' }, { color: colors.text }]}>
        💾 Column visibility is automatically saved and restored
      </EtText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderColumnControls()}
      <EtTable id={args.id ?? 'column-visibility-table'} columns={availableColumns} fullHeight={false}>
        <EtTableHead renderColumn={renderHeaderColumn} />
        <EtTableBody
          items={sampleData}
          renderItem={({ item }) => (
            <EtTableRow
              item={item}
              onRowClick={(item: unknown) => console.log('Row clicked:', item)}
              renderColumn={renderColumn}
              style={{ paddingVertical: 8 }}
            />
          )}
        />
      </EtTable>
    </View>
  );
};

// Fixed column story component for large data sets
const FixedColumnStory = (args: any) => {
  const { colors } = useEtoroTheme();

  // Column definitions for 20 columns with the first one being stock
  const wideColumns: EtTableColumn[] = [
    { name: 'stock', title: 'Stock', visible: true, width: 170 },
    { name: 'price', title: 'Price', visible: true, width: 100 },
    { name: 'change', title: 'Change', visible: true, width: 100 },
    { name: 'volume', title: 'Volume', visible: true, width: 120 },
    { name: 'marketCap', title: 'Market Cap', visible: true, width: 120 },
    { name: 'peRatio', title: 'P/E Ratio', visible: true, width: 100 },
    { name: 'dividend', title: 'Dividend', visible: true, width: 100 },
    { name: 'beta', title: 'Beta', visible: true, width: 80 },
    { name: 'eps', title: 'EPS', visible: true, width: 100 },
    { name: 'revenue', title: 'Revenue', visible: true, width: 120 },
    { name: 'profit', title: 'Profit', visible: true, width: 100 },
    { name: 'employees', title: 'Employees', visible: true, width: 120 },
    { name: 'founded', title: 'Founded', visible: true, width: 100 },
    { name: 'sector', title: 'Sector', visible: true, width: 120 },
    { name: 'country', title: 'Country', visible: true, width: 100 },
    { name: 'exchange', title: 'Exchange', visible: true, width: 100 },
    { name: 'analyst', title: 'Analyst', visible: true, width: 100 },
    { name: 'target', title: 'Target', visible: true, width: 100 },
    { name: 'rating', title: 'Rating', visible: true, width: 100 },
  ];

  const renderColumn = (item: any, column: EtTableColumn) => {
    const value = item[column.name];

    // Special styling for the first column
    if (column.name === 'stock') {
      return (
        <View style={styles.stockNameColumn}>
          <EtText variant="body-secondary-semibold" style={[{ lineHeight: 18 }, { color: colors.text }]}>
            {value}
          </EtText>
        </View>
      );
    }

    // Color coding for change column
    if (column.name === 'change') {
      const isPositive = parseFloat(value) > 0;
      return (
        <View style={styles.defaultColumn}>
          <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
            {value}
          </EtText>
        </View>
      );
    }

    // Analyst rating with color coding
    if (column.name === 'analyst') {
      const color = value === 'Buy' ? '#4CAF50' : value === 'Sell' ? '#F44336' : '#FF9800';
      return (
        <View style={styles.defaultColumn}>
          <EtText variant="body-secondary-semibold" style={[{ lineHeight: 18 }, { color }]}>
            {value}
          </EtText>
        </View>
      );
    }

    return (
      <View style={styles.defaultColumn}>
        <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: colors.text }]}>
          {value ? String(value) : 'n/a'}
        </EtText>
      </View>
    );
  };

  const renderHeaderColumn = (column: EtTableColumn) => (
    <View
      style={{
        width: column.width,
        alignItems: 'flex-start',
        paddingHorizontal: column.name !== 'stock' ? 12 : 16,
        paddingVertical: 12,
        backgroundColor: 'transparent',
      }}
    >
      <EtText variant="body-base-regular" style={{ color: colors.text }}>
        {column.title} {column.name !== 'stock' ? '>' : ''}
      </EtText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, height: 600 }]}>
      <View style={[styles.fixedColumnDescription, { backgroundColor: colors.card ?? colors.background }]}>
        <EtText variant="body-base-semibold" style={[{ marginBottom: 8 }, { color: colors.text }]}>
          📌 Fixed First Column Demo
        </EtText>
        <EtText variant="body-secondary-regular" style={[{ lineHeight: 20 }, { color: colors.textSecondaryNeutral }]}>
          This table shows 100 items with 19 data columns.
        </EtText>
        <EtText variant="body-secondary-regular" style={[{ lineHeight: 20 }, { color: colors.textSecondaryNeutral }]}>
          The first column remains fixed while you scroll horizontally through the other columns.
        </EtText>
      </View>

      <EtTable id={args.id ?? 'fixed-column-table'} columns={wideColumns} fixFirstColumn fullHeight={false}>
        <EtTableBody
          items={largeDataset}
          flashListProps={{
            removeClippedSubviews: true,
            showsVerticalScrollIndicator: false,
          }}
          glassEffect={{
            disabled: true,
          }}
          renderHeaderColumn={renderHeaderColumn}
          renderItem={({ item }) => (
            <EtTableRow item={item} onRowClick={(item: unknown) => console.log('Stock clicked:', item)} renderColumn={renderColumn} />
          )}
        />
      </EtTable>
    </View>
  );
};

// Component that has access to table context for scroll effects
const TableBodyWithScrollEffects = () => {
  const { colors } = useEtoroTheme();
  const { isScrolled } = useTableConfig();

  const renderColumn = useCallback(
    (item: any, column: EtTableColumn) => {
      const value = item[column.name];

      // Special styling for the first column
      if (column.name === 'stock') {
        return (
          <View style={styles.stockNameColumn}>
            <EtText variant="body-secondary-semibold" style={[{ lineHeight: 18 }, { color: colors.text }]}>
              {value}
            </EtText>
          </View>
        );
      }

      // Color coding for change column
      if (column.name === 'change') {
        const isPositive = parseFloat(value) > 0;
        return (
          <View style={styles.defaultColumn}>
            <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
              {value}
            </EtText>
          </View>
        );
      }

      // Analyst rating with color coding
      if (column.name === 'analyst') {
        const color = value === 'Buy' ? '#4CAF50' : value === 'Sell' ? '#F44336' : '#FF9800';
        return (
          <View style={styles.defaultColumn}>
            <EtText variant="body-secondary-semibold" style={[{ lineHeight: 18 }, { color }]}>
              {value}
            </EtText>
          </View>
        );
      }

      return (
        <View style={styles.defaultColumn}>
          <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: colors.text }]}>
            {value ? String(value) : 'n/a'}
          </EtText>
        </View>
      );
    },
    [isScrolled, colors.text],
  );

  // Memoize renderItem to force re-render when scroll state changes
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <EtTableRow
        key={`${item.id}-${isScrolled}`} // Force re-render when scroll state changes
        item={item}
        onRowClick={(item: unknown) => console.log('Stock clicked:', item)}
        renderColumn={renderColumn}
      />
    ),
    [renderColumn, isScrolled],
  );

  const renderHeaderColumn = (column: EtTableColumn) => (
    <View
      style={[
        {
          width: column.width,
          alignItems: 'flex-start',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 2,
          borderBottomColor: colors.border || '#E0E0E0',
        },
      ]}
    >
      <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
        {column.title}
      </EtText>
    </View>
  );

  return (
    <EtTableBody
      items={largeDataset}
      flashListProps={{
        removeClippedSubviews: true,
        showsVerticalScrollIndicator: false,
        extraData: isScrolled, // Force re-render when scroll state changes
      }}
      renderHeaderColumn={renderHeaderColumn}
      renderItem={renderItem}
    />
  );
};

// Fixed column story with horizontal scroll effects
const FixedColumnWithScrollEffectsStory = (args: any) => {
  const { colors } = useEtoroTheme();

  // Column definitions for 20 columns with the first one being stock
  const wideColumns: EtTableColumn[] = [
    { name: 'stock', title: 'Stock', visible: true, width: 170 },
    { name: 'price', title: 'Price', visible: true, width: 100 },
    { name: 'change', title: 'Change', visible: true, width: 100 },
    { name: 'volume', title: 'Volume', visible: true, width: 120 },
    { name: 'marketCap', title: 'Market Cap', visible: true, width: 120 },
    { name: 'peRatio', title: 'P/E Ratio', visible: true, width: 100 },
    { name: 'dividend', title: 'Dividend', visible: true, width: 100 },
    { name: 'beta', title: 'Beta', visible: true, width: 80 },
    { name: 'eps', title: 'EPS', visible: true, width: 100 },
    { name: 'revenue', title: 'Revenue', visible: true, width: 120 },
    { name: 'profit', title: 'Profit', visible: true, width: 100 },
    { name: 'employees', title: 'Employees', visible: true, width: 120 },
    { name: 'founded', title: 'Founded', visible: true, width: 100 },
    { name: 'sector', title: 'Sector', visible: true, width: 120 },
    { name: 'country', title: 'Country', visible: true, width: 100 },
    { name: 'exchange', title: 'Exchange', visible: true, width: 100 },
    { name: 'analyst', title: 'Analyst', visible: true, width: 100 },
    { name: 'target', title: 'Target', visible: true, width: 100 },
    { name: 'rating', title: 'Rating', visible: true, width: 100 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, height: 600 }]}>
      {/* Scroll state indicator */}
      <View style={[styles.fixedColumnDescription, { backgroundColor: colors.card ?? colors.background }]}>
        <EtText variant="body-base-semibold" style={[{ marginBottom: 8 }, { color: colors.text }]}>
          🎨 Horizontal Scroll Effects Demo
        </EtText>
        <EtText variant="body-secondary-regular" style={[{ lineHeight: 20 }, { color: colors.textSecondaryNeutral }]}>
          The fixed column changes appearance with a sophisticated glass morphism effect when you scroll horizontally. Uses BlurView and
          LinearGradient for professional frosted glass visual effects.
        </EtText>
      </View>

      <EtTable id={args.id ?? 'fixed-column-scroll-effects-table'} columns={wideColumns} fixFirstColumn fullHeight={false}>
        <TableBodyWithScrollEffects />
      </EtTable>
    </View>
  );
};

// Regular story component for most cases
const EtTableStory = (args: any) => {
  const { colors } = useEtoroTheme();

  const renderColumn = (item: SampleDataItem, column: EtTableColumn) => {
    switch (column.name) {
      case 'gain':
        return (
          <View style={styles.gainColumn}>
            <EtText variant="body-secondary-semibold" style={{ color: colors.primary }}>
              {item.gain.toLocaleString()}
            </EtText>
            <EtText variant="body-tiny-regular" style={[{ fontSize: 11, marginTop: 2 }, { color: colors.primary }]}>
              [{item.gain}]
            </EtText>
          </View>
        );

      case 'peak':
        return (
          <View style={styles.peakColumn}>
            <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
              {item.peak}
            </EtText>
          </View>
        );

      case 'buyPrice':
        return (
          <View style={styles.peakColumn}>
            <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: colors.text }]}>
              {item.buyPrice}
            </EtText>
          </View>
        );

      case 'sellPrice':
        return (
          <View style={styles.peakColumn}>
            <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: colors.text }]}>
              {item.sellPrice}
            </EtText>
          </View>
        );

      default:
        const value = item[column.name];
        return (
          <EtText variant="body-secondary-regular" style={[{ lineHeight: 18 }, { color: colors.text }]}>
            {value ? String(value) : 'n/a'}
          </EtText>
        );
    }
  };

  const renderSubtitle = () => (
    <View style={styles.subtitle}>
      <EtText variant="body-secondary-regular" style={[{ padding: 16 }, { color: colors.text }]}>
        {args.subtitle || 'Sample table'}
      </EtText>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <EtText variant="body-tiny-regular" style={[{ textAlign: 'center', padding: 16 }, { color: colors.text }]}>
        {args.footerText || 'End of list'}
      </EtText>
    </View>
  );

  const renderHeaderColumn = (column: EtTableColumn) => (
    <View
      style={{
        width: column.width,
        alignItems: 'flex-start',
      }}
    >
      <EtText variant="body-secondary-semibold" style={{ color: colors.text }}>
        {column.title}
      </EtText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EtTable id={args.id ?? 'storybook-table'} columns={columns} fullHeight={args.fullHeight}>
        {args.showSubtitle && renderSubtitle()}
        <EtTableHead renderColumn={renderHeaderColumn} />
        <EtTableBody
          items={sampleData}
          renderItem={({ item }) => (
            <EtTableRow
              item={item}
              onRowClick={(item: unknown) => console.log('Row clicked:', item)}
              renderColumn={renderColumn}
              style={{ paddingVertical: 8 }}
            />
          )}
        />
        {args.showFooter && renderFooter()}
      </EtTable>
    </View>
  );
};

const meta: Meta<typeof EtTableStory> = {
  title: 'eToro-UI/Components/Tables/EtTable',
  component: EtTableStory,
  parameters: {
    docs: {
      description: {
        component: 'A flexible data table component with persistence support.',
      },
    },
  },
  args: {
    id: 'storybook-table',
    fullHeight: false,
    showSubtitle: false,
    showFooter: false,
    subtitle: 'Subtitle text goes here',
    footerText: 'Footer text goes here',
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique table identifier',
    },
    fullHeight: {
      control: 'boolean',
      description: 'Whether table should take full height',
    },
    showSubtitle: {
      control: 'boolean',
      description: 'Show subtitle section',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show footer section',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text',
    },
    footerText: {
      control: 'text',
      description: 'Footer text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitleOnly: Story = {
  args: {
    showSubtitle: true,
  },
};

export const WithFooterOnly: Story = {
  args: {
    showFooter: true,
    footerText: `Footer text: ${sampleData.length} items in total`,
  },
};

export const FullHeight: Story = {
  args: {
    fullHeight: true,
    showSubtitle: true,
    showFooter: true,
  },
};

export const ColumnVisibilityToggle: Story = {
  render: (args) => <ColumnVisibilityStory {...args} />,
  args: {
    id: 'column-visibility-table',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates column persistence by allowing you to toggle column visibility. ' +
          'Changes are automatically saved and will be restored when you refresh the story. ',
      },
    },
  },
};

export const FixedFirstColumn: Story = {
  render: (args) => <FixedColumnStory {...args} />,
  args: {
    id: 'fixed-column-table',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the fixed first column functionality with a large dataset (100 rows × 19 columns). ' +
          'The first column remains fixed and visible while you can scroll horizontally through the other 18 data columns. ' +
          'Perfect for displaying stock information, financial data, or any scenario where you need to keep the identifier visible while browsing additional details. ' +
          '\n\nKey features:\n' +
          '• First column remains fixed during horizontal scroll\n' +
          '• Header and body scroll together as one unit\n' +
          '• Optimized for large datasets using FlashList\n' +
          '• Consistent row heights and smooth scrolling\n' +
          '• Visual separation between fixed and scrollable sections',
      },
    },
  },
};

export const FixedColumnScrollEffects: Story = {
  render: (args) => <FixedColumnWithScrollEffectsStory {...args} />,
  args: {
    id: 'fixed-column-scroll-effects-table',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates configurable glass morphism effects on the fixed column. ' +
          'The fixed column displays a sophisticated glass morphism overlay when scrolled horizontally, ' +
          'with customizable blur intensity, gradient colors, and overlay styling. ' +
          '\n\nKey features:\n' +
          '• Configurable glass morphism effect via glassEffect prop\n' +
          '• Customizable blur intensity and gradient colors\n' +
          '• Optional overlay styling for borders and shadows\n' +
          '• Professional frosted glass visual effects\n' +
          '• Automatic scroll state management via table context\n' +
          '• No hardcoded styles - fully configurable',
      },
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
  },
  gainColumn: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  peakColumn: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  chartColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  smallNumber: {
    fontSize: 11,
    marginTop: 2,
  },
  defaultCellText: {
    fontSize: 14,
    lineHeight: 18,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    padding: 16,
  },
  subtitleText: {
    fontSize: 14,
    padding: 16,
  },
  footer: {
    padding: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 16,
  },
  // New styles for column visibility controls
  controlsContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  persistenceNote: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // New styles for fixed column demo
  fixedColumnDescription: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  stockNameColumn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  defaultColumn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stockNameText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});
