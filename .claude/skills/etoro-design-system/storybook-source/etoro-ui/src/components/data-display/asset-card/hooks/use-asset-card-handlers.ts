import * as Haptics from 'expo-haptics';

interface AssetCardHandlers {
  handlePress: () => void;
  handleClose: () => void;
  handleTrade: () => void;
  handleAdd: () => void;
}

interface UseAssetCardHandlersProps {
  onPress?: () => void;
  onClose?: () => void;
  onTrade?: () => void;
  onAdd?: () => void;
  haptics?: boolean;
}

/**
 * Custom hook to handle all asset card action handlers with haptic feedback
 */
export function useAssetCardHandlers({ onPress, onClose, onTrade, onAdd, haptics = true }: UseAssetCardHandlersProps): AssetCardHandlers {
  const triggerHaptic = () => {
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePress = () => {
    triggerHaptic();
    onPress?.();
  };

  const handleClose = () => {
    triggerHaptic();
    onClose?.();
  };

  const handleTrade = () => {
    triggerHaptic();
    onTrade?.();
  };

  const handleAdd = () => {
    triggerHaptic();
    onAdd?.();
  };

  return {
    handlePress,
    handleClose,
    handleTrade,
    handleAdd,
  };
}
