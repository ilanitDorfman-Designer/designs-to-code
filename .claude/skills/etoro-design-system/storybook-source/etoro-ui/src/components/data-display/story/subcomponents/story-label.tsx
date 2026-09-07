import { StyleSheet } from 'react-native';

import { EtText } from '../../../../foundations/text/et-text';
import type { StoryLabelProps } from '../api/types';

/**
 * EtStory.Label - Text label subcomponent for EtStory
 */
export function StoryLabel({ children, style }: StoryLabelProps) {
  return (
    <EtText variant="num-xxs" weight="semiBold" style={[styles.label, style]} numberOfLines={1}>
      {children}
    </EtText>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
});

StoryLabel.displayName = 'EtStory.Label';
