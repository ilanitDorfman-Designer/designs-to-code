import { memo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtButton } from '../../button/et-button';
import { EtIconV2 } from '../../et-icon-v2';
import { type AlertBannerSeverity, createAlertBannerStyles, getAlertBannerSeverityStyles } from './et-alert-banner.styles';

export interface EtAlertBannerProps {
  severity: AlertBannerSeverity;
  icon: string;
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

function EtAlertBannerBase({
  severity,
  icon,
  title,
  description,
  ctaLabel,
  onCtaPress,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: EtAlertBannerProps) {
  const { colors } = useEtoroTheme();
  const styles = createAlertBannerStyles();
  const severityStyles = getAlertBannerSeverityStyles(severity, colors);

  const content = (
    <View
      style={[styles.container, { backgroundColor: severityStyles.backgroundColor }, style]}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel ?? [title, description].filter(Boolean).join('. ')}
      testID={testID}
    >
      <View>
        <View style={styles.titleRow}>
          <EtIconV2 name={icon} size="md" color={severityStyles.iconColor} accessible={false} />
          <EtText variant="label-primary-semibold" style={{ color: severityStyles.textColor }} testID={testID ? `${testID}-title` : undefined}>
            {title}
          </EtText>
        </View>
        <EtText
          variant="body-secondary-regular"
          style={[styles.description, { color: severityStyles.textColor }]}
          testID={testID ? `${testID}-description` : undefined}
        >
          {description}
        </EtText>
      </View>
      {ctaLabel ? (
        <EtButton
          style={styles.cta}
          onPress={onCtaPress}
          variant="info-filled"
          size="small"
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
          testID={testID ? `${testID}-cta` : undefined}
        >
          <EtButton.Label>{ctaLabel}</EtButton.Label>
        </EtButton>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} testID={testID ? `${testID}-pressable` : undefined}>
      {content}
    </Pressable>
  );
}

export const EtAlertBanner = memo(EtAlertBannerBase);
EtAlertBanner.displayName = 'EtAlertBanner';
