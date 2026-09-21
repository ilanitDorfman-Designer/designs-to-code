import { useCallback, useState } from 'react';

/**
 * Pure state hook for picker visibility and focus.
 * Contains no side-effects (haptics) or configuration guards (disabled).
 * Callers are responsible for gating calls behind disabled/readonly checks
 * and firing haptics before invoking openPicker.
 */
export function useDatepickerState() {
  const [isFocused, setIsFocused] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = useCallback(() => {
    setIsFocused(true);
    setIsPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setIsFocused(false);
    setIsPickerOpen(false);
  }, []);

  const togglePicker = useCallback(() => {
    setIsPickerOpen((prev) => {
      const next = !prev;
      setIsFocused(next);
      return next;
    });
  }, []);

  return {
    isFocused,
    isPickerOpen,
    openPicker,
    closePicker,
    togglePicker,
  };
}
