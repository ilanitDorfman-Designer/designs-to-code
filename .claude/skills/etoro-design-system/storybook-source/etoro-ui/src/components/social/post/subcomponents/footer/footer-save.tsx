import React, { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X2, X6 } from '../../../../../core/styles';
import { EtIconV2 } from '../../../../et-icon-v2';
import { FooterSaveProps } from '../../api/types';
import { usePostContext } from '../../context';
import { useFooterActionStyle, useHapticHandler } from '../../hooks';

const ICON_SIZE = 'md' as const;

function FooterSaveBase({ onPress, isActive = false, testID }: FooterSaveProps) {
  const { haptics } = usePostContext();
  const { iconColor, iconVariant } = useFooterActionStyle(isActive);
  const handlePress = useHapticHandler(onPress, haptics);

  return (
    <Pressable
      style={styles.saveButton}
      onPress={onPress ? handlePress : undefined}
      disabled={!onPress}
      hitSlop={X2}
      testID={testID ? `${testID}-save` : undefined}
    >
      <EtIconV2 name="bookmark" size={ICON_SIZE} color={iconColor} variant={iconVariant} />
    </Pressable>
  );
}

FooterSaveBase.displayName = 'EtPost.Save';

export const FooterSave: FC<FooterSaveProps> = React.memo(FooterSaveBase);
FooterSave.displayName = 'EtPost.Save';

const styles = StyleSheet.create({
  saveButton: {
    paddingHorizontal: X6,
    paddingVertical: X2,
  },
});
