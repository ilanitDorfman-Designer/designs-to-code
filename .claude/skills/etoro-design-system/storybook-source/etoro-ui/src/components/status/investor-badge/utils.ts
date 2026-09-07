import PopularInvestorIcon from '../../../core/icons/popular-investor';
import ProInvestorIcon from '../../../core/icons/pro-investor';
import type { InvestorBadgeConfig, InvestorBadgeVariant } from './types';

export const DEFAULT_INVESTOR_BADGE_ICON_SIZE = 18;
export const INVESTOR_BADGE_GAP = 5;
export const INVESTOR_BADGE_LINE_HEIGHT = 20;

export const INVESTOR_BADGE_CONFIG: Record<InvestorBadgeVariant, InvestorBadgeConfig> = {
  pro: {
    Icon: ProInvestorIcon,
    label: 'Pro',
    textColor: '#F1C056',
  },
  popular: {
    Icon: PopularInvestorIcon,
    label: 'Popular',
    textColor: '#9EB1DD',
  },
};

export function getInvestorBadgeConfig(variant: InvestorBadgeVariant): InvestorBadgeConfig {
  return INVESTOR_BADGE_CONFIG[variant];
}
