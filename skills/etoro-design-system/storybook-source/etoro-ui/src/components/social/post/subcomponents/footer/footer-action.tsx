import { formatCompactNumber } from '@etoro/common/utils';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { X1, X2 } from '../../../../../core/styles';
import { EtText } from '../../../../../foundations/text';
import { EtIconV2 } from '../../../../et-icon-v2';
import { usePostContext } from '../../context';
import { useFooterActionStyle, useHapticHandler } from '../../hooks';

const ICON_SIZE = 'md' as const;

export interface FooterActionProps {
  iconName: string;
  count: number;
  onPress?: () => void;
  onCountPress?: () => void;
  isActive?: boolean;
  testID?: string;
  /** Suffix appended to testID for icon (e.g. "like-icon") and count (e.g. "like-count") */
  iconTestIDSuffix: string;
  countTestIDSuffix: string;
}

/**
 * Shared internal component for footer actions that display an icon + count.
 * Not exported from the library — used by FooterLikes, FooterComments, FooterShares.
 */
export function FooterAction({
  iconName,
  count,
  onPress,
  onCountPress,
  isActive = false,
  testID,
  iconTestIDSuffix,
  countTestIDSuffix,
}: FooterActionProps) {
  const { haptics } = usePostContext();
  const { iconColor, iconVariant, textColor } = useFooterActionStyle(isActive);
  const handlePress = useHapticHandler(onPress, haptics);

  const resolvedCountPress = onCountPress ?? (onPress ? handlePress : undefined);
  const textStyle = useMemo(() => ({ color: textColor }), [textColor]);

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.iconButton}
        onPress={onPress ? handlePress : undefined}
        disabled={!onPress}
        hitSlop={X2}
        testID={testID ? `${testID}-${iconTestIDSuffix}` : undefined}
      >
        <EtIconV2 name={iconName} size={ICON_SIZE} color={iconColor} variant={iconVariant} />
      </Pressable>

      <Pressable
        style={styles.countButton}
        onPress={resolvedCountPress}
        disabled={!resolvedCountPress}
        hitSlop={X2}
        testID={testID ? `${testID}-${countTestIDSuffix}` : undefined}
      >
        <EtText variant="num-s" style={textStyle}>
          {formatCompactNumber(count)}
        </EtText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: X2,
    paddingRight: X1,
  },
  countButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: X2,
    paddingRight: X2,
  },
});
