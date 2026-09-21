import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { ErrorIcon } from '../../../../core/icons/error';
import { V } from '../../../../core/icons/v';
import { useToastInternalContext } from '../api/toast-context';
import type { ToastStatus } from '../api/types';
import { TOAST_DIMENSIONS } from '../api/types';

const ICON_SIZE = 10;

interface StatusConfig {
  Icon: ComponentType<{ size: number; color: string; hasFill?: boolean; fill?: string }>;
  backgroundColorKey: 'actionBrandText' | 'actionBrandVarText';
  iconColorKey: 'bgNeutralPrimary' | 'textBright';
}

const STATUS_CONFIG: Partial<Record<ToastStatus, StatusConfig>> = {
  success: {
    Icon: V,
    backgroundColorKey: 'actionBrandText',
    iconColorKey: 'bgNeutralPrimary',
  },
  error: {
    Icon: ErrorIcon,
    backgroundColorKey: 'actionBrandVarText',
    iconColorKey: 'textBright',
  },
};

/**
 * StatusMedia - Renders the status badge as the primary toast media (no underlying icon/image).
 * Supports 'success' (green circle + checkmark) and 'error' (red circle + exclamation).
 */
export function StatusMedia() {
  const { status } = useToastInternalContext();
  const { colors } = useEtoroTheme();

  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const { Icon, backgroundColorKey, iconColorKey } = config;

  return (
    <View style={[styles.container, { backgroundColor: colors[backgroundColorKey] }]}>
      <Icon size={ICON_SIZE} color={colors[iconColorKey]} hasFill fill={colors[iconColorKey]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TOAST_DIMENSIONS.BADGE_SIZE,
    height: TOAST_DIMENSIONS.BADGE_SIZE,
    borderRadius: TOAST_DIMENSIONS.BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
