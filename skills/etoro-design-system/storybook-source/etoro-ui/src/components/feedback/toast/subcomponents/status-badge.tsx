import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { ErrorIcon } from '../../../../core/icons/error';
import Loader from '../../../../core/icons/loader';
import { V } from '../../../../core/icons/v';
import { useToastInternalContext } from '../api/toast-context';
import type { ToastStatus } from '../api/types';
import { TOAST_DIMENSIONS } from '../api/types';

/** Icon size within the badge */
const BADGE_ICON_SIZE = 10;

/**
 * Configuration for each status type
 */
interface StatusConfig {
  /** Icon component to render */
  Icon: ComponentType<{
    size: number;
    color: string;
    hasFill?: boolean;
    fill?: string;
  }>;
  /** Theme color key for background */
  backgroundColorKey: 'actionBrandText' | 'actionBrandVarText' | 'bgNeutralDark';
  /** Theme color key for icon */
  iconColorKey: 'bgNeutralPrimary' | 'textBright';
}

/**
 * Status configuration map - cleaner than switch statement
 * Maps each status to its visual configuration
 */
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
  disconnect: {
    Icon: ErrorIcon,
    backgroundColorKey: 'actionBrandVarText',
    iconColorKey: 'bgNeutralPrimary',
  },
  loader: {
    Icon: Loader,
    backgroundColorKey: 'bgNeutralDark',
    iconColorKey: 'textBright',
  },
  // 'neutral' is intentionally omitted - no badge shown
};

/**
 * StatusBadge - Displays a status indicator badge overlay on toast media
 *
 * Uses ToastInternalContext to get the current status, so it can be placed
 * anywhere within an EtToast without needing explicit props.
 *
 * Status mappings:
 * - success: Green checkmark
 * - error: Red error icon
 * - disconnect: Red error icon (same as error)
 * - loader: Animated spinner
 * - neutral: No badge shown
 */
export function StatusBadge() {
  const { status } = useToastInternalContext();
  const { colors } = useEtoroTheme();

  const config = STATUS_CONFIG[status];

  // Don't render anything for neutral status (or any unmapped status)
  if (!config) {
    return null;
  }

  const { Icon, backgroundColorKey, iconColorKey } = config;
  const backgroundColor = colors[backgroundColorKey];
  const iconColor = colors[iconColorKey];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon size={BADGE_ICON_SIZE} color={iconColor} hasFill fill={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: TOAST_DIMENSIONS.BADGE_OFFSET_TOP,
    end: TOAST_DIMENSIONS.BADGE_OFFSET_END,
    width: TOAST_DIMENSIONS.BADGE_SIZE,
    height: TOAST_DIMENSIONS.BADGE_SIZE,
    borderRadius: TOAST_DIMENSIONS.BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
});
