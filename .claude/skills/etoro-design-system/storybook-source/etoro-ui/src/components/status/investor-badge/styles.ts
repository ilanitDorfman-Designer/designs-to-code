import { StyleSheet } from 'react-native';

import { INVESTOR_BADGE_GAP, INVESTOR_BADGE_LINE_HEIGHT } from './utils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: INVESTOR_BADGE_GAP,
  },
  label: {
    lineHeight: INVESTOR_BADGE_LINE_HEIGHT,
  },
});
