import React from 'react';
import { View } from 'react-native';

import { EtText } from '../../../foundations/text/et-text';
import { styles } from './styles';
import type { InvestorBadgeProps, InvestorBadgeVariant } from './types';
import { DEFAULT_INVESTOR_BADGE_ICON_SIZE, getInvestorBadgeConfig } from './utils';

function InvestorBadge({
  variant,
  accessibilityLabel,
  iconSize = DEFAULT_INVESTOR_BADGE_ICON_SIZE,
  showLabel = true,
  style,
  testID,
}: InvestorBadgeProps & { variant: InvestorBadgeVariant }) {
  const { Icon, label, textColor } = getInvestorBadgeConfig(variant);

  return (
    <View style={[styles.container, style]} accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? label} testID={testID}>
      <Icon size={iconSize} />
      {showLabel && (
        <EtText
          variant="body-secondary-medium"
          style={[styles.label, { color: textColor }]}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          {label}
        </EtText>
      )}
    </View>
  );
}

function EtProInvestorBadgeBase(props: InvestorBadgeProps) {
  return <InvestorBadge variant="pro" {...props} />;
}

function EtPopularInvestorBadgeBase(props: InvestorBadgeProps) {
  return <InvestorBadge variant="popular" {...props} />;
}

export type { InvestorBadgeProps };
export const EtProInvestorBadge = React.memo(EtProInvestorBadgeBase);
EtProInvestorBadge.displayName = 'EtProInvestorBadge';
export const EtPopularInvestorBadge = React.memo(EtPopularInvestorBadgeBase);
EtPopularInvestorBadge.displayName = 'EtPopularInvestorBadge';
