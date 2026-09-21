import type { NetworkQuality } from '@etoro/common/infra/network-status';
import { BlurView } from 'expo-blur';
import { memo } from 'react';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { EtoroIcon } from '../../../foundations/icon-assets';
import { EtText } from '../../../foundations/text';
import { styles } from './network-status-indicator.styles';
import type { NetworkStatusLabels } from './network-status-indicator.types';
import { useNetworkStatusIndicator } from './use-network-status-indicator';

interface NetworkStatusIndicatorProps {
  /** Current network quality from useNetworkStatus hook */
  quality: NetworkQuality;
  /** Localized labels supplied by the app layer */
  labels: NetworkStatusLabels;
}

/**
 * NetworkStatusIndicator - A floating badge that shows network connectivity status.
 *
 * Displays a centered pill-shaped badge at the top of the screen when the network is
 * offline or slow. Shows an icon and descriptive text. Automatically hides when
 * connection is restored.
 *
 * The Animated.View is always mounted to prevent race conditions with
 * Reanimated's worklet system during mount/unmount cycles.
 *
 * @example
 * ```tsx
 * const { state } = useNetworkStatus();
 * const { t } = useTranslation('uiKit');
 * return (
 *   <NetworkStatusIndicator
 *     quality={state.quality}
 *     labels={{
 *       connectionLost: t('networkStatus.connectionLost'),
 *       slowConnection: t('networkStatus.slowConnection'),
 *       a11yNoConnection: t('networkStatus.a11yNoConnection'),
 *       a11ySlowConnection: t('networkStatus.a11ySlowConnection'),
 *     }}
 *   />
 * );
 * ```
 */
function NetworkStatusIndicatorBase({ quality, labels }: NetworkStatusIndicatorProps) {
  const { colors } = useEtoroTheme();
  const insets = useSafeAreaInsets();
  const { animatedStyle } = useNetworkStatusIndicator({ quality });

  const isOffline = quality === 'offline';
  const iconName = isOffline ? 'wifiOff' : 'wifiSlow';
  const label = isOffline ? labels.connectionLost : labels.slowConnection;
  const accessibilityLabel = isOffline ? labels.a11yNoConnection : labels.a11ySlowConnection;

  return (
    <Animated.View
      style={[styles.wrapper, { top: insets.top + 8 }, animatedStyle]}
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel}
    >
      <BlurView intensity={8} tint="light" style={[styles.container, { backgroundColor: colors.verdictNegative600Opacity15 }]}>
        <EtoroIcon icon={{ iconName }} appearance={{ color: colors.statusNegative, size: 16 }} />
        <EtText variant="body-tiny-medium" style={{ color: colors.statusNegative }}>
          {label}
        </EtText>
      </BlurView>
    </Animated.View>
  );
}

NetworkStatusIndicatorBase.displayName = 'NetworkStatusIndicator';

export const NetworkStatusIndicator = memo(NetworkStatusIndicatorBase);
