interface UseListItemHandlersProps {
  disabled?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onSelectionChange?: (_selected: boolean) => void;
}

export function useListItemHandlers({
  disabled = false,
  selectable = false,
  selected = false,
  onPress,
  onLongPress,
  onSelectionChange,
}: UseListItemHandlersProps) {
  const handlePress = () => {
    if (disabled) return;

    if (selectable && onSelectionChange) {
      onSelectionChange(!selected);
    }

    onPress?.();
  };

  const handleLongPress = () => {
    if (disabled) return;
    onLongPress?.();
  };

  const handleSelectionToggle = () => {
    if (disabled) return;
    onSelectionChange?.(!selected);
  };

  return {
    handlePress,
    handleLongPress,
    handleSelectionToggle,
  };
}
