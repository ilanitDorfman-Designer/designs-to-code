import { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../core/hooks';
import { X1, X2, X4, X6 } from '../../core/styles/spacing';
import { EtText } from '../../foundations/text/et-text';
import { EtToggleSwitch } from '../controls/toggle-switch/et-toggle-switch';
import type { IconName } from '../et-icon-v2';
import { EtIconV2 } from '../et-icon-v2';
import { EtListItem } from '../list/list-item-v2/et-list-item';

const DEFAULT_ACTION_ICON: IconName = 'nut';

/**
 * Optional row revealed beneath the toggle while the card is switched on.
 */
export interface EtSettingsToggleCardAction {
  /** Row label (also its default accessibility label). */
  label: string;
  /** Press handler for the revealed row. */
  onPress?: () => void;
  /** Leading icon; defaults to `nut`. */
  iconName?: IconName;
  /** Test id for the revealed row. */
  testID?: string;
}

/**
 * Props for {@link EtSettingsToggleCard}.
 */
export interface EtSettingsToggleCardProps {
  /** Primary heading shown next to the toggle. */
  title: string;
  /** Supporting copy shown under the heading. */
  subtitle: string;
  /** Controlled toggle state. */
  value: boolean;
  /** Fired when the toggle flips. */
  onValueChange: (value: boolean) => void;
  /** Revealed beneath the toggle only while `value` is true. */
  action?: EtSettingsToggleCardAction;
  /** Outer card style override (margins live with the caller, not the kit). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the card container. */
  accessibilityLabel?: string;
  /** Toggle accessibility label; defaults to `title`. */
  toggleAccessibilityLabel?: string;
  /** Toggle accessibility hint; defaults to `subtitle`. */
  toggleAccessibilityHint?: string;
  /** Test id for the toggle section row. */
  testID?: string;
  /** Test id for the toggle switch. */
  toggleTestID?: string;
}

/**
 * Settings card with a primary on/off toggle (title + subtitle) and an optional
 * action row that is revealed only while the toggle is on. Presentational and
 * theme-aware; all copy, values, and handlers are supplied by the caller.
 *
 * @example
 * ```tsx
 * <EtSettingsToggleCard
 *   title={t('settings.advancedView')}
 *   subtitle={t('settings.advancedViewSubtitle')}
 *   value={isAdvancedView}
 *   onValueChange={setAdvancedView}
 *   action={{ label: t('settings.manageColumns'), onPress: onManageColumns }}
 * />
 * ```
 */
function EtSettingsToggleCardBase({
  title,
  subtitle,
  value,
  onValueChange,
  action,
  style,
  accessibilityLabel,
  toggleAccessibilityLabel,
  toggleAccessibilityHint,
  testID,
  toggleTestID,
}: EtSettingsToggleCardProps) {
  const { colors } = useEtoroTheme();
  const showAction = value && action != null;

  return (
    <View style={[styles.card, { backgroundColor: colors.cardDefault }, style]} accessibilityRole="none" accessibilityLabel={accessibilityLabel}>
      <View style={styles.toggleSection} testID={testID}>
        <View style={styles.titleRow}>
          <EtText variant="heading-base" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
            {title}
          </EtText>
          <EtToggleSwitch
            value={value}
            onValueChange={onValueChange}
            size={'medium'}
            trackColor={{ false: colors.cardDefault }}
            forceNativeSync
            accessibilityLabel={toggleAccessibilityLabel ?? title}
            accessibilityHint={toggleAccessibilityHint ?? subtitle}
            accessibilityState={{ checked: value }}
            testID={toggleTestID}
          />
        </View>
        <EtText variant="body-secondary-regular" style={[styles.subtitle, { color: colors.textSecondaryNeutral }]}>
          {subtitle}
        </EtText>
      </View>
      {showAction && (
        <>
          <View style={[styles.divider, { backgroundColor: colors.dividerQuinary }]} />
          <EtListItem size="large" style={styles.actionChip} onPress={action.onPress} accessibilityLabel={action.label} testID={action.testID}>
            <EtListItem.Start>
              <View style={styles.actionInner}>
                <EtIconV2 name={action.iconName ?? DEFAULT_ACTION_ICON} size="sm" color={colors.textSecondaryNeutral} />
                <EtText variant="label-tertiary-semibold" style={{ color: colors.textSecondaryNeutral }}>
                  {action.label}
                </EtText>
              </View>
            </EtListItem.Start>
          </EtListItem>
        </>
      )}
    </View>
  );
}

EtSettingsToggleCardBase.displayName = 'EtSettingsToggleCard';

export const EtSettingsToggleCard = memo(EtSettingsToggleCardBase);

const styles = StyleSheet.create({
  card: {
    borderRadius: X4,
    overflow: 'hidden',
  },
  toggleSection: {
    padding: X6,
    gap: X1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: X2,
  },
  title: {
    flex: 1,
  },
  subtitle: {
    paddingTop: X2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: X6,
  },
  actionChip: {
    padding: X6,
  },
  actionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
});
