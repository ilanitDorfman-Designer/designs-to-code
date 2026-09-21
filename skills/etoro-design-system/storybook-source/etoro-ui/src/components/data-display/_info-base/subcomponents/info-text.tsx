import { Children, ReactNode } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import { X1 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import type { TextVariant } from '../../../../foundations/text/utils';
import type { InfoEllipsizeMode } from '../types';

export type InfoTextProps = {
  value: string | undefined;
  variant: TextVariant;
  ellipsizeMode: InfoEllipsizeMode;
  style?: StyleProp<TextStyle>;
  testID?: string;
  children?: ReactNode | ReactNode[];
};

/**
 * Shared text renderer for Title and Subtitle slots.
 * Renders null, EtText (data value), or View (children).
 */
export function InfoText({ value, variant, ellipsizeMode, style, testID, children }: InfoTextProps) {
  if (Children.count(children) > 0) {
    return <View style={styles.row}>{children}</View>;
  }
  if (value) {
    return (
      <EtText variant={variant} numberOfLines={1} ellipsizeMode={ellipsizeMode} style={[styles.text, style]} testID={testID}>
        {value}
      </EtText>
    );
  }
  return null;
}

const LINE_HEIGHT = 20;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X1,
  },
  text: {
    lineHeight: LINE_HEIGHT,
  },
});
