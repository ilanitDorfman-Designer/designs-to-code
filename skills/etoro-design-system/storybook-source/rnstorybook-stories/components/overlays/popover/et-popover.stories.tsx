import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPopover, EtText } from 'etoro-ui';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtPopover.Root>;

const meta: Meta<typeof EtPopover.Root> = {
  title: 'eToro-UI/Components/Overlays/Popover',
  component: EtPopover.Root,
  decorators: [
    (Story) => (
      <ScrollView contentContainerStyle={styles.decorator}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;

/**
 * Simple tooltip with text only
 * Note: visible defaults to true, showDelay to 500ms, autoHideDelay to 3000ms
 * Setting autoHideDelay={0} to keep visible for static display
 * Arrow is shown by default - no need to add <EtPopover.Arrow />
 */
export const Simple: Story = {
  render: () => (
    <View style={styles.container}>
      <EtPopover.Root popoverDirection="below" arrowAlignment="start" showDelay={0} autoHideDelay={0}>
        <EtPopover.Target>
          <View style={styles.target} />
        </EtPopover.Target>
        <EtPopover.Content>
          <EtPopover.Text>Simple tooltip</EtPopover.Text>
        </EtPopover.Content>
      </EtPopover.Root>
    </View>
  ),
};

/**
 * Popover with title, text, and close button
 * Setting autoHideDelay={0} to keep visible for static display
 * Arrow is shown by default
 */
export const WithTitle: Story = {
  render: () => (
    <View style={styles.container}>
      <EtPopover.Root popoverDirection="below" arrowAlignment="start" showDelay={0} autoHideDelay={0}>
        <EtPopover.Target>
          <View style={styles.target} />
        </EtPopover.Target>
        <EtPopover.Content>
          <EtPopover.Title iconName="heart">Featured</EtPopover.Title>
          <EtPopover.Text>Check out this new feature</EtPopover.Text>
          <EtPopover.CloseButton />
        </EtPopover.Content>
      </EtPopover.Root>
    </View>
  ),
};

/**
 * Full popover with title, text, action button, and close
 * Setting autoHideDelay={0} to keep visible for static display
 * Arrow is shown by default
 */
export const WithAction: Story = {
  render: () => (
    <View style={styles.container}>
      <EtPopover.Root popoverDirection="below" arrowAlignment="start" showDelay={0} autoHideDelay={0}>
        <EtPopover.Target>
          <View style={styles.target} />
        </EtPopover.Target>
        <EtPopover.Content>
          <EtPopover.Title iconName="notification">New Feature</EtPopover.Title>
          <EtPopover.Text>Try our new trading tools</EtPopover.Text>
          <EtPopover.Button onPress={() => {}}>Learn More</EtPopover.Button>
          <EtPopover.CloseButton />
        </EtPopover.Content>
      </EtPopover.Root>
    </View>
  ),
};

/**
 * Interactive popover that can be toggled
 * Uses autoHideDelay={0} to disable auto-hide for manual control
 * Arrow is shown by default
 */
export const Interactive: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);

    return (
      <View style={styles.interactiveContainer}>
        <EtPopover.Root
          visible={visible}
          popoverDirection="above"
          arrowAlignment="start"
          showDelay={0}
          autoHideDelay={0}
          onClose={() => setVisible(false)}
        >
          <EtPopover.Target>
            <Pressable style={styles.button} onPress={() => setVisible(!visible)}>
              <EtText style={styles.buttonText}>{visible ? 'Hide' : 'Show'} Popover</EtText>
            </Pressable>
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Title>Hello!</EtPopover.Title>
            <EtPopover.Text>Tap outside to dismiss</EtPopover.Text>
            <EtPopover.CloseButton />
          </EtPopover.Content>
        </EtPopover.Root>
      </View>
    );
  },
};

/**
 * Popover with delayed show (500ms) - this is now the default behavior
 * showDelay={500} is the default, shown here explicitly for demonstration
 * Arrow is shown by default
 */
export const WithShowDelay: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);

    return (
      <View style={styles.interactiveContainer}>
        <EtPopover.Root
          visible={visible}
          showDelay={500}
          popoverDirection="above"
          arrowAlignment="start"
          autoHideDelay={0}
          onClose={() => setVisible(false)}
        >
          <EtPopover.Target>
            <Pressable style={styles.button} onPress={() => setVisible(!visible)}>
              <EtText style={styles.buttonText}>{visible ? 'Hide' : 'Show'} (500ms delay - default)</EtText>
            </Pressable>
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Title>Delayed!</EtPopover.Title>
            <EtPopover.Text>Appeared after 500ms (default)</EtPopover.Text>
            <EtPopover.CloseButton />
          </EtPopover.Content>
        </EtPopover.Root>
      </View>
    );
  },
};

/**
 * Popover that auto-hides after 3 seconds - this is now the default behavior
 * autoHideDelay={3000} is the default, shown here explicitly for demonstration
 * Arrow is shown by default
 */
export const WithAutoHide: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);

    return (
      <View style={styles.interactiveContainer}>
        <EtPopover.Root visible={visible} popoverDirection="above" arrowAlignment="start" onClose={() => setVisible(false)}>
          <EtPopover.Target>
            <Pressable style={styles.button} onPress={() => setVisible(true)}>
              <EtText style={styles.buttonText}>Show (auto-hides in 3s - default)</EtText>
            </Pressable>
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Title iconName="notification">Auto-hide</EtPopover.Title>
            <EtPopover.Text>Disappears in 3 seconds (default)</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>
      </View>
    );
  },
};

/**
 * Popover without arrow
 * Use hideArrow prop to hide the arrow
 */
export const WithoutArrow: Story = {
  render: () => (
    <View style={styles.container}>
      <EtPopover.Root popoverDirection="below" arrowAlignment="start" showDelay={0} autoHideDelay={0} hideArrow>
        <EtPopover.Target>
          <View style={styles.target} />
        </EtPopover.Target>
        <EtPopover.Content>
          <EtPopover.Title>No Arrow</EtPopover.Title>
          <EtPopover.Text>This popover has no arrow</EtPopover.Text>
          <EtPopover.CloseButton />
        </EtPopover.Content>
      </EtPopover.Root>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#F2F2F2',
  },
  container: {
    gap: 16,
  },
  interactiveContainer: {
    paddingTop: 120,
    alignItems: 'center',
  },
  target: {
    width: 60,
    height: 24,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
});
