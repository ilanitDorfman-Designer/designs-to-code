import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { ModalBackdropConfig } from '../../api';

interface EtModalBackdropProps {
  config?: ModalBackdropConfig;
  closeOnBackdrop: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

/**
 * Backdrop component for EtModal.
 * Uses the same gradient overlay design as EtBottomSheetV2.
 */
export function EtModalBackdrop({ config, closeOnBackdrop, onPress, accessibilityLabel }: EtModalBackdropProps): React.JSX.Element | null {
  const { colors } = useEtoroTheme();

  if (config?.enabled === false) {
    return null;
  }

  const gradientColors = [colors.bgOverlayTop, colors.bgOverlayBottom] as const;
  const gradientLocations = [0.2, 1] as const;
  const opacity = config?.opacity ?? 1;

  const handlePress = () => {
    config?.onPress?.();
    if (closeOnBackdrop) {
      onPress();
    }
  };

  const a11yProps = closeOnBackdrop
    ? {
        accessibilityRole: 'button' as const,
        accessibilityLabel: accessibilityLabel ?? 'Close modal',
      }
    : {
        accessible: false,
        importantForAccessibility: 'no-hide-descendants' as const,
      };

  return (
    <Pressable style={[styles.backdrop, { opacity }]} onPress={handlePress} {...a11yProps}>
      <LinearGradient colors={gradientColors} locations={gradientLocations} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient} />
    </Pressable>
  );
}

EtModalBackdrop.displayName = 'EtModal.Backdrop';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
