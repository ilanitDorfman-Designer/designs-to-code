import { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { EtText } from '../../../foundations/text';
import type { MediaCardSlotType, MediaCardTextSlotProps } from '../api';
import { useMediaCardContext } from '../api';

/**
 * EtMediaCard.Title — primary value / headline (small card price, etc.).
 * Strings use Num ML / Medium; element children (e.g. EtNumber) render as-is.
 * Stretches to the card width so nested `shrinkToFit` numbers can scale down.
 */
function MediaCardTitleComponent({ children, style, numberOfLines = 1, testID }: MediaCardTextSlotProps) {
  const { foregroundColor } = useMediaCardContext();

  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <EtText
        variant="num-ml-medium"
        numberOfLines={numberOfLines}
        shrinkToFit
        minimumFontScale={0.65}
        style={[styles.centered, styles.stretch, style, { color: foregroundColor }]}
        testID={testID}
      >
        {children}
      </EtText>
    );
  }

  return (
    <View style={[styles.stretch, style as StyleProp<ViewStyle>]} testID={testID}>
      {children}
    </View>
  );
}

export const MediaCardTitle = memo(MediaCardTitleComponent);
MediaCardTitle.displayName = 'EtMediaCard.Title';
(MediaCardTitle as typeof MediaCardTitle & { __SLOT_TYPE: MediaCardSlotType }).__SLOT_TYPE = 'title';

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
});
