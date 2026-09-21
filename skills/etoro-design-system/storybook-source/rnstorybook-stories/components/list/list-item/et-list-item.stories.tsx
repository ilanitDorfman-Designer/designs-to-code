import type { Meta, StoryObj } from '@storybook/react-native';
import { EtListItem, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// Transform args for the new grouped API
const transformArgs = (args: any) => ({
  content: {
    title: args.title,
    subtitle: args.subtitle,
    description: args.description,
  },
  layout: {
    variant: args.variant,
    alignment: args.alignment,
    divider: args.divider,
    style: args.style,
    titleStyle: args.titleStyle,
    subtitleStyle: args.subtitleStyle,
    descriptionStyle: args.descriptionStyle,
    backgroundColor: args.backgroundColor,
  },
  interaction: {
    onPress: args.onPress,
    onLongPress: args.onLongPress,
    disabled: args.disabled,
  },
  selection: {
    selectable: args.selectable,
    selected: args.selected,
    onSelectionChange: args.onSelectionChange,
    checkboxPosition: args.checkboxPosition,
  },
  visual: {
    leftIcon: args.leftIcon,
    rightElement: args.rightElement,
    highlight: args.highlight,
  },
  accessibility: {
    testID: args.testID,
    accessibilityLabel: args.accessibilityLabel,
    accessibilityHint: args.accessibilityHint,
  },
});

// Wrapper component for backward compatibility in Storybook
const EtListItemWrapper = (props: any) => {
  return <EtListItem {...transformArgs(props)} />;
};

type Story = StoryObj<typeof EtListItemWrapper>;

const meta: Meta<typeof EtListItemWrapper> = {
  title: 'eToro-UI/Components/List/EtListItem',
  component: EtListItemWrapper,
  parameters: {
    notes: 'A versatile list item component that supports multiple layouts, states, and interactions.',
  },
  decorators: [
    (Story) => {
      const { colors } = useEtoroTheme();
      return (
        <View style={[styles.decorator]}>
          <Story />
        </View>
      );
    },
  ],
};

export default meta;

// Interactive story with controls
export const Interactive: Story = {
  render: (args) => (
    <View style={styles.showcase}>
      <EtListItemWrapper {...args} />
    </View>
  ),
  args: {
    title: 'Action',
    subtitle: 'Subtitle / Description',
    selectable: true,
    selected: false,
    variant: 'default',
    alignment: 'center',
    divider: true,
    highlight: false,
    disabled: false,
  },
  argTypes: {
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'comfortable', 'spacious'],
    },
    alignment: {
      control: 'select',
      options: ['top', 'center', 'bottom'],
    },
    selectable: {
      control: 'boolean',
    },
    selected: {
      control: 'boolean',
    },
    checkboxPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    divider: {
      control: 'boolean',
    },
    highlight: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

// Basic examples matching the provided images
export const BasicExamples: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Basic List Items
      </EtText>

      <View style={styles.listContainer}>
        {/* Simple action items */}
        <EtListItemWrapper title="Action" divider />

        <EtListItemWrapper title="Action" subtitle="Subtitle / Description" divider />

        {/* With left icon */}
        <EtListItemWrapper title="Action" leftIcon="notification" divider />

        <EtListItemWrapper title="Action" subtitle="Subtitle / Description" leftIcon="notification" />
      </View>
    </View>
  ),
  args: {},
};

// Selectable examples matching the checked state images
export const SelectableExamples: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState(['item2', 'item4']);

    const items = [
      { id: 'item1', title: 'Action' },
      { id: 'item2', title: 'Action', subtitle: 'Subtitle / Description' },
      { id: 'item3', title: 'Action', hasIcon: true },
      {
        id: 'item4',
        title: 'Action',
        subtitle: 'Subtitle / Description',
        hasIcon: true,
      },
    ];

    const toggleSelection = (itemId: string) => {
      setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Selectable List Items
        </EtText>

        <View style={styles.listContainer}>
          {items.map((item) => (
            <EtListItem
              key={item.id}
              content={{
                title: item.title,
                subtitle: item.subtitle,
              }}
              visual={{
                leftIcon: item.hasIcon ? 'notification' : undefined,
              }}
              selection={{
                selectable: true,
                selected: selectedItems.includes(item.id),
                onSelectionChange: () => toggleSelection(item.id),
                checkboxPosition: 'right',
              }}
              layout={{
                divider: true,
              }}
            />
          ))}
        </View>

        <View style={styles.summary}>
          <EtText variant="body-secondary-regular" style={styles.summaryText}>
            Selected: {selectedItems.length} items
          </EtText>
        </View>
      </View>
    );
  },
  args: {},
};

// Settings menu example
export const SettingsMenu: Story = {
  render: () => {
    const [toggleStates, setToggleStates] = useState({
      notifications: true,
      privacy: false,
      security: true,
      backup: false,
    });

    const toggleSetting = (key: keyof typeof toggleStates) => {
      setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Settings Menu
        </EtText>

        <View style={styles.listContainer}>
          <EtListItem
            content={{
              title: 'Notifications',
              subtitle: 'Push notifications and alerts',
            }}
            visual={{
              leftIcon: 'notification',
            }}
            selection={{
              selectable: true,
              selected: toggleStates.notifications,
              onSelectionChange: () => toggleSetting('notifications'),
            }}
            layout={{
              divider: true,
            }}
          />

          <EtListItem
            content={{
              title: 'Privacy Settings',
              subtitle: 'Control your data sharing preferences',
            }}
            visual={{
              leftIcon: 'privacy',
            }}
            selection={{
              selectable: true,
              selected: toggleStates.privacy,
              onSelectionChange: () => toggleSetting('privacy'),
            }}
            layout={{
              divider: true,
            }}
          />

          <EtListItem
            content={{
              title: 'Security',
              subtitle: 'Two-factor authentication and security',
            }}
            visual={{
              leftIcon: 'privacy',
            }}
            selection={{
              selectable: true,
              selected: toggleStates.security,
              onSelectionChange: () => toggleSetting('security'),
            }}
            layout={{
              divider: true,
            }}
          />

          <EtListItem
            content={{
              title: 'Backup & Sync',
              subtitle: 'Automatic data backup to cloud',
            }}
            visual={{
              leftIcon: 'wallet',
            }}
            selection={{
              selectable: true,
              selected: toggleStates.backup,
              onSelectionChange: () => toggleSetting('backup'),
            }}
            layout={{
              divider: true,
            }}
          />
        </View>
      </View>
    );
  },
  args: {},
};

// Layout variants showcase
export const LayoutVariants: Story = {
  render: () => (
    <ScrollView style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Layout Variants
      </EtText>

      {/* Compact */}
      <View style={styles.variantSection}>
        <EtText variant="body-base-semibold" style={styles.variantTitle}>
          Compact
        </EtText>
        <View style={styles.listContainer}>
          <EtListItem
            content={{
              title: 'Compact Item',
            }}
            layout={{
              variant: 'compact',
              divider: true,
            }}
          />
          <EtListItem
            content={{
              title: 'Compact with Subtitle',
              subtitle: 'Smaller spacing',
            }}
            layout={{
              variant: 'compact',
              divider: true,
            }}
          />
        </View>
      </View>

      {/* Default */}
      <View style={styles.variantSection}>
        <EtText variant="body-base-semibold" style={styles.variantTitle}>
          Default
        </EtText>
        <View style={styles.listContainer}>
          <EtListItem
            content={{
              title: 'Default Item',
            }}
            layout={{
              variant: 'default',
              divider: true,
            }}
          />
          <EtListItem
            content={{
              title: 'Default with Subtitle',
              subtitle: 'Standard spacing',
            }}
            layout={{
              variant: 'default',
              divider: true,
            }}
          />
        </View>
      </View>

      {/* Comfortable */}
      <View style={styles.variantSection}>
        <EtText variant="body-base-semibold" style={styles.variantTitle}>
          Comfortable
        </EtText>
        <View style={styles.listContainer}>
          <EtListItem
            content={{
              title: 'Comfortable Item',
            }}
            layout={{
              variant: 'comfortable',
              divider: true,
            }}
          />
          <EtListItem
            content={{
              title: 'Comfortable with Subtitle',
              subtitle: 'More breathing room',
            }}
            layout={{
              variant: 'comfortable',
              divider: true,
            }}
          />
        </View>
      </View>

      {/* Spacious */}
      <View style={styles.variantSection}>
        <EtText variant="body-base-semibold" style={styles.variantTitle}>
          Spacious
        </EtText>
        <View style={styles.listContainer}>
          <EtListItem
            content={{
              title: 'Spacious Item',
            }}
            layout={{
              variant: 'spacious',
              divider: true,
            }}
          />
          <EtListItem
            content={{
              title: 'Spacious with Subtitle',
              subtitle: 'Maximum spacing for touch targets',
            }}
            layout={{
              variant: 'spacious',
              divider: true,
            }}
          />
        </View>
      </View>
    </ScrollView>
  ),
  args: {},
};

// States showcase
export const States: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Different States
      </EtText>

      <View style={styles.listContainer}>
        <EtListItem
          content={{
            title: 'Normal State',
            subtitle: 'Regular interactive item',
          }}
          interaction={{
            onPress: () => alert('Pressed!'),
          }}
          layout={{
            divider: true,
          }}
        />

        <EtListItem
          content={{
            title: 'Highlighted State',
            subtitle: 'Visually emphasized',
          }}
          visual={{
            highlight: true,
          }}
          interaction={{
            onPress: () => alert('Highlighted pressed!'),
          }}
          layout={{
            divider: true,
          }}
        />

        <EtListItem
          content={{
            title: 'Selected State',
            subtitle: 'Currently selected',
          }}
          selection={{
            selectable: true,
            selected: true,
          }}
          layout={{
            divider: true,
          }}
        />

        <EtListItem
          content={{
            title: 'Disabled State',
            subtitle: 'Not interactive',
          }}
          interaction={{
            disabled: true,
          }}
          layout={{
            divider: true,
          }}
        />
      </View>
    </View>
  ),
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#6B7280',
  },
  summary: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryText: {
    // color: '#3B82F6',
    fontWeight: '600',
  },
  variantSection: {
    marginBottom: 24,
  },
  variantTitle: {
    marginBottom: 8,
    // color: '#374151',
  },
});
