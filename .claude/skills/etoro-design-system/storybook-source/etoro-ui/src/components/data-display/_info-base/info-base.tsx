import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { X3 } from '../../../core/styles/spacing';
import type { InfoSlots } from './types';

export type InfoBaseLayoutProps = {
  slots: InfoSlots;
  layout: 'horizontal' | 'vertical';
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional testID for the text block (e.g. EtUserInfo uses "et-user-info-text-block"). */
  textBlockTestID?: string;
  /** Optional override for text block container (e.g. EtUserInfo uses flex:1, minWidth:0). */
  textBlockStyle?: StyleProp<ViewStyle>;
  /** Optional override for horizontal container (e.g. EtUserInfo uses gap: X3, flex: 1). */
  horizontalContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Shared layout for info components (EtAssetInfo, EtUserInfo).
 * Renders avatar + (title, subtitle) in horizontal or vertical layout.
 */
export function InfoBaseLayout({
  slots,
  layout,
  maxWidth,
  style,
  testID,
  textBlockTestID,
  textBlockStyle,
  horizontalContainerStyle,
}: InfoBaseLayoutProps) {
  const isHorizontal = layout === 'horizontal';

  const textBlockStyles = [styles.textBlock, maxWidth !== undefined ? { maxWidth } : undefined, textBlockStyle];

  const content = isHorizontal ? (
    <>
      {slots.avatar}
      <View style={textBlockStyles} testID={textBlockTestID}>
        {slots.title}
        {slots.subtitle}
      </View>
    </>
  ) : (
    <>
      {slots.avatar}
      {slots.title}
      {slots.subtitle}
    </>
  );

  return (
    <View
      style={[styles.container, isHorizontal ? [styles.horizontalContainer, horizontalContainerStyle] : styles.verticalContainer, style]}
      testID={testID}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: X3,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  textBlock: {},
});
