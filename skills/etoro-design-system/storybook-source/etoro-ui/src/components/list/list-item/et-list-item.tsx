import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtListItemProps } from './api';
import { ListItemCheckbox, ListItemContent, ListItemIcon, ListItemRightElement } from './components';
import { useListItemHandlers } from './hooks';
import { getAlignmentStyles, getVariantStyles } from './utils';

/** @deprecated use EtListItemV2 instead */
export function EtListItem({
  content,
  layout = {
    variant: 'default',
    alignment: 'center',
    divider: false,
  },
  interaction = {
    disabled: false,
  },
  selection = {
    selectable: false,
    selected: false,
    checkboxPosition: 'right',
  },
  visual,
  accessibility,
}: EtListItemProps) {
  const { colors } = useEtoroTheme();
  const highlight = 'rgba(59, 130, 246, 0.05)';
  const pressedState = 'rgba(0, 0, 0, 0.05)';

  // Get style utilities
  const variantStyles = getVariantStyles(layout.variant);
  const alignmentStyles = getAlignmentStyles(layout.alignment);

  // Use custom hooks for handlers
  const { handlePress, handleLongPress, handleSelectionToggle } = useListItemHandlers({
    disabled: interaction.disabled,
    selectable: selection.selectable,
    selected: selection.selected,
    onPress: interaction.onPress,
    onLongPress: interaction.onLongPress,
    onSelectionChange: selection.onSelectionChange,
  });

  // Build container styles
  const containerStyle = [
    styles.container,
    { backgroundColor: 'transparent' },
    variantStyles,
    alignmentStyles,
    visual?.highlight && { backgroundColor: highlight },
    interaction.disabled && styles.disabled,
    layout.divider && [styles.withDivider, { borderBottomColor: colors.dividerTertiary }],
    layout.backgroundColor && { backgroundColor: layout.backgroundColor },
    layout.style,
  ];

  // Determine if we should use Pressable
  const Component = interaction.onPress || interaction.onLongPress ? Pressable : View;
  const pressableProps =
    interaction.onPress || interaction.onLongPress
      ? {
          onPress: handlePress,
          onLongPress: handleLongPress,
          android_ripple: { color: 'rgba(0, 0, 0, 0.1)' },
          style: ({ pressed }: { pressed: boolean }) => [containerStyle, pressed && { backgroundColor: pressedState }],
        }
      : { style: containerStyle };

  return (
    <Component
      {...pressableProps}
      accessibilityLabel={accessibility?.accessibilityLabel || content.title}
      accessibilityHint={accessibility?.accessibilityHint}
      accessibilityRole={interaction.onPress ? 'button' : 'text'}
      accessibilityState={{
        disabled: interaction.disabled,
        selected: selection.selectable ? selection.selected : undefined,
      }}
      testID={accessibility?.testID}
    >
      {/* Left elements */}
      {selection.selectable && selection.checkboxPosition === 'left' && (
        <ListItemCheckbox checked={selection?.selected || false} onPress={handleSelectionToggle} disabled={interaction.disabled} />
      )}

      {visual?.leftIcon && <ListItemIcon icon={visual.leftIcon} />}

      {/* Main content */}
      <ListItemContent
        title={content.title}
        subtitle={content.subtitle}
        description={content.description}
        disabled={interaction.disabled}
        titleStyle={layout.titleStyle}
        subtitleStyle={layout.subtitleStyle}
        descriptionStyle={layout.descriptionStyle}
      />

      {/* Right elements */}
      {visual?.rightElement && !selection.selectable && <ListItemRightElement element={visual.rightElement} disabled={interaction.disabled} />}

      {selection.selectable && selection.checkboxPosition === 'right' && (
        <ListItemCheckbox checked={selection?.selected || false} onPress={handleSelectionToggle} disabled={interaction.disabled} />
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  withDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  disabled: {
    opacity: 0.5,
  },
});
