import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

export interface WizardStepProps {
  children: ReactNode;
  /** Background image source (fills the entire wizard behind all layers) */
  backgroundImage?: ImageSourcePropType;
  /** Background video URL (fills the entire wizard behind all layers, plays once silently) */
  backgroundVideo?: string;
  /** Override the segment animation duration for this step (ms) */
  stepDuration?: number;
  /** Vertical alignment of step content. Default: 'top' */
  contentPosition?: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtWizard.Step - Defines content for a single step.
 * Rendered conditionally by the parent based on the current step index.
 *
 * Background images/videos declared here are rendered at the wizard root
 * level so they fill the full screen (behind the topbar and footer).
 *
 * Use stepDuration to sync the segment animation with a video's length.
 */
export function WizardStep({ children, contentPosition, style, testID }: WizardStepProps) {
  return (
    <View style={[styles.container, contentPosition === 'bottom' && styles.contentBottom, style]} testID={testID}>
      {children}
    </View>
  );
}

WizardStep.displayName = 'EtWizard.Step';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentBottom: {
    justifyContent: 'flex-end',
  },
});
