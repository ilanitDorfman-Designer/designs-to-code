import { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { EtText } from '../../../foundations/text';
import type { MediaCardSlotType, MediaCardTextSlotProps } from '../api';
import { useMediaCardContext } from '../api';

/**
 * EtMediaCard.Subtitle — secondary value (e.g. % change on small asset card).
 * Strings use Num XS / Medium; element children (e.g. EtNumber) render as-is.
 */
function MediaCardSubtitleComponent({ children, style, numberOfLines = 1, testID }: MediaCardTextSlotProps) {
  const { foregroundColor } = useMediaCardContext();

  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <EtText variant="num-xs-medium" numberOfLines={numberOfLines} style={[styles.centered, style, { color: foregroundColor }]} testID={testID}>
        {children}
      </EtText>
    );
  }

  return (
    <View style={style as StyleProp<ViewStyle>} testID={testID}>
      {children}
    </View>
  );
}

export const MediaCardSubtitle = memo(MediaCardSubtitleComponent);
MediaCardSubtitle.displayName = 'EtMediaCard.Subtitle';
(MediaCardSubtitle as typeof MediaCardSubtitle & { __SLOT_TYPE: MediaCardSlotType }).__SLOT_TYPE = 'subtitle';

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
});
